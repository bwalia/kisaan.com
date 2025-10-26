"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Assignment {
  id: number;
  uuid: string;
  order_id: number;
  order_number: string;
  order_uuid: string;
  status: "pending" | "accepted" | "picked_up" | "in_transit" | "delivered" | "failed" | "cancelled";
  order_status: string;
  delivery_fee: number;
  tracking_number: string;
  total_amount: number;
  distance_km?: number;

  // Delivery details
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_postal_code: string;
  customer_name: string;
  delivery_latitude?: number;
  delivery_longitude?: number;

  // Store details
  store_name: string;
  store_slug: string;
  store_phone: string;

  // Customer details
  customer_email?: string;
  customer_phone?: string;
  customer_first_name?: string;
  customer_last_name?: string;

  // Timestamps
  created_at: string;
  actual_pickup_time?: string;
  actual_delivery_time?: string;
  estimated_delivery_time?: string;

  // Notes
  pickup_instructions?: string;
  delivery_instructions?: string;
  customer_notes?: string;
  notes?: string;
}

export default function AssignmentDetailsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.assignmentId as string;

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofNotes, setProofNotes] = useState("");

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
      loadAssignment();
    }
  }, [user, authLoading, router, assignmentId]);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      const response = await api.getDeliveryAssignment(assignmentId);
      setAssignment(response.assignment);
    } catch (error: any) {
      console.error("Failed to load assignment:", error);
      toast.error(error.message || "Failed to load assignment details");
      router.push("/delivery-partner/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string, notes?: string) => {
    if (!assignment) return;

    try {
      setUpdating(true);
      const response = await api.updateAssignmentStatus(assignmentId, { status: newStatus, notes });
      toast.success(response.message || `Status updated to ${newStatus}`);
      await loadAssignment(); // Reload to get updated data
      if (showProofModal) setShowProofModal(false);
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted": return "bg-blue-100 text-blue-800 border-blue-200";
      case "picked_up": return "bg-purple-100 text-purple-800 border-purple-200";
      case "in_transit": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "failed": return "bg-red-100 text-red-800 border-red-200";
      case "cancelled": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAvailableActions = () => {
    if (!assignment) return [];

    const actions: { label: string; status: string; color: string; icon: string }[] = [];

    switch (assignment.status) {
      case "accepted":
        actions.push({
          label: "Mark as Picked Up",
          status: "picked_up",
          color: "bg-purple-600 hover:bg-purple-700",
          icon: "📦"
        });
        actions.push({
          label: "Cancel",
          status: "cancelled",
          color: "bg-gray-600 hover:bg-gray-700",
          icon: "❌"
        });
        break;
      case "picked_up":
        actions.push({
          label: "Start Delivery (In Transit)",
          status: "in_transit",
          color: "bg-indigo-600 hover:bg-indigo-700",
          icon: "🚚"
        });
        break;
      case "in_transit":
        actions.push({
          label: "Mark as Delivered",
          status: "delivered",
          color: "bg-green-600 hover:bg-green-700",
          icon: "✅"
        });
        actions.push({
          label: "Report Failure",
          status: "failed",
          color: "bg-red-600 hover:bg-red-700",
          icon: "⚠️"
        });
        break;
    }

    return actions;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignment details...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Assignment not found</p>
          <Link href="/delivery-partner/dashboard" className="mt-4 text-green-600 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const availableActions = getAvailableActions();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/delivery-partner/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Delivery Assignment Details
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Order #{assignment.order_number} • Tracking: {assignment.tracking_number}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(assignment.status)}`}>
                {assignment.status.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            {availableActions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableActions.map((action) => (
                    <button
                      key={action.status}
                      onClick={() => {
                        if (action.status === "delivered") {
                          setShowProofModal(true);
                        } else {
                          updateStatus(action.status);
                        }
                      }}
                      disabled={updating}
                      className={`${action.color} text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                      <span>{action.icon}</span>
                      {updating ? "Updating..." : action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium text-gray-900">
                    {assignment.customer_name || `${assignment.customer_first_name} ${assignment.customer_last_name}`.trim() || "N/A"}
                  </p>
                  {assignment.customer_phone && (
                    <a href={`tel:${assignment.customer_phone}`} className="text-sm text-green-600 hover:underline">
                      {assignment.customer_phone}
                    </a>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-medium text-gray-900">{assignment.delivery_address}</p>
                  <p className="text-sm text-gray-600">
                    {assignment.delivery_city}, {assignment.delivery_state} {assignment.delivery_postal_code}
                  </p>
                  {assignment.delivery_latitude && assignment.delivery_longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${assignment.delivery_latitude},${assignment.delivery_longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline mt-1 inline-block"
                    >
                      Open in Google Maps →
                    </a>
                  )}
                </div>

                {assignment.delivery_instructions && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Delivery Instructions:</p>
                    <p className="text-sm text-yellow-700 mt-1">{assignment.delivery_instructions}</p>
                  </div>
                )}

                {assignment.customer_notes && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Customer Notes:</p>
                    <p className="text-sm text-blue-700 mt-1">{assignment.customer_notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pickup Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pickup Information</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Store</p>
                  <p className="font-medium text-gray-900">{assignment.store_name}</p>
                  {assignment.store_phone && (
                    <a href={`tel:${assignment.store_phone}`} className="text-sm text-green-600 hover:underline">
                      {assignment.store_phone}
                    </a>
                  )}
                </div>

                {assignment.pickup_instructions && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">Pickup Instructions:</p>
                    <p className="text-sm text-purple-700 mt-1">{assignment.pickup_instructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Timeline</h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Assignment Accepted</p>
                    <p className="text-xs text-gray-600">{new Date(assignment.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {assignment.actual_pickup_time && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Picked Up from Store</p>
                      <p className="text-xs text-gray-600">{new Date(assignment.actual_pickup_time).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {assignment.actual_delivery_time && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Delivered to Customer</p>
                      <p className="text-xs text-gray-600">{new Date(assignment.actual_delivery_time).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {assignment.estimated_delivery_time && !assignment.actual_delivery_time && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                      <p className="text-xs text-gray-400">{new Date(assignment.estimated_delivery_time).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order Total</span>
                  <span className="font-semibold text-gray-900">₹{assignment.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-green-600">₹{assignment.delivery_fee.toFixed(2)}</span>
                </div>
                {assignment.distance_km && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Distance</span>
                    <span className="text-sm text-gray-900">{assignment.distance_km.toFixed(2)} km</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Delivery Status</p>
                  <p className="font-medium text-gray-900 capitalize">{assignment.status.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <p className="font-medium text-gray-900 capitalize">{assignment.order_status.replace("_", " ")}</p>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-xs text-blue-700 mb-3">
                Contact support if you encounter any issues with this delivery.
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Proof of Delivery Modal */}
      {showProofModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mark as Delivered</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Notes (Optional)
              </label>
              <textarea
                value={proofNotes}
                onChange={(e) => setProofNotes(e.target.value)}
                placeholder="Add any notes about the delivery..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={4}
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowProofModal(false)}
                disabled={updating}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus("delivered", proofNotes || undefined)}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {updating ? "Confirming..." : "Confirm Delivery"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
