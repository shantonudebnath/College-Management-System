'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

interface NavChild { label: string; href: string; }
interface NavItem { label: string; href?: string; children?: NavChild[]; }

const NAV_LINKS: NavItem[] = [
  { label: 'হোম', href: '/' },
  {
    label: 'প্রতিষ্ঠান',
    children: [
      { label: 'প্রতিষ্ঠান পরিচিতি', href: '/about' },
      { label: 'পরিচালনা পর্ষদ', href: '/about#governing-body' },
      { label: 'অনুমতি ও স্বীকৃতি', href: '/about#recognition' },
      { label: 'এমপিও তথ্য', href: '/about#mpo' },
      { label: 'ভূমি তথ্য', href: '/about#land' },
      { label: 'ভবন ও কক্ষ সংখ্যা', href: '/about#building' },
      { label: 'ক্যাম্পাস ম্যাপ', href: '/about#campus-map' },
      { label: 'বার্ষিক প্রতিবেদন', href: '/about#annual-report' },
    ],
  },
  {
    label: 'একাডেমিক তথ্য',
    children: [
      { label: 'শ্রেণি তালিকা', href: '/about#classes' },
      { label: 'পরীক্ষার সময়সূচী', href: '/about#exam-schedule' },
      { label: 'ফলাফল', href: '/result' },
      { label: 'সিলেবাস', href: '/about#syllabus' },
      { label: 'বৃত্তি ও সুবিধা', href: '/about#scholarship' },
    ],
  },
  {
    label: 'শিক্ষক ও কর্মচারী',
    children: [
      { label: 'অধ্যক্ষের বার্তা', href: '/teachers#principal' },
      { label: 'শিক্ষক তালিকা', href: '/teachers' },
      { label: 'কর্মচারী তালিকা', href: '/teachers#staff' },
      { label: 'প্রতিষ্ঠাতা ও দাতা', href: '/teachers#founders' },
    ],
  },
  { label: 'নোটিশ বোর্ড', href: '/notice' },
  { label: 'গ্যালারি', href: '/#gallery' },
  { label: 'যোগাযোগ', href: '/about#contact' },
];

function DropdownMenu({ items, onClose }: { items: NavChild[]; onClose: () => void }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-56 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/60 overflow-hidden py-2"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)' }}>
        {items.map(child => (
          <Link key={child.href} href={child.href} onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors group">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-blue-500 transition-colors shrink-0" />
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <>
      {/* Accent line */}
      <div className="h-[3px] bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 hidden md:block" />

      {/* Top info bar */}
      <div className="bg-[#07111e] text-white/60 text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5">
              <Phone size={11} className="text-blue-400" /> {COLLEGE_INFO.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={11} className="text-blue-400" /> {COLLEGE_INFO.email}
            </span>
          </div>
          <div className="flex gap-5 items-center">
            <span className="text-white/30">EIIN: {COLLEGE_INFO.eiin}</span>
            <Link href="/result" className="hover:text-blue-400 transition-colors">ফলাফল দেখুন</Link>
            <Link href="/notice" className="hover:text-blue-400 transition-colors">নোটিশ বোর্ড</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-[4.25rem]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-11 h-11 relative shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <Image
                  src="/logo.png"
                  alt="মাদ্রাসা লোগো"
                  fill
                  className="object-contain p-0.5"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-gray-900 text-[13px] leading-tight">{COLLEGE_INFO.nameBn}</p>
                <p className="text-[10px] text-blue-600 font-medium mt-0.5">
                  স্থাপিত: {COLLEGE_INFO.established} | EIIN: {COLLEGE_INFO.eiin}
                </p>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map(link =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap
                      ${activeDropdown === link.label ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'}`}>
                      {link.label}
                      <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                    </button>
                    {activeDropdown === link.label && (
                      <DropdownMenu items={link.children} onClose={() => setActiveDropdown(null)} />
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-700 rounded-xl hover:bg-blue-50 transition-all whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* CTA buttons */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all"
              >
                লগইন
              </Link>
              <Link
                href="/admission"
                className="px-5 py-2 text-sm font-bold bg-[#07111e] text-white rounded-xl hover:bg-blue-900 transition-all shadow-sm"
              >
                ভর্তি আবেদন
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
            {NAV_LINKS.map(link =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform text-gray-400 ${mobileExpanded === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded === link.label && (
                    <div className="ml-3 border-l-2 border-blue-100 pl-3 space-y-0.5 mt-1">
                      {link.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-700"
                        >
                          <span className="w-1 h-1 bg-gray-300 rounded-full shrink-0" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                লগইন
              </Link>
              <Link
                href="/admission"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 text-sm font-bold bg-[#07111e] text-white rounded-xl"
              >
                ভর্তি আবেদন
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
