export const WEBSITE_CONTENT_KEY = 'website_content_v1';
export const ADMISSIONS_KEY = 'admissions_v1';

export interface GalleryItem { id: string; url: string; caption: string; }
export interface FaqItem { id: string; question: string; answer: string; }
export interface LinkItem { id: string; label: string; url: string; icon?: string; }
export interface StatItem { label: string; value: string; }
export interface NoticeTickerItem { id: string; text: string; }
export interface SlideItem {
  id: string;
  tag: string;
  headline: string;
  sub: string;
  photo: string;
  cta1Label: string;
  cta1Href: string;
  cta2Label: string;
  cta2Href: string;
}
export interface GoverningMember { name: string; role: string; }

export interface AboutPageContent {
  introText: string;
  governingBody: GoverningMember[];
  recognitionText: string;
  mpoText: string;
  landText: string;
  buildingText: string;
  campusMapUrl: string;
  examScheduleText: string;
  syllabusText: string;
  scholarshipText: string;
  principalName: string;
  principalMessage: string;
}

export interface WebsiteContent {
  heroSubtitle: string;
  stats: StatItem[];
  gallery: GalleryItem[];
  faq: FaqItem[];
  importantLinks: LinkItem[];
  noticeTicker: NoticeTickerItem[];
  slides: SlideItem[];
  aboutPage: AboutPageContent;
}

export const DEFAULT_ABOUT: AboutPageContent = {
  introText: 'এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা ১৯৫৮ সালে কিশোরগঞ্জ জেলার পাকুন্দিয়া উপজেলার এগারসিন্দুরে প্রতিষ্ঠিত হয়। বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড (BMEB) অনুমোদিত এই ঐতিহ্যবাহী প্রতিষ্ঠান ইবতেদায়ী থেকে দাখিল পর্যন্ত মানসম্মত ইসলামি শিক্ষা প্রদান করে আসছে। প্রতিষ্ঠার পর থেকে এ মাদ্রাসা এলাকার শিক্ষা ও সামাজিক উন্নয়নে অগ্রণী ভূমিকা পালন করছে। কুরআন-হাদিসের পাশাপাশি আধুনিক বিজ্ঞান, গণিত ও তথ্যপ্রযুক্তি শিক্ষায় সমান গুরুত্ব দেওয়া হয়।',

  governingBody: [
    { role: 'সভাপতি', name: 'জনাব মো. আবুল কাশেম' },
    { role: 'সহ-সভাপতি', name: 'জনাব মো. রফিকুল ইসলাম' },
    { role: 'সদস্য সচিব / অধ্যক্ষ', name: 'জনাব মো. শফিকুল ইসলাম' },
    { role: 'শিক্ষক প্রতিনিধি (১)', name: 'জনাব মো. আব্দুল আজিজ' },
    { role: 'শিক্ষক প্রতিনিধি (২)', name: 'জনাব মো. হাবিবুর রহমান' },
    { role: 'অভিভাবক প্রতিনিধি (১)', name: 'জনাব মো. হাসানুজ্জামান' },
    { role: 'অভিভাবক প্রতিনিধি (২)', name: 'জনাব মো. নুরুল ইসলাম' },
    { role: 'দাতা সদস্য', name: 'জনাব মো. মোস্তফা কামাল' },
    { role: 'মহিলা সদস্য', name: 'জনাব মোছাঃ নূরজাহান বেগম' },
    { role: 'সরকার মনোনীত সদস্য', name: 'উপজেলা মাধ্যমিক শিক্ষা কর্মকর্তা' },
  ],

  recognitionText: `বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড (BMEB) কর্তৃক অনুমোদিত ও স্বীকৃত।

প্রতিষ্ঠার অনুমতি: ১৯৫৮ সাল
বোর্ড স্বীকৃতি প্রাপ্তি: ১৯৬২ সাল
এমপিও ভুক্তি: ১৯৭৫ সাল
EIIN নম্বর: ১১০৫৯০
প্রতিষ্ঠার ধরন: বেসরকারি (MPO ভুক্ত)

• ইবতেদায়ী স্তর: বাংলাদেশ প্রাথমিক ও গণশিক্ষা মন্ত্রণালয় অনুমোদিত
• দাখিল স্তর: বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত
• আলিম স্তর: বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত`,

  mpoText: `এই প্রতিষ্ঠান বাংলাদেশ সরকারের শিক্ষা মন্ত্রণালয় কর্তৃক MPO (Monthly Pay Order) ভুক্ত। শিক্ষক ও কর্মচারীবৃন্দ সরকারি বেতন স্কেল অনুযায়ী বেতন-ভাতা প্রাপ্ত হন।

MPO কোড: ৩০৫০৭
MPO ভুক্তির তারিখ: ১৯৭৫ সাল

পদের ধরন ও সংখ্যা:
• অধ্যক্ষ: ১ জন
• সহকারী শিক্ষক (ধর্মীয়): ১৮ জন
• সহকারী শিক্ষক (সাধারণ): ১৪ জন
• কর্মচারী: ৮ জন
মোট MPO ভুক্ত: ৪১ জন`,

  landText: `প্রতিষ্ঠানের নিজস্ব জমির বিবরণ:

মোট জমির পরিমাণ: ১.৫ একর (প্রায়)
জমির ধরন: নিজস্ব (দলিলভুক্ত)
খতিয়ান নম্বর: ১২৩৪
দাগ নম্বর: ৫৬৭, ৫৬৮
মৌজা: এগারসিন্দুর
ইউনিয়ন: এগারসিন্দুর
উপজেলা: পাকুন্দিয়া
জেলা: কিশোরগঞ্জ

জমির ব্যবহার:
• একাডেমিক ভবন: ০.৮ একর
• খেলার মাঠ: ০.৪ একর
• বাগান ও অন্যান্য: ০.৩ একর`,

  buildingText: `ভবন ও অবকাঠামো বিবরণ:

একাডেমিক ভবন: ৩টি
• ভবন-১ (পুরাতন): ২ তলা, ৮টি কক্ষ
• ভবন-২ (নতুন): ৩ তলা, ১২টি কক্ষ
• ভবন-৩ (প্রশাসনিক): ১ তলা, ৪টি কক্ষ

মোট শ্রেণিকক্ষ: ২৪টি
অফিস কক্ষ: ৩টি (অধ্যক্ষ, সহকারী, হিসাব)
পাঠাগার: ১টি (প্রায় ৩,০০০ বই)
বিজ্ঞানাগার: ১টি
কম্পিউটার ল্যাব: ১টি (২০টি কম্পিউটার)
মসজিদ: ১টি
টয়লেট ব্লক: ৪টি (ছাত্র ও ছাত্রী পৃথক)
গেস্টরুম: ১টি`,

  campusMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14564.1!2d90.7!3d24.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDA2JzAwLjAiTiA5MMKwNDInMDAuMCJF!5e0!3m2!1sbn!2sbd!4v1700000000000',

  examScheduleText: `প্রতিষ্ঠানে বার্ষিক পরীক্ষার রুটিন:

অভ্যন্তরীণ পরীক্ষা:
• প্রথম সাময়িক পরীক্ষা: ফেব্রুয়ারি-মার্চ
• অর্ধ-বার্ষিক পরীক্ষা: জুন-জুলাই
• বার্ষিক পরীক্ষা: নভেম্বর-ডিসেম্বর

বোর্ড পরীক্ষা (BMEB নির্ধারিত):
• ইবতেদায়ী সমাপনী: নভেম্বর
• জেডিসি (জুনিয়র দাখিল): নভেম্বর
• দাখিল পরীক্ষা: ফেব্রুয়ারি
• আলিম পরীক্ষা: এপ্রিল

বিস্তারিত সময়সূচি নোটিশ বোর্ডে প্রকাশিত হয়।
অনলাইনে রুটিন: www.bmeb.gov.bd`,

  syllabusText: `পাঠ্যক্রম বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড (BMEB) ও জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত।

ধর্মীয় বিষয়সমূহ:
• কুরআন মাজিদ ও তাজভিদ
• হাদিস শরীফ
• আকাইদ ও ফিকহ
• আরবি (১ম ও ২য় পত্র)
• ইসলামের ইতিহাস

সাধারণ বিষয়সমূহ:
• বাংলা (১ম ও ২য় পত্র)
• ইংরেজি (১ম ও ২য় পত্র)
• গণিত
• বিজ্ঞান
• তথ্য ও যোগাযোগ প্রযুক্তি (ICT)
• বাংলাদেশ ও বিশ্বপরিচয়

ব্যবহারিক বিষয়:
• শারীরিক শিক্ষা ও স্বাস্থ্য
• কৃষিশিক্ষা / গার্হস্থ্যবিজ্ঞান (ঐচ্ছিক)

সিলেবাস ডাউনলোড: www.bmeb.gov.bd`,

  scholarshipText: `মেধাবী ও অসচ্ছল শিক্ষার্থীদের জন্য নিম্নলিখিত বৃত্তি ও সুবিধা প্রদান করা হয়:

সরকারি বৃত্তি:
• প্রাথমিক বৃত্তি পরীক্ষায় উত্তীর্ণদের সরকারি বৃত্তি
• জেডিসি পরীক্ষায় কৃতিত্বপূর্ণ ফলাফলে উপবৃত্তি
• দাখিল পরীক্ষায় A+ প্রাপ্তদের বিশেষ পুরস্কার

প্রতিষ্ঠানের নিজস্ব সুবিধা:
• মেধাবী ও দরিদ্র শিক্ষার্থীদের বেতন মওকুফ
• শিক্ষা সহায়তা তহবিল থেকে আর্থিক সহায়তা
• বিনামূল্যে বই ও শিক্ষা উপকরণ (সরকারি সুবিধা)

সরকারি উপবৃত্তি:
• মাধ্যমিক স্তরে সরকারি উপবৃত্তি কার্যক্রমে অন্তর্ভুক্ত
• ছাত্রী উপবৃত্তি (মাধ্যমিক)

আবেদনের জন্য প্রতিষ্ঠানের অফিসে যোগাযোগ করুন।`,

  principalName: 'মো. শফিকুল ইসলাম',
  principalMessage: `বিসমিল্লাহির রাহমানির রাহীম

আস্সালামু আলাইকুম ওয়া রাহমাতুল্লাহ।

এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসার পক্ষ থেকে আপনাদের আন্তরিক স্বাগত জানাই। ১৯৫৮ সাল থেকে এই ঐতিহ্যবাহী প্রতিষ্ঠান ইসলামি শিক্ষা ও আধুনিক জ্ঞান-বিজ্ঞানের সমন্বয়ে শিক্ষার্থীদের একজন আদর্শ মুসলিম ও সুনাগরিক হিসেবে গড়ে তুলে আসছে।

আমাদের লক্ষ্য শুধু পাঠ্যপুস্তকের জ্ঞান অর্জন নয়, বরং নৈতিক ও চারিত্রিক উৎকর্ষতার মাধ্যমে শিক্ষার্থীদের পরিপূর্ণ মানুষ হিসেবে গড়ে তোলা। কুরআন ও সুন্নাহর আলোকে জীবন গড়ার পাশাপাশি আধুনিক জ্ঞান-বিজ্ঞানে পারদর্শী হওয়াই আমাদের শিক্ষার্থীদের লক্ষ্য।

আমাদের অভিজ্ঞ শিক্ষকমণ্ডলী প্রতিটি শিক্ষার্থীর মেধা বিকাশে নিরলসভাবে কাজ করে যাচ্ছেন। প্রতিষ্ঠানের শান্ত, সুশৃঙ্খল ও পবিত্র পরিবেশ শিক্ষার্থীদের একাডেমিক ও আত্মিক বিকাশে সহায়তা করছে।

আপনাদের সহযোগিতা, বিশ্বাস ও দোয়া আমাদের এগিয়ে চলার প্রেরণা। আল্লাহ তায়ালা আমাদের সকলের প্রচেষ্টা কবুল করুন।

মো. শফিকুল ইসলাম
অধ্যক্ষ, এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা`,
};

export const DEFAULT_CONTENT: WebsiteContent = {
  heroSubtitle: 'ইবতেদায়ি থেকে দাখিল পর্যন্ত মানসম্মত ইসলামি শিক্ষা। আধুনিক ডিজিটাল পদ্ধতিতে শিক্ষার্থীদের সম্পূর্ণ একাডেমিক ব্যবস্থাপনা।',
  stats: [
    { label: 'মোট শিক্ষার্থী', value: '১,২০০+' },
    { label: 'অভিজ্ঞ শিক্ষক', value: '৪৫+' },
    { label: 'বছরের অভিজ্ঞতা', value: '৬৬+' },
    { label: 'পাশের হার', value: '৯৮%' },
  ],
  gallery: [
    { id: 'g1', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600', caption: 'মাদ্রাসা ভবন' },
    { id: 'g2', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600', caption: 'বার্ষিক পরীক্ষা' },
    { id: 'g3', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600', caption: 'পাঠদান' },
    { id: 'g4', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600', caption: 'পাঠাগার' },
    { id: 'g5', url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600', caption: 'খেলার মাঠ' },
    { id: 'g6', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600', caption: 'পুরস্কার বিতরণ' },
  ],
  faq: [
    { id: 'f1', question: 'ভর্তির জন্য কী কী কাগজপত্র লাগবে?', answer: 'জন্ম নিবন্ধন সনদ, পূর্ববর্তী পরীক্ষার মার্কশিট/সার্টিফিকেট, পাসপোর্ট সাইজ ছবি ৪ কপি, অভিভাবকের জাতীয় পরিচয়পত্রের ফটোকপি।' },
    { id: 'f2', question: 'ভর্তির সময়সীমা কখন?', answer: 'সাধারণত প্রতি বছর জানুয়ারি মাসে ভর্তি কার্যক্রম শুরু হয়। বিস্তারিত নোটিশ বোর্ডে প্রকাশিত হয়।' },
    { id: 'f3', question: 'মাদ্রাসায় কোন কোন শ্রেণি আছে?', answer: 'ইবতেদায়ি ১ম শ্রেণি থেকে দাখিল (১০ম শ্রেণি) পর্যন্ত সকল শ্রেণিতে পাঠদান করা হয়।' },
    { id: 'f4', question: 'ফলাফল কীভাবে দেখব?', answer: 'ওয়েবসাইটের "ফলাফল" মেনু থেকে অথবা ছাত্র পোর্টালে লগইন করে ফলাফল দেখা যাবে।' },
    { id: 'f5', question: 'যোগাযোগের সময়সূচি কী?', answer: 'রবিবার থেকে বৃহস্পতিবার সকাল ৯টা থেকে বিকেল ৪টা পর্যন্ত অফিস খোলা থাকে।' },
    { id: 'f6', question: 'মাদ্রাসার EIIN নম্বর কী?', answer: 'এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসার EIIN নম্বর হলো ১১০৫৯০।' },
  ],
  importantLinks: [
    { id: 'l1', label: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড', url: 'https://www.bmeb.gov.bd', icon: '🏛️' },
    { id: 'l2', label: 'বাংলাদেশ শিক্ষা বোর্ড', url: 'https://www.educationboard.gov.bd', icon: '📋' },
    { id: 'l3', label: 'শিক্ষা মন্ত্রণালয়', url: 'https://www.moedu.gov.bd', icon: '🏫' },
    { id: 'l4', label: 'NCTB পাঠ্যপুস্তক বোর্ড', url: 'https://www.nctb.gov.bd', icon: '📚' },
    { id: 'l5', label: 'মাদ্রাসা ফলাফল (BMEB)', url: 'https://www.bmeb.gov.bd', icon: '📊' },
    { id: 'l6', label: 'বাংলাদেশ সরকার', url: 'https://www.bangladesh.gov.bd', icon: '🇧🇩' },
  ],
  noticeTicker: [
    { id: 'n1', text: '২০২৬ সালের বার্ষিক পরীক্ষার সময়সূচি প্রকাশিত হয়েছে।' },
    { id: 'n2', text: 'নতুন শিক্ষার্থী ভর্তি কার্যক্রম চলছে। আজই আবেদন করুন।' },
    { id: 'n3', text: 'দাখিল পরীক্ষার ফলাফল প্রকাশিত হয়েছে। ফলাফল দেখতে এখানে ক্লিক করুন।' },
  ],
  slides: [
    {
      id: 's1',
      tag: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত',
      headline: 'এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা',
      sub: 'ইসলামি শিক্ষা ও আধুনিক জ্ঞানের সমন্বয়ে একটি উজ্জ্বল ভবিষ্যৎ গড়ে তুলুন।',
      photo: '/hero-1.jpg',
      cta1Label: 'ভর্তি আবেদন করুন',
      cta1Href: '/admission',
      cta2Label: 'প্রতিষ্ঠান সম্পর্কে',
      cta2Href: '/about',
    },
    {
      id: 's2',
      tag: 'ভর্তি চলছে — ২০২৬',
      headline: 'আপনার সন্তানের ভবিষ্যৎ গড়ুন',
      sub: 'এবতেদায়ী থেকে দাখিল পর্যন্ত সকল শ্রেণিতে ভর্তির সুযোগ। মানসম্মত ইসলামি শিক্ষা নিশ্চিত করুন।',
      photo: '/hero-2.jpg',
      cta1Label: 'এখনই আবেদন করুন',
      cta1Href: '/admission',
      cta2Label: 'ভর্তির বিজ্ঞপ্তি',
      cta2Href: '/notice',
    },
    {
      id: 's3',
      tag: 'EIIN: 110590 | স্থাপিত ১৯৫৮',
      headline: 'শিক্ষায় আলো, জীবনে শান্তি',
      sub: '৬৬ বছরেরও বেশি সময় ধরে পাকুন্দিয়া, কিশোরগঞ্জের শিক্ষার্থীদের জ্ঞান ও নৈতিক মূল্যবোধে গড়ে তুলছে এই মাদ্রাসা।',
      photo: '/hero-3.jpg',
      cta1Label: 'ফলাফল দেখুন',
      cta1Href: '/result',
      cta2Label: 'শিক্ষক তালিকা',
      cta2Href: '/teachers',
    },
  ],
  aboutPage: DEFAULT_ABOUT,
};

export function loadWebsiteContent(): WebsiteContent {
  if (typeof window === 'undefined') return DEFAULT_CONTENT;
  try {
    const raw = localStorage.getItem(WEBSITE_CONTENT_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const stored = JSON.parse(raw) as Partial<WebsiteContent>;
    return {
      ...DEFAULT_CONTENT,
      ...stored,
      aboutPage: { ...DEFAULT_ABOUT, ...(stored.aboutPage ?? {}) },
    };
  } catch { return DEFAULT_CONTENT; }
}

export function saveWebsiteContent(content: WebsiteContent): void {
  try { localStorage.setItem(WEBSITE_CONTENT_KEY, JSON.stringify(content)); } catch {}
}

export interface AdmissionApplication {
  id: string;
  nameBn: string;
  nameEn: string;
  fatherName: string;
  motherName: string;
  dob: string;
  applyingClass: string;
  phone: string;
  address: string;
  previousSchool?: string;
  previousResult?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

export function loadAdmissions(): AdmissionApplication[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(ADMISSIONS_KEY) ?? '[]'); } catch { return []; }
}

export function saveAdmission(app: AdmissionApplication): void {
  const existing = loadAdmissions().filter(a => a.id !== app.id);
  localStorage.setItem(ADMISSIONS_KEY, JSON.stringify([...existing, app]));
}

export function updateAdmissionStatus(id: string, status: 'accepted' | 'rejected'): AdmissionApplication | null {
  const all = loadAdmissions();
  const app = all.find(a => a.id === id);
  if (!app) return null;
  const updated = { ...app, status };
  localStorage.setItem(ADMISSIONS_KEY, JSON.stringify(all.map(a => a.id === id ? updated : a)));
  return updated;
}
