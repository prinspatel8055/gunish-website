'use client';

import Link from 'next/link';
import { Linkedin, Twitter, Youtube, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import FooterSearch from './FooterSearch';
import LogoBrand from '@/components/shared/LogoBrand';

export default function Footer({ footerData }: { footerData?: any }) {
  const currentYear = new Date().getFullYear();
  const tagline =
    footerData?.tagline ||
    'Ganpat University International Conference on Social Sciences & Humanities (GUNICSH) — A premier global forum fostering research excellence, innovation, and multidisciplinary dialogue.';
  
  const rawCopyright =
    footerData?.copyright ||
    `© Copyright ${currentYear}. Ganpat University — GUNICSH. All rights reserved.`;
  const copyright = rawCopyright.includes('{year}')
    ? rawCopyright.replace(/\{year\}/g, currentYear.toString())
    : rawCopyright.replace(/©\s*Copyright\s*\d{4}/i, `© Copyright ${currentYear}`);

  const columns = footerData?.columns || [];
  const quickLinksCol = columns.find((c: any) => c.heading?.toLowerCase().includes('quick')) || columns[0];
  const confLinksCol = columns.find((c: any) => c.heading?.toLowerCase().includes('conference')) || columns[1];
  const socials = footerData?.socials || [];

  return (
    <footer className="bg-[#0f172a] text-white border-t border-white/10 select-none">
      <div className="section-container pt-14 pb-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
          
          {/* Column 1: Brand / Two Logos with Reveal Effect & About */}
          <div className="lg:col-span-5 flex flex-col space-y-4 max-w-full overflow-hidden">
            {/* Logo Reveal Container (Clean bounded container, zero overlap) */}
            <div className="w-fit max-w-full">
              <LogoBrand variant="footer" size="lg" />
            </div>

            {/* Tagline */}
            <p className="text-slate-300 leading-relaxed text-sm max-w-lg">
              {tagline}
            </p>

            {/* Social Icons Bar */}
            <div className="flex items-center space-x-3 pt-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-1">Follow Us:</span>
              <a
                href="https://www.facebook.com/ganpatuni"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#A81C24] text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                title="Facebook"
              >
                <Facebook size={15} />
              </a>
              <a
                href="https://twitter.com/Ganpat_Uni"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#A81C24] text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                title="Twitter"
              >
                <Twitter size={15} />
              </a>
              <a
                href="https://www.linkedin.com/school/ganpat-university/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#A81C24] text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                title="LinkedIn"
              >
                <Linkedin size={15} />
              </a>
              <a
                href="https://www.youtube.com/@GanpatUniversityOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#A81C24] text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                title="YouTube"
              >
                <Youtube size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols wide) */}
          <div className="lg:col-span-2">
            <h4 className="text-white mb-4 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#A81C24] rounded-sm inline-block" />
              {quickLinksCol?.heading || 'Quick Links'}
            </h4>
            <ul className="space-y-2.5">
              {(quickLinksCol?.links || [
                { label: 'About Us', href: '/about-us' },
                { label: 'The Conference', href: '/the-conference' },
                { label: 'Conference Themes', href: '/theme' },
                { label: 'Call For Papers', href: '/call-for-papers' },
                { label: 'Photo Gallery', href: '/gallery' },
              ]).map((link: any, lidx: number) => (
                <li key={lidx}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-[#D97706] transition-colors text-sm font-medium inline-flex items-center gap-1.5 group"
                  >
                    <span className="text-[#A81C24] group-hover:translate-x-0.5 transition-transform">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Conference Details (2 cols wide) */}
          <div className="lg:col-span-2">
            <h4 className="text-white mb-4 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#D97706] rounded-sm inline-block" />
              {confLinksCol?.heading || 'Conference Info'}
            </h4>
            <ul className="space-y-2.5">
              {(confLinksCol?.links || [
                { label: 'Publication & Awards', href: '/publication' },
                { label: 'Journal Articles', href: '/journal-articles' },
                { label: 'Organizing Committees', href: '/committees' },
                { label: 'Registration & Fees', href: '/registration-fess' },
                { label: 'Contact Us', href: '/contact-us' },
              ]).map((link: any, lidx: number) => (
                <li key={lidx}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-[#D97706] transition-colors text-sm font-medium inline-flex items-center gap-1.5 group"
                  >
                    <span className="text-[#D97706] group-hover:translate-x-0.5 transition-transform">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Search + Venue Office (3 cols wide) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-500 rounded-sm inline-block" />
              Search & Contact
            </h4>

            {/* Site Search Bar */}
            <FooterSearch />

            {/* Address */}
            <address className="not-italic space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2 leading-relaxed">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#D97706]" />
                <span>
                  <strong>V. M. Patel College of Management Studies</strong><br />
                  Ganpat Vidyanagar, Mehsana-Gozaria Highway,<br />
                  PO – 384012, North Gujarat, India.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-[#D97706]" />
                <a
                  href="mailto:gunicsh@ganpatuniversity.ac.in"
                  className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-2"
                >
                  gunicsh@ganpatuniversity.ac.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-[#D97706]" />
                <span>Prof. Rudri Dave: +91 94267 22001</span>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>{copyright}</p>
          <div className="flex items-center gap-4">
            <Link href="/about-us" className="hover:text-white transition-colors">About GUNI</Link>
            <span>•</span>
            <Link href="/theme" className="hover:text-white transition-colors">Themes</Link>
            <span>•</span>
            <Link href="/registration-fess" className="hover:text-white transition-colors">Registration</Link>
            <span>•</span>
            <Link href="/contact-us" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
