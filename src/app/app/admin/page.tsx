'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail, Phone, LogOut,
  LayoutDashboard, Users, UserCheck, BookOpen, FileText, ClipboardCheck,
  ClipboardList, Award, IdCard, Calendar, MapPin, Shield, HelpCircle,
  CreditCard, Bell, LayoutGrid, Scroll, FolderOpen,
  Globe, TrendingUp, User,
} from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

type Item = { label: string; icon: React.ElementType; href: string; g: string; };
type Section = { title: string; items: Item[]; };

const SECTIONS: Section[] = [
  {
    title: 'মূল ব্যবস্থাপনা',
    items: [
      { label: 'ড্যাশবোর্ড',    icon: LayoutDashboard, href: '/admin/dashboard',      g: 'linear-gradient(135deg,#7c3aed,#4f46e5)' },
      { label: 'শিক্ষার্থী',     icon: Users,           href: '/admin/students',       g: 'linear-gradient(135deg,#2563eb,#1d4ed8)' },
      { label: 'শিক্ষক',         icon: UserCheck,       href: '/admin/teachers',       g: 'linear-gradient(135deg,#059669,#047857)' },
      { label: 'ক্লাস শিক্ষক',  icon: BookOpen,        href: '/admin/class-teachers', g: 'linear-gradient(135deg,#0d9488,#0f766e)' },
      { label: 'ক্লাস অ্যাসাইন',icon: FileText,        href: '/admin/classes',        g: 'linear-gradient(135deg,#0891b2,#0e7490)' },
      { label: 'ভর্তি আবেদন',   icon: ClipboardCheck,  href: '/admin/admissions',     g: 'linear-gradient(135deg,#9333ea,#7e22ce)' },
    ],
  },
  {
    title: 'পরীক্ষা ও ফলাফল',
    items: [
      { label: 'নম্বর প্রবেশ',  icon: ClipboardList, href: '/admin/results/entry',  g: 'linear-gradient(135deg,#ea580c,#c2410c)' },
      { label: 'ফলাফল প্রকাশ', icon: Award,         href: '/admin/results',        g: 'linear-gradient(135deg,#d97706,#b45309)' },
      { label: 'প্রশংসাপত্র',   icon: Award,         href: '/admin/certificates',   g: 'linear-gradient(135deg,#b45309,#92400e)' },
      { label: 'এডমিট কার্ড',   icon: IdCard,        href: '/admin/admit-cards',    g: 'linear-gradient(135deg,#0284c7,#0369a1)' },
      { label: 'পরীক্ষা সূচী',  icon: Calendar,      href: '/admin/exam-schedule',  g: 'linear-gradient(135deg,#db2777,#be185d)' },
      { label: 'আসন পরিকল্পনা', icon: MapPin,        href: '/admin/seat-plan',      g: 'linear-gradient(135deg,#dc2626,#b91c1c)' },
      { label: 'গার্ড তালিকা',  icon: Shield,        href: '/admin/guard-list',     g: 'linear-gradient(135deg,#475569,#334155)' },
      { label: 'প্রশ্নপত্র',     icon: HelpCircle,    href: '/admin/questions',      g: 'linear-gradient(135deg,#65a30d,#4d7c0f)' },
    ],
  },
  {
    title: 'প্রশাসনিক',
    items: [
      { label: 'ফি ব্যবস্থাপনা', icon: CreditCard,  href: '/admin/fees',       g: 'linear-gradient(135deg,#059669,#047857)' },
      { label: 'উপস্থিতি',       icon: ClipboardList, href: '/admin/attendance', g: 'linear-gradient(135deg,#9333ea,#7e22ce)' },
      { label: 'নোটিশ বোর্ড',    icon: Bell,        href: '/admin/notices',    g: 'linear-gradient(135deg,#ef4444,#dc2626)' },
      { label: 'ক্লাস রুটিন',    icon: LayoutGrid,  href: '/admin/routine',    g: 'linear-gradient(135deg,#6d28d9,#5b21b6)' },
      { label: 'অফিসিয়াল প্যাড', icon: Scroll,     href: '/admin/pad',        g: 'linear-gradient(135deg,#78716c,#57534e)' },
      { label: 'ডকুমেন্ট',       icon: FolderOpen,  href: '/admin/docs',       g: 'linear-gradient(135deg,#f97316,#ea580c)' },
    ],
  },
  {
    title: 'সেটিংস',
    items: [
      { label: 'ওয়েবসাইট',      icon: Globe,      href: '/admin/website',   g: 'linear-gradient(135deg,#7c3aed,#4f46e5)' },
      { label: 'অ্যানালিটিক্স',  icon: TrendingUp, href: '/admin/analytics', g: 'linear-gradient(135deg,#1d4ed8,#1e40af)' },
      { label: 'প্রোফাইল',       icon: User,       href: '/admin/profile',   g: 'linear-gradient(135deg,#4b5563,#374151)' },
    ],
  },
];

const HDR = 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 55%, #7c3aed 100%)';
const ACCENT = 'linear-gradient(180deg, #7c3aed, #4f46e5)';

async function handleLogout() {
  try { await fetch('/api/logout', { method: 'POST', redirect: 'manual' }); } catch { /* ignore */ }
  window.location.href = '/login';
}

export default function AdminAppHome() {
  const router = useRouter();
  useEffect(() => {
    if (window.innerWidth >= 1024) router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen pb-10" style={{ background: '#eeedf8' }}>
      {/* Header */}
      <div className="relative" style={{ background: HDR }}>
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="relative max-w-sm mx-auto px-4 pt-12 pb-12">
          {/* top row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center p-1.5">
                <Image src="/logo.png" alt="Logo" width={38} height={38} className="object-contain" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{COLLEGE_INFO.nameBn}</p>
                <p className="text-purple-300 text-[11px] mt-0.5">Admin Panel</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/75 text-[11px] font-semibold px-3.5 py-2 rounded-xl border border-white/20 hover:bg-white/10 active:scale-95 transition-all">
              <LogOut size={12} /> লগআউট
            </button>
          </div>
          {/* greeting card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-4 border border-white/15">
            <p className="text-purple-200 text-xs font-medium mb-0.5">আস্‌সালামু আলাইকুম 👋</p>
            <h2 className="text-white text-xl font-bold leading-tight">অ্যাডমিন হোম</h2>
            <p className="text-purple-300 text-xs mt-1">সকল পরিচালনা একটি জায়গায়</p>
          </div>
        </div>
        {/* curved bottom edge */}
        <div className="h-7 rounded-t-[2.5rem]" style={{ background: '#eeedf8', marginTop: '-1px' }} />
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
                  className="flex flex-col items-center gap-2.5 bg-white rounded-2xl py-4 px-2 shadow-sm border border-white/80 hover:shadow-md active:scale-95 transition-all overflow-hidden">
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
            style={{ color: '#7c3aed' }}>FIVOLIX</a>
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
