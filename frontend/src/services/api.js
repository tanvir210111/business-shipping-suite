import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bss_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not already on /login, redirect
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('bss_token');
        localStorage.removeItem('bss_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
