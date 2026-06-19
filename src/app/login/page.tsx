'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { COLLEGE_INFO } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';

const DOMAIN = 'noorislammadrasha.edu.bd';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: '', password: '' });

  // Validate credential format to avoid creating random Supabase users
  const isValidCredentialFormat = (id: string, password: string, r: string): boolean => {
    if (r === 'student') {
      const m = id.match(/^STD-\d{4}-(\d{3})$/i);
      return !!m && password === `NIM@${m[1]}`;
    }
    if (r === 'teacher') {
      return /^TCH-\d+$/i.test(id) && /^NIM@Teacher#\d{4}$/.test(password);
    }
    return false;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanId = form.id.trim();
    const email = `${cleanId.toLowerCase().replace(/\s+/g, '')}@${DOMAIN}`;
    const supabase = createClient();

    let { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: form.password,
    });

    // If login fails for student/teacher and credentials match the formula, auto-create Supabase user and retry
    if ((authError || !data.user) && role !== 'admin') {
      if (isValidCredentialFormat(cleanId, form.password, role)) {
        try {
          await fetch('/api/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayId: cleanId, password: form.password, role }),
          });
        } catch { /* ignore */ }

        // Retry login after ensuring user exists
        const retry = await supabase.auth.signInWithPassword({ email, password: form.password });
        data = retry.data;
        authError = retry.error;
      }
    }

    if (authError || !data.user) {
      setError(authError?.message === 'Email not confirmed'
        ? 'ইমেইল কনফার্ম হয়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।'
        : 'আইডি বা পাসওয়ার্ড ভুল হয়েছে। আবার চেষ্টা করুন।');
      setLoading(false);
      return;
    }

    // Fetch profile for role-based redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    const userRole = profile?.role ?? role;
    // Hard redirect so middleware picks up the fresh session cookies
    if (userRole === 'student') window.location.href = '/student/dashboard';
    else if (userRole === 'teacher') window.location.href = '/teacher/dashboard';
    else window.location.href = '/admin/dashboard';
  };

  const ROLE_LABELS = { student: 'ছাত্র', teacher: 'শিক্ষক', admin: 'অ্যাডমিন' };
  const ID_LABELS = { student: 'ছাত্র আইডি / রোল নম্বর', teacher: 'শিক্ষক আইডি', admin: 'অ্যাডমিন আইডি' };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* BG blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <GraduationCap size={30} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">{COLLEGE_INFO.nameBn}</h1>
          <p className="text-purple-300 text-sm mt-1">{COLLEGE_INFO.name}</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl backdrop-blur-xl bg-white/90">
          <h2 className="text-xl font-bold text-gray-900 mb-1">স্বাগতম!</h2>
          <p className="text-sm text-gray-500 mb-6">আপনার পোর্টালে লগইন করুন</p>

          {/* Role selector */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            {(['student', 'teacher', 'admin'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${role === r ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{ID_LABELS[role]}</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required value={form.id} onChange={e => setForm(p => ({ ...p, id: e.target.value }))}
                  placeholder={`আপনার ${ROLE_LABELS[role]} আইডি লিখুন`}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="পাসওয়ার্ড লিখুন"
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="accent-purple-600" /> মনে রাখুন
              </label>
              <a href="#" className="text-purple-600 hover:underline">পাসওয়ার্ড ভুলে গেছেন?</a>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> লগইন হচ্ছে...</>
              ) : (
                <>লগইন করুন <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              ছাত্র? ফলাফল দেখতে{' '}
              <Link href="/result" className="text-purple-600 font-semibold hover:underline">এখানে ক্লিক করুন</Link>
              {' '}(লগইন ছাড়াই)
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              নতুন শিক্ষার্থী?{' '}
              <Link href="/register" className="text-purple-600 font-semibold hover:underline">রেজিস্ট্রেশন করুন</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-purple-300 text-xs mt-6">
          {COLLEGE_INFO.board} | {COLLEGE_INFO.eiin}
        </p>
      </div>
    </div>
  );
}
