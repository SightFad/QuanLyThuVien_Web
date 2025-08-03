/**
 * Book Service - API calls related to books
 */
import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

class BookService {
  // Get all books
  async getBooks(params = {}) {
    try {
      const data = await apiService.get(API_ENDPOINTS.BOOKS_ENDPOINTS.LIST, params);
      return this.mapBooksFromApi(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  // Get all books (alias for getBooks)
  async getAllBooks(params = {}) {
    return this.getBooks(params);
  }

  // Create reservation
  async createReservation(reservationData) {
    try {
      const data = await apiService.post('/api/Reservation', reservationData);
      return data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  // Get book by ID
  async getBookById(id) {
    try {
      const data = await apiService.get(`${API_ENDPOINTS.BOOKS_ENDPOINTS.LIST}/${id}`);
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
      const data = await apiService.post(API_ENDPOINTS.BOOKS_ENDPOINTS.CREATE, mappedData);
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
      const data = await apiService.put(`${API_ENDPOINTS.BOOKS_ENDPOINTS.LIST}/${id}`, mappedData);
      return this.mapBookFromApi(data);
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  // Delete book
  async deleteBook(id) {
    try {
      await apiService.delete(`${API_ENDPOINTS.BOOKS_ENDPOINTS.LIST}/${id}`);
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
      const data = await apiService.get(API_ENDPOINTS.BOOKS_ENDPOINTS.SEARCH, params);
      return this.mapBooksFromApi(data);
    } catch (error) {
      console.error('Error searching books:', error);
      throw error;
    }
  }

  // Get book categories
  async getCategories() {
    try {
      const data = await apiService.get(API_ENDPOINTS.BOOKS_ENDPOINTS.CATEGORIES);
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get books by category
  async getBooksByCategory(category, params = {}) {
    try {
      const data = await apiService.get(`${API_ENDPOINTS.BOOKS_ENDPOINTS.LIST}/category/${category}`, params);
      return this.mapBooksFromApi(data);
    } catch (error) {
      console.error('Error fetching books by category:', error);
      throw error;
    }
  }

  // Get popular books
  async getPopularBooks(limit = 10) {
    try {
      const data = await apiService.get(API_ENDPOINTS.BOOKS_ENDPOINTS.POPULAR, { limit });
      return this.mapBooksFromApi(data);
    } catch (error) {
      console.error('Error fetching popular books:', error);
      throw error;
    }
  }

  // Get recently added books
  async getRecentBooks(limit = 10) {
    try {
      const data = await apiService.get(API_ENDPOINTS.BOOKS_ENDPOINTS.RECENT, { limit });
      return this.mapBooksFromApi(data);
    } catch (error) {
      console.error('Error fetching recent books:', error);
      throw error;
    }
  }

  // Upload book cover
  async uploadCover(bookId, file) {
    try {
      const data = await apiService.upload(`${API_ENDPOINTS.BOOKS_ENDPOINTS.LIST}/${bookId}/cover`, file);
      return data;
    } catch (error) {
      console.error('Error uploading book cover:', error);
      throw error;
    }
  }

  // Import books from CSV/Excel
  async importBooks(file) {
    try {
      const data = await apiService.upload(API_ENDPOINTS.BOOKS_ENDPOINTS.IMPORT, file);
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
      await apiService.download(API_ENDPOINTS.BOOKS_ENDPOINTS.EXPORT, `books.${format}`, params);
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
      shelf: apiBook.keSach,
      price: apiBook.giaTien || apiBook.giaSach, // Support both field names
      description: apiBook.moTa,
      coverImage: apiBook.anhBia,
      status: apiBook.trangThai,
      entryDate: apiBook.ngayNhap,
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
      viTriLuuTru: frontendBook.location,
      keSach: frontendBook.shelf,
      giaSach: frontendBook.price,
      giaTien: frontendBook.price, // Send both for backend compatibility
      moTa: frontendBook.description,
      anhBia: frontendBook.coverImage,
      trangThai: frontendBook.status,
      ngayNhap: frontendBook.entryDate,
      ngayCapNhat: frontendBook.updatedAt ? new Date(frontendBook.updatedAt) : new Date(),
    };
  }
}

// Create singleton instance
const bookService = new BookService();

export default bookService;