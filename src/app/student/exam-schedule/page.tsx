'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES } from '@/lib/data';
import { Calendar, Clock, Download, ChevronDown } from 'lucide-react';
import { useStudentSession } from '@/hooks/useStudentSession';
import { printHtml } from '@/lib/print-utils';

const EXAMS_KEY = 'nim_exams_v1';
const ENTRIES_KEY = 'nim_exam_entries_v1';

interface Exam {
  id: string;
  name: string;
  year: string;
}

interface ExamEntry {
  id: string;
  examId: string;
  classIds: string[];
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
}

const SUBJECT_PALETTE = [
  'bg-green-50 border-green-200 text-green-800',
  'bg-blue-50 border-blue-200 text-blue-800',
  'bg-purple-50 border-purple-200 text-purple-800',
  'bg-orange-50 border-orange-200 text-orange-800',
  'bg-teal-50 border-teal-200 text-teal-800',
  'bg-rose-50 border-rose-200 text-rose-800',
  'bg-indigo-50 border-indigo-200 text-indigo-800',
  'bg-amber-50 border-amber-200 text-amber-800',
];

function subjectColor(subject: string) {
  const hash = subject.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return SUBJECT_PALETTE[hash % SUBJECT_PALETTE.length];
}

function formatDateBn(d: string) {
  if (!d) return '—';
  const parts = d.split('-');
  if (parts.length !== 3) return d;
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const m = parseInt(parts[1], 10);
  return `${parts[2]} ${months[m - 1] ?? ''} ${parts[0]}`;
}

function getDayName(d: string) {
  if (!d) return '';
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const parts = d.split('-');
  if (parts.length !== 3) return '';
  const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return days[dt.getDay()] ?? '';
}

const STUDENT_PRINT_CSS = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Arial',sans-serif;color:#111;background:#fff;font-size:11px;line-height:1.5}
  .page{max-width:720px;margin:0 auto;padding:24px 28px}
  .hdr{text-align:center;border-bottom:3px double #1e1b4b;padding-bottom:12px;margin-bottom:14px}
  .hdr-top{font-size:9px;color:#555;letter-spacing:1px;margin-bottom:4px}
  .hdr-name{font-size:21px;font-weight:900;color:#1e1b4b;line-height:1.2}
  .hdr-name-en{font-size:10px;color:#555;margin-top:2px;font-style:italic}
  .hdr-addr{font-size:9.5px;color:#444;margin-top:4px}
  .notice-box{border:2px solid #1e1b4b;border-radius:4px;padding:8px 16px;text-align:center;margin:10px 0 14px;background:#f8f7ff}
  .notice-label{font-size:9px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px}
  .notice-title{font-size:16px;font-weight:bold;color:#1e1b4b}
  .notice-sub{font-size:10px;color:#444;margin-top:3px}
  table{width:100%;border-collapse:collapse;font-size:10.5px}
  thead tr{background:#1e1b4b}
  thead th{color:#fff;padding:6px 10px;border:1px solid #1e1b4b;font-weight:600;text-align:center}
  thead th.left{text-align:left}
  tbody tr:nth-child(even){background:#f5f4ff}
  tbody tr:nth-child(odd){background:#fff}
  td{border:1px solid #c8c6e0;padding:5px 10px;text-align:center;vertical-align:middle}
  td.left{text-align:left;font-weight:600}
  .day-small{font-size:9px;color:#666;display:block}
  .notice-sec{margin-top:16px;padding:8px 12px;border:1px solid #e0d9c0;background:#fffbeb;border-radius:3px;font-size:9.5px;color:#7c5e00}
  .notice-sec b{display:block;margin-bottom:4px;font-size:10px}
  .footer{margin-top:20px;border-top:1px solid #ccc;padding-top:10px}
  .sig-row{display:flex;justify-content:space-between;margin-top:30px}
  .sig-col{text-align:center;min-width:130px}
  .sig-line{border-top:1px solid #333;padding-top:4px;font-size:9.5px;font-weight:600}
  .sig-sub{font-size:8.5px;color:#555;margin-top:2px}
  .issue-date{font-size:9px;color:#666;text-align:right;margin-top:8px}
  @media print{@page{size:A4 portrait;margin:1.2cm}}
`;

function openPrintWindow(examName: string, className: string, year: string, rows: string) {
  const today = new Date();
  const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  const issueDate = `${today.getDate()} ${months[today.getMonth()]}, ${today.getFullYear()}`;
  const fullHtml = `<!DOCTYPE html><html lang="bn"><head>
<meta charset="utf-8"><title>${examName}</title>
<style>${STUDENT_PRINT_CSS}</style>
</head><body><div class="page">
<div class="hdr">
  <div class="hdr-top">প্রতিষ্ঠিত ১৯৭৫</div>
  <div class="hdr-name">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div>
  <div class="hdr-name-en">Noor-e-Islam Madrasha</div>
  <div class="hdr-addr">ঢাকা, বাংলাদেশ | ফোন: ০১৭XX-XXXXXX</div>
</div>
<div class="notice-box">
  <div class="notice-label">পরীক্ষার সময়সূচী</div>
  <div class="notice-title">${examName}</div>
  <div class="notice-sub">${className} &nbsp;|&nbsp; শিক্ষাবর্ষ: ${year}</div>
</div>
<table>
  <thead><tr>
    <th style="width:30px">ক্র.</th>
    <th style="width:120px">তারিখ</th>
    <th class="left">বিষয়</th>
    <th style="width:110px">সময়</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="notice-sec">
  <b>গুরুত্বপূর্ণ নির্দেশনা:</b>
  • পরীক্ষার ৩০ মিনিট আগে পরীক্ষার হলে উপস্থিত থাকতে হবে।
  &nbsp;&nbsp;• বৈধ প্রবেশপত্র ছাড়া প্রবেশ নিষেধ।
  &nbsp;&nbsp;• মোবাইল ফোন ও ইলেকট্রনিক ডিভাইস নিষিদ্ধ।
  &nbsp;&nbsp;• সময়সূচী পরিবর্তনের ক্ষমতা কর্তৃপক্ষ সংরক্ষণ করেন।
</div>
<div class="footer">
  <div class="sig-row">
    <div class="sig-col">
      <div class="sig-line">পরীক্ষা নিয়ন্ত্রক</div>
      <div class="sig-sub">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div>
    </div>
    <div class="sig-col">
      <div class="sig-line">অধ্যক্ষ</div>
      <div class="sig-sub">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div>
    </div>
  </div>
  <div class="issue-date">প্রকাশের তারিখ: ${issueDate}</div>
</div>
</div>
</body></html>`;
  printHtml(fullHtml);
}

export default function StudentExamSchedulePage() {
  const { student, loading } = useStudentSession();
  const [exams, setExams] = useState<Exam[]>([]);
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const classInfo = MADRASHA_CLASSES.find(c => c.id === (student?.class ?? ''));

  useEffect(() => {
    try {
      const e = localStorage.getItem(EXAMS_KEY);
      if (e) { const parsed = JSON.parse(e); setExams(parsed); if (parsed.length > 0) setSelectedExamId(parsed[0].id); }
      const en = localStorage.getItem(ENTRIES_KEY);
      if (en) setEntries(JSON.parse(en));
    } catch {}
  }, []);

  const selectedExam = exams.find(e => e.id === selectedExamId);
  const myEntries = entries
    .filter(e => e.examId === selectedExamId && e.classIds.includes(student?.class ?? ''))
    .sort((a, b) => a.date.localeCompare(b.date));

  const printSchedule = () => {
    if (!selectedExam) return;
    const rows = myEntries.map((e, i) =>
      `<tr>
        <td>${i + 1}</td>
        <td>${formatDateBn(e.date)}<span class="day-small">${getDayName(e.date)}</span></td>
        <td class="left">${e.subject}</td>
        <td>${e.startTime} — ${e.endTime}</td>
      </tr>`
    ).join('');
    openPrintWindow(
      selectedExam.name,
      classInfo?.nameBn ?? (student?.class ?? ''),
      selectedExam.year,
      rows
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = student?.name ?? 'শিক্ষার্থী';

  if (exams.length === 0 || myEntries.length === 0) {
    return (
      <div>
        <DashboardHeader title="পরীক্ষার সময়সূচী" subtitle="আপনার পরীক্ষার তারিখ ও সময়" userName={displayName} role="ছাত্র" />
        <div className="p-6">
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
            <Calendar size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium text-gray-500">পরীক্ষার সময়সূচী এখনো প্রকাশিত হয়নি</p>
            <p className="text-xs mt-1 text-gray-400">অ্যাডমিন সময়সূচী তৈরি করলে এখানে দেখা যাবে।</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="পরীক্ষার সময়সূচী" subtitle="আপনার পরীক্ষার তারিখ ও সময়" userName={displayName} role="ছাত্র" />
      <div className="p-6 space-y-5">

        {/* Exam selector + header */}
        <div className="gradient-primary text-white rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Exam selector */}
              {exams.length > 1 && (
                <div className="relative inline-block mb-2">
                  <button onClick={() => setShowSelector(v => !v)}
                    className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg font-medium transition-colors">
                    পরীক্ষা বেছে নিন <ChevronDown size={12} />
                  </button>
                  {showSelector && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-20 min-w-[200px] overflow-hidden">
                      {exams.map(exam => (
                        <button key={exam.id}
                          onClick={() => { setSelectedExamId(exam.id); setShowSelector(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedExamId === exam.id ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                          {exam.name}
                          <span className="text-xs text-gray-400 ml-2">{exam.year}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <h2 className="text-lg font-bold leading-tight">{selectedExam?.name}</h2>
              <p className="text-purple-200 text-sm mt-1">{classInfo?.nameBn} | {selectedExam?.year}</p>
              <p className="text-purple-300 text-xs mt-0.5">{myEntries.length}টি বিষয়</p>
            </div>
            <button onClick={printSchedule}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl px-3 py-2 text-xs font-medium transition-colors shrink-0">
              <Download size={13} /> PDF
            </button>
          </div>
        </div>

        {/* Schedule cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {myEntries.map((e, i) => (
            <div key={e.id} className={`bg-white rounded-2xl p-4 border hover:shadow-md transition-all ${subjectColor(e.subject)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs gradient-primary`}>
                  {i + 1}
                </div>
                <span className="text-[10px] font-semibold opacity-60">{getDayName(e.date)}</span>
              </div>
              <h3 className="font-bold text-base leading-tight mb-2">{e.subject}</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <Calendar size={11} />
                  <span>{formatDateBn(e.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <Clock size={11} />
                  <span>{e.startTime} — {e.endTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table view */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">সম্পূর্ণ তালিকা</h3>
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-purple-50">
                <th className="px-4 py-3 text-left text-gray-500 font-semibold w-10">ক্র.</th>
                <th className="px-4 py-3 text-center text-gray-600 font-semibold">তারিখ</th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">বিষয়</th>
                <th className="px-4 py-3 text-center text-gray-600 font-semibold">সময়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myEntries.map((e, i) => (
                <tr key={e.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="font-medium text-gray-700">{formatDateBn(e.date)}</div>
                    <div className="text-[10px] text-gray-400">{getDayName(e.date)}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{e.subject}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{e.startTime} — {e.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h3 className="font-semibold text-amber-800 text-sm mb-2">গুরুত্বপূর্ণ নির্দেশনা</h3>
          <ul className="space-y-1 text-xs text-amber-700">
            <li>• পরীক্ষার ৩০ মিনিট আগে পরীক্ষার হলে উপস্থিত থাকতে হবে।</li>
            <li>• বৈধ প্রবেশপত্র ছাড়া পরীক্ষার হলে প্রবেশ নিষেধ।</li>
            <li>• মোবাইল ফোন ও ইলেকট্রনিক ডিভাইস নিষিদ্ধ।</li>
            <li>• পরীক্ষার সময়সূচী পরিবর্তনের ক্ষমতা কর্তৃপক্ষের রয়েছে।</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
