'use client';
import { useEffect, useState } from 'react';
import { loadWebsiteContent, DEFAULT_CONTENT, type FaqItem } from '@/lib/website-content';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_CONTENT.faq);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    loadWebsiteContent().then(c => setFaqs(c.faq));
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#e8f5ee] text-[#006633] px-4 py-1.5 rounded-full text-xs font-semibold mb-3 border border-[#006633]/20">
            <HelpCircle size={13} /> সাধারণ প্রশ্ন
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
          <p className="text-gray-500 text-sm mt-2">অভিভাবক ও শিক্ষার্থীদের সাধারণ প্রশ্নের উত্তর</p>
        </div>

        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#e8f5ee]/50 transition-colors">
                <span className="font-semibold text-gray-900 text-sm pr-4">{faq.question}</span>
                <ChevronDown size={16} className={`text-[#006633] shrink-0 transition-transform ${open === faq.id ? 'rotate-180' : ''}`} />
              </button>
              {open === faq.id && (
                <div className="px-5 pb-4 bg-[#e8f5ee]/30">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
