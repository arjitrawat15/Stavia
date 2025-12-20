import axiosClient from '../utils/axiosClient';

// Room Service
export const roomService = {
  // Get all rooms
  getAllRooms: async () => {
    try {
      const response = await axiosClient.get('/rooms');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get room by ID
  getRoomById: async (id) => {
    try {
      const response = await axiosClient.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update room
  updateRoom: async (id, roomData) => {
    try {
      const response = await axiosClient.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new room
  createRoom: async (roomData) => {
    try {
      const response = await axiosClient.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete room
  deleteRoom: async (id) => {
    try {
      const response = await axiosClient.delete(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
