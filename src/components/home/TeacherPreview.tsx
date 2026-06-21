'use client';
import Link from 'next/link';
import { useTeachers } from '@/context/TeachersContext';
import { ArrowRight, User } from 'lucide-react';

export default function TeacherPreview() {
  const { teachers } = useTeachers();
  const featured = teachers.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-[0.2em] mb-3">
              শিক্ষক মণ্ডলী
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight">
              আমাদের অভিজ্ঞ<br className="hidden sm:block" /> শিক্ষকবৃন্দ
            </h2>
            <div className="w-10 h-[3px] bg-purple-500 rounded-full mt-4" />
          </div>
          <Link
            href="/teachers"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-purple-700 transition-colors shrink-0"
          >
            সম্পূর্ণ তালিকা <ArrowRight size={15} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {featured.map(teacher => (
            <div
              key={teacher.id}
              className="group bg-white rounded-3xl p-6 text-center border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Circle avatar */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-gray-100 group-hover:border-purple-200 transition-colors flex items-center justify-center shadow-sm">
                  {teacher.image
                    ? <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                    : <User size={28} className="text-purple-300" />}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-[13px] leading-tight">{teacher.name}</h3>
              <p className="text-purple-600 text-[11px] font-semibold mt-1.5">{teacher.designation}</p>
              <p className="text-gray-400 text-[10px] mt-0.5 truncate">{teacher.department}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Link
            href="/teachers"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 bg-white px-7 py-3 rounded-2xl text-sm font-semibold hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all shadow-sm"
          >
            সকল শিক্ষক দেখুন <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
