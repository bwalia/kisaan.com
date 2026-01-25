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
    <nav className="bg-white/95 shadow-sm border-b border-stone-200 sticky top-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 relative overflow-hidden">
              <span className="text-2xl">🌾</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] bg-clip-text text-transparent">
                Kisaan
              </span>
              <span className="text-[10px] text-stone-500 font-medium -mt-1 tracking-wide">Farm to Table</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-stone-700 hover:text-[#2d6a4f] font-medium transition-all duration-200 relative group"
            >
              {t("home")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2d6a4f] group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link
              href="/support"
              className="text-stone-700 hover:text-[#2d6a4f] font-medium transition-all duration-200 relative group"
            >
              {t("support")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2d6a4f] group-hover:w-full transition-all duration-300"></span>
            </Link>

            {user && (
              <Link
                href="/orders"
                className="text-stone-700 hover:text-[#2d6a4f] font-medium transition-all duration-200 relative group"
              >
                Orders
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2d6a4f] group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            <Link
              href="/cart"
              className="relative text-stone-700 hover:text-[#2d6a4f] font-medium transition-all duration-200 group"
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
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span>{t("cart")}</span>
              </div>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-stone-600 font-medium">
                  {t("welcome")},{" "}
                  <span className="text-[#2d6a4f]">{user.name}</span>
                </span>
                {user.role === "seller" && (
                  <div className="flex items-center space-x-2">
                    <Link
                      href={
                        primaryStoreSlug
                          ? `/seller/${primaryStoreSlug}`
                          : "/seller/stores"
                      }
                      className="bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                    >
                      <span>🌱</span>
                      {t("dashboard")}
                    </Link>
                    <Link
                      href="/seller/orders"
                      className="text-stone-700 hover:text-[#2d6a4f] font-medium transition-colors duration-200"
                    >
                      {t("orders")}
                    </Link>
                  </div>
                )}
                {user.role === "delivery_partner" && (
                  <Link
                    href="/delivery-partner/dashboard"
                    className="bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {t("deliveryDashboard")}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-stone-500 hover:text-red-600 font-medium transition-colors duration-200"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-stone-700 hover:text-[#2d6a4f] font-medium transition-colors duration-200"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-xl hover:from-amber-400 hover:to-amber-500 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                >
                  <span>🌱</span>
                  {t("getStarted")}
                </Link>
              </div>
            )}

            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 rounded-md hover:bg-stone-100"
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
          <div className="md:hidden py-3 border-t border-stone-100">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-stone-600 hover:text-[#2d6a4f] text-sm font-medium py-1"
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
