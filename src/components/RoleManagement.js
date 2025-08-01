import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUserShield, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaCrown,
  FaUserTie,
  FaUserCog,
  FaBookReader,
  FaCalculator,
  FaWarehouse,
  FaTools
} from 'react-icons/fa';
import { USER_ROLES, PERMISSIONS, ROLE_PERMISSIONS, ROLE_HIERARCHY } from '../utils/constants';
import PermissionService from '../services/permissionService';
import './RoleManagement.css';

const RoleManagement = ({ currentUserRole, onRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showAddRole, setShowAddRole] = useState(false);

  // Role icons mapping
  const roleIcons = {
    [USER_ROLES.DIRECTOR]: <FaCrown className="role-icon director" />,
    [USER_ROLES.ADMIN]: <FaUserShield className="role-icon admin" />,
    [USER_ROLES.LIBRARY_MANAGER]: <FaUserTie className="role-icon manager" />,
    [USER_ROLES.LIBRARIAN]: <FaBookReader className="role-icon librarian" />,
    [USER_ROLES.ACCOUNTING_MANAGER]: <FaUserTie className="role-icon manager" />,
    [USER_ROLES.ACCOUNTANT]: <FaCalculator className="role-icon accountant" />,
    [USER_ROLES.WAREHOUSE_MANAGER]: <FaUserTie className="role-icon manager" />,
    [USER_ROLES.WAREHOUSE_STAFF]: <FaWarehouse className="role-icon warehouse" />,
    [USER_ROLES.TECHNICIAN]: <FaTools className="role-icon technician" />,
    [USER_ROLES.READER]: <FaBookReader className="role-icon reader" />
  };

  // Permission categories
  const permissionCategories = {
    'Quản lý hệ thống': [
      PERMISSIONS.SYSTEM_MANAGEMENT,
      PERMISSIONS.USER_MANAGEMENT,
      PERMISSIONS.ROLE_MANAGEMENT,
      PERMISSIONS.CONFIGURATION,
      PERMISSIONS.BACKUP_RESTORE
    ],
    'Quản lý thư viện': [
      PERMISSIONS.BOOK_MANAGEMENT,
      PERMISSIONS.READER_MANAGEMENT,
      PERMISSIONS.BORROW_RETURN,
      PERMISSIONS.RESERVATION_MANAGEMENT,
      PERMISSIONS.EXTENSION_MANAGEMENT,
      PERMISSIONS.FINE_MANAGEMENT
    ],
    'Quản lý tài chính': [
      PERMISSIONS.FINANCIAL_MANAGEMENT,
      PERMISSIONS.PURCHASE_PROPOSAL,
      PERMISSIONS.PURCHASE_ORDER,
      PERMISSIONS.SUPPLIER_MANAGEMENT,
      PERMISSIONS.FINANCIAL_REPORTS
    ],
    'Quản lý kho': [
      PERMISSIONS.INVENTORY_MANAGEMENT,
      PERMISSIONS.STOCK_IN,
      PERMISSIONS.STOCK_CHECK,
      PERMISSIONS.WAREHOUSE_REPORTS
    ],
    'Báo cáo và giám sát': [
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
      PERMISSIONS.ACTIVITY_LOGS
    ],
    'Người dùng': [
      PERMISSIONS.BOOK_SEARCH,
      PERMISSIONS.BOOK_BORROW,
      PERMISSIONS.BOOK_RESERVE,
      PERMISSIONS.PROFILE_MANAGEMENT
    ]
  };

  // Permission descriptions
  const permissionDescriptions = {
    [PERMISSIONS.SYSTEM_MANAGEMENT]: 'Quản lý toàn bộ hệ thống',
    [PERMISSIONS.USER_MANAGEMENT]: 'Quản lý người dùng',
    [PERMISSIONS.ROLE_MANAGEMENT]: 'Quản lý vai trò và phân quyền',
    [PERMISSIONS.CONFIGURATION]: 'Cấu hình hệ thống',
    [PERMISSIONS.BACKUP_RESTORE]: 'Sao lưu và khôi phục dữ liệu',
    [PERMISSIONS.BOOK_MANAGEMENT]: 'Quản lý sách',
    [PERMISSIONS.READER_MANAGEMENT]: 'Quản lý độc giả',
    [PERMISSIONS.BORROW_RETURN]: 'Quản lý mượn/trả sách',
    [PERMISSIONS.RESERVATION_MANAGEMENT]: 'Quản lý đặt trước sách',
    [PERMISSIONS.EXTENSION_MANAGEMENT]: 'Quản lý gia hạn sách',
    [PERMISSIONS.FINE_MANAGEMENT]: 'Quản lý phí phạt',
    [PERMISSIONS.FINANCIAL_MANAGEMENT]: 'Quản lý tài chính',
    [PERMISSIONS.PURCHASE_PROPOSAL]: 'Đề xuất mua sách',
    [PERMISSIONS.PURCHASE_ORDER]: 'Quản lý đơn hàng',
    [PERMISSIONS.SUPPLIER_MANAGEMENT]: 'Quản lý nhà cung cấp',
    [PERMISSIONS.FINANCIAL_REPORTS]: 'Báo cáo tài chính',
    [PERMISSIONS.INVENTORY_MANAGEMENT]: 'Quản lý kho',
    [PERMISSIONS.STOCK_IN]: 'Nhập kho',
    [PERMISSIONS.STOCK_CHECK]: 'Kiểm kê',
    [PERMISSIONS.WAREHOUSE_REPORTS]: 'Báo cáo kho',
    [PERMISSIONS.REPORTS_VIEW]: 'Xem báo cáo',
    [PERMISSIONS.REPORTS_EXPORT]: 'Xuất báo cáo',
    [PERMISSIONS.ACTIVITY_LOGS]: 'Xem log hoạt động',
    [PERMISSIONS.BOOK_SEARCH]: 'Tìm kiếm sách',
    [PERMISSIONS.BOOK_BORROW]: 'Mượn sách',
    [PERMISSIONS.BOOK_RESERVE]: 'Đặt trước sách',
    [PERMISSIONS.PROFILE_MANAGEMENT]: 'Quản lý thông tin cá nhân'
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowPermissions(true);
  };

  const canManageRole = (targetRole) => {
    return PermissionService.canManageRole(currentUserRole, targetRole);
  };

  const canPerformRole = (targetRole) => {
    return PermissionService.canPerformRole(currentUserRole, targetRole);
  };

  const getManageableRoles = () => {
    return PermissionService.getManageableRoles(currentUserRole);
  };

  const getPerformableRoles = () => {
    return PermissionService.getPerformableRoles(currentUserRole);
  };

  const getRolePermissions = (role) => {
    return ROLE_PERMISSIONS[role] || [];
  };

  const isPermissionGranted = (role, permission) => {
    const rolePermissions = getRolePermissions(role);
    return rolePermissions.includes(permission);
  };

  const getRoleLevel = (role) => {
    return ROLE_HIERARCHY[role] || 0;
  };

  const getRoleLevelColor = (level) => {
    if (level >= 9) return '#dc2626'; // Red for highest
    if (level >= 8) return '#ea580c'; // Orange for management
    if (level >= 7) return '#ca8a04'; // Yellow for staff
    if (level >= 6) return '#16a34a'; // Green for technician
    return '#6b7280'; // Gray for reader
  };

  return (
    <div className="role-management">
      <div className="role-management-header">
        <h2>Quản lý vai trò và quyền hạn</h2>
        <p>Phân tích và quản lý vai trò trong hệ thống thư viện</p>
      </div>

      <div className="role-management-content">
        {/* Role Overview */}
        <div className="role-overview">
          <h3>Vai trò hiện tại: {currentUserRole}</h3>
          <div className="current-role-info">
            <div className="role-icon-container">
              {roleIcons[currentUserRole]}
            </div>
            <div className="role-details">
              <p className="role-description">
                {PermissionService.getRoleDescription(currentUserRole)}
              </p>
              <p className="role-level">
                Cấp độ: {getRoleLevel(currentUserRole)}
              </p>
            </div>
          </div>
        </div>

        {/* Role Hierarchy */}
        <div className="role-hierarchy">
          <h3>Thứ bậc vai trò</h3>
          <div className="hierarchy-tree">
            {Object.entries(ROLE_HIERARCHY)
              .sort(([,a], [,b]) => b - a) // Sort by level descending
              .map(([role, level]) => (
                <div 
                  key={role} 
                  className={`hierarchy-item ${selectedRole === role ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect(role)}
                >
                  <div className="hierarchy-level" style={{ backgroundColor: getRoleLevelColor(level) }}>
                    {level}
                  </div>
                  <div className="hierarchy-role">
                    {roleIcons[role]}
                    <span>{role}</span>
                  </div>
                  <div className="hierarchy-actions">
                    {canManageRole(role) && (
                      <button className="action-btn manage" title="Quản lý vai trò">
                        <FaUserCog />
                      </button>
                    )}
                    {canPerformRole(role) && (
                      <button className="action-btn perform" title="Thực hiện vai trò">
                        <FaEye />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Role Capabilities */}
        <div className="role-capabilities">
          <h3>Khả năng của vai trò hiện tại</h3>
          
          <div className="capabilities-grid">
            <div className="capability-card">
              <h4>Vai trò có thể quản lý</h4>
              <div className="capability-list">
                {getManageableRoles().length > 0 ? (
                  getManageableRoles().map(role => (
                    <div key={role} className="capability-item">
                      {roleIcons[role]}
                      <span>{role}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-capability">Không có vai trò nào để quản lý</p>
                )}
              </div>
            </div>

            <div className="capability-card">
              <h4>Vai trò có thể thực hiện</h4>
              <div className="capability-list">
                {getPerformableRoles().length > 0 ? (
                  getPerformableRoles().map(role => (
                    <div key={role} className="capability-item">
                      {roleIcons[role]}
                      <span>{role}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-capability">Không có vai trò nào để thực hiện</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Role Permissions */}
        {selectedRole && showPermissions && (
          <div className="role-permissions">
            <h3>Quyền hạn của vai trò: {selectedRole}</h3>
            <div className="permissions-container">
              {Object.entries(permissionCategories).map(([category, permissions]) => (
                <div key={category} className="permission-category">
                  <h4>{category}</h4>
                  <div className="permissions-list">
                    {permissions.map(permission => (
                      <div 
                        key={permission} 
                        className={`permission-item ${isPermissionGranted(selectedRole, permission) ? 'granted' : 'denied'}`}
                      >
                        <div className="permission-status">
                          {isPermissionGranted(selectedRole, permission) ? (
                            <FaCheck className="status-icon granted" />
                          ) : (
                            <FaTimes className="status-icon denied" />
                          )}
                        </div>
                        <div className="permission-info">
                          <span className="permission-name">{permission}</span>
                          <span className="permission-description">
                            {permissionDescriptions[permission]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Statistics */}
        <div className="role-statistics">
          <h3>Thống kê vai trò</h3>
          <div className="statistics-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h4>Tổng số vai trò</h4>
                <p className="stat-value">{Object.keys(USER_ROLES).length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FaUserShield />
              </div>
              <div className="stat-content">
                <h4>Vai trò quản lý</h4>
                <p className="stat-value">
                  {Object.values(USER_ROLES).filter(role => PermissionService.isManagementRole(role)).length}
                </p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FaUserCog />
              </div>
              <div className="stat-content">
                <h4>Vai trò nhân viên</h4>
                <p className="stat-value">
                  {Object.values(USER_ROLES).filter(role => PermissionService.isStaffRole(role)).length}
                </p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FaBookReader />
              </div>
              <div className="stat-content">
                <h4>Vai trò người dùng</h4>
                <p className="stat-value">1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement; 