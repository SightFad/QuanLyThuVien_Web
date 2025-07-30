import React, { useState, useEffect } from 'react';
import { FaSearch, FaBook, FaUser, FaCalendar, FaMapMarkerAlt, FaTimes, FaFilter, FaImage } from 'react-icons/fa';
import './ReaderSearch.css';

const ReaderSearch = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Search form fields
  const [searchForm, setSearchForm] = useState({
    tenSach: '',
    tacGia: '',
    isbn: '',
    theLoai: '',
    namXuatBan: ''
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories = [
    'Tất cả',
    'Kỹ năng sống',
    'Tiểu thuyết',
    'Kinh doanh',
    'Tâm lý học',
    'Khoa học',
    'Lịch sử',
    'Văn học',
    'Giáo dục',
    'Công nghệ'
  ];

  const years = [
    'Tất cả',
    '2024',
    '2023',
    '2022',
    '2021',
    '2020',
    '2019',
    '2018',
    '2017',
    '2016',
    '2015'
  ];

  // API URLs
  const apiUrl = "http://localhost:5280/api/Sach";
  const searchApiUrl = "http://localhost:5280/api/Sach/search";
  const suggestionsApiUrl = "http://localhost:5280/api/Sach/suggestions";

  // Load books from API
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      const mappedBooks = data.map((book) => ({
        id: book.maSach,
        title: book.tenSach,
        author: book.tacGia,
        isbn: book.isbn,
        category: book.theLoai,
        publisher: book.nhaXuatBan || 'Không có thông tin',
        publishYear: book.namXB,
        quantity: book.soLuong,
        available: book.soLuongConLai,
        location: book.viTriLuuTru,
        description: book.moTa || 'Không có mô tả',
        coverImage: book.anhBia || '/images/default-book-cover.jpg'
      }));
      
      setBooks(mappedBooks);
      setFilteredBooks(mappedBooks);
    } catch (error) {
      console.error('Lỗi khi tải sách:', error);
      // Fallback to mock data if API fails
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  // Fetch search suggestions from API
  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`${suggestionsApiUrl}?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setSearchSuggestions(data);
    } catch (error) {
      console.error('Lỗi khi tải gợi ý:', error);
      // Fallback to local suggestions
      generateLocalSuggestions(searchTerm);
    }
  };

  // Generate local suggestions as fallback
  const generateLocalSuggestions = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const suggestions = [];
    const searchLower = searchTerm.toLowerCase();

    // Search in titles
    books.forEach(book => {
      if (book.title.toLowerCase().includes(searchLower) && 
          !suggestions.some(s => s.text === book.title)) {
        suggestions.push({ text: book.title, type: 'Tên sách' });
      }
    });

    // Search in authors
    books.forEach(book => {
      if (book.author.toLowerCase().includes(searchLower) && 
          !suggestions.some(s => s.text === book.author)) {
        suggestions.push({ text: book.author, type: 'Tác giả' });
      }
    });

    // Search in ISBN
    books.forEach(book => {
      if (book.isbn.includes(searchTerm) && 
          !suggestions.some(s => s.text === book.isbn)) {
        suggestions.push({ text: book.isbn, type: 'ISBN' });
      }
    });

    setSearchSuggestions(suggestions.slice(0, 5));
  };

  // Perform search using API
  const performSearch = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchForm.tenSach) params.append('tenSach', searchForm.tenSach);
      if (searchForm.tacGia) params.append('tacGia', searchForm.tacGia);
      if (searchForm.isbn) params.append('isbn', searchForm.isbn);
      if (searchForm.theLoai && searchForm.theLoai !== 'Tất cả') params.append('theLoai', searchForm.theLoai);
      if (searchForm.namXuatBan && searchForm.namXuatBan !== 'Tất cả') params.append('namXuatBan', searchForm.namXuatBan);

      const response = await fetch(`${searchApiUrl}?${params.toString()}`);
      const data = await response.json();
      
      const mappedBooks = data.map((book) => ({
        id: book.maSach,
        title: book.tenSach,
        author: book.tacGia,
        isbn: book.isbn,
        category: book.theLoai,
        publisher: book.nhaXuatBan || 'Không có thông tin',
        publishYear: book.namXB,
        quantity: book.soLuong,
        available: book.soLuongConLai,
        location: book.viTriLuuTru,
        description: book.moTa || 'Không có mô tả',
        coverImage: book.anhBia || '/images/default-book-cover.jpg'
      }));
      
      setFilteredBooks(mappedBooks);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      // Fallback to local search
      performLocalSearch();
    } finally {
      setLoading(false);
    }
  };

  // Local search as fallback
  const performLocalSearch = () => {
    let filtered = books;

    // Filter by book title (fuzzy search)
    if (searchForm.tenSach) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchForm.tenSach.toLowerCase())
      );
    }

    // Filter by author
    if (searchForm.tacGia) {
      filtered = filtered.filter(book =>
        book.author.toLowerCase().includes(searchForm.tacGia.toLowerCase())
      );
    }

    // Filter by ISBN
    if (searchForm.isbn) {
      filtered = filtered.filter(book =>
        book.isbn.includes(searchForm.isbn)
      );
    }

    // Filter by category
    if (searchForm.theLoai && searchForm.theLoai !== 'Tất cả') {
      filtered = filtered.filter(book => book.category === searchForm.theLoai);
    }

    // Filter by year
    if (searchForm.namXuatBan && searchForm.namXuatBan !== 'Tất cả') {
      filtered = filtered.filter(book => book.publishYear.toString() === searchForm.namXuatBan);
    }

    setFilteredBooks(filtered);
  };

  const loadMockData = () => {
    const mockBooks = [
      {
        id: 1,
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        category: 'Kỹ năng sống',
        publisher: 'NXB Tổng hợp TP.HCM',
        publishYear: 2019,
        isbn: '978-604-1-00001-1',
        available: 3,
        total: 5,
        location: 'Kệ A1',
        description: 'Cuốn sách về nghệ thuật đắc nhân tâm, cách ứng xử và giao tiếp hiệu quả.',
        coverImage: '/images/book-covers/dac-nhan-tam.jpg'
      },
      {
        id: 2,
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        category: 'Tiểu thuyết',
        publisher: 'NXB Văn học',
        publishYear: 2020,
        isbn: '978-604-1-00002-2',
        available: 1,
        total: 3,
        location: 'Kệ B2',
        description: 'Câu chuyện về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.',
        coverImage: '/images/book-covers/nha-gia-kim.jpg'
      },
      {
        id: 3,
        title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        category: 'Kỹ năng sống',
        publisher: 'NXB Hội nhà văn',
        publishYear: 2018,
        isbn: '978-604-1-00003-3',
        available: 2,
        total: 4,
        location: 'Kệ A3',
        description: 'Những trải nghiệm và bài học quý giá cho tuổi trẻ.',
        coverImage: '/images/book-covers/tuoi-tre-dang-gia-bao-nhieu.jpg'
      },
      {
        id: 4,
        title: 'Cách Nghĩ Để Thành Công',
        author: 'Napoleon Hill',
        category: 'Kinh doanh',
        publisher: 'NXB Lao động',
        publishYear: 2021,
        isbn: '978-604-1-00004-4',
        available: 4,
        total: 6,
        location: 'Kệ C1',
        description: 'Những nguyên tắc và phương pháp để đạt được thành công.',
        coverImage: '/images/book-covers/cach-nghi-de-thanh-cong.jpg'
      },
      {
        id: 5,
        title: 'Đọc Vị Bất Kỳ Ai',
        author: 'David J. Lieberman',
        category: 'Tâm lý học',
        publisher: 'NXB Thế giới',
        publishYear: 2020,
        isbn: '978-604-1-00005-5',
        available: 0,
        total: 2,
        location: 'Kệ B3',
        description: 'Nghệ thuật đọc hiểu tâm lý và suy nghĩ của người khác.',
        coverImage: '/images/book-covers/doc-vi-bat-ky-ai.jpg'
      },
      {
        id: 6,
        title: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        category: 'Lịch sử',
        publisher: 'NXB Thế giới',
        publishYear: 2021,
        isbn: '978-604-1-00006-6',
        available: 2,
        total: 3,
        location: 'Kệ D1',
        description: 'Lịch sử phát triển của loài người từ thời cổ đại.',
        coverImage: '/images/book-covers/sapiens.jpg'
      }
    ];
    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  };

  // Handle search input change
  const handleSearchChange = (field, value) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Generate suggestions for main search field
    if (field === 'tenSach') {
      fetchSuggestions(value);
      setShowSuggestions(value.length > 0);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchForm(prev => ({
      ...prev,
      tenSach: suggestion.text
    }));
    setShowSuggestions(false);
    performSearch();
  };

  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
    setShowSuggestions(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchForm({
      tenSach: '',
      tacGia: '',
      isbn: '',
      theLoai: '',
      namXuatBan: ''
    });
    setFilteredBooks(books);
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleRequestBorrow = (bookId) => {
    alert(`Đã gửi yêu cầu mượn sách ID: ${bookId}. Vui lòng chờ xác nhận từ thủ thư.`);
  };

  const getAvailabilityBadge = (available, total) => {
    if (available === 0) {
      return <span className="badge badge-danger">Hết sách</span>;
    } else if (available < total * 0.3) {
      return <span className="badge badge-warning">Còn ít ({available}/{total})</span>;
    } else {
      return <span className="badge badge-success">Có sẵn ({available}/{total})</span>;
    }
  };

  // Handle image error
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
                placeholder="Nhập từ khóa tìm kiếm (VD: Conan)..."
                value={searchForm.tenSach}
                onChange={(e) => handleSearchChange('tenSach', e.target.value)}
                onKeyDown={handleKeyDown}
                className="search-input"
              />
              {searchForm.tenSach && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => handleSearchChange('tenSach', '')}
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

          {/* Advanced filters toggle */}
          <div className="advanced-filters-toggle">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FaFilter />
              {showAdvancedFilters ? 'Ẩn bộ lọc nâng cao' : 'Hiển thị bộ lọc nâng cao'}
            </button>
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
                    onChange={(e) => handleSearchChange('tenSach', e.target.value)}
                    placeholder="Nhập tên sách..."
                  />
                </div>
                <div className="form-group">
                  <label>Tác giả:</label>
                  <input
                    type="text"
                    value={searchForm.tacGia}
                    onChange={(e) => handleSearchChange('tacGia', e.target.value)}
                    placeholder="Nhập tên tác giả..."
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Mã ISBN:</label>
                  <input
                    type="text"
                    value={searchForm.isbn}
                    onChange={(e) => handleSearchChange('isbn', e.target.value)}
                    placeholder="Nhập mã ISBN..."
                  />
                </div>
                <div className="form-group">
                  <label>Thể loại:</label>
                  <select
                    value={searchForm.theLoai}
                    onChange={(e) => handleSearchChange('theLoai', e.target.value)}
                  >
                    {categories.map(category => (
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
                    onChange={(e) => handleSearchChange('namXuatBan', e.target.value)}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <FaSearch /> Tìm kiếm
                </button>
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="results-section">
        <div className="results-header">
          <h3>Tìm thấy {filteredBooks.length} sách</h3>
          {(searchForm.tenSach || searchForm.tacGia || searchForm.isbn || 
            searchForm.theLoai !== '' || searchForm.namXuatBan !== '') && (
            <p>Kết quả tìm kiếm với bộ lọc đã chọn</p>
          )}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-cover">
                  <img
                    src={book.coverImage}
                    alt={`Bìa sách ${book.title}`}
                    onError={handleImageError}
                    className="book-cover-image"
                  />
                  {!book.coverImage && (
                    <div className="book-cover-placeholder">
                      <FaImage />
                    </div>
                  )}
                </div>
                
                <div className="book-content">
                  <div className="book-header">
                    <h4 className="book-title">{book.title}</h4>
                    {getAvailabilityBadge(book.available, book.total || book.quantity)}
                  </div>
                  
                  <div className="book-info">
                    <p className="book-author">
                      <FaUser /> {book.author}
                    </p>
                    <p className="book-category">
                      <FaBook /> {book.category}
                    </p>
                    <p className="book-publisher">
                      <FaCalendar /> {book.publisher} - {book.publishYear}
                    </p>
                    <p className="book-location">
                      <FaMapMarkerAlt /> {book.location}
                    </p>
                    <p className="book-isbn">ISBN: {book.isbn}</p>
                  </div>

                  <div className="book-description">
                    <p>{book.description}</p>
                  </div>

                  <div className="book-actions">
                    {book.available > 0 ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRequestBorrow(book.id)}
                      >
                        Yêu cầu mượn
                      </button>
                    ) : (
                      <button className="btn btn-secondary" disabled>
                        Hết sách
                      </button>
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