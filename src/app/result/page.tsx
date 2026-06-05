'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { EXAM_RESULTS, MADRASHA_CLASSES, GRADE_SCALE } from '@/lib/data';
import { Search, Award, Download, Printer, CheckCircle, XCircle } from 'lucide-react';
import type { ExamResult } from '@/lib/types';

export default function ResultPage() {
  const [roll, setRoll] = useState('');
  const [classId, setClassId] = useState('class-10');
  const [exam, setExam] = useState('প্রথম সাময়িক পরীক্ষা');
  const [result, setResult] = useState<ExamResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const found = EXAM_RESULTS.find(r => r.roll === parseInt(roll) && r.class === classId && r.examName === exam);
    setResult(found || null);
    setSearched(true);
    setLoading(false);
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A+') return 'text-green-600 bg-green-50';
    if (grade === 'A' || grade === 'A-') return 'text-blue-600 bg-blue-50';
    if (grade === 'B' || grade === 'C') return 'text-amber-600 bg-amber-50';
    if (grade === 'D') return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f8f7ff] py-10">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">পরীক্ষার ফলাফল</h1>
            <p className="text-gray-500 text-sm mt-1">রোল নম্বর দিয়ে ফলাফল দেখুন — লগইন ছাড়াই</p>
          </div>

          {/* Search form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">শ্রেণি *</label>
                  <select value={classId} onChange={e => setClassId(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                    {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">পরীক্ষার নাম *</label>
                  <select value={exam} onChange={e => setExam(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                    <option>প্রথম সাময়িক পরীক্ষা</option>
                    <option>দ্বিতীয় সাময়িক পরীক্ষা</option>
                    <option>বার্ষিক পরীক্ষা</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">রোল নম্বর *</label>
                  <input type="number" required value={roll} onChange={e => setRoll(e.target.value)} placeholder="যেমন: 1"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> খোঁজা হচ্ছে...</>
                  : <><Search size={16} /> ফলাফল দেখুন</>}
              </button>
            </form>
          </div>

          {/* Result */}
          {searched && !result && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <XCircle size={36} className="text-red-400 mx-auto mb-3" />
              <p className="font-semibold text-red-800">ফলাফল পাওয়া যায়নি</p>
              <p className="text-red-600 text-sm mt-1">রোল নম্বর ও তথ্য সঠিক দিয়ে আবার চেষ্টা করুন।</p>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
              {/* Result header */}
              <div className={`p-6 ${result.status === 'pass' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100' : 'bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">{result.studentName}</h2>
                    <p className="text-gray-500 text-sm">রোল: {result.roll} | শ্রেণি: {MADRASHA_CLASSES.find(c => c.id === result.class)?.nameBn}</p>
                    <p className="text-gray-400 text-xs mt-1">{result.examName} — {result.year}</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${result.status === 'pass' ? 'text-green-700' : 'text-red-600'}`}>
                      {result.gpa.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">GPA</div>
                    <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${result.status === 'pass' ? 'text-green-700' : 'text-red-600'}`}>
                      {result.status === 'pass' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {result.status === 'pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject marks */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">বিষয়ভিত্তিক নম্বর</h3>
                <div className="space-y-2">
                  {result.subjects.map(sub => (
                    <div key={sub.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700">{sub.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full gradient-primary" style={{ width: `${sub.marks}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-8 text-right">{sub.marks}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${getGradeColor(sub.grade)}`}>{sub.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{result.totalMarks}</p>
                    <p className="text-xs text-gray-500">মোট নম্বর</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <p className="text-xl font-bold text-purple-700">{result.gpa.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">GPA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-700">{result.grade}</p>
                    <p className="text-xs text-gray-500">গ্রেড</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Printer size={15} /> প্রিন্ট
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 btn-primary rounded-xl text-sm font-semibold">
                    <Download size={15} /> PDF ডাউনলোড
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grade scale reference */}
          <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">গ্রেডিং স্কেল</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {GRADE_SCALE.map(g => (
                <div key={g.grade} className={`text-center p-2 rounded-xl ${getGradeColor(g.grade)}`}>
                  <p className="font-bold text-sm">{g.grade}</p>
                  <p className="text-[10px] mt-0.5">{g.min}–{g.max}</p>
                  <p className="text-[10px] font-medium">{g.gpa}</p>
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
