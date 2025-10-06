"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { SearchBarProps } from "@/types/home";

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search products...",
  initialValue = "",
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  // Stable debounced search function
  const debouncedSearch = useCallback(
    (term: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearch(term);
      }, 500); // Increased debounce time for better UX
    },
    [onSearch]
  );

  // Only trigger search when user types, not on initial load
  useEffect(() => {
    // Don't search on initial load or empty search
    if (searchTerm.trim() && searchTerm !== initialValue) {
      debouncedSearch(searchTerm.trim());
    } else if (searchTerm === "" && initialValue !== "") {
      // Handle clearing search
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      onSearch("");
    }

    // Cleanup timeout on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]); // Removed debouncedSearch from dependencies to prevent re-creation

  // Maintain focus during loading state changes
  useEffect(() => {
    if (inputRef.current && document.activeElement === inputRef.current) {
      // Preserve cursor position when component re-renders
      const cursorPosition = inputRef.current.selectionStart;
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(cursorPosition || 0, cursorPosition || 0);
        }
      }, 0);
    }
  }, [loading]); // Re-focus when loading state changes

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-[#16a34a] focus:outline-none focus:ring-0 transition-colors duration-200"
            disabled={loading}
          />

          {/* Clear button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-16 flex items-center justify-center w-8 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            disabled={loading}
            className="absolute inset-y-0 right-2 flex items-center justify-center w-12 h-[calc(100%-16px)] my-2 bg-[#16a34a] text-white rounded-full hover:bg-[#16a34a] transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Search suggestions could be added here in the future */}
      {/*
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      */}
    </div>
  );
};

// Memoize the SearchBar to prevent unnecessary re-renders that cause focus loss
export default React.memo(SearchBar, (prevProps, nextProps) => {
  // Don't re-render if only loading state changed (to maintain focus)
  return (
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.initialValue === nextProps.initialValue
    // Removed onSearch comparison to prevent re-renders on function reference changes
    // Removed loading comparison to prevent re-renders during API calls
  );
});
