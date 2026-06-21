'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-[#07111e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 relative shrink-0 bg-white rounded-lg p-1.5">
                <Image src="/logo.png" alt="লোগো" fill className="object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">{COLLEGE_INFO.nameBn}</p>
                <p className="text-[10px] text-blue-300 mt-0.5">স্থাপিত: {COLLEGE_INFO.established}</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">
              {COLLEGE_INFO.board} অনুমোদিত, {COLLEGE_INFO.established} সাল থেকে মানসম্মত ইসলামি শিক্ষা প্রদান করে আসছে।
            </p>
            <p className="text-xs text-blue-300">EIIN: {COLLEGE_INFO.eiin}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-blue-300">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {[
                ['হোম', '/'],
                ['প্রতিষ্ঠান পরিচিতি', '/about'],
                ['শিক্ষক তালিকা', '/teachers'],
                ['নোটিশ বোর্ড', '/notice'],
                ['ফলাফল দেখুন', '/result'],
                ['ভর্তি আবেদন', '/admission'],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-blue-300 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Academic Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-blue-300">একাডেমিক</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {[
                ['শ্রেণি তালিকা', '/about#classes'],
                ['পরীক্ষার সময়সূচী', '/about#exam-schedule'],
                ['বৃত্তি ও সুবিধা', '/about#scholarship'],
                ['সিলেবাস', '/about#syllabus'],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-blue-300 transition-colors">{label}</Link></li>
              ))}
            </ul>

            <h4 className="font-semibold text-sm mt-5 mb-3 text-blue-300">গুরুত্বপূর্ণ লিঙ্ক</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {[
                ['মাদ্রাসা শিক্ষা বোর্ড', 'https://www.bmeb.gov.bd'],
                ['শিক্ষা মন্ত্রণালয়', 'https://www.moedu.gov.bd'],
              ].map(([label, href]) => (
                <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-blue-300">যোগাযোগ</h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex gap-2 items-start"><MapPin size={13} className="text-blue-400 shrink-0 mt-0.5" /><span>{COLLEGE_INFO.address}</span></li>
              <li className="flex gap-2 items-center"><Phone size={13} className="text-blue-400 shrink-0" /><span>{COLLEGE_INFO.phone}</span></li>
              <li className="flex gap-2 items-center"><Mail size={13} className="text-blue-400 shrink-0" /><span>{COLLEGE_INFO.email}</span></li>
              <li className="flex gap-2 items-center"><Globe size={13} className="text-blue-400 shrink-0" /><span>{COLLEGE_INFO.website}</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} {COLLEGE_INFO.nameBn}. সর্বস্বত্ব সংরক্ষিত।</p>
          <p>
            Developed by{' '}
            <a href="https://fivolix.tech" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors ml-1">
              Fivolix
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
