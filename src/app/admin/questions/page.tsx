'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES } from '@/lib/data';
import { HelpCircle, FileText, Eye, X, Download, ChevronDown, Search, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { kvGet, kvSet } from '@/lib/supabase/kv';

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

const EXAM_OPTIONS = ['সব পরীক্ষা', 'বার্ষিক পরীক্ষা ২০২৫', 'অর্ধবার্ষিক পরীক্ষা ২০২৫', 'মাসিক পরীক্ষা', 'নির্বাচনী পরীক্ষা'];

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionPaper[]>([]);
  const [viewPdf, setViewPdf] = useState<QuestionPaper | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [filterClass, setFilterClass] = useState('all');
  const [filterExam, setFilterExam] = useState('সব পরীক্ষা');
  const [search, setSearch] = useState('');

  useEffect(() => {
    kvGet<QuestionPaper[]>('question_papers_store').then(data => {
      if (data) setQuestions(data);
    });
  }, []);

  const saveQuestions = (updated: QuestionPaper[]) => {
    setQuestions(updated);
    kvSet('question_papers_store', updated);
  };

  const getClassName = (id: string) => MADRASHA_CLASSES.find(c => c.id === id)?.nameBn ?? id;

  const filtered = questions
    .filter(q => filterClass === 'all' || q.class === filterClass)
    .filter(q => filterExam === 'সব পরীক্ষা' || q.exam === filterExam)
    .filter(q => !search || q.subject.toLowerCase().includes(search.toLowerCase()) || q.teacherName.toLowerCase().includes(search.toLowerCase()) || q.exam.toLowerCase().includes(search.toLowerCase()));

  const downloadPdf = (q: QuestionPaper) => {
    const a = document.createElement('a');
    a.href = q.fileData;
    a.download = q.fileName;
    a.click();
  };

  const classCounts = MADRASHA_CLASSES.map(c => ({
    ...c,
    count: questions.filter(q => q.class === c.id).length,
  }));

  return (
    <div>
      <DashboardHeader title="প্রশ্নপত্র ব্যবস্থাপনা" subtitle="শিক্ষকদের জমা দেওয়া সকল প্রশ্নপত্র" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'মোট প্রশ্নপত্র', value: questions.length, color: 'bg-purple-50 text-purple-700' },
            { label: 'জমাকৃত', value: questions.filter(q => q.status === 'submitted').length, color: 'bg-green-50 text-green-700' },
            { label: 'শ্রেণি', value: new Set(questions.map(q => q.class)).size, color: 'bg-blue-50 text-blue-700' },
            { label: 'পরীক্ষা', value: new Set(questions.map(q => q.exam)).size, color: 'bg-amber-50 text-amber-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-4 ${s.color} border border-white`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs mt-0.5 opacity-80">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-44">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="বিষয়, শিক্ষক বা পরীক্ষা খুঁজুন..."
              className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
          </div>

          {/* Class filter */}
          <div className="relative">
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
              className="pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none font-medium">
              <option value="all">সব শ্রেণি</option>
              {classCounts.filter(c => c.count > 0).map(c => (
                <option key={c.id} value={c.id}>{c.nameBn} ({c.count})</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Exam filter */}
          <div className="relative">
            <select value={filterExam} onChange={e => setFilterExam(e.target.value)}
              className="pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none font-medium">
              {EXAM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Questions list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
            <HelpCircle size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {questions.length === 0 ? 'কোনো প্রশ্নপত্র এখনো জমা দেওয়া হয়নি।' : 'এই ফিল্টারে কোনো প্রশ্নপত্র পাওয়া যায়নি।'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(q => (
              <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{q.subject} — {q.exam}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-400">
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">{getClassName(q.class)}</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">{q.status === 'submitted' ? 'জমাকৃত' : 'খসড়া'}</span>
                      <span>শিক্ষক: {q.teacherName}</span>
                      <span>•</span>
                      <span>{q.fileName}</span>
                      <span>•</span>
                      <span>{q.fileSize}</span>
                      <span>•</span>
                      <span>জমা: {q.submittedAt}</span>
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
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF viewer modal */}
      {viewPdf && (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col">
          <div className="flex items-center justify-between bg-white px-5 py-3 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{viewPdf.subject} — {viewPdf.exam}</h3>
              <p className="text-xs text-gray-400">{getClassName(viewPdf.class)} • শিক্ষক: {viewPdf.teacherName} • {viewPdf.fileName} • {viewPdf.fileSize}</p>
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
          onConfirm={() => {
            saveQuestions(questions.filter(q => q.id !== deleteTarget.id));
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
