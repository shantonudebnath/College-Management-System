import DashboardHeader from '@/components/layout/DashboardHeader';
import { EXAM_RESULTS, MADRASHA_CLASSES } from '@/lib/data';
import { Award, CheckCircle, Download, Printer, TrendingUp } from 'lucide-react';

const result = EXAM_RESULTS[0];

const getGradeColor = (grade: string) => {
  if (grade === 'A+') return 'text-green-700 bg-green-50';
  if (grade.startsWith('A')) return 'text-blue-700 bg-blue-50';
  if (grade === 'B') return 'text-amber-700 bg-amber-50';
  return 'text-red-700 bg-red-50';
};

export default function StudentResultPage() {
  return (
    <div>
      <DashboardHeader title="পরীক্ষার ফলাফল" subtitle="আপনার বিস্তারিত ফলাফল" userName={result.studentName} role="ছাত্র" />
      <div className="p-6 space-y-6">
        {/* Result summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: 'মোট নম্বর', value: `${result.totalMarks}`, sub: `/${result.subjects.length * 100}`, color: 'bg-purple-50 text-purple-700' },
            { label: 'GPA', value: result.gpa.toFixed(2), sub: '/5.00', color: 'bg-green-50 text-green-700' },
            { label: 'গ্রেড', value: result.grade, sub: result.status === 'pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ', color: 'bg-blue-50 text-blue-700' },
            { label: 'পরীক্ষার নাম', value: '1st', sub: result.examName, color: 'bg-amber-50 text-amber-700' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className={`${color} rounded-2xl p-5 text-center`}>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs opacity-70 mt-0.5">{sub}</p>
              <p className="text-xs font-semibold mt-2 opacity-80">{label}</p>
            </div>
          ))}
        </div>

        {/* Subject marks */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Award size={18} className="text-purple-600" /> বিষয়ভিত্তিক নম্বর
            </h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                <Printer size={12} /> প্রিন্ট
              </button>
              <button className="flex items-center gap-1.5 text-xs btn-primary rounded-lg px-3 py-1.5">
                <Download size={12} /> PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">বিষয়</th>
                  <th className="px-5 py-3 text-center">পূর্ণমান</th>
                  <th className="px-5 py-3 text-center">প্রাপ্ত নম্বর</th>
                  <th className="px-5 py-3 text-left">অগ্রগতি</th>
                  <th className="px-5 py-3 text-center">গ্রেড</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {result.subjects.map((sub, i) => (
                  <tr key={sub.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{sub.name}</td>
                    <td className="px-5 py-3 text-center text-gray-500">100</td>
                    <td className="px-5 py-3 text-center font-bold text-gray-900">{sub.marks}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full gradient-primary rounded-full" style={{ width: `${sub.marks}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-400 w-8">{sub.marks}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getGradeColor(sub.grade)}`}>{sub.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-purple-50">
                <tr>
                  <td colSpan={3} className="px-5 py-3 font-semibold text-purple-900">মোট</td>
                  <td className="px-5 py-3 text-center font-bold text-purple-900 text-lg">{result.totalMarks}</td>
                  <td></td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-sm font-bold text-purple-700">{result.grade}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Status */}
        <div className={`rounded-2xl p-5 flex items-center gap-4 ${result.status === 'pass' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <CheckCircle size={32} className={result.status === 'pass' ? 'text-green-600' : 'text-red-600'} />
          <div>
            <p className={`font-bold text-lg ${result.status === 'pass' ? 'text-green-800' : 'text-red-800'}`}>
              {result.status === 'pass' ? 'অভিনন্দন! আপনি উত্তীর্ণ হয়েছেন।' : 'দুঃখিত, আপনি অনুত্তীর্ণ হয়েছেন।'}
            </p>
            <p className={`text-sm ${result.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
              GPA: {result.gpa.toFixed(2)} | গ্রেড: {result.grade} | {result.examName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
