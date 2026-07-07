'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Search, User, X, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { NOTICES } from '@/lib/data';

interface Props {
  title: string;
  subtitle?: string;
  userName?: string;
  role?: string;
  userImage?: string;
}

const NOTIF_ICON: Record<string, React.ReactNode> = {
  exam: <AlertCircle size={13} className="text-red-500" />,
  general: <Info size={13} className="text-blue-500" />,
  fee: <AlertCircle size={13} className="text-amber-500" />,
  result: <CheckCircle size={13} className="text-green-500" />,
};

export default function DashboardHeader({ title, subtitle, userName = 'ব্যবহারকারী', role = 'Admin', userImage }: Props) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [read, setRead] = useState<string[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const notifications = NOTICES.slice(0, 6);
  const unread = notifications.filter(n => !read.includes(n.id)).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setRead(notifications.map(n => n.id));

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 min-w-0">
      <div className="min-w-0 flex-1 pr-4">
        <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-48">
          <Search size={14} className="text-gray-400" />
          <input type="text" placeholder="খুঁজুন..." className="bg-transparent text-xs outline-none w-full text-gray-600 placeholder:text-gray-400" />
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Bell size={18} className="text-gray-600" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[min(320px,calc(100vw-1rem))] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-purple-600" />
                  <span className="text-sm font-semibold text-gray-900">নোটিফিকেশন</span>
                  {unread > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">{unread} নতুন</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-[10px] text-purple-600 hover:underline font-medium px-2">সব পড়া হয়েছে</button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="p-1 rounded-lg hover:bg-gray-200 transition-colors">
                    <X size={13} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Notifications list */}
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {notifications.map(n => {
                  const isUnread = !read.includes(n.id);
                  return (
                    <div
                      key={n.id}
                      onClick={() => setRead(p => [...p, n.id])}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${isUnread ? 'bg-purple-50/40' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {NOTIF_ICON[n.type] ?? <Info size={13} className="text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium text-gray-900 truncate ${isUnread ? 'font-semibold' : ''}`}>{n.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{n.date}</p>
                      </div>
                      {isUnread && <div className="w-2 h-2 bg-purple-500 rounded-full shrink-0 mt-1"></div>}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-100 text-center">
                <Link href="/student/notice" onClick={() => setNotifOpen(false)}
                  className="text-xs text-purple-600 hover:underline font-medium">
                  সব নোটিশ দেখুন →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center overflow-hidden shrink-0">
            {userImage
              ? <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              : <User size={14} className="text-white" />
            }
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-900">{userName}</p>
            <p className="text-[10px] text-purple-600">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
