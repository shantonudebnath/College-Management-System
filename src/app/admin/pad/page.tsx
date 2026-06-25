'use client';
import { useState, useRef } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { COLLEGE_INFO } from '@/lib/data';
import {
  Printer, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo, Minus,
} from 'lucide-react';

function fmtDate(iso: string): string {
  if (!iso) return '................................';
  try {
    return new Date(iso).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return iso; }
}

function letterHTML(sutro: string, tarikh: string, body: string, logoSrc: string): string {
  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<title>${COLLEGE_INFO.nameBn}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Serif Bengali','Vrinda','Nirmala UI',serif;color:#000;background:#fff;font-size:10pt}
@page{size:A4 portrait;margin:13mm 15mm 15mm 15mm}
table{border-collapse:collapse;width:100%}
.hdr-table{width:100%;margin-bottom:0}
.hdr-table td{vertical-align:top;padding:0}
.col-bn{width:44%}
.col-logo{width:12%;text-align:center;vertical-align:middle}
.col-en{width:44%;text-align:right;font-family:Arial,Helvetica,sans-serif}
.nm-bn{font-size:14.5pt;font-weight:900;color:#8B0000;line-height:1.3}
.nm-en{font-size:10.5pt;font-weight:900;color:#8B0000;line-height:1.3}
.addr{font-size:7.5pt;color:#333;margin-top:3px;line-height:1.65}
.divider{border:none;border-top:2.5px solid #8B0000;margin:5px 0 0}
.sr-row{display:table;width:100%;border-bottom:1px solid #444;padding:4px 0;margin-top:3px;font-size:9.5pt}
.sr-left{display:table-cell;text-align:left}
.sr-right{display:table-cell;text-align:right}
.body-area{margin-top:14pt;font-size:10.5pt;line-height:2.1}
</style>
</head>
<body>
<table class="hdr-table">
<tr>
  <td class="col-bn">
    <div class="nm-bn">${COLLEGE_INFO.nameBn}</div>
    <div class="addr">
      ডাকঘর- মঠেখোলা, উপজেলা-পাকুন্দিয়া, জেলা- কিশোরগঞ্জ।<br>
      স্থাপিত ঃ ${COLLEGE_INFO.established}ইং, ইআইআইএন- ${COLLEGE_INFO.eiin}<br>
      মোবাইল ঃ ${COLLEGE_INFO.phone}<br>
      E-mail: ${COLLEGE_INFO.email}<br>
      Web: ${COLLEGE_INFO.website}
    </div>
  </td>
  <td class="col-logo">
    ${logoSrc ? `<img src="${logoSrc}" style="width:58px;height:auto;display:block;margin:0 auto;">` : ''}
  </td>
  <td class="col-en">
    <div class="nm-en">${COLLEGE_INFO.name.toUpperCase()}</div>
    <div class="addr">
      Post : Mathkhola, Upazila : Pakundia<br>
      Dist-Kishoregonj<br>
      ESTD : ${COLLEGE_INFO.establishedEn}, EIIN-${COLLEGE_INFO.eiin}<br>
      Mobile : ${COLLEGE_INFO.phone}<br>
      E-mail : ${COLLEGE_INFO.email}<br>
      Web: ${COLLEGE_INFO.website}
    </div>
  </td>
</tr>
</table>
<hr class="divider">
<div class="sr-row">
  <span class="sr-left">সূত্র ঃ ${sutro || '................................'}</span>
  <span class="sr-right">তারিখ ঃ ${fmtDate(tarikh)}</span>
</div>
<div class="body-area">${body}</div>
<script>
window.addEventListener('load', function () {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { setTimeout(window.print, 400); });
  } else {
    setTimeout(window.print, 1400);
  }
});
</script>
</body>
</html>`;
}

function ToolBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-800 transition-colors"
    >
      {children}
    </button>
  );
}

const FONT_SIZES: [string, string][] = [
  ['1', '৮pt'], ['2', '১০pt'], ['3', '১২pt'],
  ['4', '১৪pt'], ['5', '১৮pt'], ['6', '২৪pt'], ['7', '৩৬pt'],
];

export default function AdminPadPage() {
  const [sutro, setSutro] = useState('');
  const [tarikh, setTarikh] = useState('');
  const [fontSize, setFontSize] = useState('3');
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  };

  const printLetter = async () => {
    let logoSrc = '';
    try {
      const resp = await fetch('/logo.png');
      const blob = await resp.blob();
      logoSrc = await new Promise<string>(res => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch { /* logo optional */ }
    const content = editorRef.current?.innerHTML ?? '';
    const html = letterHTML(sutro, tarikh, content, logoSrc);
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html; charset=utf-8' }));
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const tarikhDisplay = fmtDate(tarikh);

  return (
    <div>
      <DashboardHeader
        title="প্রাতিষ্ঠানিক প্যাড"
        subtitle="অফিসিয়াল পত্র ও চিঠিপত্র তৈরি করুন"
        userName="Admin"
        role="Super Admin"
      />
      <div className="p-6 space-y-4" style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-2.5 flex flex-wrap gap-1 items-center shadow-sm sticky top-0 z-20">
          <ToolBtn onClick={() => exec('undo')} title="Undo"><Undo size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('redo')} title="Redo"><Redo size={14} /></ToolBtn>
          <div className="w-px h-5 bg-gray-200 mx-0.5" />

          <ToolBtn onClick={() => exec('bold')} title="Bold"><Bold size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('italic')} title="Italic"><Italic size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('underline')} title="Underline"><Underline size={14} /></ToolBtn>
          <div className="w-px h-5 bg-gray-200 mx-0.5" />

          <select
            value={fontSize}
            onChange={e => { setFontSize(e.target.value); exec('fontSize', e.target.value); }}
            className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-400 cursor-pointer"
          >
            {FONT_SIZES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <div className="w-px h-5 bg-gray-200 mx-0.5" />

          <ToolBtn onClick={() => exec('justifyLeft')} title="বাম"><AlignLeft size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('justifyCenter')} title="মধ্য"><AlignCenter size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('justifyRight')} title="ডান"><AlignRight size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('justifyFull')} title="Justify"><AlignJustify size={14} /></ToolBtn>
          <div className="w-px h-5 bg-gray-200 mx-0.5" />

          <ToolBtn onClick={() => exec('insertUnorderedList')} title="বুলেট"><List size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('insertOrderedList')} title="নম্বর তালিকা"><ListOrdered size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('insertHorizontalRule')} title="রেখা"><Minus size={14} /></ToolBtn>
          <div className="w-px h-5 bg-gray-200 mx-0.5" />

          <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer" title="রঙ">
            <span className="font-bold text-base" style={{ fontFamily: 'serif', lineHeight: 1 }}>A</span>
            <input type="color" defaultValue="#000000"
              onChange={e => exec('foreColor', e.target.value)}
              className="w-5 h-5 cursor-pointer border-0 p-0 bg-transparent" />
          </label>

          <div className="flex-1" />
          <button onClick={printLetter}
            className="flex items-center gap-2 bg-[#1e1b4b] hover:bg-purple-900 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
            <Printer size={15} /> প্রিন্ট করুন
          </button>
        </div>

        {/* ── Paper ── */}
        <div className="bg-white border border-gray-300 shadow-2xl"
          style={{ fontFamily: "'Noto Serif Bengali','Vrinda','Nirmala UI',serif", borderRadius: '4px' }}>

          {/* Letterhead */}
          <div style={{ padding: '28px 36px 0' }}>

            {/* 3-column header using CSS grid for reliable sizing */}
            <div style={{ display: 'grid', gridTemplateColumns: '44% 12% 44%', alignItems: 'center', paddingBottom: '10px', borderBottom: '3px solid #8B0000' }}>

              {/* Bengali */}
              <div>
                <div style={{ fontWeight: 900, color: '#8B0000', fontSize: '13.5pt', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
                  {COLLEGE_INFO.nameBn}
                </div>
                <div style={{ fontSize: '7.5pt', color: '#444', marginTop: '4px', lineHeight: 1.7 }}>
                  ডাকঘর- মঠেখোলা, উপজেলা-পাকুন্দিয়া, জেলা- কিশোরগঞ্জ।<br />
                  স্থাপিত ঃ {COLLEGE_INFO.established}ইং, ইআইআইএন- {COLLEGE_INFO.eiin}<br />
                  মোবাইল ঃ {COLLEGE_INFO.phone}<br />
                  E-mail: {COLLEGE_INFO.email}<br />
                  Web: {COLLEGE_INFO.website}
                </div>
              </div>

              {/* Logo */}
              <div style={{ textAlign: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="" style={{ width: '56px', height: '56px', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
              </div>

              {/* English */}
              <div style={{ textAlign: 'right', fontFamily: 'Arial,Helvetica,sans-serif' }}>
                <div style={{ fontWeight: 900, color: '#8B0000', fontSize: '10.5pt', lineHeight: 1.3 }}>
                  {COLLEGE_INFO.name.toUpperCase()}
                </div>
                <div style={{ fontSize: '7.5pt', color: '#444', marginTop: '4px', lineHeight: 1.7 }}>
                  Post : Mathkhola, Upazila : Pakundia<br />
                  Dist-Kishoregonj<br />
                  ESTD : {COLLEGE_INFO.establishedEn}, EIIN-{COLLEGE_INFO.eiin}<br />
                  Mobile : {COLLEGE_INFO.phone}<br />
                  E-mail : {COLLEGE_INFO.email}<br />
                  Web: {COLLEGE_INFO.website}
                </div>
              </div>
            </div>

            {/* সূত্র / তারিখ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #555', marginTop: '3px', fontSize: '9.5pt' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700 }}>সূত্র ঃ</span>
                <input
                  value={sutro}
                  onChange={e => setSutro(e.target.value)}
                  placeholder="........................"
                  style={{ outline: 'none', background: 'transparent', borderBottom: '1px dotted #888', minWidth: '160px', padding: '0 4px', fontSize: '9.5pt', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700 }}>তারিখ ঃ</span>
                <div style={{ position: 'relative' }}>
                  <input type="date" value={tarikh} onChange={e => setTarikh(e.target.value)}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }} />
                  <span style={{ borderBottom: '1px dotted #888', minWidth: '130px', display: 'inline-block', padding: '0 4px', fontSize: '9.5pt' }}>
                    {tarikh ? tarikhDisplay : '............................'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div style={{ padding: '20px 36px 36px', minHeight: '500px' }}>
            <style>{`
              #pad-ed:empty::before { content: attr(data-placeholder); color: #c0c0c0; pointer-events: none; }
              #pad-ed:focus { outline: none; }
            `}</style>
            <div
              id="pad-ed"
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="এখানে পত্রের বিষয়বস্তু লিখুন..."
              style={{ fontFamily: "'Noto Serif Bengali','Vrinda','Nirmala UI',serif", fontSize: '11pt', lineHeight: '2', minHeight: '460px', color: '#111' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
