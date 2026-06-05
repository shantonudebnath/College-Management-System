import { Users, BookOpen, Award, TrendingUp, GraduationCap, Clock } from 'lucide-react';

const STATS = [
  { icon: Users, value: '১,২৩৫', label: 'মোট শিক্ষার্থী', color: 'bg-purple-100 text-purple-600' },
  { icon: GraduationCap, value: '৪৮', label: 'অভিজ্ঞ শিক্ষক', color: 'bg-blue-100 text-blue-600' },
  { icon: BookOpen, value: '১০', label: 'শ্রেণি / ক্লাস', color: 'bg-green-100 text-green-600' },
  { icon: Award, value: '৯৮%', label: 'পাশের হার', color: 'bg-amber-100 text-amber-600' },
  { icon: TrendingUp, value: '৩৫+', label: 'বছরের অভিজ্ঞতা', color: 'bg-rose-100 text-rose-600' },
  { icon: Clock, value: '২৪/৭', label: 'ডিজিটাল সেবা', color: 'bg-indigo-100 text-indigo-600' },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-[#f8f7ff]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 card-hover">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon size={22} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
