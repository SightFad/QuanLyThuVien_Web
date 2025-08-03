import React, { useState, useEffect } from 'react';
import { 
  FaBook, FaUsers, FaExchangeAlt, FaChartLine, FaArrowUp, FaArrowDown,
  FaCalendarAlt, FaBell, FaEye, FaDownload, FaSearch, FaFilter,
  FaClock, FaCheckCircle, FaExclamationTriangle, FaHeart, FaPlus,
  FaChartBar, FaChartPie, FaChartArea, FaPrint, FaShare, FaMoneyBillWave
} from 'react-icons/fa';
import { apiRequest } from '../config/api';
import './ModernDashboard.css';

const ModernDashboard = ({ userRole = 'Admin' }) => {
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [selectedChart, setSelectedChart] = useState('borrows');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/api/Dashboard/summary');
      setStats({
        totalBooks: data.totalBooks || 0,
        totalMembers: data.totalMembers || 0,
        activeBorrows: data.activeBorrows || 0,
        overdueBooks: data.overdueBooks || 0,
        monthlyGrowth: data.monthlyGrowth || {
          books: 0,
          members: 0,
          borrows: 0,
          revenue: 0
        },
        revenue: data.revenue || {
          monthly: 0,
          weekly: 0,
          daily: 0
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback data
      setStats({
        totalBooks: 0,
        totalMembers: 0,
        activeBorrows: 0,
        overdueBooks: 0,
        monthlyGrowth: { books: 0, members: 0, borrows: 0, revenue: 0 },
        revenue: { monthly: 0, weekly: 0, daily: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: <FaBook />, label: 'Thêm sách mới', action: () => {}, color: 'primary', path: '/books' },
    { icon: <FaUsers />, label: 'Đăng ký thành viên', action: () => {}, color: 'success', path: '/readers' },
    { icon: <FaExchangeAlt />, label: 'Mượn/Trả sách', action: () => {}, color: 'warning', path: '/borrows' },
    { icon: <FaChartLine />, label: 'Xem báo cáo', action: () => {}, color: 'info', path: '/reports' },
  ];

  const [recentActivities, setRecentActivities] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivities();
    fetchPopularBooks();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      const data = await apiRequest('/api/Dashboard/recent-activities');
      const activities = data.map(activity => ({
        id: activity.id,
        type: activity.type,
        user: activity.user,
        book: activity.book,
        time: new Date(activity.time).toLocaleString('vi-VN'),
        status: activity.status === 'Đang mượn' ? 'success' : 'warning',
        icon: activity.type === 'borrow' ? <FaBook /> : <FaExchangeAlt />
      }));
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      setRecentActivities([]);
    }
  };

  const fetchPopularBooks = async () => {
    try {
      const data = await apiRequest('/api/Dashboard/popular-books');
      const books = data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        borrows: book.borrows,
        trend: 'up',
        cover: book.cover || '/images/book-covers/default.jpg'
      }));
      setPopularBooks(books);
      } catch (error) {
    console.error('Error fetching popular books:', error);
    setPopularBooks([]);
  }
};

const chartData = {
    borrows: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      data: [120, 190, 300, 500, 200, 300, 450]
    },
    revenue: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      data: [1500000, 2200000, 1800000, 3200000, 2800000, 3500000, 4200000]
    },
    members: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      data: [50, 80, 120, 150, 200, 250, 300]
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner-lg"></div>
        <div className="loading-text">Đang tải dashboard...</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <FaArrowUp className="text-green-600" />;
      case 'down': return <FaArrowDown className="text-red-600" />;
      default: return <span className="text-gray-400">-</span>;
    }
  };

  return (
    <div className="main-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FaChartLine className="mr-3" />
            Dashboard Tổng quan
          </h1>
          <p className="page-subtitle">
            Theo dõi hoạt động thư viện và các chỉ số quan trọng
          </p>
        </div>
        <div className="page-actions">
          <select 
            className="filter-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="3months">3 tháng qua</option>
            <option value="1year">1 năm qua</option>
          </select>
          <button className="btn btn-secondary">
            <FaPrint />
            In báo cáo
          </button>
          <button className="btn btn-primary">
            <FaDownload />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-auto-fit gap-6 mb-8">
        <div className="stats-card">
          <div className="stats-icon" style={{background: 'var(--gradient-brand)'}}>
            <FaBook />
          </div>
          <div>
            <div className="stats-value">{stats.totalBooks?.toLocaleString()}</div>
            <div className="stats-label">Tổng số sách</div>
            <div className={`flex items-center gap-2 mt-2 text-sm ${stats.monthlyGrowth?.books > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.monthlyGrowth?.books > 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(stats.monthlyGrowth?.books)}% so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon" style={{background: 'var(--gradient-success)'}}>
            <FaUsers />
          </div>
          <div>
            <div className="stats-value">{stats.totalMembers?.toLocaleString()}</div>
            <div className="stats-label">Thành viên</div>
            <div className={`flex items-center gap-2 mt-2 text-sm ${stats.monthlyGrowth?.members > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.monthlyGrowth?.members > 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(stats.monthlyGrowth?.members)}% so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon" style={{background: 'var(--gradient-warning)'}}>
            <FaExchangeAlt />
          </div>
          <div>
            <div className="stats-value">{stats.activeBorrows?.toLocaleString()}</div>
            <div className="stats-label">Sách đang mượn</div>
            <div className={`flex items-center gap-2 mt-2 text-sm ${stats.monthlyGrowth?.borrows > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.monthlyGrowth?.borrows > 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(stats.monthlyGrowth?.borrows)}% so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon" style={{background: 'var(--gradient-error)'}}>
            <FaExclamationTriangle />
          </div>
          <div>
            <div className="stats-value">{stats.overdueBooks?.toLocaleString()}</div>
            <div className="stats-label">Sách quá hạn</div>
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <FaClock />
              <span>Cần xử lý ngay</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="content-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Thao tác nhanh</h2>
              <p className="section-subtitle">Các chức năng thường dùng</p>
            </div>
          </div>
          <div className="section-body">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`quick-action-card bg-${action.color}-50 hover:bg-${action.color}-100 border-${action.color}-200`}
                  onClick={action.action}
                >
                  <div className={`quick-action-icon text-${action.color}-600`}>
                    {action.icon}
                  </div>
                  <span className="quick-action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="content-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Hoạt động gần đây</h2>
              <p className="section-subtitle">Cập nhật mới nhất</p>
            </div>
            <button className="btn btn-sm btn-outline">
              <FaEye />
              Xem tất cả
            </button>
          </div>
          <div className="section-body">
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${getStatusColor(activity.status)}`}>
                    {activity.icon}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {activity.user} - {activity.book}
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                  <div className={`activity-status ${getStatusColor(activity.status)}`}>
                    {activity.type === 'borrow' && 'Mượn sách'}
                    {activity.type === 'return' && 'Trả sách'}
                    {activity.type === 'overdue' && 'Quá hạn'}
                    {activity.type === 'new_member' && 'Thành viên mới'}
                    {activity.type === 'fine_payment' && 'Thanh toán phạt'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Books */}
        <div className="content-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Sách phổ biến</h2>
              <p className="section-subtitle">Top sách được mượn nhiều</p>
            </div>
            <button className="btn btn-sm btn-outline">
              <FaChartBar />
              Chi tiết
            </button>
          </div>
          <div className="section-body">
            <div className="popular-books-list">
              {popularBooks.map((book, index) => (
                <div key={book.id} className="popular-book-item">
                  <div className="book-rank">#{index + 1}</div>
                  <div className="book-cover">
                    <img src={book.cover || '/images/default-book-cover.jpg'} alt={book.title} />
                  </div>
                  <div className="book-info">
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">{book.author}</div>
                    <div className="book-stats">
                      <span className="book-borrows">{book.borrows} lượt mượn</span>
                      {getTrendIcon(book.trend)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="content-section mt-8">
        <div className="section-header">
          <div>
            <h2 className="section-title">Biểu đồ thống kê</h2>
            <p className="section-subtitle">Phân tích xu hướng hoạt động</p>
          </div>
          <div className="chart-controls">
            <button 
              className={`btn btn-sm ${selectedChart === 'borrows' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedChart('borrows')}
            >
              <FaChartBar />
              Mượn sách
            </button>
            <button 
              className={`btn btn-sm ${selectedChart === 'revenue' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedChart('revenue')}
            >
              <FaChartLine />
              Doanh thu
            </button>
            <button 
              className={`btn btn-sm ${selectedChart === 'members' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedChart('members')}
            >
              <FaUsers />
              Thành viên
            </button>
          </div>
        </div>
        <div className="section-body">
          <div className="chart-container">
            <div className="chart-placeholder">
              <FaChartArea className="chart-icon" />
              <h3>Biểu đồ {selectedChart === 'borrows' ? 'Mượn sách' : selectedChart === 'revenue' ? 'Doanh thu' : 'Thành viên'}</h3>
              <p>Dữ liệu thống kê theo thời gian</p>
              <div className="chart-data">
                {chartData[selectedChart]?.data.map((value, index) => (
                  <div key={index} className="chart-bar" style={{height: `${(value / Math.max(...chartData[selectedChart].data)) * 100}%`}}>
                    <span className="chart-value">{selectedChart === 'revenue' ? `${(value/1000000).toFixed(1)}M` : value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="content-section">
          <div className="section-header">
            <h3 className="section-title">Doanh thu tháng</h3>
          </div>
          <div className="section-body">
            <div className="revenue-card">
              <div className="revenue-amount">{stats.revenue?.monthly?.toLocaleString()} VNĐ</div>
              <div className="revenue-label">Tổng doanh thu</div>
              <div className="revenue-growth text-green-600">
                <FaArrowUp />
                +{stats.monthlyGrowth?.revenue}% so với tháng trước
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h3 className="section-title">Doanh thu tuần</h3>
          </div>
          <div className="section-body">
            <div className="revenue-card">
              <div className="revenue-amount">{stats.revenue?.weekly?.toLocaleString()} VNĐ</div>
              <div className="revenue-label">Doanh thu tuần này</div>
              <div className="revenue-growth text-blue-600">
                <FaChartLine />
                Trung bình tuần
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h3 className="section-title">Doanh thu ngày</h3>
          </div>
          <div className="section-body">
            <div className="revenue-card">
              <div className="revenue-amount">{stats.revenue?.daily?.toLocaleString()} VNĐ</div>
              <div className="revenue-label">Doanh thu hôm nay</div>
              <div className="revenue-growth text-orange-600">
                <FaCalendarAlt />
                Cập nhật real-time
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;