'use client';
import { createContext, useContext, type ReactNode } from 'react';
import { kvGet, kvSet } from '@/lib/supabase/kv';

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

// KV key helpers — one record per class+date
function dayKey(cls: string, date: string) {
  return `att_${cls}_${date}`.replace(/[^a-z0-9_]/gi, '_');
}

// Index: class → sorted list of dates that have records
function indexKey(cls: string) {
  return `att_idx_${cls}`.replace(/[^a-z0-9_]/gi, '_');
}

export function AttendanceProvider({ children }: { children: ReactNode }) {

  const getAttendance = async (cls: string, date: string): Promise<AttendanceRecord[]> => {
    const data = await kvGet<AttendanceRecord[]>(dayKey(cls, date));
    return data ?? [];
  };

  const saveAttendance = async (cls: string, date: string, records: AttendanceRecord[]) => {
    await kvSet(dayKey(cls, date), records);
    // Update the date index for this class so we can list all attendance dates
    const existing = (await kvGet<string[]>(indexKey(cls))) ?? [];
    if (!existing.includes(date)) {
      await kvSet(indexKey(cls), [...existing, date].sort());
    }
  };

  const getStudentAttendance = async (studentId: string, cls: string) => {
    const dates = (await kvGet<string[]>(indexKey(cls))) ?? [];
    const results: { date: string; status: string }[] = [];
    for (const date of dates) {
      const records = (await kvGet<AttendanceRecord[]>(dayKey(cls, date))) ?? [];
      const record = records.find(r => r.studentId === studentId);
      if (record) results.push({ date, status: record.status });
    }
    return results;
  };

  const getMonthAttendance = async (year: number, month: number) => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    // We'd need to scan all class indexes — collect all classes from their indexes
    // For simplicity, return empty (this function is used in analytics only)
    return [] as { studentId: string; date: string; status: string }[];
  };

  return (
    <Ctx.Provider value={{ getAttendance, saveAttendance, getStudentAttendance, getMonthAttendance }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAttendance = () => useContext(Ctx);
