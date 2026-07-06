'use client';
import { useState, useEffect } from 'react';
import { STUDENTS } from '@/lib/data';
import type { Student } from '@/lib/types';

export interface StudentSession {
  student: Student | null;
  loading: boolean;
}

function fromRow(row: Record<string, unknown>): Student {
  return {
    id: row.id as string,
    studentId: ((row.student_id ?? row.studentId) as string) ?? '',
    name: row.name as string,
    nameBn: ((row.name_bn ?? row.nameBn) as string) ?? '',
    fatherName: ((row.father_name ?? row.fatherName) as string) ?? '',
    motherName: ((row.mother_name ?? row.motherName) as string) ?? '',
    class: (row.class as string) ?? '',
    section: (row.section as string) ?? '',
    roll: (row.roll as number) ?? 0,
    session: (row.session as string) ?? '',
    dob: (row.dob as string) ?? '',
    gender: (row.gender as string) ?? '',
    religion: (row.religion as string) ?? '',
    phone: (row.phone as string) ?? '',
    guardianPhone: ((row.guardian_phone ?? row.guardianPhone) as string) ?? undefined,
    address: (row.address as string) ?? '',
    bloodGroup: ((row.blood_group ?? row.bloodGroup) as string) ?? undefined,
    birthCertNo: ((row.birth_cert_no ?? row.birthCertNo) as string) ?? undefined,
    image: (row.image as string) ?? undefined,
    registrationStatus: ((row.registration_status ?? row.registrationStatus) as Student['registrationStatus']) ?? 'approved',
    feeStatus: ((row.fee_status ?? row.feeStatus) as Student['feeStatus']) ?? 'due',
    createdAt: ((row.created_at ?? row.createdAt) as string) ?? '',
  };
}

export function useStudentSession(): StudentSession {
  const [state, setState] = useState<StudentSession>({ student: null, loading: true });

  useEffect(() => {
    fetch('/api/session')
      .then(r => r.ok ? r.json() : null)
      .then(async (session: { id: string; role: string } | null) => {
        if (!session || session.role !== 'student') {
          setState({ student: null, loading: false });
          return;
        }
        // Fetch all students from KV store and find the logged-in one
        const res = await fetch('/api/students');
        if (res.ok) {
          const { data } = await res.json();
          if (Array.isArray(data)) {
            const found = data.find((s: Record<string, unknown>) =>
              s.student_id === session.id || s.studentId === session.id
            );
            if (found) {
              setState({ student: fromRow(found as Record<string, unknown>), loading: false });
              return;
            }
          }
        }
        // Fallback to hardcoded data (for demo students)
        const found = STUDENTS.find(s => s.studentId === session.id) ?? null;
        setState({ student: found, loading: false });
      })
      .catch(() => setState({ student: null, loading: false }));
  }, []);

  return state;
}
