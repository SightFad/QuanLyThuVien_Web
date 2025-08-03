/**
 * Librarian Reports Service - Quản lý các API calls cho báo cáo thư viện
 */
import apiService from './api';

class LibrarianReportsService {
  constructor() {
    this.baseUrl = '/api/LibrarianReports';
  }

  // Lấy báo cáo tổng quan
  async getOverviewReport(period = 'month') {
    try {
      const data = await apiService.get(`${this.baseUrl}/overview?period=${period}`);
      return this.mapOverviewFromApi(data);
    } catch (error) {
      console.error('Error fetching overview report:', error);
      throw error;
    }
  }

  // Lấy báo cáo mượn trả
  async getBorrowingReport(period = 'month') {
    try {
      const data = await apiService.get(`${this.baseUrl}/borrowing?period=${period}`);
      return this.mapBorrowingFromApi(data);
    } catch (error) {
      console.error('Error fetching borrowing report:', error);
      throw error;
    }
  }

  // Lấy báo cáo quá hạn
  async getOverdueReport() {
    try {
      const data = await apiService.get(`${this.baseUrl}/overdue`);
      return this.mapOverdueFromApi(data);
    } catch (error) {
      console.error('Error fetching overdue report:', error);
      throw error;
    }
  }

  // Lấy báo cáo tổng hợp
  async getSummaryReport(period = 'month') {
    try {
      const data = await apiService.get(`${this.baseUrl}/summary?period=${period}`);
      return data;
    } catch (error) {
      console.error('Error fetching summary report:', error);
      throw error;
    }
  }

  // Export báo cáo (placeholder - cần implement)
  async exportReport(reportType, period = 'month', format = 'pdf') {
    try {
      // TODO: Implement export functionality
      console.log(`Exporting ${reportType} report for ${period} as ${format}`);
      return { success: true, message: 'Báo cáo đã được xuất thành công!' };
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  // === MAPPING FUNCTIONS ===

  // Map Overview report từ API format sang frontend format
  mapOverviewFromApi(apiData) {
    return {
      totalBooks: apiData.totalBooks,
      totalReaders: apiData.totalReaders,
      totalBorrows: apiData.totalBorrows,
      totalReturns: apiData.totalReturns,
      overdueBooks: apiData.overdueBooks,
      totalFines: apiData.totalFines,
      popularBooks: apiData.popularBooks?.map(book => ({
        title: book.title,
        borrows: book.borrows
      })) || [],
      categoryStats: apiData.categoryStats?.map(category => ({
        category: category.category,
        count: category.count
      })) || [],
      reportPeriod: apiData.reportPeriod,
      generatedAt: apiData.generatedAt
    };
  }

  // Map Borrowing report từ API format sang frontend format
  mapBorrowingFromApi(apiData) {
    return {
      dailyStats: apiData.dailyStats?.map(day => ({
        date: day.date,
        borrows: day.borrows,
        returns: day.returns
      })) || [],
      readerStats: apiData.readerStats?.map(reader => ({
        reader: reader.reader,
        borrows: reader.borrows,
        returns: reader.returns
      })) || [],
      weeklyTrends: apiData.weeklyTrends || [],
      totalBorrows: apiData.totalBorrows,
      totalReturns: apiData.totalReturns,
      reportPeriod: apiData.reportPeriod,
      generatedAt: apiData.generatedAt
    };
  }

  // Map Overdue report từ API format sang frontend format
  mapOverdueFromApi(apiData) {
    return {
      overdueBooks: apiData.overdueBooks?.map(book => ({
        reader: book.reader,
        readerId: book.readerId,
        book: book.book,
        bookId: book.bookId,
        dueDate: book.dueDate,
        borrowDate: book.borrowDate,
        daysOverdue: book.daysOverdue,
        fine: book.fine,
        phieuMuonId: book.phieuMuonId
      })) || [],
      totalOverdue: apiData.totalOverdue,
      totalFines: apiData.totalFines,
      overdueRanges: apiData.overdueRanges,
      topOverdueReaders: apiData.topOverdueReaders?.map(reader => ({
        reader: reader.reader,
        readerId: reader.readerId,
        overdueCount: reader.overdueCount,
        totalFine: reader.totalFine
      })) || [],
      reportDate: apiData.reportDate,
      generatedAt: apiData.generatedAt
    };
  }

  // Tạo fallback data nếu API fail
  createFallbackOverviewData() {
    return {
      totalBooks: 0,
      totalReaders: 0,
      totalBorrows: 0,
      totalReturns: 0,
      overdueBooks: 0,
      totalFines: 0,
      popularBooks: [],
      categoryStats: [],
      reportPeriod: 'N/A',
      generatedAt: new Date().toISOString()
    };
  }

  createFallbackBorrowingData() {
    return {
      dailyStats: [],
      readerStats: [],
      weeklyTrends: [],
      totalBorrows: 0,
      totalReturns: 0,
      reportPeriod: 'N/A',
      generatedAt: new Date().toISOString()
    };
  }

  createFallbackOverdueData() {
    return {
      overdueBooks: [],
      totalOverdue: 0,
      totalFines: 0,
      overdueRanges: {
        oneToThreeDays: 0,
        fourToSevenDays: 0,
        moreThanSevenDays: 0
      },
      topOverdueReaders: [],
      reportDate: new Date().toLocaleDateString('vi-VN'),
      generatedAt: new Date().toISOString()
    };
  }
}

export default new LibrarianReportsService();