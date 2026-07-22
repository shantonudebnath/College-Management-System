'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ExamResult } from '@/lib/types';
import { kvGet, kvGetSync, kvSet } from '@/lib/supabase/kv';

const RESULTS_KEY = 'results_data';
const PUBLISHED_KEY = 'published_results_data';

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

function resultId(r: ExamResult) {
  return r.id ?? `${r.studentId}-${r.examName}-${r.year}`;
}

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResultsState] = useState<ExamResult[]>(kvGetSync<ExamResult[]>(RESULTS_KEY) ?? []);
  const [publishedExams, setPublishedExams] = useState<string[]>(kvGetSync<string[]>(PUBLISHED_KEY) ?? []);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const [resData, pubData] = await Promise.all([
      kvGet<ExamResult[]>(RESULTS_KEY),
      kvGet<string[]>(PUBLISHED_KEY),
    ]);
    setResultsState(resData ?? []);
    setPublishedExams(pubData ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const upsertResult = async (result: ExamResult) => {
    const id = resultId(result);
    const withId = { ...result, id };
    const updated = results.find(r => r.id === id)
      ? results.map(r => r.id === id ? withId : r)
      : [...results, withId];
    setResultsState(updated);
    await kvSet(RESULTS_KEY, updated);
  };

  const deleteResult = async (id: string) => {
    const updated = results.filter(r => r.id !== id);
    setResultsState(updated);
    await kvSet(RESULTS_KEY, updated);
  };

  const setResults = async (updated: ExamResult[]) => {
    setResultsState(updated);
    await kvSet(RESULTS_KEY, updated);
  };

  const publishExam = async (examName: string) => {
    if (publishedExams.includes(examName)) return;
    const updated = [...publishedExams, examName];
    setPublishedExams(updated);
    await kvSet(PUBLISHED_KEY, updated);
  };

  const unpublishExam = async (examName: string) => {
    const updated = publishedExams.filter(e => e !== examName);
    setPublishedExams(updated);
    await kvSet(PUBLISHED_KEY, updated);
  };

  return (
    <Ctx.Provider value={{ results, publishedExams, loading, upsertResult, deleteResult, setResults, publishExam, unpublishExam }}>
      {children}
    </Ctx.Provider>
  );
}

export const useResults = () => useContext(Ctx);
