'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTeachers } from '@/context/TeachersContext';
import { loadWebsiteContent, DEFAULT_ABOUT, type StaffMember, type FounderMember } from '@/lib/website-content';
import { User, Phone, Mail, GraduationCap, Briefcase, Award, Star } from 'lucide-react';

const SECTIONS = [
  { id: 'principal', label: 'অধ্যক্ষের বার্তা' },
  { id: 'teachers', label: 'শিক্ষক তালিকা' },
  { id: 'staff', label: 'কর্মচারী তালিকা' },
  { id: 'founders', label: 'প্রতিষ্ঠাতা ও দাতা' },
];

function PrincipalSection() {
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  useEffect(() => { loadWebsiteContent().then(c => setAbout(c.aboutPage)); }, []);

  const initials = about.principalName
    .replace(/^(মো\.|মোঃ|জনাব|আলহাজ্ব)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-[#006633] to-[#004d26] p-10 text-center">
          <div className="w-28 h-28 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
            {initials || <User size={40} className="text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-white">{about.principalName}</h2>
          <p className="text-white/70 mt-1">অধ্যক্ষ, এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</p>
        </div>
        <div className="p-8">
          <h3 className="text-lg font-bold text-[#006633] mb-4 flex items-center gap-2">
            <Star size={18} className="text-[#006633]" /> অধ্যক্ষের বার্তা
          </h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm border-l-4 border-[#006633]/20 pl-5">
            {about.principalMessage}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherSection() {
  const { teachers, departmentOrder } = useTeachers();
  const allDepts = [...new Set(teachers.map(t => t.department))];
  const departments = [
    ...departmentOrder.filter(d => allDepts.includes(d)),
    ...allDepts.filter(d => !departmentOrder.includes(d)),
  ];

  return (
    <>
      {departments.map(dept => {
        const deptTeachers = teachers.filter(t => t.department === dept);
        return (
          <div key={dept} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-gray-200" />
              <h2 className="text-sm font-bold text-[#006633] bg-green-50 px-4 py-1.5 rounded-full border border-green-200">{dept} বিভাগ</h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {deptTeachers.map(teacher => (
                <div key={teacher.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
                  <div className="bg-gradient-to-br from-[#006633] to-[#004d26] p-6 text-center relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="relative z-10">
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-white/30 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {teacher.image ? (
                          <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={32} className="text-white" />
                        )}
                      </div>
                      <h3 className="font-bold text-white">{teacher.name}</h3>
                      <p className="text-white/70 text-xs mt-0.5">{teacher.nameBn}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-xs font-semibold text-[#006633] bg-green-50 px-3 py-1 rounded-full">{teacher.designation}</span>
                    </div>
                    <div className="space-y-2 text-xs text-gray-600">
                      {teacher.qualification && (
                        <div className="flex items-center gap-2"><Briefcase size={13} className="text-green-500 shrink-0" /><span>{teacher.qualification}</span></div>
                      )}
                      {teacher.phone && (
                        <div className="flex items-center gap-2"><Phone size={13} className="text-green-500 shrink-0" /><span>{teacher.phone}</span></div>
                      )}
                      {teacher.email && (
                        <div className="flex items-center gap-2 truncate"><Mail size={13} className="text-green-500 shrink-0" /><span className="truncate">{teacher.email}</span></div>
                      )}
                      <div className="flex items-center gap-2"><GraduationCap size={13} className="text-green-500 shrink-0" /><span>যোগদান: {teacher.joinDate}</span></div>
                    </div>
                    {teacher.subject.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">বিষয়সমূহ</p>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subject.map(s => (
                            <span key={s} className="text-[10px] bg-green-50 text-[#006633] px-2 py-0.5 rounded-full border border-green-100">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function StaffSection() {
  const [staffList, setStaffList] = useState<StaffMember[]>(DEFAULT_ABOUT.staffList);
  useEffect(() => { loadWebsiteContent().then(c => setStaffList(c.aboutPage.staffList)); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {staffList.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start hover:border-green-200 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#006633]/10 flex items-center justify-center shrink-0">
              <User size={22} className="text-[#006633]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{s.name}</h3>
              <p className="text-xs text-[#006633] font-medium mt-0.5">{s.role}</p>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><GraduationCap size={11} className="text-green-500" /> যোগদান: {s.joinDate}</span>
                {s.phone && <span className="flex items-center gap-1"><Phone size={11} className="text-green-500" /> {s.phone}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-6 text-center">মোট কর্মচারী: {staffList.length} জন (MPO ভুক্ত ও অস্থায়ী সহ)</p>
    </div>
  );
}

function FoundersSection() {
  const [foundersList, setFoundersList] = useState<FounderMember[]>(DEFAULT_ABOUT.foundersList);
  useEffect(() => { loadWebsiteContent().then(c => setFoundersList(c.aboutPage.foundersList)); }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {foundersList.map((f, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex gap-5 hover:border-green-200 transition-colors">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#006633] to-[#004d26] flex items-center justify-center shrink-0 text-white font-bold text-lg">
            {f.name.replace(/^(মাওলানা|জনাব|আলহাজ্ব|মো\.)\s*/i, '')[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-gray-900">{f.name}</h3>
                <span className="inline-block text-xs font-semibold text-[#006633] bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100 mt-1">{f.role}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0 mt-1">
                <Award size={12} className="text-amber-500" />
                {f.year}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{f.contribution}</p>
          </div>
        </div>
      ))}
      <div className="bg-[#006633]/5 border border-[#006633]/10 rounded-xl p-5 text-center">
        <p className="text-sm text-gray-600">
          এই মহান ব্যক্তিবর্গের অক্লান্ত পরিশ্রম ও নিঃস্বার্থ অবদানের ফলে আজ এই প্রতিষ্ঠান হাজারো শিক্ষার্থীর জীবন আলোকিত করছে।
          আল্লাহ তাঁদের সকলকে উত্তম প্রতিদান দান করুন।
        </p>
      </div>
    </div>
  );
}

function TeachersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const raw = searchParams.get('section') ?? 'teachers';
  const active = SECTIONS.some(s => s.id === raw) ? raw : 'teachers';

  const navigate = (id: string) => router.push(`/teachers?section=${id}`);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f5f7f5]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#006633] to-[#004d26] text-white py-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold">শিক্ষক ও কর্মচারী</h1>
            <p className="text-white/70 text-sm mt-1">আমাদের দক্ষ ও অভিজ্ঞ শিক্ষকমণ্ডলী ও কর্মচারীবৃন্দ</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="sticky top-[4.25rem] z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => navigate(s.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all shrink-0 ${
                  active === s.id
                    ? 'bg-[#006633] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-green-50 hover:text-[#006633]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          {active === 'principal' && <PrincipalSection />}
          {active === 'teachers' && <TeacherSection />}
          {active === 'staff' && <StaffSection />}
          {active === 'founders' && <FoundersSection />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function TeachersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f7f5]" />}>
      <TeachersContent />
    </Suspense>
  );
}
