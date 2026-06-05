import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, MADRASHA_CLASSES, COLLEGE_INFO } from '@/lib/data';
import { IdCard, Download, CheckCircle, XCircle } from 'lucide-react';

export default function AdminAdmitCardsPage() {
  const eligibleStudents = STUDENTS.filter(s => s.feeStatus === 'paid');
  const ineligibleStudents = STUDENTS.filter(s => s.feeStatus !== 'paid');

  return (
    <div>
      <DashboardHeader title="এডমিট কার্ড" subtitle="ফি পরিশোধকারী শিক্ষার্থীদের এডমিট কার্ড" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'যোগ্য শিক্ষার্থী', value: eligibleStudents.length, color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'অযোগ্য (বকেয়া)', value: ineligibleStudents.length, color: 'bg-red-50 text-red-700 border-red-200' },
            { label: 'মোট শিক্ষার্থী', value: STUDENTS.length, color: 'bg-purple-50 text-purple-700 border-purple-200' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-2xl border p-4 text-center ${color}`}>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
            </div>
          ))}
        </div>

        {/* Bulk download */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">সকল এডমিট কার্ড একসাথে ডাউনলোড</h3>
            <p className="text-xs text-gray-400 mt-0.5">শুধু ফি পরিশোধকারী {eligibleStudents.length} জনের এডমিট কার্ড তৈরি হবে</p>
          </div>
          <button className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
            <Download size={15} /> সব ডাউনলোড করুন
          </button>
        </div>

        {/* Student list */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">শিক্ষার্থী তালিকা</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {STUDENTS.map(s => {
              const eligible = s.feeStatus === 'paid';
              return (
                <div key={s.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${eligible ? 'bg-green-100' : 'bg-red-100'}`}>
                      {eligible ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.studentId} | রোল: {s.roll} | {MADRASHA_CLASSES.find(c => c.id === s.class)?.nameBn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {eligible ? 'যোগ্য' : 'অযোগ্য'}
                    </span>
                    {eligible && (
                      <button className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold hover:underline">
                        <Download size={12} /> ডাউনলোড
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
