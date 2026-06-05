'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { NOTES } from '@/lib/data';
import { FileText, Plus, Trash2, Edit, Save, X } from 'lucide-react';

export default function TeacherNotesPage() {
  const [notes, setNotes] = useState(NOTES.filter(n => n.teacherId === 't3' || n.teacherId === 't1'));
  const [showNew, setShowNew] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', subject: '' });
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const addNote = () => {
    if (!newNote.title.trim()) return;
    setNotes(p => [{
      id: `note-${Date.now()}`, title: newNote.title, content: newNote.content,
      class: 'class-10', subject: newNote.subject || 'Mathematics',
      teacherId: 't3', teacherName: 'Md. Shafiqul Islam',
      createdAt: new Date().toISOString().split('T')[0], type: 'note',
    }, ...p]);
    setNewNote({ title: '', content: '', subject: '' });
    setShowNew(false);
  };

  const deleteNote = (id: string) => setNotes(p => p.filter(n => n.id !== id));

  const saveEdit = (id: string) => {
    setNotes(p => p.map(n => n.id === id ? { ...n, content: editContent } : n));
    setEditing(null);
  };

  return (
    <div>
      <DashboardHeader title="আমার নোটস" subtitle="নোট তৈরি, সম্পাদনা ও পরিচালনা করুন" userName="Md. Shafiqul Islam" role="শিক্ষক" />
      <div className="p-6 space-y-5">
        {/* New note button */}
        <button onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={16} /> নতুন নোট তৈরি করুন
        </button>

        {/* New note form */}
        {showNew && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn">
            <h3 className="font-semibold text-gray-900 mb-4">নতুন নোট</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শিরোনাম *</label>
                <input value={newNote.title} onChange={e => setNewNote(p => ({ ...p, title: e.target.value }))}
                  placeholder="নোটের শিরোনাম লিখুন"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">বিষয়</label>
                <input value={newNote.subject} onChange={e => setNewNote(p => ({ ...p, subject: e.target.value }))}
                  placeholder="বিষয়ের নাম"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">নোটের বিষয়বস্তু</label>
                <textarea value={newNote.content} onChange={e => setNewNote(p => ({ ...p, content: e.target.value }))}
                  placeholder="এখানে নোট লিখুন..."
                  rows={6}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 resize-none font-mono" />
              </div>
              <div className="flex gap-2">
                <button onClick={addNote} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"><Save size={14} /> সংরক্ষণ</button>
                <button onClick={() => setShowNew(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"><X size={14} /> বাতিল</button>
              </div>
            </div>
          </div>
        )}

        {/* Notes list */}
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 transition-all overflow-hidden">
              <div className="flex items-start gap-3 p-5">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{note.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{note.subject}</span>
                        <span className="text-[10px] text-gray-400">{note.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditing(note.id); setEditContent(note.content); }}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => deleteNote(note.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {editing === note.id ? (
                    <div className="mt-3">
                      <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={5}
                        className="w-full px-3 py-2 bg-gray-50 border border-purple-300 rounded-xl text-sm outline-none resize-none font-mono" />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => saveEdit(note.id)} className="flex items-center gap-1.5 text-xs btn-primary px-4 py-1.5 rounded-lg"><Save size={12} /> সংরক্ষণ</button>
                        <button onClick={() => setEditing(null)} className="text-xs px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"><X size={12} /></button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">{note.content}</p>
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
