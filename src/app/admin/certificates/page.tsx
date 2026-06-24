'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { MADRASHA_CLASSES, COLLEGE_INFO } from '@/lib/data';
import { Award, Printer, RotateCcw, Eye } from 'lucide-react';

const GRADES = ['A+', 'A', 'A-', 'B', 'C', 'D'];
const BEHAVIOURS = ['অত্যন্ত ভালো', 'ভালো', 'সন্তোষজনক'];
const POSITIONS = ['১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '—'];

interface CertForm {
  studentName: string;
  fatherName: string;
  motherName: string;
  classId: string;
  roll: string;
  examName: string;
  year: string;
  grade: string;
  gpa: string;
  position: string;
  behaviour: string;
  issueDate: string;
  certNo: string;
}

const BLANK: CertForm = {
  studentName: '',
  fatherName: '',
  motherName: '',
  classId: '',
  roll: '',
  examName: '',
  year: new Date().getFullYear().toString(),
  grade: 'A+',
  gpa: '5.00',
  position: '১ম',
  behaviour: 'অত্যন্ত ভালো',
  issueDate: new Date().toLocaleDateString('bn-BD'),
  certNo: '',
};

function toBnNum(n: string | number) {
  return String(n).replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[+d]);
}

/* URL-encoded SVG diamond tile for the border pattern */
const DIAMOND_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='20' fill='%23e8eaf6'/%3E%3Cpath d='M10,1 L19,10 L10,19 L1,10 Z' fill='none' stroke='%231a237e' stroke-width='1.3'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%231a237e' opacity='0.5'/%3E%3C/svg%3E")`;

function certHTML(f: CertForm, logoSrc = ''): string {
  const cls = MADRASHA_CLASSES.find(c => c.id === f.classId)?.nameBn ?? f.classId;
  const year = toBnNum(f.year);
  const roll = f.roll ? toBnNum(f.roll) : '';

  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<title>প্রশংসাপত্র — ${f.studentName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:210mm;background:#fff;font-family:'Noto Serif Bengali',serif;color:#0a0820}

/* ── Outer wrapper: the diamond-pattern border strip ── */
.cert-outer{
  width:210mm;min-height:297mm;
  padding:12px;
  background-image:${DIAMOND_SVG};
  background-size:20px 20px;
  border:3px solid #0d47a1;
  position:relative;
}
/* Outer solid line on top of pattern */
.cert-outer::before{
  content:'';position:absolute;inset:3px;
  border:2px solid #0d47a1;
  pointer-events:none;z-index:0;
}

/* ── Inner white content area ── */
.cert-inner{
  position:relative;
  background:#fff;
  border:2px solid #0d47a1;
  min-height:calc(297mm - 48px);
  padding:8mm 10mm 8mm;
  overflow:hidden;
}

/* ── Watermark ── */
.wm-circle{
  position:absolute;
  top:50%;left:50%;
  transform:translate(-50%,-50%);
  width:220px;height:220px;
  border-radius:50%;
  border:3px solid rgba(13,71,161,0.07);
  display:flex;align-items:center;justify-content:center;
  pointer-events:none;z-index:0;
  text-align:center;
  font-size:11pt;font-weight:700;
  color:rgba(13,71,161,0.06);
  line-height:1.5;padding:20px;
}
.wm-logo{
  position:absolute;
  top:50%;left:50%;
  transform:translate(-50%,-50%);
  width:180px;
  opacity:0.07;
  pointer-events:none;z-index:0;
}

/* ── All content above watermark ── */
.content{position:relative;z-index:1}

/* ── Header ── */
.header{text-align:center;padding-bottom:5mm;border-bottom:2.5px solid #0d47a1}
.inst-bn{font-size:17pt;font-weight:900;color:#0d47a1;line-height:1.3}
.inst-en{font-size:8.5pt;color:#555;margin-top:1mm;letter-spacing:.3px}
.inst-addr{font-size:9pt;color:#333;margin-top:1.5mm}
.inst-meta{font-size:8pt;color:#777;margin-top:1mm}
.cert-no-right{text-align:right;font-size:8pt;color:#888;margin-top:1.5mm}

/* ── Title ── */
.title-row{display:flex;align-items:center;justify-content:center;margin:5mm 0 3mm}
.title-pill{
  background:#0d47a1;color:#fff;
  font-size:20pt;font-weight:700;
  padding:3mm 18mm;border-radius:40px;
  letter-spacing:2px;
  border:2px solid #e8eaf6;
  box-shadow:0 2px 8px rgba(13,71,161,.25);
}

/* ── Dividers ── */
.divider{border:none;border-top:1.5px solid #90caf9;margin:3mm 0}

/* ── Body ── */
.body-para{
  font-size:11pt;line-height:2.1;
  text-align:justify;
  margin:3mm 0;
}
.hl{font-weight:700;text-decoration:underline;text-underline-offset:3px;text-decoration-color:#0d47a1}
.val{font-weight:700;color:#0d47a1}

/* ── Footer ── */
.footer{
  margin-top:10mm;
  display:flex;justify-content:space-between;align-items:flex-end;
}
.footer-date{font-size:10pt;line-height:2;color:#222}

/* ── Seal ── */
.seal-wrap{display:flex;flex-direction:column;align-items:center;gap:2mm}
.seal-circle{
  width:72px;height:72px;border-radius:50%;
  border:2px dashed rgba(13,71,161,.35);
  display:flex;align-items:center;justify-content:center;
  font-size:7.5pt;color:rgba(13,71,161,.3);
  text-align:center;line-height:1.4;
}

/* ── Signature ── */
.sig-wrap{text-align:center}
.sig-space{height:15mm}
.sig-line{border-top:1.5px solid #0d47a1;padding-top:2mm;font-size:10pt;font-weight:700;min-width:50mm}
.sig-sub{font-size:8pt;color:#555;margin-top:1mm}

@media print{
  @page{size:A4 portrait;margin:0}
  html,body{width:210mm}
  .cert-outer{border:3px solid #0d47a1}
}
</style>
</head>
<body>
<div class="cert-outer">
  <div class="cert-inner">

    <!-- Watermarks -->
    ${logoSrc ? `<img src="${logoSrc}" class="wm-logo" alt="" />` : ''}
    <div class="wm-circle">${COLLEGE_INFO.nameBn}<br>ইআইআইএন: ${COLLEGE_INFO.eiin}<br>প্রতিষ্ঠিত: ${COLLEGE_INFO.established}</div>

    <div class="content">

      <!-- Header -->
      <div class="header">
        <div class="inst-bn">${COLLEGE_INFO.nameBn}</div>
        <div class="inst-en">${COLLEGE_INFO.name}</div>
        <div class="inst-addr">${COLLEGE_INFO.address}</div>
        <div class="inst-meta">ইআইআইএন: ${COLLEGE_INFO.eiin} &nbsp;|&nbsp; ফোন: ${COLLEGE_INFO.phone}</div>
        ${f.certNo ? `<div class="cert-no-right">সনদ নং: ${toBnNum(f.certNo)}</div>` : ''}
      </div>

      <!-- Title -->
      <div class="title-row">
        <div class="title-pill">প্রশংসাপত্র</div>
      </div>

      <hr class="divider">

      <!-- Body -->
      <div class="body-para">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;এতদ্বারা প্রত্যয়ন করা যাইতেছে যে,
        <span class="hl"> ${f.studentName} </span>,
        পিতা: <span class="val">${f.fatherName}</span>${f.motherName ? `, মাতা: <span class="val">${f.motherName}</span>` : ''},
        ${roll ? `রোল নং: <span class="val">${roll}</span>,` : ''}
        এই মাদ্রাসার <span class="val">${cls}</span> শ্রেণিতে অধ্যয়নরত আছে।
        উপরোক্ত শিক্ষার্থী <span class="val">${f.examName}</span> পরীক্ষায়
        অংশগ্রহণ করিয়া <span class="val">${f.grade}</span> গ্রেড এবং
        <span class="val">${f.gpa}</span> জি.পি.এ. প্রাপ্ত হইয়া কৃতিত্বের সহিত উত্তীর্ণ হইয়াছে।
        ${f.position && f.position !== '—' ? `শ্রেণিতে তাহার অবস্থান <span class="val">${f.position}</span>।` : ''}
      </div>

      <div class="body-para">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;তাহার আচরণ ও চরিত্র <span class="val">${f.behaviour}</span>।
        আমি তাহার সার্বিক উন্নতি ও মঙ্গল কামনা করি এবং সকলকে তাহার প্রতি
        সকল প্রকার সহযোগিতা করিবার জন্য বিনীত অনুরোধ জানাইতেছি।
      </div>

      <hr class="divider">

      <!-- Footer -->
      <div class="footer">
        <div class="footer-date">
          তারিখ: ${f.issueDate}<br>
          সাল: ${year} খ্রিস্টাব্দ
        </div>

        <div class="seal-wrap">
          <div class="seal-circle">সরকারি<br>সীলমোহর</div>
        </div>

        <div class="sig-wrap">
          <div class="sig-space"></div>
          <div class="sig-line">অধ্যক্ষ / প্রধান শিক্ষক</div>
          <div class="sig-sub">${COLLEGE_INFO.nameBn}</div>
        </div>
      </div>

    </div><!-- /content -->
  </div><!-- /cert-inner -->
</div><!-- /cert-outer -->
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),350));<\/script>
</body>
</html>`;
}

/* ── React Preview Component ───────────────────────────────────── */
const DIAMOND_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='20' fill='%23e8eaf6'/%3E%3Cpath d='M10,1 L19,10 L10,19 L1,10 Z' fill='none' stroke='%231a237e' stroke-width='1.3'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%231a237e' opacity='0.5'/%3E%3C/svg%3E")`;

function CertPreview({ f }: { f: CertForm }) {
  const cls = MADRASHA_CLASSES.find(c => c.id === f.classId)?.nameBn ?? '';
  const roll = f.roll ? toBnNum(f.roll) : '';

  return (
    <div style={{ backgroundImage: DIAMOND_BG, backgroundSize: '20px 20px', border: '3px solid #0d47a1', padding: '10px', fontFamily: "'Noto Serif Bengali', serif" }}>
      <div style={{ background: '#fff', border: '2px solid #0d47a1', padding: '24px 32px', position: 'relative', overflow: 'hidden', minHeight: '500px' }}>

        {/* Watermarks */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '160px', opacity: 0.07, pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '200px', height: '200px', borderRadius: '50%', border: '3px solid rgba(13,71,161,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0, fontSize: '10px', fontWeight: 700, color: 'rgba(13,71,161,0.06)', textAlign: 'center', lineHeight: 1.5, padding: '20px' }}>
          {COLLEGE_INFO.nameBn}<br />ইআইআইএন: {COLLEGE_INFO.eiin}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', paddingBottom: '12px', borderBottom: '2.5px solid #0d47a1' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0d47a1', lineHeight: 1.3 }}>{COLLEGE_INFO.nameBn}</div>
            <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>{COLLEGE_INFO.name}</div>
            <div style={{ fontSize: '11px', color: '#333', marginTop: '3px' }}>{COLLEGE_INFO.address}</div>
            <div style={{ fontSize: '10px', color: '#777', marginTop: '2px' }}>ইআইআইএন: {COLLEGE_INFO.eiin} | ফোন: {COLLEGE_INFO.phone}</div>
            {f.certNo && <div style={{ textAlign: 'right', fontSize: '10px', color: '#888', marginTop: '4px' }}>সনদ নং: {toBnNum(f.certNo)}</div>}
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', margin: '16px 0 10px' }}>
            <span style={{ background: '#0d47a1', color: '#fff', fontSize: '20px', fontWeight: 700, padding: '8px 48px', borderRadius: '40px', letterSpacing: '2px', display: 'inline-block', boxShadow: '0 2px 8px rgba(13,71,161,.25)' }}>প্রশংসাপত্র</span>
          </div>

          <div style={{ borderTop: '1.5px solid #90caf9', margin: '8px 0' }} />

          {/* Body */}
          <div style={{ fontSize: '13px', lineHeight: 2, textAlign: 'justify', margin: '8px 0' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;এতদ্বারা প্রত্যয়ন করা যাইতেছে যে,
            <strong style={{ textDecoration: 'underline', textDecorationColor: '#0d47a1' }}> {f.studentName} </strong>,
            পিতা: <strong style={{ color: '#0d47a1' }}>{f.fatherName}</strong>
            {f.motherName && <>, মাতা: <strong style={{ color: '#0d47a1' }}>{f.motherName}</strong></>},
            {roll && <> রোল নং: <strong style={{ color: '#0d47a1' }}>{roll}</strong>,</>}{' '}
            এই মাদ্রাসার <strong style={{ color: '#0d47a1' }}>{cls}</strong> শ্রেণিতে অধ্যয়নরত আছে।
            উপরোক্ত শিক্ষার্থী <strong style={{ color: '#0d47a1' }}>{f.examName}</strong> পরীক্ষায়
            অংশগ্রহণ করিয়া <strong style={{ color: '#0d47a1' }}>{f.grade}</strong> গ্রেড এবং{' '}
            <strong style={{ color: '#0d47a1' }}>{f.gpa}</strong> জি.পি.এ. প্রাপ্ত হইয়া কৃতিত্বের সহিত উত্তীর্ণ হইয়াছে।
            {f.position && f.position !== '—' && (
              <> শ্রেণিতে তাহার অবস্থান <strong style={{ color: '#0d47a1' }}>{f.position}</strong>।</>
            )}
          </div>

          <div style={{ fontSize: '13px', lineHeight: 2, textAlign: 'justify', margin: '8px 0' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;তাহার আচরণ ও চরিত্র <strong style={{ color: '#0d47a1' }}>{f.behaviour}</strong>।
            আমি তাহার সার্বিক উন্নতি ও মঙ্গল কামনা করি এবং সকলকে তাহার প্রতি সকল প্রকার সহযোগিতা করিবার জন্য বিনীত অনুরোধ জানাইতেছি।
          </div>

          <div style={{ borderTop: '1.5px solid #90caf9', margin: '8px 0' }} />

          {/* Footer */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '12px', lineHeight: 2 }}>
              তারিখ: {f.issueDate}<br />
              সাল: {toBnNum(f.year)} খ্রিস্টাব্দ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px dashed rgba(13,71,161,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'rgba(13,71,161,0.35)', textAlign: 'center', lineHeight: 1.4 }}>সরকারি<br />সীলমোহর</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '48px' }} />
              <div style={{ borderTop: '1.5px solid #0d47a1', paddingTop: '6px', fontWeight: 700, fontSize: '12px', minWidth: '160px' }}>অধ্যক্ষ / প্রধান শিক্ষক</div>
              <div style={{ fontSize: '10px', color: '#555', marginTop: '3px' }}>{COLLEGE_INFO.nameBn}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Form field wrapper ─────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inp = 'px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#006633] w-full';
const sel = inp + ' appearance-none';

/* ── Page ───────────────────────────────────────────────────────── */
export default function CertificatesPage() {
  const [form, setForm] = useState<CertForm>(BLANK);
  const [preview, setPreview] = useState(false);

  const set = (k: keyof CertForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function printCert() {
    let logoDataUrl = '';
    try {
      const resp = await fetch('/logo.png');
      const imgBlob = await resp.blob();
      logoDataUrl = await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.readAsDataURL(imgBlob);
      });
    } catch { /* logo optional */ }
    const html = certHTML(form, logoDataUrl);
    const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  const ready = !!(form.studentName && form.fatherName && form.classId && form.examName);

  return (
    <div>
      <DashboardHeader
        title="প্রশংসাপত্র"
        subtitle="শিক্ষার্থীর প্রশংসাপত্র তৈরি ও প্রিন্ট করুন"
        userName="Admin"
        role="Super Admin"
      />
      <div className="p-6 space-y-5 max-w-5xl">

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2 text-sm">
            <Award size={16} className="text-[#006633]" /> শিক্ষার্থীর তথ্য
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="শিক্ষার্থীর নাম *">
              <input value={form.studentName} onChange={set('studentName')} placeholder="পূর্ণ নাম" className={inp} />
            </Field>
            <Field label="পিতার নাম *">
              <input value={form.fatherName} onChange={set('fatherName')} placeholder="পিতার নাম" className={inp} />
            </Field>
            <Field label="মাতার নাম">
              <input value={form.motherName} onChange={set('motherName')} placeholder="মাতার নাম (ঐচ্ছিক)" className={inp} />
            </Field>
            <Field label="শ্রেণি *">
              <select value={form.classId} onChange={set('classId')} className={sel}>
                <option value="">— শ্রেণি বেছে নিন —</option>
                {MADRASHA_CLASSES.map(c => (
                  <option key={c.id} value={c.id}>{c.nameBn}</option>
                ))}
              </select>
            </Field>
            <Field label="রোল নম্বর">
              <input value={form.roll} onChange={set('roll')} placeholder="রোল নং" className={inp} type="number" />
            </Field>
            <Field label="পরীক্ষার নাম *">
              <input value={form.examName} onChange={set('examName')} placeholder="যেমন: অর্ধ-বার্ষিক পরীক্ষা ২০২৬" className={inp} />
            </Field>
            <Field label="গ্রেড">
              <select value={form.grade} onChange={set('grade')} className={sel}>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="জি.পি.এ.">
              <input value={form.gpa} onChange={set('gpa')} placeholder="5.00" className={inp} />
            </Field>
            <Field label="শ্রেণিতে অবস্থান">
              <select value={form.position} onChange={set('position')} className={sel}>
                {POSITIONS.map(p => <option key={p} value={p}>{p || 'উল্লেখ নেই'}</option>)}
              </select>
            </Field>
            <Field label="আচরণ ও চরিত্র">
              <select value={form.behaviour} onChange={set('behaviour')} className={sel}>
                {BEHAVIOURS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="তারিখ">
              <input value={form.issueDate} onChange={set('issueDate')} placeholder="তারিখ লিখুন" className={inp} />
            </Field>
            <Field label="সাল">
              <input value={form.year} onChange={set('year')} placeholder="২০২৬" className={inp} />
            </Field>
            <Field label="সনদ নম্বর (ঐচ্ছিক)">
              <input value={form.certNo} onChange={set('certNo')} placeholder="001" className={inp} />
            </Field>
          </div>

          <div className="flex gap-3 mt-6 flex-wrap">
            <button
              onClick={() => setPreview(p => !p)}
              disabled={!ready}
              className="flex items-center gap-2 border border-[#006633] text-[#006633] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-50 disabled:opacity-40 transition-colors">
              <Eye size={15} /> {preview ? 'প্রিভিউ লুকান' : 'প্রিভিউ দেখুন'}
            </button>
            <button
              onClick={printCert}
              disabled={!ready}
              className="flex items-center gap-2 bg-[#006633] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#004d26] disabled:opacity-40 transition-colors shadow-sm">
              <Printer size={15} /> প্রিন্ট / PDF সেভ করুন
            </button>
            <button
              onClick={() => { setForm(BLANK); setPreview(false); }}
              className="flex items-center gap-2 border border-gray-200 text-gray-500 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              <RotateCcw size={14} /> রিসেট
            </button>
          </div>

          {!ready && (
            <p className="text-xs text-amber-600 mt-3">* নাম, পিতার নাম, শ্রেণি ও পরীক্ষার নাম পূরণ করুন।</p>
          )}
        </div>

        {/* Preview */}
        {preview && ready && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm flex items-center gap-2">
              <Eye size={14} className="text-[#006633]" /> প্রিভিউ
            </h3>
            <CertPreview f={form} />
          </div>
        )}

      </div>
    </div>
  );
}
