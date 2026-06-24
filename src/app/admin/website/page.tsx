'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  loadWebsiteContent, saveWebsiteContent, DEFAULT_CONTENT, DEFAULT_ABOUT,
  type WebsiteContent, type GalleryItem, type FaqItem, type LinkItem, type SlideItem, type GoverningMember, type StaffMember, type FounderMember,
} from '@/lib/website-content';
import { Save, Plus, Trash2, Globe, Image as ImageIcon, HelpCircle, Link2, BarChart2, CheckCircle, SlidersHorizontal, Landmark, Users } from 'lucide-react';

type Tab = 'hero' | 'slides' | 'stats' | 'gallery' | 'faq' | 'links' | 'about' | 'teachers';

const inp = 'w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400';
const ta = `${inp} resize-none`;

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

  const setAbout = <K extends keyof WebsiteContent['aboutPage']>(k: K, v: WebsiteContent['aboutPage'][K]) =>
    setContent(p => ({ ...p, aboutPage: { ...p.aboutPage, [k]: v } }));

  const updateSlide = (i: number, patch: Partial<SlideItem>) =>
    set('slides', content.slides.map((s, j) => j === i ? { ...s, ...patch } : s));

  const updateMember = (i: number, patch: Partial<GoverningMember>) =>
    setAbout('governingBody', content.aboutPage.governingBody.map((m, j) => j === i ? { ...m, ...patch } : m));

  const updateStaff = (i: number, patch: Partial<StaffMember>) =>
    setAbout('staffList', content.aboutPage.staffList.map((s, j) => j === i ? { ...s, ...patch } : s));

  const updateFounder = (i: number, patch: Partial<FounderMember>) =>
    setAbout('foundersList', content.aboutPage.foundersList.map((f, j) => j === i ? { ...f, ...patch } : f));

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'hero', label: 'হিরো সেকশন', icon: Globe },
    { id: 'slides', label: 'স্লাইডশো', icon: SlidersHorizontal },
    { id: 'stats', label: 'পরিসংখ্যান', icon: BarChart2 },
    { id: 'gallery', label: 'গ্যালারি', icon: ImageIcon },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'links', label: 'গুরুত্বপূর্ণ লিঙ্ক', icon: Link2 },
    { id: 'about', label: 'প্রতিষ্ঠান তথ্য', icon: Landmark },
    { id: 'teachers', label: 'শিক্ষক তথ্য', icon: Users },
  ];

  return (
    <div>
      <DashboardHeader title="ওয়েবসাইট সেটিংস" subtitle="হোম পেজ ও প্রতিষ্ঠান পেজের কন্টেন্ট পরিবর্তন করুন" userName="Admin" role="অ্যাডমিন" />
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
              <textarea value={content.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} rows={3} className={ta} />
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
                    <Trash2 size={12} /> মুছুন
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">ট্যাগ (ছোট শিরোনাম)</label>
                    <input value={slide.tag} onChange={e => updateSlide(i, { tag: e.target.value })} className={inp} placeholder="যেমন: ভর্তি চলছে — ২০২৬" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">ছবির URL</label>
                    <input value={slide.photo} onChange={e => updateSlide(i, { photo: e.target.value })} className={inp} placeholder="/hero-1.jpg বা https://..." />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">মূল শিরোনাম</label>
                  <input value={slide.headline} onChange={e => updateSlide(i, { headline: e.target.value })} className={inp} placeholder="বড় শিরোনাম" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">বিবরণ</label>
                  <textarea value={slide.sub} onChange={e => updateSlide(i, { sub: e.target.value })} rows={2} className={ta} placeholder="সংক্ষিপ্ত বিবরণ" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">বোতাম ১ — লেখা</label>
                    <input value={slide.cta1Label} onChange={e => updateSlide(i, { cta1Label: e.target.value })} className={inp} placeholder="ভর্তি আবেদন করুন" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">বোতাম ১ — লিঙ্ক</label>
                    <input value={slide.cta1Href} onChange={e => updateSlide(i, { cta1Href: e.target.value })} className={inp} placeholder="/admission" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">বোতাম ২ — লেখা</label>
                    <input value={slide.cta2Label} onChange={e => updateSlide(i, { cta2Label: e.target.value })} className={inp} placeholder="আরও জানুন" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">বোতাম ২ — লিঙ্ক</label>
                    <input value={slide.cta2Href} onChange={e => updateSlide(i, { cta2Href: e.target.value })} className={inp} placeholder="/about" />
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
                  className={`flex-1 ${inp}`} placeholder="লেবেল" />
                <input value={s.value} onChange={e => set('stats', content.stats.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                  className="w-28 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400" placeholder="মান" />
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
              <div key={g.id} className="border border-gray-100 rounded-xl p-3 space-y-2">
                <div className="flex gap-3 items-center">
                  {g.url ? (
                    <img src={g.url} alt={g.caption} className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      <ImageIcon size={20} className="text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input value={g.url} onChange={e => set('gallery', content.gallery.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                      className={inp} placeholder="ছবির URL (https://...)" />
                    <input value={g.caption} onChange={e => set('gallery', content.gallery.map((x, j) => j === i ? { ...x, caption: e.target.value } : x))}
                      className={inp} placeholder="ক্যাপশন" />
                  </div>
                  <button onClick={() => set('gallery', content.gallery.filter((_, j) => j !== i))}
                    className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 self-start"><Trash2 size={14} /></button>
                </div>
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
                      className={inp} placeholder="প্রশ্ন লিখুন" />
                    <textarea value={f.answer} onChange={e => set('faq', content.faq.map((x, j) => j === i ? { ...x, answer: e.target.value } : x))} rows={2}
                      className={ta} placeholder="উত্তর লিখুন" />
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
                  className={`flex-1 ${inp}`} placeholder="লিঙ্কের নাম" />
                <input value={l.url} onChange={e => set('importantLinks', content.importantLinks.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                  className={`flex-1 ${inp}`} placeholder="https://..." />
                <button onClick={() => set('importantLinks', content.importantLinks.filter((_, j) => j !== i))}
                  className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {/* About page tab */}
        {tab === 'about' && (
          <div className="space-y-5">

            {/* প্রতিষ্ঠান পরিচিতি */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">প্রতিষ্ঠান পরিচিতি</h3>
              <textarea value={content.aboutPage.introText}
                onChange={e => setAbout('introText', e.target.value)} rows={4} className={ta}
                placeholder="প্রতিষ্ঠানের সংক্ষিপ্ত পরিচিতি" />
            </div>

            {/* অধ্যক্ষের বার্তা */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">অধ্যক্ষের বার্তা</h3>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">অধ্যক্ষের নাম</label>
                <input value={content.aboutPage.principalName}
                  onChange={e => setAbout('principalName', e.target.value)} className={inp} placeholder="অধ্যক্ষের পুরো নাম" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">বার্তা</label>
                <textarea value={content.aboutPage.principalMessage}
                  onChange={e => setAbout('principalMessage', e.target.value)} rows={8} className={ta}
                  placeholder="অধ্যক্ষের বার্তা লিখুন..." />
              </div>
            </div>

            {/* পরিচালনা পর্ষদ */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm">পরিচালনা পর্ষদ</h3>
                <button onClick={() => setAbout('governingBody', [...content.aboutPage.governingBody, { name: '', role: '' }])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-100">
                  <Plus size={13} /> সদস্য যোগ করুন
                </button>
              </div>
              {content.aboutPage.governingBody.map((m, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2">
                  <div className="flex gap-2 items-center">
                    <input value={m.role} onChange={e => updateMember(i, { role: e.target.value })}
                      className="w-48 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400"
                      placeholder="পদবি (যেমন: সভাপতি)" />
                    <input value={m.name} onChange={e => updateMember(i, { name: e.target.value })}
                      className={`flex-1 ${inp}`} placeholder="পুরো নাম" />
                    <button onClick={() => setAbout('governingBody', content.aboutPage.governingBody.filter((_, j) => j !== i))}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
                  </div>
                  <input value={m.photo ?? ''} onChange={e => updateMember(i, { photo: e.target.value })}
                    className={inp} placeholder="ছবির URL (https://... অথবা ফাঁকা রাখুন — তাহলে নামের আদ্যক্ষর দেখাবে)" />
                </div>
              ))}
            </div>

            {/* অনুমতি ও স্বীকৃতি */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">অনুমতি ও স্বীকৃতি</h3>
              <textarea value={content.aboutPage.recognitionText}
                onChange={e => setAbout('recognitionText', e.target.value)} rows={6} className={ta} />
            </div>

            {/* এমপিও তথ্য */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">এমপিও তথ্য</h3>
              <textarea value={content.aboutPage.mpoText}
                onChange={e => setAbout('mpoText', e.target.value)} rows={6} className={ta} />
            </div>

            {/* ভূমি তথ্য */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">ভূমি তথ্য</h3>
              <textarea value={content.aboutPage.landText}
                onChange={e => setAbout('landText', e.target.value)} rows={6} className={ta} />
            </div>

            {/* ভবন ও কক্ষ সংখ্যা */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">ভবন ও কক্ষ সংখ্যা</h3>
              <textarea value={content.aboutPage.buildingText}
                onChange={e => setAbout('buildingText', e.target.value)} rows={6} className={ta} />
            </div>

            {/* ক্যাম্পাস ম্যাপ */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">ক্যাম্পাস ম্যাপ URL</h3>
              <p className="text-xs text-gray-400">Google Maps → Share → Embed → src="..." অংশটুকু কপি করে এখানে দিন</p>
              <textarea value={content.aboutPage.campusMapUrl}
                onChange={e => setAbout('campusMapUrl', e.target.value)} rows={3} className={ta}
                placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>

            {/* পরীক্ষার সময়সূচী */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">পরীক্ষার সময়সূচী</h3>
              <textarea value={content.aboutPage.examScheduleText}
                onChange={e => setAbout('examScheduleText', e.target.value)} rows={8} className={ta} />
            </div>

            {/* সিলেবাস */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">সিলেবাস</h3>
              <textarea value={content.aboutPage.syllabusText}
                onChange={e => setAbout('syllabusText', e.target.value)} rows={8} className={ta} />
            </div>

            {/* বৃত্তি ও সুবিধা */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">বৃত্তি ও সুবিধা</h3>
              <textarea value={content.aboutPage.scholarshipText}
                onChange={e => setAbout('scholarshipText', e.target.value)} rows={8} className={ta} />
            </div>

            {/* বার্ষিক প্রতিবেদন */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">বার্ষিক প্রতিবেদন</h3>
              <textarea value={content.aboutPage.annualReportText ?? ''}
                onChange={e => setAbout('annualReportText', e.target.value)} rows={8} className={ta}
                placeholder="বার্ষিক কার্যক্রম ও ফলাফলের সারসংক্ষেপ" />
            </div>

          </div>
        )}

        {/* Teachers page tab */}
        {tab === 'teachers' && (
          <div className="space-y-5">

            {/* কর্মচারী তালিকা */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm">কর্মচারী তালিকা</h3>
                <button onClick={() => setAbout('staffList', [...content.aboutPage.staffList, { name: '', role: '', phone: '', joinDate: '' }])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-100">
                  <Plus size={13} /> কর্মচারী যোগ করুন
                </button>
              </div>
              {content.aboutPage.staffList.map((s, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2">
                  <div className="flex gap-2 items-center">
                    <input value={s.name} onChange={e => updateStaff(i, { name: e.target.value })}
                      className={`flex-1 ${inp}`} placeholder="নাম" />
                    <button onClick={() => setAbout('staffList', content.aboutPage.staffList.filter((_, j) => j !== i))}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input value={s.role} onChange={e => updateStaff(i, { role: e.target.value })}
                      className={inp} placeholder="পদবি" />
                    <input value={s.phone ?? ''} onChange={e => updateStaff(i, { phone: e.target.value })}
                      className={inp} placeholder="ফোন (ঐচ্ছিক)" />
                    <input value={s.joinDate} onChange={e => updateStaff(i, { joinDate: e.target.value })}
                      className={inp} placeholder="যোগদানের বছর" />
                  </div>
                </div>
              ))}
            </div>

            {/* প্রতিষ্ঠাতা ও দাতা */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm">প্রতিষ্ঠাতা ও দাতা</h3>
                <button onClick={() => setAbout('foundersList', [...content.aboutPage.foundersList, { name: '', role: '', year: '', contribution: '' }])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-100">
                  <Plus size={13} /> সদস্য যোগ করুন
                </button>
              </div>
              {content.aboutPage.foundersList.map((f, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2">
                  <div className="flex gap-2 items-center">
                    <input value={f.name} onChange={e => updateFounder(i, { name: e.target.value })}
                      className={`flex-1 ${inp}`} placeholder="নাম" />
                    <button onClick={() => setAbout('foundersList', content.aboutPage.foundersList.filter((_, j) => j !== i))}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={f.role} onChange={e => updateFounder(i, { role: e.target.value })}
                      className={inp} placeholder="পদবি (যেমন: প্রতিষ্ঠাতা)" />
                    <input value={f.year} onChange={e => updateFounder(i, { year: e.target.value })}
                      className={inp} placeholder="সাল (যেমন: ১৯৫৮)" />
                  </div>
                  <textarea value={f.contribution} onChange={e => updateFounder(i, { contribution: e.target.value })}
                    rows={2} className={ta} placeholder="অবদানের বিবরণ" />
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
