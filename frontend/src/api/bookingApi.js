import apiClient from './apiClient';

export const bookingApi = {
  createHotelBooking: (data) => {
    return apiClient.post('/bookings/hotel', data);
  },

  createRestaurantBooking: (data) => {
    return apiClient.post('/bookings/restaurant', data);
  },

  getUserBookings: (userId) => {
    return apiClient.get(`/bookings/user/${userId}`);
  },
};

