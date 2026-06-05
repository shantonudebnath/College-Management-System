import Link from 'next/link';
import { GraduationCap, ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <GraduationCap size={36} className="text-white" />
        </div>

        <div className="text-8xl font-black text-white/20 leading-none mb-2">৪০৪</div>
        <h1 className="text-2xl font-bold text-white mb-2">পাতাটি পাওয়া যায়নি</h1>
        <p className="text-purple-200 text-sm mb-8 leading-relaxed">
          আপনি যে পাতাটি খুঁজছেন সেটি সরানো হয়েছে, বা কখনো ছিল না। নিচের লিঙ্কগুলো ব্যবহার করে ফিরে যান।
        </p>

        <div className="glass rounded-2xl p-6 space-y-3">
          <Link href="/"
            className="flex items-center gap-3 w-full bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors justify-center">
            <Home size={16} /> হোম পেজে ফিরুন
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/result"
              className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 transition-colors justify-center">
              <Search size={14} /> ফলাফল দেখুন
            </Link>
            <Link href="/login"
              className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 transition-colors justify-center">
              <ArrowLeft size={14} /> লগইন করুন
            </Link>
          </div>
        </div>

        <p className="text-purple-300 text-xs mt-6">নূরে ইসলাম মাদ্রাসা | {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
