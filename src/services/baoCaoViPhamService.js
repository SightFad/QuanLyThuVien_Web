import { config } from '../config';

const apiUrl = config.api.baseUrl;

export const baoCaoViPhamService = {
    // Lấy tất cả báo cáo vi phạm
    getAllBaoCaoViPham: async () => {
        try {
            const response = await fetch(`${apiUrl}/api/BaoCaoViPham`);
            if (!response.ok) {
                throw new Error('Failed to fetch violation reports');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching violation reports:', error);
            throw error;
        }
    },

    // Lấy báo cáo vi phạm theo ID
    getBaoCaoViPhamById: async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/BaoCaoViPham/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch violation report');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching violation report:', error);
            throw error;
        }
    },

    // Tạo báo cáo vi phạm mới
    createBaoCaoViPham: async (baoCaoData) => {
        try {
            const response = await fetch(`${apiUrl}/api/BaoCaoViPham`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(baoCaoData),
            });
            if (!response.ok) {
                throw new Error('Failed to create violation report');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating violation report:', error);
            throw error;
        }
    },

    // Cập nhật báo cáo vi phạm
    updateBaoCaoViPham: async (id, updateData) => {
        try {
            const response = await fetch(`${apiUrl}/api/BaoCaoViPham/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) {
                throw new Error('Failed to update violation report');
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating violation report:', error);
            throw error;
        }
    },

    // Xóa báo cáo vi phạm
    deleteBaoCaoViPham: async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/BaoCaoViPham/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete violation report');
            }
            return true;
        } catch (error) {
            console.error('Error deleting violation report:', error);
            throw error;
        }
    },

    // Lấy thống kê báo cáo vi phạm
    getStatistics: async () => {
        try {
            const response = await fetch(`${apiUrl}/api/BaoCaoViPham/statistics`);
            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    }
}; 