'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { TEACHERS } from '@/lib/data';
import { Plus, Search, Edit, Trash2, Phone, Mail, User } from 'lucide-react';
import type { Teacher } from '@/lib/types';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState(TEACHERS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', nameBn: '', designation: 'Assistant Teacher', department: '', subject: '', phone: '', email: '', qualification: '' });

  const filtered = teachers.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.department.toLowerCase().includes(search.toLowerCase())
  );

  const addTeacher = () => {
    if (!form.name) return;
    const t: Teacher = {
      id: `t${Date.now()}`, teacherId: `TCH-${(teachers.length + 1).toString().padStart(3,'0')}`,
      name: form.name, nameBn: form.nameBn, designation: form.designation,
      department: form.department, subject: form.subject.split(',').map(s => s.trim()),
      classes: [], phone: form.phone, email: form.email, address: '',
      qualification: form.qualification, joinDate: new Date().toISOString().split('T')[0],
    };
    setTeachers(p => [t, ...p]);
    setShowForm(false);
    setForm({ name: '', nameBn: '', designation: 'Assistant Teacher', department: '', subject: '', phone: '', email: '', qualification: '' });
  };

  const departments = [...new Set(filtered.map(t => t.department))];

  return (
    <div>
      <DashboardHeader title="শিক্ষক ব্যবস্থাপনা" subtitle="সকল শিক্ষকের তথ্য পরিচালনা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        {/* Controls */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="নাম বা বিভাগ দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
            <Plus size={16} /> নতুন শিক্ষক যোগ করুন
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn">
            <h3 className="font-semibold text-gray-900 mb-4">নতুন শিক্ষকের তথ্য</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'পূর্ণ নাম *', key: 'name', placeholder: 'Full Name' },
                { label: 'বাংলা নাম', key: 'nameBn', placeholder: 'বাংলায় নাম' },
                { label: 'বিভাগ *', key: 'department', placeholder: 'Department' },
                { label: 'বিষয় (কমা দিয়ে)', key: 'subject', placeholder: 'Math, Science' },
                { label: 'মোবাইল', key: 'phone', placeholder: '01XXXXXXXXX' },
                { label: 'ইমেইল', key: 'email', placeholder: 'email@example.com' },
                { label: 'শিক্ষাগত যোগ্যতা', key: 'qualification', placeholder: 'M.Sc, Dhaka University' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                  <input value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">পদবি</label>
                <select value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                  <option>Principal</option><option>Senior Teacher</option><option>Assistant Teacher</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addTeacher} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">যোগ করুন</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        {/* Teacher cards by department */}
        {departments.map(dept => (
          <div key={dept}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{dept}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.filter(t => t.department === dept).map(teacher => (
                <div key={teacher.id} className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0">
                      {teacher.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{teacher.name}</p>
                      <p className="text-xs text-purple-600 font-medium">{teacher.designation}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{teacher.teacherId}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button className="w-7 h-7 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-100"><Edit size={12} /></button>
                      <button onClick={() => setTeachers(p => p.filter(t => t.id !== teacher.id))} className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                    <div className="flex gap-1.5"><Phone size={11} className="text-purple-400 shrink-0 mt-0.5" />{teacher.phone}</div>
                    <div className="flex gap-1.5 truncate"><Mail size={11} className="text-purple-400 shrink-0 mt-0.5" />{teacher.email}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {teacher.subject.map(s => <span key={s} className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
