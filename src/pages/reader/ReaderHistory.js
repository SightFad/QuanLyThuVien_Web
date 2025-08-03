import React, { useState, useEffect } from 'react';
import { FaHistory, FaBook, FaCalendar, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import { readerService } from '../../services';
import './ReaderHistory.css';

const ReaderHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'returned', label: 'Đã trả' },
    { value: 'overdue', label: 'Quá hạn' },
    { value: 'borrowed', label: 'Đang mượn' }
  ];

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      
      // Load borrow history using readerService
      const myBooksData = await readerService.getMyBooks();
      const historyData = myBooksData.borrowHistory || [];
      
      setHistory(historyData);
      setFilteredHistory(historyData);
    } catch (error) {
      console.error('Error loading history data:', error);
      
      // Fallback to empty array if API fails
      setHistory([]);
      setFilteredHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when search term or status changes
  useEffect(() => {
    let filtered = [...history];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.bookTitle?.toLowerCase().includes(term) ||
        item.author?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term) ||
        item.isbn?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(item => {
        switch (selectedStatus) {
          case 'returned':
            return item.status === 'returned' || item.status === 'Đã trả';
          case 'overdue':
            return item.status === 'overdue' || item.status === 'Quá hạn';
          case 'borrowed':
            return item.status === 'borrowed' || item.status === 'Đang mượn';
          default:
            return true;
        }
      });
    }

    setFilteredHistory(filtered);
  }, [history, searchTerm, selectedStatus]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'returned':
      case 'Đã trả':
        return <span className="badge badge-success">Đã trả</span>;
      case 'overdue':
      case 'Quá hạn':
        return <span className="badge badge-danger">Quá hạn</span>;
      case 'borrowed':
      case 'Đang mượn':
        return <span className="badge badge-warning">Đang mượn</span>;
      case 'returned_late':
      case 'Trả trễ':
        return <span className="badge badge-warning">Trả trễ</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const getDaysLateText = (daysLate) => {
    if (!daysLate || daysLate === 0) {
      return 'Trả đúng hạn';
    } else if (daysLate > 0) {
      return `Trả trễ ${daysLate} ngày`;
    } else {
      return 'Trả sớm';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
  };

  if (loading) {
    return (
      <div className="reader-history">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải lịch sử mượn sách...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-history">
      <div className="page-header">
        <h1><FaHistory /> Lịch sử mượn sách</h1>
        <p>Xem lại tất cả các sách bạn đã mượn và trả</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="controls-section">
        <div className="search-filter-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách, tác giả, thể loại..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="status-filter"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button onClick={clearFilters} className="clear-filters-btn">
              <FaTimes /> Xóa bộ lọc
            </button>
          </div>
        </div>

        <div className="results-info">
          <span>Hiển thị {filteredHistory.length} trong tổng số {history.length} bản ghi</span>
        </div>
      </div>

      {/* History List */}
      <div className="history-content">
        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <FaHistory />
            <h3>Không có lịch sử mượn sách</h3>
            <p>
              {searchTerm || selectedStatus 
                ? 'Không tìm thấy kết quả phù hợp với bộ lọc hiện tại'
                : 'Bạn chưa có lịch sử mượn sách nào'
              }
            </p>
            {(searchTerm || selectedStatus) && (
              <button onClick={clearFilters} className="btn btn-primary">
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="history-grid">
            {filteredHistory.map(item => (
              <div key={item.id || item.phieuMuonId} className="history-card">
                <div className="history-header">
                  <div className="book-info">
                    <h3>{item.bookTitle}</h3>
                    <p className="author">{item.author}</p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="history-details">
                  <div className="detail-row">
                    <span className="label">Thể loại:</span>
                    <span className="value">{item.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">ISBN:</span>
                    <span className="value">{item.isbn}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Ngày mượn:</span>
                    <span className="value">{formatDate(item.borrowDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Hạn trả:</span>
                    <span className="value">{formatDate(item.returnDate)}</span>
                  </div>
                  {item.actualReturnDate && (
                    <div className="detail-row">
                      <span className="label">Ngày trả thực tế:</span>
                      <span className="value">{formatDate(item.actualReturnDate)}</span>
                    </div>
                  )}
                  {item.fine && item.fine > 0 && (
                    <div className="detail-row">
                      <span className="label">Tiền phạt:</span>
                      <span className="value text-danger">
                        {item.fine.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  )}
                  {item.daysLate !== undefined && (
                    <div className="detail-row">
                      <span className="label">Tình trạng trả:</span>
                      <span className={`value ${item.daysLate > 0 ? 'text-warning' : 'text-success'}`}>
                        {getDaysLateText(item.daysLate)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="history-actions">
                  <button className="btn btn-secondary">
                    <FaBook /> Xem chi tiết
                  </button>
                  {item.fine && item.fine > 0 && (
                    <button className="btn btn-primary">
                      <FaCheck /> Thanh toán phạt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderHistory; 