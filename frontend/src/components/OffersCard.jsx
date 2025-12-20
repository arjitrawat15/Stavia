import { Link } from 'react-router-dom';
import { Percent } from 'lucide-react';
import { getImage } from '../config/images';

const OffersCard = ({ offer }) => {
  return (
    <Link
      to={offer.link || '/hotels'}
      className="group relative block h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={offer.image || getImage('HOTEL1_IMAGE')}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = getImage('PLACEHOLDER');
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        {/* Discount Badge */}
        {offer.discount && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center space-x-1">
            <Percent className="w-5 h-5" />
            <span>{offer.discount}% OFF</span>
          </div>
        )}

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{offer.title}</h3>
        {offer.description && (
          <p className="text-slate-200 mb-4">{offer.description}</p>
        )}
        {offer.validUntil && (
          <p className="text-sm text-slate-300">Valid until {offer.validUntil}</p>
        )}
      </div>
    </Link>
  );
};

export default OffersCard;

