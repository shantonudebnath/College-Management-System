'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TEACHERS } from '@/lib/data';
import type { Teacher } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const defaultDepts = [...new Set(TEACHERS.map(t => t.department))];

interface TeachersCtx {
  teachers: Teacher[];
  setTeachers: (t: Teacher[]) => void;
  departmentOrder: string[];
  setDepartmentOrder: (d: string[]) => void;
}

const Ctx = createContext<TeachersCtx>({
  teachers: TEACHERS,
  setTeachers: () => {},
  departmentOrder: defaultDepts,
  setDepartmentOrder: () => {},
});

function mapRow(row: Record<string, unknown>): Teacher {
  return {
    id: row.id as string,
    teacherId: row.teacher_id as string,
    name: row.name as string,
    nameBn: (row.name_bn as string) ?? '',
    designation: (row.designation as string) ?? '',
    department: (row.department as string) ?? '',
    subject: (row.subject as string[]) ?? [],
    classes: (row.classes as string[]) ?? [],
    classSubjects: (row.class_subjects as Record<string, string[]>) ?? {},
    phone: (row.phone as string) ?? '',
    email: (row.email as string) ?? '',
    address: (row.address as string) ?? '',
    qualification: (row.qualification as string) ?? '',
    joinDate: (row.join_date as string) ?? '',
    image: row.image as string | undefined,
  };
}

export function TeachersProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachersState] = useState<Teacher[]>(TEACHERS);
  const [departmentOrder, setDeptOrderState] = useState<string[]>(defaultDepts);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const mapped = data.map(mapRow);
          setTeachersState(mapped);
          setDeptOrderState([...new Set(mapped.map(t => t.department))]);
        }
        setReady(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTeachers = async (t: Teacher[]) => {
    setTeachersState(t);
    const rows = t.map(tc => ({
      id: tc.id,
      teacher_id: tc.teacherId,
      name: tc.name,
      name_bn: tc.nameBn,
      designation: tc.designation,
      department: tc.department,
      subject: tc.subject,
      classes: tc.classes,
      class_subjects: tc.classSubjects ?? {},
      phone: tc.phone,
      email: tc.email,
      address: tc.address,
      qualification: tc.qualification,
      join_date: tc.joinDate,
      image: tc.image ?? null,
    }));
    await fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows),
    });
  };

  const setDepartmentOrder = (d: string[]) => {
    setDeptOrderState(d);
  };

  return (
    <Ctx.Provider value={{
      teachers: ready ? teachers : TEACHERS,
      setTeachers,
      departmentOrder,
      setDepartmentOrder,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTeachers = () => useContext(Ctx);
