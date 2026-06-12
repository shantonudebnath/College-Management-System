'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { FEES, MADRASHA_CLASSES, STUDENTS } from '@/lib/data';
import { Plus, CheckCircle, AlertCircle, Download, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { useNotices } from '@/context/NoticesContext';
import type { Fee } from '@/lib/types';

export default function AdminFeesPage() {
  const [fees, setFees] = useState<Fee[]>(() => {
    if (typeof window === 'undefined') return FEES;
    try {
      const stored = localStorage.getItem('fees_store');
      return stored ? JSON.parse(stored) : FEES;
    } catch { return FEES; }
  });
  const { addNotice } = useNotices();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ feeType: '', class: 'class-10', amount: '', dueDate: '' });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [payConfirm, setPayConfirm] = useState<{ id: string; name: string } | null>(null);
  const [unpayConfirm, setUnpayConfirm] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('fees_store', JSON.stringify(fees));
  }, [fees]);

  const totalCollected = fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalDue = fees.filter(f => f.status !== 'paid').reduce((s, f) => s + f.amount, 0);

  const addFee = () => {
    if (!form.feeType || !form.amount) return;
    const className = MADRASHA_CLASSES.find(c => c.id === form.class)?.nameBn ?? form.class;
    const classStudents = STUDENTS.filter(s => s.class === form.class);
    const newFees = classStudents.map(s => ({
      id: `f${Date.now()}-${s.id}`,
      studentId: s.id,
      studentName: s.name,
      class: form.class,
      feeType: form.feeType,
      amount: Number(form.amount),
      dueDate: form.dueDate || '—',
      status: 'due' as const,
    }));
    setFees(p => [...p, ...newFees]);
    addNotice({
      id: `n${Date.now()}`,
      title: `${form.feeType} ফি নির্ধারণ — ${className}`,
      content: `${className} শ্রেণির ${classStudents.length} জন শিক্ষার্থীর জন্য ${form.feeType} বাবদ ৳${form.amount} নির্ধারণ করা হয়েছে।${form.dueDate ? ` পরিশোধের শেষ তারিখ: ${form.dueDate}।` : ''} নির্ধারিত সময়ের মধ্যে পরিশোধ করার অনুরোধ করা হচ্ছে।`,
      date: new Date().toISOString().split('T')[0],
      type: 'fee', target: 'student', isImportant: false, postedBy: 'Admin',
    });
    setShowForm(false);
    setForm({ feeType: '', class: 'class-10', amount: '', dueDate: '' });
  };

  const markPaid = (id: string) => setFees(p => p.map(f => f.id === id ? { ...f, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0], receiptNo: `RCP-2024-${Math.random().toFixed(3).slice(2)}` } : f));
  const markDue = (id: string) => setFees(p => p.map(f => f.id === id ? { ...f, status: 'due' as const, paidDate: undefined, receiptNo: undefined } : f));

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
                    <td className="px-5 py-3 text-gray-500 text-xs">{MADRASHA_CLASSES.find(c => c.id === fee.class)?.nameBn ?? fee.class}</td>
                    <td className="px-5 py-3 text-gray-600">{fee.feeType}</td>
                    <td className="px-5 py-3 text-right font-bold">৳ {fee.amount}</td>
                    <td className="px-5 py-3 text-center text-gray-500 text-xs">{fee.dueDate}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {fee.status === 'paid' ? <><CheckCircle size={11} /> পরিশোধিত</> : <><AlertCircle size={11} /> বকেয়া</>}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {fee.status !== 'paid' ? (
                          <button onClick={() => setPayConfirm({ id: fee.id, name: `${fee.studentName} — ${fee.feeType}` })} className="text-xs text-purple-600 font-semibold hover:underline whitespace-nowrap">পরিশোধ চিহ্নিত করুন</button>
                        ) : (
                          <button onClick={() => setUnpayConfirm({ id: fee.id, name: `${fee.studentName} — ${fee.feeType}` })} className="text-xs text-amber-600 font-semibold hover:underline whitespace-nowrap">বকেয়া করুন</button>
                        )}
                        <button onClick={() => setDeleteTarget({ id: fee.id, name: `${fee.studentName} — ${fee.feeType}` })} className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 ml-1"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          itemName={deleteTarget.name}
          onConfirm={() => { setFees(p => p.filter(f => f.id !== deleteTarget.id)); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {payConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">পরিশোধ নিশ্চিত করবেন?</h3>
              <p className="text-sm text-gray-500 mb-1"><span className="font-semibold text-gray-700">&ldquo;{payConfirm.name}&rdquo;</span></p>
              <p className="text-sm text-gray-400">এই ফি পরিশোধিত হিসেবে চিহ্নিত হবে।</p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setPayConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">বাতিল</button>
              <button onClick={() => { markPaid(payConfirm.id); setPayConfirm(null); }} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors">হ্যাঁ, পরিশোধিত</button>
            </div>
          </div>
        </div>
      )}

      {unpayConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">বকেয়া করবেন?</h3>
              <p className="text-sm text-gray-500 mb-1"><span className="font-semibold text-gray-700">&ldquo;{unpayConfirm.name}&rdquo;</span></p>
              <p className="text-sm text-gray-400">এই ফি-এর পরিশোধ বাতিল হয়ে বকেয়া হিসেবে চিহ্নিত হবে।</p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setUnpayConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">বাতিল</button>
              <button onClick={() => { markDue(unpayConfirm.id); setUnpayConfirm(null); }} className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition-colors">হ্যাঁ, বকেয়া করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
