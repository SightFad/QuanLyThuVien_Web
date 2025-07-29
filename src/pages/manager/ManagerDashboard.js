import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaBook, FaMoneyBillWave, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 1250,
    totalBooks: 15000,
    activeBorrowings: 450,
    overdueBooks: 25,
    monthlyRevenue: 25000000,
    pendingApprovals: 8
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'borrowing',
      description: 'Nguyễn Văn A mượn 3 cuốn sách',
      time: '2 giờ trước',
      status: 'completed'
    },
    {
      id: 2,
      type: 'return',
      description: 'Trần Thị B trả 2 cuốn sách',
      time: '3 giờ trước',
      status: 'completed'
    },
    {
      id: 3,
      type: 'approval',
      description: 'Đề xuất mua sách mới cần phê duyệt',
      time: '5 giờ trước',
      status: 'pending'
    }
  ]);

  return (
    <div className="manager-dashboard">
      <div className="page-header">
        <h1><FaChartBar /> Dashboard - Trưởng thư viện</h1>
        <p>Tổng quan hoạt động và quản lý thư viện</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalMembers.toLocaleString()}</div>
            <div className="stat-label">Tổng thành viên</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaBook />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalBooks.toLocaleString()}</div>
            <div className="stat-label">Tổng sách</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.activeBorrowings}</div>
            <div className="stat-label">Đang mượn</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.overdueBooks}</div>
            <div className="stat-label">Trả trễ</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.monthlyRevenue.toLocaleString()} VNĐ</div>
            <div className="stat-label">Doanh thu tháng</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.pendingApprovals}</div>
            <div className="stat-label">Chờ phê duyệt</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Hoạt động gần đây</h2>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'borrowing' && <FaBook />}
                  {activity.type === 'return' && <FaCheckCircle />}
                  {activity.type === 'approval' && <FaExclamationTriangle />}
                </div>
                <div className="activity-content">
                  <p className="activity-description">{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <div className={`activity-status ${activity.status}`}>
                  {activity.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h2>Báo cáo nhanh</h2>
          <div className="quick-reports">
            <div className="report-card">
              <h3>Sách mượn nhiều nhất</h3>
              <ul>
                <li>Đắc Nhân Tâm - 45 lượt mượn</li>
                <li>Nhà Giả Kim - 38 lượt mượn</li>
                <li>Tuổi Trẻ Đáng Giá Bao Nhiêu - 32 lượt mượn</li>
              </ul>
            </div>
            <div className="report-card">
              <h3>Thành viên tích cực</h3>
              <ul>
                <li>Nguyễn Văn A - 15 lượt mượn</li>
                <li>Trần Thị B - 12 lượt mượn</li>
                <li>Lê Văn C - 10 lượt mượn</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-primary">
          <FaChartBar /> Xem báo cáo chi tiết
        </button>
        <button className="btn-secondary">
          <FaExclamationTriangle /> Xử lý phê duyệt
        </button>
      </div>
    </div>
  );
};

export default ManagerDashboard; 