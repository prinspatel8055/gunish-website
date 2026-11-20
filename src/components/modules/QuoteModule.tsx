'use client';

import { useEffect, useRef, useState } from 'react';
import { QuoteBlockData } from '@/types/cms';
import OptimizedImage from '@/components/shared/OptimizedImage';

interface ExtendedQuoteBlockData extends QuoteBlockData {
  imageUrl?: string;
  image?: string;
  portraitUrl?: string;
  signature?: string;
  signaturePath?: string;
  accentShape?: string;
  backgroundTheme?: string;
  layout?: 'editorial' | 'simple' | 'split-flat' | 'card-testimonial';
  align?: 'left' | 'center';
  fontStyle?: 'serif' | 'sans';
  showAccents?: boolean;
  imageSize?: 'small' | 'medium' | 'large' | 'xl' | 'xxl';
}

interface QuoteModuleProps {
  id?: string;
  data: ExtendedQuoteBlockData;
}

// Solid geometric flat-topped double-quote icon matching the guide mockup
const FlatQuoteIcon = ({ className }: { className?: string }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h16v16H8c0 8 4 12 8 16v8C8 40 0 32 0 16V0zm24 0h16v16h-8c0 8 4 12 8 16v8c-8 0-16-8-16-16V0z" />
  </svg>
);

export default function QuoteModule({ id, data }: QuoteModuleProps) {
  // Support dynamic fields with fallback structures for CMS-driven content
  const quoteText = data.quote || '';
  const quoteAuthor = data.author || '';
  const quoteRole = data.citation || '';
  
  // Resolve portrait image from CMS image picker, fallback to standard portrait
  const quoteImage = data.image || data.imageUrl || data.portraitUrl || '/assets/images/portrait.png';
  const quoteSignature = data.signature || data.signaturePath || '';
  
  // Layout parameters
  const layoutVariant = data.layout || 'editorial';
  const alignMode = data.align || (layoutVariant === 'editorial' || layoutVariant === 'split-flat' ? 'left' : 'center');
  const isLeft = alignMode === 'left';
  const fontStyle = data.fontStyle || 'serif';
  const isSans = fontStyle === 'sans';
  const showAccents = data.showAccents !== false;
  const imageSize = data.imageSize || 'medium';

  // Font typography helpers
  const textFontClass = isSans ? 'font-sans' : 'font-serif';
  const textFontFamily = isSans ? 'var(--font-body)' : 'var(--font-heading)';

  // Portrait Sizing Resolution
  let sizeClasses = 'w-[280px] sm:w-[320px] lg:w-[340px] xl:w-[380px] h-[320px] sm:h-[360px] lg:h-[380px] xl:h-[420px]';
  if (imageSize === 'small') {
    sizeClasses = 'w-[240px] sm:w-[280px] lg:w-[300px] xl:w-[320px] h-[280px] sm:h-[320px] lg:h-[340px] xl:h-[360px]';
  } else if (imageSize === 'large') {
    sizeClasses = 'w-[320px] sm:w-[360px] lg:w-[400px] xl:w-[440px] h-[360px] sm:h-[400px] lg:h-[440px] xl:h-[480px]';
  } else if (imageSize === 'xl') {
    sizeClasses = 'w-[360px] sm:w-[400px] lg:w-[440px] xl:w-[480px] h-[400px] sm:h-[440px] lg:h-[480px] xl:h-[520px]';
  } else if (imageSize === 'xxl') {
    sizeClasses = 'w-[400px] sm:w-[440px] lg:w-[480px] xl:w-[520px] h-[440px] sm:h-[480px] lg:h-[520px] xl:h-[560px]';
  }

  // IntersectionObserver for trigger transitions
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const DefaultSignatureSVG = () => null;

  // 1. PREMIUM EDITORIAL LAYOUT VARIANT (Diagonal Geometry & Portrait Cutout)
  if (layoutVariant === 'editorial') {
    return (
      <section
        id={id}
        ref={sectionRef}
        className="
          relative overflow-hidden
          w-full
          py-10 md:py-12
          text-white
          bg-gradient-to-br from-[#061026] via-[var(--midnight-navy)] to-[var(--dark-surface)]
          border-b border-[var(--secondary)]/10
        "
      >
        {/* Luminous Spotlights for brightness distribution (Toggled by showAccents) */}
        {showAccents && (
          <>
            <div className="absolute left-[10%] top-[10%] w-[350px] h-[350px] rounded-full bg-[var(--royal-blue)]/12 blur-[120px] select-none pointer-events-none" />
            <div className="absolute right-[15%] bottom-[5%] w-[400px] h-[400px] rounded-full bg-[var(--secondary)]/5 blur-[150px] select-none pointer-events-none" />
          </>
        )}

        {/* Diagonal Parallel Background overlays (Toggled by showAccents - hidden on mobile/tablet) */}
        {showAccents && (
          <>
            <div 
              className={`
                hidden lg:block
                absolute right-0 top-0
                w-[50%] h-full
                bg-gradient-to-b from-[var(--royal-blue)]/80 to-[var(--midnight-navy)]/95
                origin-top-right
                select-none pointer-events-none
                border-l border-[var(--secondary)]/15
                transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[50ms]
              `}
              style={{
                transform: `skewX(-22deg) scaleX(${isInView ? 1 : 0.8}) translateX(${isInView ? '8px' : '80px'})`,
                opacity: isInView ? 1 : 0,
              }}
            />
            <div 
              className={`
                hidden lg:block
                absolute right-0 top-0
                w-[33%] h-full
                bg-gradient-to-b from-[var(--dark-surface)]/90 to-black/60
                origin-top-right
                select-none pointer-events-none
                border-l border-[var(--secondary)]/10
                transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[100ms]
              `}
              style={{
                transform: `skewX(-22deg) scaleX(${isInView ? 1 : 0.8}) translateX(${isInView ? '16px' : '120px'})`,
                opacity: isInView ? 1 : 0,
              }}
            />
            <div 
              className={`
                hidden lg:block
                absolute right-0 top-0
                w-[18%] h-full
                bg-black/30
                origin-top-right
                select-none pointer-events-none
                transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[150ms]
              `}
              style={{
                transform: `skewX(-22deg) scaleX(${isInView ? 1 : 0.8}) translateX(${isInView ? '24px' : '150px'})`,
                opacity: isInView ? 1 : 0,
              }}
            />
          </>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.015),transparent)] select-none pointer-events-none" />

        <div className="relative z-10 section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-16">
            
            {/* Left Column: Quote content (aligned left) */}
            <div className="flex flex-col items-center lg:items-start justify-center relative min-h-[300px] col-span-1 lg:col-span-7">
              <div className="relative flex flex-col items-center lg:items-start w-full max-w-[500px] pt-2 lg:pt-6 z-10 text-center lg:text-left">
                
                {/* 1. Quote Icon */}
                <div
                  className={`mb-6 transition-all duration-[600ms] ease-out ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-[15px]'
                  }`}
                >
                  <FlatQuoteIcon className="text-[var(--secondary)] w-12 h-10 opacity-95" />
                </div>

                {/* 2. Main Quote Text */}
                <blockquote
                  className={`
                    relative z-10
                    w-full
                    mb-8
                    text-2xl text-white text-center lg:text-left lg:text-[34px] xl:text-[36px]
                    ${textFontClass} leading-[1.25] tracking-tight
                    transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[100ms]
                    ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[15px]'}
                  `}
                  style={{
                    fontFamily: textFontFamily,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {quoteText}
                </blockquote>

                {/* 3. Signature & Citation Area */}
                <div
                  className={`flex justify-center lg:justify-start relative z-10 w-full mt-2 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[200ms] ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
                  }`}
                >
                  <div className="flex flex-col items-center lg:items-start">
                    {quoteSignature ? (
                      quoteSignature.startsWith('M') ? (
                        <svg
                          width="290" height="100" viewBox="0 0 180 65" fill="none"
                          className="mt-2 text-[var(--secondary)] opacity-95"
                        >
                          <path 
                            d={quoteSignature} 
                            stroke="currentColor" 
                            strokeWidth="2.0" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            style={{
                              strokeDasharray: 1000,
                              strokeDashoffset: isInView ? 0 : 1000,
                              transition: 'stroke-dashoffset 1.5s ease-in-out',
                            }}
                          />
                        </svg>
                      ) : (
                        <img
                          src={quoteSignature} alt="Signature"
                          className="object-contain h-20 md:h-28 mt-2 brightness-110 filter select-none pointer-events-none"
                        />
                      )
                    ) : (
                      <DefaultSignatureSVG />
                    )}

                    {quoteAuthor && (
                      <cite className="block mt-3 not-italic text-sm text-[var(--secondary)] font-medium">
                        — {quoteAuthor} {quoteRole ? `, ${quoteRole}` : ''}
                      </cite>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Portrait image cutout */}
            <div
              className={`flex items-end justify-center lg:justify-start self-end relative z-10 h-full col-span-1 lg:col-span-5 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[150ms] ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[40px]'
              }`}
            >
              <div className={`relative ${sizeClasses} -mb-10 lg:-mb-12`}>
                <OptimizedImage
                  src={quoteImage}
                  alt={quoteAuthor ? `${quoteAuthor} Portrait` : 'Leadership Portrait'}
                  className="object-contain object-bottom w-full h-full grayscale hover:grayscale-0 contrast-[1.12] brightness-[0.9] opacity-85 hover:opacity-100 transition-all duration-700 ease-out"
                  style={{
                    mixBlendMode: 'luminosity',
                  }}
                />

                {/* Foreground Parallax Stripe overlaying the bottom-right corner of the portrait */}
                {showAccents && (
                  <div 
                    className={`
                      absolute right-0 bottom-0
                      w-[35%] h-[105%]
                      bg-gradient-to-b from-[var(--royal-blue)] to-[var(--midnight-navy)]
                      origin-bottom-right
                      select-none pointer-events-none
                      z-20
                      border-l border-[var(--secondary)]/30
                      transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[250ms]
                    `}
                    style={{
                      transform: `skewX(-22deg) scaleX(${isInView ? 1 : 0.8}) translateX(${isInView ? 0 : '60px'})`,
                      opacity: isInView ? 1 : 0,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. MODERN SPLIT LAYOUT VARIANT (50/50 division, flat rectangular portrait on right)
  if (layoutVariant === 'split-flat') {
    return (
      <section
        id={id}
        ref={sectionRef}
        className="
          relative overflow-hidden
          w-full
          text-white
          bg-[#040d1a]
          border-b border-[var(--secondary)]/10
        "
      >
        {showAccents && (
          <div className="absolute left-[5%] top-[10%] w-[350px] h-[350px] rounded-full bg-[var(--royal-blue)]/8 blur-[100px] select-none pointer-events-none" />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch w-full min-h-[480px]">
          {/* Left Column: Text content */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-16 relative z-10 border-b lg:border-b-0 lg:border-r border-[var(--secondary)]/10">
            <div className="max-w-[480px] flex flex-col items-start text-left">
              
              {/* 1. Quote Icon */}
              <div
                className={`mb-6 transition-all duration-[600ms] ease-out ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-[10px]'
                }`}
              >
                <FlatQuoteIcon className="text-[var(--secondary)] w-10 h-8 opacity-95" />
              </div>

              {/* 2. Main Quote Text */}
              <blockquote
                className={`
                  w-full mb-8 text-xl sm:text-2xl lg:text-3xl
                  ${textFontClass} leading-[1.3] tracking-tight
                  transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[100ms]
                  ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[15px]'}
                `}
                style={{
                  fontFamily: textFontFamily,
                  whiteSpace: 'pre-line',
                }}
              >
                {quoteText}
              </blockquote>

              {/* 3. Signature & Author info */}
              <div
                className={`flex flex-col items-start mt-2 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[200ms] ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
                }`}
              >
                {quoteSignature ? (
                  quoteSignature.startsWith('M') ? (
                    <svg width="290" height="100" viewBox="0 0 180 65" fill="none" className="text-[var(--secondary)] opacity-95">
                      <path 
                        d={quoteSignature} stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round"
                        style={{
                          strokeDasharray: 1000,
                          strokeDashoffset: isInView ? 0 : 1000,
                          transition: 'stroke-dashoffset 1.5s ease-in-out',
                        }}
                      />
                    </svg>
                  ) : (
                    <OptimizedImage src={quoteSignature} alt="Signature" className="object-contain h-20 md:h-28 brightness-110 filter select-none pointer-events-none" />
                  )
                ) : (
                  <DefaultSignatureSVG />
                )}

                {quoteAuthor && (
                  <cite className="block mt-2 not-italic text-sm text-[var(--secondary)] font-medium">
                    — {quoteAuthor} {quoteRole ? `, ${quoteRole}` : ''}
                  </cite>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Flat Rectangular Portrait Image */}
          <div className="relative w-full h-[320px] sm:h-[400px] lg:h-auto overflow-hidden bg-[var(--midnight-navy)]">
            <OptimizedImage
              src={quoteImage}
              alt={quoteAuthor ? `${quoteAuthor} Portrait` : 'Leadership Portrait'}
              className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
            />
            {/* Soft dark visual overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>
    );
  }

  // 3. GLASS CARD TESTIMONIAL LAYOUT VARIANT (Contained within a premium card)
  if (layoutVariant === 'card-testimonial') {
    return (
      <section
        id={id}
        ref={sectionRef}
        className="
          relative overflow-hidden
          w-full
          py-0 sm:py-12 md:py-16
          text-white
          bg-gradient-to-br from-[var(--midnight-navy)]/90 via-[var(--dark-surface)] to-[var(--midnight-navy)]/90
          border-b border-[var(--secondary)]/10
        "
      >
        {/* Background spotlights (Toggled by showAccents) */}
        {showAccents && (
          <>
            <div className="absolute left-[15%] top-[15%] w-[400px] h-[400px] rounded-full bg-[var(--royal-blue)]/8 blur-[130px] select-none pointer-events-none" />
            <div className="absolute right-[15%] bottom-[15%] w-[400px] h-[400px] rounded-full bg-[var(--secondary)]/4 blur-[130px] select-none pointer-events-none" />
          </>
        )}

        <div className="relative z-10 section-container">
          <div
            className={`
              mx-auto max-w-[680px]
              p-6 sm:p-8 md:p-12
              rounded-none sm:rounded-2xl
              bg-white/[0.03] backdrop-blur-md
              border-y sm:border border-[var(--secondary)]/15
              shadow-[0_20px_50px_rgba(0,0,0,0.4)]
              flex flex-col ${isLeft ? 'items-start text-left' : 'items-center text-center'}
              transition-all duration-[800ms] ease-out
              ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'}
            `}
          >
            {/* 1. Quote Icon */}
            <div className="mb-6">
              <FlatQuoteIcon className={`text-[var(--secondary)] w-10 h-8 opacity-90 ${isLeft ? '' : 'mx-auto'}`} />
            </div>

            {/* 2. Main Quote Text */}
            <blockquote
              className={`
                w-full
                mb-8
                text-xl md:text-2xl lg:text-[28px]
                ${textFontClass} leading-[1.35]
              `}
              style={{
                fontFamily: textFontFamily,
                whiteSpace: 'pre-line',
              }}
            >
              {quoteText}
            </blockquote>

            {/* 3. Signature & Citation Area */}
            <div className={`flex flex-col ${isLeft ? 'items-start' : 'items-center'} mt-2`}>
              {quoteSignature ? (
                quoteSignature.startsWith('M') ? (
                  <svg width="290" height="100" viewBox="0 0 180 65" fill="none" className="text-[var(--secondary)] opacity-95">
                    <path 
                      d={quoteSignature} 
                      stroke="currentColor" 
                      strokeWidth="2.0" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      style={{
                        strokeDasharray: 1000,
                        strokeDashoffset: isInView ? 0 : 1000,
                        transition: 'stroke-dashoffset 1.5s ease-in-out',
                      }}
                    />
                  </svg>
                ) : (
                  <OptimizedImage src={quoteSignature} alt="Signature" className="object-contain h-20 md:h-28 brightness-110 filter select-none pointer-events-none" />
                )
              ) : (
                <DefaultSignatureSVG />
              )}

              {quoteAuthor && (
                <cite className="block mt-3 not-italic text-sm text-[var(--secondary)] font-medium">
                  — {quoteAuthor} {quoteRole ? `, ${quoteRole}` : ''}
                </cite>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 4. SIMPLE CLASSIC LAYOUT VARIANT (Centred Quote, no portrait)
  return (
    <section
      id={id}
      ref={sectionRef}
      className="
        relative overflow-hidden
        w-full
        py-12 md:py-16
        text-white
        bg-gradient-to-br from-[var(--midnight-navy)]/90 via-[var(--dark-surface)] to-[var(--midnight-navy)]/90
        border-b border-[var(--secondary)]/10
      "
    >
      {/* Background spotlights (Toggled by showAccents) */}
      {showAccents && (
        <>
          <div className="absolute left-[20%] top-[20%] w-[400px] h-[400px] rounded-full bg-[var(--royal-blue)]/10 blur-[150px] select-none pointer-events-none" />
          <div className="absolute right-[20%] bottom-[20%] w-[400px] h-[400px] rounded-full bg-[var(--secondary)]/5 blur-[150px] select-none pointer-events-none" />
        </>
      )}

      <div
        className={`
          relative z-10
          max-w-[700px]
          mx-auto px-6
          flex flex-col ${isLeft ? 'items-start text-left' : 'items-center text-center'} justify-center
        `}
      >
        {/* 1. Quote Icon */}
        <div
          className={`mb-8 transition-all duration-[600ms] ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-[10px]'
          }`}
        >
          <FlatQuoteIcon className={`text-[var(--secondary)] w-12 h-10 opacity-95 ${isLeft ? '' : 'mx-auto'}`} />
        </div>

        {/* 2. Main Quote Text */}
        <blockquote
          className={`
            w-full
            mb-8
            text-2xl md:text-3xl lg:text-[32px]
            ${textFontClass} leading-[1.35] tracking-normal
            transition-all duration-[800ms] ease-out delay-[100ms]
            ${isInView ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            fontFamily: textFontFamily,
            whiteSpace: 'pre-line',
          }}
        >
          {quoteText}
        </blockquote>

        {/* 3. Signature & Citation Area */}
        <div
          className={`flex flex-col ${isLeft ? 'items-start' : 'items-center'} justify-center mt-2 transition-all duration-[800ms] ease-out delay-[200ms] ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
          }`}
        >
          {quoteSignature ? (
            quoteSignature.startsWith('M') ? (
              <svg
                width="290" height="100" viewBox="0 0 180 65" fill="none"
                className="text-[var(--secondary)] opacity-95"
              >
                <path 
                  d={quoteSignature} 
                  stroke="currentColor" 
                  strokeWidth="2.0" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{
                    strokeDasharray: 1000,
                    strokeDashoffset: isInView ? 0 : 1000,
                    transition: 'stroke-dashoffset 1.5s ease-in-out',
                  }}
                />
              </svg>
            ) : (
              <OptimizedImage
                src={quoteSignature} alt="Signature"
                className="object-contain h-16 md:h-20 brightness-110 filter select-none pointer-events-none"
              />
            )
          ) : (
            <DefaultSignatureSVG />
          )}

          {quoteAuthor && (
            <cite className="block mt-3 not-italic text-sm text-[var(--secondary)] font-medium">
              — {quoteAuthor} {quoteRole ? `, ${quoteRole}` : ''}
            </cite>
          )}
        </div>
      </div>
    </section>
  );
}
