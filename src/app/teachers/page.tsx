import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TEACHERS } from '@/lib/data';
import { User, Phone, Mail, GraduationCap, Briefcase } from 'lucide-react';

export default function TeachersPage() {
  const departments = [...new Set(TEACHERS.map(t => t.department))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f8f7ff] py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">শিক্ষক মণ্ডলী</h1>
            <p className="text-gray-500 text-sm mt-1">আমাদের অভিজ্ঞ ও দক্ষ শিক্ষকবৃন্দের পরিচিতি</p>
          </div>

          {/* By department */}
          {departments.map(dept => {
            const deptTeachers = TEACHERS.filter(t => t.department === dept);
            return (
              <div key={dept} className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <h2 className="text-sm font-bold text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200">{dept} বিভাগ</h2>
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {deptTeachers.map(teacher => (
                    <div key={teacher.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover hover:border-purple-200">
                      {/* Card header */}
                      <div className="gradient-hero p-6 text-center relative">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div className="relative z-10">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/30">
                            <User size={32} className="text-white" />
                          </div>
                          <h3 className="font-bold text-white">{teacher.name}</h3>
                          <p className="text-white/70 text-xs mt-0.5">{teacher.nameBn}</p>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-5">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">{teacher.designation}</span>
                        </div>

                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <Briefcase size={13} className="text-purple-400 shrink-0" />
                            <span>{teacher.qualification}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={13} className="text-purple-400 shrink-0" />
                            <span>{teacher.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <Mail size={13} className="text-purple-400 shrink-0" />
                            <span className="truncate">{teacher.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap size={13} className="text-purple-400 shrink-0" />
                            <span>যোগদান: {teacher.joinDate}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">বিষয়সমূহ</p>
                          <div className="flex flex-wrap gap-1">
                            {teacher.subject.map(s => (
                              <span key={s} className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
