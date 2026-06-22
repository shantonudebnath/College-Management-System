'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { TEACHERS, STUDENTS } from '@/lib/data';
import type { Student } from '@/lib/types';
import { CheckCircle, XCircle, Clock, Calendar, Users, GraduationCap, ChevronLeft, ChevronRight, Download, Sun, ChevronDown } from 'lucide-react';

const MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const WEEK_DAYS = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র'];
const HOLIDAYS_KEY = 'nim_holidays_v1';

type DayStatus = 'present' | 'absent' | 'late' | 'holiday';

const seed = (id: string, month: number, year: number, day: number) => {
  let h = 0;
  const str = `${id}-${year}-${month}-${day}`;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h) / 2147483647;
};

const getStatus = (id: string, month: number, year: number, day: number): DayStatus => {
  const r = seed(id, month, year, day);
  if (r < 0.10) return 'absent';
  if (r < 0.16) return 'late';
  return 'present';
};

const STATUS_STYLE: Record<DayStatus, string> = {
  present: 'bg-green-100 text-green-700 border-green-200',
  absent:  'bg-red-100 text-red-700 border-red-200',
  late:    'bg-amber-100 text-amber-700 border-amber-200',
  holiday: 'bg-gray-100 text-gray-400 border-gray-200',
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function AdminAttendancePage() {
  const [section, setSection] = useState<'teacher' | 'student'>('teacher');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>(STUDENTS);
  const [realAtt, setRealAtt] = useState<Map<string, Map<string, 'present' | 'absent' | 'late'>>>(new Map());
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [showHolidayPanel, setShowHolidayPanel] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('students_store');
      if (raw) {
        const stored: Student[] = JSON.parse(raw);
        const ids = new Set(stored.map(s => s.id));
        setAllStudents([...stored, ...STUDENTS.filter(s => !ids.has(s.id))]);
      }
    } catch {}
    try {
      const h = localStorage.getItem(HOLIDAYS_KEY);
      if (h) setHolidays(new Set(JSON.parse(h) as string[]));
    } catch {}
  }, []);

  useEffect(() => {
    if (section !== 'student') return;
    const map = new Map<string, Map<string, 'present' | 'absent' | 'late'>>();
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith('nim_attendance_')) continue;
        const dateStr = key.slice(-10);
        const [y, m] = dateStr.split('-');
        if (parseInt(m, 10) - 1 !== selectedMonth || parseInt(y, 10) !== selectedYear) continue;
        const rec: Record<string, 'present' | 'absent' | 'late'> = JSON.parse(localStorage.getItem(key) ?? '{}');
        for (const [sid, status] of Object.entries(rec)) {
          if (!map.has(sid)) map.set(sid, new Map());
          map.get(sid)!.set(dateStr, status);
        }
      }
    } catch {}
    setRealAtt(map);
  }, [section, selectedMonth, selectedYear]);

  const saveHolidays = useCallback((h: Set<string>) => {
    setHolidays(h);
    localStorage.setItem(HOLIDAYS_KEY, JSON.stringify([...h]));
  }, []);

  const isHoliday = useCallback((day: number, month = selectedMonth, year = selectedYear): boolean => {
    const dt = new Date(year, month, day);
    const dow = dt.getDay();
    if (dow === 5 || dow === 6) return true; // Friday=5, Saturday=6
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.has(dateStr);
  }, [selectedMonth, selectedYear, holidays]);

  const isFriSat = (day: number): boolean => {
    const dow = new Date(selectedYear, selectedMonth, day).getDay();
    return dow === 5 || dow === 6;
  };

  const toggleHoliday = (day: number) => {
    if (isFriSat(day)) return;
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const next = new Set(holidays);
    if (next.has(dateStr)) next.delete(dateStr);
    else next.add(dateStr);
    saveHolidays(next);
  };

  const people = section === 'teacher' ? TEACHERS : allStudents;
  const totalDays = daysInMonth(selectedYear, selectedMonth);

  const effectiveDays = useMemo(() =>
    Array.from({ length: totalDays }, (_, i) => i + 1).filter(d => !isHoliday(d)).length,
    [totalDays, isHoliday]
  );

  const resolveStatus = useCallback((id: string, month: number, year: number, day: number): DayStatus => {
    if (isHoliday(day, month, year)) return 'holiday';
    if (section === 'student') {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return (realAtt.get(id)?.get(dateStr) ?? 'absent') as DayStatus;
    }
    return getStatus(id, month, year, day);
  }, [section, realAtt, isHoliday]);

  const calendarOffset = useMemo(() => {
    const d = new Date(selectedYear, selectedMonth, 1).getDay();
    return (d + 1) % 7;
  }, [selectedMonth, selectedYear]);

  const dayStats = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      if (isHoliday(day)) return { day, present: 0, absent: 0, late: 0, holiday: people.length, total: people.length, isOff: true };
      const statuses = people.map(p => resolveStatus(p.id, selectedMonth, selectedYear, day));
      return {
        day,
        present: statuses.filter(s => s === 'present').length,
        absent:  statuses.filter(s => s === 'absent').length,
        late:    statuses.filter(s => s === 'late').length,
        holiday: statuses.filter(s => s === 'holiday').length,
        total: people.length,
        isOff: false,
      };
    });
  }, [people, selectedMonth, selectedYear, totalDays, resolveStatus, isHoliday]);

  const monthSummary = useMemo(() => {
    const allStatuses = people.flatMap(p =>
      Array.from({ length: totalDays }, (_, i) => resolveStatus(p.id, selectedMonth, selectedYear, i + 1))
    );
    return {
      present: allStatuses.filter(s => s === 'present').length,
      absent:  allStatuses.filter(s => s === 'absent').length,
      late:    allStatuses.filter(s => s === 'late').length,
    };
  }, [people, selectedMonth, selectedYear, totalDays, resolveStatus]);

  const holidaysThisMonth = useMemo(() =>
    Array.from({ length: totalDays }, (_, i) => i + 1).filter(d => isHoliday(d)).length,
    [totalDays, isHoliday]
  );

  const selectedDayData = selectedDay
    ? people.map(p => ({ ...p, status: resolveStatus(p.id, selectedMonth, selectedYear, selectedDay) }))
    : null;

  const getDayBg = (stat: typeof dayStats[0]) => {
    if (stat.isOff) return 'bg-gray-100 border-gray-200 text-gray-400 cursor-default opacity-60';
    const denominator = stat.total;
    if (denominator === 0) return 'bg-gray-50 border-gray-200 text-gray-400';
    const presentRate = (stat.present + stat.late) / denominator;
    if (presentRate >= 0.9) return 'bg-green-100 border-green-300 text-green-800';
    if (presentRate >= 0.7) return 'bg-amber-100 border-amber-300 text-amber-800';
    return 'bg-red-100 border-red-300 text-red-800';
  };

  const downloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF();
    const sectionLabel = section === 'teacher' ? 'Teachers' : 'Students';

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Noor-E-Islam Madrasha', 14, 18);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    if (selectedDay) {
      doc.text(`Attendance Report — ${selectedDay} ${MONTHS[selectedMonth]} ${selectedYear}`, 14, 27);
      doc.text(`Section: ${sectionLabel}`, 14, 34);
      const rows = (selectedDayData ?? []).map((p, i) => {
        const statusText = p.status === 'present' ? 'Present' : p.status === 'absent' ? 'Absent' : p.status === 'late' ? 'Late' : 'Holiday';
        const subInfo = section === 'teacher'
          ? ('designation' in p ? p.designation : '')
          : ('class' in p ? `${p.class} | Roll: ${'roll' in p ? p.roll : ''}` : '');
        return [i + 1, p.name, subInfo, statusText];
      });
      autoTable(doc, {
        head: [['#', 'Name', section === 'teacher' ? 'Designation' : 'Class', 'Status']],
        body: rows,
        startY: 40,
        headStyles: { fillColor: [109, 40, 217], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 245, 255] },
        columnStyles: { 0: { cellWidth: 12 }, 3: { cellWidth: 28 } },
        didDrawCell: (data: Parameters<NonNullable<Parameters<typeof autoTable>[1]['didDrawCell']>>[0]) => {
          if (data.section === 'body' && data.column.index === 3) {
            const val = data.cell.text[0];
            if (val === 'Present') (data.cell.styles as { textColor: number[] }).textColor = [22, 163, 74];
            else if (val === 'Absent') (data.cell.styles as { textColor: number[] }).textColor = [220, 38, 38];
            else if (val === 'Late') (data.cell.styles as { textColor: number[] }).textColor = [217, 119, 6];
          }
        },
      });
      const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
      const present = (selectedDayData ?? []).filter(p => p.status === 'present').length;
      const absent  = (selectedDayData ?? []).filter(p => p.status === 'absent').length;
      const late    = (selectedDayData ?? []).filter(p => p.status === 'late').length;
      doc.setFontSize(10);
      doc.text(`Total: ${people.length}   Present: ${present}   Absent: ${absent}   Late: ${late}`, 14, finalY);
      doc.save(`attendance-${selectedDay}-${String(selectedMonth + 1).padStart(2, '0')}-${selectedYear}.pdf`);
    } else {
      doc.text(`Monthly Attendance Summary — ${MONTHS[selectedMonth]} ${selectedYear}`, 14, 27);
      doc.text(`Section: ${sectionLabel}   |   Working days: ${effectiveDays}`, 14, 34);
      const rows = people.map((p, i) => {
        const statuses = Array.from({ length: totalDays }, (_, d) => resolveStatus(p.id, selectedMonth, selectedYear, d + 1));
        const presentCount = statuses.filter(s => s === 'present').length;
        const absentCount  = statuses.filter(s => s === 'absent').length;
        const lateCount    = statuses.filter(s => s === 'late').length;
        const pct = effectiveDays > 0 ? Math.round(((presentCount + lateCount) / effectiveDays) * 100) : 0;
        const subInfo = section === 'teacher'
          ? ('designation' in p ? p.designation : '')
          : ('class' in p ? `${p.class}` : '');
        return [i + 1, p.name, subInfo, presentCount, absentCount, lateCount, `${pct}%`];
      });
      autoTable(doc, {
        head: [['#', 'Name', section === 'teacher' ? 'Designation' : 'Class', 'Present', 'Absent', 'Late', '%']],
        body: rows,
        startY: 40,
        headStyles: { fillColor: [109, 40, 217], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 245, 255] },
        columnStyles: {
          0: { cellWidth: 12 },
          3: { halign: 'center', cellWidth: 20 },
          4: { halign: 'center', cellWidth: 20 },
          5: { halign: 'center', cellWidth: 15 },
          6: { halign: 'center', cellWidth: 15 },
        },
      });
      doc.save(`attendance-summary-${String(selectedMonth + 1).padStart(2, '0')}-${selectedYear}.pdf`);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="উপস্থিতি ব্যবস্থাপনা"
        subtitle="শিক্ষক ও শিক্ষার্থীর মাসভিত্তিক উপস্থিতি"
        userName="Admin"
        role="Super Admin"
      />
      <div className="p-6 space-y-5">

        {/* Section toggle + Download */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => { setSection('teacher'); setSelectedDay(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${section === 'teacher' ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'}`}
          >
            <Users size={16} /> শিক্ষক
          </button>
          <button
            onClick={() => { setSection('student'); setSelectedDay(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${section === 'student' ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'}`}
          >
            <GraduationCap size={16} /> শিক্ষার্থী
          </button>

          <button
            onClick={downloadPDF}
            className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all"
          >
            <Download size={16} />
            {selectedDay ? `${selectedDay} ${MONTHS[selectedMonth]} PDF` : `${MONTHS[selectedMonth]} সারসংক্ষেপ PDF`}
          </button>
        </div>

        {/* Year + Month filter */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 w-10 shrink-0">সাল</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedYear(y => Math.max(YEARS[0], y - 1))}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500"
              >
                <ChevronLeft size={14} />
              </button>
              {YEARS.map(y => (
                <button key={y} onClick={() => setSelectedYear(y)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${selectedYear === y ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}>
                  {y}
                </button>
              ))}
              <button
                onClick={() => setSelectedYear(y => Math.min(YEARS[YEARS.length - 1], y + 1))}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 w-10 shrink-0">মাস</span>
            <div className="flex flex-wrap gap-1.5">
              {MONTHS.map((m, i) => (
                <button key={i} onClick={() => { setSelectedMonth(i); setSelectedDay(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedMonth === i ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Holiday management panel */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowHolidayPanel(p => !p)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sun size={16} className="text-amber-500" />
              <span className="font-semibold text-gray-900 text-sm">ছুটি ব্যবস্থাপনা</span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {holidaysThisMonth} দিন ছুটি • {effectiveDays} কার্যদিবস
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">শুক্র/শনি স্বয়ংক্রিয় • অন্যান্য ছুটি যোগ করুন</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${showHolidayPanel ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {showHolidayPanel && (
            <div className="px-5 pb-5 border-t border-gray-100">
              <p className="text-xs text-gray-500 mt-3 mb-3">
                শুক্র/শনিবার স্বয়ংক্রিয়ভাবে ছুটি। সরকারি বা অন্যান্য ছুটির দিনে ক্লিক করুন।
              </p>

              {/* Weekday header */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEK_DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: calendarOffset }).map((_, i) => (
                  <div key={`e-${i}`} className="h-10 rounded-lg bg-gray-50/50" />
                ))}
                {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
                  const off = isHoliday(day);
                  const friSat = isFriSat(day);
                  const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isGovt = holidays.has(dateStr);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleHoliday(day)}
                      disabled={friSat}
                      className={`h-10 rounded-lg flex flex-col items-center justify-center text-[11px] font-semibold transition-all border
                        ${friSat
                          ? 'bg-orange-50 border-orange-200 text-orange-400 cursor-not-allowed'
                          : isGovt
                            ? 'bg-red-100 border-red-300 text-red-600 hover:bg-red-200'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-300'
                        }`}
                      title={friSat ? 'শুক্র/শনি — সাপ্তাহিক ছুটি' : isGovt ? 'সরকারি ছুটি (ক্লিক করে সরান)' : 'ক্লিক করে ছুটি যোগ করুন'}
                    >
                      <span>{day}</span>
                      {isGovt && <span className="text-[8px] leading-none">ছুটি</span>}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-orange-50 border border-orange-200" />
                  <span className="text-[11px] text-gray-500">শুক্র/শনি (স্বয়ংক্রিয়)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                  <span className="text-[11px] text-gray-500">সরকারি/অন্যান্য ছুটি</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-white border border-gray-200" />
                  <span className="text-[11px] text-gray-500">কার্যদিবস</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Monthly summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: `মোট ${section === 'teacher' ? 'শিক্ষক' : 'শিক্ষার্থী'}`, value: people.length, icon: section === 'teacher' ? Users : GraduationCap, color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: 'মোট উপস্থিত (দিন)', value: monthSummary.present, icon: CheckCircle, color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'মোট অনুপস্থিত', value: monthSummary.absent, icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200' },
            { label: 'দেরিতে উপস্থিত', value: monthSummary.late, icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`rounded-2xl border p-4 ${color}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={15} />
                <span className="text-xs opacity-70">{label}</span>
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Calendar view */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-purple-600" />
            <h3 className="font-semibold text-gray-900">
              {MONTHS[selectedMonth]}, {selectedYear} — {section === 'teacher' ? 'শিক্ষক' : 'শিক্ষার্থী'} উপস্থিতি
            </h3>
            <span className="text-xs text-gray-400 ml-1">({effectiveDays} কার্যদিবস)</span>
            {selectedDay && (
              <button onClick={() => setSelectedDay(null)} className="ml-auto text-xs text-purple-600 hover:underline">
                সব দিন দেখুন ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {WEEK_DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: calendarOffset }).map((_, i) => (
              <div key={`e-${i}`} className="h-14 rounded-xl bg-gray-50/50 border border-dashed border-gray-100" />
            ))}
            {dayStats.map(stat => (
              <button
                key={stat.day}
                onClick={() => { if (!stat.isOff) setSelectedDay(selectedDay === stat.day ? null : stat.day); }}
                disabled={stat.isOff}
                className={`h-14 rounded-xl border flex flex-col items-center justify-center transition-all ${!stat.isOff ? 'hover:scale-105 hover:shadow-sm' : ''} ${selectedDay === stat.day ? 'ring-2 ring-purple-500 scale-105 shadow-sm' : ''} ${getDayBg(stat)}`}
              >
                <span className="text-xs font-bold">{stat.day}</span>
                {stat.isOff
                  ? <span className="text-[8px] opacity-60 leading-tight">ছুটি</span>
                  : <span className="text-[9px] opacity-75 leading-tight">{stat.present}✓ {stat.absent}✗</span>
                }
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            {[
              { label: '≥ ৯০% উপস্থিত', color: 'bg-green-100 border-green-300' },
              { label: '৭০–৯০%', color: 'bg-amber-100 border-amber-300' },
              { label: '< ৭০%', color: 'bg-red-100 border-red-300' },
              { label: 'ছুটি', color: 'bg-gray-100 border-gray-200 opacity-60' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded border ${color}`} />
                <span className="text-[11px] text-gray-500">{label}</span>
              </div>
            ))}
            <span className="text-[11px] text-gray-400 ml-auto">দিনে ক্লিক করুন বিস্তারিত দেখতে</span>
          </div>
        </div>

        {/* Selected day detail OR full list */}
        {selectedDayData ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Calendar size={15} className="text-purple-600" />
              <h3 className="font-semibold text-gray-900">
                {selectedDay} {MONTHS[selectedMonth]}, {selectedYear} — উপস্থিতি বিবরণ
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {selectedDayData.map(p => (
                <div key={p.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50">
                  <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.nameBn || p.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {section === 'teacher'
                        ? `${'designation' in p ? p.designation : ''} · ${'department' in p ? p.department : ''}`
                        : `${'class' in p ? p.class : ''} · Roll: ${'roll' in p ? p.roll : ''}`}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_STYLE[p.status]}`}>
                    {p.status === 'present' && <><CheckCircle size={11} /> উপস্থিত</>}
                    {p.status === 'absent'  && <><XCircle size={11} /> অনুপস্থিত</>}
                    {p.status === 'late'    && <><Clock size={11} /> দেরিতে</>}
                    {p.status === 'holiday' && <>ছুটি</>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                {MONTHS[selectedMonth]} মাসের সারসংক্ষেপ — {section === 'teacher' ? 'শিক্ষক' : 'শিক্ষার্থী'}
                <span className="text-xs text-gray-400 font-normal ml-2">({effectiveDays} কার্যদিবস)</span>
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {people.map(p => {
                const statuses = Array.from({ length: totalDays }, (_, i) => resolveStatus(p.id, selectedMonth, selectedYear, i + 1));
                const presentCount = statuses.filter(s => s === 'present').length;
                const absentCount  = statuses.filter(s => s === 'absent').length;
                const lateCount    = statuses.filter(s => s === 'late').length;
                const pct = effectiveDays > 0 ? Math.round(((presentCount + lateCount) / effectiveDays) * 100) : 0;
                return (
                  <div key={p.id} className="px-5 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {p.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{p.nameBn || p.name}</p>
                      <p className="text-xs text-gray-400">
                        {section === 'teacher'
                          ? `${'designation' in p ? p.designation : ''} · ${'department' in p ? p.department : ''}`
                          : `${'class' in p ? p.class : ''} · Roll: ${'roll' in p ? p.roll : ''}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 85 ? 'bg-green-500' : pct >= 75 ? 'bg-amber-400' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 shrink-0">{pct}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 text-[11px] font-semibold">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg">{presentCount}✓</span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg">{absentCount}✗</span>
                      {lateCount > 0 && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">{lateCount}~</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
