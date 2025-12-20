import apiClient from './apiClient';

export const authApi = {
  signup: (data) => {
    return apiClient.post('/auth/signup', data);
  },

  login: (data) => {
    return apiClient.post('/auth/login', data);
  },

  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  },
};

