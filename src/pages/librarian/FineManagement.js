import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaMoneyBillWave, FaFileAlt, FaFilter, FaPrint } from 'react-icons/fa';
import './FineManagement.css';

const FineManagement = () => {
  const [fines, setFines] = useState([]);
  const [filteredFines, setFilteredFines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFine, setSelectedFine] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Mock data
  useEffect(() => {
    const mockFines = [
      {
        id: 1,
        readerId: 'R001',
        readerName: 'Nguyễn Văn A',
        bookTitle: 'Lập trình Python',
        borrowDate: '2024-01-15',
        dueDate: '2024-02-15',
        returnDate: '2024-02-20',
        fineAmount: 50000,
        reason: 'Trả sách trễ 5 ngày',
        status: 'Chưa thanh toán',
        phone: '0123456789',
        email: 'nguyenvana@email.com'
      },
      {
        id: 2,
        readerId: 'R002',
        readerName: 'Trần Thị B',
        bookTitle: 'Cơ sở dữ liệu',
        borrowDate: '2024-01-10',
        dueDate: '2024-02-10',
        returnDate: '2024-02-25',
        fineAmount: 150000,
        reason: 'Trả sách trễ 15 ngày',
        status: 'Đã thanh toán',
        phone: '0987654321',
        email: 'tranthib@email.com'
      },
      {
        id: 3,
        readerId: 'R003',
        readerName: 'Lê Văn C',
        bookTitle: 'Mạng máy tính',
        borrowDate: '2024-01-20',
        dueDate: '2024-02-20',
        returnDate: '2024-02-18',
        fineAmount: 0,
        reason: 'Trả sách đúng hạn',
        status: 'Không phạt',
        phone: '0555666777',
        email: 'levanc@email.com'
      },
      {
        id: 4,
        readerId: 'R004',
        readerName: 'Phạm Thị D',
        bookTitle: 'Thuật toán nâng cao',
        borrowDate: '2024-01-05',
        dueDate: '2024-02-05',
        returnDate: '2024-02-10',
        fineAmount: 50000,
        reason: 'Trả sách trễ 5 ngày',
        status: 'Chưa thanh toán',
        phone: '0333444555',
        email: 'phamthid@email.com'
      }
    ];
    setFines(mockFines);
    setFilteredFines(mockFines);
  }, []);

  useEffect(() => {
    let filtered = fines;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(fine =>
        fine.readerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fine.readerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fine.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(fine => fine.status === statusFilter);
    }

    setFilteredFines(filtered);
  }, [searchTerm, statusFilter, fines]);

  const handlePayment = (fine) => {
    setSelectedFine(fine);
    setPaymentAmount(fine.fineAmount);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (selectedFine) {
      const updatedFines = fines.map(fine =>
        fine.id === selectedFine.id
          ? { ...fine, status: 'Đã thanh toán' }
          : fine
      );
      setFines(updatedFines);
      setShowPaymentModal(false);
      setSelectedFine(null);
      setPaymentAmount(0);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Chưa thanh toán': 'status-unpaid',
      'Đã thanh toán': 'status-paid',
      'Không phạt': 'status-no-fine'
    };
    return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
  };

  const getTotalFines = () => {
    return filteredFines.reduce((total, fine) => total + fine.fineAmount, 0);
  };

  const getUnpaidFines = () => {
    return filteredFines
      .filter(fine => fine.status === 'Chưa thanh toán')
      .reduce((total, fine) => total + fine.fineAmount, 0);
  };

  return (
    <div className="fine-management">
      <div className="fine-header">
        <h1>Quản Lý Tiền Phạt</h1>
        <div className="fine-stats">
          <div className="stat-card">
            <div className="stat-value">{filteredFines.length}</div>
            <div className="stat-label">Tổng số phiếu</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{getTotalFines().toLocaleString()}đ</div>
            <div className="stat-label">Tổng tiền phạt</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{getUnpaidFines().toLocaleString()}đ</div>
            <div className="stat-label">Chưa thanh toán</div>
          </div>
        </div>
      </div>

      <div className="fine-controls">
        <div className="search-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên thành viên, mã thành viên hoặc tên sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chưa thanh toán">Chưa thanh toán</option>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Không phạt">Không phạt</option>
          </select>
        </div>
      </div>

      <div className="fine-table-container">
        <table className="fine-table">
          <thead>
            <tr>
                              <th>Mã thành viên</th>
                <th>Tên thành viên</th>
              <th>Tên sách</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Ngày trả</th>
              <th>Số tiền phạt</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredFines.map((fine) => (
              <tr key={fine.id}>
                <td>{fine.readerId}</td>
                <td>
                  <div className="reader-info">
                    <div className="reader-name">{fine.readerName}</div>
                    <div className="reader-contact">
                      {fine.phone} | {fine.email}
                    </div>
                  </div>
                </td>
                <td>{fine.bookTitle}</td>
                <td>{new Date(fine.borrowDate).toLocaleDateString('vi-VN')}</td>
                <td>{new Date(fine.dueDate).toLocaleDateString('vi-VN')}</td>
                <td>{new Date(fine.returnDate).toLocaleDateString('vi-VN')}</td>
                <td className="fine-amount">
                  {fine.fineAmount > 0 ? `${fine.fineAmount.toLocaleString()}đ` : '0đ'}
                </td>
                <td>{fine.reason}</td>
                <td>{getStatusBadge(fine.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => setSelectedFine(fine)}
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                    {fine.status === 'Chưa thanh toán' && fine.fineAmount > 0 && (
                      <button
                        className="btn-pay"
                        onClick={() => handlePayment(fine)}
                        title="Thu phí"
                      >
                        <FaMoneyBillWave />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedFine && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <div className="modal-header">
              <h3>Thu Phí Phạt</h3>
              <button
                className="close-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-info">
                <div className="info-row">
                  <label>Thành viên:</label>
                  <span>{selectedFine.readerName} ({selectedFine.readerId})</span>
                </div>
                <div className="info-row">
                  <label>Sách:</label>
                  <span>{selectedFine.bookTitle}</span>
                </div>
                <div className="info-row">
                  <label>Lý do phạt:</label>
                  <span>{selectedFine.reason}</span>
                </div>
                <div className="info-row">
                  <label>Số tiền phạt:</label>
                  <span className="fine-amount-large">{selectedFine.fineAmount.toLocaleString()}đ</span>
                </div>
                <div className="info-row">
                  <label>Số tiền thu:</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="payment-input"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowPaymentModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn-confirm"
                onClick={confirmPayment}
                disabled={paymentAmount <= 0}
              >
                Xác nhận thu phí
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fine Detail Modal */}
      {selectedFine && !showPaymentModal && (
        <div className="modal-overlay">
          <div className="detail-modal">
            <div className="modal-header">
              <h3>Chi Tiết Phiếu Phạt</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedFine(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-section">
                  <h4>Thông tin thành viên</h4>
                  <div className="detail-item">
                                          <label>Mã thành viên:</label>
                    <span>{selectedFine.readerId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Họ tên:</label>
                    <span>{selectedFine.readerName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Số điện thoại:</label>
                    <span>{selectedFine.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedFine.email}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <h4>Thông tin mượn trả</h4>
                  <div className="detail-item">
                    <label>Tên sách:</label>
                    <span>{selectedFine.bookTitle}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày mượn:</label>
                    <span>{new Date(selectedFine.borrowDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Hạn trả:</label>
                    <span>{new Date(selectedFine.dueDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày trả:</label>
                    <span>{new Date(selectedFine.returnDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <h4>Thông tin phạt</h4>
                  <div className="detail-item">
                    <label>Lý do phạt:</label>
                    <span>{selectedFine.reason}</span>
                  </div>
                  <div className="detail-item">
                    <label>Số tiền phạt:</label>
                    <span className="fine-amount-large">{selectedFine.fineAmount.toLocaleString()}đ</span>
                  </div>
                  <div className="detail-item">
                    <label>Trạng thái:</label>
                    <span>{getStatusBadge(selectedFine.status)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedFine.status === 'Chưa thanh toán' && selectedFine.fineAmount > 0 && (
                <button
                  className="btn-pay-large"
                  onClick={() => handlePayment(selectedFine)}
                >
                  <FaMoneyBillWave /> Thu phí
                </button>
              )}
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

export default FineManagement; 