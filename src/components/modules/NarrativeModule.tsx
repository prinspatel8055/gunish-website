import Icon from '@/components/shared/Icon';
import { NarrativeBlockData } from '@/types/cms';
import OptimizedImage from '@/components/shared/OptimizedImage';
import FadeIn from '@/components/shared/FadeIn';

interface NarrativeModuleProps {
  id?: string;
  data: NarrativeBlockData;
}

export default function NarrativeModule({ id, data }: NarrativeModuleProps) {
  const {
    title,
    category,
    categoryIcon,
    body,
    quote,
    sidePanel,
    layout = 'centered',
    imageUrl,
    imageAlt,
    imageBadge
  } = data;

  const resolvedImage = imageUrl || (data as any).image;

  if (layout === 'centre_intro') {
    return (
      <section id={id} className="cv-auto py-12 md:py-16 bg-[#F6F8FB] overflow-hidden">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <FadeIn variant="left">
              {category && (
                <div className="text-xs font-semibold tracking-widest uppercase mb-3 text-[var(--secondary)]">
                  {category}
                </div>
              )}
              <h2
                className="text-4xl font-bold mb-6 leading-tight text-[#1E293B]"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}
              >
                {title}
              </h2>
              <div className="text-slate-500 leading-relaxed mb-8 space-y-4 text-sm lg:text-base">
                {body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {sidePanel?.details && sidePanel.details.length > 0 && (
                <div className="flex gap-8 mb-8 flex-wrap justify-start">
                  {sidePanel.details.map((item, idx) => (
                    <div key={idx} className="text-left pr-6">
                      <div className="text-2xl font-bold text-[var(--royal-blue)]">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5 font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </FadeIn>

            {/* Right Column - Image with badge */}
            <FadeIn variant="right" delay={150} className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <OptimizedImage
                  src={imageUrl || "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=700&h=500&fit=crop&auto=format"}
                  alt={imageAlt || title}
                  className="rounded-2xl w-full object-cover transition-transform duration-700 hover:scale-105"
                  style={{ height: '420px' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {imageBadge && (
                <FadeIn
                  variant="scale"
                  delay={300}
                  className="absolute bottom-4 left-4 md:-bottom-6 md:-left-6 rounded-xl p-4 md:p-5 shadow-lg bg-[var(--royal-blue)] text-white min-w-[140px] md:min-w-[160px] z-10"
                >
                  <div className="text-xl md:text-2xl font-bold leading-none">{imageBadge.value}</div>
                  <div className="text-[10px] md:text-xs text-blue-200 mt-1 font-medium tracking-wide">{imageBadge.label}</div>
                </FadeIn>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'personal_message') {
    return (
      <section id={id} className="cv-auto py-12 bg-white">
        <div className="section-container">
          <FadeIn className="max-w-4xl mx-auto bg-gradient-to-br from-[var(--royal-blue)] to-[var(--midnight-navy)] rounded-2xl px-6 py-12 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              {categoryIcon && (
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-8">
                  <Icon name={categoryIcon} className="text-[var(--secondary)]" size={28} />
                </div>
              )}

              <h2 className="mb-6" style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                lineHeight: '1.2'
              }}>
                {title}
              </h2>

              <div className="space-y-6 text-white/90 leading-relaxed text-sm lg:text-base">
                {body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                {quote && (
                  <p className="pt-6 border-t border-white/20">
                    <span className="text-[var(--secondary)]" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
                      — {quote.text}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }

  if (layout === 'principles') {
    return (
      <section id={id} className="cv-auto py-12 bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-12">
              {categoryIcon && (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--secondary)] to-[var(--royal-blue)] rounded-full mb-6">
                  <Icon name={categoryIcon} className="text-white" size={32} />
                </div>
              )}

              <h2 className="mb-4 text-[#1E293B]" style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
              }}>
                {title}
              </h2>
            </FadeIn>

            <FadeIn
              delay={100}
              className="bg-white rounded-2xl p-6 sm:p-12 border border-slate-100 hover:border-[var(--secondary)]/40 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {body.length > 0 && (
                <p className="mb-6 text-[#1E293B]/80 leading-relaxed text-sm lg:text-base">
                  {body[0]}
                </p>
              )}

              {sidePanel?.items && sidePanel.items.length > 0 && (
                <div className="space-y-8">
                  {sidePanel.items.map((item, index) => {
                    const [heading, ...descParts] = item.split(':');
                    const desc = descParts.join(':');
                    return (
                      <div key={index}>
                        <h3 className="mb-3 text-[var(--royal-blue)] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                          {heading}
                        </h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                          {desc.trim()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'editorial') {
    return (
      <section id={id} className="cv-auto py-12 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Narrative Column (spans 7 out of 12) */}
            <FadeIn className="lg:col-span-7">
              {category && (
                <div className="inline-flex items-center space-x-2 bg-[var(--royal-blue)]/5 px-4 py-2 rounded-full mb-6">
                  {categoryIcon && <Icon name={categoryIcon} className="text-[var(--royal-blue)]" size={18} />}
                  <span className="text-[var(--royal-blue)] font-semibold text-xs tracking-wider uppercase">{category}</span>
                </div>
              )}

              <h2 className="mb-6 text-[#1E293B]" style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                lineHeight: '1.2'
              }}>
                {title}
              </h2>

              <div className="space-y-6 text-slate-500 leading-relaxed text-sm lg:text-base">
                {body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </FadeIn>

            {/* Right Side Widgets Column (spans 5 out of 12) */}
            <FadeIn delay={150} className="lg:col-span-5 space-y-6">
              {sidePanel && (
                <>
                  {sidePanel.type === 'expertise' && sidePanel.items && (
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-[var(--secondary)]/45 shadow-sm hover:shadow-md transition-all duration-300">
                      <h3 className="mb-4 text-[#1E293B] font-bold text-lg">{sidePanel.title}</h3>
                      {sidePanel.subtitle && <p className="text-slate-500 mb-2 text-sm">{sidePanel.subtitle}</p>}
                      <ul className="space-y-2">
                        {sidePanel.items.map((item, index) => (
                          <li key={index} className="flex items-start text-slate-500 text-sm">
                            <div className="w-1.5 h-1.5 bg-[var(--secondary)] rounded-full mt-2 mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sidePanel.type === 'list' && sidePanel.items && (
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-[var(--secondary)]/45 shadow-sm hover:shadow-md transition-all duration-300">
                      <h3 className="mb-4 text-[#1E293B] font-bold text-lg">{sidePanel.title}</h3>
                      {sidePanel.subtitle && <p className="text-[var(--royal-blue)] font-medium mb-4 text-sm">{sidePanel.subtitle}</p>}
                      <ul className="space-y-2">
                        {sidePanel.items.map((item, index) => (
                          <li key={index} className="flex items-start text-slate-500 text-sm">
                            <div className="w-1.5 h-1.5 bg-[var(--secondary)] rounded-full mt-2 mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sidePanel.type === 'facts' && sidePanel.details && (
                    <div className="bg-gradient-to-br from-[var(--royal-blue)] to-[var(--midnight-navy)] rounded-2xl p-8 text-white shadow-lg">
                      <h3 className="mb-4 text-white font-bold text-lg">{sidePanel.title}</h3>
                      <div className="space-y-3">
                        {sidePanel.details.map((detail, index) => (
                          <div
                            key={index}
                            className={`flex justify-between pb-2 ${
                              index < (sidePanel.details?.length || 0) - 1 ? 'border-b border-white/20' : ''
                            }`}
                          >
                            <span className="text-white/70 text-sm">{detail.label}</span>
                            <span className="font-semibold text-sm">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
    );
  }

  // If image is present on default/standard layout, render side-by-side presentation
  if (resolvedImage) {
    return (
      <section id={id} className="cv-auto py-12 md:py-16 bg-white overflow-hidden">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <FadeIn className="lg:col-span-7">
              {category && (
                <div className="text-xs font-semibold tracking-widest uppercase mb-3 text-[var(--secondary)]">
                  {category}
                </div>
              )}
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-[#1E293B]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {title}
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 text-sm md:text-base">
                {body.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </FadeIn>
            <FadeIn variant="right" delay={150} className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 group bg-slate-50">
                <img
                  src={resolvedImage}
                  alt={imageAlt || title}
                  className="w-full h-auto max-h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    );
  }

  // Fallback / Standard Centered Layout (no image)
  return (
    <section id={id} className="cv-auto py-12 bg-white">
      <div className="section-container">
        <FadeIn className="max-w-4xl mx-auto text-center">
          {categoryIcon && (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--secondary)] to-[var(--royal-blue)] rounded-full mb-8">
              <Icon name={categoryIcon} className="text-white" size={32} />
            </div>
          )}

          <h2 className="mb-6 text-[#1E293B]" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
          }}>
            {title}
          </h2>

          <div className="text-slate-500 leading-relaxed mb-8 space-y-6 text-sm lg:text-base">
            {body.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {quote && (
            <div className="bg-white rounded-2xl p-6 sm:p-12 border border-slate-100 hover:border-[var(--secondary)]/40 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <blockquote className="text-[var(--royal-blue)]" style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontStyle: 'italic',
                lineHeight: '1.6'
              }}>
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              {quote.author && (
                <cite className="block mt-4 not-italic text-sm text-slate-500 font-medium">
                  — {quote.author} {quote.citation ? `, ${quote.citation}` : ''}
                </cite>
              )}
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
