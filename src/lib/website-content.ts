export const WEBSITE_CONTENT_KEY = 'website_content_v1';
export const ADMISSIONS_KEY = 'admissions_v1';

export interface GalleryItem { id: string; url: string; caption: string; }
export interface FaqItem { id: string; question: string; answer: string; }
export interface LinkItem { id: string; label: string; url: string; icon?: string; }
export interface StatItem { label: string; value: string; }
export interface NoticeTickerItem { id: string; text: string; }

export interface WebsiteContent {
  heroSubtitle: string;
  stats: StatItem[];
  gallery: GalleryItem[];
  faq: FaqItem[];
  importantLinks: LinkItem[];
  noticeTicker: NoticeTickerItem[];
}

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
};

export function loadWebsiteContent(): WebsiteContent {
  if (typeof window === 'undefined') return DEFAULT_CONTENT;
  try {
    const raw = localStorage.getItem(WEBSITE_CONTENT_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const stored = JSON.parse(raw) as Partial<WebsiteContent>;
    return { ...DEFAULT_CONTENT, ...stored };
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
