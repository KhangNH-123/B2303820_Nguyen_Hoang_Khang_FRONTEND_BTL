import api from './api';

const sachService = {
  getAll: async () => {
    try {
      const response = await api.get('/sach');
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  getOne: async (id) => {
    try {
      const response = await api.get(`/sach/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  },

  search: async (query) => {
    try {
      const response = await api.get(`/sach?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching books:', error);
      throw error;
    }
  }
};

export default sachService;