'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, MADRASHA_CLASSES } from '@/lib/data';
import { LayoutGrid } from 'lucide-react';

const LS_KEY = 'master_routine_v2';
const TEACHERS_KEY = 'nim_teachers_v1';

const DAYS = [
  { id: 'sat', label: 'শনিবার', short: 'শনি' },
  { id: 'sun', label: 'রবিবার', short: 'রবি' },
  { id: 'mon', label: 'সোমবার', short: 'সোম' },
  { id: 'tue', label: 'মঙ্গলবার', short: 'মঙ্গল' },
  { id: 'wed', label: 'বুধবার', short: 'বুধ' },
  { id: 'thu', label: 'বৃহস্পতিবার', short: 'বৃহ' },
];

const BANGLA_ORDINALS: Record<number, string> = {
  1: '১ম', 2: '২য়', 3: '৩য়', 4: '৪র্থ', 5: '৫ম',
  6: '৬ষ্ঠ', 7: '৭ম', 8: '৮ম', 9: '৯ম', 10: '১০ম',
};

const SUBJECT_PALETTE = [
  'bg-green-50 text-green-800', 'bg-blue-50 text-blue-800',
  'bg-purple-50 text-purple-800', 'bg-orange-50 text-orange-800',
  'bg-teal-50 text-teal-800', 'bg-rose-50 text-rose-800',
  'bg-indigo-50 text-indigo-800', 'bg-amber-50 text-amber-800',
  'bg-cyan-50 text-cyan-800', 'bg-pink-50 text-pink-800',
];

function subjectColor(subject: string) {
  if (!subject) return '';
  const hash = subject.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return SUBJECT_PALETTE[hash % SUBJECT_PALETTE.length];
}

function periodTypeLabel(type: string) {
  if (type === 'break') return 'বিরতি';
  if (type === 'assembly') return 'সমাবেশ';
  if (type === 'prayer') return 'নামায';
  return '';
}

interface Period {
  id: string;
  label: string;
  type: 'class' | 'assembly' | 'break' | 'prayer';
}

interface ScheduleCell {
  subject: string;
  classIds: string[];
}

interface MasterRoutine {
  periods: Period[];
  schedule: Record<string, Record<string, Record<string, ScheduleCell>>>;
}

interface TeacherBasic {
  id: string;
  name: string;
  designation: string;
}

const student = STUDENTS[0];

export default function StudentRoutinePage() {
  const [routine, setRoutine] = useState<MasterRoutine>({ periods: [], schedule: {} });
  const [teachers, setTeachers] = useState<TeacherBasic[]>([]);

  const classInfo = MADRASHA_CLASSES.find(c => c.id === student.class);

  useEffect(() => {
    try {
      const s = localStorage.getItem(LS_KEY);
      if (s) setRoutine(JSON.parse(s));
      const ts = localStorage.getItem(TEACHERS_KEY);
      if (ts) setTeachers(JSON.parse(ts));
    } catch {}
  }, []);

  // Find which teacher teaches this student's class on a given day/period
  const getEntry = (dayId: string, periodId: string) => {
    for (const t of teachers) {
      const cell = routine.schedule[t.id]?.[dayId]?.[periodId];
      if (cell?.classIds?.includes(student.class)) return { subject: cell.subject, teacher: t.name };
    }
    return null;
  };

  let cn = 0;
  const periodsWithNum = routine.periods.map(p => {
    if (p.type === 'class') cn++;
    return { ...p, classNum: p.type === 'class' ? cn : null };
  });

  const hasData = DAYS.some(d =>
    periodsWithNum.some(p => p.type === 'class' && getEntry(d.id, p.id))
  );

  if (!hasData) {
    return (
      <div>
        <DashboardHeader title="ক্লাস রুটিন" subtitle="আপনার শ্রেণির সাপ্তাহিক রুটিন" userName={student.name} role="ছাত্র" />
        <div className="p-6">
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
            <LayoutGrid size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium text-gray-500">রুটিন এখনো প্রকাশিত হয়নি</p>
            <p className="text-xs mt-1 text-gray-400">অ্যাডমিন রুটিন তৈরি করলে এখানে দেখা যাবে।</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="ক্লাস রুটিন" subtitle="আপনার শ্রেণির সাপ্তাহিক রুটিন" userName={student.name} role="ছাত্র" />
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="bg-[#1e1b4b] text-white px-5 py-4 text-center">
            <h2 className="font-bold text-base">নূরে ইসলাম মাদ্রাসা</h2>
            <p className="text-purple-200 text-xs mt-0.5">
              {classInfo?.nameBn ?? student.class} — সাপ্তাহিক ক্লাস রুটিন | ২০২৪-২৫
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="text-xs border-collapse" style={{ minWidth: '700px', width: '100%' }}>
              <thead>
                <tr className="bg-purple-50">
                  <th className="border border-gray-200 px-3 py-3 text-gray-600 font-semibold text-center min-w-[90px]">পিরিয়ড</th>
                  {DAYS.map(d => (
                    <th key={d.id} className="border border-gray-200 px-2 py-3 text-gray-700 font-semibold text-center min-w-[100px]">{d.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periodsWithNum.map(p => {
                  if (p.type !== 'class') {
                    const rowBg = p.type === 'break' ? 'bg-amber-50' : p.type === 'prayer' ? 'bg-emerald-50/70' : 'bg-sky-50/70';
                    const rowText = p.type === 'break' ? 'text-amber-700' : p.type === 'prayer' ? 'text-emerald-700' : 'text-sky-700';
                    return (
                      <tr key={p.id} className={rowBg}>
                        <td className={`border border-gray-200 px-3 py-2.5 text-center font-semibold ${rowText}`}>
                          <div>{p.label}</div>
                          <div className="text-[10px] opacity-70">{periodTypeLabel(p.type)}</div>
                        </td>
                        {DAYS.map(d => (
                          <td key={d.id} className={`border border-gray-200 ${rowBg}`}></td>
                        ))}
                      </tr>
                    );
                  }

                  return (
                    <tr key={p.id} className="hover:bg-purple-50/20">
                      <td className="border border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-700">
                        <div>{BANGLA_ORDINALS[p.classNum!] ?? `${p.classNum}ম`}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{p.label}</div>
                      </td>
                      {DAYS.map(d => {
                        const entry = getEntry(d.id, p.id);
                        return (
                          <td key={d.id} className="border border-gray-200 px-2 py-2.5 text-center">
                            {entry ? (
                              <div>
                                <div className={`font-semibold text-[11px] leading-tight px-1.5 py-0.5 rounded ${subjectColor(entry.subject)}`}>
                                  {entry.subject}
                                </div>
                                <div className="text-[10px] text-gray-400 mt-0.5">{entry.teacher}</div>
                              </div>
                            ) : (
                              <span className="text-gray-200">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
