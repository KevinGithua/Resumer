// src\app\order\[serviceSlug]\page.tsx
"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db as database, storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref, set, push } from "firebase/database";
import serviceFormRequirements from "@/assets/servicesData.json";

// Define types based on service data structure
type ServiceFieldType = 'text' | 'email' | 'file' | 'textarea' | 'password';

type ServiceField = {
  name: string;
  type: ServiceFieldType;
  label: string;
  required: boolean;
};

type PricingCategory = {
  category: string;
  price: number;
};

type Service = {
  title: string;
  description?: string;
  pricing?: PricingCategory[];
  fields: ServiceField[];
};

type ServiceFormRequirements = {
  services: Service[];
};

type OrderFormProps = {
  params: {
    serviceSlug: string;
  };
};

const OrderForm: React.FC<OrderFormProps> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceSlug = params.serviceSlug;
  const categories = searchParams.get("categories")?.split(",") || [];
  const amount = parseFloat(searchParams.get("price") || "0");

  // Find the service based on serviceSlug
  const selectedService: Service | undefined = (serviceFormRequirements as ServiceFormRequirements).services.find(
    (service) =>
      service.title.toLowerCase().replace(/ /g, "") ===
      serviceSlug.toLowerCase().replace(/ /g, "")
  );

  const serviceFields = selectedService ? selectedService.fields : [];

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    // Handle file upload if files are present
    if (files && files[0]) {
      const file = files[0];
      const fileRef = storageRef(storage, `orders/${file.name}`);

      try {
        setLoading(true);
        await uploadBytes(fileRef, file);
        console.log('File uploaded successfully');
        // Store the file URL in formData
        const fileUrl = await getDownloadURL(fileRef);
        setFormData((prev) => ({
          ...prev,
          [name]: fileUrl,
        }));
      } catch (uploadError) {
        setError("Error uploading file. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const validateForm = (): boolean => {
    for (const field of serviceFields) {
      if (field.required && !formData[field.name]) {
        setError(`Please fill in the required field: ${field.label}`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleProceedToPayment = async () => {
    if (validateForm()) {
      const user = auth.currentUser;
      if (user && selectedService) {
        const userId = user.uid;
        const orderPath = `/orders/${selectedService.title}/${userId}`;
        const newOrderIdRef = push(ref(database, orderPath));
        const newOrderId = newOrderIdRef.key || null;
  
        if (newOrderId) {
          const orderData: any = {
            serviceTitle: selectedService.title,
            pricingCategories: categories.length === 1 ? categories[0] : categories,
            price: amount,
            timestamp: new Date().toISOString(),
            paymentStatus: "pending",
            completed: false,
          };
  
          // Add form data to orderData
          for (const key in formData) {
            if (Object.prototype.hasOwnProperty.call(formData, key)) {
              orderData[key] = formData[key];
            }
          }
  
          try {
            await set(ref(database, `${orderPath}/${newOrderId}`), orderData);
  
            router.push(`/payment?orderId=${newOrderId}&amount=${amount}&serviceTitle=${selectedService.title}&userId=${userId}`);
          } catch (error) {
            console.error("Error saving order data:", error);
            setError("Error saving order data. Please try again.");
          }
        }
      }
    }
  };  

  if (!selectedService) {
    return <div className="text-center text-red-600">Service not found</div>;
  }

  return (
    <div className="px-6 py-10 min-h-screen bg-cyan-100">
      <form
        className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="text-2xl text-teal-800 mb-6">Order {selectedService.title}</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Selected Categories</label>
          <p className="border border-gray-300 rounded-md p-2">
            {categories.length > 0 ? categories.join(", ") : "No categories selected"}
          </p>
        </div>

        {serviceFields.map((field) => (
          <div key={field.name} className="mb-4">
            <label htmlFor={field.name} className="block text-gray-700">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={field.type !== "file" ? formData[field.name] || "" : undefined}
                onChange={handleChange}
                required={field.required}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            )}
          </div>
        ))}

        <p className="text-gray-800 font-semibold mb-6">Total Price: ${amount.toFixed(2)}</p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-white">
            Uploading your details...
          </div>
        )}

        <button
          onClick={handleProceedToPayment}
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition duration-200"
        >
          Proceed to Pay
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
