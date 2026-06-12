'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES } from '@/lib/data';
import { useTeachers } from '@/context/TeachersContext';
import { BookOpen, Plus, X, Save } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

type DeleteTarget = { teacherId: string; classId: string; label: string };

export default function AdminClassesPage() {
  const { teachers, setTeachers } = useTeachers();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ classId: MADRASHA_CLASSES[0].id, teacherId: '', subjects: [] as string[] });
  const [subjectInput, setSubjectInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [saved, setSaved] = useState(false);

  const addSubject = () => {
    const val = subjectInput.trim();
    if (!val || form.subjects.includes(val)) return;
    setForm(p => ({ ...p, subjects: [...p.subjects, val] }));
    setSubjectInput('');
  };

  const removeSubject = (sub: string) => {
    setForm(p => ({ ...p, subjects: p.subjects.filter(s => s !== sub) }));
  };

  // Derive assignments: for each class, which teachers are assigned
  type Assignment = { classId: string; teacherId: string; teacherName: string; subjects: string[] };
  const assignments: Assignment[] = [];
  for (const t of teachers) {
    for (const classId of (t.classes ?? [])) {
      assignments.push({
        classId, teacherId: t.id, teacherName: t.name,
        subjects: t.classSubjects?.[classId] ?? t.subject,
      });
    }
  }

  const handleAdd = () => {
    if (!form.teacherId) return;
    const teacher = teachers.find(t => t.id === form.teacherId);
    if (!teacher) return;
    const isDuplicate = (teacher.classes ?? []).includes(form.classId);
    setTeachers(teachers.map(t => {
      if (t.id !== form.teacherId) return t;
      return {
        ...t,
        classes: isDuplicate ? t.classes : [...(t.classes ?? []), form.classId],
        classSubjects: { ...(t.classSubjects ?? {}), [form.classId]: form.subjects },
      };
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setShowForm(false);
    setForm({ classId: MADRASHA_CLASSES[0].id, teacherId: '', subjects: [] });
    setSubjectInput('');
  };

  const handleDelete = ({ teacherId, classId }: DeleteTarget) => {
    setTeachers(teachers.map(t =>
      t.id === teacherId
        ? { ...t, classes: (t.classes ?? []).filter(c => c !== classId) }
        : t
    ));
    setDeleteTarget(null);
  };

  return (
    <div>
      <DashboardHeader title="ক্লাস অ্যাসাইন" subtitle="শিক্ষকদের ক্লাস নির্ধারণ করুন" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <Save size={14} /> ক্লাস অ্যাসাইনমেন্ট সংরক্ষিত হয়েছে!
          </div>
        )}

        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
          <Plus size={16} /> নতুন অ্যাসাইনমেন্ট
        </button>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">শিক্ষককে ক্লাস অ্যাসাইন করুন</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শ্রেণি</label>
                <select value={form.classId} onChange={e => setForm(p => ({ ...p, classId: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                  {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শিক্ষক</label>
                <select value={form.teacherId} onChange={e => setForm(p => ({ ...p, teacherId: e.target.value, subjects: [] }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                  <option value="">-- শিক্ষক বেছে নিন --</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            {form.teacherId && (
              <div className="mt-3">
                <label className="text-xs font-semibold text-gray-600 block mb-2">
                  এই ক্লাসে কোন বিষয়গুলো পড়াবেন?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={e => setSubjectInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubject(); } }}
                    placeholder="বিষয়ের নাম লিখুন, Enter চাপুন"
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                  />
                  <button type="button" onClick={addSubject} className="px-4 py-2 btn-primary rounded-xl text-sm font-semibold shrink-0">
                    <Plus size={14} />
                  </button>
                </div>
                {form.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.subjects.map(sub => (
                      <span key={sub} className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full">
                        {sub}
                        <button type="button" onClick={() => removeSubject(sub)} className="hover:text-red-500 transition-colors ml-0.5">
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {form.subjects.length === 0 && (
                  <p className="text-xs text-amber-500 mt-1.5">কোনো বিষয় না দিলে শিক্ষকের প্রোফাইলের বিষয় দেখাবে।</p>
                )}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <button onClick={handleAdd} className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold">সংরক্ষণ</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {MADRASHA_CLASSES.map(cls => {
            const clsAssignments = assignments.filter(a => a.classId === cls.id);
            if (clsAssignments.length === 0) return null;
            return (
              <div key={cls.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-purple-50 px-5 py-3 border-b border-purple-100">
                  <h3 className="font-semibold text-purple-900 flex items-center gap-2"><BookOpen size={14} /> {cls.nameBn}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {clsAssignments.map((a) => (
                    <div key={a.teacherId + a.classId} className="px-5 py-3 flex items-center gap-4">
                      <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {a.teacherName[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{a.teacherName}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {a.subjects.map(s => <span key={s} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>)}
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteTarget({ teacherId: a.teacherId, classId: a.classId, label: `${a.teacherName} — ${cls.nameBn}` })}
                        className="text-xs text-red-500 hover:text-red-700 shrink-0"
                      >
                        মুছুন
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {assignments.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">
              <BookOpen size={32} className="mx-auto mb-2 opacity-25" />
              <p>কোনো ক্লাস অ্যাসাইনমেন্ট নেই।</p>
              <p className="text-xs mt-1">শিক্ষক ব্যবস্থাপনা থেকে বা এখান থেকে ক্লাস যোগ করুন।</p>
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          itemName={deleteTarget.label}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
