import { NextRequest, NextResponse } from 'next/server';
import { ref, update, get } from 'firebase/database';
import { db } from '@/lib/firebase'; // Adjust the import path to where your firebase file is located

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);

    console.log('Received callback:', body);

    // Provide default values while destructuring to prevent the error
    const { Body: { stkCallback } = { stkCallback: null } } = body;
    
    if (!stkCallback) {
      throw new Error('stkCallback is undefined');
    }

    // Log the callback data for debugging
    console.log('M-Pesa Callback:', stkCallback);

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback;
    if (ResultCode === 0 && CallbackMetadata) {
      const { Item } = CallbackMetadata;
      const transactionCode = Item.find((i: any) => i.Name === 'MpesaReceiptNumber').Value;

      // Retrieve the order path from the payment node
      const paymentPath = `payments/${CheckoutRequestID}`;
      const paymentSnapshot = await get(ref(db, paymentPath));
      const orderPath = paymentSnapshot.val().orderPath;

      // Update the order data in Firebase
      await update(ref(db, orderPath), { transactionCode, paymentStatus: 'complete' });

      console.log(`Order ${orderPath} updated with transactionCode ${transactionCode}`);

      return NextResponse.json({ success: true, message: 'Callback received', data: stkCallback });
    } else {
      console.log('Transaction failed or incomplete callback data');
      return NextResponse.json({ success: false, message: 'Transaction failed or incomplete callback data', data: stkCallback });
    }
  } catch (error) {
    console.error('Callback handling error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: 'Method not allowed' });
}
