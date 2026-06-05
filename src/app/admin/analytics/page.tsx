'use client';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { STUDENTS, TEACHERS, FEES, EXAM_RESULTS } from '@/lib/data';
import { TrendingUp, Users, Award, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';

const GENDER_DATA = [{ name: 'ছেলে', value: 680 }, { name: 'মেয়ে', value: 555 }];
const PASS_FAIL = [{ name: 'উত্তীর্ণ', value: 94 }, { name: 'অনুত্তীর্ণ', value: 6 }];
const COLORS = ['#9756e6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const GPA_DIST = [
  { gpa: 'A+ (5.0)', count: 245 }, { gpa: 'A (4.0)', count: 312 }, { gpa: 'A- (3.5)', count: 198 },
  { gpa: 'B (3.0)', count: 156 }, { gpa: 'C (2.0)', count: 89 }, { gpa: 'D-F', count: 42 },
];

const MONTHLY_FEE = [
  { month: 'জানু', collected: 45000, due: 8000 }, { month: 'ফেব', collected: 42000, due: 12000 },
  { month: 'মার্চ', collected: 48000, due: 6000 }, { month: 'এপ্রিল', collected: 50000, due: 4000 },
  { month: 'মে', collected: 46000, due: 9000 },
];

const CLASS_PERFORMANCE = [
  { class: '১ম', avgGpa: 4.1 }, { class: '২য়', avgGpa: 3.9 }, { class: '৩য়', avgGpa: 4.2 },
  { class: '৪র্থ', avgGpa: 3.8 }, { class: '৫ম', avgGpa: 4.0 }, { class: '৬ষ্ঠ', avgGpa: 3.7 },
  { class: '৭ম', avgGpa: 3.5 }, { class: '৮ম', avgGpa: 3.8 }, { class: '৯ম', avgGpa: 4.0 }, { class: 'দাখিল', avgGpa: 4.3 },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      <DashboardHeader title="অ্যানালিটিক্স" subtitle="প্রতিষ্ঠানের সামগ্রিক পরিসংখ্যান ও বিশ্লেষণ" userName="Admin" role="Super Admin" />
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'মোট শিক্ষার্থী', value: '১,২৩৫', change: '+৪৫', up: true, color: 'bg-purple-50 text-purple-600' },
            { icon: Award, label: 'পাশের হার', value: '৯৮%', change: '+২%', up: true, color: 'bg-green-50 text-green-600' },
            { icon: CreditCard, label: 'ফি সংগ্রহ', value: '৳২.৩১ লাখ', change: '+১২%', up: true, color: 'bg-blue-50 text-blue-600' },
            { icon: TrendingUp, label: 'গড় GPA', value: '3.89', change: '+0.12', up: true, color: 'bg-amber-50 text-amber-600' },
          ].map(({ icon: Icon, label, value, change, up, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}><Icon size={20} /></div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              <p className={`text-[11px] font-semibold mt-1 ${up ? 'text-green-600' : 'text-red-500'}`}>{up ? '↑' : '↓'} {change} এই মাসে</p>
            </div>
          ))}
        </div>

        {/* Row 1: Class performance + GPA dist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">শ্রেণিভিত্তিক গড় GPA</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CLASS_PERFORMANCE}>
                <XAxis dataKey="class" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="avgGpa" fill="#9756e6" radius={[4,4,0,0]} name="গড় GPA" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">GPA বিতরণ</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={GPA_DIST} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="gpa" type="category" tick={{ fontSize: 10 }} width={60} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0,4,4,0]} name="শিক্ষার্থী" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Fee trend + pie charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">মাসিক ফি সংগ্রহ বনাম বকেয়া</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={MONTHLY_FEE}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="collected" stroke="#9756e6" fill="#f3f0ff" name="সংগৃহীত" strokeWidth={2} />
                <Area type="monotone" dataKey="due" stroke="#ef4444" fill="#fef2f2" name="বকেয়া" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">লিঙ্গভিত্তিক বিভাজন</h3>
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie data={GENDER_DATA} cx="50%" cy="50%" innerRadius={25} outerRadius={45} dataKey="value">
                    {GENDER_DATA.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-around text-xs mt-2">
                {GENDER_DATA.map((d, i) => <div key={d.name} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }}></div>{d.name}: {d.value}</div>)}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">পাশ/ফেল অনুপাত</h3>
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie data={PASS_FAIL} cx="50%" cy="50%" outerRadius={45} dataKey="value">
                    <Cell fill="#10b981" /><Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-around text-xs mt-2">
                {PASS_FAIL.map((d, i) => <div key={d.name} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: i === 0 ? '#10b981' : '#ef4444' }}></div>{d.name}: {d.value}%</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
