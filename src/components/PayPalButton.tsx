"use client";
import React from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

type PayPalButtonProps = {
  amount: number;
  currency?: string;
  orderId: string;
  serviceTitle: string;
  userId: string;
  onSuccess: (details: any) => void;
  onError?: (err: any) => void;
  className?: string; // Add className prop
};

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = "USD",
  orderId,
  serviceTitle,
  userId,
  onSuccess,
  onError,
  className = "", // Default to empty string if no className is provided
}) => {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

  const handleOrderUpdate = async (transactionId: string) => {
    try {
      const response = await fetch('/api/paypal/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          transactionId,
          serviceTitle,
          userId,
        }),
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to update order');
        }
      }
    } catch (error) {
      console.error('Error updating order:', error);
      if (onError) onError(error);
    }
  };

  return (
    <div className={`paypall-button-container ${className} p-2 border border-gray-300 rounded-lg shadow-md flex items-center justify-center`}>
      {isPending && <div className="text-gray-500 text-center">Loading PayPal buttons...</div>}
      {isRejected && (
        <div className="text-red-600 text-center">
          Failed to load PayPal buttons. Please try again later or contact support.
        </div>
      )}
      {isResolved && (
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "silver",
            shape: "pill",
            label: "pay",
          }}
          createOrder={async (data, actions) => {
            try {
              return await actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount.toFixed(2),
                    },
                  },
                ],
              });
            } catch (error) {
              console.error("Error creating order:", error);
              if (onError) onError(error);
              throw error;
            }
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              try {
                const details = await actions.order.capture();
                await handleOrderUpdate(data.orderID);
                onSuccess(details);
              } catch (error) {
                console.error("Error capturing order:", error);
                if (onError) onError(error);
              }
            }
          }}
          onError={(error) => {
            console.error("Payment error:", error);
            if (onError) onError(error);
          }}
        />
      )}
    </div>
  );
};

export default PayPalButton;
