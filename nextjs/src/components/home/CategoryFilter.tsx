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
    <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {/* All Products option */}
          {showAll && (
            <button
              onClick={() => onCategorySelect('')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All
            </button>
          )}

          {/* Category options */}
          {categories.map((category) => (
            <button
              key={category.uuid}
              onClick={() => handleCategoryClick(category.uuid)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.uuid
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{category.name}</span>
                {category.productCount > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    selectedCategory === category.uuid
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500'
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
                  className="flex-shrink-0 h-10 w-24 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          )}
        </div>

        {/* Category description */}
        {selectedCategory && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            {(() => {
              const category = categories.find(c => c.uuid === selectedCategory);
              return category ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-0.5">{category.description}</p>
                    )}
                  </div>
                  <span className="text-sm text-stone-500">
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