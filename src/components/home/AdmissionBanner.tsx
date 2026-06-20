import Link from 'next/link';
import { ArrowRight, FileText, Phone } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const year = new Date().getFullYear();

export default function AdmissionBanner() {
  return (
    <section className="py-14 bg-white border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#1e1b4b] to-[#4338ca] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              ভর্তি চলছে {year}–{year + 1}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">আজই ভর্তির আবেদন করুন</h2>
            <p className="text-white/70 text-sm">এবতেদায়ী থেকে দাখিল পর্যন্ত সকল শ্রেণিতে আসন সীমিত।</p>
            <p className="text-white/60 text-xs mt-3 flex items-center gap-1.5">
              <Phone size={11} /> যোগাযোগ: {COLLEGE_INFO.phone}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/admission"
              className="flex items-center justify-center gap-2 bg-white text-purple-800 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-yellow-50 transition-colors shadow-lg whitespace-nowrap">
              <FileText size={15} /> আবেদন ফর্ম
            </Link>
            <Link href="/notice"
              className="flex items-center justify-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors whitespace-nowrap">
              বিজ্ঞপ্তি দেখুন <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
