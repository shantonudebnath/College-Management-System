'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Award, CreditCard, IdCard, Calendar, BookOpen, FileDown, Bell, ChevronLeft, ChevronRight, LogOut, ClipboardList, User, CheckSquare, X, LayoutGrid } from 'lucide-react';
import Image from 'next/image';

async function localLogout() {
  await fetch('/api/local-logout', { method: 'POST' });
  window.location.href = '/login';
}

const MENU = [
  { label: 'ড্যাশবোর্ড', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'ফলাফল', href: '/student/result', icon: Award },
  { label: 'উপস্থিতি', href: '/student/attendance', icon: CheckSquare },
  { label: 'ফি বিবরণ', href: '/student/fees', icon: CreditCard },
  { label: 'পরিচয়পত্র', href: '/student/id-card', icon: GraduationCap },
  { label: 'এডমিট কার্ড', href: '/student/admit-card', icon: IdCard },
  { label: 'পরীক্ষার সময়সূচী', href: '/student/exam-schedule', icon: Calendar },
  { label: 'ক্লাস রুটিন', href: '/student/routine', icon: LayoutGrid },
  { label: 'সিলেবাস', href: '/student/syllabus', icon: BookOpen },
  { label: 'নোট ও সাজেশন', href: '/student/notes', icon: FileDown },
  { label: 'নোটিশ', href: '/student/notice', icon: Bell },
  { label: 'ফর্ম ফিলআপ', href: '/student/forms', icon: ClipboardList },
  { label: 'আমার প্রোফাইল', href: '/student/profile', icon: User },
];

function SidebarContent({ collapsed, setCollapsed, onClose }: { collapsed: boolean; setCollapsed: (v: boolean) => void; onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-100`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shrink-0">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain w-full h-full" />
            </div>
            <div>
              <p className="font-bold text-xs text-gray-900 leading-tight">ছাত্র পোর্টাল</p>
              <p className="text-[9px] text-purple-600">Student Portal</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-purple-50 transition-colors text-gray-500 lg:hidden">
              <X size={16} />
            </button>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-purple-50 transition-colors text-gray-500 hidden lg:flex">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {MENU.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} title={collapsed ? label : undefined} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${active ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}>
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button onClick={() => { onClose?.(); localLogout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <LogOut size={16} />
          {!collapsed && <span>লগআউট</span>}
        </button>
      </div>
    </>
  );
}

export default function StudentSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white border-r border-gray-200 flex-col h-screen sticky top-0 overflow-y-auto scrollbar-thin shrink-0 hidden lg:flex`}>
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* Mobile: floating button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform bg-white"
      >
        <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain w-full h-full" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl lg:hidden animate-slideIn">
            <SidebarContent collapsed={false} setCollapsed={() => {}} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
