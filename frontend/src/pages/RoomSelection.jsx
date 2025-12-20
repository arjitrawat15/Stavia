import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bed, Users, Wifi, Car, Coffee, Calendar, Clock } from 'lucide-react';

const RoomSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state?.hotel;
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  useEffect(() => {
    if (!hotel) {
      navigate('/');
    }
  }, [hotel, navigate]);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Back to Hotel Selection
          </button>
        </div>
      </div>
    );
  }

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedRoom) {
      alert('Please select a room first');
      return;
    }

    // Calculate total price
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * selectedRoom.price;

    // Create booking data
    const booking = {
      hotel: hotel.name,
      hotelId: hotel.id,
      room: selectedRoom,
      bookingData,
      totalPrice,
      nights
    };

    // Navigate to restaurant booking page
    navigate('/restaurant', { state: { booking } });
  };

  const getRoomIcon = (roomType) => {
    switch (roomType) {
      case 'Standard': return '🛏️';
      case 'Deluxe': return '🏨';
      case 'Suite': return '🏰';
      case 'Presidential': return '👑';
      default: return '🛏️';
    }
  };

  const getRoomColor = (roomType) => {
    switch (roomType) {
      case 'Standard': return 'bg-gray-100 text-gray-800';
      case 'Deluxe': return 'bg-blue-100 text-blue-800';
      case 'Suite': return 'bg-purple-100 text-purple-800';
      case 'Presidential': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Hotels
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">{hotel.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotel.rooms.map((room) => (
                <div
                  key={room.number}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 ${
                    selectedRoom?.number === room.number
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{getRoomIcon(room.type)}</span>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Room {room.number}
                        </h3>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoomColor(room.type)}`}>
                        {room.type}
                      </span>
                    </div>
                    <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{room.price}
                    </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Bed className="h-4 w-4 mr-2" />
                      <span>Queen Size Bed</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Up to 2 guests</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Wifi className="h-4 w-4 mr-2" />
                      <span>Free WiFi</span>
                    </div>
                  </div>

                  {room.available ? (
                    <div className="text-green-600 text-sm font-medium">
                      ✓ Available
                    </div>
                  ) : (
                    <div className="text-red-600 text-sm font-medium">
                      ✗ Not Available
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Book Your Stay</h3>
              
              <form onSubmit={handleBooking} className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkInDate}
                      onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
                      className="input-field"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkOutDate}
                      onChange={(e) => setBookingData({...bookingData, checkOutDate: e.target.value})}
                      className="input-field"
                      required
                      min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                  </label>
                  <select
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                    className="input-field"
                    required
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>

                {/* Customer Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={bookingData.customerName}
                    onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={bookingData.customerEmail}
                    onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={bookingData.customerPhone}
                    onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                {/* Price Summary */}
                {selectedRoom && bookingData.checkInDate && bookingData.checkOutDate && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Price Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Room {selectedRoom.number} ({selectedRoom.type})</span>
                        <span>₹{selectedRoom.price}/night</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights</span>
                        <span>
                          {Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))}
                        </span>
                      </div>
                      <div className="border-t pt-1 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>
                          ₹{Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24)) * selectedRoom.price}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={!selectedRoom}
                >
                  Continue to Restaurant
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSelection;
