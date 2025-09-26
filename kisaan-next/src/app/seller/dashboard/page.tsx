"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import DashboardStats from "@/components/seller/DashboardStats";
import StoreManagement from "@/components/seller/StoreManagement";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Store {
  uuid: string;
  name: string;
  description?: string;
  slug: string;
  created_at?: string;
}

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    stores: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "seller")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "seller") {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const storesResponse = await api.getMyStores();
      const storesData = Array.isArray(storesResponse?.data)
        ? storesResponse.data
        : Array.isArray(storesResponse)
        ? storesResponse
        : [];

      setStores(storesData);

      let totalProducts = 0;
      for (const store of storesData) {
        try {
          const productsResponse = await api.searchProducts({
            store_id: store.uuid,
          });
          const products = Array.isArray(productsResponse?.data)
            ? productsResponse.data
            : Array.isArray(productsResponse)
            ? productsResponse
            : [];
          totalProducts += products.length;
        } catch (error) {
          console.error(
            `Failed to load products for store ${store.uuid}:`,
            error
          );
        }
      }

      setStats({
        stores: storesData.length,
        products: totalProducts,
        orders: 0, // TODO: Implement orders API
        revenue: 0, // TODO: Calculate from orders
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickActions = (action: string) => {
    switch (action) {
      case "create-store":
        router.push("/seller/stores/new");
        break;
      case "add-product":
        if (stores.length > 0) {
          router.push(`/seller/stores/${stores[0].uuid}/products/new`);
        } else {
          router.push("/seller/stores/new");
        }
        break;
      case "view-orders":
        router.push("/seller/orders");
        break;
      case "analytics":
        router.push("/seller/analytics");
        break;
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="page-header">
        <div className="container mx-auto px-6">
          <div className="page-header-content">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex-1">
                <h1 className="page-title">Seller Dashboard</h1>
                <p className="page-subtitle">Welcome back, {user?.name}! 👋</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="icon icon-sm mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Active seller account
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/seller/stores')}
                  className="btn-outline btn-md inline-flex items-center gap-2"
                >
                  <svg className="icon icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Manage Stores
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">

        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Enhanced Quick Actions */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-500">Get started with common tasks</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleQuickActions("create-store")}
                className="group relative p-6 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="icon icon-lg text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-700">Create Store</h3>
                    <p className="text-xs text-primary-600 mt-1">Start your new store</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickActions("add-product")}
                disabled={stores.length === 0}
                className="group relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="icon icon-lg text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700">Add Product</h3>
                    <p className="text-xs text-blue-600 mt-1">{stores.length === 0 ? 'Create store first' : 'List new items'}</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickActions("view-orders")}
                className="group relative p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="icon icon-lg text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-green-700">View Orders</h3>
                    <p className="text-xs text-green-600 mt-1">Manage sales</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickActions("analytics")}
                className="group relative p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="icon icon-lg text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-700">Analytics</h3>
                    <p className="text-xs text-purple-600 mt-1">View insights</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Store Management */}
        <StoreManagement stores={stores} onStoreSelect={setSelectedStore} />
      </div>
    </div>
  );
}
