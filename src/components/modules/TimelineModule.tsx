'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Icon from '@/components/shared/Icon';
import { TimelineBlockData } from '@/types/cms';
import FadeIn from '@/components/shared/FadeIn';

interface TimelineModuleProps {
  id?: string;
  data: TimelineBlockData;
}

export default function TimelineModule({ id, data }: TimelineModuleProps) {
  const { title, subtitle, category, categoryIcon, style = 'vertical', items } = data;
  const visibleItems = (items || []).filter(item => !item.hidden);

  // State for the interactive style timeline
  const defaultYear = visibleItems.length > 0 ? visibleItems[0].year : '';
  const [activeYear, setActiveYear] = useState<string | number>(defaultYear);

  if (style === 'interactive') {
    // Render the dark interactive timeline with year tabs and side impact statistics
    const activeItem = visibleItems.find((item) => item.year === activeYear) || visibleItems[0];

    return (
      <section
        id={id}
        className="cv-auto py-12 bg-gradient-to-br from-[var(--midnight-navy)] via-[var(--royal-blue)] to-[var(--dark-surface)] text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="section-container relative z-10">
          <FadeIn className="text-center mb-16">
            {category && (
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                {categoryIcon && <Icon name={categoryIcon} className="text-[var(--champagne-gold)]" size={18} />}
                <span className="text-white/90">{category}</span>
              </div>
            )}

            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                color: 'white',
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-white/80 max-w-3xl mx-auto" style={{ fontSize: '1.125rem' }}>
                {subtitle}
              </p>
            )}
          </FadeIn>

          {/* Year Tabs Selector */}
          <FadeIn delay={100} className="flex flex-wrap justify-center gap-4 mb-16">
            {visibleItems.map((item) => (
              <button
                key={item.year}
                onClick={() => setActiveYear(item.year)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeYear === item.year
                    ? 'bg-[var(--champagne-gold)] text-[var(--midnight-navy)] scale-110 shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {item.year}
              </button>
            ))}
          </FadeIn>

          {/* Timeline Details Display */}
          {activeItem && (
            <div key={String(activeYear)} className="max-w-6xl mx-auto">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 lg:p-12 border border-white/20 hover:border-[var(--champagne-gold)] transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Left content: Highlights list */}
                  <div className="lg:col-span-2">
                    {activeItem.icon && (
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--champagne-gold)] to-white rounded-2xl mb-6">
                        <Icon name={activeItem.icon} className="text-[var(--midnight-navy)]" size={36} />
                      </div>
                    )}

                    <h3
                      className="mb-2 text-white"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                        lineHeight: '1.2',
                      }}
                    >
                      {activeItem.title}
                    </h3>

                    {activeItem.institution && (
                      <p className="text-[var(--champagne-gold)] mb-8 font-medium">
                        {activeItem.institution}
                      </p>
                    )}

                    {activeItem.highlights && activeItem.highlights.length > 0 && (
                      <div className="space-y-4">
                        {activeItem.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <ChevronRight className="text-[var(--champagne-gold)] flex-shrink-0 mt-1" size={20} />
                            <p className="text-white/80 leading-relaxed">{highlight}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right content: Side statistics box */}
                  {activeItem.impact && activeItem.impact.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-white mb-4 font-semibold text-lg">Impact Metrics</h4>
                      {activeItem.impact.map((metric, idx) => (
                        <div key={idx} className="bg-white/10 rounded-lg p-6 border border-white/20 hover:border-[var(--champagne-gold)] transition-all">
                          <div
                            className="text-[var(--champagne-gold)] mb-2"
                            style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}
                          >
                            {metric.value}
                          </div>
                          <div className="text-white/70 text-sm">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Render vertical timeline style (used in Career Milestones)
  return (
    <section id={id} className="cv-auto py-12 bg-[var(--warm-white)] text-[var(--midnight-navy)]">
      <div className="section-container">
        <FadeIn className="text-center mb-16">
          {category && (
            <div className="inline-flex items-center space-x-2 bg-[var(--royal-blue)]/10 px-4 py-2 rounded-full mb-6">
              {categoryIcon && <Icon name={categoryIcon} className="text-[var(--royal-blue)]" size={18} />}
              <span className="text-[var(--royal-blue)] font-medium">{category}</span>
            </div>
          )}

          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--midnight-navy)',
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-[var(--midnight-navy)]/70 max-w-3xl mx-auto" style={{ fontSize: '1.125rem' }}>
              {subtitle}
            </p>
          )}
        </FadeIn>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--royal-blue)] to-[var(--champagne-gold)] hidden md:block" />

            <div className="space-y-8">
              {visibleItems.map((item, index) => (
                <FadeIn
                  key={index}
                  delay={Math.min(index * 60, 300)}
                  className="relative flex gap-8 group"
                >
                  {/* Year marker */}
                  <div className="flex-shrink-0 w-24">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--champagne-gold)] to-[var(--royal-blue)] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform md:ml-0 ml-auto">
                      <span style={{ fontFamily: 'var(--font-heading)' }} className="font-semibold">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 pb-8">
                    <div className="bg-white rounded-lg p-6 border border-[var(--royal-blue)]/30 hover:border-[var(--champagne-gold)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <h3 className="mb-2 text-[var(--midnight-navy)] font-semibold" style={{ fontSize: '1.25rem' }}>
                        {item.title}
                      </h3>
                      {item.institution && (
                        <p className="text-[var(--royal-blue)] text-sm mb-2 font-medium">
                          {item.institution}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-[var(--midnight-navy)]/60 leading-relaxed text-sm">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
