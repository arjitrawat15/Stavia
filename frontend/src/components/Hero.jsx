import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Search } from 'lucide-react';
import { IMAGES } from '../config/images';

const Hero = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to hotels page with search params
    const params = new URLSearchParams({
      destination: searchData.destination,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests.toString()
    });
    navigate(`/hotels?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.HERO_IMAGE}
          alt="Luxury hotel destination"
          className="w-full h-full object-cover"
          loading="eager"
          srcSet={`${IMAGES.HERO_IMAGE} 1920w, ${IMAGES.HERO_IMAGE} 1280w, ${IMAGES.HERO_IMAGE} 768w`}
          onError={(e) => {
            e.target.src = IMAGES.PLACEHOLDER;
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
              Discover Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-8">
              Luxury accommodations and fine dining experiences await
            </p>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mt-8">
              <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4">
                {/* Destination */}
                <div className="md:col-span-3">
                  <label htmlFor="destination" className="block text-sm font-medium text-slate-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                    placeholder="City or hotel"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Check-in */}
                <div className="md:col-span-2">
                  <label htmlFor="checkIn" className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    id="checkIn"
                    value={searchData.checkIn || today}
                    min={today}
                    onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Check-out */}
                <div className="md:col-span-2">
                  <label htmlFor="checkOut" className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    id="checkOut"
                    value={searchData.checkOut || tomorrow}
                    min={searchData.checkIn || tomorrow}
                    onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Guests */}
                <div className="md:col-span-2">
                  <label htmlFor="guests" className="block text-sm font-medium text-slate-700 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Guests
                  </label>
                  <input
                    type="number"
                    id="guests"
                    value={searchData.guests}
                    min="1"
                    max="10"
                    onChange={(e) => setSearchData({ ...searchData, guests: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Search Button */}
                <div className="md:col-span-3 md:flex md:items-end">
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

