import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaBell, FaTimes, FaCheck } from 'react-icons/fa';
import { mockReservationData, mockMembers, mockBooks } from '../../data/mockData';
import './ReservationManagement.css';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReservations(mockReservationData);
      setFilteredReservations(mockReservationData);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, statusFilter, reservations]);

  const filterReservations = () => {
    let filtered = reservations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.tenDocGia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.tenSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.idDocGia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.idSach.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.trangThai === statusFilter);
    }

    setFilteredReservations(filtered);
  };

  const handleStatusChange = (reservationId, newStatus) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, trangThai: newStatus }
          : reservation
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending">Chờ xử lý</span>;
      case 'notified':
        return <span className="status-badge notified">Đã thông báo</span>;
      case 'cancelled':
        return <span className="status-badge cancelled">Đã hủy</span>;
      default:
        return <span className="status-badge">Không xác định</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaBell className="status-icon pending" />;
      case 'notified':
        return <FaCheck className="status-icon notified" />;
      case 'cancelled':
        return <FaTimes className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const handleAddReservation = () => {
    setShowAddModal(true);
  };

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  const handleDeleteReservation = (reservationId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu đặt trước này?')) {
      setReservations(prev => prev.filter(reservation => reservation.id !== reservationId));
    }
  };

  if (loading) {
    return (
      <div className="reservation-management">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-management">
      <div className="page-header">
        <h1>
          <FaBell className="header-icon" />
          Quản Lý Đặt Trước Sách
        </h1>
        <p>Quản lý các yêu cầu đặt trước sách từ thành viên thư viện</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên thành viên, tên sách, mã thành viên, mã sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="notified">Đã thông báo</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <button className="add-button" onClick={handleAddReservation}>
            <FaPlus />
            Thêm Đặt Trước
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaBell />
          </div>
          <div className="stat-content">
            <h3>{reservations.filter(r => r.trangThai === 'pending').length}</h3>
            <p>Chờ xử lý</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon notified">
            <FaCheck />
          </div>
          <div className="stat-content">
            <h3>{reservations.filter(r => r.trangThai === 'notified').length}</h3>
            <p>Đã thông báo</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cancelled">
            <FaTimes />
          </div>
          <div className="stat-content">
            <h3>{reservations.filter(r => r.trangThai === 'cancelled').length}</h3>
            <p>Đã hủy</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total">
            <FaBell />
          </div>
          <div className="stat-content">
            <h3>{reservations.length}</h3>
            <p>Tổng cộng</p>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã thành viên</th>
              <th>Họ tên</th>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Ngày đặt trước</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  <div className="no-data-content">
                    <FaBell className="no-data-icon" />
                    <p>Không có phiếu đặt trước nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredReservations.map((reservation, index) => (
                <tr key={reservation.id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="member-id">{reservation.idDocGia}</span>
                  </td>
                  <td>
                    <span className="member-name">{reservation.tenDocGia}</span>
                  </td>
                  <td>
                    <span className="book-id">{reservation.idSach}</span>
                  </td>
                  <td>
                    <span className="book-title">{reservation.tenSach}</span>
                  </td>
                  <td>
                    <span className="reservation-date">
                      {new Date(reservation.ngayDatTruoc).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td>
                    <div className="status-cell">
                      {getStatusIcon(reservation.trangThai)}
                      {getStatusBadge(reservation.trangThai)}
                    </div>
                  </td>
                  <td>
                    <span className="notes">{reservation.ghiChu}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        title="Xem chi tiết"
                        onClick={() => handleEditReservation(reservation)}
                      >
                        <FaEye />
                        <span className="btn-text">Xem</span>
                      </button>
                      
                      {reservation.trangThai === 'pending' && (
                        <>
                          <button
                            className="action-btn notify-btn"
                            title="Đánh dấu đã thông báo"
                            onClick={() => handleStatusChange(reservation.id, 'notified')}
                          >
                            <FaBell />
                            <span className="btn-text">Thông báo</span>
                          </button>
                          <button
                            className="action-btn cancel-btn"
                            title="Hủy đặt trước"
                            onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                          >
                            <FaTimes />
                            <span className="btn-text">Hủy</span>
                          </button>
                        </>
                      )}
                      
                      {reservation.trangThai === 'notified' && (
                        <button
                          className="action-btn cancel-btn"
                          title="Hủy đặt trước"
                          onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                        >
                          <FaTimes />
                          <span className="btn-text">Hủy</span>
                        </button>
                      )}
                      
                      <button
                        className="action-btn delete-btn"
                        title="Xóa"
                        onClick={() => handleDeleteReservation(reservation.id)}
                      >
                        <FaTrash />
                        <span className="btn-text">Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal would go here */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Thêm Phiếu Đặt Trước</h2>
            {/* Add form content here */}
            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Hủy</button>
              <button className="primary">Thêm</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Chi Tiết Phiếu Đặt Trước</h2>
            <div className="reservation-details">
              <div className="detail-row">
                <label>Mã thành viên:</label>
                <span>{selectedReservation.idDocGia}</span>
              </div>
              <div className="detail-row">
                <label>Họ tên:</label>
                <span>{selectedReservation.tenDocGia}</span>
              </div>
              <div className="detail-row">
                <label>Mã sách:</label>
                <span>{selectedReservation.idSach}</span>
              </div>
              <div className="detail-row">
                <label>Tên sách:</label>
                <span>{selectedReservation.tenSach}</span>
              </div>
              <div className="detail-row">
                <label>Ngày đặt trước:</label>
                <span>{new Date(selectedReservation.ngayDatTruoc).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="detail-row">
                <label>Trạng thái:</label>
                <span>{getStatusBadge(selectedReservation.trangThai)}</span>
              </div>
              <div className="detail-row">
                <label>Ghi chú:</label>
                <span>{selectedReservation.ghiChu}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement; 