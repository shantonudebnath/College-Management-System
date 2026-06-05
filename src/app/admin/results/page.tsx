'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { EXAM_RESULTS, MADRASHA_CLASSES } from '@/lib/data';
import { Award, CheckCircle, Download, Printer, Eye, Search } from 'lucide-react';

export default function AdminResultsPage() {
  const [published, setPublished] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = EXAM_RESULTS.filter(r =>
    !search || r.studentName.toLowerCase().includes(search.toLowerCase()) || String(r.roll).includes(search)
  );

  const passRate = Math.round((EXAM_RESULTS.filter(r => r.status === 'pass').length / EXAM_RESULTS.length) * 100);
  const avgGpa = (EXAM_RESULTS.reduce((s, r) => s + r.gpa, 0) / EXAM_RESULTS.length).toFixed(2);

  const getGradeColor = (grade: string) => {
    if (grade === 'A+') return 'text-green-700 bg-green-100';
    if (grade.startsWith('A')) return 'text-blue-700 bg-blue-100';
    if (grade === 'B') return 'text-amber-700 bg-amber-100';
    return 'text-red-700 bg-red-100';
  };

  return (
    <div>
      <DashboardHeader title="ফলাফল ব্যবস্থাপনা" subtitle="পরীক্ষার ফলাফল পর্যালোচনা ও প্রকাশ" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'মোট শিক্ষার্থী', value: EXAM_RESULTS.length, color: 'bg-purple-50 text-purple-700' },
            { label: 'উত্তীর্ণ', value: EXAM_RESULTS.filter(r => r.status === 'pass').length, color: 'bg-green-50 text-green-700' },
            { label: 'পাশের হার', value: `${passRate}%`, color: 'bg-blue-50 text-blue-700' },
            { label: 'গড় GPA', value: avgGpa, color: 'bg-amber-50 text-amber-700' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${color} rounded-2xl p-4 text-center`}>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
            </div>
          ))}
        </div>

        {/* Publish/export bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">প্রথম সাময়িক পরীক্ষা ২০২৪ — দাখিল</h3>
            <p className="text-xs text-gray-400 mt-0.5">শিক্ষকের নম্বর প্রদান সম্পন্ন। প্রকাশের জন্য প্রস্তুত।</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              <Printer size={14} /> প্রিন্ট করুন
            </button>
            <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              <Download size={14} /> PDF Export
            </button>
            {!published ? (
              <button onClick={() => setPublished(true)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
                <Award size={15} /> ফলাফল প্রকাশ করুন
              </button>
            ) : (
              <span className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2.5 rounded-xl text-sm font-semibold">
                <CheckCircle size={15} /> প্রকাশিত হয়েছে!
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="নাম বা রোল খুঁজুন"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
        </div>

        {/* Results table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">রোল</th>
                  <th className="px-5 py-3 text-left">নাম</th>
                  <th className="px-5 py-3 text-center">মোট নম্বর</th>
                  <th className="px-5 py-3 text-center">GPA</th>
                  <th className="px-5 py-3 text-center">গ্রেড</th>
                  <th className="px-5 py-3 text-center">ফলাফল</th>
                  <th className="px-5 py-3 text-center">বিস্তারিত</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.studentId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-700">{r.roll}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{r.studentName}</td>
                    <td className="px-5 py-3 text-center font-semibold">{r.totalMarks}</td>
                    <td className="px-5 py-3 text-center font-bold text-purple-700">{r.gpa.toFixed(2)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getGradeColor(r.grade)}`}>{r.grade}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.status === 'pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button className="w-7 h-7 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-100 mx-auto"><Eye size={13} /></button>
                    </td>
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
