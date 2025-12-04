import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    console.log('🔍 API Request:', config.method?.toUpperCase(), config.url);
    console.log('   Current path:', window.location.pathname);

    const isAdminRoute = config.url.includes('/admin') ||
      window.location.pathname.includes('/admin');

    if (isAdminRoute) {
      const adminToken = localStorage.getItem('adminToken');
      console.log('   Is admin route:', true);
      console.log('   Admin token:', adminToken ? 'EXISTS' : 'MISSING');

      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      const userToken = localStorage.getItem('userToken');
      console.log('   Is admin route:', false);
      console.log('   User token:', userToken ? 'EXISTS' : 'MISSING');

      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response error:', error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      console.warn('⚠️ Authentication failed for:', error.config.url);
    }

    return Promise.reject(error);
  }
);

export default api;