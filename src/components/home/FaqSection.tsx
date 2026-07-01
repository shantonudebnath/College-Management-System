'use client';
import { useEffect, useState } from 'react';
import { loadWebsiteContent, DEFAULT_CONTENT, type FaqItem } from '@/lib/website-content';
import { HelpCircle, ChevronDown, Plus, Minus } from 'lucide-react';

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_CONTENT.faq);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    loadWebsiteContent().then(c => setFaqs(c.faq));
  }, []);

  return (
    <section className="py-16 bg-[#f8faf8]">
      <div className="max-w-3xl mx-auto px-6">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#e8f5ee] text-[#006633] px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-[#006633]/20">
            <HelpCircle size={13} /> সাধারণ প্রশ্ন
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-950">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
          <p className="text-gray-500 text-sm mt-2">অভিভাবক ও শিক্ষার্থীদের সাধারণ প্রশ্নের উত্তর</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === faq.id;
            return (
              <div key={faq.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? 'border-[#006633]/30 shadow-md' : 'border-gray-100 shadow-sm'}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black transition-colors ${isOpen ? 'bg-[#006633] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {i + 1}
                    </span>
                    <span className="font-semibold text-gray-900 text-sm pr-4 text-left">{faq.question}</span>
                  </div>
                  {isOpen
                    ? <Minus size={15} className="text-[#006633] shrink-0" />
                    : <Plus size={15} className="text-gray-400 shrink-0" />
                  }
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1">
                    <div className="ml-9 border-l-2 border-[#006633]/20 pl-4">
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
