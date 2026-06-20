'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, MADRASHA_CLASSES } from '@/lib/data';
import { Plus, Trash2, Download, X, MapPin, Users, Edit2, Shuffle, ChevronDown, Calendar, Layers } from 'lucide-react';

const EXAMS_KEY = 'nim_exams_v1';
const ENTRIES_KEY = 'nim_exam_entries_v1';
export const HALLS_KEY = 'nim_halls_v1';
export const SEATS_KEY = 'nim_seats_v1';

interface Exam { id: string; name: string; year: string; }
interface ExamEntry { id: string; examId: string; classIds: string[]; }

export interface Hall {
  id: string;
  examId: string;
  hallName: string;
  capacity: number;
  guardName?: string;
}

export interface SeatAssignment {
  examId: string;
  hallId: string;
  studentId: string;
  seatNumber: number;
}

type Student = (typeof STUDENTS)[0];

const MONTHS = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
function todayBn() { const d = new Date(); return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`; }

const PDF_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;color:#111;background:#fff;font-size:11px;line-height:1.5}
.page{max-width:780px;margin:0 auto;padding:20px 24px}
.hdr{text-align:center;border-bottom:3px double #1e1b4b;padding-bottom:10px;margin-bottom:14px}
.hdr-pre{font-size:8.5px;color:#666;letter-spacing:1px;text-transform:uppercase;margin-bottom:3px}
.hdr-name{font-size:22px;font-weight:900;color:#1e1b4b}
.hdr-en{font-size:10px;color:#555;font-style:italic;margin-top:2px}
.hdr-addr{font-size:9.5px;color:#444;margin-top:4px}
.hall-box{border:2px solid #1e1b4b;border-radius:4px;padding:8px 16px;text-align:center;margin:0 0 12px;background:#f8f7ff}
.hall-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:3px}
.hall-title{font-size:16px;font-weight:bold;color:#1e1b4b}
.hall-sub{font-size:10px;color:#444;margin-top:3px}
.guard-bar{margin:0 0 12px;padding:6px 14px;background:#fff8e1;border:1px solid #f0c040;border-radius:3px;font-size:10px;color:#7c5a00;display:flex;gap:24px;flex-wrap:wrap}
table{width:100%;border-collapse:collapse;font-size:10.5px}
thead tr{background:#1e1b4b}
thead th{color:#fff;padding:6px 8px;border:1px solid #1e1b4b;text-align:center;font-weight:600}
th.left,td.left{text-align:left}
tbody tr:nth-child(even){background:#f5f4ff}
tbody tr:nth-child(odd){background:#fff}
td{border:1px solid #c8c6e0;padding:5px 8px;text-align:center;vertical-align:middle}
.sig-row{display:flex;justify-content:space-between;margin-top:40px}
.sig-col{text-align:center;min-width:140px}
.sig-line{border-top:1px solid #333;padding-top:4px;font-size:9.5px;font-weight:600;color:#222}
.sig-sub{font-size:8.5px;color:#555;margin-top:2px}
.issue{font-size:9px;color:#666;text-align:right;margin-top:8px}
.new-hall{page-break-before:always;margin-top:0;padding-top:0}
@media print{@page{size:A4 portrait;margin:1.2cm}}
`;

function buildCombinedPdf(
  halls: Hall[],
  examName: string,
  examYear: string,
  hallStudents: Record<string, Array<{ seatNumber: number; student: Student }>>
) {
  const sections = halls.map((hall, idx) => {
    const assigned = hallStudents[hall.id] ?? [];
    const rows = assigned.map(a => {
      const cls = MADRASHA_CLASSES.find(c => c.id === a.student?.class);
      return `<tr>
        <td style="font-weight:bold;color:#4c1d95">${a.seatNumber}</td>
        <td class="left">${a.student?.name ?? ''}</td>
        <td>${cls?.nameBn ?? a.student?.class ?? ''}</td>
        <td>${a.student?.roll ?? ''}</td>
        <td></td>
      </tr>`;
    }).join('');

    return `<div class="${idx > 0 ? 'new-hall' : ''}">
<div class="hall-box">
  <div class="hall-label">পরীক্ষার আসন বিন্যাস</div>
  <div class="hall-title">${examName}</div>
  <div class="hall-sub">কক্ষ: ${hall.hallName} &nbsp;|&nbsp; শিক্ষাবর্ষ: ${examYear}</div>
</div>
<div class="guard-bar">
  <span><strong>মোট আসন:</strong> ${hall.capacity}টি</span>
  <span><strong>পরীক্ষার্থী:</strong> ${assigned.length} জন</span>
</div>
<table>
  <thead><tr>
    <th style="width:55px">আসন নং</th>
    <th class="left">শিক্ষার্থীর নাম</th>
    <th style="width:110px">শ্রেণি</th>
    <th style="width:70px">রোল নং</th>
    <th style="width:80px">স্বাক্ষর</th>
  </tr></thead>
  <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#999;padding:12px">কোনো শিক্ষার্থী বরাদ্দ হয়নি</td></tr>'}</tbody>
</table>
</div>`;
  }).join('');

  return `<!DOCTYPE html><html lang="bn"><head>
<meta charset="utf-8"><title>আসন বিন্যাস — ${examName}</title>
<style>${PDF_CSS}</style>
</head><body><div class="page">
<div class="hdr">
  <div class="hdr-pre">প্রতিষ্ঠিত ১৯৭৫</div>
  <div class="hdr-name">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div>
  <div class="hdr-en">Noor-e-Islam Madrasha</div>
  <div class="hdr-addr">ঢাকা, বাংলাদেশ | ফোন: ০১৭XX-XXXXXX</div>
</div>
${sections}
<div class="sig-row">
  <div class="sig-col"><div class="sig-line">পরীক্ষা নিয়ন্ত্রক</div><div class="sig-sub">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div></div>
  <div class="sig-col"><div class="sig-line">অধ্যক্ষ</div><div class="sig-sub">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div></div>
</div>
<div class="issue">প্রকাশের তারিখ: ${todayBn()}</div>
</div>
<script>window.addEventListener('load',function(){setTimeout(function(){window.print();},400);});<\/script>
</body></html>`;
}

function openPdf(html: string) {
  const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function buildStickerPdf(
  halls: Hall[],
  examName: string,
  hallStudents: Record<string, Array<{ seatNumber: number; student: Student }>>
): string {
  const STICKER_CSS = `
    @page{size:A4 portrait;margin:5mm}
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;background:#fff}
    .pg{display:grid;grid-template-columns:1fr 1fr;height:277mm}
    .stk{border:1.5px dashed #bbb;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6mm;text-align:center}
    .stk-hall{font-size:7.5pt;color:#888;letter-spacing:.5px;text-transform:uppercase;margin-bottom:3mm;border-bottom:.5px solid #eee;padding-bottom:2mm;width:100%}
    .stk-num{font-size:56pt;font-weight:900;color:#1e1b4b;line-height:1}
    .stk-lbl{font-size:7.5pt;color:#999;margin:1mm 0 4mm;letter-spacing:1px;text-transform:uppercase}
    .stk-name{font-size:9pt;font-weight:bold;color:#111;max-width:90%}
    .stk-info{font-size:8pt;color:#555;margin-top:1.5mm}
    .stk-inst{font-size:6.5pt;color:#bbb;margin-top:2.5mm;border-top:.5px solid #eee;padding-top:2mm;width:100%}
    .new-pg{page-break-before:always}
    @media print{@page{margin:5mm}}
  `;

  const allStickers: Array<{ seatNumber: number; student: Student; hallName: string }> = [];
  halls.forEach(hall => {
    (hallStudents[hall.id] ?? []).forEach(a => {
      allStickers.push({ seatNumber: a.seatNumber, student: a.student, hallName: hall.hallName });
    });
  });

  const pages: Array<typeof allStickers> = [];
  for (let i = 0; i < allStickers.length; i += 6) pages.push(allStickers.slice(i, i + 6));

  const pagesHtml = pages.map((page, pi) => {
    const stickers = page.map(s => {
      const cls = MADRASHA_CLASSES.find(c => c.id === s.student?.class);
      return `<div class="stk">
        <div class="stk-hall">${s.hallName}</div>
        <div class="stk-num">${s.seatNumber}</div>
        <div class="stk-lbl">আসন নম্বর</div>
        <div class="stk-name">${s.student?.name ?? ''}</div>
        <div class="stk-info">${cls?.nameBn ?? ''} &nbsp;|&nbsp; রোল: ${s.student?.roll ?? ''}</div>
        <div class="stk-inst">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা — ${examName}</div>
      </div>`;
    });
    while (stickers.length < 6) stickers.push('<div class="stk"></div>');
    return `<div class="pg${pi > 0 ? ' new-pg' : ''}">${stickers.join('')}</div>`;
  }).join('');

  return `<!DOCTYPE html><html lang="bn"><head>
<meta charset="utf-8"><title>আসন স্টিকার — ${examName}</title>
<style>${STICKER_CSS}</style>
</head><body>
${pagesHtml || '<div class="pg"></div>'}
<script>window.addEventListener('load',function(){setTimeout(function(){window.print();},400);});<\/script>
</body></html>`;
}

export default function SeatPlanPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [seats, setSeats] = useState<SeatAssignment[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const [showHallForm, setShowHallForm] = useState(false);
  const [editHallId, setEditHallId] = useState<string | null>(null);
  const [hallForm, setHallForm] = useState({ hallName: '', capacity: '' });
  const [expandedHall, setExpandedHall] = useState<string | null>(null);

  useEffect(() => {
    try {
      const e = localStorage.getItem(EXAMS_KEY);
      if (e) { const p = JSON.parse(e); setExams(p); if (p.length > 0) setSelectedExamId(p[0].id); }
      const en = localStorage.getItem(ENTRIES_KEY);
      if (en) setEntries(JSON.parse(en));
      const h = localStorage.getItem(HALLS_KEY);
      if (h) setHalls(JSON.parse(h));
      const s = localStorage.getItem(SEATS_KEY);
      if (s) setSeats(JSON.parse(s));
    } catch {}
  }, []);

  const saveHalls = (data: Hall[]) => { setHalls(data); localStorage.setItem(HALLS_KEY, JSON.stringify(data)); };
  const saveSeats = (data: SeatAssignment[]) => { setSeats(data); localStorage.setItem(SEATS_KEY, JSON.stringify(data)); };

  const selectedExam = exams.find(e => e.id === selectedExamId);
  const examHalls = halls.filter(h => h.examId === selectedExamId);
  const examSeats = seats.filter(s => s.examId === selectedExamId);

  const classesInExam = useMemo(() => {
    const set = new Set<string>();
    entries.filter(e => e.examId === selectedExamId).forEach(e => e.classIds.forEach(c => set.add(c)));
    return set;
  }, [entries, selectedExamId]);

  const eligibleStudents = useMemo(() => {
    const classOrder = MADRASHA_CLASSES.map(c => c.id);
    // if no schedule entries exist yet, all students are eligible
    const pool = classesInExam.size > 0
      ? STUDENTS.filter(s => classesInExam.has(s.class))
      : [...STUDENTS];
    return pool.sort((a, b) => {
      const ci = classOrder.indexOf(a.class) - classOrder.indexOf(b.class);
      return ci !== 0 ? ci : Number(a.roll) - Number(b.roll);
    });
  }, [classesInExam]);

  const getHallStudents = (hallId: string) =>
    examSeats
      .filter(s => s.hallId === hallId)
      .sort((a, b) => a.seatNumber - b.seatNumber)
      .map(s => ({ seatNumber: s.seatNumber, student: STUDENTS.find(st => st.id === s.studentId)! }))
      .filter(a => a.student);

  const totalCapacity = examHalls.reduce((sum, h) => sum + h.capacity, 0);

  const addHall = () => {
    if (!selectedExamId) return;
    const cap = parseInt(hallForm.capacity, 10);
    if (!hallForm.hallName.trim() || isNaN(cap) || cap < 1) return;
    if (editHallId) {
      saveHalls(halls.map(h => h.id === editHallId
        ? { ...h, hallName: hallForm.hallName.trim(), capacity: cap }
        : h));
      setEditHallId(null);
    } else {
      saveHalls([...halls, {
        id: `hall_${Date.now()}`, examId: selectedExamId,
        hallName: hallForm.hallName.trim(), capacity: cap,
      }]);
    }
    setHallForm({ hallName: '', capacity: '' });
    setShowHallForm(false);
  };

  const deleteHall = (id: string) => {
    saveHalls(halls.filter(h => h.id !== id));
    saveSeats(seats.filter(s => s.hallId !== id));
  };

  const startEdit = (hall: Hall) => {
    setEditHallId(hall.id);
    setHallForm({ hallName: hall.hallName, capacity: String(hall.capacity) });
    setShowHallForm(true);
  };

  const autoAssign = () => {
    if (!selectedExamId || examHalls.length === 0 || eligibleStudents.length === 0) return;
    const newSeats: SeatAssignment[] = [];
    let idx = 0;
    for (const hall of examHalls) {
      for (let seat = 1; seat <= hall.capacity && idx < eligibleStudents.length; seat++, idx++) {
        newSeats.push({ examId: selectedExamId, hallId: hall.id, studentId: eligibleStudents[idx].id, seatNumber: seat });
      }
    }
    saveSeats([...seats.filter(s => s.examId !== selectedExamId), ...newSeats]);
  };

  const downloadHallPdf = (hall: Hall) => {
    if (!selectedExam) return;
    openPdf(buildCombinedPdf([hall], selectedExam.name, selectedExam.year, { [hall.id]: getHallStudents(hall.id) }));
  };

  const downloadAll = () => {
    if (!selectedExam || examHalls.length === 0) return;
    const hallStudents: Record<string, Array<{ seatNumber: number; student: Student }>> = {};
    examHalls.forEach(h => { hallStudents[h.id] = getHallStudents(h.id); });
    openPdf(buildCombinedPdf(examHalls, selectedExam.name, selectedExam.year, hallStudents));
  };

  const downloadStickers = () => {
    if (!selectedExam || examHalls.length === 0) return;
    const hallStudents: Record<string, Array<{ seatNumber: number; student: Student }>> = {};
    examHalls.forEach(h => { hallStudents[h.id] = getHallStudents(h.id); });
    openPdf(buildStickerPdf(examHalls, selectedExam.name, hallStudents));
  };

  return (
    <div>
      <DashboardHeader title="আসন পরিকল্পনা" subtitle="পরীক্ষার কক্ষ ও আসন বিন্যাস" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {/* Exam selector */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">পরীক্ষা নির্বাচন করুন</h3>
          {exams.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <Calendar size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">কোনো পরীক্ষা নেই।</p>
              <p className="text-xs mt-1">&quot;পরীক্ষা সময়সূচী&quot; পাতা থেকে আগে পরীক্ষা তৈরি করুন।</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {exams.map(exam => (
                <button key={exam.id} onClick={() => setSelectedExamId(exam.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    selectedExamId === exam.id
                      ? 'bg-[#1e1b4b] text-white border-transparent shadow-md'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                  }`}>
                  <MapPin size={14} />
                  <span>{exam.name}</span>
                  <span className={`text-xs ${selectedExamId === exam.id ? 'text-purple-200' : 'text-gray-400'}`}>{exam.year}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedExam && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'মোট হল', value: examHalls.length, cls: 'bg-purple-50 text-purple-800' },
                { label: 'মোট আসন', value: totalCapacity, cls: 'bg-blue-50 text-blue-800' },
                { label: 'বরাদ্দকৃত', value: examSeats.length, cls: 'bg-green-50 text-green-800' },
              ].map(s => (
                <div key={s.label} className={`${s.cls} rounded-2xl p-4`}>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs font-medium mt-0.5 opacity-75">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Hall manager */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-[#1e1b4b] text-white px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-bold text-base">{selectedExam.name}</h2>
                  <p className="text-purple-300 text-xs mt-0.5">হল ও আসন বিন্যাস ব্যবস্থাপনা | {selectedExam.year}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { setShowHallForm(v => !v); setEditHallId(null); setHallForm({ hallName: '', capacity: '' }); }}
                    className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors">
                    <Plus size={13} /> হল যোগ
                  </button>
                  {examHalls.length > 0 && eligibleStudents.length > 0 && (
                    <button onClick={autoAssign}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs px-3 py-2 rounded-lg font-semibold transition-colors">
                      <Shuffle size={13} /> স্বয়ংক্রিয় বরাদ্দ
                    </button>
                  )}
                  {examSeats.length > 0 && (
                    <>
                      <button onClick={downloadAll}
                        className="flex items-center gap-1.5 bg-white text-[#1e1b4b] text-xs px-3 py-2 rounded-lg font-semibold hover:bg-purple-50 shadow-sm transition-colors">
                        <Download size={13} /> আসন তালিকা PDF
                      </button>
                      <button onClick={downloadStickers}
                        className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs px-3 py-2 rounded-lg font-semibold transition-colors">
                        <Layers size={13} /> স্টিকার PDF
                      </button>
                    </>
                  )}
                </div>
              </div>

              {showHallForm && (
                <div className="bg-purple-50/60 border-b border-purple-100 p-4 space-y-3">
                  <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
                    {editHallId ? 'হল সম্পাদনা' : 'নতুন পরীক্ষার হল'}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">হলের নাম *</label>
                      <input value={hallForm.hallName} onChange={e => setHallForm(p => ({ ...p, hallName: e.target.value }))}
                        placeholder="যেমন: কক্ষ-১" autoFocus
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">আসন সংখ্যা *</label>
                      <input type="number" value={hallForm.capacity}
                        onChange={e => setHallForm(p => ({ ...p, capacity: e.target.value }))}
                        placeholder="যেমন: 30" min="1"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addHall} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold">
                      {editHallId ? 'আপডেট করুন' : 'হল যোগ করুন'}
                    </button>
                    <button onClick={() => { setShowHallForm(false); setEditHallId(null); }}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-xs hover:bg-gray-50">বাতিল</button>
                  </div>
                </div>
              )}

              {examHalls.length === 0 ? (
                <div className="py-14 text-center text-gray-400">
                  <MapPin size={36} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">কোনো হল যোগ করা হয়নি</p>
                  <p className="text-xs mt-1">উপরে &quot;হল যোগ&quot; বাটনে ক্লিক করে হল যোগ করুন।</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {examHalls.map(hall => {
                    const hs = getHallStudents(hall.id);
                    const expanded = expandedHall === hall.id;
                    return (
                      <div key={hall.id}>
                        <div className="flex items-center gap-4 px-5 py-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                            <MapPin size={18} className="text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{hall.hallName}</h3>
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">ধারণ: {hall.capacity}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${hs.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                বরাদ্দ: {hs.length}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => startEdit(hall)}
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => downloadHallPdf(hall)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                              <Download size={12} /> PDF
                            </button>
                            <button onClick={() => setExpandedHall(expanded ? null : hall.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                              <Users size={12} /> তালিকা
                              <ChevronDown size={11} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
                            </button>
                            <button onClick={() => deleteHall(hall.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {expanded && (
                          <div className="border-t border-gray-100 px-5 pb-4 pt-3">
                            {hs.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">
                                কোনো শিক্ষার্থী বরাদ্দ হয়নি। উপরে &quot;স্বয়ংক্রিয় বরাদ্দ&quot; বাটনে ক্লিক করুন।
                              </p>
                            ) : (
                              <div className="overflow-hidden rounded-xl border border-gray-200">
                                <table className="w-full text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-3 py-2 text-center text-gray-500 font-semibold w-16">আসন</th>
                                      <th className="px-3 py-2 text-left text-gray-600 font-semibold">নাম</th>
                                      <th className="px-3 py-2 text-center text-gray-600 font-semibold w-28">শ্রেণি</th>
                                      <th className="px-3 py-2 text-center text-gray-600 font-semibold w-20">রোল</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50">
                                    {hs.map(a => (
                                      <tr key={a.seatNumber} className="hover:bg-purple-50/20">
                                        <td className="px-3 py-2 text-center font-bold text-purple-700">{a.seatNumber}</td>
                                        <td className="px-3 py-2 font-medium text-gray-800">{a.student?.name}</td>
                                        <td className="px-3 py-2 text-center text-gray-500 text-[11px]">
                                          {MADRASHA_CLASSES.find(c => c.id === a.student?.class)?.nameBn ?? ''}
                                        </td>
                                        <td className="px-3 py-2 text-center text-gray-500">{a.student?.roll}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {eligibleStudents.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                  <Users size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">পরীক্ষার্থী তথ্য</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      এই পরীক্ষায় মোট <strong>{eligibleStudents.length}</strong> জন শিক্ষার্থী অংশ নেবে।
                      {examHalls.length === 0 && <> প্রথমে উপরে &quot;হল যোগ&quot; করুন, তারপর &quot;স্বয়ংক্রিয় বরাদ্দ&quot; দিন।</>}
                      {examHalls.length > 0 && examSeats.length === 0 && <> হল প্রস্তুত — &quot;স্বয়ংক্রিয় বরাদ্দ&quot; বাটনে ক্লিক করুন।</>}
                      {examSeats.length > 0 && examSeats.length < eligibleStudents.length && (
                        <> এখনো <strong>{eligibleStudents.length - examSeats.length}</strong> জন আসন পায়নি।</>
                      )}
                      {totalCapacity > 0 && totalCapacity < eligibleStudents.length && (
                        <span className="text-red-600 font-semibold">
                          {' '}সতর্কতা: মোট আসন ({totalCapacity}) শিক্ষার্থী সংখ্যার ({eligibleStudents.length}) চেয়ে কম!
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}
