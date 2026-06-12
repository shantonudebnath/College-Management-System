'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { FEES } from '@/lib/data';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import type { Fee } from '@/lib/types';

const STUDENT_ID = 's1';

export default function StudentFeesPage() {
  const [allFees, setAllFees] = useState<Fee[]>(FEES);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fees_store');
      if (stored) setAllFees(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const studentFees = allFees.filter(f => f.studentId === STUDENT_ID);
  const paid = studentFees.filter(f => f.status === 'paid');
  const due = studentFees.filter(f => f.status !== 'paid');
  const totalPaid = paid.reduce((s, f) => s + f.amount, 0);
  const totalDue = due.reduce((s, f) => s + f.amount, 0);

  return (
    <div>
      <DashboardHeader title="ফি বিবরণ" subtitle="আপনার ফি পরিশোধের তথ্য" userName="Mohammad Rafiqul Islam" role="ছাত্র" />
      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'মোট পরিশোধিত', value: `৳ ${totalPaid.toLocaleString()}`, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
            { label: 'মোট বকেয়া', value: `৳ ${totalDue.toLocaleString()}`, icon: AlertCircle, color: 'text-red-600 bg-red-50' },
            { label: 'মোট ফি', value: `৳ ${(totalPaid + totalDue).toLocaleString()}`, icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}><Icon size={22} /></div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Due fees alert */}
        {due.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">বকেয়া ফি রয়েছে!</p>
              <p className="text-red-600 text-xs mt-0.5">মোট {due.length}টি ফি পরিশোধ বাকি। সময়মতো পরিশোধ না করলে পরীক্ষায় এডমিট কার্ড দেওয়া হবে না।</p>
            </div>
          </div>
        )}

        {/* Fee table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">ফি তালিকা</h3>
            <button className="flex items-center gap-1.5 text-xs text-purple-600 hover:underline">
              <Download size={13} /> PDF ডাউনলোড
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">ফি বিবরণ</th>
                  <th className="px-5 py-3 text-left">পরিমাণ</th>
                  <th className="px-5 py-3 text-left">শেষ তারিখ</th>
                  <th className="px-5 py-3 text-left">পরিশোধ তারিখ</th>
                  <th className="px-5 py-3 text-left">রসিদ নং</th>
                  <th className="px-5 py-3 text-left">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {studentFees.map(fee => (
                  <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{fee.feeType}</td>
                    <td className="px-5 py-3 font-semibold">৳ {fee.amount}</td>
                    <td className="px-5 py-3 text-gray-500">{fee.dueDate}</td>
                    <td className="px-5 py-3 text-gray-500">{fee.paidDate ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{fee.receiptNo ?? '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {fee.status === 'paid' ? <><CheckCircle size={11} /> পরিশোধিত</> : <><Clock size={11} /> বকেয়া</>}
                      </span>
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
