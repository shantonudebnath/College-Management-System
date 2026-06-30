'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, BookOpen, Award, Users, GraduationCap } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';
import { loadWebsiteContent, DEFAULT_CONTENT } from '@/lib/website-content';

export default function HeroSection() {
  const [subtitle, setSubtitle] = useState(DEFAULT_CONTENT.heroSubtitle);
  const [stats, setStats] = useState(DEFAULT_CONTENT.stats);

  useEffect(() => {
    loadWebsiteContent().then(c => { setSubtitle(c.heroSubtitle); setStats(c.stats); });
  }, []);

  const icons = [BookOpen, Award, Users, GraduationCap];

  return (
    <section className="gradient-hero text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-300 rounded-full blur-2xl" />
      </div>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-xs font-medium mb-6">
              <Star size={12} className="text-yellow-300" />
              <span>{COLLEGE_INFO.board} অনুমোদিত | স্থাপিত {COLLEGE_INFO.established}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              <span className="block">{COLLEGE_INFO.nameBn}</span>
              <span className="block text-purple-300 text-lg md:text-2xl mt-2">{COLLEGE_INFO.name}</span>
            </h1>

            <p className="text-purple-200 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/admission" className="flex items-center gap-2 btn-primary px-6 py-3 rounded-xl font-semibold text-sm shadow-lg">
                ভর্তি আবেদন করুন <ArrowRight size={16} />
              </Link>
              <Link href="/result" className="flex items-center gap-2 bg-white/10 border border-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors">
                ফলাফল দেখুন
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map(({ label, value }, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-3 text-center">
                    <Icon size={16} className="text-purple-300 mx-auto mb-1" />
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-[10px] text-white/70 mt-0.5">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Logo + floating cards */}
          <div className="hidden lg:flex justify-center items-center relative h-80">
            <div className="w-48 h-48 bg-white rounded-3xl flex items-center justify-center shadow-2xl z-10 p-5">
              <div className="relative w-full h-full">
                <Image src="/logo.png" alt="মাদ্রাসা লোগো" fill className="object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>
            </div>

            <div className="absolute top-4 right-4 glass text-gray-900 rounded-2xl p-4 shadow-xl w-44">
              <p className="text-2xl font-bold text-purple-700">{COLLEGE_INFO.established}</p>
              <p className="text-xs text-gray-600">প্রতিষ্ঠা সাল</p>
            </div>
            <div className="absolute bottom-4 right-8 glass text-gray-900 rounded-2xl p-4 shadow-xl w-44">
              <p className="text-2xl font-bold text-purple-700">{stats[3]?.value ?? '৯৮%'}</p>
              <p className="text-xs text-gray-600">পাশের হার</p>
            </div>
            <div className="absolute top-12 left-0 glass text-gray-900 rounded-2xl p-4 shadow-xl w-40">
              <p className="text-2xl font-bold text-purple-700">{stats[0]?.value ?? '১,২০০+'}</p>
              <p className="text-xs text-gray-600">মোট শিক্ষার্থী</p>
            </div>
            <div className="absolute bottom-12 left-4 glass text-gray-900 rounded-2xl p-4 shadow-xl w-40">
              <p className="text-2xl font-bold text-purple-700">EIIN</p>
              <p className="text-xs text-gray-600">{COLLEGE_INFO.eiin}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 25C672 30 768 30 864 25C960 20 1056 10 1152 10C1248 10 1344 20 1392 25L1440 30V60H0Z" fill="#f8f7ff" />
        </svg>
      </div>
    </section>
  );
}
