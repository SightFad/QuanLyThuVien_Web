import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaPrint, 
  FaFileAlt, 
  FaCalendarAlt,
  FaUser,
  FaBook,
  FaBell,
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaExclamationTriangle,
  FaPlus,
  FaFilter,
  FaSync,
  FaChartBar
} from 'react-icons/fa';
import { useToast } from '../../hooks';
import './BookReservationManagement.css';

const BookReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  
  const { showToast } = useToast();

  // Form states for creating new reservation
  const [newReservation, setNewReservation] = useState({
    maDG: '',
    tenDG: '',
    maSach: '',
    tenSach: '',
    ngayDatTruoc: new Date().toISOString().split('T')[0],
    hanLaySach: '',
    ghiChu: '',
    trangThai: 'Chờ xử lý'
  });

  // Mock data for demonstration
  const mockReservations = [
    {
      id: 1,
      maDG: 'DG001',
      tenDG: 'Nguyễn Văn A',
      maSach: 'S001',
      tenSach: 'Sách Giáo Khoa Toán 12',
      ngayDatTruoc: '2024-01-15',
      hanLaySach: '2024-01-18',
      trangThai: 'Chờ xử lý',
      ghiChu: 'Độc giả yêu cầu đặt trước',
      nguoiXuLy: null,
      ngayXuLy: null
    },
    {
      id: 2,
      maDG: 'DG002',
      tenDG: 'Trần Thị B',
      maSach: 'S002',
      tenSach: 'Sách Văn Học Việt Nam',
      ngayDatTruoc: '2024-01-16',
      hanLaySach: '2024-01-19',
      trangThai: 'Đã thông báo',
      ghiChu: 'Đã gọi điện thông báo',
      nguoiXuLy: 'Thủ thư Nguyễn Thị C',
      ngayXuLy: '2024-01-17'
    },
    {
      id: 3,
      maDG: 'DG003',
      tenDG: 'Lê Văn D',
      maSach: 'S003',
      tenSach: 'Sách Lịch Sử Thế Giới',
      ngayDatTruoc: '2024-01-14',
      hanLaySach: '2024-01-17',
      trangThai: 'Đã nhận',
      ghiChu: 'Độc giả đã nhận sách',
      nguoiXuLy: 'Thủ thư Nguyễn Thị C',
      ngayXuLy: '2024-01-16'
    },
    {
      id: 4,
      maDG: 'DG004',
      tenDG: 'Phạm Thị E',
      maSach: 'S004',
      tenSach: 'Sách Khoa Học Tự Nhiên',
      ngayDatTruoc: '2024-01-13',
      hanLaySach: '2024-01-16',
      trangThai: 'Đã hủy',
      ghiChu: 'Độc giả hủy đặt trước',
      nguoiXuLy: 'Thủ thư Nguyễn Thị C',
      ngayXuLy: '2024-01-15'
    }
  ];

  useEffect(() => {
    loadReservations();
    loadStatistics();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, statusFilter, reservations]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setReservations(mockReservations);
        setFilteredReservations(mockReservations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      showToast('Lỗi khi tải danh sách đặt trước', 'error');
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = {
        totalReservations: mockReservations.length,
        pendingReservations: mockReservations.filter(r => r.trangThai === 'Chờ xử lý').length,
        notifiedReservations: mockReservations.filter(r => r.trangThai === 'Đã thông báo').length,
        completedReservations: mockReservations.filter(r => r.trangThai === 'Đã nhận').length,
        cancelledReservations: mockReservations.filter(r => r.trangThai === 'Đã hủy').length,
        expiredReservations: mockReservations.filter(r => {
          const today = new Date();
          const deadline = new Date(r.hanLaySach);
          return deadline < today && r.trangThai === 'Đã thông báo';
        }).length
      };
      setStatistics(stats);
    } catch (error) {
      showToast('Lỗi khi tải thống kê', 'error');
    }
  };

  const filterReservations = () => {
    let filtered = reservations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.tenDG?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.maDG?.toString().includes(searchTerm) ||
        reservation.tenSach?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.maSach?.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.trangThai === statusFilter);
    }

    setFilteredReservations(filtered);
  };

  const handleCreateReservation = async () => {
    try {
      const newReservationData = {
        ...newReservation,
        id: reservations.length + 1,
        nguoiXuLy: null,
        ngayXuLy: null
      };

      setReservations([newReservationData, ...reservations]);
      setShowCreateModal(false);
      resetNewReservationForm();
      showToast('Đã tạo phiếu đặt trước thành công!', 'success');
    } catch (error) {
      showToast('Lỗi khi tạo phiếu đặt trước', 'error');
    }
  };

  const handleNotifyReader = async (reservationId) => {
    try {
      setReservations(prev => 
        prev.map(r => 
          r.id === reservationId 
            ? { 
                ...r, 
                trangThai: 'Đã thông báo',
                ngayXuLy: new Date().toISOString().split('T')[0],
                nguoiXuLy: 'Thủ thư hiện tại',
                ghiChu: 'Đã thông báo cho độc giả'
              }
            : r
        )
      );
      showToast('Đã thông báo cho độc giả thành công!', 'success');
    } catch (error) {
      showToast('Lỗi khi thông báo cho độc giả', 'error');
    }
  };

  const handleConfirmReceived = async (reservationId) => {
    try {
      setReservations(prev => 
        prev.map(r => 
          r.id === reservationId 
            ? { 
                ...r, 
                trangThai: 'Đã nhận',
                ngayXuLy: new Date().toISOString().split('T')[0],
                nguoiXuLy: 'Thủ thư hiện tại',
                ghiChu: 'Độc giả đã nhận sách'
              }
            : r
        )
      );
      showToast('Đã xác nhận độc giả nhận sách!', 'success');
    } catch (error) {
      showToast('Lỗi khi xác nhận nhận sách', 'error');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      setReservations(prev => 
        prev.map(r => 
          r.id === reservationId 
            ? { 
                ...r, 
                trangThai: 'Đã hủy',
                ngayXuLy: new Date().toISOString().split('T')[0],
                nguoiXuLy: 'Thủ thư hiện tại',
                ghiChu: 'Đã hủy đặt trước'
              }
            : r
        )
      );
      showToast('Đã hủy đặt trước thành công!', 'success');
    } catch (error) {
      showToast('Lỗi khi hủy đặt trước', 'error');
    }
  };

  const resetNewReservationForm = () => {
    setNewReservation({
      maDG: '',
      tenDG: '',
      maSach: '',
      tenSach: '',
      ngayDatTruoc: new Date().toISOString().split('T')[0],
      hanLaySach: '',
      ghiChu: '',
      trangThai: 'Chờ xử lý'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Chờ xử lý': { class: 'status-pending', icon: <FaClock />, text: 'Chờ xử lý' },
      'Đã thông báo': { class: 'status-notified', icon: <FaBell />, text: 'Đã thông báo' },
      'Đã nhận': { class: 'status-completed', icon: <FaCheckCircle />, text: 'Đã nhận' },
      'Đã hủy': { class: 'status-cancelled', icon: <FaTimes />, text: 'Đã hủy' }
    };

    const config = statusConfig[status] || statusConfig['Chờ xử lý'];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const isExpired = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const exportReservationReport = () => {
    // Implement export functionality
    showToast('Đang xuất báo cáo đặt trước...', 'info');
  };

  if (loading) {
    return (
      <div className="book-reservation-management">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="book-reservation-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaFileAlt />
            Quản Lý Đặt Trước Sách
          </h1>
          <p className="page-description">
            Quản lý và xử lý các yêu cầu đặt trước sách của độc giả
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <FaPlus />
            Tạo Phiếu Đặt Trước
          </button>
          <button className="btn btn-secondary" onClick={loadReservations}>
            <FaSync />
            Làm Mới
          </button>
          <button className="btn btn-outline" onClick={exportReservationReport}>
            <FaPrint />
            Xuất Báo Cáo
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>Tổng đặt trước</h3>
            <p className="stat-number">{statistics?.totalReservations || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>Chờ xử lý</h3>
            <p className="stat-number">{statistics?.pendingReservations || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaBell />
          </div>
          <div className="stat-content">
            <h3>Đã thông báo</h3>
            <p className="stat-number">{statistics?.notifiedReservations || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Đã nhận</h3>
            <p className="stat-number">{statistics?.completedReservations || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaTimes />
          </div>
          <div className="stat-content">
            <h3>Đã hủy</h3>
            <p className="stat-number">{statistics?.cancelledReservations || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>Quá hạn</h3>
            <p className="stat-number">{statistics?.expiredReservations || 0}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên độc giả, mã sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ xử lý">Chờ xử lý</option>
            <option value="Đã thông báo">Đã thông báo</option>
            <option value="Đã nhận">Đã nhận</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="reservations-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Độc giả</th>
              <th>Sách</th>
              <th>Ngày đặt trước</th>
              <th>Hạn lấy sách</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation, index) => (
              <tr key={reservation.id} className={isExpired(reservation.hanLaySach) && reservation.trangThai === 'Đã thông báo' ? 'expired-row' : ''}>
                <td>{index + 1}</td>
                <td>
                  <div className="member-info">
                    <span className="member-name">{reservation.tenDG}</span>
                    <span className="member-id">({reservation.maDG})</span>
                  </div>
                </td>
                <td>
                  <div className="book-info">
                    <span className="book-title">{reservation.tenSach}</span>
                    <span className="book-id">({reservation.maSach})</span>
                  </div>
                </td>
                <td>{formatDate(reservation.ngayDatTruoc)}</td>
                <td className={isExpired(reservation.hanLaySach) ? 'expired-date' : ''}>
                  {formatDate(reservation.hanLaySach)}
                  {isExpired(reservation.hanLaySach) && <FaExclamationTriangle className="expired-icon" />}
                </td>
                <td>{getStatusBadge(reservation.trangThai)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon" 
                      title="Xem chi tiết"
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowDetailModal(true);
                      }}
                    >
                      <FaEye />
                    </button>
                    
                    {reservation.trangThai === 'Chờ xử lý' && (
                      <>
                        <button 
                          className="btn-icon btn-success" 
                          title="Thông báo độc giả"
                          onClick={() => handleNotifyReader(reservation.id)}
                        >
                          <FaBell />
                        </button>
                        <button 
                          className="btn-icon btn-danger" 
                          title="Hủy đặt trước"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    
                    {reservation.trangThai === 'Đã thông báo' && (
                      <>
                        <button 
                          className="btn-icon btn-success" 
                          title="Xác nhận nhận sách"
                          onClick={() => handleConfirmReceived(reservation.id)}
                        >
                          <FaCheckCircle />
                        </button>
                        <button 
                          className="btn-icon btn-danger" 
                          title="Hủy đặt trước"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    
                    <button className="btn-icon" title="Chỉnh sửa">
                      <FaEdit />
                    </button>
                    <button className="btn-icon btn-danger" title="Xóa">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Reservation Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Tạo Phiếu Đặt Trước</h2>
              <button 
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Mã độc giả:</label>
                  <input
                    type="text"
                    value={newReservation.maDG}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, maDG: e.target.value }))}
                    placeholder="Nhập mã độc giả"
                  />
                </div>
                
                <div className="form-group">
                  <label>Tên độc giả:</label>
                  <input
                    type="text"
                    value={newReservation.tenDG}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, tenDG: e.target.value }))}
                    placeholder="Nhập tên độc giả"
                  />
                </div>
                
                <div className="form-group">
                  <label>Mã sách:</label>
                  <input
                    type="text"
                    value={newReservation.maSach}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, maSach: e.target.value }))}
                    placeholder="Nhập mã sách"
                  />
                </div>
                
                <div className="form-group">
                  <label>Tên sách:</label>
                  <input
                    type="text"
                    value={newReservation.tenSach}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, tenSach: e.target.value }))}
                    placeholder="Nhập tên sách"
                  />
                </div>
                
                <div className="form-group">
                  <label>Ngày đặt trước:</label>
                  <input
                    type="date"
                    value={newReservation.ngayDatTruoc}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, ngayDatTruoc: e.target.value }))}
                  />
                </div>
                
                <div className="form-group">
                  <label>Hạn lấy sách:</label>
                  <input
                    type="date"
                    value={newReservation.hanLaySach}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, hanLaySach: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Ghi chú:</label>
                <textarea
                  value={newReservation.ghiChu}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, ghiChu: e.target.value }))}
                  placeholder="Ghi chú về đặt trước"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Hủy
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCreateReservation}
              >
                Tạo phiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Detail Modal */}
      {showDetailModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chi Tiết Đặt Trước</h2>
              <button 
                className="btn-close"
                onClick={() => setShowDetailModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="reservation-detail">
                <div className="detail-section">
                  <h3>Thông tin độc giả</h3>
                  <div className="detail-row">
                    <span className="label">Mã độc giả:</span>
                    <span className="value">{selectedReservation.maDG}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Tên độc giả:</span>
                    <span className="value">{selectedReservation.tenDG}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Thông tin sách</h3>
                  <div className="detail-row">
                    <span className="label">Mã sách:</span>
                    <span className="value">{selectedReservation.maSach}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Tên sách:</span>
                    <span className="value">{selectedReservation.tenSach}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Thông tin đặt trước</h3>
                  <div className="detail-row">
                    <span className="label">Ngày đặt trước:</span>
                    <span className="value">{formatDate(selectedReservation.ngayDatTruoc)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Hạn lấy sách:</span>
                    <span className="value">
                      {formatDate(selectedReservation.hanLaySach)}
                      {isExpired(selectedReservation.hanLaySach) && (
                        <span className="expired-warning"> (Quá hạn)</span>
                      )}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Trạng thái:</span>
                    <span className="value">{getStatusBadge(selectedReservation.trangThai)}</span>
                  </div>
                  {selectedReservation.nguoiXuLy && (
                    <div className="detail-row">
                      <span className="label">Người xử lý:</span>
                      <span className="value">{selectedReservation.nguoiXuLy}</span>
                    </div>
                  )}
                  {selectedReservation.ngayXuLy && (
                    <div className="detail-row">
                      <span className="label">Ngày xử lý:</span>
                      <span className="value">{formatDate(selectedReservation.ngayXuLy)}</span>
                    </div>
                  )}
                  {selectedReservation.ghiChu && (
                    <div className="detail-row">
                      <span className="label">Ghi chú:</span>
                      <span className="value">{selectedReservation.ghiChu}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReservationManagement; 