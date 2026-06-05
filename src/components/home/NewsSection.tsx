import Link from 'next/link';
import { NOTICES } from '@/lib/data';
import { Bell, ChevronRight, AlertCircle } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  exam: 'bg-blue-100 text-blue-700',
  fee: 'bg-amber-100 text-amber-700',
  result: 'bg-green-100 text-green-700',
  holiday: 'bg-rose-100 text-rose-700',
  general: 'bg-gray-100 text-gray-700',
};

const TYPE_LABELS: Record<string, string> = {
  exam: 'পরীক্ষা', fee: 'ফি', result: 'ফলাফল', holiday: 'ছুটি', general: 'সাধারণ',
};

export default function NewsSection() {
  return (
    <section className="py-16 bg-[#f8f7ff]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notice Board */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Bell size={20} className="text-purple-600" /> নোটিশ বোর্ড
              </h2>
              <Link href="/notice" className="text-xs text-purple-600 hover:underline">সব নোটিশ →</Link>
            </div>

            <div className="space-y-3">
              {NOTICES.map(notice => (
                <div key={notice.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        {notice.isImportant && <AlertCircle size={13} className="text-red-500" />}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[notice.type]}`}>
                          {TYPE_LABELS[notice.type]}
                        </span>
                        <span className="text-[10px] text-gray-400">{notice.date}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{notice.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notice.content}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-500 transition-colors shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick access */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">দ্রুত সেবা</h2>
            <div className="space-y-3">
              {[
                { label: 'ফলাফল দেখুন', desc: 'রোল নম্বর দিয়ে ফলাফল চেক করুন', href: '/result', color: 'border-purple-200 bg-purple-50' },
                { label: 'ভর্তি তথ্য', desc: 'নতুন ভর্তির তথ্য জানুন', href: '/register', color: 'border-blue-200 bg-blue-50' },
                { label: 'শিক্ষক পরিচিতি', desc: 'শিক্ষক মণ্ডলীর তথ্য দেখুন', href: '/teachers', color: 'border-green-200 bg-green-50' },
                { label: 'সকল নোটিশ', desc: 'সব ধরনের নোটিশ দেখুন', href: '/notice', color: 'border-amber-200 bg-amber-50' },
              ].map(({ label, desc, href, color }) => (
                <Link key={href} href={href} className={`block p-4 rounded-xl border-2 ${color} hover:shadow-md transition-all group`}>
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-purple-700 transition-colors">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </Link>
              ))}
            </div>

            {/* Madrasha class levels */}
            <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">শ্রেণি বিভাজন</h3>
              <div className="space-y-2">
                {[
                  { level: 'ইবতেদায়ী', classes: '১ম — ৫ম শ্রেণি', color: 'bg-green-500' },
                  { level: 'জুনিয়র দাখিল', classes: '৬ষ্ঠ — ৮ম শ্রেণি', color: 'bg-blue-500' },
                  { level: 'দাখিল', classes: '৯ম — ১০ম শ্রেণি', color: 'bg-purple-500' },
                ].map(({ level, classes, color }) => (
                  <div key={level} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${color}`}></div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{level}</p>
                      <p className="text-[10px] text-gray-400">{classes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
