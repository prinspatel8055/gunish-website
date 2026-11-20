'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { HeroBlockData } from '@/types/cms';

// ─── CSS-native hero animations (no JS required) ────────────────────────────
const heroKeyframes = `
  @keyframes hero-fade-up {
    from { opacity: 0; transform: translateY(18px); filter: blur(3px); }
    to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
  }
  @keyframes hero-fade-scale {
    from { opacity: 0; transform: scale(0.97);  filter: blur(3px); }
    to   { opacity: 1; transform: scale(1);     filter: blur(0);   }
  }
  @keyframes hero-scroll-dot {
    0%, 100% { transform: translateY(0);   opacity: 1;   }
    50%       { transform: translateY(6px); opacity: 0.4; }
  }
  .hero-fade-up {
    animation: hero-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .hero-fade-scale {
    animation: hero-fade-scale 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
  }
  .hero-scroll-dot {
    animation: hero-scroll-dot 1.6s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) {
    .hero-fade-up, .hero-fade-scale, .hero-scroll-dot,
    .net-pulse, .net-wave, .net-float, .net-signal {
      animation: none !important;
      transition: none !important;
    }
  }
`;

const NextGenNetworkIllustration = () => (
  <svg
    viewBox="0 0 500 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-[420px] h-auto select-none"
    aria-hidden="true"
  >
    <defs>
      <style>{`
        @keyframes net-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.98); }
          50%       { opacity: 0.9; transform: scale(1.04); }
        }
        @keyframes net-wave {
          0%   { stroke-dashoffset: 0; opacity: 0.8; }
          100% { stroke-dashoffset: -60; opacity: 0.1; }
        }
        @keyframes net-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes net-signal {
          0%   { r: 2; opacity: 0.9; }
          100% { r: 16; opacity: 0; }
        }
        .net-pulse { animation: net-pulse 3s ease-in-out infinite; }
        .net-wave  { stroke-dasharray: 6 4; animation: net-wave 2.5s linear infinite; }
        .net-float { animation: net-float 5s ease-in-out infinite; }
        .net-signal { animation: net-signal 2s ease-out infinite; }
      `}</style>
      
      <radialGradient id="net-tower-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#15B1D8" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#1556B2" stopOpacity="0" />
      </radialGradient>
      
      <radialGradient id="net-base-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1556B2" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#1556B2" stopOpacity="0" />
      </radialGradient>
      
      <filter id="net-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#1556B2" floodOpacity="0.15" />
      </filter>
    </defs>

    {/* Base Ambient Field */}
    <ellipse cx="250" cy="300" rx="190" ry="50" fill="url(#net-base-glow)" />

    {/* Electromagnetic Wavefronts radiating outward */}
    <g className="net-pulse" opacity="0.6">
      <circle cx="250" cy="180" r="40" stroke="#15B1D8" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="250" cy="180" r="70" stroke="#1556B2" strokeWidth="1.2" strokeDasharray="4 4" />
      <circle cx="250" cy="180" r="105" stroke="#15B1D8" strokeWidth="0.8" strokeDasharray="2 4" />
      <circle cx="250" cy="180" r="145" stroke="#1556B2" strokeWidth="0.5" strokeDasharray="1 5" />
    </g>

    {/* Signal Wave Rays */}
    <path d="M140 180 Q195 130 250 180 T360 180" stroke="#15B1D8" strokeWidth="1.5" fill="none" className="net-wave" opacity="0.5" />
    <path d="M120 200 Q185 150 250 200 T380 200" stroke="#1556B2" strokeWidth="1.2" fill="none" className="net-wave" opacity="0.4" />

    {/* Network Constellation Nodes */}
    <g stroke="#1556B2" strokeWidth="0.8" opacity="0.45">
      <line x1="250" y1="180" x2="160" y2="120" />
      <line x1="250" y1="180" x2="340" y2="110" />
      <line x1="250" y1="180" x2="130" y2="240" />
      <line x1="250" y1="180" x2="370" y2="250" />
      <line x1="160" y1="120" x2="340" y2="110" strokeDasharray="3 3" />
      <line x1="130" y1="240" x2="370" y2="250" strokeDasharray="3 3" />
    </g>

    {/* Satellite / Remote Node Left */}
    <g transform="translate(145, 105)" className="net-float">
      <circle cx="15" cy="15" r="12" fill="#1556B2" fillOpacity="0.1" stroke="#1556B2" strokeWidth="1" />
      <circle cx="15" cy="15" r="4" fill="#1556B2" />
      <circle cx="15" cy="15" r="8" stroke="#15B1D8" strokeWidth="1" className="net-signal" />
    </g>

    {/* Satellite / Remote Node Right */}
    <g transform="translate(325, 95)" className="net-float" style={{ animationDelay: '1.2s' }}>
      <circle cx="15" cy="15" r="12" fill="#15B1D8" fillOpacity="0.1" stroke="#15B1D8" strokeWidth="1" />
      <circle cx="15" cy="15" r="4" fill="#15B1D8" />
      <circle cx="15" cy="15" r="8" stroke="#C89E4C" strokeWidth="1" className="net-signal" />
    </g>

    {/* Central Phased-Array 5G Antenna Mast */}
    <g filter="url(#net-shadow)">
      {/* Tower Truss */}
      <polygon points="244,180 256,180 265,300 235,300" fill="#0f2b48" stroke="#1556B2" strokeWidth="1.5" />
      <line x1="241" y1="210" x2="259" y2="210" stroke="#15B1D8" strokeWidth="1.5" />
      <line x1="238" y1="240" x2="262" y2="240" stroke="#15B1D8" strokeWidth="1.5" />
      <line x1="235" y1="270" x2="265" y2="270" stroke="#15B1D8" strokeWidth="1.5" />
      <line x1="244" y1="180" x2="262" y2="240" stroke="#60A5FA" strokeWidth="0.8" />
      <line x1="256" y1="180" x2="238" y2="240" stroke="#60A5FA" strokeWidth="0.8" />
      <line x1="238" y1="240" x2="265" y2="300" stroke="#60A5FA" strokeWidth="0.8" />
      <line x1="262" y1="240" x2="235" y2="300" stroke="#60A5FA" strokeWidth="0.8" />
      
      {/* Antenna Array Head */}
      <rect x="238" y="150" width="24" height="30" rx="3" fill="#1556B2" stroke="#15B1D8" strokeWidth="1.5" />
      <line x1="250" y1="130" x2="250" y2="150" stroke="#15B1D8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="250" cy="130" r="5" fill="#15B1D8" />
      <circle cx="250" cy="130" r="14" fill="url(#net-tower-glow)" />
    </g>

    {/* Live Telemetry Card (Top Right) */}
    <g transform="translate(325, 45)" className="net-float" style={{ animationDelay: '0.6s' }}>
      <rect x="0" y="0" width="130" height="72" rx="8" fill="white" fillOpacity="0.95" stroke="#cbd5e1" strokeWidth="1" filter="url(#net-shadow)" />
      <circle cx="12" cy="13" r="3.5" fill="#10b981" />
      <text x="20" y="16" fontSize="7" fontWeight="bold" fill="#0f2b48" fontFamily="monospace">CARRIER ONLINE</text>
      <text x="9" y="32" fontSize="7" fill="#475569" fontFamily="monospace">FREQ: 28.5 GHz mmW</text>
      <text x="9" y="44" fontSize="7" fill="#475569" fontFamily="monospace">BW:   400 MHz MIMO</text>
      <text x="9" y="56" fontSize="7" fill="#1556B2" fontFamily="monospace" fontWeight="bold">REL:  3GPP Rel-17</text>
      <path d="M85 30 L95 24 L102 34 L112 18 L118 26" stroke="#15B1D8" strokeWidth="1.5" fill="none" />
      <circle cx="118" cy="26" r="2" fill="#15B1D8" />
    </g>

    {/* SDN Core Card (Bottom Left) */}
    <g transform="translate(35, 230)" className="net-float" style={{ animationDelay: '1.8s' }}>
      <rect x="0" y="0" width="110" height="48" rx="8" fill="white" fillOpacity="0.95" stroke="#cbd5e1" strokeWidth="1" filter="url(#net-shadow)" />
      <text x="8" y="16" fontSize="7" fontWeight="bold" fill="#1556B2" fontFamily="monospace">SDN / NFV CORE</text>
      <text x="8" y="28" fontSize="8" fontWeight="bold" fill="#0f2b48" fontFamily="monospace">LATENCY: &lt;1ms</text>
      <text x="8" y="39" fontSize="7" fill="#10b981" fontFamily="monospace" fontWeight="bold">STATUS: ACTIVE</text>
      <circle cx="95" cy="14" r="3" fill="#15B1D8" className="net-signal" />
    </g>
  </svg>
);

export default function SubpageHeroClient({ id, data }: { id?: string; data: HeroBlockData }) {
  const pathname = usePathname();
  const {
    title,
    subtitle,
    description,
    primaryCTA,
    secondaryCTA,
    variant,
    subpageHeight = 'medium',
    subpageAlign = 'left',
    lightBgStyle = 'grid-dots',
    lightGradientPos = 'none'
  } = data;

  const resolvedVariant = variant || 'subpage-dark';
  const isLight = resolvedVariant === 'subpage-light';
  const isShortSubtitle = subtitle && subtitle.length < 35;
  const height = subpageHeight || 'medium';
  const align = subpageAlign || 'left';
  const isCenter = align === 'center';
  
  // Choose height and padding classes
  let heightClass = 'min-h-[220px] pt-10 pb-12 md:pt-12 md:pb-14';
  if (height === 'short') {
    heightClass = 'min-h-[160px] pt-6 pb-8 md:pt-8 md:pb-10';
  } else if (height === 'full') {
    heightClass = 'min-h-[calc(100vh-114px)] pt-14 pb-20 md:pt-16 md:pb-24';
  }

  const bgImage = data.bgImage;

  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...pathParts.map((part, index) => {
      const href = '/' + pathParts.slice(0, index + 1).join('/');
      const label = part
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { label, href };
    })
  ];

  const renderBreadcrumbs = (centered = false) => {
    if (breadcrumbs.length <= 1) return null;
    return (
      <nav aria-label="breadcrumb" className={`mt-4 select-none w-full ${centered ? 'flex justify-center' : 'flex justify-start'}`}>
        <ol className="inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold font-sans">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <li key={item.href} className="inline-flex items-center">
                {index > 0 && <span className="mx-2 text-slate-350 font-normal select-none">&gt;</span>}
                {isLast ? (
                  <span className="text-[var(--royal-blue)] font-bold">{item.label}</span>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-slate-400 hover:text-[var(--royal-blue)] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  };

  return (
    <>
    <style dangerouslySetInnerHTML={{ __html: heroKeyframes }} />
    <section 
      id={id} 
      className={`relative overflow-hidden flex items-center border-b ${
        isLight 
          ? 'text-slate-800 border-slate-200/50' 
          : 'text-white border-slate-200/10'
      } ${heightClass}`}
      style={{
        background: isLight 
          ? (lightBgStyle === 'slate-tint' ? '#f8fafc' : '#ffffff')
          : (bgImage ? '#090d16' : 'linear-gradient(135deg, var(--midnight-navy) 0%, var(--royal-blue) 60%, var(--secondary) 100%)')
      }}
    >
      {/* Background Image & Overlay (Dark mode subpage only) */}
      {!isLight && bgImage && (
        <>
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <img
              src={bgImage}
              alt="Hero Background"
              className="w-full h-full object-cover object-center opacity-25"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent pointer-events-none" />
        </>
      )}

      {/* Delicate technical grid & dot matrix background layers (Light mode only) */}
      {isLight && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 98%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 98%)'
            }}
          >
            {/* Engineering Grid Pattern */}
            {(lightBgStyle === 'grid-dots' || lightBgStyle === 'grid' || lightBgStyle === 'slate-tint') && (
              <div 
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(21,86,178,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(21,86,178,0.035)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" 
              />
            )}
            {/* Coordinate Dot Matrix Pattern */}
            {(lightBgStyle === 'grid-dots' || lightBgStyle === 'dots' || lightBgStyle === 'slate-tint') && (
              <div 
                className="absolute inset-0 bg-[radial-gradient(rgba(21,86,178,0.05)_1.5px,transparent_1.5px)] bg-[size:1.75rem_1.75rem]" 
              />
            )}
          </div>

          {/* Corner Spotlight Gradients */}
          {(lightGradientPos === 'top-right' || lightGradientPos === 'both') && (
            <div 
              className="absolute top-0 right-0 w-[600px] h-full pointer-events-none select-none bg-[radial-gradient(ellipse_at_100%_0%,rgba(21,86,178,0.18)_0%,rgba(21,177,216,0.05)_50%,transparent_80%)]"
            />
          )}
          {(lightGradientPos === 'top-left' || lightGradientPos === 'both') && (
            <div 
              className="absolute top-0 left-0 w-[600px] h-full pointer-events-none select-none bg-[radial-gradient(ellipse_at_0%_0%,rgba(21,86,178,0.18)_0%,rgba(21,177,216,0.05)_50%,transparent_80%)]"
            />
          )}
        </div>
      )}

      {/* Floating lights when there is no background image (Dark mode subpage only) */}
      {!isLight && !bgImage && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-br from-[var(--royal-blue)]/20 to-[var(--secondary)]/20 rounded-full blur-[100px] opacity-60" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.25]" />
        </div>
      )}

      {isLight && !isCenter ? (
        <div className="section-container relative z-10 w-full animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="col-span-12 lg:col-span-7 flex flex-col items-start text-left">
              <div className="hero-fade-up flex flex-col items-start text-left w-full">
                {subtitle && (
                  <div 
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase font-sans border mb-5 shadow-sm bg-[var(--royal-blue)]/5 text-[var(--royal-blue)] border-[var(--royal-blue)]/10"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--royal-blue)] animate-pulse" />
                    <span>{subtitle}</span>
                  </div>
                )}

                <h1 
                  className="mb-5 font-bold tracking-tight text-slate-655 w-full" 
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                    lineHeight: '1.15',
                    letterSpacing: '-0.015em'
                  }}
                >
                  {title}
                </h1>

                {description && (
                  <p className="leading-relaxed text-slate-650 max-w-2xl text-xs sm:text-sm md:text-base mb-6 border-l-2 border-[var(--royal-blue)]/20 pl-4">
                    {description}
                  </p>
                )}

                {(primaryCTA || secondaryCTA) && (
                  <div className="flex flex-row flex-wrap gap-3 pt-2 w-full justify-start items-center">
                    {primaryCTA && (
                      <Link
                        href={primaryCTA.url}
                        className="inline-flex items-center justify-center space-x-2 text-white px-5 py-2.5 rounded hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold text-xs sm:text-sm tracking-wide w-auto text-center"
                        style={{
                          background: "linear-gradient(135deg, var(--royal-blue), var(--secondary))"
                        }}
                      >
                        <span>{primaryCTA.label}</span>
                        <ArrowRight size={16} />
                      </Link>
                    )}
                    {secondaryCTA && (
                      <Link
                        href={secondaryCTA.url}
                        className="inline-flex items-center justify-center space-x-2 bg-slate-150 hover:bg-slate-200 text-slate-800 px-5 py-2.5 rounded border border-slate-200/60 hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold text-xs sm:text-sm tracking-wide w-auto text-center"
                      >
                        <span>{secondaryCTA.label}</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="hero-fade-scale col-span-12 lg:col-span-5 flex items-center justify-center relative mt-6 lg:mt-0">
              <NextGenNetworkIllustration />
            </div>
          </div>
          {renderBreadcrumbs(false)}
        </div>
      ) : (
        <div className="section-container relative z-10 w-full">
          <div className={`max-w-3xl ${isCenter ? 'mx-auto' : ''}`}>
            <div className={`hero-fade-up flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'}`}>
              {subtitle && isShortSubtitle && (
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase font-sans border mb-4 shadow-sm"
                  style={{
                    background: isLight ? 'rgba(21, 86, 178, 0.08)' : 'rgba(21, 177, 216, 0.15)',
                    color: isLight ? 'var(--royal-blue)' : 'var(--secondary)',
                    borderColor: isLight ? 'rgba(21, 86, 178, 0.15)' : 'rgba(21, 177, 216, 0.25)'
                  }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? 'bg-[var(--royal-blue)]' : 'bg-[var(--secondary)]'}`} />
                  <span>{subtitle}</span>
                </div>
              )}

              {subtitle && !isShortSubtitle && (
                <div className={`flex items-start gap-2 mb-4 max-w-3xl ${isCenter ? 'justify-center' : ''}`}>
                  {!isCenter && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 animate-pulse ${
                      isLight ? 'bg-[var(--royal-blue)]' : 'bg-[var(--secondary)]'
                    }`} />
                  )}
                  <span className={`font-semibold text-xs sm:text-sm tracking-wide leading-relaxed ${
                    isLight ? 'text-[var(--royal-blue)]' : 'text-[var(--secondary)]'
                  }`}>
                    {subtitle}
                  </span>
                </div>
              )}

              <h1 
                className={`mb-4 font-bold tracking-tight ${isLight ? 'text-slate-655' : 'text-white'}`} 
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                  lineHeight: '1.15',
                }}
              >
                {title}
              </h1>

              {description && (
                <p className={`leading-relaxed max-w-2xl text-xs sm:text-sm md:text-base mb-6 ${
                  isLight ? 'text-slate-650' : 'text-slate-300'
                }`}>
                  {description}
                </p>
              )}

              {(primaryCTA || secondaryCTA) && (
                <div className={`flex flex-row flex-wrap gap-3 pt-2 w-full items-center ${isCenter ? 'justify-center' : 'justify-start'}`}>
                  {primaryCTA && (
                    <Link
                      href={primaryCTA.url}
                      className="inline-flex items-center justify-center space-x-2 text-white px-5 py-2.5 rounded hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold text-xs sm:text-sm tracking-wide w-auto text-center"
                      style={{
                        background: isLight 
                          ? "linear-gradient(135deg, var(--royal-blue), var(--secondary))"
                          : "linear-gradient(135deg, var(--secondary), #7dd3fc)"
                      }}
                    >
                      <span>{primaryCTA.label}</span>
                      <ArrowRight size={16} />
                    </Link>
                  )}
                  {secondaryCTA && (
                    <Link
                      href={secondaryCTA.url}
                      className={`inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded border hover:scale-[1.02] active:scale-[0.98] transition-all font-semibold text-xs sm:text-sm tracking-wide w-auto text-center ${
                        isLight 
                          ? 'bg-slate-150 hover:bg-slate-200 text-slate-800 border-slate-200/60' 
                          : 'bg-white/10 backdrop-blur-sm text-white border-white/15 hover:bg-white/20'
                      }`}
                    >
                      <span>{secondaryCTA.label}</span>
                    </Link>
                  )}
                </div>
              )}

              {isLight && renderBreadcrumbs(isCenter)}
            </div>
          </div>
        </div>
      )}

      {(height === 'medium' || height === 'full') && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-50 hover:opacity-85 transition-opacity select-none">
          <span className={`text-[9px] uppercase tracking-widest font-bold ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
            Scroll
          </span>
          <div className={`w-4 h-7 border rounded-full flex justify-center p-0.5 ${isLight ? 'border-slate-300' : 'border-white/20'}`}>
            <div className={`hero-scroll-dot w-0.5 h-1.5 rounded-full ${isLight ? 'bg-slate-500' : 'bg-white/70'}`} />
          </div>
        </div>
      )}
    </section>
    </>
  );
}
