'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { FEES, MADRASHA_CLASSES, STUDENTS } from '@/lib/data';
import { useCurrentTeacher } from '@/context/CurrentTeacherContext';
import { useTeachers } from '@/context/TeachersContext';
import { CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import type { Fee, Student } from '@/lib/types';

export default function TeacherFeesPage() {
  const { currentTeacherId, assignedClassId } = useCurrentTeacher();
  const { teachers } = useTeachers();
  const currentTeacher = teachers.find(t => t.id === currentTeacherId);

  const [fees, setFees] = useState<Fee[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>(STUDENTS);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'paid' | 'due' | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fees_store');
      setFees(stored ? JSON.parse(stored) : FEES);
    } catch { setFees(FEES); }
    try {
      const raw = localStorage.getItem('students_store');
      if (raw) {
        const stored: Student[] = JSON.parse(raw);
        const ids = new Set(stored.map(s => s.id));
        setAllStudents([...stored, ...STUDENTS.filter(s => !ids.has(s.id))]);
      }
    } catch {}
  }, []);

  const save = (updated: Fee[]) => {
    setFees(updated);
    try { localStorage.setItem('fees_store', JSON.stringify(updated)); } catch {}
  };

  const markPaid = (id: string) => {
    save(fees.map(f => f.id === id ? {
      ...f, status: 'paid' as const,
      paidDate: new Date().toISOString().split('T')[0],
      receiptNo: `RCP-${Date.now().toString().slice(-6)}`,
    } : f));
    setConfirmId(null);
    setConfirmAction(null);
  };

  const markDue = (id: string) => {
    save(fees.map(f => f.id === id ? { ...f, status: 'due' as const, paidDate: undefined, receiptNo: undefined } : f));
    setConfirmId(null);
    setConfirmAction(null);
  };

  const assignedClass = MADRASHA_CLASSES.find(c => c.id === assignedClassId);
  const classStudents = assignedClassId ? allStudents.filter(s => s.class === assignedClassId) : [];
  const classFees = fees.filter(f => classStudents.some(s => s.id === f.studentId));

  const paid = classFees.filter(f => f.status === 'paid').length;
  const due = classFees.filter(f => f.status !== 'paid').length;

  const teacherName = currentTeacher ? (currentTeacher.nameBn || currentTeacher.name) : 'শিক্ষক';

  return (
    <div>
      <DashboardHeader title="ফি বিবরণ" subtitle="আপনার শ্রেণির শিক্ষার্থীদের ফি তথ্য ও আপডেট" userName={teacherName} role="শিক্ষক" />
      <div className="p-6 space-y-5">

        {!currentTeacherId && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">শিক্ষক নির্বাচন করুন</p>
              <p className="text-sm text-amber-600 mt-0.5">বাম পাশের সাইডবার থেকে আপনার নাম নির্বাচন করুন।</p>
            </div>
          </div>
        )}

        {currentTeacherId && !assignedClassId && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800">কোনো শ্রেণি নির্ধারিত নেই</p>
              <p className="text-sm text-blue-600 mt-0.5">অ্যাডমিন থেকে আপনার জন্য কোনো শ্রেণি নির্ধারণ করা হয়নি।</p>
            </div>
          </div>
        )}

        {assignedClassId && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'পরিশোধিত', value: paid, color: 'bg-green-50 text-green-600 border-green-200' },
                { label: 'বকেয়া', value: due, color: 'bg-red-50 text-red-600 border-red-200' },
                { label: 'মোট এন্ট্রি', value: classFees.length, color: 'bg-purple-50 text-purple-600 border-purple-200' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`rounded-2xl border p-4 text-center ${color}`}>
                  <p className="text-3xl font-bold">{value}</p>
                  <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{assignedClass?.nameBn ?? assignedClassId} — ফি বিবরণ</h3>
                  <p className="text-xs text-gray-400 mt-0.5">ফি পরিশোধ চিহ্নিত করতে পারবেন</p>
                </div>
                <CreditCard size={18} className="text-purple-400" />
              </div>

              {classFees.length === 0 ? (
                <div className="px-5 py-10 text-center text-gray-400 text-sm">এই শ্রেণির কোনো ফি নির্ধারণ করা হয়নি।</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="px-5 py-3 text-left">শিক্ষার্থী</th>
                        <th className="px-5 py-3 text-left">ফি বিবরণ</th>
                        <th className="px-5 py-3 text-right">পরিমাণ</th>
                        <th className="px-5 py-3 text-center">অবস্থা</th>
                        <th className="px-5 py-3 text-center">আপডেট</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {classFees.map(fee => (
                        <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 font-medium text-gray-900">{fee.studentName}</td>
                          <td className="px-5 py-3 text-gray-600">{fee.feeType}</td>
                          <td className="px-5 py-3 text-right font-semibold">৳ {fee.amount}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {fee.status === 'paid'
                                ? <><CheckCircle size={11} /> পরিশোধিত</>
                                : <><AlertCircle size={11} /> বকেয়া</>}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-center">
                            {confirmId === fee.id ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => confirmAction === 'paid' ? markPaid(fee.id) : markDue(fee.id)}
                                  className="px-2.5 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                                >
                                  নিশ্চিত
                                </button>
                                <button
                                  onClick={() => { setConfirmId(null); setConfirmAction(null); }}
                                  className="px-2.5 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                                >
                                  বাতিল
                                </button>
                              </div>
                            ) : fee.status === 'paid' ? (
                              <button
                                onClick={() => { setConfirmId(fee.id); setConfirmAction('due'); }}
                                className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-1 mx-auto"
                              >
                                <Clock size={11} /> বকেয়া করুন
                              </button>
                            ) : (
                              <button
                                onClick={() => { setConfirmId(fee.id); setConfirmAction('paid'); }}
                                className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors flex items-center gap-1 mx-auto"
                              >
                                <CheckCircle size={11} /> পরিশোধিত
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
