'use client';
import { useState, useEffect } from 'react';
import { STUDENTS } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';
import type { Student } from '@/lib/types';

export interface StudentSession {
  student: Student | null;
  loading: boolean;
}

function fromRow(row: Record<string, unknown>): Student {
  return {
    id: row.id as string,
    studentId: (row.student_id as string) ?? '',
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

export function useStudentSession(): StudentSession {
  const [state, setState] = useState<StudentSession>({ student: null, loading: true });

  useEffect(() => {
    const supabase = createClient();
    fetch('/api/session')
      .then(r => r.ok ? r.json() : null)
      .then(async (session: { id: string; role: string } | null) => {
        if (!session || session.role !== 'student') {
          setState({ student: null, loading: false });
          return;
        }
        // Try Supabase first
        const { data } = await supabase
          .from('students')
          .select('*')
          .eq('student_id', session.id)
          .single();
        if (data) {
          setState({ student: fromRow(data as Record<string, unknown>), loading: false });
          return;
        }
        // Fallback to hardcoded data
        const found = STUDENTS.find(s => s.studentId === session.id) ?? null;
        setState({ student: found, loading: false });
      })
      .catch(() => setState({ student: null, loading: false }));
  }, []);

  return state;
}
