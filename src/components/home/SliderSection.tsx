'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const year = new Date().getFullYear();
const yearsOld = year - 1958;

const SLIDES = [
  {
    id: 's1',
    tag: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত',
    headline: COLLEGE_INFO.nameBn,
    sub: 'ইসলামি শিক্ষা ও আধুনিক জ্ঞানের সমন্বয়ে একটি উজ্জ্বল ভবিষ্যৎ গড়ে তুলুন।',
    cta1: { label: 'ভর্তি আবেদন করুন', href: '/admission' },
    cta2: { label: 'প্রতিষ্ঠান সম্পর্কে', href: '/about' },
    photo: '/hero-1.jpg',
  },
  {
    id: 's2',
    tag: `ভর্তি চলছে — ${year}`,
    headline: 'আপনার সন্তানের ভবিষ্যৎ গড়ুন',
    sub: 'এবতেদায়ী থেকে দাখিল পর্যন্ত সকল শ্রেণিতে ভর্তির সুযোগ। মানসম্মত ইসলামি শিক্ষা নিশ্চিত করুন।',
    cta1: { label: 'এখনই আবেদন করুন', href: '/admission' },
    cta2: { label: 'ভর্তির বিজ্ঞপ্তি', href: '/notice' },
    photo: '/hero-2.jpg',
  },
  {
    id: 's3',
    tag: `EIIN: ${COLLEGE_INFO.eiin} | স্থাপিত ${COLLEGE_INFO.established}`,
    headline: 'শিক্ষায় আলো, জীবনে শান্তি',
    sub: `${yearsOld} বছরেরও বেশি সময় ধরে পাকুন্দিয়া, কিশোরগঞ্জের শিক্ষার্থীদের জ্ঞান ও নৈতিক মূল্যবোধে গড়ে তুলছে এই মাদ্রাসা।`,
    cta1: { label: 'ফলাফল দেখুন', href: '/result' },
    cta2: { label: 'শিক্ষক তালিকা', href: '/teachers' },
    photo: '/hero-3.jpg',
  },
];

export default function SliderSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const next = useCallback(() => go((current + 1) % SLIDES.length), [current, go]);
  const prev = () => go((current - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

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
                href={slide.cta1.href}
                className="group inline-flex items-center gap-2 bg-[#006633] hover:bg-[#004d26] text-white font-bold px-6 py-3 rounded-lg text-sm transition-all shadow-lg shadow-black/40"
              >
                {slide.cta1.label}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href={slide.cta2.href}
                className="inline-flex items-center gap-2 border border-white/25 text-white/80 font-semibold px-6 py-3 rounded-lg text-sm hover:bg-white/10 hover:border-white/45 hover:text-white transition-all backdrop-blur-sm"
              >
                {slide.cta2.label}
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
          {SLIDES.map((_, i) => (
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
