import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HotelCard from '../components/HotelCard';
import OffersCard from '../components/OffersCard';
import TestimonialCard from '../components/TestimonialCard';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import { hotelApi } from '../api/hotelApi';
import { Mail } from 'lucide-react';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setError(null); // Clear any previous errors
        const response = await hotelApi.getAllHotels();
        console.log('Home page - Hotels response:', response);
        console.log('Home page - Hotels data:', response.data);
        console.log('Home page - Response status:', response.status);
        
        // Axios always wraps response in data property
        const hotelsData = response?.data;
        
        // Validate response is an array
        if (!Array.isArray(hotelsData)) {
          console.error('Invalid response format - expected array, got:', typeof hotelsData, hotelsData);
          setHotels([]);
          setError('Invalid response format from server. Expected JSON array.');
          return;
        }
        
        if (hotelsData.length > 0) {
          // Show only 3 featured hotels (top rated)
          const featuredHotels = hotelsData
            .filter(hotel => hotel && hotel.id && hotel.rating != null) // Filter out invalid hotels
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);
          
          if (featuredHotels.length > 0) {
            setHotels(featuredHotels);
            console.log('Home page - Featured hotels set:', featuredHotels.length);
          } else {
            console.warn('No valid hotels after filtering');
            setHotels([]);
            setError('No valid hotels found in response.');
          }
        } else {
          console.warn('Backend returned empty array - database may not be seeded');
          setHotels([]);
          setError('No hotels found. Please ensure the backend database is seeded with hotel data.');
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          code: error.code
        });
        setHotels([]);
        
        // Provide specific error messages
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          setError('Cannot connect to backend server. Please ensure the Spring Boot server is running on http://localhost:8080');
        } else if (error.response?.status === 404) {
          setError('API endpoint not found. Please check backend configuration.');
        } else if (error.response?.status >= 500) {
          // Extract error message from backend response if available
          const backendError = error.response?.data?.message || 
                              error.response?.data?.error || 
                              'Backend server error. Please check backend logs.';
          console.error('Backend error details:', error.response?.data);
          setError(backendError);
        } else {
          const errorMsg = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Unable to load hotels. Please check the browser console for details.';
          setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const offers = [
    {
      id: 1,
      title: 'Summer Getaway Special',
      description: 'Book now and save up to 30% on your summer vacation',
      discount: 30,
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop&q=80',
      validUntil: 'August 31, 2025',
      link: '/hotels'
    },
    {
      id: 2,
      title: 'Weekend Escape Package',
      description: 'Perfect weekend retreat with complimentary breakfast',
      discount: 25,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&q=80',
      validUntil: 'December 31, 2025',
      link: '/hotels'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      quote: 'Absolutely stunning experience! The hotel exceeded all expectations and the restaurant was phenomenal.',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'London, UK',
      rating: 5,
      quote: 'Best booking experience I\'ve ever had. Everything was seamless from start to finish.',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 3,
      name: 'Emma Williams',
      location: 'Sydney, Australia',
      rating: 5,
      quote: 'The attention to detail and customer service is unmatched. Highly recommend!',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing! We'll send updates to ${newsletterEmail}`);
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Hero />

      {/* Featured Hotels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Featured Hotels
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover our handpicked selection of luxury accommodations
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonLoader type="card" count={3} />
            </div>
          ) : error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">{error}</p>
              <p className="text-sm text-yellow-600 mt-2">Check the browser console for more details.</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
              <p className="text-slate-600">No hotels available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/hotels"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              View All Hotels
            </a>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Special Offers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Don't miss out on these exclusive deals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer) => (
              <OffersCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Our Guests Say
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real experiences from our valued customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Subscribe to our newsletter for exclusive deals and travel tips
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Subscribe</span>
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

