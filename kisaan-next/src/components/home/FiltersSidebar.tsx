'use client';

import { useState } from 'react';
import { SortDropdownProps, PriceFilterProps } from '@/types/home';
import { SORT_OPTIONS, formatPrice } from '@/lib/home-utils';

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      >
        <span className="text-sm font-medium">
          Sort by: {selectedOption?.label || 'Select...'}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                value === option.value ? 'bg-primary-50 text-primary font-medium' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PriceFilter: React.FC<PriceFilterProps> = ({ range, currentRange, onChange }) => {
  const [localMin, setLocalMin] = useState(currentRange.min);
  const [localMax, setLocalMax] = useState(currentRange.max);

  const handleApply = () => {
    onChange({ min: localMin, max: localMax });
  };

  const handleReset = () => {
    setLocalMin(range.min);
    setLocalMax(range.max);
    onChange(range);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            min={range.min}
            max={range.max}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            min={range.min}
            max={range.max}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleApply}
          className="bg-[#22c55e] text-white px-4 py-2 text-sm rounded-lg font-medium hover:bg-[#16a34a] transition-colors flex-1"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="border border-gray-300 text-gray-700 px-3 py-2 text-sm rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="text-xs text-gray-500">
        Range: {formatPrice(range.min)} - {formatPrice(range.max)}
      </div>
    </div>
  );
};

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: { min: number; max: number };
  currentPriceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  resultCount?: number;
}

interface DesktopFiltersProps {
  priceRange: { min: number; max: number };
  currentPriceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  resultCount?: number;
}

const DesktopFilters: React.FC<DesktopFiltersProps> = ({
  priceRange,
  currentPriceRange,
  onPriceRangeChange,
  resultCount,
}) => {
  return (
    <div className="space-y-6">
      {/* Results count */}
      {resultCount !== undefined && (
        <div className="text-sm text-gray-600 font-medium">
          {resultCount} products found
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
        <PriceFilter
          range={priceRange}
          currentRange={currentPriceRange}
          onChange={onPriceRangeChange}
        />
      </div>
    </div>
  );
};

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  isOpen,
  onClose,
  priceRange,
  currentPriceRange,
  onPriceRangeChange,
  resultCount,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={onClose}
              className="btn-icon btn-ghost"
            >
              <svg className="icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <DesktopFilters
              priceRange={priceRange}
              currentPriceRange={currentPriceRange}
              onPriceRangeChange={onPriceRangeChange}
              resultCount={resultCount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FiltersSidebar;
export { DesktopFilters };