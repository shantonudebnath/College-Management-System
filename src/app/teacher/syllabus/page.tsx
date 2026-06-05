'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { SYLLABUS } from '@/lib/data';
import { BookOpen, Plus, Save, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'completed', label: 'সম্পন্ন', color: 'bg-green-100 text-green-700' },
  { value: 'ongoing', label: 'চলমান', color: 'bg-blue-100 text-blue-700' },
  { value: 'pending', label: 'বাকি', color: 'bg-gray-100 text-gray-600' },
];

export default function TeacherSyllabusPage() {
  const [syllabus, setSyllabus] = useState(SYLLABUS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ chapter: '', topics: '', status: 'pending' });

  const updateStatus = (i: number, status: string) => {
    setSyllabus(p => p.map((s, idx) => idx === i ? { ...s, status: status as 'completed' | 'ongoing' | 'pending' } : s));
  };

  const addChapter = () => {
    if (!form.chapter) return;
    setSyllabus(p => [...p, {
      class: 'class-10', subject: 'Mathematics', chapter: form.chapter,
      topics: form.topics.split(',').map(t => t.trim()).filter(Boolean),
      status: form.status as 'completed' | 'ongoing' | 'pending',
    }]);
    setForm({ chapter: '', topics: '', status: 'pending' });
    setShowForm(false);
  };

  const subjects = [...new Set(syllabus.map(s => s.subject))];
  const done = syllabus.filter(s => s.status === 'completed').length;

  return (
    <div>
      <DashboardHeader title="সিলেবাস তৈরি" subtitle="ক্লাসের পাঠ্যক্রম পরিচালনা করুন" userName="Md. Shafiqul Islam" role="শিক্ষক" />
      <div className="p-6 space-y-5">
        {/* Progress */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">সিলেবাস অগ্রগতি</span>
              <span className="text-sm font-bold text-purple-600">{done}/{syllabus.length} অধ্যায়</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full gradient-primary rounded-full" style={{ width: `${(done / syllabus.length) * 100}%` }}></div>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0">
            <Plus size={15} /> অধ্যায় যোগ করুন
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn">
            <div className="space-y-3">
              <input value={form.chapter} onChange={e => setForm(p => ({ ...p, chapter: e.target.value }))}
                placeholder="অধ্যায়ের নাম" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              <input value={form.topics} onChange={e => setForm(p => ({ ...p, topics: e.target.value }))}
                placeholder="বিষয়গুলো (কমা দিয়ে আলাদা করুন)" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={addChapter} className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Save size={14} /> সংরক্ষণ</button>
                <button onClick={() => setShowForm(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">বাতিল</button>
              </div>
            </div>
          </div>
        )}

        {/* Syllabus list */}
        {subjects.map(subject => (
          <div key={subject} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-purple-50 px-5 py-3 border-b border-purple-100 flex items-center gap-2">
              <BookOpen size={15} className="text-purple-600" />
              <h3 className="font-semibold text-purple-900 text-sm">{subject}</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {syllabus.filter(s => s.subject === subject).map((ch, i) => {
                const statusOpt = STATUS_OPTIONS.find(o => o.value === ch.status)!;
                return (
                  <div key={i} className="px-5 py-4 flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{ch.chapter}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {ch.topics.map(t => <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    </div>
                    <select value={ch.status}
                      onChange={e => updateStatus(syllabus.indexOf(ch), e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 outline-none cursor-pointer ${statusOpt.color}`}>
                      {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
