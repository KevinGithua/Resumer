// Parent Component: OrderForm.tsx
"use client"
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db as database, storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref, set, push } from "firebase/database";
import ResumeWritingForm from "@/components/forms/ResumeWriting";
import ResumeRevampingForm from "@/components/forms/ResumeRevamping";
import CoverLetterWritingForm from "@/components/forms/CoverLetter";
import LinkedInProfileOptimizationForm from "@/components/forms/LinkedInProfileOptimization";
import JobApplicationAssistanceForm from "@/components/forms/JobApplicationAssistance";

type OrderFormProps = {
  params: {
    serviceSlug: string;
  };
};

const formComponents: { [key: string]: React.FC<any> } = {
  resumewriting: ResumeWritingForm,
  resumerevamping: ResumeRevampingForm,
  coverletterwriting: CoverLetterWritingForm,
  linkedinprofileoptimization: LinkedInProfileOptimizationForm,
  jobapplicationassistance: JobApplicationAssistanceForm,
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

  const SelectedForm = formComponents[serviceSlug];

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));

    if (files && files[0]) {
      const file = files[0];
      const fileRef = storageRef(storage, `orders/${file.name}`);

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
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = Object.keys(formData);
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in the required field: ${field}`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const orderPath = `/orders/${serviceSlug}/${userId}`;
        const newOrderIdRef = push(ref(database, orderPath));
        const newOrderId = newOrderIdRef.key || null;

        if (newOrderId) {
          const orderData: any = {
            serviceTitle: serviceSlug,
            pricingCategories: categories.length === 1 ? categories[0] : categories,
            price: amount,
            timestamp: new Date().toISOString(),
            paymentStatus: "pending",
            completed: false,
            ...formData,
          };

          try {
            await set(ref(database, `${orderPath}/${newOrderId}`), orderData);
            router.push(`/payment?orderId=${newOrderId}&amount=${amount}&serviceTitle=${serviceSlug}&userId=${userId}`);
          } catch (error) {
            setError("Error saving order data. Please try again.");
          }
        }
      }
    }
  };

  if (!SelectedForm) {
    return <div className="text-center text-red-600">Service not found</div>;
  }

  return (
    <div className="px-6 py-10 min-h-screen bg-cyan-100">
      <SelectedForm
        onChange={handleChange}
        formData={formData}
        onSubmit={handleSubmit}
        categories={categories}
        amount={amount}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default OrderForm;
