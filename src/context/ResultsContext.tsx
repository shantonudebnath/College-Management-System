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

// Deduplicate results: per studentId+examName+year, keep the most recent by createdAt
function deduplicateResults(raw: ExamResult[]): ExamResult[] {
  const seen = new Map<string, ExamResult>();
  for (const r of raw) {
    const key = `${r.studentId}||${r.examName}||${r.year}`;
    const prev = seen.get(key);
    if (!prev || (r.createdAt ?? '') >= (prev.createdAt ?? '')) seen.set(key, r);
  }
  return [...seen.values()];
}

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResultsState] = useState<ExamResult[]>(
    deduplicateResults(kvGetSync<ExamResult[]>(RESULTS_KEY) ?? [])
  );
  const [publishedExams, setPublishedExams] = useState<string[]>(kvGetSync<string[]>(PUBLISHED_KEY) ?? []);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const [resData, pubData] = await Promise.all([
      kvGet<ExamResult[]>(RESULTS_KEY),
      kvGet<string[]>(PUBLISHED_KEY),
    ]);
    const raw = resData ?? [];
    const deduped = deduplicateResults(raw);
    setResultsState(deduped);
    // Auto-repair: if duplicates existed in storage, write back the clean array
    if (deduped.length < raw.length) await kvSet(RESULTS_KEY, deduped);
    setPublishedExams(pubData ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const upsertResult = async (result: ExamResult) => {
    // Match by studentId+examName+year (not id) so re-saves update instead of duplicate
    const existsIdx = results.findIndex(
      r => r.studentId === result.studentId && r.examName === result.examName && r.year === result.year
    );
    const updated = existsIdx >= 0
      ? results.map((r, i) => i === existsIdx ? result : r)
      : [...results, result];
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
