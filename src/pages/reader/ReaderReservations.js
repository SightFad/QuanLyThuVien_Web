import React, { useState, useEffect } from 'react';
import { 
  FaClock, 
  FaCheckCircle, 
  FaTimes, 
  FaBook, 
  FaUser, 
  FaCalendar,
  FaMapMarkerAlt,
  FaTrash,
  FaEye
} from 'react-icons/fa';
import { useToast } from '../../hooks';
import { readerService, userService } from '../../services';
import './ReaderReservations.css';

const ReaderReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [borrowTickets, setBorrowTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations');
  const [cancelling, setCancelling] = useState({});
  
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load reservations using readerService
      const reservationsData = await readerService.getReservations();
      setReservations(reservationsData);

      // Load borrow tickets (if available in readerService)
      // For now, we'll use the current borrows from dashboard
      try {
        const dashboardData = await readerService.getDashboard();
        setBorrowTickets(dashboardData.currentBorrows || []);
      } catch (error) {
        console.error('Error loading borrow tickets:', error);
        setBorrowTickets([]);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Lỗi khi tải dữ liệu', 'error');
      
      // Fallback to empty arrays
      setReservations([]);
      setBorrowTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      setCancelling(prev => ({ ...prev, [reservationId]: true }));
      
      // Cancel reservation using readerService
      await readerService.cancelReservation(reservationId);
      showToast('Hủy đặt trước thành công!', 'success');
      
      // Refresh data
      await loadData();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      showToast(error.message || 'Có lỗi xảy ra khi hủy đặt trước', 'error');
    } finally {
      setCancelling(prev => ({ ...prev, [reservationId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đang chờ':
      case 'pending':
        return <span className="badge badge-warning">Đang chờ</span>;
      case 'Đã xử lý':
      case 'approved':
        return <span className="badge badge-success">Đã xử lý</span>;
      case 'Quá hạn':
      case 'expired':
        return <span className="badge badge-danger">Quá hạn</span>;
      case 'Đã hủy':
      case 'cancelled':
        return <span className="badge badge-secondary">Đã hủy</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const getBorrowStatusBadge = (status, daysLeft) => {
    if (daysLeft < 0) {
      return <span className="badge badge-danger">Quá hạn</span>;
    } else if (daysLeft <= 3) {
      return <span className="badge badge-warning">Sắp hạn</span>;
    } else {
      return <span className="badge badge-success">Bình thường</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysLeft = (returnDate) => {
    if (!returnDate) return 0;
    const today = new Date();
    const returnDateObj = new Date(returnDate);
    const diffTime = returnDateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="reader-reservations">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-reservations">
      <div className="page-header">
        <h1><FaClock /> Quản lý đặt trước và mượn sách</h1>
        <p>Theo dõi trạng thái đặt trước và sách đang mượn</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          <FaClock /> Đặt trước ({reservations.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'borrows' ? 'active' : ''}`}
          onClick={() => setActiveTab('borrows')}
        >
          <FaBook /> Đang mượn ({borrowTickets.length})
        </button>
      </div>

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Danh sách đặt trước</h2>
            <p>Quản lý các yêu cầu đặt trước sách của bạn</p>
          </div>

          {reservations.length === 0 ? (
            <div className="empty-state">
              <FaClock />
              <h3>Chưa có đặt trước nào</h3>
              <p>Bạn chưa có yêu cầu đặt trước sách nào</p>
            </div>
          ) : (
            <div className="reservations-grid">
              {reservations.map(reservation => (
                <div key={reservation.id || reservation.maPhieuDat} className="reservation-card">
                  <div className="reservation-header">
                    <div className="reservation-info">
                      <h3>{reservation.bookTitle || reservation.tenSach}</h3>
                      <p className="author">{reservation.author || reservation.tacGia}</p>
                    </div>
                    {getStatusBadge(reservation.status || reservation.trangThai)}
                  </div>

                  <div className="reservation-details">
                    <div className="detail-row">
                      <span className="label">Ngày đặt:</span>
                      <span className="value">{formatDate(reservation.reservationDate || reservation.ngayDat)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Mã đặt trước:</span>
                      <span className="value">{reservation.id || reservation.maPhieuDat}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Thể loại:</span>
                      <span className="value">{reservation.category || reservation.theLoai}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Vị trí:</span>
                      <span className="value">{reservation.location || reservation.viTriLuuTru}</span>
                    </div>
                  </div>

                  <div className="reservation-actions">
                    {(reservation.status === 'Đang chờ' || reservation.status === 'pending') && (
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleCancelReservation(reservation.id || reservation.maPhieuDat)}
                        disabled={cancelling[reservation.id || reservation.maPhieuDat]}
                      >
                        <FaTrash />
                        {cancelling[reservation.id || reservation.maPhieuDat] ? 'Đang hủy...' : 'Hủy đặt trước'}
                      </button>
                    )}
                    
                    <button className="btn btn-secondary">
                      <FaEye /> Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Borrows Tab */}
      {activeTab === 'borrows' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Sách đang mượn</h2>
            <p>Danh sách sách bạn đang mượn và thời hạn trả</p>
          </div>

          {borrowTickets.length === 0 ? (
            <div className="empty-state">
              <FaBook />
              <h3>Chưa có sách đang mượn</h3>
              <p>Bạn chưa mượn sách nào</p>
            </div>
          ) : (
            <div className="borrows-grid">
              {borrowTickets.map(borrow => {
                const daysLeft = getDaysLeft(borrow.returnDate);
                return (
                  <div key={borrow.id || borrow.phieuMuonId} className="borrow-card">
                    <div className="borrow-header">
                      <div className="borrow-info">
                        <h3>{borrow.bookTitle}</h3>
                        <p className="author">{borrow.author}</p>
                      </div>
                      {getBorrowStatusBadge(borrow.status, daysLeft)}
                    </div>

                    <div className="borrow-details">
                      <div className="detail-row">
                        <span className="label">Ngày mượn:</span>
                        <span className="value">{formatDate(borrow.borrowDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Hạn trả:</span>
                        <span className="value">{formatDate(borrow.returnDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Thời gian còn lại:</span>
                        <span className={`value ${daysLeft < 0 ? 'text-danger' : daysLeft <= 3 ? 'text-warning' : 'text-success'}`}>
                          {daysLeft < 0 ? `Quá hạn ${Math.abs(daysLeft)} ngày` : 
                           daysLeft === 0 ? 'Hạn trả hôm nay' : 
                           `Còn ${daysLeft} ngày`}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Vị trí:</span>
                        <span className="value">{borrow.location}</span>
                      </div>
                    </div>

                    <div className="borrow-actions">
                      <button className="btn btn-primary">
                        <FaCalendar /> Gia hạn
                      </button>
                      <button className="btn btn-secondary">
                        <FaEye /> Xem chi tiết
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReaderReservations; 