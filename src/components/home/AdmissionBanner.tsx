import Link from 'next/link';
import { ArrowRight, FileText, Phone } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const year = new Date().getFullYear();

export default function AdmissionBanner() {
  return (
    <section className="bg-blue-700 py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Left */}
          <div className="text-white text-center lg:text-left">
            <span className="inline-block bg-white/15 border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide">
              ভর্তি চলছে {year}–{year + 1}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
              আজই ভর্তির আবেদন করুন
            </h2>
            <p className="text-blue-100/80 text-sm leading-relaxed max-w-lg">
              এবতেদায়ী থেকে দাখিল পর্যন্ত সকল শ্রেণিতে আসন সীমিত। দ্রুত আবেদন করুন।
            </p>
          </div>

          {/* Right — buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/admission"
              className="group inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-black px-7 py-3.5 rounded-lg text-sm hover:bg-blue-50 transition-all shadow-lg"
            >
              <FileText size={15} />
              আবেদন ফর্ম
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/notice"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white/90 font-semibold px-7 py-3.5 rounded-lg text-sm hover:bg-white/10 hover:border-white/50 hover:text-white transition-all"
            >
              বিজ্ঞপ্তি দেখুন
            </Link>
          </div>

        </div>

        {/* Contact line */}
        <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-center gap-2">
          <Phone size={11} className="text-blue-200" />
          <span className="text-blue-200 text-xs">{COLLEGE_INFO.phone} — যোগাযোগ করুন</span>
        </div>
      </div>
    </section>
  );
}
