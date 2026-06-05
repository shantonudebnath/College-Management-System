'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { NOTICES } from '@/lib/data';
import { Bell, Plus, Trash2, Edit, AlertCircle, Send } from 'lucide-react';
import type { Notice } from '@/lib/types';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState(NOTICES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', type: 'general', target: 'all', isImportant: false });

  const addNotice = () => {
    if (!form.title || !form.content) return;
    const n: Notice = {
      id: `n${Date.now()}`, title: form.title, content: form.content,
      date: new Date().toISOString().split('T')[0], type: form.type as any,
      target: form.target as any, isImportant: form.isImportant, postedBy: 'Admin',
    };
    setNotices(p => [n, ...p]);
    setShowForm(false);
    setForm({ title: '', content: '', type: 'general', target: 'all', isImportant: false });
  };

  const TYPE_LABELS: Record<string, string> = { exam: 'পরীক্ষা', fee: 'ফি', result: 'ফলাফল', holiday: 'ছুটি', general: 'সাধারণ' };
  const TARGET_LABELS: Record<string, string> = { all: 'সবার জন্য', student: 'ছাত্রদের জন্য', teacher: 'শিক্ষকদের জন্য' };
  const TYPE_COLORS: Record<string, string> = {
    exam: 'bg-blue-100 text-blue-700', fee: 'bg-amber-100 text-amber-700',
    result: 'bg-green-100 text-green-700', holiday: 'bg-rose-100 text-rose-700', general: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      <DashboardHeader title="নোটিশ ব্যবস্থাপনা" subtitle="নোটিশ তৈরি ও পরিচালনা করুন" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={16} /> নতুন নোটিশ তৈরি
        </button>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn space-y-3">
            <h3 className="font-semibold text-gray-900">নতুন নোটিশ</h3>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="নোটিশের শিরোনাম *"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder="নোটিশের বিষয়বস্তু *" rows={4}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 resize-none" />
            <div className="flex flex-wrap gap-3">
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <select value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                {Object.entries(TARGET_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.isImportant} onChange={e => setForm(p => ({ ...p, isImportant: e.target.checked }))} className="accent-purple-600" />
                জরুরি নোটিশ
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={addNotice} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"><Send size={14} /> প্রকাশ করুন</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {notices.map(notice => (
            <div key={notice.id} className={`bg-white rounded-2xl border p-5 flex items-start gap-4 ${notice.isImportant ? 'border-red-200' : 'border-gray-100'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${notice.isImportant ? 'bg-red-100' : 'bg-purple-50'}`}>
                {notice.isImportant ? <AlertCircle size={18} className="text-red-500" /> : <Bell size={18} className="text-purple-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 flex-1">{notice.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${TYPE_COLORS[notice.type]}`}>{TYPE_LABELS[notice.type]}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full shrink-0">{TARGET_LABELS[notice.target]}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{notice.content}</p>
                <p className="text-xs text-gray-400 mt-2">📅 {notice.date}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-100"><Edit size={14} /></button>
                <button onClick={() => setNotices(p => p.filter(n => n.id !== notice.id))} className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
