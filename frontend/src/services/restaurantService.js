import axiosClient from '../utils/axiosClient';

// Restaurant Service (placeholder for future backend implementation)
export const restaurantService = {
  // Get all restaurant tables
  getAllTables: async () => {
    try {
      // Placeholder - will be implemented when backend is ready
      const response = await axiosClient.get('/restaurant-tables');
      return response.data;
    } catch (error) {
      // For now, return mock data
      return [
        { id: 1, tableNumber: 'T1', capacity: 4, tableType: 'Standard', available: true },
        { id: 2, tableNumber: 'T2', capacity: 6, tableType: 'Family', available: true },
        { id: 3, tableNumber: 'T3', capacity: 2, tableType: 'Romantic', available: false },
        { id: 4, tableNumber: 'T4', capacity: 8, tableType: 'Party', available: true },
        { id: 5, tableNumber: 'T5', capacity: 4, tableType: 'Standard', available: true },
      ];
    }
  },

  // Get all bookings
  getAllBookings: async () => {
    try {
      // Placeholder - will be implemented when backend is ready
      const response = await axiosClient.get('/bookings');
      return response.data;
    } catch (error) {
      // For now, return mock data
      return [
        {
          id: 1,
          tableId: 3,
          customerName: 'John Doe',
          customerPhone: '+1234567890',
          bookingDate: '2024-01-15',
          bookingTime: '19:00',
          partySize: 2,
          status: 'CONFIRMED'
        }
      ];
    }
  },

  // Create new table
  createTable: async (tableData) => {
    try {
      const response = await axiosClient.post('/restaurant-tables', tableData);
      return response.data;
    } catch (error) {
      // For now, simulate success
      console.log('Mock table created:', tableData);
      return { id: Date.now(), ...tableData, available: true };
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await axiosClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      // For now, simulate success
      console.log('Mock booking created:', bookingData);
      return { id: Date.now(), ...bookingData, status: 'CONFIRMED' };
    }
  },

  // Cancel booking
  cancelBooking: async (id) => {
    try {
      const response = await axiosClient.put(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      // For now, simulate success
      console.log('Mock booking cancelled:', id);
      return { id, status: 'CANCELLED' };
    }
  },
};
