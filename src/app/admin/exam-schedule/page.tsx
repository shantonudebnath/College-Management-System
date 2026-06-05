'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { EXAM_SCHEDULE, MADRASHA_CLASSES } from '@/lib/data';
import { Calendar, Plus, Trash2, Download, Printer } from 'lucide-react';
import type { ExamSchedule } from '@/lib/types';

export default function AdminExamSchedulePage() {
  const [schedules, setSchedules] = useState(EXAM_SCHEDULE);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '', startTime: '10:00', endTime: '13:00', subject: '', room: 'Room 101' });

  const addSchedule = () => {
    if (!form.subject || !form.date) return;
    const s: ExamSchedule = { id: `es${Date.now()}`, ...form };
    setSchedules(p => [...p, s]);
    setShowForm(false);
    setForm({ ...form, subject: '', date: '' });
  };

  return (
    <div>
      <DashboardHeader title="পরীক্ষার সময়সূচী" subtitle="পরীক্ষার তারিখ ও সময় নির্ধারণ করুন" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
            <Plus size={16} /> নতুন সময়সূচী যোগ করুন
          </button>
          <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Printer size={14} /> প্রিন্ট
          </button>
          <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Download size={14} /> PDF Export
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-gray-600 block mb-1">বিষয় *</label>
                <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="পরীক্ষার বিষয়"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">তারিখ *</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শ্রেণি</label>
                <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                  {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শুরুর সময়</label>
                <input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শেষের সময়</label>
                <input type="time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">রুম</label>
                <input value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} placeholder="Room 101"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addSchedule} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">যোগ করুন</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">পরীক্ষার নাম</th>
                  <th className="px-5 py-3 text-left">বিষয়</th>
                  <th className="px-5 py-3 text-left">শ্রেণি</th>
                  <th className="px-5 py-3 text-center">তারিখ</th>
                  <th className="px-5 py-3 text-center">সময়</th>
                  <th className="px-5 py-3 text-center">রুম</th>
                  <th className="px-5 py-3 text-center">মুছুন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {schedules.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{s.examName}</td>
                    <td className="px-5 py-3 text-gray-700">{s.subject}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{MADRASHA_CLASSES.find(c => c.id === s.class)?.nameBn}</td>
                    <td className="px-5 py-3 text-center text-gray-600">{s.date}</td>
                    <td className="px-5 py-3 text-center text-gray-500 text-xs">{s.startTime}–{s.endTime}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg">{s.room}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={() => setSchedules(p => p.filter(x => x.id !== s.id))} className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 mx-auto"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
