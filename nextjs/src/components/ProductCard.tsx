'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  currency?: string;
  image: string;
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
  reviews = 0,
  discount,
  isNew,
  isFeatured,
  farmer,
  unit = 'kg',
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const originalPrice = discount ? price / (1 - discount / 100) : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    await addToCart(id, 1);

    // Brief animation delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsAdding(false);
  };

  return (
    <Link href={`/products/${id}`}>
      <div
        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-emerald-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-lg">
              NEW
            </span>
          )}
          {isFeatured && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-semibold rounded-full shadow-lg">
              ⭐ FEATURED
            </span>
          )}
          {discount && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs font-semibold rounded-full shadow-lg">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2'
          } ${
            isAdding
              ? 'bg-emerald-500 text-white'
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-emerald-500 hover:text-white shadow-lg'
          }`}
        >
          {isAdding ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={image}
            alt={name}
            fill
            className={`object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Overlay Gradient on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category & Farmer */}
          <div className="flex items-center justify-between mb-2">
            {category && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {category}
              </span>
            )}
            {farmer && (
              <span className="text-xs text-gray-500 truncate ml-2">
                by {farmer}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-200'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {reviews > 0 && (
              <span className="text-xs text-gray-500">({reviews})</span>
            )}
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {currency}{price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {currency}{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">per {unit}</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                isAdding
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-md hover:shadow-lg hover:shadow-emerald-500/20'
              }`}
            >
              {isAdding ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added
                </span>
              ) : (
                'Add'
              )}
            </button>
          </div>
        </div>

        {/* Hover Border Glow */}
        <div
          className={`absolute inset-0 rounded-2xl border-2 border-emerald-400 pointer-events-none transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </Link>
  );
}
