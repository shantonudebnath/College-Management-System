'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, LogOut, LayoutDashboard, Users, UserCheck, BookOpen, Calendar, FileText, Bell, CreditCard, Award, MapPin, Shield, FolderOpen, ClipboardList, IdCard, TrendingUp, LayoutGrid, User, HelpCircle, Globe, ClipboardCheck, Scroll } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const GRID = [
  { label: 'ড্যাশবোর্ড',     icon: LayoutDashboard, href: '/admin/dashboard',      color: 'bg-purple-100 text-purple-600' },
  { label: 'শিক্ষার্থী',      icon: Users,           href: '/admin/students',       color: 'bg-blue-100 text-blue-600' },
  { label: 'শিক্ষক',          icon: UserCheck,       href: '/admin/teachers',       color: 'bg-green-100 text-green-600' },
  { label: 'ক্লাস শিক্ষক',   icon: BookOpen,        href: '/admin/class-teachers', color: 'bg-teal-100 text-teal-600' },
  { label: 'ক্লাস অ্যাসাইন', icon: FileText,        href: '/admin/classes',        color: 'bg-cyan-100 text-cyan-600' },
  { label: 'ভর্তি আবেদন',    icon: ClipboardCheck,  href: '/admin/admissions',     color: 'bg-indigo-100 text-indigo-600' },
  { label: 'নম্বর প্রবেশ',   icon: ClipboardList,   href: '/admin/results/entry',  color: 'bg-orange-100 text-orange-600' },
  { label: 'ফলাফল প্রকাশ',  icon: Award,           href: '/admin/results',        color: 'bg-yellow-100 text-yellow-700' },
  { label: 'প্রশংসাপত্র',    icon: Award,           href: '/admin/certificates',   color: 'bg-amber-100 text-amber-600' },
  { label: 'অফিসিয়াল প্যাড', icon: Scroll,         href: '/admin/pad',            color: 'bg-stone-100 text-stone-600' },
  { label: 'ফি ব্যবস্থাপনা', icon: CreditCard,      href: '/admin/fees',           color: 'bg-emerald-100 text-emerald-600' },
  { label: 'এডমিট কার্ড',    icon: IdCard,          href: '/admin/admit-cards',    color: 'bg-sky-100 text-sky-600' },
  { label: 'ক্লাস রুটিন',    icon: LayoutGrid,      href: '/admin/routine',        color: 'bg-violet-100 text-violet-600' },
  { label: 'পরীক্ষা সূচী',   icon: Calendar,        href: '/admin/exam-schedule',  color: 'bg-pink-100 text-pink-600' },
  { label: 'আসন পরিকল্পনা',  icon: MapPin,          href: '/admin/seat-plan',      color: 'bg-rose-100 text-rose-600' },
  { label: 'গার্ড তালিকা',   icon: Shield,          href: '/admin/guard-list',     color: 'bg-slate-100 text-slate-600' },
  { label: 'প্রশ্নপত্র',      icon: HelpCircle,      href: '/admin/questions',      color: 'bg-lime-100 text-lime-700' },
  { label: 'নোটিশ বোর্ড',    icon: Bell,            href: '/admin/notices',        color: 'bg-red-100 text-red-600' },
  { label: 'উপস্থিতি',       icon: ClipboardList,   href: '/admin/attendance',     color: 'bg-fuchsia-100 text-fuchsia-600' },
  { label: 'ডকুমেন্ট',       icon: FolderOpen,      href: '/admin/docs',           color: 'bg-orange-100 text-orange-700' },
  { label: 'অ্যানালিটিক্স',  icon: TrendingUp,      href: '/admin/analytics',      color: 'bg-blue-100 text-blue-700' },
  { label: 'ওয়েবসাইট',       icon: Globe,           href: '/admin/website',        color: 'bg-purple-100 text-purple-700' },
  { label: 'প্রোফাইল',       icon: User,            href: '/admin/profile',        color: 'bg-gray-100 text-gray-600' },
];

async function handleLogout() {
  try { await fetch('/api/logout', { method: 'POST', redirect: 'manual' }); } catch { /* ignore */ }
  window.location.href = '/login';
}

export default function AdminAppHome() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] pb-10">
      {/* Header */}
      <div className="gradient-hero">
        <div className="max-w-sm mx-auto px-4 pt-12 pb-7">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden p-1.5">
                <Image src="/logo.png" alt="Logo" width={38} height={38} className="object-contain" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{COLLEGE_INFO.nameBn}</p>
                <p className="text-purple-300 text-xs mt-0.5">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              <LogOut size={13} /> লগআউট
            </button>
          </div>
          <h2 className="text-white text-xl font-bold">অ্যাডমিন হোম</h2>
          <p className="text-purple-300 text-xs mt-0.5">সকল পরিচালনা একটি জায়গায়</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-sm mx-auto px-4 pt-5">
        <div className="grid grid-cols-3 gap-3">
          {GRID.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 active:scale-95 transition-all"
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
            className="block text-base font-bold text-purple-600 hover:text-purple-800 transition-colors"
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
