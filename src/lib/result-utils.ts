import { GRADE_SCALE, EBTEDAYI_GRADE_SCALE, EBTEDAYI_CLASSES } from './data';
import type { Subject, ExamResult, SubjectResult } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Grade & GPA lookup
// ─────────────────────────────────────────────────────────────────────────────

export interface GradeInfo {
  grade: string;
  gpa: number;
  label: string;
  isPassed: boolean;
}

/**
 * Returns grade, GPA point, label, and pass/fail for a given score.
 * @param obtained  marks scored
 * @param fullMark  maximum marks for that subject
 * @param classId   class ID string, used to select ইবতেদায়ি vs দাখিল scale
 */
export function getGradeInfo(obtained: number, fullMark: number, classId: string): GradeInfo {
  if (fullMark <= 0) return { grade: 'N/A', gpa: 0, label: '—', isPassed: true };

  const pct = Math.round((obtained / fullMark) * 100);
  const isEbtedayi = EBTEDAYI_CLASSES.includes(classId);
  const scale = isEbtedayi ? EBTEDAYI_GRADE_SCALE : GRADE_SCALE;

  const entry = scale.find(s => pct >= s.min && pct <= s.max);
  const grade = entry?.grade ?? (isEbtedayi ? 'D' : 'F');
  const gpa   = entry?.gpa  ?? 0;
  const label = entry?.label ?? (isEbtedayi ? 'সহায়তা প্রয়োজন' : 'অকৃতকার্য');

  const passThreshold = isEbtedayi ? 40 : 33;
  const isPassed = pct >= passThreshold;

  return { grade, gpa, label, isPassed };
}

// ─────────────────────────────────────────────────────────────────────────────
// Subject-level result calculation
// ─────────────────────────────────────────────────────────────────────────────

export interface SubjectMarksInput {
  subject: Subject;
  cqObtained: number;
  mcqObtained: number;
  practicalObtained: number;
}

// Simplified input: user enters only the total obtained marks
export interface SubjectTotalInput {
  subject: Subject;
  totalObtained: number;
}

export function calculateSubjectResult(
  input: SubjectMarksInput | SubjectTotalInput,
  classId: string
): SubjectResult {
  const { subject } = input;

  let totalObtained: number;
  let cqObtained = 0, mcqObtained = 0, practicalObtained = 0;

  if ('totalObtained' in input) {
    totalObtained = input.totalObtained;
    // No component-level pass check when using total-only input
  } else {
    cqObtained        = input.cqObtained;
    mcqObtained       = input.mcqObtained;
    practicalObtained = input.practicalObtained;
    totalObtained     = cqObtained + mcqObtained + practicalObtained;
  }

  const gradeInfo = getGradeInfo(totalObtained, subject.fullMark, classId);
  let isPassed = gradeInfo.isPassed;

  // Component-level pass check only for the old 3-field input path
  if (!('totalObtained' in input)) {
    const isEbtedayi = EBTEDAYI_CLASSES.includes(classId);
    if (!isEbtedayi && subject.practicalMark > 0) {
      const theoryFull     = subject.cqMark + subject.mcqMark;
      const theoryObtained = cqObtained + mcqObtained;
      if (theoryFull > 0) {
        const theoryPct = Math.round((theoryObtained / theoryFull) * 100);
        if (theoryPct < 40) isPassed = false;
      }
      const practicalPct = Math.round((practicalObtained / subject.practicalMark) * 100);
      if (practicalPct < 40) isPassed = false;
    }
  }

  return {
    name:            subject.name,
    nameBn:          subject.nameBn,
    fullMark:        subject.fullMark,
    cqMarks:         cqObtained,
    mcqMarks:        mcqObtained,
    practicalMarks:  practicalObtained,
    marks:           totalObtained,
    grade:           gradeInfo.grade,
    gpa:             gradeInfo.gpa,
    isPassed,
    isOptional:      subject.isOptional,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Full result calculation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates a complete ExamResult for a student.
 *
 * Bangladesh Education Board GPA rules (দাখিল/আলিম):
 *   - Status FAIL only if any COMPULSORY subject fails.
 *     Failing an optional (চতুর্থ) subject does NOT cause overall failure.
 *   - GPA = average of compulsory subject GPs
 *           + bonus for each optional subject: max(0, optionalGP − 2.00)
 */
export function calculateExamResult(params: {
  studentId: string;
  studentName: string;
  classId: string;
  roll: number;
  section?: string;
  subjectInputs: (SubjectMarksInput | SubjectTotalInput)[];
  examName: string;
  year: string;
}): ExamResult {
  const { studentId, studentName, classId, roll, section, subjectInputs, examName, year } = params;

  const subjectResults: SubjectResult[] = subjectInputs.map(input =>
    calculateSubjectResult(input, classId)
  );

  const totalMarks     = subjectResults.reduce((s, r) => s + r.marks, 0);
  const totalFullMarks = subjectResults.reduce((s, r) => s + r.fullMark, 0);
  const percentage     = totalFullMarks > 0
    ? Math.round((totalMarks / totalFullMarks) * 1000) / 10
    : 0;

  const overallGradeInfo = getGradeInfo(totalMarks, totalFullMarks, classId);
  const isEbtedayi = EBTEDAYI_CLASSES.includes(classId);

  // Separate compulsory and optional subjects
  const compulsory = subjectResults.filter(r => !r.isOptional);
  const optional   = subjectResults.filter(r =>  r.isOptional);

  // Status: fail only if a COMPULSORY subject is failed
  const failedCompulsory = compulsory.filter(r => !r.isPassed).map(r => r.name);
  const failedOptional   = optional.filter(r => !r.isPassed).map(r => r.name);
  const allFailed        = [...failedCompulsory, ...failedOptional];
  const status: 'pass' | 'fail' = failedCompulsory.length === 0 ? 'pass' : 'fail';

  // GPA (Bangladesh Education Board method)
  let gpa = 0;
  if (!isEbtedayi) {
    const compulsoryGpa = compulsory.length > 0
      ? compulsory.reduce((s, r) => s + r.gpa, 0) / compulsory.length
      : 0;
    const optionalBonus = optional.reduce((b, r) => b + Math.max(0, r.gpa - 2.0), 0);
    gpa = Math.round((compulsoryGpa + optionalBonus) * 100) / 100;
  }

  return {
    id: `res-${studentId}-${examName}-${year}-${Date.now()}`,
    studentId,
    studentName,
    class: classId,
    roll,
    section,
    subjects: subjectResults,
    totalMarks,
    totalFullMarks,
    percentage,
    gpa,
    grade: overallGradeInfo.grade,
    status,
    examName,
    year,
    failedSubjects: allFailed.length > 0 ? allFailed : undefined,
    createdAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary statistics (for admin dashboard)
// ─────────────────────────────────────────────────────────────────────────────

export interface ResultSummary {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  avgGpa: number;
  avgPercentage: number;
  gradeDistribution: Record<string, number>;
}

export function getResultSummary(results: ExamResult[]): ResultSummary {
  if (results.length === 0) {
    return { total: 0, passed: 0, failed: 0, passRate: 0, avgGpa: 0, avgPercentage: 0, gradeDistribution: {} };
  }
  const passed = results.filter(r => r.status === 'pass').length;
  const avgGpa = Math.round((results.reduce((s, r) => s + r.gpa, 0) / results.length) * 100) / 100;
  const avgPercentage = Math.round(
    (results.reduce((s, r) => s + (r.percentage ?? 0), 0) / results.length) * 10
  ) / 10;

  const gradeDistribution: Record<string, number> = {};
  results.forEach(r => {
    gradeDistribution[r.grade] = (gradeDistribution[r.grade] ?? 0) + 1;
  });

  return {
    total: results.length,
    passed,
    failed: results.length - passed,
    passRate: Math.round((passed / results.length) * 100),
    avgGpa,
    avgPercentage,
    gradeDistribution,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────

export const RESULTS_STORE_KEY   = 'results_store';
export const PUBLISHED_EXAMS_KEY = 'published_results_v1';

export function loadResultsFromStorage(): ExamResult[] {
  try {
    const raw = localStorage.getItem(RESULTS_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveResultToStorage(result: ExamResult): void {
  const existing = loadResultsFromStorage();
  // Replace if same student + exam + year already exists
  const filtered = existing.filter(
    r => !(r.studentId === result.studentId && r.examName === result.examName && r.year === result.year)
  );
  localStorage.setItem(RESULTS_STORE_KEY, JSON.stringify([...filtered, result]));
}

export function getPublishedExams(): string[] {
  try {
    return JSON.parse(localStorage.getItem(PUBLISHED_EXAMS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function isExamPublished(examName: string): boolean {
  return getPublishedExams().includes(examName);
}
