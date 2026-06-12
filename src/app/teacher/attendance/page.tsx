'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, MADRASHA_CLASSES } from '@/lib/data';
import { useCurrentTeacher } from '@/context/CurrentTeacherContext';
import { useTeachers } from '@/context/TeachersContext';
import { ClipboardList, CheckCircle, XCircle, Save, AlertCircle } from 'lucide-react';

export default function TeacherAttendancePage() {
  const { currentTeacherId, assignedClassId } = useCurrentTeacher();
  const { teachers } = useTeachers();
  const currentTeacher = teachers.find(t => t.id === currentTeacherId);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [saved, setSaved] = useState(false);

  const assignedClass = MADRASHA_CLASSES.find(c => c.id === assignedClassId);
  const classStudents = assignedClassId ? STUDENTS.filter(s => s.class === assignedClassId) : [];

  const mark = (id: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(p => ({ ...p, [id]: status }));
    setSaved(false);
  };

  const markAll = (status: 'present' | 'absent') => {
    const all: Record<string, 'present' | 'absent' | 'late'> = {};
    classStudents.forEach(s => { all[s.id] = status; });
    setAttendance(all);
    setSaved(false);
  };

  const handleSave = () => {
    try {
      const key = `nim_attendance_${assignedClassId}_${date}`;
      localStorage.setItem(key, JSON.stringify(attendance));
    } catch {}
    setSaved(true);
  };

  const present = Object.values(attendance).filter(v => v === 'present').length;
  const absent = Object.values(attendance).filter(v => v === 'absent').length;

  const teacherName = currentTeacher ? (currentTeacher.nameBn || currentTeacher.name) : 'শিক্ষক';

  return (
    <div>
      <DashboardHeader title="উপস্থিতি গ্রহণ" subtitle="শ্রেণিভিত্তিক দৈনিক উপস্থিতি" userName={teacherName} role="শিক্ষক" />
      <div className="p-6 space-y-5">

        {!currentTeacherId && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">শিক্ষক নির্বাচন করুন</p>
              <p className="text-sm text-amber-600 mt-0.5">বাম পাশের সাইডবার থেকে আপনার নাম নির্বাচন করুন।</p>
            </div>
          </div>
        )}

        {currentTeacherId && !assignedClassId && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800">কোনো শ্রেণি নির্ধারিত নেই</p>
              <p className="text-sm text-blue-600 mt-0.5">অ্যাডমিন থেকে আপনার জন্য কোনো শ্রেণি নির্ধারণ করা হয়নি।</p>
            </div>
          </div>
        )}

        {assignedClassId && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-end gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শ্রেণি</label>
                <div className="px-3 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-sm font-semibold text-purple-800">
                  {assignedClass?.nameBn ?? assignedClassId}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">তারিখ</label>
                <input type="date" value={date} onChange={e => { setDate(e.target.value); setAttendance({}); setSaved(false); }}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div className="flex gap-2 ml-auto">
                <button onClick={() => markAll('present')} className="flex items-center gap-1.5 px-4 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors">
                  <CheckCircle size={15} /> সবাই উপস্থিত
                </button>
                <button onClick={() => markAll('absent')} className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                  <XCircle size={15} /> সবাই অনুপস্থিত
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'উপস্থিত', value: present, color: 'text-green-600 bg-green-50 border-green-200' },
                { label: 'অনুপস্থিত', value: absent, color: 'text-red-600 bg-red-50 border-red-200' },
                { label: 'মোট ছাত্র', value: classStudents.length, color: 'text-purple-600 bg-purple-50 border-purple-200' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`rounded-2xl border p-4 text-center ${color}`}>
                  <p className="text-3xl font-bold">{value}</p>
                  <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">শিক্ষার্থী তালিকা</h3>
                <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-green-100 text-green-700' : 'btn-primary'}`}>
                  <Save size={14} /> {saved ? 'সংরক্ষিত!' : 'সংরক্ষণ করুন'}
                </button>
              </div>

              {classStudents.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">এই শ্রেণিতে কোনো শিক্ষার্থী নেই।</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {classStudents.map((s, i) => {
                    const status = attendance[s.id];
                    return (
                      <div key={s.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <span className="text-xs text-gray-400 w-6">{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-400">রোল: {s.roll}</p>
                        </div>
                        <div className="flex gap-2">
                          {(['present', 'absent', 'late'] as const).map(st => (
                            <button key={st} onClick={() => mark(s.id, st)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all ${status === st
                                ? st === 'present' ? 'bg-green-500 text-white border-green-500'
                                  : st === 'absent' ? 'bg-red-500 text-white border-red-500'
                                    : 'bg-amber-500 text-white border-amber-500'
                                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
                              title={st === 'present' ? 'উপস্থিত' : st === 'absent' ? 'অনুপস্থিত' : 'দেরিতে'}>
                              {st === 'present' ? '✓' : st === 'absent' ? '✗' : '~'}
                            </button>
                          ))}
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-20 text-center ${!status ? 'bg-gray-100 text-gray-400' : status === 'present' ? 'bg-green-100 text-green-700' : status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {!status ? 'অচিহ্নিত' : status === 'present' ? 'উপস্থিত' : status === 'absent' ? 'অনুপস্থিত' : 'দেরিতে'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
