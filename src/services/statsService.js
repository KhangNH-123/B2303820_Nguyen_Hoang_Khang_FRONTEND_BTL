import api from './api';

const statsService = {
    getStats: async () => {
        try {
            console.log('📊 Getting stats from API...');
            const response = await api.get('/muon/stats');
            console.log('✅ Stats loaded:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching stats:', error);
            throw error;
        }
    },

    // Thêm hàm cho admin stats
    getAdminStats: async () => {
        try {
            const response = await api.get('/muon/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            throw error;
        }
    }
};

export default statsService;