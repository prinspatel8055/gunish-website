import { Microscope, Rocket } from 'lucide-react';

export default function ResearchEntrepreneurship() {
  return (
    <section className="py-24 bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="bg-gradient-to-br from-[var(--royal-blue)] to-[var(--midnight-navy)] rounded-lg p-12 text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Microscope className="text-[var(--champagne-gold)]" size={28} />
            </div>
            <h3 className="mb-4" style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
              Research Excellence
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Fostering a culture of inquiry where faculty and students pursue cutting-edge research with real-world impact.
            </p>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[var(--champagne-gold)] rounded-full mt-2 mr-3 flex-shrink-0" />
                Funded research grants and fellowships
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[var(--champagne-gold)] rounded-full mt-2 mr-3 flex-shrink-0" />
                Interdisciplinary research centers
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[var(--champagne-gold)] rounded-full mt-2 mr-3 flex-shrink-0" />
                Publication incentives and support
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[var(--champagne-gold)] to-[var(--royal-blue)] rounded-lg p-12 text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Rocket className="text-[var(--midnight-navy)]" size={28} />
            </div>
            <h3 className="mb-4" style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
              Entrepreneurship
            </h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              Empowering students to transform ideas into ventures through structured incubation and mentorship.
            </p>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[var(--midnight-navy)] rounded-full mt-2 mr-3 flex-shrink-0" />
                Seed funding and angel networks
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[var(--midnight-navy)] rounded-full mt-2 mr-3 flex-shrink-0" />
                Startup bootcamps and pitch competitions
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-[var(--midnight-navy)] rounded-full mt-2 mr-3 flex-shrink-0" />
                Corporate mentorship programs
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
