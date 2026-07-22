'use client';
import { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { EXAM_RESULTS, COLLEGE_INFO } from '@/lib/data';
import type { ExamResult } from '@/lib/types';
import { Award, CheckCircle, Download, Printer, Lock, Trophy } from 'lucide-react';
import { useStudentSession } from '@/hooks/useStudentSession';
import { useResults } from '@/context/ResultsContext';
import { computeStudentMerit, meritLabel } from '@/lib/merit-utils';

async function downloadMarksheetPDF(result: ExamResult) {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.width;
  const today = new Date().toLocaleDateString('en-GB');
  const totalFullMarks = result.totalFullMarks ?? result.subjects.reduce((s, x) => s + x.fullMark, 0);

  doc.setFillColor(109, 40, 217);
  doc.rect(0, 0, pageW, 3, 'F');

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 30, 120);
  doc.text(COLLEGE_INFO.name, pageW / 2, 18, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(`${COLLEGE_INFO.address} | EIIN: ${COLLEGE_INFO.eiin}`, pageW / 2, 24, { align: 'center' });

  doc.setFillColor(245, 240, 255);
  doc.roundedRect(14, 28, pageW - 28, 10, 2, 2, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(109, 40, 217);
  doc.text('ACADEMIC RESULT — MARKSHEET', pageW / 2, 35, { align: 'center' });

  doc.setDrawColor(200, 180, 255);
  doc.setLineWidth(0.4);
  doc.line(14, 41, pageW - 14, 41);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const infoLeft = [
    ['Student Name', result.studentName],
    ['Class',        result.class],
    ['Roll No.',     String(result.roll)],
  ];
  const infoRight = [
    ['Exam',         result.examName],
    ['Year',         result.year],
    ['Issue Date',   today],
  ];

  let y = 48;
  infoLeft.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');   doc.text(`${label}:`, 14, y);
    doc.setFont('helvetica', 'normal'); doc.text(val, 50, y);
    y += 7;
  });
  y = 48;
  infoRight.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');   doc.text(`${label}:`, 120, y);
    doc.setFont('helvetica', 'normal'); doc.text(val, 148, y);
    y += 7;
  });

  doc.setDrawColor(200, 180, 255);
  doc.line(14, 70, pageW - 14, 70);

  autoTable(doc, {
    head: [['#', 'Subject', 'Full Marks', 'Obtained', '%', 'Grade']],
    body: result.subjects.map((s, i) => [
      i + 1,
      s.name,
      s.fullMark,
      s.marks,
      `${s.fullMark > 0 ? Math.round((s.marks / s.fullMark) * 100) : 0}%`,
      s.grade,
    ]),
    foot: [['', 'TOTAL', totalFullMarks, result.totalMarks,
      `${totalFullMarks > 0 ? Math.round((result.totalMarks / totalFullMarks) * 100) : 0}%`,
      result.grade]],
    startY: 74,
    styles: { fontSize: 9, cellPadding: 3.5 },
    headStyles: { fillColor: [109, 40, 217], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 235, 255], textColor: [60, 30, 120], fontStyle: 'bold', fontSize: 10 },
    alternateRowStyles: { fillColor: [252, 250, 255] },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 65 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: (data: Parameters<NonNullable<Parameters<typeof autoTable>[1]['didParseCell']>>[0]) => {
      if (data.section === 'body' && data.column.index === 5) {
        const g = (data.row.raw as string[])[5];
        const styles = data.cell.styles as { textColor: number[] };
        if (g === 'A+') styles.textColor = [22, 163, 74];
        else if (g?.startsWith('A')) styles.textColor = [37, 99, 235];
        else if (g === 'B') styles.textColor = [217, 119, 6];
        else styles.textColor = [220, 38, 38];
      }
    },
  });

  const tableBottom = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  const isPass = result.status === 'pass';

  doc.setFillColor(...(isPass ? [220, 252, 231] : [254, 226, 226]) as [number, number, number]);
  doc.roundedRect(14, tableBottom, pageW - 28, 22, 3, 3, 'F');
  doc.setDrawColor(...(isPass ? [134, 239, 172] : [252, 165, 165]) as [number, number, number]);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, tableBottom, pageW - 28, 22, 3, 3, 'S');

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...(isPass ? [21, 128, 61] : [185, 28, 28]) as [number, number, number]);
  doc.text(isPass ? 'RESULT: PASSED' : 'RESULT: FAILED', pageW / 2, tableBottom + 9, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `GPA: ${result.gpa.toFixed(2)} / 5.00   |   Grade: ${result.grade}   |   ${result.examName}`,
    pageW / 2, tableBottom + 17, { align: 'center' }
  );

  const sigY = tableBottom + 38;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(14, sigY, 65, sigY);
  doc.line(pageW - 65, sigY, pageW - 14, sigY);
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text("Student's Signature",    39,            sigY + 5, { align: 'center' });
  doc.text("Principal's Signature",  pageW - 39,    sigY + 5, { align: 'center' });

  const pageH = doc.internal.pageSize.height;
  doc.setFillColor(109, 40, 217);
  doc.rect(0, pageH - 8, pageW, 8, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('This is a computer-generated marksheet. Noor-E-Islam Madrasha', pageW / 2, pageH - 3, { align: 'center' });

  doc.save(`marksheet-${result.studentName.replace(/\s+/g, '-')}-${result.examName.replace(/\s+/g, '-')}.pdf`);
}

const getGradeColor = (grade: string) => {
  if (grade === 'A+') return 'text-green-700 bg-green-50';
  if (grade.startsWith('A')) return 'text-blue-700 bg-blue-50';
  if (grade === 'B') return 'text-amber-700 bg-amber-50';
  return 'text-red-700 bg-red-50';
};

export default function StudentResultPage() {
  const { student, loading: sessionLoading } = useStudentSession();
  const { results: storedResults, publishedExams } = useResults();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!student) return;

    // Deduplicate by studentId+examName+year; live (storedResults) beats static on same key
    const seen = new Map<string, typeof EXAM_RESULTS[0]>();
    for (const r of [...EXAM_RESULTS, ...storedResults]) {
      const key = `${r.studentId}||${r.examName}||${r.year}`;
      const prev = seen.get(key);
      if (!prev || (r.createdAt ?? '') >= (prev.createdAt ?? '')) seen.set(key, r);
    }
    const found = [...seen.values()]
      .filter(r => r.studentId === student.id)
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
      .at(0) ?? null;

    setResult(found);

    if (found) {
      const key = `${found.examName}||${found.year ?? ''}`;
      setIsPublished(publishedExams.includes(key));
    }
  }, [student, storedResults, publishedExams]);

  const meritInfo = useMemo(() => {
    if (!result || !isPublished) return null;
    const allRes = [...EXAM_RESULTS, ...storedResults];
    const classExam = allRes.filter(
      r => r.examName === result.examName && r.year === result.year && r.class === result.class
    );
    return computeStudentMerit(result.studentId, classExam);
  }, [result, isPublished, storedResults]);

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalFullMarks = result
    ? (result.totalFullMarks ?? result.subjects.reduce((s, x) => s + x.fullMark, 0))
    : 0;

  return (
    <div>
      <DashboardHeader title="পরীক্ষার ফলাফল" subtitle="আপনার বিস্তারিত ফলাফল" userName={student?.name ?? 'শিক্ষার্থী'} role="ছাত্র" userImage={student?.image} />
      <div className="p-6 space-y-6">

        {!result || !isPublished ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <Lock size={36} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">ফলাফল এখনো প্রকাশিত হয়নি</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              ফলাফল প্রকাশের পর এখানে দেখা যাবে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <>
            {/* Result summary */}
            <div className={`grid grid-cols-2 gap-4 ${meritInfo ? 'sm:grid-cols-5' : 'sm:grid-cols-4'}`}>
              {[
                { label: 'মোট নম্বর', value: `${result.totalMarks}`, sub: `/${totalFullMarks}`, color: 'bg-purple-50 text-purple-700' },
                { label: 'GPA', value: result.gpa.toFixed(2), sub: '/5.00', color: 'bg-green-50 text-green-700' },
                { label: 'গ্রেড', value: result.grade, sub: result.status === 'pass' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ', color: 'bg-blue-50 text-blue-700' },
                { label: 'পরীক্ষার নাম', value: result.examName.slice(0, 8), sub: result.examName, color: 'bg-amber-50 text-amber-700' },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className={`${color} rounded-2xl p-5 text-center`}>
                  <p className="text-3xl font-bold">{value}</p>
                  <p className="text-xs opacity-70 mt-0.5">{sub}</p>
                  <p className="text-xs font-semibold mt-2 opacity-80">{label}</p>
                </div>
              ))}
              {meritInfo && (
                <div className="bg-amber-50 text-amber-800 rounded-2xl p-5 text-center col-span-2 sm:col-span-1">
                  <Trophy size={28} className="mx-auto mb-1 text-amber-500" />
                  <p className="text-2xl font-bold">{meritLabel(meritInfo.position)}</p>
                  <p className="text-xs opacity-70 mt-0.5">{meritInfo.total} জনের মধ্যে</p>
                  <p className="text-xs font-semibold mt-2 opacity-80">মেধা স্থান</p>
                </div>
              )}
            </div>

            {/* Subject marks table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Award size={18} className="text-purple-600" /> বিষয়ভিত্তিক নম্বর
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => window.print()}
                    className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                    <Printer size={12} /> প্রিন্ট
                  </button>
                  <button onClick={() => downloadMarksheetPDF(result)}
                    className="flex items-center gap-1.5 text-xs btn-primary rounded-lg px-3 py-1.5">
                    <Download size={12} /> PDF ডাউনলোড
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>
                      <th className="px-5 py-3 text-left">#</th>
                      <th className="px-5 py-3 text-left">বিষয়</th>
                      <th className="px-5 py-3 text-center">পূর্ণমান</th>
                      <th className="px-5 py-3 text-center">প্রাপ্ত নম্বর</th>
                      <th className="px-5 py-3 text-left">অগ্রগতি</th>
                      <th className="px-5 py-3 text-center">গ্রেড</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {result.subjects.map((sub, i) => (
                      <tr key={sub.name} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-5 py-3 font-medium text-gray-900">{sub.nameBn ?? sub.name}</td>
                        <td className="px-5 py-3 text-center text-gray-500">{sub.fullMark}</td>
                        <td className="px-5 py-3 text-center font-bold text-gray-900">{sub.marks}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full gradient-primary rounded-full"
                                style={{ width: `${sub.fullMark > 0 ? Math.round((sub.marks / sub.fullMark) * 100) : 0}%` }} />
                            </div>
                            <span className="text-xs text-gray-400 w-10">
                              {sub.fullMark > 0 ? Math.round((sub.marks / sub.fullMark) * 100) : 0}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getGradeColor(sub.grade)}`}>{sub.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-purple-50">
                    <tr>
                      <td colSpan={3} className="px-5 py-3 font-semibold text-purple-900">মোট</td>
                      <td className="px-5 py-3 text-center font-bold text-purple-900 text-lg">{result.totalMarks}</td>
                      <td />
                      <td className="px-5 py-3 text-center">
                        <span className="text-sm font-bold text-purple-700">{result.grade}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Status banner */}
            <div className={`rounded-2xl p-5 flex items-center gap-4 ${result.status === 'pass'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'}`}>
              <CheckCircle size={32} className={result.status === 'pass' ? 'text-green-600' : 'text-red-600'} />
              <div>
                <p className={`font-bold text-lg ${result.status === 'pass' ? 'text-green-800' : 'text-red-800'}`}>
                  {result.status === 'pass' ? 'অভিনন্দন! আপনি উত্তীর্ণ হয়েছেন।' : 'দুঃখিত, আপনি অনুত্তীর্ণ হয়েছেন।'}
                </p>
                <p className={`text-sm ${result.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                  GPA: {result.gpa.toFixed(2)} | গ্রেড: {result.grade} | {result.examName}
                </p>
                {result.failedSubjects && result.failedSubjects.length > 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    অনুত্তীর্ণ বিষয়: {result.failedSubjects.join('، ')}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
