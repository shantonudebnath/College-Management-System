'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { kvGet } from '@/lib/supabase/kv';

const CURRENT_TEACHER_KEY = 'nim_current_teacher_id';
const CLASS_TEACHERS_KEY = 'nim_class_teachers_v1';

interface ClassTeacher { classId: string; teacherId: string; }

interface CurrentTeacherCtx {
  currentTeacherId: string | null;
  assignedClassId: string | null;
  setCurrentTeacher: (id: string) => void;
  clearCurrentTeacher: () => void;
}

const Ctx = createContext<CurrentTeacherCtx>({
  currentTeacherId: null,
  assignedClassId: null,
  setCurrentTeacher: () => {},
  clearCurrentTeacher: () => {},
});

export function CurrentTeacherProvider({ children }: { children: ReactNode }) {
  const [currentTeacherId, setIdState] = useState<string | null>(null);
  const [assignedClassId, setAssignedClassId] = useState<string | null>(null);
  const [classTeachers, setClassTeachers] = useState<ClassTeacher[]>([]);

  useEffect(() => {
    kvGet<ClassTeacher[]>(CLASS_TEACHERS_KEY).then(ct => {
      if (ct) setClassTeachers(ct);
    });
    try {
      const tid = localStorage.getItem(CURRENT_TEACHER_KEY);
      if (tid) setIdState(tid);
    } catch {}
  }, []);

  useEffect(() => {
    if (currentTeacherId && classTeachers.length > 0) {
      const cls = classTeachers.find(a => a.teacherId === currentTeacherId)?.classId ?? null;
      setAssignedClassId(cls);
    }
  }, [currentTeacherId, classTeachers]);

  const setCurrentTeacher = (id: string) => {
    setIdState(id);
    const cls = classTeachers.find(a => a.teacherId === id)?.classId ?? null;
    setAssignedClassId(cls);
    try { localStorage.setItem(CURRENT_TEACHER_KEY, id); } catch {}
  };

  const clearCurrentTeacher = () => {
    setIdState(null);
    setAssignedClassId(null);
    try { localStorage.removeItem(CURRENT_TEACHER_KEY); } catch {}
  };

  return (
    <Ctx.Provider value={{ currentTeacherId, assignedClassId, setCurrentTeacher, clearCurrentTeacher }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCurrentTeacher = () => useContext(Ctx);
