export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  nameBn: string;
  fatherName: string;
  motherName: string;
  class: string;
  section: string;
  roll: number;
  session: string;
  dob: string;
  gender: string;
  religion: string;
  phone: string;
  guardianPhone?: string;
  address: string;
  bloodGroup?: string;
  birthCertNo?: string;
  image?: string;
  registrationStatus: 'pending' | 'approved' | 'rejected';
  feeStatus: 'paid' | 'due' | 'partial';
  createdAt: string;
}

export interface Teacher {
  id: string;
  teacherId: string;
  name: string;
  nameBn: string;
  designation: string;
  department: string;
  subject: string[];
  classes: string[];
  classSubjects?: Record<string, string[]>;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  joinDate: string;
  image?: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  nameBn: string;
  section: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  subjects: string[];
}

export interface Subject {
  name: string;
  nameBn: string;
  fullMark: number;        // total = cqMark + mcqMark + practicalMark
  passMark: number;        // minimum total marks to pass the subject
  cqMark: number;          // CQ (subjective/creative question) portion
  mcqMark: number;         // MCQ portion (0 if not applicable)
  practicalMark: number;   // Practical/oral portion (0 if not applicable)
  subjectCode?: string;    // BMEB subject code
  isOptional?: boolean;    // whether this is an optional/elective subject
  optionalGroup?: string;  // group name e.g. 'science', 'humanities', 'pe', 'vocational'
  type: 'theory' | 'practical' | 'mixed';
}

export interface SubjectResult {
  name: string;
  nameBn?: string;
  fullMark: number;
  cqMarks: number;
  mcqMarks: number;
  practicalMarks: number;
  marks: number;           // total obtained (cqMarks + mcqMarks + practicalMarks)
  grade: string;
  gpa: number;
  isPassed: boolean;
  isOptional?: boolean;
}

export interface ExamResult {
  id?: string;
  studentId: string;
  studentName: string;
  class: string;
  roll: number;
  section?: string;
  subjects: SubjectResult[];
  totalMarks: number;
  totalFullMarks?: number;
  percentage?: number;
  gpa: number;
  grade: string;
  status: 'pass' | 'fail';
  examName: string;
  year: string;
  failedSubjects?: string[];
  createdAt?: string;
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  feeType: string;
  amount: number;
  discount?: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'due' | 'partial';
  receiptNo?: string;
}

export interface Waiver {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  waiverType: 'fixed' | 'percentage';
  waiverValue: number;
  reason: string;
  feeTypes: string[];  // empty array = applies to ALL fee types
  appliedDate: string;
  isActive: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'general' | 'exam' | 'fee' | 'result' | 'holiday';
  target: 'all' | 'student' | 'teacher';
  isImportant: boolean;
  postedBy: string;
  attachmentName?: string;
  attachmentData?: string;
}

export interface ExamSchedule {
  id: string;
  examName: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface ClassRoutine {
  day: string;
  periods: { time: string; subject: string; teacher: string; class: string }[];
}

export interface Syllabus {
  class: string;
  subject: string;
  chapter: string;
  topics: string[];
  status: 'completed' | 'ongoing' | 'pending';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  class: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  fileUrl?: string;
  type: 'note' | 'suggestion';
}
