import axiosClient from '../utils/axiosClient';

// Reservation Service
export const reservationService = {
  // Get all reservations
  getAllReservations: async () => {
    try {
      const response = await axiosClient.get('/reservations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new reservation
  createReservation: async (reservationData) => {
    try {
      const response = await axiosClient.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel reservation
  cancelReservation: async (id) => {
    try {
      const response = await axiosClient.put(`/reservations/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
