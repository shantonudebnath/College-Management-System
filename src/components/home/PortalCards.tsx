import Link from 'next/link';
import { Users, GraduationCap, Shield, ArrowRight } from 'lucide-react';

const PORTALS = [
  {
    icon: GraduationCap,
    title: 'ছাত্র পোর্টাল',
    subtitle: 'Student Portal',
    desc: 'ফলাফল, ফি, এডমিট কার্ড, সিলেবাস, নোট ও পরীক্ষার সময়সূচী — সব এক জায়গায়।',
    href: '/student/dashboard',
    bg: 'gradient-primary',
    items: ['ফলাফল দেখুন', 'এডমিট কার্ড', 'ফি বিবরণ', 'সিলেবাস'],
  },
  {
    icon: Users,
    title: 'শিক্ষক পোর্টাল',
    subtitle: 'Teacher Portal',
    desc: 'উপস্থিতি গ্রহণ, নম্বর প্রদান, সিলেবাস তৈরি, নোট আপলোড ও অনেক কিছু।',
    href: '/teacher/dashboard',
    bg: 'bg-gradient-to-br from-blue-600 to-blue-800',
    items: ['উপস্থিতি গ্রহণ', 'নম্বর প্রদান', 'সিলেবাস', 'নোটস'],
  },
  {
    icon: Shield,
    title: 'অ্যাডমিন প্যানেল',
    subtitle: 'Admin Panel',
    desc: 'সম্পূর্ণ প্রতিষ্ঠান পরিচালনা — ছাত্র ভর্তি, শিক্ষক ব্যবস্থাপনা, ফলাফল প্রকাশ।',
    href: '/admin/dashboard',
    bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
    items: ['ছাত্র ব্যবস্থাপনা', 'ফলাফল প্রকাশ', 'ফি নিয়ন্ত্রণ', 'অ্যানালিটিক্স'],
  },
];

export default function PortalCards() {
  return (
    <section className="py-16 bg-[#f8f7ff]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-wide">পোর্টালসমূহ</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">আপনার পোর্টালে প্রবেশ করুন</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PORTALS.map(({ icon: Icon, title, subtitle, desc, href, bg, items }) => (
            <div key={title} className={`${bg} text-white rounded-2xl p-8 relative overflow-hidden group shadow-xl`}>
              {/* BG pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5">
                  <Icon size={26} />
                </div>
                <h3 className="text-xl font-bold mb-1">{title}</h3>
                <p className="text-white/60 text-xs mb-3">{subtitle}</p>
                <p className="text-white/80 text-sm leading-relaxed mb-6">{desc}</p>

                <ul className="space-y-1.5 mb-6">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-white/80">
                      <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href={href} className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all">
                  প্রবেশ করুন <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
