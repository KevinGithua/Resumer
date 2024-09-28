import React, { useState, useCallback } from 'react';
import axios from 'axios';

type MpesaButtonProps = {
  orderId: string;
  amount: number;
  serviceTitle: string;
  userId: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
  className?: string; // Add className prop
};

const MpesaButton: React.FC<MpesaButtonProps> = ({
  orderId,
  amount,
  serviceTitle,
  userId,
  onSuccess,
  onError,
  className = "", // Default to empty string if no className is provided
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizePhoneNumber = (number: string): string => {
    // Remove spaces and trim the input
    number = number.trim().replace(/\s+/g, '');

    if (number.startsWith('+254')) {
      return number.replace('+', '');
    } else if (number.startsWith('0')) {
      return '254' + number.slice(1);
    } else if (number.startsWith('254')) {
      return number;
    }
    return '254' + number; // Default to adding 254 if no recognized prefix
  };

  const validatePhoneNumber = (number: string): boolean => {
    const phoneRegex = /^254[0-9]{9}$/; // Must start with 254 followed by 9 digits
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

    setError(null); // Clear previous errors
    setLoading(true); // Start loading state

    try {
      console.log('Initiating M-Pesa payment with data:', { orderId, amount, normalizedNumber, serviceTitle, userId });

      const response = await axios.post('/api/mpesa/payment', {
        orderId,
        amount,
        phoneNumber: normalizedNumber, // Use normalized phone number
        serviceTitle,
        userId,
      });

      console.log('Payment response:', response.data);

      if (response.data.success) {
        onSuccess(response.data.data); // Call success callback
      } else {
        throw new Error(response.data.message); // Throw error if response is not successful
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data || error.message
        : 'An unexpected error occurred';
      console.error('Payment error:', errorMessage);
      onError(new Error(errorMessage)); // Notify of the error
      setError(errorMessage); // Set error message to display
    } finally {
      setLoading(false); // End loading state
    }
  }, [orderId, amount, phoneNumber, serviceTitle, userId, onSuccess, onError]);

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
        className={`bg-green-600 text-white py-2 px-4 rounded-md w-full flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} // Disable button while loading
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay with M-Pesa'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default MpesaButton;
