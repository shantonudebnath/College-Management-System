'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const SLIDES = [
  {
    id: 's1',
    gradient: 'from-[#0f0c29] via-[#1e1b4b] to-[#302b63]',
    badge: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত',
    title: COLLEGE_INFO.nameBn,
    titleEn: COLLEGE_INFO.name,
    subtitle: 'ইসলামি শিক্ষা ও আধুনিক জ্ঞানের সমন্বয়ে একটি উজ্জ্বল ভবিষ্যৎ গড়ে তুলুন।',
    cta: { label: 'ভর্তি আবেদন করুন', href: '/admission', style: 'primary' },
    cta2: { label: 'প্রতিষ্ঠান সম্পর্কে', href: '/about', style: 'outline' },
  },
  {
    id: 's2',
    gradient: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
    badge: `ভর্তি চলছে — ${new Date().getFullYear()}`,
    title: 'আপনার সন্তানের ভবিষ্যৎ গড়ুন',
    titleEn: 'Build Your Child\'s Future With Us',
    subtitle: 'এবতেদায়ী থেকে দাখিল পর্যন্ত সকল শ্রেণিতে ভর্তির সুযোগ। মানসম্মত পরিবেশে ইসলামি শিক্ষা নিশ্চিত করুন।',
    cta: { label: 'এখনই আবেদন করুন', href: '/admission', style: 'primary' },
    cta2: { label: 'ভর্তির তথ্য', href: '/notice', style: 'outline' },
  },
  {
    id: 's3',
    gradient: 'from-[#1a0533] via-[#2d1b5e] to-[#1e1b4b]',
    badge: `EIIN: ${COLLEGE_INFO.eiin} | স্থাপিত ${COLLEGE_INFO.established}`,
    title: 'শিক্ষায় আলো, জীবনে শান্তি',
    titleEn: 'Excellence in Islamic Education Since 1958',
    subtitle: `৬৮ বছরেরও বেশি সময় ধরে পাকুন্দিয়া, কিশোরগঞ্জের শিক্ষার্থীদের জ্ঞান ও নৈতিক মূল্যবোধে গড়ে তুলছে ${COLLEGE_INFO.nameBn}।`,
    cta: { label: 'ফলাফল দেখুন', href: '/result', style: 'primary' },
    cta2: { label: 'শিক্ষক তালিকা', href: '/teachers', style: 'outline' },
  },
];

export default function SliderSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  const next = useCallback(() => go((current + 1) % SLIDES.length), [current, go]);
  const prev = () => go((current - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '520px' }}>
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-700`} />

      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Content */}
      <div className="relative flex items-center" style={{ minHeight: '520px' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10 w-full py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Text */}
            <div className={`text-white transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-white/80 mb-5">
                <GraduationCap size={12} className="text-yellow-300" />
                {slide.badge}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
                {slide.title}
              </h1>
              <p className="text-purple-200/70 text-sm font-medium mb-4 tracking-wide">{slide.titleEn}</p>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={slide.cta.href}
                  className="bg-white text-purple-800 font-bold px-7 py-3 rounded-xl text-sm hover:bg-purple-50 transition-colors shadow-xl shadow-black/20">
                  {slide.cta.label}
                </Link>
                <Link href={slide.cta2.href}
                  className="border border-white/30 text-white font-semibold px-7 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors">
                  {slide.cta2.label}
                </Link>
              </div>
            </div>

            {/* Logo card */}
            <div className={`hidden lg:flex justify-center transition-all duration-500 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="relative">
                <div className="w-56 h-56 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl p-6">
                  <div className="w-full h-full relative">
                    <Image src="/logo.png" alt="মাদ্রাসা লোগো" fill className="object-contain drop-shadow-lg"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                </div>
                {/* Info chips */}
                <div className="absolute -top-4 -right-6 bg-white text-purple-800 rounded-2xl px-4 py-2 shadow-xl text-center">
                  <p className="text-lg font-bold leading-none">{COLLEGE_INFO.established}</p>
                  <p className="text-[10px] font-medium mt-0.5">প্রতিষ্ঠা সাল</p>
                </div>
                <div className="absolute -bottom-4 -left-6 bg-yellow-400 text-yellow-900 rounded-2xl px-4 py-2 shadow-xl text-center">
                  <p className="text-lg font-bold leading-none">৯৮%</p>
                  <p className="text-[10px] font-medium mt-0.5">পাশের হার</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all">
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 items-center">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-7 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  );
}
