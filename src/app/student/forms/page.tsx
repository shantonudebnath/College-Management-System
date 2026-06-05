'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { ClipboardList, CheckCircle, Calendar } from 'lucide-react';

const FORMS = [
  { id: 'f1', title: 'দাখিল পরীক্ষার রেজিস্ট্রেশন ফর্ম', deadline: '2024-07-15', status: 'pending', desc: 'দাখিল পরীক্ষায় অংশগ্রহণের জন্য বাধ্যতামূলক রেজিস্ট্রেশন ফর্ম।' },
  { id: 'f2', title: 'বৃত্তি আবেদন ফর্ম ২০২৪', deadline: '2024-08-01', status: 'submitted', desc: 'মেধাবী শিক্ষার্থীদের জন্য বৃত্তি প্রদান ফর্ম।' },
  { id: 'f3', title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ফর্ম', deadline: '2024-09-10', status: 'pending', desc: 'বার্ষিক ক্রীড়া প্রতিযোগিতায় অংশগ্রহণ ইচ্ছুক শিক্ষার্থীদের জন্য।' },
];

export default function StudentFormsPage() {
  const [submitted, setSubmitted] = useState<string[]>(['f2']);
  const [active, setActive] = useState<string | null>(null);

  return (
    <div>
      <DashboardHeader title="ফর্ম ফিলআপ" subtitle="অ্যাডমিন নির্ধারিত ফর্মসমূহ" userName="Mohammad Rafiqul Islam" role="ছাত্র" />
      <div className="p-6 space-y-4">
        {FORMS.map(form => (
          <div key={form.id} className="bg-white rounded-2xl border border-gray-100 hover:border-purple-200 transition-all p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                <ClipboardList size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{form.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{form.desc}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                      <Calendar size={12} />
                      <span>শেষ তারিখ: {form.deadline}</span>
                    </div>
                  </div>
                  <div>
                    {submitted.includes(form.id) ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                        <CheckCircle size={12} /> জমা দেওয়া হয়েছে
                      </span>
                    ) : (
                      <button onClick={() => setActive(form.id)} className="text-xs font-semibold btn-primary px-4 py-1.5 rounded-full">
                        ফর্ম পূরণ করুন
                      </button>
                    )}
                  </div>
                </div>

                {active === form.id && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">ফর্ম পূরণ করুন</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">নাম</label>
                        <input defaultValue="Mohammad Rafiqul Islam" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">রোল নম্বর</label>
                        <input defaultValue="1" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500 block mb-1">অতিরিক্ত তথ্য</label>
                        <textarea rows={2} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400 resize-none"></textarea>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setSubmitted(p => [...p, form.id]); setActive(null); }} className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold">জমা দিন</button>
                      <button onClick={() => setActive(null)} className="px-5 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-100 transition-colors">বাতিল</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
