import React, { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaChartLine,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaReceipt,
  FaCreditCard,
  FaUsers,
  FaBook,
  FaChartBar,
  FaDownload,
  FaPlus,
  FaEye,
} from "react-icons/fa";
import { accountantService } from '../../services';
import "./AccountantDashboard.css";

const AccountantDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingFines: 0,
    overdueFines: 0,
    todayTransactions: 0,
    monthlyTransactions: 0,
    totalMembers: 0,
    activeMembers: 0,
    totalBooks: 0,
    availableBooks: 0,
  });
  const [financialData, setFinancialData] = useState({
    income: 0,
    expenses: 0,
    profit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const dashboardData = await accountantService.getDashboardSummary();
      
      setStats(dashboardData.stats);
      setFinancialData(dashboardData.financialData);
      setRecentTransactions(dashboardData.recentTransactions);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError('Không thể tải dữ liệu dashboard. Đang hiển thị dữ liệu fallback.');
      
      // Fallback to default data
      const fallbackData = accountantService.createFallbackDashboardData();
      setStats(fallbackData.stats);
      setFinancialData(fallbackData.financialData);
      setRecentTransactions(fallbackData.recentTransactions);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  const StatCard = ({
    icon,
    title,
    value,
    color,
    subtitle,
    isCurrency = false,
    isNumber = false,
  }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div
        className="stat-icon"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">
          {isCurrency
            ? formatCurrency(value)
            : isNumber
            ? formatNumber(value)
            : value}
        </p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  const OverviewCard = ({ title, value, type, description, icon }) => (
    <div className={`overview-card ${type}`}>
      <div className="overview-header">
        <div className="overview-icon">{icon}</div>
        <h3>{title}</h3>
      </div>
      <div className={`overview-amount ${type}`}>{formatCurrency(value)}</div>
      <p className="overview-description">{description}</p>
    </div>
  );

  const QuickActionCard = ({ icon, title, description, onClick }) => (
    <button className="quick-action-card" onClick={onClick}>
      <div className="action-icon">{icon}</div>
      <div className="action-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </button>
  );

  const TransactionItem = ({ type, title, amount, time, icon }) => (
    <div className="transaction-item">
      <div className={`transaction-icon ${type}`}>{icon}</div>
      <div className="transaction-content">
        <p className="transaction-title">{title}</p>
        <p className={`transaction-amount ${type}`}>
          {type === "income" ? "+" : "-"}
          {formatCurrency(Math.abs(amount))}
        </p>
        <p className="transaction-time">{time}</p>
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
      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
        </div>
      )}
      
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard - Accountant</h1>
          <p>Quản lý tài chính và thu chi thư viện</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <FaDownload /> Xuất báo cáo
          </button>
          <button className="btn-primary">
            <FaPlus /> Tạo giao dịch mới
          </button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="stats-section">
        <h2 className="section-title">Thống kê tổng quan</h2>
        <div className="stats-grid">
          <StatCard
            icon={<FaMoneyBillWave />}
            title="TỔNG DOANH THU"
            value={stats.totalRevenue}
            color="#10b981"
            subtitle="Từ đầu năm"
            isCurrency={true}
          />

          <StatCard
            icon={<FaChartLine />}
            title="DOANH THU THÁNG"
            value={stats.monthlyRevenue}
            color="#3b82f6"
            subtitle="Tháng hiện tại"
            isCurrency={true}
          />

          <StatCard
            icon={<FaExclamationTriangle />}
            title="TIỀN PHẠT CHỜ THU"
            value={stats.pendingFines}
            color="#f59e0b"
            subtitle="Cần thu hồi"
            isCurrency={true}
          />

          <StatCard
            icon={<FaCalendarAlt />}
            title="TIỀN PHẠT QUÁ HẠN"
            value={stats.overdueFines}
            color="#ef4444"
            subtitle="Quá hạn > 30 ngày"
            isCurrency={true}
          />

          <StatCard
            icon={<FaReceipt />}
            title="GIAO DỊCH HÔM NAY"
            value={stats.todayTransactions}
            color="#8b5cf6"
            subtitle="Số giao dịch"
            isNumber={true}
          />

          <StatCard
            icon={<FaCreditCard />}
            title="GIAO DỊCH THÁNG"
            value={stats.monthlyTransactions}
            color="#06b6d4"
            subtitle="Tháng hiện tại"
            isNumber={true}
          />
        </div>
      </div>

      {/* Financial Overview & Quick Actions */}
      <div className="dashboard-main">
        <div className="main-left">
          {/* Financial Overview */}
          <div className="financial-overview">
            <h2 className="section-title">Báo cáo tài chính</h2>
            <div className="overview-grid">
              <OverviewCard
                title="THU NHẬP"
                value={financialData.income}
                type="income"
                description="Phí mượn sách, phí thành viên"
                icon={<FaMoneyBillWave />}
              />

              <OverviewCard
                title="CHI PHÍ"
                value={financialData.expenses}
                type="expenses"
                description="Mua sách mới, bảo trì"
                icon={<FaBook />}
              />

              <OverviewCard
                title="LỢI NHUẬN"
                value={financialData.profit}
                type="profit"
                description="Thu nhập ròng"
                icon={<FaChartBar />}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Thao tác nhanh</h2>
            <div className="actions-grid">
              <QuickActionCard
                icon={<FaReceipt />}
                title="Tạo hóa đơn"
                description="Tạo hóa đơn mới cho thành viên"
                onClick={() => console.log("Create invoice")}
              />
              <QuickActionCard
                icon={<FaMoneyBillWave />}
                title="Thu phí mượn"
                description="Xử lý thanh toán phí mượn sách"
                onClick={() => console.log("Collect fees")}
              />
              <QuickActionCard
                icon={<FaExclamationTriangle />}
                title="Xử lý tiền phạt"
                description="Quản lý tiền phạt quá hạn"
                onClick={() => console.log("Process fines")}
              />
              <QuickActionCard
                icon={<FaChartBar />}
                title="Báo cáo tài chính"
                description="Xem báo cáo chi tiết"
                onClick={() => console.log("View reports")}
              />
            </div>
          </div>
        </div>

        <div className="main-right">
          {/* Member & Book Stats */}
          <div className="secondary-stats">
            <h2 className="section-title">Thống kê khác</h2>
            <div className="secondary-stats-grid">
              <div className="secondary-stat-card">
                <div className="secondary-stat-icon">
                  <FaUsers />
                </div>
                <div className="secondary-stat-content">
                  <h4>Tổng thành viên</h4>
                  <p className="secondary-stat-value">
                    {formatNumber(stats.totalMembers)}
                  </p>
                  <p className="secondary-stat-subtitle">
                    Đang hoạt động: {formatNumber(stats.activeMembers)}
                  </p>
                </div>
              </div>

              <div className="secondary-stat-card">
                <div className="secondary-stat-icon">
                  <FaBook />
                </div>
                <div className="secondary-stat-content">
                  <h4>Tổng sách</h4>
                  <p className="secondary-stat-value">
                    {formatNumber(stats.totalBooks)}
                  </p>
                  <p className="secondary-stat-subtitle">
                    Có sẵn: {formatNumber(stats.availableBooks)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="recent-transactions">
            <div className="transactions-header">
              <h2 className="section-title">Giao dịch gần đây</h2>
              <button className="btn-text">
                <FaEye /> Xem tất cả
              </button>
            </div>
            <div className="transaction-list">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <TransactionItem
                    key={transaction.id || index}
                    type={transaction.type}
                    title={transaction.title}
                    amount={transaction.amount}
                    time={transaction.time}
                    icon={transaction.type === 'fine' ? <FaExclamationTriangle /> : <FaMoneyBillWave />}
                  />
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  <p>Chưa có giao dịch gần đây</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;
