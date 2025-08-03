import React, { useState, useEffect } from "react";
import {
  FaCog,
  FaShieldAlt,
  FaDatabase,
  FaFileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaServer,
  FaNetworkWired,
  FaDesktop,
  FaMobile,
  FaWifi,
  FaHdd,
  FaMemory,
  FaMicrochip,
  FaChartLine,
  FaTools,
  FaUserCog,
  FaKey,
  FaEye,
} from "react-icons/fa";
import { useToast } from "../../hooks";
import "./TechnicianDashboard.css";

const TechnicianDashboard = () => {
  const [systemStatus, setSystemStatus] = useState({
    database: "healthy",
    server: "healthy",
    network: "warning",
    security: "healthy",
    backup: "healthy",
  });
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    networkLoad: 35,
    activeUsers: 127,
    uptime: "15 days, 8 hours",
  });
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Mock data for now - replace with actual API calls
      setMaintenanceTasks([
        {
          id: 1,
          title: "Cập nhật hệ thống bảo mật",
          description: "Cài đặt bản vá bảo mật mới nhất cho hệ thống",
          priority: "high",
          status: "in_progress",
          assignedTo: "Kỹ thuật viên",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          progress: 75,
        },
        {
          id: 2,
          title: "Sao lưu dữ liệu định kỳ",
          description: "Thực hiện sao lưu toàn bộ dữ liệu hệ thống",
          priority: "medium",
          status: "pending",
          assignedTo: "Kỹ thuật viên",
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          progress: 0,
        },
        {
          id: 3,
          title: "Kiểm tra hiệu suất hệ thống",
          description: "Phân tích và tối ưu hóa hiệu suất database",
          priority: "low",
          status: "completed",
          assignedTo: "Kỹ thuật viên",
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          progress: 100,
        },
      ]);

      setSupportTickets([
        {
          id: 1,
          title: "Không thể đăng nhập hệ thống",
          description: "Người dùng báo cáo lỗi đăng nhập vào hệ thống",
          priority: "high",
          status: "open",
          requester: "Librarian - Nguyễn Văn A",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          category: "authentication",
        },
        {
          id: 2,
          title: "Tốc độ tải trang chậm",
          description: "Hệ thống phản hồi chậm khi tải danh sách sách",
          priority: "medium",
          status: "in_progress",
          requester: "Reader - Trần Thị B",
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          category: "performance",
        },
        {
          id: 3,
          title: "Lỗi xuất báo cáo",
          description: "Không thể xuất báo cáo thống kê",
          priority: "low",
          status: "resolved",
          requester: "Accountant - Lê Văn C",
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          category: "reporting",
        },
      ]);
    } catch (error) {
      showToast("Lỗi khi tải dữ liệu dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, action) => {
    try {
      // Mock API call
      showToast(
        `Đã ${action === "complete" ? "hoàn thành" : "cập nhật"} nhiệm vụ`,
        "success"
      );
      setMaintenanceTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: action === "complete" ? "completed" : "in_progress",
                progress: action === "complete" ? 100 : 75,
              }
            : task
        )
      );
    } catch (error) {
      showToast("Lỗi khi cập nhật nhiệm vụ", "error");
    }
  };

  const handleTicketUpdate = async (ticketId, action) => {
    try {
      // Mock API call
      showToast(
        `Đã ${action === "resolve" ? "giải quyết" : "cập nhật"} ticket`,
        "success"
      );
      setSupportTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: action === "resolve" ? "resolved" : "in_progress",
              }
            : ticket
        )
      );
    } catch (error) {
      showToast("Lỗi khi cập nhật ticket", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "#27ae60";
      case "warning":
        return "#f39c12";
      case "critical":
        return "#e74c3c";
      default:
        return "#7f8c8d";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#e74c3c";
      case "medium":
        return "#f39c12";
      case "low":
        return "#27ae60";
      default:
        return "#7f8c8d";
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="technician-dashboard">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="technician-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Kỹ thuật viên</h1>
        <p>Quản lý hệ thống và hỗ trợ kỹ thuật</p>
      </div>

      {/* System Status */}
      <div className="system-status-grid">
        <div className="status-card">
          <div
            className="status-icon"
            style={{ backgroundColor: getStatusColor(systemStatus.database) }}
          >
            <FaDatabase />
          </div>
          <div className="status-content">
            <h3>Database</h3>
            <p className={`status ${systemStatus.database}`}>
              {systemStatus.database === "healthy"
                ? "Hoạt động tốt"
                : systemStatus.database === "warning"
                ? "Cần chú ý"
                : "Lỗi nghiêm trọng"}
            </p>
          </div>
        </div>

        <div className="status-card">
          <div
            className="status-icon"
            style={{ backgroundColor: getStatusColor(systemStatus.server) }}
          >
            <FaServer />
          </div>
          <div className="status-content">
            <h3>Server</h3>
            <p className={`status ${systemStatus.server}`}>
              {systemStatus.server === "healthy"
                ? "Hoạt động tốt"
                : systemStatus.server === "warning"
                ? "Cần chú ý"
                : "Lỗi nghiêm trọng"}
            </p>
          </div>
        </div>

        <div className="status-card">
          <div
            className="status-icon"
            style={{ backgroundColor: getStatusColor(systemStatus.network) }}
          >
            <FaNetworkWired />
          </div>
          <div className="status-content">
            <h3>Network</h3>
            <p className={`status ${systemStatus.network}`}>
              {systemStatus.network === "healthy"
                ? "Hoạt động tốt"
                : systemStatus.network === "warning"
                ? "Cần chú ý"
                : "Lỗi nghiêm trọng"}
            </p>
          </div>
        </div>

        <div className="status-card">
          <div
            className="status-icon"
            style={{ backgroundColor: getStatusColor(systemStatus.security) }}
          >
            <FaShieldAlt />
          </div>
          <div className="status-content">
            <h3>Security</h3>
            <p className={`status ${systemStatus.security}`}>
              {systemStatus.security === "healthy"
                ? "Hoạt động tốt"
                : systemStatus.security === "warning"
                ? "Cần chú ý"
                : "Lỗi nghiêm trọng"}
            </p>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3>CPU Usage</h3>
            <FaMicrochip />
          </div>
          <div className="metric-value">
            <span className="percentage">{systemMetrics.cpuUsage}%</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${systemMetrics.cpuUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Memory Usage</h3>
            <FaMemory />
          </div>
          <div className="metric-value">
            <span className="percentage">{systemMetrics.memoryUsage}%</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${systemMetrics.memoryUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Disk Usage</h3>
            <FaHdd />
          </div>
          <div className="metric-value">
            <span className="percentage">{systemMetrics.diskUsage}%</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${systemMetrics.diskUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Active Users</h3>
            <FaUserCog />
          </div>
          <div className="metric-value">
            <span className="number">{systemMetrics.activeUsers}</span>
            <p>Người dùng đang hoạt động</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Maintenance Tasks */}
        <div className="content-card">
          <div className="card-header">
            <h2>Nhiệm vụ bảo trì</h2>
            <button className="btn btn-primary">
              <FaTools /> Tạo nhiệm vụ mới
            </button>
          </div>
          <div className="tasks-list">
            {maintenanceTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <span
                      className="priority-badge"
                      style={{
                        backgroundColor: getPriorityColor(task.priority),
                      }}
                    >
                      {task.priority === "high"
                        ? "Cao"
                        : task.priority === "medium"
                        ? "Trung bình"
                        : "Thấp"}
                    </span>
                  </div>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span>Người thực hiện: {task.assignedTo}</span>
                    <span>Hạn: {formatDate(task.dueDate)}</span>
                  </div>
                  <div className="task-progress">
                    <span>Tiến độ: {task.progress}%</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="task-actions">
                  {task.status === "pending" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleTaskUpdate(task.id, "start")}
                    >
                      <FaClock /> Bắt đầu
                    </button>
                  )}
                  {task.status === "in_progress" && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleTaskUpdate(task.id, "complete")}
                    >
                      <FaCheckCircle /> Hoàn thành
                    </button>
                  )}
                  {task.status === "completed" && (
                    <span className="status-badge completed">Hoàn thành</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets */}
        <div className="content-card">
          <div className="card-header">
            <h2>Ticket hỗ trợ</h2>
            <button className="btn btn-outline">
              <FaEye /> Xem tất cả
            </button>
          </div>
          <div className="tickets-list">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="ticket-item">
                <div className="ticket-info">
                  <div className="ticket-header">
                    <h4>{ticket.title}</h4>
                    <span
                      className="priority-badge"
                      style={{
                        backgroundColor: getPriorityColor(ticket.priority),
                      }}
                    >
                      {ticket.priority === "high"
                        ? "Cao"
                        : ticket.priority === "medium"
                        ? "Trung bình"
                        : "Thấp"}
                    </span>
                  </div>
                  <p>{ticket.description}</p>
                  <div className="ticket-meta">
                    <span>Yêu cầu bởi: {ticket.requester}</span>
                    <span>Tạo lúc: {formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
                <div className="ticket-actions">
                  {ticket.status === "open" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleTicketUpdate(ticket.id, "start")}
                    >
                      <FaClock /> Bắt đầu xử lý
                    </button>
                  )}
                  {ticket.status === "in_progress" && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleTicketUpdate(ticket.id, "resolve")}
                    >
                      <FaCheckCircle /> Giải quyết
                    </button>
                  )}
                  {ticket.status === "resolved" && (
                    <span className="status-badge resolved">Đã giải quyết</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
