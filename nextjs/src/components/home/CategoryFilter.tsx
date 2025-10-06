'use client';

import { CategoryFilterProps } from '@/types/home';
import { formatProductCount } from '@/lib/home-utils';

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  showAll = true,
}) => {
  const handleCategoryClick = (categoryId: string) => {
    // If clicking the same category, deselect it
    if (selectedCategory === categoryId) {
      onCategorySelect('');
    } else {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {/* All Products option */}
          {showAll && (
            <button
              onClick={() => onCategorySelect('')}
              className={`flex-shrink-0 px-6 py-2.5 rounded-xl border-2 transition-all duration-300 font-semibold ${
                selectedCategory === ''
                  ? 'bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white border-[#16a34a] shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#16a34a] hover:text-[#16a34a] hover:shadow-md'
              }`}
            >
              <span>All Products</span>
            </button>
          )}

          {/* Category options */}
          {categories.map((category) => (
            <button
              key={category.uuid}
              onClick={() => handleCategoryClick(category.uuid)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-xl border-2 transition-all duration-300 font-semibold ${
                selectedCategory === category.uuid
                  ? 'bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white border-[#16a34a] shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#16a34a] hover:text-[#16a34a] hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-5 h-5 rounded-lg object-cover"
                  />
                )}
                <span>{category.name}</span>
                {category.productCount > 0 && (
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                    selectedCategory === category.uuid
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.productCount}
                  </span>
                )}
              </div>
            </button>
          ))}

          {/* Loading placeholder */}
          {categories.length === 0 && (
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-11 w-28 bg-gray-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          )}
        </div>

        {/* Category description */}
        {selectedCategory && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {(() => {
              const category = categories.find(c => c.uuid === selectedCategory);
              return category ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatProductCount(category.productCount)}
                  </span>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;