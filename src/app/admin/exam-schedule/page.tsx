'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES } from '@/lib/data';
import { Plus, Trash2, Download, X, Calendar, Edit2, Bell, CheckCircle } from 'lucide-react';
import { useNotices } from '@/context/NoticesContext';

const EXAMS_KEY = 'nim_exams_v1';
const ENTRIES_KEY = 'nim_exam_entries_v1';

const CLASS_SHORT: Record<string, string> = {
  'class-1': '১ম', 'class-2': '২য়', 'class-3': '৩য়', 'class-4': '৪র্থ',
  'class-5': '৫ম', 'class-6': '৬ষ্ঠ', 'class-7': '৭ম', 'class-8': '৮ম',
  'class-9': '৯ম', 'class-10': '১০ম', 'class-alim-1': 'আলিম-১', 'class-alim-2': 'আলিম-২',
};

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

function formatDate(d: string) {
  if (!d) return '—';
  const parts = d.split('-');
  if (parts.length !== 3) return d;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatDateBn(d: string) {
  if (!d) return '—';
  const parts = d.split('-');
  if (parts.length !== 3) return d;
  const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  const m = parseInt(parts[1], 10);
  return `${parts[2]} ${months[m - 1] ?? ''}, ${parts[0]}`;
}

function getDayBn(d: string) {
  if (!d) return '';
  const days = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবار'];
  // Use local date parsing to avoid timezone issues
  const parts = d.split('-');
  if (parts.length !== 3) return '';
  const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return days[dt.getDay()] ?? '';
}

const PRINT_CSS = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Arial',sans-serif;color:#111;background:#fff;font-size:11px;line-height:1.5}
  .page{max-width:780px;margin:0 auto;padding:24px 28px}
  /* Header */
  .hdr{text-align:center;border-bottom:3px double #1e1b4b;padding-bottom:12px;margin-bottom:14px}
  .hdr-top{font-size:9px;color:#555;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px}
  .hdr-name{font-size:22px;font-weight:900;color:#1e1b4b;line-height:1.2}
  .hdr-name-en{font-size:10px;color:#555;margin-top:2px;font-style:italic}
  .hdr-addr{font-size:9.5px;color:#444;margin-top:4px}
  .hdr-divider{height:1px;background:#1e1b4b;margin:8px 0 6px}
  /* Notice title box */
  .notice-box{border:2px solid #1e1b4b;border-radius:4px;padding:8px 16px;text-align:center;margin:10px 0 14px;background:#f8f7ff}
  .notice-label{font-size:9px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px}
  .notice-title{font-size:16px;font-weight:bold;color:#1e1b4b}
  .notice-sub{font-size:10px;color:#444;margin-top:3px}
  /* Class section */
  .cls-hdr{display:flex;align-items:center;gap:8px;margin:16px 0 6px;padding:5px 10px;background:#1e1b4b;color:#fff;border-radius:3px}
  .cls-hdr-name{font-size:12px;font-weight:bold}
  .cls-hdr-count{font-size:9px;opacity:.75;margin-left:auto}
  /* Table */
  table{width:100%;border-collapse:collapse;font-size:10.5px;margin-bottom:6px}
  thead tr{background:#1e1b4b}
  thead th{color:#fff;padding:6px 8px;border:1px solid #1e1b4b;font-weight:600;text-align:center}
  thead th.left{text-align:left}
  tbody tr:nth-child(even){background:#f5f4ff}
  tbody tr:nth-child(odd){background:#fff}
  td{border:1px solid #c8c6e0;padding:5px 8px;text-align:center;vertical-align:middle}
  td.left{text-align:left;font-weight:600}
  td.date-cell{line-height:1.3}
  td.day{font-size:9px;color:#555;display:block}
  /* Footer */
  .footer{margin-top:28px;border-top:1px solid #ccc;padding-top:14px}
  .sig-row{display:flex;justify-content:space-between;margin-top:36px}
  .sig-col{text-align:center;min-width:140px}
  .sig-line{border-top:1px solid #333;padding-top:4px;font-size:9.5px;font-weight:600;color:#222}
  .sig-sub{font-size:8.5px;color:#555;margin-top:2px}
  .notice-sec{margin-top:14px;padding:8px 12px;border:1px solid #e0d9c0;background:#fffbeb;border-radius:3px;font-size:9.5px;color:#7c5e00}
  .notice-sec b{display:block;margin-bottom:4px;font-size:10px}
  .issue-date{font-size:9px;color:#666;text-align:right;margin-top:8px}
  @media print{
    @page{size:A4 portrait;margin:1.2cm}
    body{font-size:10.5px}
    .hdr-name{font-size:20px}
    .cls-hdr{margin-top:10px}
  }
`;

function buildPrintPage(headerHtml: string, bodyHtml: string) {
  const today = new Date();
  const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  const issueDate = `${today.getDate()} ${months[today.getMonth()]}, ${today.getFullYear()}`;
  return `<!DOCTYPE html><html lang="bn"><head>
<meta charset="utf-8"><title>পরীক্ষার সময়সূচী</title>
<style>${PRINT_CSS}</style>
</head><body><div class="page">
<div class="hdr">
  <div class="hdr-top">প্রতিষ্ঠিত ১৯৭৫</div>
  <div class="hdr-name">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div>
  <div class="hdr-name-en">Noor-e-Islam Madrasha</div>
  <div class="hdr-addr">ঢাকা, বাংলাদেশ | ফোন: ০১৭XX-XXXXXX</div>
</div>
${headerHtml}
${bodyHtml}
<div class="footer">
  <div class="notice-sec">
    <b>গুরুত্বপূর্ণ নির্দেশনা:</b>
    • পরীক্ষার ৩০ মিনিট আগে পরীক্ষার হলে উপস্থিত থাকতে হবে।
    &nbsp;&nbsp;• বৈধ প্রবেশপত্র ছাড়া পরীক্ষার হলে প্রবেশ নিষেধ।
    &nbsp;&nbsp;• মোবাইল ফোন ও যেকোনো ইলেকট্রনিক ডিভাইস সম্পূর্ণ নিষিদ্ধ।
    &nbsp;&nbsp;• সময়সূচী পরিবর্তনের ক্ষমতা কর্তৃপক্ষ সংরক্ষণ করেন।
  </div>
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
<script>window.addEventListener('load', function() { setTimeout(function() { window.print(); }, 400); });<\/script>
</body></html>`;
}

function openPrintWindow(_title: string, html: string) {
  const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export default function AdminExamSchedulePage() {
  const { addNotice } = useNotices();
  const [exams, setExams] = useState<Exam[]>([]);
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [scheduleNoticePublished, setScheduleNoticePublished] = useState<string | null>(null);

  const [showExamForm, setShowExamForm] = useState(false);
  const [examForm, setExamForm] = useState({ name: '', year: '২০২৪-২৫' });

  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editEntryId, setEditEntryId] = useState<string | null>(null);
  const [entryForm, setEntryForm] = useState({
    subject: '', date: '', startTime: '10:00', endTime: '13:00', classIds: [] as string[],
  });

  useEffect(() => {
    try {
      const e = localStorage.getItem(EXAMS_KEY);
      if (e) { const parsed = JSON.parse(e); setExams(parsed); if (parsed.length > 0) setSelectedExamId(parsed[0].id); }
      const en = localStorage.getItem(ENTRIES_KEY);
      if (en) setEntries(JSON.parse(en));
    } catch {}
  }, []);

  const saveExams = (data: Exam[]) => { setExams(data); localStorage.setItem(EXAMS_KEY, JSON.stringify(data)); };
  const saveEntries = (data: ExamEntry[]) => { setEntries(data); localStorage.setItem(ENTRIES_KEY, JSON.stringify(data)); };

  const addExam = () => {
    if (!examForm.name.trim()) return;
    const exam: Exam = { id: `exam_${Date.now()}`, name: examForm.name.trim(), year: examForm.year.trim() };
    const next = [...exams, exam];
    saveExams(next);
    setSelectedExamId(exam.id);
    setShowExamForm(false);
    setExamForm({ name: '', year: '২০২৪-২৫' });
    // Auto-notice for new exam
    addNotice({
      id: `n${Date.now()}`,
      title: `নতুন পরীক্ষার সময়সূচী: ${exam.name}`,
      content: `${exam.name} (শিক্ষাবর্ষ: ${exam.year}) পরীক্ষার সময়সূচী তৈরি শুরু হয়েছে। বিস্তারিত সময়সূচী শীঘ্রই প্রকাশিত হবে।`,
      date: new Date().toISOString().split('T')[0],
      type: 'exam', target: 'all', isImportant: false, postedBy: 'Admin',
    });
    // Auto-generate admit cards for all classes
    try {
      const existing: { examId?: string }[] = JSON.parse(localStorage.getItem('admit_cards_store') ?? '[]');
      const today = new Date().toISOString().split('T')[0];
      const newCards = MADRASHA_CLASSES.map(cls => ({
        id: `ac_${exam.id}_${cls.id}`,
        examId: exam.id,
        examName: exam.name,
        examYear: exam.year,
        class: cls.id,
        requiredFeeTypes: [],
        issued: false,
        createdAt: today,
        specialRecommendations: [],
      }));
      localStorage.setItem('admit_cards_store', JSON.stringify([...newCards, ...existing]));
    } catch {}
  };

  const deleteExam = (id: string) => {
    const next = exams.filter(e => e.id !== id);
    saveExams(next);
    saveEntries(entries.filter(e => e.examId !== id));
    setSelectedExamId(next[0]?.id ?? null);
    // Cleanup related data
    try {
      const cards = JSON.parse(localStorage.getItem('admit_cards_store') ?? '[]');
      localStorage.setItem('admit_cards_store', JSON.stringify(cards.filter((c: { examId?: string }) => c.examId !== id)));
      const hallsData: { id: string; examId: string }[] = JSON.parse(localStorage.getItem('nim_halls_v1') ?? '[]');
      localStorage.setItem('nim_halls_v1', JSON.stringify(hallsData.filter(h => h.examId !== id)));
      const seatsData: { examId: string }[] = JSON.parse(localStorage.getItem('nim_seats_v1') ?? '[]');
      localStorage.setItem('nim_seats_v1', JSON.stringify(seatsData.filter(s => s.examId !== id)));
      const guardsData: { examId: string }[] = JSON.parse(localStorage.getItem('nim_guard_assignments_v1') ?? '[]');
      localStorage.setItem('nim_guard_assignments_v1', JSON.stringify(guardsData.filter(g => g.examId !== id)));
    } catch {}
  };

  const openAddEntry = () => {
    setEditEntryId(null);
    setEntryForm({ subject: '', date: '', startTime: '10:00', endTime: '13:00', classIds: [] });
    setShowEntryModal(true);
  };

  const openEditEntry = (entry: ExamEntry) => {
    setEditEntryId(entry.id);
    setEntryForm({ subject: entry.subject, date: entry.date, startTime: entry.startTime, endTime: entry.endTime, classIds: [...entry.classIds] });
    setShowEntryModal(true);
  };

  const saveEntry = () => {
    if (!selectedExamId || !entryForm.subject.trim() || !entryForm.date || entryForm.classIds.length === 0) return;
    if (editEntryId) {
      saveEntries(entries.map(e => e.id === editEntryId ? { ...e, ...entryForm } : e));
    } else {
      saveEntries([...entries, { id: `en_${Date.now()}`, examId: selectedExamId, ...entryForm }]);
    }
    setShowEntryModal(false);
  };

  const deleteEntry = (id: string) => saveEntries(entries.filter(e => e.id !== id));

  const toggleClass = (classId: string) =>
    setEntryForm(p => ({
      ...p,
      classIds: p.classIds.includes(classId) ? p.classIds.filter(c => c !== classId) : [...p.classIds, classId],
    }));

  const selectAll = () => setEntryForm(p => ({ ...p, classIds: MADRASHA_CLASSES.map(c => c.id) }));
  const clearAll = () => setEntryForm(p => ({ ...p, classIds: [] }));

  const publishScheduleNotice = () => {
    if (!selectedExam) return;
    const count = selectedEntries.length;
    const dates = [...new Set(selectedEntries.map(e => e.date))].sort();
    const firstDate = dates[0] ? formatDateBn(dates[0]) : '';
    const lastDate = dates[dates.length - 1] ? formatDateBn(dates[dates.length - 1]) : '';
    addNotice({
      id: `n${Date.now()}`,
      title: `${selectedExam.name} — পরীক্ষার সময়সূচী চূড়ান্ত`,
      content: `${selectedExam.name} (${selectedExam.year}) পরীক্ষার সম্পূর্ণ সময়সূচী প্রকাশিত হয়েছে।${count > 0 ? ` মোট ${count}টি পরীক্ষা${firstDate ? `, ${firstDate}` : ''}${lastDate && lastDate !== firstDate ? ` থেকে ${lastDate}` : ''} পর্যন্ত।` : ''} সকলকে নির্ধারিত সময়ে উপস্থিত থাকতে অনুরোধ করা হচ্ছে।`,
      date: new Date().toISOString().split('T')[0],
      type: 'exam', target: 'all', isImportant: true, postedBy: 'Admin',
    });
    setScheduleNoticePublished(selectedExam.id);
    setTimeout(() => setScheduleNoticePublished(null), 3000);
  };

  const selectedExam = exams.find(e => e.id === selectedExamId);
  const selectedEntries = entries
    .filter(e => e.examId === selectedExamId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const getClassEntries = (classId: string) =>
    selectedEntries.filter(e => e.classIds.includes(classId));

  const buildTableRows = (ce: ExamEntry[]) =>
    ce.map((e, i) =>
      `<tr>
        <td style="width:32px">${i + 1}</td>
        <td class="date-cell" style="width:110px">${formatDateBn(e.date)}<span class="day">${getDayBn(e.date)}</span></td>
        <td class="left">${e.subject}</td>
        <td style="width:110px">${e.startTime} — ${e.endTime}</td>
      </tr>`
    ).join('');

  const tableHead = `<thead><tr>
    <th style="width:32px">ক্র.</th>
    <th style="width:110px">তারিখ</th>
    <th class="left">বিষয়</th>
    <th style="width:110px">সময়</th>
  </tr></thead>`;

  const printAll = () => {
    if (!selectedExam) return;
    const classSections = MADRASHA_CLASSES.map(cls => {
      const ce = getClassEntries(cls.id);
      if (ce.length === 0) return '';
      return `<div class="cls-hdr">
        <span class="cls-hdr-name">${cls.nameBn}</span>
        <span class="cls-hdr-count">${ce.length}টি বিষয়</span>
      </div>
      <table>${tableHead}<tbody>${buildTableRows(ce)}</tbody></table>`;
    }).join('');

    const header = `<div class="notice-box">
      <div class="notice-label">পরীক্ষার সময়সূচী</div>
      <div class="notice-title">${selectedExam.name}</div>
      <div class="notice-sub">শিক্ষাবর্ষ: ${selectedExam.year} &nbsp;|&nbsp; সকল শ্রেণি</div>
    </div>`;

    openPrintWindow(selectedExam.name, buildPrintPage(header, classSections));
  };


  return (
    <div>
      <DashboardHeader title="পরীক্ষার সময়সূচী" subtitle="পরীক্ষা তৈরি ও সময়সূচী নির্ধারণ" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {/* Exam list */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">পরীক্ষার তালিকা</h3>
              <p className="text-xs text-gray-400 mt-0.5">একটি পরীক্ষা সিলেক্ট করে সময়সূচী তৈরি করুন</p>
            </div>
            <button onClick={() => setShowExamForm(v => !v)}
              className="flex items-center gap-1.5 btn-primary text-xs px-3 py-2 rounded-lg font-semibold">
              <Plus size={13} /> নতুন পরীক্ষা
            </button>
          </div>

          {showExamForm && (
            <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">পরীক্ষার নাম *</label>
                  <input value={examForm.name} onChange={e => setExamForm(p => ({ ...p, name: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addExam()}
                    placeholder="যেমন: বার্ষিক পরীক্ষা ২০২৪" autoFocus
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">শিক্ষাবর্ষ</label>
                  <input value={examForm.year} onChange={e => setExamForm(p => ({ ...p, year: e.target.value }))}
                    placeholder="২০২৪-২৫"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={addExam} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold">তৈরি করুন</button>
                <button onClick={() => setShowExamForm(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-xs hover:bg-gray-50">বাতিল</button>
              </div>
            </div>
          )}

          {exams.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              কোনো পরীক্ষা নেই। উপরে &quot;নতুন পরীক্ষা&quot; বাটনে ক্লিক করুন।
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {exams.map(exam => (
                <div key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium ${
                    selectedExamId === exam.id
                      ? 'bg-[#1e1b4b] text-white border-transparent shadow-md'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                  }`}>
                  <Calendar size={14} />
                  <span>{exam.name}</span>
                  <span className={`text-xs ${selectedExamId === exam.id ? 'text-purple-200' : 'text-gray-400'}`}>{exam.year}</span>
                  <button
                    onClick={ev => { ev.stopPropagation(); deleteExam(exam.id); }}
                    className={`ml-1 rounded-full p-0.5 transition-colors ${selectedExamId === exam.id ? 'hover:bg-white/20 text-purple-200 hover:text-white' : 'hover:bg-red-100 text-gray-300 hover:text-red-500'}`}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule builder */}
        {selectedExam && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-[#1e1b4b] text-white px-5 py-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-bold text-base">{selectedExam.name}</h2>
                <p className="text-purple-300 text-xs mt-0.5">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা | {selectedExam.year}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={openAddEntry}
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors">
                  <Plus size={13} /> এন্ট্রি যোগ
                </button>
                <button onClick={printAll}
                  className="flex items-center gap-1.5 bg-white text-[#1e1b4b] text-xs px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-sm">
                  <Download size={13} /> PDF ডাউনলোড
                </button>
                {scheduleNoticePublished === selectedExamId ? (
                  <span className="flex items-center gap-1.5 bg-green-500 text-white text-xs px-4 py-2 rounded-lg font-semibold">
                    <CheckCircle size={13} /> নোটিশ প্রকাশিত!
                  </span>
                ) : (
                  <button onClick={publishScheduleNotice}
                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs px-4 py-2 rounded-lg font-semibold transition-colors">
                    <Bell size={13} /> নোটিশ প্রকাশ করুন
                  </button>
                )}
              </div>
            </div>

            {/* Quick jump */}
            <div className="px-5 pt-3 pb-2 border-b border-gray-100 flex flex-wrap gap-1.5">
              {MADRASHA_CLASSES.map(c => {
                const count = getClassEntries(c.id).length;
                return (
                  <a key={c.id} href={`#cls-${c.id}`}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      count > 0 ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}>
                    {CLASS_SHORT[c.id]}
                    {count > 0 && <span className="ml-1 text-[10px]">({count})</span>}
                  </a>
                );
              })}
            </div>

            {/* Per-class sections */}
            <div className="divide-y divide-gray-100">
              {MADRASHA_CLASSES.map(cls => {
                const ce = getClassEntries(cls.id);
                return (
                  <div key={cls.id} id={`cls-${cls.id}`} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#1e1b4b] text-white text-xs font-bold flex items-center justify-center">
                          {CLASS_SHORT[cls.id]}
                        </span>
                        <span className="font-semibold text-gray-800 text-sm">{cls.nameBn}</span>
                        {ce.length > 0 && (
                          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{ce.length}টি বিষয়</span>
                        )}
                      </div>
                    </div>

                    {ce.length === 0 ? (
                      <p className="text-xs text-gray-300 pl-9">কোনো পরীক্ষা যোগ হয়নি</p>
                    ) : (
                      <div className="overflow-hidden rounded-xl border border-gray-200">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-3 py-2.5 text-left font-semibold text-gray-500 w-8">ক্র.</th>
                              <th className="px-3 py-2.5 text-center font-semibold text-gray-600 w-28">তারিখ</th>
                              <th className="px-3 py-2.5 text-left font-semibold text-gray-600">বিষয়</th>
                              <th className="px-3 py-2.5 text-center font-semibold text-gray-600 w-32">সময়</th>
                              <th className="px-3 py-2.5 text-center font-semibold text-gray-400 w-16">সম্পাদনা</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {ce.map((e, i) => (
                              <tr key={e.id} className="hover:bg-purple-50/20 transition-colors">
                                <td className="px-3 py-2.5 text-gray-400">{i + 1}</td>
                                <td className="px-3 py-2.5 text-center text-gray-600 font-medium">{formatDate(e.date)}</td>
                                <td className="px-3 py-2.5 font-semibold text-gray-800">{e.subject}</td>
                                <td className="px-3 py-2.5 text-center text-gray-500">{e.startTime} — {e.endTime}</td>
                                <td className="px-3 py-2.5">
                                  <div className="flex items-center justify-center gap-1">
                                    <button onClick={() => openEditEntry(e)} className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"><Edit2 size={11} /></button>
                                    <button onClick={() => deleteEntry(e.id)} className="w-6 h-6 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"><Trash2 size={11} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Entry modal */}
      {showEntryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-gray-900">{editEntryId ? 'এন্ট্রি সম্পাদনা' : 'নতুন এন্ট্রি যোগ'}</h3>
              <button onClick={() => setShowEntryModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">বিষয় *</label>
                <input value={entryForm.subject} onChange={e => setEntryForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="যেমন: বাংলা, আরবী, গণিত" autoFocus
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">তারিখ *</label>
                <input type="date" value={entryForm.date} onChange={e => setEntryForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">শুরুর সময়</label>
                  <input type="time" value={entryForm.startTime} onChange={e => setEntryForm(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">শেষের সময়</label>
                  <input type="time" value={entryForm.endTime} onChange={e => setEntryForm(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">কোন শ্রেণির জন্য? *</label>
                  <div className="flex gap-2">
                    <button onClick={selectAll} className="text-[11px] text-purple-600 hover:underline">সব</button>
                    <span className="text-gray-300 text-[11px]">|</span>
                    <button onClick={clearAll} className="text-[11px] text-gray-400 hover:underline">বাদ দিন</button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {MADRASHA_CLASSES.map(c => {
                    const checked = entryForm.classIds.includes(c.id);
                    return (
                      <label key={c.id} className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border cursor-pointer text-xs font-medium transition-all ${
                        checked ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-purple-300'
                      }`}>
                        <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleClass(c.id)} />
                        <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-white border-white' : 'border-gray-400'}`}>
                          {checked && <div className="w-1.5 h-1.5 bg-purple-600 rounded-sm" />}
                        </div>
                        {c.nameBn}
                      </label>
                    );
                  })}
                </div>
                {entryForm.classIds.length > 0 && (
                  <p className="text-xs text-purple-600 mt-2 font-medium">
                    নির্বাচিত: {entryForm.classIds.map(id => CLASS_SHORT[id] ?? id).join(', ')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 px-5 pb-5 sticky bottom-0 bg-white pt-2 border-t border-gray-100">
              <button onClick={saveEntry}
                disabled={!entryForm.subject.trim() || !entryForm.date || entryForm.classIds.length === 0}
                className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">সংরক্ষণ</button>
              <button onClick={() => setShowEntryModal(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
