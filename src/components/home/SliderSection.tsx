'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { loadWebsiteContent, DEFAULT_CONTENT, type SlideItem } from '@/lib/website-content';

export default function SliderSection() {
  const [slides, setSlides] = useState<SlideItem[]>(DEFAULT_CONTENT.slides);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const loaded = loadWebsiteContent().slides;
    if (loaded?.length) setSlides(loaded);
  }, []);

  const go = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const next = useCallback(() => go((current + 1) % slides.length), [current, go, slides.length]);
  const prev = () => go((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current] ?? DEFAULT_CONTENT.slides[0];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '68vh', minHeight: '460px', maxHeight: '680px' }}
    >
      {/* Fallback gradient — always present, visible when photo is missing */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071a0e] via-[#0a2d1a] to-[#07111e]" />

      {/* Photo layer — CSS bg-image, silently fails if file missing */}
      <div
        key={slide.id}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
        style={{
          backgroundImage: `url('${slide.photo}')`,
          opacity: animating ? 0.6 : 1,
        }}
      />

      {/* Overlay: left-heavy gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full">
          <div
            className={`max-w-2xl transition-all duration-500 ${
              animating ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Tag */}
            <p className="flex items-center gap-2 text-white/65 text-[11px] font-medium tracking-[0.15em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              {slide.tag}
            </p>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-black text-white leading-[1.1] tracking-tight mb-4">
              {slide.headline}
            </h1>

            {/* Accent bar */}
            <div className="w-12 h-[3px] bg-[#00a854] rounded-full mb-5" />

            {/* Subtitle */}
            <p className="text-white/60 text-sm sm:text-[15px] leading-relaxed mb-8 max-w-xl">
              {slide.sub}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={slide.cta1Href}
                className="group inline-flex items-center gap-2 bg-[#006633] hover:bg-[#004d26] text-white font-bold px-6 py-3 rounded-lg text-sm transition-all shadow-lg shadow-black/40"
              >
                {slide.cta1Label}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href={slide.cta2Href}
                className="inline-flex items-center gap-2 border border-white/25 text-white/80 font-semibold px-6 py-3 rounded-lg text-sm hover:bg-white/10 hover:border-white/45 hover:text-white transition-all backdrop-blur-sm"
              >
                {slide.cta2Label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide controls — bottom center */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white transition-all"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-[#00c86a]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next slide"
          className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white transition-all"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </section>
  );
}
