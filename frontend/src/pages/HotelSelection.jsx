import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Star, MapPin, Wifi, Car, Utensils } from 'lucide-react';

const HotelSelection = () => {
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = useState(null);

  const hotels = [
    {
      id: 'A',
      name: 'Hotel A',
      description: 'Luxury hotel in the heart of the city',
      location: 'Downtown',
      rating: 4.8,
      price: '₹1,200',
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Spa'],
      image: '🏨',
      rooms: [
        { number: '101', type: 'Standard', price: 1200, available: true },
        { number: '102', type: 'Deluxe', price: 1600, available: true },
        { number: '201', type: 'Suite', price: 2400, available: true },
        { number: '202', type: 'Presidential', price: 4000, available: true }
      ]
    },
    {
      id: 'B',
      name: 'Hotel B',
      description: 'Modern hotel with excellent service',
      location: 'Business District',
      rating: 4.6,
      price: '₹960',
      amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Gym'],
      image: '🏢',
      rooms: [
        { number: '101', type: 'Standard', price: 960, available: true },
        { number: '102', type: 'Deluxe', price: 1440, available: true },
        { number: '201', type: 'Suite', price: 2000, available: true },
        { number: '202', type: 'Presidential', price: 3200, available: true }
      ]
    },
    {
      id: 'C',
      name: 'Hotel C',
      description: 'Boutique hotel with unique charm',
      location: 'Historic Quarter',
      rating: 4.7,
      price: '₹800',
      amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Concierge'],
      image: '🏛️',
      rooms: [
        { number: '101', type: 'Standard', price: 800, available: true },
        { number: '102', type: 'Deluxe', price: 1200, available: true },
        { number: '201', type: 'Suite', price: 1760, available: true },
        { number: '202', type: 'Presidential', price: 2800, available: true }
      ]
    }
  ];

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    navigate(`/rooms/${hotel.id}`, { state: { hotel } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Hotel
          </h1>
          <p className="text-xl text-gray-600">
            Select from our premium hotel collection
          </p>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => handleHotelSelect(hotel)}
            >
              {/* Hotel Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-6xl">{hotel.image}</span>
              </div>

              {/* Hotel Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{hotel.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-600">{hotel.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-3">{hotel.description}</p>

                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{hotel.location}</span>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-600">{hotel.price}</span>
                    <span className="text-gray-500 text-sm ml-1">/night</span>
                  </div>
                  <button className="btn-primary">
                    Select Hotel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose ReserveIT?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Wifi className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free WiFi</h3>
              <p className="text-gray-600 text-sm">High-speed internet in all rooms</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Car className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Parking</h3>
              <p className="text-gray-600 text-sm">Complimentary parking for guests</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-3 rounded-full mb-3">
                <Utensils className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fine Dining</h3>
              <p className="text-gray-600 text-sm">Restaurant and room service available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSelection;
