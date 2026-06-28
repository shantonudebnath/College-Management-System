'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { COLLEGE_INFO } from '@/lib/data';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push('/login'), 2600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* animated blobs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 -right-10 w-56 h-56 bg-indigo-400/20 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      {/* content */}
      <div className="relative z-10 flex flex-col items-center gap-7 px-8">
        {/* logo container */}
        <div className="w-36 h-36 rounded-[2.5rem] bg-white/15 backdrop-blur-md border-2 border-white/25 flex items-center justify-center shadow-2xl p-4">
          <Image
            src="/logo.png"
            alt="লোগো"
            width={104}
            height={104}
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>

        {/* name */}
        <div className="text-center">
          <h1 className="text-white text-[1.35rem] font-bold leading-snug">
            {COLLEGE_INFO.nameBn}
          </h1>
          <p className="text-purple-300 text-sm mt-2">{COLLEGE_INFO.name}</p>
          <p className="text-purple-400/80 text-xs mt-1">EIIN: {COLLEGE_INFO.eiin}</p>
        </div>

        {/* loading dots */}
        <div className="flex gap-2 mt-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2.5 h-2.5 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Fivolix credit */}
      <div className="absolute bottom-8 text-center">
        <p className="text-purple-400/70 text-[11px]">
          Developed by{' '}
          <a
            href="https://fivolix.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 font-semibold hover:text-white transition-colors"
          >
            Fivolix
          </a>
        </p>
      </div>
    </div>
  );
}
