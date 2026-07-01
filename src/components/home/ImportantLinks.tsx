'use client';
import { useEffect, useState } from 'react';
import { loadWebsiteContent, DEFAULT_CONTENT, type LinkItem } from '@/lib/website-content';
import { ExternalLink } from 'lucide-react';

export default function ImportantLinks() {
  const [links, setLinks] = useState<LinkItem[]>(DEFAULT_CONTENT.importantLinks);

  useEffect(() => {
    loadWebsiteContent().then(c => setLinks(c.importantLinks));
  }, []);

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-10">
          <p className="text-xs font-bold text-[#006633] uppercase tracking-[0.2em] mb-3">বাহ্যিক সংযোগ</p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-950">গুরুত্বপূর্ণ সরকারি লিঙ্কসমূহ</h2>
          <p className="text-gray-500 text-sm mt-2">শিক্ষা সংক্রান্ত সরকারি ওয়েবসাইট ও পোর্টাল</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {links.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-5 text-center border border-gray-100 hover:border-[#006633]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">{link.icon ?? '🔗'}</div>
              <p className="text-xs font-semibold text-gray-700 group-hover:text-[#006633] leading-tight transition-colors">{link.label}</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-gray-300 group-hover:text-[#006633] transition-colors">
                <ExternalLink size={10} />
                <span className="text-[9px]">ভিজিট করুন</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
