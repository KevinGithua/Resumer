import React from "react";
import PayPalButton from "@/components/PayPalButton";
import MpesaButton from "@/components/MpesaButton";

type PaymentButtonsProps = {
  amount: number;
  orderId: string;
  serviceTitle: string;
  userId: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  className?: string; // Add className prop
};

const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  amount,
  orderId,
  serviceTitle,
  userId,
  onSuccess,
  onError,
  className = "", // Default to empty string if no className is provided
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:justify-center gap-4 p-4 bg-white rounded-lg shadow-md ${className}`}>
      <PayPalButton 
        amount={amount} 
        orderId={orderId} 
        serviceTitle={serviceTitle} 
        userId={userId} 
        onSuccess={onSuccess}
        onError={onError}
      />
      <MpesaButton 
        amount={amount} 
        orderId={orderId} 
        serviceTitle={serviceTitle} 
        userId={userId} 
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  );
};

export default PaymentButtons;
