import { ArrowRight, Award } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[var(--midnight-navy)] via-[var(--royal-blue)] to-[var(--dark-surface)] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="section-container py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Award className="text-[var(--champagne-gold)]" size={18} />
              <span className="text-white/90">Nationally Respected Educational Leader</span>
            </div>

            <div>
              <h1 className="mb-4" style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em'
              }}>
                Dr. Mahendra Sharma
              </h1>
              <p className="text-[var(--champagne-gold)] mb-4" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}>
                Vice Chancellor & Educational Visionary
              </p>
              <p className="text-white/80 leading-relaxed max-w-xl" style={{ fontSize: '1.125rem' }}>
                Pioneering the transformation of Indian higher education through innovation,
                industry collaboration, and student-centric excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/leadership"
                className="inline-flex items-center justify-center space-x-2 bg-[var(--champagne-gold)] text-[var(--midnight-navy)] px-8 py-4 rounded hover:bg-[var(--champagne-gold)]/90 transition-all"
              >
                <span>Explore Leadership Journey</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/vision"
                className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded border border-white/20 hover:bg-white/20 transition-all"
              >
                <span>Vision 2035</span>
              </Link>
            </div>
          </div>

          {/* Right Content - Portrait Placeholder */}
          <div className="relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--champagne-gold)] to-[var(--royal-blue)] rounded-lg transform rotate-3" />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <Award size={64} className="text-[var(--champagne-gold)] mx-auto mb-4" />
                  <p className="text-white/60">Professional Portrait</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
