import api from './api';

const reservationService = {
  // Lấy danh sách đặt trước của độc giả
  async getMyReservations(docGiaId) {
    try {
      const response = await api.get(`/api/Reservation?docGiaId=${docGiaId}`);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi tải danh sách đặt trước');
    }
  },

  // Tạo phiếu đặt mượn sách (khi sách có sẵn)
  async createBorrowTicket(docGiaId, bookId) {
    try {
      const response = await api.post('/api/Reservation/borrow', {
        docGiaId: docGiaId,
        sachId: bookId
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Lỗi khi tạo phiếu đặt mượn');
    }
  },

  // Tạo đặt trước mới (khi sách không có sẵn)
  async createReservation(docGiaId, bookId) {
    try {
      const response = await api.post('/api/Reservation', {
        docGiaId: docGiaId,
        sachId: bookId
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Lỗi khi tạo đặt trước');
    }
  },

  // Hủy đặt trước
  async cancelReservation(reservationId, docGiaId) {
    try {
      const response = await api.delete(`/api/Reservation/${reservationId}?docGiaId=${docGiaId}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Lỗi khi hủy đặt trước');
    }
  },

  // Lấy thông tin hàng đợi cho sách
  async getQueueInfo(bookId, docGiaId) {
    try {
      const response = await api.get(`/api/Reservation/queue/${bookId}?docGiaId=${docGiaId}`);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi lấy thông tin hàng đợi');
    }
  },

  // Kiểm tra điều kiện đặt mượn
  async checkBorrowConditions(docGiaId, bookId) {
    try {
      const response = await api.get(`/api/Reservation/check-conditions?docGiaId=${docGiaId}&sachId=${bookId}`);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi kiểm tra điều kiện đặt mượn');
    }
  },

  // Kiểm tra điều kiện đặt trước
  async checkReservationConditions(docGiaId, bookId) {
    try {
      const response = await api.get(`/api/Reservation/check-reservation-conditions?docGiaId=${docGiaId}&sachId=${bookId}`);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi kiểm tra điều kiện đặt trước');
    }
  },

  // Xử lý khi sách có sẵn lại (cho thủ thư)
  async processBookAvailability(bookId) {
    try {
      const response = await api.post(`/api/Reservation/process-availability/${bookId}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Lỗi khi xử lý hàng đợi');
    }
  },

  // Tự động hủy đặt trước quá hạn
  async autoCancelExpired() {
    try {
      const response = await api.post('/api/Reservation/auto-cancel');
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi tự động hủy đặt trước quá hạn');
    }
  }
};

export default reservationService; 