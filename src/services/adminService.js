/**
 * Admin Service - Quản lý các API calls dành riêng cho Admin
 */
import apiService from './api';

class AdminService {
  constructor() {
    this.dashboardUrl = '/api/AdminDashboard';
    this.backupUrl = '/api/Backup';
    this.userUrl = '/api/User';
  }

  // === ADMIN DASHBOARD APIs ===

  // Lấy Admin Overview
  async getAdminOverview() {
    try {
      const data = await apiService.get(`${this.dashboardUrl}/overview`);
      return this.mapAdminOverviewFromApi(data);
    } catch (error) {
      console.error('Error fetching admin overview:', error);
      throw error;
    }
  }

  // Lấy System Status
  async getSystemStatus() {
    try {
      const data = await apiService.get(`${this.dashboardUrl}/system-status`);
      return data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      throw error;
    }
  }

  // Lấy Analytics
  async getAnalytics(period = 'month') {
    try {
      const data = await apiService.get(`${this.dashboardUrl}/analytics?period=${period}`);
      return data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // === USER MANAGEMENT APIs ===

  // Lấy danh sách users
  async getUsers() {
    try {
      const data = await apiService.get(this.userUrl);
      return data.map(this.mapUserFromApi);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Lấy user theo ID
  async getUserById(id) {
    try {
      const data = await apiService.get(`${this.userUrl}/${id}`);
      return this.mapUserFromApi(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Tạo user mới
  async createUser(userData) {
    try {
      const data = await apiService.post(this.userUrl, this.mapUserToApi(userData));
      return this.mapUserFromApi(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Cập nhật user
  async updateUser(id, userData) {
    try {
      await apiService.put(`${this.userUrl}/${id}`, this.mapUserToApi(userData));
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Xóa user
  async deleteUser(id) {
    try {
      await apiService.delete(`${this.userUrl}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(id, newPassword) {
    try {
      await apiService.post(`${this.userUrl}/${id}/reset-password`, { NewPassword: newPassword });
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Lấy available roles
  async getAvailableRoles() {
    try {
      const data = await apiService.get(`${this.userUrl}/roles`);
      return data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  // Lấy user statistics
  async getUserStatistics() {
    try {
      const data = await apiService.get(`${this.userUrl}/statistics`);
      return data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  }

  // === BACKUP MANAGEMENT APIs ===

  // Lấy backup history
  async getBackupHistory(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        pageSize: params.pageSize || 10
      });

      const data = await apiService.get(`${this.backupUrl}/history?${queryParams}`);
      return this.mapBackupHistoryFromApi(data);
    } catch (error) {
      console.error('Error fetching backup history:', error);
      throw error;
    }
  }

  // Lấy backup status
  async getBackupStatus() {
    try {
      const data = await apiService.get(`${this.backupUrl}/status`);
      return data;
    } catch (error) {
      console.error('Error fetching backup status:', error);
      throw error;
    }
  }

  // Tạo backup
  async createBackup(backupData = {}) {
    try {
      const data = await apiService.post(`${this.backupUrl}/create`, {
        Type: backupData.type || 'manual',
        Description: backupData.description || 'Manual backup from admin panel',
        IncludeUserData: backupData.includeUserData !== false,
        IncludeSystemData: backupData.includeSystemData !== false,
        EnableCompression: backupData.enableCompression !== false
      });
      return data;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  // Restore backup
  async restoreBackup(backupId, restoreOptions = {}) {
    try {
      const data = await apiService.post(`${this.backupUrl}/${backupId}/restore`, {
        OverwriteExisting: restoreOptions.overwriteExisting || false,
        RestoreUserData: restoreOptions.restoreUserData !== false,
        RestoreSystemData: restoreOptions.restoreSystemData !== false,
        CreateBackupBeforeRestore: restoreOptions.createBackupBeforeRestore !== false
      });
      return data;
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }

  // Xóa backup
  async deleteBackup(backupId) {
    try {
      await apiService.delete(`${this.backupUrl}/${backupId}`);
      return true;
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw error;
    }
  }

  // Lấy backup settings
  async getBackupSettings() {
    try {
      const data = await apiService.get(`${this.backupUrl}/settings`);
      return data;
    } catch (error) {
      console.error('Error fetching backup settings:', error);
      throw error;
    }
  }

  // Cập nhật backup settings
  async updateBackupSettings(settings) {
    try {
      await apiService.put(`${this.backupUrl}/settings`, settings);
      return true;
    } catch (error) {
      console.error('Error updating backup settings:', error);
      throw error;
    }
  }

  // === DATA MAPPING FUNCTIONS ===

  // Map Admin Overview từ API format sang frontend format
  mapAdminOverviewFromApi(apiData) {
    return {
      coreStats: {
        totalBooks: apiData.coreStats.totalBooks,
        totalReaders: apiData.coreStats.totalReaders,
        totalUsers: apiData.coreStats.totalUsers,
        totalBorrows: apiData.coreStats.totalBorrows,
        activeBorrows: apiData.coreStats.activeBorrows,
        overdueBorrows: apiData.coreStats.overdueBorrows,
        pendingReservations: apiData.coreStats.pendingReservations
      },
      monthlyActivity: {
        borrowsThisMonth: apiData.monthlyActivity.borrowsThisMonth,
        returnsThisMonth: apiData.monthlyActivity.returnsThisMonth,
        newReadersThisMonth: apiData.monthlyActivity.newReadersThisMonth,
        revenueThisMonth: apiData.monthlyActivity.revenueThisMonth
      },
      financial: {
        totalRevenue: apiData.financial.totalRevenue,
        monthlyRevenue: apiData.financial.monthlyRevenue,
        pendingFines: apiData.financial.pendingFines,
        revenueGrowth: apiData.financial.revenueGrowth
      },
      systemHealth: {
        lowStockBooks: apiData.systemHealth.lowStockBooks,
        outOfStockBooks: apiData.systemHealth.outOfStockBooks,
        inactiveUsers: apiData.systemHealth.inactiveUsers,
        systemStatus: apiData.systemHealth.systemStatus
      },
      growth: {
        borrowGrowth: apiData.growth.borrowGrowth,
        readerGrowth: apiData.growth.readerGrowth,
        revenueGrowth: apiData.growth.revenueGrowth
      },
      insights: {
        popularBooks: apiData.insights.popularBooks || [],
        activeUsers: apiData.insights.activeUsers || [],
        recentActivities: apiData.insights.recentActivities || []
      },
      generatedAt: apiData.generatedAt
    };
  }

  // Map User từ API format sang frontend format
  mapUserFromApi(apiUser) {
    return {
      id: apiUser.id || apiUser.maND,
      username: apiUser.username || apiUser.tenDangNhap,
      email: apiUser.email,
      role: apiUser.role || apiUser.chucVu,
      isActive: apiUser.isActive !== false,
      createdAt: apiUser.createdAt || apiUser.ngayTao,
      lastLoginAt: apiUser.lastLoginAt,
      docGiaId: apiUser.docGiaId,
      fullName: apiUser.fullName || apiUser.hoTen
    };
  }

  // Map User từ frontend format sang API format
  mapUserToApi(frontendUser) {
    return {
      Username: frontendUser.username,
      Email: frontendUser.email,
      Password: frontendUser.password,
      Role: frontendUser.role,
      IsActive: frontendUser.isActive !== false,
      DocGiaId: frontendUser.docGiaId
    };
  }

  // Map Backup History từ API format sang frontend format
  mapBackupHistoryFromApi(apiData) {
    return {
      backups: apiData.backups?.map(backup => ({
        id: backup.id,
        date: new Date(backup.date).toLocaleString('vi-VN'),
        type: backup.type,
        status: backup.status,
        size: `${backup.sizeInMB.toFixed(1)} MB`,
        duration: `${backup.duration} phút`,
        description: backup.description,
        error: backup.error
      })) || [],
      pagination: apiData.pagination,
      databaseInfo: apiData.databaseInfo,
      statistics: apiData.statistics
    };
  }

  // Tạo fallback data nếu API fail
  createFallbackAdminOverview() {
    return {
      coreStats: {
        totalBooks: 0,
        totalReaders: 0,
        totalUsers: 0,
        totalBorrows: 0,
        activeBorrows: 0,
        overdueBorrows: 0,
        pendingReservations: 0
      },
      monthlyActivity: {
        borrowsThisMonth: 0,
        returnsThisMonth: 0,
        newReadersThisMonth: 0,
        revenueThisMonth: 0
      },
      financial: {
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingFines: 0,
        revenueGrowth: 0
      },
      systemHealth: {
        lowStockBooks: 0,
        outOfStockBooks: 0,
        inactiveUsers: 0,
        systemStatus: 'unknown'
      },
      growth: {
        borrowGrowth: 0,
        readerGrowth: 0,
        revenueGrowth: 0
      },
      insights: {
        popularBooks: [],
        activeUsers: [],
        recentActivities: []
      },
      generatedAt: new Date().toISOString()
    };
  }

  createFallbackBackupHistory() {
    return {
      backups: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
      },
      databaseInfo: {
        tableCount: 0,
        recordCount: 0,
        sizeInMB: 0,
        details: {}
      },
      statistics: {
        totalBackups: 0,
        successfulBackups: 0,
        failedBackups: 0,
        averageSize: 0,
        lastBackupDate: null
      }
    };
  }
}

export default new AdminService();