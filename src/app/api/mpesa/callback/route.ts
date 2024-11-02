import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Adjust the import path to where your firebase file is located

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);

    // Destructure with default values to prevent errors
    const { Body: { stkCallback } = { stkCallback: null } } = body;

    if (!stkCallback) {
      throw new Error('stkCallback is undefined');
    }

    console.log('M-Pesa Callback:', stkCallback);

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback;

    if (ResultCode === 0 && CallbackMetadata) {
      const { Item } = CallbackMetadata;
      const transactionCode = Item.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;

      if (!transactionCode) {
        console.log('Transaction code not found in callback data');
        return NextResponse.json({ success: false, message: 'Transaction code not found' });
      }

      // Retrieve the order path from the payment node
      const paymentRef = db.ref(`payments/${CheckoutRequestID}`);
      const paymentSnapshot = await paymentRef.once('value');
      const orderPath = paymentSnapshot.val()?.orderPath;

      if (!orderPath) {
        console.log('Order path not found in payment data');
        return NextResponse.json({ success: false, message: 'Order path not found' });
      }

      // Update the order data in Firebase Admin
      const orderRef = db.ref(orderPath);
      const orderSnapshot = await orderRef.once('value');

      if (!orderSnapshot.exists()) {
        console.log('Order not found');
        return NextResponse.json({ success: false, message: 'Order not found' });
      }

      const orderData = orderSnapshot.val();
      const updatedOrderData = {
        ...orderData,
        transactionCode,
        paymentStatus: 'complete',
        paymentMethod: 'M-Pesa',
      };

      await orderRef.update(updatedOrderData);

      console.log(`Order ${orderPath} updated with transactionCode ${transactionCode}`);

      // Return success response without redirection
      return NextResponse.json({ success: true, message: 'Order updated successfully' });
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
