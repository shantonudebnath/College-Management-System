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
    <div className="absolute top-full left-0 mt-1 w-52 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1">
        {items.map(child => (
          <Link key={child.href} href={child.href} onClick={onClose}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
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
      {/* Top bar */}
      <div className="gradient-primary text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-5 items-center">
            <span className="flex items-center gap-1.5"><Phone size={11} /> {COLLEGE_INFO.phone}</span>
            <span className="flex items-center gap-1.5"><Mail size={11} /> {COLLEGE_INFO.email}</span>
          </div>
          <div className="flex gap-5">
            <span>EIIN: {COLLEGE_INFO.eiin}</span>
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
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-11 h-11 relative flex-shrink-0">
                <Image src="/logo.png" alt="মাদ্রাসা লোগো" fill className="object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-gray-900 text-sm leading-tight">{COLLEGE_INFO.nameBn}</p>
                <p className="text-[10px] text-purple-600 font-medium">স্থাপিত: {COLLEGE_INFO.established} | EIIN: {COLLEGE_INFO.eiin}</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map(link =>
                link.children ? (
                  <div key={link.label} className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap">
                      {link.label} <ChevronDown size={13} className={`transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === link.label && (
                      <DropdownMenu items={link.children} onClose={() => setActiveDropdown(null)} />
                    )}
                  </div>
                ) : (
                  <Link key={link.href} href={link.href!}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                )
              )}
            </div>

            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <Link href="/login" className="px-4 py-2 text-sm font-semibold text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                লগইন
              </Link>
              <Link href="/admission" className="px-4 py-2 text-sm font-semibold btn-primary rounded-lg">
                ভর্তি আবেদন
              </Link>
            </div>

            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700">
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
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-purple-50">
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${mobileExpanded === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded === link.label && (
                    <div className="ml-3 border-l-2 border-purple-100 pl-3 space-y-0.5 mt-1">
                      {link.children.map(child => (
                        <Link key={child.href} href={child.href} onClick={() => setOpen(false)}
                          className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-purple-50 hover:text-purple-700">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href!} onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700">
                  {link.label}
                </Link>
              )
            )}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold text-purple-600 border border-purple-200 rounded-lg">লগইন</Link>
              <Link href="/admission" onClick={() => setOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold btn-primary rounded-lg">ভর্তি আবেদন</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
