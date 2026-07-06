'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { kvGet } from '@/lib/supabase/kv';

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
    // Note: deliberately NOT reading localStorage — session cookie is the sole authority
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
  };

  const clearCurrentTeacher = () => {
    setIdState(null);
    setAssignedClassId(null);
  };

  return (
    <Ctx.Provider value={{ currentTeacherId, assignedClassId, setCurrentTeacher, clearCurrentTeacher }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCurrentTeacher = () => useContext(Ctx);
