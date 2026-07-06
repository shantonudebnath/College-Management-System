import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/supabase/kv-server';

const KV_KEY = 'students_data';

export async function GET() {
  try {
    const data = await kvGet(KV_KEY);
    return NextResponse.json({ data: Array.isArray(data) ? data : [] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incoming = Array.isArray(body) ? body : [body];
    const current = (await kvGet(KV_KEY) as Record<string, unknown>[] | null) ?? [];

    for (const row of incoming) {
      const r = row as Record<string, unknown>;
      const idx = current.findIndex(s => s.id === r.id);
      if (idx >= 0) current[idx] = r;
      else current.push(r);
    }

    await kvSet(KV_KEY, current);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const current = (await kvGet(KV_KEY) as Record<string, unknown>[] | null) ?? [];
    await kvSet(KV_KEY, current.filter(s => s.id !== id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
