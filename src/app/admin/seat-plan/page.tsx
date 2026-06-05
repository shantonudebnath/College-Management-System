'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS } from '@/lib/data';
import { MapPin, Download, Printer, Settings } from 'lucide-react';

export default function AdminSeatPlanPage() {
  const [halls, setHalls] = useState([
    { name: 'হল-১', rows: 5, cols: 8 },
    { name: 'হল-২', rows: 4, cols: 7 },
  ]);
  const [generated, setGenerated] = useState(false);
  const [config, setConfig] = useState({ halls: 2, seatsPerHall: 40 });

  const dakhilStudents = STUDENTS.filter(s => s.class === 'class-10' || s.class === 'class-9');

  const generatePlan = () => setGenerated(true);

  return (
    <div>
      <DashboardHeader title="পরীক্ষার আসন পরিকল্পনা" subtitle="পরীক্ষার হলে আসন বিন্যাস তৈরি করুন" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        {/* Config */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Settings size={16} className="text-purple-600" /> হলের তথ্য ইনপুট করুন</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'হলের সংখ্যা', key: 'halls', min: 1, max: 10 },
              { label: 'প্রতি হলে আসন', key: 'seatsPerHall', min: 10, max: 100 },
            ].map(({ label, key, min, max }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                <input type="number" min={min} max={max} value={(config as any)[key]}
                  onChange={e => setConfig(p => ({ ...p, [key]: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" />
              </div>
            ))}
            <div className="flex items-end">
              <button onClick={generatePlan} className="w-full btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold">আসন পরিকল্পনা তৈরি করুন</button>
            </div>
            {generated && (
              <div className="flex items-end gap-2">
                <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                  <Download size={14} /> PDF
                </button>
                <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                  <Printer size={14} /> প্রিন্ট
                </button>
              </div>
            )}
          </div>
        </div>

        {generated && (
          <div className="space-y-6">
            {Array.from({ length: config.halls }, (_, hi) => {
              const startIdx = hi * config.seatsPerHall;
              const hallStudents = dakhilStudents.slice(startIdx, startIdx + config.seatsPerHall);
              const rows = Math.ceil(config.seatsPerHall / 8);

              return (
                <div key={hi} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="gradient-primary text-white px-5 py-3 flex items-center justify-between">
                    <h3 className="font-semibold">পরীক্ষার হল — {hi + 1}</h3>
                    <span className="text-purple-200 text-xs">আসন সংখ্যা: {config.seatsPerHall}</span>
                  </div>
                  <div className="p-5">
                    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
                      {Array.from({ length: config.seatsPerHall }, (_, si) => {
                        const student = hallStudents[si];
                        return (
                          <div key={si} className={`rounded-xl p-2 text-center text-[10px] border-2 ${student ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-100 opacity-40'}`}>
                            <p className="font-bold text-purple-700">{startIdx + si + 1}</p>
                            {student && <p className="text-gray-600 truncate mt-0.5">{student.name.split(' ')[0]}</p>}
                            {student && <p className="text-gray-400">{student.roll}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
