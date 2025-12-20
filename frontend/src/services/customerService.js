import axiosClient from '../utils/axiosClient';

// Customer Service
export const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    try {
      const response = await axiosClient.get('/customers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await axiosClient.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const response = await axiosClient.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await axiosClient.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await axiosClient.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
