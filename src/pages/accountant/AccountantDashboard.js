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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for accountant dashboard
      const mockStats = {
        totalRevenue: 12500000, // 12.5M VND
        monthlyRevenue: 2500000, // 2.5M VND
        pendingFines: 850000, // 850K VND
        overdueFines: 1200000, // 1.2M VND
        todayTransactions: 45,
        monthlyTransactions: 320,
        totalMembers: 1250,
        activeMembers: 980,
        totalBooks: 8500,
        availableBooks: 7200,
      };

      const mockFinancialData = {
        income: 2500000,
        expenses: 1800000,
        profit: 700000,
      };

      setStats(mockStats);
      setFinancialData(mockFinancialData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
              <TransactionItem
                type="income"
                title="Nguyễn Văn A - Phí mượn sách"
                amount={50000}
                time="2 phút trước"
                icon={<FaMoneyBillWave />}
              />

              <TransactionItem
                type="income"
                title="Trần Thị B - Tiền phạt quá hạn"
                amount={25000}
                time="15 phút trước"
                icon={<FaExclamationTriangle />}
              />

              <TransactionItem
                type="income"
                title="Lê Văn C - Phí thành viên"
                amount={200000}
                time="1 giờ trước"
                icon={<FaMoneyBillWave />}
              />

              <TransactionItem
                type="expenses"
                title="Mua sách mới - Machine Learning"
                amount={150000}
                time="2 giờ trước"
                icon={<FaBook />}
              />

              <TransactionItem
                type="income"
                title="Phạm Thị D - Gia hạn thẻ"
                amount={100000}
                time="3 giờ trước"
                icon={<FaCreditCard />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;
