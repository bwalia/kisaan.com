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

const PRODUCT_ICONS = ['🥕', '🍅', '🥬', '🌽', '🍎', '🥦', '🍊', '🫐', '🍋', '🥑'];

export default function ProductCard({
  id,
  name,
  price,
  currency = '€',
  image,
  category,
  rating = 4.5,
  discount,
  isNew,
  isFeatured,
  unit = 'kg',
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const iconIndex = id ? id.charCodeAt(0) % PRODUCT_ICONS.length : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(id, 1);
    setTimeout(() => setIsAdding(false), 1200);
  };

  return (
    <Link href={`/products/${id}`}>
      <div
        className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 hover:border-emerald-200/60"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image area */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
          {/* Animated background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

          <span className={`relative text-6xl transition-all duration-500 ${isHovered ? 'scale-125 -rotate-6' : 'scale-100 rotate-0'}`}>
            {PRODUCT_ICONS[iconIndex]}
          </span>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">New</span>
            )}
            {isFeatured && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">Featured</span>
            )}
            {discount && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-bold rounded-full shadow-md">-{discount}%</span>
            )}
          </div>

          {/* Quick add overlay */}
          <div className={`absolute inset-x-0 bottom-0 p-3 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg cursor-pointer ${
                isAdding
                  ? 'bg-emerald-100 text-emerald-700 shadow-emerald-200'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/30'
              }`}
            >
              {isAdding ? (
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Added!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                  Add to Cart
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pt-3.5">
          {category && (
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5 block">{category}</span>
          )}

          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-[0.9375rem] leading-snug group-hover:text-emerald-800 transition-colors">{name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium">{rating.toFixed(1)}</span>
          </div>

          {/* Price row */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xl font-extrabold text-gray-900">{currency}{price.toFixed(2)}</span>
              <span className="text-xs text-gray-400 block mt-0.5">per {unit}</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`md:hidden p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isAdding
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
              }`}
            >
              {isAdding ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
