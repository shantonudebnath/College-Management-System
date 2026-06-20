import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const nim = cookieStore.get('nim_session')?.value;
  if (!nim) return NextResponse.json({ id: null, role: null }, { status: 401 });
  try {
    const session = JSON.parse(nim);
    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ id: null, role: null }, { status: 401 });
  }
}
