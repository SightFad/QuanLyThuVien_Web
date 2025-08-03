import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook để quản lý API calls
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @param {boolean} immediate - Có gọi API ngay lập tức không
 * @returns {object} { data, loading, error, refetch }
 */
export const useApi = (url, options = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

/**
 * Custom hook để quản lý POST/PUT/DELETE requests
 * @param {string} url - API endpoint
 * @param {object} defaultOptions - Default fetch options
 * @returns {object} { mutate, loading, error, data }
 */
export const useMutation = (url, defaultOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (payload, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...defaultOptions.headers,
          ...options.headers,
        },
        body: JSON.stringify(payload),
        ...defaultOptions,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Mutation Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, defaultOptions]);

  return {
    mutate,
    loading,
    error,
    data,
  };
};