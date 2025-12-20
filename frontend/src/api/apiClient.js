import axios from 'axios';

// Use relative URL to leverage Vite proxy, or fallback to direct connection
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

console.log('API Client initialized with baseURL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add token and log requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and log responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.response) {
      // Server responded with error status
      console.error('[API Error Response]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // Request made but no response received (Network Error)
      console.error('[API Network Error]', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
        code: error.code,
        details: 'No response from server. Check if backend is running and CORS is configured.'
      });
    } else {
      // Error setting up request
      console.error('[API Request Setup Error]', error.message);
    }
    
    // Handle 401 errors - prevent infinite redirect loops
    if (error.response?.status === 401) {
      // Don't redirect on auth endpoints (login/signup)
      if (error.config?.url?.includes('/auth/')) {
        return Promise.reject(error);
      }
      
      // Check if we're already on login page to prevent redirect loop
      if (window.location.pathname === '/login' || window.location.pathname.includes('/login')) {
        console.warn('[API] Already on login page, not redirecting');
        return Promise.reject(error);
      }
      
      // Only clear auth if token exists (avoid clearing on already-cleared state)
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        console.warn('[API] 401 Unauthorized - clearing auth and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete apiClient.defaults.headers.common['Authorization'];
        
        // Use a small delay to prevent race conditions
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

