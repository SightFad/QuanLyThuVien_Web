import React, { useState, useEffect } from 'react';
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
  FaChartArea
} from 'react-icons/fa';
import { useToast } from '../hooks';
import './Dashboard.css';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const { showToast } = useToast();

  // Mock data for demonstration
  const mockStatistics = {
    totalBooks: 1250,
    totalReaders: 450,
    totalBorrows: 89,
    totalRevenue: 2500000,
    overdueBooks: 12,
    pendingReservations: 8,
    activeViolations: 5,
    monthlyGrowth: 15.5,
    weeklyGrowth: 8.2,
    dailyGrowth: 2.1
  };

  const mockRecentActivities = [
    {
      id: 1,
      type: 'borrow',
      title: 'Nguyễn Văn A mượn sách "Sách Giáo Khoa Toán 12"',
      time: '2 phút trước',
      status: 'success',
      icon: <FaBook />
    },
    {
      id: 2,
      type: 'return',
      title: 'Trần Thị B trả sách "Sách Văn Học Việt Nam"',
      time: '15 phút trước',
      status: 'success',
      icon: <FaCheckCircle />
    },
    {
      id: 3,
      type: 'violation',
      title: 'Lê Văn D vi phạm trễ hạn trả sách',
      time: '1 giờ trước',
      status: 'warning',
      icon: <FaExclamationTriangle />
    },
    {
      id: 4,
      type: 'reservation',
      title: 'Phạm Thị E đặt trước sách "Sách Khoa Học Tự Nhiên"',
      time: '2 giờ trước',
      status: 'info',
      icon: <FaClock />
    },
    {
      id: 5,
      type: 'revenue',
      title: 'Thu phí mượn sách: 50,000 VNĐ',
      time: '3 giờ trước',
      status: 'success',
      icon: <FaMoneyBillWave />
    }
  ];

  const mockTopBooks = [
    {
      id: 1,
      title: 'Sách Giáo Khoa Toán 12',
      author: 'Bộ Giáo dục',
      borrowCount: 25,
      category: 'Giáo khoa',
      cover: '/images/book-covers/math12.jpg'
    },
    {
      id: 2,
      title: 'Sách Văn Học Việt Nam',
      author: 'Nhiều tác giả',
      borrowCount: 20,
      category: 'Văn học',
      cover: '/images/book-covers/vietnam-literature.jpg'
    },
    {
      id: 3,
      title: 'Sách Lịch Sử Thế Giới',
      author: 'Nhiều tác giả',
      borrowCount: 18,
      category: 'Lịch sử',
      cover: '/images/book-covers/world-history.jpg'
    },
    {
      id: 4,
      title: 'Sách Khoa Học Tự Nhiên',
      author: 'Nhiều tác giả',
      borrowCount: 15,
      category: 'Khoa học',
      cover: '/images/book-covers/natural-science.jpg'
    },
    {
      id: 5,
      title: 'Sách Tiếng Anh',
      author: 'Nhiều tác giả',
      borrowCount: 12,
      category: 'Ngoại ngữ',
      cover: '/images/book-covers/english.jpg'
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStatistics(mockStatistics);
        setRecentActivities(mockRecentActivities);
        setTopBooks(mockTopBooks);
        setLoading(false);
      }, 1000);
    } catch (error) {
      showToast('Lỗi khi tải dữ liệu dashboard', 'error');
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getActivityStatusClass = (status) => {
    const statusClasses = {
      success: 'activity-success',
      warning: 'activity-warning',
      error: 'activity-error',
      info: 'activity-info'
    };
    return statusClasses[status] || 'activity-info';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <FaArrowUp className="growth-up" /> : <FaArrowDown className="growth-down" />;
  };

  const getGrowthClass = (growth) => {
    return growth >= 0 ? 'growth-positive' : 'growth-negative';
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
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaChartLine />
            Dashboard Tổng Quan
          </h1>
          <p className="page-description">
            Tổng quan hoạt động hệ thống quản lý thư viện
          </p>
        </div>
        <div className="header-actions">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <button className="btn btn-secondary" onClick={loadDashboardData}>
            <FaSync />
            Làm Mới
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBook />
          </div>
          <div className="stat-content">
            <h3>Tổng sách</h3>
            <p className="stat-number">{formatNumber(statistics?.totalBooks || 0)}</p>
            <div className={`stat-growth ${getGrowthClass(statistics?.monthlyGrowth || 0)}`}>
              {getGrowthIcon(statistics?.monthlyGrowth || 0)}
              <span>{Math.abs(statistics?.monthlyGrowth || 0)}%</span>
              <span className="growth-label">so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Độc giả</h3>
            <p className="stat-number">{formatNumber(statistics?.totalReaders || 0)}</p>
            <div className={`stat-growth ${getGrowthClass(statistics?.weeklyGrowth || 0)}`}>
              {getGrowthIcon(statistics?.weeklyGrowth || 0)}
              <span>{Math.abs(statistics?.weeklyGrowth || 0)}%</span>
              <span className="growth-label">so với tuần trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Lượt mượn</h3>
            <p className="stat-number">{formatNumber(statistics?.totalBorrows || 0)}</p>
            <div className={`stat-growth ${getGrowthClass(statistics?.dailyGrowth || 0)}`}>
              {getGrowthIcon(statistics?.dailyGrowth || 0)}
              <span>{Math.abs(statistics?.dailyGrowth || 0)}%</span>
              <span className="growth-label">so với hôm qua</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Doanh thu</h3>
            <p className="stat-number">{formatCurrency(statistics?.totalRevenue || 0)}</p>
            <div className={`stat-growth ${getGrowthClass(statistics?.monthlyGrowth || 0)}`}>
              {getGrowthIcon(statistics?.monthlyGrowth || 0)}
              <span>{Math.abs(statistics?.monthlyGrowth || 0)}%</span>
              <span className="growth-label">so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>Sách quá hạn</h3>
            <p className="stat-number">{formatNumber(statistics?.overdueBooks || 0)}</p>
            <div className="stat-trend">
              <span className="trend-label">Cần xử lý</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>Đặt trước chờ</h3>
            <p className="stat-number">{formatNumber(statistics?.pendingReservations || 0)}</p>
            <div className="stat-trend">
              <span className="trend-label">Cần thông báo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Thống kê mượn sách theo tháng</h3>
            <div className="chart-actions">
              <button className="btn-icon" title="Xuất biểu đồ">
                <FaDownload />
              </button>
              <button className="btn-icon" title="In biểu đồ">
                <FaPrint />
              </button>
            </div>
          </div>
          <div className="chart-placeholder">
            <FaChartBar className="chart-icon" />
            <p>Biểu đồ thống kê mượn sách</p>
            <span>Dữ liệu sẽ được hiển thị ở đây</span>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Phân bố sách theo danh mục</h3>
            <div className="chart-actions">
              <button className="btn-icon" title="Xuất biểu đồ">
                <FaDownload />
              </button>
              <button className="btn-icon" title="In biểu đồ">
                <FaPrint />
              </button>
            </div>
          </div>
          <div className="chart-placeholder">
            <FaChartPie className="chart-icon" />
            <p>Biểu đồ phân bố danh mục</p>
            <span>Dữ liệu sẽ được hiển thị ở đây</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Activities */}
        <div className="content-card">
          <div className="card-header">
            <h3>Hoạt động gần đây</h3>
            <button className="btn btn-outline" onClick={() => showToast('Xem tất cả hoạt động', 'info')}>
              <FaEye />
              Xem tất cả
            </button>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`activity-item ${getActivityStatusClass(activity.status)}`}>
                <div className="activity-icon">
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Books */}
        <div className="content-card">
          <div className="card-header">
            <h3>Sách được mượn nhiều nhất</h3>
            <button className="btn btn-outline" onClick={() => showToast('Xem chi tiết', 'info')}>
              <FaEye />
              Xem chi tiết
            </button>
          </div>
          <div className="top-books-list">
            {topBooks.map((book, index) => (
              <div key={book.id} className="book-item">
                <div className="book-rank">#{index + 1}</div>
                <div className="book-cover">
                  <img src={book.cover || '/images/default-book-cover.jpg'} alt={book.title} />
                </div>
                <div className="book-info">
                  <h4 className="book-title">{book.title}</h4>
                  <p className="book-author">{book.author}</p>
                  <span className="book-category">{book.category}</span>
                </div>
                <div className="book-stats">
                  <span className="borrow-count">{book.borrowCount} lượt mượn</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card">
          <div className="card-header">
            <h3>Thao tác nhanh</h3>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => showToast('Thêm sách mới', 'info')}>
              <FaPlus />
              <span>Thêm sách</span>
            </button>
            <button className="quick-action-btn" onClick={() => showToast('Quản lý mượn trả', 'info')}>
              <FaBook />
              <span>Mượn trả</span>
            </button>
            <button className="quick-action-btn" onClick={() => showToast('Quản lý độc giả', 'info')}>
              <FaUsers />
              <span>Độc giả</span>
            </button>
            <button className="quick-action-btn" onClick={() => showToast('Báo cáo', 'info')}>
              <FaChartBar />
              <span>Báo cáo</span>
            </button>
            <button className="quick-action-btn" onClick={() => showToast('Cài đặt', 'info')}>
              <FaFilter />
              <span>Cài đặt</span>
            </button>
            <button className="quick-action-btn" onClick={() => showToast('Thông báo', 'info')}>
              <FaBell />
              <span>Thông báo</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="content-card">
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
              <span>5 sách cần kiểm tra tình trạng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 