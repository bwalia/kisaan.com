"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import CartSkeleton from "@/components/cart/CartSkeleton";

export default function Cart() {
  const { user, loading: authLoading } = useAuth();
  const { cart, total, loading: cartLoading, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only redirect if auth is not loading and user is not authenticated
    if (!authLoading && !user) {
      router.push('/login?redirect=/cart');
    }
  }, [user, authLoading, router]);

  // Show loading while auth is loading
  if (authLoading) {
    return <CartSkeleton />;
  }

  // Show login message if not authenticated after loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to login to view your cart</p>
          <Button onClick={() => router.push('/login')}>Login</Button>
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
    return <EmptyCart />;
  }

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    try {
      setIsClearing(true);
      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
      alert("Failed to clear cart");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleClearCart}
            loading={isClearing}
            className="text-gray-500 hover:text-red-600 hover:border-red-600"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item: any) => (
                <CartItem
                  key={`${item.product_uuid}_${item.variant_uuid || "default"}`}
                  item={item}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
            
            {/* Checkout Button */}
            <div className="mt-6">
              <Button
                onClick={() => router.push('/checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                🔒 Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
