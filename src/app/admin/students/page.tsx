'use client';
import { useState, useRef, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, MADRASHA_CLASSES } from '@/lib/data';
import { Users, Plus, Search, Edit, Trash2, Eye, Download, Camera, X, Save, ChevronDown, ArrowUpCircle, AlertTriangle, CheckCircle, IdCard } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import type { Student } from '@/lib/types';

interface AdmitCardConfig {
  id: string;
  examName: string;
  class: string;
  issued: boolean;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const emptyForm = {
  name: '', nameBn: '', fatherName: '', motherName: '',
  class: 'class-10', classCustom: '',
  section: 'A', session: '2024-25',
  phone: '', guardianPhone: '',
  dob: '', birthCertNo: '',
  bloodGroup: '', gender: 'পুরুষ',
  address: '', image: '',
};

const STATUS_COLOR: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  due: 'bg-red-100 text-red-700',
  partial: 'bg-amber-100 text-amber-700',
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState(STUDENTS);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saved, setSaved] = useState(false);
  const [promoteStep, setPromoteStep] = useState<0 | 1 | 2 | 3>(0);
  const [promoteClass, setPromoteClass] = useState('');
  const [promoteSelected, setPromoteSelected] = useState<Set<string>>(new Set());
  const [promoteSuccess, setPromoteSuccess] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [admitCards, setAdmitCards] = useState<AdmitCardConfig[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admit_cards_store');
      if (stored) setAdmitCards(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const getIssuedCards = (classId: string) =>
    admitCards.filter(c => c.issued && c.class === classId);

  const isCustomClass = form.class === '__custom__';
  const finalClass = isCustomClass ? form.classCustom : form.class;

  const filtered = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search)) &&
    (!filterClass || s.class === filterClass)
  );

  // by default সব filtered student selected থাকবে
  useEffect(() => {
    setSelectedIds(new Set(filtered.map(s => s.id)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterClass, search]);

  const allSelected = filtered.length > 0 && filtered.every(s => selectedIds.has(s.id));
  const someSelected = filtered.some(s => selectedIds.has(s.id));

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  const toggleAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelected) filtered.forEach(s => next.delete(s.id));
      else filtered.forEach(s => next.add(s.id));
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // বর্ষ পরিবর্তন লজিক
  const CLASS_IDS = MADRASHA_CLASSES.map(c => c.id);
  const getNextClassId = (id: string) => {
    const idx = CLASS_IDS.indexOf(id);
    return idx >= 0 && idx < CLASS_IDS.length - 1 ? CLASS_IDS[idx + 1] : null;
  };

  function getClassName2(id: string) {
    return MADRASHA_CLASSES.find(c => c.id === id)?.nameBn ?? id;
  }

  const promoteNextClassId = promoteClass ? getNextClassId(promoteClass) : null;
  const promoteClassStudents = students.filter(s => s.class === promoteClass);
  const promoteCount = promoteClassStudents.filter(s => promoteSelected.has(s.id)).length;
  const promoteAllSelected = promoteClassStudents.length > 0 && promoteClassStudents.every(s => promoteSelected.has(s.id));
  const promoteSomeSelected = promoteClassStudents.some(s => promoteSelected.has(s.id));

  const openPromote = () => {
    setPromoteClass('');
    setPromoteSelected(new Set());
    setPromoteStep(1);
  };

  const goToStudentSelect = () => {
    if (!promoteClass || !promoteNextClassId) return;
    setPromoteSelected(new Set(promoteClassStudents.map(s => s.id)));
    setPromoteStep(2);
  };

  const togglePromoteAll = () => {
    setPromoteSelected(prev => {
      const next = new Set(prev);
      if (promoteAllSelected) promoteClassStudents.forEach(s => next.delete(s.id));
      else promoteClassStudents.forEach(s => next.add(s.id));
      return next;
    });
  };

  const togglePromoteOne = (id: string) => {
    setPromoteSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const confirmPromote = () => {
    if (!promoteClass || !promoteNextClassId) return;
    setStudents(students.map(s =>
      s.class === promoteClass && promoteSelected.has(s.id) ? { ...s, class: promoteNextClassId } : s
    ));
    const msg = `${promoteCount}জন শিক্ষার্থী ${getClassName2(promoteClass)} থেকে ${getClassName2(promoteNextClassId)} তে উন্নীত হয়েছে।`;
    setPromoteStep(0);
    setPromoteClass('');
    setPromoteSelected(new Set());
    setPromoteSuccess(msg);
    setTimeout(() => setPromoteSuccess(''), 5000);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(p => ({ ...p, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setForm({ ...emptyForm });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (s: Student) => {
    const isFixed = MADRASHA_CLASSES.some(c => c.id === s.class);
    setForm({
      name: s.name, nameBn: s.nameBn, fatherName: s.fatherName, motherName: s.motherName,
      class: isFixed ? s.class : '__custom__', classCustom: isFixed ? '' : s.class,
      section: s.section, session: s.session ?? '2024-25',
      phone: s.phone, guardianPhone: s.guardianPhone ?? '',
      dob: s.dob, birthCertNo: s.birthCertNo ?? '',
      bloodGroup: s.bloodGroup ?? '', gender: s.gender,
      address: s.address, image: s.image ?? '',
    });
    setEditId(s.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    if (editId) {
      setStudents(students.map(s => s.id === editId ? {
        ...s, name: form.name, nameBn: form.nameBn, fatherName: form.fatherName,
        motherName: form.motherName, class: finalClass, section: form.section,
        session: form.session, phone: form.phone, guardianPhone: form.guardianPhone,
        dob: form.dob, birthCertNo: form.birthCertNo, bloodGroup: form.bloodGroup,
        gender: form.gender, address: form.address, image: form.image || undefined,
      } : s));
    } else {
      const newSt: Student = {
        id: `s${Date.now()}`,
        studentId: `STD-2025-${(students.length + 1).toString().padStart(3, '0')}`,
        name: form.name, nameBn: form.nameBn,
        fatherName: form.fatherName, motherName: form.motherName,
        class: finalClass, section: form.section,
        roll: students.length + 1, session: form.session,
        dob: form.dob, gender: form.gender, religion: 'ইসলাম',
        phone: form.phone, guardianPhone: form.guardianPhone,
        address: form.address, bloodGroup: form.bloodGroup,
        birthCertNo: form.birthCertNo,
        image: form.image || undefined,
        registrationStatus: 'approved', feeStatus: 'due',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setStudents([...students, newSt]);
    }
    setShowForm(false);
    setForm({ ...emptyForm });
    setEditId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({ ...emptyForm });
    setEditId(null);
  };

  const getClassName = (classId: string) => getClassName2(classId);

  const exportToExcel = () => {
    const headers = ['শিক্ষার্থী আইডি', 'নাম (ইংরেজি)', 'নাম (বাংলা)', 'পিতার নাম', 'মাতার নাম', 'শ্রেণি', 'শাখা', 'রোল', 'সেশন', 'মোবাইল', 'অভিভাবকের মোবাইল', 'জন্ম তারিখ', 'জন্ম নিবন্ধন', 'রক্তের গ্রুপ', 'লিঙ্গ', 'ঠিকানা', 'ফি অবস্থা', 'নিবন্ধন অবস্থা'];
    const rows = filtered.map(s => [
      s.studentId, s.name, s.nameBn, s.fatherName, s.motherName,
      getClassName2(s.class), s.section, s.roll, s.session ?? '',
      s.phone, s.guardianPhone ?? '', s.dob,
      s.birthCertNo ?? '', s.bloodGroup ?? '', s.gender, s.address,
      s.feeStatus === 'paid' ? 'পরিশোধিত' : s.feeStatus === 'due' ? 'বকেয়া' : 'আংশিক',
      s.registrationStatus === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ',
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const bom = '﻿'; // UTF-8 BOM so Excel shows Bengali correctly
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `শিক্ষার্থী_তালিকা_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <DashboardHeader title="শিক্ষার্থী ব্যবস্থাপনা" subtitle="সকল শিক্ষার্থীর তথ্য পরিচালনা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <Save size={14} /> তথ্য সফলভাবে সংরক্ষিত হয়েছে!
          </div>
        )}
        {promoteSuccess && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 text-sm">
            <CheckCircle size={16} /> {promoteSuccess}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
          </div>
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
            <option value="">সব শ্রেণি</option>
            {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
          </select>
          <button onClick={exportToExcel} className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-green-300 hover:text-green-700 transition-colors">
            <Download size={14} /> Excel
          </button>
          <button
            onClick={openPromote}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <ArrowUpCircle size={16} /> বর্ষ পরিবর্তন
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
            <Plus size={16} /> নতুন ভর্তি
          </button>
        </div>

        {/* Add/Edit student form */}
        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-900">{editId ? 'শিক্ষার্থীর তথ্য সম্পাদনা' : 'নতুন শিক্ষার্থী ভর্তি ফর্ম'}</h3>
                <p className="text-xs text-gray-400 mt-0.5">* চিহ্নিত ঘরগুলো আবশ্যিক</p>
              </div>
              <button onClick={handleCancel} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>

            {/* Photo upload */}
            <div className="flex items-start gap-5 mb-6 pb-5 border-b border-gray-100">
              <div className="relative shrink-0">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-24 h-28 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-100 transition-colors overflow-hidden"
                >
                  {form.image ? (
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera size={22} className="text-purple-400 mb-1" />
                      <span className="text-[10px] text-purple-500 text-center px-1 leading-tight">ছবি যোগ করুন</span>
                    </>
                  )}
                </div>
                {form.image && (
                  <button onClick={() => setForm(p => ({ ...p, image: '' }))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow">
                    <X size={10} />
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </div>
              <div className="flex-1 text-xs text-gray-500 space-y-1 pt-2">
                <p className="font-semibold text-gray-700">শিক্ষার্থীর পাসপোর্ট ছবি</p>
                <p>JPG, PNG ফরম্যাটে ছবি আপলোড করুন।</p>
                <p>সাইজ: ৩×৪ সেমি (পাসপোর্ট সাইজ)।</p>
                <button onClick={() => fileRef.current?.click()} className="text-purple-600 font-semibold hover:underline mt-1">
                  ফাইল বেছে নিন →
                </button>
              </div>
            </div>

            {/* Form fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* নাম */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">পূর্ণ নাম (ইংরেজি) *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Full Name" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">পূর্ণ নাম (বাংলা)</label>
                <input value={form.nameBn} onChange={e => setForm(p => ({ ...p, nameBn: e.target.value }))}
                  placeholder="বাংলায় নাম" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              {/* শ্রেণি — fixed + custom */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শ্রেণি *</label>
                <div className="relative">
                  <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value, classCustom: '' }))}
                    className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none">
                    {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                    <option value="__custom__">অন্যান্য (নিজে লিখুন)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {isCustomClass && (
                  <input value={form.classCustom} onChange={e => setForm(p => ({ ...p, classCustom: e.target.value }))}
                    placeholder="শ্রেণির নাম লিখুন..." autoFocus
                    className="w-full mt-2 px-3 py-2.5 bg-purple-50 border border-purple-300 rounded-xl text-sm outline-none focus:border-purple-500" />
                )}
              </div>

              {/* পিতার নাম */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">পিতার নাম *</label>
                <input value={form.fatherName} onChange={e => setForm(p => ({ ...p, fatherName: e.target.value }))}
                  placeholder="Father's Name" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              {/* মাতার নাম */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">মাতার নাম *</label>
                <input value={form.motherName} onChange={e => setForm(p => ({ ...p, motherName: e.target.value }))}
                  placeholder="Mother's Name" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              {/* সেকশন */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শাখা (Section)</label>
                <input value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))}
                  placeholder="A" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              {/* মোবাইল */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শিক্ষার্থীর মোবাইল</label>
                <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="01XXXXXXXXX" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              {/* অভিভাবকের মোবাইল */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">অভিভাবকের মোবাইল *</label>
                <input value={form.guardianPhone} onChange={e => setForm(p => ({ ...p, guardianPhone: e.target.value }))}
                  placeholder="01XXXXXXXXX" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              {/* জন্ম তারিখ */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">জন্ম তারিখ *</label>
                <input type="date" value={form.dob} onChange={e => setForm(p => ({ ...p, dob: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              {/* জন্ম নিবন্ধন নম্বর */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">জন্ম নিবন্ধন নম্বর</label>
                <input value={form.birthCertNo} onChange={e => setForm(p => ({ ...p, birthCertNo: e.target.value }))}
                  placeholder="১৭ সংখ্যার নম্বর" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              {/* রক্তের গ্রুপ */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">রক্তের গ্রুপ</label>
                <div className="relative">
                  <select value={form.bloodGroup} onChange={e => setForm(p => ({ ...p, bloodGroup: e.target.value }))}
                    className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none">
                    <option value="">নির্বাচন করুন</option>
                    {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* লিঙ্গ */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">লিঙ্গ</label>
                <div className="relative">
                  <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                    className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none">
                    <option value="পুরুষ">পুরুষ</option>
                    <option value="মহিলা">মহিলা</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* সেশন */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">সেশন</label>
                <input value={form.session} onChange={e => setForm(p => ({ ...p, session: e.target.value }))}
                  placeholder="2024-25" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>

              {/* ঠিকানা - full width */}
              <div className="lg:col-span-3 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 block mb-1">স্থায়ী ঠিকানা</label>
                <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা..." rows={2}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 resize-none" />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={handleSave} className="flex items-center gap-2 btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold">
                <Save size={14} /> {editId ? 'পরিবর্তন সংরক্ষণ করুন' : 'ভর্তি নিশ্চিত করুন'}
              </button>
              <button onClick={handleCancel} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">
                বাতিল
              </button>
            </div>
          </div>
        )}

        {/* Students table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{filtered.length}টি শিক্ষার্থী পাওয়া গেছে</span>
              {someSelected && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                  {filtered.filter(s => selectedIds.has(s.id)).length}টি নির্বাচিত
                </span>
              )}
            </div>
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><Users size={13} /> মোট: {students.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="pl-4 pr-2 py-3 text-center w-10">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                    />
                  </th>
                  <th className="px-5 py-3 text-left">আইডি</th>
                  <th className="px-5 py-3 text-left">নাম</th>
                  <th className="px-5 py-3 text-left">শ্রেণি</th>
                  <th className="px-5 py-3 text-center">রোল</th>
                  <th className="px-5 py-3 text-center">ফি</th>
                  <th className="px-5 py-3 text-center">অবস্থা</th>
                  <th className="px-5 py-3 text-left">এডমিট কার্ড</th>
                  <th className="px-5 py-3 text-center">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.has(s.id) ? 'bg-purple-50/30' : ''}`}>
                    <td className="pl-4 pr-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(s.id)}
                        onChange={() => toggleOne(s.id)}
                        className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs font-mono">{s.studentId}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-purple-100 flex items-center justify-center">
                          {s.image ? (
                            <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-purple-600">{s.name[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-xs">{s.name}</p>
                          <p className="text-[10px] text-gray-400">{s.nameBn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{getClassName(s.class)}</td>
                    <td className="px-5 py-3 text-center text-gray-700 font-semibold text-xs">{s.roll}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[s.feeStatus]}`}>
                        {s.feeStatus === 'paid' ? 'পরিশোধিত' : s.feeStatus === 'due' ? 'বকেয়া' : 'আংশিক'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${s.registrationStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {s.registrationStatus === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {(() => {
                        const issued = getIssuedCards(s.class);
                        if (issued.length === 0) return <span className="text-[10px] text-gray-300">—</span>;
                        return (
                          <div className="flex flex-wrap gap-1">
                            {issued.map(c => (
                              <span key={c.id} className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                                <IdCard size={9} /> {c.examName}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"><Eye size={13} /></button>
                        <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-100"><Edit size={13} /></button>
                        <button onClick={() => setDeleteTarget({ id: s.id, name: s.name })} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">কোনো শিক্ষার্থী পাওয়া যায়নি।</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ---- বর্ষ পরিবর্তন modal ---- */}
      {promoteStep > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn">

            {/* Step 1 — শ্রেণি নির্বাচন */}
            {promoteStep === 1 && (
              <>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                        <ArrowUpCircle size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">বর্ষ পরিবর্তন</h3>
                        <p className="text-xs text-gray-500 mt-0.5">ধাপ ১ — শ্রেণি নির্বাচন করুন</p>
                      </div>
                    </div>
                    <button onClick={() => setPromoteStep(0)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
                  </div>

                  <label className="text-xs font-semibold text-gray-600 block mb-2">কোন শ্রেণির বর্ষ পরিবর্তন করবেন?</label>
                  <div className="relative mb-4">
                    <select
                      value={promoteClass}
                      onChange={e => setPromoteClass(e.target.value)}
                      className="w-full px-3 py-3 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 appearance-none"
                    >
                      <option value="">— শ্রেণি বেছে নিন —</option>
                      {MADRASHA_CLASSES.filter(c => getNextClassId(c.id)).map(c => (
                        <option key={c.id} value={c.id}>{c.nameBn}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {promoteClass && promoteNextClassId && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-800">
                        <span className="font-semibold">{getClassName2(promoteClass)}</span>
                        <span className="text-amber-400">→</span>
                        <span className="font-semibold">{getClassName2(promoteNextClassId)}</span>
                      </div>
                      <p className="text-amber-700 text-xs">
                        মোট শিক্ষার্থী: <span className="font-bold">{promoteClassStudents.length} জন</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 p-5">
                  <button onClick={() => setPromoteStep(0)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">
                    বাতিল
                  </button>
                  <button
                    onClick={goToStudentSelect}
                    disabled={!promoteClass || !promoteNextClassId}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    শিক্ষার্থী দেখুন →
                  </button>
                </div>
              </>
            )}

            {/* Step 2 — শিক্ষার্থী নির্বাচন */}
            {promoteStep === 2 && (
              <>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                        <Users size={18} className="text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">শিক্ষার্থী নির্বাচন</h3>
                        <p className="text-xs text-gray-500 mt-0.5">ধাপ ২ — কারা যাবেন নির্বাচন করুন</p>
                      </div>
                    </div>
                    <button onClick={() => setPromoteStep(0)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
                  </div>

                  {/* শ্রেণি সারসংক্ষেপ */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 mb-3">
                    <span>{getClassName2(promoteClass)}</span>
                    <span className="text-amber-400">→</span>
                    <span>{promoteNextClassId ? getClassName2(promoteNextClassId) : ''}</span>
                    <span className="ml-auto text-xs font-normal text-amber-600">{promoteCount}/{promoteClassStudents.length} নির্বাচিত</span>
                  </div>

                  {/* সব নির্বাচন */}
                  <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl cursor-pointer mb-2 border border-gray-100">
                    <input
                      type="checkbox"
                      checked={promoteAllSelected}
                      onChange={togglePromoteAll}
                      className="w-4 h-4 rounded accent-amber-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">সকলকে নির্বাচন করুন</span>
                  </label>

                  {/* শিক্ষার্থীর তালিকা */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    {promoteClassStudents.length === 0 ? (
                      <p className="text-center text-sm text-gray-400 py-8">এই শ্রেণিতে কোনো শিক্ষার্থী নেই</p>
                    ) : (
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 text-gray-400 uppercase sticky top-0">
                          <tr>
                            <th className="pl-3 pr-2 py-2 w-8"></th>
                            <th className="px-3 py-2 text-left">নাম</th>
                            <th className="px-3 py-2 text-center">রোল</th>
                            <th className="px-3 py-2 text-left">শাখা</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {promoteClassStudents.map(s => (
                            <tr
                              key={s.id}
                              onClick={() => togglePromoteOne(s.id)}
                              className={`cursor-pointer transition-colors ${promoteSelected.has(s.id) ? 'bg-amber-50' : 'hover:bg-gray-50'}`}
                            >
                              <td className="pl-3 pr-2 py-2.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={promoteSelected.has(s.id)}
                                  onChange={() => togglePromoteOne(s.id)}
                                  onClick={e => e.stopPropagation()}
                                  className="w-4 h-4 rounded accent-amber-500"
                                />
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-md overflow-hidden shrink-0 bg-purple-100 flex items-center justify-center">
                                    {s.image
                                      ? <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                                      : <span className="text-[9px] font-bold text-purple-600">{s.name[0]}</span>}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">{s.name}</p>
                                    {s.nameBn && <p className="text-[9px] text-gray-400">{s.nameBn}</p>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2.5 text-center text-gray-600 font-semibold">{s.roll}</td>
                              <td className="px-3 py-2.5 text-gray-500">{s.section}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 p-5">
                  <button onClick={() => setPromoteStep(1)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">
                    ← পেছনে
                  </button>
                  <button
                    onClick={() => setPromoteStep(3)}
                    disabled={promoteCount === 0}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    নিশ্চিতকরণ →
                  </button>
                </div>
              </>
            )}

            {/* Step 3 — চূড়ান্ত নিশ্চিতকরণ */}
            {promoteStep === 3 && (
              <>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                      <AlertTriangle size={20} className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">চূড়ান্ত নিশ্চিতকরণ</h3>
                      <p className="text-xs text-red-500 mt-0.5">ধাপ ৩ — এই পদক্ষেপ পূর্বাবস্থায় ফেরানো যাবে না</p>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                    <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                      <AlertTriangle size={14} /> সতর্কতা!
                    </p>
                    <p className="text-sm text-red-700">
                      <span className="font-bold">{promoteCount} জন</span> শিক্ষার্থী{' '}
                      <span className="font-bold">{getClassName2(promoteClass)}</span> থেকে{' '}
                      <span className="font-bold">{promoteNextClassId ? getClassName2(promoteNextClassId) : ''}</span>-তে স্থানান্তরিত হবে।
                    </p>
                    <p className="text-xs text-red-600">একবার নিশ্চিত করলে এই তথ্য পরিবর্তন করা সম্ভব হবে না।</p>
                  </div>
                </div>
                <div className="flex gap-3 p-5">
                  <button onClick={() => setPromoteStep(2)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">
                    ← পেছনে
                  </button>
                  <button onClick={confirmPromote} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors">
                    নিশ্চিতভাবে উন্নীত করুন
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          itemName={deleteTarget.name}
          onConfirm={() => { setStudents(students.filter(x => x.id !== deleteTarget.id)); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
