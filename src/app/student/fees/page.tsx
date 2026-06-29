'use client';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, Gift, Percent, BadgeDollarSign } from 'lucide-react';
import type { Fee, Waiver } from '@/lib/types';
import { useStudentSession } from '@/hooks/useStudentSession';
import { useFees } from '@/context/FeesContext';

function getWaiverDiscount(fee: Fee, waivers: Waiver[]): number {
  const active = waivers.filter(
    w => w.isActive && w.studentId === fee.studentId &&
    (w.feeTypes.length === 0 || w.feeTypes.includes(fee.feeType))
  );
  let discount = 0;
  for (const w of active) {
    if (w.waiverType === 'fixed') discount += w.waiverValue;
    else discount += Math.round((fee.amount * w.waiverValue) / 100);
  }
  return Math.min(discount, fee.amount);
}

export default function StudentFeesPage() {
  const { student, loading: sessionLoading } = useStudentSession();
  const { fees: allFees, waivers } = useFees();

  const STUDENT_ID = student?.id ?? '';
  const studentFees = allFees.filter(f => f.studentId === STUDENT_ID);
  const studentWaivers = waivers.filter(w => w.studentId === STUDENT_ID && w.isActive);

  const paid = studentFees.filter(f => f.status === 'paid');
  const due = studentFees.filter(f => f.status !== 'paid');

  const totalPaid = paid.reduce((s, f) => s + f.amount, 0);
  const totalDue = due.reduce((s, f) => s + Math.max(0, f.amount - getWaiverDiscount(f, waivers)), 0);
  const totalWaiver = studentFees.reduce((s, f) => s + getWaiverDiscount(f, waivers), 0);

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="ফি বিবরণ" subtitle="আপনার ফি পরিশোধের তথ্য" userName={student?.name ?? 'শিক্ষার্থী'} role="ছাত্র" />
      <div className="p-6 space-y-6">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'মোট পরিশোধিত', value: `৳ ${totalPaid.toLocaleString()}`, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
            { label: 'বকেয়া (ছাড় বাদে)', value: `৳ ${totalDue.toLocaleString()}`, icon: AlertCircle, color: 'text-red-600 bg-red-50' },
            { label: 'মোট ছাড় পেয়েছেন', value: `৳ ${totalWaiver.toLocaleString()}`, icon: Gift, color: 'text-amber-600 bg-amber-50' },
            { label: 'মোট ফি', value: `৳ ${studentFees.reduce((s, f) => s + f.amount, 0).toLocaleString()}`, icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
              <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shrink-0`}><Icon size={20} /></div>
              <div>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Active waiver banner */}
        {studentWaivers.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gift size={16} className="text-amber-600" />
              <p className="font-semibold text-amber-800 text-sm">আপনার সক্রিয় ফি ছাড়</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentWaivers.map(w => (
                <span key={w.id} className="inline-flex items-center gap-1.5 bg-white border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {w.waiverType === 'percentage' ? <Percent size={11} /> : <BadgeDollarSign size={11} />}
                  {w.waiverType === 'percentage' ? `${w.waiverValue}% ছাড়` : `৳ ${w.waiverValue} ছাড়`}
                  {w.feeTypes.length > 0 && <span className="opacity-70">({w.feeTypes.join(', ')})</span>}
                  <span className="text-amber-500 font-normal">— {w.reason}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Due alert */}
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
                  <th className="px-5 py-3 text-right">মূল পরিমাণ</th>
                  <th className="px-5 py-3 text-right">ছাড়</th>
                  <th className="px-5 py-3 text-right">দেয় পরিমাণ</th>
                  <th className="px-5 py-3 text-left">শেষ তারিখ</th>
                  <th className="px-5 py-3 text-left">পরিশোধ তারিখ</th>
                  <th className="px-5 py-3 text-left">রসিদ নং</th>
                  <th className="px-5 py-3 text-left">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {studentFees.map(fee => {
                  const disc = getWaiverDiscount(fee, waivers);
                  const net = Math.max(0, fee.amount - disc);
                  return (
                    <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{fee.feeType}</td>
                      <td className="px-5 py-3 text-right text-gray-500">
                        {disc > 0 ? <span className="line-through">৳ {fee.amount}</span> : `৳ ${fee.amount}`}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {disc > 0
                          ? <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">- ৳ {disc}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-gray-900">৳ {net}</td>
                      <td className="px-5 py-3 text-gray-500">{fee.dueDate}</td>
                      <td className="px-5 py-3 text-gray-500">{fee.paidDate ?? '—'}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{fee.receiptNo ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {fee.status === 'paid' ? <><CheckCircle size={11} /> পরিশোধিত</> : <><Clock size={11} /> বকেয়া</>}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Footer totals */}
              {studentFees.length > 0 && (
                <tfoot className="bg-gray-50 font-semibold text-sm border-t border-gray-200">
                  <tr>
                    <td className="px-5 py-3 text-gray-700">সর্বমোট</td>
                    <td className="px-5 py-3 text-right text-gray-500">৳ {studentFees.reduce((s, f) => s + f.amount, 0).toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-amber-600">- ৳ {totalWaiver.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-gray-900">৳ {(studentFees.reduce((s, f) => s + f.amount, 0) - totalWaiver).toLocaleString()}</td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
