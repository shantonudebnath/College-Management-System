'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, MADRASHA_CLASSES } from '@/lib/data';
import { Users, Plus, Search, Edit, Trash2, Eye, Download, Filter } from 'lucide-react';
import type { Student } from '@/lib/types';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState(STUDENTS);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', nameBn: '', class: 'class-10', section: 'A', fatherName: '', phone: '', dob: '' });

  const filtered = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search)) &&
    (!filterClass || s.class === filterClass)
  );

  const addStudent = () => {
    const newSt: Student = {
      id: `s${Date.now()}`, studentId: `STD-2024-${(students.length + 1).toString().padStart(3,'0')}`,
      name: form.name, nameBn: form.nameBn, fatherName: form.fatherName, motherName: '',
      class: form.class, section: form.section, roll: students.length + 1,
      session: '2024-25', dob: form.dob, gender: 'Male', religion: 'Islam',
      phone: form.phone, address: '', registrationStatus: 'approved', feeStatus: 'due',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStudents(p => [newSt, ...p]);
    setShowForm(false);
    setForm({ name: '', nameBn: '', class: 'class-10', section: 'A', fatherName: '', phone: '', dob: '' });
  };

  const deleteStudent = (id: string) => setStudents(p => p.filter(s => s.id !== id));

  const STATUS_COLOR: Record<string, string> = {
    paid: 'bg-green-100 text-green-700', due: 'bg-red-100 text-red-700', partial: 'bg-amber-100 text-amber-700',
  };

  return (
    <div>
      <DashboardHeader title="শিক্ষার্থী ব্যবস্থাপনা" subtitle="সকল শিক্ষার্থীর তথ্য পরিচালনা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
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
          <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Download size={14} /> Excel
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
            <Plus size={16} /> নতুন ভর্তি
          </button>
        </div>

        {/* Add student form */}
        {showForm && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 animate-fadeIn">
            <h3 className="font-semibold text-gray-900 mb-4">নতুন শিক্ষার্থী ভর্তি</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'পূর্ণ নাম *', key: 'name', placeholder: 'Full Name' },
                { label: 'বাংলা নাম', key: 'nameBn', placeholder: 'বাংলায় নাম' },
                { label: 'পিতার নাম *', key: 'fatherName', placeholder: "Father's Name" },
                { label: 'মোবাইল', key: 'phone', placeholder: '01XXXXXXXXX' },
                { label: 'জন্ম তারিখ', key: 'dob', placeholder: '2010-01-01', type: 'date' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                  <input type={type ?? 'text'} value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">শ্রেণি</label>
                <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400">
                  {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addStudent} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">ভর্তি করুন</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">বাতিল</button>
            </div>
          </div>
        )}

        {/* Students table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 text-xs text-gray-400">
            {filtered.length}টি শিক্ষার্থী পাওয়া গেছে
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">আইডি</th>
                  <th className="px-5 py-3 text-left">নাম</th>
                  <th className="px-5 py-3 text-left">শ্রেণি</th>
                  <th className="px-5 py-3 text-center">রোল</th>
                  <th className="px-5 py-3 text-center">ফি অবস্থা</th>
                  <th className="px-5 py-3 text-center">ভর্তি অবস্থা</th>
                  <th className="px-5 py-3 text-center">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-400 text-xs font-mono">{s.studentId}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.nameBn}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{MADRASHA_CLASSES.find(c => c.id === s.class)?.nameBn}</td>
                    <td className="px-5 py-3 text-center text-gray-700 font-semibold">{s.roll}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[s.feeStatus]}`}>
                        {s.feeStatus === 'paid' ? 'পরিশোধিত' : s.feeStatus === 'due' ? 'বকেয়া' : 'আংশিক'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.registrationStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {s.registrationStatus === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"><Eye size={13} /></button>
                        <button className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-100"><Edit size={13} /></button>
                        <button onClick={() => deleteStudent(s.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"><Trash2 size={13} /></button>
                      </div>
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
