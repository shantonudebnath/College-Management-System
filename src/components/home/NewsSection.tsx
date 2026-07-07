'use client';
import Link from 'next/link';
import { COLLEGE_INFO } from '@/lib/data';
import { useNotices } from '@/context/NoticesContext';
import { Bell, BookOpen, FileText, Users, ChevronRight, AlertCircle, Phone, MapPin, Mail } from 'lucide-react';

const QUICK_LINKS = [
  {
    label: 'পরীক্ষার ফলাফল',
    desc: 'রোল নম্বর দিয়ে ফলাফল দেখুন',
    href: '/result',
    icon: BookOpen,
    color: 'from-[#006633] to-[#004d26]',
  },
  {
    label: 'ভর্তি আবেদন',
    desc: 'অনলাইনে ভর্তির আবেদন করুন',
    href: '/admission',
    icon: FileText,
    color: 'from-[#c8102e] to-[#9e0a22]',
  },
  {
    label: 'শিক্ষক পরিচিতি',
    desc: 'শিক্ষক মণ্ডলীর তালিকা দেখুন',
    href: '/teachers',
    icon: Users,
    color: 'from-[#1d4ed8] to-[#1e3a8a]',
  },
  {
    label: 'সকল নোটিশ',
    desc: 'সব ধরনের বিজ্ঞপ্তি দেখুন',
    href: '/notice',
    icon: Bell,
    color: 'from-[#b45309] to-[#78350f]',
  },
];

const TYPE_CONFIG: Record<string, { border: string; badge: string; dot: string; label: string }> = {
  exam:    { border: 'border-l-[#006633]', badge: 'bg-green-50 text-[#005522]', dot: 'bg-[#006633]', label: 'পরীক্ষা' },
  fee:     { border: 'border-l-amber-500', badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', label: 'ফি' },
  result:  { border: 'border-l-blue-500',  badge: 'bg-blue-50 text-blue-700',   dot: 'bg-blue-500',  label: 'ফলাফল' },
  holiday: { border: 'border-l-[#c8102e]', badge: 'bg-red-50 text-[#c8102e]',  dot: 'bg-[#c8102e]', label: 'ছুটি' },
  general: { border: 'border-l-gray-300',  badge: 'bg-gray-50 text-gray-600',   dot: 'bg-gray-400',  label: 'সাধারণ' },
};

export default function NewsSection() {
  const { notices: liveNotices } = useNotices();
  const notices = liveNotices.slice(0, 6);

  return (
    <section className="py-16 bg-[#f8faf8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {QUICK_LINKS.map(({ label, desc, href, icon: Icon, color }) => (
            <Link key={href} href={href}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`bg-gradient-to-br ${color} p-6 h-full flex flex-col gap-3`}>
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">{label}</p>
                  <p className="text-white/65 text-xs mt-1 leading-snug">{desc}</p>
                </div>
                <ChevronRight size={14} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all self-end mt-auto" />
              </div>
            </Link>
          ))}
        </div>

        {/* Notice Board + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Notice List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                <span className="w-1.5 h-7 bg-[#006633] rounded-full inline-block" />
                নোটিশ বোর্ড
              </h2>
              <Link href="/notice"
                className="text-xs font-semibold text-[#006633] hover:underline flex items-center gap-1">
                সব নোটিশ <ChevronRight size={13} />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {notices.length === 0 && (
                <div className="px-5 py-10 text-center text-gray-400 text-sm">
                  <Bell size={28} className="mx-auto mb-2 opacity-30" />
                  <p>কোনো নোটিশ নেই। শীঘ্রই প্রকাশিত হবে।</p>
                </div>
              )}
              {notices.map((notice, i) => {
                const cfg = TYPE_CONFIG[notice.type] ?? TYPE_CONFIG.general;
                return (
                  <div key={notice.id}
                    className={`flex items-start gap-4 px-5 py-4 border-l-4 ${cfg.border} ${i < notices.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/80 transition-colors group`}>
                    <div className={`w-2 h-2 rounded-full ${cfg.dot} mt-2 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {notice.isImportant && <AlertCircle size={11} className="text-[#c8102e] shrink-0" />}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                        <span className="text-[10px] text-gray-400">{notice.date}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#006633] transition-colors line-clamp-1">
                        {notice.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notice.content}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-200 group-hover:text-[#006633] transition-colors shrink-0 mt-1.5" />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <Link href="/notice"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#006633] border border-[#006633]/30 px-6 py-2.5 rounded-xl hover:bg-[#e8f5ee] transition-colors">
                <Bell size={14} /> সকল নোটিশ দেখুন
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">

            {/* Contact */}
            <div className="bg-[#006633] rounded-2xl p-6 text-white">
              <p className="text-[11px] font-bold text-green-300 uppercase tracking-widest mb-3">যোগাযোগ করুন</p>
              <p className="font-bold text-base leading-snug mb-5">{COLLEGE_INFO.nameBn}</p>
              <div className="space-y-3.5">
                <a href={`tel:${COLLEGE_INFO.phone}`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <Phone size={13} className="text-green-300" />
                  </div>
                  <span className="text-xs text-white/80 group-hover:text-white transition-colors">{COLLEGE_INFO.phone}</span>
                </a>
                <a href={`mailto:${COLLEGE_INFO.email}`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <Mail size={13} className="text-green-300" />
                  </div>
                  <span className="text-xs text-white/80 group-hover:text-white transition-colors break-all">{COLLEGE_INFO.email}</span>
                </a>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={13} className="text-green-300" />
                  </div>
                  <span className="text-xs text-white/80 leading-relaxed">{COLLEGE_INFO.address}</span>
                </div>
              </div>
            </div>

            {/* Institution Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-[#006633] uppercase tracking-widest mb-4">প্রতিষ্ঠান তথ্য</p>
              <div className="space-y-3">
                {[
                  { label: 'EIIN নম্বর', value: COLLEGE_INFO.eiin },
                  { label: 'প্রতিষ্ঠা সাল', value: COLLEGE_INFO.established },
                  { label: 'শিক্ষা বোর্ড', value: COLLEGE_INFO.board },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-bold text-[#004d26] bg-green-50 px-2.5 py-0.5 rounded-full">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Result Quick Action */}
            <Link href="/result"
              className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#006633]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-[#e8f5ee] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <BookOpen size={20} className="text-[#006633]" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">পরীক্ষার ফলাফল</p>
                <p className="text-xs text-gray-500 mt-0.5">রোল নম্বর দিয়ে দেখুন</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[#006633] transition-colors" />
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
