"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db, ref, get } from "@/lib/firebase";
import PaymentButtons from "@/components/PaymentButtons";

const PaymentPageComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") || "";
  const amount = parseFloat(searchParams.get("amount") || "0");
  const serviceTitle = searchParams.get("serviceTitle") || "Default Service Title";
  const userId = searchParams.get("userId") || "DefaultUserId";

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSuccess = async (details: any) => {
    console.log("Payment initiated", details);
    // Fetch the payment status directly after initiating payment
    const orderPath = `orders/${serviceTitle}/${userId}/${orderId}`;
    setLoading(true);

    try {
      const snapshot = await get(ref(db, orderPath));
      const orderData = snapshot.val();

      if (orderData) {
        const status = orderData.paymentStatus; // Assuming paymentStatus is the common field
        if (status === "complete") {
          setPaymentStatus("complete");
        } else {
          setPaymentStatus("pending");
        }
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      setPaymentStatus("error"); // Set error status to inform user
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: any) => {
    console.error("Payment error", error);
    // Optionally, provide user feedback on error
  };

  useEffect(() => {
    if (paymentStatus === "complete") {
      router.push("/profile");
    }
  }, [paymentStatus, router]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-16 min-h-screen bg-gradient-to-r from-cyan-100 to-blue-200">
      <div className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-teal-800 mb-6 text-center">Complete Your Payment</h2>
        <p className="text-gray-800 font-semibold text-lg sm:text-xl lg:text-2xl mb-6">
          Order ID: {orderId}
        </p>
        <p className="text-gray-800 font-semibold text-lg sm:text-xl lg:text-2xl mb-6">
          Total Price: ${amount.toFixed(2)}
        </p>
        {loading && <p className="text-gray-600">Checking payment status...</p>}
        {paymentStatus === "error" && <p className="text-red-500">Error fetching payment status. Please try again.</p>}
        <div className="mt-8 flex flex-col items-center gap-8">
          <PaymentButtons
            amount={amount}
            orderId={orderId}
            serviceTitle={serviceTitle}
            userId={userId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      </div>
    </div>
  );
};

const PaymentPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading payment information...</div>}>
      <PaymentPageComponent />
    </Suspense>
  );
};

export default PaymentPage;
