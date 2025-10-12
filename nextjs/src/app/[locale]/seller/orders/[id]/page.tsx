"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Order, OrderStatusUpdate, ORDER_STATUSES, FINANCIAL_STATUSES, FULFILLMENT_STATUSES } from "@/types/orders";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/home-utils";

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<OrderStatusUpdate>({});

  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getOrderDetails(orderId);
      setOrder(response);
    } catch (error: any) {
      console.error("Failed to load order details:", error);
      toast.error(error?.message || "Failed to load order details");
      router.push("/seller/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      await api.updateOrderStatus(order.uuid, statusUpdate);
      toast.success("Order status updated successfully");
      setShowStatusUpdate(false);
      setStatusUpdate({});
      await loadOrderDetails(); // Reload to get updated data
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      toast.error(error?.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string, type: 'status' | 'financial' | 'fulfillment') => {
    let config;
    if (type === 'status') config = ORDER_STATUSES[status as keyof typeof ORDER_STATUSES];
    else if (type === 'financial') config = FINANCIAL_STATUSES[status as keyof typeof FINANCIAL_STATUSES];
    else config = FULFILLMENT_STATUSES[status as keyof typeof FULFILLMENT_STATUSES];

    if (!config) return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">{status}</span>;

    return (
      <span className={`px-2 py-1 text-xs rounded font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access order details.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading order details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Orders
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Order {order.order_number}</h1>
              <p className="mt-1 text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => setShowStatusUpdate(true)}
              className="btn-primary"
            >
              Update Status
            </button>
          </div>
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Order Status</h3>
              {getStatusBadge(order.status, 'status')}
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Status</h3>
              {getStatusBadge(order.financial_status, 'financial')}
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Fulfillment Status</h3>
              {getStatusBadge(order.fulfillment_status, 'fulfillment')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
              </div>
              <div className="card-body p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items?.map((item) => (
                        <tr key={item.uuid}>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.product_title}
                              </div>
                              {item.variant_title && (
                                <div className="text-sm text-gray-500">
                                  Variant: {item.variant_title}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {item.sku || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {formatPrice(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">
                    {order.customer_first_name} {order.customer_last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{order.customer_email}</p>
                </div>
                {order.customer_phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{order.customer_phone}</p>
                  </div>
                )}
                {order.customer_notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer Notes</p>
                    <p className="text-sm text-gray-900">{order.customer_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm text-gray-900">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tax</span>
                  <span className="text-sm text-gray-900">{formatPrice(order.tax_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <span className="text-sm text-gray-900">{formatPrice(order.shipping_amount)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Discount</span>
                    <span className="text-sm text-green-600">-{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-base font-medium text-gray-900">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {order.shipping_address && (
            <div className="card lg:col-span-2">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Billing Address</h4>
                    {order.billing_address && (
                      <div className="text-sm text-gray-900">
                        <p>{order.billing_address.name}</p>
                        <p>{order.billing_address.address1}</p>
                        {order.billing_address.address2 && <p>{order.billing_address.address2}</p>}
                        <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}</p>
                        <p>{order.billing_address.country}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
                    <div className="text-sm text-gray-900">
                      <p>{order.shipping_address.name}</p>
                      <p>{order.shipping_address.address1}</p>
                      {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                      <p>{order.shipping_address.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Internal Notes */}
          {order.internal_notes && (
            <div className="card lg:col-span-2">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Internal Notes</h3>
              </div>
              <div className="card-body">
                <p className="text-sm text-gray-900">{order.internal_notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {showStatusUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Status
                    </label>
                    <select
                      value={statusUpdate.status || order.status}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value as any }))}
                      className="input w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={statusUpdate.financial_status || order.financial_status}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, financial_status: e.target.value as any }))}
                      className="input w-full"
                    >
                      <option value="pending">Payment Pending</option>
                      <option value="paid">Paid</option>
                      <option value="partially_paid">Partially Paid</option>
                      <option value="refunded">Refunded</option>
                      <option value="voided">Voided</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fulfillment Status
                    </label>
                    <select
                      value={statusUpdate.fulfillment_status || order.fulfillment_status}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, fulfillment_status: e.target.value as any }))}
                      className="input w-full"
                    >
                      <option value="unfulfilled">Unfulfilled</option>
                      <option value="partial">Partially Fulfilled</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internal Notes
                    </label>
                    <textarea
                      value={statusUpdate.internal_notes || order.internal_notes || ""}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, internal_notes: e.target.value }))}
                      className="input w-full resize-none"
                      rows={3}
                      placeholder="Add notes for internal reference..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowStatusUpdate(false)}
                    className="btn-ghost"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className="btn-primary"
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}