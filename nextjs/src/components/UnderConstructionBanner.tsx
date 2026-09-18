'use client';

import { useState } from 'react';

export default function UnderConstructionBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 text-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 relative z-10">
        <div className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </span>
          <span>Site under active development &mdash; Not accepting orders yet</span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-md transition-colors cursor-pointer"
          aria-label="Dismiss banner"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
