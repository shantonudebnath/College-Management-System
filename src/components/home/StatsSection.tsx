import { Users, BookOpen, Award, Calendar, GraduationCap, MapPin } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';

const currentYear = new Date().getFullYear();
const yearsOld = currentYear - parseInt(COLLEGE_INFO.establishedEn);

const STATS = [
  { icon: Calendar,      value: `${yearsOld}+`,  label: 'বছরের অভিজ্ঞতা',    color: 'text-yellow-400' },
  { icon: Users,         value: '১,২০০+',         label: 'মোট শিক্ষার্থী',    color: 'text-blue-400' },
  { icon: GraduationCap, value: '৪৮+',            label: 'অভিজ্ঞ শিক্ষক',    color: 'text-green-400' },
  { icon: BookOpen,      value: '১০',             label: 'শ্রেণি / স্তর',      color: 'text-purple-400' },
  { icon: Award,         value: '৯৮%',            label: 'পাশের হার',          color: 'text-rose-400' },
  { icon: MapPin,        value: COLLEGE_INFO.eiin, label: 'EIIN নম্বর',         color: 'text-amber-400' },
];

export default function StatsSection() {
  return (
    <section className="bg-[#1e1b4b] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          {STATS.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="bg-[#1e1b4b] px-4 py-7 text-center hover:bg-white/5 transition-colors">
              <Icon size={22} className={`${color} mx-auto mb-3`} />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/50 mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
