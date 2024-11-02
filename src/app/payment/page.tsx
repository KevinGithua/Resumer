"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentButtons from "@/components/PaymentButtons";

const PaymentPageComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") || "";
  const amount = parseFloat(searchParams.get("amount") || "0");
  const serviceTitle = searchParams.get("serviceTitle") || "Default Service Title";
  const userId = searchParams.get("userId") || "DefaultUserId";

  const handleSuccess = () => {
    router.push("/profile");
  };

  const handleError = (error: any) => {
    console.error("Payment error", error);
  };

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
