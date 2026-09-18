'use client';
import { useState } from 'react';

export default function UnderConstructionBanner() {
  const [show, setShow] = useState(true);
  if (!show) return null;

  return (
    <div className="bg-[var(--marigold-light)] border-b border-[#E8DDB8] text-[var(--soil)] text-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <p className="m-0 text-sm" style={{ maxWidth: 'none', color: 'var(--soil)' }}>
          This site is under active development and is not accepting orders yet.
        </p>
        <button onClick={() => setShow(false)} className="p-1 text-[var(--clay)] hover:text-[var(--soil)] cursor-pointer flex-shrink-0" aria-label="Dismiss">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}
