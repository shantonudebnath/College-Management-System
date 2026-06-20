import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'nim_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function validate(id: string, password: string, role: string): boolean {
  if (role === 'student') {
    const m = id.match(/^STD-\d{4}-(\d{3})$/i);
    return !!m && password === `NIM@${m[1]}`;
  }
  if (role === 'teacher') {
    return /^TCH-\d+$/i.test(id) && /^NIM@Teacher#\d{4}$/.test(password);
  }
  return false;
}

export async function POST(req: NextRequest) {
  const { id, password, role } = await req.json();
  if (!id || !password || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (!validate(id.trim(), password, role)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const res = NextResponse.json({ success: true, role });
  res.cookies.set(COOKIE, JSON.stringify({ id: id.trim(), role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
    sameSite: 'lax',
  });
  return res;
}
