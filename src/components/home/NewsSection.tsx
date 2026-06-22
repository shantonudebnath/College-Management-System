'use client';
import Link from 'next/link';
import { NOTICES, COLLEGE_INFO } from '@/lib/data';
import { useNotices } from '@/context/NoticesContext';
import {
  Bell, BookOpen, FileText, Users, ChevronRight,
  AlertCircle, Phone, MapPin, Mail,
} from 'lucide-react';

const QUICK_LINKS = [
  {
    label: 'পরীক্ষার ফলাফল',
    desc: 'রোল নম্বর দিয়ে ফলাফল দেখুন',
    href: '/result',
    icon: BookOpen,
    accent: 'border-t-4 border-[#006633]',
    iconBg: 'bg-[#e8f5ee]',
    iconColor: 'text-[#006633]',
  },
  {
    label: 'ভর্তি আবেদন',
    desc: 'অনলাইনে ভর্তির আবেদন করুন',
    href: '/admission',
    icon: FileText,
    accent: 'border-t-4 border-[#c8102e]',
    iconBg: 'bg-red-50',
    iconColor: 'text-[#c8102e]',
  },
  {
    label: 'শিক্ষক পরিচিতি',
    desc: 'শিক্ষক মণ্ডলীর তালিকা দেখুন',
    href: '/teachers',
    icon: Users,
    accent: 'border-t-4 border-[#005522]',
    iconBg: 'bg-[#e8f5ee]',
    iconColor: 'text-[#005522]',
  },
  {
    label: 'সকল নোটিশ',
    desc: 'সব ধরনের বিজ্ঞপ্তি দেখুন',
    href: '/notice',
    icon: Bell,
    accent: 'border-t-4 border-amber-600',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
  },
];

const TYPE_BORDER: Record<string, string> = {
  exam:    'border-l-[#006633]   bg-green-50/40',
  fee:     'border-l-amber-500   bg-amber-50/40',
  result:  'border-l-emerald-600 bg-emerald-50/40',
  holiday: 'border-l-[#c8102e]   bg-red-50/40',
  general: 'border-l-gray-400    bg-gray-50/40',
};
const TYPE_BADGE: Record<string, string> = {
  exam:    'bg-[#e8f5ee] text-[#005522]',
  fee:     'bg-amber-100 text-amber-700',
  result:  'bg-emerald-100 text-emerald-700',
  holiday: 'bg-red-50 text-[#c8102e]',
  general: 'bg-gray-100 text-gray-600',
};
const TYPE_LABELS: Record<string, string> = {
  exam: 'পরীক্ষা', fee: 'ফি', result: 'ফলাফল', holiday: 'ছুটি', general: 'সাধারণ',
};

export default function NewsSection() {
  const { notices: liveNotices } = useNotices();
  const notices = (liveNotices.length > 0 ? liveNotices : NOTICES).slice(0, 6);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Quick Links ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          {QUICK_LINKS.map(({ label, desc, href, icon: Icon, accent, iconBg, iconColor }) => (
            <Link
              key={href}
              href={href}
              className={`group bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${accent} hover:shadow-md transition-all flex flex-col gap-4`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform`}>
                <Icon size={22} className={iconColor} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[15px] leading-tight">{label}</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">{desc}</p>
              </div>
              <ChevronRight size={15} className="text-gray-300 group-hover:text-[#006633] transition-colors self-end" />
            </Link>
          ))}
        </div>

        {/* ── Notice Board + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Notice List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#006633] rounded-full inline-block" />
                নোটিশ বোর্ড
              </h2>
              <Link href="/notice" className="text-xs font-semibold text-[#006633] hover:underline flex items-center gap-1">
                সব নোটিশ <ChevronRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {notices.map(notice => (
                <div
                  key={notice.id}
                  className={`flex items-start gap-4 px-5 py-4 border-l-4 ${TYPE_BORDER[notice.type] ?? TYPE_BORDER.general} hover:brightness-95 transition-all group`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {notice.isImportant && <AlertCircle size={11} className="text-[#c8102e] shrink-0" />}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[notice.type] ?? TYPE_BADGE.general}`}>
                        {TYPE_LABELS[notice.type]}
                      </span>
                      <span className="text-[10px] text-gray-400">{notice.date}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#006633] transition-colors line-clamp-1">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notice.content}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-[#006633] transition-colors shrink-0 mt-1" />
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/notice"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#006633] border border-[#006633]/30 px-5 py-2 rounded-lg hover:bg-[#e8f5ee] transition-colors"
              >
                <Bell size={14} /> সকল নোটিশ দেখুন
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">

            {/* Contact Card */}
            <div className="bg-[#006633] rounded-xl p-6 text-white">
              <p className="text-[11px] font-semibold text-green-200 uppercase tracking-widest mb-3">যোগাযোগ করুন</p>
              <p className="font-bold text-base leading-snug mb-4">{COLLEGE_INFO.nameBn}</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5 text-white/75">
                  <Phone size={13} className="text-green-300 mt-0.5 shrink-0" />
                  <span className="text-xs leading-snug">{COLLEGE_INFO.phone}</span>
                </div>
                <div className="flex items-start gap-2.5 text-white/75">
                  <Mail size={13} className="text-green-300 mt-0.5 shrink-0" />
                  <span className="text-xs leading-snug break-all">{COLLEGE_INFO.email}</span>
                </div>
                <div className="flex items-start gap-2.5 text-white/75">
                  <MapPin size={13} className="text-green-300 mt-0.5 shrink-0" />
                  <span className="text-xs leading-snug">{COLLEGE_INFO.address}</span>
                </div>
              </div>
            </div>

            {/* EIIN Info */}
            <div className="bg-[#e8f5ee] border border-[#006633]/20 rounded-xl p-5">
              <p className="text-xs font-semibold text-[#005522] uppercase tracking-widest mb-3">প্রতিষ্ঠান তথ্য</p>
              <div className="space-y-2.5">
                {[
                  { label: 'EIIN নম্বর',      value: COLLEGE_INFO.eiin },
                  { label: 'প্রতিষ্ঠা সাল',   value: COLLEGE_INFO.established },
                  { label: 'শিক্ষা বোর্ড',    value: COLLEGE_INFO.board },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-2">
                    <span className="text-[11px] text-gray-600">{label}</span>
                    <span className="text-[11px] font-semibold text-[#005522] text-right">{value}</span>
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
