'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { ROUTINE_DATA } from '@/lib/data';
import { LayoutGrid, Download, Printer, Plus, Save } from 'lucide-react';

const DAYS = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার'];
const TIMES = ['08:00-08:45', '08:45-09:30', '09:30-10:15', 'বিরতি', '10:30-11:15', '11:15-12:00'];

const ROUTINE_GRID: Record<string, Record<string, string>> = {
  'শনিবার': { '08:00-08:45': 'কুরআন মজিদ', '08:45-09:30': 'গণিত', '09:30-10:15': 'বাংলা', 'বিরতি': '—', '10:30-11:15': 'আরবি', '11:15-12:00': 'ইংরেজি' },
  'রবিবার': { '08:00-08:45': 'হাদিস', '08:45-09:30': 'বিজ্ঞান', '09:30-10:15': 'আকায়েদ', 'বিরতি': '—', '10:30-11:15': 'ইসলামের ইতিহাস', '11:15-12:00': 'আরবি' },
  'সোমবার': { '08:00-08:45': 'গণিত', '08:45-09:30': 'বাংলা', '09:30-10:15': 'কুরআন মজিদ', 'বিরতি': '—', '10:30-11:15': 'ইংরেজি', '11:15-12:00': 'হাদিস' },
  'মঙ্গলবার': { '08:00-08:45': 'আরবি', '08:45-09:30': 'আকায়েদ', '09:30-10:15': 'বিজ্ঞান', 'বিরতি': '—', '10:30-11:15': 'গণিত', '11:15-12:00': 'বাংলা' },
  'বুধবার': { '08:00-08:45': 'ইংরেজি', '08:45-09:30': 'ইসলামের ইতিহাস', '09:30-10:15': 'আরবি', 'বিরতি': '—', '10:30-11:15': 'কুরআন মজিদ', '11:15-12:00': 'বিজ্ঞান' },
  'বৃহস্পতিবার': { '08:00-08:45': 'হাদিস', '08:45-09:30': 'গণিত', '09:30-10:15': 'বাংলা', 'বিরতি': '—', '10:30-11:15': 'আকায়েদ', '11:15-12:00': 'ইসলামের ইতিহাস' },
};

const SUBJECT_COLORS: Record<string, string> = {
  'কুরআন মজিদ': 'bg-green-50 text-green-800', 'হাদিস': 'bg-teal-50 text-teal-800',
  'আরবি': 'bg-blue-50 text-blue-800', 'আকায়েদ': 'bg-purple-50 text-purple-800',
  'গণিত': 'bg-orange-50 text-orange-800', 'বিজ্ঞান': 'bg-cyan-50 text-cyan-800',
  'বাংলা': 'bg-rose-50 text-rose-800', 'ইংরেজি': 'bg-indigo-50 text-indigo-800',
  'ইসলামের ইতিহাস': 'bg-amber-50 text-amber-800', '—': 'bg-gray-50 text-gray-400',
};

export default function AdminRoutinePage() {
  const [selectedClass, setSelectedClass] = useState('class-10');

  return (
    <div>
      <DashboardHeader title="ক্লাস রুটিন" subtitle="সাপ্তাহিক ক্লাস রুটিন তৈরি ও পরিচালনা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
            <option value="class-10">দাখিল ১০ম শ্রেণি</option>
            <option value="class-9">৯ম শ্রেণি</option>
            <option value="class-8">৮ম শ্রেণি</option>
          </select>
          <div className="flex gap-2 ml-auto">
            <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              <Printer size={14} /> প্রিন্ট
            </button>
            <button className="flex items-center gap-2 btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold">
              <Download size={14} /> PDF Export
            </button>
          </div>
        </div>

        {/* Routine grid */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="bg-[#1e1b4b] text-white px-5 py-4 text-center">
            <h2 className="font-bold text-lg">নূরে ইসলাম মাদ্রাসা</h2>
            <p className="text-purple-200 text-sm">সাপ্তাহিক ক্লাস রুটিন — দাখিল ১০ম শ্রেণি | শাখা-ক | ২০২৪-২৫</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-purple-50">
                  <th className="border border-gray-200 px-3 py-3 text-gray-600 font-semibold w-28">সময়</th>
                  {DAYS.map(d => <th key={d} className="border border-gray-200 px-3 py-3 text-gray-700 font-semibold">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {TIMES.map(time => (
                  <tr key={time} className={time === 'বিরতি' ? 'bg-gray-50' : 'hover:bg-gray-50 transition-colors'}>
                    <td className="border border-gray-200 px-3 py-3 font-semibold text-gray-600 text-center">{time}</td>
                    {DAYS.map(day => {
                      const subject = ROUTINE_GRID[day]?.[time] ?? '—';
                      return (
                        <td key={day} className={`border border-gray-200 px-2 py-3 text-center font-medium ${SUBJECT_COLORS[subject] || 'bg-white text-gray-700'}`}>
                          {subject}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">বিষয় পরিচিতি</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SUBJECT_COLORS).filter(([k]) => k !== '—').map(([sub, color]) => (
              <span key={sub} className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${color}`}>{sub}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
