import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBook,
  FaFilter,
} from "react-icons/fa";
import { apiRequest, authenticatedRequest } from "../config/api";
import BookManagementCard from "../components/BookManagementCard";
import BookModal from "../components/BookModal";
import "./BookManagement.css";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "Tất cả",
    "Kỹ năng sống",
    "Tiểu thuyết",
    "Công nghệ",
    "Khoa học",
    "Văn học",
  ];
  const statuses = ["Tất cả", "Có sẵn", "Đã mượn", "Đã đặt", "Hư hỏng"];

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, selectedCategory, selectedStatus, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/api/Sach");
      const mappedReaders = data.map((books) => ({
        id: books.maSach,
        title: books.tenSach,
        author: books.tacGia,
        isbn: books.isbn,
        category: books.theLoai,
        publisher: books.nhaXuatBan,
        publishYear: books.namXB,
        quantity: books.soLuong,
        available: books.soLuongConLai,
        location: books.viTriLuuTru || books.keSach,
        coverImage: books.anhBia,
      }));

  
        setBooks(mappedReaders);
        setFilteredBooks(mappedReaders);
      
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Không thể tải danh sách sách. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.TenSach?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.TacGia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.TheLoai?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "Tất cả") {
      filtered = filtered.filter((book) => book.TheLoai === selectedCategory);
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== "Tất cả") {
      filtered = filtered.filter((book) => book.TrangThai === selectedStatus);
    }

    setFilteredBooks(filtered);
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleEditBook = (book) => {
    setEditingBook({
      MaSach: book.id,
      TenSach: book.title,
      TacGia: book.author,
      ISBN: book.isbn,
      TheLoai: book.category,
      NhaXuatBan: book.publisher,
      NamXuatBan: book.publishedYear,
      SoLuong: book.quantity,
      SoLuongConLai: book.available,
      ViTriLuuTru: book.location,
      AnhBia: book.coverImage,
      MoTa: book.description,
      KeSach: book.shelf,
    });
    setShowModal(true);
  };

  const handleSaveBook = async (bookData) => {
    try {
      if (editingBook) {
        // Update existing book
        await authenticatedRequest(`/api/Sach/${editingBook.maSach}`, {
          method: "PUT",
          body: JSON.stringify({
            TenSach: bookData.title,
            TacGia: bookData.author,
            ISBN: bookData.isbn,
            TheLoai: bookData.category,
            NhaXuatBan: bookData.publisher,
            NamXuatBan: bookData.publishYear,
            SoLuong: bookData.quantity,
            ViTriLuuTru: bookData.location,
            AnhBia: bookData.coverImage,
            MoTa: bookData.description || "",
            KeSach: bookData.location || "", // Use location as shelf
            TrangThai: "Có sẵn", // Default status
          }),
        });
      } else {
        // Create new book
        await authenticatedRequest("/api/Sach", {
          method: "POST",
          body: JSON.stringify({
            TenSach: bookData.title,
            TacGia: bookData.author,
            ISBN: bookData.isbn,
            TheLoai: bookData.category,
            NhaXuatBan: bookData.publisher,
            NamXuatBan: bookData.publishYear,
            SoLuong: bookData.quantity,
            ViTriLuuTru: bookData.location,
            AnhBia: bookData.coverImage,
            MoTa: bookData.description || "",
            KeSach: bookData.location || "", // Use location as shelf
            TrangThai: "Có sẵn", // Default status
          }),
        });
      }

      setShowModal(false);
      setEditingBook(null);
      fetchBooks(); // Refresh the list
    } catch (err) {
      console.error("Error saving book:", err);
      alert("Không thể lưu sách. Vui lòng thử lại.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
      return;
    }

    try {
      await authenticatedRequest(`/api/Sach/${bookId}`, { method: "DELETE" });
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Không thể xóa sách. Vui lòng thử lại.");
    }
  };

  const handleViewDetails = (book) => {
    console.log("View details:", book);
    // TODO: Implement book details modal
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
        <p className="page-subtitle">
          Thêm, sửa, xóa thông tin sách trong thư viện
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

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
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
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
          <BookManagementCard
            key={book.MaSach}
            book={{
              id: book.MaSach,
              title: book.TenSach,
              author: book.TacGia,
              category: book.TheLoai,
              shelf: book.KeSach || book.ViTriLuuTru,
              status: book.TrangThai,
              coverImage: book.AnhBia,
              description: book.MoTa,
              publishedYear: book.NamXuatBan || book.NamXB,
              isbn: book.ISBN,
              quantity: book.SoLuong,
              available: book.SoLuongConLai || book.SoLuong,
            }}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
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

      {/* Book Modal */}
      {showModal && (
        <BookModal
          book={
            editingBook
              ? {
                  title: editingBook.TenSach,
                  author: editingBook.TacGia,
                  isbn: editingBook.ISBN,
                  category: editingBook.TheLoai,
                  publisher: editingBook.NhaXuatBan,
                  publishYear: editingBook.NamXuatBan || editingBook.NamXB,
                  quantity: editingBook.SoLuong,
                  available: editingBook.SoLuongConLai,
                  location: editingBook.ViTriLuuTru || editingBook.KeSach,
                  coverImage: editingBook.AnhBia,
                  description: editingBook.MoTa,
                }
              : null
          }
          onSave={handleSaveBook}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BookManagement;
