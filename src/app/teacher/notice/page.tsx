import DashboardHeader from '@/components/layout/DashboardHeader';
import { NOTICES } from '@/lib/data';
import { Bell, AlertCircle } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  exam: 'bg-blue-100 text-blue-700', fee: 'bg-amber-100 text-amber-700',
  result: 'bg-green-100 text-green-700', holiday: 'bg-rose-100 text-rose-700', general: 'bg-gray-100 text-gray-600',
};
const TYPE_LABELS: Record<string, string> = {
  exam: 'পরীক্ষা', fee: 'ফি', result: 'ফলাফল', holiday: 'ছুটি', general: 'সাধারণ',
};

const teacherNotices = NOTICES.filter(n => n.target === 'all' || n.target === 'teacher');

export default function TeacherNoticePage() {
  return (
    <div>
      <DashboardHeader title="নোটিশ বোর্ড" subtitle="অ্যাডমিনের পাঠানো নোটিশ" userName="Md. Shafiqul Islam" role="শিক্ষক" />
      <div className="p-6 space-y-4">
        {teacherNotices.map(notice => (
          <div key={notice.id} className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${notice.isImportant ? 'border-red-200 bg-red-50/30' : 'border-gray-100 hover:border-purple-200'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${notice.isImportant ? 'bg-red-100' : 'bg-blue-50'}`}>
                {notice.isImportant ? <AlertCircle size={18} className="text-red-500" /> : <Bell size={18} className="text-blue-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${TYPE_COLORS[notice.type]}`}>
                    {TYPE_LABELS[notice.type]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{notice.content}</p>
                <p className="text-[11px] text-gray-400 mt-3">📅 {notice.date} · 👤 {notice.postedBy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
