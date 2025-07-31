import React, { useState, useEffect } from 'react';
import { 
  FaBook, FaUsers, FaExchangeAlt, FaChartLine, FaArrowUp, FaArrowDown,
  FaCalendarAlt, FaBell, FaEye, FaDownload, FaSearch, FaFilter,
  FaClock, FaCheckCircle, FaExclamationTriangle, FaHeart
} from 'react-icons/fa';

const ModernDashboard = ({ userRole = 'Admin' }) => {
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats({
        totalBooks: 15420,
        totalMembers: 3248,
        activeBorrows: 892,
        overdueBooks: 23,
        monthlyGrowth: {
          books: 12.5,
          members: 8.3,
          borrows: -2.1,
          revenue: 15.7
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    { icon: <FaBook />, label: 'Thêm sách mới', action: () => {}, color: 'primary' },
    { icon: <FaUsers />, label: 'Đăng ký thành viên', action: () => {}, color: 'success' },
    { icon: <FaExchangeAlt />, label: 'Mượn/Trả sách', action: () => {}, color: 'warning' },
    { icon: <FaChartLine />, label: 'Xem báo cáo', action: () => {}, color: 'info' },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'borrow',
      user: 'Nguyễn Văn A',
      book: 'Lập trình Python',
      time: '5 phút trước',
      status: 'success'
    },
    {
      id: 2,
      type: 'return',
      user: 'Trần Thị B',
      book: 'Machine Learning',
      time: '15 phút trước',
      status: 'success'
    },
    {
      id: 3,
      type: 'overdue',
      user: 'Lê Văn C',
      book: 'React JS Guide',
      time: '1 giờ trước',
      status: 'warning'
    },
    {
      id: 4,
      type: 'new_member',
      user: 'Phạm Thị D',
      book: '',
      time: '2 giờ trước',
      status: 'info'
    }
  ];

  const popularBooks = [
    { id: 1, title: 'Lập trình Python', author: 'Nguyễn Văn X', borrows: 145, trend: 'up' },
    { id: 2, title: 'Machine Learning', author: 'Trần Thị Y', borrows: 132, trend: 'up' },
    { id: 3, title: 'React JS Guide', author: 'Lê Văn Z', borrows: 98, trend: 'down' },
    { id: 4, title: 'Database Design', author: 'Phạm Thị A', borrows: 87, trend: 'up' },
    { id: 5, title: 'Web Development', author: 'Hoàng Văn B', borrows: 76, trend: 'same' },
  ];

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner-lg"></div>
        <div className="loading-text">Đang tải dashboard...</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FaChartLine />
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
                  <span className={`text-${action.color}-700 font-medium`}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="content-section lg:col-span-2">
          <div className="section-header">
            <div>
              <h2 className="section-title">Hoạt động gần đây</h2>
              <p className="section-subtitle">Các giao dịch mới nhất</p>
            </div>
            <button className="btn btn-ghost">
              <FaEye />
              Xem tất cả
            </button>
          </div>
          <div className="section-body">
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon status-${activity.status}`}>
                    {activity.type === 'borrow' && <FaBook />}
                    {activity.type === 'return' && <FaCheckCircle />}
                    {activity.type === 'overdue' && <FaExclamationTriangle />}
                    {activity.type === 'new_member' && <FaUsers />}
                  </div>
                  <div className="activity-content">
                    <div className="activity-main">
                      <span className="font-medium">{activity.user}</span>
                      {activity.type === 'borrow' && ' đã mượn '}
                      {activity.type === 'return' && ' đã trả '}
                      {activity.type === 'overdue' && ' quá hạn trả '}
                      {activity.type === 'new_member' && ' đã đăng ký thành viên'}
                      {activity.book && <span className="font-medium">"{activity.book}"</span>}
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                  <div className={`activity-status status-${activity.status}`}>
                    {activity.status === 'success' && <FaCheckCircle />}
                    {activity.status === 'warning' && <FaExclamationTriangle />}
                    {activity.status === 'info' && <FaBell />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Books */}
      <div className="content-section mt-6">
        <div className="section-header">
          <div>
            <h2 className="section-title">Sách được mượn nhiều nhất</h2>
            <p className="section-subtitle">Top 5 sách phổ biến trong tháng</p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-ghost">
              <FaFilter />
              Bộ lọc
            </button>
            <button className="btn btn-ghost">
              <FaSearch />
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="section-body">
          <div className="popular-books-grid">
            {popularBooks.map((book, index) => (
              <div key={book.id} className="popular-book-card">
                <div className="book-rank">#{index + 1}</div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">Tác giả: {book.author}</p>
                  <div className="book-stats">
                    <span className="borrow-count">
                      <FaHeart className="text-red-500" />
                      {book.borrows} lượt mượn
                    </span>
                    <div className={`trend-indicator trend-${book.trend}`}>
                      {book.trend === 'up' && <FaArrowUp />}
                      {book.trend === 'down' && <FaArrowDown />}
                      {book.trend === 'same' && <span>—</span>}
                    </div>
                  </div>
                </div>
                <button className="btn btn-sm btn-ghost">
                  <FaEye />
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;