import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Radio, Cpu, Globe, Layers, Award, Sparkles, Wifi, ShieldCheck, Zap } from 'lucide-react';
import Icon from '@/components/shared/Icon';
import { HeroBlockData } from '@/types/cms';
import OptimizedImage from '@/components/shared/OptimizedImage';

const SubpageHeroClient = dynamic(() => import('./SubpageHeroClient'), { ssr: true });
const HeroBannerSlider = dynamic(() => import('./HeroBannerSlider'), { ssr: true });

// ─── CSS-native hero animations (no JS required, GPU accelerated) ────────────
const heroKeyframes = `
  @keyframes hero-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes hero-fade-scale {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1);    }
  }
  @keyframes hero-pulse-glow {
    0%, 100% { opacity: 0.35; transform: scale(1); }
    50%       { opacity: 0.65; transform: scale(1.06); }
  }
  .hero-fade-up {
    animation: hero-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .hero-fade-scale {
    animation: hero-fade-scale 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
  }
  .hero-pulse-glow {
    animation: hero-pulse-glow 5s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-fade-up, .hero-fade-scale, .hero-pulse-glow {
      animation: none !important;
      transition: none !important;
    }
  }
`;

interface HeroModuleProps {
  id?: string;
  data: HeroBlockData;
}

export default function HeroModule({ id, data }: HeroModuleProps) {
  const {
    title,
    subtitle,
    description,
    tagline,
    primaryCTA,
    secondaryCTA,
    portrait,
    isSubpage = false,
    variant,
    layoutVariant,
  } = data;

  const resolvedVariant = variant || (isSubpage ? 'subpage-dark' : 'home');

  if (resolvedVariant === 'slider' || (data.slides && data.slides.length > 0) || !isSubpage) {
    return <HeroBannerSlider id={id} data={data} />;
  }

  if (resolvedVariant === 'subpage-dark' || resolvedVariant === 'subpage-light') {
    return <SubpageHeroClient id={id} data={data} />;
  }

  const heroStats = data.heroStats || [];
  const hasCustomStats = heroStats.length > 0;
  const bgImage = data.bgImage;

  // Default GUNICSH Conference Feature Cards if stats not provided
  const defaultNetworkCards = [
    {
      icon: Award,
      badge: 'Cash Awards',
      title: 'Best Paper Award',
      desc: 'Cash prize of ₹5,100 per track for researchers',
      color: 'var(--champagne-gold)'
    },
    {
      icon: Layers,
      badge: 'Academic Scope',
      title: 'Multidisciplinary Tracks',
      desc: 'Social sciences, management, education & humanities',
      color: 'var(--royal-blue)'
    },
    {
      icon: Globe,
      badge: 'Publication',
      title: 'Indexed Journals',
      desc: 'UGC-CARE / peer-reviewed conference compendium',
      color: 'var(--secondary)'
    },
    {
      icon: Sparkles,
      badge: 'Global Forum',
      title: 'International Keynotes',
      desc: 'Eminent scholars and international experts',
      color: '#34D399'
    }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroKeyframes }} />
      <section 
        id={id} 
        className="relative text-white overflow-hidden flex items-center bg-[#070e1b] min-h-[calc(100dvh-80px)] md:min-h-[calc(100dvh-114px)] md:h-[calc(100dvh-114px)] w-full py-4 md:py-0"
      >
        {/* Futuristic Background Network Matrix */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Engineering Network Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(21, 177, 216, 0.12) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(21, 177, 216, 0.12) 1px, transparent 1px)`,
              backgroundSize: '3.5rem 3.5rem',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 50%, transparent 95%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 50%, transparent 95%)'
            }}
          />

          {/* Radial Ambient Network Glows */}
          <div 
            className="hero-pulse-glow absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-35 blur-[100px]"
            style={{ background: 'radial-gradient(circle, #1556B2 0%, #0d2b56 70%, transparent 100%)' }}
          />
          <div 
            className="hero-pulse-glow absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full opacity-30 blur-[110px]"
            style={{ background: 'radial-gradient(circle, #C89E4C 0%, #611C24 60%, transparent 100%)' }}
          />
          <div 
            className="absolute top-[25%] right-[25%] w-[30%] h-[30%] rounded-full opacity-20 blur-[80px]"
            style={{ background: 'radial-gradient(circle, #15B1D8 0%, transparent 70%)' }}
          />

          {/* Next-Gen Telecom Background Image Layer */}
          {bgImage && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={bgImage}
                alt="GUNICSH Conference Hero Background"
                className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105 transition-transform duration-1000"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070e1b]/95 via-[#070e1b]/70 to-[#070e1b]/80" />
            </div>
          )}
        </div>

        {/* Ambient Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070e1b] via-transparent to-[#070e1b]/40 pointer-events-none" />

        <div className="section-container relative z-10 w-full">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Narrative Column (7 Cols on Desktop) */}
            <div className="hero-fade-up col-span-12 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3.5 lg:space-y-4">
              
              {/* Telemetry Badge / CoE Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-sans border shadow-sm bg-red-950/70 text-[var(--champagne-gold)] border-[var(--champagne-gold)]/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--champagne-gold)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--champagne-gold)]" />
                </span>
                <span>{tagline || 'Faculty of Social Sciences & Humanities • Ganpat University'}</span>
              </div>

              {/* Main Headline */}
              <div className="flex flex-col items-center lg:items-start w-full">
                <h1 
                  className="font-bold text-center lg:text-left leading-[1.1] text-white tracking-tight text-balance"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.85rem, 3.2vw, 2.85rem)',
                  }}
                >
                  {title || 'Ganpat University International Conference on Social Sciences & Humanities'}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                  <p 
                    className="text-[var(--champagne-gold)] mt-2 font-semibold text-xs tracking-wider uppercase font-sans text-center lg:text-left w-full"
                    style={{ letterSpacing: '0.12em' }}
                  >
                    {subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="text-slate-300 font-light leading-relaxed max-w-lg text-xs sm:text-sm mt-2.5 text-center lg:text-left mx-auto lg:mx-0">
                  {description || 
                    'A premier multidisciplinary conference bringing together global researchers, academicians, and scholars to share cutting-edge insights across social sciences, management, technology, and humanities.'}
                </p>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap gap-3 pt-1 w-full justify-center lg:justify-start items-center">
                <Link
                  href={primaryCTA?.url || '/registration-fess'}
                  className="inline-flex items-center justify-center gap-1.5 text-white px-5 py-2.5 rounded-full font-bold text-xs tracking-wide shadow-md hover:shadow-[var(--royal-blue)]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--royal-blue) 0%, #C89E4C 100%)',
                  }}
                >
                  <span>{primaryCTA?.label || 'Register Now'}</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href={secondaryCTA?.url || '/call-for-papers'}
                  className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-full border border-white/20 font-bold text-xs tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{secondaryCTA?.label || 'Call for Papers'}</span>
                </Link>
              </div>

              {/* Quick Capabilities Highlights Bar */}
              <div className="pt-3 mt-1 border-t border-white/10 w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--royal-blue)]" />
                  <span className="text-[10px] font-semibold text-slate-300">Peer-Reviewed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--champagne-gold)]" />
                  <span className="text-[10px] font-semibold text-slate-300">Best Paper Award</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                  <span className="text-[10px] font-semibold text-slate-300">UGC-CARE / Scopus</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)]" />
                  <span className="text-[10px] font-semibold text-slate-300">Global Delegates</span>
                </div>
              </div>

            </div>

            {/* Right Column: High-Tech Network Matrix / Visual Hub (5 Cols on Desktop) */}
            <div className="hero-fade-scale col-span-12 lg:col-span-5 flex items-center justify-center relative mt-2 lg:mt-0">
              
              {portrait?.imageUrl ? (
                /* Portrait image layout if explicitly uploaded */
                <div className="relative aspect-[4/5] w-full max-w-[280px] rounded-2xl overflow-hidden border border-white/20 bg-slate-900/60 p-2 shadow-2xl">
                  <OptimizedImage
                    src={portrait.imageUrl}
                    alt={portrait.imageAlt || title}
                    className="w-full h-full object-cover object-center rounded-xl"
                    priority
                  />
                </div>
              ) : hasCustomStats ? (
                /* Dynamic Custom Stats Grid */
                <div className="grid grid-cols-2 gap-3 w-full max-w-[380px] mx-auto">
                  {heroStats.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl p-4 text-center bg-slate-900/85 border border-white/15 hover:border-[#15B1D8]/50 hover:bg-slate-800/80 transition-all duration-300 shadow-xl"
                    >
                      <div className="flex justify-center mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 text-[#15B1D8]">
                          <Icon name={s.icon || 'Star'} size={18} />
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white mb-0.5 font-mono">{s.value}</div>
                      <div className="text-[11px] text-slate-300 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Modern 2x2 Network Infrastructure Matrix */
                <div className="w-full max-w-[390px] relative">
                  {/* Decorative Radar / Ring Glow */}
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#1556B2]/20 via-[#15B1D8]/15 to-[#C89E4C]/20 blur-lg pointer-events-none" />

                  <div className="relative grid grid-cols-2 gap-3">
                    {defaultNetworkCards.map((card, idx) => {
                      const IconComp = card.icon;
                      return (
                        <div
                          key={idx}
                          className="group relative rounded-xl p-3.5 bg-slate-900/85 border border-white/15 hover:border-[#15B1D8]/60 hover:bg-slate-800/90 transition-all duration-300 shadow-xl flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Header & Icon */}
                            <div className="flex items-center justify-between mb-2">
                              <div 
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                                style={{ background: `${card.color}20`, color: card.color }}
                              >
                                <IconComp size={15} />
                              </div>
                              <span 
                                className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"
                                style={{ background: `${card.color}15`, color: card.color, borderColor: `${card.color}30` }}
                              >
                                {card.badge}
                              </span>
                            </div>

                            {/* Card Title */}
                            <h3 className="text-xs font-bold text-white group-hover:text-[#15B1D8] transition-colors leading-snug">
                              {card.title}
                            </h3>

                            {/* Card Desc */}
                            <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                              {card.desc}
                            </p>
                          </div>

                          {/* Interactive Status Indicator */}
                          <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
                            <span className="flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-emerald-400" />
                              Active Lab
                            </span>
                            <span className="text-white/40 group-hover:text-white/80 transition-colors">0{idx + 1}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>
    </>
  );
}
