'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Student } from '@/lib/types';
import { onStudentsChange } from '@/lib/supabase/realtime';
import { useAutoRefetch } from '@/lib/hooks/useAutoRefetch';

const STUDENTS_CACHE_KEY = 'nim_students_cache';

function readStudentCache(): Student[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STUDENTS_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeStudentCache(students: Student[]) {
  try { localStorage.setItem(STUDENTS_CACHE_KEY, JSON.stringify(students)); } catch {}
}

interface StudentsCtx {
  students: Student[];
  loading: boolean;
  setStudents: (students: Student[]) => Promise<void>;
  upsertStudent: (student: Student) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const Ctx = createContext<StudentsCtx>({
  students: [],
  loading: true,
  setStudents: async () => {},
  upsertStudent: async () => {},
  deleteStudent: async () => {},
  refetch: async () => {},
});

function toRow(s: Student) {
  return {
    id: s.id,
    student_id: s.studentId,
    name: s.name,
    name_bn: s.nameBn ?? '',
    father_name: s.fatherName ?? '',
    mother_name: s.motherName ?? '',
    class: s.class ?? '',
    section: s.section ?? '',
    roll: s.roll ?? 0,
    session: s.session ?? '',
    dob: s.dob ?? '',
    gender: s.gender ?? '',
    religion: s.religion ?? '',
    phone: s.phone ?? '',
    guardian_phone: s.guardianPhone ?? '',
    address: s.address ?? '',
    blood_group: s.bloodGroup ?? '',
    birth_cert_no: s.birthCertNo ?? '',
    image: s.image ?? null,
    registration_status: s.registrationStatus ?? 'approved',
    fee_status: s.feeStatus ?? 'due',
    created_at: s.createdAt ?? '',
  };
}

function fromRow(row: Record<string, unknown>): Student {
  return {
    id: row.id as string,
    studentId: row.student_id as string,
    name: row.name as string,
    nameBn: (row.name_bn as string) ?? '',
    fatherName: (row.father_name as string) ?? '',
    motherName: (row.mother_name as string) ?? '',
    class: (row.class as string) ?? '',
    section: (row.section as string) ?? '',
    roll: (row.roll as number) ?? 0,
    session: (row.session as string) ?? '',
    dob: (row.dob as string) ?? '',
    gender: (row.gender as string) ?? '',
    religion: (row.religion as string) ?? '',
    phone: (row.phone as string) ?? '',
    guardianPhone: (row.guardian_phone as string) ?? undefined,
    address: (row.address as string) ?? '',
    bloodGroup: (row.blood_group as string) ?? undefined,
    birthCertNo: (row.birth_cert_no as string) ?? undefined,
    image: (row.image as string) ?? undefined,
    registrationStatus: (row.registration_status as Student['registrationStatus']) ?? 'approved',
    feeStatus: (row.fee_status as Student['feeStatus']) ?? 'due',
    createdAt: (row.created_at as string) ?? '',
  };
}

export function StudentsProvider({ children }: { children: ReactNode }) {
  const cached = readStudentCache();
  const [students, setStudentsState] = useState<Student[]>(cached);
  const [loading, setLoading] = useState(cached.length === 0);

  const refetch = useCallback(async () => {
    if (students.length === 0) setLoading(true);
    try {
      const res = await fetch('/api/students');
      const { data } = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map(fromRow);
        setStudentsState(mapped);
        writeStudentCache(mapped);
      }
    } catch {
      // fallback: keep existing state
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  useAutoRefetch(refetch);
  useEffect(() => onStudentsChange(refetch), [refetch]);

  const setStudents = async (updated: Student[]) => {
    setStudentsState(updated);
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated.map(toRow)),
    });
    if (!res.ok) throw new Error(await res.text());
  };

  const upsertStudent = async (student: Student) => {
    setStudentsState(prev => {
      const exists = prev.find(s => s.id === student.id);
      const next = exists ? prev.map(s => s.id === student.id ? student : s) : [...prev, student];
      writeStudentCache(next);
      return next;
    });
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toRow(student)),
    });
    if (!res.ok) throw new Error(await res.text());
  };

  const deleteStudent = async (id: string) => {
    setStudentsState(prev => {
      const next = prev.filter(s => s.id !== id);
      writeStudentCache(next);
      return next;
    });
    await fetch('/api/students', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  };

  return (
    <Ctx.Provider value={{ students, loading, setStudents, upsertStudent, deleteStudent, refetch }}>
      {children}
    </Ctx.Provider>
  );
}

export const useStudents = () => useContext(Ctx);
