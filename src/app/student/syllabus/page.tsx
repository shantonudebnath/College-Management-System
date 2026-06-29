'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { SYLLABUS } from '@/lib/data';
import { BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { Syllabus } from '@/lib/types';
import { kvGet } from '@/lib/supabase/kv';

const STATUS_MAP = {
  completed: { label: 'সম্পন্ন', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  ongoing: { label: 'চলমান', color: 'bg-blue-100 text-blue-700', icon: Clock },
  pending: { label: 'বাকি', color: 'bg-gray-100 text-gray-600', icon: AlertCircle },
};

export default function SyllabusPage() {
  const [syllabus, setSyllabus] = useState<(Syllabus & { content?: string })[]>([]);

  useEffect(() => {
    kvGet<Syllabus[]>('syllabus_store').then(data => {
      setSyllabus(data ?? SYLLABUS);
    });
  }, []);

  const subjects = [...new Set(syllabus.map(s => s.subject))];
  const done = syllabus.filter(s => s.status === 'completed').length;
  const total = syllabus.length;
  const completedPct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <DashboardHeader title="সিলেবাস" subtitle="বিষয়ভিত্তিক পাঠ্যক্রম ও অগ্রগতি" userName="Mohammad Rafiqul Islam" role="ছাত্র" />
      <div className="p-6 space-y-6">

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">মোট সিলেবাস সম্পন্ন</h3>
            <span className="text-2xl font-bold text-purple-600">{completedPct}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${completedPct}%` }} />
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            {Object.entries(STATUS_MAP).map(([key, { label, color }]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${color}`}>
                  {syllabus.filter(s => s.status === key).length}
                </span>
                <span className="text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Syllabus by subject */}
        {subjects.map(subject => {
          const chapters = syllabus.filter(s => s.subject === subject);
          return (
            <div key={subject} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-purple-50 px-5 py-3 border-b border-purple-100 flex items-center gap-2">
                <BookOpen size={16} className="text-purple-600" />
                <h3 className="font-semibold text-purple-900">{subject}</h3>
                <span className="text-xs text-purple-500 ml-auto">{chapters.length}টি অধ্যায়</span>
              </div>
              <div className="divide-y divide-gray-50">
                {chapters.map((chapter, idx) => {
                  const status = STATUS_MAP[chapter.status];
                  const Icon = status.icon;
                  return (
                    <div key={idx} className="px-5 py-4 flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${status.color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{chapter.chapter}</p>
                        {chapter.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {chapter.topics.map(topic => (
                              <span key={topic} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{topic}</span>
                            ))}
                          </div>
                        )}
                        {chapter.content && (
                          <div
                            className="rich-editor text-xs text-gray-500 mt-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: chapter.content }}
                          />
                        )}
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${status.color}`}>{status.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {subjects.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <BookOpen size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">সিলেবাস এখনো তৈরি হয়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
}
