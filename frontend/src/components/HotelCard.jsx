import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { IMAGES, getImage } from '../config/images';

const HotelCard = ({ hotel }) => {
  // Safety check - if hotel is null/undefined, return null
  if (!hotel) {
    return null;
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-slate-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-slate-600">{rating}</span>
      </div>
    );
  };

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1.5">
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={hotel.heroImage || getImage(`HOTEL${hotel.id}_IMAGE`)}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = getImage('PLACEHOLDER');
          }}
        />
        {/* Badge */}
        {hotel.badge === 'Top Pick' && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Top Pick
          </div>
        )}
        {hotel.badge === 'Best Seller' && (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Best Seller
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{hotel.name}</h3>
        
        <div className="flex items-center text-slate-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{hotel.city}{hotel.country ? `, ${hotel.country}` : ''}</span>
        </div>

        {renderStars(hotel.rating)}

        {/* Tags */}
        {hotel.tags && hotel.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 mb-4">
            {hotel.tags.filter(tag => tag !== 'Free Parking').map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <div>
            <span className="text-2xl font-bold text-slate-900">${hotel.pricePerNight}</span>
            <span className="text-sm text-slate-600 ml-1">/night</span>
          </div>
          <Link
            to={`/hotels/${hotel.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Select Hotel
          </Link>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;

