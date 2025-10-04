"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import DashboardStats from "@/components/seller/DashboardStats";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import toast from "react-hot-toast";

interface Store {
  uuid: string;
  name: string;
  description?: string;
  slug: string;
  created_at?: string;
}

export default function StoreSpecificDashboard() {
  const [stats, setStats] = useState({
    stores: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const storeSlug = params?.slug as string;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "seller")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "seller" && storeSlug) {
      loadStoreData();
    }
  }, [user, authLoading, router, storeSlug]);

  const loadStoreData = async () => {
    try {
      setLoading(true);

      // Get all user's stores
      const storesResponse = await api.getMyStores();
      const storesData = Array.isArray(storesResponse?.data)
        ? storesResponse.data
        : [];

      // Find the store matching the slug
      const store = storesData.find((s: Store) => s.slug === storeSlug);

      if (!store) {
        toast.error("Store not found");
        router.push("/seller/stores");
        return;
      }

      setCurrentStore(store);

      // Load products for this store
      let totalProducts = 0;
      try {
        const productsResponse = await api.searchProducts({
          store_id: store.uuid,
        });
        const products = Array.isArray(productsResponse?.data)
          ? productsResponse.data
          : [];
        totalProducts = products.length;
      } catch (error) {
        console.error(`Failed to load products:`, error);
      }

      setStats({
        stores: 1,
        products: totalProducts,
        orders: 0, // TODO: Implement orders API
        revenue: 0, // TODO: Calculate from orders
      });
    } catch (error) {
      console.error("Failed to load store data:", error);
      toast.error("Failed to load store data");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickActions = (action: string) => {
    if (!currentStore) return;

    switch (action) {
      case "add-product":
        router.push("/seller/products");
        break;
      case "view-orders":
        router.push("/seller/orders");
        break;
      case "manage-categories":
        router.push("/seller/categories");
        break;
      case "store-settings":
        router.push(`/seller/stores/${currentStore.uuid}`);
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

  if (!currentStore) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="page-header">
        <div className="container mx-auto px-6">
          <div className="page-header-content">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex-1">
                <h1 className="page-title">{currentStore.name}</h1>
                <p className="page-subtitle">Welcome back, {user?.name}! 👋</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="icon icon-sm mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Store Dashboard
                  </div>
                  <div className="text-sm text-gray-400">
                    /seller/{currentStore.slug}
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
                  All Stores
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
              <p className="text-sm text-gray-500">Manage your store</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleQuickActions("add-product")}
                className="group relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="icon icon-lg text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-700">Add Product</h3>
                    <p className="text-xs text-blue-600 mt-1">List new items</p>
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
                onClick={() => handleQuickActions("manage-categories")}
                className="group relative p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="icon icon-lg text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-700">Categories</h3>
                    <p className="text-xs text-purple-600 mt-1">Organize products</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickActions("store-settings")}
                className="group relative p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="icon icon-lg text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-orange-700">Settings</h3>
                    <p className="text-xs text-orange-600 mt-1">Configure store</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <p className="text-gray-900">{currentStore.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                <p className="text-gray-900">/seller/{currentStore.slug}</p>
              </div>
              {currentStore.description && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900">{currentStore.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
