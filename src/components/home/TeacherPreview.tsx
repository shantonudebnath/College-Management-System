'use client';
import Link from 'next/link';
import { useTeachers } from '@/context/TeachersContext';
import { ArrowRight } from 'lucide-react';

export default function TeacherPreview() {
  const { teachers } = useTeachers();
  const featured = teachers.slice(0, 8);

  return (
    <section className="py-20 bg-[#f5f7f5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold text-[#006633] uppercase tracking-[0.2em] mb-3">শিক্ষকমণ্ডলী</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight">
              আমাদের অভিজ্ঞ শিক্ষকবৃন্দ
            </h2>
            <div className="w-10 h-[3px] bg-[#006633] rounded-full mt-4" />
          </div>
          <Link href="/teachers"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#006633] transition-colors">
            সম্পূর্ণ তালিকা <ArrowRight size={15} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {featured.map(teacher => (
            <div key={teacher.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-[#006633]/20 hover:-translate-y-1 transition-all duration-300 group">
              {/* Avatar area */}
              <div className="bg-gradient-to-br from-[#e8f5ee] to-[#c8e8d4] h-32 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #006633 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                {teacher.image ? (
                  <img src={teacher.image} alt={teacher.name}
                    className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-md relative z-10" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/60 border-2 border-white shadow-md flex items-center justify-center relative z-10">
                    <span className="text-3xl font-black text-[#006633]">{teacher.name[0]}</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-4 text-center">
                <h3 className="font-bold text-gray-900 text-sm leading-tight">{teacher.name}</h3>
                <p className="text-[#006633] text-xs font-semibold mt-1.5 bg-green-50 inline-block px-2 py-0.5 rounded-full">{teacher.designation}</p>
                <p className="text-gray-400 text-[10px] mt-1.5">{teacher.department}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/teachers"
            className="inline-flex items-center gap-2 bg-[#006633] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#004d26] transition-all shadow-md">
            সকল শিক্ষক দেখুন <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
