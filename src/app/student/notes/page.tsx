import DashboardHeader from '@/components/layout/DashboardHeader';
import { NOTES } from '@/lib/data';
import { FileText, Download, BookOpen, Lightbulb, User } from 'lucide-react';

export default function StudentNotesPage() {
  const notes = NOTES.filter(n => n.type === 'note');
  const suggestions = NOTES.filter(n => n.type === 'suggestion');

  return (
    <div>
      <DashboardHeader title="নোট ও সাজেশন" subtitle="শিক্ষকদের দেওয়া নোট ও সাজেশন" userName="Mohammad Rafiqul Islam" role="ছাত্র" />
      <div className="p-6 space-y-6">
        {/* Notes */}
        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <FileText size={18} className="text-purple-600" /> নোটস ({notes.length}টি)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes.map(note => (
              <div key={note.id} className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <BookOpen size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{note.title}</h3>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">{note.subject}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{note.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <User size={11} className="text-purple-400" />
                    <span>{note.teacherName}</span>
                    <span className="text-gray-300">•</span>
                    <span>{note.createdAt}</span>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold hover:text-purple-800 transition-colors">
                    <Download size={13} /> ডাউনলোড
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Lightbulb size={18} className="text-amber-500" /> সাজেশন ({suggestions.length}টি)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestions.map(note => (
              <div key={note.id} className="bg-white rounded-2xl border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <Lightbulb size={18} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{note.title}</h3>
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full mt-1 inline-block">{note.subject}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{note.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <User size={11} className="text-amber-400" />
                    <span>{note.teacherName}</span>
                    <span className="text-gray-300">•</span>
                    <span>{note.createdAt}</span>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold hover:text-amber-800 transition-colors">
                    <Download size={13} /> ডাউনলোড
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
