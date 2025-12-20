import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';
import BookingSidebar from '../components/BookingSidebar';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import { hotelApi } from '../api/hotelApi';
import { MapPin, Star } from 'lucide-react';
import { getImage } from '../config/images';

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('HotelDetail: Fetching hotel and rooms for ID:', id);
        
        const [hotelResponse, roomsResponse] = await Promise.all([
          hotelApi.getHotelById(id),
          hotelApi.getRoomsByHotelId(id)
        ]);

        console.log('HotelDetail: Hotel response:', hotelResponse);
        console.log('HotelDetail: Rooms response:', roomsResponse);

        const hotelData = hotelResponse.data;
        let roomsData = roomsResponse.data || [];

        console.log('HotelDetail: Raw rooms data from API:', roomsData);
        console.log('HotelDetail: Rooms data type:', Array.isArray(roomsData) ? 'Array' : typeof roomsData);
        console.log('HotelDetail: Rooms count:', roomsData.length);

        if (!Array.isArray(roomsData)) {
          console.error('HotelDetail: ERROR - Rooms data is not an array:', roomsData);
          roomsData = [];
        }

        // Map backend room structure to frontend expected structure
        // Backend: { roomId, roomNumber, roomType, pricePerNight, available, capacity }
        // Frontend expects: { id, roomNumber, type, price, available, capacity, amenities, image }
        roomsData = roomsData.map(room => ({
          id: room.roomId, // Map roomId to id
          roomNumber: room.roomNumber,
          type: room.roomType, // Map roomType to type
          price: room.pricePerNight, // Map pricePerNight to price
          available: room.available,
          capacity: room.capacity || 2, // Use capacity from DB or default to 2
          amenities: getRoomAmenities(room.roomType),
          image: getImage('ROOM_STANDARD') // Default image
        }));

        console.log('HotelDetail: Mapped rooms:', roomsData);
        console.log('HotelDetail: Hotel data:', hotelData);

        setHotel(hotelData);
        setRooms(roomsData);
      } catch (error) {
        console.error('HotelDetail: Error fetching hotel data:', error);
        console.error('HotelDetail: Error details:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Helper function to get amenities based on room type
  const getRoomAmenities = (roomType) => {
    const amenitiesMap = {
      'Standard': ['WiFi', 'TV', 'AC'],
      'Deluxe': ['WiFi', 'TV', 'AC', 'Mini Bar', 'City View'],
      'Suite': ['WiFi', 'TV', 'AC', 'Mini Bar', 'Ocean View', 'Balcony', 'Sitting Area'],
      'VIP Suite': ['WiFi', 'TV', 'AC', 'Mini Bar', 'Ocean View', 'Balcony', 'Jacuzzi', 'Butler Service'],
      'Presidential': ['WiFi', 'TV', 'AC', 'Mini Bar', 'Ocean View', 'Balcony', 'Jacuzzi', 'Butler Service', 'Private Pool', 'Dining Room']
    };
    return amenitiesMap[roomType] || ['WiFi', 'TV', 'AC'];
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SkeletonLoader type="card" count={3} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Hotel not found</h1>
          <a href="/hotels" className="text-blue-600 hover:text-blue-700">
            Return to hotels list
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-slate-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg text-slate-700">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hotel Hero */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hotel.heroImage || getImage(`HOTEL${hotel.id}_IMAGE`)}
            alt={hotel.name}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              e.target.src = getImage('PLACEHOLDER');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40" />
        </div>
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {hotel.name}
            </h1>
            <div className="flex items-center text-white mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">{hotel.city}{hotel.country ? `, ${hotel.country}` : ''}</span>
            </div>
            {renderStars(hotel.rating)}
            {hotel.description && (
              <p className="text-slate-200 mt-4 max-w-2xl">{hotel.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Rooms and Booking */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Rooms List */}
            <main className="flex-1 lg:w-2/3">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Rooms</h2>
              
              {rooms.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-lg text-slate-600">No rooms available at this time.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onSelect={setSelectedRoom}
                      isSelected={selectedRoom?.id === room.id}
                    />
                  ))}
                </div>
              )}
            </main>

            {/* Booking Sidebar */}
            <aside className="lg:w-1/3">
              <BookingSidebar
                hotel={hotel}
                selectedRoom={selectedRoom}
              />
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HotelDetail;

