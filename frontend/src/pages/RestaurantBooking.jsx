import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RestaurantHero from '../components/RestaurantHero';
import RestaurantTableCard from '../components/RestaurantTableCard';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import PaymentModal from '../components/PaymentModal';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../context/AuthContext';
import mockAPI from '../api/mockServer';
import { Calendar, Clock, Users, Mail, Phone, User } from 'lucide-react';

const RestaurantBooking = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentReservation, setCurrentReservation] = useState(null);
  
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    partySize: 2,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // Get first available restaurant
        const response = await mockAPI.getRestaurants();
        if (response.data.length > 0) {
          const selectedRestaurant = response.data[0];
          setRestaurant(selectedRestaurant);
          
          const tablesResponse = await mockAPI.getTables(selectedRestaurant.id);
          setTables(tablesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const timeSlots = [
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const validate = () => {
    const newErrors = {};
    
    if (!reservationData.date) newErrors.date = 'Date is required';
    if (!reservationData.time) newErrors.time = 'Time is required';
    if (!selectedTable) newErrors.table = 'Please select a table';
    if (!reservationData.contactName.trim()) newErrors.contactName = 'Name is required';
    if (!reservationData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reservationData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }
    if (!reservationData.contactPhone.trim()) newErrors.contactPhone = 'Phone is required';
    if (reservationData.partySize < 1) {
      newErrors.partySize = 'Party size must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const booking = {
        restaurantId: restaurant.id,
        tableId: selectedTable.id,
        date: reservationData.date,
        time: reservationData.time,
        partySize: reservationData.partySize,
        notes: reservationData.notes,
        tablePrice: selectedTable.priceExtra || 0
      };

      const response = await mockAPI.createRestaurantBooking(booking, token);
      
      if (response.status === 201) {
        setCurrentReservation(response.data);
        setShowPaymentModal(true);
      } else if (response.status === 401) {
        setShowLoginModal(true);
      } else if (response.status === 409) {
        alert(response.error || 'This table is already booked for the selected time.');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Failed to create reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const paymentResponse = await mockAPI.processPayment({
        reservationId: currentReservation.reservationId,
        amount: currentReservation.summary.tablePrice,
        method: paymentData.method
      }, token);

      if (paymentResponse.status === 200) {
        setShowPaymentModal(false);
        navigate('/confirmation', {
          state: {
            type: 'restaurant',
            reservation: currentReservation,
            payment: paymentResponse.data
          }
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    }
  };

  const calculateTotal = () => {
    return (selectedTable?.priceExtra || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SkeletonLoader type="card" count={3} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Restaurant not found</h1>
          <a href="/" className="text-blue-600 hover:text-blue-700">
            Return to home
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <RestaurantHero restaurant={restaurant} />

      {/* Tables and Reservation Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tables Grid */}
            <main className="flex-1 lg:w-2/3">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Select a Table</h2>
              
              {tables.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-lg text-slate-600">No tables available at this time.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {tables.map((table) => (
                    <RestaurantTableCard
                      key={table.id}
                      table={table}
                      isSelected={selectedTable?.id === table.id}
                      onSelect={setSelectedTable}
                      selectedPartySize={reservationData.partySize}
                    />
                  ))}
                </div>
              )}

              {errors.table && (
                <p className="text-sm text-red-600 mb-4">{errors.table}</p>
              )}
            </main>

            {/* Reservation Sidebar */}
            <aside className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Reservation Details</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date */}
                  <div>
                    <label htmlFor="res-date" className="block text-sm font-medium text-slate-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      id="res-date"
                      value={reservationData.date}
                      min={today}
                      onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.date ? 'border-red-500' : 'border-slate-300'
                      }`}
                      required
                    />
                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                  </div>

                  {/* Time */}
                  <div>
                    <label htmlFor="res-time" className="block text-sm font-medium text-slate-700 mb-2">
                      <Clock className="inline w-4 h-4 mr-1" />
                      Time
                    </label>
                    <select
                      id="res-time"
                      value={reservationData.time}
                      onChange={(e) => setReservationData({ ...reservationData, time: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.time ? 'border-red-500' : 'border-slate-300'
                      }`}
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                  </div>

                  {/* Party Size */}
                  <div>
                    <label htmlFor="res-partySize" className="block text-sm font-medium text-slate-700 mb-2">
                      <Users className="inline w-4 h-4 mr-1" />
                      Party Size
                    </label>
                    <input
                      type="number"
                      id="res-partySize"
                      value={reservationData.partySize}
                      min="1"
                      max="20"
                      onChange={(e) => setReservationData({ ...reservationData, partySize: parseInt(e.target.value) || 1 })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.partySize ? 'border-red-500' : 'border-slate-300'
                      }`}
                      required
                    />
                    {errors.partySize && <p className="mt-1 text-sm text-red-600">{errors.partySize}</p>}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900">Contact Information</h3>

                    <div>
                      <label htmlFor="res-contactName" className="block text-sm font-medium text-slate-700 mb-2">
                        <User className="inline w-4 h-4 mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="res-contactName"
                        value={reservationData.contactName}
                        onChange={(e) => setReservationData({ ...reservationData, contactName: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.contactName ? 'border-red-500' : 'border-slate-300'
                        }`}
                        required
                      />
                      {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
                    </div>

                    <div>
                      <label htmlFor="res-contactEmail" className="block text-sm font-medium text-slate-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        id="res-contactEmail"
                        value={reservationData.contactEmail}
                        onChange={(e) => setReservationData({ ...reservationData, contactEmail: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.contactEmail ? 'border-red-500' : 'border-slate-300'
                        }`}
                        required
                      />
                      {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
                    </div>

                    <div>
                      <label htmlFor="res-contactPhone" className="block text-sm font-medium text-slate-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-1" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="res-contactPhone"
                        value={reservationData.contactPhone}
                        onChange={(e) => setReservationData({ ...reservationData, contactPhone: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.contactPhone ? 'border-red-500' : 'border-slate-300'
                        }`}
                        required
                      />
                      {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>}
                    </div>

                    <div>
                      <label htmlFor="res-notes" className="block text-sm font-medium text-slate-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        id="res-notes"
                        value={reservationData.notes}
                        onChange={(e) => setReservationData({ ...reservationData, notes: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any special dietary requirements or requests..."
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  {selectedTable && (
                    <div className="pt-4 border-t border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-4">Reservation Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Table:</span>
                          <span className="font-medium">{selectedTable.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Capacity:</span>
                          <span className="font-medium">{selectedTable.capacity} guests</span>
                        </div>
                        {selectedTable.priceExtra > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Table fee:</span>
                            <span className="font-medium">${selectedTable.priceExtra}</span>
                          </div>
                        )}
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
                    disabled={!selectedTable || isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {isSubmitting ? 'Processing...' : 'Book Table'}
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {currentReservation && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={currentReservation.summary.tablePrice}
          reservationId={currentReservation.reservationId}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default RestaurantBooking;
