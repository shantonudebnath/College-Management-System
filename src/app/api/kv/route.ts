import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function makeAdmin() {
  const strip = (s?: string) => (s ?? '').replace(/^﻿/, '').trim();
  return createClient(
    strip(process.env.NEXT_PUBLIC_SUPABASE_URL),
    strip(process.env.SUPABASE_SERVICE_ROLE_KEY),
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
        CREATE TABLE IF NOT EXISTS public.kv_store (
          key TEXT PRIMARY KEY,
          value JSONB,
          updated_at TIMESTAMPTZ DEFAULT now()
        );
        ALTER TABLE public.kv_store DISABLE ROW LEVEL SECURITY;
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.kv_store TO anon, authenticated;
        NOTIFY pgrst, 'reload schema';
      `,
    }),
  });
}

// GET /api/kv?key=some_key
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });

  const admin = makeAdmin();
  let { data, error } = await admin.from('kv_store').select('value').eq('key', key).maybeSingle();

  if (error && (error.message.includes('does not exist') || error.message.includes('42P01'))) {
    await ensureTable();
    await new Promise(r => setTimeout(r, 600));
    ({ data, error } = await admin.from('kv_store').select('value').eq('key', key).maybeSingle());
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ value: data?.value ?? null });
}

// POST /api/kv  body: { key, value }
export async function POST(req: NextRequest) {
  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });

  const admin = makeAdmin();
  let { error } = await admin
    .from('kv_store')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error && (error.message.includes('does not exist') || error.message.includes('42P01'))) {
    await ensureTable();
    await new Promise(r => setTimeout(r, 600));
    ({ error } = await admin
      .from('kv_store')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' }));
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
