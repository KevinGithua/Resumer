'use client';
import { useEffect, useState } from "react";
import { auth, db as database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { useRouter } from "next/navigation";
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

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [view, setView] = useState<'available' | 'completed' | 'unpaid'>('available');
  const [loadingUserDetails, setLoadingUserDetails] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async (userId: string) => {
      const ordersRef = ref(database, `/orders`);
      setLoadingOrders(true);
      try {
        const ordersSnapshot = await get(ordersRef);
        let userOrders: Order[] = [];

        if (ordersSnapshot.exists()) {
          const allOrders = ordersSnapshot.val();
          for (const service in allOrders) {
            if (allOrders[service][userId]) {
              const serviceOrders = allOrders[service][userId];
              for (const orderId in serviceOrders) {
                const orderData = {
                  serviceTitle: service,
                  userId,
                  orderId,
                  timestamp: serviceOrders[orderId].timestamp || "No Date Provided",
                  completed: serviceOrders[orderId].completed || false,
                  status: serviceOrders[orderId].orderStatus || "Pending",
                  paymentStatus: serviceOrders[orderId].paymentStatus || "Pending",
                  ...serviceOrders[orderId],
                };
                userOrders.push(orderData);
              }
            }
          }
        }

        userOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const filteredOrders = userOrders.filter(order => {
          if (view === 'available') {
            return !order.completed && order.paymentStatus === 'complete';
          } else if (view === 'completed') {
            return order.completed;
          } else if (view === 'unpaid') {
            return !order.completed && order.paymentStatus === 'pending';
          }
        });

        setOrders(filteredOrders);
      } 
      catch (error) { console.error("Error fetching orders:", error); } 
      finally { setLoadingOrders(false); }
    };

    const fetchUserDetails = async (userId: string) => {
      const userRef = ref(database, `/users/${userId}`);
      setLoadingUserDetails(true);
      try {
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          setUserDetails(userSnapshot.val());
        }
      } 
      catch (error) { console.error("Error fetching user details:", error); } 
      finally { setLoadingUserDetails(false);}
    };

    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchOrders(authUser.uid);
        fetchUserDetails(authUser.uid);
      } else { setUser(null); }
    });

    return () => unsubscribe();
  }, [view]);


  const handleOrderClick = (orderId: string) => {
    router.push(`/order-details/${orderId}`);
  };
  


  const handleViewChange = (newView: 'available' | 'completed' | 'unpaid') => { setView(newView); };

  return (
    <main >
      {loadingUserDetails ? (
        <div className="user-details mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-cyan-800">Loading Profile...</h2>
          <p className="text-base sm:text-lg text-gray-600">Please wait while we fetch your details...</p>
        </div>
      ) : 
      ( userDetails && (
          <div className="flex flex-col items-start gap-2 bg-gradient-to-r from-teal-50 to-teal-100 p-4 sm:p-6 rounded-lg shadow-lg mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-cyan-800">My Profile</h2>
            <p className="text-base sm:text-lg text-gray-600 font-mono">
              <strong className="font-semibold font-sans">UID:</strong> {user?.uid || "No User ID"}
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              <strong className="font-semibold">Name:</strong> {userDetails.name || "No name provided"}
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              <strong className="font-semibold">Email:</strong> {userDetails.email || "No email provided"}
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              <strong className="font-semibold">Phone Number:</strong> {userDetails.phoneNumber || "No phone number provided"}
            </p>
          </div>
        )
      )}

      <div className="flex flex-col items-center">
        {/* Orders Section */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-cyan-800"> My Orders </h2>
        
        <div className="flex justify-between text-lg md:text-xl xl:text-2xl space-x-2 mb-6">
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
          {loadingOrders ? ( <p className="text-gray-600">Loading orders...</p> ) : 
          orders.length === 0 ? ( <p className="text-gray-600">No orders available</p> ) : 
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
      </div>
    </main>
  );
};

export default ProfilePage;
