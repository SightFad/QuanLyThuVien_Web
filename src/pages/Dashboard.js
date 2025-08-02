import React, { useState, useEffect } from "react";
import {
  FaBook,
  FaUsers,
  FaChartLine,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaDownload,
  FaPrint,
  FaBell,
  FaSearch,
  FaFilter,
  FaSync,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaChartPie,
  FaChartArea,
  FaDatabase,
  FaServer,
  FaShieldAlt,
  FaUserPlus,
  FaFileAlt,
  FaCog,
  FaHistory,
} from "react-icons/fa";
import { useToast } from "../hooks";
import {
  PageHeader,
  StatsGrid,
  StatCard,
  ContentSection,
  CardsGrid,
  Card,
  Button,
  Badge,
} from "../components/LayoutComponents";
import "./Dashboard.css";

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    totalBooks: 2847,
    totalReaders: 1256,
    totalBorrows: 342,
    totalRevenue: 8500000,
    overdueBooks: 23,
    pendingReservations: 15,
    activeViolations: 8,
    monthlyGrowth: 12.5,
    weeklyGrowth: 8.3,
    dailyGrowth: 3.2,
    newMembers: 45,
    returnedBooks: 156,
  });
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "borrow",
      title: 'Nguyễn Văn An mượn sách "Toán học cao cấp"',
      time: "5 phút trước",
      status: "success",
      icon: <FaBook />,
    },
    {
      id: 2,
      type: "return",
      title: 'Trần Thị Bình trả sách "Văn học Việt Nam thế kỷ XX"',
      time: "12 phút trước",
      status: "success",
      icon: <FaCheckCircle />,
    },
    {
      id: 3,
      type: "violation",
      title: 'Lê Văn Cường vi phạm trễ hạn trả sách "Lịch sử Đảng"',
      time: "25 phút trước",
      status: "warning",
      icon: <FaExclamationTriangle />,
    },
    {
      id: 4,
      type: "reservation",
      title: 'Phạm Thị Dung đặt trước sách "Khoa học máy tính cơ bản"',
      time: "1 giờ trước",
      status: "info",
      icon: <FaClock />,
    },
    {
      id: 5,
      type: "revenue",
      title: "Thu phí mượn sách: 75,000 VNĐ từ Reader Nguyễn Văn E",
      time: "2 giờ trước",
      status: "success",
      icon: <FaMoneyBillWave />,
    },
    {
      id: 6,
      type: "member",
      title: "Đăng ký thành viên mới: Hoàng Thị F - Sinh viên ĐH Bách Khoa",
      time: "3 giờ trước",
      status: "info",
      icon: <FaUserPlus />,
    },
  ]);
  const [topBooks, setTopBooks] = useState([
    {
      id: 1,
      title: "Toán học cao cấp",
      author: "GS. Nguyễn Văn A",
      borrowCount: 89,
      category: "Toán học",
      cover: "/images/book-covers/python.jpg",
    },
    {
      id: 2,
      title: "Văn học Việt Nam thế kỷ XX",
      author: "PGS. Trần Thị B",
      borrowCount: 67,
      category: "Văn học",
      cover: "/images/default-book-cover.jpg",
    },
    {
      id: 3,
      title: "Khoa học máy tính cơ bản",
      author: "TS. Lê Văn C",
      borrowCount: 54,
      category: "Công nghệ",
      cover: "/images/default-book-cover.jpg",
    },
    {
      id: 4,
      title: "Lịch sử Đảng Cộng sản Việt Nam",
      author: "GS. Phạm Văn D",
      borrowCount: 43,
      category: "Lịch sử",
      cover: "/images/default-book-cover.jpg",
    },
    {
      id: 5,
      title: "Tiếng Anh giao tiếp",
      author: "ThS. Hoàng Thị E",
      borrowCount: 38,
      category: "Ngoại ngữ",
      cover: "/images/default-book-cover.jpg",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const { showToast } = useToast();

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getActivityStatusClass = (status) => {
    switch (status) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "danger";
      case "info":
        return "info";
      default:
        return "info";
    }
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? (
      <FaArrowUp className="growth-up" />
    ) : (
      <FaArrowDown className="growth-down" />
    );
  };

  const getGrowthClass = (growth) => {
    return growth >= 0 ? "growth-positive" : "growth-negative";
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case "today":
        return "Hôm nay";
      case "week":
        return "7 ngày qua";
      case "month":
        return "Tháng này";
      case "quarter":
        return "Quý này";
      case "year":
        return "Năm nay";
      default:
        return "7 ngày qua";
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner">Đang tải dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Page Header */}
      <PageHeader
        title="Dashboard Tổng Quan"
        subtitle="Theo dõi hoạt động thư viện và các chỉ số quan trọng"
        icon={<FaChartLine />}
      >
        <div className="header-actions">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <Button
            variant="outline"
            onClick={() => showToast("Đang in báo cáo...", "info")}
            icon={<FaPrint />}
          >
            In báo cáo
          </Button>
          <Button
            variant="primary"
            onClick={() => showToast("Đang xuất báo cáo...", "info")}
            icon={<FaDownload />}
          >
            Xuất báo cáo
          </Button>
        </div>
      </PageHeader>

      {/* Statistics Cards */}
      <StatsGrid>
        <StatCard
          icon={<FaBook />}
          title="Tổng số sách"
          value={formatNumber(statistics?.totalBooks || 0)}
          subtitle={`${statistics?.monthlyGrowth >= 0 ? "+" : ""}${
            statistics?.monthlyGrowth || 0
          }% so với tháng trước`}
          trend={statistics?.monthlyGrowth || 0}
          color="primary"
        />

        <StatCard
          icon={<FaUsers />}
          title="Thành viên"
          value={formatNumber(statistics?.totalReaders || 0)}
          subtitle={`${statistics?.weeklyGrowth >= 0 ? "+" : ""}${
            statistics?.weeklyGrowth || 0
          }% so với tuần trước`}
          trend={statistics?.weeklyGrowth || 0}
          color="success"
        />

        <StatCard
          icon={<FaChartLine />}
          title="Sách đang mượn"
          value={formatNumber(statistics?.totalBorrows || 0)}
          subtitle={`${statistics?.dailyGrowth >= 0 ? "+" : ""}${
            statistics?.dailyGrowth || 0
          }% so với hôm qua`}
          trend={statistics?.dailyGrowth || 0}
          color="info"
        />

        <StatCard
          icon={<FaExclamationTriangle />}
          title="Sách quá hạn"
          value={formatNumber(statistics?.overdueBooks || 0)}
          subtitle="Cần xử lý ngay"
          color="danger"
        />
      </StatsGrid>

      {/* Additional Statistics */}
      <StatsGrid>
        <StatCard
          icon={<FaMoneyBillWave />}
          title="Doanh thu tháng"
          value={formatCurrency(statistics?.totalRevenue || 0)}
          subtitle={`${statistics?.monthlyGrowth >= 0 ? "+" : ""}${
            statistics?.monthlyGrowth || 0
          }% so với tháng trước`}
          trend={statistics?.monthlyGrowth || 0}
          color="warning"
        />

        <StatCard
          icon={<FaClock />}
          title="Đặt trước chờ"
          value={formatNumber(statistics?.pendingReservations || 0)}
          subtitle="Cần thông báo"
          color="info"
        />

        <StatCard
          icon={<FaUserPlus />}
          title="Thành viên mới"
          value={formatNumber(statistics?.newMembers || 0)}
          subtitle="Trong tháng này"
          color="success"
        />

        <StatCard
          icon={<FaCheckCircle />}
          title="Sách đã trả"
          value={formatNumber(statistics?.returnedBooks || 0)}
          subtitle="Trong tuần này"
          color="primary"
        />
      </StatsGrid>

      {/* Charts Section */}
      <ContentSection
        title="Biểu đồ thống kê"
        icon={<FaChartBar />}
        actions={
          <div className="chart-actions">
            <Button variant="outline" size="sm" icon={<FaDownload />}>
              Xuất dữ liệu
            </Button>
            <Button variant="outline" size="sm" icon={<FaPrint />}>
              In biểu đồ
            </Button>
          </div>
        }
      >
        <div className="charts-grid">
          <Card>
            <div className="chart-header">
              <h4>Thống kê mượn sách theo tháng</h4>
            </div>
            <div className="chart-placeholder">
              <FaChartBar className="chart-icon" />
              <p>Biểu đồ thống kê mượn sách</p>
              <span>Dữ liệu sẽ được hiển thị ở đây</span>
            </div>
          </Card>

          <Card>
            <div className="chart-header">
              <h4>Phân bố sách theo danh mục</h4>
            </div>
            <div className="chart-placeholder">
              <FaChartPie className="chart-icon" />
              <p>Biểu đồ phân bố danh mục</p>
              <span>Dữ liệu sẽ được hiển thị ở đây</span>
            </div>
          </Card>
        </div>
      </ContentSection>

      {/* Content Grid */}
      <CardsGrid>
        {/* Recent Activities */}
        <Card>
          <div className="card-header">
            <h3>Hoạt động gần đây</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Xem tất cả hoạt động", "info")}
              icon={<FaEye />}
            >
              Xem tất cả
            </Button>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className={`activity-item ${getActivityStatusClass(
                  activity.status
                )}`}
              >
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Books */}
        <Card>
          <div className="card-header">
            <h3>Sách được mượn nhiều nhất</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Xem chi tiết", "info")}
              icon={<FaEye />}
            >
              Xem chi tiết
            </Button>
          </div>
          <div className="top-books-list">
            {topBooks.map((book, index) => (
              <div key={book.id} className="book-item">
                <div className="book-rank">#{index + 1}</div>
                <div className="book-cover">
                  <img
                    src={book.cover || "/images/default-book-cover.jpg"}
                    alt={book.title}
                  />
                </div>
                <div className="book-info">
                  <h4 className="book-title">{book.title}</h4>
                  <p className="book-author">{book.author}</p>
                  <Badge variant="info" size="sm">
                    {book.category}
                  </Badge>
                </div>
                <div className="book-stats">
                  <span className="borrow-count">
                    {book.borrowCount} lượt mượn
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="card-header">
            <h3>Thao tác nhanh</h3>
            <span className="card-subtitle">Các chức năng thường dùng</span>
          </div>
          <div className="quick-actions">
            <Button
              variant="outline"
              className="quick-action-btn"
              onClick={() => showToast("Thêm sách mới", "info")}
              icon={<FaPlus />}
            >
              Thêm sách mới
            </Button>
            <Button
              variant="outline"
              className="quick-action-btn"
              onClick={() => showToast("Đăng ký thành viên", "info")}
              icon={<FaUserPlus />}
            >
              Đăng ký thành viên
            </Button>
            <Button
              variant="outline"
              className="quick-action-btn"
              onClick={() => showToast("Quản lý mượn trả", "info")}
              icon={<FaBook />}
            >
              Mượn/Trả sách
            </Button>
            <Button
              variant="outline"
              className="quick-action-btn"
              onClick={() => showToast("Xem báo cáo", "info")}
              icon={<FaFileAlt />}
            >
              Xem báo cáo
            </Button>
            <Button
              variant="outline"
              className="quick-action-btn"
              onClick={() => showToast("Cài đặt hệ thống", "info")}
              icon={<FaCog />}
            >
              Cài đặt hệ thống
            </Button>
            <Button
              variant="outline"
              className="quick-action-btn"
              onClick={() => showToast("Lịch sử hoạt động", "info")}
              icon={<FaHistory />}
            >
              Lịch sử hoạt động
            </Button>
          </div>
        </Card>

        {/* System Status */}
        <Card>
          <div className="card-header">
            <h3>Trạng thái hệ thống</h3>
          </div>
          <div className="system-status">
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Hệ thống hoạt động bình thường</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Cơ sở dữ liệu kết nối ổn định</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Backup tự động hoạt động</span>
            </div>
            <div className="status-item">
              <div className="status-indicator warning"></div>
              <span>23 sách quá hạn cần xử lý</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>15 đặt trước chờ thông báo</span>
            </div>
          </div>
        </Card>
      </CardsGrid>
    </div>
  );
};

export default Dashboard;
