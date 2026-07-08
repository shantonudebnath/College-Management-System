import type { Student, Teacher, ClassInfo, Subject, ExamResult, Fee, Notice, ExamSchedule, Note, Syllabus } from './types';

export const MADRASHA_CLASSES = [
  { id: 'class-shishu', name: 'Pre-Class (Shishu)', nameBn: 'শিশু শ্রেণি', level: 'ebtedayi' },
  { id: 'class-1',      name: 'Class 1 (Prothom)',  nameBn: '১ম শ্রেণি',             level: 'ebtedayi' },
  { id: 'class-2',      name: 'Class 2 (Ditiyyo)',  nameBn: '২য় শ্রেণি',             level: 'ebtedayi' },
  { id: 'class-3',      name: 'Class 3 (Tritiyyo)', nameBn: '৩য় শ্রেণি',             level: 'ebtedayi' },
  { id: 'class-4',      name: 'Class 4 (Chaturth)', nameBn: '৪র্থ শ্রেণি',           level: 'ebtedayi' },
  { id: 'class-5',      name: 'Class 5 (Pancham)',  nameBn: '৫ম শ্রেণি',             level: 'ebtedayi' },
  { id: 'class-6',      name: 'Class 6 (Shoshto)',  nameBn: '৬ষ্ঠ শ্রেণি',           level: 'junior-dakhil' },
  { id: 'class-7',      name: 'Class 7 (Soptom)',   nameBn: '৭ম শ্রেণি',             level: 'junior-dakhil' },
  { id: 'class-8',      name: 'Class 8 (Ostom)',    nameBn: '৮ম শ্রেণি',             level: 'junior-dakhil' },
  { id: 'class-9',      name: 'Class 9 (Nobom)',    nameBn: '৯ম শ্রেণি',             level: 'dakhil' },
  { id: 'class-10',     name: 'Class 10 (Dakhil)',  nameBn: '১০ম শ্রেণি (দাখিল)',    level: 'dakhil' },
  { id: 'class-alim-1', name: 'Alim 1st Year',      nameBn: 'আলিম ১ম বর্ষ',         level: 'alim' },
  { id: 'class-alim-2', name: 'Alim 2nd Year',      nameBn: 'আলিম ২য় বর্ষ',         level: 'alim' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECTS_BY_CLASS
// Source: Half_Yearly_MarkSheet PDF (2026) + Alim Exam Schedule PDF (2026)
// CQ  = Creative/Subjective Question portion
// MCQ = Multiple Choice Question portion
// P   = Practical / Oral / Viva portion
// fullMark  = CQ + MCQ + P
// passMark  = minimum total marks required to pass
//   • ইবতেদায়ি (class-shishu – class-5): 40% of fullMark
//   • জুনিয়র দাখিল / দাখিল / আলিম: 33 for 100-mark subjects,
//     17 for 50-mark theory subjects, 20 for 50-mark practical subjects
// ─────────────────────────────────────────────────────────────────────────────
export const SUBJECTS_BY_CLASS: Record<string, Subject[]> = {

  // ═══════════════════════════════════════════════════════════════
  // স্তর: ইবতেদায়ি
  // ═══════════════════════════════════════════════════════════════

  // শিশু শ্রেণি — ৫ বিষয়, মোট ৫০০ নম্বর (শুধু CQ, পাসমার্ক ৪০%)
  'class-shishu': [
    { name: 'Quran Majid',  nameBn: 'কুরআন মাজিদ',              fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Bengali',      nameBn: 'বাংলা',                     fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Arabic',       nameBn: 'আরবি',                      fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Mathematics',  nameBn: 'গণিত',                      fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'English',      nameBn: 'ইংরেজি',                    fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
  ],

  // ১ম শ্রেণি (প্রথম) — ৬ বিষয়, মোট ৬০০ নম্বর
  // কুরআন: CQ=80 + Practical=20 (তাজভিদ মৌখিক)
  'class-1': [
    { name: 'Arabic',               nameBn: 'আরবি',                      fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Quran Majid & Tajwid', nameBn: 'কুরআন মাজিদ ও তাজভিদ',     fullMark: 100, passMark: 40, cqMark: 80,  mcqMark: 0, practicalMark: 20, type: 'mixed' },
    { name: 'Aqaid & Fiqh',        nameBn: 'আকাইদ ও ফিকহ',              fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'English',              nameBn: 'ইংরেজি',                    fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Mathematics',          nameBn: 'গণিত',                      fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Bengali',              nameBn: 'বাংলা',                     fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
  ],

  // ২য় শ্রেণি (দ্বিতীয়) — ৭ বিষয়, মোট ৭০০ নম্বর
  'class-2': [
    { name: 'Quran Majid & Tajwid', nameBn: 'কুরআন মাজিদ ও তাজভিদ',     fullMark: 100, passMark: 40, cqMark: 80,  mcqMark: 0, practicalMark: 20, type: 'mixed' },
    { name: 'Bengali',              nameBn: 'বাংলা',                     fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'English',              nameBn: 'ইংরেজি',                    fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Arabic',               nameBn: 'আরবি',                      fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Aqaid & Fiqh',        nameBn: 'আকাইদ ও ফিকহ',              fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Mathematics',          nameBn: 'গণিত',                      fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Geography & Society',  nameBn: 'ভূগোল ও সমাজ',              fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
  ],

  // ৩য় শ্রেণি (তৃতীয়) — ১০ বিষয়, মোট ৯৫০ নম্বর
  // আরবি ২য় পত্র: শুধু ৫০ নম্বর (CQ=50)
  // কুরআন: CQ=80 + Practical=20
  'class-3': [
    { name: 'Arabic 1st Paper',         nameBn: 'আরবি ১ম পত্র',              fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Quran Majid & Tajwid',     nameBn: 'কুরআন মাজিদ ও তাজভিদ',     fullMark: 100, passMark: 40, cqMark: 80,  mcqMark: 0, practicalMark: 20, type: 'mixed' },
    { name: 'Arabic 2nd Paper',         nameBn: 'আরবি ২য় পত্র',              fullMark: 50,  passMark: 20, cqMark: 50,  mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Aqaid & Fiqh',            nameBn: 'আকাইদ ও ফিকহ',              fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'General Knowledge',        nameBn: 'সাধারণ জ্ঞান',               fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'English',                  nameBn: 'ইংরেজি',                    fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Bengali',                  nameBn: 'বাংলা',                     fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Bangladesh & World Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Mathematics',              nameBn: 'গণিত',                      fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
    { name: 'Science',                  nameBn: 'বিজ্ঞান',                    fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0,  type: 'theory' },
  ],

  // ৪র্থ শ্রেণি (চতুর্থ) — ১০ বিষয়, মোট ১০০০ নম্বর
  // এই শ্রেণিতে কুরআনে কোনো practical নেই (পূর্ণ CQ=100)
  'class-4': [
    { name: 'Quran Majid & Tajwid',     nameBn: 'কুরআন মাজিদ ও তাজভিদ',     fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Bengali',                  nameBn: 'বাংলা',                     fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Aqaid & Fiqh',            nameBn: 'আকাইদ ও ফিকহ',              fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Mathematics',              nameBn: 'গণিত',                      fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Science',                  nameBn: 'বিজ্ঞান',                    fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Arabic 1st Paper',         nameBn: 'আরবি ১ম পত্র',              fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Arabic 2nd Paper',         nameBn: 'আরবি ২য় পত্র',              fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Bangladesh & World Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'English',                  nameBn: 'ইংরেজি',                    fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'General Knowledge',        nameBn: 'সাধারণ জ্ঞান',               fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
  ],

  // ৫ম শ্রেণি (পঞ্চম) — ৯ বিষয়, মোট ৯০০ নম্বর
  // এক আরবি বিষয় (পৃথক পত্র নেই), কুরআন CQ=100 (practical নেই)
  'class-5': [
    { name: 'Arabic',                   nameBn: 'আরবি',                      fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Aqaid & Fiqh',            nameBn: 'আকাইদ ও ফিকহ',              fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Quran Majid & Tajwid',     nameBn: 'কুরআন মাজিদ ও তাজভিদ',     fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Bengali',                  nameBn: 'বাংলা',                     fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Science',                  nameBn: 'বিজ্ঞান',                    fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'English',                  nameBn: 'ইংরেজি',                    fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Bangladesh & World Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'General Knowledge',        nameBn: 'সাধারণ জ্ঞান',               fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
    { name: 'Mathematics',              nameBn: 'গণিত',                      fullMark: 100, passMark: 40, cqMark: 100, mcqMark: 0, practicalMark: 0, type: 'theory' },
  ],

  // ═══════════════════════════════════════════════════════════════
  // স্তর: জুনিয়র দাখিল
  // ষষ্ঠ ও সপ্তম — ১৩ আবশ্যিক + ৪টি ব্যবহারিক (যেকোনো ১টি বাছাই)
  // মোট আবশ্যিক: ১২৫০ নম্বর + optional: ৫০ নম্বর
  // পাসমার্ক: ৩৩ (১০০ নম্বর বিষয়), ১৭ (৫০ নম্বর তত্ত্বীয়), ২০ (৫০ নম্বর ব্যবহারিক)
  // ═══════════════════════════════════════════════════════════════
  'class-6': [
    // আবশ্যিক বিষয়
    { name: 'Arabic 1st Paper',         nameBn: 'আরবি ১ম পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Arabic 2nd Paper',         nameBn: 'আরবি ২য় পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Quran Majid & Tajwid',     nameBn: 'কুরআন মাজিদ ও তাজভিদ',     fullMark: 100, passMark: 33, cqMark: 85,  mcqMark: 0,  practicalMark: 15, type: 'mixed' },
    { name: 'Bengali 1st Paper',        nameBn: 'বাংলা ১ম পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'Bengali 2nd Paper',        nameBn: 'বাংলা ২য় পত্র',             fullMark: 50,  passMark: 17, cqMark: 35,  mcqMark: 15, practicalMark: 0,  type: 'mixed' },
    { name: 'Science',                  nameBn: 'বিজ্ঞান',                    fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'English 1st Paper',        nameBn: 'ইংরেজি ১ম পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'English 2nd Paper',        nameBn: 'ইংরেজি ২য় পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'ICT',                      nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',  fullMark: 50,  passMark: 17, cqMark: 0,   mcqMark: 25, practicalMark: 25, type: 'mixed',     subjectCode: '140' },
    { name: 'Aqaid & Fiqh',            nameBn: 'আকাইদ ও ফিকহ',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Mathematics',              nameBn: 'গণিত',                      fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'General Knowledge',        nameBn: 'সাধারণ জ্ঞান',               fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Bangladesh & World Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    // ব্যবহারিক বিষয় (যেকোনো ১টি)
    { name: 'Physical Education & Health', nameBn: 'শারীরিক শিক্ষা ও স্বাস্থ্য', fullMark: 50, passMark: 20, cqMark: 0, mcqMark: 0, practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'pe' },
    { name: 'Work & Life Skills',       nameBn: 'কর্ম ও জীবনমুখী শিক্ষা',   fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'vocational' },
    { name: 'Agriculture',              nameBn: 'কৃষিশিক্ষা',                 fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'vocational' },
    { name: 'Home Science',             nameBn: 'গার্হস্থ্যবিজ্ঞান',           fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'vocational' },
  ],

  'class-7': [
    { name: 'Arabic 1st Paper',         nameBn: 'আরবি ১ম পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Arabic 2nd Paper',         nameBn: 'আরবি ২য় পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Quran Majid & Tajwid',     nameBn: 'কুরআন মাজিদ ও তাজভিদ',     fullMark: 100, passMark: 33, cqMark: 85,  mcqMark: 0,  practicalMark: 15, type: 'mixed' },
    { name: 'Bengali 1st Paper',        nameBn: 'বাংলা ১ম পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'Bengali 2nd Paper',        nameBn: 'বাংলা ২য় পত্র',             fullMark: 50,  passMark: 17, cqMark: 35,  mcqMark: 15, practicalMark: 0,  type: 'mixed' },
    { name: 'Science',                  nameBn: 'বিজ্ঞান',                    fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'English 1st Paper',        nameBn: 'ইংরেজি ১ম পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'English 2nd Paper',        nameBn: 'ইংরেজি ২য় পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'ICT',                      nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',  fullMark: 50,  passMark: 17, cqMark: 0,   mcqMark: 25, practicalMark: 25, type: 'mixed',     subjectCode: '140' },
    { name: 'Aqaid & Fiqh',            nameBn: 'আকাইদ ও ফিকহ',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Mathematics',              nameBn: 'গণিত',                      fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'General Knowledge',        nameBn: 'সাধারণ জ্ঞান',               fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Bangladesh & World Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'Physical Education & Health', nameBn: 'শারীরিক শিক্ষা ও স্বাস্থ্য', fullMark: 50, passMark: 20, cqMark: 0, mcqMark: 0, practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'pe' },
    { name: 'Work & Life Skills',       nameBn: 'কর্ম ও জীবনমুখী শিক্ষা',   fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'vocational' },
    { name: 'Agriculture',              nameBn: 'কৃষিশিক্ষা',                 fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'vocational' },
    { name: 'Home Science',             nameBn: 'গার্হস্থ্যবিজ্ঞান',           fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'vocational' },
  ],

  // ৮ম শ্রেণি — ১৩ আবশ্যিক + ৪ ব্যবহারিক (যেকোনো ১টি)
  'class-8': [
    { name: 'Quran Majid & Tajwid',     nameBn: 'কুরআন মাজিদ ও তাজভিদ',     fullMark: 100, passMark: 33, cqMark: 85,  mcqMark: 0,  practicalMark: 15, type: 'mixed' },
    { name: 'Aqaid & Fiqh',            nameBn: 'আকাইদ ও ফিকহ',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Bengali 1st Paper',        nameBn: 'বাংলা ১ম পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'Bengali 2nd Paper',        nameBn: 'বাংলা ২য় পত্র',             fullMark: 50,  passMark: 17, cqMark: 35,  mcqMark: 15, practicalMark: 0,  type: 'mixed' },
    { name: 'ICT',                      nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',  fullMark: 50,  passMark: 17, cqMark: 0,   mcqMark: 25, practicalMark: 25, type: 'mixed',     subjectCode: '140' },
    { name: 'General Knowledge',        nameBn: 'সাধারণ জ্ঞান',               fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Arabic 1st Paper',         nameBn: 'আরবি ১ম পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Arabic 2nd Paper',         nameBn: 'আরবি ২য় পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Bangladesh & World Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'English 1st Paper',        nameBn: 'ইংরেজি ১ম পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'English 2nd Paper',        nameBn: 'ইংরেজি ২য় পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  type: 'theory' },
    { name: 'Mathematics',              nameBn: 'গণিত',                      fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'Science',                  nameBn: 'বিজ্ঞান',                    fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  type: 'mixed' },
    { name: 'Physical Education & Health', nameBn: 'শারীরিক শিক্ষা ও স্বাস্থ্য', fullMark: 50, passMark: 20, cqMark: 0, mcqMark: 0, practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'pe' },
    { name: 'Work & Life Skills',       nameBn: 'কর্ম ও জীবনমুখী শিক্ষা',   fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'vocational' },
    { name: 'Agriculture',              nameBn: 'কৃষিশিক্ষা',                 fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'vocational' },
    { name: 'Home Science',             nameBn: 'গার্হস্থ্যবিজ্ঞান',           fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, type: 'practical', isOptional: true, optionalGroup: 'vocational' },
  ],

  // ═══════════════════════════════════════════════════════════════
  // স্তর: দাখিল
  // নবম ও দশম শ্রেণি — BMEB ২০২৬ অনুযায়ী
  // আবশ্যিক: ১৪ বিষয় + বিভাগভিত্তিক ঐচ্ছিক (বিজ্ঞান গ্রুপ ইত্যাদি)
  // ═══════════════════════════════════════════════════════════════
  'class-9': [
    // আবশ্যিক ধর্মীয় বিষয়
    { name: 'Quran Majid & Tajwid',     nameBn: 'কুরআন মাজিদ ও তাজভিদ',     fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '101', type: 'theory' },
    { name: 'Hadith Sharif',            nameBn: 'হাদীস শরীফ',                fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '102', type: 'theory' },
    { name: 'Aqaid & Fiqh',            nameBn: 'আকাইদ ও ফিকহ',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '133', type: 'theory' },
    { name: 'Arabic 1st Paper',         nameBn: 'আরবি ১ম পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '103', type: 'theory' },
    { name: 'Arabic 2nd Paper',         nameBn: 'আরবি ২য় পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '104', type: 'theory' },
    { name: 'Islamic History',          nameBn: 'ইসলামের ইতিহাস',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '109', type: 'mixed' },
    // আবশ্যিক সাধারণ বিষয়
    { name: 'Bengali 1st Paper',        nameBn: 'বাংলা ১ম পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '134', type: 'mixed' },
    { name: 'Bengali 2nd Paper',        nameBn: 'বাংলা ২য় পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '135', type: 'mixed' },
    { name: 'English 1st Paper',        nameBn: 'ইংরেজি ১ম পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '136', type: 'theory' },
    { name: 'English 2nd Paper',        nameBn: 'ইংরেজি ২য় পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '37',  type: 'theory' },
    { name: 'Mathematics',              nameBn: 'গণিত',                      fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '108', type: 'mixed' },
    { name: 'ICT',                      nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',  fullMark: 50,  passMark: 17, cqMark: 0,   mcqMark: 25, practicalMark: 25, subjectCode: '140', type: 'mixed' },
    { name: 'Physical Education',       nameBn: 'শারীরিক শিক্ষা, স্বাস্থ্য ও খেলাধুলা', fullMark: 50, passMark: 20, cqMark: 0, mcqMark: 0, practicalMark: 50, subjectCode: '142', type: 'practical' },
    { name: 'Career Education',         nameBn: 'ক্যারিয়ার শিক্ষা',           fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, subjectCode: '145', type: 'practical' },
    // গ্রুপ-ভিত্তিক ঐচ্ছিক (চতুর্থ বিষয় — যেকোনো ১টি)
    { name: 'Bangladesh & World Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '143', type: 'mixed',    isOptional: true, optionalGroup: 'general' },
    { name: 'Civics & Citizenship',     nameBn: 'পৌরনীতি ও নাগরিকতা',        fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '111', type: 'mixed',    isOptional: true, optionalGroup: 'general' },
    { name: 'Agriculture Education',    nameBn: 'কৃষিশিক্ষা',                 fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '113', type: 'mixed',    isOptional: true, optionalGroup: 'general' },
    { name: 'Home Science',             nameBn: 'গার্হস্থ্য বিজ্ঞান',          fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '114', type: 'mixed',    isOptional: true, optionalGroup: 'general' },
    // বিজ্ঞান গ্রুপ (Science Group Electives)
    { name: 'Chemistry',                nameBn: 'রসায়ন',                     fullMark: 100, passMark: 33, cqMark: 50,  mcqMark: 25, practicalMark: 25, subjectCode: '131', type: 'mixed',    isOptional: true, optionalGroup: 'science' },
    { name: 'Biology',                  nameBn: 'জীববিজ্ঞান',                 fullMark: 100, passMark: 33, cqMark: 50,  mcqMark: 25, practicalMark: 25, subjectCode: '132', type: 'mixed',    isOptional: true, optionalGroup: 'science' },
    { name: 'Physics',                  nameBn: 'পদার্থবিজ্ঞান',               fullMark: 100, passMark: 33, cqMark: 50,  mcqMark: 25, practicalMark: 25, subjectCode: '130', type: 'mixed',    isOptional: true, optionalGroup: 'science' },
    { name: 'Higher Mathematics',       nameBn: 'উচ্চতর গণিত',                fullMark: 100, passMark: 33, cqMark: 50,  mcqMark: 25, practicalMark: 25, subjectCode: '115', type: 'mixed',    isOptional: true, optionalGroup: 'science' },
  ],

  // দশম শ্রেণি — নবম শ্রেণির অনুরূপ বিষয়তালিকা
  'class-10': [
    { name: 'Quran Majid & Tajwid',     nameBn: 'কুরআন মাজিদ ও তাজভিদ',     fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '101', type: 'theory' },
    { name: 'Hadith Sharif',            nameBn: 'হাদীস শরীফ',                fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '102', type: 'theory' },
    { name: 'Aqaid & Fiqh',            nameBn: 'আকাইদ ও ফিকহ',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '133', type: 'theory' },
    { name: 'Arabic 1st Paper',         nameBn: 'আরবি ১ম পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '103', type: 'theory' },
    { name: 'Arabic 2nd Paper',         nameBn: 'আরবি ২য় পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '104', type: 'theory' },
    { name: 'Islamic History',          nameBn: 'ইসলামের ইতিহাস',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '109', type: 'mixed' },
    { name: 'Bengali 1st Paper',        nameBn: 'বাংলা ১ম পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '134', type: 'mixed' },
    { name: 'Bengali 2nd Paper',        nameBn: 'বাংলা ২য় পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '135', type: 'mixed' },
    { name: 'English 1st Paper',        nameBn: 'ইংরেজি ১ম পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '136', type: 'theory' },
    { name: 'English 2nd Paper',        nameBn: 'ইংরেজি ২য় পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '37',  type: 'theory' },
    { name: 'Mathematics',              nameBn: 'গণিত',                      fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '108', type: 'mixed' },
    { name: 'ICT',                      nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',  fullMark: 50,  passMark: 17, cqMark: 0,   mcqMark: 25, practicalMark: 25, subjectCode: '140', type: 'mixed' },
    { name: 'Physical Education',       nameBn: 'শারীরিক শিক্ষা, স্বাস্থ্য ও খেলাধুলা', fullMark: 50, passMark: 20, cqMark: 0, mcqMark: 0, practicalMark: 50, subjectCode: '142', type: 'practical' },
    { name: 'Career Education',         nameBn: 'ক্যারিয়ার শিক্ষা',           fullMark: 50,  passMark: 20, cqMark: 0,   mcqMark: 0,  practicalMark: 50, subjectCode: '145', type: 'practical' },
    { name: 'Bangladesh & World Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '143', type: 'mixed',    isOptional: true, optionalGroup: 'general' },
    { name: 'Civics & Citizenship',     nameBn: 'পৌরনীতি ও নাগরিকতা',        fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '111', type: 'mixed',    isOptional: true, optionalGroup: 'general' },
    { name: 'Agriculture Education',    nameBn: 'কৃষিশিক্ষা',                 fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '113', type: 'mixed',    isOptional: true, optionalGroup: 'general' },
    { name: 'Home Science',             nameBn: 'গার্হস্থ্য বিজ্ঞান',          fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '114', type: 'mixed',    isOptional: true, optionalGroup: 'general' },
    { name: 'Chemistry',                nameBn: 'রসায়ন',                     fullMark: 100, passMark: 33, cqMark: 50,  mcqMark: 25, practicalMark: 25, subjectCode: '131', type: 'mixed',    isOptional: true, optionalGroup: 'science' },
    { name: 'Biology',                  nameBn: 'জীববিজ্ঞান',                 fullMark: 100, passMark: 33, cqMark: 50,  mcqMark: 25, practicalMark: 25, subjectCode: '132', type: 'mixed',    isOptional: true, optionalGroup: 'science' },
    { name: 'Physics',                  nameBn: 'পদার্থবিজ্ঞান',               fullMark: 100, passMark: 33, cqMark: 50,  mcqMark: 25, practicalMark: 25, subjectCode: '130', type: 'mixed',    isOptional: true, optionalGroup: 'science' },
    { name: 'Higher Mathematics',       nameBn: 'উচ্চতর গণিত',                fullMark: 100, passMark: 33, cqMark: 50,  mcqMark: 25, practicalMark: 25, subjectCode: '115', type: 'mixed',    isOptional: true, optionalGroup: 'science' },
  ],

  // ═══════════════════════════════════════════════════════════════
  // স্তর: আলিম
  // আলিম পরীক্ষার সময়সূচি ২০২৬ (বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড) অনুযায়ী
  // ═══════════════════════════════════════════════════════════════
  'class-alim-1': [
    { name: 'Quran Majid',               nameBn: 'কুরআন মাজিদ',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '201', type: 'theory' },
    { name: 'Arabic 1st Paper',          nameBn: 'আরবি ১ম পত্র (সাধারণ)',     fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '205', type: 'theory' },
    { name: 'Bengali 1st Paper',         nameBn: 'বাংলা ১ম পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '306', type: 'mixed' },
    { name: 'Bengali 2nd Paper',         nameBn: 'বাংলা ২য় পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '307', type: 'mixed' },
    { name: 'English 1st Paper',         nameBn: 'ইংরেজি ১ম পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '30b', type: 'theory' },
    { name: 'English 2nd Paper',         nameBn: 'ইংরেজি ২য় পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '309', type: 'theory' },
    { name: 'Arabic 2nd Paper',          nameBn: 'আরবি ২য় পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '30b', type: 'theory' },
    { name: 'Hadith & Usul al-Hadith',   nameBn: 'হাদিস ও উসূলুল হাদিস',      fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '202', type: 'theory' },
    { name: 'Al-Fiqh 1st Paper',         nameBn: 'আল-ফিকহু ১ম পত্র',          fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '203', type: 'theory' },
    { name: 'Al-Fiqh 2nd Paper',         nameBn: 'আল-ফিকহু ২য় পত্র',          fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '204', type: 'theory' },
    { name: 'ICT',                       nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',  fullMark: 100, passMark: 33, cqMark: 50,  mcqMark: 25, practicalMark: 25, subjectCode: '340', type: 'mixed' },
    { name: 'Balaghat & Mantiq',         nameBn: 'বালাগাত ও মানতিক',           fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '250', type: 'theory', isOptional: true },
    { name: 'Islamic History',           nameBn: 'ইসলামের ইতিহাস',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '209', type: 'mixed',  isOptional: true },
  ],

  'class-alim-2': [
    { name: 'Quran Majid',               nameBn: 'কুরআন মাজিদ',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '201', type: 'theory' },
    { name: 'Arabic 1st Paper',          nameBn: 'আরবি ১ম পত্র (সাধারণ)',     fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '205', type: 'theory' },
    { name: 'Bengali 1st Paper',         nameBn: 'বাংলা ১ম পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '306', type: 'mixed' },
    { name: 'Bengali 2nd Paper',         nameBn: 'বাংলা ২য় পত্র',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '307', type: 'mixed' },
    { name: 'English 1st Paper',         nameBn: 'ইংরেজি ১ম পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '30b', type: 'theory' },
    { name: 'English 2nd Paper',         nameBn: 'ইংরেজি ২য় পত্র',            fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '309', type: 'theory' },
    { name: 'Arabic 2nd Paper',          nameBn: 'আরবি ২য় পত্র',              fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '30b', type: 'theory' },
    { name: 'Hadith & Usul al-Hadith',   nameBn: 'হাদিস ও উসূলুল হাদিস',      fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '202', type: 'theory' },
    { name: 'Al-Fiqh 1st Paper',         nameBn: 'আল-ফিকহু ১ম পত্র',          fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '203', type: 'theory' },
    { name: 'Al-Fiqh 2nd Paper',         nameBn: 'আল-ফিকহু ২য় পত্র',          fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '204', type: 'theory' },
    { name: 'ICT',                       nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',  fullMark: 100, passMark: 33, cqMark: 50,  mcqMark: 25, practicalMark: 25, subjectCode: '340', type: 'mixed' },
    { name: 'Balaghat & Mantiq',         nameBn: 'বালাগাত ও মানতিক',           fullMark: 100, passMark: 33, cqMark: 100, mcqMark: 0,  practicalMark: 0,  subjectCode: '250', type: 'theory', isOptional: true },
    { name: 'Islamic History',           nameBn: 'ইসলামের ইতিহাস',             fullMark: 100, passMark: 33, cqMark: 70,  mcqMark: 30, practicalMark: 0,  subjectCode: '209', type: 'mixed',  isOptional: true },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// গ্রেড স্কেল
// ─────────────────────────────────────────────────────────────────────────────

// দাখিল / আলিম — BMEB মান অনুযায়ী (পাসমার্ক ৩৩)
export const GRADE_SCALE = [
  { min: 80, max: 100, grade: 'A+', gpa: 5.0, label: 'অতি উত্তম' },
  { min: 70, max: 79,  grade: 'A',  gpa: 4.0, label: 'উত্তম' },
  { min: 60, max: 69,  grade: 'A-', gpa: 3.5, label: 'ভালো' },
  { min: 50, max: 59,  grade: 'B',  gpa: 3.0, label: 'সন্তোষজনক' },
  { min: 40, max: 49,  grade: 'C',  gpa: 2.0, label: 'মোটামুটি' },
  { min: 33, max: 39,  grade: 'D',  gpa: 1.0, label: 'নিম্নমান' },
  { min: 0,  max: 32,  grade: 'F',  gpa: 0.0, label: 'অকৃতকার্য' },
];

// ইবতেদায়ি (১ম–৫ম শ্রেণি) — পাসমার্ক ৪০%
export const EBTEDAYI_GRADE_SCALE = [
  { min: 80, max: 100, grade: 'A',  gpa: 0, label: 'অতি উত্তম' },
  { min: 60, max: 79,  grade: 'B',  gpa: 0, label: 'উত্তম' },
  { min: 40, max: 59,  grade: 'C',  gpa: 0, label: 'সন্তোষজনক' },
  { min: 0,  max: 39,  grade: 'D',  gpa: 0, label: 'সহায়তা প্রয়োজন' },
];

export const EBTEDAYI_CLASSES = ['class-shishu', 'class-1', 'class-2', 'class-3', 'class-4', 'class-5'];

export function getGradeScale(classId: string) {
  return EBTEDAYI_CLASSES.includes(classId) ? EBTEDAYI_GRADE_SCALE : GRADE_SCALE;
}

// ─────────────────────────────────────────────────────────────────────────────
// স্থির ডেমো ডেটা
// ─────────────────────────────────────────────────────────────────────────────

export const STUDENTS: Student[] = [
];

export const TEACHERS: Teacher[] = [];

export const NOTICES: Notice[] = [];

export const EXAM_RESULTS: ExamResult[] = [];

export const FEES: Fee[] = [];

export const EXAM_SCHEDULE: ExamSchedule[] = [];

export const SYLLABUS: Syllabus[] = [];

export const NOTES: Note[] = [];

export const ROUTINE_DATA: { day: string; periods: { time: string; subject: string; teacher: string; class: string }[] }[] = [];

export const COLLEGE_INFO = {
  name: 'Egaro Sendur Ishakhan Senior Madrasha',
  nameBn: 'এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা',
  address: 'এগারসিন্দুর, পাকুন্দিয়া, কিশোরগঞ্জ, বাংলাদেশ',
  phone: '01973519857, 01973519858',
  email: '11sindurmadrasa@gmail.com',
  website: 'www.eismadrasha.edu.bd',
  eiin: '110590',
  established: '১৯৫৮',
  establishedEn: '1958',
  board: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড',
};
