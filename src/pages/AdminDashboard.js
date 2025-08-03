/**
 * AdminDashboard - Dashboard tổng hợp cho Admin
 */
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaBook, 
  FaExchangeAlt, 
  FaMoneyBillWave, 
  FaExclamationTriangle,
  FaServer,
  FaChartLine,
  FaEye,
  FaCog,
  FaDatabase,
  FaShieldAlt
} from 'react-icons/fa';
import { adminService } from '../services';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load all dashboard data in parallel
      const [overviewResult, statusResult, analyticsResult] = await Promise.all([
        adminService.getAdminOverview(),
        adminService.getSystemStatus(),
        adminService.getAnalytics(selectedPeriod)
      ]);
      
      setOverviewData(overviewResult);
      setSystemStatus(statusResult);
      setAnalytics(analyticsResult);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      setError('Không thể tải dữ liệu dashboard. Đang hiển thị dữ liệu fallback.');
      
      // Fallback to default data
      const fallbackOverview = adminService.createFallbackAdminOverview();
      setOverviewData(fallbackOverview);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const StatCard = ({ icon, title, value, color, subtitle, trend, isCurrency = false }) => (
    <div className="admin-stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">
          {isCurrency ? formatCurrency(value) : formatNumber(value)}
        </p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        {trend !== undefined && (
          <p className={`stat-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
            {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  );

  const SystemHealthCard = ({ title, status, details, icon }) => (
    <div className={`system-health-card ${status}`}>
      <div className="health-header">
        <div className="health-icon">{icon}</div>
        <h3>{title}</h3>
        <div className={`health-status ${status}`}>
          {status === 'healthy' ? '🟢' : status === 'warning' ? '🟡' : '🔴'}
        </div>
      </div>
      <div className="health-details">
        {Object.entries(details || {}).map(([key, value]) => (
          <div key={key} className="health-detail">
            <span className="detail-label">{key}:</span>
            <span className="detail-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
        </div>
      )}
      
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Tổng quan hệ thống thư viện</p>
        </div>
        <div className="header-controls">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-selector"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
        </div>
      </div>

      {/* Core Statistics */}
      <div className="stats-section">
        <h2 className="section-title">Thống kê tổng quan</h2>
        <div className="stats-grid">
          <StatCard
            icon={<FaBook />}
            title="Tổng số sách"
            value={overviewData?.coreStats?.totalBooks || 0}
            color="#4caf50"
            subtitle="Trong thư viện"
          />

          <StatCard
            icon={<FaUsers />}
            title="Tổng độc giả"
            value={overviewData?.coreStats?.totalReaders || 0}
            color="#2196f3"
            subtitle="Đã đăng ký"
            trend={overviewData?.growth?.readerGrowth}
          />

          <StatCard
            icon={<FaExchangeAlt />}
            title="Mượn đang hoạt động"
            value={overviewData?.coreStats?.activeBorrows || 0}
            color="#ff9800"
            subtitle="Sách đang được mượn"
          />

          <StatCard
            icon={<FaMoneyBillWave />}
            title="Doanh thu tháng"
            value={overviewData?.financial?.monthlyRevenue || 0}
            color="#9c27b0"
            subtitle="VNĐ"
            trend={overviewData?.financial?.revenueGrowth}
            isCurrency={true}
          />

          <StatCard
            icon={<FaExclamationTriangle />}
            title="Sách quá hạn"
            value={overviewData?.coreStats?.overdueBorrows || 0}
            color="#f44336"
            subtitle="Cần xử lý"
          />

          <StatCard
            icon={<FaUsers />}
            title="Người dùng hệ thống"
            value={overviewData?.coreStats?.totalUsers || 0}
            color="#00bcd4"
            subtitle="Tài khoản"
          />
        </div>
      </div>

      {/* System Health */}
      <div className="system-health-section">
        <h2 className="section-title">Tình trạng hệ thống</h2>
        <div className="health-grid">
          <SystemHealthCard
            title="Cơ sở dữ liệu"
            status={systemStatus?.database?.status || 'unknown'}
            details={{
              'Kết nối': systemStatus?.database?.connectionStatus || 'unknown',
              'Thời gian phản hồi': systemStatus?.database?.responseTime || 'unknown',
              'Backup gần nhất': systemStatus?.database?.lastBackup ? 
                new Date(systemStatus.database.lastBackup).toLocaleString('vi-VN') : 'Chưa có'
            }}
            icon={<FaDatabase />}
          />

          <SystemHealthCard
            title="Máy chủ"
            status={systemStatus?.server?.status || 'unknown'}
            details={{
              'Uptime': systemStatus?.server?.uptime || 'unknown',
              'CPU': systemStatus?.server?.cpuUsage || 'unknown',
              'Memory': systemStatus?.server?.memoryUsage || 'unknown'
            }}
            icon={<FaServer />}
          />

          <SystemHealthCard
            title="Bảo mật"
            status={systemStatus?.security?.vulnerabilities === 0 ? 'healthy' : 'warning'}
            details={{
              'Scan gần nhất': systemStatus?.security?.lastSecurityScan ? 
                new Date(systemStatus.security.lastSecurityScan).toLocaleDateString('vi-VN') : 'Chưa scan',
              'Lỗ hổng': systemStatus?.security?.vulnerabilities || 0,
              'Phiên hoạt động': systemStatus?.security?.activeUserSessions || 0
            }}
            icon={<FaShieldAlt />}
          />

          <SystemHealthCard
            title="Hiệu suất"
            status={systemStatus?.performance?.systemLoad === 'low' ? 'healthy' : 'warning'}
            details={{
              'Phản hồi TB': systemStatus?.performance?.averageResponseTime || 'unknown',
              'Requests/phút': systemStatus?.performance?.requestsPerMinute || 0,
              'Tỷ lệ lỗi': systemStatus?.performance?.errorRate || '0%'
            }}
            icon={<FaChartLine />}
          />
        </div>
      </div>

      {/* Insights and Analytics */}
      <div className="insights-section">
        <div className="insights-left">
          <h2 className="section-title">Sách phổ biến</h2>
          <div className="popular-books">
            {overviewData?.insights?.popularBooks?.length > 0 ? (
              overviewData.insights.popularBooks.map((book, index) => (
                <div key={book.bookId} className="popular-book-item">
                  <span className="book-rank">#{index + 1}</span>
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                    <span className="borrow-count">{book.borrowCount} lượt mượn</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        <div className="insights-right">
          <h2 className="section-title">Người dùng tích cực</h2>
          <div className="active-users">
            {overviewData?.insights?.activeUsers?.length > 0 ? (
              overviewData.insights.activeUsers.map((user) => (
                <div key={user.id} className="active-user-item">
                  <div className="user-info">
                    <h4>{user.name}</h4>
                    <p>{user.memberType} - {user.totalBorrows} lượt mượn</p>
                    <span className="join-date">
                      Tham gia: {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activities-section">
        <h2 className="section-title">Hoạt động gần đây</h2>
        <div className="activity-list">
          {overviewData?.insights?.recentActivities?.length > 0 ? (
            overviewData.insights.recentActivities.map((activity, index) => (
              <div key={activity.id || index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  <FaExchangeAlt />
                </div>
                <div className="activity-content">
                  <p className="activity-description">{activity.description}</p>
                  <p className="activity-user">Bởi: {activity.user}</p>
                  <span className="activity-time">
                    {new Date(activity.date).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className={`activity-status ${activity.status}`}>
                  {activity.status === 'DangMuon' ? 'Đang mượn' : 
                   activity.status === 'DaTra' ? 'Đã trả' : activity.status}
                </div>
              </div>
            ))
          ) : (
            <p>Chưa có hoạt động nào</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Thao tác nhanh</h2>
        <div className="actions-grid">
          <button 
            className="action-button"
            onClick={() => window.location.href = '/users'}
          >
            <FaUsers />
            <span>Quản lý người dùng</span>
          </button>

          <button 
            className="action-button"
            onClick={() => window.location.href = '/backup'}
          >
            <FaDatabase />
            <span>Sao lưu dữ liệu</span>
          </button>

          <button 
            className="action-button"
            onClick={() => window.location.href = '/demo/admin-test'}
          >
            <FaCog />
            <span>Test APIs</span>
          </button>

          <button 
            className="action-button"
            onClick={() => window.location.href = '/books'}
          >
            <FaBook />
            <span>Quản lý sách</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;