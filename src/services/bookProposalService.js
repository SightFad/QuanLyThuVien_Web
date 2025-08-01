import { config } from '../config';

const apiUrl = config.api.baseUrl;

export const bookProposalService = {
  async getStatistics() {
    try {
      const response = await fetch(`${apiUrl}/api/BookProposal/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi khi lấy thống kê đề xuất');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getAllProposals(status = null, priority = null) {
    try {
      let url = `${apiUrl}/api/BookProposal/all`;
      const params = new URLSearchParams();
      
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi khi lấy danh sách đề xuất');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getProposalById(id) {
    try {
      const response = await fetch(`${apiUrl}/api/BookProposal/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi khi lấy thông tin đề xuất');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getProposalsByUser(userId) {
    try {
      const response = await fetch(`${apiUrl}/api/BookProposal/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi khi lấy đề xuất của người dùng');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async createProposal(proposalData) {
    try {
      const response = await fetch(`${apiUrl}/api/BookProposal/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tạo đề xuất');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async updateProposal(id, proposalData) {
    try {
      const response = await fetch(`${apiUrl}/api/BookProposal/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi cập nhật đề xuất');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async approveRejectProposal(approveRejectData) {
    try {
      const response = await fetch(`${apiUrl}/api/BookProposal/approve-reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approveRejectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi duyệt/từ chối đề xuất');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async deleteProposal(id) {
    try {
      const response = await fetch(`${apiUrl}/api/BookProposal/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi xóa đề xuất');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Helper methods
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  getStatusText(status) {
    const statusMap = {
      'Chờ duyệt': 'Chờ duyệt',
      'Đã duyệt': 'Đã duyệt',
      'Từ chối': 'Từ chối'
    };
    return statusMap[status] || status;
  },

  getPriorityText(priority) {
    const priorityMap = {
      'Cao': 'Cao',
      'Trung bình': 'Trung bình',
      'Thấp': 'Thấp'
    };
    return priorityMap[priority] || priority;
  },

  getStatusBadgeClass(status) {
    const statusClassMap = {
      'Chờ duyệt': 'status-pending',
      'Đã duyệt': 'status-approved',
      'Từ chối': 'status-rejected'
    };
    return statusClassMap[status] || 'status-default';
  },

  getPriorityBadgeClass(priority) {
    const priorityClassMap = {
      'Cao': 'priority-high',
      'Trung bình': 'priority-medium',
      'Thấp': 'priority-low'
    };
    return priorityClassMap[priority] || 'priority-default';
  }
}; 