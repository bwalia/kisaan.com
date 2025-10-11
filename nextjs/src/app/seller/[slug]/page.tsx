"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Store {
  uuid: string;
  name: string;
  description?: string;
  slug: string;
  created_at?: string;
}

interface Order {
  uuid: string;
  order_number?: string;
  status: string;
  total_amount: number;
  customer_email?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  created_at: string;
  items?: any[];
}

export default function StoreSpecificDashboard() {
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    total_revenue: 0,
    products: 0,
  });
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'preparing' | 'shipped'>('all');

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

  // Load orders when currentStore is set
  useEffect(() => {
    if (currentStore) {
      loadOrders();
    }
  }, [currentStore]);

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

      setStats(prev => ({
        ...prev,
        products: totalProducts,
      }));
    } catch (error) {
      console.error("Failed to load store data:", error);
      toast.error("Failed to load store data");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    if (!currentStore) {
      console.log("No current store, skipping order load");
      return;
    }

    try {
      setLoadingOrders(true);
      console.log("Loading orders for store:", currentStore.uuid);

      const response = await api.getStoreOrders(currentStore.uuid);
      console.log("Orders response:", response);

      // Handle different response formats
      let ordersData = [];
      if (Array.isArray(response)) {
        ordersData = response;
      } else if (Array.isArray(response?.data)) {
        ordersData = response.data;
      } else if (response?.orders && Array.isArray(response.orders)) {
        ordersData = response.orders;
      }

      console.log("Orders data:", ordersData);

      setOrders(ordersData);

      // Calculate stats
      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter((o: Order) => o.status === 'pending' || o.status === 'accepted').length;
      const totalRevenue = ordersData
        .filter((o: Order) => o.status !== 'cancelled' && o.status !== 'refunded')
        .reduce((sum: number, o: Order) => sum + parseFloat(o.total_amount?.toString() || '0'), 0);

      setStats(prev => ({
        ...prev,
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        total_revenue: totalRevenue,
      }));

      console.log("Stats updated:", { totalOrders, pendingOrders, totalRevenue });
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-blue-100 text-blue-800 border-blue-200',
      preparing: 'bg-purple-100 text-purple-800 border-purple-200',
      packing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      shipping: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      shipped: 'bg-teal-100 text-teal-800 border-teal-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const transitions: Record<string, string> = {
      pending: 'accepted',
      accepted: 'preparing',
      preparing: 'packing',
      packing: 'shipping',
      shipping: 'shipped',
      shipped: 'delivered',
    };
    return transitions[currentStatus] || null;
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders(); // Reload orders
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'pending') return order.status === 'pending' || order.status === 'accepted';
    if (selectedTab === 'preparing') return order.status === 'preparing' || order.status === 'packing';
    if (selectedTab === 'shipped') return order.status === 'shipped' || order.status === 'delivered';
    return true;
  });

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading dashboard...</div>
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">{currentStore.name}</h1>
              <p className="text-green-100 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={() => router.push('/seller/stores')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              All Stores
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_orders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending_orders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-2">${stats.total_revenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.products}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => router.push("/seller/products")}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors border border-blue-200"
            >
              <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm font-medium text-blue-700">Add Product</p>
            </button>

            <button
              onClick={() => router.push("/seller/products")}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors border border-purple-200"
            >
              <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-sm font-medium text-purple-700">Products</p>
            </button>

            <button
              onClick={() => router.push("/seller/categories")}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors border border-orange-200"
            >
              <svg className="w-8 h-8 text-orange-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="text-sm font-medium text-orange-700">Categories</p>
            </button>

            <button
              onClick={() => router.push(`/seller/stores/${currentStore.uuid}`)}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors border border-gray-200"
            >
              <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium text-gray-700">Settings</p>
            </button>
          </div>
        </div>

        {/* Orders Management */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
              <button
                onClick={loadOrders}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTab === 'all'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setSelectedTab('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTab === 'pending'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setSelectedTab('preparing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTab === 'preparing'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Preparing
              </button>
              <button
                onClick={() => setSelectedTab('shipped')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTab === 'shipped'
                    ? 'bg-teal-100 text-teal-700 border border-teal-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Shipped
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {loadingOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 font-medium">No orders found</p>
                <p className="text-sm text-gray-400 mt-1">Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <div key={order.uuid} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              Order #{order.order_number || order.uuid.slice(0, 8)}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Customer: {order.customer_first_name} {order.customer_last_name}</p>
                            {order.customer_email && <p>Email: {order.customer_email}</p>}
                            <p>Total: ${parseFloat(order.total_amount?.toString() || '0').toFixed(2)}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                          {nextStatus && order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'refunded' && (
                            <button
                              onClick={() => handleStatusUpdate(order.uuid, nextStatus)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                            </button>
                          )}
                          {(order.status === 'pending' || order.status === 'accepted') && (
                            <button
                              onClick={() => handleStatusUpdate(order.uuid, 'cancelled')}
                              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors border border-red-200"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
