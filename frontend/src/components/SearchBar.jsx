import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Search } from 'lucide-react';

const SearchBar = ({ initialData = {} }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: initialData.destination || '',
    checkIn: initialData.checkIn || '',
    checkOut: initialData.checkOut || '',
    guests: initialData.guests || 2
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      destination: searchData.destination,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests.toString()
    });
    navigate(`/hotels?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-3">
          <label htmlFor="search-destination" className="block text-sm font-medium text-slate-700 mb-2">
            Destination
          </label>
          <input
            type="text"
            id="search-destination"
            value={searchData.destination}
            onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
            placeholder="City or hotel"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="search-checkIn" className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Check-in
          </label>
          <input
            type="date"
            id="search-checkIn"
            value={searchData.checkIn}
            min={today}
            onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="search-checkOut" className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Check-out
          </label>
          <input
            type="date"
            id="search-checkOut"
            value={searchData.checkOut}
            min={searchData.checkIn || today}
            onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="search-guests" className="block text-sm font-medium text-slate-700 mb-2">
            <Users className="inline w-4 h-4 mr-1" />
            Guests
          </label>
          <input
            type="number"
            id="search-guests"
            value={searchData.guests}
            min="1"
            max="10"
            onChange={(e) => setSearchData({ ...searchData, guests: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-3 md:flex md:items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;

