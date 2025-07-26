import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaChartLine, FaExclamationTriangle, FaCalendarAlt, FaReceipt, FaCreditCard } from 'react-icons/fa';
import './AccountantDashboard.css';

const AccountantDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingFines: 0,
    overdueFines: 0,
    todayTransactions: 0,
    monthlyTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for accountant dashboard
      setStats({
        totalRevenue: 12500000, // 12.5M VND
        monthlyRevenue: 2500000, // 2.5M VND
        pendingFines: 850000, // 850K VND
        overdueFines: 1200000, // 1.2M VND
        todayTransactions: 45,
        monthlyTransactions: 320
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const StatCard = ({ icon, title, value, color, subtitle, isCurrency = false }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{isCurrency ? formatCurrency(value) : value}</p>
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
    <div className="accountant-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard - Kế toán</h1>
        <p>Quản lý tài chính và thu chi thư viện</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<FaMoneyBillWave />}
          title="Tổng doanh thu"
          value={stats.totalRevenue}
          color="#4CAF50"
          subtitle="Từ đầu năm"
          isCurrency={true}
        />
        
        <StatCard
          icon={<FaChartLine />}
          title="Doanh thu tháng"
          value={stats.monthlyRevenue}
          color="#2196F3"
          subtitle="Tháng hiện tại"
          isCurrency={true}
        />
        
        <StatCard
          icon={<FaExclamationTriangle />}
          title="Tiền phạt chờ thu"
          value={stats.pendingFines}
          color="#FF9800"
          subtitle="Cần thu hồi"
          isCurrency={true}
        />
        
        <StatCard
          icon={<FaCalendarAlt />}
          title="Tiền phạt quá hạn"
          value={stats.overdueFines}
          color="#F44336"
          subtitle="Quá hạn > 30 ngày"
          isCurrency={true}
        />
        
        <StatCard
          icon={<FaReceipt />}
          title="Giao dịch hôm nay"
          value={stats.todayTransactions}
          color="#9C27B0"
          subtitle="Số giao dịch"
        />
        
        <StatCard
          icon={<FaCreditCard />}
          title="Giao dịch tháng"
          value={stats.monthlyTransactions}
          color="#00BCD4"
          subtitle="Tháng hiện tại"
        />
      </div>

      <div className="financial-overview">
        <div className="overview-section">
          <h2>Báo cáo tài chính</h2>
          <div className="overview-grid">
            <div className="overview-card income">
              <h3>Thu nhập</h3>
              <div className="overview-amount positive">
                {formatCurrency(stats.monthlyRevenue)}
              </div>
              <p>Phí mượn sách, phí thành viên</p>
            </div>
            
            <div className="overview-card expenses">
              <h3>Chi phí</h3>
              <div className="overview-amount negative">
                {formatCurrency(1800000)}
              </div>
              <p>Mua sách mới, bảo trì</p>
            </div>
            
            <div className="overview-card profit">
              <h3>Lợi nhuận</h3>
              <div className="overview-amount positive">
                {formatCurrency(stats.monthlyRevenue - 1800000)}
              </div>
              <p>Thu nhập ròng</p>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Thao tác nhanh</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <FaReceipt />
            <span>Tạo hóa đơn</span>
          </button>
          <button className="action-btn">
            <FaMoneyBillWave />
            <span>Thu phí mượn</span>
          </button>
          <button className="action-btn">
            <FaExclamationTriangle />
            <span>Xử lý tiền phạt</span>
          </button>
          <button className="action-btn">
            <FaChartLine />
            <span>Báo cáo tài chính</span>
          </button>
        </div>
      </div>

      <div className="recent-transactions">
        <h2>Giao dịch gần đây</h2>
        <div className="transaction-list">
          <div className="transaction-item">
            <div className="transaction-icon income">
              <FaMoneyBillWave />
            </div>
            <div className="transaction-content">
              <p className="transaction-text">Nguyễn Văn A - Phí mượn sách</p>
              <p className="transaction-amount positive">+50,000 VND</p>
              <p className="transaction-time">2 phút trước</p>
            </div>
          </div>
          
          <div className="transaction-item">
            <div className="transaction-icon expense">
              <FaExclamationTriangle />
            </div>
            <div className="transaction-content">
              <p className="transaction-text">Trần Thị B - Tiền phạt quá hạn</p>
              <p className="transaction-amount negative">-25,000 VND</p>
              <p className="transaction-time">15 phút trước</p>
            </div>
          </div>
          
          <div className="transaction-item">
            <div className="transaction-icon income">
              <FaMoneyBillWave />
            </div>
            <div className="transaction-content">
              <p className="transaction-text">Lê Văn C - Phí thành viên</p>
              <p className="transaction-amount positive">+200,000 VND</p>
              <p className="transaction-time">1 giờ trước</p>
            </div>
          </div>
          
          <div className="transaction-item">
            <div className="transaction-icon expense">
              <FaReceipt />
            </div>
            <div className="transaction-content">
              <p className="transaction-text">Mua sách mới - "Machine Learning"</p>
              <p className="transaction-amount negative">-150,000 VND</p>
              <p className="transaction-time">2 giờ trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard; 