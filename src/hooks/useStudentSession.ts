'use client';
import { useState, useEffect } from 'react';
import { STUDENTS } from '@/lib/data';
import type { Student } from '@/lib/types';

export interface StudentSession {
  student: Student | null;
  loading: boolean;
}

export function useStudentSession(): StudentSession {
  const [state, setState] = useState<StudentSession>({ student: null, loading: true });

  useEffect(() => {
    fetch('/api/session')
      .then(r => r.ok ? r.json() : null)
      .then((session: { id: string; role: string } | null) => {
        if (!session || session.role !== 'student') {
          setState({ student: null, loading: false });
          return;
        }
        // Look in localStorage students_store first, then fall back to static data
        let allStudents: Student[] = STUDENTS;
        try {
          const stored = localStorage.getItem('students_store');
          if (stored) {
            const parsed: Student[] = JSON.parse(stored);
            if (parsed.length > 0) allStudents = parsed;
          }
        } catch { /* ignore */ }

        const found = allStudents.find(s => s.studentId === session.id)
          ?? STUDENTS.find(s => s.studentId === session.id)
          ?? null;

        setState({ student: found, loading: false });
      })
      .catch(() => setState({ student: null, loading: false }));
  }, []);

  return state;
}
