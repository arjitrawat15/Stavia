import apiClient from './apiClient';

export const hotelApi = {
  getAllHotels: (filters = {}) => {
    return apiClient.get('/hotels', { params: filters });
  },

  getHotelById: (id) => {
    return apiClient.get(`/hotels/${id}`);
  },

  getRoomsByHotelId: (id) => {
    return apiClient.get(`/hotels/${id}/rooms`);
  },
};

