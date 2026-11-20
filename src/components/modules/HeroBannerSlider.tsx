'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight, Award } from 'lucide-react';
import { HeroBlockData } from '@/types/cms';

interface HeroBannerSliderProps {
  id?: string;
  data: HeroBlockData;
}

const DEFAULT_SLIDES = [
  {
    imageUrl: '/uploads/02.png',
    imageAlt: 'GUNICSH 2024 International Conference - Ganpat University',
    title: 'GUNICSH 2024 International Conference',
    subtitle: 'Ganpat University',
    linkUrl: '/registration-fess'
  },
  {
    imageUrl: '/uploads/Job-145.jpg',
    imageAlt: '4th International Conference on Human Technological Interaction (HTI) MARCH 2-3, 2024',
    title: '4th International Conference on Human Technological Interaction (HTI)',
    subtitle: 'MARCH 2-3, 2024',
    linkUrl: '/call-for-papers'
  },
  {
    imageUrl: '/uploads/GCEMP_slider4.jpg',
    imageAlt: 'Faculty of Social Sciences & Humanities - GUNICSH Conference',
    title: 'GUNICSH International Conference',
    subtitle: 'Faculty of Social Sciences & Humanities',
    linkUrl: '/about-us'
  },
  {
    imageUrl: '/uploads/GCEMP_slider1.jpg',
    imageAlt: 'Transforming Business in ESG (Environmental, Social and Governance)',
    title: 'Transforming Business in ESG',
    subtitle: 'Environmental, Social and Governance',
    linkUrl: '/theme'
  },
  {
    imageUrl: '/uploads/GCEMP_slider2.jpg',
    imageAlt: 'Ganpat University International Conference on Management Perspectives, Practices & Research Trends',
    title: 'Perspectives, Practices & Research Trends',
    subtitle: 'Ganpat University International Conference',
    linkUrl: '/call-for-papers'
  },
  {
    imageUrl: '/uploads/GCEMP_slider3.jpg',
    imageAlt: 'Multidisciplinary Research & Innovation Conference',
    title: 'Multidisciplinary Research & Innovation',
    subtitle: 'Global Impact through NEP 2020',
    linkUrl: '/publication'
  },
  {
    imageUrl: '/uploads/Slider-2.jpg',
    imageAlt: 'GUNICSH Research Highlights & Innovation',
    title: 'Research Horizons & Academic Dialogue',
    subtitle: 'Ganpat University',
    linkUrl: '/the-conference'
  },
  {
    imageUrl: '/uploads/ai-banner.jpg',
    imageAlt: 'AI & Technological Interaction in Humanities',
    title: 'Technological Interaction & Modern Society',
    subtitle: 'Faculty of Social Sciences & Humanities',
    linkUrl: '/theme'
  },
  {
    imageUrl: '/uploads/Ganpat-University.jpg',
    imageAlt: 'Ganpat University Campus - Kherva, Mehsana, Gujarat',
    title: 'Ganpat University Campus',
    subtitle: 'Ganpat Vidyanagar, Mehsana-Gandhinagar Highway, Gujarat',
    linkUrl: '/contact-us'
  }
];

export default function HeroBannerSlider({ id, data }: HeroBannerSliderProps) {
  const slides = (data.slides && data.slides.length > 0) ? data.slides : DEFAULT_SLIDES;
  const intervalTime = data.autoPlayInterval || 4500;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Autoplay timer
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, intervalTime, nextSlide, totalSlides]);

  // Touch swipe handling
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div id={id} className="relative w-full bg-[#0a0f1d] select-none">
      {/* 1. Main Full-Width Slider Container (Enlarged Height, Zero-Crop Presentation) */}
      <div
        className="relative w-full h-[320px] sm:h-[440px] md:h-[540px] lg:h-[620px] xl:h-[680px] 2xl:h-[740px] overflow-hidden group bg-slate-950"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides Track */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const imgSrc = slide.imageUrl || (slide as any).image;
          const link = slide.linkUrl || (slide as any).ctaUrl || (slide as any).url;
          const altText = slide.imageAlt || slide.title || `Conference Slide ${index + 1}`;

          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Ambient Blurred Aura: matches slide colors, eliminates harsh empty borders */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
                  <img
                    src={imgSrc}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover blur-3xl opacity-35 scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-950/40" />
                </div>

                {/* Main Foreground Slide: Fully Contained, Never Cropped (No text/image cut off!) */}
                {link ? (
                  <Link
                    href={link}
                    className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer p-0 sm:p-2"
                  >
                    <img
                      src={imgSrc}
                      alt={altText}
                      className="w-full h-full object-contain object-center drop-shadow-2xl transition-transform duration-500 hover:scale-[1.008]"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </Link>
                ) : (
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-0 sm:p-2">
                    <img
                      src={imgSrc}
                      alt={altText}
                      className="w-full h-full object-contain object-center drop-shadow-2xl transition-transform duration-500"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 2. Navigation Arrows (Left / Right) */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/45 hover:bg-[#A81C24] text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 border border-white/20 shadow-xl hover:scale-110 opacity-75 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/45 hover:bg-[#A81C24] text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 border border-white/20 shadow-xl hover:scale-110 opacity-75 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* 3. Bottom Indicator Dots & Progress */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-7 h-2.5 bg-[#A81C24] shadow-[0_0_10px_rgba(168,28,36,0.9)]'
                    : 'w-2.5 h-2.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Elegant Conference Strip Right Below the Slider */}
      <div className="bg-gradient-to-r from-[#162544] via-[#1E293B] to-[#162544] border-y border-[#A81C24]/30 text-white py-3.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          {/* Key Announcements */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs md:text-sm text-slate-200">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#A81C24] text-white font-semibold text-xs tracking-wider uppercase">
              <Award className="w-3.5 h-3.5" />
              GUNICSH 2024
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-[#D97706]" />
              March 02-03, 2024
            </span>
            <span className="hidden lg:inline text-slate-400">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#D97706]" />
              VMPCMS, Ganpat University, Gujarat
            </span>
            <span className="hidden xl:inline text-slate-400">•</span>
            <span className="hidden xl:inline text-[#D97706] font-semibold">
              Scopus Indexed & UGC CARE Listed Publication
            </span>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/call-for-papers"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-white bg-[#A81C24] hover:bg-[#8B141B] px-3.5 py-1.5 rounded-lg shadow transition-colors"
            >
              Submit Paper
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/registration-fess"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg border border-white/15 transition-colors"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
