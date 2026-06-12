'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useTeachers } from '@/context/TeachersContext';
import { LayoutGrid } from 'lucide-react';

const LS_KEY = 'master_routine_v2';
const CURRENT_TEACHER_ID = 't3';

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

const CLASS_SHORT: Record<string, string> = {
  'class-1': '১ম', 'class-2': '২য়', 'class-3': '৩য়', 'class-4': '৪র্থ',
  'class-5': '৫ম', 'class-6': '৬ষ্ঠ', 'class-7': '৭ম', 'class-8': '৮ম',
  'class-9': '৯ম', 'class-10': '১০ম', 'class-alim-1': 'আলিম-১', 'class-alim-2': 'আলিম-২',
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

function periodHeaderStyle(type: string) {
  if (type === 'break') return 'bg-amber-100 text-amber-800';
  if (type === 'assembly') return 'bg-sky-100 text-sky-800';
  if (type === 'prayer') return 'bg-emerald-100 text-emerald-800';
  return 'bg-purple-50 text-gray-700';
}

function periodCellStyle(type: string) {
  if (type === 'break') return 'bg-amber-50';
  if (type === 'assembly') return 'bg-sky-50/60';
  if (type === 'prayer') return 'bg-emerald-50/60';
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

export default function TeacherRoutinePage() {
  const { teachers } = useTeachers();
  const [routine, setRoutine] = useState<MasterRoutine>({ periods: [], schedule: {} });
  const [activeDay, setActiveDay] = useState('sat');

  const teacher = teachers.find(t => t.id === CURRENT_TEACHER_ID) ?? teachers[0];

  useEffect(() => {
    try {
      const s = localStorage.getItem(LS_KEY);
      if (s) setRoutine(JSON.parse(s));
    } catch {}
  }, []);

  if (!teacher) return null;

  let cn = 0;
  const periodsWithNum = routine.periods.map(p => {
    if (p.type === 'class') cn++;
    return { ...p, classNum: p.type === 'class' ? cn : null };
  });

  if (routine.periods.length === 0 || teachers.length === 0) {
    return (
      <div>
        <DashboardHeader title="ক্লাস রুটিন" subtitle="আপনার ক্লাস সূচি" userName={teacher.name} role={teacher.designation} />
        <div className="p-6">
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
            <LayoutGrid size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium text-gray-500">রুটিন এখনো তৈরি হয়নি</p>
            <p className="text-xs mt-1 text-gray-400">অ্যাডমিন রুটিন তৈরি করলে এখানে দেখা যাবে।</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="ক্লাস রুটিন" subtitle="আপনার ক্লাস সূচি" userName={teacher.name} role={teacher.designation} />
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="bg-[#1e1b4b] text-white px-5 py-4 text-center">
            <h2 className="font-bold text-base">নূরে ইসলাম মাদ্রাসা</h2>
            <p className="text-purple-200 text-xs mt-0.5">মাস্টার ক্লাস রুটিন | ২০২৪-২৫</p>
          </div>

          {/* Day tabs */}
          <div className="px-5 pt-4 flex gap-1.5 flex-wrap border-b border-gray-100 pb-0">
            {DAYS.map(d => (
              <button key={d.id} onClick={() => setActiveDay(d.id)}
                className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2 -mb-px ${
                  activeDay === d.id
                    ? 'border-purple-600 text-purple-700 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}>
                {d.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="text-xs border-collapse" style={{ minWidth: `${(routine.periods.length + 2) * 90}px`, width: '100%' }}>
              <thead>
                <tr>
                  <th className="border border-gray-200 px-2 py-3 bg-purple-50 text-gray-500 font-semibold text-center w-8">ক্র.</th>
                  <th className="border border-gray-200 px-3 py-3 bg-purple-50 text-gray-600 font-semibold text-center min-w-[150px]">শিক্ষকের নাম ও পদবী</th>
                  {periodsWithNum.map(p => (
                    <th key={p.id} className={`border border-gray-200 px-2 py-2 font-semibold text-center min-w-[85px] ${periodHeaderStyle(p.type)}`}>
                      {p.type === 'class' ? (
                        <div>
                          <div>{BANGLA_ORDINALS[p.classNum!] ?? `${p.classNum}ম`}</div>
                          <div className="text-[9px] font-normal opacity-70 mt-0.5">{p.label}</div>
                        </div>
                      ) : (
                        <span>{p.label}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, idx) => {
                  const isMe = t.id === teacher.id;
                  return (
                    <tr key={t.id} className={isMe ? 'bg-purple-50/60' : ''}>
                      <td className={`border border-gray-200 px-2 py-2 text-center font-medium ${isMe ? 'text-purple-600' : 'text-gray-400'}`}>
                        {idx + 1}
                      </td>
                      <td className={`border border-gray-200 px-3 py-2 ${isMe ? 'bg-purple-100/60' : 'bg-green-50/30'}`}>
                        <div className={`font-semibold leading-tight ${isMe ? 'text-purple-800' : 'text-gray-800'}`}>{t.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{t.designation}</div>
                        {isMe && <div className="text-[9px] text-purple-500 mt-0.5 font-semibold">← আপনি</div>}
                      </td>
                      {periodsWithNum.map(period => {
                        const cell = routine.schedule[t.id]?.[activeDay]?.[period.id];
                        const isNonClass = period.type !== 'class';
                        const classLabel = (cell?.classIds ?? []).map(c => CLASS_SHORT[c] ?? c).join('/');
                        const bg = isNonClass
                          ? periodCellStyle(period.type)
                          : (cell?.subject ? subjectColor(cell.subject) : '');
                        return (
                          <td key={period.id} className={`border border-gray-200 px-2 py-2 text-center font-medium ${bg}`}>
                            {isNonClass ? (
                              <span className="text-gray-300">—</span>
                            ) : cell?.subject ? (
                              <div>
                                <div className="font-semibold leading-tight">{cell.subject}</div>
                                {classLabel && <div className="text-[10px] opacity-65 mt-0.5">{classLabel}</div>}
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
