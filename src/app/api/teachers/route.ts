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
        CREATE TABLE IF NOT EXISTS public.teachers (
          id TEXT PRIMARY KEY, teacher_id TEXT UNIQUE, name TEXT DEFAULT '',
          name_bn TEXT DEFAULT '', designation TEXT DEFAULT '', department TEXT DEFAULT '',
          subject JSONB DEFAULT '[]', classes JSONB DEFAULT '[]',
          class_subjects JSONB DEFAULT '{}', phone TEXT DEFAULT '', email TEXT DEFAULT '',
          address TEXT DEFAULT '', qualification TEXT DEFAULT '',
          join_date TEXT DEFAULT '', image TEXT, created_at TEXT DEFAULT ''
        );
        ALTER TABLE public.teachers DISABLE ROW LEVEL SECURITY;
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.teachers TO anon, authenticated;
        NOTIFY pgrst, 'reload schema';
      `,
    }),
  });
}

// GET: fetch all teachers
export async function GET() {
  const admin = makeAdmin();
  let { data, error } = await admin.from('teachers').select('*').order('created_at', { ascending: true });

  if (error && (error.message.includes('does not exist') || error.message.includes('42P01'))) {
    await ensureTable();
    await new Promise(r => setTimeout(r, 600));
    ({ data, error } = await admin.from('teachers').select('*').order('created_at', { ascending: true }));
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

// POST: upsert one or many teachers
export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows = Array.isArray(body) ? body : [body];
  const admin = makeAdmin();

  let { error } = await admin.from('teachers').upsert(rows, { onConflict: 'id' });

  if (error && (error.message.includes('does not exist') || error.message.includes('42P01'))) {
    await ensureTable();
    await new Promise(r => setTimeout(r, 600));
    ({ error } = await admin.from('teachers').upsert(rows, { onConflict: 'id' }));
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE: delete by id
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await makeAdmin().from('teachers').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
