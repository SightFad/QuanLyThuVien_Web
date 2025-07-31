/**
 * Book Service - API calls related to books
 */
import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

class BookService {
  // Get all books
  async getBooks(params = {}) {
    try {
      const data = await apiService.get(API_ENDPOINTS.BOOKS, params);
      return this.mapBooksFromApi(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  // Get book by ID
  async getBookById(id) {
    try {
      const data = await apiService.get(`${API_ENDPOINTS.BOOKS}/${id}`);
      return this.mapBookFromApi(data);
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  // Create new book
  async createBook(bookData) {
    try {
      const mappedData = this.mapBookToApi(bookData);
      const data = await apiService.post(API_ENDPOINTS.BOOKS, mappedData);
      return this.mapBookFromApi(data);
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  // Update book
  async updateBook(id, bookData) {
    try {
      const mappedData = this.mapBookToApi(bookData);
      const data = await apiService.put(`${API_ENDPOINTS.BOOKS}/${id}`, mappedData);
      return this.mapBookFromApi(data);
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  // Delete book
  async deleteBook(id) {
    try {
      await apiService.delete(`${API_ENDPOINTS.BOOKS}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }

  // Search books
  async searchBooks(query, filters = {}) {
    try {
      const params = {
        q: query,
        ...filters,
      };
      const data = await apiService.get(`${API_ENDPOINTS.BOOKS}/search`, params);
      return this.mapBooksFromApi(data);
    } catch (error) {
      console.error('Error searching books:', error);
      throw error;
    }
  }

  // Get book categories
  async getCategories() {
    try {
      const data = await apiService.get(`${API_ENDPOINTS.BOOKS}/categories`);
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get books by category
  async getBooksByCategory(category, params = {}) {
    try {
      const data = await apiService.get(`${API_ENDPOINTS.BOOKS}/category/${category}`, params);
      return this.mapBooksFromApi(data);
    } catch (error) {
      console.error('Error fetching books by category:', error);
      throw error;
    }
  }

  // Get popular books
  async getPopularBooks(limit = 10) {
    try {
      const data = await apiService.get(`${API_ENDPOINTS.BOOKS}/popular`, { limit });
      return this.mapBooksFromApi(data);
    } catch (error) {
      console.error('Error fetching popular books:', error);
      throw error;
    }
  }

  // Get recently added books
  async getRecentBooks(limit = 10) {
    try {
      const data = await apiService.get(`${API_ENDPOINTS.BOOKS}/recent`, { limit });
      return this.mapBooksFromApi(data);
    } catch (error) {
      console.error('Error fetching recent books:', error);
      throw error;
    }
  }

  // Upload book cover
  async uploadCover(bookId, file) {
    try {
      const data = await apiService.upload(`${API_ENDPOINTS.BOOKS}/${bookId}/cover`, file);
      return data;
    } catch (error) {
      console.error('Error uploading book cover:', error);
      throw error;
    }
  }

  // Import books from CSV/Excel
  async importBooks(file) {
    try {
      const data = await apiService.upload(`${API_ENDPOINTS.BOOKS}/import`, file);
      return data;
    } catch (error) {
      console.error('Error importing books:', error);
      throw error;
    }
  }

  // Export books to CSV/Excel
  async exportBooks(format = 'csv', filters = {}) {
    try {
      const params = {
        format,
        ...filters,
      };
      await apiService.download(`${API_ENDPOINTS.BOOKS}/export`, `books.${format}`, params);
    } catch (error) {
      console.error('Error exporting books:', error);
      throw error;
    }
  }

  // Map book data from API format to frontend format
  mapBookFromApi(apiBook) {
    return {
      id: apiBook.maSach,
      title: apiBook.tenSach,
      author: apiBook.tacGia,
      isbn: apiBook.isbn,
      category: apiBook.theLoai,
      publisher: apiBook.nhaXuatBan,
      publishYear: apiBook.namXB,
      quantity: apiBook.soLuong,
      available: apiBook.soLuongConLai,
      location: apiBook.viTriLuuTru,
      price: apiBook.giaTien,
      description: apiBook.moTa,
      coverImage: apiBook.anhBia,
      createdAt: apiBook.ngayTao,
      updatedAt: apiBook.ngayCapNhat,
    };
  }

  // Map multiple books from API
  mapBooksFromApi(apiBooks) {
    if (!Array.isArray(apiBooks)) {
      return [];
    }
    return apiBooks.map(book => this.mapBookFromApi(book));
  }

  // Map book data from frontend format to API format
  mapBookToApi(frontendBook) {
    return {
      maSach: frontendBook.id,
      tenSach: frontendBook.title,
      tacGia: frontendBook.author,
      isbn: frontendBook.isbn,
      theLoai: frontendBook.category,
      nhaXuatBan: frontendBook.publisher,
      namXB: frontendBook.publishYear,
      soLuong: frontendBook.quantity,
      soLuongConLai: frontendBook.available,
      viTriLuuTru: frontendBook.location,
      giaTien: frontendBook.price,
      moTa: frontendBook.description,
      anhBia: frontendBook.coverImage,
    };
  }
}

// Create singleton instance
const bookService = new BookService();

export default bookService;