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
  finishedWork: string;
  finishedUrl: string;
  completed: boolean;
  paymentStatus: string;
  pricingCategories: string;
  additionalNotes: string;
  resumeFile: string;

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
  skills: {
    skill:string;
  }[];
  references: {
    name: string;
    relationship: string;
    email: string;
    phone: string;
  }[];

  companyApplyingTo: string;
  jobApplyingFor: string;

  // Optional for flexibility
  [key: string]: any;
};

export type User = {
  name: string;
  email: string;
  phoneNumber: string;
};


type HandleChangeParams = {
  storage: any; // Adjust type according to your storage instance type
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setFormData: (updateFunc: (prev: any) => any) => void; // Update 'any' based on your form data type
};

const handleFileChange = async (
e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
params: HandleChangeParams ) => {
  const { storage, setLoading, setError, setFormData } = params;
  const { name, value, files } = e.target as HTMLInputElement;

  if (files && files[0]) {
    const file = files[0];
    const fileRef = storageRef(storage, `${file.name}`);

    try {
      setLoading(true);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      setFormData((prev) => ({ ...prev, [name]: fileUrl }));
    } catch (uploadError) {
      setError("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};

export default handleFileChange;


// Extract filename from a URL or File object with enhanced style
export const extractFilenameFromUrl = (file: string ): string => {
  const filename = decodeURIComponent(file.split('/').pop()?.split('?')[0] || "No file provided");
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
export const uploadFile = async (file: File, order: Order, database: any) => {
  const fileStorageRef = storageRef(storage, `${file.name}`);
  await uploadBytes(fileStorageRef, file);
  const downloadURL = await getDownloadURL(fileStorageRef);
  await updateOrder(order, { finishedWork: downloadURL,}, database);
};

// Submit a link for the order
export const submitLink = async (link: string, order: Order, database: any) => {
  await updateOrder(order, { finishedWork: link,}, database);
};

// Format timestamp for display
export const formatTimestamp = (timestamp: string) => {
  if (!timestamp || timestamp === "No Date Provided") return "No Date Provided";
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {  // 'undefined' uses the user's locale
    dateStyle: "medium",
    timeStyle: "short"
  });
};
