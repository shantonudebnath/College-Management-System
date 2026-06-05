'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { FolderOpen, FileText, Upload, Trash2, Download, Plus } from 'lucide-react';

const INITIAL_DOCS = [
  { id: 'd1', name: 'মাদ্রাসার অনুমোদনপত্র ২০২৪', type: 'PDF', size: '2.4 MB', date: '2024-01-10', category: 'অফিশিয়াল' },
  { id: 'd2', name: 'শিক্ষক নিয়োগ বিজ্ঞপ্তি', type: 'PDF', size: '1.1 MB', date: '2024-02-15', category: 'নিয়োগ' },
  { id: 'd3', name: 'বার্ষিক বাজেট পরিকল্পনা ২০২৪', type: 'Excel', size: '0.8 MB', date: '2024-01-01', category: 'আর্থিক' },
  { id: 'd4', name: 'ছাত্র ভর্তি নীতিমালা', type: 'DOC', size: '0.5 MB', date: '2024-01-05', category: 'নীতিমালা' },
  { id: 'd5', name: 'পরীক্ষার নিয়মাবলী', type: 'PDF', size: '1.8 MB', date: '2024-03-20', category: 'পরীক্ষা' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'অফিশিয়াল': 'bg-blue-100 text-blue-700', 'নিয়োগ': 'bg-purple-100 text-purple-700',
  'আর্থিক': 'bg-green-100 text-green-700', 'নীতিমালা': 'bg-amber-100 text-amber-700',
  'পরীক্ষা': 'bg-rose-100 text-rose-700',
};

export default function AdminDocsPage() {
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'অফিশিয়াল' });

  const addDoc = () => {
    if (!form.name) return;
    setDocs(p => [{ id: `d${Date.now()}`, name: form.name, type: 'PDF', size: '—', date: new Date().toISOString().split('T')[0], category: form.category }, ...p]);
    setShowUpload(false);
    setForm({ name: '', category: 'অফিশিয়াল' });
  };

  return (
    <div>
      <DashboardHeader title="ডকুমেন্ট স্টোর" subtitle="গুরুত্বপূর্ণ নথিপত্র সংরক্ষণ ও পরিচালনা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Upload size={16} /> ডকুমেন্ট আপলোড করুন
        </button>

        {showUpload && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn space-y-3">
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="ডকুমেন্টের নাম *"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
            <div className="flex gap-3">
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                {Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
              <Upload size={20} className="mx-auto mb-2 text-gray-300" />
              ফাইল টেনে এখানে ছাড়ুন অথবা ক্লিক করুন
            </div>
            <div className="flex gap-2">
              <button onClick={addDoc} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">সংরক্ষণ</button>
              <button onClick={() => setShowUpload(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map(doc => (
            <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{doc.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[doc.category]}`}>{doc.category}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{doc.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                <span>{doc.date} · {doc.size}</span>
                <div className="flex gap-1">
                  <button className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100"><Download size={12} /></button>
                  <button onClick={() => setDocs(p => p.filter(d => d.id !== doc.id))} className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
