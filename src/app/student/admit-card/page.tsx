'use client';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, COLLEGE_INFO } from '@/lib/data';
import { IdCard, Download, Printer, CheckCircle, AlertCircle, User } from 'lucide-react';

const student = STUDENTS[0];

export default function AdmitCardPage() {
  const isEligible = student.feeStatus === 'paid';

  const handlePrint = () => window.print();

  return (
    <div>
      <DashboardHeader title="এডমিট কার্ড" subtitle="পরীক্ষার প্রবেশপত্র" userName={student.name} role="ছাত্র" />
      <div className="p-6 space-y-6">
        {!isEligible ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
            <h3 className="font-semibold text-red-800 text-lg mb-2">এডমিট কার্ড পাওয়া যায়নি</h3>
            <p className="text-red-600 text-sm">বকেয়া ফি পরিশোধ না হওয়া পর্যন্ত এডমিট কার্ড দেওয়া হবে না।</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-green-800 font-medium text-sm">সকল ফি পরিশোধিত — আপনি এডমিট কার্ড ডাউনলোড করতে পারবেন।</p>
            </div>

            {/* Admit card preview */}
            <div id="admit-card" className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden max-w-2xl mx-auto shadow-xl">
              {/* Header */}
              <div className="gradient-hero text-white p-5 text-center">
                <h2 className="text-lg font-bold">{COLLEGE_INFO.nameBn}</h2>
                <p className="text-purple-200 text-xs">{COLLEGE_INFO.name}</p>
                <p className="text-purple-200 text-xs mt-0.5">{COLLEGE_INFO.address}</p>
                <div className="mt-3 bg-white/20 rounded-xl px-4 py-2 inline-block">
                  <p className="font-bold text-base">প্রবেশপত্র (Admit Card)</p>
                  <p className="text-purple-200 text-xs">বার্ষিক পরীক্ষা ২০২৪</p>
                </div>
              </div>

              {/* Student info */}
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Photo placeholder */}
                  <div className="w-24 h-28 bg-gray-100 rounded-xl border-2 border-gray-300 flex items-center justify-center shrink-0">
                    <User size={36} className="text-gray-400" />
                    <p className="text-[8px] text-gray-400 absolute mt-16">ছবি</p>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-3">
                    {[
                      ['শিক্ষার্থীর নাম', student.name],
                      ['বাংলা নাম', student.nameBn],
                      ['পিতার নাম', student.fatherName],
                      ['মাতার নাম', student.motherName],
                      ['রোল নম্বর', String(student.roll)],
                      ['রেজি. নম্বর', student.studentId],
                      ['শ্রেণি', 'দাখিল — ১০ম শ্রেণি'],
                      ['শাখা', student.section],
                      ['সেশন', student.session],
                      ['জন্ম তারিখ', student.dob],
                    ].map(([label, value]) => (
                      <div key={label} className="border-b border-gray-100 pb-1.5">
                        <p className="text-[10px] text-gray-400">{label}</p>
                        <p className="text-xs font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exam schedule in admit card */}
                <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600">পরীক্ষার সময়সূচী</div>
                  <div className="p-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="font-semibold text-gray-600">বিষয়</div>
                    <div className="font-semibold text-gray-600">তারিখ</div>
                    <div className="font-semibold text-gray-600">সময়</div>
                    <div className="col-span-3 border-t border-gray-100"></div>
                    {[
                      ['কুরআন মজিদ', '০১ নভেম্বর', '১০:০০–১:০০'],
                      ['হাদিস শরীফ', '০৩ নভেম্বর', '১০:০০–১:০০'],
                      ['আরবি', '০৫ নভেম্বর', '১০:০০–১:০০'],
                      ['বাংলা', '০৭ নভেম্বর', '১০:০০–১:০০'],
                      ['ইংরেজি', '১০ নভেম্বর', '১০:০০–১:০০'],
                      ['গণিত', '১২ নভেম্বর', '১০:০০–১:০০'],
                    ].map(([sub, date, time]) => (
                      <>
                        <div className="text-gray-700">{sub}</div>
                        <div className="text-gray-500">{date}</div>
                        <div className="text-gray-500">{time}</div>
                      </>
                    ))}
                  </div>
                </div>

                {/* Signatures */}
                <div className="mt-5 flex justify-between text-center text-xs text-gray-400">
                  <div>
                    <div className="w-24 border-t border-gray-400 pt-1">শিক্ষার্থীর স্বাক্ষর</div>
                  </div>
                  <div>
                    <div className="w-24 border-t border-gray-400 pt-1">প্রধান শিক্ষকের স্বাক্ষর</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 max-w-2xl mx-auto">
              <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                <Printer size={16} /> প্রিন্ট করুন
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 btn-primary rounded-xl text-sm font-semibold">
                <Download size={16} /> PDF ডাউনলোড
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
