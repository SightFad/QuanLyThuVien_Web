import { config } from '../config';

const apiUrl = config.api.baseUrl;

class PhieuNhapKhoService {
  async getAllPhieuNhapKho() {
    try {
      const response = await fetch(`${apiUrl}/PhieuNhapKho`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch phieu nhap kho');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching phieu nhap kho:', error);
      throw error;
    }
  }

  async getPhieuNhapKhoById(id) {
    try {
      const response = await fetch(`${apiUrl}/PhieuNhapKho/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch phieu nhap kho');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching phieu nhap kho:', error);
      throw error;
    }
  }

  async createPhieuNhapKho(phieuNhapKhoData) {
    try {
      const response = await fetch(`${apiUrl}/PhieuNhapKho`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(phieuNhapKhoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create phieu nhap kho');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating phieu nhap kho:', error);
      throw error;
    }
  }

  async updatePhieuNhapKhoStatus(id, status) {
    try {
      const response = await fetch(`${apiUrl}/PhieuNhapKho/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
      });

      if (!response.ok) {
        throw new Error('Failed to update phieu nhap kho status');
      }

      return true;
    } catch (error) {
      console.error('Error updating phieu nhap kho status:', error);
      throw error;
    }
  }

  async deletePhieuNhapKho(id) {
    try {
      const response = await fetch(`${apiUrl}/PhieuNhapKho/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete phieu nhap kho');
      }

      return true;
    } catch (error) {
      console.error('Error deleting phieu nhap kho:', error);
      throw error;
    }
  }
}

export default new PhieuNhapKhoService(); 