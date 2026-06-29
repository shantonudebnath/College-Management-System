'use client';
import { useState, useRef, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES, STUDENTS } from '@/lib/data';
import { useTeachers } from '@/context/TeachersContext';
import { Plus, Search, Edit, Trash2, Phone, Mail, Camera, X, Save, ChevronDown, ChevronUp, ArrowUpDown, Key, Copy, CheckCircle, Eye, EyeOff } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import type { Teacher } from '@/lib/types';
import { kvGet, kvSet } from '@/lib/supabase/kv';

interface Credential { username: string; password: string; }

function makeTchCred(teacherId: string): Credential {
  return {
    username: teacherId,
    password: `NIM@Teacher#${new Date().getFullYear()}`,
  };
}

async function createSupabaseUser(displayId: string, password: string, role: string) {
  try {
    await fetch('/api/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayId, password, role }),
    });
  } catch { /* non-blocking */ }
}

const FIXED_DESIGNATIONS = ['অধ্যক্ষ (Principal)', 'সিনিয়র শিক্ষক (Senior Teacher)', 'সহকারী শিক্ষক (Assistant Teacher)'];

const emptyForm = {
  name: '', nameBn: '', department: '', subject: '',
  phone: '', email: '', qualification: '', joinDate: '',
  designation: FIXED_DESIGNATIONS[2],
  designationCustom: '',
  image: '',
  classes: [] as string[],
};

export default function AdminTeachersPage() {
  const { teachers, setTeachers, departmentOrder, setDepartmentOrder } = useTeachers();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeptSort, setShowDeptSort] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const [credsMap, setCredsMap] = useState<Record<string, Credential>>({});
  const [credModal, setCredModal] = useState<(Credential & { name: string }) | null>(null);
  const [showCredId, setShowCredId] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState('');
  const [creating, setCreating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (teachers.length === 0) return;
    kvGet<Record<string, Credential>>('teacher_credentials').then(stored => {
      const updated = { ...(stored ?? {}) };
      let changed = false;
      for (const t of teachers) {
        if (!updated[t.id]) { updated[t.id] = makeTchCred(t.teacherId); changed = true; }
      }
      if (changed) kvSet('teacher_credentials', updated);
      setCredsMap(updated);
    });
  }, [teachers]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key); setTimeout(() => setCopied(''), 2000);
  };

  const isCustomDesig = form.designation === '__custom__';
  const finalDesignation = isCustomDesig ? form.designationCustom : form.designation;

  const filtered = teachers.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.department.toLowerCase().includes(search.toLowerCase())
  );

  // সব বিভাগ (teachers থেকে) — departmentOrder অনুযায়ী, নতুন বিভাগ শেষে auto যোগ হয়
  const allDepts = [...new Set(teachers.map(t => t.department))];
  const orderedDepts = [
    ...departmentOrder.filter(d => allDepts.includes(d)),
    ...allDepts.filter(d => !departmentOrder.includes(d)),
  ];

  // card display: search filter apply
  const filteredDepts = [...new Set(filtered.map(t => t.department))];
  const departments = orderedDepts.filter(d => filteredDepts.includes(d));

  const movedept = (idx: number, dir: -1 | 1) => {
    const newOrder = [...orderedDepts];
    const target = idx + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
    setDepartmentOrder(newOrder);
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

  const toggleClass = (cls: string) =>
    setForm(p => ({
      ...p,
      classes: p.classes.includes(cls) ? p.classes.filter(c => c !== cls) : [...p.classes, cls],
    }));

  const openEdit = (t: Teacher) => {
    const isFixed = FIXED_DESIGNATIONS.includes(t.designation);
    setForm({
      name: t.name, nameBn: t.nameBn, department: t.department,
      subject: Array.isArray(t.subject) ? t.subject.join(', ') : t.subject,
      phone: t.phone, email: t.email, qualification: t.qualification,
      joinDate: t.joinDate,
      designation: isFixed ? t.designation : '__custom__',
      designationCustom: isFixed ? '' : t.designation,
      image: t.image ?? '',
      classes: t.classes ?? [],
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    if (editId) {
      setTeachers(teachers.map(t => t.id === editId ? {
        ...t, name: form.name, nameBn: form.nameBn, designation: finalDesignation,
        department: form.department, subject: form.subject.split(',').map(s => s.trim()),
        classes: form.classes,
        phone: form.phone, email: form.email, qualification: form.qualification,
        joinDate: form.joinDate || t.joinDate,
        image: form.image || undefined,
      } : t));
      setShowForm(false); setForm({ ...emptyForm }); setEditId(null);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } else {
      setCreating(true);
      const t: Teacher = {
        id: `t${Date.now()}`, teacherId: `TCH-${(teachers.length + 1).toString().padStart(3, '0')}`,
        name: form.name, nameBn: form.nameBn, designation: finalDesignation,
        department: form.department, subject: form.subject.split(',').map(s => s.trim()),
        classes: form.classes, phone: form.phone, email: form.email, address: '',
        qualification: form.qualification,
        joinDate: form.joinDate || new Date().toISOString().split('T')[0],
        image: form.image || undefined,
      };
      const cred = makeTchCred(t.teacherId);
      const newCreds = { ...credsMap, [t.id]: cred };
      setTeachers([...teachers, t]);
      setCredsMap(newCreds);
      kvSet('teacher_credentials', newCreds);
      await createSupabaseUser(t.teacherId, cred.password, 'teacher');
      setCreating(false);
      setShowForm(false); setForm({ ...emptyForm }); setEditId(null);
      setCredModal({ ...cred, name: t.name });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({ ...emptyForm });
    setEditId(null);
  };

  return (
    <div>
      <DashboardHeader title="শিক্ষক ব্যবস্থাপনা" subtitle="সকল শিক্ষকের তথ্য পরিচালনা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <Save size={14} /> তথ্য সফলভাবে সংরক্ষিত হয়েছে!
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="নাম বা বিভাগ দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
          </div>
          <button
            onClick={() => { setShowDeptSort(!showDeptSort); setShowForm(false); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${showDeptSort ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          >
            <ArrowUpDown size={15} /> বিভাগ সাজান
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
            <Plus size={16} /> নতুন শিক্ষক যোগ করুন
          </button>
        </div>

        {/* Department sort panel */}
        {showDeptSort && (
          <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">বিভাগের ক্রম নির্ধারণ করুন</h3>
                <p className="text-xs text-gray-500 mt-0.5">↑↓ বোতাম দিয়ে বিভাগের অবস্থান পরিবর্তন করুন — website এ একই ক্রমে দেখাবে</p>
              </div>
              <button onClick={() => setShowDeptSort(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="space-y-2">
              {orderedDepts.map((dept, idx, arr) => (
                <div key={dept} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                  <span className="flex-1 text-sm font-medium text-gray-800">{dept} বিভাগ</span>
                  <span className="text-xs text-gray-400 mr-2">{teachers.filter(t => t.department === dept).length} জন</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => movedept(idx, -1)}
                      disabled={idx === 0}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp size={14} className="text-indigo-600" />
                    </button>
                    <button
                      onClick={() => movedept(idx, 1)}
                      disabled={idx === arr.length - 1}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown size={14} className="text-indigo-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-indigo-600 mt-3 font-medium">পরিবর্তন স্বয়ংক্রিয়ভাবে সংরক্ষিত হচ্ছে।</p>
          </div>
        )}

        {/* Add/Edit form */}
        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">{editId ? 'শিক্ষকের তথ্য সম্পাদনা' : 'নতুন শিক্ষকের তথ্য'}</h3>
              <button onClick={handleCancel} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>

            {/* Photo upload */}
            <div className="flex items-start gap-5 mb-5">
              <div className="relative shrink-0">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-100 transition-colors overflow-hidden"
                >
                  {form.image ? (
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera size={22} className="text-purple-400 mb-1" />
                      <span className="text-[10px] text-purple-500 text-center leading-tight">ছবি যোগ করুন</span>
                    </>
                  )}
                </div>
                {form.image && (
                  <button
                    onClick={() => setForm(p => ({ ...p, image: '' }))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow"
                  >
                    <X size={10} />
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </div>
              <div className="flex-1 text-xs text-gray-500 space-y-1 pt-2">
                <p className="font-semibold text-gray-700">শিক্ষকের ছবি</p>
                <p>JPG, PNG ফরম্যাটে ছবি আপলোড করুন।</p>
                <p>সর্বোচ্চ আকার: ২ MB।</p>
                <button onClick={() => fileRef.current?.click()} className="text-purple-600 font-semibold hover:underline text-xs mt-1">
                  ফাইল বেছে নিন →
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {([
                { label: 'পূর্ণ নাম *', key: 'name', placeholder: 'Full Name' },
                { label: 'বাংলা নাম', key: 'nameBn', placeholder: 'বাংলায় নাম' },
                { label: 'বিভাগ *', key: 'department', placeholder: 'Department' },
                { label: 'বিষয় (কমা দিয়ে)', key: 'subject', placeholder: 'আরবি, ইসলামিয়াত' },
                { label: 'মোবাইল', key: 'phone', placeholder: '01XXXXXXXXX' },
                { label: 'ইমেইল', key: 'email', placeholder: 'email@example.com' },
                { label: 'শিক্ষাগত যোগ্যতা', key: 'qualification', placeholder: 'কামিল, ঢাকা আলিয়া' },
              ] as { label: string; key: keyof typeof emptyForm; placeholder: string }[]).map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                  <input
                    value={form[key] as string}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                  />
                </div>
              ))}

              {/* Joining date */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">যোগদানের তারিখ</label>
                <input
                  type="date"
                  value={form.joinDate}
                  onChange={e => setForm(p => ({ ...p, joinDate: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                />
              </div>

              {/* Designation combo field */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">পদবি</label>
                <div className="relative">
                  <select
                    value={form.designation}
                    onChange={e => setForm(p => ({ ...p, designation: e.target.value, designationCustom: '' }))}
                    className="w-full px-3 py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none"
                  >
                    {FIXED_DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    <option value="__custom__">অন্যান্য (নিজে লিখুন)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {isCustomDesig && (
                  <input
                    value={form.designationCustom}
                    onChange={e => setForm(p => ({ ...p, designationCustom: e.target.value }))}
                    placeholder="পদবি লিখুন..."
                    autoFocus
                    className="w-full mt-2 px-3 py-2.5 bg-purple-50 border border-purple-300 rounded-xl text-sm outline-none focus:border-purple-500"
                  />
                )}
              </div>
            </div>

            {/* Class assignment */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-gray-600 block mb-2">
                শ্রেণি অ্যাসাইন করুন
                <span className="text-gray-400 font-normal ml-1">(একাধিক বেছে নেওয়া যাবে)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {MADRASHA_CLASSES.map(cls => {
                  const checked = form.classes.includes(cls.id);
                  const studentCount = STUDENTS.filter(s => s.class === cls.id).length;
                  return (
                    <label key={cls.id} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${checked ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleClass(cls.id)} className="accent-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{cls.nameBn}</p>
                        <p className="text-[10px] text-gray-400">{studentCount} জন ছাত্র</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {form.classes.length > 0 && (
                <p className="text-xs text-blue-600 font-medium mt-2">{form.classes.length}টি শ্রেণি নির্বাচিত</p>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={handleSave} disabled={creating} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                <Save size={14} /> {creating ? 'তৈরি হচ্ছে...' : editId ? 'পরিবর্তন সংরক্ষণ করুন' : 'শিক্ষক যোগ করুন'}
              </button>
              <button onClick={handleCancel} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">
                বাতিল
              </button>
            </div>
          </div>
        )}

        {/* Teacher cards by department */}
        {departments.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">কোনো শিক্ষক পাওয়া যায়নি।</div>
        )}
        {departments.map(dept => (
          <div key={dept}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{dept}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.filter(t => t.department === dept).map(teacher => (
                <div key={teacher.id} className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-purple-100">
                      {teacher.image ? (
                        <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
                          {teacher.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{teacher.name}</p>
                      {teacher.nameBn && <p className="text-xs text-gray-500 truncate">{teacher.nameBn}</p>}
                      <p className="text-xs text-purple-600 font-medium mt-0.5">{teacher.designation}</p>
                      <p className="text-xs text-gray-400">{teacher.teacherId}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {credsMap[teacher.id] && (
                        <button onClick={() => { setShowCredId(teacher.id); setShowPass(false); }}
                          className="w-7 h-7 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center hover:bg-amber-100" title="লগইন তথ্য">
                          <Key size={12} />
                        </button>
                      )}
                      <button onClick={() => openEdit(teacher)} className="w-7 h-7 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-100" title="সম্পাদনা করুন">
                        <Edit size={12} />
                      </button>
                      <button onClick={() => setDeleteTarget({ id: teacher.id, name: teacher.name })} className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100" title="মুছুন">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                    {teacher.phone && <div className="flex gap-1.5"><Phone size={11} className="text-purple-400 shrink-0 mt-0.5" />{teacher.phone}</div>}
                    {teacher.email && <div className="flex gap-1.5 truncate"><Mail size={11} className="text-purple-400 shrink-0 mt-0.5" />{teacher.email}</div>}
                  </div>
                  {teacher.subject.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {teacher.subject.map(s => (
                        <span key={s} className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          itemName={deleteTarget.name}
          onConfirm={() => { setTeachers(teachers.filter(t => t.id !== deleteTarget.id)); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Credential modal after add */}
      {credModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fadeIn p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shrink-0"><CheckCircle size={24} className="text-green-600" /></div>
              <div><h3 className="font-bold text-gray-900">শিক্ষক যোগ সম্পন্ন!</h3><p className="text-xs text-gray-500 mt-0.5">লগইন তথ্য সংরক্ষণ করুন</p></div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-amber-800 mb-3 flex items-center gap-1.5"><Key size={12} /> {credModal.name}-এর লগইন তথ্য</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100">
                  <div><p className="text-[10px] text-gray-400">ইউজারনেম (আইডি)</p><p className="text-sm font-bold text-gray-900 font-mono">{credModal.username}</p></div>
                  <button onClick={() => copyText(credModal.username, 'tu')} className="text-amber-600">{copied === 'tu' ? <CheckCircle size={15} /> : <Copy size={15} />}</button>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100">
                  <div><p className="text-[10px] text-gray-400">পাসওয়ার্ড</p><p className="text-sm font-bold text-gray-900 font-mono">{credModal.password}</p></div>
                  <button onClick={() => copyText(credModal.password, 'tp')} className="text-amber-600">{copied === 'tp' ? <CheckCircle size={15} /> : <Copy size={15} />}</button>
                </div>
              </div>
            </div>
            <button onClick={() => setCredModal(null)} className="w-full btn-primary py-2.5 rounded-xl text-sm font-semibold">ঠিক আছে</button>
          </div>
        </div>
      )}

      {/* View credential modal */}
      {showCredId && credsMap[showCredId] && (() => {
        const t = teachers.find(x => x.id === showCredId);
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fadeIn p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Key size={18} className="text-amber-600" /></div>
                  <div><h3 className="font-bold text-gray-900">লগইন তথ্য</h3><p className="text-xs text-gray-500">{t?.name}</p></div>
                </div>
                <button onClick={() => setShowCredId(null)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <div><p className="text-[10px] text-gray-400 mb-0.5">ইউজারনেম</p><p className="text-sm font-bold font-mono text-gray-900">{credsMap[showCredId].username}</p></div>
                  <button onClick={() => copyText(credsMap[showCredId].username, 'tvu')} className="text-gray-400 hover:text-purple-600">{copied === 'tvu' ? <CheckCircle size={15} className="text-green-500" /> : <Copy size={15} />}</button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <div><p className="text-[10px] text-gray-400 mb-0.5">পাসওয়ার্ড</p><p className="text-sm font-bold font-mono text-gray-900">{showPass ? credsMap[showCredId].password : '••••••••'}</p></div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowPass(p => !p)} className="text-gray-400 hover:text-gray-700">{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                    <button onClick={() => copyText(credsMap[showCredId].password, 'tvp')} className="text-gray-400 hover:text-purple-600">{copied === 'tvp' ? <CheckCircle size={15} className="text-green-500" /> : <Copy size={15} />}</button>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowCredId(null)} className="w-full mt-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বন্ধ করুন</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
