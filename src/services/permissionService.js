import { USER_ROLES, ROLE_PERMISSIONS, ROLE_HIERARCHY, PERMISSIONS } from '../utils/constants';

class PermissionService {
  /**
   * Kiểm tra xem người dùng có quyền thực hiện hành động không
   * @param {string} userRole - Vai trò của người dùng
   * @param {string} permission - Quyền cần kiểm tra
   * @returns {boolean} - Có quyền hay không
   */
  static hasPermission(userRole, permission) {
    if (!userRole || !permission) return false;
    
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    return userPermissions.includes(permission);
  }

  /**
   * Kiểm tra xem người dùng có bất kỳ quyền nào trong danh sách không
   * @param {string} userRole - Vai trò của người dùng
   * @param {Array<string>} permissions - Danh sách quyền cần kiểm tra
   * @returns {boolean} - Có quyền hay không
   */
  static hasAnyPermission(userRole, permissions) {
    if (!userRole || !permissions || !Array.isArray(permissions)) return false;
    
    return permissions.some(permission => this.hasPermission(userRole, permission));
  }

  /**
   * Kiểm tra xem người dùng có tất cả quyền trong danh sách không
   * @param {string} userRole - Vai trò của người dùng
   * @param {Array<string>} permissions - Danh sách quyền cần kiểm tra
   * @returns {boolean} - Có quyền hay không
   */
  static hasAllPermissions(userRole, permissions) {
    if (!userRole || !permissions || !Array.isArray(permissions)) return false;
    
    return permissions.every(permission => this.hasPermission(userRole, permission));
  }

  /**
   * Lấy tất cả quyền của một vai trò
   * @param {string} userRole - Vai trò của người dùng
   * @returns {Array<string>} - Danh sách quyền
   */
  static getRolePermissions(userRole) {
    return ROLE_PERMISSIONS[userRole] || [];
  }

  /**
   * Kiểm tra xem vai trò có thể quản lý vai trò khác không
   * @param {string} managerRole - Vai trò quản lý
   * @param {string} targetRole - Vai trò mục tiêu
   * @returns {boolean} - Có thể quản lý hay không
   */
  static canManageRole(managerRole, targetRole) {
    if (!managerRole || !targetRole) return false;
    
    const managerLevel = ROLE_HIERARCHY[managerRole] || 0;
    const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
    
    // Chỉ có thể quản lý vai trò có cấp độ thấp hơn
    return managerLevel > targetLevel;
  }

  /**
   * Lấy danh sách vai trò mà một vai trò có thể quản lý
   * @param {string} managerRole - Vai trò quản lý
   * @returns {Array<string>} - Danh sách vai trò có thể quản lý
   */
  static getManageableRoles(managerRole) {
    if (!managerRole) return [];
    
    const managerLevel = ROLE_HIERARCHY[managerRole] || 0;
    return Object.entries(ROLE_HIERARCHY)
      .filter(([role, level]) => level < managerLevel)
      .map(([role]) => role);
  }

  /**
   * Kiểm tra xem vai trò có thể thực hiện chức năng của vai trò khác không
   * @param {string} userRole - Vai trò hiện tại
   * @param {string} targetRole - Vai trò mục tiêu
   * @returns {boolean} - Có thể thực hiện hay không
   */
  static canPerformRole(userRole, targetRole) {
    if (!userRole || !targetRole) return false;
    
    // Giám đốc có thể thực hiện tất cả vai trò
    if (userRole === USER_ROLES.DIRECTOR) return true;
    
    // Quản trị viên có thể thực hiện tất cả vai trò trừ Giám đốc
    if (userRole === USER_ROLES.ADMIN && targetRole !== USER_ROLES.DIRECTOR) return true;
    
    // Kỹ thuật viên có thể thực hiện một số vai trò cụ thể
    if (userRole === USER_ROLES.TECHNICIAN) {
      const allowedRoles = [
        USER_ROLES.LIBRARIAN,
        USER_ROLES.ACCOUNTANT,
        USER_ROLES.WAREHOUSE_STAFF
      ];
      return allowedRoles.includes(targetRole);
    }
    
    // Trưởng thư viện có thể thực hiện vai trò thủ thư
    if (userRole === USER_ROLES.LIBRARY_MANAGER && targetRole === USER_ROLES.LIBRARIAN) return true;
    
    // Trưởng phòng kế toán có thể thực hiện vai trò nhân viên kế toán
    if (userRole === USER_ROLES.ACCOUNTING_MANAGER && targetRole === USER_ROLES.ACCOUNTANT) return true;
    
    // Trưởng kho có thể thực hiện vai trò nhân viên kho
    if (userRole === USER_ROLES.WAREHOUSE_MANAGER && targetRole === USER_ROLES.WAREHOUSE_STAFF) return true;
    
    return false;
  }

  /**
   * Lấy danh sách vai trò mà một vai trò có thể thực hiện
   * @param {string} userRole - Vai trò hiện tại
   * @returns {Array<string>} - Danh sách vai trò có thể thực hiện
   */
  static getPerformableRoles(userRole) {
    if (!userRole) return [];
    
    switch (userRole) {
      case USER_ROLES.DIRECTOR:
        return Object.values(USER_ROLES);
      
      case USER_ROLES.ADMIN:
        return Object.values(USER_ROLES).filter(role => role !== USER_ROLES.DIRECTOR);
      
      case USER_ROLES.TECHNICIAN:
        return [
          USER_ROLES.LIBRARIAN,
          USER_ROLES.ACCOUNTANT,
          USER_ROLES.WAREHOUSE_STAFF
        ];
      
      case USER_ROLES.LIBRARY_MANAGER:
        return [USER_ROLES.LIBRARIAN];
      
      case USER_ROLES.ACCOUNTING_MANAGER:
        return [USER_ROLES.ACCOUNTANT];
      
      case USER_ROLES.WAREHOUSE_MANAGER:
        return [USER_ROLES.WAREHOUSE_STAFF];
      
      default:
        return [];
    }
  }

  /**
   * Kiểm tra xem vai trò có quyền xem log hoạt động không
   * @param {string} userRole - Vai trò người dùng
   * @param {string} targetRole - Vai trò mục tiêu (nếu null thì xem tất cả)
   * @returns {boolean} - Có quyền xem log hay không
   */
  static canViewActivityLogs(userRole, targetRole = null) {
    if (!userRole) return false;
    
    // Giám đốc và Admin có thể xem tất cả log
    if ([USER_ROLES.DIRECTOR, USER_ROLES.ADMIN].includes(userRole)) return true;
    
    // Các vai trò quản lý có thể xem log của vai trò dưới quyền
    if (targetRole) {
      return this.canManageRole(userRole, targetRole);
    }
    
    // Kiểm tra quyền xem log
    return this.hasPermission(userRole, PERMISSIONS.ACTIVITY_LOGS);
  }

  /**
   * Lấy danh sách vai trò mà một vai trò có thể xem log
   * @param {string} userRole - Vai trò người dùng
   * @returns {Array<string>} - Danh sách vai trò có thể xem log
   */
  static getViewableLogRoles(userRole) {
    if (!userRole) return [];
    
    switch (userRole) {
      case USER_ROLES.DIRECTOR:
      case USER_ROLES.ADMIN:
        return Object.values(USER_ROLES);
      
      case USER_ROLES.LIBRARY_MANAGER:
        return [USER_ROLES.LIBRARIAN];
      
      case USER_ROLES.ACCOUNTING_MANAGER:
        return [USER_ROLES.ACCOUNTANT];
      
      case USER_ROLES.WAREHOUSE_MANAGER:
        return [USER_ROLES.WAREHOUSE_STAFF];
      
      case USER_ROLES.TECHNICIAN:
        return [
          USER_ROLES.LIBRARIAN,
          USER_ROLES.ACCOUNTANT,
          USER_ROLES.WAREHOUSE_STAFF
        ];
      
      default:
        return [];
    }
  }

  /**
   * Kiểm tra xem vai trò có quyền xuất báo cáo không
   * @param {string} userRole - Vai trò người dùng
   * @returns {boolean} - Có quyền xuất báo cáo hay không
   */
  static canExportReports(userRole) {
    return this.hasPermission(userRole, PERMISSIONS.REPORTS_EXPORT);
  }

  /**
   * Kiểm tra xem vai trò có quyền xem báo cáo không
   * @param {string} userRole - Vai trò người dùng
   * @returns {boolean} - Có quyền xem báo cáo hay không
   */
  static canViewReports(userRole) {
    return this.hasPermission(userRole, PERMISSIONS.REPORTS_VIEW);
  }

  /**
   * Lấy cấp độ vai trò
   * @param {string} userRole - Vai trò người dùng
   * @returns {number} - Cấp độ vai trò
   */
  static getRoleLevel(userRole) {
    return ROLE_HIERARCHY[userRole] || 0;
  }

  /**
   * So sánh cấp độ hai vai trò
   * @param {string} role1 - Vai trò thứ nhất
   * @param {string} role2 - Vai trò thứ hai
   * @returns {number} - 1 nếu role1 cao hơn, -1 nếu role2 cao hơn, 0 nếu bằng nhau
   */
  static compareRoleLevel(role1, role2) {
    const level1 = this.getRoleLevel(role1);
    const level2 = this.getRoleLevel(role2);
    
    if (level1 > level2) return 1;
    if (level1 < level2) return -1;
    return 0;
  }

  /**
   * Kiểm tra xem vai trò có phải là vai trò quản lý không
   * @param {string} userRole - Vai trò người dùng
   * @returns {boolean} - Có phải vai trò quản lý hay không
   */
  static isManagementRole(userRole) {
    const managementRoles = [
      USER_ROLES.DIRECTOR,
      USER_ROLES.ADMIN,
      USER_ROLES.LIBRARY_MANAGER,
      USER_ROLES.ACCOUNTING_MANAGER,
      USER_ROLES.WAREHOUSE_MANAGER
    ];
    return managementRoles.includes(userRole);
  }

  /**
   * Kiểm tra xem vai trò có phải là vai trò nhân viên không
   * @param {string} userRole - Vai trò người dùng
   * @returns {boolean} - Có phải vai trò nhân viên hay không
   */
  static isStaffRole(userRole) {
    const staffRoles = [
      USER_ROLES.LIBRARIAN,
      USER_ROLES.ACCOUNTANT,
      USER_ROLES.WAREHOUSE_STAFF,
      USER_ROLES.TECHNICIAN
    ];
    return staffRoles.includes(userRole);
  }

  /**
   * Lấy mô tả vai trò
   * @param {string} userRole - Vai trò người dùng
   * @returns {string} - Mô tả vai trò
   */
  static getRoleDescription(userRole) {
    const descriptions = {
      [USER_ROLES.DIRECTOR]: 'Quản lý tối cao, có tất cả quyền trong hệ thống',
      [USER_ROLES.ADMIN]: 'Quản trị hệ thống, phân quyền người dùng',
      [USER_ROLES.LIBRARY_MANAGER]: 'Quản lý thủ thư, duyệt đề xuất bổ sung sách',
      [USER_ROLES.LIBRARIAN]: 'Quản lý mượn/trả sách, đăng ký độc giả',
      [USER_ROLES.ACCOUNTING_MANAGER]: 'Duyệt đề xuất mua sách, quản lý kế toán',
      [USER_ROLES.ACCOUNTANT]: 'Xử lý giao dịch tài chính, quản lý đơn hàng',
      [USER_ROLES.WAREHOUSE_MANAGER]: 'Quản lý kho sách, duyệt đề xuất bổ sung',
      [USER_ROLES.WAREHOUSE_STAFF]: 'Nhập kho, kiểm kê, quản lý tồn kho',
      [USER_ROLES.TECHNICIAN]: 'Bảo trì hệ thống, sao lưu dữ liệu',
      [USER_ROLES.READER]: 'Mượn sách, tìm kiếm, quản lý thông tin cá nhân'
    };
    
    return descriptions[userRole] || 'Không có mô tả';
  }
}

export default PermissionService; 