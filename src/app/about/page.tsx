import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { COLLEGE_INFO, TEACHERS } from '@/lib/data';
import { GraduationCap, BookOpen, Users, Award, MapPin, Phone, Mail, Globe, Star, CheckCircle, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="gradient-hero text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-medium mb-6">
              <Star size={12} className="text-yellow-300" /> প্রতিষ্ঠার পর থেকে মানসম্মত শিক্ষা
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{COLLEGE_INFO.nameBn}</h1>
            <p className="text-purple-200 text-lg">{COLLEGE_INFO.name}</p>
            <p className="text-white/70 text-sm mt-2">{COLLEGE_INFO.board}</p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-white border-b border-gray-100 py-8">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: COLLEGE_INFO.established.toString(), label: 'প্রতিষ্ঠা বছর' },
              { value: '১,২০০+', label: 'শিক্ষার্থী' },
              { value: `${TEACHERS.length}+`, label: 'অভিজ্ঞ শিক্ষক' },
              { value: '৯৮%', label: 'পাশের হার' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-purple-700">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About content */}
        <section className="py-14 bg-[#f8f7ff]">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#1e1b4b] mb-4">আমাদের পরিচয়</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                নূরে ইসলাম মাদ্রাসা বাংলাদেশের একটি ঐতিহ্যবাহী ইসলামি শিক্ষা প্রতিষ্ঠান। {COLLEGE_INFO.established} সাল থেকে বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের অনুমোদনে এই প্রতিষ্ঠান নিরবচ্ছিন্নভাবে মানসম্মত ইসলামি শিক্ষা প্রদান করে আসছে।
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                এবতেদায়ী থেকে দাখিল পর্যন্ত শিক্ষার্থীদের ইসলামি জ্ঞান ও আধুনিক শিক্ষার সমন্বয়ে একটি পরিপূর্ণ মানুষ হিসেবে গড়ে তোলাই আমাদের মূল লক্ষ্য। কুরআন-হাদিসের পাশাপাশি বিজ্ঞান, গণিত ও ইংরেজি শিক্ষায় সমান গুরুত্ব দেওয়া হয়।
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                আমাদের অভিজ্ঞ শিক্ষকমণ্ডলী প্রতিটি শিক্ষার্থীর মেধা বিকাশে নিরলসভাবে কাজ করেন। মাদ্রাসার শান্ত ও সুশৃঙ্খল পরিবেশ শিক্ষার্থীদের পড়াশোনায় মনোযোগী হতে সাহায্য করে।
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, title: 'পাঠ্যক্রম', desc: 'বোর্ড অনুমোদিত সিলেবাস অনুসরণ করে ইসলামি ও সাধারণ শিক্ষা' },
                { icon: Users, title: 'শিক্ষক মণ্ডলী', desc: 'উচ্চ শিক্ষিত ও অভিজ্ঞ শিক্ষকগণ দ্বারা পাঠদান' },
                { icon: Award, title: 'পরীক্ষার ফলাফল', desc: 'প্রতি বছর বোর্ড পরীক্ষায় উজ্জ্বল সাফল্য অর্জন' },
                { icon: Heart, title: 'মূল্যবোধ', desc: 'ইসলামি মূল্যবোধ ও নৈতিক শিক্ষায় বিশেষ গুরুত্ব' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center mb-3">
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#1e1b4b] text-center mb-10">লক্ষ্য ও উদ্দেশ্য</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
                <h3 className="font-bold text-purple-800 text-lg mb-3 flex items-center gap-2">
                  <Star size={18} className="text-purple-600" /> আমাদের লক্ষ্য
                </h3>
                <ul className="space-y-2">
                  {[
                    'ইসলামি জ্ঞান ও আধুনিক শিক্ষার সমন্বয়',
                    'নৈতিক ও চারিত্রিক উন্নয়নে গুরুত্ব প্রদান',
                    'আরবি ভাষায় দক্ষতা অর্জনে সহায়তা',
                    'জাতীয় পরীক্ষায় সর্বোচ্চ সাফল্য নিশ্চিত করা',
                    'ডিজিটাল শিক্ষা পদ্ধতি গ্রহণ ও বাস্তবায়ন',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-purple-700">
                      <CheckCircle size={14} className="text-purple-500 shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <h3 className="font-bold text-green-800 text-lg mb-3 flex items-center gap-2">
                  <GraduationCap size={18} className="text-green-600" /> আমাদের দৃষ্টিভঙ্গি
                </h3>
                <ul className="space-y-2">
                  {[
                    'একজন আদর্শ মুসলিম তৈরি করা',
                    'দেশপ্রেমিক ও সৎ নাগরিক গঠন',
                    'ইসলামি সংস্কৃতি ও ঐতিহ্যের সংরক্ষণ',
                    'সমাজ ও রাষ্ট্রের প্রতি দায়িত্বশীল হওয়া',
                    'জ্ঞান-বিজ্ঞানে পারদর্শী প্রজন্ম গড়ে তোলা',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-green-700">
                      <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Featured teachers */}
        <section className="py-14 bg-[#f8f7ff]">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#1e1b4b] text-center mb-2">আমাদের শিক্ষক মণ্ডলী</h2>
            <p className="text-center text-gray-500 text-sm mb-10">অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক দ্বারা পরিচালিত</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TEACHERS.slice(0, 8).map(teacher => (
                <div key={teacher.id} className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-purple-200 hover:shadow-md transition-all">
                  <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                    {teacher.name[0]}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 truncate">{teacher.name}</p>
                  <p className="text-[11px] text-purple-600 mt-0.5 truncate">{teacher.subject}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{teacher.designation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact info */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#1e1b4b] text-center mb-10">আমাদের সাথে যোগাযোগ করুন</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: MapPin, label: 'ঠিকানা', value: COLLEGE_INFO.address, color: 'text-purple-600 bg-purple-50' },
                { icon: Phone, label: 'ফোন', value: COLLEGE_INFO.phone, color: 'text-blue-600 bg-blue-50' },
                { icon: Mail, label: 'ইমেইল', value: COLLEGE_INFO.email, color: 'text-green-600 bg-green-50' },
                { icon: Globe, label: 'ওয়েবসাইট', value: COLLEGE_INFO.website, color: 'text-amber-600 bg-amber-50' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md transition-all">
                  <div className={`w-12 h-12 ${color.split(' ')[1]} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={20} className={color.split(' ')[0]} />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
