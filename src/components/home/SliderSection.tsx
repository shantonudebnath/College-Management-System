'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    glow: '#7c3aed',
  },
  {
    id: 's2',
    tag: `ভর্তি চলছে — ${year}`,
    headline: 'আপনার সন্তানের ভবিষ্যৎ গড়ুন',
    sub: 'এবতেদায়ী থেকে দাখিল পর্যন্ত সকল শ্রেণিতে ভর্তির সুযোগ। মানসম্মত ইসলামি শিক্ষা নিশ্চিত করুন।',
    cta1: { label: 'এখনই আবেদন করুন', href: '/admission' },
    cta2: { label: 'ভর্তির বিজ্ঞপ্তি', href: '/notice' },
    glow: '#2563eb',
  },
  {
    id: 's3',
    tag: `EIIN: ${COLLEGE_INFO.eiin} | স্থাপিত ${COLLEGE_INFO.established}`,
    headline: 'শিক্ষায় আলো, জীবনে শান্তি',
    sub: `${yearsOld} বছরেরও বেশি সময় ধরে পাকুন্দিয়া, কিশোরগঞ্জের শিক্ষার্থীদের জ্ঞান ও নৈতিক মূল্যবোধে গড়ে তুলছে এই মাদ্রাসা।`,
    cta1: { label: 'ফলাফল দেখুন', href: '/result' },
    cta2: { label: 'শিক্ষক তালিকা', href: '/teachers' },
    glow: '#6d28d9',
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
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="relative w-full bg-[#080818] overflow-hidden" style={{ minHeight: '100vh' }}>

      {/* Animated glow blob */}
      <div
        className="absolute -top-20 -right-20 w-[700px] h-[700px] rounded-full blur-[140px] opacity-12 transition-all duration-1000 pointer-events-none"
        style={{ background: slide.glow }}
      />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900 rounded-full blur-[120px] opacity-10 pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center" style={{ minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-14 w-full py-28">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">

            {/* ── Text ── 3 cols */}
            <div
              className={`lg:col-span-3 text-white transition-all duration-500 ${
                animating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Live tag */}
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
                <span className="text-[11px] text-white/45 font-medium tracking-wider uppercase">
                  {slide.tag}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-black text-white leading-[1.08] tracking-tight mb-5">
                {slide.headline}
              </h1>

              {/* Accent bar */}
              <div className="w-14 h-[3px] bg-purple-500 rounded-full mb-6" />

              {/* Subtitle */}
              <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-11 max-w-lg">
                {slide.sub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={slide.cta1.href}
                  className="group inline-flex items-center gap-2.5 bg-white text-gray-950 font-bold px-7 py-4 rounded-2xl text-sm hover:bg-purple-50 transition-all"
                  style={{ boxShadow: '0 8px 32px rgba(124,58,237,0.25)' }}
                >
                  {slide.cta1.label}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={slide.cta2.href}
                  className="inline-flex items-center gap-2 border border-white/10 bg-white/4 text-white/75 font-semibold px-7 py-4 rounded-2xl text-sm hover:bg-white/8 hover:text-white hover:border-white/20 transition-all backdrop-blur-sm"
                >
                  {slide.cta2.label}
                </Link>
              </div>

              {/* Slide controls */}
              <div className="flex items-center gap-3 mt-16">
                <button
                  onClick={prev}
                  aria-label="Previous slide"
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/35 hover:text-white transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === current ? 'w-8 h-2 bg-purple-400' : 'w-2 h-2 bg-white/15 hover:bg-white/35'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  aria-label="Next slide"
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/35 hover:text-white transition-all"
                >
                  <ChevronRight size={16} />
                </button>
                <span className="text-white/15 text-xs font-mono ml-1 tabular-nums">
                  {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* ── Logo Card ── 2 cols */}
            <div
              className={`hidden lg:flex lg:col-span-2 justify-center transition-all duration-500 ${
                animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="relative">
                {/* Glass card */}
                <div
                  className="w-72 h-72 rounded-[2.5rem] border border-white/8 bg-white/3 backdrop-blur-xl flex items-center justify-center p-10"
                  style={{ boxShadow: '0 0 80px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.06)' }}
                >
                  <div className="w-full h-full relative">
                    <Image
                      src="/logo.png"
                      alt="মাদ্রাসা লোগো"
                      fill
                      className="object-contain drop-shadow-2xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Chip: প্রতিষ্ঠা */}
                <div className="absolute -top-6 -right-10 bg-white text-gray-900 rounded-2xl px-5 py-3 shadow-2xl text-center">
                  <p className="text-2xl font-black leading-none">{COLLEGE_INFO.established}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">প্রতিষ্ঠা সাল</p>
                </div>

                {/* Chip: পাশের হার */}
                <div className="absolute -bottom-6 -left-10 bg-amber-400 text-amber-950 rounded-2xl px-5 py-3 shadow-2xl text-center">
                  <p className="text-2xl font-black leading-none">৯৮%</p>
                  <p className="text-[10px] font-medium mt-0.5">পাশের হার</p>
                </div>

                {/* Chip: EIIN */}
                <div className="absolute top-1/2 -left-16 -translate-y-1/2 bg-purple-600 text-white rounded-2xl px-4 py-2.5 shadow-xl text-center">
                  <p className="text-sm font-black">{COLLEGE_INFO.eiin}</p>
                  <p className="text-[9px] opacity-65 mt-0.5">EIIN</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080818] to-transparent pointer-events-none" />
    </section>
  );
}
