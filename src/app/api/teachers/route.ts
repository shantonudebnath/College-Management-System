import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function makeAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// POST: upsert one or many teachers
export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows = Array.isArray(body) ? body : [body];
  const { error } = await makeAdmin().from('teachers').upsert(rows);
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
