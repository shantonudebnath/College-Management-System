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
  { id: 's1', studentId: 'STD-2024-001', name: 'Mohammad Rafiqul Islam', nameBn: 'মোহাম্মদ রফিকুল ইসলাম', fatherName: 'Mohammad Kamal Uddin', motherName: 'Fatema Begum', class: 'class-10', section: 'A', roll: 1, session: '2024-25', dob: '2008-05-15', gender: 'Male', religion: 'Islam', phone: '01712345678', address: 'Dhaka, Bangladesh', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2024-01-10' },
  { id: 's2', studentId: 'STD-2024-002', name: 'Fatema Akter', nameBn: 'ফাতেমা আক্তার', fatherName: 'Abdul Karim', motherName: 'Rahela Begum', class: 'class-10', section: 'A', roll: 2, session: '2024-25', dob: '2008-08-22', gender: 'Female', religion: 'Islam', phone: '01812345678', address: 'Chittagong, Bangladesh', registrationStatus: 'approved', feeStatus: 'due', createdAt: '2024-01-12' },
  { id: 's3', studentId: 'STD-2024-003', name: 'Md. Shahidul Alam', nameBn: 'মো. শাহিদুল আলম', fatherName: 'Shahjahan Ali', motherName: 'Moriam Begum', class: 'class-9', section: 'A', roll: 1, session: '2024-25', dob: '2009-03-10', gender: 'Male', religion: 'Islam', phone: '01912345678', address: 'Sylhet, Bangladesh', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2024-01-15' },
  { id: 's4', studentId: 'STD-2024-004', name: 'Nusrat Jahan', nameBn: 'নুসরাত জাহান', fatherName: 'Md. Rashidul Haque', motherName: 'Shirin Akter', class: 'class-8', section: 'A', roll: 3, session: '2024-25', dob: '2010-11-05', gender: 'Female', religion: 'Islam', phone: '01612345678', address: 'Rajshahi, Bangladesh', registrationStatus: 'approved', feeStatus: 'partial', createdAt: '2024-01-18' },
  { id: 's5', studentId: 'STD-2024-005', name: 'Md. Tariqul Hasan', nameBn: 'মো. তারিকুল হাসান', fatherName: 'Harunur Rashid', motherName: 'Taslima Begum', class: 'class-7', section: 'A', roll: 5, session: '2024-25', dob: '2011-07-20', gender: 'Male', religion: 'Islam', phone: '01512345678', address: 'Khulna, Bangladesh', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2024-01-20' },

  // আলিম ১ম বর্ষ — ২০২৫-২৬ সেশন
  { id: 'alim-01', studentId: 'STD-2025-001', name: 'Mohammad Abdullah Al Mamun', nameBn: 'মোহাম্মদ আব্দুল্লাহ আল মামুন', fatherName: 'Mohammad Abdus Salam', motherName: 'Rina Begum', class: 'class-alim-1', section: 'A', roll: 1, session: '2025-26', dob: '2006-03-12', gender: 'Male', religion: 'Islam', phone: '01711001001', address: 'এগারসিন্দুর, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-05' },
  { id: 'alim-02', studentId: 'STD-2025-002', name: 'Md. Riazul Islam', nameBn: 'মো. রিয়াজুল ইসলাম', fatherName: 'Md. Mizanur Rahman', motherName: 'Halima Begum', class: 'class-alim-1', section: 'A', roll: 2, session: '2025-26', dob: '2006-07-25', gender: 'Male', religion: 'Islam', phone: '01711001002', address: 'হোসেন্দি, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-05' },
  { id: 'alim-03', studentId: 'STD-2025-003', name: 'Md. Saiful Amin', nameBn: 'মো. সাইফুল আমিন', fatherName: 'Md. Shamsul Alam', motherName: 'Moriam Khatun', class: 'class-alim-1', section: 'A', roll: 3, session: '2025-26', dob: '2006-11-08', gender: 'Male', religion: 'Islam', phone: '01711001003', address: 'জাঙ্গালিয়া, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'due', createdAt: '2025-01-06' },
  { id: 'alim-04', studentId: 'STD-2025-004', name: 'Md. Junaid Ahmed', nameBn: 'মো. জুনায়েদ আহমেদ', fatherName: 'Md. Habibur Rahman', motherName: 'Taslima Begum', class: 'class-alim-1', section: 'A', roll: 4, session: '2025-26', dob: '2007-02-14', gender: 'Male', religion: 'Islam', phone: '01811001004', address: 'নারান্দি, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-06' },
  { id: 'alim-05', studentId: 'STD-2025-005', name: 'Mohammad Imtiaz Hossain', nameBn: 'মোহাম্মদ ইমতিয়াজ হোসেন', fatherName: 'Mohammad Hafizur Rahman', motherName: 'Nasrin Akter', class: 'class-alim-1', section: 'A', roll: 5, session: '2025-26', dob: '2006-09-30', gender: 'Male', religion: 'Islam', phone: '01911001005', address: 'পাকুন্দিয়া সদর, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-07' },
  { id: 'alim-06', studentId: 'STD-2025-006', name: 'Md. Mahfuzur Rahman', nameBn: 'মো. মাহফুজুর রহমান', fatherName: 'Md. Lutfor Rahman', motherName: 'Minara Begum', class: 'class-alim-1', section: 'A', roll: 6, session: '2025-26', dob: '2007-05-18', gender: 'Male', religion: 'Islam', phone: '01611001006', address: 'এগারসিন্দুর, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'partial', createdAt: '2025-01-07' },
  { id: 'alim-07', studentId: 'STD-2025-007', name: 'Mohammad Salahuddin', nameBn: 'মোহাম্মদ সালাহউদ্দিন', fatherName: 'Mohammad Abdul Karim', motherName: 'Fatema Khatun', class: 'class-alim-1', section: 'A', roll: 7, session: '2025-26', dob: '2006-12-22', gender: 'Male', religion: 'Islam', phone: '01511001007', address: 'চাঁদপুর, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-08' },
  { id: 'alim-08', studentId: 'STD-2025-008', name: 'Md. Ariful Haq', nameBn: 'মো. আরিফুল হক', fatherName: 'Md. Fazlur Rahman', motherName: 'Rehana Begum', class: 'class-alim-1', section: 'A', roll: 8, session: '2025-26', dob: '2007-08-05', gender: 'Male', religion: 'Islam', phone: '01711001008', address: 'হোসেন্দি, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'due', createdAt: '2025-01-08' },
  { id: 'alim-09', studentId: 'STD-2025-009', name: 'Md. Tawhidur Rahman', nameBn: 'মো. তাওহীদুর রহমান', fatherName: 'Mohammad Nurul Islam', motherName: 'Sufia Khatun', class: 'class-alim-1', section: 'A', roll: 9, session: '2025-26', dob: '2006-04-17', gender: 'Male', religion: 'Islam', phone: '01811001009', address: 'জাঙ্গালিয়া, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-09' },
  { id: 'alim-10', studentId: 'STD-2025-010', name: 'Md. Nasirul Islam', nameBn: 'মো. নাসিরুল ইসলাম', fatherName: 'Md. Shahidul Islam', motherName: 'Roksana Begum', class: 'class-alim-1', section: 'A', roll: 10, session: '2025-26', dob: '2007-01-28', gender: 'Male', religion: 'Islam', phone: '01911001010', address: 'নারান্দি, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-09' },
  { id: 'alim-11', studentId: 'STD-2025-011', name: 'Md. Omar Faruk', nameBn: 'মো. ওমর ফারুক', fatherName: 'Md. Abul Hossain', motherName: 'Nargis Begum', class: 'class-alim-1', section: 'A', roll: 11, session: '2025-26', dob: '2006-10-03', gender: 'Male', religion: 'Islam', phone: '01611001011', address: 'পাকুন্দিয়া সদর, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'partial', createdAt: '2025-01-10' },
  { id: 'alim-12', studentId: 'STD-2025-012', name: 'Mohammad Yusuf Ali', nameBn: 'মোহাম্মদ ইউসুফ আলী', fatherName: 'Mohammad Amir Ali', motherName: 'Jamila Khatun', class: 'class-alim-1', section: 'A', roll: 12, session: '2025-26', dob: '2007-06-11', gender: 'Male', religion: 'Islam', phone: '01511001012', address: 'এগারসিন্দুর, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'due', createdAt: '2025-01-10' },
  { id: 'alim-13', studentId: 'STD-2025-013', name: 'Mosammat Ayesha Siddika', nameBn: 'মোসাম্মত আয়েশা সিদ্দিকা', fatherName: 'Md. Badrul Alam', motherName: 'Salma Begum', class: 'class-alim-1', section: 'A', roll: 13, session: '2025-26', dob: '2006-08-20', gender: 'Female', religion: 'Islam', phone: '01711001013', address: 'হোসেন্দি, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-11' },
  { id: 'alim-14', studentId: 'STD-2025-014', name: 'Mosammat Khadija Khanam', nameBn: 'মোসাম্মত খাদিজা খানম', fatherName: 'Mohammad Abdul Mannan', motherName: 'Amena Khatun', class: 'class-alim-1', section: 'A', roll: 14, session: '2025-26', dob: '2007-03-07', gender: 'Female', religion: 'Islam', phone: '01811001014', address: 'জাঙ্গালিয়া, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-11' },
  { id: 'alim-15', studentId: 'STD-2025-015', name: 'Mosammat Hafsa Begum', nameBn: 'মোসাম্মত হাফসা বেগম', fatherName: 'Md. Ruhul Amin', motherName: 'Kulsum Begum', class: 'class-alim-1', section: 'A', roll: 15, session: '2025-26', dob: '2006-11-15', gender: 'Female', religion: 'Islam', phone: '01911001015', address: 'নারান্দি, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'due', createdAt: '2025-01-12' },
  { id: 'alim-16', studentId: 'STD-2025-016', name: 'Mosammat Rahela Khatun', nameBn: 'মোসাম্মত রাহেলা খাতুন', fatherName: 'Mohammad Nurul Huda', motherName: 'Rahima Begum', class: 'class-alim-1', section: 'A', roll: 16, session: '2025-26', dob: '2007-07-22', gender: 'Female', religion: 'Islam', phone: '01611001016', address: 'পাকুন্দিয়া সদর, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-12' },
  { id: 'alim-17', studentId: 'STD-2025-017', name: 'Mosammat Mariyam Akter', nameBn: 'মোসাম্মত মারিয়াম আক্তার', fatherName: 'Md. Bashir Ahmed', motherName: 'Monowara Begum', class: 'class-alim-1', section: 'A', roll: 17, session: '2025-26', dob: '2006-05-09', gender: 'Female', religion: 'Islam', phone: '01511001017', address: 'এগারসিন্দুর, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-13' },
  { id: 'alim-18', studentId: 'STD-2025-018', name: 'Mosammat Jannatul Ferdous', nameBn: 'মোসাম্মত জান্নাতুল ফেরদৌস', fatherName: 'Mohammad Ismail Hossain', motherName: 'Hasina Khatun', class: 'class-alim-1', section: 'A', roll: 18, session: '2025-26', dob: '2007-09-16', gender: 'Female', religion: 'Islam', phone: '01711001018', address: 'হোসেন্দি, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'partial', createdAt: '2025-01-13' },
  { id: 'alim-19', studentId: 'STD-2025-019', name: 'Mosammat Sumaiya Begum', nameBn: 'মোসাম্মত সুমাইয়া বেগম', fatherName: 'Md. Moniruzzaman', motherName: 'Bilkis Begum', class: 'class-alim-1', section: 'A', roll: 19, session: '2025-26', dob: '2006-02-28', gender: 'Female', religion: 'Islam', phone: '01811001019', address: 'চাঁদপুর, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'due', createdAt: '2025-01-14' },
  { id: 'alim-20', studentId: 'STD-2025-020', name: 'Mosammat Nafisa Islam', nameBn: 'মোসাম্মত নাফিসা ইসলাম', fatherName: 'Mohammad Abdur Rahman', motherName: 'Saleha Begum', class: 'class-alim-1', section: 'A', roll: 20, session: '2025-26', dob: '2007-04-01', gender: 'Female', religion: 'Islam', phone: '01911001020', address: 'জাঙ্গালিয়া, পাকুন্দিয়া, কিশোরগঞ্জ', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2025-01-14' },
];

export const TEACHERS: Teacher[] = [
  { id: 't1', teacherId: 'TCH-001', name: 'Maulana Abdul Haque', nameBn: 'মাওলানা আব্দুল হক', designation: 'Principal', department: 'Quran & Hadith', subject: ['Quran Majid', 'Hadith Sharif'], classes: ['class-9', 'class-10'], phone: '01711111111', email: 'principal@madrasha.edu.bd', address: 'Dhaka', qualification: 'Kamil (Hadith), Islamic University', joinDate: '2010-01-15', image: '' },
  { id: 't2', teacherId: 'TCH-002', name: 'Md. Mahbubur Rahman', nameBn: 'মো. মাহবুবুর রহমান', designation: 'Assistant Teacher', department: 'Arabic', subject: ['Arabic Language', 'Arabic Literature'], classes: ['class-6', 'class-7', 'class-8'], phone: '01722222222', email: 'mahbub@madrasha.edu.bd', address: 'Dhaka', qualification: 'Kamil (Adab), Islamic University', joinDate: '2015-03-10', image: '' },
  { id: 't3', teacherId: 'TCH-003', name: 'Md. Shafiqul Islam', nameBn: 'মো. শফিকুল ইসলাম', designation: 'Assistant Teacher', department: 'Mathematics & Science', subject: ['Mathematics', 'General Science'], classes: ['class-8', 'class-9', 'class-10'], phone: '01733333333', email: 'shafiq@madrasha.edu.bd', address: 'Dhaka', qualification: 'B.Sc, Dhaka University', joinDate: '2016-06-01', image: '' },
  { id: 't4', teacherId: 'TCH-004', name: 'Mst. Hosneara Begum', nameBn: 'মোস্ত. হোসনেয়ারা বেগম', designation: 'Assistant Teacher', department: 'Bengali & English', subject: ['Bengali', 'English'], classes: ['class-6', 'class-7'], phone: '01744444444', email: 'hosneara@madrasha.edu.bd', address: 'Dhaka', qualification: 'M.A (Bengali), Dhaka University', joinDate: '2018-09-05', image: '' },
  { id: 't5', teacherId: 'TCH-005', name: 'Maulana Mizanur Rahman', nameBn: 'মাওলানা মিজানুর রহমান', designation: 'Senior Teacher', department: 'Fiqh & Aqeedah', subject: ['Aqeedah & Fiqh', 'Hadith & Fiqh', 'Islamic History'], classes: ['class-8', 'class-9', 'class-10'], phone: '01755555555', email: 'mizan@madrasha.edu.bd', address: 'Dhaka', qualification: 'Kamil (Fiqh), Islamic University', joinDate: '2012-07-20', image: '' },
  { id: 't6', teacherId: 'TCH-006', name: 'Md. Anisur Rahman', nameBn: 'মো. আনিসুর রহমান', designation: 'Assistant Teacher', department: 'Ebtedayi', subject: ['Bengali', 'English', 'Mathematics', 'Quran Majid'], classes: ['class-1', 'class-2', 'class-3'], phone: '01766666666', email: 'anis@madrasha.edu.bd', address: 'Dhaka', qualification: 'B.A, National University', joinDate: '2019-01-10', image: '' },
];

export const NOTICES: Notice[] = [
  { id: 'n1', title: 'দাখিল পরীক্ষার ফরম পূরণ নোটিশ', content: 'আগামী ১৫ জুলাই ২০২৪ থেকে দাখিল পরীক্ষার ফরম পূরণ শুরু হবে। সকল ছাত্রছাত্রীদের নির্ধারিত সময়ের মধ্যে ফরম পূরণ করতে হবে।', date: '2024-06-01', type: 'exam', target: 'all', isImportant: true, postedBy: 'Admin' },
  { id: 'n2', title: 'বার্ষিক পরীক্ষার সময়সূচী', content: 'আগামী ১ নভেম্বর থেকে বার্ষিক পরীক্ষা শুরু হবে। পরীক্ষার সময়সূচী পরবর্তীতে জানানো হবে।', date: '2024-05-25', type: 'exam', target: 'all', isImportant: true, postedBy: 'Admin' },
  { id: 'n3', title: 'মাসিক বেতন পরিশোধের নোটিশ', content: 'আগামী ১০ জুনের মধ্যে মাসিক বেতন পরিশোধ করতে হবে। অন্যথায় বিলম্ব মাশুল আরোপ করা হবে।', date: '2024-06-01', type: 'fee', target: 'student', isImportant: true, postedBy: 'Admin' },
  { id: 'n4', title: 'শিক্ষক প্রশিক্ষণ কর্মশালা', content: 'আগামী ২০ জুন শিক্ষক প্রশিক্ষণ কর্মশালা অনুষ্ঠিত হবে। সকল শিক্ষকদের উপস্থিত থাকতে অনুরোধ করা হচ্ছে।', date: '2024-06-05', type: 'general', target: 'teacher', isImportant: false, postedBy: 'Admin' },
  { id: 'n5', title: 'ঈদুল আযহা উপলক্ষে ছুটির নোটিশ', content: 'ঈদুল আযহা উপলক্ষে ১৬ জুন থেকে ২৫ জুন পর্যন্ত মাদ্রাসা বন্ধ থাকবে।', date: '2024-06-10', type: 'holiday', target: 'all', isImportant: false, postedBy: 'Admin' },
  { id: 'n6', title: 'অর্ধবার্ষিক পরীক্ষার ফলাফল', content: 'অর্ধবার্ষিক পরীক্ষার ফলাফল প্রকাশিত হয়েছে। শিক্ষার্থীরা তাদের রোল নম্বর দিয়ে ফলাফল দেখতে পারবে।', date: '2024-05-20', type: 'result', target: 'all', isImportant: false, postedBy: 'Admin' },
];

// Static seed results — uses updated SubjectResult shape
export const EXAM_RESULTS: ExamResult[] = [
  {
    studentId: 's1', studentName: 'Mohammad Rafiqul Islam', class: 'class-10', roll: 1,
    subjects: [
      { name: 'Quran Majid & Tajwid', fullMark: 100, cqMarks: 85, mcqMarks: 0, practicalMarks: 0, marks: 85, grade: 'A+', gpa: 5.0, isPassed: true },
      { name: 'Hadith Sharif',        fullMark: 100, cqMarks: 78, mcqMarks: 0, practicalMarks: 0, marks: 78, grade: 'A',  gpa: 4.0, isPassed: true },
      { name: 'Arabic 1st Paper',     fullMark: 100, cqMarks: 72, mcqMarks: 0, practicalMarks: 0, marks: 72, grade: 'A-', gpa: 3.5, isPassed: true },
      { name: 'Arabic 2nd Paper',     fullMark: 100, cqMarks: 68, mcqMarks: 0, practicalMarks: 0, marks: 68, grade: 'A-', gpa: 3.5, isPassed: true },
      { name: 'Bengali 1st Paper',    fullMark: 100, cqMarks: 60, mcqMarks: 20, practicalMarks: 0, marks: 80, grade: 'A+', gpa: 5.0, isPassed: true },
      { name: 'English 1st Paper',    fullMark: 100, cqMarks: 65, mcqMarks: 0, practicalMarks: 0, marks: 65, grade: 'A-', gpa: 3.5, isPassed: true },
      { name: 'Mathematics',          fullMark: 100, cqMarks: 60, mcqMarks: 28, practicalMarks: 0, marks: 88, grade: 'A+', gpa: 5.0, isPassed: true },
      { name: 'Islamic History',      fullMark: 100, cqMarks: 52, mcqMarks: 23, practicalMarks: 0, marks: 75, grade: 'A',  gpa: 4.0, isPassed: true },
      { name: 'Aqaid & Fiqh',        fullMark: 100, cqMarks: 90, mcqMarks: 0, practicalMarks: 0, marks: 90, grade: 'A+', gpa: 5.0, isPassed: true },
      { name: 'ICT',                  fullMark: 50,  cqMarks: 0,  mcqMarks: 20, practicalMarks: 22, marks: 42, grade: 'A+', gpa: 5.0, isPassed: true },
    ],
    totalMarks: 761, totalFullMarks: 950, percentage: 80.1, gpa: 4.35, grade: 'A+', status: 'pass', examName: 'অর্ধবার্ষিক পরীক্ষা', year: '2024'
  },
  {
    studentId: 's2', studentName: 'Fatema Akter', class: 'class-10', roll: 2,
    subjects: [
      { name: 'Quran Majid & Tajwid', fullMark: 100, cqMarks: 75, mcqMarks: 0, practicalMarks: 0, marks: 75, grade: 'A',  gpa: 4.0, isPassed: true },
      { name: 'Hadith Sharif',        fullMark: 100, cqMarks: 70, mcqMarks: 0, practicalMarks: 0, marks: 70, grade: 'A',  gpa: 4.0, isPassed: true },
      { name: 'Arabic 1st Paper',     fullMark: 100, cqMarks: 65, mcqMarks: 0, practicalMarks: 0, marks: 65, grade: 'A-', gpa: 3.5, isPassed: true },
      { name: 'Arabic 2nd Paper',     fullMark: 100, cqMarks: 62, mcqMarks: 0, practicalMarks: 0, marks: 62, grade: 'A-', gpa: 3.5, isPassed: true },
      { name: 'Bengali 1st Paper',    fullMark: 100, cqMarks: 50, mcqMarks: 22, practicalMarks: 0, marks: 72, grade: 'A-', gpa: 3.5, isPassed: true },
      { name: 'English 1st Paper',    fullMark: 100, cqMarks: 58, mcqMarks: 0, practicalMarks: 0, marks: 58, grade: 'B',  gpa: 3.0, isPassed: true },
      { name: 'Mathematics',          fullMark: 100, cqMarks: 38, mcqMarks: 17, practicalMarks: 0, marks: 55, grade: 'B',  gpa: 3.0, isPassed: true },
      { name: 'Islamic History',      fullMark: 100, cqMarks: 48, mcqMarks: 20, practicalMarks: 0, marks: 68, grade: 'A-', gpa: 3.5, isPassed: true },
      { name: 'Aqaid & Fiqh',        fullMark: 100, cqMarks: 80, mcqMarks: 0, practicalMarks: 0, marks: 80, grade: 'A+', gpa: 5.0, isPassed: true },
      { name: 'ICT',                  fullMark: 50,  cqMarks: 0,  mcqMarks: 16, practicalMarks: 18, marks: 34, grade: 'A-', gpa: 3.5, isPassed: true },
    ],
    totalMarks: 639, totalFullMarks: 950, percentage: 67.3, gpa: 3.65, grade: 'A-', status: 'pass', examName: 'অর্ধবার্ষিক পরীক্ষা', year: '2024'
  },
];

export const FEES: Fee[] = [
  { id: 'f1', studentId: 's1', studentName: 'Mohammad Rafiqul Islam', class: 'class-10', feeType: 'মাসিক বেতন (জানুয়ারি)', amount: 500, dueDate: '2024-01-15', paidDate: '2024-01-10', status: 'paid', receiptNo: 'RCP-2024-001' },
  { id: 'f2', studentId: 's1', studentName: 'Mohammad Rafiqul Islam', class: 'class-10', feeType: 'মাসিক বেতন (ফেব্রুয়ারি)', amount: 500, dueDate: '2024-02-15', paidDate: '2024-02-12', status: 'paid', receiptNo: 'RCP-2024-002' },
  { id: 'f3', studentId: 's1', studentName: 'Mohammad Rafiqul Islam', class: 'class-10', feeType: 'পরীক্ষা ফি', amount: 800, dueDate: '2024-05-30', paidDate: '2024-05-25', status: 'paid', receiptNo: 'RCP-2024-003' },
  { id: 'f4', studentId: 's2', studentName: 'Fatema Akter', class: 'class-10', feeType: 'মাসিক বেতন (জানুয়ারি)', amount: 500, dueDate: '2024-01-15', paidDate: '2024-01-14', status: 'paid', receiptNo: 'RCP-2024-004' },
  { id: 'f5', studentId: 's2', studentName: 'Fatema Akter', class: 'class-10', feeType: 'মাসিক বেতন (ফেব্রুয়ারি)', amount: 500, dueDate: '2024-02-15', status: 'due' },
  { id: 'f6', studentId: 's2', studentName: 'Fatema Akter', class: 'class-10', feeType: 'পরীক্ষা ফি', amount: 800, dueDate: '2024-05-30', status: 'due' },
];

export const EXAM_SCHEDULE: ExamSchedule[] = [
  { id: 'es1', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-01', startTime: '10:00', endTime: '13:00', subject: 'Quran Majid & Tajwid', room: 'Room 101' },
  { id: 'es2', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-03', startTime: '10:00', endTime: '13:00', subject: 'Hadith Sharif', room: 'Room 101' },
  { id: 'es3', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-05', startTime: '10:00', endTime: '13:00', subject: 'Arabic 1st Paper', room: 'Room 102' },
  { id: 'es4', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-07', startTime: '10:00', endTime: '13:00', subject: 'Bengali 1st Paper', room: 'Room 101' },
  { id: 'es5', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-10', startTime: '10:00', endTime: '13:00', subject: 'English 1st Paper', room: 'Room 103' },
  { id: 'es6', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-12', startTime: '10:00', endTime: '13:00', subject: 'Mathematics', room: 'Room 102' },
];

export const SYLLABUS: Syllabus[] = [
  { class: 'class-10', subject: 'Quran Majid & Tajwid', chapter: 'সূরা আল-বাকারা (১-৫০ আয়াত)', topics: ['তাফসীর', 'হিফয', 'তাজউইদ'], status: 'completed' },
  { class: 'class-10', subject: 'Quran Majid & Tajwid', chapter: 'সূরা আল-ইমরান (১-৩০ আয়াত)', topics: ['তাফসীর', 'বাংলা অনুবাদ'], status: 'completed' },
  { class: 'class-10', subject: 'Mathematics', chapter: 'বীজগাণিতিক রাশি', topics: ['বহুপদী', 'উৎপাদকে বিশ্লেষণ', 'সূত্রাবলী'], status: 'ongoing' },
  { class: 'class-10', subject: 'Mathematics', chapter: 'সেট ও ফাংশন', topics: ['সেটের ধারণা', 'সেটের প্রকারভেদ', 'ফাংশনের ধারণা'], status: 'pending' },
  { class: 'class-10', subject: 'English 1st Paper', chapter: 'Reading Comprehension', topics: ['Passage 1-5', 'Summary Writing'], status: 'completed' },
  { class: 'class-10', subject: 'English 1st Paper', chapter: 'Grammar & Composition', topics: ['Tense', 'Voice', 'Narration', 'Essay Writing'], status: 'ongoing' },
];

export const NOTES: Note[] = [
  { id: 'note1', title: 'Quran Majid - সূরা ইয়াসিনের তাফসীর নোট', content: 'সূরা ইয়াসিনের প্রথম ১০ আয়াতের বিস্তারিত তাফসীর এবং শিক্ষার্থীদের জন্য গুরুত্বপূর্ণ নোট।', class: 'class-10', subject: 'Quran Majid & Tajwid', teacherId: 't1', teacherName: 'Maulana Abdul Haque', createdAt: '2024-05-15', type: 'note' },
  { id: 'note2', title: 'Mathematics - বীজগণিত সাজেশন', content: 'বার্ষিক পরীক্ষার জন্য গণিতের গুরুত্বপূর্ণ প্রশ্নসমূহ এবং সমাধান পদ্ধতি।', class: 'class-10', subject: 'Mathematics', teacherId: 't3', teacherName: 'Md. Shafiqul Islam', createdAt: '2024-05-20', type: 'suggestion' },
  { id: 'note3', title: 'English Grammar Notes', content: 'Complete grammar notes covering tense, voice, narration, and essay writing for the annual exam.', class: 'class-10', subject: 'English 1st Paper', teacherId: 't4', teacherName: 'Mst. Hosneara Begum', createdAt: '2024-05-22', type: 'note' },
];

export const ROUTINE_DATA = [
  { day: 'Saturday', periods: [
    { time: '08:00-08:45', subject: 'Quran Majid & Tajwid', teacher: 'Maulana Abdul Haque', class: 'class-10' },
    { time: '08:45-09:30', subject: 'Mathematics', teacher: 'Md. Shafiqul Islam', class: 'class-10' },
    { time: '09:30-10:15', subject: 'Bengali 1st Paper', teacher: 'Mst. Hosneara Begum', class: 'class-10' },
    { time: '10:15-10:30', subject: 'Break', teacher: '', class: '' },
    { time: '10:30-11:15', subject: 'Arabic 1st Paper', teacher: 'Md. Mahbubur Rahman', class: 'class-10' },
    { time: '11:15-12:00', subject: 'English 1st Paper', teacher: 'Mst. Hosneara Begum', class: 'class-10' },
  ]},
  { day: 'Sunday', periods: [
    { time: '08:00-08:45', subject: 'Hadith Sharif', teacher: 'Maulana Abdul Haque', class: 'class-10' },
    { time: '08:45-09:30', subject: 'Science', teacher: 'Md. Shafiqul Islam', class: 'class-10' },
    { time: '09:30-10:15', subject: 'Aqaid & Fiqh', teacher: 'Maulana Mizanur Rahman', class: 'class-10' },
    { time: '10:15-10:30', subject: 'Break', teacher: '', class: '' },
    { time: '10:30-11:15', subject: 'Islamic History', teacher: 'Maulana Mizanur Rahman', class: 'class-10' },
    { time: '11:15-12:00', subject: 'Arabic 2nd Paper', teacher: 'Md. Mahbubur Rahman', class: 'class-10' },
  ]},
];

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
