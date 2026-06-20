'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';
import { loadWebsiteContent } from '@/lib/website-content';

const DEFAULT_SLIDES = [
  {
    id: 's1',
    image: '',
    gradient: 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]',
    title: COLLEGE_INFO.nameBn,
    subtitle: 'মানসম্মত ইসলামি শিক্ষা ও আধুনিক জ্ঞানের সমন্বয়ে একটি উজ্জ্বল ভবিষ্যৎ গড়ে তুলুন।',
    cta: { label: 'ভর্তি আবেদন', href: '/admission' },
  },
  {
    id: 's2',
    image: '',
    gradient: 'from-[#1e3a5f] via-[#1d4ed8] to-[#0369a1]',
    title: `ভর্তি চলছে — ${new Date().getFullYear()}`,
    subtitle: 'এবতেদায়ী থেকে দাখিল পর্যন্ত সকল শ্রেণিতে ভর্তির সুযোগ। আজই আবেদন করুন।',
    cta: { label: 'আবেদন করুন', href: '/admission' },
  },
  {
    id: 's3',
    image: '',
    gradient: 'from-[#14532d] via-[#15803d] to-[#166534]',
    title: 'শিক্ষায় আলো, জীবনে শান্তি',
    subtitle: `স্থাপিত ${COLLEGE_INFO.established} সাল | EIIN: ${COLLEGE_INFO.eiin} | ${COLLEGE_INFO.board} অনুমোদিত`,
    cta: { label: 'প্রতিষ্ঠান সম্পর্কে', href: '/about' },
  },
];

interface Slide {
  id: string;
  image: string;
  gradient: string;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
}

export default function SliderSection() {
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const c = loadWebsiteContent();
    if (c.gallery && c.gallery.length > 0) {
      const gallerySlides: Slide[] = c.gallery.slice(0, 5).map((g, i) => ({
        id: g.id,
        image: g.url,
        gradient: DEFAULT_SLIDES[i % DEFAULT_SLIDES.length].gradient,
        title: g.caption || COLLEGE_INFO.nameBn,
        subtitle: '',
      }));
      setSlides(gallerySlides.length >= 2 ? gallerySlides : DEFAULT_SLIDES);
    }
  }, []);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '420px' }}>
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-all duration-700`} />
      {slide.image && (
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover opacity-40 transition-opacity duration-700"
          priority
        />
      )}
      {/* Overlay pattern */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-4xl mx-auto px-8 text-white text-center w-full">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">
            {COLLEGE_INFO.board}
          </p>
          <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-4 drop-shadow-lg">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-7 leading-relaxed">
              {slide.subtitle}
            </p>
          )}
          {slide.cta && (
            <Link href={slide.cta.href}
              className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-7 py-3 rounded-xl text-sm hover:bg-purple-50 transition-colors shadow-lg">
              {slide.cta.label}
            </Link>
          )}
        </div>
      </div>

      {/* Prev/Next */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors">
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </section>
  );
}
