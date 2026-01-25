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
  const [isScrolled, setIsScrolled] = useState(false);
  const [primaryStoreSlug, setPrimaryStoreSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Mark */}
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
                {/* Leaf icon */}
                <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
                </svg>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
              <span className={`text-xl lg:text-2xl font-bold tracking-tight transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Kisaan
              </span>
              <span className={`text-[10px] lg:text-xs font-medium -mt-0.5 tracking-wide transition-colors ${
                isScrolled ? 'text-emerald-600' : 'text-emerald-300'
              }`}>
                Farm to Table
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`font-medium transition-colors relative group ${
                isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'
              }`}
            >
              {t("home")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </Link>

            <Link
              href="/support"
              className={`font-medium transition-colors relative group ${
                isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'
              }`}
            >
              {t("support")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </Link>

            {user && (
              <Link
                href="/orders"
                className={`font-medium transition-colors relative group ${
                  isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'
                }`}
              >
                Orders
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className={`relative p-2 rounded-full transition-colors ${
                isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
            >
              <svg className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <span className={`text-sm font-medium ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
                    {user.name}
                  </span>
                  
                  {user.role === "seller" && (
                    <Link
                      href={primaryStoreSlug ? `/seller/${primaryStoreSlug}` : "/seller/stores"}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
                    >
                      {t("dashboard")}
                    </Link>
                  )}
                  
                  {user.role === "delivery_partner" && (
                    <Link
                      href="/delivery-partner/dashboard"
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
                    >
                      {t("deliveryDashboard")}
                    </Link>
                  )}
                  
                  <button
                    onClick={logout}
                    className={`font-medium text-sm transition-colors ${
                      isScrolled ? 'text-gray-500 hover:text-red-600' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`font-medium text-sm transition-colors ${
                      isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {t("getStarted")}
                  </Link>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
            >
              <svg className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 animate-fade-in-down">
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 font-medium rounded-lg transition-colors"
              >
                {t("home")}
              </Link>
              <Link
                href="/support"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 font-medium rounded-lg transition-colors"
              >
                {t("support")}
              </Link>
              {user && (
                <Link
                  href="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 font-medium rounded-lg transition-colors"
                >
                  Orders
                </Link>
              )}
              <Link
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 font-medium rounded-lg transition-colors flex items-center justify-between"
              >
                <span>{t("cart")}</span>
                {itemCount > 0 && (
                  <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              <div className="border-t border-gray-100 my-2" />
              
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Signed in as <span className="font-medium text-gray-700">{user.name}</span>
                  </div>
                  {user.role === "seller" && (
                    <Link
                      href={primaryStoreSlug ? `/seller/${primaryStoreSlug}` : "/seller/stores"}
                      onClick={() => setIsMenuOpen(false)}
                      className="mx-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg text-center"
                    >
                      {t("dashboard")}
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors text-left"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 border border-gray-200 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-50 transition-colors"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg text-center"
                  >
                    {t("getStarted")}
                  </Link>
                </div>
              )}
              
              <div className="px-4 pt-4">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
