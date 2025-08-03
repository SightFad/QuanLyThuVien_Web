import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaBook,
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
  FaTimes,
  FaFilter,
  FaImage,
  FaCog,
  FaSort,
  FaClock,
} from "react-icons/fa";
import { useToast } from "../../hooks";
import { bookService, userService } from "../../services";
import "./ReaderSearch.css";

const ReaderSearch = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search and filter state
  const [searchForm, setSearchForm] = useState({
    searchTerm: "", // Main search term for all fields
    tenSach: "",
    tacGia: "",
    isbn: "",
    theLoai: "",
    namXuatBan: "",
    nhaXuatBan: "",
    trangThai: "",
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [reserving, setReserving] = useState({});

  const { showToast } = useToast();

  const categories = [
    "Tất cả",
    "Kỹ năng sống",
    "Tiểu thuyết",
    "Kinh doanh",
    "Tâm lý học",
    "Khoa học",
    "Lịch sử",
    "Văn học",
    "Giáo dục",
    "Công nghệ",
  ];

  const years = [
    "Tất cả",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
  ];

  const publishers = [
    "Tất cả",
    "NXB Tổng hợp TP.HCM",
    "NXB Văn học",
    "NXB Hội nhà văn",
    "NXB Lao động",
    "NXB Thế giới",
    "NXB Trẻ",
    "NXB Kim Đồng",
  ];

  const statusOptions = ["Tất cả", "Có sẵn", "Còn ít", "Hết sách"];

  const sortOptions = [
    { value: "title", label: "Tên sách" },
    { value: "author", label: "Tác giả" },
    { value: "year", label: "Năm xuất bản" },
    { value: "available", label: "Số lượng có sẵn" },
  ];

  // Load books from API
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
      showToast('Không thể tải danh sách sách', 'error');
      
      // Fallback to empty array
      setBooks([]);
      setFilteredBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...books];

    // Apply search term filter
    if (searchForm.searchTerm.trim()) {
      const searchTerm = searchForm.searchTerm.toLowerCase();
      filtered = filtered.filter(book => 
        book.tenSach?.toLowerCase().includes(searchTerm) ||
        book.tacGia?.toLowerCase().includes(searchTerm) ||
        book.isbn?.toLowerCase().includes(searchTerm) ||
        book.theLoai?.toLowerCase().includes(searchTerm) ||
        book.nhaXuatBan?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply individual field filters
    if (searchForm.tenSach) {
      filtered = filtered.filter(book => 
        book.tenSach?.toLowerCase().includes(searchForm.tenSach.toLowerCase())
      );
    }

    if (searchForm.tacGia) {
      filtered = filtered.filter(book => 
        book.tacGia?.toLowerCase().includes(searchForm.tacGia.toLowerCase())
      );
    }

    if (searchForm.isbn) {
      filtered = filtered.filter(book => 
        book.isbn?.toLowerCase().includes(searchForm.isbn.toLowerCase())
      );
    }

    if (searchForm.theLoai && searchForm.theLoai !== "Tất cả") {
      filtered = filtered.filter(book => 
        book.theLoai === searchForm.theLoai
      );
    }

    if (searchForm.namXuatBan && searchForm.namXuatBan !== "Tất cả") {
      filtered = filtered.filter(book => 
        book.namXuatBan?.toString() === searchForm.namXuatBan
      );
    }

    if (searchForm.nhaXuatBan && searchForm.nhaXuatBan !== "Tất cả") {
      filtered = filtered.filter(book => 
        book.nhaXuatBan === searchForm.nhaXuatBan
      );
    }

    if (searchForm.trangThai && searchForm.trangThai !== "Tất cả") {
      filtered = filtered.filter(book => {
        const available = book.soLuongConLai || 0;
        switch (searchForm.trangThai) {
          case "Có sẵn":
            return available > 5;
          case "Còn ít":
            return available > 0 && available <= 5;
          case "Hết sách":
            return available === 0;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.tenSach || "";
          bValue = b.tenSach || "";
          break;
        case "author":
          aValue = a.tacGia || "";
          bValue = b.tacGia || "";
          break;
        case "year":
          aValue = a.namXuatBan || 0;
          bValue = b.namXuatBan || 0;
          break;
        case "available":
          aValue = a.soLuongConLai || 0;
          bValue = b.soLuongConLai || 0;
          break;
        default:
          aValue = a.tenSach || "";
          bValue = b.tenSach || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBooks(filtered);
  };

  // Apply filters whenever search form changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [searchForm, sortBy, sortOrder, books]);

  const fetchSuggestions = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      // Use bookService for suggestions
      const suggestions = await bookService.searchBooks(searchTerm);
      setSearchSuggestions(suggestions.slice(0, 5)); // Limit to 5 suggestions
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Fallback to local suggestions
      generateLocalSuggestions(searchTerm);
    }
  };

  const generateLocalSuggestions = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    const suggestions = books
      .filter(book => 
        book.tenSach?.toLowerCase().includes(term) ||
        book.tacGia?.toLowerCase().includes(term)
      )
      .slice(0, 5)
      .map(book => ({
        id: book.maSach,
        text: book.tenSach,
        type: 'book',
        author: book.tacGia
      }));
    
    setSearchSuggestions(suggestions);
  };

  const handleSearchChange = (field, value) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Update suggestions for main search term
    if (field === 'searchTerm') {
      fetchSuggestions(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchForm(prev => ({
      ...prev,
      searchTerm: suggestion.text
    }));
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    applyFiltersAndSort();
  };

  const clearFilters = () => {
    setSearchForm({
      searchTerm: "",
      tenSach: "",
      tacGia: "",
      isbn: "",
      theLoai: "",
      namXuatBan: "",
      nhaXuatBan: "",
      trangThai: "",
    });
    setSortBy("title");
    setSortOrder("asc");
    setSearchSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleReserveBook = async (bookId) => {
    try {
      setReserving(prev => ({ ...prev, [bookId]: true }));
      
      // Get current user's docGiaId
      const docGiaId = userService.getCurrentDocGiaId();
      if (!docGiaId) {
        throw new Error('Không tìm thấy thông tin độc giả. Vui lòng đăng nhập lại.');
      }

      // Check borrow conditions first
      const conditions = await checkBorrowConditions(bookId);
      if (!conditions.canBorrow) {
        throw new Error(conditions.message);
      }

      // Create reservation using bookService
      const result = await bookService.createReservation({
        maSach: bookId,
        maDG: docGiaId,
        ngayDat: new Date().toISOString(),
        trangThai: 'Đang chờ'
      });

      showToast('Đặt sách thành công!', 'success');
      
      // Refresh books to update availability
      await fetchBooks();
    } catch (error) {
      console.error('Error reserving book:', error);
      showToast(error.message || 'Có lỗi xảy ra khi đặt sách', 'error');
    } finally {
      setReserving(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const checkBorrowConditions = async (bookId) => {
    try {
      // Get current user info
      const docGiaId = userService.getCurrentDocGiaId();
      if (!docGiaId) {
        return { canBorrow: false, message: 'Không tìm thấy thông tin độc giả' };
      }

      // Check if user has overdue books
      const userInfo = userService.getCurrentUser();
      if (userInfo.overdueBooks > 0) {
        return { canBorrow: false, message: 'Bạn có sách quá hạn, vui lòng trả sách trước khi mượn mới' };
      }

      // Check if user has reached borrow limit
      if (userInfo.currentBorrows >= userInfo.soSachToiDa) {
        return { canBorrow: false, message: 'Bạn đã đạt giới hạn số sách được mượn' };
      }

      return { canBorrow: true, message: 'Có thể mượn sách' };
    } catch (error) {
      console.error('Error checking borrow conditions:', error);
      return { canBorrow: false, message: 'Không thể kiểm tra điều kiện mượn sách' };
    }
  };

  const getQueueInfo = async (bookId) => {
    try {
      // This would typically call an API to get queue information
      // For now, return mock data
      return {
        position: Math.floor(Math.random() * 10) + 1,
        totalInQueue: Math.floor(Math.random() * 20) + 1
      };
    } catch (error) {
      console.error('Error getting queue info:', error);
      return { position: 0, totalInQueue: 0 };
    }
  };

  const getAvailabilityBadge = (available, total) => {
    if (available === 0) {
      return <span className="badge badge-danger">Hết sách</span>;
    } else if (available <= 5) {
      return <span className="badge badge-warning">Còn ít</span>;
    } else {
      return <span className="badge badge-success">Có sẵn</span>;
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/images/default-book-cover.jpg';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reader-search">
      <div className="page-header">
        <h1 className="page-title">DANH SÁCH TRA CỨU SÁCH</h1>
        <p className="page-subtitle">Tìm kiếm và khám phá kho sách thư viện</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          {/* Main search bar with suggestions */}
          <div className="search-bar-container">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sách, tác giả, ISBN, thể loại, nhà xuất bản, vị trí..."
                value={searchForm.searchTerm}
                onChange={(e) =>
                  handleSearchChange("searchTerm", e.target.value)
                }
                onKeyDown={handleKeyDown}
                className="search-input"
              />
              {searchForm.searchTerm && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => handleSearchChange("searchTerm", "")}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Search suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <FaSearch className="suggestion-icon" />
                    <span className="suggestion-text">{suggestion.text}</span>
                    <span className="suggestion-type">{suggestion.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick filters and controls */}
          <div className="quick-controls">
            <div className="quick-filters">
              <select
                value={searchForm.theLoai}
                onChange={(e) => handleSearchChange("theLoai", e.target.value)}
                className="quick-filter"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={searchForm.trangThai}
                onChange={(e) =>
                  handleSearchChange("trangThai", e.target.value)
                }
                className="quick-filter"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="quick-filter"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sắp xếp theo: {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="sort-order-btn"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                title={sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
              >
                <FaSort className={sortOrder === "asc" ? "asc" : "desc"} />
              </button>
            </div>

            <div className="control-buttons">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <FaFilter />
                {showAdvancedFilters ? "Ẩn bộ lọc nâng cao" : "Bộ lọc nâng cao"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                <FaTimes /> Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Advanced search form */}
          {showAdvancedFilters && (
            <div className="advanced-search-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên sách:</label>
                  <input
                    type="text"
                    value={searchForm.tenSach}
                    onChange={(e) =>
                      handleSearchChange("tenSach", e.target.value)
                    }
                    placeholder="Nhập tên sách..."
                  />
                </div>
                <div className="form-group">
                  <label>Tác giả:</label>
                  <input
                    type="text"
                    value={searchForm.tacGia}
                    onChange={(e) =>
                      handleSearchChange("tacGia", e.target.value)
                    }
                    placeholder="Nhập tên tác giả..."
                  />
                </div>
                <div className="form-group">
                  <label>Mã ISBN:</label>
                  <input
                    type="text"
                    value={searchForm.isbn}
                    onChange={(e) => handleSearchChange("isbn", e.target.value)}
                    placeholder="Nhập mã ISBN..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Thể loại:</label>
                  <select
                    value={searchForm.theLoai}
                    onChange={(e) =>
                      handleSearchChange("theLoai", e.target.value)
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Năm xuất bản:</label>
                  <select
                    value={searchForm.namXuatBan}
                    onChange={(e) =>
                      handleSearchChange("namXuatBan", e.target.value)
                    }
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nhà xuất bản:</label>
                  <select
                    value={searchForm.nhaXuatBan}
                    onChange={(e) =>
                      handleSearchChange("nhaXuatBan", e.target.value)
                    }
                  >
                    {publishers.map((publisher) => (
                      <option key={publisher} value={publisher}>
                        {publisher}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Trạng thái:</label>
                  <select
                    value={searchForm.trangThai}
                    onChange={(e) =>
                      handleSearchChange("trangThai", e.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="results-section">
        <div className="results-header">
          <h3>Tìm thấy {filteredBooks.length} sách</h3>
          {(searchForm.searchTerm ||
            searchForm.tenSach ||
            searchForm.tacGia ||
            searchForm.isbn ||
            searchForm.theLoai !== "" ||
            searchForm.namXuatBan !== "" ||
            searchForm.nhaXuatBan !== "" ||
            searchForm.trangThai !== "") && (
            <div className="active-filters">
              <span>Bộ lọc đang áp dụng:</span>
              {searchForm.searchTerm && (
                <span className="filter-tag">
                  Tìm kiếm: {searchForm.searchTerm}
                </span>
              )}
              {searchForm.tenSach && (
                <span className="filter-tag">
                  Tên sách: {searchForm.tenSach}
                </span>
              )}
              {searchForm.tacGia && (
                <span className="filter-tag">Tác giả: {searchForm.tacGia}</span>
              )}
              {searchForm.isbn && (
                <span className="filter-tag">ISBN: {searchForm.isbn}</span>
              )}
              {searchForm.theLoai !== "" && searchForm.theLoai !== "Tất cả" && (
                <span className="filter-tag">
                  Thể loại: {searchForm.theLoai}
                </span>
              )}
              {searchForm.namXuatBan !== "" &&
                searchForm.namXuatBan !== "Tất cả" && (
                  <span className="filter-tag">
                    Năm: {searchForm.namXuatBan}
                  </span>
                )}
              {searchForm.nhaXuatBan !== "" &&
                searchForm.nhaXuatBan !== "Tất cả" && (
                  <span className="filter-tag">
                    NXB: {searchForm.nhaXuatBan}
                  </span>
                )}
              {searchForm.trangThai !== "" &&
                searchForm.trangThai !== "Tất cả" && (
                  <span className="filter-tag">
                    Trạng thái: {searchForm.trangThai}
                  </span>
                )}
            </div>
          )}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-cover">
                  <img
                    src={book.anhBia || "/images/default-book-cover.jpg"}
                    alt={`Bìa sách ${book.tenSach}`}
                    onError={handleImageError}
                    className="book-cover-image"
                  />
                  {!book.anhBia && (
                    <div className="book-cover-placeholder">
                      <FaImage />
                    </div>
                  )}
                </div>

                <div className="book-content">
                  <div className="book-header">
                    <h4 className="book-title">{book.tenSach}</h4>
                    {getAvailabilityBadge(
                      book.soLuongConLai || 0,
                      book.soLuong || 0
                    )}
                  </div>

                  <div className="book-info">
                    <div className="book-info-item">
                      <FaUser className="book-info-icon" />
                      <div className="book-info-content">
                        <span className="book-info-label">Tác giả</span>
                        <span className="book-info-value">{book.tacGia}</span>
                      </div>
                    </div>

                    <div className="book-info-item">
                      <FaBook className="book-info-icon" />
                      <div className="book-info-content">
                        <span className="book-info-label">Thể loại</span>
                        <span className="book-info-value">{book.theLoai}</span>
                      </div>
                    </div>

                    <div className="book-info-item">
                      <FaCalendar className="book-info-icon" />
                      <div className="book-info-content">
                        <span className="book-info-label">
                          Thông tin xuất bản
                        </span>
                        <span className="book-info-value">
                          {book.nhaXuatBan} - {book.namXuatBan}
                        </span>
                      </div>
                    </div>

                    <div className="book-info-item">
                      <FaMapMarkerAlt className="book-info-icon" />
                      <div className="book-info-content">
                        <span className="book-info-label">Vị trí lưu trữ</span>
                        <span className="book-info-value highlight">
                          {book.viTriLuuTru}
                        </span>
                      </div>
                    </div>

                    <div className="book-info-item">
                      <FaBook className="book-info-icon" />
                      <div className="book-info-content">
                        <span className="book-info-label">Mã ISBN</span>
                        <span className="book-info-value highlight">
                          {book.isbn}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="book-description">
                    <p>{book.moTa || "Không có mô tả"}</p>
                  </div>

                  <div className="book-actions">
                    {book.soLuongConLai > 0 ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleReserveBook(book.maSach)}
                        disabled={reserving[book.maSach]}
                      >
                        <FaClock />
                        {reserving[book.maSach]
                          ? "Đang đặt trước..."
                          : "Yêu cầu mượn"}
                      </button>
                    ) : (
                      <div className="book-actions-buttons">
                        {book.hasReservation ? (
                          <button className="btn btn-success" disabled>
                            <FaClock /> Đã đặt trước
                          </button>
                        ) : (
                          <button
                            className="btn btn-warning"
                            onClick={() => handleReserveBook(book.maSach)}
                            disabled={reserving[book.maSach]}
                          >
                            <FaClock />
                            {reserving[book.maSach]
                              ? "Đang đặt trước..."
                              : "Đặt trước"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Không tìm thấy sách</h3>
            <p>Không có sách nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderSearch;
