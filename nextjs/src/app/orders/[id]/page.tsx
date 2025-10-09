"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface OrderItem {
  product_name: string;
  product_uuid: string;
  quantity: number;
  price: number;
  product_image?: string;
  current_stock?: number;
}

interface StatusHistory {
  old_status: string;
  new_status: string;
  created_at: string;
  changed_by_name?: string;
  notes?: string;
}

interface Order {
  uuid: string;
  order_number: string;
  status: string;
  total_price: number;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  currency: string;
  created_at: string;
  store_name: string;
  store_slug: string;
  store_email?: string;
  store_phone?: string;
  shipping_address: any;
  billing_address: any;
  tracking_number?: string;
  tracking_url?: string;
  carrier?: string;
  estimated_delivery_date?: string;
  payment_amount?: number;
  card_brand?: string;
  card_last4?: string;
  receipt_url?: string;
  items: OrderItem[];
  status_history: StatusHistory[];
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getBuyerOrderDetails(orderId);
      setOrder(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      loadOrderDetails();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    }
  };

  const handleRepeatOrder = async () => {
    try {
      await api.repeatOrder(orderId);
      toast.success("Items added to cart");
      router.push("/cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to repeat order");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      accepted: "bg-blue-100 text-blue-800 border-blue-300",
      preparing: "bg-purple-100 text-purple-800 border-purple-300",
      packing: "bg-indigo-100 text-indigo-800 border-indigo-300",
      shipping: "bg-cyan-100 text-cyan-800 border-cyan-300",
      shipped: "bg-blue-100 text-blue-800 border-blue-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      refunded: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: "⏳",
      accepted: "✅",
      preparing: "👨‍🍳",
      packing: "📦",
      shipping: "🚚",
      shipped: "✈️",
      delivered: "🎉",
      cancelled: "❌",
      refunded: "💰",
    };
    return icons[status] || "📋";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <button
            onClick={() => router.push("/orders")}
            className="text-green-600 hover:underline"
          >
            Back to orders
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = ['pending', 'accepted', 'preparing', 'packing', 'shipping', 'shipped', 'delivered'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/orders")}
            className="text-green-600 hover:underline mb-4 flex items-center gap-2"
          >
            ← Back to orders
          </button>
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.order_number}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy \'at\' HH:mm')}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-lg font-semibold border-2 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            {order.status !== 'cancelled' && order.status !== 'refunded' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Order Progress</h2>
                <div className="relative">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const stepHistory = order.status_history?.find(h => h.new_status === step);

                    return (
                      <div key={step} className="flex items-start mb-8 last:mb-0">
                        {/* Timeline line */}
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`absolute left-4 top-10 w-0.5 h-16 ${
                              isCompleted ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                          />
                        )}

                        {/* Status icon */}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-green-600 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {isCompleted ? '✓' : getStatusIcon(step)}
                        </div>

                        {/* Status info */}
                        <div className="ml-4 flex-1">
                          <p className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                          </p>
                          {stepHistory && (
                            <p className="text-sm text-gray-600">
                              {format(new Date(stepHistory.created_at), 'MMM dd, yyyy HH:mm')}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tracking Information */}
            {(order.tracking_number || order.carrier) && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Tracking Information</h2>
                <div className="space-y-3">
                  {order.tracking_number && (
                    <div>
                      <p className="text-sm text-gray-600">Tracking Number</p>
                      <p className="font-mono font-semibold text-lg">{order.tracking_number}</p>
                    </div>
                  )}
                  {order.carrier && (
                    <div>
                      <p className="text-sm text-gray-600">Carrier</p>
                      <p className="font-semibold">{order.carrier}</p>
                    </div>
                  )}
                  {order.estimated_delivery_date && (
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-semibold">
                        {format(new Date(order.estimated_delivery_date), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Track Package →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="divide-y divide-gray-200">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ${parseFloat(item.price.toString()).toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${parseFloat(order.subtotal?.toString() || '0').toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${parseFloat(order.shipping_cost?.toString() || '0').toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${parseFloat(order.tax?.toString() || '0').toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${parseFloat(order.total_price.toString()).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Store Information */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Store</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-semibold text-green-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/stores/${order.store_slug}`)}
                  >
                    {order.store_name}
                  </p>
                </div>
                {order.store_email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${order.store_email}`} className="text-sm text-blue-600 hover:underline">
                      {order.store_email}
                    </a>
                  </div>
                )}
                {order.store_phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${order.store_phone}`} className="text-sm text-blue-600 hover:underline">
                      {order.store_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="text-sm text-gray-700 space-y-1">
                  {order.shipping_address.name && <p className="font-medium">{order.shipping_address.name}</p>}
                  {order.shipping_address.line1 && <p>{order.shipping_address.line1}</p>}
                  {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                  </p>
                  {order.shipping_address.country && <p>{order.shipping_address.country}</p>}
                </div>
              </div>
            )}

            {/* Payment Information */}
            {(order.card_brand || order.receipt_url) && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Payment</h2>
                <div className="space-y-3">
                  {order.card_brand && order.card_last4 && (
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium">
                        {order.card_brand.charAt(0).toUpperCase() + order.card_brand.slice(1)} •••• {order.card_last4}
                      </p>
                    </div>
                  )}
                  {order.receipt_url && (
                    <a
                      href={order.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-600 hover:underline text-sm"
                    >
                      View Receipt →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl shadow p-6 space-y-3">
              <button
                onClick={handleRepeatOrder}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Repeat Order
              </button>
              {order.status === 'pending' && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full border border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
