'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { NOTES, SUBJECTS_BY_CLASS } from '@/lib/data';
import { FileText, Plus, Trash2, Edit, Save, X, ChevronDown } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';
import type { Note } from '@/lib/types';
import { kvGet, kvSet } from '@/lib/supabase/kv';

const TEACHER_ID = 't3';
const TEACHER_NAME = 'Md. Shafiqul Islam';
const DEFAULT_CLASS = 'class-10';

const emptyNote = { title: '', content: '', subject: '', type: 'note' as 'note' | 'suggestion' };

export default function TeacherNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newNote, setNewNote] = useState({ ...emptyNote });
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    kvGet<Note[]>('notes_store').then(data => {
      setNotes(data ?? NOTES.filter(n => n.teacherId === TEACHER_ID || n.teacherId === 't1'));
    });
  }, []);

  const subjects = (SUBJECTS_BY_CLASS[DEFAULT_CLASS as keyof typeof SUBJECTS_BY_CLASS] ?? []).map((s: { name: string }) => s.name);

  const addNote = () => {
    if (!newNote.title.trim()) return;
    const note: Note = {
      id: `note-${Date.now()}`,
      title: newNote.title,
      content: newNote.content,
      class: DEFAULT_CLASS,
      subject: newNote.subject || (subjects[0] ?? 'সাধারণ'),
      teacherId: TEACHER_ID,
      teacherName: TEACHER_NAME,
      createdAt: new Date().toISOString().split('T')[0],
      type: newNote.type,
    };
    const updated = [note, ...notes];
    setNotes(updated);
    kvSet('notes_store', updated).catch(console.error);
    setNewNote({ ...emptyNote });
    setShowNew(false);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    kvSet('notes_store', updated).catch(console.error);
  };

  const startEdit = (note: Note) => {
    setEditId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = (id: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, content: editContent } : n);
    setNotes(updated);
    kvSet('notes_store', updated).catch(console.error);
    setEditId(null);
    setEditContent('');
  };

  return (
    <div>
      <DashboardHeader title="আমার নোটস ও সাজেশন" subtitle="নোট তৈরি, সম্পাদনা ও পরিচালনা করুন" userName={TEACHER_NAME} role="শিক্ষক" />
      <div className="p-6 space-y-5">

        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={16} /> নতুন নোট তৈরি করুন
        </button>

        {/* New note form */}
        {showNew && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">নতুন নোট</h3>
              <button onClick={() => setShowNew(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">শিরোনাম *</label>
                  <input value={newNote.title} onChange={e => setNewNote(p => ({ ...p, title: e.target.value }))}
                    placeholder="নোটের শিরোনাম লিখুন"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">ধরন</label>
                  <div className="relative">
                    <select value={newNote.type} onChange={e => setNewNote(p => ({ ...p, type: e.target.value as 'note' | 'suggestion' }))}
                      className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none">
                      <option value="note">নোট</option>
                      <option value="suggestion">সাজেশন</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">বিষয়</label>
                <div className="relative">
                  <select value={newNote.subject} onChange={e => setNewNote(p => ({ ...p, subject: e.target.value }))}
                    className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none">
                    <option value="">— বিষয় বেছে নিন —</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">নোটের বিষয়বস্তু</label>
                <RichTextEditor
                  value={newNote.content}
                  onChange={v => setNewNote(p => ({ ...p, content: v }))}
                  placeholder="এখানে নোট লিখুন — শিরোনাম, তালিকা, গুরুত্বপূর্ণ পয়েন্ট যোগ করুন..."
                  minHeight="200px"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={addNote} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"><Save size={14} /> সংরক্ষণ</button>
                <button onClick={() => setShowNew(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"><X size={14} /> বাতিল</button>
              </div>
            </div>
          </div>
        )}

        {/* Notes list */}
        <div className="space-y-4">
          {notes.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <FileText size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">এখনো কোনো নোট নেই।</p>
            </div>
          )}
          {notes.map(note => (
            <div key={note.id} className={`bg-white rounded-2xl border hover:shadow-md transition-all overflow-hidden ${note.type === 'suggestion' ? 'border-amber-100 hover:border-amber-200' : 'border-gray-100 hover:border-purple-200'}`}>
              <div className="flex items-start gap-3 p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${note.type === 'suggestion' ? 'bg-amber-100' : 'gradient-primary'}`}>
                  <FileText size={18} className={note.type === 'suggestion' ? 'text-amber-600' : 'text-white'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{note.title}</h3>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${note.type === 'suggestion' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'}`}>
                          {note.type === 'suggestion' ? 'সাজেশন' : 'নোট'}
                        </span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{note.subject}</span>
                        <span className="text-[10px] text-gray-400">{note.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {editId === note.id ? (
                        <>
                          <button onClick={() => saveEdit(note.id)} className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100"><Save size={14} /></button>
                          <button onClick={() => setEditId(null)} className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100"><X size={14} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(note)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"><Edit size={14} /></button>
                          <button onClick={() => deleteNote(note.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  </div>

                  {editId === note.id ? (
                    <div className="mt-3">
                      <RichTextEditor
                        value={editContent}
                        onChange={setEditContent}
                        placeholder="নোট সম্পাদনা করুন..."
                        minHeight="160px"
                      />
                    </div>
                  ) : (
                    <div
                      className="rich-editor text-sm text-gray-600 mt-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
