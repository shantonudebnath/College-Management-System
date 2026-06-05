import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { NOTICES } from '@/lib/data';
import { Bell, AlertCircle, Filter } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  exam: 'bg-blue-100 text-blue-700 border-blue-200',
  fee: 'bg-amber-100 text-amber-700 border-amber-200',
  result: 'bg-green-100 text-green-700 border-green-200',
  holiday: 'bg-rose-100 text-rose-700 border-rose-200',
  general: 'bg-gray-100 text-gray-700 border-gray-200',
};

const TYPE_LABELS: Record<string, string> = {
  exam: '📝 পরীক্ষা', fee: '💰 ফি', result: '🏆 ফলাফল', holiday: '🎉 ছুটি', general: '📢 সাধারণ',
};

export default function NoticePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f8f7ff] py-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">নোটিশ বোর্ড</h1>
            <p className="text-gray-500 text-sm mt-1">সকল গুরুত্বপূর্ণ নোটিশ ও ঘোষণাসমূহ</p>
          </div>

          {/* Important notices */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <AlertCircle size={15} className="text-red-500" /> জরুরি নোটিশ
            </h2>
            <div className="space-y-3">
              {NOTICES.filter(n => n.isImportant).map(notice => (
                <div key={notice.id} className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle size={20} className="text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TYPE_COLORS[notice.type]} shrink-0`}>
                        {TYPE_LABELS[notice.type]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{notice.content}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                      <span>📅 {notice.date}</span>
                      <span>👤 {notice.postedBy}</span>
                      <span>👥 {notice.target === 'all' ? 'সবার জন্য' : notice.target === 'student' ? 'ছাত্রদের জন্য' : 'শিক্ষকদের জন্য'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All notices */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">সকল নোটিশ</h2>
            <div className="space-y-3">
              {NOTICES.filter(n => !n.isImportant).map(notice => (
                <div key={notice.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TYPE_COLORS[notice.type]} shrink-0`}>
                      {TYPE_LABELS[notice.type]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{notice.content}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    <span>📅 {notice.date}</span>
                    <span>👤 {notice.postedBy}</span>
                    <span>👥 {notice.target === 'all' ? 'সবার জন্য' : notice.target === 'student' ? 'ছাত্রদের জন্য' : 'শিক্ষকদের জন্য'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
