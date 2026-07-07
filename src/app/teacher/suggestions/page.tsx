'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useTeachers } from '@/context/TeachersContext';
import { useCurrentTeacher } from '@/context/CurrentTeacherContext';
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react';

const INITIAL = [
  { id: 's1', title: 'গণিত সাজেশন — বার্ষিক ২০২৪', class: 'class-10', subject: 'Mathematics', date: '2024-05-20', downloads: 28 },
  { id: 's2', title: 'বিজ্ঞান সাজেশন — ১ম সাময়িক', class: 'class-9', subject: 'General Science', date: '2024-04-10', downloads: 19 },
];

export default function TeacherSuggestionsPage() {
  const { currentTeacherId } = useCurrentTeacher();
  const { teachers } = useTeachers();
  const teacher = teachers.find(t => t.id === currentTeacherId);
  const [items, setItems] = useState(INITIAL);
  const [form, setForm] = useState({ title: '', class: 'class-10', subject: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleSubmit = () => {
    if (!form.title) return;
    setItems(p => [{ id: `s${Date.now()}`, title: form.title, class: form.class, subject: form.subject, date: new Date().toISOString().split('T')[0], downloads: 0 }, ...p]);
    setUploaded(true);
    setShowForm(false);
    setForm({ title: '', class: 'class-10', subject: '', content: '' });
    setTimeout(() => setUploaded(false), 2000);
  };

  return (
    <div>
      <DashboardHeader title="সাজেশন আপলোড" subtitle="ছাত্রদের জন্য সাজেশন আপলোড করুন" userName={teacher?.name ?? 'শিক্ষক'} role="শিক্ষক" userImage={teacher?.image} />
      <div className="p-6 space-y-5">
        {uploaded && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl p-4 text-green-800 font-medium text-sm">
            <CheckCircle size={18} className="text-green-600" /> সাজেশন সফলভাবে আপলোড হয়েছে!
          </div>
        )}

        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Upload size={16} /> নতুন সাজেশন আপলোড
        </button>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn space-y-3">
            <h3 className="font-semibold text-gray-900">নতুন সাজেশন</h3>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="সাজেশনের শিরোনাম *"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                <option value="class-10">দাখিল ১০ম</option>
                <option value="class-9">৯ম শ্রেণি</option>
                <option value="class-8">৮ম শ্রেণি</option>
              </select>
              <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                placeholder="বিষয়"
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
            </div>
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder="সাজেশনের বিষয়বস্তু লিখুন..." rows={5}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 resize-none" />
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
              <Upload size={20} className="mx-auto mb-2 text-gray-300" />
              ফাইল আপলোড করুন (PDF, DOC)
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">আপলোড করুন</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 transition-all p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={18} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  <span>{item.subject}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.downloads} বার ডাউনলোড</span>
                </div>
              </div>
              <button onClick={() => setItems(p => p.filter(i => i.id !== item.id))}
                className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
