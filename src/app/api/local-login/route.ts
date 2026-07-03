import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TEACHERS, STUDENTS as STATIC_STUDENTS } from '@/lib/data';

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
    const isNumeric = /^\d+$/.test(cleanId);
    let studentQuery = supabase.from('students').select('id, student_id, roll');
    if (isNumeric) {
      studentQuery = studentQuery.or(`student_id.eq.${cleanId},roll.eq.${cleanId}`);
    } else {
      studentQuery = studentQuery.eq('student_id', cleanId);
    }
    const { data: student } = await studentQuery.maybeSingle();

    let stuId: string | undefined;
    let stuRoll: number | undefined;
    if (student) {
      stuId = student.student_id;
      stuRoll = student.roll;
    } else {
      // Fallback to hardcoded data
      const rollNum = parseInt(cleanId) || 0;
      const found = STATIC_STUDENTS.find(s => s.studentId === cleanId || s.roll === rollNum);
      if (found) { stuId = found.studentId; stuRoll = found.roll; }
    }

    // Last resort: derive roll from student_id pattern (e.g. STD-2025-919 → roll=919)
    if (!stuId || stuRoll === undefined) {
      const m = cleanId.match(/-(\d+)$/);
      if (m) {
        const derivedRoll = parseInt(m[1]);
        if (password === makeStudentPassword(derivedRoll)) {
          stuId = cleanId;
          stuRoll = derivedRoll;
        }
      }
    }

    if (!stuId || stuRoll === undefined) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    if (password !== makeStudentPassword(stuRoll)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, role });
    res.cookies.set(COOKIE, JSON.stringify({ id: stuId, role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: MAX_AGE,
      sameSite: 'lax',
    });
    return res;
  }

  if (role === 'teacher') {
    const { data: teacher } = await supabase
      .from('teachers')
      .select('id, teacher_id')
      .eq('teacher_id', cleanId)
      .maybeSingle();

    let tchId: string | undefined;
    if (teacher) {
      tchId = teacher.teacher_id;
    } else {
      // Fallback to hardcoded data
      const found = TEACHERS.find(t => t.teacherId === cleanId);
      if (found) tchId = found.teacherId;
    }

    // Last resort: verify password formula directly from teacherId (no DB needed)
    if (!tchId && password === makeTeacherPassword(cleanId)) {
      tchId = cleanId;
    }

    if (!tchId) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    if (password !== makeTeacherPassword(tchId)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, role });
    res.cookies.set(COOKIE, JSON.stringify({ id: tchId, role }), {
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
