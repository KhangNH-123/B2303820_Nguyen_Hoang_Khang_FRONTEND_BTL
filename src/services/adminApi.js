import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 15000,
});

adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');

    console.log('🔐 Admin API Request:', config.method?.toUpperCase(), config.url);
    console.log('   Admin token in localStorage:', !!adminToken);

    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      console.log('   ✅ Admin token added to headers');
    } else {
      console.warn('   ⚠️ No admin token found in localStorage');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn('⚠️ Admin API - Token expired, redirecting to login...');

      originalRequest._retry = true;

      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminLastActivity');

      setTimeout(() => {
        if (window.location.pathname.includes('/admin') &&
          !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default adminApi;