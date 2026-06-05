'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { TEACHERS } from '@/lib/data';
import { User, Phone, BookOpen, Edit3, Save, X, Camera, Mail, Award, Hash } from 'lucide-react';

const teacher = TEACHERS[0];

export default function TeacherProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phone: '01712-987654',
    email: 'karim.sir@noorislammadrasha.edu.bd',
    address: 'বাসা: ২৩, মধুপুর সড়ক, কুমিল্লা সদর',
    bio: 'আরবি ও ইসলামিক স্টাডিজ বিভাগের সিনিয়র শিক্ষক। ১৫ বছরের শিক্ষকতার অভিজ্ঞতা।',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <DashboardHeader title="আমার প্রোফাইল" subtitle="শিক্ষকের ব্যক্তিগত তথ্য" userName={teacher.name} role="শিক্ষক" />
      <div className="p-6 space-y-6 max-w-4xl">

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <Save size={15} /> তথ্য সফলভাবে সংরক্ষিত হয়েছে!
          </div>
        )}

        {/* Profile card */}
        <div className="gradient-primary text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10 flex items-center gap-5 flex-wrap">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                {teacher.name[0]}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                <Camera size={13} className="text-purple-700" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{teacher.name}</h2>
              <p className="text-purple-200 text-sm">{teacher.nameBn}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/80">
                <span className="flex items-center gap-1"><BookOpen size={11} /> {teacher.subject}</span>
                <span>|</span>
                <span className="flex items-center gap-1"><Award size={11} /> {teacher.designation}</span>
                <span>|</span>
                <span className="flex items-center gap-1"><Hash size={11} /> {teacher.id}</span>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              {editing ? <X size={14} /> : <Edit3 size={14} />}
              {editing ? 'বাতিল' : 'এডিট করুন'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Professional info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={16} className="text-purple-600" /> পেশাগত তথ্য
            </h3>
            <div className="space-y-3">
              {[
                ['শিক্ষক আইডি', teacher.id],
                ['বিষয়', teacher.subject],
                ['পদবি', teacher.designation],
                ['বিভাগ', teacher.department],
                ['যোগদানের তারিখ', teacher.joinDate],
                ['অভিজ্ঞতা', '১৫ বছর'],
                ['শ্রেণি দায়িত্ব', teacher.classes?.join(', ') ?? '৯ম, ১০ম'],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
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
                ['জন্ম তারিখ', '১৮ জুন ১৯৮০'],
                ['লিঙ্গ', 'পুরুষ'],
                ['ধর্ম', 'ইসলাম'],
                ['জাতীয়তা', 'বাংলাদেশি'],
                ['রক্তের গ্রুপ', 'O+'],
                ['NID', '198012345678901'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Bio */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone size={16} className="text-purple-600" /> যোগাযোগ ও পরিচিতি
              {editing && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-auto">সম্পাদনাযোগ্য</span>}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['phone', 'email', 'address'] as const).map((key) => {
                const labels: Record<string, string> = { phone: 'মোবাইল নম্বর', email: 'ইমেইল', address: 'ঠিকানা' };
                return (
                  <div key={key}>
                    <label className="text-xs text-gray-500 block mb-1">{labels[key]}</label>
                    {editing ? (
                      <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-50 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-400" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{form[key]}</p>
                    )}
                  </div>
                );
              })}
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 block mb-1">সংক্ষিপ্ত পরিচিতি</label>
                {editing ? (
                  <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    rows={2} className="w-full px-3 py-2 bg-gray-50 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-400 resize-none" />
                ) : (
                  <p className="text-sm text-gray-700">{form.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-purple-600" /> শিক্ষাগত যোগ্যতা
            </h3>
            <div className="space-y-3">
              {[
                { degree: 'কামিল (M.A.)', subject: 'আরবি সাহিত্য', institute: 'ঢাকা আলিয়া মাদ্রাসা', year: '২০০৩', grade: '১ম শ্রেণি' },
                { degree: 'ফাযিল (B.A.)', subject: 'আরবি', institute: 'কুমিল্লা ইসলামিয়া মাদ্রাসা', year: '২০০১', grade: '১ম শ্রেণি' },
                { degree: 'দাখিল', subject: 'সাধারণ', institute: 'নূরে ইসলাম মাদ্রাসা', year: '১৯৯৮', grade: 'A+' },
              ].map((q) => (
                <div key={q.degree} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{q.degree} — {q.subject}</p>
                    <p className="text-xs text-gray-500">{q.institute} | {q.year}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">{q.grade}</span>
                </div>
              ))}
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
