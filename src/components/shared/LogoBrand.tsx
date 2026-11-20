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

  // Sizing configurations
  // In footer we want it noticeably larger as requested ("size moti kar")
  const headerSizes = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11 md:h-12',
    lg: 'h-12 sm:h-13 md:h-14',
    xl: 'h-14 sm:h-16 md:h-18',
  };

  const footerSizes = {
    sm: 'h-11 sm:h-13',
    md: 'h-13 sm:h-15',
    lg: 'h-14 sm:h-16 md:h-18',
    xl: 'h-16 sm:h-18 md:h-20',
  };

  const heightClass = isFooter
    ? footerSizes[size] || footerSizes.lg
    : headerSizes[size] || headerSizes.md;

  if (isFooter) {
    return (
      <Link
        href="/"
        aria-label="Ganpat University - GUNICSH Home"
        className={`group/logo-reveal relative inline-flex items-center gap-3 sm:gap-5 p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] border border-white/40 transition-all duration-300 hover:shadow-[0_16px_45px_rgba(217,119,6,0.3)] hover:scale-[1.02] overflow-hidden select-none logo-reveal-active ${className}`}
      >
        {/* Animated Light Sheen Sweep (Logo Reveal Effect) */}
        <div className="absolute inset-0 w-1/3 -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-black/[0.08] to-transparent pointer-events-none group-hover/logo-reveal:animate-[logoSheenSweep_1.2s_ease-in-out_forwards]" />

        {/* Logo 1: Ganpat University • Faculty of Social Sciences & Humanities */}
        <div className="relative shrink-0 transition-transform duration-300 group-hover/logo-reveal:scale-[1.02]">
          <img
            src="/uploads/logo-gnu-fssh.png"
            alt="Ganpat University - Faculty of Social Sciences & Humanities"
            className={`${heightClass} w-auto max-w-[220px] sm:max-w-[280px] md:max-w-[340px] object-contain transition-all duration-300`}
            loading="lazy"
          />
        </div>

        {/* Elegant Animated Vertical Divider */}
        <div className="h-10 sm:h-12 md:h-14 w-[1.5px] bg-gradient-to-b from-[#A81C24]/20 via-[#A81C24]/70 to-[#A81C24]/20 shrink-0 transition-all duration-300 group-hover/logo-reveal:via-[#D97706] group-hover/logo-reveal:scale-y-110" />

        {/* Logo 2: GUNICSH International Conference */}
        <div className="relative shrink-0 transition-transform duration-300 group-hover/logo-reveal:scale-[1.03]">
          <img
            src="/uploads/logo-gunicsh-conf.png"
            alt="GUNICSH International Conference"
            className={`${heightClass} w-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] object-contain transition-all duration-300 group-hover/logo-reveal:brightness-105`}
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
      className={`group/logo-reveal relative inline-flex items-center gap-2 sm:gap-3.5 py-1 z-10 shrink-0 select-none overflow-hidden rounded-xl transition-all duration-300 logo-reveal-active ${className}`}
    >
      {/* Animated Light Sweep Reveal Effect on Hover */}
      <div className="absolute inset-0 w-1/3 -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none group-hover/logo-reveal:animate-[logoSheenSweep_1.2s_ease-in-out_forwards]" />

      {/* Logo 1: Ganpat University */}
      <div className="relative shrink-0 transition-transform duration-300 group-hover/logo-reveal:scale-[1.02]">
        <img
          src="/uploads/logo-gnu-fssh.png"
          alt="Ganpat University - Faculty of Social Sciences & Humanities"
          className={`${heightClass} w-auto max-w-[190px] sm:max-w-[240px] md:max-w-[280px] object-contain transition-transform duration-300`}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Elegant Vertical Divider */}
      <div className="h-7 sm:h-8 md:h-10 w-[1.5px] bg-gradient-to-b from-transparent via-slate-300 to-transparent shrink-0 transition-all duration-300 group-hover/logo-reveal:via-[#A81C24]" />

      {/* Logo 2: GUNICSH Conference Logo */}
      <div className="relative shrink-0 transition-transform duration-300 group-hover/logo-reveal:scale-[1.025]">
        <img
          src="/uploads/logo-gunicsh-conf.png"
          alt="GUNICSH International Conference"
          className={`${heightClass} w-auto max-w-[120px] sm:max-w-[150px] md:max-w-[180px] object-contain transition-transform duration-300`}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </Link>
  );
}
