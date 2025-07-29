import React, { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaTimes, FaEye, FaExclamationTriangle, FaPrint, FaQrcode } from 'react-icons/fa';
import './ReturnProcess.css';

const ReturnProcess = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnNotes, setReturnNotes] = useState('');
  const [bookCondition, setBookCondition] = useState('good');
  const [scanMode, setScanMode] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  // Mock data
  useEffect(() => {
    const mockBorrowedBooks = [
      {
        id: 1,
        borrowId: 'B001',
        readerId: 'R001',
        readerName: 'Nguyễn Văn A',
        bookId: 'BK001',
        bookTitle: 'Lập trình Python',
        bookAuthor: 'John Smith',
        borrowDate: '2024-01-15',
        dueDate: '2024-02-15',
        expectedReturnDate: '2024-02-15',
        status: 'Đang mượn',
        phone: '0123456789',
        email: 'nguyenvana@email.com',
        fineAmount: 0,
        isOverdue: false
      },
      {
        id: 2,
        borrowId: 'B002',
        readerId: 'R002',
        readerName: 'Trần Thị B',
        bookId: 'BK002',
        bookTitle: 'Cơ sở dữ liệu',
        bookAuthor: 'Jane Doe',
        borrowDate: '2024-01-10',
        dueDate: '2024-02-10',
        expectedReturnDate: '2024-02-10',
        status: 'Đang mượn',
        phone: '0987654321',
        email: 'tranthib@email.com',
        fineAmount: 150000,
        isOverdue: true
      },
      {
        id: 3,
        borrowId: 'B003',
        readerId: 'R003',
        readerName: 'Lê Văn C',
        bookId: 'BK003',
        bookTitle: 'Mạng máy tính',
        bookAuthor: 'Mike Johnson',
        borrowDate: '2024-01-20',
        dueDate: '2024-02-20',
        expectedReturnDate: '2024-02-20',
        status: 'Đang mượn',
        phone: '0555666777',
        email: 'levanc@email.com',
        fineAmount: 0,
        isOverdue: false
      },
      {
        id: 4,
        borrowId: 'B004',
        readerId: 'R004',
        readerName: 'Phạm Thị D',
        bookId: 'BK004',
        bookTitle: 'Thuật toán nâng cao',
        bookAuthor: 'Sarah Wilson',
        borrowDate: '2024-01-05',
        dueDate: '2024-02-05',
        expectedReturnDate: '2024-02-05',
        status: 'Đang mượn',
        phone: '0333444555',
        email: 'phamthid@email.com',
        fineAmount: 50000,
        isOverdue: true
      }
    ];
    setBorrowedBooks(mockBorrowedBooks);
    setFilteredBooks(mockBorrowedBooks);
  }, []);

  useEffect(() => {
    let filtered = borrowedBooks;

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.readerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.readerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.borrowId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [searchTerm, borrowedBooks]);

  const handleReturn = (book) => {
    setSelectedBook(book);
    setShowReturnModal(true);
    setReturnNotes('');
    setBookCondition('good');
  };

  const confirmReturn = () => {
    if (selectedBook) {
      const updatedBooks = borrowedBooks.map(book =>
        book.id === selectedBook.id
          ? { ...book, status: 'Đã trả', returnDate: new Date().toISOString().split('T')[0] }
          : book
      );
      setBorrowedBooks(updatedBooks);
      setShowReturnModal(false);
      setSelectedBook(null);
      setReturnNotes('');
      setBookCondition('good');
    }
  };

  const handleScanCode = () => {
    setScanMode(true);
    // Simulate scanning
    setTimeout(() => {
      const randomCode = 'BK' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setScannedCode(randomCode);
      setScanMode(false);
      
      // Find book by scanned code
      const foundBook = borrowedBooks.find(book => book.bookId === randomCode);
      if (foundBook) {
        setSelectedBook(foundBook);
        setShowReturnModal(true);
      }
    }, 2000);
  };

  const getOverdueStatus = (book) => {
    if (book.isOverdue) {
      return <span className="overdue-badge">Quá hạn</span>;
    }
    return <span className="on-time-badge">Đúng hạn</span>;
  };

  const getFineStatus = (book) => {
    if (book.fineAmount > 0) {
      return <span className="fine-badge">{book.fineAmount.toLocaleString()}đ</span>;
    }
    return <span className="no-fine-badge">Không phạt</span>;
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="return-process">
      <div className="return-header">
        <h1>Quy Trình Trả Sách</h1>
        <div className="return-stats">
          <div className="stat-card">
            <div className="stat-value">{filteredBooks.length}</div>
            <div className="stat-label">Sách đang mượn</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {filteredBooks.filter(book => book.isOverdue).length}
            </div>
            <div className="stat-label">Sách quá hạn</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {filteredBooks.reduce((total, book) => total + book.fineAmount, 0).toLocaleString()}đ
            </div>
            <div className="stat-label">Tổng tiền phạt</div>
          </div>
        </div>
      </div>

      <div className="return-controls">
        <div className="search-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên độc giả, mã độc giả, tên sách hoặc mã mượn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="scan-section">
          <button
            className={`scan-btn ${scanMode ? 'scanning' : ''}`}
            onClick={handleScanCode}
            disabled={scanMode}
          >
            <FaQrcode />
            {scanMode ? 'Đang quét...' : 'Quét mã sách'}
          </button>
        </div>
      </div>

      {scanMode && (
        <div className="scan-overlay">
          <div className="scan-animation">
            <div className="scan-line"></div>
            <p>Đang quét mã sách...</p>
          </div>
        </div>
      )}

      <div className="return-table-container">
        <table className="return-table">
          <thead>
            <tr>
              <th>Mã mượn</th>
              <th>Độc giả</th>
              <th>Sách</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Trạng thái</th>
              <th>Tiền phạt</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id} className={book.isOverdue ? 'overdue-row' : ''}>
                <td>{book.borrowId}</td>
                <td>
                  <div className="reader-info">
                    <div className="reader-name">{book.readerName}</div>
                    <div className="reader-contact">
                      {book.phone} | {book.email}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="book-info">
                    <div className="book-title">{book.bookTitle}</div>
                    <div className="book-author">Tác giả: {book.bookAuthor}</div>
                    <div className="book-id">Mã sách: {book.bookId}</div>
                  </div>
                </td>
                <td>{new Date(book.borrowDate).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div className="due-date-info">
                    <div className="due-date">
                      {new Date(book.dueDate).toLocaleDateString('vi-VN')}
                    </div>
                    {book.isOverdue && (
                      <div className="overdue-days">
                        Quá {getDaysOverdue(book.dueDate)} ngày
                      </div>
                    )}
                  </div>
                </td>
                <td>{getOverdueStatus(book)}</td>
                <td>{getFineStatus(book)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => setSelectedBook(book)}
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn-return"
                      onClick={() => handleReturn(book)}
                      title="Xử lý trả sách"
                    >
                      <FaCheck />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Return Modal */}
      {showReturnModal && selectedBook && (
        <div className="modal-overlay">
          <div className="return-modal">
            <div className="modal-header">
              <h3>Xử Lý Trả Sách</h3>
              <button
                className="close-btn"
                onClick={() => setShowReturnModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="return-info">
                <div className="info-section">
                  <h4>Thông tin độc giả</h4>
                  <div className="info-row">
                    <label>Họ tên:</label>
                    <span>{selectedBook.readerName}</span>
                  </div>
                  <div className="info-row">
                    <label>Mã độc giả:</label>
                    <span>{selectedBook.readerId}</span>
                  </div>
                  <div className="info-row">
                    <label>Số điện thoại:</label>
                    <span>{selectedBook.phone}</span>
                  </div>
                </div>

                <div className="info-section">
                  <h4>Thông tin sách</h4>
                  <div className="info-row">
                    <label>Tên sách:</label>
                    <span>{selectedBook.bookTitle}</span>
                  </div>
                  <div className="info-row">
                    <label>Tác giả:</label>
                    <span>{selectedBook.bookAuthor}</span>
                  </div>
                  <div className="info-row">
                    <label>Mã sách:</label>
                    <span>{selectedBook.bookId}</span>
                  </div>
                </div>

                <div className="info-section">
                  <h4>Thông tin mượn</h4>
                  <div className="info-row">
                    <label>Ngày mượn:</label>
                    <span>{new Date(selectedBook.borrowDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="info-row">
                    <label>Hạn trả:</label>
                    <span>{new Date(selectedBook.dueDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="info-row">
                    <label>Trạng thái:</label>
                    <span>{getOverdueStatus(selectedBook)}</span>
                  </div>
                  {selectedBook.fineAmount > 0 && (
                    <div className="info-row">
                      <label>Tiền phạt:</label>
                      <span className="fine-amount">{selectedBook.fineAmount.toLocaleString()}đ</span>
                    </div>
                  )}
                </div>

                <div className="info-section">
                  <h4>Kiểm tra sách</h4>
                  <div className="condition-check">
                    <label>Tình trạng sách:</label>
                    <select
                      value={bookCondition}
                      onChange={(e) => setBookCondition(e.target.value)}
                      className="condition-select"
                    >
                      <option value="good">Tốt</option>
                      <option value="damaged">Hư hỏng nhẹ</option>
                      <option value="severely_damaged">Hư hỏng nặng</option>
                      <option value="lost">Mất sách</option>
                    </select>
                  </div>
                  <div className="notes-section">
                    <label>Ghi chú:</label>
                    <textarea
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      placeholder="Ghi chú về tình trạng sách hoặc lý do trả..."
                      className="notes-textarea"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowReturnModal(false)}
              >
                <FaTimes /> Hủy
              </button>
              <button
                className="btn-confirm"
                onClick={confirmReturn}
              >
                <FaCheck /> Xác nhận trả sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && !showReturnModal && (
        <div className="modal-overlay">
          <div className="detail-modal">
            <div className="modal-header">
              <h3>Chi Tiết Mượn Sách</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedBook(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-section">
                  <h4>Thông tin độc giả</h4>
                  <div className="detail-item">
                    <label>Họ tên:</label>
                    <span>{selectedBook.readerName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mã độc giả:</label>
                    <span>{selectedBook.readerId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Số điện thoại:</label>
                    <span>{selectedBook.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedBook.email}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Thông tin sách</h4>
                  <div className="detail-item">
                    <label>Tên sách:</label>
                    <span>{selectedBook.bookTitle}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tác giả:</label>
                    <span>{selectedBook.bookAuthor}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mã sách:</label>
                    <span>{selectedBook.bookId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mã mượn:</label>
                    <span>{selectedBook.borrowId}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Thông tin mượn trả</h4>
                  <div className="detail-item">
                    <label>Ngày mượn:</label>
                    <span>{new Date(selectedBook.borrowDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Hạn trả:</label>
                    <span>{new Date(selectedBook.dueDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Trạng thái:</label>
                    <span>{getOverdueStatus(selectedBook)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tiền phạt:</label>
                    <span>{getFineStatus(selectedBook)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-return-large"
                onClick={() => handleReturn(selectedBook)}
              >
                <FaCheck /> Xử lý trả sách
              </button>
              <button
                className="btn-print"
                onClick={() => window.print()}
              >
                <FaPrint /> In phiếu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnProcess; 