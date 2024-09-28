// utils/orderUtils.ts
import { ref, get, onValue } from 'firebase/database';
import { db as database } from '@/lib/firebase';

export type Order = {
  serviceTitle: string;
  userId: string;
  orderId: string;
  timestamp: string;
  completed: boolean;
  status: string;
  paymentStatus: string;
  [key: string]: any;
};

export type View = 'available' | 'completed' | 'unpaid';

export const fetchOrders = async (view: View, userId?: string) => {
  const ordersRef = ref(database, `/orders`);
  try {
    const ordersSnapshot = await get(ordersRef);
    let ordersList: Order[] = [];
    let userIds: Set<string> = new Set();

    if (ordersSnapshot.exists()) {
      const allOrders = ordersSnapshot.val();

      for (const service in allOrders) {
        if (userId && !allOrders[service][userId]) continue;

        for (const user in allOrders[service]) {
          for (const orderId in allOrders[service][user]) {
            const order = allOrders[service][user][orderId];
            const orderData: Order = {
              serviceTitle: service,
              userId: user,
              orderId,
              timestamp: order.timestamp || 'No Date Provided',
              completed: order.completed || false,
              status: order.orderStatus || 'Pending',
              paymentStatus: order.paymentStatus || 'Pending',
              ...order,
            };
            ordersList.push(orderData);
            userIds.add(user);
          }
        }
      }
      
      ordersList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    const filteredOrders = ordersList.filter(order => {
      if (view === 'available') {
        return !order.completed && order.paymentStatus === 'complete';
      } else if (view === 'completed') {
        return order.completed;
      } else if (view === 'unpaid') {
        return !order.completed && order.paymentStatus === 'pending';
      }
      return false;
    });

    return { orders: filteredOrders, userIds: Array.from(userIds) };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { orders: [], userIds: [] };
  }
};

export const fetchUserNames = async (userIds: string[]) => {
  let userNamesMap: { [key: string]: string } = {};

  for (const userId of userIds) {
    const userRef = ref(database, `/users/${userId}`);
    try {
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        userNamesMap[userId] = userSnapshot.val().name || 'Unknown User';
      }
    } catch (error) {
      console.error(`Error fetching user details for ${userId}:`, error);
    }
  }

  return userNamesMap;
};

export const formatTimestamp = (timestamp: string) => {
  if (!timestamp || timestamp === 'No Date Provided') return 'No Date Provided';
  const date = new Date(timestamp);
  return date.toLocaleString();
};
