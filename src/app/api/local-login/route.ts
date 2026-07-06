import { NextRequest, NextResponse } from 'next/server';
import { kvGet } from '@/lib/mysql';

const COOKIE = 'nim_session';
const MAX_AGE_DEFAULT = 60 * 60 * 24 * 7;   // 7 days
const MAX_AGE_REMEMBER = 60 * 60 * 24 * 30;  // 30 days

function makeStudentPassword(roll: number): string {
  return `NIM@${roll.toString().padStart(3, '0')}`;
}

function makeTeacherPassword(teacherId: string): string {
  const num = teacherId.replace(/\D/g, '').padStart(4, '0').slice(-4);
  return `NIM@Teacher#${num}`;
}

interface KVStudent { id: string; student_id: string; roll: number; }
interface KVTeacher { id: string; teacher_id: string; }

export async function POST(req: NextRequest) {
  const { id, password, role, rememberMe } = await req.json();
  if (!id || !password || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const maxAge = rememberMe ? MAX_AGE_REMEMBER : MAX_AGE_DEFAULT;
  const cleanId = id.trim();

  if (role === 'student') {
    let stuId: string | undefined;
    let stuRoll: number | undefined;

    // 1. Check MySQL KV store (primary source for dynamically added students)
    try {
      const kvStudents = (await kvGet('students_data')) as KVStudent[] | null;
      if (Array.isArray(kvStudents)) {
        const isNumeric = /^\d+$/.test(cleanId);
        const found = kvStudents.find(s =>
          s.student_id === cleanId ||
          (isNumeric && Number(s.roll) === parseInt(cleanId))
        );
        if (found) {
          stuId = found.student_id;
          stuRoll = Number(found.roll);
        }
      }
    } catch { /* KV unavailable, continue */ }

    // 2. Last resort: derive roll from student_id pattern (e.g. STD-2025-919 → roll=919)
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
      maxAge,
      sameSite: 'lax',
    });
    return res;
  }

  if (role === 'teacher') {
    let tchId: string | undefined;

    // 1. Check MySQL KV store (primary source for dynamically added teachers)
    try {
      const kvTeachers = (await kvGet('teachers_data')) as KVTeacher[] | null;
      if (Array.isArray(kvTeachers)) {
        const found = kvTeachers.find(t =>
          t.teacher_id === cleanId || t.id === cleanId
        );
        if (found) tchId = found.teacher_id;
      }
    } catch { /* KV unavailable, continue */ }

    // 2. Last resort: verify password formula directly from teacherId
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
      maxAge,
      sameSite: 'lax',
    });
    return res;
  }

  return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
}
