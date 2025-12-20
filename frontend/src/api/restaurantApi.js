import apiClient from './apiClient';

export const restaurantApi = {
  getRestaurantByHotelId: (hotelId) => {
    return apiClient.get(`/hotels/${hotelId}/restaurant`);
  },

  getTablesByHotelId: (hotelId) => {
    return apiClient.get(`/hotels/${hotelId}/restaurant/tables`);
  },
};

