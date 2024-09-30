"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
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

  return (
    <Suspense fallback={<div>Loading order details...</div>}>
      <ClientOrderDetails
        order={order}
        setOrder={setOrder}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        file={file}
        setFile={setFile}
        link={link}
        setLink={setLink}
        loading={loading}
        setLoading={setLoading}
        currentUserName={currentUserName}
        setCurrentUserName={setCurrentUserName}
      />
    </Suspense>
  );
};

export default OrderDetails;

const ClientOrderDetails = ({
  order,
  setOrder,
  userDetails,
  setUserDetails,
  file,
  setFile,
  link,
  setLink,
  loading,
  setLoading,
  currentUserName,
  setCurrentUserName,
}: {
  order: Order | null;
  setOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  userDetails: User | null;
  setUserDetails: React.Dispatch<React.SetStateAction<User | null>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  link: string;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserName: string;
  setCurrentUserName: React.Dispatch<React.SetStateAction<string>>;
}) => {
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
  }, [orderId, setOrder, setUserDetails]); // Include setOrder and setUserDetails in dependencies

  useEffect(() => {
    const auth = getAuth(); // Initialize Firebase Auth
    const user = auth.currentUser; // Get the current user
    if (user) {
      fetchCurrentUserName(user.uid);
    }
  }, []); // Empty dependency array as no dynamic values are used

  const fetchCurrentUserName = useCallback(async (userId: string) => {
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
  }, [setCurrentUserName]); // Include setCurrentUserName in dependencies

  const handleUpdateOrder = useCallback(
    async (updates: Partial<Order>) => {
      if (!order) return;
      const orderRef = ref(database, `/orders/${order.serviceTitle}/${order.userUid}/${order.orderId}`);
      await update(orderRef, updates);
      setOrder(prevOrder => (prevOrder ? { ...prevOrder, ...updates } : prevOrder));
    },
    [order, setOrder] // Include setOrder in dependencies
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
              <p><strong className="text-teal-700">Service Title:</strong> {serviceTitle}</p>
              <p><strong className="text-teal-700">Status:</strong> {status}</p>
              <p><strong className="text-teal-700">Completed:</strong> {completed ? "Yes" : "No"}</p>
              <p><strong className="text-teal-700">Timestamp:</strong> {timestamp}</p>
              {finishedWork && (
                <div>
                  <strong className="text-teal-700">Finished Work:</strong>
                  <a
                    href={finishedWork}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {extractFileName(finishedWork)}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Component */}
        {/* Chat Component */}
        <ChatComponent
          userId={currentUserName || "Unknown"}
          orderId={orderId || ""}
          onMessageReceived={(count) => console.log(`${count} messages received`)}
        />

      </div>

      {/* File Upload and Link Submission */}
      {requiresFileUpload && (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold">Upload Your File</h3>
          <input
            type="file"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="mt-2"
          />
          <button
            onClick={handleFileUpload}
            disabled={!file || loading}
            className={`mt-4 p-2 bg-blue-600 text-white rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}

      {requiresLink && (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold">Submit Your Link</h3>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Paste your link here"
            className="mt-2 w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleLinkSubmit}
            disabled={!link || loading}
            className={`mt-4 p-2 bg-blue-600 text-white rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Submitting..." : "Submit Link"}
          </button>
        </div>
      )}

      {/* Mark as Completed Button */}
      {!completed && (
        <button
          onClick={markAsCompleted}
          className="mt-4 p-2 bg-green-600 text-white rounded"
        >
          Mark as Completed
        </button>
      )}
    </div>
  );
};
