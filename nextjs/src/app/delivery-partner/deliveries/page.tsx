"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Delivery {
  id: number;
  uuid: string;
  order_id: number;
  order_number: string;
  tracking_number: string;
  status: string;
  delivery_fee: number;
  pickup_address: string;
  delivery_address: string;
  pickup_instructions?: string;
  delivery_instructions?: string;
  estimated_pickup_time?: string;
  estimated_delivery_time?: string;
  actual_pickup_time?: string;
  actual_delivery_time?: string;
  distance_km: number;
  store_name: string;
  customer_name?: string;
  customer_phone?: string;
  created_at: string;
}

export default function ActiveDeliveries() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("active");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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
      loadDeliveries();
    }
  }, [user, authLoading, router, filter]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const statusFilter = filter === "active" ? "active" : filter === "completed" ? "delivered" : undefined;
      const response = await api.getDeliveryAssignments(statusFilter);
      // Ensure assignments is always an array
      const assignments = response?.assignments;
      setDeliveries(Array.isArray(assignments) ? assignments : []);
    } catch (error: any) {
      console.error("Failed to load deliveries:", error);
      toast.error(error.message || "Failed to load deliveries");
      // Set safe default on error
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (assignmentUuid: string, newStatus: string) => {
    try {
      setUpdatingStatus(assignmentUuid);
      await api.updateAssignmentStatus(assignmentUuid, {
        status: newStatus,
        notes: `Status updated to ${newStatus}`
      });
      toast.success(`Status updated to ${newStatus}`);
      loadDeliveries();
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      picked_up: "bg-purple-100 text-purple-800",
      in_transit: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow: { [key: string]: { next: string; label: string } } = {
      pending: { next: "accepted", label: "Accept" },
      accepted: { next: "picked_up", label: "Mark as Picked Up" },
      picked_up: { next: "in_transit", label: "Start Transit" },
      in_transit: { next: "delivered", label: "Mark as Delivered" },
    };
    return statusFlow[currentStatus];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deliveries...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
              <p className="text-sm text-gray-600 mt-1">Track and manage your delivery assignments</p>
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

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "active"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "completed"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "all"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            All
          </button>
        </div>

        {/* Deliveries List */}
        {!Array.isArray(deliveries) || deliveries.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No deliveries found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {filter === "active"
                ? "You don't have any active deliveries at the moment."
                : filter === "completed"
                ? "You haven't completed any deliveries yet."
                : "No delivery assignments found."}
            </p>
            <Link
              href="/delivery-partner/available-orders"
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Find Orders to Deliver
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery.uuid} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{delivery.order_number}
                      </h3>
                      <p className="text-sm text-gray-500">Tracking: {delivery.tracking_number}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Store:</p>
                      <p className="text-sm text-gray-600">{delivery.store_name}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Delivery Fee:</p>
                      <p className="text-lg font-bold text-green-600">₹{delivery.delivery_fee}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Pickup From:</p>
                      <p className="text-sm text-gray-600">{delivery.pickup_address}</p>
                      {delivery.pickup_instructions && (
                        <p className="text-xs text-gray-500 mt-1">
                          Instructions: {delivery.pickup_instructions}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Deliver To:</p>
                      <p className="text-sm text-gray-600">{delivery.delivery_address}</p>
                      {delivery.delivery_instructions && (
                        <p className="text-xs text-gray-500 mt-1">
                          Instructions: {delivery.delivery_instructions}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Distance:</p>
                      <p className="text-sm text-gray-600">{delivery.distance_km} km</p>
                    </div>

                    {delivery.estimated_delivery_time && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Estimated Delivery:</p>
                        <p className="text-sm text-gray-600">
                          {new Date(delivery.estimated_delivery_time).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  {(delivery.actual_pickup_time || delivery.actual_delivery_time) && (
                    <div className="border-t pt-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Timeline:</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        {delivery.actual_pickup_time && (
                          <p>✓ Picked up: {new Date(delivery.actual_pickup_time).toLocaleString()}</p>
                        )}
                        {delivery.actual_delivery_time && (
                          <p>✓ Delivered: {new Date(delivery.actual_delivery_time).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {delivery.status !== "delivered" && delivery.status !== "failed" && getNextStatus(delivery.status) && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(delivery.uuid, getNextStatus(delivery.status).next)}
                        disabled={updatingStatus === delivery.uuid}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingStatus === delivery.uuid
                          ? "Updating..."
                          : getNextStatus(delivery.status).label}
                      </button>

                      <Link
                        href={`/delivery-partner/deliveries/${delivery.uuid}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        View Details
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
