import DashboardHeader from '@/components/layout/DashboardHeader';
import { EXAM_SCHEDULE, MADRASHA_CLASSES } from '@/lib/data';
import { Calendar, Clock, MapPin, Download, Printer } from 'lucide-react';

export default function ExamSchedulePage() {
  const schedule = EXAM_SCHEDULE.filter(e => e.class === 'class-10');
  const examName = schedule[0]?.examName ?? '';

  return (
    <div>
      <DashboardHeader title="পরীক্ষার সময়সূচী" userName="Mohammad Rafiqul Islam" role="ছাত্র" />
      <div className="p-6 space-y-6">
        {/* Header card */}
        <div className="gradient-primary text-white rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{examName}</h2>
            <p className="text-purple-200 text-sm mt-1">দাখিল (১০ম শ্রেণি) — শাখা-ক</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
              <Download size={15} /> PDF
            </button>
            <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
              <Printer size={15} /> প্রিন্ট
            </button>
          </div>
        </div>

        {/* Schedule grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.map((exam, i) => (
            <div key={exam.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {i + 1}
                </div>
                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg font-medium">{exam.room}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">{exam.subject}</h3>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2"><Calendar size={12} className="text-purple-400" /><span>{exam.date}</span></div>
                <div className="flex items-center gap-2"><Clock size={12} className="text-purple-400" /><span>{exam.startTime} — {exam.endTime}</span></div>
                <div className="flex items-center gap-2"><MapPin size={12} className="text-purple-400" /><span>{exam.room}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-semibold text-amber-800 mb-2">গুরুত্বপূর্ণ নির্দেশনা</h3>
          <ul className="space-y-1.5 text-sm text-amber-700">
            <li>• পরীক্ষার ৩০ মিনিট আগে পরীক্ষার হলে উপস্থিত থাকতে হবে।</li>
            <li>• বৈধ প্রবেশপত্র ছাড়া পরীক্ষার হলে প্রবেশ নিষেধ।</li>
            <li>• মোবাইল ফোন ও ইলেকট্রনিক ডিভাইস নিয়ে প্রবেশ সম্পূর্ণ নিষিদ্ধ।</li>
            <li>• পরীক্ষার সময়সূচী পরিবর্তনের ক্ষমতা কর্তৃপক্ষের রয়েছে।</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
