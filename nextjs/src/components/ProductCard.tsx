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
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(id, 1);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <Link href={`/products/${id}`}>
      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-green-300">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
          {/* Placeholder icon */}
          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🌿</div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">NEW</span>
            )}
            {isFeatured && (
              <span className="px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">FEATURED</span>
            )}
            {discount && (
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">-{discount}%</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {category && (
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1 block">{category}</span>
          )}
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">{name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xs ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
            ))}
            <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
          </div>

          {/* Price and Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">{currency}{price.toFixed(2)}</span>
              <span className="text-xs text-gray-500 block">per {unit}</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isAdding
                  ? 'bg-green-100 text-green-700'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isAdding ? '✓ Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
