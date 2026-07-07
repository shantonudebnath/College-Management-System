'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ExamResult } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const RESULTS_CACHE = 'nim_results_cache';
const PUBLISHED_CACHE = 'nim_published_cache';

function readCache<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : []; } catch { return []; }
}
function writeCache(key: string, data: unknown[]) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

interface ResultsCtx {
  results: ExamResult[];
  publishedExams: string[];
  loading: boolean;
  upsertResult: (result: ExamResult) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  setResults: (results: ExamResult[]) => Promise<void>;
  publishExam: (examName: string) => Promise<void>;
  unpublishExam: (examName: string) => Promise<void>;
}

const Ctx = createContext<ResultsCtx>({
  results: [], publishedExams: [], loading: true,
  upsertResult: async () => {}, deleteResult: async () => {}, setResults: async () => {},
  publishExam: async () => {}, unpublishExam: async () => {},
});

function toRow(r: ExamResult) {
  return {
    id: r.id ?? `${r.studentId}-${r.examName}-${r.year}`,
    student_id: r.studentId, student_name: r.studentName,
    class: r.class, roll: r.roll, section: r.section ?? '',
    subjects: r.subjects, total_marks: r.totalMarks,
    total_full_marks: r.totalFullMarks ?? 0,
    percentage: r.percentage ?? 0,
    gpa: r.gpa, grade: r.grade, status: r.status,
    exam_name: r.examName, year: r.year,
    failed_subjects: r.failedSubjects ?? [],
    created_at: r.createdAt ?? new Date().toISOString(),
  };
}

function fromRow(r: Record<string, unknown>): ExamResult {
  return {
    id: r.id as string,
    studentId: r.student_id as string,
    studentName: r.student_name as string,
    class: r.class as string,
    roll: r.roll as number,
    section: (r.section as string) ?? '',
    subjects: (r.subjects as ExamResult['subjects']) ?? [],
    totalMarks: r.total_marks as number,
    totalFullMarks: r.total_full_marks as number,
    percentage: r.percentage as number,
    gpa: r.gpa as number,
    grade: r.grade as string,
    status: r.status as ExamResult['status'],
    examName: r.exam_name as string,
    year: r.year as string,
    failedSubjects: (r.failed_subjects as string[]) ?? [],
    createdAt: r.created_at as string,
  };
}

export function ResultsProvider({ children }: { children: ReactNode }) {
  const cachedResults = readCache<ExamResult>(RESULTS_CACHE);
  const cachedPublished = readCache<string>(PUBLISHED_CACHE);
  const [results, setResultsState] = useState<ExamResult[]>(cachedResults);
  const [publishedExams, setPublishedExams] = useState<string[]>(cachedPublished);
  const [loading, setLoading] = useState(cachedResults.length === 0);
  const supabase = createClient();

  const refetch = useCallback(async () => {
    if (results.length === 0) setLoading(true);
    const [resRes, pubRes] = await Promise.all([
      supabase.from('results').select('*'),
      supabase.from('published_results').select('exam_name'),
    ]);
    if (!resRes.error && resRes.data) {
      const mapped = resRes.data.map(fromRow);
      setResultsState(mapped);
      writeCache(RESULTS_CACHE, mapped);
    }
    if (!pubRes.error && pubRes.data) {
      const pub = pubRes.data.map((r: Record<string, unknown>) => r.exam_name as string);
      setPublishedExams(pub);
      writeCache(PUBLISHED_CACHE, pub);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  useEffect(() => { refetch(); }, [refetch]);

  const upsertResult = async (result: ExamResult) => {
    const row = toRow(result);
    setResultsState(prev => {
      const exists = prev.find(r => r.id === row.id);
      return exists ? prev.map(r => r.id === row.id ? result : r) : [...prev, result];
    });
    await supabase.from('results').upsert(row);
  };

  const setResults = async (updated: ExamResult[]) => {
    setResultsState(updated);
    await supabase.from('results').upsert(updated.map(toRow));
  };

  const deleteResult = async (id: string) => {
    setResultsState(prev => prev.filter(r => r.id !== id));
    await supabase.from('results').delete().eq('id', id);
  };

  const publishExam = async (examName: string) => {
    if (publishedExams.includes(examName)) return;
    setPublishedExams(prev => [...prev, examName]);
    await supabase.from('published_results').upsert({ exam_name: examName });
  };

  const unpublishExam = async (examName: string) => {
    setPublishedExams(prev => prev.filter(e => e !== examName));
    await supabase.from('published_results').delete().eq('exam_name', examName);
  };

  return (
    <Ctx.Provider value={{ results, publishedExams, loading, upsertResult, deleteResult, setResults, publishExam, unpublishExam }}>
      {children}
    </Ctx.Provider>
  );
}

export const useResults = () => useContext(Ctx);
