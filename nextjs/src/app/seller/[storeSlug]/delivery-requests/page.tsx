"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface DeliveryPartner {
  id: number;
  uuid: string;
  company_name: string;
  contact_person_name: string;
  contact_person_phone: string;
  rating: number;
  total_deliveries: number;
  service_type: string;
  vehicle_types: string[];
}

interface Order {
  id: number;
  uuid: string;
  order_number: string;
  total_amount: number;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
}

interface DeliveryRequest {
  id: number;
  uuid: string;
  status: string;
  proposed_fee: number;
  message?: string;
  created_at: string;
  delivery_partner: DeliveryPartner;
  order: Order;
}

export default function DeliveryRequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [filter, setFilter] = useState<"pending" | "accepted" | "rejected" | "all">("pending");
  const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && !user.role?.includes("seller")) {
      toast.error("Access denied. Seller account required.");
      router.push("/");
      return;
    }

    if (user) {
      loadRequests();
    }
  }, [user, authLoading, router, storeSlug]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await api.getStoreDeliveryRequests(storeSlug);
      // Ensure requests is always an array
      const requestsData = response?.requests;
      setRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (error: any) {
      console.error("Failed to load delivery requests:", error);
      toast.error(error.message || "Failed to load delivery requests");
      // Set safe default on error
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestUuid: string) => {
    try {
      setProcessing(requestUuid);
      await api.acceptDeliveryRequest(requestUuid);
      toast.success("Delivery request accepted!");
      loadRequests();
    } catch (error: any) {
      console.error("Failed to accept request:", error);
      toast.error(error.message || "Failed to accept request");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestUuid: string) => {
    try {
      setProcessing(requestUuid);
      await api.rejectDeliveryRequest(requestUuid, "Not suitable for this delivery");
      toast.success("Delivery request rejected");
      loadRequests();
    } catch (error: any) {
      console.error("Failed to reject request:", error);
      toast.error(error.message || "Failed to reject request");
    } finally {
      setProcessing(null);
    }
  };

  const filteredRequests = Array.isArray(requests) ? requests.filter(req => {
    if (filter === "all") return true;
    return req.status === filter;
  }) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delivery requests...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Delivery Requests</h1>
              <p className="text-sm text-gray-600 mt-1">Manage delivery partner requests for your orders</p>
            </div>
            <Link
              href={`/seller/${storeSlug}/dashboard`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: "pending", label: "Pending", count: Array.isArray(requests) ? requests.filter(r => r.status === "pending").length : 0 },
                { key: "accepted", label: "Accepted", count: Array.isArray(requests) ? requests.filter(r => r.status === "accepted").length : 0 },
                { key: "rejected", label: "Rejected", count: Array.isArray(requests) ? requests.filter(r => r.status === "rejected").length : 0 },
                { key: "all", label: "All", count: Array.isArray(requests) ? requests.length : 0 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    filter === tab.key
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Requests List */}
        {!Array.isArray(filteredRequests) || filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No delivery requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "pending"
                ? "You don't have any pending delivery requests at the moment."
                : `No ${filter} delivery requests found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.uuid} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Left: Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{request.order.order_number}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Order Amount</p>
                          <p className="font-semibold text-gray-900">₹{request.order.total_amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Proposed Delivery Fee</p>
                          <p className="font-semibold text-green-600">₹{request.proposed_fee.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Delivery Address</p>
                        <p className="text-sm text-gray-900">
                          {request.order.delivery_address}, {request.order.delivery_city}, {request.order.delivery_state}
                        </p>
                      </div>

                      {request.message && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Message from delivery partner:</p>
                          <p className="text-sm text-gray-900 italic">"{request.message}"</p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        Requested on {new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}
                      </p>
                    </div>

                    {/* Right: Partner Info */}
                    <div className="ml-6 border-l border-gray-200 pl-6 w-80">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Delivery Partner</h4>
                        <button
                          onClick={() => setSelectedPartner(request.delivery_partner)}
                          className="text-sm text-green-600 hover:text-green-700"
                        >
                          View Profile
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{request.delivery_partner.company_name}</p>
                          <p className="text-xs text-gray-600">{request.delivery_partner.contact_person_name}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium ml-1">{request.delivery_partner.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-600">{request.delivery_partner.total_deliveries} deliveries</span>
                        </div>

                        <div>
                          <p className="text-xs text-gray-600">Service Type</p>
                          <p className="text-sm capitalize">{request.delivery_partner.service_type.replace("_", " ")}</p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-600">Vehicles</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Array.isArray(request.delivery_partner.vehicle_types) && request.delivery_partner.vehicle_types.map((vehicle) => (
                              <span key={vehicle} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                {vehicle}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {request.status === "pending" && (
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleAccept(request.uuid)}
                            disabled={processing === request.uuid}
                            className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processing === request.uuid ? "Processing..." : "Accept"}
                          </button>
                          <button
                            onClick={() => handleReject(request.uuid)}
                            disabled={processing === request.uuid}
                            className="flex-1 px-4 py-2 border border-red-300 text-red-700 text-sm rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Partner Profile Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Delivery Partner Profile</h2>
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Company Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Company Name</p>
                      <p className="font-medium">{selectedPartner.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium">{selectedPartner.contact_person_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedPartner.contact_person_phone}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Rating</p>
                      <p className="text-2xl font-bold text-yellow-600">⭐ {selectedPartner.rating.toFixed(1)}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Deliveries</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedPartner.total_deliveries}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Service Type</p>
                      <p className="text-sm font-bold text-green-600 capitalize">{selectedPartner.service_type.replace("_", " ")}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Vehicles</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedPartner.vehicle_types) && selectedPartner.vehicle_types.map((vehicle) => (
                      <span key={vehicle} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg capitalize font-medium">
                        {vehicle}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
