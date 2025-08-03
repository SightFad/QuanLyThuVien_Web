import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaUpload,
  FaCheckCircle,
  FaChartPie,
  FaHeart,
  FaUserCog,
} from "react-icons/fa";
import "./ModernSidebar.css";

const ModernSidebar = ({
  userRole = "Admin",
  onLogout,
  onToggle,
  isMobileOpen,
  onMobileToggle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);

    // Mock notifications
    setNotifications([
      {
        id: 1,
        message: "Có 5 sách quá hạn cần xử lý",
        type: "warning",
        time: "5 phút trước",
      },
      {
        id: 2,
        message: "Thành viên mới đăng ký",
        type: "info",
        time: "10 phút trước",
      },
      {
        id: 3,
        message: "Báo cáo tháng đã sẵn sàng",
        type: "success",
        time: "1 giờ trước",
      },
    ]);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute(
      "data-theme",
      !isDarkMode ? "dark" : "light"
    );
  };

  const handleSidebarToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const closeMobileSidebar = () => {
    if (onMobileToggle) {
      onMobileToggle();
    }
  };

  const getMenuItems = () => {
    switch (userRole) {
      case "Admin":
        return [
          {
            path: "/admin",
            icon: <FaChartBar />,
            label: "Dashboard",
            roles: ["Admin"],
          },
          {
            path: "/books",
            icon: <FaBook />,
            label: "Quản lý sách",
            roles: ["Admin", "Librarian", "Trưởng thư viện"],
          },
          {
            path: "/readers",
            icon: <FaUsers />,
            label: "Quản lý Reader",
            roles: ["Admin", "Librarian", "Trưởng thư viện"],
          },
          {
            path: "/borrows",
            icon: <FaExchangeAlt />,
            label: "Mượn/Trả sách",
            roles: ["Admin", "Librarian", "Trưởng thư viện"],
          },
          {
            path: "/system/users",
            icon: <FaUserCog />,
            label: "Quản lý người dùng",
            roles: ["Admin"],
          },
          {
            path: "/system/settings",
            icon: <FaCog />,
            label: "Cài đặt hệ thống",
            roles: ["Admin"],
          },
          {
            path: "/system/backup",
            icon: <FaDatabase />,
            label: "Sao lưu dữ liệu",
            roles: ["Admin"],
          },
        ];

      case "Reader":
        return [
          {
            path: "/reader/home",
            icon: <FaHome />,
            label: "Trang chủ",
            roles: ["Reader"],
          },
          {
            path: "/reader/search",
            icon: <FaSearch />,
            label: "Tìm kiếm sách",
            roles: ["Reader"],
          },
          {
            path: "/reader/my-books",
            icon: <FaBook />,
            label: "Sách của tôi",
            roles: ["Reader"],
          },
          {
            path: "/reader/reservations",
            icon: <FaHeart />,
            label: "Đặt trước",
            roles: ["Reader"],
          },
          {
            path: "/reader/fines",
            icon: <FaMoneyBillWave />,
            label: "Tiền phạt",
            roles: ["Reader"],
          },
          {
            path: "/reader/profile",
            icon: <FaUser />,
            label: "Thông tin cá nhân",
            roles: ["Reader"],
          },
        ];

      case "Librarian":
        return [
          {
            path: "/librarian/dashboard",
            icon: <FaChartBar />,
            label: "Dashboard",
            roles: ["Librarian"],
          },
          {
            path: "/books",
            icon: <FaBook />,
            label: "Quản lý sách",
            roles: ["Librarian"],
          },
          {
            path: "/readers",
            icon: <FaUsers />,
            label: "Quản lý Reader",
            roles: ["Librarian"],
          },
          {
            path: "/borrows",
            icon: <FaExchangeAlt />,
            label: "Mượn/Trả sách",
            roles: ["Librarian"],
          },
          {
            path: "/librarian/fines",
            icon: <FaMoneyBillWave />,
            label: "Quản lý phạt",
            roles: ["Librarian"],
          },
          {
            path: "/librarian/reports",
            icon: <FaFileAlt />,
            label: "Báo cáo",
            roles: ["Librarian"],
          },
          {
            path: "/librarian/book-status",
            icon: <FaCheckCircle />,
            label: "Trạng thái sách",
            roles: ["Librarian"],
          },
          {
            path: "/librarian/reservations",
            icon: <FaHeart />,
            label: "Đặt trước",
            roles: ["Librarian"],
          },
          {
            path: "/librarian/violations",
            icon: <FaExclamationTriangle />,
            label: "Vi phạm",
            roles: ["Librarian"],
          },
        ];

      case "Accountant":
      case "Nhân viên Accountant":
      case "Trưởng phòng Accountant":
        return [
          {
            path: "/accountant/dashboard",
            icon: <FaChartBar />,
            label: "Dashboard",
            roles: [
              "Accountant",
              "Nhân viên Accountant",
              "Trưởng phòng Accountant",
            ],
          },
          {
            path: "/accountant/transactions",
            icon: <FaMoneyBillWave />,
            label: "Giao dịch tài chính",
            roles: [
              "Accountant",
              "Nhân viên Accountant",
              "Trưởng phòng Accountant",
            ],
          },
          {
            path: "/accountant/proposals",
            icon: <FaFileAlt />,
            label: "Đề xuất mua sách",
            roles: ["Accountant", "Trưởng phòng Accountant"],
          },
          {
            path: "/accountant/orders",
            icon: <FaClipboardList />,
            label: "Đơn hàng",
            roles: [
              "Accountant",
              "Nhân viên Accountant",
              "Trưởng phòng Accountant",
            ],
          },
          {
            path: "/accountant/suppliers",
            icon: <FaTruck />,
            label: "Nhà cung cấp",
            roles: [
              "Accountant",
              "Nhân viên Accountant",
              "Trưởng phòng Accountant",
            ],
          },
          {
            path: "/accountant/reports",
            icon: <FaChartBar />,
            label: "Báo cáo tài chính",
            roles: [
              "Accountant",
              "Nhân viên Accountant",
              "Trưởng phòng Accountant",
            ],
          },
        ];

      case "Warehouse sách":
      case "Trưởng kho":
      case "warehouse":
      case "Warehouse":
        return [
          {
            path: "/warehouse/dashboard",
            icon: <FaChartBar />,
            label: "Dashboard",
            roles: [
              "Warehouse sách",
              "Trưởng kho",
              "warehouse",
              "Warehouse",
            ],
          },
          {
            path: "/warehouse/inventory",
            icon: <FaBoxes />,
            label: "Quản lý kho",
            roles: [
              "Warehouse sách",
              "Trưởng kho",
              "warehouse",
              "Warehouse",
            ],
          },
          {
            path: "/warehouse/imports",
            icon: <FaUpload />,
            label: "Nhập sách",
            roles: [
              "Warehouse sách",
              "Trưởng kho",
              "warehouse",
              "Warehouse",
            ],
          },
          {
            path: "/warehouse/checks",
            icon: <FaCheckCircle />,
            label: "Kiểm kê",
            roles: [
              "Warehouse sách",
              "Trưởng kho",
              "warehouse",
              "Warehouse",
            ],
          },
          {
            path: "/warehouse/reports",
            icon: <FaChartPie />,
            label: "Báo cáo kho",
            roles: [
              "Warehouse sách",
              "Trưởng kho",
              "warehouse",
              "Warehouse",
            ],
          },
        ];

      case "Trưởng thư viện":
        return [
          {
            path: "/manager/dashboard",
            icon: <FaChartBar />,
            label: "Dashboard",
            roles: ["Trưởng thư viện"],
          },
          {
            path: "/manager/reports",
            icon: <FaChartBar />,
            label: "Báo cáo",
            roles: ["Trưởng thư viện"],
          },
          {
            path: "/manager/approvals",
            icon: <FaCheckCircle />,
            label: "Phê duyệt",
            roles: ["Trưởng thư viện"],
          },
        ];

      case "Giám đốc":
        return [
          {
            path: "/director/dashboard",
            icon: <FaChartBar />,
            label: "Dashboard",
            roles: ["Giám đốc"],
          },
          {
            path: "/books",
            icon: <FaBook />,
            label: "Quản lý sách",
            roles: ["Giám đốc"],
          },
          {
            path: "/readers",
            icon: <FaUsers />,
            label: "Quản lý Reader",
            roles: ["Giám đốc"],
          },
          {
            path: "/borrows",
            icon: <FaExchangeAlt />,
            label: "Mượn/Trả sách",
            roles: ["Giám đốc"],
          },
          {
            path: "/system/users",
            icon: <FaUserCog />,
            label: "Quản lý người dùng",
            roles: ["Giám đốc"],
          },
        ];

      case "Kỹ thuật viên":
        return [
          {
            path: "/technician/dashboard",
            icon: <FaChartBar />,
            label: "Dashboard",
            roles: ["Kỹ thuật viên"],
          },
          {
            path: "/system/settings",
            icon: <FaCog />,
            label: "Cài đặt hệ thống",
            roles: ["Kỹ thuật viên"],
          },
          {
            path: "/system/backup",
            icon: <FaDatabase />,
            label: "Sao lưu dữ liệu",
            roles: ["Kỹ thuật viên"],
          },
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="mobile-overlay" onClick={closeMobileSidebar} />
      )}

      <div
        className={`modern-sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* Header with Gradient */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <FaBook />
            </div>
            {!isCollapsed && (
              <div className="brand-text">
                <h2>Thư Viện</h2>
                <span>Quản lý hệ thống</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={handleSidebarToggle}>
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <FaUser />
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name">Nguyễn Văn A</div>
              <div className="user-role">{userRole}</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                  title={isCollapsed ? item.label : ""}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Notifications */}
        {!isCollapsed && (
          <div className="sidebar-notifications">
            <div className="notifications-header">
              <h3>
                Thông báo
                <span className="notification-count">
                  {notifications.length}
                </span>
              </h3>
            </div>
            <div className="notifications-list">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.type}`}
                >
                  <div className="notification-content">
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            title={
              isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
            }
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          {!isCollapsed && (
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Đăng xuất</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ModernSidebar;
