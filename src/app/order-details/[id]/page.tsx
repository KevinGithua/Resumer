"use client";
import { Suspense, useEffect, useState } from "react";
import ChatComponent from "@/components/ChatComponent";
import { auth, db } from "@/lib/firebase";
import { ref, get} from "firebase/database";
import { db as database } from "@/lib/firebase";
import { useParams} from "next/navigation";
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
import { onAuthStateChanged } from "firebase/auth";


const OrderDetails: React.FC = () => {
  const params = useParams(); // Access dynamic route parameters
  const id = params?.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = ref(db, `admins/${currentUser.uid}`);
        const snapshot = await get(userRef);
        setIsAdmin(snapshot.exists());
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
    if (order ) {
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
  const requiresFileUpload = ["resume_writing", "resume_revamping", "cover_letter_writing"].includes(order.serviceTitle);
  const requiresLink = ["linkedin_profile_optimization", "job_application_assistance"].includes(order.serviceTitle);

  // Render specific order details based on the service title
  const renderSpecificOrderDetails = () => {
    switch (order.serviceTitle) {
      case "resume_writing":
        return <ResumeWriting order={order} />;
      case "resume_revamping":
        return <ResumeRevamping order={order} />;
      default:
        return (
          <div className="bg-gradient-to-tr from-teal-50 to-teal-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-teal-800 mb-4 flex items-center justify-center">
              Specific Order Details
            </h3>
            <div className="flex flex-col gap-2">
              {Object.entries(order)
                .filter(([key]) => ![
                  "userUid", "serviceTitle", "orderId", "status", "price", "transactionId", "timestamp", "completed", "paymentStatus", "paymentMethod"
                ].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="sm:flex gap-2">
                    <strong className="text-teal-700 text-sm font-semibold block">
                      {key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, str => str.toUpperCase())}:
                    </strong>
                    {key.includes("resumeUpload") || key.includes("existingCoverLetter") || key.includes("existingResume") || key.includes("resumeFile")  && value ? (
                      <div className="space-y-2">
                        {/* File Link */}
                        <p className="sm:flex justify-center text-sm items-center gap-2">
                          <span>File Name:</span>
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-all duration-200 ease-in-out"
                          >
                            <FiDownload className="text-lg" />
                            <span className="ml-2">{extractFilenameFromUrl(value)}</span>
                          </a>
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm ">{value || "Not specified"}</p>
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
      <main className="pt-20">
        <h2 className="text-lg sm:text-2xl font-bold mb-4">{order.serviceTitle.replace(/_/g, ' ').replace(/\b\w/g, (str) => str.toUpperCase()) }</h2>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Left Column */}
          <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 sm:p-6 lg:p-8 rounded-lg shadow-md flex-1">
            <div className="space-y-8">
              {/* User Information */}
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out max-w-full">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="text-teal-600 text-xl sm:text-2xl" />
                  <span className="ml-2 truncate">User Information</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: FaRegIdBadge, label: "UID", value: order.userUid },
                    { icon: FaUser, label: "Name", value: userDetails?.name || "Loading..." },
                    { icon: FaEnvelope, label: "Email", value: userDetails?.email || "Loading..." },
                    { icon: FaPhoneAlt, label: "Phone Number", value: userDetails?.phoneNumber || "Loading..." },
                  ].map((item, index) => (
                    <p
                      key={index}
                      className="text-sm flex items-center flex-wrap gap-x-2"
                    >
                      <item.icon className="text-teal-800 mr-2" />
                      <span className="text-teal-800 font-semibold">{item.label}:</span>
                      <span className="text-gray-700 truncate">{item.value}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-gradient-to-tr from-teal-50 to-teal-100 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out max-w-full">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaBox className="text-teal-600 text-xl sm:text-2xl" />
                  <span className="ml-2 truncate">Order Details</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Order ID", value: order.orderId },
                    { label: "Placed on", value: formatTimestamp(order.timestamp) },
                    { label: "Price", value: order.price },
                    { label: "Payment Method", value: order.paymentMethod },
                    { label: "Transaction ID", value: order.transactionId },
                  ].map((item, index) => (
                    <p
                      key={index}
                      className="text-sm flex flex-wrap gap-x-2"
                    >
                      <span className="text-teal-800 font-semibold">{item.label}:</span>
                      <span className="text-gray-700 break-words">{item.value}</span>
                    </p>
                  ))}
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
                    {requiresFileUpload && isAdmin && (
                      <div className="mt-4 flex items-center space-x-4 sm:space-x-6">
                        <input
                          type="file"
                          onChange={e => setFile(e.target.files?.[0] || null)}
                          className="block w-full sm:w-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 transition duration-200 cursor-pointer"
                        />
                        {loading ? (
                          <p className="text-gray-500 text-sm">Uploading...</p>
                        ) : (
                          <button
                            onClick={handleFileUpload}
                            className="bg-cyan-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-cyan-700 hover:shadow-lg transition duration-150"
                          >
                            Upload File
                          </button>
                        )}
                      </div>
                    )}

                    {/* Link Submission */}
                    {requiresLink && isAdmin && (
                      <div className="mt-4 flex items-center space-x-4 sm:space-x-6">
                        <input
                          type="text"
                          value={link}
                          onChange={e => setLink(e.target.value)}
                          placeholder="Enter Link"
                          className="block w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none transition duration-200"
                        />
                        {loading ? (
                          <p className="text-gray-500 text-sm">Submitting...</p>
                        ) : (
                          <button
                            onClick={handleLinkSubmit}
                            className="bg-cyan-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-cyan-700 hover:shadow-lg transition duration-150"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mark as Completed */}
                  {isAdmin && (
                    <button
                      onClick={markAsCompleted}
                      className="bg-teal-50 text-green-600 py-2 px-6 mt-6 rounded-lg shadow-md hover:bg-teal-100 hover:shadow-lg transition duration-200"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="mt-6 lg:mt-0 lg:w-[400px] h-[600px] overflow-y-auto bg-gradient-to-b from-teal-50 to-teal-100 shadow-sm rounded-lg">
            <ChatComponent userId={currentUser} orderId={order?.orderId} isAdmin={isAdmin} />
          </div>
        </div>
      </main>

    </Suspense>
  );
};

export default OrderDetails;
