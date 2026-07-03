import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function makeAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function ensureTable() {
  await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/pg-meta/v1/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      query: `
        CREATE TABLE IF NOT EXISTS public.students (
          id TEXT PRIMARY KEY, student_id TEXT UNIQUE, name TEXT DEFAULT '',
          name_bn TEXT DEFAULT '', father_name TEXT DEFAULT '', mother_name TEXT DEFAULT '',
          class TEXT DEFAULT '', section TEXT DEFAULT '', roll INTEGER DEFAULT 0,
          session TEXT DEFAULT '', dob TEXT DEFAULT '', gender TEXT DEFAULT '',
          religion TEXT DEFAULT '', phone TEXT DEFAULT '', guardian_phone TEXT DEFAULT '',
          address TEXT DEFAULT '', blood_group TEXT DEFAULT '', birth_cert_no TEXT DEFAULT '',
          image TEXT, registration_status TEXT DEFAULT 'approved',
          fee_status TEXT DEFAULT 'due', created_at TEXT DEFAULT ''
        );
        ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO anon, authenticated;
        NOTIFY pgrst, 'reload schema';
      `,
    }),
  });
}

// GET: fetch all students
export async function GET() {
  const admin = makeAdmin();
  let { data, error } = await admin.from('students').select('*').order('created_at', { ascending: true });

  if (error && (error.message.includes('does not exist') || error.message.includes('42P01'))) {
    await ensureTable();
    await new Promise(r => setTimeout(r, 600));
    ({ data, error } = await admin.from('students').select('*').order('created_at', { ascending: true }));
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

// POST: upsert one or many students
export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows = Array.isArray(body) ? body : [body];
  const admin = makeAdmin();

  let { error } = await admin.from('students').upsert(rows, { onConflict: 'id' });

  if (error && (error.message.includes('does not exist') || error.message.includes('42P01'))) {
    await ensureTable();
    await new Promise(r => setTimeout(r, 600));
    ({ error } = await admin.from('students').upsert(rows, { onConflict: 'id' }));
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE: delete by id
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await makeAdmin().from('students').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
