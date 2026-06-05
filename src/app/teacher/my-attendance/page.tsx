'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { UserCheck, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

const MONTH_DATA = [
  { date: '2024-05-01', status: 'present' }, { date: '2024-05-02', status: 'present' },
  { date: '2024-05-05', status: 'present' }, { date: '2024-05-06', status: 'late' },
  { date: '2024-05-07', status: 'present' }, { date: '2024-05-08', status: 'absent' },
  { date: '2024-05-09', status: 'present' }, { date: '2024-05-12', status: 'present' },
  { date: '2024-05-13', status: 'present' }, { date: '2024-05-14', status: 'present' },
  { date: '2024-05-15', status: 'present' }, { date: '2024-05-16', status: 'present' },
];

const STATUS = {
  present: { label: 'উপস্থিত', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  absent: { label: 'অনুপস্থিত', color: 'bg-red-100 text-red-700', icon: XCircle },
  late: { label: 'দেরিতে', color: 'bg-amber-100 text-amber-700', icon: Clock },
};

export default function TeacherMyAttendancePage() {
  const [marking, setMarking] = useState(false);
  const [todayStatus, setTodayStatus] = useState<string | null>(null);

  const present = MONTH_DATA.filter(d => d.status === 'present').length;
  const absent = MONTH_DATA.filter(d => d.status === 'absent').length;
  const late = MONTH_DATA.filter(d => d.status === 'late').length;
  const total = MONTH_DATA.length;

  return (
    <div>
      <DashboardHeader title="আমার উপস্থিতি" subtitle="নিজের উপস্থিতি রেকর্ড দেখুন" userName="Md. Shafiqul Islam" role="শিক্ষক" />
      <div className="p-6 space-y-5">
        {/* Today mark */}
        {!todayStatus ? (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">আজকের উপস্থিতি চিহ্নিত করুন</h3>
                <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleDateString('bn-BD')}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setTodayStatus('present')} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
                  <CheckCircle size={15} /> উপস্থিত
                </button>
                <button onClick={() => setTodayStatus('late')} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors">
                  <Clock size={15} /> দেরিতে
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-green-800 font-medium text-sm">আজকের উপস্থিতি সফলভাবে চিহ্নিত হয়েছে: {STATUS[todayStatus as keyof typeof STATUS]?.label}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'মোট কার্যদিবস', value: total, color: 'bg-gray-50 text-gray-700' },
            { label: 'উপস্থিত', value: present, color: 'bg-green-50 text-green-700' },
            { label: 'অনুপস্থিত', value: absent, color: 'bg-red-50 text-red-700' },
            { label: 'দেরিতে', value: late, color: 'bg-amber-50 text-amber-700' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${color} rounded-2xl p-4 text-center`}>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
            </div>
          ))}
        </div>

        {/* Attendance log */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Calendar size={16} className="text-purple-600" />
            <h3 className="font-semibold text-gray-900">মে ২০২৪ — উপস্থিতির তথ্য</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {MONTH_DATA.map(({ date, status }) => {
              const s = STATUS[status as keyof typeof STATUS];
              const Icon = s.icon;
              return (
                <div key={date} className="px-5 py-3 flex items-center justify-between">
                  <p className="text-sm text-gray-700">{date}</p>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>
                    <Icon size={12} /> {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
