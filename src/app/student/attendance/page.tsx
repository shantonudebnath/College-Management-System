'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useStudentSession } from '@/hooks/useStudentSession';
import { useAttendance } from '@/context/AttendanceContext';
import { CheckCircle, XCircle, Clock, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

const MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

type DayStatus = 'present' | 'absent' | 'late' | 'none';

const STATUS_STYLE: Record<DayStatus, string> = {
  present: 'bg-green-100 text-green-700 border-green-200',
  absent: 'bg-red-100 text-red-700 border-red-200',
  late: 'bg-amber-100 text-amber-700 border-amber-200',
  none: 'bg-gray-50 text-gray-300 border-gray-100',
};

const STATUS_LABEL: Record<DayStatus, string> = {
  present: 'উপস্থিত',
  absent: 'অনুপস্থিত',
  late: 'দেরিতে',
  none: 'তথ্য নেই',
};

export default function StudentAttendancePage() {
  const { student, loading: sessionLoading } = useStudentSession();
  const { getMonthAttendance } = useAttendance();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [monthData, setMonthData] = useState<Record<number, DayStatus>>({});
  const year = new Date().getFullYear();

  useEffect(() => {
    if (!student?.class || !student?.id) { setMonthData({}); return; }
    getMonthAttendance(year, selectedMonth).then(records => {
      const studentRecords = records.filter(r => r.studentId === student.id);
      const data: Record<number, DayStatus> = {};
      studentRecords.forEach(r => {
        const day = parseInt(r.date.split('-')[2], 10);
        data[day] = r.status as DayStatus;
      });
      setMonthData(data);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.id, student?.class, selectedMonth, year]);

  const days = DAYS_IN_MONTH[selectedMonth];
  const present = Object.values(monthData).filter(v => v === 'present').length;
  const absent = Object.values(monthData).filter(v => v === 'absent').length;
  const late = Object.values(monthData).filter(v => v === 'late').length;
  const marked = Object.values(monthData).filter(v => v !== 'none').length;
  const percent = marked > 0 ? Math.round(((present + late) / marked) * 100) : 0;

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="উপস্থিতি রেকর্ড"
        subtitle="মাসভিত্তিক উপস্থিতি বিবরণ"
        userName={student?.nameBn ?? student?.name ?? 'শিক্ষার্থী'}
        role="ছাত্র"
      />
      <div className="p-6 space-y-6">

        {/* Month selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <Calendar size={16} className="text-purple-600" />
          <span className="text-sm font-medium text-gray-600 mr-2">মাস নির্বাচন:</span>
          {MONTHS.map((m, i) => (
            <button key={i} onClick={() => setSelectedMonth(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedMonth === i ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}>
              {m}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'মোট দিন', value: days, icon: Calendar, color: 'bg-gray-50 text-gray-700 border-gray-200' },
            { label: 'উপস্থিত', value: present, icon: CheckCircle, color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'অনুপস্থিত', value: absent, icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200' },
            { label: 'দেরিতে', value: late, icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { label: 'হাজিরার হার', value: marked > 0 ? `${percent}%` : '—', icon: TrendingUp, color: percent >= 75 || marked === 0 ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-red-50 text-red-700 border-red-200' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`rounded-2xl p-4 border flex items-center gap-3 ${color}`}>
              <Icon size={18} className="shrink-0" />
              <div>
                <p className="text-lg font-bold">{value}</p>
                <p className="text-xs opacity-70">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Low attendance warning */}
        {percent < 75 && marked > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">হাজিরা কম!</p>
              <p className="text-red-600 text-xs mt-0.5">
                আপনার {MONTHS[selectedMonth]} মাসের হাজিরা {percent}%। ৭৫%-এর নিচে হলে পরীক্ষায় অংশগ্রহণে সমস্যা হতে পারে।
              </p>
            </div>
          </div>
        )}

        {/* No data notice */}
        {marked === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <Calendar size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-blue-700 text-sm">{MONTHS[selectedMonth]} মাসের জন্য এখনো কোনো উপস্থিতি তথ্য নেই।</p>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            {MONTHS[selectedMonth]}, {year} — দৈনিক উপস্থিতি
          </h3>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: days }, (_, i) => i + 1).map(d => {
              const status = monthData[d] ?? 'none';
              return (
                <div
                  key={d}
                  title={STATUS_LABEL[status]}
                  className={`h-10 rounded-xl border flex items-center justify-center text-xs font-semibold transition-colors ${STATUS_STYLE[status]}`}
                >
                  {d}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            {(Object.entries(STATUS_LABEL) as [DayStatus, string][]).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded border ${STATUS_STYLE[key]}`} />
                <span className="text-[11px] text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
