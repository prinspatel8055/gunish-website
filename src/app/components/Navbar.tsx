'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MapPin, Mail, Clock, Facebook, Twitter, Linkedin, ChevronDown } from 'lucide-react';
import OptimizedImage from '@/components/shared/OptimizedImage';
import LogoBrand from '@/components/shared/LogoBrand';

export default function Navbar({ headerData }: { headerData?: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileLink, setExpandedMobileLink] = useState<string | null>(null);
  const pathname = usePathname();
  // Store scroll position before locking so we can restore it on close
  const scrollYRef = useRef(0);
  const navigatedRef = useRef(false);

  // Auto-close mobile menu on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      navigatedRef.current = true;
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (navigatedRef.current) {
        window.scrollTo(0, 0);
        navigatedRef.current = false;
      } else {
        window.scrollTo(0, scrollYRef.current);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);


  const navLinks = headerData?.navLinks || [];
  const siteName = headerData?.siteName || 'GUNICSH';
  const logoUrl = headerData?.logoUrl || '/uploads/LOGO-1.png';
  const subheading = headerData?.subheading || 'Faculty of Social Sciences & Humanities — Ganpat University';
  const ctaLabel = headerData?.ctaLabel || 'Register Now';
  const ctaUrl = headerData?.ctaUrl || '/registration-fess';
  
  // Resolve logo size in pixels
  const logoSize = headerData?.logoSize || 'md';
  let logoHeightClass = 'h-10'; // default
  if (logoSize === 'xs') logoHeightClass = 'h-6 sm:h-7';
  else if (logoSize === 'sm') logoHeightClass = 'h-8 sm:h-9';
  else if (logoSize === 'md') logoHeightClass = 'h-10 sm:h-12';
  else if (logoSize === 'lg') logoHeightClass = 'h-12 sm:h-14';
  else if (logoSize === 'xl') logoHeightClass = 'h-14 sm:h-16';
  else if (logoSize === 'xxl') logoHeightClass = 'h-16 sm:h-18';

  return (
    <>
      {/* Top Bar - hidden on mobile/tablet, scrolls out of view on desktop */}
      <div className="hidden md:flex bg-[var(--midnight-navy)] text-white/90 text-[10px] sm:text-xs font-semibold h-[34px] px-6 lg:px-12 justify-between items-center gap-2 border-b border-white/10 relative z-50 w-full select-none">
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[var(--champagne-gold)]" />
            <span>Ganpat Vidyanagar, Mehsana-Gozaria Highway, PO – 384012, Gujarat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail size={13} className="text-[var(--champagne-gold)]" />
            <a href="mailto:gunicsh@ganpatuniversity.ac.in" className="hover:text-white transition-colors">
              gunicsh@ganpatuniversity.ac.in
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-[var(--champagne-gold)]" />
            <span>Mon – Sat: 9:00 AM – 4:00 PM</span>
          </div>
          <div className="flex items-center gap-2.5">
            <a href="https://www.facebook.com/ganpatuni" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Facebook"><Facebook size={13} /></a>
            <a href="https://twitter.com/Ganpat_Uni" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Twitter"><Twitter size={13} /></a>
            <a href="https://www.linkedin.com/school/ganpat-university/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="LinkedIn"><Linkedin size={13} /></a>
          </div>
        </div>
      </div>

      {/* Sticky Main Navigation (Solid crisp white, zero blur) */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)] w-full select-none">
        <div className="section-container flex items-center justify-between h-20">
          
          {/* Logo / Brand Masthead with Dual Logo Reveal Effect */}
          <LogoBrand variant="header" size="md" />

          {/* Desktop Navigation (Right Aligned) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 z-10 ml-auto mr-4">
            {navLinks.map((link: any) => {
              const active = pathname === link.href;
              const hasChildren = link.children && link.children.length > 0;

              if (hasChildren) {
                return (
                  <div key={link.href} className="relative group py-2">
                    <Link
                      href={link.href || '#'}
                      className={`px-2.5 py-1.5 text-[0.725rem] font-bold uppercase tracking-wider transition-all rounded-full inline-flex items-center gap-1 ${
                        active
                          ? 'bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]'
                          : 'text-[var(--midnight-navy)]/75 hover:text-[var(--midnight-navy)] hover:bg-slate-100/70'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown size={11} className="transition-transform duration-200 group-hover:rotate-180 text-[var(--royal-blue)]/70 shrink-0" />
                    </Link>
                    {/* Dropdown panel */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 min-w-[200px] w-max max-w-[300px] bg-white border border-slate-200/60 rounded-xl shadow-[0_10px_30px_rgba(8,23,45,0.08)] opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-1.5 before:absolute before:content-[''] before:w-full before:h-3 before:-top-3 before:left-0">
                      {link.children.map((subLink: any) => {
                        const subActive = pathname === subLink.href;
                        return (
                          <Link
                            key={subLink.href}
                            href={subLink.href}
                            className={`block px-3 py-2 text-xs font-medium normal-case tracking-normal rounded-lg transition-colors ${
                              subActive
                                ? 'bg-[var(--royal-blue)]/10 text-[var(--royal-blue)] font-semibold'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[var(--midnight-navy)]'
                            }`}
                          >
                            {subLink.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 text-[0.725rem] font-bold uppercase tracking-wider transition-all rounded-full ${
                    active
                      ? 'bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]'
                      : 'text-[var(--midnight-navy)]/75 hover:text-[var(--midnight-navy)] hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center space-x-3 z-10 shrink-0">
            {/* Outlined Contact CTA Button */}
            <Link
              href={ctaUrl}
              className={`hidden lg:inline-flex px-4 py-2 rounded-full border transition-all text-[0.725rem] font-bold tracking-wider uppercase font-sans ${
                pathname === ctaUrl
                  ? 'bg-[var(--royal-blue)] text-white border-[var(--royal-blue)]'
                  : 'border-[var(--royal-blue)]/30 text-[var(--royal-blue)] hover:bg-[var(--royal-blue)] hover:text-white hover:border-[var(--royal-blue)]'
              }`}
            >
              {ctaLabel}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 text-[var(--midnight-navy)] hover:text-[var(--royal-blue)] transition-colors rounded-full bg-[var(--midnight-navy)]/5 hover:bg-[var(--midnight-navy)]/10"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown Panel (Solid white, zero blur) */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute left-2 right-2 top-22 p-4 bg-white border border-slate-200 rounded-[20px] shadow-2xl z-40 max-h-[80vh] overflow-y-auto space-y-1 animate-in fade-in slide-in-from-top-4 duration-200">
              {navLinks.map((link: any) => {
                const active = pathname === link.href;
                const hasChildren = link.children && link.children.length > 0;
                const isExpanded = expandedMobileLink === link.href;

                if (hasChildren) {
                  return (
                    <div key={link.href} className="w-full">
                      <button
                        onClick={() => setExpandedMobileLink(isExpanded ? null : link.href)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors font-sans rounded-full ${
                          active
                            ? 'bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]'
                            : 'text-[var(--midnight-navy)]/75 hover:text-[var(--midnight-navy)] hover:bg-black/[0.03]'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isExpanded && (
                        <div className="pl-4 mt-1 border-l border-slate-100 space-y-0.5">
                          {link.children.map((subLink: any) => {
                            const subActive = pathname === subLink.href;
                            return (
                              <Link
                                key={subLink.href}
                                href={subLink.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-2 text-xs font-medium normal-case tracking-normal transition-colors rounded-lg ${
                                  subActive
                                    ? 'bg-[var(--royal-blue)]/5 text-[var(--royal-blue)] font-semibold'
                                    : 'text-slate-600 hover:text-[var(--midnight-navy)]'
                                }`}
                              >
                                {subLink.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors font-sans rounded-full ${
                      active
                        ? 'bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]'
                        : 'text-[var(--midnight-navy)]/75 hover:text-[var(--midnight-navy)] hover:bg-black/[0.03]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </header>
    </>
  );
}
