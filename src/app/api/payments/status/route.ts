// pages/api/payments/status.ts
import { NextResponse } from 'next/server';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase'; // Adjust the import path to where your firebase file is located

export async function GET(req: Request) {
    const url = new URL(req.url);
    const checkoutRequestId = url.searchParams.get('checkoutRequestId');
  
    if (!checkoutRequestId) {
      return NextResponse.json({ success: false, message: 'CheckoutRequestID is required' }, { status: 400 });
    }
  
    const paymentPath = `payments/${checkoutRequestId}`;
    const paymentSnapshot = await get(ref(db, paymentPath));
    const paymentData = paymentSnapshot.val();
  
    if (paymentData) {
      return NextResponse.json({ success: true, status: paymentData.status });
    } else {
      return NextResponse.json({ success: false, message: 'Payment not found' }, { status: 404 });
    }
  }
  