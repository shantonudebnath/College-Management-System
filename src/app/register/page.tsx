'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, User, Phone, Calendar, MapPin, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { MADRASHA_CLASSES, COLLEGE_INFO } from '@/lib/data';

const STEPS = ['ব্যক্তিগত তথ্য', 'পারিবারিক তথ্য', 'শিক্ষাগত তথ্য', 'নিশ্চিতকরণ'];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', nameBn: '', dob: '', gender: 'Male', religion: 'Islam',
    phone: '', address: '', fatherName: '', motherName: '', fatherPhone: '',
    class: 'class-10', section: 'A', session: '2024-25', prevSchool: '',
    password: '', confirmPassword: '',
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 text-center max-w-sm w-full shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">আবেদন সম্পন্ন!</h2>
          <p className="text-gray-500 text-sm mb-6">আপনার রেজিস্ট্রেশন আবেদন সফলভাবে জমা হয়েছে। অ্যাডমিন অনুমোদনের পর আপনি লগইন করতে পারবেন।</p>
          <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-purple-700">আবেদন নম্বর</p>
            <p className="text-lg font-bold text-purple-900">REG-2024-{Math.floor(Math.random() * 9000) + 1000}</p>
          </div>
          <Link href="/login" className="block w-full btn-primary py-3 rounded-xl text-sm font-semibold text-center">লগইনে যান</Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
  const labelClass = "text-xs font-semibold text-gray-600 mb-1 block";

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold">{COLLEGE_INFO.nameBn}</p>
              <p className="text-purple-300 text-xs">ভর্তি রেজিস্ট্রেশন</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Steps header */}
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-green-500 text-white' : i === step ? 'gradient-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-purple-600' : 'text-gray-400'}`}>{s}</span>
                  {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300 ml-1" />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {step === 0 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-bold text-gray-900 mb-4">ব্যক্তিগত তথ্য</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>পূর্ণ নাম (ইংরেজি) *</label><input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full Name" /></div>
                  <div><label className={labelClass}>পূর্ণ নাম (বাংলা) *</label><input className={inputClass} value={form.nameBn} onChange={e => set('nameBn', e.target.value)} placeholder="বাংলায় নাম" /></div>
                  <div><label className={labelClass}>জন্ম তারিখ *</label><input type="date" className={inputClass} value={form.dob} onChange={e => set('dob', e.target.value)} /></div>
                  <div><label className={labelClass}>লিঙ্গ *</label>
                    <select className={inputClass} value={form.gender} onChange={e => set('gender', e.target.value)}>
                      <option value="Male">পুরুষ</option><option value="Female">মহিলা</option>
                    </select>
                  </div>
                  <div><label className={labelClass}>ধর্ম</label>
                    <select className={inputClass} value={form.religion} onChange={e => set('religion', e.target.value)}>
                      <option value="Islam">ইসলাম</option><option value="Other">অন্যান্য</option>
                    </select>
                  </div>
                  <div><label className={labelClass}>মোবাইল নম্বর *</label><input className={inputClass} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="01XXXXXXXXX" /></div>
                </div>
                <div><label className={labelClass}>বর্তমান ঠিকানা *</label><textarea className={inputClass} rows={2} value={form.address} onChange={e => set('address', e.target.value)} placeholder="বিস্তারিত ঠিকানা"></textarea></div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-bold text-gray-900 mb-4">পারিবারিক তথ্য</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>পিতার নাম *</label><input className={inputClass} value={form.fatherName} onChange={e => set('fatherName', e.target.value)} placeholder="পিতার নাম" /></div>
                  <div><label className={labelClass}>মাতার নাম *</label><input className={inputClass} value={form.motherName} onChange={e => set('motherName', e.target.value)} placeholder="মাতার নাম" /></div>
                  <div><label className={labelClass}>অভিভাবকের মোবাইল *</label><input className={inputClass} value={form.fatherPhone} onChange={e => set('fatherPhone', e.target.value)} placeholder="01XXXXXXXXX" /></div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-bold text-gray-900 mb-4">শিক্ষাগত তথ্য ও অ্যাকাউন্ট</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>ভর্তি ইচ্ছুক শ্রেণি *</label>
                    <select className={inputClass} value={form.class} onChange={e => set('class', e.target.value)}>
                      {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn} ({c.name})</option>)}
                    </select>
                  </div>
                  <div><label className={labelClass}>শাখা</label>
                    <select className={inputClass} value={form.section} onChange={e => set('section', e.target.value)}>
                      <option value="A">শাখা-ক (A)</option><option value="B">শাখা-খ (B)</option>
                    </select>
                  </div>
                  <div><label className={labelClass}>সেশন</label>
                    <select className={inputClass} value={form.session} onChange={e => set('session', e.target.value)}>
                      <option value="2024-25">২০২৪-২৫</option><option value="2023-24">২০২৩-২৪</option>
                    </select>
                  </div>
                  <div><label className={labelClass}>পূর্ববর্তী প্রতিষ্ঠান</label><input className={inputClass} value={form.prevSchool} onChange={e => set('prevSchool', e.target.value)} placeholder="পূর্ববর্তী মাদ্রাসা/স্কুল" /></div>
                  <div><label className={labelClass}>পাসওয়ার্ড *</label><input type="password" className={inputClass} value={form.password} onChange={e => set('password', e.target.value)} placeholder="পাসওয়ার্ড" /></div>
                  <div><label className={labelClass}>পাসওয়ার্ড নিশ্চিত করুন *</label><input type="password" className={inputClass} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="পুনরায় পাসওয়ার্ড" /></div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fadeIn">
                <h3 className="font-bold text-gray-900 mb-4">তথ্য নিশ্চিতকরণ</h3>
                <div className="bg-purple-50 rounded-2xl p-5 space-y-3">
                  {[
                    ['নাম', form.name],
                    ['বাংলা নাম', form.nameBn],
                    ['জন্ম তারিখ', form.dob],
                    ['লিঙ্গ', form.gender === 'Male' ? 'পুরুষ' : 'মহিলা'],
                    ['মোবাইল', form.phone],
                    ['পিতার নাম', form.fatherName],
                    ['মাতার নাম', form.motherName],
                    ['ভর্তি শ্রেণি', MADRASHA_CLASSES.find(c => c.id === form.class)?.nameBn],
                    ['শাখা', form.section],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">{label}:</span>
                      <span className="text-gray-900 font-semibold">{value || '—'}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  তথ্য জমা দেওয়ার পর অ্যাডমিন যাচাই করবেন। অনুমোদনের পর আপনি লগইন করতে পারবেন।
                </p>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all">
                <ChevronLeft size={16} /> আগের ধাপ
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 btn-primary rounded-xl text-sm font-semibold">
                  পরের ধাপ <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 btn-primary rounded-xl text-sm font-semibold disabled:opacity-70">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> জমা হচ্ছে...</> : 'জমা দিন'}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-purple-300 text-xs mt-4">
          ইতিমধ্যে রেজিস্ট্রেশন আছে?{' '}
          <Link href="/login" className="text-white font-semibold hover:underline">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
}
