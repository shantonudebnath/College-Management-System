'use client';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { NOTICES, EXAM_RESULTS, EXAM_SCHEDULE } from '@/lib/data';
import { Award, CreditCard, Bell, Calendar, BookOpen, FileDown, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useStudentSession } from '@/hooks/useStudentSession';
import { useFees } from '@/context/FeesContext';

export default function StudentDashboard() {
  const { student, loading } = useStudentSession();
  const { fees: allFees } = useFees();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const studentId = student?.id ?? '';
  const studentFees = allFees.filter(f => f.studentId === studentId);
  const pendingFees = studentFees.filter(f => f.status !== 'paid').length;
  const latestResult = EXAM_RESULTS.find(r => r.studentId === studentId);
  const studentClass = student?.class ?? 'class-10';
  const upcomingExams = EXAM_SCHEDULE.filter(e => e.class === studentClass).slice(0, 3);
  const latestNotices = NOTICES.slice(0, 4);

  const displayName = student ? (student.name) : 'শিক্ষার্থী';
  const displayNameBn = student?.nameBn ?? '';

  return (
    <div>
      <DashboardHeader title="ছাত্র ড্যাশবোর্ড" subtitle={`স্বাগতম, ${displayName}`} userName={displayName} role="ছাত্র" />

      <div className="p-6 space-y-6">
        {/* Student info card */}
        <div className="gradient-primary text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold overflow-hidden shrink-0">
              {student?.image
                ? <img src={student.image} alt={displayName} className="w-full h-full object-cover" />
                : displayName[0]
              }
            </div>
            <div>
              <h2 className="text-xl font-bold">{displayName}</h2>
              {displayNameBn && <p className="text-purple-200 text-sm">{displayNameBn}</p>}
              <div className="flex gap-3 mt-2 text-xs text-white/80">
                {student?.studentId && <><span>আইডি: {student.studentId}</span><span>|</span></>}
                {student?.roll && <><span>রোল: {student.roll}</span><span>|</span></>}
                {student?.session && <span>সেশন: {student.session}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Quick stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Award, label: 'সর্বশেষ GPA', value: latestResult?.gpa.toFixed(2) ?? '—', sub: latestResult?.grade, color: 'bg-green-50 text-green-600', href: '/student/result' },
            { icon: CreditCard, label: 'বকেয়া ফি', value: `${pendingFees}টি`, sub: 'পরিশোধ বাকি', color: pendingFees > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600', href: '/student/fees' },
            { icon: Calendar, label: 'আসন্ন পরীক্ষা', value: `${upcomingExams.length}টি`, sub: 'বিষয়', color: 'bg-blue-50 text-blue-600', href: '/student/exam-schedule' },
            { icon: Bell, label: 'নতুন নোটিশ', value: `${latestNotices.length}টি`, sub: 'অপঠিত', color: 'bg-amber-50 text-amber-600', href: '/student/notice' },
          ].map(({ icon: Icon, label, value, sub, color, href }) => (
            <Link key={label} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest notices */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Bell size={16} className="text-purple-600" /> নোটিশ বোর্ড</h3>
              <Link href="/student/notice" className="text-xs text-purple-600 hover:underline">সব দেখুন</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {latestNotices.map(notice => (
                <div key={notice.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-2">
                    {notice.isImportant ? <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" /> : <Bell size={14} className="text-gray-300 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notice.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{notice.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming exams */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar size={16} className="text-purple-600" /> পরীক্ষার সময়সূচী</h3>
              <Link href="/student/exam-schedule" className="text-xs text-purple-600 hover:underline">সব দেখুন</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {upcomingExams.map(exam => (
                <div key={exam.id} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{exam.subject}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{exam.date} | {exam.startTime}–{exam.endTime}</p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">{exam.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick access */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Award, label: 'ফলাফল দেখুন', href: '/student/result', color: 'bg-green-500' },
            { icon: BookOpen, label: 'সিলেবাস', href: '/student/syllabus', color: 'bg-blue-500' },
            { icon: FileDown, label: 'নোট ডাউনলোড', href: '/student/notes', color: 'bg-purple-500' },
            { icon: CreditCard, label: 'ফি বিবরণ', href: '/student/fees', color: 'bg-amber-500' },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link key={label} href={href} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group">
              <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={18} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
