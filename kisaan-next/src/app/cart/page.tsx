"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import EnhancedCartItem from "@/components/cart/EnhancedCartItem";
import EnhancedOrderSummary from "@/components/cart/EnhancedOrderSummary";
import EnhancedEmptyCart from "@/components/cart/EnhancedEmptyCart";
import CartHeader from "@/components/cart/CartHeader";
import CartSkeleton from "@/components/cart/CartSkeleton";

export default function Cart() {
  const { user, loading: authLoading } = useAuth();
  const { cart, total, loading: cartLoading, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only redirect if auth is not loading and user is not authenticated
    if (!authLoading && !user) {
      router.push("/login?redirect=/cart");
    }
  }, [user, authLoading, router]);

  // Show loading while auth is loading
  if (authLoading) {
    return <CartSkeleton />;
  }

  // Show login message if not authenticated after loading
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 mb-6">
            You need to login to view your cart and continue shopping
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/login?redirect=/cart")}
              className="w-full bg-[#22c55e] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#16a34a] transition-colors"
            >
              Login to Continue
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while cart is loading
  if (cartLoading) {
    return <CartSkeleton />;
  }

  const cartItems =
    cart && typeof cart === "object"
      ? Object.values(cart).filter(
          (item) =>
            item &&
            typeof item === "object" &&
            item.product_uuid &&
            item.name &&
            typeof item.price === "number" &&
            typeof item.quantity === "number" &&
            item.price > 0 &&
            item.quantity > 0
        )
      : [];

  if (cartItems.length === 0) {
    return <EnhancedEmptyCart />;
  }

  const handleClearCart = async () => {
    try {
      setIsClearing(true);
      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Enhanced Header */}
        <CartHeader
          itemCount={cartItems.length}
          onClearCart={handleClearCart}
        />

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link
            href="/"
            className="text-gray-500 hover:text-[#22c55e] transition-colors"
          >
            Home
          </Link>
          <svg
            className="w-4 h-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2">
            <div className="space-y-4">
              {isClearing ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c55e] mx-auto mb-4"></div>
                  <p className="text-gray-600">Clearing your cart...</p>
                </div>
              ) : (
                cartItems.map((item: any) => (
                  <EnhancedCartItem
                    key={`${item.product_uuid}_${
                      item.variant_uuid || "default"
                    }`}
                    item={item}
                  />
                ))
              )}
            </div>

            {/* Continue Shopping CTA */}
            {cartItems.length > 0 && !isClearing && (
              <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Keep Shopping
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Discover more products you might like
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Order Summary */}
          <div className="xl:col-span-1">
            <EnhancedOrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
