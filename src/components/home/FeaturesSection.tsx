import { BarChart2, Bell, CreditCard, FileText, IdCard, Calendar, ClipboardList, Award, BookOpen, Shield } from 'lucide-react';

const FEATURES = [
  { icon: BarChart2, title: 'অ্যানালিটিক্স ড্যাশবোর্ড', desc: 'রিয়েল-টাইম ডেটা, চার্ট ও রিপোর্ট দিয়ে প্রতিষ্ঠান পরিচালনা আরও সহজ।', color: 'text-purple-600 bg-purple-50' },
  { icon: ClipboardList, title: 'উপস্থিতি ব্যবস্থাপনা', desc: 'শিক্ষক ও শিক্ষার্থীর দৈনিক উপস্থিতি অনলাইনে রেকর্ড ও ট্র্যাক করুন।', color: 'text-blue-600 bg-blue-50' },
  { icon: Award, title: 'ফলাফল প্রকাশ', desc: 'পরীক্ষার নম্বর প্রবেশ থেকে ফলাফল প্রকাশ পর্যন্ত সম্পূর্ণ ডিজিটাল প্রক্রিয়া।', color: 'text-green-600 bg-green-50' },
  { icon: CreditCard, title: 'ফি ম্যানেজমেন্ট', desc: 'শ্রেণিভিত্তিক ফি নির্ধারণ, পেমেন্ট ট্র্যাকিং ও রসিদ ব্যবস্থাপনা।', color: 'text-amber-600 bg-amber-50' },
  { icon: IdCard, title: 'এডমিট কার্ড ও আইডি', desc: 'ফি ক্লিয়ারেন্স হলে স্বয়ংক্রিয়ভাবে এডমিট কার্ড ও আইডি কার্ড তৈরি।', color: 'text-rose-600 bg-rose-50' },
  { icon: Calendar, title: 'রুটিন ও সময়সূচী', desc: 'ক্লাস রুটিন, পরীক্ষার সময়সূচী তৈরি ও PDF এক্সপোর্ট সুবিধা।', color: 'text-indigo-600 bg-indigo-50' },
  { icon: Bell, title: 'নোটিশ বোর্ড', desc: 'শিক্ষক ও ছাত্রদের জন্য আলাদা নোটিশ পাঠানোর সুবিধা।', color: 'text-teal-600 bg-teal-50' },
  { icon: BookOpen, title: 'সিলেবাস ও নোটস', desc: 'শিক্ষক সিলেবাস তৈরি করবেন, ছাত্ররা নোট ও সাজেশন ডাউনলোড করবে।', color: 'text-cyan-600 bg-cyan-50' },
  { icon: Shield, title: 'নিরাপদ লগইন সিস্টেম', desc: 'তিনটি পৃথক রোল ভিত্তিক অ্যাক্সেস কন্ট্রোল — অ্যাডমিন, শিক্ষক, ছাত্র।', color: 'text-slate-600 bg-slate-50' },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-wide">বৈশিষ্ট্যসমূহ</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">সম্পূর্ণ ডিজিটাল ম্যানেজমেন্ট</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">একটি প্ল্যাটফর্মে মাদ্রাসার সব কার্যক্রম পরিচালনা করুন — দ্রুত, সহজ ও নির্ভরযোগ্য।</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="group p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 card-hover">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
