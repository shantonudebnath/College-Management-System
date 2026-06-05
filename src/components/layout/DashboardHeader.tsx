'use client';
import { Bell, Search, User } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  userName?: string;
  role?: string;
}

export default function DashboardHeader({ title, subtitle, userName = 'ব্যবহারকারী', role = 'Admin' }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-48">
          <Search size={14} className="text-gray-400" />
          <input type="text" placeholder="খুঁজুন..." className="bg-transparent text-xs outline-none w-full text-gray-600 placeholder:text-gray-400" />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
            <User size={14} className="text-white" />
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
