import DashboardHeader from '@/components/layout/DashboardHeader';
import { TEACHERS, MADRASHA_CLASSES } from '@/lib/data';
import { ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';

const TEACHER_ATTENDANCE = TEACHERS.map(t => ({
  ...t,
  todayStatus: ['present', 'present', 'present', 'absent', 'present', 'present'][TEACHERS.indexOf(t)] as 'present' | 'absent' | 'late',
  monthPresent: [22, 20, 21, 18, 22, 19][TEACHERS.indexOf(t)],
  monthTotal: 22,
}));

export default function AdminAttendancePage() {
  const present = TEACHER_ATTENDANCE.filter(t => t.todayStatus === 'present').length;
  const absent = TEACHER_ATTENDANCE.filter(t => t.todayStatus === 'absent').length;

  return (
    <div>
      <DashboardHeader title="উপস্থিতি ব্যবস্থাপনা" subtitle="শিক্ষক ও শিক্ষার্থীর উপস্থিতি দেখুন" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-6">
        {/* Today summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'আজ উপস্থিত', value: present, color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'আজ অনুপস্থিত', value: absent, color: 'bg-red-50 text-red-700 border-red-200' },
            { label: 'মোট শিক্ষক', value: TEACHERS.length, color: 'bg-purple-50 text-purple-700 border-purple-200' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-2xl border p-5 text-center ${color}`}>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
            </div>
          ))}
        </div>

        {/* Teacher attendance */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <ClipboardList size={16} className="text-purple-600" /> শিক্ষকদের উপস্থিতি — আজ
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {TEACHER_ATTENDANCE.map(t => {
              const pct = Math.round((t.monthPresent / t.monthTotal) * 100);
              return (
                <div key={t.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.designation} · {t.department}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="text-[10px] text-gray-500">{t.monthPresent}/{t.monthTotal} ({pct}%)</span>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${t.todayStatus === 'present' ? 'bg-green-100 text-green-700' : t.todayStatus === 'absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {t.todayStatus === 'present' ? <><CheckCircle size={12} /> উপস্থিত</> : t.todayStatus === 'absent' ? <><XCircle size={12} /> অনুপস্থিত</> : <><Clock size={12} /> দেরিতে</>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Class assignment info */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">ক্লাস অ্যাসাইনমেন্ট</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">শিক্ষকের নাম</th>
                  {MADRASHA_CLASSES.slice(5).map(c => <th key={c.id} className="px-3 py-3 text-center">{c.nameBn.slice(0,3)}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TEACHERS.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{t.name}</td>
                    {MADRASHA_CLASSES.slice(5).map(c => (
                      <td key={c.id} className="px-3 py-3 text-center">
                        {t.classes.includes(c.id) ? (
                          <span className="w-5 h-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs mx-auto">✓</span>
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
