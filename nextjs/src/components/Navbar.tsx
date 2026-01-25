"use client";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-gray-900">Kisaan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              {t("home")}
            </Link>

            <Link
              href="/support"
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              {t("support")}
            </Link>

            {user && (
              <Link
                href="/orders"
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                Orders
              </Link>
            )}

            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-green-600 font-medium transition-colors flex items-center gap-1"
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {t("cart")}
              {itemCount > 0 && (
                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {t("welcome")}, <span className="font-medium">{user.name}</span>
                </span>
                {user.role === "seller" && (
                  <Link
                    href={primaryStoreSlug ? `/seller/${primaryStoreSlug}` : "/seller/stores"}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    {t("dashboard")}
                  </Link>
                )}
                {user.role === "delivery_partner" && (
                  <Link
                    href="/delivery-partner/dashboard"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    {t("deliveryDashboard")}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-red-600 font-medium transition-colors"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  {t("getStarted")}
                </Link>
              </div>
            )}

            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
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
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-600 hover:text-green-600 font-medium py-2"
              >
                {t("home")}
              </Link>
              {user && (
                <Link
                  href="/orders"
                  className="text-stone-600 hover:text-[#2d6a4f] text-sm font-medium py-1"
                >
                  Orders
                </Link>
              )}
              <Link
                href="/cart"
                className="text-stone-600 hover:text-[#2d6a4f] text-sm font-medium flex items-center py-1"
              >
                {t("cart")}{" "}
                {itemCount > 0 && (
                  <span className="ml-2 bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {itemCount}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  {user.role === "seller" && (
                    <Link
                      href={
                        primaryStoreSlug
                          ? `/seller/${primaryStoreSlug}`
                          : "/seller/stores"
                      }
                      className="text-stone-600 hover:text-[#2d6a4f] text-sm font-medium py-1 flex items-center gap-1"
                    >
                      <span>🌱</span> {t("dashboard")}
                    </Link>
                  )}
                  {user.role === "delivery_partner" && (
                    <Link
                      href="/delivery-partner/dashboard"
                      className="text-stone-600 hover:text-[#2d6a4f] text-sm font-medium py-1"
                    >
                      {t("deliveryDashboard")}
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-left text-stone-400 hover:text-stone-600 text-sm py-1"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-stone-600 hover:text-[#2d6a4f] text-sm font-medium py-1"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-4 py-2 inline-block text-center mt-2 rounded-lg font-semibold"
                  >
                    🌱 {t("getStarted")}
                  </Link>
                </>
              )}
              <div className="pt-2 mt-2 border-t border-stone-200">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
