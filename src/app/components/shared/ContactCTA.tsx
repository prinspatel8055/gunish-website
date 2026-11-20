import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ContactCTA() {
  return (
    <section className="py-0 sm:py-12 bg-[var(--warm-white)]">
      <div className="section-container">
        <div className="bg-gradient-to-br from-[var(--royal-blue)] to-[var(--midnight-navy)] rounded-none sm:rounded-2xl px-6 py-12 sm:p-12 lg:p-16 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Mail className="text-[var(--champagne-gold)]" size={28} />
            </div>

            <h2 className="mb-4" style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: '1.2'
            }}>
              Let's Shape the Future of Education Together
            </h2>

            <p className="text-white/80 mb-8 leading-relaxed" style={{ fontSize: '1.125rem' }}>
              Whether you're interested in collaboration, speaking engagements, academic partnerships,
              or media inquiries—reach out and let's explore possibilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center space-x-2 bg-[var(--champagne-gold)] text-[var(--midnight-navy)] px-8 py-4 rounded hover:bg-[var(--champagne-gold)]/90 transition-all"
              >
                <span>Get in Touch</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/initiatives"
                className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded border border-white/20 hover:bg-white/20 transition-all"
              >
                <span>Explore Initiatives</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
