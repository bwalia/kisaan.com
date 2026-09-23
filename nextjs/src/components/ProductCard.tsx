'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  currency?: string;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  farmer?: string;
  unit?: string;
}

const CARD_BG = ['#DCFCE7', '#FEF3C7', '#E0F2FE', '#F5F5DC', '#FFEDD5', '#CCFBF1'];

export default function ProductCard({
  id, name, price, currency = '€', category, rating, discount, unit = 'kg',
}: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const idx = id ? (id.charCodeAt(0) + id.length) : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await addToCart(id, 1);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <Link href={`/products/${id}`} className="no-underline block group">
      <article className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:shadow-[var(--shadow-soft)] transition-all duration-200 overflow-hidden">
        <div
          className="aspect-square flex items-center justify-center relative"
          style={{ background: CARD_BG[idx % CARD_BG.length] }}
        >
          {/* Abstract produce mark — no emoji icons */}
          <svg
            className="w-14 h-14 text-[var(--color-primary)] opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.25"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 3-4 5-4 9a4 4 0 008 0c0-4-2.5-6-4-9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9" />
          </svg>
          {discount != null && discount > 0 && (
            <span className="absolute top-2.5 left-2.5 text-[11px] font-bold bg-[var(--color-accent)] text-white px-2 py-0.5 rounded-lg">
              -{discount}%
            </span>
          )}
        </div>

        <div className="p-3.5">
          {category && (
            <p className="text-[11px] font-semibold text-[var(--color-primary)] mb-1 m-0" style={{ maxWidth: 'none' }}>
              {category}
            </p>
          )}
          <h3
            className="text-sm font-medium text-[var(--color-foreground)] leading-snug mb-2 line-clamp-2"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {name}
          </h3>
          {rating !== undefined && (
            <p className="text-xs text-[var(--color-muted-foreground)] mb-2 m-0" style={{ maxWidth: 'none' }}>
              {rating.toFixed(1)} rating
            </p>
          )}
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="text-base font-bold text-[var(--color-foreground)]">
                {currency}{price.toFixed(2)}
              </span>
              <span className="text-[11px] text-[var(--color-muted-foreground)] block">per {unit}</span>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer transition-colors duration-200 ${
                adding
                  ? 'bg-[var(--sage-light)] text-[var(--color-primary)]'
                  : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
              }`}
            >
              {adding ? 'Added' : 'Add'}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
