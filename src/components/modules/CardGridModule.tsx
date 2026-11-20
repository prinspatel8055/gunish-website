'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Target, Quote, Star, CheckCircle2, BookOpen, Play, Newspaper, ChevronRight } from 'lucide-react';
import FadeIn from '@/components/shared/FadeIn';
import Icon from '@/components/shared/Icon';
import { CardGridBlockData, CardItem } from '@/types/cms';

interface ParsedDescription {
  topic?: string;
  partner?: string;
  body: string;
}

function parseCardDescription(text: string): ParsedDescription {
  if (!text) return { body: '' };

  const partnerRegex = /(?:\r?\n)?(?:Industry Partner|Partner):\s*([^.\n\r]+)(?:\.|\r?\n|$)/i;
  const match = text.match(partnerRegex);

  if (match) {
    const partnerText = match[1].trim();
    const parts = text.split(match[0]);
    
    let topic = parts[0]?.trim() || '';
    if (topic.endsWith('.')) {
      topic = topic.slice(0, -1).trim();
    }
    
    let body = parts[1]?.trim() || '';
    
    return {
      topic: topic || undefined,
      partner: partnerText,
      body: body
    };
  }

  return { body: text };
}

const getCardContainerClasses = (style: string, dark: boolean) => {
  switch (style) {
    case 'glass':
      return dark
        ? 'bg-white/5 backdrop-blur-md border border-white/12 text-white hover:bg-white/10 hover:border-[var(--secondary)]/40 hover:shadow-[0_12px_30px_rgba(21,177,216,0.15)] hover:-translate-y-1 transition-all duration-300'
        : 'bg-white/60 backdrop-blur-md border border-[var(--royal-blue)]/10 text-[var(--midnight-navy)] hover:bg-white/80 hover:border-[var(--secondary)]/50 hover:shadow-[0_12px_30px_rgba(21,177,216,0.1)] hover:-translate-y-1 transition-all duration-300';
    case 'glow':
      return dark
        ? 'bg-[var(--midnight-navy)]/60 border border-white/10 text-white hover:-translate-y-1 hover:border-[var(--secondary)]/60 hover:shadow-[0_20px_50px_rgba(21,177,216,0.25)] transition-all duration-300'
        : 'bg-white border border-[var(--royal-blue)]/12 text-[var(--midnight-navy)] hover:-translate-y-1 hover:border-[var(--secondary)]/60 hover:shadow-[0_20px_50px_rgba(21,177,216,0.18)] transition-all duration-300';
    case 'editorial':
      return dark
        ? 'bg-transparent text-white border-l-2 border-l-[var(--secondary)] hover:border-l-white pl-6 py-4 hover:translate-x-1 transition-all duration-300'
        : 'bg-transparent text-[#1E293B] border-l-2 border-l-[var(--secondary)] hover:border-l-[var(--royal-blue)] pl-6 py-4 hover:translate-x-1 transition-all duration-300';
    case 'standard':
    default:
      return dark
        ? 'bg-white/5 border border-white/10 text-white hover:border-[var(--secondary)]/40 hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300'
        : 'bg-[#F6F8FB] border border-[var(--royal-blue)]/10 text-[var(--midnight-navy)] hover:bg-white hover:border-[var(--royal-blue)]/30 hover:shadow-[0_8px_32px_rgba(21,86,178,0.12)] hover:-translate-y-1 transition-all duration-300';
  }
};

interface CardWrapperProps {
  index: number;
  cardStyle: string;
  isDark: boolean;
  className?: string;
  padding?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const CardWrapper = ({ index, cardStyle, isDark, className = '', padding = 'p-8', onClick, children }: CardWrapperProps) => {
  const containerClasses = getCardContainerClasses(cardStyle, isDark);
  
  return (
    <div
      onClick={onClick}
      className={`h-full flex flex-col rounded-2xl group cursor-pointer relative overflow-hidden transition-all duration-300 ${containerClasses} ${padding} ${className}`}
    >
      {/* 1. Glass Style decorations */}
      {cardStyle === 'glass' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
          <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
        </div>
      )}

      {/* 2. Glow Style decorations */}
      {cardStyle === 'glow' && (
        <>
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-[var(--secondary)]/20 to-[var(--royal-blue)]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-gradient-to-br from-[var(--royal-blue)]/10 to-[var(--secondary)]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
        </>
      )}

      {/* 3. Editorial Style decorations */}
      {cardStyle === 'editorial' && (
        <>
          <div className="absolute top-4 right-6 text-7xl font-serif font-extrabold text-[var(--secondary)]/5 dark:text-white/5 select-none pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:text-[var(--secondary)]/10 z-0">
            {String(index + 1).padStart(2, '0')}
          </div>
        </>
      )}

      {/* Actual Card Content */}
      <div className="relative z-10 flex flex-col h-full w-full">
        {children}
      </div>
    </div>
  );
};

interface CardGridModuleProps {
  id?: string;
  data: CardGridBlockData;
}

export default function CardGridModule({ id, data }: CardGridModuleProps) {
  const {
    title,
    subtitle,
    category,
    categoryIcon,
    cardType = 'standard',
    columns = 3,
    isDark = false,
    viewAllLink,
    items,
    cardStyle = 'standard'
  } = data;

  const visibleItems = (items || []).filter(item => !item.hidden);
  const [visibleCount, setVisibleCount] = useState(cardType === 'award' ? 6 : visibleItems.length);

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns] || 'grid-cols-1 md:grid-cols-3';

  // Helper to render card icons with responsive styles depending on variant style
  const renderIcon = (iconName: string) => {
    if (cardStyle === 'editorial') {
      return (
        <div className="mb-4 text-[var(--secondary)]">
          <Icon name={iconName} size={24} />
        </div>
      );
    }
    
    return (
      <div 
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 text-white"
        style={{
          background: 'linear-gradient(135deg, var(--royal-blue), var(--secondary))'
        }}
      >
        <Icon name={iconName} size={18} />
      </div>
    );
  };

  // Sub-renderer for standard cards (e.g. Areas of Influence, Core Values, Contact Categories)
  const renderStandardCard = (item: CardItem, index: number) => {
    const parsed = parseCardDescription(item.description || '');

    return (
      <CardWrapper
        key={index}
        index={index}
        cardStyle={cardStyle}
        isDark={isDark}
      >
        {(item.imageUrl || item.image) && (
          <div className="w-full h-48 -mt-8 -mx-8 mb-5 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
            <img
              src={item.imageUrl || item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
        {item.icon && renderIcon(item.icon)}

        {parsed.topic && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--royal-blue)] dark:text-[var(--champagne-gold)] mb-2.5">
            {parsed.topic}
          </div>
        )}

        <h3 className={`mb-3 transition-colors ${
          cardStyle === 'editorial' 
            ? 'font-serif text-xl font-medium text-[var(--midnight-navy)] dark:text-white group-hover:text-[var(--champagne-gold)]' 
            : 'font-sans text-lg font-semibold text-[var(--midnight-navy)] dark:text-white group-hover:text-[var(--royal-blue)] dark:group-hover:text-[var(--champagne-gold)]'
        } leading-snug`}>
          {item.title}
        </h3>

        {parsed.partner && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--royal-blue)]/5 dark:bg-white/5 border border-[var(--royal-blue)]/10 dark:border-white/10 text-[11px] text-[var(--midnight-navy)]/80 dark:text-white/80 mt-1 mb-3.5 w-fit">
            <span className="font-semibold text-[var(--royal-blue)] dark:text-[var(--champagne-gold)] uppercase tracking-wider text-[9px]">Partner:</span>
            <span className="font-medium">{parsed.partner}</span>
          </div>
        )}

        {parsed.body && (
          <p className={`leading-relaxed text-sm flex-1 ${
            isDark ? 'text-white/70' : 'text-[var(--midnight-navy)]/75'
          }`}>
            {parsed.body}
          </p>
        )}
      </CardWrapper>
    );
  };

  // Sub-renderer for pillar cards (e.g. Future of Education pillars on dark background)
  const renderPillarCard = (item: CardItem, index: number) => {
    return (
      <CardWrapper
        key={index}
        index={index}
        cardStyle={cardStyle}
        isDark={isDark}
      >
        {(item.imageUrl || item.image) && (
          <div className="w-full h-48 -mt-8 -mx-8 mb-5 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
            <img
              src={item.imageUrl || item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
        {item.icon && renderIcon(item.icon)}
        
        <h3
          className={`mb-4 transition-colors ${
            cardStyle === 'editorial' ? 'font-serif text-2xl font-medium' : 'font-sans text-xl font-semibold'
          }`}
          style={{
            color: isDark ? '#ffffff' : 'var(--midnight-navy)'
          }}
        >
          {item.title}
        </h3>
        
        {item.description && (
          <p className={`mb-6 leading-relaxed text-sm ${isDark ? 'text-white/70' : 'text-[var(--midnight-navy)]/75'}`}>
            {item.description}
          </p>
        )}
        
        {item.highlights && item.highlights.length > 0 && (
          <ul className="space-y-2.5 mt-auto pt-4 border-t border-[var(--royal-blue)]/10 dark:border-white/10">
            {item.highlights.map((h, idx) => (
              <li key={idx} className={`flex items-start text-sm ${isDark ? 'text-white/70' : 'text-[var(--midnight-navy)]/70'}`}>
                <div className="w-1.5 h-1.5 bg-[var(--secondary)] transform rotate-45 mt-2 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </CardWrapper>
    );
  };

  // Sub-renderer for initiative cards (e.g. Featured Initiatives, Initiatives Grid)
  const renderInitiativeCard = (item: CardItem, index: number) => {
    return (
      <CardWrapper
        key={index}
        index={index}
        cardStyle={cardStyle}
        isDark={isDark}
        padding="p-0"
      >
        {cardStyle !== 'editorial' && (
          <div className="h-1 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--secondary)] w-full" />
        )}
        {(item.imageUrl || item.image) && (
          <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={item.imageUrl || item.image}
              alt={item.title || 'Initiative'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-8 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4 text-xs font-semibold tracking-wider uppercase">
            {item.category && (
              <span className="text-[var(--secondary)] px-3 py-1 bg-[var(--secondary)]/10 rounded-full">
                {item.category}
              </span>
            )}
            {item.status && (
              <span className="text-[var(--royal-blue)] dark:text-white/80 flex items-center">
                <Target size={14} className="mr-1.5" />
                {item.status}
              </span>
            )}
          </div>
          
          <h3 className={`mb-3 transition-colors ${
            cardStyle === 'editorial' ? 'font-serif text-xl font-medium' : 'font-sans text-lg font-semibold'
          } text-[var(--midnight-navy)] dark:text-white group-hover:text-[var(--royal-blue)] dark:group-hover:text-[var(--secondary)]`}>
            {item.title}
          </h3>
          
          {item.description && (
            <p className="text-[var(--midnight-navy)]/70 dark:text-white/70 mb-5 leading-relaxed text-sm flex-1">
              {item.description}
            </p>
          )}
          
          {item.impact && (
            <div className="pt-4 border-t border-[var(--midnight-navy)]/10 dark:border-white/10 text-xs font-bold mt-auto text-[var(--royal-blue)] dark:text-[var(--secondary)] tracking-wider uppercase flex items-center justify-between">
              <span>{item.impact}</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          )}
        </div>
      </CardWrapper>
    );
  };

  // Sub-renderer for award cards
  const renderAwardCard = (item: CardItem, index: number) => {
    return (
      <CardWrapper
        key={index}
        index={index}
        cardStyle={cardStyle}
        isDark={isDark}
        padding="p-6"
      >
        <div className="flex items-start gap-5">
          {item.icon && (
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--royal-blue)] to-[var(--midnight-navy)] rounded-xl flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-110 group-hover:border-[var(--secondary)]/40 transition-all duration-300">
                <Icon name={item.icon} className="text-[var(--secondary)]" size={20} />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            {item.year && (
              <div className="text-[var(--secondary)] font-serif font-semibold mb-1 text-xs tracking-wider uppercase">
                {item.year}
              </div>
            )}
            <h3 className={`mb-1 transition-colors ${
              cardStyle === 'editorial' ? 'font-serif text-base font-medium' : 'font-sans text-sm font-semibold'
            } text-[var(--midnight-navy)] dark:text-white group-hover:text-[var(--royal-blue)] dark:group-hover:text-[var(--secondary)]`}>
              {item.title}
            </h3>
            {item.description && (
              <p className="text-[var(--midnight-navy)]/65 dark:text-white/65 text-xs leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        </div>
      </CardWrapper>
    );
  };

  // Sub-renderer for academic blocks (e.g. Educational Journey rows or Degree Programs)
  const renderAcademicCard = (item: CardItem, index: number) => {
    const isGrid = (columns || 1) > 1;
    if (isGrid) {
      return (
        <div
          key={index}
          className="rounded-2xl overflow-hidden border border-[var(--royal-blue)]/10 dark:border-white/10 bg-white dark:bg-[var(--dark-surface)] transition-all duration-300 group hover:shadow-xl h-full flex flex-col"
        >
          {/* Header */}
          <div
            className="px-8 py-5 flex items-center justify-between text-white"
            style={{
              background: index % 2 === 0
                ? 'linear-gradient(135deg, var(--royal-blue), #1d6fd4)'
                : 'linear-gradient(135deg, var(--secondary), #1d91d8)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Icon name={item.icon || 'GraduationCap'} className="text-white" size={18} />
              </div>
              <div>
                <div className="text-xs text-white/70 uppercase tracking-wide font-medium">
                  {item.category || (index % 2 === 0 ? 'UG Program' : 'PG Program')}
                </div>
                <div className="font-bold text-base">{item.title}</div>
              </div>
            </div>
            {item.year && (
              <div className="flex items-center gap-1.5 text-white/95 text-sm font-semibold">
                <Icon name="Clock" size={14} />
                <span>{item.year}</span>
              </div>
            )}
          </div>
          {/* Body */}
          <div className="p-8 flex flex-col flex-grow">
            {item.subtitle && (
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-2 font-semibold tracking-wide uppercase">
                {item.subtitle}
              </div>
            )}
            {item.description && (
              <p className="text-sm text-slate-500 dark:text-white/70 leading-relaxed mb-6 flex-grow">
                {item.description}
              </p>
            )}
            {item.highlights && item.highlights.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100 dark:border-white/10">
                {item.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-white/80">
                    <CheckCircle2 size={15} className="text-[var(--secondary)] shrink-0" />
                    <span className="truncate" title={highlight}>{highlight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <CardWrapper
        key={index}
        index={index}
        cardStyle={cardStyle}
        isDark={isDark}
        className="w-full cursor-default"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          <div className="flex-1">
            <h3 className={`mb-2 text-[var(--midnight-navy)] dark:text-white group-hover:text-[var(--royal-blue)] dark:group-hover:text-[var(--secondary)] transition-colors ${
              cardStyle === 'editorial' ? 'font-serif text-2xl font-medium' : 'font-sans text-xl font-semibold'
            }`}>
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-[var(--royal-blue)] dark:text-[var(--secondary)] font-medium mb-2 text-sm tracking-wide">
                {item.subtitle}
              </p>
            )}
            {item.description && (
              <p className="text-[var(--midnight-navy)]/60 dark:text-white/60 text-sm leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          {item.year && (
            <div className="mt-2 md:mt-0 flex-shrink-0">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-br from-[var(--secondary)] to-[var(--royal-blue)] rounded-xl text-white text-sm font-semibold tracking-wider shadow-sm group-hover:shadow transition-shadow">
                {item.year}
              </div>
            </div>
          )}
        </div>
        {item.highlights && item.highlights.length > 0 && (
          <div className="pt-5 border-t border-[var(--midnight-navy)]/10 dark:border-white/10">
            <ul className="space-y-3">
              {item.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start text-[var(--midnight-navy)]/70 dark:text-white/70 text-sm">
                  <div className="w-1.5 h-1.5 bg-[var(--secondary)] transform rotate-45 mt-2 mr-3.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardWrapper>
    );
  };

  // Sub-renderer for collaboration model (Industry + Academia)
  const renderCollaborationCard = (item: CardItem, index: number) => {
    const isMiddle = index === 1;
    return (
      <div
        key={index}
        className="relative p-8 text-center rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border hover:shadow-xl hover:-translate-y-1.5"
        style={{
          background: isMiddle ? 'linear-gradient(135deg, var(--royal-blue), var(--secondary))' : 'rgba(255,255,255,1)',
          borderColor: isMiddle ? 'transparent' : 'rgba(21,86,178,0.1)'
        }}
      >
        <div
          className="text-5xl font-bold mb-4 font-mono select-none"
          style={{
            color: isMiddle ? 'rgba(255,255,255,0.2)' : 'rgba(21,86,178,0.1)',
            lineHeight: 1
          }}
        >
          {item.year || String(index + 1).padStart(2, '0')}
        </div>
        
        {item.icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isMiddle ? 'bg-white/10' : 'bg-[var(--royal-blue)]/5'
            }`}
          >
            <Icon
              name={item.icon}
              className={isMiddle ? 'text-white' : 'text-[var(--royal-blue)]'}
              size={22}
            />
          </div>
        )}

        <h3
          className="text-xl font-bold mb-4"
          style={{ color: isMiddle ? '#fff' : 'var(--midnight-navy)' }}
        >
          {item.title}
        </h3>
        
        {item.description && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: isMiddle ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.7)' }}
          >
            {item.description}
          </p>
        )}
      </div>
    );
  };

  // Sub-renderer for testimonials (floating quote badge style)
  const renderTestimonialCard = (item: CardItem, index: number) => {
    return (
      <CardWrapper
        key={index}
        index={index}
        cardStyle={cardStyle}
        isDark={isDark}
        padding="p-8"
        className="cursor-default"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--champagne-gold)] to-[var(--royal-blue)] rounded-xl flex items-center justify-center border border-slate-200/50 dark:border-white/10 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Quote className="text-white" size={16} />
          </div>
          {item.rating && (
            <div className="flex gap-0.5">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} size={15} className="text-[var(--champagne-gold)]" fill="var(--champagne-gold)" />
              ))}
            </div>
          )}
        </div>

        {item.description && (
          <p className="text-[var(--midnight-navy)]/80 dark:text-white/80 mb-6 leading-relaxed italic text-sm flex-1">
            "{item.description}"
          </p>
        )}

        <div className="pt-4 border-t border-[var(--midnight-navy)]/10 dark:border-white/10 mt-auto">
          <div className="text-[var(--midnight-navy)] dark:text-white font-semibold text-sm">
            {item.title}
          </div>
          {item.subtitle && (
            <div className="text-[var(--midnight-navy)]/60 dark:text-white/60 text-xs mt-0.5 font-medium">
              {item.subtitle}
            </div>
          )}
        </div>
      </CardWrapper>
    );
  };

  // Sub-renderer for roadmap phase cards (dark backgrounds)
  const renderRoadmapCard = (item: CardItem, index: number) => {
    return (
      <CardWrapper
        key={index}
        index={index}
        cardStyle={cardStyle}
        isDark={isDark}
      >
        {item.year && (
          <div className="text-[var(--champagne-gold)] mb-4 font-serif font-bold text-lg tracking-wide">
            {item.year}
          </div>
        )}
        <h3 className={`mb-6 text-white dark:text-white transition-colors ${
          cardStyle === 'editorial' ? 'font-serif text-2xl font-medium' : 'font-sans text-xl font-semibold'
        }`}>
          {item.title}
        </h3>
        {item.highlights && item.highlights.length > 0 && (
          <ul className="space-y-4 flex-1">
            {item.highlights.map((h, idx) => (
              <li key={idx} className="flex items-start gap-3 text-white/80 dark:text-white/80 text-sm">
                <ArrowRight className="text-[var(--champagne-gold)] flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" size={16} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </CardWrapper>
    );
  };

  // Sub-renderer for institution building checklist cards
  const renderAchievementCard = (item: CardItem, index: number) => {
    return (
      <CardWrapper
        key={index}
        index={index}
        cardStyle={cardStyle}
        isDark={isDark}
      >
        <h3 className={`mb-6 text-[var(--midnight-navy)] dark:text-white transition-colors ${
          cardStyle === 'editorial' ? 'font-serif text-2xl font-medium' : 'font-sans text-xl font-semibold'
        }`}>
          {item.title}
        </h3>
        {item.highlights && item.highlights.length > 0 && (
          <ul className="space-y-4 text-sm flex-1">
            {item.highlights.map((h, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[var(--secondary)]/10 dark:bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[var(--secondary)]/30 group-hover:bg-[var(--secondary)] group-hover:text-white transition-colors">
                  <CheckCircle2 className="text-[var(--secondary)] group-hover:text-white" size={14} />
                </div>
                <span className="text-[#1E293B]/75 dark:text-white/75 leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        )}
      </CardWrapper>
    );
  };

  // Sub-renderer for Thought Leadership publications
  const renderThoughtLeadershipCard = (item: CardItem, index: number) => {
    return (
      <CardWrapper
        key={index}
        index={index}
        cardStyle={cardStyle}
        isDark={isDark}
        padding="p-0"
        className="h-full flex flex-col"
      >
        {cardStyle !== 'editorial' && (
          (item.imageUrl || item.image) ? (
            <div className="h-44 overflow-hidden relative flex-shrink-0 border-b border-white/5 bg-slate-100 dark:bg-slate-800">
              <img
                src={item.imageUrl || item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="h-36 bg-gradient-to-br from-[var(--royal-blue)] to-[var(--midnight-navy)] flex items-center justify-center flex-shrink-0 border-b border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_0)] bg-[size:16px_16px] pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(21,177,216,0.3)] transition-all duration-300">
                <BookOpen size={24} className="text-[var(--secondary)]" />
              </div>
            </div>
          )
        )}

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4 text-xs font-semibold">
            {item.category && (
              <span className="text-[var(--secondary)] px-3 py-1 bg-[var(--secondary)]/10 rounded-full tracking-wider uppercase text-[10px]">
                {item.category}
              </span>
            )}
            {item.year && (
              <span className="text-slate-400 dark:text-white/55 tracking-wider font-mono">
                {item.year}
              </span>
            )}
          </div>

          <h3 className={`mb-3 text-[#1E293B] dark:text-white group-hover:text-[var(--royal-blue)] dark:group-hover:text-[var(--secondary)] transition-colors line-clamp-2 ${
            cardStyle === 'editorial' ? 'font-serif text-xl font-medium' : 'font-sans text-base font-semibold leading-snug'
          }`}>
            {item.title}
          </h3>

          {item.description && (
            <p className="text-slate-500 dark:text-white/65 mb-5 leading-relaxed text-sm line-clamp-3 flex-1">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10 text-xs mt-auto">
            {item.subtitle && (
              <span className="text-slate-450 dark:text-white/55 font-medium truncate max-w-[55%] text-[11px]" title={item.subtitle}>
                {item.subtitle}
              </span>
            )}
            <button className="text-[var(--royal-blue)] dark:text-[var(--secondary)] flex items-center space-x-1 group-hover:text-[var(--secondary)] dark:group-hover:text-white transition-colors font-semibold tracking-wider uppercase text-[10px] whitespace-nowrap">
              <span>Read More</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </CardWrapper>
    );
  };

  // Sub-renderer for Media Highlights appearances
  const renderMediaHighlightCard = (item: CardItem, index: number) => {
    const isVideo = item.category === 'video';
    return (
      <CardWrapper
        key={index}
        index={index}
        cardStyle={cardStyle}
        isDark={isDark}
        padding="p-0"
        className="h-full flex flex-col"
      >
        {cardStyle !== 'editorial' && (
          <div className="aspect-video bg-gradient-to-br from-[var(--royal-blue)] to-[var(--midnight-navy)] flex items-center justify-center relative flex-shrink-0 border-b border-white/5 overflow-hidden">
            {(item.imageUrl || item.image) ? (
              <img
                src={item.imageUrl || item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_0)] bg-[size:16px_16px] pointer-events-none" />
                {isVideo ? (
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300">
                    <Play size={22} className="text-white ml-1" fill="white" />
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(21,177,216,0.3)] transition-all duration-300">
                    <Newspaper size={26} className="text-[var(--secondary)]" />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <h3 className={`mb-3 text-[#1E293B] dark:text-white group-hover:text-[var(--royal-blue)] dark:group-hover:text-[var(--secondary)] transition-colors line-clamp-2 ${
            cardStyle === 'editorial' ? 'font-serif text-lg font-medium' : 'font-sans text-sm font-semibold leading-snug'
          }`}>
            {item.title}
          </h3>
          {item.description && (
            <p className="text-slate-500 dark:text-white/65 text-xs mt-auto font-medium">
              {item.description}
            </p>
          )}
        </div>
      </CardWrapper>
    );
  };

  const cardRendererMap: Record<string, (item: CardItem, index: number) => React.ReactNode> = {
    standard: renderStandardCard,
    pillar: renderPillarCard,
    initiative: renderInitiativeCard,
    award: renderAwardCard,
    academic: renderAcademicCard,
    testimonial: renderTestimonialCard,
    roadmap: renderRoadmapCard,
    achievement: renderAchievementCard,
    thought_leadership: renderThoughtLeadershipCard,
    media_highlight: renderMediaHighlightCard,
    collaboration_model: renderCollaborationCard
  };

  const renderer = cardRendererMap[cardType] || renderStandardCard;

  if (cardType === 'research_table') {
    return (
      <section
        id={id}
        className={`py-24 relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-b from-[var(--dark-surface)] to-[var(--midnight-navy)] text-white'
            : 'bg-[var(--warm-white)] text-[var(--midnight-navy)]'
        }`}
      >
        <div className="section-container relative z-10">
          {/* Header */}
          <FadeIn
            variant="up"
            delay={0}
            className="text-center flex flex-col items-center justify-center mb-12 max-w-3xl mx-auto"
          >
            {category && (
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-4 ${
                isDark ? 'bg-white/20' : 'bg-[var(--royal-blue)]/10'
              }`}>
                {categoryIcon && <Icon name={categoryIcon} className={isDark ? 'text-white' : 'text-[var(--royal-blue)]'} size={18} />}
                <span className={isDark ? 'text-white/90' : 'text-[var(--royal-blue)] font-medium'}>{category}</span>
              </div>
            )}
            <h2
              className="mb-3 font-semibold text-center"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: isDark ? '#ffffff' : 'var(--midnight-navy)',
                lineHeight: '1.2'
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className={`text-center ${isDark ? 'text-white/80' : 'text-[var(--midnight-navy)]/70'}`} style={{ fontSize: '1.125rem' }}>
                {subtitle}
              </p>
            )}
          </FadeIn>

          {/* Table Container */}
          <FadeIn
            variant="up"
            delay={0}
            className="bg-white dark:bg-[var(--dark-surface)] rounded-2xl overflow-hidden border border-[var(--royal-blue)]/10 dark:border-white/10 shadow-lg"
          >
            <div
              className="grid grid-cols-1 md:grid-cols-2 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white"
              style={{ background: 'linear-gradient(135deg, var(--royal-blue), var(--secondary))' }}
            >
              <div>Research Domain</div>
              <div className="hidden md:block">Proposed Research Areas</div>
            </div>
            {visibleItems.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 px-8 py-6 gap-4 md:gap-0"
                style={{ borderTop: idx > 0 ? '1px solid rgba(21,86,178,0.08)' : 'none' }}
              >
                <div className="flex items-start gap-4 pr-8">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: idx % 2 === 0 ? 'rgba(21,86,178,0.1)' : 'rgba(21,177,216,0.1)'
                    }}
                  >
                    <Icon
                      name={item.icon || 'FlaskConical'}
                      size={18}
                      className={idx % 2 === 0 ? 'text-[var(--royal-blue)]' : 'text-[var(--secondary)]'}
                    />
                  </div>
                  <span className="text-base font-semibold pt-1.5 text-[var(--midnight-navy)] dark:text-white">
                    {item.title}
                  </span>
                </div>
                <div>
                  <div className="block md:hidden text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Proposed Research Areas</div>
                  <ul className="space-y-2.5">
                    {(item.highlights || []).map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-white/70">
                        <ChevronRight
                          size={14}
                          className="shrink-0 mt-1"
                          style={{
                            color: idx % 2 === 0 ? 'var(--royal-blue)' : 'var(--secondary)'
                          }}
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={`py-12 relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-b from-[var(--dark-surface)] to-[var(--midnight-navy)] text-white'
          : 'bg-[var(--warm-white)] text-[var(--midnight-navy)]'
      }`}
    >
      {isDark && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
      )}

      <div className="section-container relative z-10">
        <FadeIn
          variant="up"
          delay={0}
          className="text-center flex flex-col items-center justify-center mb-10 max-w-3xl mx-auto"
        >
          {category && (
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-4 ${
              isDark ? 'bg-white/20' : 'bg-[var(--royal-blue)]/10'
            }`}>
              {categoryIcon && <Icon name={categoryIcon} className={isDark ? 'text-white' : 'text-[var(--royal-blue)]'} size={18} />}
              <span className={isDark ? 'text-white/90' : 'text-[var(--royal-blue)] font-medium'}>{category}</span>
            </div>
          )}
          <h2
            className="mb-3 font-semibold text-center"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: isDark ? '#ffffff' : 'var(--midnight-navy)',
              lineHeight: '1.2'
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className={`text-center ${isDark ? 'text-white/80' : 'text-[var(--midnight-navy)]/70'}`} style={{ fontSize: '1.125rem' }}>
              {subtitle}
            </p>
          )}
        </FadeIn>

        {/* Dynamic Card Container. For 'academic' cards we render them stacked if columns === 1, otherwise in grid layout */}
        <div className={(cardType === 'academic' && (columns || 1) === 1) ? 'space-y-6 max-w-4xl mx-auto' : `grid ${gridColsClass} gap-6 items-stretch`}>
          {visibleItems.slice(0, visibleCount).map((item, index) => (
            <FadeIn
              key={index}
              variant="up"
              delay={Math.min(index * 60, 300)}
              className="h-full flex flex-col"
            >
              {renderer(item, index)}
            </FadeIn>
          ))}
        </div>

        {visibleItems.length > visibleCount && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 6, visibleItems.length))}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg border font-semibold text-sm transition-all hover:scale-105 active:scale-95 ${
                isDark 
                  ? 'border-white/20 hover:border-[var(--secondary)] bg-white/5 hover:bg-white/10 text-white' 
                  : 'border-[var(--royal-blue)]/30 hover:border-[var(--secondary)] bg-white hover:bg-[var(--royal-blue)]/5 text-[var(--midnight-navy)]'
              }`}
            >
              <span>Load More Awards ({visibleItems.length - visibleCount} remaining)</span>
            </button>
          </div>
        )}

        {viewAllLink && (
          <div className="mt-12 text-center">
            <Link
              href={viewAllLink.url}
              className={`inline-flex items-center space-x-2 transition-colors group font-semibold text-sm ${
                isDark ? 'text-[var(--secondary)] hover:text-white' : 'text-[var(--royal-blue)] hover:text-[var(--secondary)]'
              }`}
            >
              <span>{viewAllLink.label}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
