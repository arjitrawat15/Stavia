import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import { hotelApi } from '../api/hotelApi';

const Hotels = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    maxPrice: '',
    minRating: ''
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        console.log('Hotels page - Fetching all hotels...');
        const response = await hotelApi.getAllHotels();
        console.log('Hotels page - Hotels response:', response);
        console.log('Hotels page - Hotels data:', response.data);
        
        // Axios always wraps response in data property
        const hotelsData = response?.data;
        
        // Validate response is an array
        if (!Array.isArray(hotelsData)) {
          console.error('Invalid response format - expected array, got:', typeof hotelsData, hotelsData);
          setHotels([]);
          setFilteredHotels([]);
          setError('Invalid response format from server. Expected JSON array.');
          return;
        }
        
        console.log('Hotels page - Hotels count:', hotelsData.length);
        
        // Verify we received all expected hotels
        if (hotelsData.length < 10) {
          console.warn(`Hotels page - WARNING: Received only ${hotelsData.length} hotels, expected 10. Check backend seeding.`);
        } else if (hotelsData.length > 10) {
          console.warn(`Hotels page - WARNING: Received ${hotelsData.length} hotels, expected 10.`);
        } else {
          console.log('Hotels page - ✓ Received all 10 hotels as expected.');
        }
        
        setHotels(hotelsData);
        setFilteredHotels(hotelsData);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        console.error('Error details:', error.response?.data || error.message);
        setHotels([]); // Set empty array on error
        setFilteredHotels([]);
        setError('Unable to load hotels. Please make sure the backend server is running on http://localhost:8080');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    let filtered = [...hotels];

    // Filter by destination
    if (filters.destination) {
      filtered = filtered.filter(
        hotel =>
          hotel.city.toLowerCase().includes(filters.destination.toLowerCase()) ||
          hotel.name.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    // Filter by max price
    if (filters.maxPrice) {
      filtered = filtered.filter(hotel => hotel.pricePerNight <= parseInt(filters.maxPrice));
    }

    // Filter by min rating
    if (filters.minRating) {
      filtered = filtered.filter(hotel => hotel.rating >= parseFloat(filters.minRating));
    }

    setFilteredHotels(filtered);
  }, [filters, hotels]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Search Bar */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar
            initialData={{
              destination: searchParams.get('destination') || '',
              checkIn: searchParams.get('checkIn') || '',
              checkOut: searchParams.get('checkOut') || '',
              guests: parseInt(searchParams.get('guests')) || 2
            }}
          />
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Filters</h3>

                <div className="space-y-4">
                  {/* Destination */}
                  <div>
                    <label htmlFor="filter-destination" className="block text-sm font-medium text-slate-700 mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      id="filter-destination"
                      value={filters.destination}
                      onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                      placeholder="City or hotel"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label htmlFor="filter-maxPrice" className="block text-sm font-medium text-slate-700 mb-2">
                      Max Price per Night
                    </label>
                    <input
                      type="number"
                      id="filter-maxPrice"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      placeholder="$500"
                      min="0"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Min Rating */}
                  <div>
                    <label htmlFor="filter-minRating" className="block text-sm font-medium text-slate-700 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      id="filter-minRating"
                      value={filters.minRating}
                      onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => setFilters({ destination: '', maxPrice: '', minRating: '' })}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Results */}
            <main className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {filteredHotels.length} {filteredHotels.length === 1 ? 'Hotel' : 'Hotels'} Found
                </h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SkeletonLoader type="card" count={4} />
                </div>
              ) : error ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-12 text-center">
                  <p className="text-lg text-yellow-800 font-semibold mb-2">{error}</p>
                  <p className="text-sm text-yellow-600">Check the browser console for more details.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-6 py-2 rounded-lg"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredHotels.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-lg text-slate-600">No hotels found matching your criteria.</p>
                  <button
                    onClick={() => setFilters({ destination: '', maxPrice: '', minRating: '' })}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear filters and try again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Hotels;

