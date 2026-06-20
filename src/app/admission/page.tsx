'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { COLLEGE_INFO, MADRASHA_CLASSES } from '@/lib/data';
import { saveAdmission, type AdmissionApplication } from '@/lib/website-content';
import { GraduationCap, CheckCircle, Send, Phone, Mail, MapPin } from 'lucide-react';

const EMPTY = { nameBn: '', nameEn: '', fatherName: '', motherName: '', dob: '', applyingClass: '', phone: '', address: '', previousSchool: '', previousResult: '' };

export default function AdmissionPage() {
  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const app: AdmissionApplication = {
      id: `adm-${Date.now()}`,
      ...form,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };
    saveAdmission(app);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 600);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 bg-[#f8f7ff]">
          <div className="text-center max-w-md px-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">আবেদন সফলভাবে জমা হয়েছে!</h2>
            <p className="text-gray-600 mb-2">আপনার ভর্তির আবেদন আমাদের কাছে পৌঁছেছে।</p>
            <p className="text-gray-500 text-sm mb-6">শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব। ফোন নম্বর: <strong>{COLLEGE_INFO.phone}</strong></p>
            <button onClick={() => { setForm(EMPTY); setSubmitted(false); }}
              className="btn-primary px-8 py-3 rounded-xl font-semibold text-sm">
              নতুন আবেদন করুন
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f8f7ff] py-12">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-3">
              <GraduationCap size={13} /> ভর্তি আবেদন ২০২৬
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{COLLEGE_INFO.nameBn}</h1>
            <p className="text-gray-500 text-sm mt-2">নিচের ফর্মটি পূরণ করে ভর্তির আবেদন করুন</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
                <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">শিক্ষার্থীর তথ্য</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">শিক্ষার্থীর নাম (বাংলায়) *</label>
                    <input required value={form.nameBn} onChange={e => set('nameBn', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors"
                      placeholder="যেমন: মোঃ রাহেলা আক্তার" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">শিক্ষার্থীর নাম (ইংরেজিতে) *</label>
                    <input required value={form.nameEn} onChange={e => set('nameEn', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors"
                      placeholder="e.g. Md. Rahela Akter" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">পিতার নাম *</label>
                    <input required value={form.fatherName} onChange={e => set('fatherName', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors"
                      placeholder="পিতার নাম লিখুন" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">মাতার নাম *</label>
                    <input required value={form.motherName} onChange={e => set('motherName', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors"
                      placeholder="মাতার নাম লিখুন" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">জন্ম তারিখ *</label>
                    <input required type="date" value={form.dob} onChange={e => set('dob', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">ভর্তিচ্ছু শ্রেণি *</label>
                    <select required value={form.applyingClass} onChange={e => set('applyingClass', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors">
                      <option value="">শ্রেণি নির্বাচন করুন</option>
                      {MADRASHA_CLASSES.map(c => (
                        <option key={c.id} value={c.id}>{c.nameBn}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-3">যোগাযোগের তথ্য</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">মোবাইল নম্বর *</label>
                      <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors"
                        placeholder="01XXXXXXXXX" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">পূর্ববর্তী প্রতিষ্ঠান</label>
                      <input value={form.previousSchool} onChange={e => set('previousSchool', e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors"
                        placeholder="পূর্ববর্তী স্কুল/মাদ্রাসার নাম" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">ঠিকানা *</label>
                    <textarea required value={form.address} onChange={e => set('address', e.target.value)} rows={3}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors resize-none"
                      placeholder="গ্রাম/মহল্লা, ইউনিয়ন/ওয়ার্ড, উপজেলা, জেলা" />
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">পূর্ববর্তী পরীক্ষার ফলাফল</label>
                    <input value={form.previousResult} onChange={e => set('previousResult', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:bg-white transition-colors"
                      placeholder="যেমন: GPA 5.00 / A+" />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 btn-primary py-3.5 rounded-xl font-bold text-sm disabled:opacity-60">
                  <Send size={16} />
                  {loading ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'}
                </button>
              </form>
            </div>

            {/* Info sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-4">যোগাযোগ</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2 items-start"><MapPin size={14} className="text-purple-500 shrink-0 mt-0.5" />{COLLEGE_INFO.address}</li>
                  <li className="flex gap-2 items-center"><Phone size={14} className="text-purple-500 shrink-0" />{COLLEGE_INFO.phone}</li>
                  <li className="flex gap-2 items-center"><Mail size={14} className="text-purple-500 shrink-0" />{COLLEGE_INFO.email}</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-2xl border border-purple-100 p-5">
                <h3 className="font-bold text-purple-900 text-sm mb-3">প্রয়োজনীয় কাগজপত্র</h3>
                <ul className="space-y-2 text-xs text-purple-800">
                  {['জন্ম নিবন্ধন সনদ (মূলকপি)', 'পূর্ববর্তী পরীক্ষার মার্কশিট', 'পাসপোর্ট সাইজ ছবি ৪ কপি', 'অভিভাবকের NID ফটোকপি', 'চারিত্রিক সনদপত্র'].map(d => (
                    <li key={d} className="flex items-start gap-2">
                      <CheckCircle size={12} className="text-purple-500 shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
                <h3 className="font-bold text-amber-900 text-sm mb-2">অফিস সময়</h3>
                <p className="text-xs text-amber-800">রবি – বৃহস্পতি<br />সকাল ৯টা – বিকেল ৪টা</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
