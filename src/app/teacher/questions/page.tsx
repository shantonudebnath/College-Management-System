'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { HelpCircle, Plus, Send, Trash2, Lock } from 'lucide-react';

const SAMPLE_QUESTIONS = [
  { id: 'q1', subject: 'Mathematics', exam: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', submittedAt: '2024-05-01', status: 'submitted' },
];

export default function TeacherQuestionsPage() {
  const [questions, setQuestions] = useState(SAMPLE_QUESTIONS);
  const [form, setForm] = useState({ subject: 'Mathematics', exam: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', content: '', totalMarks: '100', time: '3 ঘণ্টা' });
  const [showForm, setShowForm] = useState(false);

  const submit = () => {
    if (!form.content) return;
    setQuestions(p => [{
      id: `q${Date.now()}`, subject: form.subject, exam: form.exam,
      class: form.class, submittedAt: new Date().toISOString().split('T')[0], status: 'submitted',
    }, ...p]);
    setShowForm(false);
  };

  return (
    <div>
      <DashboardHeader title="প্রশ্নপত্র দাখিল" subtitle="পরীক্ষার প্রশ্নপত্র সাবমিট করুন" userName="Md. Shafiqul Islam" role="শিক্ষক" />
      <div className="p-6 space-y-5">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-sm text-amber-800">
          <Lock size={16} className="text-amber-600 shrink-0" />
          <span>প্রশ্নপত্র সাবমিটের পর শুধু অ্যাডমিন দেখতে পারবেন। পরীক্ষার আগ পর্যন্ত এটি সম্পূর্ণ গোপন থাকবে।</span>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={16} /> নতুন প্রশ্নপত্র তৈরি
        </button>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn space-y-3">
            <h3 className="font-semibold text-gray-900">প্রশ্নপত্র</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="বিষয়" className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              <input value={form.exam} onChange={e => setForm(p => ({ ...p, exam: e.target.value }))} placeholder="পরীক্ষার নাম" className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              <input value={form.totalMarks} onChange={e => setForm(p => ({ ...p, totalMarks: e.target.value }))} placeholder="পূর্ণমান" className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
            </div>
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder="এখানে প্রশ্নপত্র লিখুন&#10;&#10;বিভাগ-ক (সংক্ষিপ্ত উত্তর): ১। ... ২। ...&#10;বিভাগ-খ (রচনামূলক): ১। ..."
              rows={12} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 resize-none font-mono" />
            <div className="flex gap-2">
              <button onClick={submit} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"><Send size={14} /> দাখিল করুন</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {questions.map(q => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                <HelpCircle size={18} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{q.subject} — {q.exam}</h3>
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  <span>শ্রেণি: {q.class}</span>
                  <span>•</span>
                  <span>দাখিল: {q.submittedAt}</span>
                </div>
              </div>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">দাখিল হয়েছে</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
