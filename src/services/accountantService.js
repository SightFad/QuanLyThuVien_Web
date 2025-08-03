/**
 * Accountant Service - Quản lý các API calls dành riêng cho Accountant
 */
import apiService from './api';

class AccountantService {
  constructor() {
    this.dashboardUrl = '/api/AccountantDashboard';
    this.transactionsUrl = '/api/FinancialTransactions';
    this.reportsUrl = '/api/BaoCao';
  }

  // === DASHBOARD APIs ===

  // Lấy Accountant Dashboard Summary
  async getDashboardSummary() {
    try {
      const data = await apiService.get(`${this.dashboardUrl}/summary`);
      return this.mapDashboardSummaryFromApi(data);
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  // Lấy Financial Overview
  async getFinancialOverview(period = 'month') {
    try {
      const data = await apiService.get(`${this.dashboardUrl}/financial-overview?period=${period}`);
      return this.mapFinancialOverviewFromApi(data);
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      throw error;
    }
  }

  // === FINANCIAL TRANSACTIONS APIs ===

  // Lấy danh sách giao dịch
  async getTransactions(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        search: params.search || '',
        type: params.type || 'all',
        status: params.status || 'all',
        page: params.page || 1,
        pageSize: params.pageSize || 10
      });

      const data = await apiService.get(`${this.transactionsUrl}?${queryParams}`);
      return this.mapTransactionsFromApi(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Lấy chi tiết giao dịch
  async getTransactionById(id) {
    try {
      const data = await apiService.get(`${this.transactionsUrl}/${id}`);
      return this.mapTransactionFromApi(data);
    } catch (error) {
      console.error('Error fetching transaction detail:', error);
      throw error;
    }
  }

  // Tạo giao dịch mới
  async createTransaction(transactionData) {
    try {
      const mappedData = this.mapTransactionToApi(transactionData);
      const data = await apiService.post(this.transactionsUrl, mappedData);
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Cập nhật giao dịch
  async updateTransaction(id, transactionData) {
    try {
      const mappedData = this.mapUpdateTransactionToApi(transactionData);
      const data = await apiService.put(`${this.transactionsUrl}/${id}`, mappedData);
      return data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  // Xử lý thanh toán
  async processPayment(id, paymentData) {
    try {
      const data = await apiService.post(`${this.transactionsUrl}/${id}/process-payment`, paymentData);
      return data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Lấy thống kê giao dịch
  async getTransactionStatistics(period = 'month') {
    try {
      const data = await apiService.get(`${this.transactionsUrl}/statistics?period=${period}`);
      return data;
    } catch (error) {
      console.error('Error fetching transaction statistics:', error);
      throw error;
    }
  }

  // === FINANCIAL REPORTS APIs ===

  // Lấy báo cáo doanh thu tổng hợp
  async getRevenueReport(fromDate, toDate) {
    try {
      const data = await apiService.get(`${this.reportsUrl}/doanh-thu?tuNgay=${fromDate}&denNgay=${toDate}`);
      return data;
    } catch (error) {
      console.error('Error fetching revenue report:', error);
      throw error;
    }
  }

  // Lấy báo cáo phí thành viên
  async getMembershipFeeReport(fromDate, toDate) {
    try {
      const data = await apiService.get(`${this.reportsUrl}/phi-thanh-vien?tuNgay=${fromDate}&denNgay=${toDate}`);
      return data;
    } catch (error) {
      console.error('Error fetching membership fee report:', error);
      throw error;
    }
  }

  // Lấy báo cáo phí phạt
  async getFineReport(fromDate, toDate) {
    try {
      const data = await apiService.get(`${this.reportsUrl}/phi-phat?tuNgay=${fromDate}&denNgay=${toDate}`);
      return data;
    } catch (error) {
      console.error('Error fetching fine report:', error);
      throw error;
    }
  }

  // Lấy báo cáo tùy chỉnh
  async getCustomReport(reportData) {
    try {
      const data = await apiService.post(`${this.reportsUrl}/tuy-chinh`, reportData);
      return data;
    } catch (error) {
      console.error('Error fetching custom report:', error);
      throw error;
    }
  }

  // === MAPPING FUNCTIONS ===

  // Map Dashboard Summary từ API format sang frontend format
  mapDashboardSummaryFromApi(apiData) {
    return {
      stats: {
        totalRevenue: apiData.stats.totalRevenue,
        monthlyRevenue: apiData.stats.monthlyRevenue,
        pendingFines: apiData.stats.pendingFines,
        overdueFines: apiData.stats.overdueFines,
        todayTransactions: apiData.stats.todayTransactions,
        monthlyTransactions: apiData.stats.monthlyTransactions,
        totalMembers: apiData.stats.totalMembers,
        activeMembers: apiData.stats.activeMembers,
        totalBooks: apiData.stats.totalBooks,
        availableBooks: apiData.stats.availableBooks
      },
      financialData: {
        income: apiData.financialData.income,
        expenses: apiData.financialData.expenses,
        profit: apiData.financialData.profit
      },
      recentTransactions: apiData.recentTransactions?.map(t => ({
        id: t.id,
        type: t.type,
        title: t.title,
        amount: t.amount,
        time: t.time,
        memberName: t.memberName
      })) || [],
      generatedAt: apiData.generatedAt
    };
  }

  // Map Financial Overview từ API format sang frontend format
  mapFinancialOverviewFromApi(apiData) {
    return {
      totalRevenue: apiData.totalRevenue,
      membershipFees: apiData.membershipFees,
      fineRevenue: apiData.fineRevenue,
      dailyRevenue: apiData.dailyRevenue || [],
      topMembers: apiData.topMembers || [],
      period: apiData.period,
      generatedAt: apiData.generatedAt
    };
  }

  // Map Transactions từ API format sang frontend format
  mapTransactionsFromApi(apiData) {
    return {
      transactions: apiData.transactions?.map(t => ({
        id: t.id,
        date: t.date,
        type: t.type,
        memberName: t.memberName,
        memberId: t.memberId,
        amount: t.amount,
        paymentMethod: t.paymentMethod,
        status: t.status,
        description: t.description,
        paidDate: t.paidDate,
        collector: t.collector
      })) || [],
      pagination: apiData.pagination,
      summary: apiData.summary
    };
  }

  // Map Transaction detail từ API format sang frontend format
  mapTransactionFromApi(apiData) {
    return {
      id: apiData.id,
      date: apiData.date,
      type: apiData.type,
      memberName: apiData.memberName,
      memberId: apiData.memberId,
      memberEmail: apiData.memberEmail,
      memberPhone: apiData.memberPhone,
      amount: apiData.amount,
      paymentMethod: apiData.paymentMethod,
      status: apiData.status,
      description: apiData.description,
      paidDate: apiData.paidDate,
      collector: apiData.collector,
      violationId: apiData.violationId,
      violationInfo: apiData.violationInfo
    };
  }

  // Map Transaction từ frontend format sang API format
  mapTransactionToApi(frontendData) {
    return {
      MemberId: frontendData.memberId,
      Type: frontendData.type,
      Amount: frontendData.amount,
      PaymentMethod: frontendData.paymentMethod,
      Status: frontendData.status,
      Description: frontendData.description,
      Notes: frontendData.notes,
      Collector: frontendData.collector,
      ViolationId: frontendData.violationId
    };
  }

  // Map Update Transaction từ frontend format sang API format
  mapUpdateTransactionToApi(frontendData) {
    return {
      PaymentMethod: frontendData.paymentMethod,
      Status: frontendData.status,
      Amount: frontendData.amount,
      Notes: frontendData.notes,
      Collector: frontendData.collector
    };
  }

  // Tạo fallback data nếu API fail
  createFallbackDashboardData() {
    return {
      stats: {
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingFines: 0,
        overdueFines: 0,
        todayTransactions: 0,
        monthlyTransactions: 0,
        totalMembers: 0,
        activeMembers: 0,
        totalBooks: 0,
        availableBooks: 0
      },
      financialData: {
        income: 0,
        expenses: 0,
        profit: 0
      },
      recentTransactions: [],
      generatedAt: new Date().toISOString()
    };
  }

  createFallbackTransactionsData() {
    return {
      transactions: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
      },
      summary: {
        totalRevenue: 0,
        pendingAmount: 0,
        totalTransactions: 0
      }
    };
  }
}

export default new AccountantService();