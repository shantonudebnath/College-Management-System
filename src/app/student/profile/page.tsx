'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS } from '@/lib/data';
import { User, Phone, MapPin, BookOpen, Calendar, Edit3, Save, X, Camera, Mail, Hash } from 'lucide-react';

const student = STUDENTS[0];

export default function StudentProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phone: '01712-345678',
    email: 'rahim@email.com',
    address: 'গ্রাম: পূর্বপাড়া, থানা: সদর, জেলা: কুমিল্লা',
    guardian: 'মোঃ আবুল কাশেম',
    guardianPhone: '01812-456789',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <DashboardHeader title="আমার প্রোফাইল" subtitle="ব্যক্তিগত তথ্য ও পরিচয়" userName={student.name} role="ছাত্র" />
      <div className="p-6 space-y-6 max-w-4xl">

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <Save size={15} /> তথ্য সফলভাবে সংরক্ষিত হয়েছে!
          </div>
        )}

        {/* Profile card */}
        <div className="gradient-primary text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                {student.name[0]}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                <Camera size={13} className="text-purple-700" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-purple-200 text-sm">{student.nameBn}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/80">
                <span className="flex items-center gap-1"><Hash size={11} /> {student.studentId}</span>
                <span>|</span>
                <span className="flex items-center gap-1"><BookOpen size={11} /> রোল: {student.roll}</span>
                <span>|</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> {student.session}</span>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="ml-auto flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              {editing ? <X size={14} /> : <Edit3 size={14} />}
              {editing ? 'বাতিল' : 'এডিট করুন'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Academic info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-purple-600" /> একাডেমিক তথ্য
            </h3>
            <div className="space-y-3">
              {[
                ['শ্রেণি', 'দাখিল (১০ম)'],
                ['শাখা', 'বিজ্ঞান'],
                ['রোল নম্বর', student.roll.toString()],
                ['ছাত্র আইডি', student.studentId],
                ['সেশন', student.session],
                ['ভর্তির তারিখ', '১৫ জানুয়ারি ২০২৩'],
                ['বোর্ড রেজি.', 'BMED-2023-045678'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={16} className="text-purple-600" /> ব্যক্তিগত তথ্য
            </h3>
            <div className="space-y-3">
              {[
                ['জন্ম তারিখ', '১২ মার্চ ২০০৮'],
                ['লিঙ্গ', 'পুরুষ'],
                ['ধর্ম', 'ইসলাম'],
                ['জাতীয়তা', 'বাংলাদেশি'],
                ['রক্তের গ্রুপ', 'B+'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone size={16} className="text-purple-600" /> যোগাযোগের তথ্য
              {editing && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-auto">সম্পাদনাযোগ্য</span>}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">মোবাইল নম্বর</label>
                {editing ? (
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-400" />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{form.phone}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">ইমেইল</label>
                {editing ? (
                  <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-400" />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{form.email}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">ঠিকানা</label>
                {editing ? (
                  <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    rows={2} className="w-full px-3 py-2 bg-gray-50 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-400 resize-none" />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{form.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Guardian info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={16} className="text-purple-600" /> অভিভাবকের তথ্য
              {editing && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-auto">সম্পাদনাযোগ্য</span>}
            </h3>
            <div className="space-y-3">
              {[
                ['পিতার নাম', 'মোঃ আবদুর রহমান'],
                ['মাতার নাম', 'মোছা. ফাতেমা বেগম'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-semibold text-gray-900">{value}</span>
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 block mb-1">অভিভাবকের নাম</label>
                {editing ? (
                  <input value={form.guardian} onChange={e => setForm(p => ({ ...p, guardian: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-400" />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{form.guardian}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">অভিভাবকের মোবাইল</label>
                {editing ? (
                  <input value={form.guardianPhone} onChange={e => setForm(p => ({ ...p, guardianPhone: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-400" />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{form.guardianPhone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {editing && (
          <button onClick={handleSave}
            className="flex items-center gap-2 btn-primary px-6 py-3 rounded-xl text-sm font-semibold">
            <Save size={16} /> পরিবর্তন সংরক্ষণ করুন
          </button>
        )}
      </div>
    </div>
  );
}
