'use client';
import { useState, useEffect, useCallback } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES } from '@/lib/data';
import { useTeachers } from '@/context/TeachersContext';
import { kvGet, kvSet } from '@/lib/supabase/kv';
import { Plus, X, Edit2, Save, Download, BookOpen, Bell, CheckCircle } from 'lucide-react';
import { useNotices } from '@/context/NoticesContext';
import { printHtml } from '@/lib/print-utils';

const LS_KEY = 'master_routine_v2';

const DAYS = [
  { id: 'sat', label: 'শনিবার', short: 'শনি' },
  { id: 'sun', label: 'রবিবার', short: 'রবি' },
  { id: 'mon', label: 'সোমবার', short: 'সোম' },
  { id: 'tue', label: 'মঙ্গলবার', short: 'মঙ্গল' },
  { id: 'wed', label: 'বুধবার', short: 'বুধ' },
  { id: 'thu', label: 'বৃহস্পতিবার', short: 'বৃহ' },
];

const PERIOD_TYPES = [
  { id: 'class', label: 'ক্লাস' },
  { id: 'assembly', label: 'সমাবেশ' },
  { id: 'break', label: 'বিরতি' },
  { id: 'prayer', label: 'নামায' },
];

const BANGLA_ORDINALS: Record<number, string> = {
  1: '১ম', 2: '২য়', 3: '৩য়', 4: '৪র্থ', 5: '৫ম',
  6: '৬ষ্ঠ', 7: '৭ম', 8: '৮ম', 9: '৯ম', 10: '১০ম',
};

const CLASS_SHORT: Record<string, string> = {
  'class-1': '১ম', 'class-2': '২য়', 'class-3': '৩য়', 'class-4': '৪র্থ',
  'class-5': '৫ম', 'class-6': '৬ষ্ঠ', 'class-7': '৭ম', 'class-8': '৮ম',
  'class-9': '৯ম', 'class-10': '১০ম', 'class-alim-1': 'আলিম-১', 'class-alim-2': 'আলিম-২',
};

const SUBJECT_PALETTE = [
  'bg-green-50 text-green-800', 'bg-blue-50 text-blue-800',
  'bg-purple-50 text-purple-800', 'bg-orange-50 text-orange-800',
  'bg-teal-50 text-teal-800', 'bg-rose-50 text-rose-800',
  'bg-indigo-50 text-indigo-800', 'bg-amber-50 text-amber-800',
  'bg-cyan-50 text-cyan-800', 'bg-pink-50 text-pink-800',
];

function subjectColor(subject: string) {
  if (!subject) return '';
  const hash = subject.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return SUBJECT_PALETTE[hash % SUBJECT_PALETTE.length];
}

function periodHeaderStyle(type: string) {
  if (type === 'break') return 'bg-amber-100 text-amber-800';
  if (type === 'assembly') return 'bg-sky-100 text-sky-800';
  if (type === 'prayer') return 'bg-emerald-100 text-emerald-800';
  return 'bg-purple-50 text-gray-700';
}

function periodCellStyle(type: string) {
  if (type === 'break') return 'bg-amber-50';
  if (type === 'assembly') return 'bg-sky-50/60';
  if (type === 'prayer') return 'bg-emerald-50/60';
  return '';
}

function periodTypeLabel(type: string) {
  if (type === 'break') return 'বিরতি';
  if (type === 'assembly') return 'সমাবেশ';
  if (type === 'prayer') return 'নামায';
  return '';
}

interface Period {
  id: string;
  label: string;
  type: 'class' | 'assembly' | 'break' | 'prayer';
}

interface ScheduleCell {
  subject: string;
  classIds: string[];
}

// teacherId → dayId → periodId → cell
interface MasterRoutine {
  periods: Period[];
  schedule: Record<string, Record<string, Record<string, ScheduleCell>>>;
}

function openPrintWindow(title: string, bodyHtml: string, extraCss = '') {
  const html = `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; padding: 16px; background: #fff; }
  .inst-hdr { text-align: center; border-bottom: 3px double #1e1b4b; padding-bottom: 10px; margin-bottom: 12px; }
  .inst-name { font-size: 20px; font-weight: 900; color: #1e1b4b; }
  .inst-name-en { font-size: 9px; color: #666; font-style: italic; margin-top: 2px; }
  .inst-addr { font-size: 9px; color: #555; margin-top: 3px; }
  .page-sub { text-align: center; font-size: 12px; color: #222; font-weight: 700; margin-bottom: 12px;
              border: 1.5px solid #1e1b4b; padding: 5px 10px; display: inline-block; border-radius: 3px; }
  .page-sub-wrap { text-align: center; margin-bottom: 12px; }
  table { border-collapse: collapse; width: 100%; font-size: 11px; }
  th { background: #1e1b4b; color: white; padding: 7px 6px; text-align: center; border: 1px solid #1e1b4b; font-size: 11px; }
  td { border: 1px solid #ccc; padding: 5px 5px; text-align: center; vertical-align: middle; }
  .teacher-col { text-align: left; background: #f0fdf4; min-width: 130px; }
  .teacher-name { font-weight: 600; font-size: 11px; }
  .teacher-desig { font-size: 9px; color: #777; margin-top: 2px; }
  .subject { font-weight: 600; }
  .class-info { font-size: 9px; color: #666; margin-top: 1px; }
  .non-class td, td.nc { background: #f3f4f6; color: #9ca3af; }
  .break-cell { background: #fef3c7 !important; color: #92400e; }
  .prayer-cell { background: #d1fae5 !important; color: #065f46; }
  .assembly-cell { background: #e0f2fe !important; color: #0c4a6e; }
  .serial-col { width: 26px; font-size: 10px; color: #999; }
  .period-time { font-size: 9px; font-weight: normal; color: #bbb; margin-top: 2px; }
  ${extraCss}
</style>
</head>
<body>
<div class="inst-hdr">
  <div class="inst-name">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div>
  <div class="inst-name-en">Noor-e-Islam Madrasha</div>
  <div class="inst-addr">ঢাকা, বাংলাদেশ</div>
</div>
${bodyHtml}
</body>
</html>`;
  printHtml(html);
}

export default function AdminRoutinePage() {
  const { teachers } = useTeachers();
  const { addNotice } = useNotices();
  const [routine, setRoutine] = useState<MasterRoutine>({ periods: [], schedule: {} });
  const [saved, setSaved] = useState(false);
  const [routineNoticePublished, setRoutineNoticePublished] = useState(false);
  const [activeDay, setActiveDay] = useState('sat');
  const [selectedClassView, setSelectedClassView] = useState(MADRASHA_CLASSES[0]?.id ?? '');

  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [editPeriodId, setEditPeriodId] = useState<string | null>(null);
  const [periodForm, setPeriodForm] = useState({ label: '', type: 'class' as Period['type'] });

  const [cellModal, setCellModal] = useState<{ teacherId: string; dayId: string; periodId: string } | null>(null);
  const [cellForm, setCellForm] = useState({ subject: '', classIds: [] as string[] });

  useEffect(() => {
    kvGet<MasterRoutine>(LS_KEY).then(data => { if (data) setRoutine(data); });
  }, []);

  const persist = useCallback((next: MasterRoutine) => {
    setRoutine(next);
    kvSet(LS_KEY, next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  // --- Period CRUD ---
  const openAddPeriod = () => { setEditPeriodId(null); setPeriodForm({ label: '', type: 'class' }); setShowPeriodModal(true); };
  const openEditPeriod = (p: Period) => { setEditPeriodId(p.id); setPeriodForm({ label: p.label, type: p.type }); setShowPeriodModal(true); };

  const savePeriod = () => {
    if (!periodForm.label.trim()) return;
    const period: Period = { id: editPeriodId ?? `p_${Date.now()}`, label: periodForm.label.trim(), type: periodForm.type };
    const periods = editPeriodId
      ? routine.periods.map(p => p.id === editPeriodId ? period : p)
      : [...routine.periods, period];
    persist({ ...routine, periods });
    setShowPeriodModal(false);
  };

  const deletePeriod = (id: string) => {
    const schedule = JSON.parse(JSON.stringify(routine.schedule));
    for (const tid of Object.keys(schedule)) {
      for (const did of Object.keys(schedule[tid] ?? {})) {
        delete schedule[tid]?.[did]?.[id];
      }
    }
    persist({ ...routine, periods: routine.periods.filter(p => p.id !== id), schedule });
  };

  // --- Cell modal ---
  const openCell = (teacherId: string, dayId: string, periodId: string) => {
    const existing = routine.schedule[teacherId]?.[dayId]?.[periodId];
    setCellForm({ subject: existing?.subject ?? '', classIds: existing?.classIds ?? [] });
    setCellModal({ teacherId, dayId, periodId });
  };

  const saveCell = () => {
    if (!cellModal) return;
    const { teacherId, dayId, periodId } = cellModal;
    const schedule = JSON.parse(JSON.stringify(routine.schedule));
    if (!schedule[teacherId]) schedule[teacherId] = {};
    if (!schedule[teacherId][dayId]) schedule[teacherId][dayId] = {};
    schedule[teacherId][dayId][periodId] = { subject: cellForm.subject.trim(), classIds: cellForm.classIds };
    persist({ ...routine, schedule });
    setCellModal(null);
  };

  const clearCell = () => {
    if (!cellModal) return;
    const { teacherId, dayId, periodId } = cellModal;
    const schedule = JSON.parse(JSON.stringify(routine.schedule));
    if (schedule[teacherId]?.[dayId]) delete schedule[teacherId][dayId][periodId];
    persist({ ...routine, schedule });
    setCellModal(null);
  };

  const toggleClass = (classId: string) => {
    setCellForm(p => ({
      ...p,
      classIds: p.classIds.includes(classId) ? p.classIds.filter(c => c !== classId) : [...p.classIds, classId],
    }));
  };

  // --- Per-class helper: find which teacher teaches this class on a given day/period ---
  const getClassCell = (classId: string, dayId: string, periodId: string) => {
    for (const t of teachers) {
      const cell = routine.schedule[t.id]?.[dayId]?.[periodId];
      if (cell?.classIds?.includes(classId)) return { subject: cell.subject, teacher: t.name };
    }
    return null;
  };

  // Period numbering (only class-type periods get ordinals)
  let cn = 0;
  const periodsWithNum = routine.periods.map(p => {
    if (p.type === 'class') cn++;
    return { ...p, classNum: p.type === 'class' ? cn : null };
  });

  const cellTeacher = teachers.find(t => t.id === cellModal?.teacherId);
  const cellPeriod = routine.periods.find(p => p.id === cellModal?.periodId);
  const cellDay = DAYS.find(d => d.id === cellModal?.dayId);

  const publishRoutineNotice = () => {
    const periodCount = routine.periods.filter(p => p.type === 'class').length;
    addNotice({
      id: `n${Date.now()}`,
      title: 'নতুন ক্লাস রুটিন প্রকাশিত',
      content: `এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসার ২০২৪-২৫ শিক্ষাবর্ষের ক্লাস রুটিন চূড়ান্তভাবে প্রকাশিত হয়েছে।${periodCount > 0 ? ` সপ্তাহে ${periodCount}টি ক্লাস পিরিয়ড নির্ধারিত।` : ''} সকল শিক্ষার্থী ও শিক্ষককে রুটিন অনুযায়ী উপস্থিত থাকার অনুরোধ করা হচ্ছে।`,
      date: new Date().toISOString().split('T')[0],
      type: 'general', target: 'all', isImportant: false, postedBy: 'Admin',
    });
    setRoutineNoticePublished(true);
    setTimeout(() => setRoutineNoticePublished(false), 3000);
  };

  // --- PDF: master routine for active day ---
  const printMaster = () => {
    const dayLabel = DAYS.find(d => d.id === activeDay)?.label ?? activeDay;
    const headCols = periodsWithNum.map(p =>
      p.type === 'class'
        ? `<th>${BANGLA_ORDINALS[p.classNum!] ?? p.classNum}<div class="period-time">${p.label}</div></th>`
        : `<th style="background:#374151">${p.label}</th>`
    ).join('');

    const rows = teachers.map((t, idx) => {
      const cells = periodsWithNum.map(period => {
        const cell = routine.schedule[t.id]?.[activeDay]?.[period.id];
        if (period.type !== 'class') return `<td class="nc">${periodTypeLabel(period.type)}</td>`;
        if (!cell?.subject) return `<td>—</td>`;
        const classLabel = (cell.classIds ?? []).map(c => CLASS_SHORT[c] ?? c).join('/');
        return `<td><div class="subject">${cell.subject}</div>${classLabel ? `<div class="class-info">${classLabel}</div>` : ''}</td>`;
      }).join('');
      return `<tr><td class="serial-col">${idx + 1}</td><td class="teacher-col"><div class="teacher-name">${t.name}</div><div class="teacher-desig">${t.designation}</div></td>${cells}</tr>`;
    }).join('');

    openPrintWindow(`মাস্টার রুটিন — ${dayLabel}`, `
      <div class="page-sub-wrap"><span class="page-sub">মাস্টার ক্লাস রুটিন — ${dayLabel} | ২০২৪-২৫</span></div>
      <table>
        <thead><tr><th class="serial-col">ক্র.</th><th>শিক্ষকের নাম ও পদবী</th>${headCols}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `, '@media print { @page { margin: 1cm; size: A4 landscape; } }');
  };

  // --- PDF: per-class full-week routine (rows=periods, cols=days) ---
  const printClassRoutine = (classId: string) => {
    const classInfo = MADRASHA_CLASSES.find(c => c.id === classId);
    const dayCols = DAYS.map(d => `<th>${d.label}</th>`).join('');

    const rows = periodsWithNum.map(p => {
      if (p.type !== 'class') {
        const bg = p.type === 'break' ? 'break-cell' : p.type === 'prayer' ? 'prayer-cell' : 'assembly-cell';
        return `<tr>
          <td class="${bg}"><strong>${p.label}</strong><div class="period-time">${periodTypeLabel(p.type)}</div></td>
          ${DAYS.map(() => `<td class="${bg}"></td>`).join('')}
        </tr>`;
      }
      const cells = DAYS.map(d => {
        const e = getClassCell(classId, d.id, p.id);
        if (!e) return `<td>—</td>`;
        return `<td><div class="subject">${e.subject}</div><div class="class-info">${e.teacher}</div></td>`;
      }).join('');
      return `<tr>
        <td><strong>${BANGLA_ORDINALS[p.classNum!] ?? p.classNum + 'ম'}</strong><div class="period-time">${p.label}</div></td>
        ${cells}
      </tr>`;
    }).join('');

    openPrintWindow(`${classInfo?.nameBn} রুটিন`, `
      <div class="page-sub-wrap"><span class="page-sub">${classInfo?.nameBn} — সাপ্তাহিক ক্লাস রুটিন | ২০২৪-২৫</span></div>
      <table>
        <thead><tr><th style="min-width:90px">পিরিয়ড / সময়</th>${dayCols}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `, '@media print { @page { margin: 1cm; size: A4 landscape; } }');
  };

  return (
    <div>
      <DashboardHeader title="ক্লাস রুটিন" subtitle="মাস্টার রুটিন তৈরি ও সম্পাদনা করুন" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <Save size={14} /> সংরক্ষিত হয়েছে!
          </div>
        )}

        {/* Period setup */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">পিরিয়ড সেটআপ</h3>
              <p className="text-xs text-gray-400 mt-0.5">টেবিলের কলামগুলো এখান থেকে তৈরি করুন</p>
            </div>
            <button onClick={openAddPeriod} className="flex items-center gap-1.5 text-xs btn-primary px-3 py-1.5 rounded-lg font-semibold">
              <Plus size={13} /> পিরিয়ড যোগ করুন
            </button>
          </div>
          {routine.periods.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              প্রথমে পিরিয়ড যোগ করুন — যেমন: সমাবেশ → ৯:০০-১০:১০ → ১০:১০-১০:৪৫ → বিরতি
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 px-5 py-4">
              {periodsWithNum.map(p => (
                <div key={p.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
                  p.type === 'break' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                  p.type === 'assembly' ? 'bg-sky-50 border-sky-200 text-sky-700' :
                  p.type === 'prayer' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                  'bg-purple-50 border-purple-200 text-purple-700'
                }`}>
                  {p.classNum != null && <span className="font-bold">{BANGLA_ORDINALS[p.classNum] ?? `${p.classNum}ম`}:</span>}
                  <span>{p.label}</span>
                  <button onClick={() => openEditPeriod(p)} className="ml-1 hover:opacity-60"><Edit2 size={9} /></button>
                  <button onClick={() => deletePeriod(p.id)} className="hover:opacity-60"><X size={9} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Master routine table */}
        {routine.periods.length > 0 && teachers.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-[#1e1b4b] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base">মাস্টার ক্লাস রুটিন</h2>
                <p className="text-purple-300 text-xs mt-0.5">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা | ২০২৪-২৫</p>
              </div>
              <button onClick={printMaster}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors">
                <Download size={13} /> PDF ডাউনলোড
              </button>
              {routineNoticePublished ? (
                <span className="flex items-center gap-1.5 bg-green-500 text-white text-xs px-4 py-2 rounded-lg font-semibold">
                  <CheckCircle size={13} /> নোটিশ প্রকাশিত!
                </span>
              ) : (
                <button onClick={publishRoutineNotice}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs px-4 py-2 rounded-lg font-semibold transition-colors">
                  <Bell size={13} /> নোটিশ প্রকাশ করুন
                </button>
              )}
            </div>

            {/* Day selector tabs */}
            <div className="px-5 pt-4 flex gap-1.5 flex-wrap border-b border-gray-100 pb-0">
              {DAYS.map(d => (
                <button key={d.id} onClick={() => setActiveDay(d.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2 -mb-px ${
                    activeDay === d.id
                      ? 'border-purple-600 text-purple-700 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  {d.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="text-xs border-collapse" style={{ minWidth: `${(routine.periods.length + 2) * 90}px`, width: '100%' }}>
                <thead>
                  <tr>
                    <th className="border border-gray-200 px-2 py-3 bg-purple-50 text-gray-500 font-semibold text-center w-8">ক্র.</th>
                    <th className="border border-gray-200 px-3 py-3 bg-purple-50 text-gray-600 font-semibold text-center min-w-[150px]">শিক্ষকের নাম ও পদবী</th>
                    {periodsWithNum.map(p => (
                      <th key={p.id} className={`border border-gray-200 px-2 py-2 font-semibold text-center min-w-[85px] ${periodHeaderStyle(p.type)}`}>
                        {p.type === 'class' ? (
                          <div>
                            <div>{BANGLA_ORDINALS[p.classNum!] ?? `${p.classNum}ম`}</div>
                            <div className="text-[9px] font-normal opacity-70 mt-0.5">{p.label}</div>
                          </div>
                        ) : <span>{p.label}</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher, idx) => (
                    <tr key={teacher.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="border border-gray-200 px-2 py-2 text-center text-gray-400 font-medium">{idx + 1}</td>
                      <td className="border border-gray-200 px-3 py-2 bg-green-50/40">
                        <div className="font-semibold text-gray-800 leading-tight">{teacher.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{teacher.designation}</div>
                      </td>
                      {periodsWithNum.map(period => {
                        const cell = routine.schedule[teacher.id]?.[activeDay]?.[period.id];
                        const isNonClass = period.type !== 'class';
                        const bg = isNonClass ? periodCellStyle(period.type) : (cell?.subject ? subjectColor(cell.subject) : '');
                        const classLabel = (cell?.classIds ?? []).map(c => CLASS_SHORT[c] ?? c).join('/');
                        return (
                          <td key={period.id}
                            onClick={() => !isNonClass && openCell(teacher.id, activeDay, period.id)}
                            className={`border border-gray-200 px-2 py-2 text-center transition-colors ${bg} ${!isNonClass ? 'cursor-pointer hover:opacity-75' : ''}`}>
                            {isNonClass ? (
                              <span className="text-gray-300 text-xs">{periodTypeLabel(period.type)}</span>
                            ) : cell?.subject ? (
                              <div>
                                <div className="font-semibold leading-tight">{cell.subject}</div>
                                {classLabel && <div className="text-[10px] opacity-65 mt-0.5">{classLabel}</div>}
                              </div>
                            ) : (
                              <span className="text-gray-300 text-sm">+</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 text-center">ক্লাস ঘরে ক্লিক করে বিষয় ও শ্রেণি নির্বাচন করুন</p>
            </div>
          </div>
        )}

        {/* Per-class routines (day × period grid) */}
        {routine.periods.length > 0 && teachers.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <BookOpen size={16} className="text-purple-500" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">শ্রেণিভিত্তিক রুটিন</h3>
                <p className="text-xs text-gray-400 mt-0.5">প্রতিটি শ্রেণির সাপ্তাহিক রুটিন — পিরিয়ড × বার</p>
              </div>
            </div>

            {/* Class tabs */}
            <div className="px-5 pt-3 flex gap-1.5 flex-wrap border-b border-gray-100 pb-0">
              {MADRASHA_CLASSES.map(c => (
                <button key={c.id} onClick={() => setSelectedClassView(c.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2 -mb-px ${
                    selectedClassView === c.id
                      ? 'border-purple-600 text-purple-700 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  {CLASS_SHORT[selectedClassView === c.id ? c.id : c.id] && CLASS_SHORT[c.id]}
                </button>
              ))}
            </div>

            {(() => {
              const classInfo = MADRASHA_CLASSES.find(c => c.id === selectedClassView);
              const hasAnyData = DAYS.some(d =>
                periodsWithNum.some(p => p.type === 'class' && getClassCell(selectedClassView, d.id, p.id))
              );
              return (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{classInfo?.nameBn}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">সাপ্তাহিক সম্পূর্ণ রুটিন</p>
                    </div>
                    {hasAnyData && (
                      <button onClick={() => printClassRoutine(selectedClassView)}
                        className="flex items-center gap-1.5 text-xs btn-primary px-3 py-2 rounded-lg font-semibold">
                        <Download size={13} /> PDF ডাউনলোড
                      </button>
                    )}
                  </div>

                  {!hasAnyData ? (
                    <div className="py-10 text-center text-gray-400">
                      <p className="text-sm">এই শ্রেণির জন্য কোনো বিষয় অ্যাসাইন হয়নি।</p>
                      <p className="text-xs mt-1">উপরের মাস্টার টেবিলে ঘর ক্লিক করে এই শ্রেণি সিলেক্ট করুন।</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="text-xs border-collapse" style={{ minWidth: '700px', width: '100%' }}>
                        <thead>
                          <tr className="bg-[#1e1b4b] text-white">
                            <th className="px-3 py-3 text-center font-semibold border border-[#2d2a6e] min-w-[90px]">পিরিয়ড</th>
                            {DAYS.map(d => (
                              <th key={d.id} className="px-2 py-3 text-center font-semibold border border-[#2d2a6e] min-w-[100px]">{d.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {periodsWithNum.map(p => {
                            if (p.type !== 'class') {
                              const rowBg = p.type === 'break' ? 'bg-amber-50' : p.type === 'prayer' ? 'bg-emerald-50' : 'bg-sky-50';
                              const rowText = p.type === 'break' ? 'text-amber-700' : p.type === 'prayer' ? 'text-emerald-700' : 'text-sky-700';
                              return (
                                <tr key={p.id} className={rowBg}>
                                  <td className={`border border-gray-200 px-3 py-2.5 text-center font-semibold ${rowText}`}>
                                    <div>{p.label}</div>
                                    <div className="text-[10px] opacity-70">{periodTypeLabel(p.type)}</div>
                                  </td>
                                  {DAYS.map(d => (
                                    <td key={d.id} className={`border border-gray-200 ${rowBg}`}></td>
                                  ))}
                                </tr>
                              );
                            }
                            return (
                              <tr key={p.id} className="hover:bg-purple-50/20">
                                <td className="border border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-700">
                                  <div>{BANGLA_ORDINALS[p.classNum!] ?? `${p.classNum}ম`}</div>
                                  <div className="text-[10px] text-gray-400 font-normal">{p.label}</div>
                                </td>
                                {DAYS.map(d => {
                                  const entry = getClassCell(selectedClassView, d.id, p.id);
                                  return (
                                    <td key={d.id} className="border border-gray-200 px-2 py-2.5 text-center">
                                      {entry ? (
                                        <div>
                                          <div className={`font-semibold text-[11px] leading-tight px-1 py-0.5 rounded ${subjectColor(entry.subject)}`}>{entry.subject}</div>
                                          <div className="text-[10px] text-gray-400 mt-0.5">{entry.teacher}</div>
                                        </div>
                                      ) : (
                                        <span className="text-gray-200">—</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Period modal */}
      {showPeriodModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">{editPeriodId ? 'পিরিয়ড সম্পাদনা' : 'নতুন পিরিয়ড'}</h3>
              <button onClick={() => setShowPeriodModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">লেবেল *</label>
                <input type="text" value={periodForm.label}
                  onChange={e => setPeriodForm(p => ({ ...p, label: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && savePeriod()}
                  placeholder="যেমন: ৯:০০-১০:১০ বা বিরতি"
                  autoFocus
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">ধরন</label>
                <div className="flex gap-2 flex-wrap">
                  {PERIOD_TYPES.map(t => (
                    <label key={t.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${periodForm.type === t.id ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <input type="radio" name="ptype" className="sr-only" checked={periodForm.type === t.id} onChange={() => setPeriodForm(p => ({ ...p, type: t.id as Period['type'] }))} />
                      {t.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <button onClick={savePeriod} className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold">সংরক্ষণ</button>
              <button onClick={() => setShowPeriodModal(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* Cell modal */}
      {cellModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-900">বিষয় নির্ধারণ</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {cellTeacher?.name} — {cellDay?.label} — {cellPeriod?.label}
                </p>
              </div>
              <button onClick={() => setCellModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">বিষয় *</label>
                <input type="text" value={cellForm.subject}
                  onChange={e => setCellForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="যেমন: আরবী, গণিত, ইংরেজি"
                  autoFocus
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">শ্রেণি নির্বাচন করুন</label>
                <div className="grid grid-cols-3 gap-2">
                  {MADRASHA_CLASSES.map(c => {
                    const checked = cellForm.classIds.includes(c.id);
                    return (
                      <label key={c.id} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border cursor-pointer text-xs font-medium transition-all ${checked ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-purple-300'}`}>
                        <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleClass(c.id)} />
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-white border-white' : 'border-gray-400'}`}>
                          {checked && <div className="w-2 h-2 bg-purple-600 rounded-sm" />}
                        </div>
                        {c.nameBn}
                      </label>
                    );
                  })}
                </div>
                {cellForm.classIds.length > 0 && (
                  <p className="text-xs text-purple-600 mt-2 font-medium">
                    নির্বাচিত: {cellForm.classIds.map(id => CLASS_SHORT[id] ?? id).join(', ')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <button onClick={saveCell} className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold">সংরক্ষণ</button>
              {routine.schedule[cellModal.teacherId]?.[cellModal.dayId]?.[cellModal.periodId]?.subject && (
                <button onClick={clearCell} className="px-4 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm">মুছুন</button>
              )}
              <button onClick={() => setCellModal(null)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
