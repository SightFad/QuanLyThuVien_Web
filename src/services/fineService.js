import { config } from '../config';

const apiUrl = config.api.baseUrl;

// Fine Service for interacting with the backend fine system
export const fineService = {
  // Get fine statistics
  async getStatistics(fromDate = null, toDate = null) {
    try {
      let url = `${apiUrl}/Fine/statistics`;
      const params = new URLSearchParams();
      
      if (fromDate) params.append('fromDate', fromDate.toISOString());
      if (toDate) params.append('toDate', toDate.toISOString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch fine statistics');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching fine statistics:', error);
      throw error;
    }
  },

  // Get all fines with optional filtering
  async getAllFines(status = null, violationType = null) {
    try {
      let url = `${apiUrl}/Fine/all`;
      const params = new URLSearchParams();
      
      if (status) params.append('status', status);
      if (violationType) params.append('violationType', violationType);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch fines');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching fines:', error);
      throw error;
    }
  },

  // Get fine by ID
  async getFineById(id) {
    try {
      const response = await fetch(`${apiUrl}/Fine/${id}`);
      if (!response.ok) throw new Error('Failed to fetch fine');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching fine:', error);
      throw error;
    }
  },

  // Calculate overdue fine
  async calculateOverdueFine(dueDate, returnDate, readerId) {
    try {
      const response = await fetch(`${apiUrl}/Fine/calculate-overdue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dueDate: dueDate,
          returnDate: returnDate,
          readerId: readerId
        })
      });

      if (!response.ok) throw new Error('Failed to calculate overdue fine');
      
      return await response.json();
    } catch (error) {
      console.error('Error calculating overdue fine:', error);
      throw error;
    }
  },

  // Calculate damaged book fine
  async calculateDamagedFine(bookId, damageLevel, readerId) {
    try {
      const response = await fetch(`${apiUrl}/Fine/calculate-damaged`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: bookId,
          damageLevel: damageLevel,
          readerId: readerId
        })
      });

      if (!response.ok) throw new Error('Failed to calculate damaged fine');
      
      return await response.json();
    } catch (error) {
      console.error('Error calculating damaged fine:', error);
      throw error;
    }
  },

  // Calculate lost book fine
  async calculateLostFine(bookId, readerId) {
    try {
      const response = await fetch(`${apiUrl}/Fine/calculate-lost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: bookId,
          readerId: readerId
        })
      });

      if (!response.ok) throw new Error('Failed to calculate lost fine');
      
      return await response.json();
    } catch (error) {
      console.error('Error calculating lost fine:', error);
      throw error;
    }
  },

  // Create fine receipt
  async createFine(fineData) {
    try {
      const response = await fetch(`${apiUrl}/Fine/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fineData)
      });

      if (!response.ok) throw new Error('Failed to create fine');
      
      return await response.json();
    } catch (error) {
      console.error('Error creating fine:', error);
      throw error;
    }
  },

  // Process fine payment
  async processPayment(fineId, nguoiThu) {
    try {
      const response = await fetch(`${apiUrl}/Fine/${fineId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nguoiThu: nguoiThu
        })
      });

      if (!response.ok) throw new Error('Failed to process payment');
      
      return await response.json();
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Get reader fines
  async getReaderFines(readerId) {
    try {
      const response = await fetch(`${apiUrl}/Fine/reader/${readerId}`);
      if (!response.ok) throw new Error('Failed to fetch reader fines');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching reader fines:', error);
      throw error;
    }
  },

  // Check account lock conditions
  async checkAccountLock(readerId) {
    try {
      const response = await fetch(`${apiUrl}/Fine/check-account-lock/${readerId}`);
      if (!response.ok) throw new Error('Failed to check account lock');
      
      return await response.json();
    } catch (error) {
      console.error('Error checking account lock:', error);
      throw error;
    }
  },

  // Helper method to format fine amount
  formatFineAmount(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  // Helper method to get violation type text
  getViolationTypeText(type) {
    const types = {
      'Trả trễ': 'Trả sách trễ hạn',
      'Hư hỏng': 'Sách bị hư hỏng',
      'Mất': 'Sách bị mất'
    };
    return types[type] || type;
  },

  // Helper method to get status text
  getStatusText(status) {
    const statuses = {
      'ChuaThu': 'Chưa thanh toán',
      'DaThu': 'Đã thanh toán',
      'Huy': 'Đã hủy'
    };
    return statuses[status] || status;
  },

  // Helper method to get payment method text
  getPaymentMethodText(method) {
    const methods = {
      'TienMat': 'Tiền mặt',
      'ChuyenKhoan': 'Chuyển khoản'
    };
    return methods[method] || method;
  }
}; 