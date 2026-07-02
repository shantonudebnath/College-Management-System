'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { SYLLABUS, MADRASHA_CLASSES, SUBJECTS_BY_CLASS } from '@/lib/data';
import { BookOpen, Plus, Save, CheckCircle, Clock, AlertCircle, Trash2, X, ChevronDown, Edit } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';
import type { Syllabus } from '@/lib/types';
import { kvGet, kvSet } from '@/lib/supabase/kv';

const STATUS_OPTIONS = [
  { value: 'completed', label: 'সম্পন্ন', color: 'bg-green-100 text-green-700' },
  { value: 'ongoing', label: 'চলমান', color: 'bg-blue-100 text-blue-700' },
  { value: 'pending', label: 'বাকি', color: 'bg-gray-100 text-gray-600' },
];

const emptyForm = {
  class: 'class-10',
  subject: '',
  chapter: '',
  content: '',
  topics: '',
  status: 'pending',
};

export default function TeacherSyllabusPage() {
  const [syllabus, setSyllabus] = useState<Syllabus[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [filterClass, setFilterClass] = useState('class-10');

  useEffect(() => {
    kvGet<Syllabus[]>('syllabus_store').then(data => {
      setSyllabus(data ?? SYLLABUS);
    });
  }, []);

  const subjectsForClass = (classId: string): string[] => {
    const list = SUBJECTS_BY_CLASS[classId as keyof typeof SUBJECTS_BY_CLASS];
    if (!list) return [];
    return list.map((s: { name: string }) => s.name);
  };

  const availableSubjects = subjectsForClass(form.class);
  const filterSubjects = subjectsForClass(filterClass);

  const updateStatus = (idx: number, status: string) => {
    const updated = syllabus.map((s, i) => i === idx ? { ...s, status: status as 'completed' | 'ongoing' | 'pending' } : s);
    setSyllabus(updated);
    kvSet('syllabus_store', updated).catch(console.error);
  };

  const openAdd = () => {
    setForm({ ...emptyForm, class: filterClass });
    setEditIdx(null);
    setShowForm(true);
  };

  const openEdit = (idx: number) => {
    const s = syllabus[idx];
    setForm({
      class: s.class,
      subject: s.subject,
      chapter: s.chapter,
      content: (s as Syllabus & { content?: string }).content ?? '',
      topics: s.topics.join(', '),
      status: s.status,
    });
    setEditIdx(idx);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.chapter || !form.subject) return;
    const entry: Syllabus & { content?: string } = {
      class: form.class,
      subject: form.subject,
      chapter: form.chapter,
      content: form.content,
      topics: form.topics.split(',').map(t => t.trim()).filter(Boolean),
      status: form.status as 'completed' | 'ongoing' | 'pending',
    };
    let updated: typeof syllabus;
    if (editIdx !== null) {
      updated = syllabus.map((s, i) => i === editIdx ? entry : s);
    } else {
      updated = [...syllabus, entry];
    }
    setSyllabus(updated);
    kvSet('syllabus_store', updated).catch(console.error);
    setForm({ ...emptyForm, class: filterClass });
    setEditIdx(null);
    setShowForm(false);
  };

  const deleteEntry = (idx: number) => {
    const updated = syllabus.filter((_, i) => i !== idx);
    setSyllabus(updated);
    kvSet('syllabus_store', updated).catch(console.error);
  };

  const filtered = syllabus.filter(s => s.class === filterClass);
  const subjects = [...new Set(filtered.map(s => s.subject))];
  const done = filtered.filter(s => s.status === 'completed').length;
  const total = filtered.length;

  return (
    <div>
      <DashboardHeader title="সিলেবাস তৈরি" subtitle="শ্রেণি অনুযায়ী পাঠ্যক্রম পরিচালনা করুন" userName="Md. Shafiqul Islam" role="শিক্ষক" />
      <div className="p-6 space-y-5">

        {/* Class selector + progress */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-48">
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">শ্রেণি নির্বাচন করুন</label>
              <div className="relative">
                <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
                  className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none font-medium">
                  {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="shrink-0 pt-5">
              <button onClick={openAdd} className="flex items-center gap-2 btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold">
                <Plus size={15} /> অধ্যায় যোগ করুন
              </button>
            </div>
          </div>

          {total > 0 && (
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-semibold text-gray-900">সিলেবাস অগ্রগতি</span>
                <span className="font-bold text-purple-600">{done}/{total} অধ্যায় সম্পন্ন</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{editIdx !== null ? 'অধ্যায় সম্পাদনা' : 'নতুন অধ্যায় যোগ করুন'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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
                  {availableSubjects.length > 0 ? (
                    <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none">
                      <option value="">— বিষয় বেছে নিন —</option>
                      {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      placeholder="বিষয়ের নাম লিখুন"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                  )}
                  {availableSubjects.length > 0 && <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">অধ্যায়ের নাম *</label>
                <input value={form.chapter} onChange={e => setForm(p => ({ ...p, chapter: e.target.value }))}
                  placeholder="যেমন: ১ম অধ্যায়: সংখ্যাতত্ত্ব"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">অবস্থা</label>
                <div className="relative">
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none">
                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 block mb-1">বিষয়বস্তু (কমা দিয়ে আলাদা টপিক)</label>
                <input value={form.topics} onChange={e => setForm(p => ({ ...p, topics: e.target.value }))}
                  placeholder="যেমন: স্বাভাবিক সংখ্যা, পূর্ণসংখ্যা, মূলদ সংখ্যা"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">বিস্তারিত নোট (ঐচ্ছিক)</label>
              <RichTextEditor
                value={form.content}
                onChange={v => setForm(p => ({ ...p, content: v }))}
                placeholder="এই অধ্যায়ের বিস্তারিত লিখুন — গুরুত্বপূর্ণ পয়েন্ট, উদাহরণ, ব্যাখ্যা..."
                minHeight="160px"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={handleSave} className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Save size={14} /> সংরক্ষণ</button>
              <button onClick={() => { setShowForm(false); setEditIdx(null); }} className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        {/* Syllabus list */}
        {total === 0 && !showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <BookOpen size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">এই শ্রেণির কোনো সিলেবাস নেই।</p>
            <button onClick={openAdd} className="mt-3 text-purple-600 text-sm font-semibold hover:underline">অধ্যায় যোগ করুন →</button>
          </div>
        )}

        {subjects.map(subject => {
          const chapters = filtered.filter(s => s.subject === subject);
          return (
            <div key={subject} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-purple-50 px-5 py-3 border-b border-purple-100 flex items-center gap-2">
                <BookOpen size={15} className="text-purple-600" />
                <h3 className="font-semibold text-purple-900 text-sm">{subject}</h3>
                <span className="text-xs text-purple-400 ml-auto">{chapters.length}টি অধ্যায়</span>
              </div>
              <div className="divide-y divide-gray-50">
                {chapters.map((ch, i) => {
                  const globalIdx = syllabus.indexOf(ch);
                  const statusOpt = STATUS_OPTIONS.find(o => o.value === ch.status)!;
                  const extCh = ch as Syllabus & { content?: string };
                  return (
                    <div key={i} className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{ch.chapter}</p>
                          {ch.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {ch.topics.map(t => <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>)}
                            </div>
                          )}
                          {extCh.content && (
                            <div
                              className="rich-editor text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: extCh.content }}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <select value={ch.status}
                            onChange={e => updateStatus(globalIdx, e.target.value)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 outline-none cursor-pointer ${statusOpt.color}`}>
                            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                          <button onClick={() => openEdit(globalIdx)} className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-100">
                            <Edit size={12} />
                          </button>
                          <button onClick={() => deleteEntry(globalIdx)} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
