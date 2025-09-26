'use client';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  maxQuantity,
  onQuantityChange,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const clampedValue = Math.min(Math.max(1, value), maxQuantity);
    onQuantityChange(clampedValue);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">
        Quantity
      </label>

      <div className="flex items-center">
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={disabled || quantity <= 1}
            className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
            aria-label="Decrease quantity"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <input
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={handleInputChange}
            disabled={disabled}
            className="w-16 text-center border-0 focus:outline-none focus:ring-0 text-sm font-medium py-3 disabled:bg-gray-50 disabled:cursor-not-allowed"
            aria-label="Quantity"
          />

          <button
            type="button"
            onClick={handleIncrease}
            disabled={disabled || quantity >= maxQuantity}
            className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
            aria-label="Increase quantity"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        {/* Max Quantity Indicator */}
        <span className="ml-3 text-sm text-gray-500">
          Max: {maxQuantity}
        </span>
      </div>

      {/* Quantity Validation Message */}
      {maxQuantity <= 5 && (
        <p className="text-sm text-orange-600">
          Only {maxQuantity} items available
        </p>
      )}
    </div>
  );
}