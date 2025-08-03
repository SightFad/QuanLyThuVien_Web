/**
 * User Service - Quản lý thông tin người dùng và các utility functions
 */

class UserService {
  constructor() {
    this.storageKey = 'user';
    this.tokenKey = 'token';
  }

  // Lấy thông tin user từ localStorage
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.storageKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Lấy userId hiện tại
  getCurrentUserId() {
    const user = this.getCurrentUser();
    return user?.userId || null;
  }

  // Lấy docGiaId hiện tại (chỉ cho Reader)
  getCurrentDocGiaId() {
    const user = this.getCurrentUser();
    return user?.docGiaId || null;
  }

  // Kiểm tra xem user có phải là Reader không
  isReader() {
    const user = this.getCurrentUser();
    return user?.isReader || false;
  }

  // Kiểm tra xem user có phải là VIP Reader không
  isVipReader() {
    const user = this.getCurrentUser();
    return user?.isVipReader || false;
  }

  // Kiểm tra xem Reader có active membership không
  isActiveReader() {
    const user = this.getCurrentUser();
    return user?.isActiveReader || false;
  }

  // Lấy loại độc giả
  getReaderType() {
    const user = this.getCurrentUser();
    return user?.loaiDocGia || null;
  }

  // Lấy cấp bậc độc giả
  getReaderLevel() {
    const user = this.getCurrentUser();
    return user?.capBac || null;
  }

  // Lấy trạng thái thành viên
  getMemberStatus() {
    const user = this.getCurrentUser();
    return user?.memberStatus || null;
  }

  // Lấy giới hạn mượn sách
  getBorrowLimit() {
    const user = this.getCurrentUser();
    return user?.soSachToiDa || 5;
  }

  // Lấy giới hạn ngày mượn
  getBorrowDaysLimit() {
    const user = this.getCurrentUser();
    return user?.soNgayMuonToiDa || 14;
  }

  // Kiểm tra quyền hạn dựa trên role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Kiểm tra nhiều role
  hasAnyRole(roles) {
    const user = this.getCurrentUser();
    return roles.includes(user?.role);
  }

  // Kiểm tra xem user có quyền truy cập không
  canAccess(requiredRoles) {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return this.hasAnyRole(requiredRoles);
  }

  // Lấy tên hiển thị
  getDisplayName() {
    const user = this.getCurrentUser();
    return user?.hoTen || user?.username || 'Người dùng';
  }

  // Lấy email
  getEmail() {
    const user = this.getCurrentUser();
    return user?.email || '';
  }

  // Kiểm tra xem token có hết hạn không
  isTokenExpired() {
    const user = this.getCurrentUser();
    if (!user?.expiresAt) return true;
    
    const expiryDate = new Date(user.expiresAt);
    return expiryDate <= new Date();
  }

  // Lấy thông tin Reader chi tiết (chỉ cho Reader)
  getReaderInfo() {
    const user = this.getCurrentUser();
    if (!this.isReader()) return null;

    return {
      docGiaId: user.docGiaId,
      hoTen: user.hoTen,
      email: user.email,
      loaiDocGia: user.loaiDocGia,
      capBac: user.capBac,
      memberStatus: user.memberStatus,
      ngayHetHan: user.ngayHetHan,
      soSachToiDa: user.soSachToiDa,
      soNgayMuonToiDa: user.soNgayMuonToiDa,
      isVip: user.isVipReader,
      isActive: user.isActiveReader,
    };
  }

  // Lấy thông tin quyền hạn dựa trên loại Reader
  getReaderPermissions() {
    const user = this.getCurrentUser();
    if (!this.isReader()) return null;

    const basePermissions = {
      canBorrow: this.isActiveReader(),
      maxBooks: this.getBorrowLimit(),
      maxDays: this.getBorrowDaysLimit(),
      canReserve: this.isActiveReader(),
    };

    // VIP Reader có quyền hạn mở rộng
    if (this.isVipReader()) {
      return {
        ...basePermissions,
        maxBooks: basePermissions.maxBooks + 2, // VIP được mượn thêm 2 cuốn
        maxDays: basePermissions.maxDays + 7,   // VIP được mượn thêm 7 ngày
        priorityReservation: true,               // Ưu tiên đặt trước
        extendedRenewal: true,                   // Gia hạn mở rộng
      };
    }

    return basePermissions;
  }

  // Clear user data khi logout
  clearUserData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenKey);
  }

  // Debug info
  getDebugInfo() {
    const user = this.getCurrentUser();
    if (!user) return { message: 'No user logged in' };

    return {
      userId: user.userId,
      username: user.username,
      role: user.role,
      isReader: this.isReader(),
      readerType: this.getReaderType(),
      readerLevel: this.getReaderLevel(),
      memberStatus: this.getMemberStatus(),
      isActive: this.isActiveReader(),
      isVip: this.isVipReader(),
      permissions: this.getReaderPermissions(),
      tokenExpired: this.isTokenExpired(),
    };
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;

// Named exports for convenience
export {
  userService,
  UserService,
};