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
};

const PaymentButtons: React.FC<PaymentButtonsProps> = ({
  amount,
  orderId,
  serviceTitle,
  userId,
  onSuccess,
  onError,
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:justify-center gap-4 p-4 bg-white rounded-lg`}>
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
