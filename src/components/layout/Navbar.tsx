'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, Bell, ChevronDown, GraduationCap, Phone, Mail } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const NAV_LINKS = [
  { label: 'হোম', href: '/' },
  { label: 'শিক্ষক মণ্ডলী', href: '/teachers' },
  { label: 'নোটিশ বোর্ড', href: '/notice' },
  { label: 'ফলাফল', href: '/result' },
  {
    label: 'পোর্টাল',
    children: [
      { label: 'ছাত্র পোর্টাল', href: '/student/dashboard' },
      { label: 'শিক্ষক পোর্টাল', href: '/teacher/dashboard' },
      { label: 'অ্যাডমিন', href: '/admin/dashboard' },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="gradient-primary text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1"><Phone size={11} /> {COLLEGE_INFO.phone}</span>
            <span className="flex items-center gap-1"><Mail size={11} /> {COLLEGE_INFO.email}</span>
          </div>
          <div className="flex gap-4">
            <Link href="/result" className="hover:text-purple-200 transition-colors">ফলাফল দেখুন</Link>
            <Link href="/notice" className="hover:text-purple-200 transition-colors">নোটিশ বোর্ড</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-300 transition-shadow">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-gray-900 text-sm leading-tight">{COLLEGE_INFO.name}</p>
                <p className="text-[10px] text-purple-600 font-medium">{COLLEGE_INFO.nameBn}</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative" onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                      {link.label} <ChevronDown size={14} />
                    </button>
                    {dropdown && (
                      <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-purple-100 overflow-hidden z-50">
                        {link.children.map((child) => (
                          <Link key={child.href} href={child.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={link.href} href={link.href} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 text-sm font-semibold text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                লগইন
              </Link>
              <Link href="/register" className="px-4 py-2 text-sm font-semibold btn-primary rounded-lg">
                রেজিস্ট্রেশন
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-fadeIn">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{link.label}</p>
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600">
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600">
                  {link.label}
                </Link>
              )
            )}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Link href="/login" className="flex-1 text-center py-2 text-sm font-semibold text-purple-600 border border-purple-200 rounded-lg">লগইন</Link>
              <Link href="/register" className="flex-1 text-center py-2 text-sm font-semibold btn-primary rounded-lg">রেজিস্ট্রেশন</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
