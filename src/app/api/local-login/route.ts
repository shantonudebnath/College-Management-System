import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const COOKIE = 'nim_session';
const MAX_AGE = 60 * 60 * 24 * 7;

function makeStudentPassword(roll: number): string {
  return `NIM@${roll.toString().padStart(3, '0')}`;
}

function makeTeacherPassword(teacherId: string): string {
  const num = teacherId.replace(/\D/g, '').padStart(4, '0').slice(-4);
  return `NIM@Teacher#${num}`;
}

export async function POST(req: NextRequest) {
  const { id, password, role } = await req.json();
  if (!id || !password || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const cleanId = id.trim();

  if (role === 'student') {
    const { data: student, error } = await supabase
      .from('students')
      .select('id, student_id, roll')
      .or(`student_id.eq.${cleanId},roll.eq.${parseInt(cleanId) || 0}`)
      .single();

    if (error || !student) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const expected = makeStudentPassword(student.roll);
    if (password !== expected) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, role });
    res.cookies.set(COOKIE, JSON.stringify({ id: student.student_id, role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: MAX_AGE,
      sameSite: 'lax',
    });
    return res;
  }

  if (role === 'teacher') {
    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('id, teacher_id')
      .eq('teacher_id', cleanId)
      .single();

    if (error || !teacher) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const expected = makeTeacherPassword(teacher.teacher_id);
    if (password !== expected) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, role });
    res.cookies.set(COOKIE, JSON.stringify({ id: teacher.teacher_id, role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: MAX_AGE,
      sameSite: 'lax',
    });
    return res;
  }

  return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
}
