'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, MADRASHA_CLASSES, COLLEGE_INFO } from '@/lib/data';
import type { Student } from '@/lib/types';
import { Plus, Trash2, Download, MapPin, Users, Edit2, Shuffle, ChevronDown, Calendar, Layers, CheckCircle2, UserCheck, LayoutGrid } from 'lucide-react';
import { useTeachers } from '@/context/TeachersContext';
import { printHtml } from '@/lib/print-utils';

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
  capacity: number;        // = branches * seatsPerBranch
  branches: number;        // number of bench rows
  seatsPerBranch: number;  // seats per bench
  guardName?: string;
  guardTeacherId?: string;
  classIds: string[];
}

export interface SeatAssignment {
  examId: string;
  hallId: string;
  studentId: string;
  seatNumber: number;    // overall sequential (1-based)
  branchNumber: number;  // which bench/row (1-based)
  seatInBranch: number;  // position within bench (1-based)
}

type HallStudent = { seatNumber: number; branchNumber: number; seatInBranch: number; student: Student };

const MONTHS = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
function todayBn() { const d = new Date(); return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`; }

const CLASS_COLORS = [
  'bg-purple-100 border-purple-300 text-purple-900',
  'bg-blue-100 border-blue-300 text-blue-900',
  'bg-emerald-100 border-emerald-300 text-emerald-900',
  'bg-orange-100 border-orange-300 text-orange-900',
  'bg-pink-100 border-pink-300 text-pink-900',
  'bg-teal-100 border-teal-300 text-teal-900',
  'bg-red-100 border-red-300 text-red-900',
  'bg-yellow-100 border-yellow-300 text-yellow-900',
  'bg-cyan-100 border-cyan-300 text-cyan-900',
  'bg-indigo-100 border-indigo-300 text-indigo-900',
];

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
.branch-hdr td{background:#e8e6ff;font-weight:700;color:#1e1b4b;font-size:10px;letter-spacing:.5px;text-align:left;padding:4px 8px}
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
  hallStudents: Record<string, HallStudent[]>
) {
  const sections = halls.map((hall, idx) => {
    const assigned = hallStudents[hall.id] ?? [];
    const branches = hall.branches ?? 1;
    const seatsPerBranch = hall.seatsPerBranch ?? hall.capacity;

    // Group by branch and render with branch header rows
    let rows = '';
    for (let b = 1; b <= branches; b++) {
      const branchStudents = assigned.filter(a => (a.branchNumber ?? 1) === b);
      if (branchStudents.length === 0) continue;
      rows += `<tr class="branch-hdr"><td colspan="6">বেঞ্চ — ${b}</td></tr>`;
      rows += branchStudents.map(a => {
        const cls = MADRASHA_CLASSES.find(c => c.id === a.student?.class);
        return `<tr>
          <td style="font-weight:bold;color:#4c1d95;width:45px">${b}</td>
          <td style="font-weight:bold;color:#4c1d95;width:45px">${a.seatInBranch ?? a.seatNumber}</td>
          <td class="left">${a.student?.nameBn || a.student?.name || ''}</td>
          <td style="width:110px">${cls?.nameBn ?? a.student?.class ?? ''}</td>
          <td style="width:65px">${a.student?.roll ?? ''}</td>
          <td style="width:75px"></td>
        </tr>`;
      }).join('');
    }

    return `<div class="${idx > 0 ? 'new-hall' : ''}">
<div class="hall-box">
  <div class="hall-label">পরীক্ষার আসন বিন্যাস</div>
  <div class="hall-title">${examName}</div>
  <div class="hall-sub">কক্ষ: ${hall.hallName} &nbsp;|&nbsp; ${branches} বেঞ্চ × ${seatsPerBranch} আসন &nbsp;|&nbsp; শিক্ষাবর্ষ: ${examYear}</div>
</div>
<div class="guard-bar">
  <span><strong>মোট আসন:</strong> ${hall.capacity}টি</span>
  <span><strong>পরীক্ষার্থী:</strong> ${assigned.length} জন</span>
  ${hall.guardName ? `<span><strong>পরিদর্শক:</strong> ${hall.guardName}</span>` : ''}
</div>
<table>
  <thead><tr>
    <th style="width:45px">বেঞ্চ</th>
    <th style="width:45px">আসন</th>
    <th class="left">শিক্ষার্থীর নাম</th>
    <th style="width:110px">শ্রেণি</th>
    <th style="width:65px">রোল নং</th>
    <th style="width:75px">স্বাক্ষর</th>
  </tr></thead>
  <tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:#999;padding:12px">কোনো শিক্ষার্থী বরাদ্দ হয়নি</td></tr>'}</tbody>
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
</body></html>`;
}

function openPdf(html: string) {
  printHtml(html);
}

function buildStickerPdf(
  halls: Hall[],
  examName: string,
  hallStudents: Record<string, HallStudent[]>,
  logoSrc = ''
): string {
  const STICKER_CSS = `
    @page{size:A4 portrait;margin:8mm}
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Serif Bengali','Vrinda','Nirmala UI',Arial,sans-serif;background:#fff}
    .pg{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
    .stk{border:3px double #000;padding:5mm 6mm;display:flex;flex-direction:column;min-height:118mm;break-inside:avoid}
    .stk-empty{border:none;min-height:118mm}
    .stk-logo{text-align:center;margin-bottom:2mm}
    .stk-logo img{width:52px;height:52px;object-fit:contain}
    .stk-exam{font-size:7pt;text-align:center;margin-bottom:1.5mm;color:#333;line-height:1.4}
    .stk-bn-name{font-size:13.5pt;font-weight:900;text-align:center;line-height:1.35;margin-bottom:1mm}
    .stk-addr{font-size:7.5pt;text-align:center;color:#444;margin-bottom:3mm}
    .stk-heading{font-size:12.5pt;font-weight:700;text-align:center;text-decoration:underline;margin-bottom:5mm}
    .field{display:flex;align-items:flex-end;margin-bottom:4.5mm;font-size:10.5pt;gap:4px}
    .field-lbl{white-space:nowrap;font-weight:700;min-width:58px}
    .field-line{flex:1;border-bottom:1.5px solid #222;padding-bottom:2px;min-height:17px;font-size:9.5pt;padding-left:3px}
    .sig-area{margin-top:auto;padding-top:6mm;display:flex;justify-content:flex-end}
    .sig-col{text-align:center;min-width:90px}
    .sig-line{border-top:1.5px solid #222;padding-top:3px;font-size:9pt;font-weight:700}
    .new-pg{page-break-before:always}
    @media print{@page{margin:8mm}}
  `;

  const logoHtml = logoSrc
    ? `<div class="stk-logo"><img src="${logoSrc}" alt=""></div>`
    : '';

  const allStickers: string[] = [];
  halls.forEach(hall => {
    const assigned = hallStudents[hall.id] ?? [];
    assigned.forEach(a => {
      const cls = MADRASHA_CLASSES.find(c => c.id === a.student?.class);
      allStickers.push(`<div class="stk">
        ${logoHtml}
        <div class="stk-exam">${examName}</div>
        <div class="stk-bn-name">${COLLEGE_INFO.nameBn}</div>
        <div class="stk-addr">মঠেখোলা, পাকুন্দিয়া, কিশোরগঞ্জ।</div>
        <div class="stk-heading">আসন বিন্যাস</div>
        <div class="field">
          <span class="field-lbl">নাম</span>
          <span class="field-line">${a.student?.nameBn || a.student?.name || ''}</span>
        </div>
        <div class="field">
          <span class="field-lbl">শ্রেণী</span>
          <span class="field-line">${cls?.nameBn || ''}</span>
        </div>
        <div class="field">
          <span class="field-lbl">রোল নং</span>
          <span class="field-line">${a.student?.roll != null ? String(a.student.roll) : ''}</span>
        </div>
        <div class="sig-area">
          <div class="sig-col">
            <div class="sig-line">অধ্যক্ষ</div>
          </div>
        </div>
      </div>`);
    });
  });

  const pages: string[] = [];
  for (let i = 0; i < allStickers.length; i += 4) {
    const group = allStickers.slice(i, i + 4);
    while (group.length < 4) group.push('<div class="stk stk-empty"></div>');
    pages.push(`<div class="pg${i > 0 ? ' new-pg' : ''}">${group.join('')}</div>`);
  }

  return `<!DOCTYPE html><html lang="bn"><head>
<meta charset="utf-8"><title>আসন স্টিকার — ${examName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>${STICKER_CSS}</style>
</head><body>
${pages.join('') || '<div style="text-align:center;padding:40px;color:#999">কোনো আসন বরাদ্দ হয়নি</div>'}
</body></html>`;
}

function buildHallMapPdf(
  halls: Hall[],
  examName: string,
  examYear: string,
  hallStudents: Record<string, HallStudent[]>
): string {
  const MAP_CSS = `
    @page{size:A4 landscape;margin:10mm}
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Serif Bengali','Vrinda',Arial,sans-serif;background:#fff;font-size:10px;color:#111}
    .hdr{text-align:center;border-bottom:3px double #1e1b4b;padding-bottom:6px;margin-bottom:10px}
    .hdr-name{font-size:17px;font-weight:900;color:#1e1b4b}
    .hdr-sub{font-size:9px;color:#555;margin-top:3px}
    .hall-section{margin-bottom:16px}
    .new-hall{page-break-before:always;margin-top:0;padding-top:0}
    .hall-title{background:#1e1b4b;color:#fff;text-align:center;padding:5px 12px;font-size:12px;font-weight:700;border-radius:4px;margin-bottom:7px}
    .board{text-align:center;margin-bottom:7px}
    .board-lbl{display:inline-block;background:#2d6a4f;color:#fff;padding:3px 28px;font-size:7.5px;letter-spacing:2px;border-radius:3px}
    .bench-row{display:flex;align-items:center;gap:5px;margin-bottom:3px}
    .bench-lbl{width:48px;text-align:right;font-size:8px;font-weight:700;color:#4c1d95;flex-shrink:0}
    .seats{display:flex;gap:3px;flex-wrap:nowrap}
    .seat{border:1px solid #c8c6e0;border-radius:4px;padding:2px 4px;text-align:center;min-width:82px;background:#f8f7ff}
    .seat-num{font-size:12px;font-weight:900;color:#1e1b4b;line-height:1.2}
    .seat-name{font-size:7px;font-weight:600;color:#222;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:78px}
    .seat-cls{font-size:6px;color:#666}
    .seat-roll{font-size:6px;color:#888}
    .empty-seat{background:#fafafa;border-color:#e8e8e8}
  `;

  const sections = halls.map((hall, idx) => {
    const assigned = hallStudents[hall.id] ?? [];
    const branches = hall.branches ?? 1;
    const seatsPerBranch = hall.seatsPerBranch ?? hall.capacity;

    let benchRows = '';
    for (let b = 1; b <= branches; b++) {
      const branchStudents = assigned.filter(a => a.branchNumber === b);
      let seatsHtml = '';
      for (let s = 1; s <= seatsPerBranch; s++) {
        const a = branchStudents.find(x => x.seatInBranch === s);
        const cls = a ? MADRASHA_CLASSES.find(c => c.id === a.student?.class) : null;
        if (a) {
          seatsHtml += `<div class="seat">
            <div class="seat-num">${s}</div>
            <div class="seat-name">${a.student?.nameBn || a.student?.name || ''}</div>
            <div class="seat-cls">${cls?.nameBn ?? ''}</div>
            <div class="seat-roll">রোল: ${a.student?.roll ?? ''}</div>
          </div>`;
        } else {
          seatsHtml += `<div class="seat empty-seat"><div class="seat-num" style="color:#ccc">${s}</div><div class="seat-cls" style="color:#ccc">খালি</div></div>`;
        }
      }
      benchRows += `<div class="bench-row">
        <div class="bench-lbl">বেঞ্চ ${b}</div>
        <div class="seats">${seatsHtml}</div>
      </div>`;
    }

    return `<div class="hall-section${idx > 0 ? ' new-hall' : ''}">
      <div class="hall-title">হল: ${hall.hallName} &nbsp;|&nbsp; ${branches} বেঞ্চ × ${seatsPerBranch} আসন &nbsp;|&nbsp; বরাদ্দ: ${assigned.length} জন</div>
      <div class="board"><span class="board-lbl">▲ সামনে / ব্ল্যাকবোর্ড</span></div>
      ${benchRows}
    </div>`;
  }).join('');

  return `<!DOCTYPE html><html lang="bn"><head>
<meta charset="utf-8"><title>হল মানচিত্র — ${examName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>${MAP_CSS}</style>
</head><body>
<div class="hdr">
  <div class="hdr-name">${COLLEGE_INFO.nameBn}</div>
  <div class="hdr-sub">${examName} — ${examYear} &nbsp;|&nbsp; হলভিত্তিক বেঞ্চ-আসন মানচিত্র</div>
</div>
${sections || '<div style="text-align:center;padding:40px;color:#999">কোনো আসন বরাদ্দ হয়নি</div>'}
</body></html>`;
}

// Interleave students from different classes so no two adjacent seats share the same class
function interleaveByClass(students: Student[]): Student[] {
  const classOrder = MADRASHA_CLASSES.map(c => c.id);
  const byClass: Record<string, Student[]> = {};
  for (const s of students) {
    if (!byClass[s.class]) byClass[s.class] = [];
    byClass[s.class].push(s);
  }
  const groups = classOrder.map(cid => byClass[cid] ?? []).filter(g => g.length > 0);
  // Largest class first so it spreads across all benches instead of piling on the last bench
  groups.sort((a, b) => b.length - a.length);
  const interleaved: Student[] = [];
  const maxLen = Math.max(0, ...groups.map(g => g.length));
  for (let i = 0; i < maxLen; i++) {
    for (const group of groups) {
      if (i < group.length) interleaved.push(group[i]);
    }
  }
  return interleaved;
}

export default function SeatPlanPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [seats, setSeats] = useState<SeatAssignment[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>(STUDENTS);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const [showHallForm, setShowHallForm] = useState(false);
  const [editHallId, setEditHallId] = useState<string | null>(null);
  const [hallForm, setHallForm] = useState({ hallName: '', branches: '', seatsPerBranch: '', guardTeacherId: '', classIds: [] as string[] });
  const { teachers } = useTeachers();
  const [expandedHall, setExpandedHall] = useState<string | null>(null);
  const [viewModeMap, setViewModeMap] = useState<Record<string, 'table' | 'visual'>>({});

  useEffect(() => {
    try {
      const e = localStorage.getItem(EXAMS_KEY);
      if (e) { const p = JSON.parse(e); setExams(p); if (p.length > 0) setSelectedExamId(p[0].id); }
      const en = localStorage.getItem(ENTRIES_KEY);
      if (en) setEntries(JSON.parse(en));
      const h = localStorage.getItem(HALLS_KEY);
      if (h) {
        const parsed: Hall[] = JSON.parse(h);
        setHalls(parsed.map(hall => ({
          ...hall,
          classIds: Array.isArray(hall.classIds) ? hall.classIds : [],
          branches: hall.branches ?? 1,
          seatsPerBranch: hall.seatsPerBranch ?? hall.capacity,
        })));
      }
      const s = localStorage.getItem(SEATS_KEY);
      if (s) {
        const parsed: SeatAssignment[] = JSON.parse(s);
        setSeats(parsed.map(seat => ({
          ...seat,
          branchNumber: seat.branchNumber ?? 1,
          seatInBranch: seat.seatInBranch ?? seat.seatNumber,
        })));
      }
      const raw = localStorage.getItem('students_store');
      if (raw) {
        const stored: Student[] = JSON.parse(raw);
        const ids = new Set(stored.map(s => s.id));
        setAllStudents([...stored, ...STUDENTS.filter(s => !ids.has(s.id))]);
      }
    } catch {}
  }, []);

  const saveHalls = (data: Hall[]) => { setHalls(data); localStorage.setItem(HALLS_KEY, JSON.stringify(data)); };
  const saveSeats = (data: SeatAssignment[]) => { setSeats(data); localStorage.setItem(SEATS_KEY, JSON.stringify(data)); };

  const selectedExam = exams.find(e => e.id === selectedExamId);
  const examHalls = halls.filter(h => h.examId === selectedExamId);
  const examSeats = seats.filter(s => s.examId === selectedExamId);

  const classesInExam = useMemo(() => {
    const set = new Set<string>();
    entries.filter(e => e.examId === selectedExamId).forEach(e => (e.classIds ?? []).forEach(c => set.add(c)));
    return set;
  }, [entries, selectedExamId]);

  const availableClasses = useMemo(() => {
    if (classesInExam.size > 0) return MADRASHA_CLASSES.filter(c => classesInExam.has(c.id));
    return MADRASHA_CLASSES;
  }, [classesInExam]);

  const getHallEligibleStudents = (hall: Hall): Student[] => {
    const classFilter = (hall.classIds ?? []).length > 0 ? (hall.classIds ?? []) : [...classesInExam];
    const pool = classFilter.length > 0
      ? allStudents.filter(s => classFilter.includes(s.class))
      : allStudents;
    return pool.sort((a, b) => {
      const ci = MADRASHA_CLASSES.findIndex(c => c.id === a.class) - MADRASHA_CLASSES.findIndex(c => c.id === b.class);
      return ci !== 0 ? ci : Number(a.roll) - Number(b.roll);
    });
  };

  const getHallStudents = (hallId: string): HallStudent[] =>
    examSeats
      .filter(s => s.hallId === hallId)
      .sort((a, b) => a.seatNumber - b.seatNumber)
      .map(s => ({
        seatNumber: s.seatNumber,
        branchNumber: s.branchNumber ?? 1,
        seatInBranch: s.seatInBranch ?? s.seatNumber,
        student: allStudents.find(st => st.id === s.studentId)!,
      }))
      .filter(a => a.student);

  const totalCapacity = examHalls.reduce((sum, h) => sum + h.capacity, 0);
  const totalAssigned = examSeats.length;

  const classAssignedToOtherHall = (classId: string, excludeHallId: string | null) =>
    examHalls.some(h => h.id !== excludeHallId && (h.classIds ?? []).includes(classId));

  const addHall = () => {
    if (!selectedExamId) return;
    const branches = parseInt(hallForm.branches, 10);
    const seatsPerBranch = parseInt(hallForm.seatsPerBranch, 10);
    if (!hallForm.hallName.trim() || isNaN(branches) || branches < 1 || isNaN(seatsPerBranch) || seatsPerBranch < 1) return;
    const capacity = branches * seatsPerBranch;
    const guardTeacher = teachers.find(t => t.id === hallForm.guardTeacherId);
    const guardName = guardTeacher ? (guardTeacher.nameBn || guardTeacher.name) : undefined;
    const guardTeacherId = guardTeacher?.id;
    if (editHallId) {
      saveHalls(halls.map(h => h.id === editHallId
        ? { ...h, hallName: hallForm.hallName.trim(), capacity, branches, seatsPerBranch, guardName, guardTeacherId, classIds: hallForm.classIds }
        : h));
      setEditHallId(null);
    } else {
      saveHalls([...halls, {
        id: `hall_${Date.now()}`, examId: selectedExamId,
        hallName: hallForm.hallName.trim(), capacity, branches, seatsPerBranch,
        guardName, guardTeacherId,
        classIds: hallForm.classIds,
      }]);
    }
    setHallForm({ hallName: '', branches: '', seatsPerBranch: '', guardTeacherId: '', classIds: [] });
    setShowHallForm(false);
  };

  const deleteHall = (id: string) => {
    saveHalls(halls.filter(h => h.id !== id));
    saveSeats(seats.filter(s => s.hallId !== id));
  };

  const startEdit = (hall: Hall) => {
    setEditHallId(hall.id);
    setHallForm({
      hallName: hall.hallName,
      branches: String(hall.branches ?? 1),
      seatsPerBranch: String(hall.seatsPerBranch ?? hall.capacity),
      guardTeacherId: hall.guardTeacherId ?? '',
      classIds: hall.classIds ?? [],
    });
    setShowHallForm(true);
  };

  const toggleFormClass = (cid: string) =>
    setHallForm(p => ({
      ...p,
      classIds: p.classIds.includes(cid) ? p.classIds.filter(c => c !== cid) : [...p.classIds, cid],
    }));

  // Auto-assign: interleave by class within each hall, assign branch + seat positions
  const autoAssign = () => {
    if (!selectedExamId || examHalls.length === 0) return;
    const newSeats: SeatAssignment[] = [];

    for (const hall of examHalls) {
      const branches = hall.branches ?? 1;
      const seatsPerBranch = hall.seatsPerBranch ?? hall.capacity;
      const pool = getHallEligibleStudents(hall);
      const interleaved = interleaveByClass(pool);

      let idx = 0;
      outer: for (let b = 1; b <= branches; b++) {
        for (let s = 1; s <= seatsPerBranch; s++) {
          if (idx >= interleaved.length) break outer;
          newSeats.push({
            examId: selectedExamId,
            hallId: hall.id,
            studentId: interleaved[idx].id,
            seatNumber: (b - 1) * seatsPerBranch + s,
            branchNumber: b,
            seatInBranch: s,
          });
          idx++;
        }
      }
    }

    saveSeats([...seats.filter(s => s.examId !== selectedExamId), ...newSeats]);
  };

  const downloadHallPdf = (hall: Hall) => {
    if (!selectedExam) return;
    openPdf(buildCombinedPdf([hall], selectedExam.name, selectedExam.year, { [hall.id]: getHallStudents(hall.id) }));
  };

  const downloadHallStickers = async (hall: Hall) => {
    if (!selectedExam) return;
    let logoSrc = '';
    try {
      const resp = await fetch('/logo.png');
      const blob = await resp.blob();
      logoSrc = await new Promise<string>(res => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(blob); });
    } catch {}
    openPdf(buildStickerPdf([hall], selectedExam.name, { [hall.id]: getHallStudents(hall.id) }, logoSrc));
  };

  const downloadAll = () => {
    if (!selectedExam || examHalls.length === 0) return;
    const hallStudents: Record<string, HallStudent[]> = {};
    examHalls.forEach(h => { hallStudents[h.id] = getHallStudents(h.id); });
    openPdf(buildCombinedPdf(examHalls, selectedExam.name, selectedExam.year, hallStudents));
  };

  const downloadStickers = async () => {
    if (!selectedExam || examHalls.length === 0) return;
    const hallStudents: Record<string, HallStudent[]> = {};
    examHalls.forEach(h => { hallStudents[h.id] = getHallStudents(h.id); });
    let logoSrc = '';
    try {
      const resp = await fetch('/logo.png');
      const blob = await resp.blob();
      logoSrc = await new Promise<string>(res => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(blob); });
    } catch {}
    openPdf(buildStickerPdf(examHalls, selectedExam.name, hallStudents, logoSrc));
  };

  const downloadHallMap = () => {
    if (!selectedExam || examHalls.length === 0) return;
    const hallStudents: Record<string, HallStudent[]> = {};
    examHalls.forEach(h => { hallStudents[h.id] = getHallStudents(h.id); });
    openPdf(buildHallMapPdf(examHalls, selectedExam.name, selectedExam.year, hallStudents));
  };

  const allAssignedClassIds = new Set(examHalls.flatMap(h => h.classIds ?? []));
  const unassignedClasses = availableClasses.filter(c => !allAssignedClassIds.has(c.id));

  const formBranches = parseInt(hallForm.branches, 10);
  const formSeats = parseInt(hallForm.seatsPerBranch, 10);
  const formTotal = (!isNaN(formBranches) && !isNaN(formSeats)) ? formBranches * formSeats : null;

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
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'মোট হল', value: examHalls.length, cls: 'bg-purple-50 text-purple-800' },
                { label: 'মোট আসন', value: totalCapacity, cls: 'bg-blue-50 text-blue-800' },
                { label: 'বরাদ্দকৃত', value: totalAssigned, cls: 'bg-green-50 text-green-800' },
                { label: 'অবরাদ্দ শ্রেণি', value: unassignedClasses.length, cls: unassignedClasses.length > 0 ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-500' },
              ].map(s => (
                <div key={s.label} className={`${s.cls} rounded-2xl p-4`}>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs font-medium mt-0.5 opacity-75">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Unassigned class warning */}
            {unassignedClasses.length > 0 && examHalls.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3 text-sm">
                <span className="text-amber-500 shrink-0 mt-0.5">⚠</span>
                <div>
                  <p className="font-semibold text-amber-800">কিছু শ্রেণি কোনো হলে নির্ধারিত নেই</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {unassignedClasses.map(c => (
                      <span key={c.id} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{c.nameBn}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Hall manager */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-[#1e1b4b] text-white px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-bold text-base">{selectedExam.name}</h2>
                  <p className="text-purple-300 text-xs mt-0.5">হল ও আসন বিন্যাস — {selectedExam.year}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { setShowHallForm(v => !v); setEditHallId(null); setHallForm({ hallName: '', branches: '', seatsPerBranch: '', guardTeacherId: '', classIds: [] }); }}
                    className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors">
                    <Plus size={13} /> হল যোগ
                  </button>
                  {examHalls.length > 0 && (
                    <button onClick={autoAssign}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs px-3 py-2 rounded-lg font-semibold transition-colors">
                      <Shuffle size={13} /> মিশ্র আসন বরাদ্দ
                    </button>
                  )}
                  {totalAssigned > 0 && (
                    <>
                      <button onClick={downloadAll}
                        className="flex items-center gap-1.5 bg-white text-[#1e1b4b] text-xs px-3 py-2 rounded-lg font-semibold hover:bg-purple-50 shadow-sm transition-colors">
                        <Download size={13} /> আসন তালিকা PDF
                      </button>
                      <button onClick={downloadStickers}
                        className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs px-3 py-2 rounded-lg font-semibold transition-colors">
                        <Layers size={13} /> স্টিকার PDF
                      </button>
                      <button onClick={downloadHallMap}
                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg font-semibold transition-colors">
                        <LayoutGrid size={13} /> হল মানচিত্র
                      </button>
                    </>
                  )}
                </div>
              </div>

              {showHallForm && (
                <div className="bg-purple-50/60 border-b border-purple-100 p-5 space-y-4">
                  <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
                    {editHallId ? 'হল সম্পাদনা' : 'নতুন পরীক্ষার হল'}
                  </h4>

                  {/* Row 1: hall name */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">হলের নাম *</label>
                    <input value={hallForm.hallName} onChange={e => setHallForm(p => ({ ...p, hallName: e.target.value }))}
                      placeholder="যেমন: কক্ষ-১" autoFocus
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                  </div>

                  {/* Row 1b: guard teacher select */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1 flex items-center gap-1">
                      <UserCheck size={11} /> পরিদর্শক শিক্ষক
                      <span className="text-gray-400 font-normal">(ঐচ্ছিক — প্রতি শিক্ষক একটি হলে)</span>
                    </label>
                    {(() => {
                      const assignedIds = new Set(
                        examHalls.filter(h => h.id !== editHallId).map(h => h.guardTeacherId).filter(Boolean)
                      );
                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                          <label className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border cursor-pointer text-xs font-medium transition-all ${
                            hallForm.guardTeacherId === '' ? 'bg-gray-600 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}>
                            <input type="radio" className="sr-only" checked={hallForm.guardTeacherId === ''}
                              onChange={() => setHallForm(p => ({ ...p, guardTeacherId: '' }))} />
                            নির্ধারিত নেই
                          </label>
                          {teachers.map(t => {
                            const taken = assignedIds.has(t.id);
                            const selected = hallForm.guardTeacherId === t.id;
                            return (
                              <label key={t.id} className={`flex flex-col px-2.5 py-2 rounded-lg border cursor-pointer text-xs font-medium transition-all ${
                                selected
                                  ? 'bg-purple-600 border-purple-600 text-white'
                                  : taken
                                  ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                              }`}>
                                <input type="radio" className="sr-only" checked={selected}
                                  onChange={() => !taken && setHallForm(p => ({ ...p, guardTeacherId: t.id }))} />
                                <span className="truncate font-semibold">{t.nameBn || t.name}</span>
                                <span className={`text-[9px] truncate mt-0.5 ${selected ? 'text-purple-200' : taken ? 'text-red-300' : 'text-gray-400'}`}>
                                  {taken ? 'অন্য হলে নির্ধারিত' : t.designation}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Row 2: branches + seatsPerBranch + calculated total */}
                  <div className="grid grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">বেঞ্চ সংখ্যা *</label>
                      <input type="number" value={hallForm.branches}
                        onChange={e => setHallForm(p => ({ ...p, branches: e.target.value }))}
                        placeholder="যেমন: ৫" min="1"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">প্রতি বেঞ্চে আসন *</label>
                      <input type="number" value={hallForm.seatsPerBranch}
                        onChange={e => setHallForm(p => ({ ...p, seatsPerBranch: e.target.value }))}
                        placeholder="যেমন: ৬" min="1"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                    </div>
                    <div className={`rounded-xl px-4 py-2.5 text-center border ${formTotal ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">মোট আসন</p>
                      <p className={`text-xl font-bold ${formTotal ? 'text-purple-700' : 'text-gray-300'}`}>
                        {formTotal ?? '—'}
                      </p>
                    </div>
                  </div>

                  {/* Class assignment */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-2">
                      এই হলে কোন শ্রেণির শিক্ষার্থী বসবে? *
                      <span className="text-gray-400 font-normal ml-1">(একাধিক বেছে নিন)</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
                      {availableClasses.map(c => {
                        const checked = hallForm.classIds.includes(c.id);
                        const takenByOther = classAssignedToOtherHall(c.id, editHallId);
                        return (
                          <label key={c.id} className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border cursor-pointer text-xs font-medium transition-all ${
                            checked
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : takenByOther
                              ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                          }`}>
                            <input type="checkbox" className="sr-only" checked={checked}
                              onChange={() => !takenByOther && toggleFormClass(c.id)} />
                            <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-white border-white' : 'border-gray-400'}`}>
                              {checked && <div className="w-1.5 h-1.5 bg-purple-600 rounded-sm" />}
                            </div>
                            <span className="truncate">{c.nameBn}</span>
                            {takenByOther && !checked && <span className="text-[9px] text-red-400 ml-auto">অন্য হলে</span>}
                          </label>
                        );
                      })}
                    </div>
                    {hallForm.classIds.length > 0 && (
                      <p className="text-xs text-purple-700 mt-2 font-medium">
                        নির্বাচিত: {hallForm.classIds.map(id => availableClasses.find(c => c.id === id)?.nameBn ?? id).join(', ')}
                        {' '}— আনুমানিক {getHallEligibleStudents({ id: editHallId ?? '', examId: selectedExamId!, hallName: '', capacity: 0, branches: 1, seatsPerBranch: 0, classIds: hallForm.classIds }).length} জন শিক্ষার্থী
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={addHall}
                      disabled={!hallForm.hallName.trim() || !hallForm.branches || !hallForm.seatsPerBranch || hallForm.classIds.length === 0}
                      className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-40">
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
                    const hallClasses = (hall.classIds ?? []).map(cid => availableClasses.find(c => c.id === cid)?.nameBn ?? cid);
                    const eligible = getHallEligibleStudents(hall);
                    const branches = hall.branches ?? 1;
                    const seatsPerBranch = hall.seatsPerBranch ?? hall.capacity;

                    return (
                      <div key={hall.id}>
                        <div className="flex items-start gap-4 px-5 py-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin size={18} className="text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{hall.hallName}</h3>
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                {branches} বেঞ্চ × {seatsPerBranch} = {hall.capacity} আসন
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${hs.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                বরাদ্দ: {hs.length}
                              </span>
                              {hs.length > 0 && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> মিশ্র আসন</span>}
                            </div>
                            {hallClasses.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {hallClasses.map(cn => (
                                  <span key={cn} className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">{cn}</span>
                                ))}
                                <span className="text-[10px] text-gray-400">({eligible.length} জন শিক্ষার্থী)</span>
                              </div>
                            ) : (
                              <p className="text-[10px] text-amber-600 mt-1">⚠ কোনো শ্রেণি নির্ধারিত নেই — সম্পাদনা করুন</p>
                            )}
                            {hall.guardName && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <UserCheck size={10} className="text-purple-400" />
                                <span className="text-[10px] text-purple-700 font-medium">{hall.guardName}</span>
                                {hall.guardTeacherId && (() => {
                                  const t = teachers.find(x => x.id === hall.guardTeacherId);
                                  return t ? <span className="text-[9px] text-gray-400">({t.designation})</span> : null;
                                })()}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                            <button onClick={() => startEdit(hall)}
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => downloadHallPdf(hall)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                              <Download size={12} /> PDF
                            </button>
                            <button onClick={() => downloadHallStickers(hall)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                              <Layers size={12} /> স্টিকার
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
                          <div className="border-t border-gray-100 px-5 pb-4 pt-3 bg-gray-50/30">
                            {hs.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">
                                কোনো শিক্ষার্থী বরাদ্দ হয়নি। উপরে &quot;মিশ্র আসন বরাদ্দ&quot; বাটনে ক্লিক করুন।
                              </p>
                            ) : (
                              <>
                                {/* View toggle */}
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-[10px] text-gray-400 font-medium">{hs.length} জন বরাদ্দ</span>
                                  <div className="flex border border-gray-200 rounded-lg overflow-hidden text-[10px] font-semibold">
                                    <button
                                      onClick={() => setViewModeMap(p => ({ ...p, [hall.id]: 'table' }))}
                                      className={`px-3 py-1.5 transition-colors ${(viewModeMap[hall.id] ?? 'table') === 'table' ? 'bg-purple-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                                      তালিকা
                                    </button>
                                    <button
                                      onClick={() => setViewModeMap(p => ({ ...p, [hall.id]: 'visual' }))}
                                      className={`px-3 py-1.5 transition-colors ${viewModeMap[hall.id] === 'visual' ? 'bg-purple-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                                      ভিজুয়াল
                                    </button>
                                  </div>
                                </div>

                                {viewModeMap[hall.id] === 'visual' ? (
                                  /* Visual classroom layout */
                                  <div>
                                    <div className="flex items-center justify-center mb-3">
                                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest bg-gray-100 border border-gray-200 px-4 py-1 rounded-full">
                                        ▲ সামনে / ব্ল্যাকবোর্ড
                                      </span>
                                    </div>
                                    <div className="overflow-x-auto pb-2">
                                      <div className="space-y-1.5 min-w-fit">
                                        {Array.from({ length: branches }, (_, bi) => {
                                          const branchNum = bi + 1;
                                          const branchStudents = hs.filter(a => a.branchNumber === branchNum);
                                          return (
                                            <div key={bi} className="flex items-center gap-2">
                                              <div className="w-16 shrink-0 text-right">
                                                <span className="text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-1 rounded-lg whitespace-nowrap">
                                                  বেঞ্চ {branchNum}
                                                </span>
                                              </div>
                                              <div className="flex gap-1">
                                                {Array.from({ length: seatsPerBranch }, (_, si) => {
                                                  const seatNum = si + 1;
                                                  const a = branchStudents.find(x => x.seatInBranch === seatNum);
                                                  if (!a) return (
                                                    <div key={si} className="w-[72px] h-[64px] border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-[9px] text-gray-300 shrink-0">
                                                      খালি
                                                    </div>
                                                  );
                                                  const classIdx = MADRASHA_CLASSES.findIndex(c => c.id === a.student?.class);
                                                  const col = CLASS_COLORS[Math.max(0, classIdx) % CLASS_COLORS.length];
                                                  const cls = MADRASHA_CLASSES.find(c => c.id === a.student?.class);
                                                  return (
                                                    <div key={si} title={`${a.student?.name} — ${cls?.nameBn ?? ''} — রোল: ${a.student?.roll}`}
                                                      className={`w-[72px] h-[64px] border rounded-lg p-1 text-center shrink-0 cursor-default ${col}`}>
                                                      <div className="text-xl font-black leading-none">{seatNum}</div>
                                                      <div className="text-[7px] font-semibold leading-tight mt-0.5 truncate">{a.student?.name}</div>
                                                      <div className="text-[6px] opacity-70 truncate mt-px">{cls?.nameBn ?? ''}</div>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                    {/* Color legend */}
                                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-100">
                                      {(hall.classIds ?? []).map((cid, idx) => {
                                        const cls = MADRASHA_CLASSES.find(c => c.id === cid);
                                        const classIdx = MADRASHA_CLASSES.findIndex(c => c.id === cid);
                                        const col = CLASS_COLORS[Math.max(0, classIdx) % CLASS_COLORS.length];
                                        return (
                                          <span key={cid} className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${col}`}>
                                            {cls?.nameBn ?? cid}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ) : (
                                  /* Table view */
                                  <div className="space-y-3">
                                    {Array.from({ length: branches }, (_, bi) => {
                                      const branchStudents = hs.filter(a => a.branchNumber === bi + 1);
                                      if (branchStudents.length === 0) return null;
                                      return (
                                        <div key={bi + 1}>
                                          <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wide mb-1 px-1">
                                            বেঞ্চ — {bi + 1}
                                          </div>
                                          <div className="overflow-hidden rounded-xl border border-gray-200">
                                            <table className="w-full text-xs border-collapse">
                                              <thead>
                                                <tr className="bg-purple-50">
                                                  <th className="px-3 py-2 text-center text-purple-600 font-semibold w-14">আসন</th>
                                                  <th className="px-3 py-2 text-left text-gray-600 font-semibold">নাম</th>
                                                  <th className="px-3 py-2 text-center text-gray-600 font-semibold w-32">শ্রেণি</th>
                                                  <th className="px-3 py-2 text-center text-gray-600 font-semibold w-20">রোল</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-gray-50">
                                                {branchStudents.map((a, i) => {
                                                  const prevClass = i > 0 ? branchStudents[i - 1].student?.class : null;
                                                  const sameAsPrev = prevClass === a.student?.class;
                                                  return (
                                                    <tr key={a.seatNumber} className={`hover:bg-purple-50/20 ${sameAsPrev ? 'bg-red-50/30' : ''}`}>
                                                      <td className="px-3 py-2 text-center font-bold text-purple-700">{a.seatInBranch}</td>
                                                      <td className="px-3 py-2 font-medium text-gray-800">{a.student?.name}</td>
                                                      <td className={`px-3 py-2 text-center text-[11px] ${sameAsPrev ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                                                        {MADRASHA_CLASSES.find(c => c.id === a.student?.class)?.nameBn ?? ''}
                                                      </td>
                                                      <td className="px-3 py-2 text-center text-gray-500">{a.student?.roll}</td>
                                                    </tr>
                                                  );
                                                })}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
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
