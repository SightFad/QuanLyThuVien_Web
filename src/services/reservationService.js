import api from './api';

const reservationService = {
  // Lấy danh sách đặt trước của độc giả
  async getMyReservations() {
    try {
      const response = await api.get('/api/Reservation');
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi tải danh sách đặt trước');
    }
  },

  // Tạo đặt trước mới
  async createReservation(bookId) {
    try {
      const response = await api.post('/api/Reservation', {
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
  async cancelReservation(reservationId) {
    try {
      const response = await api.put(`/api/Reservation/${reservationId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi hủy đặt trước');
    }
  },

  // Lấy danh sách đặt trước (cho thủ thư)
  async getAllReservations() {
    try {
      const response = await api.get('/api/Reservation/all');
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi tải danh sách đặt trước');
    }
  },

  // Cập nhật trạng thái đặt trước (cho thủ thư)
  async updateReservationStatus(reservationId, status) {
    try {
      const response = await api.put(`/api/Reservation/${reservationId}/status`, {
        trangThai: status
      });
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật trạng thái');
    }
  },

  // Kiểm tra điều kiện đặt trước
  async checkReservationConditions(bookId) {
    try {
      const response = await api.get(`/api/Reservation/check/${bookId}`);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi khi kiểm tra điều kiện đặt trước');
    }
  }
};

export default reservationService; 