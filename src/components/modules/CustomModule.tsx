import FadeIn from '@/components/shared/FadeIn';
import { CustomBlockData } from '@/types/cms';
import { optimizeHtmlImages } from '@/components/shared/OptimizedImage';

interface CustomModuleProps {
  id?: string;
  data: CustomBlockData;
}

export default function CustomModule({ id, data }: CustomModuleProps) {
  const { title, subtitle, body, fullWidth = false } = data;

  const normalizedBody = (body || '').replace(/\r\n/g, '\n');
  const optimizedBody = optimizeHtmlImages(normalizedBody);

  // Check if the HTML is a multi-section landing block (contains full-bleed section wrappers like oc-collab, lt-team, wwd-wrap)
  const isMultiSectionLanding = /class="[^"]*(?:oc-collab|lt-team|wwd-wrap|ns-wrap|gunish-landing|gunicsh-landing)[^"]*"/.test(optimizedBody);

  const content = (
    <div 
      suppressHydrationWarning={true}
      className="w-full text-slate-700 leading-relaxed font-sans text-sm md:text-base overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: optimizedBody }} 
    />
  );

  if (isMultiSectionLanding) {
    return (
      <section id={id} className="w-full bg-white overflow-hidden">
        <div className="w-full">
          {content}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-10 md:py-14 bg-white overflow-hidden">
      <div className="section-container">
        <FadeIn variant="up" delay={0}>
          {(title || subtitle) && (
            <div className="mb-8">
              {subtitle && (
                <div className="text-xs font-semibold tracking-widest uppercase mb-2 text-[var(--secondary)]">
                  {subtitle}
                </div>
              )}
              {title && (
                <h2
                  className="text-2xl md:text-3xl font-bold leading-tight text-[#1E293B]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {title}
                </h2>
              )}
            </div>
          )}
          {content}
        </FadeIn>
      </div>
    </section>
  );
}
