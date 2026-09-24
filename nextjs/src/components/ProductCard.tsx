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

const CARD_BG = ['#E8EDE4', '#F0E6D8', '#E4EAF0', '#ECE8DF', '#F0E4DE', '#E2EBE6'];

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
      <article className="bg-[var(--card)] border border-[var(--line)] hover:border-[var(--ink)] transition-colors duration-180 overflow-hidden">
        <div
          className="aspect-square flex items-center justify-center relative"
          style={{ background: CARD_BG[idx % CARD_BG.length] }}
        >
          <svg
            className="w-12 h-12 text-[var(--field)] opacity-60 group-hover:opacity-90 transition-opacity duration-180"
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
            <span
              className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5"
              style={{ background: "var(--tomato)", color: "#FFFFFF" }}
            >
              -{discount}%
            </span>
          )}
        </div>

        <div className="p-3.5">
          {category && (
            <p className="text-[11px] font-semibold text-[var(--field)] mb-1 m-0" style={{ maxWidth: 'none' }}>
              {category}
            </p>
          )}
          <h3
            className="text-sm font-medium text-[var(--ink)] leading-snug mb-2 line-clamp-2"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {name}
          </h3>
          {rating !== undefined && (
            <p className="text-xs text-[var(--muted)] mb-2 m-0" style={{ maxWidth: 'none' }}>
              {rating.toFixed(1)} rating
            </p>
          )}
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="text-base font-bold text-[var(--ink)]">
                {currency}{price.toFixed(2)}
              </span>
              <span className="text-[11px] text-[var(--muted)] block">per {unit}</span>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding}
              className="text-xs font-semibold px-3 py-1.5 cursor-pointer transition-colors duration-180"
              style={{
                background: adding ? 'var(--sage-light)' : 'var(--field)',
                color: adding ? 'var(--field)' : '#FFFFFF',
              }}
            >
              {adding ? 'Added' : 'Add'}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
