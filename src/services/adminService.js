import adminApi from './adminApi';

const adminService = {
  getAllBooks: async (token) => {
    console.log('📚 Getting all books...');
    try {
      const localToken = localStorage.getItem('adminToken');
      console.log('🔐 Token in localStorage:', !!localToken);

      if (!localToken) {
        const error = new Error('No admin token found in localStorage');
        error.code = 'NO_TOKEN';
        throw error;
      }

      const response = await adminApi.get('/sach');
      console.log('✅ Books loaded successfully:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error in getAllBooks:', error);
      if (error.code === 'NO_TOKEN') {
        console.error('💥 CRITICAL: No token in localStorage');
      }
      throw error;
    }
  },

  getAllBorrows: async (token) => {
    console.log('📋 Getting all borrows...');
    try {
      const localToken = localStorage.getItem('adminToken');
      console.log('🔐 Token check - localStorage:', !!localToken, 'Param:', !!token);

      if (!localToken) {
        const error = new Error('No admin token found in localStorage for getAllBorrows');
        error.code = 'NO_TOKEN';
        throw error;
      }

      const response = await adminApi.get('/muon');
      console.log('✅ All borrows loaded successfully:', response.data.length, 'records');
      return response.data;
    } catch (error) {
      console.error('❌ Error in getAllBorrows:', error);
      console.error('❌ Error details:', error.response?.data);
      throw error;
    }
  },

  getPendingBorrows: async (token) => {
    console.log('⏳ Getting pending borrows...');
    const localToken = localStorage.getItem('adminToken');
    if (!localToken) {
      throw new Error('No admin token found in localStorage');
    }
    const response = await adminApi.get('/muon/pending');
    return response.data;
  },

  getApprovedBorrows: async (token) => {
    console.log('✅ Getting approved borrows...');
    const localToken = localStorage.getItem('adminToken');
    if (!localToken) {
      throw new Error('No admin token found in localStorage');
    }
    const response = await adminApi.get('/muon/approved');
    return response.data;
  },

  createBook: async (token, bookData) => {
    const localToken = localStorage.getItem('adminToken');
    if (!localToken) throw new Error('No admin token found in localStorage');
    const response = await adminApi.post('/sach', bookData);
    return response.data;
  },

  removeBook: async (token, id) => {
    const localToken = localStorage.getItem('adminToken');
    if (!localToken) throw new Error('No admin token found in localStorage');
    const response = await adminApi.delete(`/sach/${id}`);
    return response.data;
  },

  approveBorrow: async (token, borrowId) => {
    const localToken = localStorage.getItem('adminToken');
    if (!localToken) throw new Error('No admin token found in localStorage');
    const response = await adminApi.put(`/muon/approve/${borrowId}`, {});
    return response.data;
  },

  rejectBorrow: async (token, borrowId) => {
    const localToken = localStorage.getItem('adminToken');
    if (!localToken) throw new Error('No admin token found in localStorage');
    const response = await adminApi.put(`/muon/reject/${borrowId}`, {});
    return response.data;
  },

  returnBorrow: async (token, borrowId) => {
    const localToken = localStorage.getItem('adminToken');
    if (!localToken) throw new Error('No admin token found in localStorage');
    const response = await adminApi.put(`/muon/return/${borrowId}`, {});
    return response.data;
  },

  getAllReaders: async (token) => {
    const localToken = localStorage.getItem('adminToken');
    if (!localToken) throw new Error('No admin token found in localStorage');
    const response = await adminApi.get('/docgia');
    return response.data;
  },

  getStats: async (token) => {
    const localToken = localStorage.getItem('adminToken');
    if (!localToken) throw new Error('No admin token found in localStorage');
    const response = await adminApi.get('/muon/stats');
    return response.data;
  },
};

export default adminService;