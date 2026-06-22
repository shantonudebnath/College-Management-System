import { Users, BookOpen, Award, Calendar, GraduationCap, MapPin } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const currentYear = new Date().getFullYear();
const yearsOld = currentYear - parseInt(COLLEGE_INFO.establishedEn);

const STATS = [
  { icon: Calendar,      value: `${yearsOld}+`,        label: 'বছরের অভিজ্ঞতা' },
  { icon: Users,         value: '১,২০০+',               label: 'মোট শিক্ষার্থী' },
  { icon: GraduationCap, value: '৪৮+',                  label: 'অভিজ্ঞ শিক্ষক' },
  { icon: BookOpen,      value: '১০',                   label: 'শ্রেণি / স্তর' },
  { icon: Award,         value: '৯৮%',                  label: 'পাশের হার' },
  { icon: MapPin,        value: COLLEGE_INFO.eiin,       label: 'EIIN নম্বর' },
];

export default function StatsSection() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-gray-100">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-2.5 px-4 py-10 text-center hover:bg-green-50/60 transition-colors"
            >
              <Icon size={22} className="text-[#006633]" />
              <p className="text-3xl md:text-4xl font-black text-[#004d26] tracking-tight leading-none">{value}</p>
              <p className="text-[11px] text-gray-500 font-medium leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
