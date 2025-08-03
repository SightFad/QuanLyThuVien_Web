/**
 * API Service - Centralized API calls
 */
import { config } from '../config';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseURL = config.api.baseUrl;
    this.timeout = config.api.timeout;
    this.retryAttempts = config.api.retryAttempts;
  }

  // Get auth token
  getAuthToken() {
    return localStorage.getItem(config.security.tokenKey);
  }

  // Set auth token
  setAuthToken(token) {
    localStorage.setItem(config.security.tokenKey, token);
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem(config.security.tokenKey);
    localStorage.removeItem(config.security.refreshTokenKey);
  }

  // Create request headers
  createHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle response
  async handleResponse(response) {
    if (!response.ok) {
      const error = await this.handleError(response);
      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return response.text();
  }

  // Handle errors
  async handleError(response) {
    let errorMessage = ERROR_MESSAGES.GENERIC_ERROR;
    let errorData = null;

    try {
      errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Response is not JSON
    }

    switch (response.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        this.removeAuthToken();
        errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
        // Redirect to login if needed
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      case HTTP_STATUS.FORBIDDEN:
        errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
        break;
      case HTTP_STATUS.NOT_FOUND:
        errorMessage = ERROR_MESSAGES.NOT_FOUND;
        break;
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        errorMessage = ERROR_MESSAGES.VALIDATION_ERROR;
        break;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
        break;
      default:
        if (!navigator.onLine) {
          errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
        }
    }

    return {
      status: response.status,
      message: errorMessage,
      data: errorData,
    };
  }

  // Create AbortController for timeout
  createAbortController() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    return {
      controller,
      cleanup: () => clearTimeout(timeoutId),
    };
  }

  // Base request method with retry logic
  async request(url, options = {}, retryCount = 0) {
    const { controller, cleanup } = this.createAbortController();
    
    try {
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: this.createHeaders(options.headers),
        signal: controller.signal,
      });

      cleanup();
      return await this.handleResponse(response);
    } catch (error) {
      cleanup();
      
      // Retry on network errors
      if (retryCount < this.retryAttempts && 
          (error.name === 'AbortError' || error.name === 'TypeError')) {
        console.warn(`Request failed, retrying... (${retryCount + 1}/${this.retryAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.request(url, options, retryCount + 1);
      }

      throw error;
    }
  }

  // GET request
  async get(url, params = {}) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.request(fullUrl, {
      method: 'GET',
    });
  }

  // POST request
  async post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(url, data = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(url, data = {}) {
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(url) {
    return this.request(url, {
      method: 'DELETE',
    });
  }

  // Upload file
  async upload(url, file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    const { controller, cleanup } = this.createAbortController();

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: formData,
        signal: controller.signal,
      });

      cleanup();
      return await this.handleResponse(response);
    } catch (error) {
      cleanup();
      throw error;
    }
  }

  // Download file
  async download(url, filename) {
    try {
      const response = await this.request(url, {
        method: 'GET',
      });

      const blob = new Blob([response]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;