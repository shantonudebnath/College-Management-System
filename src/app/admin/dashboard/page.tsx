'use client';
import { useEffect, useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, FEES, MADRASHA_CLASSES } from '@/lib/data';
import type { Student } from '@/lib/types';
import { useStudents } from '@/context/StudentsContext';
import { useTeachers } from '@/context/TeachersContext';
import { useNotices } from '@/context/NoticesContext';
import { useFees } from '@/context/FeesContext';
import { Users, GraduationCap, CreditCard, Bell, TrendingUp, AlertCircle, Award } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const ATTENDANCE_DATA = [
  { day: 'শনি', present: 85, absent: 15 }, { day: 'রবি', present: 90, absent: 10 },
  { day: 'সোম', present: 78, absent: 22 }, { day: 'মঙ্গল', present: 92, absent: 8 },
  { day: 'বুধ', present: 88, absent: 12 }, { day: 'বৃহ', present: 82, absent: 18 },
];

const MONTHLY_ENROLLMENT = [
  { month: 'জানু', students: 45 }, { month: 'ফেব', students: 32 }, { month: 'মার্চ', students: 58 },
  { month: 'এপ্রিল', students: 40 }, { month: 'মে', students: 25 }, { month: 'জুন', students: 38 },
];

const LEVEL_COLORS: Record<string, string> = {
  ebtedayi: '#10b981',
  'junior-dakhil': '#3b82f6',
  dakhil: '#9756e6',
  alim: '#f59e0b',
};

const LEVEL_NAMES: Record<string, string> = {
  ebtedayi: 'ইবতেদায়ী',
  'junior-dakhil': 'জুনিয়র দাখিল',
  dakhil: 'দাখিল',
  alim: 'আলিম',
};


function isMale(gender?: string): boolean {
  const g = gender?.toLowerCase() ?? '';
  return g === 'male' || g === 'পুরুষ';
}
function isFemale(gender?: string): boolean {
  const g = gender?.toLowerCase() ?? '';
  return g === 'female' || g === 'মহিলা';
}

export default function AdminDashboard() {
  const { students: ctxStudents } = useStudents();
  const { teachers } = useTeachers();
  const { notices } = useNotices();
  const { fees: liveFees } = useFees();
  const students = ctxStudents.length > 0 ? ctxStudents : STUDENTS;

  // Use live fees; fall back to hardcoded if context hasn't loaded yet
  const feesSource = liveFees.length > 0 ? liveFees : FEES;
  const totalFees = feesSource.reduce((s, f) => s + f.amount, 0);
  const paidFees = feesSource.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);

  // Build class distribution from real student data
  const levelCounts: Record<string, number> = {};
  students.forEach(st => {
    const cls = MADRASHA_CLASSES.find(c => c.id === st.class);
    const level = cls?.level ?? 'other';
    levelCounts[level] = (levelCounts[level] ?? 0) + 1;
  });

  const CLASS_DIST = Object.entries(levelCounts)
    .filter(([, count]) => count > 0)
    .map(([level, value]) => ({
      name: LEVEL_NAMES[level] ?? level,
      value,
      color: LEVEL_COLORS[level] ?? '#6b7280',
    }));

  return (
    <div>
      <DashboardHeader title="অ্যাডমিন ড্যাশবোর্ড" subtitle="এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা — সম্পূর্ণ পর্যবেক্ষণ" userName="Admin" role="Super Admin" />

      <div className="p-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'মোট শিক্ষার্থী', value: students.length.toString(), sub: `${students.filter(s => isMale(s.gender)).length}জন ছাত্র, ${students.filter(s => isFemale(s.gender)).length}জন ছাত্রী`, color: 'bg-purple-50 text-purple-600', href: '/admin/students' },
            { icon: GraduationCap, label: 'মোট শিক্ষক', value: teachers.length.toString(), sub: `${teachers.length} সক্রিয়`, color: 'bg-blue-50 text-blue-600', href: '/admin/teachers' },
            { icon: CreditCard, label: 'ফি সংগৃহীত', value: `৳${(paidFees/1000).toFixed(0)}K`, sub: `${totalFees > 0 ? Math.round((paidFees/totalFees)*100) : 0}% সংগৃহীত`, color: 'bg-green-50 text-green-600', href: '/admin/fees' },
            { icon: Bell, label: 'সক্রিয় নোটিশ', value: notices.length.toString(), sub: `${notices.filter(n=>n.isImportant).length}টি জরুরি`, color: 'bg-amber-50 text-amber-600', href: '/admin/notices' },
          ].map(({ icon: Icon, label, value, sub, color, href }) => (
            <Link key={label} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}><Icon size={20} /></div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              <p className="text-[10px] text-green-600 mt-1">{sub}</p>
            </Link>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-purple-600" /> সাপ্তাহিক উপস্থিতি</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ATTENDANCE_DATA}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="present" fill="#9756e6" radius={[4,4,0,0]} name="উপস্থিত" />
                <Bar dataKey="absent" fill="#f3f4f6" radius={[4,4,0,0]} name="অনুপস্থিত" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Class distribution */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">শ্রেণিভিত্তিক বিতরণ</h3>
            {CLASS_DIST.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={CLASS_DIST} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                      {CLASS_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-3">
                  {CLASS_DIST.map(({ name, value, color }) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }}></div>
                        <span className="text-gray-600">{name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 text-center py-8">কোনো শিক্ষার্থী নেই</p>
            )}
          </div>
        </div>

        {/* Monthly enrollment trend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">মাসিক ভর্তির প্রবণতা ২০২৪</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={MONTHLY_ENROLLMENT}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#9756e6" strokeWidth={2.5} dot={{ fill: '#9756e6', r: 4 }} name="ভর্তি" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity + quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent notices */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">সাম্প্রতিক নোটিশ</h3>
              <Link href="/admin/notices" className="text-xs text-purple-600 hover:underline">সব দেখুন</Link>
            </div>
            {notices.length === 0 && (
              <div className="px-5 py-8 text-center text-gray-400 text-xs">কোনো নোটিশ নেই</div>
            )}
            {notices.slice(0,4).map(n => (
              <div key={n.id} className="px-5 py-3 border-b border-gray-50 last:border-0 flex items-center gap-3">
                {n.isImportant ? <AlertCircle size={14} className="text-red-400 shrink-0" /> : <Bell size={14} className="text-gray-300 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                  <p className="text-xs text-gray-400">{n.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick admin actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">দ্রুত কার্যক্রম</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'ছাত্র ভর্তি', href: '/admin/students', icon: Users, color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { label: 'ফলাফল প্রকাশ', href: '/admin/results', icon: Award, color: 'bg-green-50 text-green-700 border-green-200' },
                { label: 'নোটিশ দিন', href: '/admin/notices', icon: Bell, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { label: 'ফি নির্ধারণ', href: '/admin/fees', icon: CreditCard, color: 'bg-blue-50 text-blue-700 border-blue-200' },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link key={label} href={href} className={`flex items-center gap-3 p-4 rounded-xl border-2 ${color} hover:shadow-md transition-all group`}>
                  <Icon size={20} />
                  <span className="text-sm font-semibold">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
