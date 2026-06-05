'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { TEACHERS } from '@/lib/data';
import { Shield, Download, Printer, RefreshCw } from 'lucide-react';

const EXAM_DATES = ['2024-11-01', '2024-11-03', '2024-11-05', '2024-11-07', '2024-11-10', '2024-11-12'];
const HALLS = ['হল-১', 'হল-২'];

const generateGuardList = () => {
  const guards: Record<string, { hall: string; teacher: string; role: string }[]> = {};
  EXAM_DATES.forEach((date, di) => {
    guards[date] = HALLS.map((hall, hi) => ({
      hall,
      teacher: TEACHERS[(di * 2 + hi) % TEACHERS.length].name,
      role: hi === 0 ? 'প্রধান পরিদর্শক' : 'সহকারী পরিদর্শক',
    }));
    guards[date].push({
      hall: 'সহকারী',
      teacher: TEACHERS[(di * 2 + 2) % TEACHERS.length].name,
      role: 'সহায়ক দায়িত্ব',
    });
  });
  return guards;
};

export default function AdminGuardListPage() {
  const [generated, setGenerated] = useState(false);
  const [guardList, setGuardList] = useState<Record<string, { hall: string; teacher: string; role: string }[]>>({});

  const generate = () => { setGuardList(generateGuardList()); setGenerated(true); };

  return (
    <div>
      <DashboardHeader title="পরীক্ষার গার্ড তালিকা" subtitle="পরীক্ষার হলে দায়িত্বরত শিক্ষক তালিকা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        <div className="flex gap-3 flex-wrap">
          <button onClick={generate} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
            <RefreshCw size={16} /> গার্ড তালিকা তৈরি করুন
          </button>
          {generated && (
            <>
              <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                <Printer size={14} /> প্রিন্ট
              </button>
              <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                <Download size={14} /> PDF Export
              </button>
            </>
          )}
        </div>

        {generated && (
          <div className="space-y-4">
            {Object.entries(guardList).map(([date, guards]) => (
              <div key={date} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-[#1e1b4b] text-white px-5 py-3 flex items-center gap-2">
                  <Shield size={15} />
                  <h3 className="font-semibold">{date} — পরীক্ষার দায়িত্ব</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {guards.map((g, i) => (
                    <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {g.teacher[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{g.teacher}</p>
                          <p className="text-xs text-gray-400">{g.hall}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${g.role === 'প্রধান পরিদর্শক' ? 'bg-purple-100 text-purple-700' : g.role === 'সহকারী পরিদর্শক' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {g.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
