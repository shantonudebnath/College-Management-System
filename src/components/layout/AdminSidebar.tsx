'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, UserCheck, BookOpen, BarChart2, Calendar,
  FileText, Bell, CreditCard, Award, MapPin, Shield, FolderOpen,
  ClipboardList, ChevronLeft, ChevronRight, GraduationCap, LogOut,
  IdCard, TrendingUp, LayoutGrid, User, X
} from 'lucide-react';

const MENU = [
  { label: 'ড্যাশবোর্ড', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'শিক্ষার্থী ভর্তি', href: '/admin/students', icon: Users },
  { label: 'শিক্ষক তথ্য', href: '/admin/teachers', icon: UserCheck },
  { label: 'ক্লাস শিক্ষক', href: '/admin/class-teachers', icon: BookOpen },
  { label: 'ক্লাস অ্যাসাইন', href: '/admin/classes', icon: FileText },
  { label: 'ফলাফল প্রকাশ', href: '/admin/results', icon: Award },
  { label: 'ফি ম্যানেজমেন্ট', href: '/admin/fees', icon: CreditCard },
  { label: 'এডমিট কার্ড', href: '/admin/admit-cards', icon: IdCard },
  { label: 'ক্লাস রুটিন', href: '/admin/routine', icon: LayoutGrid },
  { label: 'পরীক্ষা সময়সূচী', href: '/admin/exam-schedule', icon: Calendar },
  { label: 'আসন পরিকল্পনা', href: '/admin/seat-plan', icon: MapPin },
  { label: 'গার্ড তালিকা', href: '/admin/guard-list', icon: Shield },
  { label: 'নোটিশ বোর্ড', href: '/admin/notices', icon: Bell },
  { label: 'উপস্থিতি', href: '/admin/attendance', icon: ClipboardList },
  { label: 'ডকুমেন্ট স্টোর', href: '/admin/docs', icon: FolderOpen },
  { label: 'অ্যানালিটিক্স', href: '/admin/analytics', icon: TrendingUp },
  { label: 'আমার প্রোফাইল', href: '/admin/profile', icon: User },
];

function SidebarContent({ collapsed, setCollapsed, onClose }: { collapsed: boolean; setCollapsed: (v: boolean) => void; onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-white/10`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap size={16} />
            </div>
            <div>
              <p className="font-bold text-xs leading-tight">Admin Panel</p>
              <p className="text-[9px] text-purple-300">নূরে ইসলাম মাদ্রাসা</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors lg:hidden">
              <X size={16} />
            </button>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-white/10 transition-colors hidden lg:flex">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {MENU.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} title={collapsed ? label : undefined} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link href="/" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-all">
          <LogOut size={16} />
          {!collapsed && <span>লগআউট</span>}
        </Link>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-[#1e1b4b] text-white flex-col h-screen sticky top-0 overflow-y-auto scrollbar-thin shrink-0 hidden lg:flex`}>
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-40 gradient-primary rounded-2xl flex items-center justify-center shadow-xl text-white hover:scale-105 transition-transform p-3"
      >
        <GraduationCap size={22} />
      </button>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-72 bg-[#1e1b4b] text-white z-50 flex flex-col shadow-2xl lg:hidden animate-slideIn">
            <SidebarContent collapsed={false} setCollapsed={() => {}} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
