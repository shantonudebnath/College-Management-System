'use client';
import { useState, useRef } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { FolderOpen, FileText, Upload, Trash2, Download, X } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface Doc { id: string; name: string; type: string; size: string; date: string; category: string; fileData?: string; fileName?: string; }

const INITIAL_DOCS: Doc[] = [
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
  const [docs, setDocs] = useState<Doc[]>(INITIAL_DOCS);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'অফিশিয়াল' });
  const [pickedFile, setPickedFile] = useState<{ name: string; data: string; size: string; type: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKB = file.size / 1024;
    const sizeLabel = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(0)} KB`;
    const ext = file.name.split('.').pop()?.toUpperCase() ?? 'FILE';
    const reader = new FileReader();
    reader.onload = () => setPickedFile({ name: file.name, data: reader.result as string, size: sizeLabel, type: ext });
    reader.readAsDataURL(file);
  };

  const addDoc = () => {
    const docName = form.name || pickedFile?.name || '';
    if (!docName) return;
    const newDoc: Doc = {
      id: `d${Date.now()}`,
      name: docName,
      type: pickedFile?.type ?? 'FILE',
      size: pickedFile?.size ?? '—',
      date: new Date().toISOString().split('T')[0],
      category: form.category,
      fileData: pickedFile?.data,
      fileName: pickedFile?.name,
    };
    setDocs(p => [newDoc, ...p]);
    setShowUpload(false);
    setForm({ name: '', category: 'অফিশিয়াল' });
    setPickedFile(null);
  };

  const handleDownload = (doc: Doc) => {
    if (!doc.fileData) {
      alert('এই ডকুমেন্টে কোনো ফাইল সংযুক্ত নেই।');
      return;
    }
    const a = document.createElement('a');
    a.href = doc.fileData;
    a.download = doc.fileName ?? doc.name;
    a.click();
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
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">নতুন ডকুমেন্ট</h3>
              <button onClick={() => { setShowUpload(false); setPickedFile(null); }} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="ডকুমেন্টের নাম (ঐচ্ছিক — ফাইল নাম ব্যবহার হবে)"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
              {Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFilePick} />
            {pickedFile ? (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                <FileText size={14} className="text-blue-600 shrink-0" />
                <span className="text-sm text-blue-700 flex-1 truncate">{pickedFile.name} · {pickedFile.size}</span>
                <button onClick={() => setPickedFile(null)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><X size={12} /> সরান</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <Upload size={20} className="mx-auto mb-2 text-gray-300" />
                ফাইল বেছে নিতে ক্লিক করুন
              </button>
            )}
            <div className="flex gap-2">
              <button onClick={addDoc} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">সংরক্ষণ</button>
              <button onClick={() => { setShowUpload(false); setPickedFile(null); }} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
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
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[doc.category] ?? 'bg-gray-100 text-gray-600'}`}>{doc.category}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{doc.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                <span>{doc.date} · {doc.size}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDownload(doc)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${doc.fileData ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    title={doc.fileData ? 'ডাউনলোড করুন' : 'ফাইল নেই'}
                  >
                    <Download size={12} />
                  </button>
                  <button onClick={() => setDeleteTarget({ id: doc.id, name: doc.name })} className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          itemName={deleteTarget.name}
          onConfirm={() => { setDocs(p => p.filter(d => d.id !== deleteTarget.id)); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
