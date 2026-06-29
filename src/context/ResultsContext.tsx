'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ExamResult } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

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
  const [results, setResultsState] = useState<ExamResult[]>([]);
  const [publishedExams, setPublishedExams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const refetch = useCallback(async () => {
    setLoading(true);
    const [resRes, pubRes] = await Promise.all([
      supabase.from('results').select('*'),
      supabase.from('published_results').select('exam_name'),
    ]);
    if (!resRes.error && resRes.data) setResultsState(resRes.data.map(fromRow));
    if (!pubRes.error && pubRes.data) setPublishedExams(pubRes.data.map(r => r.exam_name));
    setLoading(false);
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
