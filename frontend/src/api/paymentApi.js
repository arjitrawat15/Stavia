import apiClient from './apiClient';

export const paymentApi = {
  processPayment: (data) => {
    return apiClient.post('/payments/charge', data);
  },
};

