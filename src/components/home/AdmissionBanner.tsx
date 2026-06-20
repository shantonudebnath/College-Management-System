import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

const FEATURES = [
  'অনলাইনে আবেদন করুন',
  'দ্রুত প্রক্রিয়াকরণ',
  'SMS বিজ্ঞপ্তি',
  'সহজ ডকুমেন্ট জমা',
];

export default function AdmissionBanner() {
  return (
    <section className="py-16 gradient-primary text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-purple-200 text-sm font-medium mb-2">২০২৬ সালের ভর্তি কার্যক্রম চলছে</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">আজই ভর্তির আবেদন করুন</h2>
            <div className="grid grid-cols-2 gap-2">
              {FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-purple-100">
                  <CheckCircle size={14} className="text-green-300 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/admission"
              className="flex items-center justify-center gap-2 bg-white text-purple-700 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors shadow-lg">
              ভর্তি আবেদন ফর্ম <ArrowRight size={16} />
            </Link>
            <Link href="/notice"
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/30 px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors">
              ভর্তির বিজ্ঞপ্তি দেখুন
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
