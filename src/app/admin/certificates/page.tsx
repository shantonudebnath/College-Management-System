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

function certHTML(f: CertForm): string {
  const cls = MADRASHA_CLASSES.find(c => c.id === f.classId)?.nameBn ?? f.classId;
  const year = toBnNum(f.year);
  const roll = toBnNum(f.roll);
  const gpa = f.gpa;
  const certNoLine = f.certNo ? `<div class="cert-no">সনদ নং: ${toBnNum(f.certNo)}</div>` : '';

  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<title>প্রশংসাপত্র — ${f.studentName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:210mm;min-height:297mm;background:#fff}
body{font-family:'Noto Serif Bengali','Kalpurush',serif;color:#0a0a2e;padding:10mm}
.page{
  width:190mm;min-height:277mm;
  position:relative;
  border:3px solid #1a237e;
  padding:6mm;
  background:#fff;
}
.page::before{
  content:'';position:absolute;inset:4px;
  border:1.5px solid #1a237e;
  pointer-events:none;
}
/* Decorative corner-like top/bottom bands */
.band{
  background:repeating-linear-gradient(90deg,#1a237e 0,#1a237e 6px,transparent 6px,transparent 12px,#1a237e 12px,#1a237e 14px,#e8eaf6 14px,#e8eaf6 20px);
  height:10px;margin:0 -3mm;
}
.band.top{margin-bottom:5mm}
.band.bottom{margin-top:5mm}

.header{text-align:center;margin-bottom:4mm}
.inst-name{font-size:16pt;font-weight:700;color:#0d47a1;line-height:1.3}
.inst-addr{font-size:9pt;color:#444;margin-top:1mm}
.inst-eiin{font-size:8pt;color:#666;margin-top:0.5mm}

.title-box{
  display:inline-block;
  background:#1a237e;color:#fff;
  font-size:18pt;font-weight:700;
  padding:3mm 14mm;border-radius:8px;
  margin:4mm 0;letter-spacing:1px;
}
.title-wrap{text-align:center}

.divider{border:none;border-top:2px solid #1a237e;margin:3mm 0}
.divider-thin{border:none;border-top:1px solid #90caf9;margin:2mm 0}

.body-text{
  font-size:11pt;line-height:2;
  text-align:justify;
  margin:3mm 2mm;
}
.body-text .highlight{font-weight:700;text-decoration:underline;text-decoration-color:#1a237e}
.body-text .val{font-weight:700;color:#0d47a1}

.attrib-table{width:100%;margin:3mm 0 2mm;border-collapse:collapse}
.attrib-table td{padding:1.5mm 2mm;font-size:10.5pt;vertical-align:top}
.attrib-table td:first-child{width:38%;color:#333}
.attrib-table td:nth-child(2){width:4%;color:#555}
.attrib-table td:last-child{font-weight:600;color:#0d47a1}

.footer{margin-top:8mm;display:flex;justify-content:space-between;align-items:flex-end}
.footer-left{font-size:9.5pt;line-height:1.8;color:#333}
.sig-block{text-align:center}
.sig-line{border-top:1.5px solid #0d47a1;padding-top:2mm;font-size:10pt;font-weight:700;min-width:44mm}
.sig-sub{font-size:8.5pt;color:#555;margin-top:0.5mm}

.cert-no{text-align:right;font-size:8.5pt;color:#888;margin-bottom:2mm}
.seal-note{font-size:8pt;color:#888;margin-top:1mm;text-align:center;font-style:italic}

@media print{
  @page{size:A4 portrait;margin:0}
  body{padding:0}
  .page{border:3px solid #1a237e;box-shadow:none}
}
</style>
</head>
<body>
<div class="page">
  <div class="band top"></div>

  ${certNoLine}

  <div class="header">
    <div class="inst-name">${COLLEGE_INFO.nameBn}</div>
    <div class="inst-addr">${COLLEGE_INFO.address}</div>
    <div class="inst-eiin">ইআইআইএন: ${COLLEGE_INFO.eiin} | ফোন: ${COLLEGE_INFO.phone}</div>
  </div>

  <hr class="divider">

  <div class="title-wrap">
    <span class="title-box">প্রশংসাপত্র</span>
  </div>

  <hr class="divider-thin">

  <div class="body-text">
    &nbsp;&nbsp;&nbsp;&nbsp;এতদ্বারা প্রত্যয়ন করা যাইতেছে যে,
    <span class="highlight"> ${f.studentName} </span>,
    পিতা: <span class="val">${f.fatherName}</span>${f.motherName ? `, মাতা: <span class="val">${f.motherName}</span>` : ''},
    ${roll ? `রোল নং: <span class="val">${roll}</span>,` : ''}
    এই মাদ্রাসার <span class="val">${cls}</span> শ্রেণিতে অধ্যয়নরত আছে।
    উপরোক্ত শিক্ষার্থী <span class="val">${f.examName}</span> পরীক্ষায়
    অংশগ্রহণ করে <span class="val">${f.grade}</span> গ্রেড এবং
    <span class="val">${gpa}</span> জি.পি.এ. প্রাপ্ত হইয়া কৃতিত্বের সহিত উত্তীর্ণ হইয়াছে।
    ${f.position && f.position !== '—' ? `শ্রেণিতে তাহার অবস্থান <span class="val">${f.position}</span>।` : ''}
  </div>

  <div class="body-text">
    &nbsp;&nbsp;&nbsp;&nbsp;তাহার আচরণ ও চরিত্র <span class="val">${f.behaviour}</span>।
    তাহাকে সকল প্রকার সহযোগিতা করিবার জন্য সকলের প্রতি বিনীত অনুরোধ জানানো হইল।
  </div>

  <hr class="divider-thin">

  <div class="footer">
    <div class="footer-left">
      তারিখ: ${f.issueDate}<br>
      সাল: ${year}
    </div>
    <div class="sig-block">
      <div style="height:18mm"></div>
      <div class="sig-line">অধ্যক্ষ / প্রধান শিক্ষক</div>
      <div class="sig-sub">${COLLEGE_INFO.nameBn}</div>
    </div>
  </div>

  <div class="seal-note">[ সরকারি সীলমোহর ]</div>

  <div class="band bottom"></div>
</div>
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),300));<\/script>
</body>
</html>`;
}

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

export default function CertificatesPage() {
  const [form, setForm] = useState<CertForm>(BLANK);
  const [preview, setPreview] = useState(false);

  const set = (k: keyof CertForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  function printCert() {
    const html = certHTML(form);
    const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  const cls = MADRASHA_CLASSES.find(c => c.id === form.classId)?.nameBn ?? '';
  const ready = form.studentName && form.fatherName && form.classId && form.examName;

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
            <Field label="সাল">
              <input value={form.year} onChange={set('year')} placeholder="২০২৬" className={inp} />
            </Field>
            <Field label="তারিখ">
              <input value={form.issueDate} onChange={set('issueDate')} placeholder="তারিখ লিখুন" className={inp} />
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
            <div
              className="rounded-xl overflow-hidden border-2 border-[#1a237e] relative"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              {/* Top decorative band */}
              <div className="h-3" style={{ background: 'repeating-linear-gradient(90deg,#1a237e 0,#1a237e 6px,transparent 6px,transparent 12px,#1a237e 12px,#1a237e 14px,#e8eaf6 14px,#e8eaf6 20px)' }} />

              <div className="px-8 py-5">
                {form.certNo && (
                  <div className="text-right text-xs text-gray-400 mb-1">সনদ নং: {toBnNum(form.certNo)}</div>
                )}
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="text-xl font-bold text-blue-900">{COLLEGE_INFO.nameBn}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{COLLEGE_INFO.address}</div>
                  <div className="text-xs text-gray-400 mt-0.5">ইআইআইএন: {COLLEGE_INFO.eiin}</div>
                </div>

                <div className="border-t-2 border-blue-900 my-3" />

                <div className="text-center my-4">
                  <span className="bg-[#1a237e] text-white text-xl font-bold px-10 py-2 rounded-lg inline-block">প্রশংসাপত্র</span>
                </div>

                <div className="border-t border-blue-200 my-3" />

                <div className="text-sm leading-8 text-justify text-gray-800 my-3">
                  &nbsp;&nbsp;&nbsp;এতদ্বারা প্রত্যয়ন করা যাইতেছে যে,{' '}
                  <strong className="underline decoration-blue-800">{form.studentName}</strong>,
                  পিতা: <strong className="text-blue-900">{form.fatherName}</strong>
                  {form.motherName && <>, মাতা: <strong className="text-blue-900">{form.motherName}</strong></>},
                  {form.roll && <> রোল নং: <strong className="text-blue-900">{toBnNum(form.roll)}</strong>,</>}{' '}
                  এই মাদ্রাসার <strong className="text-blue-900">{cls}</strong> শ্রেণিতে অধ্যয়নরত আছে।
                  উপরোক্ত শিক্ষার্থী <strong className="text-blue-900">{form.examName}</strong> পরীক্ষায়
                  অংশগ্রহণ করে <strong className="text-blue-900">{form.grade}</strong> গ্রেড এবং{' '}
                  <strong className="text-blue-900">{form.gpa}</strong> জি.পি.এ. প্রাপ্ত হইয়া কৃতিত্বের সহিত উত্তীর্ণ হইয়াছে।
                  {form.position && form.position !== '—' && (
                    <> শ্রেণিতে তাহার অবস্থান <strong className="text-blue-900">{form.position}</strong>।</>
                  )}
                </div>

                <div className="text-sm leading-8 text-justify text-gray-800 mb-4">
                  &nbsp;&nbsp;&nbsp;তাহার আচরণ ও চরিত্র <strong className="text-blue-900">{form.behaviour}</strong>।
                  তাহাকে সকল প্রকার সহযোগিতা করিবার জন্য সকলের প্রতি বিনীত অনুরোধ জানানো হইল।
                </div>

                <div className="border-t border-blue-200 my-3" />

                <div className="flex justify-between items-end mt-6">
                  <div className="text-sm text-gray-600 leading-7">
                    তারিখ: {form.issueDate}<br />
                    সাল: {toBnNum(form.year)}
                  </div>
                  <div className="text-center">
                    <div className="h-12" />
                    <div className="border-t-2 border-blue-900 pt-1 font-bold text-sm min-w-44 text-center">অধ্যক্ষ / প্রধান শিক্ষক</div>
                    <div className="text-xs text-gray-500 mt-0.5">{COLLEGE_INFO.nameBn}</div>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-300 mt-2 italic">[ সরকারি সীলমোহর ]</div>
              </div>

              {/* Bottom decorative band */}
              <div className="h-3" style={{ background: 'repeating-linear-gradient(90deg,#1a237e 0,#1a237e 6px,transparent 6px,transparent 12px,#1a237e 12px,#1a237e 14px,#e8eaf6 14px,#e8eaf6 20px)' }} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
