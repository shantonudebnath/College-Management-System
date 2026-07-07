'use client';
import { useState, useRef, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES, SUBJECTS_BY_CLASS } from '@/lib/data';
import { HelpCircle, Plus, Send, Trash2, Lock, FileText, Upload, Eye, X, Download, ChevronDown } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { kvGet, kvSet } from '@/lib/supabase/kv';
import { useToast } from '@/components/ui/Toast';
import { useTeachers } from '@/context/TeachersContext';
import { useCurrentTeacher } from '@/context/CurrentTeacherContext';

interface QuestionPaper {
  id: string;
  subject: string;
  exam: string;
  class: string;
  submittedAt: string;
  status: 'submitted' | 'draft';
  fileName: string;
  fileData: string;
  fileSize: string;
  teacherName: string;
}

const emptyForm = {
  subject: '',
  exam: 'বার্ষিক পরীক্ষা ২০২৫',
  class: 'class-10',
  totalMarks: '100',
  time: '৩ ঘণ্টা',
};

export default function TeacherQuestionsPage() {
  const { currentTeacherId } = useCurrentTeacher();
  const { teachers } = useTeachers();
  const teacher = teachers.find(t => t.id === currentTeacherId);
  const [questions, setQuestions] = useState<QuestionPaper[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [showForm, setShowForm] = useState(false);
  const [pdfFile, setPdfFile] = useState<{ name: string; data: string; size: string } | null>(null);
  const [viewPdf, setViewPdf] = useState<QuestionPaper | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast, ToastEl } = useToast();

  useEffect(() => {
    kvGet<QuestionPaper[]>('question_papers_store').then(data => {
      if (data) setQuestions(data);
    });
  }, []);

  const subjects = (SUBJECTS_BY_CLASS[form.class as keyof typeof SUBJECTS_BY_CLASS] ?? []).map((s: { name: string }) => s.name);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast('শুধুমাত্র PDF ফাইল আপলোড করুন।', 'error');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const sizeKB = (file.size / 1024).toFixed(1);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setPdfFile({
        name: file.name,
        data: reader.result as string,
        size: file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`,
      });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!pdfFile || !form.subject) return;
    const q: QuestionPaper = {
      id: `q${Date.now()}`,
      subject: form.subject,
      exam: form.exam,
      class: form.class,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'submitted',
      fileName: pdfFile.name,
      fileData: pdfFile.data,
      fileSize: pdfFile.size,
      teacherName: teacher?.name ?? 'শিক্ষক',
    };
    const updated = [q, ...questions];
    setQuestions(updated);
    kvSet('question_papers_store', updated).catch(console.error);
    setPdfFile(null);
    setForm({ ...emptyForm });
    setShowForm(false);
  };

  const downloadPdf = (q: QuestionPaper) => {
    const a = document.createElement('a');
    a.href = q.fileData;
    a.download = q.fileName;
    a.click();
  };

  const getClassName = (id: string) => MADRASHA_CLASSES.find(c => c.id === id)?.nameBn ?? id;

  return (
    <div>
      {ToastEl}
      <DashboardHeader title="প্রশ্নপত্র দাখিল" subtitle="পরীক্ষার প্রশ্নপত্র PDF আপলোড করুন" userName={teacher?.name ?? 'শিক্ষক'} role="শিক্ষক" userImage={teacher?.image} />
      <div className="p-6 space-y-5">

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-sm text-amber-800">
          <Lock size={16} className="text-amber-600 shrink-0" />
          <span>প্রশ্নপত্র সাবমিটের পর শুধু অ্যাডমিন ও শিক্ষক দেখতে পারবেন। পরীক্ষার আগ পর্যন্ত এটি সম্পূর্ণ গোপন থাকবে।</span>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={16} /> নতুন প্রশ্নপত্র আপলোড করুন
        </button>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">প্রশ্নপত্র তথ্য</h3>
              <button onClick={() => { setShowForm(false); setPdfFile(null); }} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শ্রেণি *</label>
                <div className="relative">
                  <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value, subject: '' }))}
                    className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none">
                    {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">বিষয় *</label>
                <div className="relative">
                  {subjects.length > 0 ? (
                    <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none">
                      <option value="">— বিষয় বেছে নিন —</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      placeholder="বিষয়ের নাম" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                  )}
                  {subjects.length > 0 && <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">পরীক্ষার নাম</label>
                <input value={form.exam} onChange={e => setForm(p => ({ ...p, exam: e.target.value }))}
                  placeholder="পরীক্ষার নাম" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">পূর্ণমান</label>
                <input value={form.totalMarks} onChange={e => setForm(p => ({ ...p, totalMarks: e.target.value }))}
                  placeholder="100" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
            </div>

            {/* PDF Upload area */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">প্রশ্নপত্র PDF *</label>
              {pdfFile ? (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <FileText size={20} className="text-green-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-green-800 truncate">{pdfFile.name}</p>
                    <p className="text-xs text-green-600">{pdfFile.size}</p>
                  </div>
                  <button onClick={() => { setPdfFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                    className="p-1 rounded-lg hover:bg-green-100 text-green-700"><X size={15} /></button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${uploading ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'}`}
                >
                  <Upload size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">{uploading ? 'আপলোড হচ্ছে...' : 'PDF ফাইল আপলোড করুন'}</p>
                  <p className="text-xs text-gray-400 mt-1">ক্লিক করুন অথবা ফাইল টেনে আনুন • সর্বোচ্চ ১০ MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
            </div>

            <div className="flex gap-2">
              <button onClick={submit} disabled={!pdfFile || !form.subject}
                className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                <Send size={14} /> দাখিল করুন
              </button>
              <button onClick={() => { setShowForm(false); setPdfFile(null); }} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        {/* Questions list */}
        <div className="space-y-3">
          {questions.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <HelpCircle size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">কোনো প্রশ্নপত্র দাখিল হয়নি।</p>
            </div>
          )}
          {questions.map(q => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{q.subject} — {q.exam}</h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                    <span>{getClassName(q.class)}</span>
                    <span>•</span>
                    <span>{q.fileName}</span>
                    <span>•</span>
                    <span>{q.fileSize}</span>
                    <span>•</span>
                    <span>দাখিল: {q.submittedAt}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setViewPdf(q)}
                    className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors">
                    <Eye size={13} /> দেখুন
                  </button>
                  <button onClick={() => downloadPdf(q)}
                    className="flex items-center gap-1.5 text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition-colors">
                    <Download size={13} /> ডাউনলোড
                  </button>
                  <button onClick={() => setDeleteTarget({ id: q.id, name: `${q.subject} - ${q.exam}` })}
                    className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF viewer modal */}
      {viewPdf && (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col">
          <div className="flex items-center justify-between bg-white px-5 py-3 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{viewPdf.subject} — {viewPdf.exam}</h3>
              <p className="text-xs text-gray-400">{viewPdf.fileName} • {viewPdf.fileSize}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => downloadPdf(viewPdf)}
                className="flex items-center gap-1.5 text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg font-medium">
                <Download size={13} /> ডাউনলোড
              </button>
              <button onClick={() => setViewPdf(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
            </div>
          </div>
          <iframe src={viewPdf.fileData} className="flex-1 w-full" title="PDF Viewer" />
        </div>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          itemName={deleteTarget.name}
          onConfirm={() => { const updated = questions.filter(q => q.id !== deleteTarget.id); setQuestions(updated); kvSet('question_papers_store', updated).catch(console.error); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
