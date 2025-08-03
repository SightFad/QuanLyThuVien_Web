import React, { useState, useEffect } from 'react';
import { FaBoxes, FaTruck, FaClipboardList, FaExclamationTriangle, FaCheckCircle, FaWarehouse } from 'react-icons/fa';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    console.log('WarehouseDashboard fetchDashboardData running...');
    try {
      // Mock data for warehouse dashboard
      setStats({
        totalBooks: 1250,
        booksInStock: 980,
        booksOutOfStock: 45,
        pendingOrders: 12,
        todayDeliveries: 8,
        damagedBooks: 23
      });
      console.log('WarehouseDashboard stats set successfully');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      <div className="dashboard-header">
        <h1>Dashboard - Nhân viên kho sách</h1>
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
                {Math.round((stats.booksInStock / stats.totalBooks) * 100)}%
              </div>
              <p>Đang có sẵn</p>
            </div>
            
            <div className="overview-card low-stock">
              <h3>Sách sắp hết</h3>
              <div className="overview-count">
                {stats.booksOutOfStock}
              </div>
              <p>Loại sách</p>
            </div>
            
            <div className="overview-card quality">
              <h3>Tỷ lệ chất lượng</h3>
              <div className="overview-percentage">
                {Math.round(((stats.totalBooks - stats.damagedBooks) / stats.totalBooks) * 100)}%
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
          <div className="activity-item">
            <div className="activity-icon delivery">
              <FaTruck />
            </div>
            <div className="activity-content">
              <p className="activity-text">Nhập 50 cuốn "Lập trình Python" từ NXB Giáo dục</p>
              <p className="activity-time">30 phút trước</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon check">
              <FaClipboardList />
            </div>
            <div className="activity-content">
              <p className="activity-text">Kiểm kê kho sách - Phát hiện 3 cuốn hư hỏng</p>
              <p className="activity-time">2 giờ trước</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon order">
              <FaClipboardList />
            </div>
            <div className="activity-content">
              <p className="activity-text">Đặt hàng 100 cuốn "Machine Learning cơ bản"</p>
              <p className="activity-time">1 ngày trước</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon damage">
              <FaExclamationTriangle />
            </div>
            <div className="activity-content">
              <p className="activity-text">Báo cáo 2 cuốn "Cơ sở dữ liệu" bị rách trang</p>
              <p className="activity-time">1 ngày trước</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stock-alerts">
        <h2>Cảnh báo tồn kho</h2>
        <div className="alert-list">
          <div className="alert-item critical">
            <div className="alert-icon">
              <FaExclamationTriangle />
            </div>
            <div className="alert-content">
              <h4>Hết sách "Lập trình Web"</h4>
              <p>Cần nhập thêm 20 cuốn</p>
            </div>
          </div>
          
          <div className="alert-item warning">
            <div className="alert-icon">
              <FaExclamationTriangle />
            </div>
            <div className="alert-content">
              <h4>Sắp hết "Cơ sở dữ liệu"</h4>
              <p>Chỉ còn 3 cuốn</p>
            </div>
          </div>
          
          <div className="alert-item info">
            <div className="alert-icon">
              <FaCheckCircle />
            </div>
            <div className="alert-content">
              <h4>Đơn hàng đã xác nhận</h4>
              <p>"Machine Learning" sẽ giao vào tuần tới</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard; 