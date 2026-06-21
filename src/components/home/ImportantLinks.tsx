'use client';
import { useEffect, useState } from 'react';
import { loadWebsiteContent, DEFAULT_CONTENT, type LinkItem } from '@/lib/website-content';
import { ExternalLink, Link2 } from 'lucide-react';

export default function ImportantLinks() {
  const [links, setLinks] = useState<LinkItem[]>(DEFAULT_CONTENT.importantLinks);

  useEffect(() => {
    setLinks(loadWebsiteContent().importantLinks);
  }, []);

  return (
    <section className="py-16 bg-[#f8faff]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Link2 size={13} /> গুরুত্বপূর্ণ লিঙ্ক
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">গুরুত্বপূর্ণ সরকারি লিঙ্কসমূহ</h2>
          <p className="text-gray-500 text-sm mt-2">শিক্ষা সংক্রান্ত সরকারি ওয়েবসাইট ও পোর্টাল</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {links.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="text-3xl mb-3">{link.icon ?? '🔗'}</div>
              <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-800 leading-tight">{link.label}</p>
              <ExternalLink size={11} className="text-gray-300 group-hover:text-blue-400 mx-auto mt-2 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
