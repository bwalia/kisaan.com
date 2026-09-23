"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[var(--color-background)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="no-underline"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600, color: "var(--color-foreground)" }}
            >
              Kisaan
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {[
                { l: "Products", h: "/" },
                { l: "Sell", h: "/seller-guide" },
                { l: "Support", h: "/support" },
              ].map((item) => (
                <Link
                  key={item.l}
                  href={item.h}
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] text-sm font-medium no-underline transition-colors duration-200 cursor-pointer"
                >
                  {item.l}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="relative p-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] no-underline transition-colors duration-200 cursor-pointer"
                aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-primary)] text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-sm text-[var(--color-muted-foreground)]">{user.name}</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)] cursor-pointer transition-colors duration-200"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] font-medium no-underline cursor-pointer"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-semibold bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl hover:bg-[var(--color-primary-dark)] no-underline transition-colors duration-200 cursor-pointer"
                  >
                    List your farm
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 text-[var(--color-muted-foreground)] cursor-pointer"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
                  {open ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {open && (
        <div className="md:hidden fixed inset-0 z-[60]" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/25" />
          <div
            className="absolute top-16 left-0 right-0 bg-[var(--color-card)] border-b border-[var(--color-border)] shadow-lg p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              {[
                { l: "Products", h: "/" },
                { l: "Sell", h: "/seller-guide" },
                { l: "Support", h: "/support" },
                { l: "Cart", h: "/cart" },
              ].map((x) => (
                <Link
                  key={x.l}
                  href={x.h}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-[var(--color-foreground)] hover:bg-[var(--color-muted)] rounded-xl text-sm font-medium no-underline cursor-pointer"
                >
                  {x.l}
                </Link>
              ))}
            </div>
            {!user && (
              <div className="border-t border-[var(--color-border)] mt-3 pt-3 flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center text-sm font-medium py-2.5 border border-[var(--color-border)] rounded-xl text-[var(--color-foreground)] no-underline cursor-pointer"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center text-sm font-semibold py-2.5 bg-[var(--color-primary)] text-white rounded-xl no-underline cursor-pointer"
                >
                  List your farm
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
