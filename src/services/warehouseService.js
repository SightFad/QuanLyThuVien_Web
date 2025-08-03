/**
 * Warehouse Service - Quản lý các API calls dành riêng cho Warehouse
 */
import apiService from './api';

class WarehouseService {
  constructor() {
    this.dashboardUrl = '/api/WarehouseDashboard';
    this.inventoryUrl = '/api/InventoryManagement';
    this.stockReportsUrl = '/api/StockReports';
    this.importsUrl = '/api/PhieuNhapKho';
    this.checksUrl = '/api/InventoryCheck';
  }

  // === DASHBOARD APIs ===

  // Lấy Warehouse Dashboard Summary
  async getDashboardSummary() {
    try {
      const data = await apiService.get(`${this.dashboardUrl}/summary`);
      return this.mapDashboardSummaryFromApi(data);
    } catch (error) {
      console.error('Error fetching warehouse dashboard summary:', error);
      throw error;
    }
  }

  // Lấy Inventory Status
  async getInventoryStatus() {
    try {
      const data = await apiService.get(`${this.dashboardUrl}/inventory-status`);
      return data;
    } catch (error) {
      console.error('Error fetching inventory status:', error);
      throw error;
    }
  }

  // === INVENTORY MANAGEMENT APIs ===

  // Lấy danh sách tồn kho
  async getInventory(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        search: params.search || '',
        status: params.status || 'all',
        location: params.location || 'all',
        page: params.page || 1,
        pageSize: params.pageSize || 10
      });

      const data = await apiService.get(`${this.inventoryUrl}?${queryParams}`);
      return this.mapInventoryFromApi(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  }

  // Lấy chi tiết tồn kho
  async getInventoryItem(id) {
    try {
      const data = await apiService.get(`${this.inventoryUrl}/${id}`);
      return this.mapInventoryItemFromApi(data);
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  }

  // Cập nhật vị trí sách
  async updateBookLocation(id, location) {
    try {
      const data = await apiService.put(`${this.inventoryUrl}/${id}/location`, { Location: location });
      return data;
    } catch (error) {
      console.error('Error updating book location:', error);
      throw error;
    }
  }

  // Cập nhật tình trạng sách
  async updateBookCondition(id, condition, notes = '') {
    try {
      const data = await apiService.put(`${this.inventoryUrl}/${id}/condition`, { 
        Condition: condition, 
        Notes: notes 
      });
      return data;
    } catch (error) {
      console.error('Error updating book condition:', error);
      throw error;
    }
  }

  // Điều chỉnh số lượng
  async adjustQuantity(id, adjustmentQuantity, reason, notes = '') {
    try {
      const data = await apiService.post(`${this.inventoryUrl}/${id}/adjust-quantity`, {
        AdjustmentQuantity: adjustmentQuantity,
        Reason: reason,
        Notes: notes
      });
      return data;
    } catch (error) {
      console.error('Error adjusting quantity:', error);
      throw error;
    }
  }

  // Lấy sách sắp hết
  async getLowStockItems(threshold = 5) {
    try {
      const data = await apiService.get(`${this.inventoryUrl}/low-stock?threshold=${threshold}`);
      return data;
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
  }

  // Lấy thống kê tồn kho
  async getInventoryStatistics() {
    try {
      const data = await apiService.get(`${this.inventoryUrl}/statistics`);
      return data;
    } catch (error) {
      console.error('Error fetching inventory statistics:', error);
      throw error;
    }
  }

  // === STOCK REPORTS APIs ===

  // Lấy báo cáo kho
  async getStockReports(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        type: params.type || 'all',
        status: params.status || 'all',
        page: params.page || 1,
        pageSize: params.pageSize || 10
      });

      const data = await apiService.get(`${this.stockReportsUrl}?${queryParams}`);
      return this.mapStockReportsFromApi(data);
    } catch (error) {
      console.error('Error fetching stock reports:', error);
      throw error;
    }
  }

  // Lấy thống kê báo cáo kho
  async getStockStatistics() {
    try {
      const data = await apiService.get(`${this.stockReportsUrl}/statistics`);
      return data;
    } catch (error) {
      console.error('Error fetching stock statistics:', error);
      throw error;
    }
  }

  // Lấy chi tiết sách sắp hết
  async getLowStockDetails(threshold = 5) {
    try {
      const data = await apiService.get(`${this.stockReportsUrl}/low-stock-details?threshold=${threshold}`);
      return data;
    } catch (error) {
      console.error('Error fetching low stock details:', error);
      throw error;
    }
  }

  // Lấy báo cáo sách hư hỏng
  async getDamagedBooksReport() {
    try {
      const data = await apiService.get(`${this.stockReportsUrl}/damaged-books`);
      return data;
    } catch (error) {
      console.error('Error fetching damaged books report:', error);
      throw error;
    }
  }

  // Lấy lịch sử nhập kho
  async getImportHistory(months = 6) {
    try {
      const data = await apiService.get(`${this.stockReportsUrl}/import-history?months=${months}`);
      return data;
    } catch (error) {
      console.error('Error fetching import history:', error);
      throw error;
    }
  }

  // === MAPPING FUNCTIONS ===

  // Map Dashboard Summary từ API format sang frontend format
  mapDashboardSummaryFromApi(apiData) {
    return {
      stats: {
        totalBooks: apiData.stats.totalBooks,
        totalUniqueBooks: apiData.stats.totalUniqueBooks,
        booksInStock: apiData.stats.booksInStock,
        booksOutOfStock: apiData.stats.booksOutOfStock,
        pendingOrders: apiData.stats.pendingOrders,
        todayDeliveries: apiData.stats.todayDeliveries,
        damagedBooks: apiData.stats.damagedBooks
      },
      overview: {
        stockRatio: apiData.overview.stockRatio,
        lowStockCount: apiData.overview.lowStockCount,
        qualityRatio: apiData.overview.qualityRatio
      },
      recentActivities: apiData.recentActivities?.map(a => ({
        id: a.id,
        type: a.type,
        description: a.description,
        time: a.time,
        status: a.status
      })) || [],
      alerts: {
        lowStockBooks: apiData.alerts?.lowStockBooks || [],
        outOfStockBooks: apiData.alerts?.outOfStockBooks || []
      },
      generatedAt: apiData.generatedAt
    };
  }

  // Map Inventory từ API format sang frontend format
  mapInventoryFromApi(apiData) {
    return {
      inventory: apiData.inventory?.map(item => ({
        id: item.id,
        bookTitle: item.bookTitle,
        author: item.author,
        isbn: item.isbn,
        category: item.category,
        totalQuantity: item.totalQuantity,
        availableQuantity: item.availableQuantity,
        borrowedQuantity: item.borrowedQuantity,
        location: item.location,
        status: item.status,
        condition: item.condition,
        price: item.price,
        publishYear: item.publishYear,
        publisher: item.publisher,
        entryDate: item.entryDate,
        lastUpdated: item.lastUpdated
      })) || [],
      pagination: apiData.pagination,
      summary: apiData.summary,
      locations: apiData.locations || []
    };
  }

  // Map Inventory Item từ API format sang frontend format
  mapInventoryItemFromApi(apiData) {
    return {
      id: apiData.id,
      bookTitle: apiData.bookTitle,
      author: apiData.author,
      isbn: apiData.isbn,
      category: apiData.category,
      totalQuantity: apiData.totalQuantity,
      availableQuantity: apiData.availableQuantity,
      borrowedQuantity: apiData.borrowedQuantity,
      location: apiData.location,
      status: apiData.status,
      condition: apiData.condition,
      price: apiData.price,
      publishYear: apiData.publishYear,
      publisher: apiData.publisher,
      description: apiData.description,
      coverImage: apiData.coverImage,
      entryDate: apiData.entryDate,
      lastUpdated: apiData.lastUpdated
    };
  }

  // Map Stock Reports từ API format sang frontend format
  mapStockReportsFromApi(apiData) {
    return {
      reports: apiData.reports?.map(report => ({
        id: report.id,
        reportNumber: report.reportNumber,
        title: report.title,
        type: report.type,
        priority: report.priority,
        status: report.status,
        reportedBy: report.reportedBy,
        reportDate: report.reportDate,
        affectedBooks: report.affectedBooks,
        estimatedLoss: report.estimatedLoss,
        description: report.description,
        actions: report.actions,
        details: report.details
      })) || [],
      pagination: apiData.pagination,
      summary: apiData.summary
    };
  }

  // Tạo fallback data nếu API fail
  createFallbackDashboardData() {
    return {
      stats: {
        totalBooks: 0,
        totalUniqueBooks: 0,
        booksInStock: 0,
        booksOutOfStock: 0,
        pendingOrders: 0,
        todayDeliveries: 0,
        damagedBooks: 0
      },
      overview: {
        stockRatio: 0,
        lowStockCount: 0,
        qualityRatio: 100
      },
      recentActivities: [],
      alerts: {
        lowStockBooks: [],
        outOfStockBooks: []
      },
      generatedAt: new Date().toISOString()
    };
  }

  createFallbackInventoryData() {
    return {
      inventory: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
      },
      summary: {
        totalBooks: 0,
        availableBooks: 0,
        borrowedBooks: 0,
        outOfStockCount: 0,
        lowStockCount: 0,
        uniqueTitles: 0
      },
      locations: []
    };
  }

  createFallbackStockReportsData() {
    return {
      reports: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
      },
      summary: {
        totalReports: 0,
        totalAffectedBooks: 0,
        totalEstimatedLoss: 0,
        reportsByType: {
          lowStock: 0,
          outOfStock: 0,
          damaged: 0
        }
      }
    };
  }
}

export default new WarehouseService();