import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, 
  FaUsers, 
  FaBook, 
  FaMoneyBillWave, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaFileAlt,
  FaCalendarAlt,
  FaBuilding,
  FaUserTie
} from 'react-icons/fa';
import { useToast } from '../../hooks';
import './DirectorDashboard.css';

const DirectorDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalReaders: 0,
    totalBooks: 0,
    activeBorrows: 0,
    overdueBooks: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    staffCount: 0,
    monthlyGrowth: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      setStatistics({
        totalReaders: 1250,
        totalBooks: 8500,
        activeBorrows: 342,
        overdueBooks: 23,
        totalRevenue: 15000000,
        pendingApprovals: 8,
        staffCount: 15,
        monthlyGrowth: 12.5
      });

      setRecentActivities([
        {
          id: 1,
          type: 'approval',
          title: 'Phê duyệt mua sách mới',
          description: 'Đề xuất mua 50 cuốn sách mới cho khoa CNTT',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          id: 2,
          type: 'report',
          title: 'Báo cáo tháng 12/2024',
          description: 'Báo cáo hoạt động thư viện tháng 12 đã hoàn thành',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          id: 3,
          type: 'staff',
          title: 'Tuyển dụng nhân viên mới',
          description: 'Phê duyệt tuyển dụng 2 thủ thư mới',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          status: 'pending'
        }
      ]);

      setPendingApprovals([
        {
          id: 1,
          type: 'book_purchase',
          title: 'Mua sách mới',
          requester: 'Trưởng thư viện',
          amount: 5000000,
          description: 'Mua 100 cuốn sách mới cho khoa Kinh tế',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          type: 'budget_allocation',
          title: 'Phân bổ ngân sách',
          requester: 'Trưởng phòng kế toán',
          amount: 20000000,
          description: 'Phân bổ ngân sách cho dự án nâng cấp hệ thống',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 3,
          type: 'staff_hiring',
          title: 'Tuyển dụng nhân viên',
          requester: 'HR Manager',
          amount: 0,
          description: 'Tuyển dụng 3 thủ thư mới',
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ]);
    } catch (error) {
      showToast('Lỗi khi tải dữ liệu dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (approvalId, action) => {
    try {
      // Mock API call
      showToast(`Đã ${action === 'approve' ? 'phê duyệt' : 'từ chối'} yêu cầu`, 'success');
      setPendingApprovals(prev => prev.filter(item => item.id !== approvalId));
    } catch (error) {
      showToast('Lỗi khi xử lý phê duyệt', 'error');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="director-dashboard">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="director-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Giám đốc</h1>
        <p>Quản lý tổng thể hệ thống thư viện</p>
      </div>

      {/* Statistics Cards */}
      <div className="statistics-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{statistics.totalReaders.toLocaleString()}</h3>
            <p>Tổng độc giả</p>
            <span className="stat-change positive">
              <FaArrowUp /> +5.2%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaBook />
          </div>
          <div className="stat-content">
            <h3>{statistics.totalBooks.toLocaleString()}</h3>
            <p>Tổng sách</p>
            <span className="stat-change positive">
              <FaArrowUp /> +2.1%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(statistics.totalRevenue)}</h3>
            <p>Doanh thu tháng</p>
            <span className="stat-change positive">
              <FaArrowUp /> +{statistics.monthlyGrowth}%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>{statistics.pendingApprovals}</h3>
            <p>Chờ phê duyệt</p>
            <span className="stat-change neutral">
              <FaClock /> Cần xử lý
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Pending Approvals */}
        <div className="content-card">
          <div className="card-header">
            <h2>Chờ phê duyệt</h2>
            <span className="badge">{pendingApprovals.length}</span>
          </div>
          <div className="approvals-list">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="approval-item">
                <div className="approval-info">
                  <h4>{approval.title}</h4>
                  <p>{approval.description}</p>
                  <div className="approval-meta">
                    <span className="requester">
                      <FaUserTie /> {approval.requester}
                    </span>
                    <span className="amount">
                      {approval.amount > 0 ? formatCurrency(approval.amount) : 'Không có chi phí'}
                    </span>
                    <span className="date">
                      <FaCalendarAlt /> {formatDate(approval.submittedAt)}
                    </span>
                  </div>
                </div>
                <div className="approval-actions">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleApproval(approval.id, 'approve')}
                  >
                    <FaCheckCircle /> Phê duyệt
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleApproval(approval.id, 'reject')}
                  >
                    <FaExclamationTriangle /> Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="content-card">
          <div className="card-header">
            <h2>Hoạt động gần đây</h2>
            <button className="btn btn-outline">
              <FaEye /> Xem tất cả
            </button>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'approval' && <FaCheckCircle />}
                  {activity.type === 'report' && <FaFileAlt />}
                  {activity.type === 'staff' && <FaUsers />}
                </div>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <span className="activity-time">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
                <div className="activity-status">
                  <span className={`status-badge ${activity.status}`}>
                    {activity.status === 'pending' ? 'Chờ xử lý' : 'Hoàn thành'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card">
          <div className="card-header">
            <h2>Thao tác nhanh</h2>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn">
              <FaFileAlt />
              <span>Xem báo cáo</span>
            </button>
            <button className="quick-action-btn">
              <FaUsers />
              <span>Quản lý nhân sự</span>
            </button>
            <button className="quick-action-btn">
              <FaMoneyBillWave />
              <span>Ngân sách</span>
            </button>
            <button className="quick-action-btn">
              <FaBuilding />
              <span>Chiến lược</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard; 