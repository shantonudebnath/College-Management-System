'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { EXAM_RESULTS, MADRASHA_CLASSES } from '@/lib/data';
import { Award, CheckCircle, Download, Printer, Eye, Search, EyeOff, Lock, Unlock } from 'lucide-react';
import { useNotices } from '@/context/NoticesContext';

async function downloadResultsPDF() {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF({ orientation: 'landscape' });
  const examName = EXAM_RESULTS[0]?.examName ?? 'পরীক্ষা';
  const passCount = EXAM_RESULTS.filter(r => r.status === 'pass').length;
  const passRate = Math.round((passCount / EXAM_RESULTS.length) * 100);
  const avgGpa = (EXAM_RESULTS.reduce((s, r) => s + r.gpa, 0) / EXAM_RESULTS.length).toFixed(2);
  const today = new Date().toLocaleDateString('en-GB');

  // --- Header ---
  doc.setFillColor(109, 40, 217);
  doc.rect(0, 0, 297, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Noor-E-Islam Madrasha', 148, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Result Sheet — ' + examName, 148, 17, { align: 'center' });

  // --- Sub-header info ---
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.text(`Total Students: ${EXAM_RESULTS.length}`, 14, 29);
  doc.text(`Passed: ${passCount}`, 70, 29);
  doc.text(`Pass Rate: ${passRate}%`, 110, 29);
  doc.text(`Average GPA: ${avgGpa}`, 155, 29);
  doc.text(`Generated: ${today}`, 230, 29);

  // --- Subjects header row ---
  const subjectNames = EXAM_RESULTS[0]?.subjects.map(s => s.name) ?? [];
  const fixedCols = ['Roll', 'Student Name', 'Class'];
  const subjectCols = subjectNames.map(s => s.length > 12 ? s.slice(0, 10) + '..' : s);
  const tailCols = ['Total', 'GPA', 'Grade', 'Result'];

  const head = [[...fixedCols, ...subjectCols, ...tailCols]];

  const body = EXAM_RESULTS.map(r => {
    const subMarks = r.subjects.map(s => String(s.marks));
    return [
      String(r.roll),
      r.studentName,
      r.class,
      ...subMarks,
      String(r.totalMarks),
      r.gpa.toFixed(2),
      r.grade,
      r.status === 'pass' ? 'Pass' : 'Fail',
    ];
  });

  // Sort by roll
  body.sort((a, b) => Number(a[0]) - Number(b[0]));

  autoTable(doc, {
    head,
    body,
    startY: 34,
    styles: { fontSize: 7.5, cellPadding: 2.5 },
    headStyles: { fillColor: [109, 40, 217], textColor: 255, fontStyle: 'bold', fontSize: 7 },
    alternateRowStyles: { fillColor: [248, 245, 255] },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 38 },
      2: { cellWidth: 20 },
      [fixedCols.length + subjectNames.length]: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      [fixedCols.length + subjectNames.length + 1]: { cellWidth: 13, halign: 'center', fontStyle: 'bold', textColor: [109, 40, 217] },
      [fixedCols.length + subjectNames.length + 2]: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      [fixedCols.length + subjectNames.length + 3]: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: (data: Parameters<NonNullable<Parameters<typeof autoTable>[1]['didParseCell']>>[0]) => {
      const lastCols = fixedCols.length + subjectNames.length;
      if (data.section === 'body') {
        if (data.column.index === lastCols + 2) {
          const grade = (data.row.raw as string[])[lastCols + 2];
          if (grade === 'A+') (data.cell.styles as { textColor: number[] }).textColor = [22, 163, 74];
          else if (grade?.startsWith('A')) (data.cell.styles as { textColor: number[] }).textColor = [37, 99, 235];
          else if (grade === 'B') (data.cell.styles as { textColor: number[] }).textColor = [217, 119, 6];
        }
        if (data.column.index === lastCols + 3) {
          const res = (data.row.raw as string[])[lastCols + 3];
          (data.cell.styles as { textColor: number[] }).textColor = res === 'Pass' ? [22, 163, 74] : [220, 38, 38];
        }
      }
    },
  });

  // Footer
  const pageH = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('Noor-E-Islam Madrasha | Confidential', 14, pageH - 8);
  doc.text(`Page 1`, 280, pageH - 8, { align: 'right' });

  doc.save(`result-sheet-${examName.replace(/\s+/g, '-')}.pdf`);
}

const LS_KEY = 'published_results_v1';
const MARK_SUBMISSION_KEY = 'nim_mark_submission_v1';

function getPublished(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); } catch { return []; }
}

interface LiveExam { id: string; name: string; year: string; }
interface MarkSubmission { examId: string; examName: string; year: string; }

export default function AdminResultsPage() {
  const { addNotice } = useNotices();
  const [publishedExams, setPublishedExams] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [liveExams, setLiveExams] = useState<LiveExam[]>([]);
  const [markSubmission, setMarkSubmission] = useState<MarkSubmission | null>(null);
  const [submissionExamId, setSubmissionExamId] = useState('');

  useEffect(() => {
    setPublishedExams(getPublished());
    try { setLiveExams(JSON.parse(localStorage.getItem('nim_exams_v1') ?? '[]')); } catch {}
    try { setMarkSubmission(JSON.parse(localStorage.getItem(MARK_SUBMISSION_KEY) ?? 'null')); } catch {}
  }, []);

  const openMarkSubmission = () => {
    const exam = liveExams.find(e => e.id === submissionExamId);
    if (!exam) return;
    const val: MarkSubmission = { examId: exam.id, examName: exam.name, year: exam.year };
    localStorage.setItem(MARK_SUBMISSION_KEY, JSON.stringify(val));
    setMarkSubmission(val);
    setSubmissionExamId('');
  };

  const closeMarkSubmission = () => {
    localStorage.removeItem(MARK_SUBMISSION_KEY);
    setMarkSubmission(null);
  };

  const examName = EXAM_RESULTS[0]?.examName ?? '';
  const published = publishedExams.includes(examName);

  const togglePublish = () => {
    const isPublishing = !published;
    const next = published
      ? publishedExams.filter(e => e !== examName)
      : [...publishedExams, examName];
    setPublishedExams(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
    if (isPublishing) {
      const passCount = EXAM_RESULTS.filter(r => r.status === 'pass').length;
      const pRate = Math.round((passCount / EXAM_RESULTS.length) * 100);
      addNotice({
        id: `n${Date.now()}`,
        title: `${examName} — ফলাফল প্রকাশিত`,
        content: `${examName} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। মোট ${EXAM_RESULTS.length} জনের মধ্যে ${passCount} জন উত্তীর্ণ (পাশের হার: ${pRate}%)। শিক্ষার্থীরা নিজেদের পোর্টাল থেকে ফলাফল দেখতে পারবে।`,
        date: new Date().toISOString().split('T')[0],
        type: 'result', target: 'all', isImportant: true, postedBy: 'Admin',
      });
    }
  };

  const filtered = EXAM_RESULTS.filter(r =>
    !search || r.studentName.toLowerCase().includes(search.toLowerCase()) || String(r.roll).includes(search)
  );

  const passRate = Math.round((EXAM_RESULTS.filter(r => r.status === 'pass').length / EXAM_RESULTS.length) * 100);
  const avgGpa = (EXAM_RESULTS.reduce((s, r) => s + r.gpa, 0) / EXAM_RESULTS.length).toFixed(2);

  const getGradeColor = (grade: string) => {
    if (grade === 'A+') return 'text-green-700 bg-green-100';
    if (grade.startsWith('A')) return 'text-blue-700 bg-blue-100';
    if (grade === 'B') return 'text-amber-700 bg-amber-100';
    return 'text-red-700 bg-red-100';
  };

  return (
    <div>
      <DashboardHeader title="ফলাফল ব্যবস্থাপনা" subtitle="পরীক্ষার ফলাফল পর্যালোচনা ও প্রকাশ" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'মোট শিক্ষার্থী', value: EXAM_RESULTS.length, color: 'bg-purple-50 text-purple-700' },
            { label: 'উত্তীর্ণ', value: EXAM_RESULTS.filter(r => r.status === 'pass').length, color: 'bg-green-50 text-green-700' },
            { label: 'পাশের হার', value: `${passRate}%`, color: 'bg-blue-50 text-blue-700' },
            { label: 'গড় GPA', value: avgGpa, color: 'bg-amber-50 text-amber-700' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${color} rounded-2xl p-4 text-center`}>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
            </div>
          ))}
        </div>

        {/* Mark submission control */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Lock size={15} className="text-blue-600" /> শিক্ষক মার্ক সাবমিশন নিয়ন্ত্রণ
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">কোন পরীক্ষার মার্ক শিক্ষকরা দিতে পারবেন তা এখান থেকে নিয়ন্ত্রণ করুন</p>
            </div>
            {markSubmission ? (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-medium border border-green-200">
                  <CheckCircle size={13} /> {markSubmission.examName} ({markSubmission.year}) — খোলা আছে
                </span>
                <button onClick={closeMarkSubmission}
                  className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  <Lock size={13} /> বন্ধ করুন
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {liveExams.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">কোনো পরীক্ষা তৈরি হয়নি। আগে পরীক্ষার সময়সূচী থেকে পরীক্ষা তৈরি করুন।</p>
                ) : (
                  <>
                    <select value={submissionExamId} onChange={e => setSubmissionExamId(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                      <option value="">-- পরীক্ষা বেছে নিন --</option>
                      {liveExams.map(e => <option key={e.id} value={e.id}>{e.name} ({e.year})</option>)}
                    </select>
                    <button onClick={openMarkSubmission} disabled={!submissionExamId}
                      className="flex items-center gap-1.5 btn-primary px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 transition-opacity">
                      <Unlock size={13} /> খুলুন
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Publish/export bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">প্রথম সাময়িক পরীক্ষা ২০২৪ — দাখিল</h3>
            <p className="text-xs text-gray-400 mt-0.5">শিক্ষকের নম্বর প্রদান সম্পন্ন। প্রকাশের জন্য প্রস্তুত।</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              <Printer size={14} /> প্রিন্ট করুন
            </button>
            <button onClick={downloadResultsPDF} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 shadow-sm">
              <Download size={14} /> PDF Export
            </button>
            {!published ? (
              <button onClick={togglePublish} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
                <Award size={15} /> ফলাফল প্রকাশ করুন
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold">
                  <CheckCircle size={15} /> প্রকাশিত
                </span>
                <button onClick={togglePublish} className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-medium">
                  <EyeOff size={14} /> প্রত্যাহার
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="নাম বা রোল খুঁজুন"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
        </div>

        {/* Results table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">রোল</th>
                  <th className="px-5 py-3 text-left">নাম</th>
                  <th className="px-5 py-3 text-center">মোট নম্বর</th>
                  <th className="px-5 py-3 text-center">GPA</th>
                  <th className="px-5 py-3 text-center">গ্রেড</th>
                  <th className="px-5 py-3 text-center">ফলাফল</th>
                  <th className="px-5 py-3 text-center">বিস্তারিত</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.studentId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-700">{r.roll}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{r.studentName}</td>
                    <td className="px-5 py-3 text-center font-semibold">{r.totalMarks}</td>
                    <td className="px-5 py-3 text-center font-bold text-purple-700">{r.gpa.toFixed(2)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getGradeColor(r.grade)}`}>{r.grade}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.status === 'pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button className="w-7 h-7 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-100 mx-auto"><Eye size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
