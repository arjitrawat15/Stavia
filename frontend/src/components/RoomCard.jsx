import { Check } from 'lucide-react';
import { getImage } from '../config/images';

const RoomCard = ({ room, onSelect, isSelected = false }) => {
  return (
    <article
      className={`bg-white rounded-xl shadow-md border-2 transition-all duration-200 ${
        isSelected
          ? 'border-blue-600 shadow-lg'
          : 'border-transparent hover:border-slate-300 hover:shadow-lg'
      } overflow-hidden`}
    >
      <div className="md:flex">
        {/* Image */}
        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
          <img
            src={room.image || getImage('ROOM_STANDARD')}
            alt={room.type}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = getImage('PLACEHOLDER');
            }}
          />
        </div>

        {/* Content */}
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{room.type}</h3>
              <p className="text-sm text-slate-600">Room {room.roomNumber}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">${room.price}</div>
              <div className="text-sm text-slate-600">per night</div>
            </div>
          </div>

          {/* Capacity */}
          <div className="mb-4">
            <span className="text-sm text-slate-700">
              Capacity: <strong>{room.capacity}</strong> {room.capacity === 1 ? 'guest' : 'guests'}
            </span>
          </div>

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full flex items-center"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="flex items-center justify-between">
            <div>
              {room.available ? (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  Unavailable
                </span>
              )}
            </div>
            {room.available && onSelect && (
              <button
                onClick={() => onSelect(room)}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSelected ? 'Selected' : 'Select Room'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
