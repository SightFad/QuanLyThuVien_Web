import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaUsers,
  FaExchangeAlt,
  FaChartBar,
  FaUser,
  FaSearch,
  FaHistory,
  FaSignOutAlt,
  FaCog,
  FaMoneyBillWave,
  FaBoxes,
  FaTruck,
  FaClipboardList,
  FaReceipt,
  FaUserPlus,
  FaHandshake,
  FaUndo,
  FaExclamationTriangle,
  FaFileAlt,
  FaDatabase,
  FaShieldAlt,
  FaCalendarCheck,
  FaCreditCard,
  FaShoppingCart,
  FaIndustry,
  FaFileInvoiceDollar,
  FaWarehouse,
  FaClipboardCheck,
  FaBoxOpen,
  FaCheckDouble,
  FaEye,
  FaEdit,
  FaBell,
  FaExclamationCircle,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    switch (user.role) {
      case "Admin":
        return [
          { path: "/admin", icon: <FaHome />, label: "Dashboard" },
          {
            path: "/system/users",
            icon: <FaUsers />,
            label: "Quản lý người dùng",
          },
          {
            path: "/system/settings",
            icon: <FaCog />,
            label: "Cấu hình hệ thống",
          },
          {
            path: "/system/backup",
            icon: <FaDatabase />,
            label: "Sao lưu dữ liệu",
          },
          { path: "/books", icon: <FaBook />, label: "Quản lý sách" },
          { path: "/readers", icon: <FaUsers />, label: "Quản lý thành viên" },
          {
            path: "/borrows",
            icon: <FaExchangeAlt />,
            label: "Quản lý mượn trả",
          },
        ];
      case "Librarian":
        return [
          {
            path: "/librarian/dashboard",
            icon: <FaHome />,
            label: "Dashboard",
          },
          {
            path: "/librarian/fines",
            icon: <FaExclamationTriangle />,
            label: "Quản lý tiền phạt",
          },
          {
            path: "/librarian/reports",
            icon: <FaFileAlt />,
            label: "Báo cáo thư viện",
          },
          {
            path: "/librarian/book-status",
            icon: <FaEdit />,
            label: "Cập nhật trạng thái sách",
          },
          {
            path: "/librarian/reservations",
            icon: <FaBell />,
            label: "Quản lý đặt trước sách",
          },
          {
            path: "/librarian/violations",
            icon: <FaExclamationCircle />,
            label: "Quản lý sách vi phạm",
          },
          { path: "/books", icon: <FaBook />, label: "Tìm kiếm sách" },
          { path: "/readers", icon: <FaUsers />, label: "Quản lý thành viên" },
          {
            path: "/borrows",
            icon: <FaExchangeAlt />,
            label: "Quản lý mượn trả",
          },
        ];
      case "Accountant":
        return [
          {
            path: "/accountant/dashboard",
            icon: <FaHome />,
            label: "Dashboard",
          },
          {
            path: "/accountant/transactions",
            icon: <FaMoneyBillWave />,
            label: "Giao dịch tài chính",
          },
          {
            path: "/accountant/proposals",
            icon: <FaFileAlt />,
            label: "Đề xuất mua sách",
          },
          {
            path: "/accountant/orders",
            icon: <FaShoppingCart />,
            label: "Đơn hàng mua sách",
          },
          {
            path: "/accountant/suppliers",
            icon: <FaIndustry />,
            label: "Quản lý nhà cung cấp",
          },
          {
            path: "/accountant/reports",
            icon: <FaFileInvoiceDollar />,
            label: "Báo cáo tài chính",
          },
          { path: "/borrows", icon: <FaExchangeAlt />, label: "Xem mượn trả" },
        ];
      case "Nhân viên Accountant":
        return [
          {
            path: "/accountant/dashboard",
            icon: <FaHome />,
            label: "Dashboard",
          },
          {
            path: "/accountant/transactions",
            icon: <FaMoneyBillWave />,
            label: "Giao dịch tài chính",
          },
          {
            path: "/accountant/orders",
            icon: <FaShoppingCart />,
            label: "Đơn hàng mua sách",
          },
          {
            path: "/accountant/suppliers",
            icon: <FaIndustry />,
            label: "Quản lý nhà cung cấp",
          },
          {
            path: "/accountant/reports",
            icon: <FaFileInvoiceDollar />,
            label: "Báo cáo tài chính",
          },
          { path: "/borrows", icon: <FaExchangeAlt />, label: "Xem mượn trả" },
        ];
      case "Nhân viên kho sách":
      case "warehouse":
        return [
          {
            path: "/warehouse/dashboard",
            icon: <FaHome />,
            label: "Dashboard",
          },
          {
            path: "/warehouse/inventory",
            icon: <FaWarehouse />,
            label: "Quản lý kho sách",
          },
          {
            path: "/warehouse/imports",
            icon: <FaTruck />,
            label: "Quản lý nhập sách",
          },
          {
            path: "/warehouse/checks",
            icon: <FaClipboardList />,
            label: "Kiểm kê kho",
          },
          {
            path: "/warehouse/reports",
            icon: <FaFileAlt />,
            label: "Báo cáo tồn kho",
          },
          { path: "/books", icon: <FaBook />, label: "Danh sách sách" },
        ];
      case "Trưởng kho":
        return [
          {
            path: "/warehouse/dashboard",
            icon: <FaHome />,
            label: "Dashboard",
          },
          {
            path: "/warehouse/inventory",
            icon: <FaWarehouse />,
            label: "Quản lý kho sách",
          },
          {
            path: "/warehouse/imports",
            icon: <FaTruck />,
            label: "Quản lý nhập sách",
          },
          {
            path: "/warehouse/checks",
            icon: <FaClipboardList />,
            label: "Kiểm kê kho",
          },
          {
            path: "/warehouse/reports",
            icon: <FaFileAlt />,
            label: "Báo cáo tồn kho",
          },
          { path: "/books", icon: <FaBook />, label: "Danh sách sách" },
        ];
      case "Trưởng thư viện":
        return [
          { path: "/manager/dashboard", icon: <FaHome />, label: "Dashboard" },
          {
            path: "/manager/reports",
            icon: <FaChartBar />,
            label: "Báo cáo tổng hợp",
          },
          {
            path: "/manager/approvals",
            icon: <FaCheckDouble />,
            label: "Phê duyệt",
          },
          { path: "/books", icon: <FaBook />, label: "Quản lý sách" },
          { path: "/readers", icon: <FaUsers />, label: "Quản lý thành viên" },
          {
            path: "/borrows",
            icon: <FaExchangeAlt />,
            label: "Quản lý mượn trả",
          },
        ];
      case "Giám đốc":
        return [
          { path: "/director/dashboard", icon: <FaHome />, label: "Dashboard" },
          {
            path: "/director/reports",
            icon: <FaChartBar />,
            label: "Báo cáo tổng hợp",
          },
          {
            path: "/director/approvals",
            icon: <FaCheckDouble />,
            label: "Phê duyệt",
          },
          {
            path: "/director/strategic",
            icon: <FaFileAlt />,
            label: "Chiến lược phát triển",
          },
          {
            path: "/director/budget",
            icon: <FaMoneyBillWave />,
            label: "Quản lý ngân sách",
          },
          {
            path: "/director/staff",
            icon: <FaUsers />,
            label: "Quản lý nhân sự",
          },
        ];
      case "Trưởng phòng Accountant":
        return [
          {
            path: "/accounting-manager/dashboard",
            icon: <FaHome />,
            label: "Dashboard",
          },
          {
            path: "/accounting-manager/financial-reports",
            icon: <FaFileInvoiceDollar />,
            label: "Báo cáo tài chính",
          },
          {
            path: "/accounting-manager/budget-management",
            icon: <FaMoneyBillWave />,
            label: "Quản lý ngân sách",
          },
          {
            path: "/accounting-manager/approvals",
            icon: <FaCheckDouble />,
            label: "Phê duyệt tài chính",
          },
          {
            path: "/accounting-manager/staff",
            icon: <FaUsers />,
            label: "Quản lý nhân viên",
          },
          {
            path: "/accounting-manager/audit",
            icon: <FaShieldAlt />,
            label: "Kiểm toán",
          },
        ];
      case "Kỹ thuật viên":
        return [
          {
            path: "/technician/dashboard",
            icon: <FaHome />,
            label: "Dashboard",
          },
          {
            path: "/technician/system-maintenance",
            icon: <FaCog />,
            label: "Bảo trì hệ thống",
          },
          {
            path: "/technician/technical-support",
            icon: <FaShieldAlt />,
            label: "Hỗ trợ kỹ thuật",
          },
          {
            path: "/technician/backup-restore",
            icon: <FaDatabase />,
            label: "Sao lưu & Khôi phục",
          },
          {
            path: "/technician/security",
            icon: <FaShieldAlt />,
            label: "Bảo mật hệ thống",
          },
          {
            path: "/technician/logs",
            icon: <FaFileAlt />,
            label: "Nhật ký hệ thống",
          },
        ];
      case "Reader":
        return [
          { path: "/reader/home", icon: <FaHome />, label: "Trang chủ" },
          {
            path: "/reader/search",
            icon: <FaSearch />,
            label: "Tìm kiếm sách",
          },
          { path: "/reader/my-books", icon: <FaBook />, label: "Sách của tôi" },
          {
            path: "/reader/reservations",
            icon: <FaCalendarCheck />,
            label: "Đặt sách",
          },
          { path: "/reader/fines", icon: <FaCreditCard />, label: "Tiền phạt" },
          {
            path: "/reader/profile",
            icon: <FaUser />,
            label: "Thông tin cá nhân",
          },
        ];
      default:
        return [];
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      Admin: "System Administrator",
      "Giám đốc": "Director",
      "Trưởng thư viện": "Library Manager",
      Librarian: "Librarian",
      Accountant: "Accountant",
      "Trưởng phòng Accountant": "Accounting Manager",
      "Kỹ thuật viên": "Technician",
      "Nhân viên Accountant": "Accounting Staff",
      "Nhân viên kho sách": "Warehouse Staff",
      "Trưởng kho": "Warehouse Manager",
      warehouse: "Warehouse Staff",
      Reader: "Reader",
    };
    return roleNames[role] || role;
  };

  const menuItems = getMenuItems();

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          <FaChartBar className="sidebar-icon" />
          Quản Lý Thư Viện
        </h1>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <div
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={() => handleNavClick(item.path)}
                style={{ cursor: "pointer" }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <FaUser />
          </div>
          <div className="user-details">
            <p className="user-name">{user.username}</p>
            <p className="user-role">{getRoleDisplayName(user.role)}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
