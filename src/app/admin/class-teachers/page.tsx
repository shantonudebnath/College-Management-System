'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES, STUDENTS } from '@/lib/data';
import { useTeachers } from '@/context/TeachersContext';
import { UserCheck, CheckCircle, Users, BookOpen } from 'lucide-react';
import { kvGet, kvSet } from '@/lib/supabase/kv';

export const CLASS_TEACHERS_KEY = 'nim_class_teachers_v1';

export interface ClassTeacher {
  classId: string;
  teacherId: string;
}

export default function ClassTeachersPage() {
  const { teachers } = useTeachers();
  const [assignments, setAssignments] = useState<ClassTeacher[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    kvGet<ClassTeacher[]>(CLASS_TEACHERS_KEY).then(stored => {
      if (stored) setAssignments(stored);
    });
  }, []);

  const getAssigned = (classId: string) =>
    assignments.find(a => a.classId === classId)?.teacherId ?? '';

  const assign = (classId: string, teacherId: string) => {
    const updated = assignments.filter(a => a.classId !== classId);
    if (teacherId) updated.push({ classId, teacherId });
    setAssignments(updated);
    kvSet(CLASS_TEACHERS_KEY, updated).catch(console.error);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const assignedCount = MADRASHA_CLASSES.filter(c => getAssigned(c.id)).length;

  return (
    <div>
      <DashboardHeader
        title="ক্লাস শিক্ষক"
        subtitle="প্রতিটি শ্রেণির জন্য দায়িত্বপ্রাপ্ত শিক্ষক নির্ধারণ"
        userName="Admin"
        role="Super Admin"
      />
      <div className="p-6 space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'মোট শ্রেণি', value: MADRASHA_CLASSES.length, cls: 'bg-purple-50 text-purple-800' },
            { label: 'শিক্ষক নির্ধারিত', value: assignedCount, cls: 'bg-green-50 text-green-800' },
            { label: 'নির্ধারিত হয়নি', value: MADRASHA_CLASSES.length - assignedCount, cls: 'bg-amber-50 text-amber-800' },
          ].map(s => (
            <div key={s.label} className={`${s.cls} rounded-2xl p-4 text-center`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs font-medium mt-0.5 opacity-75">{s.label}</div>
            </div>
          ))}
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm font-medium">
            <CheckCircle size={15} /> সংরক্ষণ হয়েছে
          </div>
        )}

        {/* Assignment table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-[#1e1b4b] text-white px-5 py-4">
            <h2 className="font-bold">ক্লাস শিক্ষক নির্ধারণ</h2>
            <p className="text-purple-300 text-xs mt-0.5">প্রতিটি শ্রেণির জন্য একজন শিক্ষক বেছে দিন — পরিবর্তন স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে</p>
          </div>

          <div className="divide-y divide-gray-100">
            {MADRASHA_CLASSES.map(cls => {
              const assignedTeacherId = getAssigned(cls.id);
              const assignedTeacher = teachers.find(t => t.id === assignedTeacherId);
              const studentCount = STUDENTS.filter(s => s.class === cls.id).length;

              return (
                <div key={cls.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${assignedTeacher ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <UserCheck size={18} className={assignedTeacher ? 'text-green-600' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm">{cls.nameBn}</h3>
                      {studentCount > 0 && (
                        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Users size={9} /> {studentCount} জন
                        </span>
                      )}
                      {assignedTeacher && (
                        <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <CheckCircle size={9} /> নির্ধারিত
                        </span>
                      )}
                    </div>
                    {assignedTeacher && (
                      <p className="text-xs text-gray-400 mt-0.5">{assignedTeacher.designation} · {assignedTeacher.department}</p>
                    )}
                  </div>
                  <div className="shrink-0 w-56">
                    <select
                      value={assignedTeacherId}
                      onChange={e => assign(cls.id, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-400 transition-colors ${assignedTeacher ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                    >
                      <option value="">— শিক্ষক নির্বাচন করুন —</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.nameBn || t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <BookOpen size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">ক্লাস শিক্ষকের দায়িত্ব</p>
              <ul className="text-xs text-blue-600 space-y-1 list-disc ml-3">
                <li>নির্ধারিত শ্রেণির শিক্ষার্থীদের উপস্থিতি নেওয়া</li>
                <li>সেই শ্রেণির শিক্ষার্থীদের ফি হালনাগাদ করা</li>
                <li>অভিভাবকদের সাথে নিয়মিত যোগাযোগ করা</li>
                <li>শ্রেণি সংক্রান্ত তথ্য প্রশাসনকে অবহিত করা</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Assigned teachers overview */}
        {assignedCount > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">নির্ধারিত শিক্ষকদের তালিকা</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {teachers.map(t => {
                const assignedClasses = MADRASHA_CLASSES.filter(c => getAssigned(c.id) === t.id);
                if (assignedClasses.length === 0) return null;
                return (
                  <div key={t.id} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                    <div className="w-8 h-8 gradient-primary rounded-lg text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {(t.nameBn || t.name)[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{t.nameBn || t.name}</p>
                      {assignedClasses.map(c => (
                        <p key={c.id} className="text-[10px] text-purple-600">{c.nameBn}</p>
                      ))}
                    </div>
                  </div>
                );
              }).filter(Boolean)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
