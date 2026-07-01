'use client';
import { useEffect, useState } from 'react';
import { loadWebsiteContent, DEFAULT_CONTENT } from '@/lib/website-content';
import { Users, GraduationCap, Calendar, Award, BookOpen, Landmark } from 'lucide-react';
import type { ElementType } from 'react';

function getIcon(label: string): ElementType {
  if (label.includes('শিক্ষার্থী')) return Users;
  if (label.includes('শিক্ষক')) return GraduationCap;
  if (label.includes('বছর')) return Calendar;
  if (label.includes('পাশ') || label.includes('হার')) return Award;
  if (label.includes('শ্রেণি')) return BookOpen;
  return Landmark;
}

const ICON_COLORS = [
  'text-emerald-300',
  'text-sky-300',
  'text-amber-300',
  'text-violet-300',
  'text-rose-300',
  'text-cyan-300',
];

export default function StatsSection() {
  const [stats, setStats] = useState(DEFAULT_CONTENT.stats);
  useEffect(() => { loadWebsiteContent().then(c => setStats(c.stats)); }, []);

  return (
    <section className="bg-gradient-to-r from-[#005528] via-[#006633] to-[#004d26] relative overflow-hidden">
      {/* dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-12">
        <div className="flex flex-wrap sm:flex-nowrap sm:divide-x sm:divide-white/10">
          {stats.map(({ value, label }, i) => {
            const Icon = getIcon(label);
            return (
              <div
                key={label}
                className={[
                  'flex flex-col items-center justify-center text-center py-7 px-4 group hover:bg-white/5 transition-colors duration-200 w-1/2 sm:flex-1',
                  i >= 2 ? 'border-t border-white/10 sm:border-t-0' : '',
                  i % 2 === 1 ? 'border-l border-white/10' : '',
                ].filter(Boolean).join(' ')}
              >
                <Icon
                  size={20}
                  className={`${ICON_COLORS[i % ICON_COLORS.length]} mb-2.5 group-hover:scale-110 transition-transform duration-200`}
                />
                <span className="text-3xl md:text-[2.25rem] font-black text-white tracking-tight leading-none">
                  {value}
                </span>
                <span className="text-[11px] text-white/55 mt-1.5 font-medium">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
