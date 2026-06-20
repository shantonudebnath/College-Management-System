'use client';
import Link from 'next/link';
import { useTeachers } from '@/context/TeachersContext';
import { ArrowRight, User } from 'lucide-react';

export default function TeacherPreview() {
  const { teachers } = useTeachers();
  const featured = teachers.slice(0, 6);

  return (
    <section className="py-16 bg-[#f8f7ff]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-wide">শিক্ষক মণ্ডলী</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">আমাদের অভিজ্ঞ শিক্ষকবৃন্দ</h2>
            <p className="text-gray-500 text-sm mt-1">দক্ষ ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলীর তত্ত্বাবধানে মানসম্মত শিক্ষা।</p>
          </div>
          <Link href="/teachers" className="hidden md:flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors shrink-0">
            সম্পূর্ণ তালিকা <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featured.map(teacher => (
            <div key={teacher.id} className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                {teacher.image
                  ? <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                  : <User size={26} className="text-white" />}
              </div>
              <h3 className="font-semibold text-gray-900 text-xs leading-tight">{teacher.name}</h3>
              <p className="text-purple-600 text-[10px] font-medium mt-1">{teacher.designation}</p>
              <p className="text-gray-400 text-[10px] mt-0.5 truncate">{teacher.department}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/teachers"
            className="inline-flex items-center gap-2 bg-white border border-purple-200 text-purple-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-colors shadow-sm">
            সকল শিক্ষক দেখুন <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
