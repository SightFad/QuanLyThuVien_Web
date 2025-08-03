import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaBook, FaFilter } from 'react-icons/fa';
import { authenticatedRequest } from '../config/api';
import BookCard from '../components/BookCard';
import './BookManagement.css';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

<<<<<<< HEAD
  const apiUrl =
    "https://libraryapi20250714182231-dvf7buahgwdmcmg7.southeastasia-01.azurewebsites.net/api/Sach";
=======
  const categories = ['Tất cả', 'Kỹ năng sống', 'Tiểu thuyết', 'Công nghệ', 'Khoa học', 'Văn học'];
  const statuses = ['Tất cả', 'Có sẵn', 'Đã mượn', 'Đã đặt', 'Hư hỏng'];
>>>>>>> frontend

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, selectedCategory, selectedStatus, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await authenticatedRequest('/api/Book');
      
      if (data) {
        setBooks(data);
        setFilteredBooks(data);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Không thể tải danh sách sách. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.tenSach?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.tacGia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.theLoai?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(book => book.theLoai === selectedCategory);
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== 'Tất cả') {
      filtered = filtered.filter(book => book.trangThai === selectedStatus);
    }

    setFilteredBooks(filtered);
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      return;
    }

    try {
      await authenticatedRequest(`/api/Book/${bookId}`, { method: 'DELETE' });
      fetchBooks();
    } catch (err) {
      alert('Không thể xóa sách');
    }
  };

  const handleBorrowBook = async (book) => {
    try {
      await authenticatedRequest(`/api/Book/${book.maSach}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...book,
          trangThai: 'Đã mượn'
        })
      });
      fetchBooks();
    } catch (err) {
      alert('Không thể mượn sách');
    }
  };

  const handleReserveBook = async (book) => {
    try {
      await authenticatedRequest(`/api/Book/${book.maSach}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...book,
          trangThai: 'Đã đặt'
        })
      });
      fetchBooks();
    } catch (err) {
      alert('Không thể đặt trước sách');
    }
  };

  const handleViewDetails = (book) => {
    // Implement book details modal
    console.log('View details:', book);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="book-management">
      <div className="page-header">
        <h1 className="page-title">Quản lý sách</h1>
        <p className="page-subtitle">Quản lý kho sách và thông tin sách</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="page-actions">
        <div className="search-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button className="btn btn-primary" onClick={handleAddBook}>
          <FaPlus /> Thêm sách
        </button>
      </div>

      <div className="books-grid">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.maSach}
            book={{
              id: book.maSach,
              title: book.tenSach,
              author: book.tacGia,
              category: book.theLoai,
              shelf: book.keSach,
              status: book.trangThai,
              coverImage: book.anhBia,
              description: book.moTa,
              publishedYear: book.namXuatBan,
              isbn: book.isbn
            }}
            onBorrow={handleBorrowBook}
            onReserve={handleReserveBook}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && !loading && (
        <div className="empty-state">
          <FaBook className="empty-icon" />
          <h3>Không có sách nào</h3>
          <p>Bắt đầu bằng cách thêm sách mới</p>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
