import { Users, BookOpen, Award, Calendar, GraduationCap, MapPin } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const currentYear = new Date().getFullYear();
const yearsOld = currentYear - parseInt(COLLEGE_INFO.establishedEn);

const STATS = [
  { icon: Calendar,      value: `${yearsOld}+`,        label: 'বছরের অভিজ্ঞতা',  color: 'text-yellow-400' },
  { icon: Users,         value: '১,২০০+',               label: 'মোট শিক্ষার্থী',  color: 'text-sky-400' },
  { icon: GraduationCap, value: '৪৮+',                  label: 'অভিজ্ঞ শিক্ষক',   color: 'text-emerald-400' },
  { icon: BookOpen,      value: '১০',                   label: 'শ্রেণি / স্তর',    color: 'text-violet-400' },
  { icon: Award,         value: '৯৮%',                  label: 'পাশের হার',        color: 'text-rose-400' },
  { icon: MapPin,        value: COLLEGE_INFO.eiin,       label: 'EIIN নম্বর',       color: 'text-amber-400' },
];

export default function StatsSection() {
  return (
    <section className="bg-[#0d0b2a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-white/5">
          {STATS.map(({ icon: Icon, value, label, color }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-3 px-4 py-12 hover:bg-white/[0.03] transition-colors text-center"
            >
              <Icon size={26} className={color} />
              <p className={`text-4xl md:text-5xl font-black ${color} tracking-tight leading-none`}>{value}</p>
              <p className="text-[11px] text-white/35 font-medium leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
