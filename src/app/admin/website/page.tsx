'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { loadWebsiteContent, saveWebsiteContent, DEFAULT_CONTENT, type WebsiteContent, type GalleryItem, type FaqItem, type LinkItem, type NoticeTickerItem } from '@/lib/website-content';
import { Save, Plus, Trash2, Globe, Image as ImageIcon, HelpCircle, Link2, Bell, BarChart2, CheckCircle, SlidersHorizontal } from 'lucide-react';
import type { SlideItem } from '@/lib/website-content';

type Tab = 'hero' | 'slides' | 'stats' | 'gallery' | 'faq' | 'links' | 'ticker';

export default function WebsiteSettingsPage() {
  const [content, setContent] = useState<WebsiteContent>(DEFAULT_CONTENT);
  const [tab, setTab] = useState<Tab>('hero');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setContent(loadWebsiteContent()); }, []);

  const handleSave = () => {
    saveWebsiteContent(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = <K extends keyof WebsiteContent>(k: K, v: WebsiteContent[K]) =>
    setContent(p => ({ ...p, [k]: v }));

  const updateSlide = (i: number, patch: Partial<SlideItem>) =>
    set('slides', content.slides.map((s, j) => j === i ? { ...s, ...patch } : s));

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'hero', label: 'হিরো সেকশন', icon: Globe },
    { id: 'slides', label: 'স্লাইডশো', icon: SlidersHorizontal },
    { id: 'stats', label: 'পরিসংখ্যান', icon: BarChart2 },
    { id: 'gallery', label: 'গ্যালারি', icon: ImageIcon },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'links', label: 'গুরুত্বপূর্ণ লিঙ্ক', icon: Link2 },
    { id: 'ticker', label: 'নোটিশ টিকার', icon: Bell },
  ];

  return (
    <div>
      <DashboardHeader title="ওয়েবসাইট সেটিংস" subtitle="হোম পেজের কন্টেন্ট পরিবর্তন করুন" userName="Admin" role="অ্যাডমিন" />
      <div className="p-6 space-y-5">

        {/* Tab bar + Save */}
        <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t.id ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                <t.icon size={13} />{t.label}
              </button>
            ))}
          </div>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${saved ? 'bg-green-100 text-green-700' : 'btn-primary'}`}>
            {saved ? <><CheckCircle size={14} /> সংরক্ষিত!</> : <><Save size={14} /> সংরক্ষণ করুন</>}
          </button>
        </div>

        {/* Hero tab */}
        {tab === 'hero' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900">হিরো সেকশন</h3>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">সাবটাইটেল / বিবরণ</label>
              <textarea value={content.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} rows={3}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 resize-none" />
            </div>
          </div>
        )}

        {/* Slides tab */}
        {tab === 'slides' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">হোম পেজের স্লাইডশো স্লাইডগুলো এখানে সম্পাদনা করুন।</p>
              <button onClick={() => set('slides', [...content.slides, {
                id: `s${Date.now()}`, tag: '', headline: '', sub: '', photo: '',
                cta1Label: 'আরও জানুন', cta1Href: '/about',
                cta2Label: 'যোগাযোগ', cta2Href: '/about#contact',
              }])}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-100">
                <Plus size={13} /> স্লাইড যোগ করুন
              </button>
            </div>

            {content.slides.map((slide, i) => (
              <div key={slide.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">স্লাইড {i + 1}</span>
                  <button onClick={() => set('slides', content.slides.filter((_, j) => j !== i))}
                    className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-100">
                    <Trash2 size={12} /> মুছে ফেলুন
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">ট্যাগ (ছোট শিরোনাম)</label>
                    <input value={slide.tag} onChange={e => updateSlide(i, { tag: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                      placeholder="যেমন: ভর্তি চলছে — ২০২৬" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">ছবির URL (photo)</label>
                    <input value={slide.photo} onChange={e => updateSlide(i, { photo: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                      placeholder="/hero-1.jpg বা https://..." />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">মূল শিরোনাম</label>
                  <input value={slide.headline} onChange={e => updateSlide(i, { headline: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-purple-400"
                    placeholder="বড় শিরোনাম লিখুন" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">বিবরণ</label>
                  <textarea value={slide.sub} onChange={e => updateSlide(i, { sub: e.target.value })} rows={2}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 resize-none"
                    placeholder="সংক্ষিপ্ত বিবরণ" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">বোতাম ১ — লেখা</label>
                    <input value={slide.cta1Label} onChange={e => updateSlide(i, { cta1Label: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                      placeholder="ভর্তি আবেদন করুন" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">বোতাম ১ — লিঙ্ক</label>
                    <input value={slide.cta1Href} onChange={e => updateSlide(i, { cta1Href: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                      placeholder="/admission" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">বোতাম ২ — লেখা</label>
                    <input value={slide.cta2Label} onChange={e => updateSlide(i, { cta2Label: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                      placeholder="আরও জানুন" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">বোতাম ২ — লিঙ্ক</label>
                    <input value={slide.cta2Href} onChange={e => updateSlide(i, { cta2Href: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                      placeholder="/about" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats tab */}
        {tab === 'stats' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900">পরিসংখ্যান</h3>
            {content.stats.map((s, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input value={s.label} onChange={e => set('stats', content.stats.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                  placeholder="লেবেল" />
                <input value={s.value} onChange={e => set('stats', content.stats.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                  className="w-28 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                  placeholder="মান" />
              </div>
            ))}
          </div>
        )}

        {/* Gallery tab */}
        {tab === 'gallery' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">গ্যালারি ছবি</h3>
              <button onClick={() => set('gallery', [...content.gallery, { id: `g${Date.now()}`, url: '', caption: '' }])}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-100">
                <Plus size={13} /> ছবি যোগ করুন
              </button>
            </div>
            {content.gallery.map((g, i) => (
              <div key={g.id} className="flex gap-3 items-center">
                <input value={g.url} onChange={e => set('gallery', content.gallery.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                  placeholder="ছবির URL (https://...)" />
                <input value={g.caption} onChange={e => set('gallery', content.gallery.map((x, j) => j === i ? { ...x, caption: e.target.value } : x))}
                  className="w-40 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                  placeholder="ক্যাপশন" />
                <button onClick={() => set('gallery', content.gallery.filter((_, j) => j !== i))}
                  className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {/* FAQ tab */}
        {tab === 'faq' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">সাধারণ প্রশ্ন (FAQ)</h3>
              <button onClick={() => set('faq', [...content.faq, { id: `f${Date.now()}`, question: '', answer: '' }])}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-100">
                <Plus size={13} /> প্রশ্ন যোগ করুন
              </button>
            </div>
            {content.faq.map((f, i) => (
              <div key={f.id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <input value={f.question} onChange={e => set('faq', content.faq.map((x, j) => j === i ? { ...x, question: e.target.value } : x))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 font-semibold"
                      placeholder="প্রশ্ন লিখুন" />
                    <textarea value={f.answer} onChange={e => set('faq', content.faq.map((x, j) => j === i ? { ...x, answer: e.target.value } : x))} rows={2}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 resize-none"
                      placeholder="উত্তর লিখুন" />
                  </div>
                  <button onClick={() => set('faq', content.faq.filter((_, j) => j !== i))}
                    className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 mt-1"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Links tab */}
        {tab === 'links' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">গুরুত্বপূর্ণ লিঙ্ক</h3>
              <button onClick={() => set('importantLinks', [...content.importantLinks, { id: `l${Date.now()}`, label: '', url: '', icon: '🔗' }])}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-100">
                <Plus size={13} /> লিঙ্ক যোগ করুন
              </button>
            </div>
            {content.importantLinks.map((l, i) => (
              <div key={l.id} className="flex gap-2 items-center">
                <input value={l.icon ?? '🔗'} onChange={e => set('importantLinks', content.importantLinks.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))}
                  className="w-14 px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center outline-none" placeholder="🔗" />
                <input value={l.label} onChange={e => set('importantLinks', content.importantLinks.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                  placeholder="লিঙ্কের নাম" />
                <input value={l.url} onChange={e => set('importantLinks', content.importantLinks.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                  placeholder="https://..." />
                <button onClick={() => set('importantLinks', content.importantLinks.filter((_, j) => j !== i))}
                  className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Ticker tab */}
        {tab === 'ticker' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">নোটিশ টিকার</h3>
              <button onClick={() => set('noticeTicker', [...content.noticeTicker, { id: `n${Date.now()}`, text: '' }])}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-100">
                <Plus size={13} /> নোটিশ যোগ করুন
              </button>
            </div>
            {content.noticeTicker.map((n, i) => (
              <div key={n.id} className="flex gap-2 items-center">
                <input value={n.text} onChange={e => set('noticeTicker', content.noticeTicker.map((x, j) => j === i ? { ...x, text: e.target.value } : x))}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                  placeholder="নোটিশের বিষয়বস্তু" />
                <button onClick={() => set('noticeTicker', content.noticeTicker.filter((_, j) => j !== i))}
                  className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
