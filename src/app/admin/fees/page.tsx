'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { FEES, MADRASHA_CLASSES, STUDENTS } from '@/lib/data';
import { Plus, CheckCircle, AlertCircle, Download, Trash2, Gift, Percent, BadgeDollarSign, Search } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { useNotices } from '@/context/NoticesContext';
import type { Fee, Waiver } from '@/lib/types';

const LS_FEES = 'fees_store';
const LS_WAIVERS = 'waivers_store';

type Tab = 'fees' | 'waivers';

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

export default function AdminFeesPage() {
  const [tab, setTab] = useState<Tab>('fees');

  const [fees, setFees] = useState<Fee[]>(() => {
    if (typeof window === 'undefined') return FEES;
    try { const s = localStorage.getItem(LS_FEES); return s ? JSON.parse(s) : FEES; } catch { return FEES; }
  });
  const [waivers, setWaivers] = useState<Waiver[]>(() => {
    if (typeof window === 'undefined') return [];
    try { const s = localStorage.getItem(LS_WAIVERS); return s ? JSON.parse(s) : []; } catch { return []; }
  });

  const { addNotice } = useNotices();

  // Fee form state
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [feeForm, setFeeForm] = useState({ feeType: '', class: 'class-10', amount: '', dueDate: '' });

  // Waiver form state
  const [showWaiverForm, setShowWaiverForm] = useState(false);
  const [waiverForm, setWaiverForm] = useState({
    studentId: '', waiverType: 'percentage' as 'fixed' | 'percentage',
    waiverValue: '', reason: '', feeTypes: 'all',
  });
  const [waiverSearch, setWaiverSearch] = useState('');

  // Delete/confirm modals
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [payConfirm, setPayConfirm] = useState<{ id: string; name: string } | null>(null);
  const [unpayConfirm, setUnpayConfirm] = useState<{ id: string; name: string } | null>(null);
  const [waiverDeleteId, setWaiverDeleteId] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem(LS_FEES, JSON.stringify(fees)); }, [fees]);
  useEffect(() => { localStorage.setItem(LS_WAIVERS, JSON.stringify(waivers)); }, [waivers]);

  // Totals (discount-aware)
  const totalCollected = fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalDue = fees.filter(f => f.status !== 'paid').reduce((s, f) => {
    const disc = getWaiverDiscount(f, waivers);
    return s + Math.max(0, f.amount - disc);
  }, 0);
  const totalWaiverGiven = fees.reduce((s, f) => s + getWaiverDiscount(f, waivers), 0);

  // Filtered students for waiver search
  const filteredStudents = useMemo(() =>
    STUDENTS.filter(s =>
      s.name.toLowerCase().includes(waiverSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(waiverSearch.toLowerCase())
    ).slice(0, 8),
    [waiverSearch]
  );

  // All fee types present
  const allFeeTypes = [...new Set(fees.map(f => f.feeType))];

  /* ---------- Fee actions ---------- */
  const addFee = () => {
    if (!feeForm.feeType || !feeForm.amount) return;
    const className = MADRASHA_CLASSES.find(c => c.id === feeForm.class)?.nameBn ?? feeForm.class;
    const classStudents = STUDENTS.filter(s => s.class === feeForm.class);
    const newFees = classStudents.map(s => ({
      id: `f${Date.now()}-${s.id}`,
      studentId: s.id,
      studentName: s.name,
      class: feeForm.class,
      feeType: feeForm.feeType,
      amount: Number(feeForm.amount),
      dueDate: feeForm.dueDate || '—',
      status: 'due' as const,
    }));
    setFees(p => [...p, ...newFees]);
    addNotice({
      id: `n${Date.now()}`,
      title: `${feeForm.feeType} ফি নির্ধারণ — ${className}`,
      content: `${className} শ্রেণির ${classStudents.length} জন শিক্ষার্থীর জন্য ${feeForm.feeType} বাবদ ৳${feeForm.amount} নির্ধারণ করা হয়েছে।`,
      date: new Date().toISOString().split('T')[0],
      type: 'fee', target: 'student', isImportant: false, postedBy: 'Admin',
    });
    setShowFeeForm(false);
    setFeeForm({ feeType: '', class: 'class-10', amount: '', dueDate: '' });
  };

  const markPaid = (id: string) => setFees(p => p.map(f => f.id === id ? { ...f, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0], receiptNo: `RCP-2024-${Math.random().toFixed(3).slice(2)}` } : f));
  const markDue = (id: string) => setFees(p => p.map(f => f.id === id ? { ...f, status: 'due' as const, paidDate: undefined, receiptNo: undefined } : f));

  /* ---------- Waiver actions ---------- */
  const addWaiver = () => {
    const student = STUDENTS.find(s => s.id === waiverForm.studentId);
    if (!student || !waiverForm.waiverValue) return;
    const val = Number(waiverForm.waiverValue);
    if (isNaN(val) || val <= 0) return;
    if (waiverForm.waiverType === 'percentage' && val > 100) return;

    const newWaiver: Waiver = {
      id: `w${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      class: student.class,
      waiverType: waiverForm.waiverType,
      waiverValue: val,
      reason: waiverForm.reason,
      feeTypes: waiverForm.feeTypes === 'all' ? [] : [waiverForm.feeTypes],
      appliedDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    setWaivers(p => [newWaiver, ...p]);
    setShowWaiverForm(false);
    setWaiverForm({ studentId: '', waiverType: 'percentage', waiverValue: '', reason: '', feeTypes: 'all' });
    setWaiverSearch('');
  };

  const toggleWaiver = (id: string) => setWaivers(p => p.map(w => w.id === id ? { ...w, isActive: !w.isActive } : w));
  const deleteWaiver = (id: string) => setWaivers(p => p.filter(w => w.id !== id));

  const selectedStudent = STUDENTS.find(s => s.id === waiverForm.studentId);

  return (
    <div>
      <DashboardHeader title="ফি ব্যবস্থাপনা" subtitle="ফি নির্ধারণ ও ছাড় (ওয়েভার) পরিচালনা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'মোট সংগৃহীত', value: `৳ ${totalCollected.toLocaleString()}`, color: 'text-green-600 bg-green-50 border-green-200' },
            { label: 'মোট বকেয়া (ছাড় বাদে)', value: `৳ ${totalDue.toLocaleString()}`, color: 'text-red-600 bg-red-50 border-red-200' },
            { label: 'মোট ছাড় দেওয়া হয়েছে', value: `৳ ${totalWaiverGiven.toLocaleString()}`, color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { label: 'সক্রিয় ওয়েভার', value: `${waivers.filter(w => w.isActive).length} জন`, color: 'text-purple-600 bg-purple-50 border-purple-200' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-2xl border p-4 ${color}`}>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
          {([['fees', 'ফি তালিকা'], ['waivers', 'ছাড় (ওয়েভার) ব্যবস্থাপনা']] as [Tab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ============ FEE TAB ============ */}
        {tab === 'fees' && (
          <>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => setShowFeeForm(!showFeeForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
                <Plus size={16} /> নতুন ফি নির্ধারণ
              </button>
              <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                <Download size={14} /> রিপোর্ট
              </button>
            </div>

            {showFeeForm && (
              <div className="bg-white rounded-2xl border-2 border-purple-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">নতুন ফি নির্ধারণ</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">ফির ধরন *</label>
                    <input value={feeForm.feeType} onChange={e => setFeeForm(p => ({ ...p, feeType: e.target.value }))} placeholder="মাসিক বেতন, পরীক্ষা ফি..."
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">শ্রেণি</label>
                    <select value={feeForm.class} onChange={e => setFeeForm(p => ({ ...p, class: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                      {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">পরিমাণ (৳) *</label>
                    <input type="number" value={feeForm.amount} onChange={e => setFeeForm(p => ({ ...p, amount: e.target.value }))} placeholder="500"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">শেষ তারিখ</label>
                    <input type="date" value={feeForm.dueDate} onChange={e => setFeeForm(p => ({ ...p, dueDate: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={addFee} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">নির্ধারণ করুন</button>
                  <button onClick={() => setShowFeeForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-5 py-3 text-left">ছাত্রের নাম</th>
                      <th className="px-5 py-3 text-left">শ্রেণি</th>
                      <th className="px-5 py-3 text-left">ফি বিবরণ</th>
                      <th className="px-5 py-3 text-right">মূল পরিমাণ</th>
                      <th className="px-5 py-3 text-right">ছাড়</th>
                      <th className="px-5 py-3 text-right">দেয় পরিমাণ</th>
                      <th className="px-5 py-3 text-center">অবস্থা</th>
                      <th className="px-5 py-3 text-center">কার্যক্রম</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {fees.map(fee => {
                      const disc = getWaiverDiscount(fee, waivers);
                      const net = Math.max(0, fee.amount - disc);
                      return (
                        <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 font-medium text-gray-900">{fee.studentName}</td>
                          <td className="px-5 py-3 text-gray-500 text-xs">{MADRASHA_CLASSES.find(c => c.id === fee.class)?.nameBn ?? fee.class}</td>
                          <td className="px-5 py-3 text-gray-600">{fee.feeType}</td>
                          <td className="px-5 py-3 text-right font-semibold text-gray-700">৳ {fee.amount}</td>
                          <td className="px-5 py-3 text-right">
                            {disc > 0
                              ? <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">- ৳ {disc}</span>
                              : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-gray-900">৳ {net}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {fee.status === 'paid' ? <><CheckCircle size={11} /> পরিশোধিত</> : <><AlertCircle size={11} /> বকেয়া</>}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {fee.status !== 'paid'
                                ? <button onClick={() => setPayConfirm({ id: fee.id, name: `${fee.studentName} — ${fee.feeType}` })} className="text-xs text-purple-600 font-semibold hover:underline whitespace-nowrap">পরিশোধ</button>
                                : <button onClick={() => setUnpayConfirm({ id: fee.id, name: `${fee.studentName} — ${fee.feeType}` })} className="text-xs text-amber-600 font-semibold hover:underline whitespace-nowrap">বকেয়া করুন</button>}
                              <button onClick={() => setDeleteTarget({ id: fee.id, name: `${fee.studentName} — ${fee.feeType}` })} className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 ml-1"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ============ WAIVER TAB ============ */}
        {tab === 'waivers' && (
          <>
            <div className="flex gap-3">
              <button onClick={() => setShowWaiverForm(!showWaiverForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
                <Gift size={16} /> নতুন ছাড় দিন
              </button>
            </div>

            {showWaiverForm && (
              <div className="bg-white rounded-2xl border-2 border-amber-200 p-5 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Gift size={16} className="text-amber-500" /> নতুন ওয়েভার / ছাড় নির্ধারণ
                </h3>

                {/* Student search */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">ছাত্র নির্বাচন *</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={selectedStudent ? `${selectedStudent.name} (${selectedStudent.studentId})` : waiverSearch}
                      onChange={e => { setWaiverSearch(e.target.value); setWaiverForm(p => ({ ...p, studentId: '' })); }}
                      placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400" />
                  </div>
                  {waiverSearch && !selectedStudent && filteredStudents.length > 0 && (
                    <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {filteredStudents.map(s => (
                        <button key={s.id} onClick={() => { setWaiverForm(p => ({ ...p, studentId: s.id })); setWaiverSearch(''); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 text-left text-sm transition-colors">
                          <span className="font-semibold text-gray-800">{s.name}</span>
                          <span className="text-gray-400 text-xs">{s.studentId}</span>
                          <span className="ml-auto text-xs text-gray-400">{MADRASHA_CLASSES.find(c => c.id === s.class)?.nameBn}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedStudent && (
                    <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <CheckCircle size={14} className="text-amber-600" />
                      <span className="text-sm font-semibold text-amber-800">{selectedStudent.name}</span>
                      <span className="text-xs text-amber-600">{selectedStudent.studentId} · {MADRASHA_CLASSES.find(c => c.id === selectedStudent.class)?.nameBn}</span>
                      <button onClick={() => setWaiverForm(p => ({ ...p, studentId: '' }))} className="ml-auto text-xs text-amber-600 hover:underline">পরিবর্তন করুন</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Waiver type */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">ছাড়ের ধরন *</label>
                    <div className="flex gap-2">
                      {(['percentage', 'fixed'] as const).map(t => (
                        <button key={t} onClick={() => setWaiverForm(p => ({ ...p, waiverType: t }))}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${waiverForm.waiverType === t ? 'bg-amber-500 text-white border-amber-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-amber-50'}`}>
                          {t === 'percentage' ? <><Percent size={13} /> শতকরা</> : <><BadgeDollarSign size={13} /> নির্দিষ্ট টাকা</>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Waiver value */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      {waiverForm.waiverType === 'percentage' ? 'শতকরা (%) *' : 'টাকার পরিমাণ (৳) *'}
                    </label>
                    <input type="number" value={waiverForm.waiverValue} onChange={e => setWaiverForm(p => ({ ...p, waiverValue: e.target.value }))}
                      placeholder={waiverForm.waiverType === 'percentage' ? 'যেমন: 50' : 'যেমন: 500'}
                      max={waiverForm.waiverType === 'percentage' ? 100 : undefined}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400" />
                  </div>

                  {/* Fee type scope */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">কোন ফিতে প্রযোজ্য</label>
                    <select value={waiverForm.feeTypes} onChange={e => setWaiverForm(p => ({ ...p, feeTypes: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400">
                      <option value="all">সব ধরনের ফি</option>
                      {allFeeTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                    </select>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">কারণ *</label>
                  <input value={waiverForm.reason} onChange={e => setWaiverForm(p => ({ ...p, reason: e.target.value }))}
                    placeholder="যেমন: অস্বচ্ছল পরিবার, এতিম, মেধাবী ছাত্র..."
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400" />
                </div>

                <div className="flex gap-2">
                  <button onClick={addWaiver} disabled={!selectedStudent || !waiverForm.waiverValue || !waiverForm.reason}
                    className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">ছাড় দিন</button>
                  <button onClick={() => { setShowWaiverForm(false); setWaiverSearch(''); setWaiverForm({ studentId: '', waiverType: 'percentage', waiverValue: '', reason: '', feeTypes: 'all' }); }}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
                </div>
              </div>
            )}

            {/* Waiver list */}
            {waivers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
                <Gift size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">এখনো কোনো ছাড় দেওয়া হয়নি।</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">ওয়েভার তালিকা</h3>
                  <span className="text-xs text-gray-500">{waivers.filter(w => w.isActive).length} সক্রিয় / মোট {waivers.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="px-5 py-3 text-left">ছাত্রের নাম</th>
                        <th className="px-5 py-3 text-left">শ্রেণি</th>
                        <th className="px-5 py-3 text-center">ছাড়</th>
                        <th className="px-5 py-3 text-left">কোন ফিতে</th>
                        <th className="px-5 py-3 text-left">কারণ</th>
                        <th className="px-5 py-3 text-center">তারিখ</th>
                        <th className="px-5 py-3 text-center">অবস্থা</th>
                        <th className="px-5 py-3 text-center">কার্যক্রম</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {waivers.map(w => (
                        <tr key={w.id} className={`hover:bg-gray-50 transition-colors ${!w.isActive ? 'opacity-50' : ''}`}>
                          <td className="px-5 py-3 font-medium text-gray-900">{w.studentName}</td>
                          <td className="px-5 py-3 text-gray-500 text-xs">{MADRASHA_CLASSES.find(c => c.id === w.class)?.nameBn ?? w.class}</td>
                          <td className="px-5 py-3 text-center">
                            <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-xs">
                              {w.waiverType === 'percentage' ? <Percent size={11} /> : <BadgeDollarSign size={11} />}
                              {w.waiverType === 'percentage' ? `${w.waiverValue}%` : `৳ ${w.waiverValue}`}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-600 text-xs">{w.feeTypes.length === 0 ? 'সব ফি' : w.feeTypes.join(', ')}</td>
                          <td className="px-5 py-3 text-gray-600 text-xs max-w-[180px] truncate">{w.reason}</td>
                          <td className="px-5 py-3 text-center text-gray-400 text-xs">{w.appliedDate}</td>
                          <td className="px-5 py-3 text-center">
                            <button onClick={() => toggleWaiver(w.id)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${w.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                              {w.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                            </button>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <button onClick={() => setWaiverDeleteId(w.id)} className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 mx-auto">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {deleteTarget && (
        <ConfirmDeleteModal
          itemName={deleteTarget.name}
          onConfirm={() => { setFees(p => p.filter(f => f.id !== deleteTarget.id)); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {waiverDeleteId && (
        <ConfirmDeleteModal
          itemName={`${waivers.find(w => w.id === waiverDeleteId)?.studentName ?? 'এই ছাত্র'}-এর ওয়েভার`}
          onConfirm={() => { deleteWaiver(waiverDeleteId); setWaiverDeleteId(null); }}
          onCancel={() => setWaiverDeleteId(null)}
        />
      )}

      {payConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={24} className="text-green-600" /></div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">পরিশোধ নিশ্চিত করবেন?</h3>
              <p className="text-sm text-gray-500 mb-1 font-semibold">&ldquo;{payConfirm.name}&rdquo;</p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setPayConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">বাতিল</button>
              <button onClick={() => { markPaid(payConfirm.id); setPayConfirm(null); }} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold">হ্যাঁ, পরিশোধিত</button>
            </div>
          </div>
        </div>
      )}

      {unpayConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={24} className="text-amber-600" /></div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">বকেয়া করবেন?</h3>
              <p className="text-sm text-gray-500 mb-1 font-semibold">&ldquo;{unpayConfirm.name}&rdquo;</p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setUnpayConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">বাতিল</button>
              <button onClick={() => { markDue(unpayConfirm.id); setUnpayConfirm(null); }} className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold">হ্যাঁ, বকেয়া করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
