import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Import Firebase Admin SDK

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, transactionId, serviceTitle, userId } = body;

    if (!orderId || !transactionId || !serviceTitle || !userId) {
      return NextResponse.json({ success: false, message: 'Order ID, Transaction ID, Service Title, and User ID are required' }, { status: 400 });
    }

    const orderRef = db.ref(`orders/${serviceTitle}/${userId}/${orderId}`);
    const orderSnapshot = await orderRef.once('value');

    if (!orderSnapshot.exists()) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const orderData = orderSnapshot.val();

    // Update the order data
    const updatedOrderData = {
      ...orderData,
      paymentStatus: 'complete',
      paymentMethod: 'PayPal',
      transactionId: transactionId,
    };

    await orderRef.update(updatedOrderData);

    // Redirect to the profile page on successful update
    const redirectUrl = new URL('/profile', process.env.NEXT_PUBLIC_BASE_URL).toString();
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
