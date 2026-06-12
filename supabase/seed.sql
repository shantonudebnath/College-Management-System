-- ============================================================
-- Seed Data for Noor-E-Islam Madrasha
-- Run this AFTER running 001_schema.sql
--
-- IMPORTANT: Create the admin user first via Supabase Dashboard:
--   Authentication > Users > Add User
--   Email: admin@noorislammadrasha.edu.bd
--   Password: (set a strong password)
--   User metadata: { "role": "admin", "display_id": "admin" }
-- ============================================================

-- Notices (sample data)
insert into public.notices (id, title, content, date, type, target, is_important, posted_by)
values
  ('notice-1', 'বার্ষিক পরীক্ষার সময়সূচি প্রকাশ', 'আগামী ১ ডিসেম্বর থেকে বার্ষিক পরীক্ষা শুরু হবে। সকল শিক্ষার্থীদের নির্ধারিত সময়ে পরীক্ষা কেন্দ্রে উপস্থিত থাকার নির্দেশ দেওয়া হচ্ছে।', '২০২৪-১১-১৫', 'exam', 'all', true, 'প্রধান শিক্ষক'),
  ('notice-2', 'মাসিক বেতন পরিশোধের নোটিশ', 'নভেম্বর মাসের বেতন ১৫ তারিখের মধ্যে পরিশোধ করতে হবে। বিলম্বে জরিমানা প্রযোজ্য।', '২০২৪-১১-০১', 'fee', 'student', false, 'হিসাব বিভাগ'),
  ('notice-3', 'শিক্ষক মিটিং', 'আগামীকাল বিকেল ৩টায় শিক্ষক মিটিং অনুষ্ঠিত হবে। সকল শিক্ষকদের উপস্থিত থাকার অনুরোধ।', '২০২৪-১১-১০', 'general', 'teacher', false, 'অধ্যক্ষ')
on conflict (id) do nothing;

-- Teachers (sample data - add more as needed)
insert into public.teachers (id, teacher_id, name, name_bn, designation, department, subject, classes, phone, email, address, qualification, join_date)
values
  ('t-1', 'NIM-T-001', 'Maulana Abdul Karim', 'মাওলানা আব্দুল করিম', 'প্রধান শিক্ষক', 'Islamic Studies', ARRAY['Quran Majid & Tajwid', 'Hadith Sharif'], ARRAY['class-9', 'class-10'], '01711-111111', 'akarim@noorislammadrasha.edu.bd', 'ঢাকা', 'কামিল (হাদিস)', '২০১০-০১-০১'),
  ('t-2', 'NIM-T-002', 'Md. Shafiqul Islam', 'মো. শফিকুল ইসলাম', 'সহকারী শিক্ষক', 'Science', ARRAY['General Science', 'Mathematics'], ARRAY['class-6', 'class-7', 'class-8'], '01722-222222', 'shafiq@noorislammadrasha.edu.bd', 'ঢাকা', 'বিএসসি (গণিত)', '২০১৫-০৬-০১'),
  ('t-3', 'NIM-T-003', 'Maulana Mizanur Rahman', 'মাওলানা মিজানুর রহমান', 'সহকারী শিক্ষক', 'Arabic', ARRAY['Arabic', 'Aqaid & Fiqh'], ARRAY['class-9', 'class-10', 'class-alim-1'], '01733-333333', 'mizan@noorislammadrasha.edu.bd', 'ঢাকা', 'ফাযিল', '২০১২-০৩-০১')
on conflict (id) do nothing;

-- Students (sample data)
insert into public.students (id, student_id, name, name_bn, father_name, mother_name, class, section, roll, session, dob, gender, religion, phone, address, registration_status, fee_status)
values
  ('s-1', 'NIM-2024-001', 'Mohammad Abdullah', 'মোহাম্মদ আব্দুল্লাহ', 'Mohammad Rafiqul Islam', 'Fatema Begum', 'class-10', 'A', 1, '২০২৩-২০২৪', '২০০৮-০৩-১৫', 'Male', 'Islam', '01811-111111', 'ঢাকা', 'approved', 'paid'),
  ('s-2', 'NIM-2024-002', 'Aisha Siddiqua', 'আয়েশা সিদ্দিকা', 'Mohammad Kamal Hossain', 'Rashida Begum', 'class-9', 'A', 2, '২০২৩-২০২৪', '২০০৯-০৭-২২', 'Female', 'Islam', '01822-222222', 'ঢাকা', 'approved', 'due'),
  ('s-3', 'NIM-2024-003', 'Omar Faruk', 'ওমর ফারুক', 'Abdul Jabbar', 'Nurjahan Begum', 'class-8', 'A', 3, '২০২৩-২০২৪', '২০১০-১১-০৫', 'Male', 'Islam', '01833-333333', 'ঢাকা', 'approved', 'partial')
on conflict (id) do nothing;

-- ============================================================
-- HOW TO CREATE USER ACCOUNTS IN SUPABASE:
--
-- For each teacher (e.g., NIM-T-001):
--   Supabase Dashboard > Authentication > Users > Add User
--   Email: nim-t-001@noorislammadrasha.edu.bd
--   Password: (set a password, share with teacher)
--   User metadata: { "role": "teacher", "display_id": "NIM-T-001" }
--
-- For each student (e.g., NIM-2024-001):
--   Email: nim-2024-001@noorislammadrasha.edu.bd
--   Password: (set a password, share with student)
--   User metadata: { "role": "student", "display_id": "NIM-2024-001" }
-- ============================================================
