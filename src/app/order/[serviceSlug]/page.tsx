// Parent Component: OrderForm.tsx
"use client"
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db as database, storage } from "@/lib/firebase";
import { ref, set, push } from "firebase/database";
import ResumeWritingForm from "@/components/forms/ResumeWriting";
import ResumeRevampingForm from "@/components/forms/ResumeRevamping";
import CoverLetterWritingForm from "@/components/forms/CoverLetter";
import LinkedInProfileOptimizationForm from "@/components/forms/LinkedInProfileOptimization";
import JobApplicationAssistanceForm from "@/components/forms/JobApplicationAssistance";
import handleFileChange from "@/utils/orderUtils";

type OrderFormProps = {
  params: {
    serviceSlug: string;
  };
};

const formComponents: { [key: string]: React.FC<any> } = {
  resume_writing: ResumeWritingForm,
  resume_revamping: ResumeRevampingForm,
  cover_letter_writing: CoverLetterWritingForm,
  linkedin_profile_optimization: LinkedInProfileOptimizationForm,
  job_application_assistance: JobApplicationAssistanceForm,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handleFileChange(e, {
      storage,          // Your storage instance
      setLoading,
      setError,
      setFormData,
    });
  };

  const handleSubmit = async (formData: any) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const orderPath = `/orders/${serviceSlug}/${userId}`;
      const newOrderIdRef = push(ref(database, orderPath));
      const newOrderId = newOrderIdRef.key || null;
  
      if (newOrderId) {
        const orderData = {
          serviceTitle: serviceSlug,
          pricingCategories: categories.length === 1 ? categories[0] : categories,
          price: amount,
          timestamp: new Date().toISOString(),
          paymentStatus: "pending",
          completed: false,
          ...formData, // This will include all fields like `contact`, `education`, `experience`, `skills`, `references`
        };
  
        try {
          await set(ref(database, `${orderPath}/${newOrderId}`), orderData);
          router.push(`/payment?orderId=${newOrderId}&amount=${amount}&serviceTitle=${serviceSlug}&userId=${userId}`);
        } catch (error) {
          setError("Error saving order data. Please try again.");
        }
      }
    }
  };


  if (!SelectedForm) {
    return <div className="text-center text-red-600">Service not found</div>;
  }

  return (
    <main className="max-w-screen-lg mx-auto ">
      <SelectedForm
        onChange={handleChange}
        formData={formData}
        onSubmit={handleSubmit}
        categories={categories}
        amount={amount}
        loading={loading}
        error={error}
        setFormData={setFormData}
      />
    </main>
  );
};

export default OrderForm;
