'use client';
import { useEffect, useState } from 'react';
import { useNotices } from '@/context/NoticesContext';
import { loadWebsiteContent } from '@/lib/website-content';
import { AlertCircle } from 'lucide-react';

export default function NoticeTicker() {
  const { notices } = useNotices();
  const [extraTicker, setExtraTicker] = useState<string[]>([]);

  useEffect(() => {
    loadWebsiteContent().then(c => setExtraTicker(c.noticeTicker.map(n => n.text)));
  }, []);

  const urgent = notices.filter(n => n.isImportant).map(n => n.title);
  const allItems = [...extraTicker, ...urgent];

  if (allItems.length === 0) return null;

  return (
    <div className="bg-[#fff8f0] border-b border-[#006633]/20 py-2 overflow-hidden">
      <div className="flex items-center max-w-full">
        <div className="bg-[#c8102e] text-white text-xs font-bold px-4 py-1 flex items-center gap-2 shrink-0 z-10">
          <AlertCircle size={13} />
          <span>নোটিশ</span>
        </div>
        <div className="overflow-hidden flex-1 relative">
          <div className="notice-marquee inline-block text-xs text-gray-700 font-medium whitespace-nowrap">
            {allItems.map((text, i) => (
              <span key={i} className="mx-8">🔔 {text}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
