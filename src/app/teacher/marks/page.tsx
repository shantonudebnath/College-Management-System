'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, SUBJECTS_BY_CLASS } from '@/lib/data';
import { BarChart2, Save, CheckCircle } from 'lucide-react';

export default function TeacherMarksPage() {
  const [cls, setCls] = useState('class-10');
  const [exam, setExam] = useState('প্রথম সাময়িক পরীক্ষা');
  const [subject, setSubject] = useState('Mathematics');
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const students = STUDENTS.filter(s => s.class === cls);
  const subjects = SUBJECTS_BY_CLASS[cls] ?? [];

  const getGrade = (m: number) => {
    if (m >= 80) return 'A+'; if (m >= 70) return 'A'; if (m >= 60) return 'A-';
    if (m >= 50) return 'B'; if (m >= 40) return 'C'; if (m >= 33) return 'D'; return 'F';
  };

  return (
    <div>
      <DashboardHeader title="নম্বর প্রদান" subtitle="পরীক্ষার নম্বর প্রবেশ করুন" userName="Md. Shafiqul Islam" role="শিক্ষক" />
      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap gap-4">
          {[
            { label: 'শ্রেণি', value: cls, onChange: setCls, options: [['class-9', '৯ম'], ['class-10', '১০ম'], ['class-8', '৮ম']] },
            { label: 'পরীক্ষা', value: exam, onChange: setExam, options: [['প্রথম সাময়িক পরীক্ষা', '১ম সাময়িক'], ['দ্বিতীয় সাময়িক পরীক্ষা', '২য় সাময়িক'], ['বার্ষিক পরীক্ষা', 'বার্ষিক']] },
          ].map(({ label, value, onChange, options }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
              <select value={value} onChange={e => onChange(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">বিষয়</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
              {subjects.map(s => <option key={s.name} value={s.name}>{s.nameBn}</option>)}
            </select>
          </div>
        </div>

        {/* Mark entry table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BarChart2 size={16} className="text-blue-600" /> নম্বর প্রবেশ — {subject}
            </h3>
            <button onClick={() => setSaved(true)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-green-100 text-green-700' : 'btn-primary'}`}>
              <Save size={14} /> {saved ? 'সংরক্ষিত!' : 'সংরক্ষণ'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">রোল</th>
                  <th className="px-5 py-3 text-left">নাম</th>
                  <th className="px-5 py-3 text-center">পূর্ণমান</th>
                  <th className="px-5 py-3 text-center">প্রাপ্ত নম্বর</th>
                  <th className="px-5 py-3 text-center">গ্রেড</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(s => {
                  const m = parseInt(marks[s.id] ?? '');
                  const grade = !isNaN(m) ? getGrade(m) : '—';
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-gray-600">{s.roll}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="px-5 py-3 text-center text-gray-500">100</td>
                      <td className="px-5 py-3 text-center">
                        <input type="number" min="0" max="100" value={marks[s.id] ?? ''}
                          onChange={e => { setMarks(p => ({ ...p, [s.id]: e.target.value })); setSaved(false); }}
                          className="w-20 text-center px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-purple-400 text-sm font-semibold"
                          placeholder="নম্বর" />
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${!isNaN(m) ? m >= 80 ? 'bg-green-100 text-green-700' : m >= 33 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
                          {grade}
                        </span>
                      </td>
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
