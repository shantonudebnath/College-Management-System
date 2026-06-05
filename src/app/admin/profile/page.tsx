'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { COLLEGE_INFO } from '@/lib/data';
import { User, Phone, Shield, Edit3, Save, X, Camera, Mail, Settings, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminProfilePage() {
  const [editing, setEditing] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [form, setForm] = useState({
    name: 'মোঃ নাজমুল হক',
    phone: '01911-223344',
    email: 'admin@noorislammadrasha.edu.bd',
    address: 'প্রশাসনিক কার্যালয়, নূরে ইসলাম মাদ্রাসা, কুমিল্লা',
  });
  const [passForm, setPassForm] = useState({ old: '', new: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);

  const handleSave = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 3000); };
  const handlePassSave = () => {
    if (passForm.new !== passForm.confirm || !passForm.new) return;
    setPassSaved(true); setChangingPass(false); setPassForm({ old: '', new: '', confirm: '' });
    setTimeout(() => setPassSaved(false), 3000);
  };

  return (
    <div>
      <DashboardHeader title="অ্যাডমিন প্রোফাইল" subtitle="সিস্টেম প্রশাসকের তথ্য ও নিরাপত্তা" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-6 max-w-4xl">

        {(saved || passSaved) && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <Save size={15} /> {passSaved ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!' : 'তথ্য সফলভাবে সংরক্ষিত হয়েছে!'}
          </div>
        )}

        {/* Profile banner */}
        <div className="gradient-primary text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10 flex items-center gap-5 flex-wrap">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                A
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                <Camera size={13} className="text-purple-700" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{form.name}</h2>
              <p className="text-purple-200 text-sm">Super Administrator</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/80">
                <span className="flex items-center gap-1"><Shield size={11} /> সুপার অ্যাডমিন</span>
                <span>|</span>
                <span className="flex items-center gap-1"><Mail size={11} /> {form.email}</span>
              </div>
            </div>
            <button onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
              {editing ? <X size={14} /> : <Edit3 size={14} />}
              {editing ? 'বাতিল' : 'এডিট করুন'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={16} className="text-purple-600" /> ব্যক্তিগত তথ্য
              {editing && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-auto">সম্পাদনাযোগ্য</span>}
            </h3>
            <div className="space-y-3">
              {(['name', 'phone', 'email', 'address'] as const).map((key) => {
                const labels: Record<string, string> = { name: 'পুরো নাম', phone: 'মোবাইল', email: 'ইমেইল', address: 'অফিস ঠিকানা' };
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
            </div>
            {editing && (
              <button onClick={handleSave} className="mt-4 flex items-center gap-2 btn-primary px-5 py-2 rounded-xl text-sm font-semibold">
                <Save size={14} /> সংরক্ষণ করুন
              </button>
            )}
          </div>

          {/* System info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings size={16} className="text-purple-600" /> সিস্টেম তথ্য
            </h3>
            <div className="space-y-3">
              {[
                ['প্রতিষ্ঠানের নাম', COLLEGE_INFO.nameBn],
                ['EIIN', COLLEGE_INFO.eiin],
                ['বোর্ড', COLLEGE_INFO.board],
                ['প্রতিষ্ঠা', COLLEGE_INFO.established.toString()],
                ['ভূমিকা', 'Super Admin'],
                ['লগইন আইডি', 'admin001'],
                ['শেষ লগইন', 'আজকে, ১০:৩০ AM'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security / password change */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Lock size={16} className="text-purple-600" /> নিরাপত্তা ও পাসওয়ার্ড
              </h3>
              <button onClick={() => setChangingPass(!changingPass)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${changingPass ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100' : 'border-purple-200 text-purple-600 bg-purple-50 hover:bg-purple-100'}`}>
                {changingPass ? <><X size={13} /> বাতিল</> : <><Lock size={13} /> পাসওয়ার্ড পরিবর্তন করুন</>}
              </button>
            </div>

            {!changingPass ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'পাসওয়ার্ড স্তর', value: 'শক্তিশালী', color: 'text-green-600 bg-green-50' },
                  { label: 'শেষ পরিবর্তন', value: '৩০ দিন আগে', color: 'text-amber-600 bg-amber-50' },
                  { label: 'দুই-ধাপ যাচাইকরণ', value: 'সক্রিয় নয়', color: 'text-red-600 bg-red-50' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl bg-gray-50 p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className={`text-sm font-bold px-2 py-0.5 rounded-full inline-block ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['old', 'new', 'confirm'] as const).map((key) => {
                  const labels = { old: 'বর্তমান পাসওয়ার্ড', new: 'নতুন পাসওয়ার্ড', confirm: 'নতুন পাসওয়ার্ড নিশ্চিত' };
                  return (
                    <div key={key}>
                      <label className="text-xs text-gray-500 block mb-1">{labels[key]}</label>
                      <div className="relative">
                        <input
                          type={showPass[key] ? 'text' : 'password'}
                          value={passForm[key]}
                          onChange={e => setPassForm(p => ({ ...p, [key]: e.target.value }))}
                          placeholder="••••••••"
                          className="w-full px-3 py-2.5 pr-9 bg-gray-50 border border-purple-200 rounded-lg text-sm outline-none focus:border-purple-400"
                        />
                        <button type="button" onClick={() => setShowPass(p => ({ ...p, [key]: !p[key] }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPass[key] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="sm:col-span-3">
                  <button onClick={handlePassSave}
                    disabled={!passForm.new || passForm.new !== passForm.confirm}
                    className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                    <Save size={14} /> পাসওয়ার্ড পরিবর্তন করুন
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
