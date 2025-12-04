import api from './api';

const muonService = {
  getUserBorrows: async () => {
    try {
      console.log('📚 Fetching user borrows from /api/muon/me');
      const response = await api.get('/muon/me');
      console.log('✅ User borrows response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user borrows:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  requestBorrow: async (bookData) => {
    try {
      console.log('📖 Requesting borrow with data:', bookData);
      const response = await api.post('/muon', bookData);
      console.log('✅ Borrow request successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error requesting borrow:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  returnBook: async (borrowId) => {
    try {
      console.log('🔄 Returning book with ID:', borrowId);

      const response = await api.put(`/muon/return/${borrowId}`);
      console.log('✅ Return book successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error returning book:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);

      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      throw error;
    }
  }
};

export default muonService;