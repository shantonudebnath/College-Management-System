'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { loadAdmissions, updateAdmissionStatus, type AdmissionApplication } from '@/lib/website-content';
import { MADRASHA_CLASSES } from '@/lib/data';
import { CheckCircle, XCircle, Clock, Users, Eye, X } from 'lucide-react';
import { useStudents } from '@/context/StudentsContext';

function statusBadge(s: AdmissionApplication['status']) {
  if (s === 'accepted') return <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full"><CheckCircle size={11} />গৃহীত</span>;
  if (s === 'rejected') return <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2.5 py-1 rounded-full"><XCircle size={11} />বাতিল</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full"><Clock size={11} />অপেক্ষমাণ</span>;
}

export default function AdminAdmissionsPage() {
  const { upsertStudent } = useStudents();
  const [apps, setApps] = useState<AdmissionApplication[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [selected, setSelected] = useState<AdmissionApplication | null>(null);

  useEffect(() => { loadAdmissions().then(list => setApps(list.sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)))); }, []);

  const refresh = () => loadAdmissions().then(list => setApps(list.sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))));

  const handleAccept = async (id: string) => {
    const app = await updateAdmissionStatus(id, 'accepted');
    if (!app) return;
    // Auto-add to Supabase students
    const cls = MADRASHA_CLASSES.find(c => c.id === app.applyingClass);
    await upsertStudent({
      id: `stu-adm-${id}`,
      name: app.nameEn || app.nameBn,
      nameBn: app.nameBn,
      class: app.applyingClass,
      roll: Date.now() % 1000,
      section: 'A',
      gender: 'male',
      phone: app.phone,
      address: app.address,
      fatherName: app.fatherName,
      motherName: app.motherName,
      dob: app.dob,
      studentId: `STD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      session: `${new Date().getFullYear()}`,
      religion: '',
      registrationStatus: 'approved',
      feeStatus: 'due',
      createdAt: new Date().toISOString().slice(0, 10),
    });
    refresh();
    setSelected(null);
  };

  const handleReject = async (id: string) => {
    await updateAdmissionStatus(id, 'rejected');
    refresh();
    setSelected(null);
  };

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);
  const counts = { all: apps.length, pending: apps.filter(a => a.status === 'pending').length, accepted: apps.filter(a => a.status === 'accepted').length, rejected: apps.filter(a => a.status === 'rejected').length };

  return (
    <div>
      <DashboardHeader title="ভর্তি আবেদন" subtitle="শিক্ষার্থীদের ভর্তির আবেদন পর্যালোচনা করুন" userName="Admin" role="অ্যাডমিন" />
      <div className="p-6 space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([['all', 'সকল', 'bg-gray-100 text-gray-700'], ['pending', 'অপেক্ষমাণ', 'bg-amber-100 text-amber-700'], ['accepted', 'গৃহীত', 'bg-green-100 text-green-700'], ['rejected', 'বাতিল', 'bg-red-100 text-red-700']] as const).map(([k, label, cls]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`rounded-2xl p-5 text-left transition-all shadow-sm border ${filter === k ? 'border-purple-400 ring-2 ring-purple-200' : 'border-gray-100'} ${cls} bg-white`}>
              <p className="text-2xl font-bold text-gray-900">{counts[k]}</p>
              <p className="text-xs font-medium mt-1">{label}</p>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Users size={16} className="text-purple-600" />
            <h3 className="font-semibold text-gray-900">আবেদন তালিকা</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">শিক্ষার্থীর নাম</th>
                  <th className="px-4 py-3 text-left font-semibold">শ্রেণি</th>
                  <th className="px-4 py-3 text-left font-semibold">মোবাইল</th>
                  <th className="px-4 py-3 text-left font-semibold">আবেদনের তারিখ</th>
                  <th className="px-4 py-3 text-center font-semibold">অবস্থা</th>
                  <th className="px-4 py-3 text-center font-semibold">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">কোনো আবেদন নেই</td></tr>
                )}
                {filtered.map(app => {
                  const cls = MADRASHA_CLASSES.find(c => c.id === app.applyingClass);
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{app.nameBn}</p>
                        <p className="text-xs text-gray-400">{app.nameEn}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{cls?.nameBn ?? app.applyingClass}</td>
                      <td className="px-4 py-3 text-gray-600">{app.phone}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(app.appliedAt).toLocaleDateString('bn-BD')}</td>
                      <td className="px-4 py-3 text-center">{statusBadge(app.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setSelected(app)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"><Eye size={14} /></button>
                          {app.status === 'pending' && (
                            <>
                              <button onClick={() => handleAccept(app.id)} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"><CheckCircle size={14} /></button>
                              <button onClick={() => handleReject(app.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><XCircle size={14} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">আবেদনের বিবরণ</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              {[
                ['নাম (বাংলা)', selected.nameBn],
                ['নাম (ইংরেজি)', selected.nameEn],
                ['পিতার নাম', selected.fatherName],
                ['মাতার নাম', selected.motherName],
                ['জন্ম তারিখ', selected.dob],
                ['ভর্তিচ্ছু শ্রেণি', MADRASHA_CLASSES.find(c => c.id === selected.applyingClass)?.nameBn ?? selected.applyingClass],
                ['মোবাইল', selected.phone],
                ['ঠিকানা', selected.address],
                ['পূর্ববর্তী প্রতিষ্ঠান', selected.previousSchool || '—'],
                ['পূর্ববর্তী ফলাফল', selected.previousResult || '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <span className="text-gray-500 w-36 shrink-0">{label}:</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
              <div className="flex gap-3"><span className="text-gray-500 w-36 shrink-0">অবস্থা:</span>{statusBadge(selected.status)}</div>
            </div>
            {selected.status === 'pending' && (
              <div className="px-5 pb-5 flex gap-3">
                <button onClick={() => handleAccept(selected.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors">
                  <CheckCircle size={15} /> গ্রহণ করুন
                </button>
                <button onClick={() => handleReject(selected.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors">
                  <XCircle size={15} /> বাতিল করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
