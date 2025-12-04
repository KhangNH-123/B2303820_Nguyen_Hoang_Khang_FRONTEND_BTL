import api from './api';

const docgiaService = {
  updateProfile: async (userData) => {
    try {
      console.log('📝 Updating user profile:', userData);

      const response = await api.put('/docgia/me/update', userData);
      console.log('✅ Profile updated:', response.data);

      if (response.data.user) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/docgia/me');
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }
};

export default docgiaService;