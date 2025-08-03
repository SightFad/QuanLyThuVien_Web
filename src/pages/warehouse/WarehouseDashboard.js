import React, { useState, useEffect } from 'react';
import { FaBoxes, FaTruck, FaClipboardList, FaExclamationTriangle, FaCheckCircle, FaWarehouse } from 'react-icons/fa';
import { warehouseService } from '../../services';
import './WarehouseDashboard.css';

const WarehouseDashboard = () => {
  console.log('=== WarehouseDashboard Component ===');
  console.log('Component is rendering...');
  
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksInStock: 0,
    booksOutOfStock: 0,
    pendingOrders: 0,
    todayDeliveries: 0,
    damagedBooks: 0
  });
  const [overview, setOverview] = useState({
    stockRatio: 0,
    lowStockCount: 0,
    qualityRatio: 100
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState({
    lowStockBooks: [],
    outOfStockBooks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    console.log('WarehouseDashboard fetchDashboardData running...');
    try {
      setLoading(true);
      setError('');
      
      const dashboardData = await warehouseService.getDashboardSummary();
      
      setStats(dashboardData.stats);
      setOverview(dashboardData.overview);
      setRecentActivities(dashboardData.recentActivities);
      setAlerts(dashboardData.alerts);
      
      console.log('WarehouseDashboard data loaded successfully:', dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Không thể tải dữ liệu dashboard. Đang hiển thị dữ liệu fallback.');
      
      // Fallback to default data
      const fallbackData = warehouseService.createFallbackDashboardData();
      setStats(fallbackData.stats);
      setOverview(fallbackData.overview);
      setRecentActivities(fallbackData.recentActivities);
      setAlerts(fallbackData.alerts);
    } finally {
      setLoading(false);
      console.log('WarehouseDashboard loading set to false');
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
      <div className="warehouse-dashboard">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="warehouse-dashboard">
      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
        </div>
      )}
      
      <div className="dashboard-header">
        <h1>Dashboard - Warehouse sách</h1>
        <p>Quản lý kho sách và nhập xuất hàng</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<FaBoxes />}
          title="Tổng số sách"
          value={stats.totalBooks}
          color="#4CAF50"
          subtitle="Trong kho"
        />
        
        <StatCard
          icon={<FaWarehouse />}
          title="Sách có sẵn"
          value={stats.booksInStock}
          color="#2196F3"
          subtitle="Có thể mượn"
        />
        
        <StatCard
          icon={<FaExclamationTriangle />}
          title="Hết sách"
          value={stats.booksOutOfStock}
          color="#FF9800"
          subtitle="Cần nhập thêm"
        />
        
        <StatCard
          icon={<FaClipboardList />}
          title="Đơn hàng chờ"
          value={stats.pendingOrders}
          color="#9C27B0"
          subtitle="Cần xử lý"
        />
        
        <StatCard
          icon={<FaTruck />}
          title="Giao hàng hôm nay"
          value={stats.todayDeliveries}
          color="#00BCD4"
          subtitle="Sách mới"
        />
        
        <StatCard
          icon={<FaExclamationTriangle />}
          title="Sách hư hỏng"
          value={stats.damagedBooks}
          color="#F44336"
          subtitle="Cần kiểm tra"
        />
      </div>

      <div className="inventory-overview">
        <div className="overview-section">
          <h2>Tình trạng kho</h2>
          <div className="overview-grid">
            <div className="overview-card stock">
              <h3>Tỷ lệ tồn kho</h3>
              <div className="overview-percentage">
                {overview.stockRatio}%
              </div>
              <p>Đang có sẵn</p>
            </div>
            
            <div className="overview-card low-stock">
              <h3>Sách sắp hết</h3>
              <div className="overview-count">
                {overview.lowStockCount}
              </div>
              <p>Loại sách</p>
            </div>
            
            <div className="overview-card quality">
              <h3>Tỷ lệ chất lượng</h3>
              <div className="overview-percentage">
                {overview.qualityRatio}%
              </div>
              <p>Sách tốt</p>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Thao tác nhanh</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <FaTruck />
            <span>Nhập sách mới</span>
          </button>
          <button className="action-btn">
            <FaClipboardList />
            <span>Kiểm kê kho</span>
          </button>
          <button className="action-btn">
            <FaExclamationTriangle />
            <span>Báo cáo hư hỏng</span>
          </button>
          <button className="action-btn">
            <FaCheckCircle />
            <span>Xác nhận đơn hàng</span>
          </button>
        </div>
      </div>

      <div className="recent-activities">
        <h2>Hoạt động gần đây</h2>
        <div className="activity-list">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={activity.id || index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'import' ? <FaTruck /> : <FaClipboardList />}
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.description}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <p>Chưa có hoạt động gần đây</p>
            </div>
          )}
        </div>
      </div>

      <div className="stock-alerts">
        <h2>Cảnh báo tồn kho</h2>
        <div className="alert-list">
          {/* Out of stock alerts */}
          {alerts.outOfStockBooks?.map((book, index) => (
            <div key={`out-${book.id || index}`} className="alert-item critical">
              <div className="alert-icon">
                <FaExclamationTriangle />
              </div>
              <div className="alert-content">
                <h4>Hết sách "{book.title}"</h4>
                <p>Tác giả: {book.author} - Cần nhập thêm ngay</p>
              </div>
            </div>
          ))}
          
          {/* Low stock alerts */}
          {alerts.lowStockBooks?.slice(0, 3).map((book, index) => (
            <div key={`low-${book.id || index}`} className="alert-item warning">
              <div className="alert-icon">
                <FaExclamationTriangle />
              </div>
              <div className="alert-content">
                <h4>Sắp hết "{book.title}"</h4>
                <p>Chỉ còn {book.currentStock} cuốn</p>
              </div>
            </div>
          ))}
          
          {/* Show placeholder if no alerts */}
          {(!alerts.outOfStockBooks?.length && !alerts.lowStockBooks?.length) && (
            <div className="alert-item info">
              <div className="alert-icon">
                <FaCheckCircle />
              </div>
              <div className="alert-content">
                <h4>Tình trạng kho ổn định</h4>
                <p>Không có cảnh báo tồn kho</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard; 