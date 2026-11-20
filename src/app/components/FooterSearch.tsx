'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

const SITE_PAGES = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Vision', href: '/vision' },
  { label: 'Initiatives', href: '/initiatives' },
  { label: 'Leadership', href: '/leadership' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Media', href: '/media' },
  { label: 'Contact', href: '/contact' },
];

export default function FooterSearch() {
  const [query, setQuery] = useState('');
  const results = query.trim()
    ? SITE_PAGES.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="relative mb-6">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-2 focus-within:border-[var(--secondary)]/50 transition-colors">
        <Search size={13} className="text-white/40 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages..."
          className="bg-transparent text-white/80 text-xs w-full outline-none placeholder:text-white/30"
        />
      </div>
      {results.length > 0 && (
        <ul className="absolute top-full mt-2 left-0 right-0 bg-[var(--dark-surface)] border border-white/10 rounded-xl overflow-hidden shadow-xl z-10">
          {results.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                onClick={() => setQuery('')}
                className="block px-4 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-[var(--secondary)] transition-colors"
              >
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
