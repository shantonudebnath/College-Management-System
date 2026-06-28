'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, LogOut, LayoutDashboard, Award, CreditCard, IdCard, Calendar, BookOpen, FileDown, Bell, ClipboardList, User, CheckSquare, LayoutGrid } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const GRID = [
  { label: 'ড্যাশবোর্ড',         icon: LayoutDashboard, href: '/student/dashboard',      color: 'bg-blue-100 text-blue-600' },
  { label: 'ফলাফল',               icon: Award,           href: '/student/result',         color: 'bg-yellow-100 text-yellow-700' },
  { label: 'উপস্থিতি',            icon: CheckSquare,     href: '/student/attendance',     color: 'bg-green-100 text-green-600' },
  { label: 'ফি বিবরণ',            icon: CreditCard,      href: '/student/fees',           color: 'bg-emerald-100 text-emerald-600' },
  { label: 'এডমিট কার্ড',         icon: IdCard,          href: '/student/admit-card',     color: 'bg-sky-100 text-sky-600' },
  { label: 'পরীক্ষার সূচী',        icon: Calendar,        href: '/student/exam-schedule',  color: 'bg-orange-100 text-orange-600' },
  { label: 'ক্লাস রুটিন',          icon: LayoutGrid,      href: '/student/routine',        color: 'bg-violet-100 text-violet-600' },
  { label: 'সিলেবাস',              icon: BookOpen,        href: '/student/syllabus',       color: 'bg-indigo-100 text-indigo-600' },
  { label: 'নোট ও সাজেশন',        icon: FileDown,        href: '/student/notes',          color: 'bg-teal-100 text-teal-600' },
  { label: 'নোটিশ',               icon: Bell,            href: '/student/notice',         color: 'bg-red-100 text-red-600' },
  { label: 'ফর্ম ফিলআপ',          icon: ClipboardList,   href: '/student/forms',          color: 'bg-pink-100 text-pink-600' },
  { label: 'আমার প্রোফাইল',       icon: User,            href: '/student/profile',        color: 'bg-gray-100 text-gray-600' },
];

async function handleLogout() {
  await fetch('/api/local-logout', { method: 'POST' });
  window.location.href = '/login';
}

export default function StudentAppHome() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] pb-10">
      {/* Header — blue gradient */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-sm mx-auto px-4 pt-12 pb-7">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden p-1.5">
                <Image src="/logo.png" alt="Logo" width={38} height={38} className="object-contain" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{COLLEGE_INFO.nameBn}</p>
                <p className="text-blue-200 text-xs mt-0.5">ছাত্র পোর্টাল</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              <LogOut size={13} /> লগআউট
            </button>
          </div>
          <h2 className="text-white text-xl font-bold">ছাত্র হোম</h2>
          <p className="text-blue-200 text-xs mt-0.5">আপনার সকল তথ্য এখানে</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-sm mx-auto px-4 pt-5">
        <div className="grid grid-cols-3 gap-3">
          {GRID.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 active:scale-95 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon size={22} />
              </div>
              <span className="text-[10.5px] font-semibold text-gray-700 text-center leading-tight">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Fivolix footer */}
        <div className="mt-8 pt-5 border-t border-gray-200 text-center space-y-1.5">
          <p className="text-[11px] text-gray-400">Developed by</p>
          <a
            href="https://fivolix.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-base font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Fivolix
          </a>
          <div className="flex items-center justify-center gap-3 mt-1">
            <a href="mailto:fivolix@gmail.com" className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
              <Mail size={11} /> fivolix@gmail.com
            </a>
            <span className="text-gray-300">·</span>
            <a href="tel:01908549552" className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
              <Phone size={11} /> 01908549552
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
