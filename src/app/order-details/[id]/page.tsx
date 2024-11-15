"use client";
import { Suspense, useEffect, useState } from "react";
import ChatComponent from "@/components/ChatComponent";
import { auth } from "@/lib/firebase";
import { ref, get, onValue } from "firebase/database";
import { db as database } from "@/lib/firebase";
import { useParams, useSearchParams } from "next/navigation";
import {
  fetchOrderDetails,
  fetchUserDetails,
  uploadFile,
  submitLink,
  updateOrder,
  Order,
  User,
  formatTimestamp,
  extractFilenameFromUrl,
} from "@/utils/orderUtils";

// Specific components for different services
import ResumeWriting from "@/components/display/ResumeWriting";
import ResumeRevamping from "@/components/display/ResumeRevamping";
import { FiDownload } from "react-icons/fi";
import { FaUser, FaRegIdBadge, FaEnvelope, FaPhoneAlt, FaBox } from "react-icons/fa";


const OrderDetails: React.FC = () => {
  const params = useParams(); // Access dynamic route parameters
  const searchParams = useSearchParams(); // Access query parameters
  const id = params?.id as string;
  const admin = searchParams.get("admin") as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const fetchOrderData = async () => {
      if (!id) return;
      const orderData = await fetchOrderDetails(id, database);
      setOrder(orderData);
      if (orderData) {
        const userData = await fetchUserDetails(orderData.userUid, database);
        setUserDetails(userData);
      }
    };

    fetchOrderData();
  }, [id]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // Fetch current user name
        const userRef = ref(database, `/users/${authUser.uid}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userName = userSnapshot.val().name || null;
          setCurrentUser(userName);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = async () => {
    if (!file || !order) return;
    setLoading(true);
    try {
      await uploadFile(file, order.orderId, order, database);
      setOrder({ ...order, finishedWork: URL.createObjectURL(file), status: "Completed" });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSubmit = async () => {
    if (link && order) {
      setLoading(true);
      try {
        await submitLink(link, order, database);
      } catch (error) {
        console.error("Error submitting link:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const markAsCompleted = async () => {
    if (order) {
      await updateOrder(order, { completed: true, status: "Completed" }, database);
      setOrder((prevOrder) =>
        prevOrder ? { ...prevOrder, completed: true, status: "Completed" } : prevOrder
      );
    }
  };

  if (!order) {
    return <div className="p-6">Order details not found.</div>;
  }

  // Specific services
  const requiresFileUpload = ["resumewriting", "resumerevamping", "coverletterwriting"].includes(order.serviceTitle);
  const requiresLink = ["linkedinprofileoptimization", "jobapplicationassistance"].includes(order.serviceTitle);

  // Render specific order details based on the service title
  const renderSpecificOrderDetails = () => {
    switch (order.serviceTitle) {
      case "resumewriting":
        return <ResumeWriting order={order} />;
      case "resumerevamping":
        return <ResumeRevamping order={order} />;
      default:
        return (
          <div className="bg-gradient-to-tr from-teal-50 to-teal-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-teal-800 mb-4 flex items-center justify-center">
              Specific Order Details
            </h3>
            <div className="flex flex-col space-y-4">
              {Object.entries(order)
                .filter(([key]) => ![
                  "userUid", "serviceTitle", "orderId", "status", "price", "transactionId", "timestamp", "completed", "paymentStatus", "paymentMethod"
                ].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="mb-4">
                    <strong className="text-teal-700 text-md font-semibold block mb-1">
                      {key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, str => str.toUpperCase())}:
                    </strong>
                    {key.includes("resumeUpload") && value ? (
                      <div className="space-y-2">
                        {/* File Link */}
                        <p className="flex items-center space-x-2">
                          <span className="text-teal-700">File Name:</span>
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-2 py-1 rounded-md transition-all duration-200 ease-in-out"
                          >
                            <i className="fas fa-file-alt text-lg"></i>
                            <span className="ml-2">{extractFilenameFromUrl(value)}</span>
                          </a>
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-700">{value || "Not specified"}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        );
    }
  };  

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="p-2 sm:p-4 lg:p-2 text-gray-900">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4">Order Details</h2>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 sm:p-6 lg:p-8 rounded-lg shadow-md flex-1">
          <div className="space-y-8">

            {/* User Information */}
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="text-teal-600 text-2xl" />
                <span className="ml-2">User Information</span>
              </h3>
              <div className="space-y-4">
                <p className="text-lg flex items-center">
                  <FaRegIdBadge className="text-teal-800 mr-2" />
                  <span className="text-teal-800 font-semibold">User UID:</span> <span className="text-gray-700">{order.userUid}</span>
                </p>
                <p className="text-lg flex items-center">
                  <FaUser className="text-teal-800 mr-2" />
                  <span className="text-teal-800 font-semibold">Name:</span> <span className="text-gray-700">{userDetails?.name || "Loading..."}</span>
                </p>
                <p className="text-lg flex items-center">
                  <FaEnvelope className="text-teal-800 mr-2" />
                  <span className="text-teal-800 font-semibold">Email:</span> <span className="text-gray-700">{userDetails?.email || "Loading..."}</span>
                </p>
                <p className="text-lg flex items-center">
                  <FaPhoneAlt className="text-teal-800 mr-2" />
                  <span className="text-teal-800 font-semibold">Phone Number:</span> <span className="text-gray-700">{userDetails?.phoneNumber || "Loading..."}</span>
                </p>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-gradient-to-tr from-teal-50 to-teal-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaBox className="text-teal-600 text-2xl" />
                <span className="ml-2">Order Details</span>
              </h3>
              <div className="space-y-4">
                <p className="text-lg">
                  <span className="text-teal-800 font-semibold">Service Title:</span> <span className="text-gray-700">{order.serviceTitle}</span>
                </p>
                <p className="text-lg">
                  <span className="text-teal-800 font-semibold">Order ID:</span> <span className="text-gray-700">{order.orderId}</span>
                </p>
                <p className="text-lg">
                  <span className="text-teal-800 font-semibold">Placed on:</span> <span className="text-gray-700">{formatTimestamp(order.timestamp)}</span>
                </p>
                <p className="text-lg">
                  <span className="text-teal-800 font-semibold">Price:</span> <span className="text-gray-700">{order.price}</span>
                </p>
                <p className="text-lg">
                  <span className="text-teal-800 font-semibold">Payment Method:</span> <span className="text-gray-700">{order.paymentMethod}</span>
                </p>
                <p className="text-lg">
                  <span className="text-teal-800 font-semibold">Transaction ID:</span> <span className="text-gray-700">{order.transactionId}</span>
                </p>
              </div>
            </div>


            {/* Specific Order Details */}
            {renderSpecificOrderDetails()}

            {/* Finished Work */}
            {order.finishedWork && (
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-md shadow-md hover:shadow-lg transition duration-200">
                <h4 className="text-lg font-semibold text-gray-700">Finished Work</h4>
                <a
                  href={order.finishedWork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-teal-700 font-medium mt-2 hover:text-teal-600"
                  aria-label="Download finished work"
                >
                  <FiDownload className="text-teal-600" />
                  {extractFilenameFromUrl(order.finishedWork)}
                </a>
              </div>
            )}

            {/* Conditional Upload/Link Section */}
            {order.paymentStatus === "pending" ? (
              <p className="text-red-400 font-semibold mt-6">Order pending payment completion</p>
            ) : !order.completed && (
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:space-x-4">

                  {/* File Upload */}
                  {requiresFileUpload && (
                    <>
                      <input
                        type="file"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        className="block w-full sm:w-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                      />
                      {loading ? <p className="text-gray-500">Uploading...</p> : (
                        <button
                          onClick={handleFileUpload}
                          className="bg-cyan-600 text-white py-2 px-6 rounded-full shadow-md hover:bg-cyan-700 transition ease-in-out duration-150"
                        >
                          Upload File
                        </button>
                      )}
                    </>
                  )}

                  {/* Link Submission */}
                  {requiresLink && (
                    <>
                      <input
                        type="text"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        placeholder="Enter Link"
                        className="block w-full sm:w-auto p-2 border border-gray-300 rounded mt-4 sm:mt-0"
                      />
                      {loading ? <p className="text-gray-500">Submitting...</p> : (
                        <button
                          onClick={handleLinkSubmit}
                          className="bg-cyan-600 text-white py-2 px-6 rounded-full shadow-md hover:bg-cyan-700 transition ease-in-out duration-150"
                        >
                          Submit Link
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Mark as Completed */}
                <button
                  onClick={markAsCompleted}
                  className="bg-teal-50 rounded-md shadow-md hover:shadow-lg transition duration-200 p-6 text-green-600 py-2 px-4 mt-6"
                >
                  Mark as Completed
                </button>
              </div>
            )}
          </div>
        </div>

          <div className="mt-6 lg:mt-0 lg:w-[400px] h-[600px] overflow-y-auto bg-gradient-to-b from-teal-50 to-teal-100 shadow-sm rounded-lg ease-in-out p-4">
            <ChatComponent
              userId={currentUser} 
              orderId={order?.orderId}
              admin={admin} // Convert string to boolean
            />
          </div>
        </div>
      </main>
    </Suspense>
  );
};

export default OrderDetails;
