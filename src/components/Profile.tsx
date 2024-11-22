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
    <div className="profile-page  px-4 sm:px-6 lg:px-8 py-8 max-w-screen-lg mx-auto">
      {loadingUserDetails ? (
        <div className="user-details mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-cyan-800">Loading Profile...</h2>
          <p className="text-base sm:text-lg text-gray-600">Please wait while we fetch your details...</p>
        </div>
      ) : 
      ( userDetails && (
          <div className="user-details mb-8 bg-gradient-to-r from-teal-50 to-teal-100 p-4 sm:p-6 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-cyan-800">Your Profile</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              <strong className="font-semibold">User ID:</strong> {user?.uid || "No User ID"}
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              <strong className="font-semibold">Name:</strong> {userDetails.name || "No name provided"}
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              <strong className="font-semibold">Email:</strong> {userDetails.email || "No email provided"}
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              <strong className="font-semibold">Phone Number:</strong> {userDetails.phoneNumber || "No phone number provided"}
            </p>
          </div>
        )
      )}

      {/* Orders Section */}
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-cyan-800"> Your Orders </h2>
      
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`py-2 px-4 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white transition-all duration-300 ${view === 'available' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleViewChange('available')}
        > Available Orders </button>
        <button
          className={`py-2 px-4 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white transition-all duration-300 ${view === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleViewChange('completed')}
        > Completed Orders </button>
        <button
          className={`py-2 px-4 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white transition-all duration-300 ${view === 'unpaid' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handleViewChange('unpaid')}
        > Unpaid Orders </button>
      </div>

      <ul className="space-y-4">
        {loadingOrders ? ( <p className="text-gray-600">Loading orders...</p> ) : 
        orders.length === 0 ? ( <p className="text-gray-600">No orders available</p> ) : 
        (
          orders.map((order, index) => (
            <li key={index} className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg shadow-md border border-gray-200 hover:border-cyan-500 transition-all duration-300">
              <button
                onClick={() => handleOrderClick(order.orderId)}
                className="block w-full text-left"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-cyan-800">{order.serviceTitle}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{formatTimestamp(order.timestamp)}</p>
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
  );
};

export default ProfilePage;
