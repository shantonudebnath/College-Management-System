'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES } from '@/lib/data';
import { useTeachers } from '@/context/TeachersContext';
import { useNotices } from '@/context/NoticesContext';
import { useCurrentTeacher } from '@/context/CurrentTeacherContext';
import { useStudents } from '@/context/StudentsContext';
import type { Teacher } from '@/lib/types';
import { Users, BookOpen, ClipboardList, Bell, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { teachers } = useTeachers();
  const { notices } = useNotices();
  const { currentTeacherId, setCurrentTeacher } = useCurrentTeacher();
  const { students: allStudents } = useStudents();
  const [resolvedTeacher, setResolvedTeacher] = useState<Teacher | null>(null);

  // Fetch session → match teacher by teacherId → update context
  useEffect(() => {
    fetch('/api/session')
      .then(r => r.ok ? r.json() : null)
      .then((session: { id: string; role: string } | null) => {
        if (!session || session.role !== 'teacher' || teachers.length === 0) return;
        const matched = teachers.find(t => t.teacherId === session.id);
        if (matched) {
          if (matched.id !== currentTeacherId) setCurrentTeacher(matched.id);
          setResolvedTeacher(matched);
        }
      })
      .catch(() => {});
  }, [teachers]);

  const teacher = resolvedTeacher;

  const myClasses = teacher?.classes ?? [];
  const myStudents = allStudents.filter(s => myClasses.includes(s.class));
  const myNotices = notices.filter(n => n.target === 'all' || n.target === 'teacher');

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="শিক্ষক ড্যাশবোর্ড" subtitle={`স্বাগতম, ${teacher.name}`} userName={teacher.name} role={teacher.designation} userImage={teacher.image} />

      <div className="p-6 space-y-6">
        {/* Teacher info */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold overflow-hidden shrink-0">
              {teacher.image
                ? <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                : teacher.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{teacher.name}</h2>
              <p className="text-blue-200 text-sm">{teacher.nameBn}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/80">
                <span>{teacher.designation}</span>
                <span>|</span>
                <span>{teacher.department}</span>
                <span>|</span>
                <span>আইডি: {teacher.teacherId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'আমার ক্লাস', value: myClasses.length, color: 'bg-blue-50 text-blue-600', href: '/teacher/attendance' },
            { icon: Users, label: 'মোট ছাত্র', value: myStudents.length, color: 'bg-purple-50 text-purple-600', href: '/teacher/attendance' },
            { icon: ClipboardList, label: 'আজকের উপস্থিতি', value: 'চলছে', color: 'bg-green-50 text-green-600', href: '/teacher/attendance' },
            { icon: Bell, label: 'নতুন নোটিশ', value: myNotices.length, color: 'bg-amber-50 text-amber-600', href: '/teacher/notice' },
          ].map(({ icon: Icon, label, value, color, href }) => (
            <Link key={label} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        {/* My classes */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpen size={16} className="text-blue-600" /> আমার ক্লাসগুলো</h3>
          </div>
          {myClasses.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-400 text-sm">
              <BookOpen size={32} className="mx-auto mb-2 opacity-25" />
              <p>এখনো কোনো ক্লাস অ্যাসাইন করা হয়নি।</p>
              <p className="text-xs mt-1">অ্যাডমিন প্যানেল থেকে ক্লাস অ্যাসাইন করা হলে এখানে দেখা যাবে।</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {myClasses.map(classId => {
                const classInfo = MADRASHA_CLASSES.find(c => c.id === classId);
                const classStudents = allStudents.filter(s => s.class === classId);
                return (
                  <div key={classId} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center text-white text-xs font-bold">
                        {(classInfo?.nameBn ?? classId)[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{classInfo?.nameBn ?? classId}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {(teacher.classSubjects?.[classId] ?? teacher.subject ?? []).map((s: string) => (
                            <span key={s} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{classStudents.length}</p>
                      <p className="text-xs text-gray-400">ছাত্র</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: ClipboardList, label: 'উপস্থিতি নিন', href: '/teacher/attendance', color: 'bg-green-500' },
            { icon: BarChart2, label: 'নম্বর দিন', href: '/teacher/marks', color: 'bg-blue-500' },
            { icon: BookOpen, label: 'সিলেবাস', href: '/teacher/syllabus', color: 'bg-purple-500' },
            { icon: Bell, label: 'নোটিশ', href: '/teacher/notice', color: 'bg-amber-500' },
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
