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
        let allStudents: Student[] = STUDENTS;
        try {
          const stored = localStorage.getItem('students_store');
          const storedList: Student[] = stored ? JSON.parse(stored) : [];
          const storedIds = new Set(storedList.map((s: Student) => s.id));
          const merged = [...storedList, ...STUDENTS.filter(s => !storedIds.has(s.id))];
          if (merged.length > 0) allStudents = merged;
        } catch { /* ignore */ }

        const found = allStudents.find(s => s.studentId === session.id) ?? null;

        setState({ student: found, loading: false });
      })
      .catch(() => setState({ student: null, loading: false }));
  }, []);

  return state;
}
