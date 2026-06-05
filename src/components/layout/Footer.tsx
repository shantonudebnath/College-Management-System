import Link from 'next/link';
import { GraduationCap, Phone, Mail, MapPin, Share2, PlayCircle, Globe } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-[#1e1b4b] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">{COLLEGE_INFO.name}</p>
                <p className="text-[10px] text-purple-300">{COLLEGE_INFO.nameBn}</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত, {COLLEGE_INFO.established} সাল থেকে মানসম্মত ইসলামি শিক্ষা প্রদান করে আসছে।
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"><Share2 size={15} /></a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"><PlayCircle size={15} /></a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"><Globe size={15} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-purple-300">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {[['হোম', '/'], ['শিক্ষক মণ্ডলী', '/teachers'], ['নোটিশ বোর্ড', '/notice'], ['ফলাফল দেখুন', '/result'], ['ভর্তি তথ্য', '/register']].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-purple-300 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-purple-300">পোর্টাল</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {[['ছাত্র পোর্টাল', '/student/dashboard'], ['শিক্ষক পোর্টাল', '/teacher/dashboard'], ['অ্যাডমিন প্যানেল', '/admin/dashboard'], ['লগইন', '/login'], ['রেজিস্ট্রেশন', '/register']].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-purple-300 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-purple-300">যোগাযোগ</h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex gap-2"><MapPin size={13} className="text-purple-400 shrink-0 mt-0.5" /><span>{COLLEGE_INFO.address}</span></li>
              <li className="flex gap-2"><Phone size={13} className="text-purple-400 shrink-0" /><span>{COLLEGE_INFO.phone}</span></li>
              <li className="flex gap-2"><Mail size={13} className="text-purple-400 shrink-0" /><span>{COLLEGE_INFO.email}</span></li>
              <li className="flex gap-2"><Globe size={13} className="text-purple-400 shrink-0" /><span>{COLLEGE_INFO.website}</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} {COLLEGE_INFO.name}. সর্বস্বত্ব সংরক্ষিত।</p>
          <p>{COLLEGE_INFO.eiin} | {COLLEGE_INFO.board}</p>
        </div>
      </div>
    </footer>
  );
}
