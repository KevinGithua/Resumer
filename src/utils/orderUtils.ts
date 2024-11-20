// orderUtils.ts

import { ref, get, update } from "firebase/database";
import { storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Define types for Order and User
export type Order = {
  serviceTitle: string;
  orderId: string;
  userUid: string;
  timestamp: string;
  status: string;
  finishedWork?: string;
  completed: boolean;
  paymentStatus: string;

  // New fields for Resume Revamping
  contact: {
    fullName: string;
    email: string;
    phone: string;
  };
  education: {
    institution: string;
    degree: string;
    startYear: string;
    endYear: string;
  }[];
  experience: {
    company: string;
    title: string;
    startYear: string;
    endYear: string;
    description: string;
  }[];
  skills: string[];
  references: {
    name: string;
    relationship: string;
    contact: string;
  }[];
  resumeFile: File | null; // Store the resume file object
  additionalNotes: string;

  // Optional for flexibility
  [key: string]: any;
};

export type User = {
  name: string;
  email: string;
  phoneNumber: string;
};

// Extract filename from a URL or File object with enhanced style
export const extractFilenameFromUrl = (file: File | string | null): string => {
  if (!file) return "No file provided";

  let filename = "";
  
  if (typeof file === "string") {
    // Decode URL-encoded string (e.g., %20 -> space)
    filename = decodeURIComponent(file.split('/').pop()?.split('?')[0] || "No file provided");
  } else {
    // If it's a File object, directly extract the name
    filename = file.name;
  }

  return filename;
};

// Fetch order details by orderId
export const fetchOrderDetails = async (orderId: string, database: any): Promise<Order | null> => {
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
          return true;
        }
        return false;
      });
      return !!foundOrder;
    });
    return foundOrder;
  }
  return null;
};

// Fetch user details by userUid
export const fetchUserDetails = async (userUid: string, database: any): Promise<User | null> => {
  const userSnapshot = await get(ref(database, `/users/${userUid}`));
  if (userSnapshot.exists()) {
    return userSnapshot.val();
  }
  return { name: "Unknown", email: "Unknown", phoneNumber: "Unknown" };
};

// Update order
export const updateOrder = async (order: Order, updates: Partial<Order>, database: any) => {
  const orderRef = ref(database, `/orders/${order.serviceTitle}/${order.userUid}/${order.orderId}`);
  await update(orderRef, updates);
};

// Upload file to storage and update order
export const uploadFile = async (file: File, orderId: string, order: Order, database: any) => {
  const fileStorageRef = storageRef(storage, `orders/${orderId}/${file.name}`);
  await uploadBytes(fileStorageRef, file);
  const downloadURL = await getDownloadURL(fileStorageRef);
  await updateOrder(order, { finishedWork: downloadURL, status: "Completed" }, database);
};

// Submit a link for the order
export const submitLink = async (link: string, order: Order, database: any) => {
  await updateOrder(order, { finishedWork: link }, database);
};

// Format timestamp for display
export const formatTimestamp = (timestamp: string) => {
  if (!timestamp || timestamp === "No Date Provided") return "No Date Provided";
  const date = new Date(timestamp);
  return date.toLocaleString();
};
