'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ClipboardList, BarChart2, BookOpen, FileText, HelpCircle, Upload, CreditCard, Bell, UserCheck, ChevronLeft, ChevronRight, GraduationCap, LogOut } from 'lucide-react';

const MENU = [
  { label: 'ড্যাশবোর্ড', href: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'উপস্থিতি গ্রহণ', href: '/teacher/attendance', icon: ClipboardList },
  { label: 'নম্বর প্রদান', href: '/teacher/marks', icon: BarChart2 },
  { label: 'সিলেবাস তৈরি', href: '/teacher/syllabus', icon: BookOpen },
  { label: 'নোটস', href: '/teacher/notes', icon: FileText },
  { label: 'প্রশ্নপত্র দাখিল', href: '/teacher/questions', icon: HelpCircle },
  { label: 'সাজেশন আপলোড', href: '/teacher/suggestions', icon: Upload },
  { label: 'ফি বিবরণ', href: '/teacher/fees', icon: CreditCard },
  { label: 'নিজের উপস্থিতি', href: '/teacher/my-attendance', icon: UserCheck },
  { label: 'নোটিশ', href: '/teacher/notice', icon: Bell },
];

export default function TeacherSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 overflow-y-auto scrollbar-thin shrink-0`}>
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-100`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-xs text-gray-900 leading-tight">শিক্ষক পোর্টাল</p>
              <p className="text-[9px] text-purple-600">Teacher Portal</p>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-purple-50 transition-colors text-gray-500">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {MENU.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${active ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}>
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <LogOut size={16} />
          {!collapsed && <span>লগআউট</span>}
        </Link>
      </div>
    </aside>
  );
}
