import { Users, Check } from 'lucide-react';
import { getImage } from '../config/images';

const RestaurantTableCard = ({ table, isSelected = false, onSelect, selectedPartySize = 2, disabled = false }) => {
  const canSeatParty = table.capacity >= selectedPartySize;
  const isDisabled = disabled || !canSeatParty;

  const handleClick = () => {
    if (!isDisabled && onSelect) {
      onSelect(table);
    }
  };

  return (
    <article
      onClick={handleClick}
      className={`relative bg-white rounded-xl shadow-md border-2 transition-all duration-200 overflow-hidden cursor-pointer ${
        isSelected
          ? 'border-blue-600 shadow-lg ring-2 ring-blue-200'
          : isDisabled
          ? 'border-slate-200 opacity-50 cursor-not-allowed'
          : 'border-transparent hover:border-blue-300 hover:shadow-lg'
      }`}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Image */}
      <div className="h-32 overflow-hidden">
        <img
          src={table.image || getImage('TABLE_STANDARD')}
          alt={table.label}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = getImage('PLACEHOLDER');
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-900">{table.label}</h3>
          {isSelected && (
            <div className="bg-blue-600 text-white rounded-full p-1">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Capacity */}
        <div className="flex items-center text-slate-600 mb-3">
          <Users className="w-4 h-4 mr-1" />
          <span className="text-sm">Capacity: {table.capacity} guests</span>
        </div>

        {/* Tags */}
        {table.tags && table.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {table.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-full ${
                  tag === 'VIP'
                    ? 'bg-yellow-100 text-yellow-800'
                    : tag === 'Romantic'
                    ? 'bg-pink-100 text-pink-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price Extra */}
        {table.priceExtra > 0 && (
          <div className="text-sm font-semibold text-slate-900 mb-2">
            +${table.priceExtra} extra
          </div>
        )}

        {/* Status */}
        <div className="mt-3">
          {isDisabled && !canSeatParty ? (
            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              Too small for party
            </span>
          ) : table.status === 'available' ? (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Available
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default RestaurantTableCard;

