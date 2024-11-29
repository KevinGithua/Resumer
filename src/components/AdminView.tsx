import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase"; // Import auth
import { ref, get, onValue } from "firebase/database";
import { db as database } from "@/lib/firebase";
import { formatTimestamp } from "@/utils/orderUtils";

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
  const searchParams = useSearchParams();

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

  const handleOrderClick = (orderId: string) => {
  
    router.push(`/order-details/${orderId}`);
  };
  

  return (
    <main>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-cyan-900 text-center">
        {view === 'available' ? 'Available Orders' : view === 'completed' ? 'Completed Orders' : 'Unpaid Orders'}
      </h2>
      <div className="flex justify-between text-lg md:text-xl xl:text-2xl space-x-2 lg:space-x-20 mb-6">
        {(['available', 'completed', 'unpaid'] as const).map((type) => (
          <button
            key={type}
            className={`flex-1 p-2 text-center rounded-lg border border-purple-600 text-purple-600 transition-colors duration-300 ${
              view === type ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-purple-400 hover:text-white'
            }`}
            onClick={() => handleViewChange(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Orders
          </button>
        ))}
      </div>

      <ul className="flex flex-col w-full space-y-4">
        {orders.length === 0 ? ( <p className="text-gray-600">No orders available</p> ) : 
        (
          orders.map((order, index) => (
            <li key={index} className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg shadow-md border border-gray-200 hover:border-cyan-500 transition-all duration-300">
              <button
                onClick={() => handleOrderClick(order.orderId)}
                className="block w-full text-left"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-800 mb-2 sm:mb-0">
                    {order.serviceTitle.replace(/_/g, ' ').replace(/\b\w/g, str => str.toUpperCase())}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg font-mono text-gray-600">
                    {formatTimestamp(order.timestamp)}
                  </p>
                </div>
                <p className="text-sm sm:text-base text-gray-800 mb-2">
                  <strong className="font-semibold">Status:</strong> {order.status}
                </p>
              </button>
            </li>
          ))
        )}
      </ul>
    </main>
  );
};

export default AdminViewComponent;
