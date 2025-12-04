import api from './api';

const authService = {
  loginUser: async (email, password) => {
    const response = await api.post('/auth/user/login', { email, password });
    return response.data;
  },

  registerUser: async (userData) => {
    const response = await api.post('/auth/user/register', userData);
    return response.data;
  },

  loginAdmin: async (MSNV, password) => {
    const response = await api.post('/auth/admin/login', { MSNV, password });
    return response.data;
  }
};

export default authService;