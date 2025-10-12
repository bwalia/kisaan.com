"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface EarningsSummary {
  total_deliveries: number;
  total_earnings: number;
  average_fee: number;
  min_fee: number;
  max_fee: number;
  period: string;
}

interface DeliveryRecord {
  uuid: string;
  tracking_number: string;
  delivery_fee: number;
  actual_pickup_time: string;
  actual_delivery_time: string;
  distance_km: number;
  order_number: string;
  order_amount: number;
  store_name: string;
}

export default function EarningsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"today" | "week" | "month" | "all">("week");
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);

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
      loadEarnings();
    }
  }, [user, authLoading, router, period]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const response = await api.getDeliveryPartnerEarnings(period);
      // Safely set summary with defaults
      setSummary(response?.summary || {
        total_deliveries: 0,
        total_earnings: 0,
        average_fee: 0,
        min_fee: 0,
        max_fee: 0,
        period: period
      });
      // Ensure deliveries is always an array
      const deliveries = response?.deliveries;
      setDeliveries(Array.isArray(deliveries) ? deliveries : []);
    } catch (error: any) {
      console.error("Failed to load earnings:", error);
      toast.error(error.message || "Failed to load earnings");
      // Set safe defaults on error
      setSummary({
        total_deliveries: 0,
        total_earnings: 0,
        average_fee: 0,
        min_fee: 0,
        max_fee: 0,
        period: period
      });
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = (p: string) => {
    const labels: { [key: string]: string } = {
      today: "Today",
      week: "This Week",
      month: "This Month",
      all: "All Time",
    };
    return labels[p] || p;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading earnings...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Earnings Report</h1>
              <p className="text-sm text-gray-600 mt-1">Track your income and performance</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          {["today", "week", "month", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`px-4 py-2 rounded-lg font-medium ${
                period === p
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {getPeriodLabel(p)}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹{summary.total_earnings.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{getPeriodLabel(period)}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Deliveries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summary.total_deliveries}
              </p>
              <p className="text-xs text-gray-500 mt-1">Completed orders</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Average Fee</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                ₹{summary.average_fee.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Per delivery</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Fee Range</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{summary.min_fee.toFixed(0)} - ₹{summary.max_fee.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Min - Max</p>
            </div>
          </div>
        )}

        {/* Delivery Records */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Delivery Records</h2>
          </div>

          {!Array.isArray(deliveries) || deliveries.length === 0 ? (
            <div className="p-8 text-center">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No earnings yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Complete deliveries to start earning money
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Store
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Fee
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deliveries.map((delivery) => (
                    <tr key={delivery.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(delivery.actual_delivery_time).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{delivery.order_number}</div>
                        <div className="text-xs text-gray-500">{delivery.tracking_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {delivery.store_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {delivery.distance_km} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ₹{delivery.order_amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-green-600">
                          ₹{delivery.delivery_fee}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Export Button */}
        {Array.isArray(deliveries) && deliveries.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                // In a real app, this would generate a CSV or PDF
                toast.success("Export feature coming soon!");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
