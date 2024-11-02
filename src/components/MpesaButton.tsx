import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

type MpesaButtonProps = {
  orderId: string;
  amount: number;
  serviceTitle: string;
  userId: string;
  onSuccess: () => void;
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
        pollPaymentStatus(orderId);
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
      setLoading(false);
    }
  }, [orderId, amount, phoneNumber, serviceTitle, userId, onError]);

  const pollPaymentStatus = useCallback((orderPath: string) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(`/api/mpesa/payment-status?orderId=${orderPath}&userId=${userId}&serviceTitle=${serviceTitle}`);
        
        if (response.data.success) {
          if (response.data.paymentStatus === 'complete') {
            clearInterval(intervalId);
            setLoading(false);
            onSuccess(); 
          }
        }
      } catch (error) {
        console.error('Error fetching payment status:', error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [onSuccess, userId, serviceTitle]);

  return (
    <div className={`mpesa-button-container ${className} p-2 bg-white rounded-lg shadow-lg border border-gray-300`}>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm sm:text-base">
          For Mpesa enter Phone Number:
        </label>
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
      {loading && <p className="text-gray-500 mt-2">Processing your payment...</p>}
    </div>
  );
};

export default MpesaButton;
