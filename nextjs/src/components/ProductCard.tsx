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

const CARD_BG = ['#EEF5E8','#FDF4DC','#E3EDF6','#F0EAD9','#FDEAE0','#DFF0EC'];
const CARD_EMOJI = ['🥬','🌽','🫑','🥕','🍅','🌿','🍊','🥦','🍋','🧅'];

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
    <Link href={`/products/${id}`} className="no-underline block">
      <article className="bg-white rounded-xl border border-[var(--border)] hover:border-[var(--sage)] transition-colors overflow-hidden group">
        <div
          className="aspect-square flex items-center justify-center relative"
          style={{ background: CARD_BG[idx % CARD_BG.length] }}
        >
          <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
            {CARD_EMOJI[idx % CARD_EMOJI.length]}
          </span>
          {discount && (
            <span className="absolute top-2.5 left-2.5 text-[11px] font-bold bg-[var(--marigold)] text-white px-2 py-0.5 rounded-md">
              -{discount}%
            </span>
          )}
        </div>

        <div className="p-3.5">
          {category && (
            <p className="text-[11px] font-semibold text-[var(--pine)] mb-1 m-0" style={{ maxWidth: 'none' }}>
              {category}
            </p>
          )}
          <h3 className="text-sm font-medium text-[var(--soil)] leading-snug mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-body)' }}>
            {name}
          </h3>
          {rating !== undefined && (
            <p className="text-xs text-[var(--clay)] mb-2 m-0" style={{ maxWidth: 'none' }}>{rating.toFixed(1)} rating</p>
          )}
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="text-base font-bold text-[var(--soil)]">{currency}{price.toFixed(2)}</span>
              <span className="text-[11px] text-[var(--clay)] block">per {unit}</span>
            </div>
            <button
              onClick={handleAdd}
              disabled={adding}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                adding ? 'bg-[var(--sage-light)] text-[var(--pine)]' : 'bg-[var(--pine)] text-white hover:bg-[var(--pine-dark)]'
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
