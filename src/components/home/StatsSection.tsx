'use client';
import { useEffect, useState } from 'react';
import { loadWebsiteContent, DEFAULT_CONTENT } from '@/lib/website-content';
import { Users, BookOpen, Award, Calendar, GraduationCap, MapPin, Star } from 'lucide-react';
import type { ElementType } from 'react';

function getIcon(label: string): ElementType {
  if (label.includes('শিক্ষার্থী')) return Users;
  if (label.includes('শিক্ষক') || label.includes('অভিজ্ঞ')) return GraduationCap;
  if (label.includes('বছর')) return Calendar;
  if (label.includes('পাশ') || label.includes('হার')) return Award;
  if (label.includes('শ্রেণি') || label.includes('স্তর')) return BookOpen;
  if (label.includes('EIIN') || label.includes('eiin')) return MapPin;
  return Star;
}

export default function StatsSection() {
  const [stats, setStats] = useState(DEFAULT_CONTENT.stats);

  useEffect(() => {
    setStats(loadWebsiteContent().stats);
  }, []);

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-gray-100">
          {stats.map(({ value, label }) => {
            const Icon = getIcon(label);
            return (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-2.5 px-4 py-10 text-center hover:bg-green-50/60 transition-colors"
              >
                <Icon size={22} className="text-[#006633]" />
                <p className="text-3xl md:text-4xl font-black text-[#004d26] tracking-tight leading-none">{value}</p>
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
