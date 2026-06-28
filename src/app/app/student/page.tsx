'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail, Phone, LogOut,
  LayoutDashboard, Award, CheckSquare, Calendar, LayoutGrid, BookOpen,
  CreditCard, IdCard, FileDown, Bell, ClipboardList, User,
} from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

type Item = { label: string; icon: React.ElementType; href: string; g: string; };
type Section = { title: string; items: Item[]; };

const SECTIONS: Section[] = [
  {
    title: 'একাডেমিক',
    items: [
      { label: 'ড্যাশবোর্ড',      icon: LayoutDashboard, href: '/student/dashboard',     g: 'linear-gradient(135deg,#2563eb,#1d4ed8)' },
      { label: 'ফলাফল',            icon: Award,           href: '/student/result',         g: 'linear-gradient(135deg,#d97706,#b45309)' },
      { label: 'উপস্থিতি',         icon: CheckSquare,     href: '/student/attendance',     g: 'linear-gradient(135deg,#059669,#047857)' },
      { label: 'পরীক্ষার সূচী',    icon: Calendar,        href: '/student/exam-schedule',  g: 'linear-gradient(135deg,#db2777,#be185d)' },
      { label: 'ক্লাস রুটিন',      icon: LayoutGrid,      href: '/student/routine',        g: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
      { label: 'সিলেবাস',          icon: BookOpen,        href: '/student/syllabus',       g: 'linear-gradient(135deg,#4f46e5,#4338ca)' },
    ],
  },
  {
    title: 'সেবাসমূহ',
    items: [
      { label: 'ফি বিবরণ',         icon: CreditCard,  href: '/student/fees',        g: 'linear-gradient(135deg,#059669,#047857)' },
      { label: 'এডমিট কার্ড',      icon: IdCard,      href: '/student/admit-card',  g: 'linear-gradient(135deg,#0284c7,#0369a1)' },
      { label: 'নোট ও সাজেশন',     icon: FileDown,    href: '/student/notes',       g: 'linear-gradient(135deg,#0d9488,#0f766e)' },
      { label: 'নোটিশ',            icon: Bell,        href: '/student/notice',      g: 'linear-gradient(135deg,#ef4444,#dc2626)' },
      { label: 'ফর্ম ফিলআপ',       icon: ClipboardList, href: '/student/forms',     g: 'linear-gradient(135deg,#ea580c,#c2410c)' },
      { label: 'আমার প্রোফাইল',    icon: User,        href: '/student/profile',     g: 'linear-gradient(135deg,#4b5563,#374151)' },
    ],
  },
];

const HDR = 'linear-gradient(135deg, #0c1445 0%, #1e40af 55%, #3b82f6 100%)';
const ACCENT = 'linear-gradient(180deg, #2563eb, #1d4ed8)';

async function handleLogout() {
  await fetch('/api/local-logout', { method: 'POST' });
  window.location.href = '/login';
}

export default function StudentAppHome() {
  return (
    <div className="min-h-screen pb-10" style={{ background: '#edf2ff' }}>
      {/* Header */}
      <div className="relative" style={{ background: HDR }}>
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="relative max-w-sm mx-auto px-4 pt-12 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center p-1.5">
                <Image src="/logo.png" alt="Logo" width={38} height={38} className="object-contain" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{COLLEGE_INFO.nameBn}</p>
                <p className="text-blue-300 text-[11px] mt-0.5">ছাত্র পোর্টাল</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/75 text-[11px] font-semibold px-3.5 py-2 rounded-xl border border-white/20 hover:bg-white/10 active:scale-95 transition-all">
              <LogOut size={12} /> লগআউট
            </button>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-4 border border-white/15">
            <p className="text-blue-200 text-xs font-medium mb-0.5">আস্‌সালামু আলাইকুম 👋</p>
            <h2 className="text-white text-xl font-bold leading-tight">ছাত্র হোম</h2>
            <p className="text-blue-300 text-xs mt-1">আপনার সকল তথ্য ও সেবা এখানে</p>
          </div>
        </div>
        <div className="h-7 rounded-t-[2.5rem]" style={{ background: '#edf2ff', marginTop: '-1px' }} />
      </div>

      {/* Sections */}
      <div className="max-w-sm mx-auto px-4 -mt-1">
        {SECTIONS.map(section => (
          <div key={section.title} className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-[3px] h-4 rounded-full" style={{ background: ACCENT }} />
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{section.title}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {section.items.map(item => (
                <Link key={item.href} href={item.href}
                  className="flex flex-col items-center gap-2.5 bg-white rounded-2xl py-4 px-2 shadow-sm border border-white/80 hover:shadow-md active:scale-95 transition-all">
                  <div className="rounded-2xl flex items-center justify-center shadow-md"
                    style={{ background: item.g, width: 52, height: 52, minWidth: 52 }}>
                    <item.icon size={22} color="white" />
                  </div>
                  <span className="text-[10.5px] font-semibold text-gray-700 text-center leading-tight px-1">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Fivolix card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-white/80 text-center mt-2">
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-2">Developed by</p>
          <a href="https://fivolix.tech" target="_blank" rel="noopener noreferrer"
            className="text-2xl font-black tracking-tight hover:opacity-80 transition-opacity"
            style={{ color: '#2563eb' }}>FIVOLIX</a>
          <div className="flex items-center justify-center gap-3 mt-2.5">
            <a href="mailto:fivolix@gmail.com" className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              <Mail size={11} /> fivolix@gmail.com
            </a>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <a href="tel:01908549552" className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              <Phone size={11} /> 01908549552
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
