'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const CURRENT_TEACHER_KEY = 'nim_current_teacher_id';
const CLASS_TEACHERS_KEY = 'nim_class_teachers_v1';

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

function getAssignedClass(teacherId: string): string | null {
  try {
    const ct = JSON.parse(localStorage.getItem(CLASS_TEACHERS_KEY) ?? '[]') as { classId: string; teacherId: string }[];
    return ct.find(a => a.teacherId === teacherId)?.classId ?? null;
  } catch { return null; }
}

export function CurrentTeacherProvider({ children }: { children: ReactNode }) {
  const [currentTeacherId, setIdState] = useState<string | null>(null);
  const [assignedClassId, setAssignedClassId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const tid = localStorage.getItem(CURRENT_TEACHER_KEY);
      if (tid) {
        setIdState(tid);
        setAssignedClassId(getAssignedClass(tid));
      }
    } catch {}
  }, []);

  const setCurrentTeacher = (id: string) => {
    setIdState(id);
    const cls = getAssignedClass(id);
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
