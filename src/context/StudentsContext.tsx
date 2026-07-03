'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { STUDENTS } from '@/lib/data';
import type { Student } from '@/lib/types';

interface StudentsCtx {
  students: Student[];
  loading: boolean;
  setStudents: (students: Student[]) => Promise<void>;
  upsertStudent: (student: Student) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const Ctx = createContext<StudentsCtx>({
  students: STUDENTS,
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
  const [students, setStudentsState] = useState<Student[]>(STUDENTS);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const { data } = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setStudentsState(data.map(fromRow));
      }
    } catch {
      // fallback: keep existing state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

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
      return exists ? prev.map(s => s.id === student.id ? student : s) : [...prev, student];
    });
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toRow(student)),
    });
    if (!res.ok) throw new Error(await res.text());
  };

  const deleteStudent = async (id: string) => {
    setStudentsState(prev => prev.filter(s => s.id !== id));
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
