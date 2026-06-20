import Link from 'next/link';
import { NOTICES } from '@/lib/data';
import { COLLEGE_INFO } from '@/lib/data';
import { Bell, ChevronRight, AlertCircle, BookOpen, FileText, Users, Phone } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  exam:    'bg-blue-100 text-blue-700',
  fee:     'bg-amber-100 text-amber-700',
  result:  'bg-green-100 text-green-700',
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
              <Link href="/notice" className="text-xs text-purple-600 font-semibold hover:underline">সব নোটিশ →</Link>
            </div>
            <div className="space-y-3">
              {NOTICES.slice(0, 6).map(notice => (
                <div key={notice.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {notice.isImportant && <AlertCircle size={12} className="text-red-500 shrink-0" />}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${TYPE_COLORS[notice.type]}`}>
                          {TYPE_LABELS[notice.type]}
                        </span>
                        <span className="text-[10px] text-gray-400">{notice.date}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1">{notice.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notice.content}</p>
                    </div>
                    <ChevronRight size={15} className="text-gray-300 group-hover:text-purple-400 transition-colors shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">দ্রুত সেবা</h2>
            {[
              { label: 'ফলাফল দেখুন',       desc: 'রোল নম্বর দিয়ে ফলাফল চেক করুন', href: '/result',     icon: BookOpen, color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { label: 'ভর্তি আবেদন',       desc: 'অনলাইনে ভর্তির আবেদন করুন',      href: '/admission',  icon: FileText, color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { label: 'শিক্ষক পরিচিতি',   desc: 'শিক্ষক মণ্ডলীর তথ্য দেখুন',      href: '/teachers',   icon: Users,    color: 'bg-green-50 border-green-200 text-green-700' },
              { label: 'সকল নোটিশ',         desc: 'সব ধরনের নোটিশ দেখুন',          href: '/notice',     icon: Bell,     color: 'bg-amber-50 border-amber-200 text-amber-700' },
            ].map(({ label, desc, href, icon: Icon, color }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-3 p-4 rounded-xl border ${color} bg-white hover:shadow-md transition-all group`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-purple-700 transition-colors">{label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}

            {/* Contact card */}
            <div className="bg-[#1e1b4b] rounded-2xl p-5 text-white mt-2">
              <p className="text-xs text-white/60 mb-1">যোগাযোগ করুন</p>
              <p className="font-bold text-sm mb-3">{COLLEGE_INFO.nameBn}</p>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Phone size={12} className="text-purple-300" />
                {COLLEGE_INFO.phone}
              </div>
              <p className="text-[10px] text-white/40 mt-2">{COLLEGE_INFO.address}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
