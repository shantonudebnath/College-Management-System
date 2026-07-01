'use client';
import { useEffect, useState } from 'react';
import { loadWebsiteContent, DEFAULT_CONTENT } from '@/lib/website-content';
import { Users, BookOpen, Award, Calendar, GraduationCap, Landmark } from 'lucide-react';
import type { ElementType } from 'react';

function getIcon(label: string): ElementType {
  if (label.includes('শিক্ষার্থী')) return Users;
  if (label.includes('শিক্ষক')) return GraduationCap;
  if (label.includes('বছর')) return Calendar;
  if (label.includes('পাশ') || label.includes('হার')) return Award;
  if (label.includes('শ্রেণি')) return BookOpen;
  return Landmark;
}

const PALETTES = [
  { bg: 'bg-emerald-50', text: 'text-emerald-700', num: 'text-emerald-900' },
  { bg: 'bg-blue-50', text: 'text-blue-600', num: 'text-blue-900' },
  { bg: 'bg-amber-50', text: 'text-amber-600', num: 'text-amber-900' },
  { bg: 'bg-violet-50', text: 'text-violet-600', num: 'text-violet-900' },
  { bg: 'bg-rose-50', text: 'text-rose-600', num: 'text-rose-900' },
  { bg: 'bg-cyan-50', text: 'text-cyan-700', num: 'text-cyan-900' },
];

export default function StatsSection() {
  const [stats, setStats] = useState(DEFAULT_CONTENT.stats);
  useEffect(() => { loadWebsiteContent().then(c => setStats(c.stats)); }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {stats.map(({ value, label }, i) => {
            const Icon = getIcon(label);
            const p = PALETTES[i % PALETTES.length];
            return (
              <div key={label} className="flex flex-col items-center text-center group">
                <div className={`w-16 h-16 rounded-2xl ${p.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={26} className={p.text} />
                </div>
                <span className={`text-3xl md:text-4xl font-black tracking-tight leading-none ${p.num}`}>{value}</span>
                <span className="text-xs text-gray-500 mt-2 leading-tight font-medium">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
