import { useState, useEffect } from 'react';
import { Calendar, Users, Mail, Phone, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../api/bookingApi';
import PaymentModal from './PaymentModal';
import LoginModal from './LoginModal';

const BookingSidebar = ({ hotel, selectedRoom }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null); // Store booking intent
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split('T')[0];

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    const nights = calculateNights();
    return selectedRoom.price * nights;
  };

  const validate = () => {
    const newErrors = {};
    
    if (!bookingData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!bookingData.checkOut) newErrors.checkOut = 'Check-out date is required';
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      if (checkOut <= checkIn) {
        newErrors.checkOut = 'Check-out must be after check-in';
      }
    }
    if (!bookingData.contactName.trim()) newErrors.contactName = 'Name is required';
    if (!bookingData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }
    if (!bookingData.contactPhone.trim()) newErrors.contactPhone = 'Phone is required';
    if (bookingData.guests < 1 || bookingData.guests > selectedRoom?.capacity) {
      newErrors.guests = `Must be between 1 and ${selectedRoom?.capacity || 10}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Resume booking after login
  useEffect(() => {
    if (isAuthenticated() && pendingBooking && !isSubmitting) {
      console.log('BookingSidebar: Resuming booking after login');
      // Wait a bit for axios header to be set
      setTimeout(() => {
        submitBooking(pendingBooking);
        setPendingBooking(null);
      }, 100);
    }
  }, [isAuthenticated, pendingBooking]);

  const submitBooking = async (bookingPayload) => {
    setIsSubmitting(true);
    try {
      console.log('BookingSidebar: Submitting booking with payload:', JSON.stringify(bookingPayload, null, 2));
      console.log('BookingSidebar: Selected room:', selectedRoom);
      console.log('BookingSidebar: Room ID being sent:', bookingPayload.roomId);
      console.log('BookingSidebar: Hotel ID being sent:', bookingPayload.hotelId);
      
      const response = await bookingApi.createHotelBooking(bookingPayload);
      
      if (response.status === 201 || response.status === 200) {
        console.log('BookingSidebar: Booking created successfully:', response.data);
        setCurrentBooking(response.data);
        setShowPaymentModal(true);
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('BookingSidebar: Booking error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to create booking. Please try again.';
      alert(errorMessage);
      
      // If 401, show login modal
      if (error.response?.status === 401) {
        setShowLoginModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (!selectedRoom) {
      alert('Please select a room first');
      return;
    }

    const bookingPayload = {
      hotelId: hotel.id,
      roomId: selectedRoom.id,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      contactName: bookingData.contactName,
      contactEmail: bookingData.contactEmail,
      contactPhone: bookingData.contactPhone,
      totalPrice: calculateTotal()
    };

    // Check authentication
    if (!isAuthenticated()) {
      console.log('BookingSidebar: User not authenticated, storing booking intent');
      setPendingBooking(bookingPayload);
      setShowLoginModal(true);
      return;
    }

    // User is authenticated, submit booking
    await submitBooking(bookingPayload);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const paymentResponse = await mockAPI.processPayment({
        bookingId: currentBooking.bookingId,
        amount: currentBooking.summary.totalPrice,
        method: paymentData.method
      }, token);

      if (paymentResponse.status === 200) {
        setShowPaymentModal(false);
        navigate('/confirmation', {
          state: {
            type: 'hotel',
            booking: currentBooking,
            payment: paymentResponse.data
          }
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    }
  };

  return (
    <>
      <aside className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Booking Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dates */}
          <div className="space-y-4">
            <div>
              <label htmlFor="checkIn" className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Check-in
              </label>
              <input
                type="date"
                id="checkIn"
                value={bookingData.checkIn}
                min={today}
                onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.checkIn ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {errors.checkIn && <p className="mt-1 text-sm text-red-600">{errors.checkIn}</p>}
            </div>

            <div>
              <label htmlFor="checkOut" className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Check-out
              </label>
              <input
                type="date"
                id="checkOut"
                value={bookingData.checkOut}
                min={bookingData.checkIn || today}
                onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.checkOut ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {errors.checkOut && <p className="mt-1 text-sm text-red-600">{errors.checkOut}</p>}
            </div>
          </div>

          {/* Guests */}
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-slate-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Guests
            </label>
            <input
              type="number"
              id="guests"
              value={bookingData.guests}
              min="1"
              max={selectedRoom?.capacity || 10}
              onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) || 1 })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.guests ? 'border-red-500' : 'border-slate-300'
              }`}
              required
            />
            {errors.guests && <p className="mt-1 text-sm text-red-600">{errors.guests}</p>}
          </div>

          {/* Contact Information */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900">Contact Information</h3>

            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                id="contactName"
                value={bookingData.contactName}
                onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.contactName ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                id="contactEmail"
                value={bookingData.contactEmail}
                onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.contactEmail ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                value={bookingData.contactPhone}
                onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.contactPhone ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>}
            </div>
          </div>

          {/* Summary */}
          {selectedRoom && (
            <div className="pt-4 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Room:</span>
                  <span className="font-medium">{selectedRoom.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Nights:</span>
                  <span className="font-medium">{calculateNights()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Price per night:</span>
                  <span className="font-medium">${selectedRoom.price}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedRoom || isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {isSubmitting ? 'Processing...' : 'Book Now'}
          </button>
        </form>
      </aside>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          // If login was cancelled and we have pending booking, clear it
          if (!isAuthenticated() && pendingBooking) {
            setPendingBooking(null);
          }
        }}
      />

      {currentBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={currentBooking.summary.totalPrice}
          bookingId={currentBooking.bookingId}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default BookingSidebar;
