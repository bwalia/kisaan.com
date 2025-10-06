"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [primaryStoreSlug, setPrimaryStoreSlug] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "seller") {
      loadPrimaryStore();
    }
  }, [user]);

  const loadPrimaryStore = async () => {
    try {
      const response = await api.getMyStores();
      const stores = response.data || [];
      if (stores.length > 0) {
        setPrimaryStoreSlug(stores[0].slug);
      }
    } catch (error) {
      console.error("Failed to load store:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#16a34a] to-[#15803d] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#16a34a] to-[#15803d] bg-clip-text text-transparent">Kisaan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#16a34a] font-medium transition-all duration-200 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#16a34a] group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              href="/support"
              className="text-gray-700 hover:text-[#16a34a] font-medium transition-all duration-200 relative group"
            >
              Support
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#16a34a] group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-[#16a34a] font-medium transition-all duration-200 group"
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </div>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 font-medium">Welcome, <span className="text-[#16a34a]">{user.name}</span></span>
                {user.role === "seller" && (
                  <div className="flex items-center space-x-2">
                    <Link
                      href={primaryStoreSlug ? `/seller/${primaryStoreSlug}` : "/seller/stores"}
                      className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/seller/orders"
                      className="text-gray-700 hover:text-[#16a34a] font-medium transition-colors duration-200"
                    >
                      Orders
                    </Link>
                  </div>
                )}
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-red-600 font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-[#16a34a] font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 rounded-md hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#16a34a] text-sm font-medium py-1"
              >
                Home
              </Link>
              <Link
                href="/cart"
                className="text-gray-600 hover:text-[#16a34a] text-sm font-medium flex items-center py-1"
              >
                Cart{" "}
                {itemCount > 0 && (
                  <span className="ml-2 bg-[#16a34a] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {itemCount}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  {user.role === "seller" && (
                    <Link
                      href={primaryStoreSlug ? `/seller/${primaryStoreSlug}` : "/seller/stores"}
                      className="text-gray-600 hover:text-[#16a34a] text-sm font-medium py-1"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-left text-gray-400 hover:text-gray-600 text-sm py-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-[#16a34a] text-sm font-medium py-1"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary text-xs px-4 py-2 inline-block text-center mt-2"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
