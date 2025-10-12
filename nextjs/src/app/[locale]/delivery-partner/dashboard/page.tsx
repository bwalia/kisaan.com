"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface DashboardStats {
  active_deliveries: number;
  todays_earnings: number;
  success_rate: number;
  average_rating: number;
  total_deliveries: number;
  current_capacity: number;
  max_capacity: number;
}

interface Assignment {
  id: number;
  uuid: string;
  order_number: string;
  store_name: string;
  status: string;
  delivery_fee: number;
  pickup_address: string;
  delivery_address: string;
  estimated_delivery_time: string;
  tracking_number: string;
}

interface DeliveryRequest {
  uuid: string;
  order_number: string;
  store_name: string;
  proposed_fee: number;
  message: string;
  created_at: string;
}

export default function DeliveryPartnerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
  const [pendingRequests, setPendingRequests] = useState<DeliveryRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "requests" | "completed">("active");

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
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, assignmentsResponse, requestsResponse] = await Promise.all([
        api.request("/api/v2/delivery-partner/dashboard", { method: "GET" }),
        api.request("/api/v2/delivery-partner/assignments?status=active", { method: "GET" }),
        api.request("/api/v2/delivery-requests/partner?status=pending", { method: "GET" })
      ]);

      // Safely set stats with defaults
      setStats(statsResponse || {
        active_deliveries: 0,
        todays_earnings: 0,
        success_rate: 0,
        average_rating: 0,
        current_capacity: 0,
        max_capacity: 0,
        total_deliveries: 0,
        successful_deliveries: 0,
        total_earnings: 0,
        is_verified: false,
        is_active: true
      });

      // Ensure assignments is always an array
      const assignments = assignmentsResponse?.assignments;
      setActiveAssignments(Array.isArray(assignments) ? assignments : []);

      // Ensure requests is always an array
      const requests = requestsResponse?.requests;
      setPendingRequests(Array.isArray(requests) ? requests : []);
    } catch (error: any) {
      console.error("Dashboard load error:", error);
      toast.error(error.message || "Failed to load dashboard");
      // Set safe defaults on error
      setStats({
        active_deliveries: 0,
        todays_earnings: 0,
        success_rate: 0,
        average_rating: 0,
        current_capacity: 0,
        max_capacity: 0,
        total_deliveries: 0,
        successful_deliveries: 0,
        total_earnings: 0,
        is_verified: false,
        is_active: true
      });
      setActiveAssignments([]);
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestUuid: string) => {
    try {
      await api.request(`/api/v2/delivery-requests/${requestUuid}/accept`, {
        method: "PUT"
      });
      toast.success("Request accepted!");
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || "Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestUuid: string) => {
    try {
      await api.request(`/api/v2/delivery-requests/${requestUuid}/reject`, {
        method: "PUT"
      });
      toast.success("Request rejected");
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject request");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      picked_up: "bg-purple-100 text-purple-800",
      in_transit: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Delivery Partner Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your deliveries and earnings</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Deliveries</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.active_deliveries}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Earnings</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    ₹{stats.todays_earnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.success_rate}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.current_capacity}/{stats.max_capacity}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/delivery-partner/available-orders"
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-medium">Find Orders</span>
            </Link>

            <Link
              href="/delivery-partner/profile"
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">My Profile</span>
            </Link>

            <Link
              href="/delivery-partner/earnings"
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Earnings</span>
            </Link>

            <Link
              href="/delivery-partner/reviews"
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm font-medium">Reviews</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("active")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "active"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Active Deliveries ({Array.isArray(activeAssignments) ? activeAssignments.length : 0})
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "requests"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pending Requests ({Array.isArray(pendingRequests) ? pendingRequests.length : 0})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "completed"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Completed
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Active Deliveries Tab */}
            {activeTab === "active" && (
              <div className="space-y-4">
                {!Array.isArray(activeAssignments) || activeAssignments.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500">No active deliveries</p>
                    <Link href="/delivery-partner/available-orders" className="text-green-600 hover:text-green-700 mt-2 inline-block">
                      Find available orders →
                    </Link>
                  </div>
                ) : (
                  activeAssignments.map((assignment) => (
                    <div key={assignment.uuid} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Order #{assignment.order_number}</h3>
                          <p className="text-sm text-gray-600">{assignment.store_name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                          {assignment.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Pickup</p>
                          <p className="text-sm text-gray-800">{assignment.pickup_address}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Delivery</p>
                          <p className="text-sm text-gray-800">{assignment.delivery_address}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">Fee: <span className="font-semibold text-green-600">₹{assignment.delivery_fee}</span></span>
                          <span className="text-xs text-gray-500">Track: {assignment.tracking_number}</span>
                        </div>
                        <Link
                          href={`/delivery-partner/assignments/${assignment.uuid}`}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Requests Tab */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                {!Array.isArray(pendingRequests) || pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500">No pending requests</p>
                  </div>
                ) : (
                  pendingRequests.map((request) => (
                    <div key={request.uuid} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Order #{request.order_number}</h3>
                          <p className="text-sm text-gray-600">{request.store_name}</p>
                        </div>
                        <span className="text-lg font-semibold text-green-600">₹{request.proposed_fee}</span>
                      </div>

                      {request.message && (
                        <p className="text-sm text-gray-700 mb-4 p-3 bg-gray-50 rounded">
                          {request.message}
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Requested {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRejectRequest(request.uuid)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAcceptRequest(request.uuid)}
                            className="btn-primary"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Completed Tab */}
            {activeTab === "completed" && (
              <div className="text-center py-12">
                <p className="text-gray-500">Completed deliveries will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
