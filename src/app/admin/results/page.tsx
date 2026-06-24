'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { EXAM_RESULTS, MADRASHA_CLASSES, COLLEGE_INFO } from '@/lib/data';
import { loadResultsFromStorage } from '@/lib/result-utils';
import type { ExamResult } from '@/lib/types';
import { Award, CheckCircle, Download, Printer, Search, EyeOff, Lock, Unlock, ChevronDown, BarChart3 } from 'lucide-react';
import { useNotices } from '@/context/NoticesContext';

const LS_KEY = 'published_results_v1';
const MARK_SUBMISSION_KEY = 'nim_mark_submission_v1';

function getPublished(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); } catch { return []; }
}

function gradeChip(grade: string) {
  if (grade === 'A+') return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
  if (grade.startsWith('A')) return 'text-blue-700 bg-blue-50 border border-blue-200';
  if (grade === 'B') return 'text-amber-700 bg-amber-50 border border-amber-200';
  if (grade === 'C' || grade === 'D') return 'text-orange-700 bg-orange-50 border border-orange-200';
  return 'text-red-700 bg-red-50 border border-red-200';
}

// ─── Helper: pack roll entries into wrapped lines ─────────────────
function packEntries(entries: string[], maxChars: number): string[][] {
  const lines: string[][] = [];
  let cur: string[] = [];
  let len = 0;
  for (const e of entries) {
    const add = (cur.length > 0 ? 2 : 0) + e.length;
    if (cur.length > 0 && len + add > maxChars) {
      lines.push(cur);
      cur = [e];
      len = e.length;
    } else {
      cur.push(e);
      len += add;
    }
  }
  if (cur.length > 0) lines.push(cur);
  return lines;
}

// ─── Board-style PDF ──────────────────────────────────────────────
async function downloadBoardStylePDF(results: ExamResult[], examName: string) {
  if (results.length === 0) return;
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210, PH = 297;
  const ML = 12, MR = 12, MT = 16, MB = 14;
  const UW = PW - ML - MR;
  const FS = 7.5, LH = 4.4;

  doc.setFont('courier', 'normal');
  doc.setFontSize(FS);

  const CW = doc.getStringUnitWidth('M') * FS / doc.internal.scaleFactor;
  const CPL = Math.floor(UW / CW);

  const sorted = [...results].sort((a, b) => a.roll - b.roll);
  const passCount = sorted.filter(r => r.status === 'pass').length;
  const failCount = sorted.length - passCount;
  const gpa5Count = sorted.filter(r => r.gpa >= 5.0).length;
  const passRate = sorted.length > 0 ? ((passCount / sorted.length) * 100).toFixed(2) : '0.00';
  const today = new Date();
  const dateCode = `D${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

  const classOrder = [...new Set(sorted.map(r => r.class))];
  const byClass: Record<string, ExamResult[]> = {};
  sorted.forEach(r => { (byClass[r.class] ??= []).push(r); });

  let y = MT;

  function ensureSpace(linesNeeded = 1) {
    if (y + LH * linesNeeded > PH - MB) { doc.addPage(); y = MT; }
  }

  function writeLine(text: string, bold = false, center = false) {
    ensureSpace();
    doc.setFont('courier', bold ? 'bold' : 'normal');
    doc.setFontSize(FS);
    if (center) {
      const tw = doc.getStringUnitWidth(text) * FS / doc.internal.scaleFactor;
      doc.text(text, ML + (UW - tw) / 2, y);
    } else {
      doc.text(text, ML, y);
    }
    y += LH;
  }

  function divider(label?: string) {
    if (!label) return '-'.repeat(CPL);
    const inner = ` : ${label} : `;
    const side = Math.max(2, Math.floor((CPL - inner.length) / 2));
    return '-'.repeat(side) + inner + '-'.repeat(Math.max(2, CPL - side - inner.length));
  }

  // Header
  writeLine('BANGLADESH MADRASHA EDUCATION BOARD', true, true);
  writeLine(`RESULT OF ${examName.toUpperCase()}`, true, true);
  y += LH * 0.5;
  writeLine(`Institution: ${COLLEGE_INFO.name} (EIIN: ${COLLEGE_INFO.eiin})`);
  writeLine(`Address: ${COLLEGE_INFO.address}`);
  writeLine(`No. of Students: { Examinee: ${sorted.length}, Passed: ${passCount}, Failed: ${failCount}, Percentage of Pass: ${passRate}, GPA 5: ${gpa5Count} }`);
  writeLine(divider());

  // Class sections
  for (const classId of classOrder) {
    const cr = byClass[classId];
    const clsLabel = (MADRASHA_CLASSES.find(c => c.id === classId)?.name ?? classId).toUpperCase();
    const passed = cr.filter(r => r.status === 'pass');
    const failed = cr.filter(r => r.status !== 'pass');

    ensureSpace(4);
    writeLine(divider(clsLabel));

    if (passed.length > 0) {
      const entries = passed.map(r => `${r.roll}[${r.gpa.toFixed(2)}]`);
      const packed = packEntries(entries, CPL - 6);
      packed.forEach((items, idx) => {
        writeLine(items.join(', ') + (idx === packed.length - 1 ? ` =${passed.length}` : ''));
      });
    }

    if (failed.length > 0) {
      const entries = failed.map(r => {
        const fc = r.failedSubjects?.length ?? r.subjects?.filter(s => !s.isPassed).length ?? 1;
        return `${r.roll}[F${fc || 1}]`;
      });
      const packed = packEntries(entries, CPL - 6);
      packed.forEach((items, idx) => {
        writeLine(items.join(', ') + (idx === packed.length - 1 ? ` =${failed.length}` : ''));
      });
    }
  }

  writeLine(divider(`END OF RESULT [ ${dateCode} ]`));

  // Page numbers + footer on every page
  const totalPages = (doc as unknown as { internal: { getNumberOfPages(): number } }).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('courier', 'normal');
    doc.setFontSize(FS);
    const pgStr = `Page ${p} of ${totalPages}`;
    const tw = doc.getStringUnitWidth(pgStr) * FS / doc.internal.scaleFactor;
    doc.text(pgStr, ML + (UW - tw) / 2, MT - 5);
    doc.setFontSize(6.5);
    doc.text(`${COLLEGE_INFO.name} | EIIN: ${COLLEGE_INFO.eiin} | Confidential`, ML, PH - 6);
    doc.text(today.toLocaleDateString('en-GB'), PW - MR, PH - 6, { align: 'right' });
  }

  doc.save(`board-result-${examName.replace(/\s+/g, '-')}.pdf`);
}

// ─── Print ─────────────────────────────────────────────────────────────────────
function printResultSheet(results: ExamResult[], examName: string, classLabel: string) {
  if (results.length === 0) return;
  const sorted = [...results].sort((a, b) => a.roll - b.roll);
  const passCount = sorted.filter(r => r.status === 'pass').length;
  const passRate = sorted.length > 0 ? Math.round((passCount / sorted.length) * 100) : 0;
  const today = new Date().toLocaleDateString('bn-BD');

  const rows = sorted.map((r, i) => {
    const cn = MADRASHA_CLASSES.find(c => c.id === r.class)?.nameBn ?? r.class;
    const sc = r.status === 'pass' ? '#15803d' : '#dc2626';
    const total = r.totalFullMarks ? `${r.totalMarks}/${r.totalFullMarks}` : String(r.totalMarks);
    return `<tr style="background:${i % 2 === 0 ? '#fff' : '#f0f8f4'}">
      <td style="text-align:center">${i + 1}</td>
      <td style="text-align:center">${r.roll}</td>
      <td>${r.studentName}</td>
      <td style="text-align:center">${cn}</td>
      <td style="text-align:center">${total}</td>
      <td style="text-align:center">${r.percentage != null ? r.percentage.toFixed(1) + '%' : '—'}</td>
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
  body{font-family:Arial,sans-serif;padding:20px 24px;font-size:11px;color:#111}
  .hdr{text-align:center;border-bottom:3px double #006633;padding-bottom:10px;margin-bottom:12px}
  .inst-name{font-size:18px;font-weight:900;color:#006633}
  .inst-en{font-size:9.5px;color:#555;margin-top:2px}
  .inst-addr{font-size:9px;color:#777;margin-top:2px}
  .exam-title{font-size:13px;font-weight:bold;color:#111;margin:8px 0 3px;text-decoration:underline;text-decoration-color:#006633}
  .meta{font-size:9.5px;color:#555}
  .stats{display:flex;gap:12px;margin:10px 0 14px;flex-wrap:wrap}
  .stat{background:#f0f8f4;border:1px solid #c6e8d6;border-radius:4px;padding:5px 14px;text-align:center;min-width:80px}
  .sv{font-size:15px;font-weight:700;color:#006633}
  .sl{font-size:8.5px;color:#555;margin-top:1px}
  table{width:100%;border-collapse:collapse;font-size:10px}
  th{background:#006633;color:#fff;padding:5px 7px;border:1px solid #004d26}
  td{padding:4px 7px;border:1px solid #ddd}
  td:nth-child(3){text-align:left}
  .footer{margin-top:28px;display:flex;justify-content:space-between;align-items:flex-end}
  .sig{text-align:center;min-width:140px}
  .sig-line{border-top:1px solid #333;padding-top:4px;font-size:10px;font-weight:600}
  .sig-sub{font-size:8.5px;color:#666;margin-top:1px}
  .watermark{text-align:center;margin-top:10px;font-size:9px;color:#bbb;border-top:1px dashed #ddd;padding-top:6px}
  @media print{@page{size:A4 portrait;margin:1.2cm}}
</style>
</head>
<body>
<div class="hdr">
  <div class="inst-name">${COLLEGE_INFO.nameBn}</div>
  <div class="inst-en">${COLLEGE_INFO.name}</div>
  <div class="inst-addr">${COLLEGE_INFO.address} | EIIN: ${COLLEGE_INFO.eiin}</div>
  <div class="exam-title">${examName}${classLabel !== 'সকল শ্রেণি' ? ' — ' + classLabel : ''}</div>
  <div class="meta">মুদ্রণের তারিখ: ${today} | শিক্ষাবর্ষ: ${new Date().getFullYear()}</div>
</div>
<div class="stats">
  <div class="stat"><div class="sv">${sorted.length}</div><div class="sl">মোট শিক্ষার্থী</div></div>
  <div class="stat"><div class="sv" style="color:#15803d">${passCount}</div><div class="sl">উত্তীর্ণ</div></div>
  <div class="stat"><div class="sv" style="color:#dc2626">${sorted.length - passCount}</div><div class="sl">অনুত্তীর্ণ</div></div>
  <div class="stat"><div class="sv">${passRate}%</div><div class="sl">পাশের হার</div></div>
</div>
<table>
  <thead><tr>
    <th style="width:28px">ক্র.</th>
    <th style="width:36px">রোল</th>
    <th>শিক্ষার্থীর নাম</th>
    <th>শ্রেণি</th>
    <th>মোট নম্বর</th>
    <th>শতকরা</th>
    <th>GPA</th>
    <th>গ্রেড</th>
    <th>ফলাফল</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="footer">
  <div class="sig"><div class="sig-line">পরীক্ষা নিয়ন্ত্রক</div><div class="sig-sub">${COLLEGE_INFO.nameBn}</div></div>
  <div class="sig"><div class="sig-line">প্রধান শিক্ষক / অধ্যক্ষ</div><div class="sig-sub">${COLLEGE_INFO.nameBn}</div></div>
</div>
<div class="watermark">${COLLEGE_INFO.name} | এই ফলাফল শুধুমাত্র অভ্যন্তরীণ ব্যবহারের জন্য</div>
<script>window.addEventListener('load',function(){setTimeout(function(){window.print();},400);});<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ─── Types ─────────────────────────────────────────────────────────────────────
interface LiveExam { id: string; name: string; year: string; }
interface MarkSubmission { examId: string; examName: string; year: string; }

// ─── Class-wise result table ───────────────────────────────────────────────────
function ClassGroup({ classId, results }: { classId: string; results: ExamResult[] }) {
  const [open, setOpen] = useState(true);
  const cn = MADRASHA_CLASSES.find(c => c.id === classId)?.nameBn ?? classId;
  const pass = results.filter(r => r.status === 'pass').length;
  const rate = results.length > 0 ? Math.round((pass / results.length) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ChevronDown size={15} className={`text-[#006633] transition-transform ${open ? '' : '-rotate-90'}`} />
          <span className="font-semibold text-gray-900">{cn}</span>
          <div className="flex gap-2 text-xs">
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{results.length} জন</span>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">উত্তীর্ণ {pass}</span>
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{rate}%</span>
          </div>
        </div>
      </button>
      {open && (
        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-4 py-2.5 text-center w-10">ক্র.</th>
                <th className="px-4 py-2.5 text-center">রোল</th>
                <th className="px-4 py-2.5 text-left">নাম</th>
                <th className="px-4 py-2.5 text-center">মোট</th>
                <th className="px-4 py-2.5 text-center">%</th>
                <th className="px-4 py-2.5 text-center">GPA</th>
                <th className="px-4 py-2.5 text-center">গ্রেড</th>
                <th className="px-4 py-2.5 text-center">ফলাফল</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...results].sort((a, b) => a.roll - b.roll).map((r, i) => (
                <tr key={r.studentId + r.examName + r.year} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 text-center text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-2.5 text-center font-semibold text-gray-700">{r.roll}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.studentName}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700 font-medium">
                    {r.totalMarks}{r.totalFullMarks ? `/${r.totalFullMarks}` : ''}
                  </td>
                  <td className="px-4 py-2.5 text-center text-gray-500 text-xs">
                    {r.percentage != null ? `${r.percentage.toFixed(1)}%` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-center font-bold text-[#006633]">{r.gpa.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${gradeChip(r.grade)}`}>{r.grade}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
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
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
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
    : '—';

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

  // Class-wise grouping (when no class filter and no search)
  const showGrouped = !classFilter && !search;
  const groupedByClass = useMemo(() => {
    if (!showGrouped) return null;
    const groups: Record<string, ExamResult[]> = {};
    filtered.forEach(r => {
      if (!groups[r.class]) groups[r.class] = [];
      groups[r.class].push(r);
    });
    return groups;
  }, [filtered, showGrouped]);

  return (
    <div>
      <DashboardHeader
        title="ফলাফল ব্যবস্থাপনা"
        subtitle="পরীক্ষার ফলাফল পর্যালোচনা, প্রকাশ ও প্রিন্ট"
        userName="Admin"
        role="Super Admin"
      />
      <div className="p-6 space-y-5">

        {/* ── Exam + Class filter ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">পরীক্ষার নাম</label>
              <div className="relative">
                <select
                  value={examFilter}
                  onChange={e => { setExamFilter(e.target.value); setClassFilter(''); setSearch(''); }}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#006633] appearance-none pr-8 min-w-[230px]">
                  <option value="">— সব পরীক্ষা —</option>
                  {availableExams.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">শ্রেণি</label>
              <div className="relative">
                <select
                  value={classFilter}
                  onChange={e => { setClassFilter(e.target.value); setSearch(''); }}
                  className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#006633] appearance-none pr-8 min-w-[180px]">
                  <option value="">— সব শ্রেণি —</option>
                  {availableClasses.map(c => (
                    <option key={c} value={c}>{MADRASHA_CLASSES.find(m => m.id === c)?.nameBn ?? c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Search only when a class is selected */}
            {classFilter && (
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">খুঁজুন</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="নাম বা রোল…"
                    className="pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#006633] w-44"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'মোট শিক্ষার্থী', value: filtered.length, sub: examFilter ? examFilter : 'সব পরীক্ষা', color: 'bg-[#006633]' },
            { label: 'উত্তীর্ণ', value: passCount, sub: `${passRate}% পাশের হার`, color: 'bg-emerald-500' },
            { label: 'অনুত্তীর্ণ', value: filtered.length - passCount, sub: `${filtered.length > 0 ? 100 - passRate : 0}%`, color: 'bg-rose-500' },
            { label: 'গড় GPA', value: avgGpa, sub: 'সকল শিক্ষার্থী', color: 'bg-amber-500' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                <BarChart3 size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[120px]">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Mark submission control ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                <Lock size={14} className="text-blue-500" /> শিক্ষক মার্ক সাবমিশন নিয়ন্ত্রণ
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">শিক্ষকরা কোন পরীক্ষার মার্ক দিতে পারবেন তা নিয়ন্ত্রণ করুন</p>
            </div>
            {markSubmission ? (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-xs font-medium border border-green-200">
                  <CheckCircle size={12} /> {markSubmission.examName} ({markSubmission.year}) — খোলা আছে
                </span>
                <button onClick={closeMarkSubmission}
                  className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-medium transition-colors">
                  <Lock size={12} /> বন্ধ করুন
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {liveExams.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">পরীক্ষার সময়সূচী থেকে আগে পরীক্ষা তৈরি করুন।</p>
                ) : (
                  <>
                    <select value={submissionExamId} onChange={e => setSubmissionExamId(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#006633]">
                      <option value="">-- পরীক্ষা বেছে নিন --</option>
                      {liveExams.map(e => <option key={e.id} value={e.id}>{e.name} ({e.year})</option>)}
                    </select>
                    <button onClick={openMarkSubmission} disabled={!submissionExamId}
                      className="flex items-center gap-1.5 bg-[#006633] text-white px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-[#004d26] transition-colors">
                      <Unlock size={12} /> খুলুন
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {examFilter || 'পরীক্ষা নির্বাচন করুন'}
              {classFilter ? ` — ${classLabel}` : ''}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {filtered.length} জন শিক্ষার্থী
              {published ? ' • প্রকাশিত' : ' • অপ্রকাশিত'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => printResultSheet(filtered, examFilter || 'ফলাফল', classLabel)}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <Printer size={13} /> প্রিন্ট
            </button>
            <button
              onClick={() => downloadBoardStylePDF(filtered, examFilter || 'ফলাফল')}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-emerald-700 shadow-sm disabled:opacity-40 transition-colors">
              <Download size={13} /> বোর্ড PDF
            </button>
            {!published ? (
              <button
                onClick={togglePublish}
                disabled={!examFilter || allResults.filter(r => r.examName === examFilter).length === 0}
                className="flex items-center gap-2 bg-[#006633] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#004d26] disabled:opacity-40 transition-colors shadow-sm">
                <Award size={13} /> বোর্ডে প্রকাশ করুন
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-2 rounded-xl text-xs font-semibold border border-green-200">
                  <CheckCircle size={13} /> প্রকাশিত
                </span>
                <button onClick={togglePublish}
                  className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl text-xs font-medium transition-colors">
                  <EyeOff size={12} /> প্রত্যাহার
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Results ── */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <BarChart3 size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {allResults.length === 0
                ? 'কোনো ফলাফল নেই। নম্বর প্রবেশ পেজ থেকে ফলাফল যোগ করুন।'
                : 'এই ফিল্টারে কোনো ফলাফল নেই।'}
            </p>
          </div>
        ) : showGrouped && groupedByClass ? (
          // Class-wise grouped view
          <div className="space-y-3">
            {availableClasses.map(cls => groupedByClass[cls] && (
              <ClassGroup key={cls} classId={cls} results={groupedByClass[cls]} />
            ))}
          </div>
        ) : (
          // Single table (when class filter or search is active)
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-center w-10">ক্র.</th>
                    <th className="px-4 py-3 text-center">রোল</th>
                    <th className="px-4 py-3 text-left">নাম</th>
                    <th className="px-4 py-3 text-center">শ্রেণি</th>
                    <th className="px-4 py-3 text-center">মোট</th>
                    <th className="px-4 py-3 text-center">%</th>
                    <th className="px-4 py-3 text-center">GPA</th>
                    <th className="px-4 py-3 text-center">গ্রেড</th>
                    <th className="px-4 py-3 text-center">ফলাফল</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...filtered].sort((a, b) => a.roll - b.roll).map((r, i) => (
                    <tr key={r.studentId + r.examName + r.year} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-center text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-700">{r.roll}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{r.studentName}</td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">
                        {MADRASHA_CLASSES.find(c => c.id === r.class)?.nameBn ?? r.class}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-gray-700">
                        {r.totalMarks}{r.totalFullMarks ? `/${r.totalFullMarks}` : ''}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-500">
                        {r.percentage != null ? `${r.percentage.toFixed(1)}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-[#006633]">{r.gpa.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${gradeChip(r.grade)}`}>{r.grade}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.status === 'pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
                        </span>
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
