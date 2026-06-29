'use client';
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import StudentIdCard from '@/components/ui/StudentIdCard';
import { STUDENTS, MADRASHA_CLASSES } from '@/lib/data';
import type { Student } from '@/lib/types';
import { Printer, Users, ChevronDown } from 'lucide-react';

const CARDS_PER_PAGE = 6;

function chunk<T>(arr: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += size) pages.push(arr.slice(i, i + size));
  return pages;
}

function getClassName(id: string) {
  return MADRASHA_CLASSES.find(c => c.id === id)?.nameBn ?? id;
}

export default function AdminIdCardsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filterClass, setFilterClass] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem('students_store');
      const stored: Student[] = s ? JSON.parse(s) : [];
      const storedIds = new Set(stored.map(st => st.id));
      const merged = [...stored, ...STUDENTS.filter(st => !storedIds.has(st.id))];
      setStudents(merged.length > 0 ? merged : STUDENTS);
    } catch { setStudents(STUDENTS); }
  }, []);

  useEffect(() => {
    if (!printing) return;
    window.print();
    const handler = () => setPrinting(false);
    window.addEventListener('afterprint', handler, { once: true });
    return () => window.removeEventListener('afterprint', handler);
  }, [printing]);

  const sessions = Array.from(new Set(students.map(s => s.session).filter(Boolean))).sort().reverse();

  const filtered = students.filter(s =>
    (!filterClass || s.class === filterClass) &&
    (!filterSession || s.session === filterSession)
  );

  const pages = chunk(filtered, CARDS_PER_PAGE);

  const CARD_STYLE = {
    width: '85.6mm',
    border: '2px solid #1e1b4b',
    borderRadius: '8px',
    fontFamily: "'Noto Serif Bengali','Vrinda',serif",
    overflow: 'hidden',
    background: '#fff',
    breakInside: 'avoid' as const,
  };

  return (
    <div>
      <style>{`
        @media screen { #id-cards-printable { display: none; } }
        @media print {
          body * { visibility: hidden !important; }
          #id-cards-printable, #id-cards-printable * { visibility: visible !important; }
          #id-cards-printable {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100% !important; margin: 0 !important; padding: 0 !important;
          }
          .print-page {
            page-break-after: always;
            break-after: page;
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 6mm !important;
            padding: 10mm !important;
            box-sizing: border-box !important;
            width: 210mm !important;
          }
          .print-page:last-child { page-break-after: auto; break-after: auto; }
        }
      `}</style>

      <DashboardHeader
        title="পরিচয়পত্র প্রিন্ট"
        subtitle="একসাথে সকল শিক্ষার্থীর পরিচয়পত্র প্রিন্ট করুন — প্রতি পৃষ্ঠায় ৬টি"
        userName="Admin"
        role="Super Admin"
      />

      <div className="p-6 space-y-5">
        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex flex-wrap items-center gap-4">
            {/* Class filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">শ্রেণি:</label>
              <div className="relative">
                <select
                  value={filterClass}
                  onChange={e => setFilterClass(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none"
                >
                  <option value="">সব শ্রেণি</option>
                  {MADRASHA_CLASSES.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Session filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">সেশন:</label>
              <div className="relative">
                <select
                  value={filterSession}
                  onChange={e => setFilterSession(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 appearance-none"
                >
                  <option value="">সব সেশন</option>
                  {sessions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 ml-auto">
              <Users size={14} />
              <span><b className="text-gray-800">{filtered.length}</b> জন শিক্ষার্থী</span>
              <span className="text-gray-300">|</span>
              <span><b className="text-gray-800">{pages.length}</b> পৃষ্ঠা</span>
              <span className="text-gray-300">|</span>
              <span>প্রতি পৃষ্ঠায় ৬টি কার্ড</span>
            </div>

            <button
              onClick={() => setPrinting(true)}
              disabled={filtered.length === 0 || printing}
              className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-opacity"
            >
              <Printer size={16} />
              {printing ? 'প্রিন্ট হচ্ছে...' : 'PDF / প্রিন্ট'}
            </button>
          </div>
        </div>

        {/* Preview */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Users size={36} className="mb-3 opacity-30" />
            <p className="text-sm">কোনো শিক্ষার্থী পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 text-center">প্রিভিউ — প্রিন্টে প্রতি পৃষ্ঠায় ২ কলাম × ৩ সারি = ৬টি কার্ড হবে</p>
            {pages.map((pageStudents, pageIdx) => (
              <div key={pageIdx} className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4">
                <p className="text-[10px] text-gray-400 mb-3 text-center">পৃষ্ঠা {pageIdx + 1}</p>
                <div className="grid grid-cols-2 gap-3 justify-items-center">
                  {pageStudents.map(s => (
                    <div key={s.id} style={CARD_STYLE}>
                      <StudentIdCard student={s} className={getClassName(s.class)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Print-only output */}
      <div id="id-cards-printable">
        {pages.map((pageStudents, pageIdx) => (
          <div key={pageIdx} className="print-page">
            {pageStudents.map(s => (
              <div key={s.id} style={{ ...CARD_STYLE, width: 'auto' }}>
                <StudentIdCard student={s} className={getClassName(s.class)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
