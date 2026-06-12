'use client';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useNotices } from '@/context/NoticesContext';
import { Bell, AlertCircle, Paperclip } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  exam: 'bg-blue-100 text-blue-700', fee: 'bg-amber-100 text-amber-700',
  result: 'bg-green-100 text-green-700', holiday: 'bg-rose-100 text-rose-700', general: 'bg-gray-100 text-gray-600',
};
const TYPE_LABELS: Record<string, string> = {
  exam: 'পরীক্ষা', fee: 'ফি', result: 'ফলাফল', holiday: 'ছুটি', general: 'সাধারণ',
};

export default function StudentNoticePage() {
  const { notices } = useNotices();
  const studentNotices = notices.filter(n => n.target === 'all' || n.target === 'student');

  return (
    <div>
      <DashboardHeader title="নোটিশ বোর্ড" subtitle="আপনার জন্য নোটিশসমূহ" userName="Mohammad Rafiqul Islam" role="ছাত্র" />
      <div className="p-6 space-y-4">
        {studentNotices.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">কোনো নোটিশ নেই।</div>
        )}
        {studentNotices.map(notice => (
          <div key={notice.id} className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${notice.isImportant ? 'border-red-200 bg-red-50/50' : 'border-gray-100 hover:border-purple-200'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${notice.isImportant ? 'bg-red-100' : 'bg-purple-50'}`}>
                {notice.isImportant ? <AlertCircle size={18} className="text-red-500" /> : <Bell size={18} className="text-purple-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${TYPE_COLORS[notice.type]}`}>
                    {TYPE_LABELS[notice.type]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{notice.content}</p>
                {notice.attachmentData && (
                  <a href={notice.attachmentData} download={notice.attachmentName ?? 'file'}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 transition-colors">
                    <Paperclip size={11} /> PDF — {notice.attachmentName}
                  </a>
                )}
                <p className="text-[11px] text-gray-400 mt-3">📅 {notice.date} · 👤 {notice.postedBy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
