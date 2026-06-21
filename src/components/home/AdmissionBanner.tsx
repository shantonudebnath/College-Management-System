import Link from 'next/link';
import { ArrowRight, FileText, Phone } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const year = new Date().getFullYear();

export default function AdmissionBanner() {
  return (
    <section className="relative bg-[#060d1a] py-24 overflow-hidden">
      {/* Glow */}
      <div className="absolute left-0 top-0 w-[600px] h-full bg-blue-800/10 blur-[120px] pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-indigo-700/10 blur-[100px] pointer-events-none" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="text-white">
            <span className="inline-block bg-yellow-400 text-yellow-950 text-xs font-black px-4 py-1.5 rounded-full mb-7 tracking-wide">
              ভর্তি চলছে {year}–{year + 1}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
              আজই ভর্তির<br className="hidden sm:block" /> আবেদন করুন
            </h2>
            <div className="w-14 h-[3px] bg-yellow-400 rounded-full mb-6" />
            <p className="text-white/50 text-base leading-relaxed mb-10 max-w-md">
              এবতেদায়ী থেকে দাখিল পর্যন্ত সকল শ্রেণিতে আসন সীমিত। দ্রুত আবেদন করুন।
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/admission"
                className="group inline-flex items-center gap-2.5 bg-yellow-400 text-yellow-950 font-black px-8 py-4 rounded-2xl text-sm hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-500/20"
              >
                <FileText size={15} /> আবেদন ফর্ম
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/notice"
                className="inline-flex items-center gap-2 border border-white/10 bg-white/4 text-white/75 font-semibold px-8 py-4 rounded-2xl text-sm hover:bg-white/8 hover:text-white transition-all backdrop-blur-sm"
              >
                বিজ্ঞপ্তি দেখুন
              </Link>
            </div>
            <p className="text-white/30 text-xs flex items-center gap-2">
              <Phone size={11} className="text-white/40" /> {COLLEGE_INFO.phone}
            </p>
          </div>

          {/* Right — decorative year */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative flex flex-col items-center justify-center w-64 h-64 rounded-full border border-white/8 bg-white/3 backdrop-blur-sm"
              style={{ boxShadow: '0 0 80px rgba(250,204,21,0.08)' }}>
              <p className="text-7xl font-black text-white leading-none tracking-tight">{year}</p>
              <div className="w-10 h-[2px] bg-yellow-400 rounded-full my-3" />
              <p className="text-white/35 text-sm font-medium">ভর্তি বর্ষ</p>
              <p className="text-white/20 text-xs mt-1">{year}–{year + 1}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
