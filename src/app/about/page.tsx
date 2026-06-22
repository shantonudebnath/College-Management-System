'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { COLLEGE_INFO, MADRASHA_CLASSES } from '@/lib/data';
import { loadWebsiteContent, DEFAULT_ABOUT, type AboutPageContent } from '@/lib/website-content';
import {
  MapPin, Phone, Mail, Globe, CheckCircle, Users, Building2,
  BookOpen, Award, Landmark, GraduationCap, FileText, Map,
  Banknote, Layers, Shield, MessageSquare,
} from 'lucide-react';

function SectionHeader({ id, icon: Icon, title, subtitle }: { id: string; icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div id={id} className="scroll-mt-24 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-[#e8f5ee] rounded-xl flex items-center justify-center shrink-0">
          <Icon size={18} className="text-[#006633]" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-500 text-sm ml-12">{subtitle}</p>}
      <div className="ml-12 mt-2 w-12 h-[3px] bg-[#006633] rounded-full" />
    </div>
  );
}

function InfoCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function PreText({ text }: { text: string }) {
  return (
    <p className="text-gray-600 text-sm leading-[1.9] whitespace-pre-line">{text}</p>
  );
}

export default function AboutPage() {
  const [about, setAbout] = useState<AboutPageContent>(DEFAULT_ABOUT);

  useEffect(() => {
    setAbout(loadWebsiteContent().aboutPage);
  }, []);

  const LEVEL_COLORS: Record<string, string> = {
    ebtedayi: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'junior-dakhil': 'bg-blue-50 text-blue-700 border-blue-200',
    dakhil: 'bg-purple-50 text-purple-700 border-purple-200',
    alim: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  const LEVEL_LABELS: Record<string, string> = {
    ebtedayi: 'ইবতেদায়ী',
    'junior-dakhil': 'জুনিয়র দাখিল',
    dakhil: 'দাখিল',
    alim: 'আলিম',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f5f7f5]">

        {/* Hero */}
        <section className="bg-[#006633] text-white py-14 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-xs font-medium mb-5">
              <Shield size={12} /> EIIN: {COLLEGE_INFO.eiin} | স্থাপিত: {COLLEGE_INFO.established}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3">{COLLEGE_INFO.nameBn}</h1>
            <p className="text-white/70 text-sm">{COLLEGE_INFO.board} অনুমোদিত</p>
          </div>
        </section>

        {/* Quick nav */}
        <div className="bg-white border-b border-gray-100 sticky top-[4.25rem] z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 overflow-x-auto">
            <div className="flex gap-1 py-2 min-w-max">
              {[
                ['about', 'পরিচিতি'],
                ['governing-body', 'পর্ষদ'],
                ['recognition', 'স্বীকৃতি'],
                ['mpo', 'এমপিও'],
                ['land', 'ভূমি'],
                ['building', 'ভবন'],
                ['campus-map', 'ম্যাপ'],
                ['classes', 'শ্রেণি'],
                ['exam-schedule', 'পরীক্ষা'],
                ['syllabus', 'সিলেবাস'],
                ['scholarship', 'বৃত্তি'],
                ['contact', 'যোগাযোগ'],
              ].map(([id, label]) => (
                <a key={id} href={`#${id}`}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#006633] hover:bg-green-50 rounded-lg transition-colors whitespace-nowrap">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

          {/* প্রতিষ্ঠান পরিচিতি */}
          <section>
            <SectionHeader id="about" icon={Landmark} title="প্রতিষ্ঠান পরিচিতি" subtitle="আমাদের সম্পর্কে বিস্তারিত" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <InfoCard className="lg:col-span-2">
                <PreText text={about.introText} />
              </InfoCard>
              <div className="space-y-4">
                {[
                  { label: 'প্রতিষ্ঠার বছর', value: COLLEGE_INFO.established.toString() },
                  { label: 'EIIN নম্বর', value: COLLEGE_INFO.eiin },
                  { label: 'শিক্ষা বোর্ড', value: 'BMEB' },
                  { label: 'ক্যাম্পাস', value: 'পাকুন্দিয়া, কিশোরগঞ্জ' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-1">{label}</p>
                    <p className="text-sm font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* অধ্যক্ষের বার্তা */}
          <section id="principal" className="scroll-mt-24">
            <SectionHeader id="principal-header" icon={MessageSquare} title="অধ্যক্ষের বার্তা" />
            <InfoCard>
              <div className="flex gap-5 items-start">
                <div className="shrink-0 w-20 h-20 rounded-2xl bg-[#e8f5ee] flex items-center justify-center border-2 border-[#006633]/20">
                  <GraduationCap size={32} className="text-[#006633]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-base">{about.principalName}</p>
                  <p className="text-xs text-[#006633] font-semibold mb-4">অধ্যক্ষ, {COLLEGE_INFO.nameBn}</p>
                  <div className="border-l-4 border-[#006633]/30 pl-4">
                    <PreText text={about.principalMessage} />
                  </div>
                </div>
              </div>
            </InfoCard>
          </section>

          {/* পরিচালনা পর্ষদ */}
          <section>
            <SectionHeader id="governing-body" icon={Users} title="পরিচালনা পর্ষদ" subtitle="প্রতিষ্ঠানের পরিচালনা কমিটির সদস্যবৃন্দ" />
            <InfoCard>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wide w-10">#</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wide">পদবি</th>
                      <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wide">নাম</th>
                    </tr>
                  </thead>
                  <tbody>
                    {about.governingBody.map((m, i) => (
                      <tr key={i} className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors`}>
                        <td className="py-3 px-3 text-gray-400 text-xs">{i + 1}</td>
                        <td className="py-3 px-3">
                          <span className="inline-block bg-[#e8f5ee] text-[#006633] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            {m.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-gray-800">{m.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>
          </section>

          {/* অনুমতি ও স্বীকৃতি */}
          <section>
            <SectionHeader id="recognition" icon={Shield} title="অনুমতি ও স্বীকৃতি" subtitle="প্রতিষ্ঠানের সরকারি স্বীকৃতি ও অনুমোদন" />
            <InfoCard>
              <PreText text={about.recognitionText} />
            </InfoCard>
          </section>

          {/* এমপিও তথ্য */}
          <section>
            <SectionHeader id="mpo" icon={Banknote} title="এমপিও তথ্য" subtitle="Monthly Pay Order সংক্রান্ত তথ্য" />
            <InfoCard>
              <PreText text={about.mpoText} />
            </InfoCard>
          </section>

          {/* ভূমি তথ্য */}
          <section>
            <SectionHeader id="land" icon={Map} title="ভূমি তথ্য" subtitle="প্রতিষ্ঠানের জমির বিবরণ" />
            <InfoCard>
              <PreText text={about.landText} />
            </InfoCard>
          </section>

          {/* ভবন ও কক্ষ সংখ্যা */}
          <section>
            <SectionHeader id="building" icon={Building2} title="ভবন ও কক্ষ সংখ্যা" subtitle="অবকাঠামো ও ভবনের বিবরণ" />
            <InfoCard>
              <PreText text={about.buildingText} />
            </InfoCard>
          </section>

          {/* ক্যাম্পাস ম্যাপ */}
          <section>
            <SectionHeader id="campus-map" icon={MapPin} title="ক্যাম্পাস ম্যাপ" subtitle="প্রতিষ্ঠানের অবস্থান" />
            <InfoCard className="p-0 overflow-hidden">
              {about.campusMapUrl ? (
                <iframe
                  src={about.campusMapUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2 opacity-40" />
                    <p>ম্যাপ URL সেট করা হয়নি</p>
                  </div>
                </div>
              )}
              <div className="p-4 bg-[#e8f5ee]/40 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin size={14} className="text-[#006633]" />
                  {COLLEGE_INFO.address}
                </p>
              </div>
            </InfoCard>
          </section>

          {/* শ্রেণি তালিকা */}
          <section>
            <SectionHeader id="classes" icon={Layers} title="শ্রেণি তালিকা" subtitle="প্রতিষ্ঠানে বিদ্যমান সকল শ্রেণি" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {MADRASHA_CLASSES.map(cls => (
                <div key={cls.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:border-[#006633]/30 hover:shadow-md transition-all">
                  <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${LEVEL_COLORS[cls.level] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {LEVEL_LABELS[cls.level] ?? cls.level}
                  </div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{cls.nameBn}</p>
                </div>
              ))}
            </div>
          </section>

          {/* পরীক্ষার সময়সূচী */}
          <section>
            <SectionHeader id="exam-schedule" icon={FileText} title="পরীক্ষার সময়সূচী" subtitle="বার্ষিক পরীক্ষার সময়সূচি ও রুটিন" />
            <InfoCard>
              <PreText text={about.examScheduleText} />
            </InfoCard>
          </section>

          {/* সিলেবাস */}
          <section>
            <SectionHeader id="syllabus" icon={BookOpen} title="সিলেবাস" subtitle="পাঠ্যক্রম ও বিষয়সমূহ" />
            <InfoCard>
              <PreText text={about.syllabusText} />
            </InfoCard>
          </section>

          {/* বৃত্তি ও সুবিধা */}
          <section>
            <SectionHeader id="scholarship" icon={Award} title="বৃত্তি ও সুবিধা" subtitle="মেধাবী ও দরিদ্র শিক্ষার্থীদের জন্য সুযোগ-সুবিধা" />
            <InfoCard>
              <PreText text={about.scholarshipText} />
            </InfoCard>
          </section>

          {/* যোগাযোগ */}
          <section>
            <SectionHeader id="contact" icon={Phone} title="যোগাযোগ" subtitle="আমাদের সাথে যোগাযোগ করুন" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: MapPin, label: 'ঠিকানা', value: COLLEGE_INFO.address, color: 'bg-[#e8f5ee] text-[#006633]' },
                { icon: Phone, label: 'ফোন', value: COLLEGE_INFO.phone, color: 'bg-blue-50 text-blue-600' },
                { icon: Mail, label: 'ইমেইল', value: COLLEGE_INFO.email, color: 'bg-orange-50 text-orange-600' },
                { icon: Globe, label: 'ওয়েবসাইট', value: COLLEGE_INFO.website, color: 'bg-purple-50 text-purple-600' },
              ].map(({ icon: Icon, label, value, color }) => (
                <InfoCard key={label} className="text-center p-5">
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </InfoCard>
              ))}
            </div>

            <InfoCard className="mt-4 p-4 bg-[#006633] text-white border-0">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-sm mb-0.5">অফিস সময়</p>
                  <p className="text-white/70 text-xs">রবিবার – বৃহস্পতিবার: সকাল ৯:০০টা – বিকেল ৪:০০টা</p>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <CheckCircle size={14} className="text-green-300" />
                  শুক্র ও শনিবার বন্ধ
                </div>
              </div>
            </InfoCard>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
