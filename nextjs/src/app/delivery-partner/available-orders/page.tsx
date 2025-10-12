"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface AvailableOrder {
  id: number;
  uuid: string;
  order_number: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_postal_code: string;
  delivery_address: string;
  created_at: string;
  store_name: string;
  store_slug: string;
  store_phone: string;
}

export default function AvailableOrders() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AvailableOrder[]>([]);
  const [requestingOrder, setRequestingOrder] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AvailableOrder | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [proposedFee, setProposedFee] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && !user.role?.includes("delivery_partner")) {
      toast.error("Access denied. Delivery partner account required.");
      router.push("/");
      return;
    }

    if (user) {
      loadAvailableOrders();
    }
  }, [user, authLoading, router]);

  const loadAvailableOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getAvailableOrders();
      // Ensure orders is always an array
      const orders = response?.orders;
      setOrders(Array.isArray(orders) ? orders : []);
    } catch (error: any) {
      console.error("Failed to load available orders:", error);
      toast.error(error.message || "Failed to load available orders");
      // Set safe default on error
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDelivery = async (order: AvailableOrder) => {
    setSelectedOrder(order);
    setRequestMessage(`I would like to deliver this order. My service area covers ${order.shipping_city}, ${order.shipping_state}.`);
    // Calculate suggested fee based on order amount (you can customize this logic)
    const suggestedFee = Math.max(50, Math.ceil(order.total_amount * 0.05));
    setProposedFee(suggestedFee.toString());
  };

  const submitRequest = async () => {
    if (!selectedOrder || !proposedFee) {
      toast.error("Please enter a delivery fee");
      return;
    }

    try {
      setRequestingOrder(selectedOrder.id);
      await api.requestOrderDelivery({
        order_id: selectedOrder.id,
        proposed_fee: parseFloat(proposedFee),
        message: requestMessage
      });

      toast.success("Delivery request sent successfully!");
      setSelectedOrder(null);
      setRequestMessage("");
      setProposedFee("");
      loadAvailableOrders(); // Refresh list
    } catch (error: any) {
      console.error("Failed to request delivery:", error);
      toast.error(error.message || "Failed to send request");
    } finally {
      setRequestingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading available orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Available Orders</h1>
              <p className="text-sm text-gray-600 mt-1">
                Orders in your service area waiting for delivery partners
              </p>
            </div>
            <Link
              href="/delivery-partner/dashboard"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!Array.isArray(orders) || orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No available orders</h3>
            <p className="mt-2 text-sm text-gray-500">
              There are currently no orders in your service area. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Store:</p>
                      <p className="text-sm text-gray-600">{order.store_name}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Order Amount:</p>
                      <p className="text-lg font-bold text-green-600">₹{order.total_amount}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Delivery Location:</p>
                      <p className="text-sm text-gray-600">
                        {order.delivery_address || order.delivery_city}, {order.delivery_state}
                      </p>
                      <p className="text-xs text-gray-500">{order.delivery_postal_code}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Pickup From:</p>
                      <p className="text-sm text-gray-600">{order.store_name}</p>
                      {order.store_phone && (
                        <p className="text-xs text-gray-500">Tel: {order.store_phone}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRequestDelivery(order)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Request to Deliver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Request Delivery - Order #{selectedOrder.order_number}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Delivery Fee (₹) *
                </label>
                <input
                  type="number"
                  value={proposedFee}
                  onChange={(e) => setProposedFee(e.target.value)}
                  className="input"
                  placeholder="Enter your delivery fee"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Store Owner
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="input"
                  rows={4}
                  placeholder="Add a message for the store owner..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <strong>Order Amount:</strong> ₹{selectedOrder.total_amount}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Delivery to:</strong> {selectedOrder.shipping_city}, {selectedOrder.shipping_state}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setRequestMessage("");
                  setProposedFee("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={requestingOrder !== null}
              >
                Cancel
              </button>
              <button
                onClick={submitRequest}
                disabled={requestingOrder !== null || !proposedFee}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requestingOrder === selectedOrder.id ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
