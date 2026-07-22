'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Teacher } from '@/lib/types';
import { onTeachersChange } from '@/lib/supabase/realtime';
import { useAutoRefetch } from '@/lib/hooks/useAutoRefetch';

const TEACHERS_CACHE_KEY = 'nim_teachers_cache';

function readTeacherCache(): Teacher[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TEACHERS_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeTeacherCache(teachers: Teacher[]) {
  try { localStorage.setItem(TEACHERS_CACHE_KEY, JSON.stringify(teachers)); } catch {}
}

interface TeachersCtx {
  teachers: Teacher[];
  loading: boolean;
  addTeacher: (t: Teacher) => Promise<void>;
  updateTeacher: (t: Teacher) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  setTeachers: (t: Teacher[]) => Promise<void>;
  departmentOrder: string[];
  setDepartmentOrder: (d: string[]) => void;
}

const Ctx = createContext<TeachersCtx>({
  teachers: [],
  loading: true,
  addTeacher: async () => {},
  updateTeacher: async () => {},
  deleteTeacher: async () => {},
  setTeachers: async () => {},
  departmentOrder: [],
  setDepartmentOrder: () => {},
});

function mapRow(row: Record<string, unknown>): Teacher {
  // Support both snake_case (toRow output) and camelCase (legacy direct storage)
  const subj = (row.subject ?? []) as unknown;
  return {
    id: row.id as string,
    teacherId: (row.teacher_id ?? row.teacherId) as string,
    name: row.name as string,
    nameBn: ((row.name_bn ?? row.nameBn) as string) ?? '',
    designation: (row.designation as string) ?? '',
    department: (row.department as string) ?? '',
    subject: Array.isArray(subj) ? (subj as string[]) : typeof subj === 'string' ? [subj] : [],
    classes: ((row.classes ?? []) as string[]),
    classSubjects: ((row.class_subjects ?? row.classSubjects ?? {}) as Record<string, string[]>),
    phone: (row.phone as string) ?? '',
    email: (row.email as string) ?? '',
    address: (row.address as string) ?? '',
    qualification: (row.qualification as string) ?? '',
    joinDate: ((row.join_date ?? row.joinDate) as string) ?? '',
    image: (row.image as string) || undefined,
  };
}

function toRow(tc: Teacher) {
  return {
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
  };
}

export function TeachersProvider({ children }: { children: ReactNode }) {
  const cached = readTeacherCache();
  const [teachers, setTeachersState] = useState<Teacher[]>(cached);
  const [departmentOrder, setDeptOrderState] = useState<string[]>(
    [...new Set(cached.map(t => t.department))]
  );
  const [ready, setReady] = useState(cached.length > 0);

  const refetch = useCallback(async () => {
    try {
      const r = await fetch('/api/teachers');
      const { data } = await r.json();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapRow);
        setTeachersState(mapped);
        setDeptOrderState([...new Set(mapped.map((t: Teacher) => t.department))]);
        writeTeacherCache(mapped);
      }
      setReady(true);
    } catch {
      setReady(true);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  useAutoRefetch(refetch);
  useEffect(() => onTeachersChange(refetch), [refetch]);

  const upsertToApi = async (rows: object | object[]) => {
    const res = await fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows),
    });
    if (!res.ok) throw new Error(await res.text());
  };

  const addTeacher = async (t: Teacher) => {
    setTeachersState(prev => {
      const next = [...prev, t];
      writeTeacherCache(next);
      return next;
    });
    await upsertToApi(toRow(t));
  };

  const updateTeacher = async (t: Teacher) => {
    setTeachersState(prev => {
      const next = prev.map(x => x.id === t.id ? t : x);
      writeTeacherCache(next);
      return next;
    });
    await upsertToApi(toRow(t));
  };

  const deleteTeacher = async (id: string) => {
    setTeachersState(prev => {
      const next = prev.filter(x => x.id !== id);
      writeTeacherCache(next);
      return next;
    });
    await fetch('/api/teachers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  };

  // Legacy bulk setter — only used for department reorder (no Supabase sync needed for order)
  const setTeachers = async (t: Teacher[]) => {
    setTeachersState(t);
    await upsertToApi(t.map(toRow));
  };

  const setDepartmentOrder = (d: string[]) => {
    setDeptOrderState(d);
  };

  return (
    <Ctx.Provider value={{
      teachers,
      loading: !ready,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      setTeachers,
      departmentOrder,
      setDepartmentOrder,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTeachers = () => useContext(Ctx);
