-- ============================================================
-- Noor-e-Islam Madrasha — Supabase Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  student_id TEXT UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  name_bn TEXT DEFAULT '',
  father_name TEXT DEFAULT '',
  mother_name TEXT DEFAULT '',
  class TEXT DEFAULT '',
  section TEXT DEFAULT '',
  roll INTEGER DEFAULT 0,
  session TEXT DEFAULT '',
  dob TEXT DEFAULT '',
  gender TEXT DEFAULT '',
  religion TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  guardian_phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  blood_group TEXT DEFAULT '',
  birth_cert_no TEXT DEFAULT '',
  image TEXT,
  registration_status TEXT DEFAULT 'approved',
  fee_status TEXT DEFAULT 'due',
  created_at TEXT DEFAULT '',
  created_ts TIMESTAMPTZ DEFAULT now()
);

-- Fees table
CREATE TABLE IF NOT EXISTS fees (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  student_name TEXT DEFAULT '',
  class TEXT DEFAULT '',
  fee_type TEXT DEFAULT '',
  amount NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  due_date TEXT DEFAULT '',
  paid_date TEXT,
  status TEXT DEFAULT 'due',
  receipt_no TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Waivers table
CREATE TABLE IF NOT EXISTS waivers (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  student_name TEXT DEFAULT '',
  class TEXT DEFAULT '',
  waiver_type TEXT DEFAULT 'fixed',
  waiver_value NUMERIC DEFAULT 0,
  reason TEXT DEFAULT '',
  fee_types JSONB DEFAULT '[]',
  applied_date TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  student_name TEXT DEFAULT '',
  class TEXT DEFAULT '',
  roll INTEGER DEFAULT 0,
  section TEXT DEFAULT '',
  subjects JSONB DEFAULT '[]',
  total_marks NUMERIC DEFAULT 0,
  total_full_marks NUMERIC DEFAULT 0,
  percentage NUMERIC DEFAULT 0,
  gpa NUMERIC DEFAULT 0,
  grade TEXT DEFAULT '',
  status TEXT DEFAULT 'fail',
  exam_name TEXT DEFAULT '',
  year TEXT DEFAULT '',
  failed_subjects JSONB DEFAULT '[]',
  created_at TEXT DEFAULT ''
);

-- Published results
CREATE TABLE IF NOT EXISTS published_results (
  exam_name TEXT PRIMARY KEY
);

-- Attendance table (replaces dynamic localStorage keys)
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  class TEXT NOT NULL,
  date TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT DEFAULT '',
  status TEXT DEFAULT 'present',
  UNIQUE(class, date, student_id)
);

-- Key-Value store (replaces all other localStorage keys)
CREATE TABLE IF NOT EXISTS kv_store (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security — allow anon users (app has its own auth)
-- ============================================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE waivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE kv_store ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON students FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON fees FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON waivers FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON results FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON published_results FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON attendance FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON kv_store FOR ALL TO anon USING (true) WITH CHECK (true);

-- Also allow authenticated users
CREATE POLICY "allow_auth" ON students FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth" ON fees FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth" ON waivers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth" ON results FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth" ON published_results FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth" ON attendance FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth" ON kv_store FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Supabase Storage bucket for images
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-images', 'student-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "allow_all_images" ON storage.objects
FOR ALL TO anon USING (bucket_id = 'student-images') WITH CHECK (bucket_id = 'student-images');

CREATE POLICY "allow_auth_images" ON storage.objects
FOR ALL TO authenticated USING (bucket_id = 'student-images') WITH CHECK (bucket_id = 'student-images');
