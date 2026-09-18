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
      <nav className="sticky top-0 z-50 bg-[var(--parchment)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--soil)', textDecoration: 'none' }}>
              Kisaan
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {['Products', 'Sell', 'Support'].map((l) => (
                <Link
                  key={l}
                  href={l === 'Products' ? '/' : l === 'Sell' ? '/seller-guide' : '/support'}
                  className="text-[var(--clay)] hover:text-[var(--soil)] text-sm font-medium no-underline transition-colors"
                >
                  {l}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link href="/cart" className="relative p-2 text-[var(--clay)] hover:text-[var(--soil)] no-underline transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[var(--pine)] text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-sm text-[var(--clay)]">{user.name}</span>
                  <button onClick={logout} className="text-sm text-[var(--clay)] hover:text-red-700 cursor-pointer transition-colors">Sign out</button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="text-sm text-[var(--clay)] hover:text-[var(--soil)] font-medium no-underline">Sign in</Link>
                  <Link href="/register" className="text-sm font-semibold bg-[var(--pine)] text-white px-4 py-2 rounded-lg hover:bg-[var(--pine-dark)] no-underline transition-colors">
                    Join
                  </Link>
                </div>
              )}

              <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-[var(--clay)] cursor-pointer" aria-label="Menu">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  {open ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {open && (
        <div className="md:hidden fixed inset-0 z-[60]" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-[var(--border)] shadow-lg p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-1">
              {[{l:'Products',h:'/'},{l:'Sell',h:'/seller-guide'},{l:'Support',h:'/support'},{l:'Cart',h:'/cart'}].map((x) => (
                <Link key={x.l} href={x.h} onClick={() => setOpen(false)} className="px-3 py-2.5 text-[var(--soil)] hover:bg-[var(--surface)] rounded-lg text-sm font-medium no-underline">{x.l}</Link>
              ))}
            </div>
            {!user && (
              <div className="border-t border-[var(--border)] mt-3 pt-3 flex gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center text-sm font-medium py-2.5 border border-[var(--border)] rounded-lg text-[var(--soil)] no-underline">Sign in</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="flex-1 text-center text-sm font-semibold py-2.5 bg-[var(--pine)] text-white rounded-lg no-underline">Join</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
