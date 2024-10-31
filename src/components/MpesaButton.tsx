import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

type MpesaButtonProps = {
  orderId: string;
  amount: number;
  serviceTitle: string;
  userId: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
  className?: string;
};

const MpesaButton: React.FC<MpesaButtonProps> = ({
  orderId,
  amount,
  serviceTitle,
  userId,
  onSuccess,
  onError,
  className = "",
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const normalizePhoneNumber = (number: string): string => {
    number = number.trim().replace(/\s+/g, '');
    if (number.startsWith('+254')) {
      return number.replace('+', '');
    } else if (number.startsWith('0')) {
      return '254' + number.slice(1);
    } else if (number.startsWith('254')) {
      return number;
    }
    return '254' + number;
  };

  const validatePhoneNumber = (number: string): boolean => {
    const phoneRegex = /^254[0-9]{9}$/;
    return phoneRegex.test(number);
  };

  const initiateMpesaPayment = useCallback(async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number.');
      return;
    }
    const normalizedNumber = normalizePhoneNumber(phoneNumber);
    if (!validatePhoneNumber(normalizedNumber)) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post('/api/mpesa/payment', {
        orderId,
        amount,
        phoneNumber: normalizedNumber,
        serviceTitle,
        userId,
      });
      if (response.data.success) {
        setCheckoutRequestId(response.data.data.CheckoutRequestID);
        console.log('CheckoutRequestID set, waiting for callback...');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data || error.message
        : 'An unexpected error occurred';
      console.error('Payment error:', errorMessage);
      onError(new Error(errorMessage));
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [orderId, amount, phoneNumber, serviceTitle, userId, onError]);

  useEffect(() => {
    if (checkoutRequestId) {
      const interval = setInterval(async () => {
        console.log('Polling payment status...');
        try {
          const response = await axios.get(`/api/payments/status?checkoutRequestId=${checkoutRequestId}`);
          const { status } = response.data;

          console.log('Payment status response:', response.data); // For debugging

          if (status === 'complete') {
            clearInterval(interval);
            setPaymentStatus("success");
          } else if (status === 'failed') {
            clearInterval(interval);
            setPaymentStatus("failed");
          }
        } catch (err) {
          console.error('Error fetching payment status:', err);
        }
      }, 5000); // Updated interval to 5000ms (5 seconds)

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [checkoutRequestId]);

  useEffect(() => {
    if (paymentStatus === "success") {
      console.log('Payment successful, invoking onSuccess callback');
      onSuccess({ checkoutRequestId });
    } else if (paymentStatus === "failed") {
      console.error('Payment failed, invoking onError callback');
      onError(new Error('Payment failed or incomplete'));
    }
  }, [paymentStatus, checkoutRequestId, onSuccess, onError]);

  return (
    <div className={`mpesa-button-container ${className} p-2 bg-white rounded-lg shadow-lg border border-gray-300`}>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm sm:text-base">For Mpesa enter Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <button
        onClick={initiateMpesaPayment}
        className={`bg-green-600 text-white py-2 px-4 rounded-md w-full flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay with M-Pesa'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default MpesaButton;
