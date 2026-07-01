import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award, Phone } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const year = new Date().getFullYear();

const FEATURES = [
  { icon: BookOpen, label: 'শ্রেণিসমূহ', value: 'এবতেদায়ী — দাখিল' },
  { icon: Users, label: 'আসন সংখ্যা', value: 'সীমিত আসন — দ্রুত আবেদন করুন' },
  { icon: Award, label: 'বৃত্তি সুবিধা', value: 'মেধাবীদের জন্য বিশেষ ছাড়' },
];

export default function AdmissionBanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#006633] to-[#004020] relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '28px 28px' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left: Text & CTAs */}
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold text-white mb-6 tracking-wide">
              ✦ ভর্তি চলছে {year}–{year + 1}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5">
              আজই ভর্তির<br />আবেদন করুন
            </h2>
            <p className="text-green-100/75 text-[15px] leading-relaxed mb-8 max-w-md">
              এবতেদায়ী থেকে দাখিল পর্যন্ত সকল শ্রেণিতে আসন সীমিত। দ্রুত আবেদন করুন এবং আপনার সন্তানের উজ্জ্বল ভবিষ্যৎ গড়ুন।
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/admission"
                className="group inline-flex items-center gap-2 bg-white text-[#006633] font-black px-7 py-3.5 rounded-xl text-sm hover:bg-green-50 transition-all shadow-lg">
                আবেদন ফর্ম
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/notice"
                className="inline-flex items-center gap-2 border border-white/30 text-white/90 font-semibold px-7 py-3.5 rounded-xl text-sm hover:bg-white/10 hover:border-white/50 transition-all">
                বিজ্ঞপ্তি দেখুন
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-green-300" />
              <span className="text-green-200 text-xs">{COLLEGE_INFO.phone} — যোগাযোগ করুন</span>
            </div>
          </div>

          {/* Right: Feature cards */}
          <div className="flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, label, value }) => (
              <div key={label}
                className="flex items-center gap-5 bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-xs font-medium">{label}</p>
                  <p className="text-white font-bold text-sm mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
