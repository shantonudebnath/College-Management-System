import Link from 'next/link';
import { GraduationCap, BookOpen, Users, Award, ArrowRight, Star } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

export default function HeroSection() {
  return (
    <section className="gradient-hero text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-300 rounded-full blur-2xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-xs font-medium mb-6">
              <Star size={12} className="text-yellow-300" />
              <span>বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              <span className="block">{COLLEGE_INFO.nameBn}</span>
              <span className="block text-purple-300 text-2xl md:text-3xl mt-2">{COLLEGE_INFO.name}</span>
            </h1>

            <p className="text-purple-200 text-base leading-relaxed mb-8 max-w-lg">
              শ্রেণি ১ম থেকে দাখিল পর্যন্ত মানসম্মত ইসলামি শিক্ষা। আধুনিক ডিজিটাল পদ্ধতিতে শিক্ষার্থীদের জন্য সম্পূর্ণ ম্যানেজমেন্ট সিস্টেম।
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/register" className="flex items-center gap-2 btn-primary px-6 py-3 rounded-xl font-semibold text-sm shadow-lg">
                ভর্তি হোন <ArrowRight size={16} />
              </Link>
              <Link href="/result" className="flex items-center gap-2 bg-white/10 border border-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors">
                ফলাফল দেখুন
              </Link>
            </div>

            {/* Quick features */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: BookOpen, label: 'ডিজিটাল ক্লাস ম্যানেজমেন্ট' },
                { icon: Award, label: 'অনলাইনে ফলাফল' },
                { icon: Users, label: 'শিক্ষক-ছাত্র পোর্টাল' },
                { icon: GraduationCap, label: 'স্বয়ংক্রিয় রিপোর্ট' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                  <Icon size={14} className="text-purple-300 shrink-0" />
                  <span className="text-xs text-white/90">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating cards */}
          <div className="hidden lg:flex justify-center items-center relative h-80">
            {/* Central circle */}
            <div className="w-40 h-40 gradient-primary rounded-full flex items-center justify-center shadow-2xl animate-float z-10">
              <GraduationCap size={56} className="text-white" />
            </div>

            {/* Floating cards */}
            <div className="absolute top-0 right-8 glass text-gray-900 rounded-2xl p-4 shadow-xl w-44">
              <p className="text-2xl font-bold text-purple-700">১,২০০+</p>
              <p className="text-xs text-gray-600">মোট শিক্ষার্থী</p>
              <p className="text-[10px] text-green-600 mt-1">↑ এই বছর ভর্তি চলছে</p>
            </div>

            <div className="absolute bottom-0 right-4 glass text-gray-900 rounded-2xl p-4 shadow-xl w-44">
              <p className="text-2xl font-bold text-purple-700">৯৮%</p>
              <p className="text-xs text-gray-600">পাশের হার</p>
              <p className="text-[10px] text-green-600 mt-1">↑ গত পরীক্ষায়</p>
            </div>

            <div className="absolute top-12 left-0 glass text-gray-900 rounded-2xl p-4 shadow-xl w-40">
              <p className="text-2xl font-bold text-purple-700">৪৫+</p>
              <p className="text-xs text-gray-600">অভিজ্ঞ শিক্ষক</p>
            </div>

            <div className="absolute bottom-12 left-4 glass text-gray-900 rounded-2xl p-4 shadow-xl w-40">
              <p className="text-2xl font-bold text-purple-700">{COLLEGE_INFO.established}</p>
              <p className="text-xs text-gray-600">প্রতিষ্ঠা বছর</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 25C672 30 768 30 864 25C960 20 1056 10 1152 10C1248 10 1344 20 1392 25L1440 30V60H0Z" fill="#f8f7ff"/>
        </svg>
      </div>
    </section>
  );
}
