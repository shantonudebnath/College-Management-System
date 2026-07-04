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

const KV_KEY = 'students_data';

async function kvLoad(): Promise<Record<string, unknown>[]> {
  const admin = makeAdmin();
  const { data, error } = await admin
    .from('kv_store')
    .select('value')
    .eq('key', KV_KEY)
    .maybeSingle();
  if (error || !data?.value) return [];
  return Array.isArray(data.value) ? (data.value as Record<string, unknown>[]) : [];
}

async function kvSave(rows: Record<string, unknown>[]): Promise<void> {
  const admin = makeAdmin();
  const { error } = await admin
    .from('kv_store')
    .upsert({ key: KV_KEY, value: rows, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
}

export async function GET() {
  try {
    const rows = await kvLoad();
    return NextResponse.json({ data: rows });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incoming = Array.isArray(body) ? body : [body];
    const current = await kvLoad();

    for (const row of incoming) {
      const r = row as Record<string, unknown>;
      const idx = current.findIndex(s => s.id === r.id);
      if (idx >= 0) current[idx] = r;
      else current.push(r);
    }

    await kvSave(current);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const current = await kvLoad();
    const updated = current.filter(s => s.id !== id);
    await kvSave(updated);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
