import { NextResponse } from 'next/server';
import axios from 'axios';
import { ref, update } from 'firebase/database';
import { db } from '@/lib/firebase'; // Adjust the import path to where your firebase file is located

const mpesaBaseUrl = process.env.NEXT_PUBLIC_MPESA_BASE_URL!;
const consumerKey = process.env.MPESA_CONSUMER_KEY!;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
const shortCode = process.env.MPESA_SHORT_CODE!;
const passKey = process.env.MPESA_PASSKEY!;
const callbackUrl = process.env.NEXT_PUBLIC_MPESA_CALLBACK_URL!;

// Helper function to generate M-Pesa access token
const getMpesaAccessToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  return response.data.access_token;
};

export async function POST(req: Request) {
  try {
    const { amount, phoneNumber, orderId, serviceTitle, userId } = await req.json();

    console.log('Received payment request:', { amount, phoneNumber, orderId, serviceTitle, userId });

    const accessToken = await getMpesaAccessToken();
    console.log('Generated access token:', accessToken);

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString('base64');

    const data = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: orderId,
      TransactionDesc: orderId,
    };

    console.log('Request data:', data);

    const response = await axios.post(
      mpesaBaseUrl,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('M-Pesa response:', response.data);

    const checkoutRequestId = response.data.CheckoutRequestID;

    // Create a new payment node with the checkoutRequestId and set status to 'pending'
    const paymentPath = `payments/${checkoutRequestId}`;
    await update(ref(db, paymentPath), { 
      orderPath: `orders/${serviceTitle}/${userId}/${orderId}`,
      status: 'pending'
    });

    console.log(`Payment node created with CheckoutRequestID ${checkoutRequestId}`);

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error('M-Pesa Payment Failed:', error.response?.data || error.message);
    return NextResponse.json({ success: false, message: 'M-Pesa payment failed', error: error.response?.data || error.message });
  }
}
