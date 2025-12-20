import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import RestaurantBooking from './pages/RestaurantBooking';
import Confirmation from './pages/Confirmation';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Customers from './pages/Customers';
import Reservations from './pages/Reservations';
import Restaurant from './pages/Restaurant';
import BookingConfirmation from './pages/BookingConfirmation';
import RoomSelection from './pages/RoomSelection';
import HotelSelection from './pages/HotelSelection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/restaurant" element={<RestaurantBooking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/restaurant-management" element={<Restaurant />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/room-selection" element={<RoomSelection />} />
        <Route path="/hotel-selection" element={<HotelSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
