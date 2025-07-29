import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaBook, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import './ReaderReservations.css';

const ReaderReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReservations([
        {
          id: 1,
          bookTitle: 'Đắc Nhân Tâm',
          author: 'Dale Carnegie',
          isbn: '978-604-1-00001-1',
          reservationDate: '2024-01-15',
          expectedAvailableDate: '2024-01-20',
          status: 'pending',
          priority: 1
        },
        {
          id: 2,
          bookTitle: 'Nhà Giả Kim',
          author: 'Paulo Coelho',
          isbn: '978-604-1-00002-2',
          reservationDate: '2024-01-10',
          expectedAvailableDate: '2024-01-18',
          status: 'ready',
          priority: 2
        },
        {
          id: 3,
          bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
          author: 'Rosie Nguyễn',
          isbn: '978-604-1-00003-3',
          reservationDate: '2024-01-12',
          expectedAvailableDate: '2024-01-25',
          status: 'cancelled',
          priority: 3
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCancelReservation = (id) => {
    setReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status: 'cancelled' } : res
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Chờ sách', class: 'status-pending', icon: <FaClock /> },
      ready: { text: 'Sẵn sàng', class: 'status-ready', icon: <FaCheck /> },
      cancelled: { text: 'Đã hủy', class: 'status-cancelled', icon: <FaTimes /> }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="reader-reservations">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="reader-reservations">
      <div className="page-header">
        <h1><FaCalendarAlt /> Quản lý đặt sách</h1>
        <p>Theo dõi và quản lý các yêu cầu đặt sách của bạn</p>
      </div>

      <div className="reservations-stats">
        <div className="stat-card">
          <div className="stat-number">{reservations.filter(r => r.status === 'pending').length}</div>
          <div className="stat-label">Đang chờ</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reservations.filter(r => r.status === 'ready').length}</div>
          <div className="stat-label">Sẵn sàng</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reservations.filter(r => r.status === 'cancelled').length}</div>
          <div className="stat-label">Đã hủy</div>
        </div>
      </div>

      <div className="reservations-list">
        <h2>Danh sách đặt sách</h2>
        
        {reservations.length === 0 ? (
          <div className="empty-state">
            <FaBook />
            <p>Bạn chưa có yêu cầu đặt sách nào</p>
          </div>
        ) : (
          <div className="reservations-grid">
            {reservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-header">
                  <h3>{reservation.bookTitle}</h3>
                  {getStatusBadge(reservation.status)}
                </div>
                
                <div className="reservation-details">
                  <div className="detail-item">
                    <span className="label">Tác giả:</span>
                    <span className="value">{reservation.author}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">ISBN:</span>
                    <span className="value">{reservation.isbn}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Ngày đặt:</span>
                    <span className="value">{reservation.reservationDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Dự kiến có sách:</span>
                    <span className="value">{reservation.expectedAvailableDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Thứ tự ưu tiên:</span>
                    <span className="value">#{reservation.priority}</span>
                  </div>
                </div>

                <div className="reservation-actions">
                  {reservation.status === 'pending' && (
                    <button 
                      className="btn-cancel"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      <FaTimes /> Hủy đặt sách
                    </button>
                  )}
                  {reservation.status === 'ready' && (
                    <button className="btn-primary">
                      <FaCheck /> Nhận sách
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reservation-info">
        <h3>Thông tin về đặt sách</h3>
        <ul>
          <li>Bạn có thể đặt tối đa 3 cuốn sách cùng lúc</li>
          <li>Sách sẽ được giữ trong 3 ngày kể từ khi có sẵn</li>
          <li>Bạn sẽ nhận được thông báo khi sách sẵn sàng</li>
          <li>Có thể hủy đặt sách bất cứ lúc nào</li>
        </ul>
      </div>
    </div>
  );
};

export default ReaderReservations; 