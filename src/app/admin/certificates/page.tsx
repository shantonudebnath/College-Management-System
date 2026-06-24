'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { COLLEGE_INFO } from '@/lib/data';
import { Award, Printer, RotateCcw, Eye } from 'lucide-react';

const EXAM_TYPES = ['দাখিল', 'আলিম', 'ফাজিল', 'কামিল', '৮ম'];
const SUBJECTS = ['সাধারণ', 'বিজ্ঞান', 'মানবিক', 'ব্যবসায় শিক্ষা', 'দাখিল ভোকেশনাল'];

interface CertForm {
  studentName: string;
  fatherName: string;
  motherName: string;
  village: string;
  postOffice: string;
  upazila: string;
  district: string;
  examYear: string;
  examType: string;
  subject: string;
  gpa: string;
  roll: string;
  regNo: string;
  dob: string;
  session: string;
  grade: string;
  issueDate: string;
  certNo: string;
}

const BLANK: CertForm = {
  studentName: '',
  fatherName: '',
  motherName: '',
  village: '',
  postOffice: '',
  upazila: '',
  district: '',
  examYear: '',
  examType: 'দাখিল',
  subject: 'সাধারণ',
  gpa: '',
  roll: '',
  regNo: '',
  dob: '',
  session: '',
  grade: '',
  issueDate: new Date().toLocaleDateString('bn-BD'),
  certNo: '',
};

function toBnNum(n: string | number) {
  return String(n).replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[+d]);
}

const DIAMOND_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='20' fill='%23e8eaf6'/%3E%3Cpath d='M10,1 L19,10 L10,19 L1,10 Z' fill='none' stroke='%231a237e' stroke-width='1.3'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%231a237e' opacity='0.5'/%3E%3C/svg%3E")`;

/* Fills value or dotted line for the HTML cert */
function d(val: string, len = 28): string {
  return val.trim()
    ? `<span class="val">${val}</span>`
    : `<span class="dots">${'.'.repeat(len)}</span>`;
}

function certHTML(f: CertForm, logoSrc = ''): string {
  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<title>প্রশংসাপত্র — ${f.studentName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:210mm;background:#fff;font-family:'Noto Serif Bengali','Vrinda','Nirmala UI',serif;color:#0a0820}

.cert-outer{
  width:210mm;min-height:297mm;
  padding:12px;
  background-image:${DIAMOND_SVG};
  background-size:20px 20px;
  border:3px solid #0d47a1;
  position:relative;
}
.cert-outer::before{
  content:'';position:absolute;inset:3px;
  border:2px solid #0d47a1;
  pointer-events:none;z-index:0;
}
.cert-inner{
  position:relative;
  background:#fff;
  border:2px solid #0d47a1;
  min-height:calc(297mm - 48px);
  padding:8mm 10mm;
  overflow:hidden;
}
.wm-circle{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  width:220px;height:220px;border-radius:50%;
  border:3px solid rgba(13,71,161,0.07);
  display:flex;align-items:center;justify-content:center;
  pointer-events:none;z-index:0;
  text-align:center;font-size:11pt;font-weight:700;
  color:rgba(13,71,161,0.06);line-height:1.5;padding:20px;
}
.wm-logo{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  width:180px;opacity:0.07;
  pointer-events:none;z-index:0;
}
.content{position:relative;z-index:1}
.header{text-align:center;padding-bottom:5mm;border-bottom:2.5px solid #0d47a1}
.inst-bn{font-size:17pt;font-weight:900;color:#0d47a1;line-height:1.3}
.inst-en{font-size:8.5pt;color:#555;margin-top:1mm;letter-spacing:.3px}
.inst-addr{font-size:9pt;color:#333;margin-top:1.5mm}
.inst-meta{font-size:8pt;color:#777;margin-top:1mm}
.cert-no-right{text-align:right;font-size:8pt;color:#888;margin-top:1.5mm}
.title-row{display:flex;align-items:center;justify-content:center;margin:5mm 0 3mm}
.title-pill{
  background:#0d47a1;color:#fff;
  font-size:20pt;font-weight:700;
  padding:3mm 18mm;border-radius:40px;
  letter-spacing:2px;
  box-shadow:0 2px 8px rgba(13,71,161,.25);
}
.divider{border:none;border-top:1.5px solid #90caf9;margin:3mm 0}
.body-para{
  font-size:11pt;line-height:2.3;
  text-align:justify;
  margin:4mm 0;
}
.val{font-weight:700;color:#0d47a1;border-bottom:1px solid #90caf9;padding-bottom:1px}
.dots{color:#555;letter-spacing:1px}
.footer{margin-top:14mm;display:flex;justify-content:space-between;align-items:flex-end}
.footer-date{font-size:10pt;line-height:2.2;color:#222}
.sig-wrap{text-align:center}
.sig-space{height:18mm}
.sig-line{border-top:1.5px solid #0d47a1;padding-top:2mm;font-size:10pt;font-weight:700;min-width:55mm}
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

    ${logoSrc ? `<img src="${logoSrc}" class="wm-logo" alt="" />` : ''}
    <div class="wm-circle">${COLLEGE_INFO.nameBn}<br>ইআইআইএন: ${COLLEGE_INFO.eiin}<br>প্রতিষ্ঠিত: ${COLLEGE_INFO.established}</div>

    <div class="content">

      <div class="header">
        <div class="inst-bn">${COLLEGE_INFO.nameBn}</div>
        <div class="inst-en">${COLLEGE_INFO.name}</div>
        <div class="inst-addr">${COLLEGE_INFO.address}</div>
        <div class="inst-meta">ইআইআইএন: ${COLLEGE_INFO.eiin} &nbsp;|&nbsp; ফোন: ${COLLEGE_INFO.phone}</div>
        ${f.certNo ? `<div class="cert-no-right">সনদ নং: ${toBnNum(f.certNo)}</div>` : ''}
      </div>

      <div class="title-row">
        <div class="title-pill">প্রশংসাপত্র</div>
      </div>

      <hr class="divider">

      <div class="body-para">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,
        ${d(f.studentName, 35)},
        পিতা: ${d(f.fatherName, 30)},
        মাতা: ${d(f.motherName, 30)},
        গ্রাম: ${d(f.village, 25)},
        ডাকঘর: ${d(f.postOffice, 25)},
        উপজেলা: ${d(f.upazila, 20)},
        জেলা: ${d(f.district, 20)};
        অত্র প্রতিষ্ঠান হতে বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড, ঢাকা-এর অধীনে অনুষ্ঠিত
        ২০${d(f.examYear, 6)} সনের ${d(f.examType, 10)} পরীক্ষায়
        ${d(f.subject, 12)} শাখায় অংশগ্রহণ করে G.P.A ${d(f.gpa, 8)} অর্জন করেছে।
      </div>

      <div class="body-para">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;তাঁর পরীক্ষার রোল নম্বর: ${d(f.roll, 18)},
        রেজিস্ট্রেশন নম্বর: ${d(f.regNo, 18)},
        জন্ম তারিখ: ${d(f.dob, 18)},
        সেশন: ${d(f.session, 12)} এবং তিনি
        গ্রেড পয়েন্ট/বিভাগ: ${d(f.grade, 15)} অর্জন করেছেন।
      </div>

      <div class="body-para">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;আমার জানা মতে, তিনি অত্র প্রতিষ্ঠানে অধ্যয়নকালে কোনো রাষ্ট্রবিরোধী বা শৃঙ্খলাভঙ্গমূলক কার্যকলাপের সঙ্গে জড়িত ছিলেন না। আমি তাঁর জীবনের সর্বাঙ্গীণ উন্নতি ও মঙ্গল কামনা করি।
      </div>

      <hr class="divider">

      <div class="footer">
        <div class="footer-date">
          তারিখ: ${f.issueDate}
        </div>
        <div class="sig-wrap">
          <div class="sig-space"></div>
          <div class="sig-line">অধ্যক্ষ / প্রধান শিক্ষক</div>
          <div class="sig-sub">${COLLEGE_INFO.nameBn}</div>
        </div>
      </div>

    </div>
  </div>
</div>
<script>
window.addEventListener('load', function() {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() { setTimeout(window.print, 300); });
  } else {
    setTimeout(window.print, 1200);
  }
});
<\/script>
</body>
</html>`;
}

/* ── React Preview ───────────────────────────────────────────────── */
const DIAMOND_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='20' fill='%23e8eaf6'/%3E%3Cpath d='M10,1 L19,10 L10,19 L1,10 Z' fill='none' stroke='%231a237e' stroke-width='1.3'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%231a237e' opacity='0.5'/%3E%3C/svg%3E")`;

function PVal({ v, len = 28 }: { v: string; len?: number }) {
  return v.trim()
    ? <strong style={{ color: '#0d47a1', borderBottom: '1px solid #90caf9', paddingBottom: '1px' }}>{v}</strong>
    : <span style={{ color: '#aaa', letterSpacing: '1px' }}>{'·'.repeat(Math.max(6, Math.floor(len / 4)))}</span>;
}

function CertPreview({ f }: { f: CertForm }) {
  return (
    <div style={{ backgroundImage: DIAMOND_BG, backgroundSize: '20px 20px', border: '3px solid #0d47a1', padding: '10px', fontFamily: "'Noto Serif Bengali', Vrinda, serif" }}>
      <div style={{ background: '#fff', border: '2px solid #0d47a1', padding: '24px 32px', position: 'relative', overflow: 'hidden', minHeight: '500px' }}>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '160px', opacity: 0.07, pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '200px', height: '200px', borderRadius: '50%', border: '3px solid rgba(13,71,161,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0, fontSize: '10px', fontWeight: 700, color: 'rgba(13,71,161,0.06)', textAlign: 'center', lineHeight: 1.5, padding: '20px' }}>
          {COLLEGE_INFO.nameBn}<br />ইআইআইএন: {COLLEGE_INFO.eiin}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>

          <div style={{ textAlign: 'center', paddingBottom: '12px', borderBottom: '2.5px solid #0d47a1' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0d47a1', lineHeight: 1.3 }}>{COLLEGE_INFO.nameBn}</div>
            <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>{COLLEGE_INFO.name}</div>
            <div style={{ fontSize: '11px', color: '#333', marginTop: '3px' }}>{COLLEGE_INFO.address}</div>
            <div style={{ fontSize: '10px', color: '#777', marginTop: '2px' }}>ইআইআইএন: {COLLEGE_INFO.eiin} | ফোন: {COLLEGE_INFO.phone}</div>
            {f.certNo && <div style={{ textAlign: 'right', fontSize: '10px', color: '#888', marginTop: '4px' }}>সনদ নং: {toBnNum(f.certNo)}</div>}
          </div>

          <div style={{ textAlign: 'center', margin: '16px 0 10px' }}>
            <span style={{ background: '#0d47a1', color: '#fff', fontSize: '20px', fontWeight: 700, padding: '8px 48px', borderRadius: '40px', letterSpacing: '2px', display: 'inline-block', boxShadow: '0 2px 8px rgba(13,71,161,.25)' }}>প্রশংসাপত্র</span>
          </div>

          <div style={{ borderTop: '1.5px solid #90caf9', margin: '8px 0' }} />

          <div style={{ fontSize: '13px', lineHeight: 2.2, textAlign: 'justify', margin: '10px 0' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <PVal v={f.studentName} len={35} />, পিতা: <PVal v={f.fatherName} len={30} />,{' '}
            মাতা: <PVal v={f.motherName} len={30} />, গ্রাম: <PVal v={f.village} len={25} />, ডাকঘর: <PVal v={f.postOffice} len={25} />,{' '}
            উপজেলা: <PVal v={f.upazila} len={20} />, জেলা: <PVal v={f.district} len={20} />;{' '}
            অত্র প্রতিষ্ঠান হতে বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড, ঢাকা-এর অধীনে অনুষ্ঠিত ২০<PVal v={f.examYear} len={6} /> সনের{' '}
            <PVal v={f.examType} len={10} /> পরীক্ষায় <PVal v={f.subject} len={12} /> শাখায় অংশগ্রহণ করে G.P.A <PVal v={f.gpa} len={8} /> অর্জন করেছে।
          </div>

          <div style={{ fontSize: '13px', lineHeight: 2.2, textAlign: 'justify', margin: '10px 0' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;তাঁর পরীক্ষার রোল নম্বর: <PVal v={f.roll} len={18} />, রেজিস্ট্রেশন নম্বর: <PVal v={f.regNo} len={18} />,{' '}
            জন্ম তারিখ: <PVal v={f.dob} len={18} />, সেশন: <PVal v={f.session} len={12} /> এবং তিনি গ্রেড পয়েন্ট/বিভাগ: <PVal v={f.grade} len={15} /> অর্জন করেছেন।
          </div>

          <div style={{ fontSize: '13px', lineHeight: 2.2, textAlign: 'justify', margin: '10px 0' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;আমার জানা মতে, তিনি অত্র প্রতিষ্ঠানে অধ্যয়নকালে কোনো রাষ্ট্রবিরোধী বা শৃঙ্খলাভঙ্গমূলক কার্যকলাপের সঙ্গে জড়িত ছিলেন না। আমি তাঁর জীবনের সর্বাঙ্গীণ উন্নতি ও মঙ্গল কামনা করি।
          </div>

          <div style={{ borderTop: '1.5px solid #90caf9', margin: '8px 0' }} />

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '12px', lineHeight: 2.2 }}>
              তারিখ: {f.issueDate}
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

/* ── Form helpers ───────────────────────────────────────────────── */
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

  const ready = !!(form.studentName && form.fatherName);

  return (
    <div>
      <DashboardHeader
        title="প্রশংসাপত্র"
        subtitle="শিক্ষার্থীর প্রশংসাপত্র তৈরি ও প্রিন্ট করুন"
        userName="Admin"
        role="Super Admin"
      />
      <div className="p-6 space-y-5 max-w-5xl">

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
              <input value={form.motherName} onChange={set('motherName')} placeholder="মাতার নাম" className={inp} />
            </Field>
            <Field label="গ্রাম">
              <input value={form.village} onChange={set('village')} placeholder="গ্রামের নাম" className={inp} />
            </Field>
            <Field label="ডাকঘর">
              <input value={form.postOffice} onChange={set('postOffice')} placeholder="ডাকঘর" className={inp} />
            </Field>
            <Field label="উপজেলা">
              <input value={form.upazila} onChange={set('upazila')} placeholder="উপজেলা" className={inp} />
            </Field>
            <Field label="জেলা">
              <input value={form.district} onChange={set('district')} placeholder="জেলা" className={inp} />
            </Field>
            <Field label="পরীক্ষার সন (২০-এর পর)">
              <input value={form.examYear} onChange={set('examYear')} placeholder="যেমন: ২৫" className={inp} />
            </Field>
            <Field label="পরীক্ষার ধরন">
              <select value={form.examType} onChange={set('examType')} className={sel}>
                {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="শাখা">
              <select value={form.subject} onChange={set('subject')} className={sel}>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="G.P.A">
              <input value={form.gpa} onChange={set('gpa')} placeholder="যেমন: 5.00" className={inp} />
            </Field>
            <Field label="রোল নম্বর">
              <input value={form.roll} onChange={set('roll')} placeholder="রোল নম্বর" className={inp} />
            </Field>
            <Field label="রেজিস্ট্রেশন নম্বর">
              <input value={form.regNo} onChange={set('regNo')} placeholder="রেজিস্ট্রেশন নম্বর" className={inp} />
            </Field>
            <Field label="জন্ম তারিখ">
              <input value={form.dob} onChange={set('dob')} placeholder="যেমন: ০১/০১/২০১০" className={inp} />
            </Field>
            <Field label="সেশন">
              <input value={form.session} onChange={set('session')} placeholder="যেমন: ২০২৪-২৫" className={inp} />
            </Field>
            <Field label="গ্রেড পয়েন্ট/বিভাগ">
              <input value={form.grade} onChange={set('grade')} placeholder="যেমন: A+ / প্রথম বিভাগ" className={inp} />
            </Field>
            <Field label="তারিখ">
              <input value={form.issueDate} onChange={set('issueDate')} placeholder="তারিখ" className={inp} />
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
            <p className="text-xs text-amber-600 mt-3">* শিক্ষার্থীর নাম ও পিতার নাম পূরণ করুন।</p>
          )}
        </div>

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
