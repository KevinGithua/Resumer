import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Adjust to your Firebase admin import

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceTitle = searchParams.get('serviceTitle');
  const userId = searchParams.get('userId');
  const orderId = searchParams.get('orderId');

  if (!serviceTitle || !userId || !orderId) {
    return NextResponse.json({ success: false, message: 'Missing required parameters' });
  }

  try {
    // Construct the order path dynamically
    const orderRef = db.ref(`orders/${serviceTitle}/${userId}/${orderId}`);
    const orderSnapshot = await orderRef.once('value');
    const orderData = orderSnapshot.val();

    // Check if the paymentStatus is "complete"
    if (orderData && orderData.paymentStatus === 'complete') {
      return NextResponse.json({ success: true, paymentStatus: 'complete' });
    } else {
      return NextResponse.json({ success: false, paymentStatus: orderData ? orderData.paymentStatus : 'not found' });
    }
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}
