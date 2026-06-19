import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const body = await req.json();
  const { displayId, password, role } = body as {
    displayId: string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
  };

  if (!displayId || !password || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const email = `${displayId.toLowerCase().replace(/\s+/g, '')}@noorislammadrasha.edu.bd`;

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role, display_id: displayId },
  });

  if (error) {
    if (error.message?.includes('already been registered')) {
      return NextResponse.json({ success: true, email, note: 'already_exists' });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, email, userId: data.user?.id });
}
