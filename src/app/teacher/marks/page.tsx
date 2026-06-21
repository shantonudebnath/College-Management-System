'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { SUBJECTS_BY_CLASS, STUDENTS, MADRASHA_CLASSES } from '@/lib/data';
import { useTeachers } from '@/context/TeachersContext';
import { useCurrentTeacher } from '@/context/CurrentTeacherContext';
import { getGradeInfo } from '@/lib/result-utils';
import { BarChart2, Save, CheckCircle, Lock, AlertTriangle } from 'lucide-react';

const EXAM_OPTIONS = [
  'প্রথম সাময়িক পরীক্ষা',
  'অর্ধবার্ষিক পরীক্ষা',
  'দ্বিতীয় সাময়িক পরীক্ষা',
  'বার্ষিক পরীক্ষা',
  'প্রাক-নির্বাচনি পরীক্ষা',
  'নির্বাচনি পরীক্ষা',
  'টেস্ট পরীক্ষা',
];

const TEACHER_MARKS_KEY = 'teacher_marks_v1';

interface LiveExam { id: string; name: string; year: string; }
interface MarkSubmission { examId: string; examName: string; year: string; }

interface TeacherMarkEntry {
  teacherId: string;
  classId: string;
  examName: string;
  year: string;
  subjectName: string;
  marks: { studentId: string; studentName: string; roll: number; cq: number; mcq: number; practical: number }[];
  savedAt: string;
}

function loadTeacherMarks(): TeacherMarkEntry[] {
  try { return JSON.parse(localStorage.getItem(TEACHER_MARKS_KEY) ?? '[]'); } catch { return []; }
}

function saveTeacherMarks(entry: TeacherMarkEntry): void {
  const existing = loadTeacherMarks();
  const filtered = existing.filter(e =>
    !(e.teacherId === entry.teacherId && e.classId === entry.classId &&
      e.examName === entry.examName && e.year === entry.year && e.subjectName === entry.subjectName)
  );
  localStorage.setItem(TEACHER_MARKS_KEY, JSON.stringify([...filtered, entry]));
}

export default function TeacherMarksPage() {
  const { teachers } = useTeachers();
  const { currentTeacherId } = useCurrentTeacher();

  // Teacher identity — may be null while context is loading; page still works
  const teacher = useMemo(
    () => teachers.find(t => t.id === currentTeacherId) ?? null,
    [teachers, currentTeacherId]
  );

  // Which classes this teacher is assigned to (empty = show all)
  const assignedClasses: string[] = teacher?.classes ?? [];
  const classList = assignedClasses.length > 0
    ? MADRASHA_CLASSES.filter(c => assignedClasses.includes(c.id))
    : MADRASHA_CLASSES;

  const [cls,         setCls]         = useState(classList[0]?.id ?? 'class-10');
  const [staticExam,  setStaticExam]  = useState(EXAM_OPTIONS[0]);
  const [staticYear,  setStaticYear]  = useState(String(new Date().getFullYear()));
  const [subjectName, setSubjectName] = useState('');
  const [marks,       setMarks]       = useState<Record<string, { cq: string; mcq: string; practical: string }>>({});
  const [saved,       setSaved]       = useState(false);
  const [extraStudents, setExtraStudents] = useState<typeof STUDENTS>([]);

  const [liveExams, setLiveExams]             = useState<LiveExam[]>([]);
  const [markSubmission, setMarkSubmission]   = useState<MarkSubmission | null>(null);
  const [selectedExamId, setSelectedExamId]   = useState<string>('');

  const selectedLiveExam = liveExams.find(e => e.id === selectedExamId);
  const exam = selectedLiveExam?.name ?? staticExam;
  const year = selectedLiveExam?.year ?? staticYear;
  const submissionOpen = markSubmission !== null || liveExams.length === 0;

  // Sync cls when teacher's class list loads (async)
  useEffect(() => {
    if (classList.length > 0 && !classList.find(c => c.id === cls)) {
      setCls(classList[0].id);
      setMarks({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classList.map(c => c.id).join(',')]);

  // Load extra students + live exams + mark submission gate
  useEffect(() => {
    try { setExtraStudents(JSON.parse(localStorage.getItem('students_store') ?? '[]')); } catch {}
    try { setLiveExams(JSON.parse(localStorage.getItem('nim_exams_v1') ?? '[]')); } catch {}
    try { setMarkSubmission(JSON.parse(localStorage.getItem('nim_mark_submission_v1') ?? 'null')); } catch {}
  }, []);

  // Auto-select the open submission exam when data loads
  useEffect(() => {
    if (markSubmission && liveExams.length > 0) {
      setSelectedExamId(markSubmission.examId);
    } else if (liveExams.length > 0 && !selectedExamId) {
      setSelectedExamId(liveExams[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markSubmission?.examId, liveExams.length]);

  // Subjects: filter by teacher's assigned subjects for this class if available
  const assignedNames: string[] = teacher?.classSubjects?.[cls] ?? [];
  const allSubjects = SUBJECTS_BY_CLASS[cls] ?? [];

  const subjects = useMemo(() => {
    if (assignedNames.length === 0) return allSubjects;
    const matched = allSubjects.filter(s =>
      assignedNames.some(n =>
        s.nameBn === n || s.name === n ||
        s.nameBn.includes(n) || n.includes(s.nameBn) ||
        s.name.toLowerCase().includes(n.toLowerCase())
      )
    );
    return matched.length > 0 ? matched : allSubjects;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cls, assignedNames.join(',')]);

  // Reset subjectName when class changes
  useEffect(() => {
    setSubjectName(prev => {
      const stillValid = subjects.find(s => s.name === prev);
      return stillValid ? prev : (subjects[0]?.name ?? '');
    });
    setMarks({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cls]);

  // Ensure subjectName is always valid when subjects list changes
  useEffect(() => {
    if (subjects.length > 0 && !subjects.find(s => s.name === subjectName)) {
      setSubjectName(subjects[0].name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects.length, subjectName]);

  const sub = subjects.find(s => s.name === subjectName) ?? subjects[0] ?? null;
  const hasCq        = (sub?.cqMark ?? 0) > 0;
  const hasMcq       = (sub?.mcqMark ?? 0) > 0;
  const hasPractical = (sub?.practicalMark ?? 0) > 0;
  const colCount     = 2 + (hasCq ? 1 : 0) + (hasMcq ? 1 : 0) + (hasPractical ? 1 : 0) + 2;

  const students = useMemo(() => [
    ...STUDENTS.filter(s => s.class === cls),
    ...extraStudents.filter(s => s.class === cls),
  ].sort((a, b) => (a.roll ?? 0) - (b.roll ?? 0)), [cls, extraStudents]);

  const setMark = (sid: string, field: 'cq' | 'mcq' | 'practical', val: string) => {
    setMarks(p => ({ ...p, [sid]: { ...(p[sid] ?? { cq: '', mcq: '', practical: '' }), [field]: val } }));
    setSaved(false);
  };

  const handleSave = () => {
    if (!sub) return;
    const rows = students.map(s => {
      const m = marks[s.id] ?? { cq: '', mcq: '', practical: '' };
      return { studentId: s.id, studentName: s.name, roll: s.roll ?? 0, cq: parseFloat(m.cq) || 0, mcq: parseFloat(m.mcq) || 0, practical: parseFloat(m.practical) || 0 };
    });
    saveTeacherMarks({ teacherId: teacher?.id ?? 'unknown', classId: cls, examName: exam, year, subjectName: sub.name, marks: rows, savedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const classInfo = MADRASHA_CLASSES.find(c => c.id === cls);

  return (
    <div>
      <DashboardHeader
        title="নম্বর প্রদান"
        subtitle="পরীক্ষার নম্বর প্রবেশ করুন"
        userName={teacher?.name ?? 'শিক্ষক'}
        role="শিক্ষক"
      />
      <div className="p-6 space-y-5">

        {/* Submission gate banner */}
        {liveExams.length > 0 && (
          markSubmission ? (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm">
              <CheckCircle size={16} className="shrink-0" />
              <div>
                <span className="font-semibold">{markSubmission.examName} ({markSubmission.year})</span> — মার্ক সাবমিশন চলছে। নম্বর প্রবেশ করে সংরক্ষণ করুন।
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
              <Lock size={16} className="shrink-0" />
              <div>
                <span className="font-semibold">মার্ক সাবমিশন বন্ধ আছে।</span> অ্যাডমিন পরীক্ষার পর মার্ক সাবমিশন খুললে নম্বর দিতে পারবেন।
              </div>
            </div>
          )
        )}

        {/* ─── Filters ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div className="flex flex-wrap gap-4 items-end">

            {/* Class */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">শ্রেণি</label>
              <select value={cls} onChange={e => { setCls(e.target.value); setMarks({}); setSaved(false); }}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                {classList.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
              </select>
            </div>

            {/* Exam */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">পরীক্ষা</label>
              {liveExams.length > 0 ? (
                <select
                  value={selectedExamId}
                  onChange={e => { setSelectedExamId(e.target.value); setSaved(false); }}
                  disabled={!!markSubmission}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 disabled:opacity-60">
                  {liveExams.map(e => <option key={e.id} value={e.id}>{e.name} ({e.year})</option>)}
                </select>
              ) : (
                <select value={staticExam} onChange={e => { setStaticExam(e.target.value); setSaved(false); }}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                  {EXAM_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              )}
            </div>

            {/* Year (only shown when no live exams) */}
            {liveExams.length === 0 && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">বছর</label>
                <select value={staticYear} onChange={e => { setStaticYear(e.target.value); setSaved(false); }}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                  {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - 1 + i)).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}

            {/* Subject */}
            {subjects.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">বিষয়</label>
                <select value={subjectName} onChange={e => { setSubjectName(e.target.value); setMarks({}); setSaved(false); }}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 min-w-[180px]">
                  {subjects.map(s => <option key={s.name} value={s.name}>{s.nameBn}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Subject info chips */}
          {sub && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-semibold border border-purple-100">
                পূর্ণমান: {sub.fullMark}
              </span>
              {hasCq && (
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                  সৃজনশীল (CQ): {sub.cqMark}
                </span>
              )}
              {hasMcq && (
                <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                  MCQ: {sub.mcqMark}
                </span>
              )}
              {hasPractical && (
                <span className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-100">
                  ব্যবহারিক: {sub.practicalMark}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ─── Mark entry table ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BarChart2 size={16} className="text-blue-600" />
              নম্বর প্রবেশ{sub ? ` — ${sub.nameBn}` : ''}
              {classInfo && <span className="text-xs font-normal text-gray-400">({classInfo.nameBn})</span>}
            </h3>
            <button onClick={handleSave} disabled={!sub || !submissionOpen}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 ${saved ? 'bg-green-100 text-green-700' : 'btn-primary'}`}
              title={!submissionOpen ? 'অ্যাডমিন মার্ক সাবমিশন খুললে সংরক্ষণ করা যাবে' : ''}>
              {saved ? <CheckCircle size={14} /> : <Save size={14} />}
              {saved ? 'সংরক্ষিত!' : 'সংরক্ষণ'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">রোল</th>
                  <th className="px-4 py-3 text-left font-semibold">নাম</th>
                  {hasCq && (
                    <th className="px-3 py-3 text-center font-semibold text-blue-600">
                      সৃজনশীল<br />
                      <span className="text-gray-400 font-normal normal-case">/{sub!.cqMark}</span>
                    </th>
                  )}
                  {hasMcq && (
                    <th className="px-3 py-3 text-center font-semibold text-green-600">
                      MCQ<br />
                      <span className="text-gray-400 font-normal normal-case">/{sub!.mcqMark}</span>
                    </th>
                  )}
                  {hasPractical && (
                    <th className="px-3 py-3 text-center font-semibold text-orange-600">
                      ব্যবহারিক<br />
                      <span className="text-gray-400 font-normal normal-case">/{sub!.practicalMark}</span>
                    </th>
                  )}
                  {!hasCq && !hasMcq && !hasPractical && (
                    <th className="px-4 py-3 text-center font-semibold text-blue-600">
                      প্রাপ্ত নম্বর<br />
                      <span className="text-gray-400 font-normal">/{sub?.fullMark ?? 100}</span>
                    </th>
                  )}
                  <th className="px-4 py-3 text-center font-semibold">মোট</th>
                  <th className="px-4 py-3 text-center font-semibold">গ্রেড</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.length === 0 && (
                  <tr>
                    <td colSpan={colCount} className="px-5 py-10 text-center text-gray-400 text-sm">
                      এই শ্রেণিতে কোনো শিক্ষার্থী নেই
                    </td>
                  </tr>
                )}
                {students.map(s => {
                  const m        = marks[s.id] ?? { cq: '', mcq: '', practical: '' };
                  const cqVal    = parseFloat(m.cq) || 0;
                  const mcqVal   = parseFloat(m.mcq) || 0;
                  const practVal = parseFloat(m.practical) || 0;
                  const total    = cqVal + mcqVal + practVal;
                  const hasAny   = m.cq !== '' || m.mcq !== '' || m.practical !== '';
                  const gi       = (hasAny && sub) ? getGradeInfo(total, sub.fullMark, cls) : null;

                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 font-medium">{s.roll}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>

                      {hasCq && (
                        <td className="px-3 py-2.5 text-center">
                          <input type="number" min="0" max={sub!.cqMark} value={m.cq}
                            onChange={e => setMark(s.id, 'cq', e.target.value)}
                            className="w-16 text-center px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-lg outline-none focus:border-blue-400 text-sm font-semibold"
                            placeholder="CQ" />
                        </td>
                      )}
                      {hasMcq && (
                        <td className="px-3 py-2.5 text-center">
                          <input type="number" min="0" max={sub!.mcqMark} value={m.mcq}
                            onChange={e => setMark(s.id, 'mcq', e.target.value)}
                            className="w-16 text-center px-2 py-1.5 bg-green-50 border border-green-200 rounded-lg outline-none focus:border-green-400 text-sm font-semibold"
                            placeholder="MCQ" />
                        </td>
                      )}
                      {hasPractical && (
                        <td className="px-3 py-2.5 text-center">
                          <input type="number" min="0" max={sub!.practicalMark} value={m.practical}
                            onChange={e => setMark(s.id, 'practical', e.target.value)}
                            className="w-16 text-center px-2 py-1.5 bg-orange-50 border border-orange-200 rounded-lg outline-none focus:border-orange-400 text-sm font-semibold"
                            placeholder="ব্যাঃ" />
                        </td>
                      )}
                      {/* Fallback: subject has no breakdown → single input */}
                      {!hasCq && !hasMcq && !hasPractical && (
                        <td className="px-3 py-2.5 text-center">
                          <input type="number" min="0" max={sub?.fullMark ?? 100} value={m.cq}
                            onChange={e => setMark(s.id, 'cq', e.target.value)}
                            className="w-20 text-center px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-lg outline-none focus:border-blue-400 text-sm font-semibold"
                            placeholder="নম্বর" />
                        </td>
                      )}

                      <td className="px-4 py-3 text-center font-bold text-gray-800">
                        {hasAny && sub
                          ? <span className={total > sub.fullMark ? 'text-red-500' : ''}>{total}/{sub.fullMark}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {gi ? (
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            !gi.isPassed ? 'bg-red-100 text-red-700' : gi.gpa >= 4 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {gi.grade}
                          </span>
                        ) : <span className="text-gray-300 text-xs">—</span>}
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
