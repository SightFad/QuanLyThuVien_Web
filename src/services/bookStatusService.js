import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

class BookStatusService {
  // Cập nhật trạng thái sách
  async updateBookStatus(bookId, statusData) {
    try {
      const response = await apiService.put(`${API_ENDPOINTS.BOOKS}/${bookId}/status`, statusData);
      return response;
    } catch (error) {
      console.error('Error updating book status:', error);
      throw error;
    }
  }

  // Lấy danh sách trạng thái sách có thể cập nhật
  getAvailableStatuses() {
    return [
      { value: 'available', label: 'Có sẵn', color: 'green' },
      { value: 'borrowed', label: 'Đã mượn', color: 'blue' },
      { value: 'reserved', label: 'Đã đặt trước', color: 'orange' },
      { value: 'maintenance', label: 'Bảo trì', color: 'yellow' },
      { value: 'lost', label: 'Mất', color: 'red' },
      { value: 'damaged', label: 'Hỏng', color: 'red' }
    ];
  }

  // Lấy màu sắc cho trạng thái
  getStatusColor(status) {
    const statuses = this.getAvailableStatuses();
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'gray';
  }

  // Lấy nhãn cho trạng thái
  getStatusLabel(status) {
    const statuses = this.getAvailableStatuses();
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : 'Không xác định';
  }
}

export default new BookStatusService(); 