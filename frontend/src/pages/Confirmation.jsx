import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle, Printer, Share2, Calendar, Users, Mail, Phone, CreditCard } from 'lucide-react';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    const type = location.state?.type; // 'hotel', 'restaurant', or 'both'
    const booking = location.state?.booking;
    const reservation = location.state?.reservation;
    const payment = location.state?.payment;

    if (!booking && !reservation) {
      navigate('/');
      return;
    }

    setConfirmationData({
      type,
      booking,
      reservation,
      payment,
      totalPrice: (booking?.summary?.totalPrice || 0) + (reservation?.summary?.tablePrice || 0)
    });
  }, [location.state, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Booking Confirmation - ReserveIT',
          text: 'I just booked a reservation!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!confirmationData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-slate-600">Loading confirmation...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const { type, booking, reservation, payment, totalPrice } = confirmationData;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-900 mb-2">Booking Confirmed!</h1>
            <p className="text-green-700">
              Thank you for your reservation. We've sent a confirmation email to your address.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-6 rounded-lg border border-slate-300 transition-colors duration-200"
            >
              <Printer className="w-5 h-5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-6 rounded-lg border border-slate-300 transition-colors duration-200"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Hotel Booking */}
          {booking && (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Accommodation Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-1">Booking ID</div>
                    <div className="font-semibold text-slate-900">{booking.bookingId}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Hotel</div>
                    <div className="font-semibold text-slate-900">{booking.summary.hotel}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Room Type</div>
                    <div className="font-semibold text-slate-900">{booking.summary.room}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Check-in
                    </div>
                    <div className="font-semibold text-slate-900">
                      {new Date(booking.summary.checkIn).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Check-out
                    </div>
                    <div className="font-semibold text-slate-900">
                      {new Date(booking.summary.checkOut).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Guests
                    </div>
                    <div className="font-semibold text-slate-900">{booking.summary.guests}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Total Price</div>
                    <div className="font-semibold text-slate-900 text-xl">${booking.summary.totalPrice}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Restaurant Reservation */}
          {reservation && (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Restaurant Reservation</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-1">Reservation ID</div>
                    <div className="font-semibold text-slate-900">{reservation.reservationId}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Restaurant</div>
                    <div className="font-semibold text-slate-900">{reservation.summary.restaurant}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Table</div>
                    <div className="font-semibold text-slate-900">{reservation.summary.table}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Date
                    </div>
                    <div className="font-semibold text-slate-900">
                      {new Date(reservation.summary.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Time</div>
                    <div className="font-semibold text-slate-900">{reservation.summary.time}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Party Size
                    </div>
                    <div className="font-semibold text-slate-900">{reservation.summary.partySize} guests</div>
                  </div>
                  {reservation.summary.tablePrice > 0 && (
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Table Fee</div>
                      <div className="font-semibold text-slate-900">${reservation.summary.tablePrice}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payment Information */}
          {payment && (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-2" />
                Payment Information
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Transaction ID:</span>
                  <span className="font-semibold text-slate-900">{payment.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Method:</span>
                  <span className="font-semibold text-slate-900 capitalize">{payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount Paid:</span>
                  <span className="font-semibold text-slate-900">${payment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          {(booking || reservation) && (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Pricing Summary</h2>
              
              <div className="space-y-3">
                {booking && (
                  <div className="flex justify-between text-slate-700">
                    <span>Accommodation</span>
                    <span className="font-semibold">${booking.summary.totalPrice}</span>
                  </div>
                )}
                {reservation && reservation.summary.tablePrice > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Restaurant Table Fee</span>
                    <span className="font-semibold">${reservation.summary.tablePrice}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between text-xl font-bold text-slate-900">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-slate-600" />
                <span className="text-slate-700">contact@reserveit.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-slate-600" />
                <span className="text-slate-700">+0135 233 5758</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center print:hidden">
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Make Another Booking
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Confirmation;
