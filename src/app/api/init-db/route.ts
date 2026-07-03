import { NextResponse } from 'next/server';

const SQL = `
CREATE TABLE IF NOT EXISTS public.kv_store (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.kv_store DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kv_store TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  student_id TEXT UNIQUE,
  name TEXT DEFAULT '',
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
  created_at TEXT DEFAULT ''
);
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.teachers (
  id TEXT PRIMARY KEY,
  teacher_id TEXT UNIQUE,
  name TEXT DEFAULT '',
  name_bn TEXT DEFAULT '',
  designation TEXT DEFAULT '',
  department TEXT DEFAULT '',
  subject JSONB DEFAULT '[]',
  classes JSONB DEFAULT '[]',
  class_subjects JSONB DEFAULT '{}',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  qualification TEXT DEFAULT '',
  join_date TEXT DEFAULT '',
  image TEXT,
  created_at TEXT DEFAULT ''
);
ALTER TABLE public.teachers DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teachers TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
`;

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'env missing' }, { status: 500 });

  const res = await fetch(`${url}/pg-meta/v1/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ query: SQL }),
  });

  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json({ error: body }, { status: res.status });
  }
  return NextResponse.json({ ok: true });
}
