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
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* All Products option */}
          {showAll && (
            <button
              onClick={() => onCategorySelect('')}
              className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedCategory === ''
                  ? 'bg-[#22c55e] text-white border-[#22c55e]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="font-medium">All Products</span>
            </button>
          )}

          {/* Category options */}
          {categories.map((category) => (
            <button
              key={category.uuid}
              onClick={() => handleCategoryClick(category.uuid)}
              className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedCategory === category.uuid
                  ? 'bg-[#22c55e] text-white border-[#22c55e]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-4 h-4 rounded object-cover"
                  />
                )}
                <span className="font-medium">{category.name}</span>
                {category.productCount > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.uuid
                      ? 'bg-white bg-opacity-20 text-white'
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
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-10 w-24 bg-gray-200 rounded-full animate-pulse"
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