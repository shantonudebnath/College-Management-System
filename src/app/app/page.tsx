'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { COLLEGE_INFO } from '@/lib/data';

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setProgress(p => Math.min(p + 1.8, 100)), 50);
    const t = setTimeout(() => router.push('/login'), 2800);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}
    >
      {/* dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      {/* glow orbs */}
      <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)', top: '5%', left: '-15%' }} />
      <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-15"
        style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)', bottom: '10%', right: '-10%' }} />

      {/* content */}
      <div className="relative z-10 flex flex-col items-center px-8">
        {/* logo with glow ring */}
        <div className="relative mb-9">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-50 scale-[1.7]"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
          />
          <div className="relative w-36 h-36 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center p-4">
            <Image src="/logo.png" alt="Logo" width={104} height={104} className="object-contain" priority />
          </div>
          {/* ring pulse */}
          <div
            className="absolute inset-0 rounded-[2.5rem] border-2 border-purple-400/40 animate-ping"
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* name */}
        <h1 className="text-white text-[1.4rem] font-bold text-center leading-snug mb-2">
          {COLLEGE_INFO.nameBn}
        </h1>
        <p className="text-purple-300 text-sm text-center mb-1">{COLLEGE_INFO.name}</p>

        {/* divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/50" />
          <span className="text-purple-400/80 text-xs font-mono tracking-widest">EIIN · {COLLEGE_INFO.eiin}</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500/50" />
        </div>

        {/* progress bar */}
        <div className="w-56 h-[3px] bg-white/10 rounded-full overflow-hidden mt-3">
          <div
            className="h-full rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #a78bfa, #818cf8, #6366f1)' }}
          />
        </div>
        <p className="text-purple-500/60 text-[11px] mt-3 tracking-wide">লোড হচ্ছে...</p>
      </div>

      {/* Fivolix */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/20 text-[9px] uppercase tracking-[0.25em] mb-1.5">Powered by</p>
        <a href="https://fivolix.tech" target="_blank" rel="noopener noreferrer"
          className="text-white/40 font-black text-sm tracking-[0.15em] hover:text-white/70 transition-colors">
          FIVOLIX
        </a>
      </div>
    </div>
  );
}
