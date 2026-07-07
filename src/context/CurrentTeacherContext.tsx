'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { kvGet } from '@/lib/supabase/kv';
import { useTeachers } from './TeachersContext';

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
  const { teachers } = useTeachers();
  const [currentTeacherId, setIdState] = useState<string | null>(null);
  const [assignedClassId, setAssignedClassId] = useState<string | null>(null);
  const [classTeachers, setClassTeachers] = useState<ClassTeacher[]>([]);
  const [sessionTchId, setSessionTchId] = useState<string | null>(null);

  useEffect(() => {
    kvGet<ClassTeacher[]>(CLASS_TEACHERS_KEY).then(ct => {
      if (ct) setClassTeachers(ct);
    });
    // Auto-resolve logged-in teacher from session on mount
    fetch('/api/session')
      .then(r => r.ok ? r.json() : null)
      .then((s: { id: string; role: string } | null) => {
        if (s && s.role === 'teacher') setSessionTchId(s.id);
      })
      .catch(() => {});
  }, []);

  // When teachers list is ready AND session known, set currentTeacherId
  useEffect(() => {
    if (!sessionTchId || teachers.length === 0) return;
    const matched = teachers.find(t => t.teacherId === sessionTchId);
    if (matched && matched.id !== currentTeacherId) {
      setIdState(matched.id);
      const cls = classTeachers.find(a => a.teacherId === matched.id)?.classId ?? null;
      setAssignedClassId(cls);
    }
  }, [sessionTchId, teachers, classTeachers]);

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
