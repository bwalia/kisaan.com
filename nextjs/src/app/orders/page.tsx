"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface Order {
  uuid: string;
  order_number: string;
  status: string;
  total_price: number;
  currency: string;
  created_at: string;
  store_name: string;
  store_slug: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    product_image?: string;
  }>;
  tracking_number?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "shipped" | "delivered" | "cancelled"
  >("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getBuyerOrders();

      // Handle different response formats
      let ordersData = [];
      if (Array.isArray(response)) {
        ordersData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response?.orders && Array.isArray(response.orders)) {
        ordersData = response.orders;
      }

      setOrders(ordersData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load orders");
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleRepeatOrder = async (orderId: string) => {
    try {
      await api.repeatOrder(orderId);
      toast.success("Items added to cart");
      router.push("/cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to repeat order");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      packing: "bg-indigo-100 text-indigo-800",
      shipping: "bg-cyan-100 text-cyan-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredOrders =
    filter === "all"
      ? Array.isArray(orders)
        ? orders
        : []
      : Array.isArray(orders)
      ? orders.filter((order) => order.status === filter)
      : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {["all", "pending", "shipped", "delivered", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    filter === status
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status === "all" &&
                    ` (${Array.isArray(orders) ? orders.length : 0})`}
                  {status !== "all" &&
                    ` (${
                      Array.isArray(orders)
                        ? orders.filter((o) => o.status === status).length
                        : 0
                    })`}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't placed any orders yet"
                : `No ${filter} orders`}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.uuid}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.order_number}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {format(new Date(order.created_at), "MMM dd, yyyy")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Store:{" "}
                        <span
                          className="font-medium text-green-600 cursor-pointer hover:underline"
                          onClick={() =>
                            router.push(`/stores/${order.store_slug}`)
                          }
                        >
                          {order.store_name}
                        </span>
                      </p>
                      {order.tracking_number && (
                        <p className="text-sm text-gray-600 mt-1">
                          Tracking:{" "}
                          <span className="font-mono font-medium">
                            {order.tracking_number}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        $
                        {order.total_price
                          ? parseFloat(order.total_price.toString()).toFixed(2)
                          : "0.00"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.currency ? order.currency.toUpperCase() : "USD"}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="space-y-3">
                      {Object.keys(order.items).length &&
                        order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {item.product_image && (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {item.product_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × $
                                {parseFloat(item.price.toString()).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      {order.items && order.items.length > 2 && (
                        <p className="text-sm text-gray-600">
                          +{order.items.length - 2} more item(s)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => router.push(`/orders/${order.uuid}`)}
                      className="flex-1 sm:flex-initial bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRepeatOrder(order.uuid)}
                      className="flex-1 sm:flex-initial border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Repeat Order
                    </button>
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order.uuid)}
                        className="flex-1 sm:flex-initial border border-red-600 text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
