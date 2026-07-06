'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useNotices } from '@/context/NoticesContext';
import Link from 'next/link';
import { Bell, Plus, Trash2, Edit, AlertCircle, Send, Paperclip, X, ExternalLink } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import type { Notice } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export default function AdminNoticesPage() {
  const { notices, addNotice, updateNotice, deleteNotice } = useNotices();
  const { toast, ToastEl } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Notice | null>(null);
  const [form, setForm] = useState({ title: '', content: '', type: 'general', target: 'all', isImportant: false });
  const [attachFile, setAttachFile] = useState<{ name: string; data: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) { setAttachFile(null); return; }
    if (file.size > 512 * 1024) {
      toast('ফাইল সাইজ ৫০০KB এর বেশি হতে পারবে না।', 'error');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAttachFile({ name: file.name, data: reader.result as string });
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm({ title: '', content: '', type: 'general', target: 'all', isImportant: false });
    setAttachFile(null);
    setShowForm(true);
  };

  const openEdit = (n: Notice) => {
    setEditTarget(n);
    setForm({ title: n.title, content: n.content, type: n.type, target: n.target, isImportant: n.isImportant });
    setAttachFile(n.attachmentData ? { name: n.attachmentName ?? 'file', data: n.attachmentData } : null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return;
    let ok = false;
    if (editTarget) {
      ok = await updateNotice({
        ...editTarget,
        title: form.title, content: form.content,
        type: form.type as Notice['type'], target: form.target as Notice['target'],
        isImportant: form.isImportant,
        attachmentName: attachFile?.name, attachmentData: attachFile?.data,
      });
    } else {
      const n: Notice = {
        id: `n${Date.now()}`, title: form.title, content: form.content,
        date: new Date().toISOString().split('T')[0], type: form.type as Notice['type'],
        target: form.target as Notice['target'], isImportant: form.isImportant, postedBy: 'Admin',
        ...(attachFile ? { attachmentName: attachFile.name, attachmentData: attachFile.data } : {}),
      };
      ok = await addNotice(n);
    }
    if (ok) {
      toast('নোটিশ সফলভাবে প্রকাশিত হয়েছে।', 'success');
    } else {
      toast('নোটিশ সংরক্ষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    }
    setShowForm(false);
    setEditTarget(null);
    setForm({ title: '', content: '', type: 'general', target: 'all', isImportant: false });
    setAttachFile(null);
  };

  const TYPE_LABELS: Record<string, string> = { exam: 'পরীক্ষা', fee: 'ফি', result: 'ফলাফল', holiday: 'ছুটি', general: 'সাধারণ' };
  const TARGET_LABELS: Record<string, string> = { all: 'সবার জন্য', student: 'ছাত্রদের জন্য', teacher: 'শিক্ষকদের জন্য' };
  const TYPE_COLORS: Record<string, string> = {
    exam: 'bg-blue-100 text-blue-700', fee: 'bg-amber-100 text-amber-700',
    result: 'bg-green-100 text-green-700', holiday: 'bg-rose-100 text-rose-700', general: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      {ToastEl}
      <DashboardHeader title="নোটিশ ব্যবস্থাপনা" subtitle="নোটিশ তৈরি ও পরিচালনা করুন" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        <div className="flex gap-3 flex-wrap">
          <Link href="/notice" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
            <ExternalLink size={14} /> সাইটে দেখুন
          </Link>
          <button onClick={openAdd} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
            <Plus size={16} /> নতুন নোটিশ তৈরি
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{editTarget ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ'}</h3>
              <button onClick={() => { setShowForm(false); setEditTarget(null); }} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="নোটিশের শিরোনাম *"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder="নোটিশের বিষয়বস্তু *" rows={4}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 resize-none" />

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">ফাইল সংযুক্ত করুন <span className="text-gray-400 font-normal">(ঐচ্ছিক · সর্বোচ্চ ৫০০KB)</span></label>
              {attachFile ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                  <Paperclip size={14} className="text-blue-600 shrink-0" />
                  <span className="text-sm text-blue-700 flex-1 truncate">{attachFile.name}</span>
                  <button onClick={() => setAttachFile(null)} className="text-xs text-red-500 hover:text-red-700 shrink-0 flex items-center gap-1">
                    <X size={12} /> সরান
                  </button>
                </div>
              ) : (
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 file:mr-3 file:text-xs file:font-semibold file:text-purple-700 file:bg-purple-50 file:border-0 file:rounded-lg file:px-2.5 file:py-1.5 file:cursor-pointer" />
              )}
            </div>

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
              <button onClick={handleSave} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
                <Send size={14} /> {editTarget ? 'আপডেট করুন' : 'প্রকাশ করুন'}
              </button>
              <button onClick={() => { setShowForm(false); setEditTarget(null); setAttachFile(null); }} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
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
                {notice.attachmentData && (
                  <a href={notice.attachmentData} download={notice.attachmentName ?? 'file'}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 transition-colors">
                    <Paperclip size={11} /> PDF — {notice.attachmentName}
                  </a>
                )}
                <p className="text-xs text-gray-400 mt-2">📅 {notice.date}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(notice)} className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-100" title="সম্পাদনা করুন"><Edit size={14} /></button>
                <button onClick={() => setDeleteTarget({ id: notice.id, name: notice.title })} className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100" title="মুছুন"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          itemName={deleteTarget.name}
          onConfirm={async () => { await deleteNotice(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
