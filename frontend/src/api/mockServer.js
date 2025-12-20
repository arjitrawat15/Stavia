/**
 * Mock API Server
 * 
 * Complete mock backend with authentication, hotels, restaurants, bookings, and payments.
 */

import { IMAGES, getRoomImage, getTableImage } from '../config/images';

// ==================== HOTELS DATA (10 Hotels) ====================
let hotels = [
  {
    id: 1,
    name: "Grand Luxury Resort",
    city: "Paris",
    country: "France",
    rating: 4.8,
    pricePerNight: 299,
    heroImage: IMAGES.HOTEL1_IMAGE,
    tags: ["Luxury", "Spa", "Pool"],
    badge: "Top Pick",
    description: "Experience world-class luxury in the heart of Paris with stunning city views and exceptional service."
  },
  {
    id: 2,
    name: "Oceanview Beach Hotel",
    city: "Barcelona",
    country: "Spain",
    rating: 4.6,
    pricePerNight: 189,
    heroImage: IMAGES.HOTEL2_IMAGE,
    tags: ["Beach", "Family", "Restaurant"],
    badge: null,
    description: "Stunning ocean views and family-friendly amenities right on the Mediterranean coast."
  },
  {
    id: 3,
    name: "Mountain Retreat Lodge",
    city: "Switzerland",
    country: "Switzerland",
    rating: 4.9,
    pricePerNight: 349,
    heroImage: IMAGES.HOTEL3_IMAGE,
    tags: ["Mountain", "Ski", "Wellness"],
    badge: "Top Pick",
    description: "Escape to the mountains for ultimate relaxation with breathtaking alpine views."
  },
  {
    id: 4,
    name: "Tropical Paradise Resort",
    city: "Bali",
    country: "Indonesia",
    rating: 4.7,
    pricePerNight: 159,
    heroImage: IMAGES.HOTEL4_IMAGE,
    tags: ["Tropical", "Beach", "Spa"],
    badge: "Best Seller",
    description: "Lush tropical gardens, infinity pools, and pristine beaches await you in paradise."
  },
  {
    id: 5,
    name: "Urban Boutique Hotel",
    city: "New York",
    country: "USA",
    rating: 4.5,
    pricePerNight: 249,
    heroImage: IMAGES.HOTEL5_IMAGE,
    tags: ["City", "Boutique", "Art"],
    badge: null,
    description: "Chic design hotel in the heart of Manhattan with contemporary art and modern amenities."
  },
  {
    id: 6,
    name: "Desert Oasis Resort",
    city: "Dubai",
    country: "UAE",
    rating: 4.8,
    pricePerNight: 399,
    heroImage: IMAGES.HOTEL6_IMAGE,
    tags: ["Luxury", "Desert", "Spa"],
    badge: "Top Pick",
    description: "Ultra-luxury desert resort with world-class spa facilities and stunning architecture."
  },
  {
    id: 7,
    name: "Coastal Villa Collection",
    city: "Santorini",
    country: "Greece",
    rating: 4.9,
    pricePerNight: 279,
    heroImage: IMAGES.HOTEL7_IMAGE,
    tags: ["Beach", "Romantic", "Villa"],
    badge: "Best Seller",
    description: "Stunning white-washed villas with panoramic sea views and private terraces."
  },
  {
    id: 8,
    name: "Historic Grand Hotel",
    city: "Vienna",
    country: "Austria",
    rating: 4.6,
    pricePerNight: 229,
    heroImage: IMAGES.HOTEL8_IMAGE,
    tags: ["Historic", "Luxury", "Culture"],
    badge: null,
    description: "Elegant 19th-century architecture meets modern luxury in the heart of Vienna."
  },
  {
    id: 9,
    name: "Jungle Eco Lodge",
    city: "Costa Rica",
    country: "Costa Rica",
    rating: 4.7,
    pricePerNight: 179,
    heroImage: IMAGES.HOTEL9_IMAGE,
    tags: ["Eco", "Nature", "Adventure"],
    badge: null,
    description: "Sustainable luxury in the heart of the rainforest with wildlife viewing and adventure activities."
  },
  {
    id: 10,
    name: "Island Resort & Spa",
    city: "Maldives",
    country: "Maldives",
    rating: 4.9,
    pricePerNight: 449,
    heroImage: IMAGES.HOTEL10_IMAGE,
    tags: ["Island", "Luxury", "Overwater"],
    badge: "Top Pick",
    description: "Exclusive overwater villas with direct lagoon access and world-renowned diving."
  }
];

// ==================== ROOMS DATA ====================
const roomTypes = ["Standard", "Deluxe", "Suite", "VIP Suite", "Presidential"];
const roomAmenities = {
  Standard: ["WiFi", "TV", "AC"],
  Deluxe: ["WiFi", "TV", "AC", "Mini Bar", "City View"],
  Suite: ["WiFi", "TV", "AC", "Mini Bar", "Ocean View", "Balcony", "Sitting Area"],
  "VIP Suite": ["WiFi", "TV", "AC", "Mini Bar", "Ocean View", "Balcony", "Jacuzzi", "Butler Service"],
  Presidential: ["WiFi", "TV", "AC", "Mini Bar", "Ocean View", "Balcony", "Jacuzzi", "Butler Service", "Private Pool", "Dining Room"]
};

let rooms = {};
hotels.forEach(hotel => {
  rooms[hotel.id] = [];
  const basePrice = hotel.pricePerNight;
  let roomId = hotel.id * 100;
  
  roomTypes.forEach((type, index) => {
    const priceMultiplier = [1, 1.3, 1.8, 2.5, 4][index];
    const capacity = type === "Presidential" ? 6 : type === "VIP Suite" ? 4 : type === "Suite" ? 3 : 2;
    
    for (let i = 0; i < (type === "Presidential" ? 1 : type === "VIP Suite" ? 2 : type === "Suite" ? 3 : 4); i++) {
      rooms[hotel.id].push({
        id: roomId++,
        roomNumber: `${hotel.id}${String(index + 1).padStart(2, '0')}${i + 1}`,
        type: type,
        price: Math.round(basePrice * priceMultiplier),
        capacity: capacity,
        amenities: roomAmenities[type],
        image: getRoomImage(type), // Unique image based on room type
        available: true
      });
    }
  });
});

// ==================== RESTAURANTS DATA ====================
let restaurants = [
  {
    id: 1,
    name: "Le Grand Restaurant",
    hotelId: 1,
    hours: "6:00 PM - 11:00 PM",
    cuisine: "French Fine Dining",
    heroImage: IMAGES.RESTAURANT_IMAGE,
    description: "Award-winning French cuisine in an elegant setting with panoramic city views."
  },
  {
    id: 2,
    name: "Beachside Bistro",
    hotelId: 2,
    hours: "12:00 PM - 10:00 PM",
    cuisine: "Mediterranean",
    heroImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&h=800&fit=crop",
    description: "Fresh Mediterranean flavors with stunning ocean views and al fresco dining."
  },
  {
    id: 3,
    name: "Alpine Dining",
    hotelId: 3,
    hours: "7:00 PM - 10:00 PM",
    cuisine: "Swiss Alpine",
    heroImage: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1920&h=800&fit=crop",
    description: "Traditional Swiss cuisine with modern twists in a cozy mountain atmosphere."
  },
  {
    id: 4,
    name: "Tropical Garden Restaurant",
    hotelId: 4,
    hours: "6:00 PM - 11:00 PM",
    cuisine: "Asian Fusion",
    heroImage: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&h=800&fit=crop",
    description: "Exotic flavors in a beautiful garden setting surrounded by tropical flora."
  },
  {
    id: 5,
    name: "Manhattan Grill",
    hotelId: 5,
    hours: "5:00 PM - 11:00 PM",
    cuisine: "American Steakhouse",
    heroImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=800&fit=crop",
    description: "Premium steaks and classic American fare in a sophisticated urban setting."
  }
];

// ==================== TABLES DATA (25-30 tables per restaurant) ====================
let tables = {};

restaurants.forEach(restaurant => {
  tables[restaurant.id] = [];
  let tableId = restaurant.id * 100;
  
  // VIP Tables: 3-4 tables
  for (let i = 1; i <= 4; i++) {
    const tags = ["VIP"];
    tables[restaurant.id].push({
      id: tableId++,
      label: `VIP Table ${i}`,
      capacity: 6,
      priceExtra: 75,
      tags: tags,
      image: getTableImage(tags), // Unique image based on table type
      status: "available"
    });
  }
  
  // Standard Tables: 5-6 tables
  for (let i = 1; i <= 6; i++) {
    const tags = ["Standard"];
    tables[restaurant.id].push({
      id: tableId++,
      label: `Standard Table ${i}`,
      capacity: 4,
      priceExtra: 0,
      tags: tags,
      image: getTableImage(tags), // Unique image based on table type
      status: "available"
    });
  }
  
  // Romantic Tables: 5-6 tables
  for (let i = 1; i <= 6; i++) {
    const tags = ["Romantic"];
    tables[restaurant.id].push({
      id: tableId++,
      label: `Romantic Table ${i}`,
      capacity: 2,
      priceExtra: 25,
      tags: tags,
      image: getTableImage(tags), // Unique image based on table type
      status: "available"
    });
  }
  
  // Family Tables: 5-6 tables
  for (let i = 1; i <= 6; i++) {
    const tags = ["Family"];
    tables[restaurant.id].push({
      id: tableId++,
      label: `Family Table ${i}`,
      capacity: 6,
      priceExtra: 0,
      tags: tags,
      image: getTableImage(tags), // Unique image based on table type
      status: "available"
    });
  }
  
  // Party Tables: 3-4 tables
  for (let i = 1; i <= 4; i++) {
    const tags = ["Party"];
    tables[restaurant.id].push({
      id: tableId++,
      label: `Party Table ${i}`,
      capacity: 8,
      priceExtra: 50,
      tags: tags,
      image: getTableImage(tags), // Unique image based on table type
      status: "available"
    });
  }
});

// ==================== AUTHENTICATION DATA ====================
let users = [
  {
    id: 1,
    email: "demo@example.com",
    password: "demo123", // In real app, this would be hashed
    name: "Demo User",
    createdAt: new Date().toISOString()
  }
];

let sessions = {}; // token -> user

// ==================== BOOKINGS DATA ====================
let hotelBookings = [];
let restaurantBookings = [];
let payments = [];

// ==================== UTILITY FUNCTIONS ====================
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
const generateToken = () => `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ==================== MOCK API ====================
export const mockAPI = {
  // ========== AUTHENTICATION ==========
  async signup(userData) {
    await delay(400);
    
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        error: "User with this email already exists",
        status: 409
      };
    }
    
    const newUser = {
      id: users.length + 1,
      email: userData.email,
      password: userData.password, // In real app, hash this
      name: userData.name,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    const token = generateToken();
    sessions[token] = newUser;
    
    return {
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        }
      },
      status: 201
    };
  },
  
  async login(credentials) {
    await delay(400);
    
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );
    
    if (!user) {
      return {
        error: "Invalid email or password",
        status: 401
      };
    }
    
    const token = generateToken();
    sessions[token] = user;
    
    return {
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      status: 200
    };
  },
  
  async getMe(token) {
    await delay(200);
    
    const user = sessions[token];
    if (!user) {
      return {
        error: "Unauthorized",
        status: 401
      };
    }
    
    return {
      data: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      status: 200
    };
  },
  
  // ========== HOTELS ==========
  async getHotels() {
    await delay(300);
    return {
      data: hotels,
      status: 200
    };
  },
  
  async getHotel(id) {
    await delay(300);
    const hotel = hotels.find(h => h.id === parseInt(id));
    if (!hotel) {
      return {
        error: "Hotel not found",
        status: 404
      };
    }
    return {
      data: hotel,
      status: 200
    };
  },
  
  async getRooms(hotelId) {
    await delay(400);
    const hotelRooms = rooms[hotelId] || [];
    return {
      data: hotelRooms,
      status: 200
    };
  },
  
  // ========== RESTAURANTS ==========
  async getRestaurants(hotelId) {
    await delay(300);
    const filtered = restaurants.filter(r => !hotelId || r.hotelId === parseInt(hotelId));
    return {
      data: filtered,
      status: 200
    };
  },
  
  async getTables(restaurantId) {
    await delay(300);
    const restaurantTables = tables[restaurantId] || [];
    return {
      data: restaurantTables,
      status: 200
    };
  },
  
  // ========== BOOKINGS ==========
  async createBooking(bookingData, token) {
    await delay(600);
    
    // Check authentication
    if (!token || !sessions[token]) {
      return {
        error: "Authentication required",
        status: 401
      };
    }
    
    const booking = {
      bookingId: `HTL-${Date.now()}`,
      userId: sessions[token].id,
      hotelId: bookingData.hotelId,
      roomId: bookingData.roomId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      contactName: bookingData.contactName,
      contactEmail: bookingData.contactEmail,
      contactPhone: bookingData.contactPhone,
      totalPrice: bookingData.totalPrice,
      status: "pending_payment",
      createdAt: new Date().toISOString()
    };
    
    hotelBookings.push(booking);
    
    return {
      data: {
        bookingId: booking.bookingId,
        summary: {
          hotel: hotels.find(h => h.id === booking.hotelId)?.name,
          room: rooms[booking.hotelId]?.find(r => r.id === booking.roomId)?.type,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
          totalPrice: booking.totalPrice
        }
      },
      status: 201
    };
  },
  
  async createRestaurantBooking(bookingData, token) {
    await delay(600);
    
    // Check authentication
    if (!token || !sessions[token]) {
      return {
        error: "Authentication required",
        status: 401
      };
    }
    
    // Conflict check
    const conflict = restaurantBookings.find(b => {
      if (b.tableId !== bookingData.tableId) return false;
      if (b.date !== bookingData.date) return false;
      if (b.status === "cancelled") return false;
      
      const existingTime = parseInt(b.time.split(':')[0]);
      const newTime = parseInt(bookingData.time.split(':')[0]);
      return Math.abs(existingTime - newTime) < 2;
    });
    
    if (conflict) {
      return {
        error: "This table is already booked for the selected time",
        status: 409
      };
    }
    
    const reservation = {
      reservationId: `RST-${Date.now()}`,
      userId: sessions[token].id,
      restaurantId: bookingData.restaurantId,
      tableId: bookingData.tableId,
      date: bookingData.date,
      time: bookingData.time,
      partySize: bookingData.partySize,
      notes: bookingData.notes || "",
      tablePrice: bookingData.tablePrice || 0,
      status: "pending_payment",
      createdAt: new Date().toISOString()
    };
    
    restaurantBookings.push(reservation);
    
    const restaurant = restaurants.find(r => r.id === bookingData.restaurantId);
    const table = tables[bookingData.restaurantId]?.find(t => t.id === bookingData.tableId);
    
    return {
      data: {
        reservationId: reservation.reservationId,
        summary: {
          restaurant: restaurant?.name,
          table: table?.label,
          date: reservation.date,
          time: reservation.time,
          partySize: reservation.partySize,
          tablePrice: reservation.tablePrice
        }
      },
      status: 201
    };
  },
  
  // ========== PAYMENTS ==========
  async processPayment(paymentData, token) {
    await delay(800);

    // Bypass authentication for demo: always succeed
    const userId = (token && sessions[token]) ? sessions[token].id : 'demo-user';

    const payment = {
      paymentId: `PAY-${Date.now()}`,
      userId,
      bookingId: paymentData.bookingId,
      reservationId: paymentData.reservationId,
      amount: paymentData.amount,
      method: paymentData.method,
      status: "completed",
      transactionId: `TXN-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };

    payments.push(payment);

    // Update booking status
    if (paymentData.bookingId) {
      const booking = hotelBookings.find(b => b.bookingId === paymentData.bookingId);
      if (booking) booking.status = "confirmed";
    }

    if (paymentData.reservationId) {
      const reservation = restaurantBookings.find(r => r.reservationId === paymentData.reservationId);
      if (reservation) reservation.status = "confirmed";
    }

    return {
      data: payment,
      status: 200
    };
  },
  
  // ========== CONFIRMATIONS ==========
  async getBookingConfirmation(bookingId) {
    await delay(300);
    const booking = hotelBookings.find(b => b.bookingId === bookingId);
    if (!booking) {
      return {
        error: "Booking not found",
        status: 404
      };
    }
    
    const hotel = hotels.find(h => h.id === booking.hotelId);
    const room = rooms[booking.hotelId]?.find(r => r.id === booking.roomId);
    const payment = payments.find(p => p.bookingId === bookingId);
    
    return {
      data: {
        booking: {
          ...booking,
          hotel: hotel?.name,
          room: room?.type,
          location: `${hotel?.city}, ${hotel?.country}`
        },
        payment
      },
      status: 200
    };
  },
  
  async getReservationConfirmation(reservationId) {
    await delay(300);
    const reservation = restaurantBookings.find(r => r.reservationId === reservationId);
    if (!reservation) {
      return {
        error: "Reservation not found",
        status: 404
      };
    }
    
    const restaurant = restaurants.find(r => r.id === reservation.restaurantId);
    const table = tables[reservation.restaurantId]?.find(t => t.id === reservation.tableId);
    const payment = payments.find(p => p.reservationId === reservationId);
    
    return {
      data: {
        reservation: {
          ...reservation,
          restaurant: restaurant?.name,
          table: table?.label,
          cuisine: restaurant?.cuisine
        },
        payment
      },
      status: 200
    };
  }
};

export default mockAPI;
