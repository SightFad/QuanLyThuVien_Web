import { config } from '../config';
const apiUrl = config.api.baseUrl;

class InventoryCheckService {
  // Get all inventory checks
  async getAllInventoryChecks() {
    try {
      const response = await fetch(`${apiUrl}/api/InventoryCheck`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory checks:', error);
      throw error;
    }
  }

  // Get inventory check by ID
  async getInventoryCheckById(id) {
    try {
      const response = await fetch(`${apiUrl}/api/InventoryCheck/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory check:', error);
      throw error;
    }
  }

  // Create new inventory check
  async createInventoryCheck(checkData) {
    try {
      const response = await fetch(`${apiUrl}/api/InventoryCheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(checkData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating inventory check:', error);
      throw error;
    }
  }

  // Update inventory check status
  async updateInventoryCheckStatus(id, status) {
    try {
      const response = await fetch(`${apiUrl}/api/InventoryCheck/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating inventory check status:', error);
      throw error;
    }
  }

  // Delete inventory check
  async deleteInventoryCheck(id) {
    try {
      const response = await fetch(`${apiUrl}/api/InventoryCheck/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting inventory check:', error);
      throw error;
    }
  }

  // Get books for inventory check
  async getBooksForInventoryCheck() {
    try {
      const response = await fetch(`${apiUrl}/api/Sach`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching books for inventory check:', error);
      throw error;
    }
  }
}

export default new InventoryCheckService(); 