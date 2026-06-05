import DashboardHeader from '@/components/layout/DashboardHeader';
import { FEES, STUDENTS } from '@/lib/data';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function TeacherFeesPage() {
  const classStudents = STUDENTS.filter(s => s.class === 'class-10');
  const classFees = FEES.filter(f => classStudents.some(s => s.id === f.studentId));

  const paid = classFees.filter(f => f.status === 'paid').length;
  const due = classFees.filter(f => f.status !== 'paid').length;

  return (
    <div>
      <DashboardHeader title="ফি বিবরণ" subtitle="আপনার ক্লাসের ছাত্রদের ফি তথ্য" userName="Md. Shafiqul Islam" role="শিক্ষক" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'পরিশোধিত', value: paid, color: 'bg-green-50 text-green-600 border-green-200' },
            { label: 'বকেয়া', value: due, color: 'bg-red-50 text-red-600 border-red-200' },
            { label: 'মোট', value: classFees.length, color: 'bg-purple-50 text-purple-600 border-purple-200' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-2xl border p-4 text-center ${color}`}>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">দাখিল ১০ম শ্রেণির ফি বিবরণ</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">ছাত্রের নাম</th>
                  <th className="px-5 py-3 text-left">ফি বিবরণ</th>
                  <th className="px-5 py-3 text-right">পরিমাণ</th>
                  <th className="px-5 py-3 text-center">অবস্থা</th>
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
                        {fee.status === 'paid' ? <><CheckCircle size={11} /> পরিশোধিত</> : <><AlertCircle size={11} /> বকেয়া</>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
