'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { FEES, MADRASHA_CLASSES } from '@/lib/data';
import { CreditCard, Plus, CheckCircle, AlertCircle, Download } from 'lucide-react';

export default function AdminFeesPage() {
  const [fees, setFees] = useState(FEES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ feeType: '', class: 'class-10', amount: '', dueDate: '' });

  const totalCollected = fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalDue = fees.filter(f => f.status !== 'paid').reduce((s, f) => s + f.amount, 0);

  const addFee = () => {
    if (!form.feeType || !form.amount) return;
    setShowForm(false);
    setForm({ feeType: '', class: 'class-10', amount: '', dueDate: '' });
  };

  const markPaid = (id: string) => setFees(p => p.map(f => f.id === id ? { ...f, status: 'paid', paidDate: new Date().toISOString().split('T')[0], receiptNo: `RCP-2024-${Math.random().toFixed(3).slice(2)}` } : f));

  return (
    <div>
      <DashboardHeader title="ফি ব্যবস্থাপনা" subtitle="শ্রেণিভিত্তিক ফি নির্ধারণ ও পরিচালনা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'মোট সংগৃহীত', value: `৳ ${totalCollected.toLocaleString()}`, color: 'text-green-600 bg-green-50 border-green-200' },
            { label: 'মোট বকেয়া', value: `৳ ${totalDue.toLocaleString()}`, color: 'text-red-600 bg-red-50 border-red-200' },
            { label: 'মোট ফি', value: `৳ ${(totalCollected + totalDue).toLocaleString()}`, color: 'text-purple-600 bg-purple-50 border-purple-200' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-2xl border p-5 ${color}`}>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 flex-wrap items-center">
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
            <Plus size={16} /> নতুন ফি নির্ধারণ
          </button>
          <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Download size={14} /> রিপোর্ট ডাউনলোড
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn">
            <h3 className="font-semibold text-gray-900 mb-4">নতুন ফি নির্ধারণ</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">ফির ধরন *</label>
                <input value={form.feeType} onChange={e => setForm(p => ({ ...p, feeType: e.target.value }))} placeholder="মাসিক বেতন, পরীক্ষা ফি..."
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শ্রেণি</label>
                <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                  {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">পরিমাণ (৳) *</label>
                <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="500"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শেষ তারিখ</label>
                <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addFee} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">নির্ধারণ করুন</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        {/* Fee table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">ছাত্রের নাম</th>
                  <th className="px-5 py-3 text-left">শ্রেণি</th>
                  <th className="px-5 py-3 text-left">ফি বিবরণ</th>
                  <th className="px-5 py-3 text-right">পরিমাণ</th>
                  <th className="px-5 py-3 text-center">শেষ তারিখ</th>
                  <th className="px-5 py-3 text-center">অবস্থা</th>
                  <th className="px-5 py-3 text-center">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {fees.map(fee => (
                  <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{fee.studentName}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{fee.class}</td>
                    <td className="px-5 py-3 text-gray-600">{fee.feeType}</td>
                    <td className="px-5 py-3 text-right font-bold">৳ {fee.amount}</td>
                    <td className="px-5 py-3 text-center text-gray-500 text-xs">{fee.dueDate}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {fee.status === 'paid' ? <><CheckCircle size={11} /> পরিশোধিত</> : <><AlertCircle size={11} /> বকেয়া</>}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {fee.status !== 'paid' && (
                        <button onClick={() => markPaid(fee.id)} className="text-xs text-purple-600 font-semibold hover:underline">পরিশোধ চিহ্নিত করুন</button>
                      )}
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
