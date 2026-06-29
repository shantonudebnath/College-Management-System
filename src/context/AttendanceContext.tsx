'use client';
import { createContext, useContext, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
}

interface AttendanceCtx {
  getAttendance: (cls: string, date: string) => Promise<AttendanceRecord[]>;
  saveAttendance: (cls: string, date: string, records: AttendanceRecord[]) => Promise<void>;
  getStudentAttendance: (studentId: string, cls: string) => Promise<{ date: string; status: string }[]>;
  getMonthAttendance: (year: number, month: number) => Promise<{ studentId: string; date: string; status: string }[]>;
}

const Ctx = createContext<AttendanceCtx>({
  getAttendance: async () => [],
  saveAttendance: async () => {},
  getStudentAttendance: async () => [],
  getMonthAttendance: async () => [],
});

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const getAttendance = async (cls: string, date: string): Promise<AttendanceRecord[]> => {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('class', cls)
      .eq('date', date);
    if (error || !data) return [];
    return data.map(r => ({
      studentId: r.student_id as string,
      studentName: r.student_name as string,
      status: r.status as AttendanceRecord['status'],
    }));
  };

  const saveAttendance = async (cls: string, date: string, records: AttendanceRecord[]) => {
    const rows = records.map(r => ({
      class: cls,
      date,
      student_id: r.studentId,
      student_name: r.studentName,
      status: r.status,
    }));
    // Delete existing then insert fresh
    await supabase.from('attendance').delete().eq('class', cls).eq('date', date);
    if (rows.length > 0) await supabase.from('attendance').insert(rows);
  };

  const getStudentAttendance = async (studentId: string, cls: string) => {
    const { data, error } = await supabase
      .from('attendance')
      .select('date, status')
      .eq('student_id', studentId)
      .eq('class', cls)
      .order('date', { ascending: true });
    if (error || !data) return [];
    return data.map(r => ({ date: r.date as string, status: r.status as string }));
  };

  const getMonthAttendance = async (year: number, month: number) => {
    const from = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const to = `${year}-${String(month + 1).padStart(2, '0')}-31`;
    const { data, error } = await supabase
      .from('attendance')
      .select('student_id, date, status')
      .gte('date', from)
      .lte('date', to);
    if (error || !data) return [];
    return data.map(r => ({ studentId: r.student_id as string, date: r.date as string, status: r.status as string }));
  };

  return (
    <Ctx.Provider value={{ getAttendance, saveAttendance, getStudentAttendance, getMonthAttendance }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAttendance = () => useContext(Ctx);
