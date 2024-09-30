"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use this import for Next.js 13 app directory
import ChatComponent from "@/components/ChatComponent";
import { getAuth } from "firebase/auth";
import { fetchOrderDetails, fetchUserDetails, uploadFile, submitLink, updateOrder, Order, User } from "@/utils/orderUtils";
import { db as database } from "@/lib/firebase";

interface OrderDetailsProps {
  params: { id: string; admin?: string }; // Accept params with an optional admin field
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ params }) => {
  const { id, admin } = params; // Extract the order ID and admin status from params
  const [order, setOrder] = useState<Order | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserName, setCurrentUserName] = useState<string>("");

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!id) return; // Guard clause for undefined id

      const orderData = await fetchOrderDetails(id, database);
      setOrder(orderData);
      if (orderData) {
        const userData = await fetchUserDetails(orderData.userUid, database);
        setUserDetails(userData);
      }
    };

    fetchOrderData();
  }, [id]); // Dependency array includes id

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (admin) {
      // Set default username based on admin status
      setCurrentUserName(admin === "true" ? "Support" : "Client");
    } else if (user) {
      fetchCurrentUserName(user.uid);
    }
  }, [admin]);

  const fetchCurrentUserName = async (userId: string) => {
    const userData = await fetchUserDetails(userId, database);
    setCurrentUserName(userData?.name || "Unknown");
  };

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
      setOrder(prevOrder => (prevOrder ? { ...prevOrder, completed: true, status: "Completed" } : prevOrder));
    }
  };

  if (!order) {
    return <div className="p-6">Order details not found.</div>;
  }

  const requiresFileUpload = ["Resume Writing", "Resume Revamping", "Cover Letter Writing"].includes(order.serviceTitle);
  const requiresLink = ["LinkedIn Profile Optimization", "Job Application Assistance"].includes(order.serviceTitle);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-2 sm:p-4 lg:p-2 bg-cyan-100 min-h-screen text-gray-900">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4">Order Details</h2>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md flex-1">
            <div className="mb-6 space-y-4">
              <div className="space-y-2 font-semibold">
                <p><span className="text-cyan-800">User UID:</span> {order.userUid}</p>
                <p><span className="text-cyan-800">Name:</span> {userDetails?.name || "Loading..."}</p>
                <p><span className="text-cyan-800">Email:</span> {userDetails?.email || "Loading..."}</p>
                <p><span className="text-cyan-800">Phone Number:</span> {userDetails?.phoneNumber || "Loading..."}</p>
                {admin && <p><span className="text-cyan-800">Admin:</span> {admin === "true" ? "Yes" : "No"}</p>}
              </div>
              <div className="pl-6 space-y-2">
                <p><strong className="text-teal-700">Order ID:</strong> {order.orderId}</p>
                <p><strong className="text-teal-700">Order Status:</strong> {order.status}</p>
                {Object.entries(order).map(([key, value]) => (
                  <p key={key}><strong className="text-teal-700">{key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, str => str.toUpperCase())}:</strong> {value}</p>
                ))}
              </div>
            </div>
            {/* Conditional Upload/Link Section */}
            {order.paymentStatus === "pending" ? (
              <p className="text-red-600 font-semibold mt-6">Order pending Payment completion</p>
            ) : !order.completed ? (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                {requiresFileUpload && (
                  <>
                    <input
                      type="file"
                      onChange={e => setFile(e.target.files?.[0] || null)}
                      className="block w-full sm:w-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                    />
                    <button onClick={handleFileUpload} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Upload File</button>
                  </>
                )}
                {requiresLink && (
                  <>
                    <input
                      type="text"
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      placeholder="Enter Link"
                      className="block w-full sm:w-auto p-2 border border-gray-300 rounded mt-4 sm:mt-0"
                    />
                    <button onClick={handleLinkSubmit} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mt-4 sm:mt-0">Submit Link</button>
                  </>
                )}
              </div>
            ) : (
              <button onClick={markAsCompleted} className="bg-blue-600 text-white py-2 px-4 rounded mt-6 hover:bg-blue-700">Mark as Completed</button>
            )}
          </div>
          <div className="mt-6 lg:mt-0 lg:w-[400px] h-[600px] overflow-y-auto rounded-lg bg-white shadow-md p-4">
          <ChatComponent userId={currentUserName} orderId={order?.orderId} otherParty={userDetails?.name || "Unknown"} />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default OrderDetails;
