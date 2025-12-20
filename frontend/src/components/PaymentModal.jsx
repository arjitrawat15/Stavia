import { useState } from 'react';
import { X, CreditCard, Smartphone, Wallet } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, amount, onSuccess, bookingId, reservationId }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  // For PayPal demo, simulate authorized state
  const [paypalReady, setPaypalReady] = useState(true); // Always true for demo

  if (!isOpen) return null;

  const validateCard = () => {
    const newErrors = {};
    
    if (!cardData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!cardData.expiry.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiry = 'Expiry must be MM/YY';
    }
    if (!cardData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    if (!cardData.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUPI = () => {
    if (!upiId.match(/^[\w.-]+@[\w]+$/)) {
      setErrors({ upiId: 'Invalid UPI ID format (e.g., name@paytm)' });
      return false;
    }
    return true;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let isValid = false;
    if (paymentMethod === 'card') {
      isValid = validateCard();
    } else if (paymentMethod === 'upi') {
      isValid = validateUPI();
    } else if (paymentMethod === 'paypal') {
      // Always succeed for PayPal demo
      setErrors({});
      isValid = true;
    } else {
      isValid = true;
    }

    if (!isValid) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setErrors({}); // Clear errors on success
      onSuccess({
        method: paymentMethod,
        amount: amount,
        transactionId: paymentMethod.toUpperCase() + '-DEMO-' + Math.floor(Math.random() * 1000000),
        status: 'Success'
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="text-sm text-slate-600 mb-1">Total Amount</div>
          <div className="text-3xl font-bold text-slate-900">${amount.toFixed(2)}</div>
        </div>

        {/* Payment Method Selection */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'
                }`} />
                <div className={`text-xs font-medium ${
                  paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  Card
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Smartphone className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'upi' ? 'text-blue-600' : 'text-slate-400'
                }`} />
                <div className={`text-xs font-medium ${
                  paymentMethod === 'upi' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  UPI
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('paypal');
                  setErrors({}); // Clear errors when switching to PayPal
                }}
                className={`p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Wallet className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'paypal' ? 'text-blue-600' : 'text-slate-400'
                }`} />
                <div className={`text-xs font-medium ${
                  paymentMethod === 'paypal' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  PayPal
                </div>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {paymentMethod === 'card' && (
              <>
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.cardNumber ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-slate-700 mb-2">
                      Expiry
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.expiry ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.expiry && <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>}
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-slate-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="123"
                      maxLength="4"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.cvv ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-slate-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    placeholder="John Doe"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label htmlFor="upiId" className="block text-sm font-medium text-slate-700 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  id="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@paytm"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.upiId ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.upiId && <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>}
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-slate-600">
                  This is a demo. PayPal payment will be simulated as successful.<br />
                  {/* You can add transaction slip logic here later. */}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Pay ${amount.toFixed(2)}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

