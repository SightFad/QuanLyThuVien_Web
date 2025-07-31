import React, { useState, useEffect } from 'react';
import { FaBook, FaUsers, FaExchangeAlt, FaClock, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa';
import './LibrarianDashboard.css';

const LibrarianDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReaders: 0,
    booksBorrowed: 0,
    booksOverdue: 0,
    pendingReturns: 0,
    todayBorrows: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/Dashboard/summary', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalBooks: data.totalBooks || 0,
          totalReaders: data.totalReaders || 0,
          booksBorrowed: data.booksBorrowed || 0,
          booksOverdue: data.booksOverdue || 0,
          pendingReturns: Math.floor(Math.random() * 20) + 5, // Mock data
          todayBorrows: Math.floor(Math.random() * 15) + 3 // Mock data
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="librarian-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard - Thủ thư</h1>
        <p>Quản lý hoạt động thư viện</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<FaBook />}
          title="Tổng số sách"
          value={stats.totalBooks}
          color="#4CAF50"
          subtitle="Sách trong thư viện"
        />
        
        <StatCard
          icon={<FaUsers />}
          title="Tổng độc giả"
          value={stats.totalReaders}
          color="#2196F3"
          subtitle="Độc giả đăng ký"
        />
        
        <StatCard
          icon={<FaExchangeAlt />}
          title="Sách đang mượn"
          value={stats.booksBorrowed}
          color="#FF9800"
          subtitle="Đang được mượn"
        />
        
        <StatCard
          icon={<FaExclamationTriangle />}
          title="Sách quá hạn"
          value={stats.booksOverdue}
          color="#F44336"
          subtitle="Cần thu hồi"
        />
        
        <StatCard
          icon={<FaClock />}
          title="Chờ trả hôm nay"
          value={stats.pendingReturns}
          color="#9C27B0"
          subtitle="Dự kiến trả"
        />
        
        <StatCard
          icon={<FaExchangeAlt />}
          title="Mượn hôm nay"
          value={stats.todayBorrows}
          color="#00BCD4"
          subtitle="Sách mượn mới"
        />
      </div>

      <div className="quick-actions">
        <h2>Thao tác nhanh</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <FaBook />
            <span>Tìm kiếm sách</span>
          </button>
          <button className="action-btn">
            <FaUsers />
            <span>Quản lý thành viên</span>
          </button>
          <button className="action-btn">
            <FaExclamationTriangle />
            <span>Quản lý tiền phạt</span>
          </button>
        </div>
      </div>

      <div className="recent-activities">
        <h2>Hoạt động gần đây</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <FaExclamationTriangle />
            </div>
            <div className="activity-content">
                              <p className="activity-text">Xử lý tiền phạt cho thành viên Nguyễn Văn A</p>
              <p className="activity-time">2 phút trước</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">
              <FaBook />
            </div>
            <div className="activity-content">
                              <p className="activity-text">Tìm kiếm sách "Cơ sở dữ liệu" cho thành viên</p>
              <p className="activity-time">15 phút trước</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">
              <FaFileAlt />
            </div>
            <div className="activity-content">
              <p className="activity-text">Tạo báo cáo thống kê tháng 12</p>
              <p className="activity-time">2 giờ trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard; 