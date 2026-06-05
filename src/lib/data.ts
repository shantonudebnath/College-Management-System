import type { Student, Teacher, ClassInfo, Subject, ExamResult, Fee, Notice, ExamSchedule, Note, Syllabus } from './types';

export const MADRASHA_CLASSES = [
  { id: 'class-1', name: 'Class 1', nameBn: '১ম শ্রেণি', level: 'ebtedayi' },
  { id: 'class-2', name: 'Class 2', nameBn: '২য় শ্রেণি', level: 'ebtedayi' },
  { id: 'class-3', name: 'Class 3', nameBn: '৩য় শ্রেণি', level: 'ebtedayi' },
  { id: 'class-4', name: 'Class 4', nameBn: '৪র্থ শ্রেণি', level: 'ebtedayi' },
  { id: 'class-5', name: 'Class 5', nameBn: '৫ম শ্রেণি', level: 'ebtedayi' },
  { id: 'class-6', name: 'Class 6', nameBn: '৬ষ্ঠ শ্রেণি', level: 'junior-dakhil' },
  { id: 'class-7', name: 'Class 7', nameBn: '৭ম শ্রেণি', level: 'junior-dakhil' },
  { id: 'class-8', name: 'Class 8', nameBn: '৮ম শ্রেণি', level: 'junior-dakhil' },
  { id: 'class-9', name: 'Class 9', nameBn: '৯ম শ্রেণি', level: 'dakhil' },
  { id: 'class-10', name: 'Class 10 (Dakhil)', nameBn: 'দাখিল', level: 'dakhil' },
];

export const SUBJECTS_BY_CLASS: Record<string, Subject[]> = {
  'class-1': [
    { name: 'Quran Majid', nameBn: 'কুরআন মজিদ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic', nameBn: 'আরবি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bengali', nameBn: 'বাংলা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'English', nameBn: 'ইংরেজি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Mathematics', nameBn: 'গণিত', fullMark: 100, passMark: 33, type: 'theory' },
  ],
  'class-2': [
    { name: 'Quran Majid', nameBn: 'কুরআন মজিদ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic', nameBn: 'আরবি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bengali', nameBn: 'বাংলা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'English', nameBn: 'ইংরেজি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Mathematics', nameBn: 'গণিত', fullMark: 100, passMark: 33, type: 'theory' },
  ],
  'class-3': [
    { name: 'Quran Majid', nameBn: 'কুরআন মজিদ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic', nameBn: 'আরবি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bengali', nameBn: 'বাংলা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'English', nameBn: 'ইংরেজি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Mathematics', nameBn: 'গণিত', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Islamic Studies', nameBn: 'ইসলাম শিক্ষা', fullMark: 100, passMark: 33, type: 'theory' },
  ],
  'class-4': [
    { name: 'Quran Majid', nameBn: 'কুরআন মজিদ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic', nameBn: 'আরবি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bengali', nameBn: 'বাংলা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'English', nameBn: 'ইংরেজি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Mathematics', nameBn: 'গণিত', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Islamic Studies', nameBn: 'ইসলাম শিক্ষা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bangladesh Studies', nameBn: 'বাংলাদেশ পরিচয়', fullMark: 100, passMark: 33, type: 'theory' },
  ],
  'class-5': [
    { name: 'Quran Majid', nameBn: 'কুরআন মজিদ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic', nameBn: 'আরবি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bengali', nameBn: 'বাংলা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'English', nameBn: 'ইংরেজি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Mathematics', nameBn: 'গণিত', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Islamic Studies', nameBn: 'ইসলাম শিক্ষা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bangladesh Studies', nameBn: 'বাংলাদেশ পরিচয়', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Science', nameBn: 'বিজ্ঞান', fullMark: 100, passMark: 33, type: 'theory' },
  ],
  'class-6': [
    { name: 'Quran Majid & Tajwid', nameBn: 'কুরআন মজিদ ও তাজউইদ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic Language', nameBn: 'আরবি ভাষা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Hadith & Fiqh', nameBn: 'হাদিস ও ফিকহ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bengali', nameBn: 'বাংলা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'English', nameBn: 'ইংরেজি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Mathematics', nameBn: 'গণিত', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Science', nameBn: 'বিজ্ঞান', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Islamic History', nameBn: 'ইসলামের ইতিহাস', fullMark: 100, passMark: 33, type: 'theory' },
  ],
  'class-7': [
    { name: 'Quran Majid & Tajwid', nameBn: 'কুরআন মজিদ ও তাজউইদ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic Language', nameBn: 'আরবি ভাষা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Hadith & Fiqh', nameBn: 'হাদিস ও ফিকহ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bengali', nameBn: 'বাংলা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'English', nameBn: 'ইংরেজি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Mathematics', nameBn: 'গণিত', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Science', nameBn: 'বিজ্ঞান', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Islamic History', nameBn: 'ইসলামের ইতিহাস', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Agriculture', nameBn: 'কৃষি শিক্ষা', fullMark: 100, passMark: 33, type: 'theory' },
  ],
  'class-8': [
    { name: 'Quran Majid & Tajwid', nameBn: 'কুরআন মজিদ ও তাজউইদ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic Language & Literature', nameBn: 'আরবি ভাষা ও সাহিত্য', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Hadith & Fiqh', nameBn: 'হাদিস ও ফিকহ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bengali Language & Literature', nameBn: 'বাংলা ভাষা ও সাহিত্য', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'English Language', nameBn: 'ইংরেজি ভাষা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Mathematics', nameBn: 'গণিত', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'General Science', nameBn: 'সাধারণ বিজ্ঞান', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Islamic History & Culture', nameBn: 'ইসলামের ইতিহাস ও সংস্কৃতি', fullMark: 100, passMark: 33, type: 'theory' },
  ],
  'class-9': [
    { name: 'Quran Majid', nameBn: 'কুরআন মজিদ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Hadith Sharif', nameBn: 'হাদিস শরীফ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic 1st Paper', nameBn: 'আরবি ১ম পত্র', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic 2nd Paper', nameBn: 'আরবি ২য় পত্র', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bengali', nameBn: 'বাংলা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'English', nameBn: 'ইংরেজি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Mathematics', nameBn: 'গণিত', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'General Science', nameBn: 'সাধারণ বিজ্ঞান', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Islamic History', nameBn: 'ইসলামের ইতিহাস', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Aqeedah & Fiqh', nameBn: 'আকায়েদ ও ফিকহ', fullMark: 100, passMark: 33, type: 'theory' },
  ],
  'class-10': [
    { name: 'Quran Majid', nameBn: 'কুরআন মজিদ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Hadith Sharif', nameBn: 'হাদিস শরীফ', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic 1st Paper', nameBn: 'আরবি ১ম পত্র', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Arabic 2nd Paper', nameBn: 'আরবি ২য় পত্র', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Bengali', nameBn: 'বাংলা', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'English', nameBn: 'ইংরেজি', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Mathematics', nameBn: 'গণিত', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'General Science', nameBn: 'সাধারণ বিজ্ঞান', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Islamic History', nameBn: 'ইসলামের ইতিহাস', fullMark: 100, passMark: 33, type: 'theory' },
    { name: 'Aqeedah & Fiqh', nameBn: 'আকায়েদ ও ফিকহ', fullMark: 100, passMark: 33, type: 'theory' },
  ],
};

export const GRADE_SCALE = [
  { min: 80, max: 100, grade: 'A+', gpa: 5.0, label: 'Outstanding' },
  { min: 70, max: 79, grade: 'A', gpa: 4.0, label: 'Excellent' },
  { min: 60, max: 69, grade: 'A-', gpa: 3.5, label: 'Very Good' },
  { min: 50, max: 59, grade: 'B', gpa: 3.0, label: 'Good' },
  { min: 40, max: 49, grade: 'C', gpa: 2.0, label: 'Average' },
  { min: 33, max: 39, grade: 'D', gpa: 1.0, label: 'Below Average' },
  { min: 0, max: 32, grade: 'F', gpa: 0.0, label: 'Fail' },
];

export const STUDENTS: Student[] = [
  { id: 's1', studentId: 'STD-2024-001', name: 'Mohammad Rafiqul Islam', nameBn: 'মোহাম্মদ রফিকুল ইসলাম', fatherName: 'Mohammad Kamal Uddin', motherName: 'Fatema Begum', class: 'class-10', section: 'A', roll: 1, session: '2024-25', dob: '2008-05-15', gender: 'Male', religion: 'Islam', phone: '01712345678', address: 'Dhaka, Bangladesh', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2024-01-10' },
  { id: 's2', studentId: 'STD-2024-002', name: 'Fatema Akter', nameBn: 'ফাতেমা আক্তার', fatherName: 'Abdul Karim', motherName: 'Rahela Begum', class: 'class-10', section: 'A', roll: 2, session: '2024-25', dob: '2008-08-22', gender: 'Female', religion: 'Islam', phone: '01812345678', address: 'Chittagong, Bangladesh', registrationStatus: 'approved', feeStatus: 'due', createdAt: '2024-01-12' },
  { id: 's3', studentId: 'STD-2024-003', name: 'Md. Shahidul Alam', nameBn: 'মো. শাহিদুল আলম', fatherName: 'Shahjahan Ali', motherName: 'Moriam Begum', class: 'class-9', section: 'A', roll: 1, session: '2024-25', dob: '2009-03-10', gender: 'Male', religion: 'Islam', phone: '01912345678', address: 'Sylhet, Bangladesh', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2024-01-15' },
  { id: 's4', studentId: 'STD-2024-004', name: 'Nusrat Jahan', nameBn: 'নুসরাত জাহান', fatherName: 'Md. Rashidul Haque', motherName: 'Shirin Akter', class: 'class-8', section: 'A', roll: 3, session: '2024-25', dob: '2010-11-05', gender: 'Female', religion: 'Islam', phone: '01612345678', address: 'Rajshahi, Bangladesh', registrationStatus: 'approved', feeStatus: 'partial', createdAt: '2024-01-18' },
  { id: 's5', studentId: 'STD-2024-005', name: 'Md. Tariqul Hasan', nameBn: 'মো. তারিকুল হাসান', fatherName: 'Harunur Rashid', motherName: 'Taslima Begum', class: 'class-7', section: 'A', roll: 5, session: '2024-25', dob: '2011-07-20', gender: 'Male', religion: 'Islam', phone: '01512345678', address: 'Khulna, Bangladesh', registrationStatus: 'approved', feeStatus: 'paid', createdAt: '2024-01-20' },
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
  { id: 'n6', title: 'প্রথম সাময়িক পরীক্ষার ফলাফল', content: 'প্রথম সাময়িক পরীক্ষার ফলাফল প্রকাশিত হয়েছে। শিক্ষার্থীরা তাদের রোল নম্বর দিয়ে ফলাফল দেখতে পারবে।', date: '2024-05-20', type: 'result', target: 'all', isImportant: false, postedBy: 'Admin' },
];

export const EXAM_RESULTS: ExamResult[] = [
  {
    studentId: 's1', studentName: 'Mohammad Rafiqul Islam', class: 'class-10', roll: 1,
    subjects: [
      { name: 'Quran Majid', marks: 85, grade: 'A+' },
      { name: 'Hadith Sharif', marks: 78, grade: 'A' },
      { name: 'Arabic 1st Paper', marks: 72, grade: 'A-' },
      { name: 'Arabic 2nd Paper', marks: 68, grade: 'A-' },
      { name: 'Bengali', marks: 80, grade: 'A+' },
      { name: 'English', marks: 65, grade: 'A-' },
      { name: 'Mathematics', marks: 88, grade: 'A+' },
      { name: 'General Science', marks: 75, grade: 'A' },
      { name: 'Islamic History', marks: 82, grade: 'A+' },
      { name: 'Aqeedah & Fiqh', marks: 90, grade: 'A+' },
    ],
    totalMarks: 783, gpa: 4.89, grade: 'A+', status: 'pass', examName: 'প্রথম সাময়িক পরীক্ষা', year: '2024'
  },
  {
    studentId: 's2', studentName: 'Fatema Akter', class: 'class-10', roll: 2,
    subjects: [
      { name: 'Quran Majid', marks: 75, grade: 'A' },
      { name: 'Hadith Sharif', marks: 70, grade: 'A-' },
      { name: 'Arabic 1st Paper', marks: 65, grade: 'A-' },
      { name: 'Arabic 2nd Paper', marks: 62, grade: 'A-' },
      { name: 'Bengali', marks: 72, grade: 'A-' },
      { name: 'English', marks: 58, grade: 'B' },
      { name: 'Mathematics', marks: 55, grade: 'B' },
      { name: 'General Science', marks: 68, grade: 'A-' },
      { name: 'Islamic History', marks: 74, grade: 'A' },
      { name: 'Aqeedah & Fiqh', marks: 80, grade: 'A+' },
    ],
    totalMarks: 679, gpa: 3.85, grade: 'A', status: 'pass', examName: 'প্রথম সাময়িক পরীক্ষা', year: '2024'
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
  { id: 'es1', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-01', startTime: '10:00', endTime: '13:00', subject: 'Quran Majid', room: 'Room 101' },
  { id: 'es2', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-03', startTime: '10:00', endTime: '13:00', subject: 'Hadith Sharif', room: 'Room 101' },
  { id: 'es3', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-05', startTime: '10:00', endTime: '13:00', subject: 'Arabic 1st Paper', room: 'Room 102' },
  { id: 'es4', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-07', startTime: '10:00', endTime: '13:00', subject: 'Bengali', room: 'Room 101' },
  { id: 'es5', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-10', startTime: '10:00', endTime: '13:00', subject: 'English', room: 'Room 103' },
  { id: 'es6', examName: 'বার্ষিক পরীক্ষা ২০২৪', class: 'class-10', date: '2024-11-12', startTime: '10:00', endTime: '13:00', subject: 'Mathematics', room: 'Room 102' },
];

export const SYLLABUS: Syllabus[] = [
  { class: 'class-10', subject: 'Quran Majid', chapter: 'সূরা আল-বাকারা (১-৫০ আয়াত)', topics: ['তাফসীর', 'হিফয', 'তাজউইদ'], status: 'completed' },
  { class: 'class-10', subject: 'Quran Majid', chapter: 'সূরা আল-ইমরান (১-৩০ আয়াত)', topics: ['তাফসীর', 'বাংলা অনুবাদ'], status: 'completed' },
  { class: 'class-10', subject: 'Mathematics', chapter: 'বীজগাণিতিক রাশি', topics: ['বহুপদী', 'উৎপাদকে বিশ্লেষণ', 'সূত্রাবলী'], status: 'ongoing' },
  { class: 'class-10', subject: 'Mathematics', chapter: 'সেট ও ফাংশন', topics: ['সেটের ধারণা', 'সেটের প্রকারভেদ', 'ফাংশনের ধারণা'], status: 'pending' },
  { class: 'class-10', subject: 'English', chapter: 'Reading Comprehension', topics: ['Passage 1-5', 'Summary Writing'], status: 'completed' },
  { class: 'class-10', subject: 'English', chapter: 'Grammar & Composition', topics: ['Tense', 'Voice', 'Narration', 'Essay Writing'], status: 'ongoing' },
];

export const NOTES: Note[] = [
  { id: 'note1', title: 'Quran Majid - সূরা ইয়াসিনের তাফসীর নোট', content: 'সূরা ইয়াসিনের প্রথম ১০ আয়াতের বিস্তারিত তাফসীর এবং শিক্ষার্থীদের জন্য গুরুত্বপূর্ণ নোট।', class: 'class-10', subject: 'Quran Majid', teacherId: 't1', teacherName: 'Maulana Abdul Haque', createdAt: '2024-05-15', type: 'note' },
  { id: 'note2', title: 'Mathematics - বীজগণিত সাজেশন', content: 'বার্ষিক পরীক্ষার জন্য গণিতের গুরুত্বপূর্ণ প্রশ্নসমূহ এবং সমাধান পদ্ধতি।', class: 'class-10', subject: 'Mathematics', teacherId: 't3', teacherName: 'Md. Shafiqul Islam', createdAt: '2024-05-20', type: 'suggestion' },
  { id: 'note3', title: 'English Grammar Notes', content: 'Complete grammar notes covering tense, voice, narration, and essay writing for the annual exam.', class: 'class-10', subject: 'English', teacherId: 't4', teacherName: 'Mst. Hosneara Begum', createdAt: '2024-05-22', type: 'note' },
];

export const ROUTINE_DATA = [
  { day: 'Saturday', periods: [
    { time: '08:00-08:45', subject: 'Quran Majid', teacher: 'Maulana Abdul Haque', class: 'class-10' },
    { time: '08:45-09:30', subject: 'Mathematics', teacher: 'Md. Shafiqul Islam', class: 'class-10' },
    { time: '09:30-10:15', subject: 'Bengali', teacher: 'Mst. Hosneara Begum', class: 'class-10' },
    { time: '10:15-10:30', subject: 'Break', teacher: '', class: '' },
    { time: '10:30-11:15', subject: 'Arabic', teacher: 'Md. Mahbubur Rahman', class: 'class-10' },
    { time: '11:15-12:00', subject: 'English', teacher: 'Mst. Hosneara Begum', class: 'class-10' },
  ]},
  { day: 'Sunday', periods: [
    { time: '08:00-08:45', subject: 'Hadith Sharif', teacher: 'Maulana Abdul Haque', class: 'class-10' },
    { time: '08:45-09:30', subject: 'General Science', teacher: 'Md. Shafiqul Islam', class: 'class-10' },
    { time: '09:30-10:15', subject: 'Aqeedah & Fiqh', teacher: 'Maulana Mizanur Rahman', class: 'class-10' },
    { time: '10:15-10:30', subject: 'Break', teacher: '', class: '' },
    { time: '10:30-11:15', subject: 'Islamic History', teacher: 'Maulana Mizanur Rahman', class: 'class-10' },
    { time: '11:15-12:00', subject: 'Arabic', teacher: 'Md. Mahbubur Rahman', class: 'class-10' },
  ]},
];

export const COLLEGE_INFO = {
  name: 'Noor-E-Islam Madrasha',
  nameBn: 'নূরে ইসলাম মাদ্রাসা',
  address: '১২৩, ইসলামিক রোড, ঢাকা-১২১৫, বাংলাদেশ',
  phone: '02-9876543, 01711-000000',
  email: 'info@noorislammadrasha.edu.bd',
  website: 'www.noorislammadrasha.edu.bd',
  eiin: 'EIIN: 108xxx',
  established: '১৯৮৫',
  board: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড',
};
