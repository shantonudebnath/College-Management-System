'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES, SUBJECTS_BY_CLASS, STUDENTS, EXAM_RESULTS } from '@/lib/data';
import { calculateExamResult, getGradeInfo } from '@/lib/result-utils';
import { useResults } from '@/context/ResultsContext';
import { useStudents } from '@/context/StudentsContext';
import { kvGet } from '@/lib/supabase/kv';
import type { Student, ExamResult, Subject } from '@/lib/types';
import { Save, Search, ChevronDown, CheckCircle, AlertCircle, BookOpen, User, X, Trash2, RefreshCw } from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────

type MarksMap = Record<string, { total: string }>;

function emptyMarks(subjects: Subject[]): MarksMap {
  const m: MarksMap = {};
  subjects.forEach(s => { m[s.name] = { total: '0' }; });
  return m;
}

function clamp(val: string, max: number): number {
  const n = Number(val);
  if (isNaN(n) || n < 0) return 0;
  return Math.min(Math.round(n), max);
}

const EXAM_NAMES = [
  'অর্ধবার্ষিক পরীক্ষা',
  'বার্ষিক পরীক্ষা',
];

const GRADE_COLOR: Record<string, string> = {
  'A+': 'text-green-700 bg-green-50',
  'A':  'text-blue-700 bg-blue-50',
  'A-': 'text-blue-600 bg-blue-50',
  'B':  'text-amber-700 bg-amber-50',
  'C':  'text-orange-700 bg-orange-50',
  'D':  'text-red-600 bg-red-50',
  'F':  'text-red-700 bg-red-100',
};

// ─── component ────────────────────────────────────────────────────────────────

export default function AdminResultEntryPage() {
  const { results: storedResults, upsertResult, deleteResult: deleteResultFromCtx } = useResults();
  const { students: allStudents } = useStudents();

  // ── form state ──
  const [liveExams, setLiveExams]       = useState<{id:string;name:string;year:string}[]>([]);
  const [examName, setExamName]         = useState(EXAM_NAMES[0]);
  const [customExam, setCustomExam]     = useState('');
  const [examYear, setExamYear]         = useState(new Date().getFullYear().toString());
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [marks, setMarks]               = useState<MarksMap>({});
  const [saved, setSaved]               = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  const savedResults = useMemo(() => {
    const ids = new Set(storedResults.map(r => r.id));
    return [...storedResults, ...EXAM_RESULTS.filter(r => !ids.has(r.id))];
  }, [storedResults]);

  // ── bootstrap ──
  useEffect(() => {
    kvGet<{id:string;name:string;year:string}[]>('nim_exams_v1').then(exams => {
      if (exams && exams.length > 0) {
        setLiveExams(exams);
        setExamName(exams[0].name);
        setExamYear(exams[0].year);
      }
    });
  }, []);

  // ── derived values ──
  const activeExamName = customExam.trim() || examName;
  const subjects = selectedClass ? (SUBJECTS_BY_CLASS[selectedClass] ?? []) : [];
  const classStudents = useMemo(
    () => allStudents.filter(s => s.class === selectedClass),
    [allStudents, selectedClass]
  );
  const filteredStudents = useMemo(
    () => classStudents.filter(s =>
      !studentSearch ||
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.includes(studentSearch) ||
      String(s.roll).includes(studentSearch)
    ),
    [classStudents, studentSearch]
  );
  const selectedStudent = classStudents.find(
    s => s.id === selectedStudentId || s.studentId === selectedStudentId
  );

  // Existing result for this student+exam (pre-fill)
  const existingResult = useMemo(() => {
    if (!selectedStudent) return null;
    return savedResults.find(
      r => r.studentId === selectedStudent.id && r.examName === activeExamName && r.year === examYear
    ) ?? null;
  }, [savedResults, selectedStudent, activeExamName, examYear]);

  // On class change: reset student & marks
  useEffect(() => {
    setSelectedStudentId('');
    setMarks({});
    setStudentSearch('');
  }, [selectedClass]);

  // On student/exam change: pre-fill marks from existing result or zero
  useEffect(() => {
    if (!selectedStudent || subjects.length === 0) { setMarks({}); return; }

    if (existingResult) {
      const prefilled: MarksMap = {};
      subjects.forEach(s => {
        const sr = existingResult.subjects.find(r => r.name === s.name);
        prefilled[s.name] = { total: String(sr?.marks ?? 0) };
      });
      setMarks(prefilled);
    } else {
      setMarks(emptyMarks(subjects));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudentId, selectedClass, activeExamName, examYear]);

  // ── live calculation per subject ──
  const calcSubjects = useMemo(() => subjects.map(s => {
    const m     = marks[s.name] ?? { total: '0' };
    const total = clamp(m.total, s.fullMark);
    const info  = getGradeInfo(total, s.fullMark, selectedClass);
    return { ...s, totalObtained: total, total, ...info };
  }), [marks, subjects, selectedClass]);

  const totalObtained  = calcSubjects.reduce((a, s) => a + s.total, 0);
  const totalFullMarks = calcSubjects.reduce((a, s) => a + s.fullMark, 0);
  const percentage     = totalFullMarks > 0 ? Math.round((totalObtained / totalFullMarks) * 1000) / 10 : 0;
  const overallGrade   = getGradeInfo(totalObtained, totalFullMarks, selectedClass).grade;

  // Bangladesh Board: only compulsory failures count toward overall status
  const compulsorySubjects = calcSubjects.filter(s => !s.isOptional);
  const optionalSubjects   = calcSubjects.filter(s =>  s.isOptional);
  const failedCount = compulsorySubjects.filter(s => !s.isPassed).length;
  const overallStatus: 'pass' | 'fail' = failedCount === 0 ? 'pass' : 'fail';

  // GPA: compulsory average + optional bonus (max(0, GP − 2.0))
  const compulsoryGpa = compulsorySubjects.length > 0
    ? compulsorySubjects.reduce((a, s) => a + s.gpa, 0) / compulsorySubjects.length
    : 0;
  const optionalBonus = optionalSubjects.reduce((b, s) => b + Math.max(0, s.gpa - 2.0), 0);
  const avgGpa = calcSubjects.length > 0
    ? Math.round((compulsoryGpa + optionalBonus) * 100) / 100
    : 0;

  // ── mark input handler ──
  function updateMark(subjectName: string, val: string) {
    setMarks(prev => ({ ...prev, [subjectName]: { total: val } }));
  }

  // ── save ──
  async function handleSave() {
    if (!selectedStudent || !selectedClass || calcSubjects.length === 0) return;

    const result = calculateExamResult({
      studentId:    selectedStudent.id,
      studentName:  selectedStudent.name,
      classId:      selectedClass,
      roll:         selectedStudent.roll,
      section:      selectedStudent.section,
      subjectInputs: calcSubjects.map(s => ({
        subject:       subjects.find(x => x.name === s.name)!,
        totalObtained: s.totalObtained,
      })),
      examName: activeExamName,
      year:     examYear,
    });

    await upsertResult(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  }

  // ── delete a stored result ──
  async function deleteResult(studentId: string, eName: string, yr: string) {
    const toDelete = storedResults.find(r => r.studentId === studentId && r.examName === eName && r.year === yr);
    if (toDelete?.id) await deleteResultFromCtx(toDelete.id);
  }

  // ── recently saved results for this exam+class ──
  const recentResults = savedResults.filter(
    r => r.examName === activeExamName && r.year === examYear && r.class === selectedClass
  );

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div>
      <DashboardHeader title="নম্বর প্রবেশ" subtitle="শিক্ষার্থীর পরীক্ষার নম্বর লিখুন ও ফলাফল গণনা করুন" userName="Admin" role="Super Admin" />

      <div className="p-6 space-y-6">

        {/* ── Exam & class selectors ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BookOpen size={16} className="text-purple-600" /> পরীক্ষার তথ্য</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Exam name dropdown */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">পরীক্ষার নাম</label>
              <div className="relative">
                <select
                  value={examName}
                  onChange={e => {
                    const val = e.target.value;
                    setExamName(val);
                    setCustomExam('');
                    const live = liveExams.find(x => x.name === val);
                    if (live) setExamYear(live.year);
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none pr-8">
                  {liveExams.length > 0
                    ? liveExams.map(e => <option key={e.id} value={e.name}>{e.name} ({e.year})</option>)
                    : EXAM_NAMES.map(n => <option key={n}>{n}</option>)
                  }
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Custom exam name (only shown when no live exams) */}
            {liveExams.length === 0 && (
              <div>
                <label className="text-xs text-gray-500 block mb-1">কাস্টম নাম (ঐচ্ছিক)</label>
                <input value={customExam} onChange={e => setCustomExam(e.target.value)}
                  placeholder="অন্য নাম লিখুন…"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
            )}
            {/* Year */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">বছর</label>
              <input value={examYear} onChange={e => setExamYear(e.target.value)}
                placeholder="২০২৬"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
            </div>
            {/* Class */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">শ্রেণি</label>
              <div className="relative">
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none pr-8">
                  <option value="">— শ্রেণি বেছে নিন —</option>
                  {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Student selector ── */}
        {selectedClass && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><User size={16} className="text-purple-600" /> শিক্ষার্থী নির্বাচন</h3>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                  placeholder="নাম / আইডি / রোল খুঁজুন…"
                  className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              {selectedStudentId && (
                <button onClick={() => setSelectedStudentId('')}
                  className="flex items-center gap-1 text-xs text-red-500 hover:underline px-2">
                  <X size={12} /> সরান
                </button>
              )}
            </div>

            {filteredStudents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">এই শ্রেণিতে কোনো শিক্ষার্থী নেই</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredStudents.map(s => (
                  <button key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`text-left px-3 py-2 rounded-xl border text-sm transition-all ${selectedStudentId === s.id
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-100 hover:border-purple-300 hover:bg-purple-50'}`}>
                    <p className="font-medium truncate">{s.name}</p>
                    <p className={`text-xs mt-0.5 ${selectedStudentId === s.id ? 'text-purple-200' : 'text-gray-400'}`}>
                      রোল: {s.roll} • {s.studentId}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {existingResult && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <RefreshCw size={12} /> এই শিক্ষার্থীর {activeExamName} ({examYear})-এর পুরনো ফলাফল পাওয়া গেছে। সংরক্ষণ করলে আপডেট হবে।
              </div>
            )}
          </div>
        )}

        {/* ── Marks entry table ── */}
        {selectedStudent && subjects.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <h3 className="font-semibold text-gray-900">
                নম্বর প্রবেশ — <span className="text-purple-600">{selectedStudent.name}</span>
                <span className="ml-2 text-xs text-gray-400">({activeExamName}, {examYear})</span>
              </h3>
              <div className="text-xs text-gray-400">* বক্স খালি রাখলে শূন্য ধরা হবে</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left w-8">#</th>
                    <th className="px-4 py-3 text-left">বিষয়</th>
                    <th className="px-3 py-3 text-center font-semibold text-purple-700">প্রাপ্ত নম্বর</th>
                    <th className="px-3 py-3 text-center">পূর্ণমান</th>
                    <th className="px-3 py-3 text-center">গ্রেড</th>
                    <th className="px-3 py-3 text-center">জিপিএ</th>
                    <th className="px-3 py-3 text-center">ফলাফল</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {calcSubjects.map((s, i) => (
                    <tr key={s.name} className={`hover:bg-gray-50 transition-colors ${s.isOptional ? 'opacity-80' : ''}`}>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-gray-900 text-sm">{s.nameBn}</p>
                        {s.subjectCode && <p className="text-[10px] text-gray-400">কোড: {s.subjectCode}</p>}
                        {s.isOptional && <span className="text-[10px] text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded-full">ঐচ্ছিক</span>}
                      </td>

                      {/* Total marks input */}
                      <td className="px-3 py-2.5">
                        <div className="flex flex-col items-center">
                          <input
                            type="number" min={0} max={s.fullMark}
                            value={marks[s.name]?.total ?? '0'}
                            onChange={e => updateMark(s.name, e.target.value)}
                            className="w-20 text-center px-2 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400 focus:bg-purple-50 font-semibold"
                          />
                          <span className="text-[10px] text-gray-400 mt-0.5">/{s.fullMark}</span>
                        </div>
                      </td>

                      {/* Full mark */}
                      <td className="px-3 py-2.5 text-center text-gray-400">{s.fullMark}</td>
                      {/* Grade */}
                      <td className="px-3 py-2.5 text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${GRADE_COLOR[s.grade] ?? 'text-gray-600 bg-gray-50'}`}>{s.grade}</span>
                      </td>
                      {/* GPA */}
                      <td className="px-3 py-2.5 text-center text-sm font-semibold text-gray-700">{s.gpa.toFixed(2)}</td>
                      {/* Pass/Fail */}
                      <td className="px-3 py-2.5 text-center">
                        {s.isOptional
                          ? (s.isPassed
                              ? <span className="text-xs text-green-600 font-semibold flex items-center justify-center gap-1"><CheckCircle size={11} />উত্তীর্ণ</span>
                              : <span className="text-xs text-amber-600 font-semibold flex items-center justify-center gap-1"><AlertCircle size={11} />ঐচ্ছিক ফেল</span>)
                          : (s.isPassed
                              ? <span className="text-xs text-green-600 font-semibold flex items-center justify-center gap-1"><CheckCircle size={11} />উত্তীর্ণ</span>
                              : <span className="text-xs text-red-600 font-semibold flex items-center justify-center gap-1"><AlertCircle size={11} />অনুত্তীর্ণ</span>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Summary row ── */}
            <div className="border-t border-gray-100 p-5">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
                {[
                  { label: 'মোট নম্বর',   value: `${totalObtained}/${totalFullMarks}`, color: 'bg-purple-50 text-purple-700' },
                  { label: 'শতকরা',       value: `${percentage}%`,                     color: 'bg-blue-50 text-blue-700' },
                  { label: 'GPA',          value: avgGpa.toFixed(2),                    color: 'bg-green-50 text-green-700' },
                  { label: 'গ্রেড',        value: overallGrade,                         color: `${GRADE_COLOR[overallGrade] ?? 'bg-gray-50 text-gray-700'}` },
                  { label: 'ফলাফল',       value: overallStatus === 'pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ', color: overallStatus === 'pass' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700' },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                    <p className="text-lg font-bold">{value}</p>
                    <p className="text-xs opacity-70 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {failedCount > 0 && (
                <div className="mb-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span><strong>{failedCount}টি আবশ্যিক বিষয়ে</strong> অনুত্তীর্ণ: {compulsorySubjects.filter(s => !s.isPassed).map(s => s.nameBn).join('، ')}</span>
                </div>
              )}
              {failedCount === 0 && optionalSubjects.some(s => !s.isPassed) && (
                <div className="mb-4 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>ঐচ্ছিক বিষয়ে অনুত্তীর্ণ: {optionalSubjects.filter(s => !s.isPassed).map(s => s.nameBn).join('، ')} — সামগ্রিক ফলাফলে প্রভাব নেই।</span>
                </div>
              )}

              {saved && (
                <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle size={16} /> ফলাফল সফলভাবে সংরক্ষিত হয়েছে!
                </div>
              )}

              <button onClick={handleSave}
                disabled={!selectedStudent}
                className="flex items-center gap-2 btn-primary px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                <Save size={16} /> ফলাফল সংরক্ষণ করুন
              </button>
            </div>
          </div>
        )}

        {/* ── Saved results list for this exam+class ── */}
        {selectedClass && recentResults.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                সংরক্ষিত ফলাফল — {activeExamName} ({examYear}) — {MADRASHA_CLASSES.find(c => c.id === selectedClass)?.nameBn}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">রোল</th>
                    <th className="px-4 py-3 text-left">নাম</th>
                    <th className="px-4 py-3 text-center">মোট</th>
                    <th className="px-4 py-3 text-center">%</th>
                    <th className="px-4 py-3 text-center">GPA</th>
                    <th className="px-4 py-3 text-center">গ্রেড</th>
                    <th className="px-4 py-3 text-center">ফলাফল</th>
                    <th className="px-4 py-3 text-center">ক্রিয়া</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentResults.sort((a, b) => a.roll - b.roll).map(r => (
                    <tr key={r.studentId + r.examName + r.year} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-gray-700">{r.roll}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-900">{r.studentName}</td>
                      <td className="px-4 py-2.5 text-center">{r.totalMarks}<span className="text-gray-400">/{r.totalFullMarks}</span></td>
                      <td className="px-4 py-2.5 text-center text-gray-500">{r.percentage?.toFixed(1) ?? '—'}%</td>
                      <td className="px-4 py-2.5 text-center font-bold text-purple-700">{r.gpa.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${GRADE_COLOR[r.grade] ?? 'bg-gray-50 text-gray-700'}`}>{r.grade}</span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.status === 'pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => { setSelectedStudentId(r.studentId); }}
                            className="text-xs text-blue-600 hover:underline px-2 py-1">
                            সম্পাদনা
                          </button>
                          {/* Only allow delete for results_store entries (not static EXAM_RESULTS) */}
                          {!EXAM_RESULTS.find(e => e.studentId === r.studentId && e.examName === r.examName && e.year === r.year) && (
                            <button
                              onClick={() => deleteResult(r.studentId, r.examName, r.year)}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
