"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import api from "@/lib/api";

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setError("No payment session found");
      setLoading(false);
      return;
    }

    // Process the successful payment regardless of user state
    // The backend will handle authentication via JWT token
    processPayment(sessionId);
  }, [searchParams]);

  const processPayment = async (sessionId: string) => {
    try {
      // Call webhook endpoint or confirmation endpoint
      const result = await api.confirmPayment({
        session_id: sessionId
      });

      setOrder(result);

      // Refresh cart to reflect cleared items
      if (refreshCart) {
        await refreshCart();
      }

      setLoading(false);
    } catch (error: any) {
      console.error("Failed to process payment:", error);
      setError("Failed to process your payment. Please contact support.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Processing Your Payment</h1>
          <p className="text-gray-600">Please wait while we confirm your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-800 mb-2">Payment Error</h1>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => router.push("/cart")}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-6">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
          <p className="text-green-700 text-lg">Thank you for your order. Your payment has been processed successfully.</p>
        </div>

        {order && order.orders && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>

            {order.orders.map((orderItem: any, index: number) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Order #{orderItem.order_number || orderItem.id}</span>
                  <span className="text-green-600 font-medium">Paid</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Total: ${orderItem.total_amount ? orderItem.total_amount.toFixed(2) : 'N/A'}</p>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Paid:</span>
                <span>${order.total_amount ? order.total_amount.toFixed(2) : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center space-x-4">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>A confirmation email has been sent to your email address.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}