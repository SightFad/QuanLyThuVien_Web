import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaBook, FaUsers, FaExchangeAlt, FaCog, FaDatabase,
  FaSearch, FaHistory, FaUser, FaBell, FaChartBar, FaFileAlt,
  FaDollarSign, FaShoppingCart, FaTruck, FaWarehouse, FaClipboardCheck,
  FaUserShield, FaSignOutAlt, FaChevronLeft, FaChevronRight,
  FaBookmark, FaGift, FaMoon, FaSun, FaGraduationCap
} from 'react-icons/fa';

const ModernSidebar = ({ userRole = 'Độc giả' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Navigation items by role
  const navigationItems = {
    'Admin': [
      {
        section: 'Dashboard',
        items: [
          { path: '/', icon: <FaHome />, label: 'Tổng quan', badge: null },
        ]
      },
      {
        section: 'Quản lý',
        items: [
          { path: '/books', icon: <FaBook />, label: 'Quản lý sách', badge: null },
          { path: '/readers', icon: <FaUsers />, label: 'Quản lý độc giả', badge: '1.2k' },
          { path: '/borrows', icon: <FaExchangeAlt />, label: 'Mượn trả sách', badge: 'new' },
          { path: '/users', icon: <FaUserShield />, label: 'Quản lý người dùng', badge: null },
        ]
      },
      {
        section: 'Hệ thống',
        items: [
          { path: '/settings', icon: <FaCog />, label: 'Cài đặt hệ thống', badge: null },
          { path: '/backup', icon: <FaDatabase />, label: 'Sao lưu dữ liệu', badge: null },
        ]
      }
    ],
    'Độc giả': [
      {
        section: 'Trang chủ',
        items: [
          { path: '/reader', icon: <FaHome />, label: 'Trang chủ', badge: null },
          { path: '/reader/search', icon: <FaSearch />, label: 'Tìm kiếm sách', badge: null },
        ]
      },
      {
        section: 'Sách của tôi',
        items: [
          { path: '/reader/my-books', icon: <FaBook />, label: 'Sách đang mượn', badge: '3' },
          { path: '/reader/reservations', icon: <FaBookmark />, label: 'Sách đặt trước', badge: '1' },
          { path: '/reader/history', icon: <FaHistory />, label: 'Lịch sử mượn', badge: null },
        ]
      },
      {
        section: 'Tài khoản',
        items: [
          { path: '/reader/profile', icon: <FaUser />, label: 'Thông tin cá nhân', badge: null },
          { path: '/reader/fines', icon: <FaDollarSign />, label: 'Tiền phạt', badge: '50k' },
        ]
      }
    ],
    'Thủ thư': [
      {
        section: 'Dashboard',
        items: [
          { path: '/librarian', icon: <FaHome />, label: 'Tổng quan', badge: null },
        ]
      },
      {
        section: 'Quản lý sách',
        items: [
          { path: '/books', icon: <FaBook />, label: 'Danh mục sách', badge: null },
          { path: '/borrows', icon: <FaExchangeAlt />, label: 'Mượn trả sách', badge: '24' },
          { path: '/librarian/reservations', icon: <FaBell />, label: 'Đặt trước sách', badge: '7' },
        ]
      },
      {
        section: 'Báo cáo',
        items: [
          { path: '/librarian/reports', icon: <FaChartBar />, label: 'Báo cáo thống kê', badge: null },
        ]
      }
    ],
    'Kế toán': [
      {
        section: 'Dashboard',
        items: [
          { path: '/accountant', icon: <FaHome />, label: 'Tổng quan', badge: null },
        ]
      },
      {
        section: 'Tài chính',
        items: [
          { path: '/accountant/transactions', icon: <FaDollarSign />, label: 'Giao dịch', badge: null },
          { path: '/accountant/purchase-proposals', icon: <FaFileAlt />, label: 'Đề xuất mua sách', badge: '3' },
          { path: '/accountant/purchase-orders', icon: <FaShoppingCart />, label: 'Đơn đặt hàng', badge: null },
          { path: '/accountant/suppliers', icon: <FaTruck />, label: 'Nhà cung cấp', badge: null },
        ]
      },
      {
        section: 'Báo cáo',
        items: [
          { path: '/accountant/reports', icon: <FaChartBar />, label: 'Báo cáo tài chính', badge: null },
        ]
      }
    ],
    'Thủ kho': [
      {
        section: 'Dashboard',
        items: [
          { path: '/warehouse', icon: <FaHome />, label: 'Tổng quan', badge: null },
        ]
      },
      {
        section: 'Kho sách',
        items: [
          { path: '/warehouse/inventory', icon: <FaWarehouse />, label: 'Quản lý tồn kho', badge: null },
          { path: '/warehouse/imports', icon: <FaTruck />, label: 'Nhập sách', badge: '5' },
          { path: '/warehouse/checks', icon: <FaClipboardCheck />, label: 'Kiểm kê', badge: null },
        ]
      },
      {
        section: 'Báo cáo',
        items: [
          { path: '/warehouse/reports', icon: <FaChartBar />, label: 'Báo cáo kho', badge: null },
        ]
      }
    ],
    'Quản lý': [
      {
        section: 'Dashboard',
        items: [
          { path: '/manager', icon: <FaHome />, label: 'Tổng quan', badge: null },
        ]
      },
      {
        section: 'Phê duyệt',
        items: [
          { path: '/manager/approvals', icon: <FaClipboardCheck />, label: 'Phê duyệt', badge: '12' },
        ]
      }
    ]
  };

  const currentNavItems = navigationItems[userRole] || navigationItems['Độc giả'];

  const isActivePath = (path) => {
    if (path === '/' || path === '/reader' || path === '/librarian' || path === '/accountant' || path === '/warehouse' || path === '/manager') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && window.innerWidth <= 768 && (
        <div 
          className="sidebar-overlay"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <FaGraduationCap />
            </div>
            {!collapsed && <span>Library System</span>}
          </div>
          
          <button 
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
              alt="User Avatar"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${userRole}&background=3b82f6&color=fff&size=100`;
              }}
            />
            <div className="user-status"></div>
          </div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">Nguyễn Văn A</div>
              <div className="user-role">{userRole}</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav scrollbar-hide">
          {currentNavItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="nav-section">
              {!collapsed && (
                <div className="nav-section-title">{section.section}</div>
              )}
              <ul className="nav-items">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="nav-item">
                    <a
                      href={item.path}
                      className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.path);
                        if (window.innerWidth <= 768) {
                          setCollapsed(true);
                        }
                      }}
                    >
                      <div className="nav-icon">{item.icon}</div>
                      {!collapsed && (
                        <>
                          <span className="nav-text">{item.label}</span>
                          {item.badge && (
                            <span className={`nav-badge ${item.badge === 'new' ? 'badge-new' : ''}`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button 
            className="footer-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
            {!collapsed && <span>{theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}</span>}
          </button>
          
          <button 
            className="footer-btn logout-btn"
            onClick={() => {
              // Handle logout
              console.log('Logout');
            }}
            title="Đăng xuất"
          >
            <FaSignOutAlt />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default ModernSidebar;