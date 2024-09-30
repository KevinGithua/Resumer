'use client';

import { useState, useEffect, Suspense } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db as database } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';

type Order = {
  serviceTitle: string;
  userId: string;
  orderId: string;
  timestamp: string;
  completed: boolean;
  status: string;
  paymentStatus: string;
  [key: string]: any;
};

type UserNames = {
  [key: string]: string;
};

const AdminViewComponent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<'available' | 'completed' | 'unpaid'>('available');
  const [userNames, setUserNames] = useState<UserNames>({});
  const router = useRouter();
  const searchParams = useSearchParams(); // Wrapped in Suspense

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersRef = ref(database, `/orders`);

      const handleValueChange = async (snapshot: any) => {
        const allOrders = snapshot.val();
        let ordersList: Order[] = [];
        let userIds: Set<string> = new Set();

        for (const service in allOrders) {
          for (const userId in allOrders[service]) {
            for (const orderId in allOrders[service][userId]) {
              const order = allOrders[service][userId][orderId];
              const orderData = {
                serviceTitle: service,
                userId,
                orderId,
                timestamp: order.timestamp || 'No Date Provided',
                completed: order.completed || false,
                status: order.orderStatus || 'Pending',
                paymentStatus: order.paymentStatus || 'Pending',
                ...order,
              };
              ordersList.push(orderData);
              userIds.add(userId);
            }
          }
        }
        ordersList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Fetch user names
        const fetchUserNames = async (userIds: Set<string>) => {
          let userNamesMap: UserNames = {};
          for (const userId of userIds) {
            const userRef = ref(database, `/users/${userId}`);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
              userNamesMap[userId] = userSnapshot.val().name || 'Unknown User';
            }
          }
          setUserNames(userNamesMap);
        };

        fetchUserNames(userIds);
        const filteredOrders = ordersList.filter((order) => {
          if (view === 'available') {
            return !order.completed && order.paymentStatus === 'complete';
          } else if (view === 'completed') {
            return order.completed;
          } else if (view === 'unpaid') {
            return !order.completed && order.paymentStatus === 'pending';
          }
        });

        setOrders(filteredOrders);
      };

      const unsubscribe = onValue(ordersRef, handleValueChange);
      return () => unsubscribe();
    };

    fetchOrders();
  }, [view]);

  useEffect(() => {
    const currentView = searchParams.get('view') || 'available';
    setView(currentView as 'available' | 'completed' | 'unpaid');
  }, [searchParams]);

  const handleViewChange = (newView: 'available' | 'completed' | 'unpaid') => {
    setView(newView);
    router.push(`/admin?view=${newView}`);
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp || timestamp === 'No Date Provided') return 'No Date Provided';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleOrderClick = (orderId: string) => {
    router.push(`/order-details?id=${orderId}&admin=true`); // Pass the admin prop as true
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="admin-view px-4 sm:px-6 lg:px-8 py-8 rounded-lg max-w-screen-lg w-full">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-cyan-900 text-center">
          {view === 'available' ? 'Available Orders' : view === 'completed' ? 'Completed Orders' : 'Unpaid Orders'}
        </h2>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`py-2 px-4 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white transition-all duration-300 ${view === 'available' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleViewChange('available')}
          >
            Available Orders
          </button>
          <button
            className={`py-2 px-4 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white transition-all duration-300 ${view === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleViewChange('completed')}
          >
            Completed Orders
          </button>
          <button
            className={`py-2 px-4 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white transition-all duration-300 ${view === 'unpaid' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleViewChange('unpaid')}
          >
            Unpaid Orders
          </button>
        </div>
        <ul className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-center text-gray-800">No orders available</p>
          ) : (
            orders.map((order, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:border-cyan-500 transition-all duration-300">
                <button
                  onClick={() => handleOrderClick(order.orderId)}
                  className="block w-full text-left"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg sm:text-xl lg:text-xl font-semibold text-cyan-900">
                      {order.serviceTitle}
                    </h3>
                    <p className="text-gray-600">{formatTimestamp(order.timestamp)}</p>
                  </div>
                  <p className="text-gray-800 mb-2">
                    <strong>User:</strong> {userNames[order.userId] || 'Loading...'}
                  </p>
                  <p className="text-gray-800">
                    <strong>Status:</strong> {order.status}
                  </p>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

const AdminView = () => {
  return (
    <Suspense fallback={<div>Loading admin panel...</div>}>
      <AdminViewComponent />
    </Suspense>
  );
};

export default AdminView;
