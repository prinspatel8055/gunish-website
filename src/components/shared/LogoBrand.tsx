'use client';

import React from 'react';
import Link from 'next/link';

interface LogoBrandProps {
  variant?: 'header' | 'footer';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function LogoBrand({
  variant = 'header',
  className = '',
  size = 'md',
}: LogoBrandProps) {
  const isFooter = variant === 'footer';

  // Responsive sizing tailored so neither header nor footer ever overflows
  const headerSizes = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-10 md:h-11',
    lg: 'h-11 sm:h-12 md:h-13',
    xl: 'h-12 sm:h-14 md:h-15',
  };

  const footerSizes = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-10 md:h-11',
    lg: 'h-10 sm:h-11 md:h-12',
    xl: 'h-11 sm:h-12 md:h-13',
  };

  const heightClass = isFooter
    ? footerSizes[size] || footerSizes.lg
    : headerSizes[size] || headerSizes.md;

  if (isFooter) {
    return (
      <Link
        href="/"
        aria-label="Ganpat University - GUNICSH Home"
        className={`group/logo-reveal relative inline-flex items-center gap-2.5 sm:gap-3.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-white/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(217,119,6,0.3)] hover:scale-[1.015] overflow-hidden select-none max-w-full logo-reveal-active ${className}`}
      >
        {/* Animated Light Sheen Sweep (Logo Reveal Effect) */}
        <div className="absolute inset-0 w-1/2 -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-slate-400/20 to-transparent pointer-events-none group-hover/logo-reveal:animate-[logoSheenSweep_1.2s_ease-in-out_forwards]" />

        {/* Logo 1: Ganpat University • Faculty of Social Sciences & Humanities */}
        <div className="relative shrink min-w-0 transition-transform duration-300 group-hover/logo-reveal:scale-[1.02]">
          <img
            src="/uploads/logo-gnu-fssh.png"
            alt="Ganpat University - Faculty of Social Sciences & Humanities"
            className={`${heightClass} w-auto max-w-[210px] sm:max-w-[230px] md:max-w-[250px] object-contain transition-all duration-300`}
            loading="lazy"
          />
        </div>

        {/* Elegant Animated Vertical Divider */}
        <div className="h-7 sm:h-8 md:h-9 w-[1.5px] bg-gradient-to-b from-[#A81C24]/20 via-[#A81C24]/70 to-[#A81C24]/20 shrink-0 transition-all duration-300 group-hover/logo-reveal:via-[#D97706] group-hover/logo-reveal:scale-y-110" />

        {/* Logo 2: GUNICSH International Conference (Clean transparent, no gray background) */}
        <div className="relative shrink min-w-0 transition-transform duration-300 group-hover/logo-reveal:scale-[1.03]">
          <img
            src="/uploads/logo-gunicsh-conf.png"
            alt="GUNICSH International Conference"
            className={`${heightClass} w-auto max-w-[110px] sm:max-w-[125px] md:max-w-[140px] object-contain transition-all duration-300 group-hover/logo-reveal:brightness-105`}
            loading="lazy"
          />
        </div>
      </Link>
    );
  }

  // Header Variant (Clean, crisp, integrated with sticky navbar)
  return (
    <Link
      href="/"
      aria-label="Ganpat University - GUNICSH Home"
      className={`group/logo-reveal relative inline-flex items-center gap-2 sm:gap-3.5 py-1 z-10 shrink-0 select-none overflow-hidden rounded-xl transition-all duration-300 max-w-full logo-reveal-active ${className}`}
    >
      {/* Animated Light Sweep Reveal Effect on Hover */}
      <div className="absolute inset-0 w-1/3 -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none group-hover/logo-reveal:animate-[logoSheenSweep_1.2s_ease-in-out_forwards]" />

      {/* Logo 1: Ganpat University */}
      <div className="relative shrink min-w-0 transition-transform duration-300 group-hover/logo-reveal:scale-[1.02]">
        <img
          src="/uploads/logo-gnu-fssh.png"
          alt="Ganpat University - Faculty of Social Sciences & Humanities"
          className={`${heightClass} w-auto max-w-[190px] sm:max-w-[240px] md:max-w-[280px] object-contain transition-transform duration-300`}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Elegant Vertical Divider */}
      <div className="h-7 sm:h-8 md:h-9 w-[1.5px] bg-gradient-to-b from-transparent via-slate-300 to-transparent shrink-0 transition-all duration-300 group-hover/logo-reveal:via-[#A81C24]" />

      {/* Logo 2: GUNICSH Conference Logo */}
      <div className="relative shrink min-w-0 transition-transform duration-300 group-hover/logo-reveal:scale-[1.025]">
        <img
          src="/uploads/logo-gunicsh-conf.png"
          alt="GUNICSH International Conference"
          className={`${heightClass} w-auto max-w-[110px] sm:max-w-[130px] md:max-w-[150px] object-contain transition-transform duration-300`}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </Link>
  );
}
