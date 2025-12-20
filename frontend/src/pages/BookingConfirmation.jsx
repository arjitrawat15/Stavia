import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Users, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Back to Hotel Selection
          </button>
        </div>
      </div>
    );
  }

  const handleNewBooking = () => {
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your reservation has been successfully created
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-blue-600">
            <h2 className="text-xl font-semibold text-white">Booking Summary</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Hotel & Room Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accommodation</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{booking.hotel}</div>
                      <div className="text-sm text-gray-500">Hotel Location</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-3 flex items-center justify-center">
                      🏨
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Room {booking.room.number} - {booking.room.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{booking.room.price} per night
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatDate(booking.bookingData.checkInDate)} - {formatDate(booking.bookingData.checkOutDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.nights} night(s)
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.bookingData.guests} Guest(s)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{booking.bookingData.customerName}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{booking.bookingData.customerEmail}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{booking.bookingData.customerPhone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Booking */}
        {booking.restaurant && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-4 bg-orange-600">
              <h2 className="text-xl font-semibold text-white">Restaurant Reservation</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Table Details</h3>
                  <div className="space-y-3">
                    {booking.restaurant.tables.map((table) => (
                      <div key={table.id} className="flex items-center">
                        <div className="h-5 w-5 mr-3 flex items-center justify-center">
                          🍽️
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Table {table.number} - {table.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            Up to {table.capacity} guests
                            {table.price > 0 && ` • +₹${table.price}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDate(booking.restaurant.restaurantData.bookingDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatTime(booking.restaurant.restaurantData.bookingTime)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {booking.restaurant.restaurantData.partySize} Guest(s)
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {booking.restaurant.restaurantData.specialRequests && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {booking.restaurant.restaurantData.specialRequests}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Summary */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-green-600">
            <h2 className="text-xl font-semibold text-white">Pricing Summary</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room {booking.room.number} ({booking.nights} nights)</span>
                <span className="font-medium">₹{booking.room.price * booking.nights}</span>
              </div>
              
              {booking.restaurant && booking.restaurant.tables.some(t => t.price > 0) && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Restaurant Table Fee</span>
                  <span className="font-medium">
                    ₹{booking.restaurant.tables.reduce((sum, table) => sum + table.price, 0)}
                  </span>
                </div>
              )}
              
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Total Amount</span>
                <span>
                  ₹{booking.totalPrice + (booking.restaurant ? booking.restaurant.tables.reduce((sum, table) => sum + table.price, 0) : 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• You will receive a confirmation email shortly</li>
            <li>• Check-in time is 3:00 PM on your arrival date</li>
            <li>• Check-out time is 11:00 AM on your departure date</li>
            <li>• Contact the hotel directly for any special requests</li>
            <li>• Restaurant reservations are confirmed for your selected time</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="text-center">
          <button
            onClick={handleNewBooking}
            className="btn-primary mr-4"
          >
            Make Another Booking
          </button>
          <button
            onClick={() => window.print()}
            className="btn-secondary"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
