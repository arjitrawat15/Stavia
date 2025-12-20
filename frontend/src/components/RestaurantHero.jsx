import { Clock, UtensilsCrossed } from 'lucide-react';
import { getImage } from '../config/images';

const RestaurantHero = ({ restaurant }) => {
  if (!restaurant) return null;

  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <img
          src={restaurant.heroImage || getImage('RESTAURANT_IMAGE')}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            e.target.src = getImage('PLACEHOLDER');
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="text-xl md:text-2xl text-slate-200 mb-6">
                {restaurant.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-6 text-slate-200">
              {restaurant.hours && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">{restaurant.hours}</span>
                </div>
              )}
              {restaurant.cuisine && (
                <div className="flex items-center space-x-2">
                  <UtensilsCrossed className="w-5 h-5" />
                  <span className="text-lg">{restaurant.cuisine}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantHero;

