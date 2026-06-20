'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

async function localLogout() {
  await fetch('/api/local-logout', { method: 'POST' });
  window.location.href = '/login';
}
import { LayoutDashboard, ClipboardList, BarChart2, BookOpen, FileText, HelpCircle, Upload, CreditCard, Bell, UserCheck, ChevronLeft, ChevronRight, GraduationCap, LogOut, User, X, LayoutGrid } from 'lucide-react';
import { useTeachers } from '@/context/TeachersContext';
import { useCurrentTeacher } from '@/context/CurrentTeacherContext';
import { MADRASHA_CLASSES } from '@/lib/data';

const MENU = [
  { label: 'ড্যাশবোর্ড', href: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'ক্লাস রুটিন', href: '/teacher/routine', icon: LayoutGrid },
  { label: 'উপস্থিতি গ্রহণ', href: '/teacher/attendance', icon: ClipboardList },
  { label: 'নম্বর প্রদান', href: '/teacher/marks', icon: BarChart2 },
  { label: 'সিলেবাস তৈরি', href: '/teacher/syllabus', icon: BookOpen },
  { label: 'নোটস', href: '/teacher/notes', icon: FileText },
  { label: 'প্রশ্নপত্র দাখিল', href: '/teacher/questions', icon: HelpCircle },
  { label: 'সাজেশন আপলোড', href: '/teacher/suggestions', icon: Upload },
  { label: 'ফি বিবরণ', href: '/teacher/fees', icon: CreditCard },
  { label: 'নিজের উপস্থিতি', href: '/teacher/my-attendance', icon: UserCheck },
  { label: 'নোটিশ', href: '/teacher/notice', icon: Bell },
  { label: 'আমার প্রোফাইল', href: '/teacher/profile', icon: User },
];

function TeacherInfo({ collapsed }: { collapsed: boolean }) {
  const { teachers } = useTeachers();
  const { currentTeacherId, assignedClassId, setCurrentTeacher } = useCurrentTeacher();
  const [sessionTchId, setSessionTchId] = useState<string | null>(null);

  // Fetch session once to get the logged-in teacher's TCH-XXX ID
  useEffect(() => {
    fetch('/api/session')
      .then(r => r.json())
      .then(({ id, role }) => { if (role === 'teacher' && id) setSessionTchId(id); })
      .catch(() => {});
  }, []);

  // Match TCH-XXX session ID to internal teacher record and auto-set
  useEffect(() => {
    if (!sessionTchId || teachers.length === 0) return;
    const matched = teachers.find(t => t.teacherId === sessionTchId);
    if (matched && matched.id !== currentTeacherId) {
      setCurrentTeacher(matched.id);
    }
  }, [sessionTchId, teachers.length]);

  const teacher = teachers.find(t => t.id === currentTeacherId);
  const assignedClass = MADRASHA_CLASSES.find(c => c.id === assignedClassId);

  if (collapsed) return null;

  return (
    <div className="px-3 py-3 border-b border-gray-100">
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-purple-50">
        <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shrink-0 text-white text-xs font-bold">
          {teacher ? (teacher.nameBn || teacher.name)[0] : '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-xs truncate">
            {teacher ? (teacher.nameBn || teacher.name) : 'লোড হচ্ছে...'}
          </p>
          <p className="text-[10px] text-purple-500 truncate">
            {assignedClass ? assignedClass.nameBn : teacher?.designation ?? ''}
          </p>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ collapsed, setCollapsed, onClose }: { collapsed: boolean; setCollapsed: (v: boolean) => void; onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <>
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

      <TeacherInfo collapsed={collapsed} />

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

export default function TeacherSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white border-r border-gray-200 flex-col h-screen sticky top-0 overflow-y-auto scrollbar-thin shrink-0 hidden lg:flex`}>
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
          <aside className="fixed left-0 top-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl lg:hidden animate-slideIn">
            <SidebarContent collapsed={false} setCollapsed={() => {}} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
