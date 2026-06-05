'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { TEACHERS, MADRASHA_CLASSES } from '@/lib/data';
import { BookOpen, Edit, Save, X } from 'lucide-react';

type Assignment = { classId: string; teacherId: string; subjects: string[] };

export default function AdminClassesPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { classId: 'class-10', teacherId: 't1', subjects: ['Quran Majid', 'Hadith Sharif'] },
    { classId: 'class-10', teacherId: 't3', subjects: ['Mathematics', 'General Science'] },
    { classId: 'class-9', teacherId: 't5', subjects: ['Aqeedah & Fiqh', 'Islamic History'] },
    { classId: 'class-8', teacherId: 't2', subjects: ['Arabic Language'] },
    { classId: 'class-7', teacherId: 't4', subjects: ['Bengali', 'English'] },
  ]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ classId: 'class-10', teacherId: 't1', subjects: '' });
  const [showForm, setShowForm] = useState(false);

  const addAssignment = () => {
    setAssignments(p => [...p, { ...form, subjects: form.subjects.split(',').map(s => s.trim()) }]);
    setShowForm(false);
    setForm({ classId: 'class-10', teacherId: 't1', subjects: '' });
  };

  return (
    <div>
      <DashboardHeader title="ক্লাস অ্যাসাইনমেন্ট" subtitle="শিক্ষকদের ক্লাস ও বিষয় নির্ধারণ করুন" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
          <BookOpen size={16} /> নতুন অ্যাসাইনমেন্ট
        </button>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শ্রেণি</label>
                <select value={form.classId} onChange={e => setForm(p => ({ ...p, classId: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                  {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শিক্ষক</label>
                <select value={form.teacherId} onChange={e => setForm(p => ({ ...p, teacherId: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                  {TEACHERS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">বিষয় (কমা দিয়ে)</label>
                <input value={form.subjects} onChange={e => setForm(p => ({ ...p, subjects: e.target.value }))}
                  placeholder="Math, Science" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={addAssignment} className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold">সংরক্ষণ</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {MADRASHA_CLASSES.map(cls => {
            const clsAssignments = assignments.filter(a => a.classId === cls.id);
            if (clsAssignments.length === 0) return null;
            return (
              <div key={cls.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-purple-50 px-5 py-3 border-b border-purple-100">
                  <h3 className="font-semibold text-purple-900 flex items-center gap-2"><BookOpen size={14} /> {cls.nameBn}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {clsAssignments.map((a, i) => {
                    const teacher = TEACHERS.find(t => t.id === a.teacherId);
                    return (
                      <div key={i} className="px-5 py-3 flex items-center gap-4">
                        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {teacher?.name[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{teacher?.name}</p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {a.subjects.map(s => <span key={s} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>)}
                          </div>
                        </div>
                        <button onClick={() => setAssignments(p => p.filter((_, idx) => idx !== assignments.indexOf(a)))}
                          className="text-xs text-red-500 hover:text-red-700">মুছুন</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
