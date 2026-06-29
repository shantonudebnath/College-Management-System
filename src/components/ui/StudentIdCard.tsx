'use client';
import { COLLEGE_INFO } from '@/lib/data';
import type { Student } from '@/lib/types';

interface Props {
  student: Student;
  className: string;
}

export default function StudentIdCard({ student: s, className: cls }: Props) {
  return (
    <>
      {/* Header */}
      <div style={{ background: '#1e1b4b', color: '#fff', padding: '5px 8px 4px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png" alt=""
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
        }}>শিক্ষার্থী পরিচয়পত্র</div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 0, padding: '5px 6px', minHeight: '38mm' }}>
        {/* Photo */}
        <div style={{ width: '20mm', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <div style={{
            width: '18mm', height: '22mm', border: '1.5px solid #1e1b4b',
            borderRadius: '4px', overflow: 'hidden', display: 'flex',
            alignItems: 'center', justifyContent: 'center', background: '#f3f4f6',
          }}>
            {s.image
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '6pt' }}>
                  <div style={{ fontSize: '18pt', color: '#d1d5db' }}>☐</div>ছবি
                </div>
            }
          </div>
          <div style={{ fontSize: '5pt', color: '#6b7280', textAlign: 'center' }}>সত্যায়িত ছবি</div>
        </div>

        <div style={{ width: '1px', background: '#e5e7eb', margin: '0 5px', flexShrink: 0 }} />

        {/* Info */}
        <div style={{ flex: 1, fontSize: '6.5pt' }}>
          {([
            ['নাম', s.name],
            ['বাংলা নাম', s.nameBn || '—'],
            ['পিতার নাম', s.fatherName || '—'],
            ['মাতার নাম', s.motherName || '—'],
            ['শ্রেণি', `${cls} | শাখা: ${s.section || '—'}`],
            ['রোল নং', String(s.roll ?? '—')],
            ['শিক্ষার্থী আইডি', s.studentId],
            ['সেশন', s.session || '—'],
            ['রক্তের গ্রুপ', (s as { bloodGroup?: string }).bloodGroup || '—'],
          ] as [string, string][]).map(([label, value]) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'baseline',
              marginBottom: '1.5mm', borderBottom: '0.5px solid #f3f4f6', paddingBottom: '1mm',
            }}>
              <span style={{ minWidth: '20mm', color: '#6b7280', flexShrink: 0 }}>{label}:</span>
              <span style={{ fontWeight: 700, color: '#111827', flex: 1 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #e5e7eb', display: 'flex',
        justifyContent: 'space-between', alignItems: 'flex-end',
        padding: '3mm 6mm 3mm', background: '#fafafa',
      }}>
        <div style={{ textAlign: 'center', fontSize: '5.5pt', color: '#6b7280' }}>
          <div style={{ height: '8mm' }} />
          <div style={{ borderTop: '0.8px solid #9ca3af', paddingTop: '1mm', minWidth: '20mm' }}>শিক্ষার্থীর স্বাক্ষর</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '5pt', color: '#9ca3af' }}>
          <div>EIIN: {COLLEGE_INFO.eiin}</div>
          <div>{COLLEGE_INFO.phone.split(',')[0]}</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '5.5pt', color: '#6b7280' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/principal-sign.jpg" alt=""
            style={{ height: '8mm', maxWidth: '24mm', objectFit: 'contain', display: 'block', margin: '0 auto' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div style={{ borderTop: '0.8px solid #9ca3af', paddingTop: '1mm', minWidth: '20mm' }}>অধ্যক্ষের স্বাক্ষর</div>
        </div>
      </div>
    </>
  );
}
