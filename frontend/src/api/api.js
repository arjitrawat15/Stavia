/**
 * Centralized API Configuration
 * 
 * All API endpoints are defined here to avoid duplication
 * and ensure consistency across the application.
 */

const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Hotels
  HOTELS: {
    ALL: `${API_BASE_URL}/hotels`,
    BY_ID: (id) => `${API_BASE_URL}/hotels/${id}`,
    ROOMS: (id) => `${API_BASE_URL}/hotels/${id}/rooms`,
  },
  
  // Authentication
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  
  // Bookings
  BOOKINGS: {
    HOTEL: `${API_BASE_URL}/bookings/hotel`,
    RESTAURANT: `${API_BASE_URL}/bookings/restaurant`,
    USER: (userId) => `${API_BASE_URL}/bookings/user/${userId}`,
  },
  
  // Payments
  PAYMENTS: {
    CHARGE: `${API_BASE_URL}/payments/charge`,
  },
};

export default API_ENDPOINTS;

