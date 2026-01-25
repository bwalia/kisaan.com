'use client';

import { useState, useRef, useEffect } from 'react';
import { CategoryWithProducts } from '@/types/home';

// Category icon mapping
const categoryIcons: Record<string, string> = {
  vegetables: '🥬',
  fruits: '🍎',
  dairy: '🥛',
  grains: '🌾',
  herbs: '🌿',
  organic: '🍃',
  spices: '🌶️',
  meat: '🥩',
  seafood: '🐟',
  bakery: '🍞',
  beverages: '🧃',
  default: '🛒',
};

interface CategoryFilterProps {
  categories: CategoryWithProducts[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  showAll?: boolean;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
  showAll = true,
}: CategoryFilterProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const getIcon = (categoryName: string): string => {
    const key = categoryName.toLowerCase().replace(/\s+/g, '');
    return categoryIcons[key] || categoryIcons.default;
  };

  // Build display categories with optional "All" option
  const displayCategories = showAll
    ? [{ uuid: '', name: 'All Products', productCount: 0 }, ...categories]
    : categories;

  const activeCategory = selectedCategory || '';
  const activeCategoryName = activeCategory
    ? categories.find((c) => c.uuid === activeCategory)?.name || 'All Products'
    : 'All Products';

  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 to-white sticky top-20 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-2 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayCategories.map((category) => {
              const isActive = activeCategory === category.uuid;
              const icon = category.uuid === '' ? '🌾' : getIcon(category.name);
              
              return (
                <button
                  key={category.uuid || 'all'}
                  onClick={() => onCategorySelect(category.uuid)}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                      : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{category.name}</span>
                  {category.productCount > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      {category.productCount}
                    </span>
                  )}
                  
                  {/* Active Indicator Dot */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Stats Bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing products in{' '}
            <span className="font-medium text-gray-900">
              {activeCategoryName}
            </span>
          </p>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
              Sort
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
