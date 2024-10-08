"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PayPalButton from "@/components/PayPalButton";
import MpesaButton from "@/components/MpesaButton";
import { db, ref, get } from "@/lib/firebase"; // Ensure you have a Firebase client setup

const PaymentPageComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") || "";
  const amount = parseFloat(searchParams.get("amount") || "0");
  const serviceTitle = searchParams.get("serviceTitle") || "Default Service Title";
  const userId = searchParams.get("userId") || "DefaultUserId";

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const handleSuccess = (details: any) => {
    console.log("Payment initiated", details);
    pollPaymentStatus();
  };

  const handleError = (error: any) => {
    console.error("Payment error", error);
  };

  const pollPaymentStatus = () => {
    const orderPath = `orders/${serviceTitle}/${userId}/${orderId}`;
    const interval = setInterval(async () => {
      const snapshot = await get(ref(db, orderPath));
      const orderData = snapshot.val();
      if (orderData && orderData.transactionCode) {
        setPaymentStatus("success");
        clearInterval(interval);
        router.push("/profile");
      }
    }, 3000);
  };

  useEffect(() => {
    if (paymentStatus === "success") {
      router.push("/profile");
    }
  }, [paymentStatus, router]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-16 min-h-screen bg-cyan-100">
      <div className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-teal-800 mb-6 text-center">Complete Your Payment</h2>
        <p className="text-gray-800 font-semibold text-lg sm:text-xl lg:text-2xl mb-6">
          Order ID: {orderId}
        </p>
        <p className="text-gray-800 font-semibold text-lg sm:text-xl lg:text-2xl mb-6">
          Total Price: ${amount.toFixed(2)}
        </p>

        {/* Payment Buttons */}
        <div className="mt-8 flex flex-col items-center gap-8">
          <div className="flex flex-col sm:flex-row sm:justify-center gap-8 p-4 bg-white rounded-lg shadow-md w-full max-w-xl">
            <PayPalButton 
              amount={amount} 
              orderId={orderId} 
              serviceTitle={serviceTitle} 
              userId={userId} 
              onSuccess={handleSuccess}
              onError={handleError}
              className="flex-1"
            />
            <MpesaButton 
              amount={amount} 
              orderId={orderId} 
              serviceTitle={serviceTitle} 
              userId={userId} 
              onSuccess={handleSuccess}
              onError={handleError}
              className="flex-1"
            />
          </div>
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
