'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { NOTES } from '@/lib/data';
import { FileText, Download, BookOpen, Lightbulb, User, Search } from 'lucide-react';
import type { Note } from '@/lib/types';
import { kvGet } from '@/lib/supabase/kv';

export default function StudentNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'note' | 'suggestion'>('note');

  useEffect(() => {
    kvGet<Note[]>('notes_store').then(data => {
      setNotes(data ?? NOTES);
    });
  }, []);

  const filtered = notes
    .filter(n => n.type === activeTab)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.subject.toLowerCase().includes(search.toLowerCase()));

  const downloadNote = (note: Note) => {
    const content = note.content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    const text = `${note.title}\n${'='.repeat(note.title.length)}\n\nবিষয়: ${note.subject}\nতারিখ: ${note.createdAt}\nশিক্ষক: ${note.teacherName}\n\n${content}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <DashboardHeader title="নোট ও সাজেশন" subtitle="শিক্ষকদের দেওয়া নোট ও সাজেশন" userName="Mohammad Rafiqul Islam" role="ছাত্র" />
      <div className="p-6 space-y-5">

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {([['note', 'নোটস', BookOpen], ['suggestion', 'সাজেশন', Lightbulb]] as const).map(([tab, label, Icon]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icon size={15} /> {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'}`}>
                {notes.filter(n => n.type === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="শিরোনাম বা বিষয় দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
        </div>

        {/* Notes grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <FileText size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">কোনো {activeTab === 'note' ? 'নোট' : 'সাজেশন'} পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(note => (
              <div key={note.id}
                className={`bg-white rounded-2xl border hover:shadow-md transition-all p-5 ${activeTab === 'suggestion' ? 'border-amber-100 hover:border-amber-300' : 'border-gray-100 hover:border-purple-200'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeTab === 'suggestion' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                    {activeTab === 'suggestion'
                      ? <Lightbulb size={18} className="text-amber-500" />
                      : <BookOpen size={18} className="text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{note.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${activeTab === 'suggestion' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {note.subject}
                    </span>
                  </div>
                </div>

                <div
                  className="rich-editor text-xs text-gray-500 line-clamp-4 mb-4 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: note.content || note.content }}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <User size={11} className={activeTab === 'suggestion' ? 'text-amber-400' : 'text-purple-400'} />
                    <span>{note.teacherName}</span>
                    <span className="text-gray-300">•</span>
                    <span>{note.createdAt}</span>
                  </div>
                  <button onClick={() => downloadNote(note)}
                    className={`flex items-center gap-1.5 text-xs font-semibold hover:underline transition-colors ${activeTab === 'suggestion' ? 'text-amber-600 hover:text-amber-800' : 'text-purple-600 hover:text-purple-800'}`}>
                    <Download size={13} /> ডাউনলোড
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
