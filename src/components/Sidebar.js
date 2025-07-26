import React from 'react';
import { NavLink } from 'react-router-dom';
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
  FaReceipt
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const getMenuItems = () => {
    switch (user.role) {
      case 'Quản trị viên':
        return [
          { path: '/', icon: <FaHome />, label: 'Dashboard' },
          { path: '/books', icon: <FaBook />, label: 'Quản lý sách' },
          { path: '/readers', icon: <FaUsers />, label: 'Quản lý độc giả' },
          { path: '/borrows', icon: <FaExchangeAlt />, label: 'Quản lý mượn trả' },
          { path: '/users', icon: <FaUser />, label: 'Quản lý người dùng' },
        ];
      case 'Thủ thư':
        return [
          { path: '/librarian', icon: <FaHome />, label: 'Dashboard' },
          { path: '/books', icon: <FaBook />, label: 'Quản lý sách' },
          { path: '/readers', icon: <FaUsers />, label: 'Quản lý độc giả' },
          { path: '/borrows', icon: <FaExchangeAlt />, label: 'Quản lý mượn trả' },
          { path: '/librarian/activities', icon: <FaHistory />, label: 'Hoạt động' },
        ];
      case 'Kế toán':
        return [
          { path: '/accountant', icon: <FaHome />, label: 'Dashboard' },
          { path: '/accountant/finance', icon: <FaMoneyBillWave />, label: 'Quản lý tài chính' },
          { path: '/accountant/fines', icon: <FaReceipt />, label: 'Tiền phạt' },
          { path: '/accountant/reports', icon: <FaChartBar />, label: 'Báo cáo' },
          { path: '/borrows', icon: <FaExchangeAlt />, label: 'Mượn trả' },
        ];
      case 'Nhân viên kho sách':
        return [
          { path: '/warehouse', icon: <FaHome />, label: 'Dashboard' },
          { path: '/warehouse/inventory', icon: <FaBoxes />, label: 'Quản lý kho' },
          { path: '/warehouse/orders', icon: <FaTruck />, label: 'Đơn hàng' },
          { path: '/warehouse/check', icon: <FaClipboardList />, label: 'Kiểm kê' },
          { path: '/books', icon: <FaBook />, label: 'Danh sách sách' },
        ];
      case 'Độc giả':
        return [
          { path: '/reader', icon: <FaHome />, label: 'Trang chủ' },
          { path: '/reader/search', icon: <FaSearch />, label: 'Tìm kiếm sách' },
          { path: '/reader/my-books', icon: <FaBook />, label: 'Sách của tôi' },
          { path: '/reader/history', icon: <FaHistory />, label: 'Lịch sử mượn' },
          { path: '/reader/profile', icon: <FaUser />, label: 'Thông tin cá nhân' },
        ];
      default:
        return [];
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'Quản trị viên': 'Administrator',
      'Thủ thư': 'Librarian',
      'Kế toán': 'Accountant',
      'Nhân viên kho sách': 'Warehouse Staff',
      'Độc giả': 'Reader'
    };
    return roleNames[role] || role;
  };

  const menuItems = getMenuItems();

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
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
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