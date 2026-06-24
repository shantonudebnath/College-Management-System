'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { EXAM_RESULTS, MADRASHA_CLASSES } from '@/lib/data';
import { loadResultsFromStorage } from '@/lib/result-utils';
import type { ExamResult } from '@/lib/types';
import { Award, CheckCircle, Download, Printer, Search, EyeOff, Lock, Unlock, ChevronDown, FileText } from 'lucide-react';
import { useNotices } from '@/context/NoticesContext';

const LS_KEY = 'published_results_v1';
const MARK_SUBMISSION_KEY = 'nim_mark_submission_v1';

function getPublished(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); } catch { return []; }
}

function getGradeColor(grade: string) {
  if (grade === 'A+') return 'text-green-700 bg-green-100';
  if (grade.startsWith('A')) return 'text-blue-700 bg-blue-100';
  if (grade === 'B') return 'text-amber-700 bg-amber-100';
  return 'text-red-700 bg-red-100';
}

async function downloadResultsPDF(results: ExamResult[], examName: string, classLabel: string) {
  if (results.length === 0) return;
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF({ orientation: 'landscape' });
  const passCount = results.filter(r => r.status === 'pass').length;
  const passRate = results.length > 0 ? Math.round((passCount / results.length) * 100) : 0;
  const avgGpa = results.length > 0
    ? (results.reduce((s, r) => s + r.gpa, 0) / results.length).toFixed(2)
    : '0.00';
  const today = new Date().toLocaleDateString('en-GB');

  doc.setFillColor(0, 102, 51);
  doc.rect(0, 0, 297, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Noor-E-Islam Madrasha', 148, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Result Sheet — ${examName}${classLabel !== 'সকল শ্রেণি' ? ' — ' + classLabel : ''}`, 148, 17, { align: 'center' });

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.text(`Total Students: ${results.length}`, 14, 29);
  doc.text(`Passed: ${passCount}`, 70, 29);
  doc.text(`Pass Rate: ${passRate}%`, 110, 29);
  doc.text(`Average GPA: ${avgGpa}`, 155, 29);
  doc.text(`Generated: ${today}`, 230, 29);

  const subjectNames = results[0]?.subjects.map(s => s.name) ?? [];
  const fixedCols = ['Roll', 'Student Name', 'Class'];
  const subjectCols = subjectNames.map(s => s.length > 10 ? s.slice(0, 8) + '..' : s);
  const tailCols = ['Total', 'GPA', 'Grade', 'Result'];
  const head = [[...fixedCols, ...subjectCols, ...tailCols]];

  const sorted = [...results].sort((a, b) => a.roll - b.roll);
  const body = sorted.map(r => {
    const subMarks = r.subjects.map(s => String(s.marks));
    const cn = MADRASHA_CLASSES.find(c => c.id === r.class)?.nameBn ?? r.class;
    return [String(r.roll), r.studentName, cn, ...subMarks, String(r.totalMarks), r.gpa.toFixed(2), r.grade, r.status === 'pass' ? 'Pass' : 'Fail'];
  });

  autoTable(doc, {
    head,
    body,
    startY: 34,
    styles: { fontSize: 7.5, cellPadding: 2.5 },
    headStyles: { fillColor: [0, 102, 51], textColor: 255, fontStyle: 'bold', fontSize: 7 },
    alternateRowStyles: { fillColor: [240, 248, 244] },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 38 },
      2: { cellWidth: 22 },
      [fixedCols.length + subjectNames.length]:     { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      [fixedCols.length + subjectNames.length + 1]: { cellWidth: 13, halign: 'center', fontStyle: 'bold', textColor: [0, 102, 51] },
      [fixedCols.length + subjectNames.length + 2]: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      [fixedCols.length + subjectNames.length + 3]: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: (data: Parameters<NonNullable<Parameters<typeof autoTable>[1]['didParseCell']>>[0]) => {
      const lastCols = fixedCols.length + subjectNames.length;
      if (data.section === 'body' && data.column.index === lastCols + 3) {
        const res = (data.row.raw as string[])[lastCols + 3];
        (data.cell.styles as { textColor: number[] }).textColor = res === 'Pass' ? [22, 163, 74] : [220, 38, 38];
      }
    },
  });

  const pageH = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('Noor-E-Islam Madrasha | Confidential', 14, pageH - 8);
  doc.save(`result-sheet-${examName.replace(/\s+/g, '-')}.pdf`);
}

function printResultSheet(results: ExamResult[], examName: string, classLabel: string) {
  if (results.length === 0) return;
  const sorted = [...results].sort((a, b) => a.roll - b.roll);
  const passCount = sorted.filter(r => r.status === 'pass').length;
  const passRate = sorted.length > 0 ? Math.round((passCount / sorted.length) * 100) : 0;
  const today = new Date().toLocaleDateString('bn-BD');

  const rows = sorted.map((r, i) => {
    const cn = MADRASHA_CLASSES.find(c => c.id === r.class)?.nameBn ?? r.class;
    const sc = r.status === 'pass' ? '#15803d' : '#dc2626';
    return `<tr style="background:${i % 2 === 0 ? '#fff' : '#f0f8f4'}">
      <td style="text-align:center">${r.roll}</td>
      <td>${r.studentName}</td>
      <td style="text-align:center">${cn}</td>
      <td style="text-align:center">${r.totalMarks}${r.totalFullMarks ? '/' + r.totalFullMarks : ''}</td>
      <td style="text-align:center">${r.percentage != null ? r.percentage.toFixed(1) : '—'}%</td>
      <td style="text-align:center;font-weight:700;color:#006633">${r.gpa.toFixed(2)}</td>
      <td style="text-align:center;font-weight:700">${r.grade}</td>
      <td style="text-align:center;font-weight:700;color:${sc}">${r.status === 'pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<title>ফলাফল — ${examName}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;padding:20px;font-size:11px;color:#111}
  .hdr{text-align:center;border-bottom:3px double #006633;padding-bottom:10px;margin-bottom:12px}
  .inst-name{font-size:20px;font-weight:900;color:#006633}
  .inst-en{font-size:9px;color:#666;font-style:italic;margin-top:2px}
  .exam-title{font-size:14px;font-weight:bold;color:#111;margin:8px 0 4px}
  .meta{font-size:10px;color:#555}
  .stats{display:flex;gap:16px;margin:10px 0 14px}
  .stat-item{background:#f0f8f4;border:1px solid #c6e8d6;border-radius:4px;padding:6px 16px;text-align:center}
  .stat-val{font-size:16px;font-weight:700;color:#006633}
  .stat-lbl{font-size:9px;color:#555;margin-top:2px}
  table{width:100%;border-collapse:collapse;font-size:10.5px}
  th{background:#006633;color:#fff;padding:6px 8px;border:1px solid #005529}
  th:nth-child(2){text-align:left}
  td{padding:5px 8px;border:1px solid #ddd;text-align:center}
  td:nth-child(2){text-align:left}
  .footer{margin-top:30px;display:flex;justify-content:space-between}
  .sig-col{text-align:center;min-width:140px}
  .sig-line{border-top:1px solid #333;padding-top:4px;font-size:10px;font-weight:600}
  .sig-sub{font-size:9px;color:#666;margin-top:2px}
  @media print{@page{size:A4 landscape;margin:1cm}}
</style>
</head>
<body>
<div class="hdr">
  <div class="inst-name">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div>
  <div class="inst-en">Noor-e-Islam Madrasha, Egarsindur, Bangladesh</div>
  <div class="exam-title">${examName}${classLabel !== 'সকল শ্রেণি' ? ' — ' + classLabel : ''}</div>
  <div class="meta">মুদ্রণের তারিখ: ${today} | মোট শিক্ষার্থী: ${sorted.length} জন</div>
</div>
<div class="stats">
  <div class="stat-item"><div class="stat-val">${sorted.length}</div><div class="stat-lbl">মোট</div></div>
  <div class="stat-item"><div class="stat-val" style="color:#15803d">${passCount}</div><div class="stat-lbl">উত্তীর্ণ</div></div>
  <div class="stat-item"><div class="stat-val" style="color:#dc2626">${sorted.length - passCount}</div><div class="stat-lbl">অনুত্তীর্ণ</div></div>
  <div class="stat-item"><div class="stat-val">${passRate}%</div><div class="stat-lbl">পাশের হার</div></div>
</div>
<table>
  <thead>
    <tr>
      <th>রোল</th><th>নাম</th><th>শ্রেণি</th><th>মোট নম্বর</th><th>শতকরা</th><th>GPA</th><th>গ্রেড</th><th>ফলাফল</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<div class="footer">
  <div class="sig-col"><div class="sig-line">পরীক্ষা নিয়ন্ত্রক</div><div class="sig-sub">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div></div>
  <div class="sig-col"><div class="sig-line">অধ্যক্ষ</div><div class="sig-sub">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div></div>
</div>
<script>window.addEventListener('load',function(){setTimeout(function(){window.print();},400);});<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

interface LiveExam { id: string; name: string; year: string; }
interface MarkSubmission { examId: string; examName: string; year: string; }

export default function AdminResultsPage() {
  const { addNotice } = useNotices();
  const [allResults, setAllResults] = useState<ExamResult[]>([]);
  const [publishedExams, setPublishedExams] = useState<string[]>([]);
  const [examFilter, setExamFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [search, setSearch] = useState('');
  const [liveExams, setLiveExams] = useState<LiveExam[]>([]);
  const [markSubmission, setMarkSubmission] = useState<MarkSubmission | null>(null);
  const [submissionExamId, setSubmissionExamId] = useState('');

  useEffect(() => {
    const stored = loadResultsFromStorage();
    const all = [...EXAM_RESULTS, ...stored];
    setAllResults(all);
    setPublishedExams(getPublished());
    try { setLiveExams(JSON.parse(localStorage.getItem('nim_exams_v1') ?? '[]')); } catch {}
    try { setMarkSubmission(JSON.parse(localStorage.getItem(MARK_SUBMISSION_KEY) ?? 'null')); } catch {}
    const firstExam = [...new Set(all.map(r => r.examName))][0];
    if (firstExam) setExamFilter(firstExam);
  }, []);

  const availableExams = useMemo(() => [...new Set(allResults.map(r => r.examName))], [allResults]);
  const availableClasses = useMemo(() =>
    [...new Set(allResults.filter(r => !examFilter || r.examName === examFilter).map(r => r.class))],
    [allResults, examFilter]
  );

  const filtered = useMemo(() => allResults.filter(r =>
    (!examFilter || r.examName === examFilter) &&
    (!classFilter || r.class === classFilter) &&
    (!search || r.studentName.toLowerCase().includes(search.toLowerCase()) || String(r.roll).includes(search))
  ), [allResults, examFilter, classFilter, search]);

  const passCount = filtered.filter(r => r.status === 'pass').length;
  const passRate = filtered.length > 0 ? Math.round((passCount / filtered.length) * 100) : 0;
  const avgGpa = filtered.length > 0
    ? (filtered.reduce((s, r) => s + r.gpa, 0) / filtered.length).toFixed(2)
    : '0.00';

  const published = !!examFilter && publishedExams.includes(examFilter);

  const togglePublish = () => {
    if (!examFilter) return;
    const isPublishing = !published;
    const next = published
      ? publishedExams.filter(e => e !== examFilter)
      : [...publishedExams, examFilter];
    setPublishedExams(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
    if (isPublishing) {
      const examAll = allResults.filter(r => r.examName === examFilter);
      const pc = examAll.filter(r => r.status === 'pass').length;
      const pr = examAll.length > 0 ? Math.round((pc / examAll.length) * 100) : 0;
      addNotice({
        id: `n${Date.now()}`,
        title: `${examFilter} — ফলাফল প্রকাশিত`,
        content: `${examFilter} পরীক্ষার ফলাফল প্রকাশিত হয়েছে। মোট ${examAll.length} জনের মধ্যে ${pc} জন উত্তীর্ণ (পাশের হার: ${pr}%)। শিক্ষার্থীরা নিজেদের পোর্টাল থেকে ফলাফল দেখতে পারবে।`,
        date: new Date().toISOString().split('T')[0],
        type: 'result', target: 'all', isImportant: true, postedBy: 'Admin',
      });
    }
  };

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

  const classLabel = classFilter
    ? (MADRASHA_CLASSES.find(c => c.id === classFilter)?.nameBn ?? classFilter)
    : 'সকল শ্রেণি';

  return (
    <div>
      <DashboardHeader title="ফলাফল ব্যবস্থাপনা" subtitle="পরীক্ষার ফলাফল পর্যালোচনা ও প্রকাশ" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {/* Exam + Class filter */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={15} className="text-purple-600" /> পরীক্ষা ও শ্রেণি নির্বাচন
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">পরীক্ষার নাম</label>
              <div className="relative">
                <select
                  value={examFilter}
                  onChange={e => { setExamFilter(e.target.value); setClassFilter(''); }}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none pr-8 min-w-[220px]">
                  <option value="">— সব পরীক্ষা —</option>
                  {availableExams.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">শ্রেণি</label>
              <div className="relative">
                <select
                  value={classFilter}
                  onChange={e => setClassFilter(e.target.value)}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none pr-8 min-w-[180px]">
                  <option value="">— সব শ্রেণি —</option>
                  {availableClasses.map(c => (
                    <option key={c} value={c}>{MADRASHA_CLASSES.find(m => m.id === c)?.nameBn ?? c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'মোট শিক্ষার্থী', value: filtered.length, color: 'bg-purple-50 text-purple-700' },
            { label: 'উত্তীর্ণ', value: passCount, color: 'bg-green-50 text-green-700' },
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

        {/* Print / PDF / Publish bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              {examFilter || 'পরীক্ষা নির্বাচন করুন'}
              {classFilter ? ` — ${classLabel}` : ''}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{filtered.length} জন শিক্ষার্থীর ফলাফল</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => printResultSheet(filtered, examFilter || 'ফলাফল', classLabel)}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <Printer size={14} /> প্রিন্ট করুন
            </button>
            <button
              onClick={() => downloadResultsPDF(filtered, examFilter || 'ফলাফল', classLabel)}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 shadow-sm disabled:opacity-40 transition-colors">
              <Download size={14} /> PDF Export
            </button>
            {!published ? (
              <button
                onClick={togglePublish}
                disabled={!examFilter || filtered.length === 0}
                className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40">
                <Award size={15} /> ফলাফল প্রকাশ করুন
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold">
                  <CheckCircle size={15} /> প্রকাশিত
                </span>
                <button onClick={togglePublish}
                  className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-medium">
                  <EyeOff size={14} /> প্রত্যাহার
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="নাম বা রোল খুঁজুন"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
          />
        </div>

        {/* Results table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">
              {allResults.length === 0
                ? 'কোনো ফলাফল সংরক্ষিত নেই। নম্বর প্রবেশ পেজ থেকে ফলাফল যোগ করুন।'
                : 'নির্বাচিত ফিল্টারে কোনো ফলাফল নেই।'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-5 py-3 text-left">রোল</th>
                    <th className="px-5 py-3 text-left">নাম</th>
                    <th className="px-5 py-3 text-center">শ্রেণি</th>
                    <th className="px-5 py-3 text-center">মোট নম্বর</th>
                    <th className="px-5 py-3 text-center">শতকরা</th>
                    <th className="px-5 py-3 text-center">GPA</th>
                    <th className="px-5 py-3 text-center">গ্রেড</th>
                    <th className="px-5 py-3 text-center">ফলাফল</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...filtered].sort((a, b) => a.roll - b.roll).map(r => (
                    <tr key={r.studentId + r.examName + r.year} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-gray-700">{r.roll}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{r.studentName}</td>
                      <td className="px-5 py-3 text-center text-gray-500 text-xs">
                        {MADRASHA_CLASSES.find(c => c.id === r.class)?.nameBn ?? r.class}
                      </td>
                      <td className="px-5 py-3 text-center font-semibold">
                        {r.totalMarks}{r.totalFullMarks ? `/${r.totalFullMarks}` : ''}
                      </td>
                      <td className="px-5 py-3 text-center text-gray-500">
                        {r.percentage != null ? `${r.percentage.toFixed(1)}%` : '—'}
                      </td>
                      <td className="px-5 py-3 text-center font-bold text-purple-700">{r.gpa.toFixed(2)}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getGradeColor(r.grade)}`}>{r.grade}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.status === 'pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
