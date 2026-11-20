'use client';

import { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, BookOpen, FileText } from 'lucide-react';
import { GalleryBlockData } from '@/types/cms';
import OptimizedImage from '@/components/shared/OptimizedImage';
import FadeIn from '@/components/shared/FadeIn';

interface GalleryModuleProps {
  id?: string;
  data: GalleryBlockData;
}

const GalleryMarquee = ({ images, onImageClick }: { images: any[], onImageClick: (idx: number) => void }) => {
  // Duplicate images to ensure infinite loop coverage
  const duplicatedImages = [...images, ...images, ...images, ...images];

  return (
    <div className="relative w-full overflow-hidden py-4 select-none">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          display: flex;
          width: max-content;
          animation: marquee 45s linear infinite;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="animate-marquee-slow gap-6 flex">
        {duplicatedImages.map((image, index) => {
          const originalIndex = index % images.length;
          const imageKey = image.id || image.url || `marquee-img-${index}`;
          return (
            <div
              key={`${imageKey}-${index}`}
              onClick={() => onImageClick(originalIndex)}
              className="relative w-72 h-48 rounded-2xl overflow-hidden border border-slate-200/60 hover:border-[var(--secondary)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group shrink-0 bg-slate-900"
            >
              {(image.url || image.imageUrl) ? (
                <OptimizedImage
                  src={image.url || image.imageUrl}
                  alt={image.title || 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--royal-blue)] to-[var(--secondary)]/40 flex items-center justify-center">
                  <ImageIcon size={32} className="text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[9px] uppercase tracking-wider text-[var(--secondary)] font-bold mb-1">
                  {(image.category || 'all').replace('_', ' ')}
                </span>
                <h4 className="text-white text-xs font-semibold truncate">
                  {image.title || ''}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function GalleryModule({ id, data }: GalleryModuleProps) {
  const { title, subtitle, categories, images, variant = 'grid' } = data;
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset pagination when category changes
  useEffect(() => {
    setVisibleCount(12);
    setActiveImageIndex(null);
  }, [activeCategory]);

  const visibleImages = (images || []).filter(img => !img.hidden);

  const filteredImages = activeCategory === 'all'
    ? visibleImages
    : visibleImages.filter(img => img.category === activeCategory);

  const displayedImages = filteredImages.slice(0, visibleCount);
  const activeImage = activeImageIndex !== null ? filteredImages[activeImageIndex] : null;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev === null ? null : (prev - 1 + filteredImages.length) % filteredImages.length));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev === null ? null : (prev + 1) % filteredImages.length));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        setActiveImageIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, filteredImages.length]);

  const getAspectClass = (aspect: string) => {
    switch (aspect) {
      case 'tall':
        return 'aspect-[3/4]';
      case 'wide':
        return 'aspect-[16/9]';
      default:
        return 'aspect-square';
    }
  };

  const isSlider = variant === 'slider';

  return (
    <section id={id} className="cv-auto py-20 bg-[var(--warm-white)] text-[var(--midnight-navy)] overflow-hidden">
      {/* Lightbox modal keyframe styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalContentSlideIn {
          from { transform: scale(0.95) translateY(15px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-modal-fade {
          animation: modalFadeIn 0.3s ease-out forwards;
        }
        .animate-modal-content {
          animation: modalContentSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <div className="section-container">
        {title && (
          <FadeIn variant="up" delay={0} className="text-center mb-12">
            <h2 className="mb-4" style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--midnight-navy)'
            }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-[var(--midnight-navy)]/70 max-w-3xl mx-auto" style={{ fontSize: '1.125rem' }}>
                {subtitle}
              </p>
            )}
          </FadeIn>
        )}

        {/* Category Filters */}
        {!isSlider && categories && categories.length > 0 && (
          <FadeIn
            variant="up"
            delay={100}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2 rounded-full transition-all font-semibold text-xs uppercase tracking-wider border ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-[var(--royal-blue)] to-[var(--secondary)] text-white border-transparent shadow-md'
                    : 'bg-white text-[var(--midnight-navy)]/80 border-slate-200 hover:border-[var(--secondary)] hover:bg-[var(--secondary)]/5'
                }`}
              >
                {category.label}
              </button>
            ))}
          </FadeIn>
        )}

        {/* Dynamic Variant Render */}
        {!mounted ? (
          /* SSR/pre-mount: CSS columns visually matches masonry — zero layout shift on hydration */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {displayedImages.map((image, idx) => (
              <div
                key={image.id || image.url || `ssr-gallery-${idx}`}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 mb-6 break-inside-avoid"
              >
                <div className={`${getAspectClass(image.aspect)} bg-slate-900 flex items-center justify-center relative overflow-hidden`}>
                  {(image.url || image.imageUrl) ? (
                    <OptimizedImage
                      src={(image.url || image.imageUrl)!}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <ImageIcon size={40} className="text-white/20" />
                  )}
                </div>
                <div className="p-5 bg-white border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--secondary)] font-bold">
                      {(image.category || 'all').replace('_', ' ')}
                    </span>
                    {image.page && (
                      <span className="text-[10px] text-slate-400">
                        Page {image.page}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[var(--midnight-navy)] font-semibold text-sm leading-snug line-clamp-2">
                    {image.title || ''}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : isSlider ? (
          /* Smooth Infinite Sliding Gallery */
          <GalleryMarquee 
            images={filteredImages} 
            onImageClick={(idx) => setActiveImageIndex(idx)} 
          />
        ) : (
          /* Premium Masonry Grid */
          <>
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }}>
              <Masonry gutter="1.5rem">
                {displayedImages.map((image, index) => (
                  <FadeIn
                    key={image.id || image.url || `masonry-img-${index}`}
                    variant="up"
                    delay={Math.min((index % 12) * 40, 350)}
                  >
                    <div
                      onClick={() => setActiveImageIndex(index)}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:border-[var(--secondary)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                    >
                      <div className={`${getAspectClass(image.aspect)} bg-slate-900 flex items-center justify-center relative overflow-hidden`}>
                        {(image.url || image.imageUrl) ? (
                          <OptimizedImage
                            src={(image.url || image.imageUrl)!}
                            alt={image.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <ImageIcon size={40} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-medium text-sm border border-white/20">
                            View Details
                          </span>
                        </div>
                      </div>
                      <div className="p-5 bg-white border-t border-slate-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-[var(--secondary)] font-bold">
                            {image.category.replace('_', ' ')}
                          </span>
                          {image.page && (
                            <span className="text-[10px] text-slate-400">
                              Page {image.page}
                            </span>
                          )}
                        </div>
                        <h3 className="text-[var(--midnight-navy)] font-semibold text-sm group-hover:text-[var(--royal-blue)] transition-colors leading-snug line-clamp-2">
                          {image.title}
                        </h3>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </Masonry>
            </ResponsiveMasonry>

            {/* Pagination Controls */}
            {filteredImages.length > 0 && (
              <div className="mt-16 text-center flex flex-col items-center gap-4">
                <p className="text-sm text-[var(--midnight-navy)]/60">
                  Showing <span className="font-semibold text-[var(--midnight-navy)]">{displayedImages.length}</span> of{' '}
                  <span className="font-semibold text-[var(--midnight-navy)]">{filteredImages.length}</span> items
                </p>
                {/* Sleek Progress Bar */}
                <div className="w-64 h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--royal-blue)] to-[var(--secondary)] transition-all duration-500"
                    style={{ width: `${(displayedImages.length / filteredImages.length) * 100}%` }}
                  />
                </div>
                {visibleCount < filteredImages.length && (
                  <button
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="px-8 py-3 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--secondary)] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    Load More Images
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 select-none animate-modal-fade"
        >
          {/* Close Area */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveImageIndex(null)} />

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 lg:left-8 z-50 p-3 rounded-full bg-white/10 hover:bg-[var(--secondary)] hover:text-white border border-white/10 text-white backdrop-blur-sm transition-all shadow-lg hidden md:block cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Lightbox Content Container */}
          <div
            className="relative z-10 w-full max-w-5xl bg-gradient-to-b from-slate-900 to-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[85vh] animate-modal-content"
          >
            
            {/* Image Frame */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 md:p-8 relative min-h-[280px] md:min-h-[450px]">
              {/* Close Button on Mobile */}
              <button
                onClick={() => setActiveImageIndex(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black md:hidden cursor-pointer"
              >
                <X size={20} />
              </button>

              {(activeImage.url || activeImage.imageUrl) ? (
                <OptimizedImage
                  src={(activeImage.url || activeImage.imageUrl)!}
                  alt={activeImage.title}
                  className="w-full h-full max-h-[70vh] object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="relative w-full max-w-[380px] aspect-square flex flex-col items-center justify-center bg-black/55 rounded-2xl border border-white/10 shadow-inner">
                  <ImageIcon size={80} className="text-[var(--secondary)] opacity-70 animate-pulse mb-4" />
                  <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">
                    Placeholder Record
                  </span>
                  <div className="text-[10px] text-white/40 mt-1">
                    ID: {activeImage.id} &bull; Aspect: {activeImage.aspect}
                  </div>
                </div>
              )}

              {/* Quick Mobile Swipe Actions */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between md:hidden gap-4">
                <button
                  onClick={handlePrev}
                  className="flex-1 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white text-xs font-semibold text-center cursor-pointer"
                >
                  &larr; Prev
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white text-xs font-semibold text-center cursor-pointer"
                >
                  Next &rarr;
                </button>
              </div>
            </div>

            {/* Caption & Details Side Panel */}
            <div className="w-full md:w-[380px] bg-slate-950/90 border-t md:border-t-0 md:border-l border-white/10 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-[85vh]">
              
              <div>
                {/* Header Metadata */}
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-[var(--secondary)]/10 text-[var(--secondary)] border border-[var(--secondary)]/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {activeImage.category.replace('_', ' ')}
                  </span>
                  
                  {/* Close Button on Desktop */}
                  <button
                    onClick={() => setActiveImageIndex(null)}
                    className="p-1.5 rounded-full bg-white/5 text-white hover:bg-white hover:text-black transition-colors hidden md:block cursor-pointer"
                    aria-label="Close details"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Caption / Title */}
                <h3 className="text-lg font-bold text-white mb-4 leading-snug">
                  {activeImage.title}
                </h3>

                {/* Divider */}
                <div className="w-12 h-0.5 bg-[var(--secondary)] mb-6" />

                {/* Detailed Description */}
                {activeImage.description && (
                  <div className="mb-6">
                    <h4 className="text-[10px] uppercase tracking-wider text-white/40 mb-2 font-semibold flex items-center gap-1.5">
                      <FileText size={12} className="text-[var(--secondary)]" />
                      Context Details
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-lg border border-white/5">
                      {activeImage.description}
                    </p>
                  </div>
                )}

                {/* Source Page Info */}
                {activeImage.page && (
                  <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                    <BookOpen size={18} className="text-[var(--secondary)] flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-white/40 block leading-none mb-0.5">Source Publication Page</span>
                      <span className="font-semibold text-white">Page {activeImage.page} of Coffee Table Book</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Pagination Info */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                <span>
                  Slide <strong className="text-white">{(activeImageIndex ?? 0) + 1}</strong> of <strong className="text-white">{filteredImages.length}</strong>
                </span>
                <span className="hidden md:inline text-[9px]">
                  Use &larr; &rarr; keys to browse
                </span>
              </div>

            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 lg:right-8 z-50 p-3 rounded-full bg-white/10 hover:bg-[var(--secondary)] hover:text-white border border-white/10 text-white backdrop-blur-sm transition-all shadow-lg hidden md:block cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </section>
  );
}
