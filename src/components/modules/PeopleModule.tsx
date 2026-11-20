'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import FadeIn from '@/components/shared/FadeIn';

interface Person {
  name: string;
  role: string;
  image?: string;
  icon?: string;
  roles?: Record<string, string>;
  categoryIds?: string[];
  hidden?: boolean;
}

interface Category {
  id: string;
  label: string;
  people?: Person[];
}

interface PeopleModuleProps {
  id?: string;
  data?: {
    title?: string;
    subtitle?: string;
    titleAlignment?: 'left' | 'center';
    categories?: Category[];
    selectedPeople?: Record<string, string[]>;
  };
}

export default function PeopleModule({ id, data }: PeopleModuleProps) {
  const categories = data?.categories || [];
  const [activeTabId, setActiveTabId] = useState(categories[0]?.id || '');
  const currentTabId = activeTabId || (categories[0]?.id || '');
  const activeCategory = categories.find((c) => c.id === currentTabId) || categories[0];
  const items = activeCategory?.people || [];

  if (categories.length === 0) return null;

  return (
    <section id={id} className="py-10 md:py-14 bg-[var(--warm-white)] relative overflow-hidden">
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-[var(--royal-blue)]/5 to-[var(--champagne-gold)]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[var(--champagne-gold)]/5 to-[var(--royal-blue)]/5 blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <FadeIn
          variant="up"
          delay={0}
          className={`mb-12 max-w-3xl ${
            data?.titleAlignment === 'left' ? 'text-left mr-auto' : 'text-center mx-auto'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--royal-blue)]/10 text-[var(--royal-blue)] dark:text-[var(--champagne-gold)] text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Leadership & Faculty</span>
          </div>

          <h2
            className="mb-3 font-semibold tracking-tight"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)',
              color: 'var(--midnight-navy)',
              lineHeight: '1.2',
            }}
          >
            {data?.title || 'Our Distinguished Team'}
          </h2>

          {data?.subtitle && (
            <p className="text-[var(--midnight-navy)]/70 text-sm sm:text-base leading-relaxed">
              {data.subtitle}
            </p>
          )}
        </FadeIn>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <FadeIn variant="up" delay={0.1} className="flex flex-wrap justify-center gap-2 mb-14">
            {categories.map((cat) => {
              const isActive = currentTabId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTabId(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[var(--royal-blue)] border-[var(--royal-blue)] text-white shadow-md transform -translate-y-0.5'
                      : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-[var(--royal-blue)]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </FadeIn>
        )}

        {/* Responsive Headshot Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No profiles listed under this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-6xl mx-auto">
            {items.map((person, idx) => {
              const displayRole = person.roles?.[currentTabId] || person.role;
              return (
                <FadeIn
                  key={idx}
                  variant="up"
                  delay={0.05 * (idx % 8)}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Circular Avatar with 2-Color Conic Gradient Outer Ring */}
                  <div
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-[3px] shadow-sm mb-4 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background:
                        'conic-gradient(from 45deg, var(--royal-blue) 0% 50%, var(--champagne-gold) 50% 100%)',
                    }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      {person.image ? (
                        <img
                          src={person.image}
                          alt={person.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <h4 className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-[var(--royal-blue)] transition-colors line-clamp-2">
                    {person.name}
                  </h4>

                  {/* Role */}
                  {displayRole && (
                    <p className="text-xs text-slate-500 font-medium whitespace-pre-line mt-1 leading-snug line-clamp-3">
                      {displayRole}
                    </p>
                  )}
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
