"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ref, get, update } from "firebase/database";
import { db as database, storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import ChatComponent from "@/components/ChatComponent";
import { getAuth } from "firebase/auth"; // Importing getAuth

type Order = {
  serviceTitle: string;
  orderId: string;
  userUid: string;
  timestamp: string;
  status: string;
  finishedWork?: string;
  completed: boolean;
  paymentStatus: string;
  [key: string]: any;
};

type User = {
  name: string;
  email: string;
  phoneNumber: string;
};

const OrderDetails = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserName, setCurrentUserName] = useState<string>("");

  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      try {
        const ordersRef = ref(database, `/orders`);
        const ordersSnapshot = await get(ordersRef);

        if (ordersSnapshot.exists()) {
          const allOrders = ordersSnapshot.val();
          let foundOrder: Order | null = null;

          Object.keys(allOrders).some(service => {
            const userOrders = allOrders[service];
            Object.keys(userOrders).some(userUid => {
              if (userOrders[userUid][orderId]) {
                const orderData = userOrders[userUid][orderId];
                foundOrder = {
                  serviceTitle: service || "Service Title Not Available",
                  orderId,
                  userUid,
                  timestamp: orderData.timestamp || "",
                  status: orderData.status || "Pending",
                  completed: orderData.completed || false,
                  paymentStatus: orderData.paymentStatus || "Pending",
                  ...orderData,
                };
                setOrder(foundOrder);
                fetchUserDetails(userUid);
                return true;
              }
              return false;
            });
            return !!foundOrder;
          });
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    const fetchUserDetails = async (userUid: string) => {
      try {
        const userSnapshot = await get(ref(database, `/users/${userUid}`));
        if (userSnapshot.exists()) {
          setUserDetails(userSnapshot.val());
        } else {
          setUserDetails({ name: "Unknown", email: "Unknown", phoneNumber: "Unknown" });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetails({ name: "Error", email: "Error", phoneNumber: "Error" });
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const auth = getAuth(); // Initialize Firebase Auth
    const user = auth.currentUser; // Get the current user
    if (user) {
      fetchCurrentUserName(user.uid);
    }
  }, []);

  const fetchCurrentUserName = async (userId: string) => {
    try {
      const userSnapshot = await get(ref(database, `/users/${userId}`));
      if (userSnapshot.exists()) {
        setCurrentUserName(userSnapshot.val().name);
      } else {
        setCurrentUserName("Unknown");
      }
    } catch (error) {
      console.error("Error fetching current user details:", error);
      setCurrentUserName("Error");
    }
  };

  const handleUpdateOrder = useCallback(
    async (updates: Partial<Order>) => {
      if (!order) return;
      const orderRef = ref(database, `/orders/${order.serviceTitle}/${order.userUid}/${order.orderId}`);
      await update(orderRef, updates);
      setOrder(prevOrder => (prevOrder ? { ...prevOrder, ...updates } : prevOrder));
    },
    [order]
  );

  const handleFileUpload = async () => {
    if (!file || !order) return;

    setLoading(true);

    try {
      const fileStorageRef = storageRef(storage, `orders/${order.orderId}/${file.name}`);
      await uploadBytes(fileStorageRef, file);
      const downloadURL = await getDownloadURL(fileStorageRef);
      await handleUpdateOrder({ finishedWork: downloadURL, status: "Completed" });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSubmit = async () => {
    if (link) {
      setLoading(true);
      try {
        await handleUpdateOrder({ finishedWork: link });
      } catch (error) {
        console.error("Error submitting link:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const markAsCompleted = async () => {
    await handleUpdateOrder({ completed: true, status: "Completed" });
  };

  const extractFileName = (url: string) => decodeURIComponent(url.split("?")[0].split("/").pop() || "");

  const formatKey = (key: string) => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, str => str.toUpperCase());
  };

  if (!order) {
    return <div className="p-6">Order details not found.</div>;
  }

  const requiresFileUpload = ["Resume Writing", "Resume Revamping", "Cover Letter Writing"].includes(order.serviceTitle);
  const requiresLink = ["LinkedIn Profile Optimization", "Job Application Assistance"].includes(order.serviceTitle);

  const { timestamp, completed, finishedWork, status, userUid, serviceTitle, ...orderDetails } = order;

  return (
    <div className="p-2 sm:p-4 lg:p-2 bg-cyan-100 min-h-screen text-gray-900">
      <h2 className="text-2xl sm:text-4xl font-bold mb-4">Order Details</h2>
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Order Details */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md flex-1">
          <div className="mb-6 space-y-4">
            <div className="space-y-2 font-semibold">
              <p><span className="text-cyan-800">User UID:</span> {userUid}</p>
              <p><span className="text-cyan-800">Name:</span> {userDetails?.name || "Loading..."}</p>
              <p><span className="text-cyan-800">Email:</span> {userDetails?.email || "Loading..."}</p>
              <p><span className="text-cyan-800">Phone Number:</span> {userDetails?.phoneNumber || "Loading..."}</p>
            </div>
            <div className="pl-6 space-y-2">
              <p><strong className="text-teal-700">Order ID:</strong> {orderId}</p>
              <p><strong className="text-teal-700">Order Status:</strong> {status}</p>
              {Object.entries(orderDetails).map(([key, value]) => (
                <p key={key}><strong className="text-teal-700">{formatKey(key)}:</strong> {value}</p>
              ))}
            </div>
          </div>

          {/* Conditional Upload/Link Section */}
          {order.paymentStatus === "pending" ? (
            <p className="text-red-600 font-semibold mt-6">Order pending Payment completion</p>
          ) : !completed ? (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              {requiresFileUpload && !requiresLink && (
                <>
                  <input
                    type="file"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="block w-full sm:w-auto text-sm text-gray-500 file:mr-0 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-4 sm:mb-0"
                  />
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
                    onClick={handleFileUpload}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Upload"}
                  </button>
                </>
              )}
              {requiresLink && !requiresFileUpload && (
                <>
                  <input
                    type="text"
                    placeholder="Enter the link"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    className="block w-full sm:w-auto text-sm text-gray-900 border border-gray-300 rounded py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500 mb-4 sm:mb-0"
                  />
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
                    onClick={handleLinkSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </>
              )}
            </div>
          ) : null}

          {/* Display Finished Work */}
          {finishedWork && (
            <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
              <h4 className="text-lg font-semibold mb-2">Finished Work:</h4>
              {requiresFileUpload ? (
                <a
                  href={finishedWork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {extractFileName(finishedWork)}
                </a>
              ) : (
                <a
                  href={finishedWork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-words"
                >
                  {finishedWork}
                </a>
              )}
            </div>
          )}

          {/* Mark as Completed Button */}
          {!completed && order.paymentStatus !== "pending" && (
            <button
              className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              onClick={markAsCompleted}
            >
              Mark as Completed
            </button>
          )}
        </div>

        {orderId && !completed && (
          <div className="mt-6 lg:mt-0 lg:w-[400px] h-[600px] overflow-y-auto rounded-lg">
            <ChatComponent
              userId={currentUserName || "Unknown"}
              orderId={orderId}
              onMessageReceived={(count) => console.log(`${count} messages received`)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
