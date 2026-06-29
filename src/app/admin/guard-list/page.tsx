'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useTeachers } from '@/context/TeachersContext';
import { Shield, Shuffle, Download, Calendar, X, Bell, CheckCircle, ChevronDown, Users } from 'lucide-react';
import { useNotices } from '@/context/NoticesContext';
import type { Teacher } from '@/lib/types';
import { printHtml } from '@/lib/print-utils';
import { kvGet, kvSet } from '@/lib/supabase/kv';

const EXAMS_KEY = 'nim_exams_v1';
const ENTRIES_KEY = 'nim_exam_entries_v1';
const HALLS_KEY = 'nim_halls_v1';
const GUARDS_KEY = 'nim_guard_assignments_v1';
const AVAIL_KEY = 'nim_guard_availability_v1';

interface Exam { id: string; name: string; year: string; }
interface ExamEntry { examId: string; subject: string; date: string; startTime: string; endTime: string; classIds: string[]; }
interface Hall { id: string; examId: string; hallName: string; capacity: number; }
interface GuardAssignment { examId: string; date: string; hallId: string; teacherId: string; }
interface TeacherAvail { available: boolean; maxDays: number; }
type AvailMap = Record<string, TeacherAvail>;

const MONTHS_BN = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
function fmtDate(d: string) {
  if (!d) return d;
  const p = d.split('-');
  if (p.length !== 3) return d;
  return `${parseInt(p[2])} ${MONTHS_BN[parseInt(p[1]) - 1] ?? ''}, ${p[0]}`;
}
function todayBn() {
  const d = new Date();
  return `${d.getDate()} ${MONTHS_BN[d.getMonth()]}, ${d.getFullYear()}`;
}

function runAutoAssign(
  examId: string,
  dates: string[],
  halls: Hall[],
  pool: { teacher: Teacher; maxDays: number }[]
): GuardAssignment[] {
  if (!dates.length || !halls.length || !pool.length) return [];
  const result: GuardAssignment[] = [];
  const hallHistory: Record<string, Set<string>> = {};
  halls.forEach(h => { hallHistory[h.id] = new Set(); });
  const usedDays: Record<string, number> = {};
  pool.forEach(({ teacher }) => { usedDays[teacher.id] = 0; });

  [...dates].sort().forEach((date, di) => {
    const todayUsed = new Set<string>();
    halls.forEach((hall, hi) => {
      const eligible = pool.filter(({ teacher, maxDays }) =>
        usedDays[teacher.id] < maxDays && !todayUsed.has(teacher.id)
      );
      const best = eligible.filter(({ teacher }) => !hallHistory[hall.id].has(teacher.id));
      const candidates = best.length ? best : eligible.length ? eligible : pool.filter(({ teacher }) => !todayUsed.has(teacher.id));
      if (!candidates.length) return;
      const pick = candidates[(di * halls.length + hi) % candidates.length];
      result.push({ examId, date, hallId: hall.id, teacherId: pick.teacher.id });
      hallHistory[hall.id].add(pick.teacher.id);
      todayUsed.add(pick.teacher.id);
      usedDays[pick.teacher.id]++;
    });
  });
  return result;
}

const PDF_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;color:#111;background:#fff;font-size:11px;line-height:1.5}
.page{max-width:780px;margin:0 auto;padding:20px 24px}
.hdr{text-align:center;border-bottom:3px double #1e1b4b;padding-bottom:10px;margin-bottom:16px}
.hdr-pre{font-size:8.5px;color:#666;letter-spacing:1px;text-transform:uppercase;margin-bottom:3px}
.hdr-name{font-size:22px;font-weight:900;color:#1e1b4b}
.hdr-en{font-size:10px;color:#555;font-style:italic;margin-top:2px}
.hdr-addr{font-size:9.5px;color:#444;margin-top:4px}
.notice-box{border:2px solid #1e1b4b;border-radius:3px;padding:7px 16px;text-align:center;margin:0 0 16px;background:#f8f7ff}
.n-label{font-size:9px;color:#666;letter-spacing:1.5px;text-transform:uppercase}
.n-title{font-size:15px;font-weight:bold;color:#1e1b4b;margin-top:3px}
.n-sub{font-size:9.5px;color:#555;margin-top:2px}
table{width:100%;border-collapse:collapse;font-size:10.5px}
thead tr{background:#1e1b4b}
thead th{color:#fff;padding:6px 10px;border:1px solid #1e1b4b;font-weight:600;text-align:center}
th.left,td.left{text-align:left}
tbody tr:nth-child(even){background:#f5f4ff}
tbody tr:nth-child(odd){background:#fff}
td{border:1px solid #c8c6e0;padding:5px 10px;text-align:center;vertical-align:middle}
.sig-row{display:flex;justify-content:space-between;margin-top:36px}
.sig-col{text-align:center;min-width:140px}
.sig-line{border-top:1px solid #333;padding-top:4px;font-size:9.5px;font-weight:600}
.sig-sub{font-size:8.5px;color:#555;margin-top:2px}
.issue{font-size:9px;color:#666;text-align:right;margin-top:8px}
@media print{@page{size:A4 portrait;margin:1.2cm}}
`;

export default function AdminGuardListPage() {
  const { teachers } = useTeachers();
  const { addNotice } = useNotices();
  const [exams, setExams] = useState<Exam[]>([]);
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [guards, setGuards] = useState<GuardAssignment[]>([]);
  const [allAvail, setAllAvail] = useState<Record<string, AvailMap>>({});
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [guardNoticePublished, setGuardNoticePublished] = useState<string | null>(null);
  const [showAvailPanel, setShowAvailPanel] = useState(false);

  useEffect(() => {
    Promise.all([
      kvGet<typeof exams>(EXAMS_KEY),
      kvGet<typeof entries>(ENTRIES_KEY),
      kvGet<typeof halls>(HALLS_KEY),
      kvGet<typeof guards>(GUARDS_KEY),
      kvGet<typeof allAvail>(AVAIL_KEY),
    ]).then(([examsData, entriesData, hallsData, guardsData, availData]) => {
      if (examsData) { setExams(examsData); if (examsData.length > 0) setSelectedExamId(examsData[0].id); }
      if (entriesData) setEntries(entriesData);
      if (hallsData) setHalls(hallsData);
      if (guardsData) setGuards(guardsData);
      if (availData) setAllAvail(availData);
    });
  }, []);

  const saveGuards = (data: GuardAssignment[]) => {
    setGuards(data);
    kvSet(GUARDS_KEY, data);
  };

  const saveAvail = (avail: AvailMap) => {
    if (!selectedExamId) return;
    const updated = { ...allAvail, [selectedExamId]: avail };
    setAllAvail(updated);
    kvSet(AVAIL_KEY, updated);
  };

  const selectedExam = exams.find(e => e.id === selectedExamId);
  const examHalls = halls.filter(h => h.examId === selectedExamId);
  const examGuards = guards.filter(g => g.examId === selectedExamId);
  const examAvail: AvailMap = allAvail[selectedExamId ?? ''] ?? {};

  const examDates = useMemo(() => {
    const s = new Set<string>();
    entries.filter(e => e.examId === selectedExamId && e.date).forEach(e => s.add(e.date));
    return [...s].sort();
  }, [entries, selectedExamId]);

  const entriesByDate = useMemo(() => {
    const m: Record<string, ExamEntry[]> = {};
    entries.filter(e => e.examId === selectedExamId).forEach(e => { (m[e.date] ??= []).push(e); });
    return m;
  }, [entries, selectedExamId]);

  const getTeacherAvail = (teacherId: string): TeacherAvail =>
    examAvail[teacherId] ?? { available: true, maxDays: Math.max(1, examDates.length) };

  const updateAvail = (teacherId: string, update: Partial<TeacherAvail>) => {
    const cur = getTeacherAvail(teacherId);
    saveAvail({ ...examAvail, [teacherId]: { ...cur, ...update } });
  };

  const availableTeachers = teachers.filter(t => getTeacherAvail(t.id).available);

  const buildAvailPool = () =>
    availableTeachers.map(t => ({ teacher: t, maxDays: getTeacherAvail(t.id).maxDays }));

  const handleAutoAssign = () => {
    if (!selectedExamId || !examDates.length || !examHalls.length) return;
    const pool = buildAvailPool();
    if (!pool.length) return;
    const newG = runAutoAssign(selectedExamId, examDates, examHalls, pool);
    saveGuards([...guards.filter(g => g.examId !== selectedExamId), ...newG]);
  };

  const clearAssignments = () => saveGuards(guards.filter(g => g.examId !== selectedExamId));

  const publishGuardNotice = () => {
    if (!selectedExam) return;
    addNotice({
      id: `n${Date.now()}`,
      title: `${selectedExam.name} — গার্ড তালিকা চূড়ান্ত`,
      content: `${selectedExam.name} (${selectedExam.year}) পরীক্ষার হলে দায়িত্বরত শিক্ষকদের তালিকা চূড়ান্ত করা হয়েছে। মোট ${examHalls.length}টি হল ও ${examDates.length}টি পরীক্ষার তারিখে বরাদ্দ সম্পন্ন।`,
      date: new Date().toISOString().split('T')[0],
      type: 'exam', target: 'teacher', isImportant: true, postedBy: 'Admin',
    });
    setGuardNoticePublished(selectedExam.id);
    setTimeout(() => setGuardNoticePublished(null), 3000);
  };

  const getGuardTeacher = (date: string, hallId: string) => {
    const g = examGuards.find(g => g.date === date && g.hallId === hallId);
    return g ? teachers.find(t => t.id === g.teacherId) ?? null : null;
  };

  const downloadPdf = () => {
    if (!selectedExam || !examDates.length || !examHalls.length) return;
    const hallThs = examHalls.map(h => `<th>${h.hallName}</th>`).join('');
    const rows = examDates.map((date, di) => {
      const subjects = (entriesByDate[date] ?? []).map(e => e.subject).join(', ');
      const guardCells = examHalls.map(hall => {
        const t = getGuardTeacher(date, hall.id);
        return `<td>${t ? (t.nameBn || t.name) : '—'}</td>`;
      }).join('');
      return `<tr>
        <td style="width:28px">${di + 1}</td>
        <td class="left">${fmtDate(date)}</td>
        <td class="left">${subjects || '—'}</td>
        ${guardCells}
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html lang="bn"><head>
<meta charset="utf-8"><title>গার্ড তালিকা — ${selectedExam.name}</title>
<style>${PDF_CSS}</style>
</head><body><div class="page">
<div class="hdr">
  <div class="hdr-pre">প্রতিষ্ঠিত ১৯৭৫</div>
  <div class="hdr-name">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div>
  <div class="hdr-en">Noor-e-Islam Madrasha</div>
  <div class="hdr-addr">ঢাকা, বাংলাদেশ | ফোন: ০১৭XX-XXXXXX</div>
</div>
<div class="notice-box">
  <div class="n-label">পরীক্ষার গার্ড তালিকা</div>
  <div class="n-title">${selectedExam.name}</div>
  <div class="n-sub">শিক্ষাবর্ষ: ${selectedExam.year} &nbsp;|&nbsp; মোট তারিখ: ${examDates.length}টি &nbsp;|&nbsp; হল: ${examHalls.length}টি</div>
</div>
<table>
  <thead><tr>
    <th style="width:28px">ক্র.</th>
    <th class="left" style="width:130px">তারিখ</th>
    <th class="left">বিষয়সমূহ</th>
    ${hallThs}
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="sig-row">
  <div class="sig-col"><div class="sig-line">পরীক্ষা নিয়ন্ত্রক</div><div class="sig-sub">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div></div>
  <div class="sig-col"><div class="sig-line">অধ্যক্ষ</div><div class="sig-sub">এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা</div></div>
</div>
<div class="issue">প্রকাশের তারিখ: ${todayBn()}</div>
</div>
</body></html>`;

    printHtml(html);
  };

  return (
    <div>
      <DashboardHeader title="পরীক্ষার গার্ড তালিকা" subtitle="হলে দায়িত্বরত শিক্ষক বরাদ্দ ও ব্যবস্থাপনা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {/* Exam selector */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">পরীক্ষা নির্বাচন</h3>
          {exams.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <Calendar size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">কোনো পরীক্ষা নেই।</p>
              <p className="text-xs mt-1">পরীক্ষা সময়সূচী থেকে আগে পরীক্ষা তৈরি করুন।</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {exams.map(exam => (
                <button key={exam.id} onClick={() => setSelectedExamId(exam.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${selectedExamId === exam.id ? 'bg-[#1e1b4b] text-white border-transparent shadow-md' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300'}`}>
                  <Shield size={14} />
                  {exam.name}
                  <span className={`text-xs ${selectedExamId === exam.id ? 'text-purple-200' : 'text-gray-400'}`}>{exam.year}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedExam && (
          <>
            {/* Action bar */}
            <div className="bg-[#1e1b4b] text-white rounded-2xl px-5 py-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-bold">{selectedExam.name}</h2>
                <p className="text-purple-300 text-xs mt-0.5">
                  {examHalls.length}টি হল &nbsp;·&nbsp; {examDates.length}টি দিন &nbsp;·&nbsp;
                  <span className={availableTeachers.length === 0 ? 'text-red-300' : 'text-green-300'}>
                    {availableTeachers.length}/{teachers.length} জন শিক্ষক উপলব্ধ
                  </span>
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {examHalls.length > 0 && examDates.length > 0 && availableTeachers.length > 0 && (
                  <button onClick={handleAutoAssign}
                    className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs px-4 py-2 rounded-lg font-semibold">
                    <Shuffle size={13} /> স্বয়ংক্রিয় বরাদ্দ
                  </button>
                )}
                {examGuards.length > 0 && (
                  <>
                    <button onClick={downloadPdf}
                      className="flex items-center gap-1.5 bg-white text-[#1e1b4b] text-xs px-4 py-2 rounded-lg font-semibold hover:bg-purple-50">
                      <Download size={13} /> PDF
                    </button>
                    {guardNoticePublished === selectedExam.id ? (
                      <span className="flex items-center gap-1.5 bg-green-500 text-white text-xs px-4 py-2 rounded-lg font-semibold">
                        <CheckCircle size={13} /> নোটিশ প্রকাশিত!
                      </span>
                    ) : (
                      <button onClick={publishGuardNotice}
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs px-4 py-2 rounded-lg font-semibold">
                        <Bell size={13} /> নোটিশ প্রকাশ করুন
                      </button>
                    )}
                    <button onClick={clearAssignments}
                      className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-2 rounded-lg font-medium">
                      <X size={13} /> মুছুন
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Teacher availability panel */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button onClick={() => setShowAvailPanel(v => !v)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-purple-600" />
                  <span className="font-semibold text-gray-700 text-sm">শিক্ষকের গার্ড প্রাপ্যতা নির্ধারণ</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${availableTeachers.length > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {availableTeachers.length}/{teachers.length} জন সক্রিয়
                  </span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showAvailPanel ? 'rotate-180' : ''}`} />
              </button>

              {showAvailPanel && (
                <div className="border-t border-gray-100 p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs text-gray-500">
                      পরীক্ষা মোট <strong>{examDates.length} দিন</strong>।
                      প্রতিটি শিক্ষকের জন্য নির্ধারণ করুন — তিনি গার্ড দেবেন কিনা এবং সর্বোচ্চ কতদিন।
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => saveAvail(Object.fromEntries(teachers.map(t => [t.id, { available: true, maxDays: examDates.length || 1 }])))}
                        className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-medium">
                        সবাইকে সক্রিয়
                      </button>
                      <button onClick={() => saveAvail(Object.fromEntries(teachers.map(t => [t.id, { available: false, maxDays: 0 }])))}
                        className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-medium">
                        সবাইকে বন্ধ
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                    {teachers.map(t => {
                      const avail = getTeacherAvail(t.id);
                      const maxLimit = Math.max(1, examDates.length);
                      return (
                        <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${avail.available ? 'bg-purple-50/60 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="w-8 h-8 gradient-primary rounded-lg text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {(t.nameBn || t.name)[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{t.nameBn || t.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{t.designation}</p>
                          </div>
                          {avail.available && examDates.length > 0 && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => updateAvail(t.id, { maxDays: Math.max(1, avail.maxDays - 1) })}
                                className="w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 text-xs font-bold leading-none">
                                −
                              </button>
                              <span className="text-xs font-bold text-purple-700 w-6 text-center tabular-nums">{avail.maxDays}</span>
                              <button
                                onClick={() => updateAvail(t.id, { maxDays: Math.min(maxLimit, avail.maxDays + 1) })}
                                className="w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 text-xs font-bold leading-none">
                                +
                              </button>
                              <span className="text-[9px] text-gray-400 ml-0.5">দিন</span>
                            </div>
                          )}
                          <button
                            onClick={() => updateAvail(t.id, { available: !avail.available, maxDays: avail.available ? 0 : maxLimit })}
                            className={`shrink-0 text-[10px] px-2 py-1 rounded-lg font-semibold transition-colors ${avail.available ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600' : 'bg-red-50 text-red-500 hover:bg-green-100 hover:text-green-700'}`}>
                            {avail.available ? 'সক্রিয়' : 'বন্ধ'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {availableTeachers.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                      <span>সক্রিয়: <strong className="text-purple-700">{availableTeachers.length} জন</strong></span>
                      <span>মোট বরাদ্দযোগ্য দিন: <strong className="text-purple-700">{availableTeachers.reduce((s, t) => s + getTeacherAvail(t.id).maxDays, 0)}</strong></span>
                      <span>প্রয়োজনীয় দিন (হল × দিন): <strong className="text-purple-700">{examHalls.length * examDates.length}</strong></span>
                      {availableTeachers.reduce((s, t) => s + getTeacherAvail(t.id).maxDays, 0) < examHalls.length * examDates.length && (
                        <span className="text-amber-600">⚠ শিক্ষক ঘাটতি — কিছু দিন পুনরাবৃত্তি হতে পারে</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Warnings */}
            {examHalls.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
                এই পরীক্ষার জন্য কোনো হল যোগ করা হয়নি। <strong>আসন পরিকল্পনা</strong> পাতা থেকে হল যোগ করুন।
              </div>
            )}
            {examDates.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
                এই পরীক্ষার কোনো সময়সূচী এন্ট্রি নেই। <strong>পরীক্ষা সময়সূচী</strong> পাতা থেকে এন্ট্রি যোগ করুন।
              </div>
            )}
            {availableTeachers.length === 0 && teachers.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
                কোনো শিক্ষক সক্রিয় নেই। উপরে &quot;শিক্ষকের গার্ড প্রাপ্যতা&quot; অংশে অন্তত একজন শিক্ষককে সক্রিয় করুন।
              </div>
            )}

            {/* Guard table */}
            {examDates.length > 0 && examHalls.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <Shield size={15} className="text-purple-600" />
                  <span className="font-semibold text-gray-700 text-sm">তারিখভিত্তিক গার্ড বরাদ্দ</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {examGuards.length > 0 ? `${examGuards.length}টি বরাদ্দ হয়েছে` : 'এখনো বরাদ্দ হয়নি — উপরে "স্বয়ংক্রিয় বরাদ্দ" ক্লিক করুন'}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#1e1b4b] text-white">
                        <th className="px-4 py-3 text-left font-semibold w-8">ক্র.</th>
                        <th className="px-4 py-3 text-left font-semibold w-36">তারিখ</th>
                        <th className="px-4 py-3 text-left font-semibold">বিষয়সমূহ</th>
                        {examHalls.map(h => (
                          <th key={h.id} className="px-4 py-3 text-center font-semibold w-36">{h.hallName}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {examDates.map((date, di) => {
                        const subjects = (entriesByDate[date] ?? []).map(e => e.subject).join(', ');
                        return (
                          <tr key={date} className={di % 2 === 0 ? 'bg-white' : 'bg-purple-50/20'}>
                            <td className="px-4 py-3 text-gray-400">{di + 1}</td>
                            <td className="px-4 py-3 font-medium text-gray-700">{fmtDate(date)}</td>
                            <td className="px-4 py-3 text-gray-500">{subjects || '—'}</td>
                            {examHalls.map(hall => {
                              const teacher = getGuardTeacher(date, hall.id);
                              return (
                                <td key={hall.id} className="px-4 py-3 text-center">
                                  {teacher ? (
                                    <div>
                                      <p className="font-semibold text-gray-800">{teacher.nameBn || teacher.name}</p>
                                      <p className="text-[10px] text-gray-400 mt-0.5">{teacher.designation}</p>
                                    </div>
                                  ) : (
                                    <span className="text-gray-300 text-[11px]">— বরাদ্দ হয়নি —</span>
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
              </div>
            )}

            {/* Teacher summary */}
            {examGuards.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 text-sm mb-3">শিক্ষকভিত্তিক সারসংক্ষেপ</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {teachers.map(t => {
                    const count = examGuards.filter(g => g.teacherId === t.id).length;
                    const avail = getTeacherAvail(t.id);
                    if (count === 0 && !avail.available) return (
                      <div key={t.id} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-gray-100 bg-gray-50 opacity-50">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg text-gray-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {(t.nameBn || t.name)[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 truncate">{t.nameBn || t.name}</p>
                          <p className="text-[10px] text-gray-400">গার্ড দেবেন না</p>
                        </div>
                      </div>
                    );
                    if (count === 0) return null;
                    const hallNames = [...new Set(
                      examGuards.filter(g => g.teacherId === t.id)
                        .map(g => examHalls.find(h => h.id === g.hallId)?.hallName ?? '?')
                    )].join(', ');
                    return (
                      <div key={t.id} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-purple-100 bg-purple-50/40">
                        <div className="w-8 h-8 gradient-primary rounded-lg text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {(t.nameBn || t.name)[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{t.nameBn || t.name}</p>
                          <p className="text-[10px] text-purple-700 font-semibold">{count}/{avail.maxDays} দিন</p>
                          <p className="text-[10px] text-gray-400 truncate">{hallNames}</p>
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
