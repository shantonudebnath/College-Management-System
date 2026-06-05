'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS } from '@/lib/data';
import { CheckCircle, XCircle, Clock, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

const student = STUDENTS[0];

const MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

type DayStatus = 'present' | 'absent' | 'leave' | 'holiday' | 'none';

const generateMonthData = (month: number): Record<number, DayStatus> => {
  const data: Record<number, DayStatus> = {};
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  for (let d = 1; d <= days; d++) {
    const rand = Math.random();
    if (rand < 0.03) data[d] = 'holiday';
    else if (rand < 0.07) data[d] = 'leave';
    else if (rand < 0.13) data[d] = 'absent';
    else data[d] = 'present';
  }
  return data;
};

const MONTH_DATA: Record<number, Record<number, DayStatus>> = {};
for (let m = 0; m < 12; m++) MONTH_DATA[m] = generateMonthData(m);

const SUBJECT_ATTENDANCE = [
  { subject: 'কুরআন মজিদ ও তাজউইদ', total: 48, present: 46, percent: 96 },
  { subject: 'আরবি ভাষা', total: 46, present: 42, percent: 91 },
  { subject: 'হাদিস ও ফিকহ', total: 44, present: 40, percent: 91 },
  { subject: 'বাংলা', total: 50, present: 47, percent: 94 },
  { subject: 'ইংরেজি', total: 50, present: 44, percent: 88 },
  { subject: 'গণিত', total: 48, present: 43, percent: 90 },
  { subject: 'বিজ্ঞান', total: 40, present: 35, percent: 88 },
  { subject: 'ইসলামের ইতিহাস', total: 36, present: 34, percent: 94 },
];

export default function StudentAttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const monthData = MONTH_DATA[selectedMonth];
  const days = Object.keys(monthData).length;
  const present = Object.values(monthData).filter(v => v === 'present').length;
  const absent = Object.values(monthData).filter(v => v === 'absent').length;
  const leave = Object.values(monthData).filter(v => v === 'leave').length;
  const holiday = Object.values(monthData).filter(v => v === 'holiday').length;
  const percent = Math.round((present / (days - holiday)) * 100);

  const STATUS_STYLE: Record<DayStatus, string> = {
    present: 'bg-green-100 text-green-700 border-green-200',
    absent: 'bg-red-100 text-red-700 border-red-200',
    leave: 'bg-amber-100 text-amber-700 border-amber-200',
    holiday: 'bg-gray-100 text-gray-400 border-gray-200',
    none: 'bg-gray-50 text-gray-300 border-gray-100',
  };

  return (
    <div>
      <DashboardHeader title="উপস্থিতি রেকর্ড" subtitle="মাসভিত্তিক উপস্থিতি ও বিষয়ওয়ারী বিবরণ" userName={student.name} role="ছাত্র" />
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
            { label: 'মোট দিন', value: days, icon: Calendar, color: 'bg-gray-50 text-gray-700' },
            { label: 'উপস্থিত', value: present, icon: CheckCircle, color: 'bg-green-50 text-green-700' },
            { label: 'অনুপস্থিত', value: absent, icon: XCircle, color: 'bg-red-50 text-red-700' },
            { label: 'ছুটি', value: leave, icon: Clock, color: 'bg-amber-50 text-amber-700' },
            { label: 'হাজিরার হার', value: `${percent}%`, icon: TrendingUp, color: percent >= 75 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`rounded-2xl border border-gray-100 p-4 ${color.split(' ')[0]}`}>
              <div className={`flex items-center gap-2 mb-2`}>
                <Icon size={15} className={color.split(' ')[1]} />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
              <p className={`text-2xl font-bold ${color.split(' ')[1]}`}>{value}</p>
            </div>
          ))}
        </div>

        {percent < 75 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">সতর্কতা: উপস্থিতির হার কম!</p>
              <p className="text-xs text-red-600 mt-0.5">পরীক্ষায় অংশ নিতে ন্যূনতম ৭৫% উপস্থিতি প্রয়োজন। দ্রুত উপস্থিতি বাড়ান।</p>
            </div>
          </div>
        )}

        {/* Calendar grid */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">{MONTHS[selectedMonth]} মাসের উপস্থিতি</h3>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র'].map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for offset */}
            {Array.from({ length: (selectedMonth * 3 + 3) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 rounded-xl border border-dashed border-gray-100 bg-gray-50/50"></div>
            ))}
            {Object.entries(monthData).map(([day, status]) => (
              <div key={day}
                className={`h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all hover:scale-105 ${STATUS_STYLE[status]}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            {[
              { label: 'উপস্থিত', color: 'bg-green-100 border-green-200' },
              { label: 'অনুপস্থিত', color: 'bg-red-100 border-red-200' },
              { label: 'ছুটি', color: 'bg-amber-100 border-amber-200' },
              { label: 'সরকারি ছুটি', color: 'bg-gray-100 border-gray-200' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded-md border ${color}`}></div>
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-wise attendance */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">বিষয়ওয়ারী উপস্থিতি (সামগ্রিক)</h3>
          <div className="space-y-3">
            {SUBJECT_ATTENDANCE.map(s => (
              <div key={s.subject} className="flex items-center gap-3">
                <div className="w-40 shrink-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{s.subject}</p>
                  <p className="text-[10px] text-gray-400">{s.present}/{s.total} ক্লাস</p>
                </div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${s.percent >= 85 ? 'bg-green-500' : s.percent >= 75 ? 'bg-amber-400' : 'bg-red-500'}`}
                    style={{ width: `${s.percent}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-bold w-10 text-right ${s.percent >= 85 ? 'text-green-600' : s.percent >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                  {s.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
