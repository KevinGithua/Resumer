// src/pages/api/orders/update.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebaseAdmin'; // Importing the Firebase Admin SDK

type Data = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { orderId, transactionId, serviceTitle, userId } = req.body;

  if (!orderId || !transactionId || !serviceTitle || !userId) {
    return res.status(400).json({ success: false, message: 'Order ID, Transaction ID, Service Title, and User ID are required' });
  }

  try {
    // Reference to the specific order in Firebase Realtime Database
    const orderRef = db.ref(`orders/${serviceTitle}/${userId}/${orderId}`);
    const orderSnapshot = await orderRef.once('value');

    if (!orderSnapshot.exists()) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Retrieve the current order data
    const orderData = orderSnapshot.val();

    // Update the order data with the new transaction details
    const updatedOrderData = {
      ...orderData,
      transactions: [
        ...(orderData.transactions || []),
        {
          transactionId,
          status: 'completed',
          paymentMethod: 'PayPal',
        },
      ],
      status: 'paid',
    };

    // Update the order in the database
    await orderRef.update(updatedOrderData);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
