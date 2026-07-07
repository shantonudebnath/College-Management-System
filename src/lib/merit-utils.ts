import type { ExamResult } from '@/lib/types';

// Merit sort: GPA desc → totalMarks desc → roll asc (lower prev roll = better tiebreaker)
function meritSort(a: ExamResult, b: ExamResult): number {
  if (b.gpa !== a.gpa) return b.gpa - a.gpa;
  if ((b.totalMarks ?? 0) !== (a.totalMarks ?? 0)) return (b.totalMarks ?? 0) - (a.totalMarks ?? 0);
  return (a.roll ?? 0) - (b.roll ?? 0);
}

// Returns map of studentId → merit position (1-indexed, per-class)
export function computeMeritMap(results: ExamResult[]): Map<string, number> {
  const byClass: Record<string, ExamResult[]> = {};
  results.forEach(r => {
    (byClass[r.class] ??= []).push(r);
  });

  const map = new Map<string, number>();
  for (const classResults of Object.values(byClass)) {
    [...classResults].sort(meritSort).forEach((r, i) => map.set(r.studentId, i + 1));
  }
  return map;
}

// Compute merit for a student within a specific exam+year+class group
export function computeStudentMerit(
  studentId: string,
  results: ExamResult[]
): { position: number; total: number } | null {
  const sorted = [...results].sort(meritSort);
  const idx = sorted.findIndex(r => r.studentId === studentId);
  return idx >= 0 ? { position: idx + 1, total: sorted.length } : null;
}

// Bangla ordinal string: 1 → ১ম, 2 → ২য়, etc.
export function toBanglaOrdinal(n: number): string {
  const bn = n.toLocaleString('bn-BD');
  if (n === 1) return `${bn}ম`;
  if (n === 2) return `${bn}য়`;
  if (n === 3) return `${bn}য়`;
  return `${bn}তম`;
}

export function meritBadgeClass(pos: number): string {
  if (pos === 1) return 'bg-amber-100 text-amber-800 border border-amber-300 font-bold';
  if (pos === 2) return 'bg-slate-100 text-slate-700 border border-slate-300 font-bold';
  if (pos === 3) return 'bg-orange-100 text-orange-700 border border-orange-300 font-bold';
  return 'bg-blue-50 text-blue-700';
}

export function meritLabel(pos: number): string {
  if (pos === 1) return `🥇 ${toBanglaOrdinal(1)}`;
  if (pos === 2) return `🥈 ${toBanglaOrdinal(2)}`;
  if (pos === 3) return `🥉 ${toBanglaOrdinal(3)}`;
  return toBanglaOrdinal(pos);
}
