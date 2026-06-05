import Link from 'next/link';
import { TEACHERS } from '@/lib/data';
import { Phone, Mail, ArrowRight, User } from 'lucide-react';

export default function TeacherPreview() {
  const featured = TEACHERS.slice(0, 4);
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-wide">শিক্ষক মণ্ডলী</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">অভিজ্ঞ শিক্ষকবৃন্দ</h2>
            <p className="text-gray-500 text-sm mt-1">দক্ষ ও অভিজ্ঞ শিক্ষক মণ্ডলীর তত্ত্বাবধানে মানসম্মত শিক্ষা।</p>
          </div>
          <Link href="/teachers" className="hidden md:flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
            সবাইকে দেখুন <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map(teacher => (
            <div key={teacher.id} className="bg-[#f8f7ff] rounded-2xl p-6 text-center card-hover border border-gray-100 hover:border-purple-200">
              {/* Avatar */}
              <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User size={32} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{teacher.name}</h3>
              <p className="text-purple-600 text-xs font-medium mt-1">{teacher.designation}</p>
              <p className="text-gray-400 text-xs mt-0.5">{teacher.department}</p>

              <div className="mt-4 space-y-1.5 text-left">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={11} className="text-purple-400" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                  <Mail size={11} className="text-purple-400 shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1 justify-center">
                {teacher.subject.slice(0, 2).map(s => (
                  <span key={s} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/teachers" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600">
            সবাইকে দেখুন <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
