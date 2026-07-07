'use client';
import { useRef } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { COLLEGE_INFO, MADRASHA_CLASSES } from '@/lib/data';
import { useStudentSession } from '@/hooks/useStudentSession';
import { IdCard, Printer } from 'lucide-react';

export default function StudentIdCardPage() {
  const { student, loading } = useStudentSession();
  const printRef = useRef<HTMLDivElement>(null);

  const className = student?.class
    ? (MADRASHA_CLASSES.find(c => c.id === student.class)?.nameBn ?? student.class)
    : '—';

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        শিক্ষার্থীর তথ্য পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #student-id-card, #student-id-card * { visibility: visible !important; }
          #student-id-card {
            position: fixed !important;
            top: 20mm !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <DashboardHeader
        title="পরিচয়পত্র"
        subtitle="শিক্ষার্থীর পরিচয়পত্র দেখুন ও প্রিন্ট করুন"
        userName={student.nameBn ?? student.name}
        role="ছাত্র"
        userImage={student.image}
      />

      <div className="p-6 space-y-5">
        <div className="no-print flex justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            <Printer size={16} /> প্রিন্ট করুন
          </button>
        </div>

        {/* Card preview */}
        <div className="no-print flex justify-center">
          <p className="text-xs text-gray-400">নিচে পরিচয়পত্রের প্রিভিউ দেখানো হচ্ছে</p>
        </div>

        <div className="flex justify-center">
          <div ref={printRef} id="student-id-card" style={{
            width: '85.6mm',
            minHeight: '54mm',
            border: '2px solid #1e1b4b',
            borderRadius: '8px',
            fontFamily: "'Noto Serif Bengali', 'Vrinda', serif",
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            position: 'relative',
          }}>

            {/* Watermark logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt=""
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '70px', opacity: 0.05, pointerEvents: 'none', zIndex: 0,
              }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />

            {/* Header */}
            <div style={{
              background: '#1e1b4b', color: '#fff',
              padding: '5px 8px 4px', textAlign: 'center',
              position: 'relative', zIndex: 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt=""
                  style={{ width: '22px', height: '22px', objectFit: 'contain', borderRadius: '4px', background: '#fff', padding: '1px' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div>
                  <div style={{ fontSize: '8.5pt', fontWeight: 900, lineHeight: 1.2 }}>{COLLEGE_INFO.nameBn}</div>
                  <div style={{ fontSize: '5pt', color: '#a5b4fc', marginTop: '1px' }}>{COLLEGE_INFO.address}</div>
                </div>
              </div>
              <div style={{
                marginTop: '3px', background: 'rgba(255,255,255,0.15)',
                borderRadius: '4px', padding: '1.5px 0',
                fontSize: '7pt', fontWeight: 700, letterSpacing: '1px',
              }}>
                শিক্ষার্থী পরিচয়পত্র
              </div>
            </div>

            {/* Body */}
            <div style={{
              display: 'flex', gap: 0,
              padding: '5px 6px 5px',
              position: 'relative', zIndex: 1,
              minHeight: '38mm',
            }}>
              {/* Photo */}
              <div style={{
                width: '20mm', flexShrink: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '3px',
              }}>
                <div style={{
                  width: '18mm', height: '22mm',
                  border: '1.5px solid #1e1b4b',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#f3f4f6',
                  flexShrink: 0,
                }}>
                  {student.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={student.image} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '6pt' }}>
                      <div style={{ fontSize: '22pt', lineHeight: 1, color: '#d1d5db' }}>☐</div>
                      ছবি
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '5pt', color: '#6b7280', textAlign: 'center' }}>সত্যায়িত ছবি</div>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', background: '#e5e7eb', margin: '0 5px', flexShrink: 0 }} />

              {/* Info */}
              <div style={{ flex: 1, fontSize: '6.5pt' }}>
                {[
                  ['নাম', student.name],
                  ['বাংলা নাম', student.nameBn || '—'],
                  ['পিতার নাম', student.fatherName || '—'],
                  ['মাতার নাম', student.motherName || '—'],
                  ['শ্রেণি', `${className} | শাখা: ${student.section || '—'}`],
                  ['রোল নং', String(student.roll ?? '—')],
                  ['শিক্ষার্থী আইডি', student.studentId],
                  ['সেশন', student.session || '—'],
                  ['রক্তের গ্রুপ', (student as { bloodGroup?: string }).bloodGroup || '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'baseline',
                    marginBottom: '1.5mm',
                    borderBottom: '0.5px solid #f3f4f6',
                    paddingBottom: '1mm',
                  }}>
                    <span style={{ minWidth: '20mm', color: '#6b7280', flexShrink: 0 }}>{label}:</span>
                    <span style={{ fontWeight: 700, color: '#111827', flex: 1 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              padding: '3mm 6mm 3mm',
              background: '#fafafa',
              position: 'relative', zIndex: 1,
            }}>
              <div style={{ textAlign: 'center', fontSize: '5.5pt', color: '#6b7280' }}>
                <div style={{ height: '8mm' }} />
                <div style={{ borderTop: '0.8px solid #9ca3af', paddingTop: '1mm', minWidth: '20mm' }}>শিক্ষার্থীর স্বাক্ষর</div>
              </div>
              <div style={{ textAlign: 'center', fontSize: '5pt', color: '#9ca3af' }}>
                <div style={{ fontSize: '5pt' }}>EIIN: {COLLEGE_INFO.eiin}</div>
                <div>{COLLEGE_INFO.phone.split(',')[0]}</div>
              </div>
              <div style={{ textAlign: 'center', fontSize: '5.5pt', color: '#6b7280' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/principal-sign.jpg"
                  alt=""
                  style={{ height: '8mm', maxWidth: '24mm', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div style={{ borderTop: '0.8px solid #9ca3af', paddingTop: '1mm', minWidth: '20mm' }}>অধ্যক্ষের স্বাক্ষর</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="no-print flex justify-center">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 text-xs text-blue-700 text-center max-w-sm">
            <IdCard size={14} className="inline mr-1.5" />
            প্রিন্ট করে লেমিনেট করলে স্থায়ী পরিচয়পত্র হিসেবে ব্যবহার করা যাবে।
          </div>
        </div>
      </div>
    </div>
  );
}
