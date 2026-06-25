'use client';
import { useState, useRef } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { COLLEGE_INFO } from '@/lib/data';
import {
  Printer, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo, Minus,
} from 'lucide-react';

function letterHTML(sutro: string, tarikh: string, body: string, logoSrc: string): string {
  const display = tarikh
    ? new Date(tarikh).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    : '................................';
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
body{font-family:'Noto Serif Bengali','Vrinda','Nirmala UI',serif;font-size:11pt;color:#000;background:#fff}
@page{size:A4 portrait;margin:12mm 18mm}
.hdr{display:flex;align-items:flex-start;gap:8px;padding-bottom:6px;border-bottom:2.5px solid #8B0000}
.col-bn{flex:1}
.col-logo{width:70px;text-align:center;flex-shrink:0}
.col-en{flex:1;text-align:right;font-family:Arial,sans-serif}
.nm-bn{font-size:17pt;font-weight:900;color:#8B0000;line-height:1.25}
.nm-en{font-size:11pt;font-weight:900;color:#8B0000;line-height:1.25}
.addr{font-size:7.5pt;color:#333;margin-top:4px;line-height:1.6}
.sr-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #555;font-size:10pt;margin-top:2px}
.body{margin-top:16pt;font-size:11pt;line-height:2;min-height:180mm}
</style>
</head>
<body>
<div class="hdr">
  <div class="col-bn">
    <div class="nm-bn">${COLLEGE_INFO.nameBn}</div>
    <div class="addr">
      ডাকঘর- মঠেখোলা, উপজেলা-পাকুন্দিয়া, জেলা- কিশোরগঞ্জ।<br>
      স্থাপিত ঃ ${COLLEGE_INFO.established}ইং, ইআইআইএন- ${COLLEGE_INFO.eiin}<br>
      মোবাইল ঃ ${COLLEGE_INFO.phone}<br>
      E-mail: ${COLLEGE_INFO.email}<br>
      Web: ${COLLEGE_INFO.website}
    </div>
  </div>
  <div class="col-logo">
    ${logoSrc ? `<img src="${logoSrc}" style="width:62px;height:auto;">` : ''}
  </div>
  <div class="col-en">
    <div class="nm-en">${COLLEGE_INFO.name.toUpperCase()}</div>
    <div class="addr">
      Post : Mathkhola, Upazila : Pakundia<br>
      Dist-Kishoregonj<br>
      ESTD : ${COLLEGE_INFO.establishedEn}, EIIN-${COLLEGE_INFO.eiin}<br>
      Mobile : ${COLLEGE_INFO.phone}<br>
      E-mail : ${COLLEGE_INFO.email}<br>
      Web: ${COLLEGE_INFO.website}
    </div>
  </div>
</div>
<div class="sr-row">
  <span>সূত্র ঃ ${sutro || '................................'}</span>
  <span>তারিখ ঃ ${display}</span>
</div>
<div class="body">${body}</div>
<script>
window.addEventListener('load',function(){
  if(document.fonts&&document.fonts.ready){
    document.fonts.ready.then(function(){setTimeout(window.print,350)});
  }else{setTimeout(window.print,1200)}
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

const FONT_SIZES = [
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

  const tarikhDisplay = tarikh
    ? new Date(tarikh).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div>
      <DashboardHeader
        title="প্রাতিষ্ঠানিক প্যাড"
        subtitle="অফিসিয়াল পত্র ও চিঠিপত্র তৈরি করুন"
        userName="Admin"
        role="Super Admin"
      />
      <div className="p-6 max-w-5xl mx-auto space-y-4">

        {/* Toolbar */}
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

          <ToolBtn onClick={() => exec('justifyLeft')} title="বাম-সারিবদ্ধ"><AlignLeft size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('justifyCenter')} title="মধ্য-সারিবদ্ধ"><AlignCenter size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('justifyRight')} title="ডান-সারিবদ্ধ"><AlignRight size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('justifyFull')} title="সম্পূর্ণ-সারিবদ্ধ"><AlignJustify size={14} /></ToolBtn>
          <div className="w-px h-5 bg-gray-200 mx-0.5" />

          <ToolBtn onClick={() => exec('insertUnorderedList')} title="বুলেট তালিকা"><List size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('insertOrderedList')} title="সংখ্যা তালিকা"><ListOrdered size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('insertHorizontalRule')} title="অনুভূমিক রেখা"><Minus size={14} /></ToolBtn>
          <div className="w-px h-5 bg-gray-200 mx-0.5" />

          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer" title="লেখার রঙ">
            <span className="font-semibold text-gray-700" style={{ fontFamily: 'serif' }}>A</span>
            <input
              type="color"
              defaultValue="#000000"
              onChange={e => exec('foreColor', e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
          </label>

          <div className="flex-1" />
          <button
            onClick={printLetter}
            className="flex items-center gap-2 bg-[#1e1b4b] hover:bg-purple-900 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <Printer size={15} /> প্রিন্ট করুন
          </button>
        </div>

        {/* Paper */}
        <div
          className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
          style={{ fontFamily: "'Noto Serif Bengali','Vrinda','Nirmala UI',serif" }}
        >
          {/* Letterhead */}
          <div className="px-10 pt-8 pb-0">
            <div className="flex items-start gap-5 pb-4 border-b-[3px] border-red-800">
              {/* Bengali info */}
              <div className="flex-1">
                <div className="font-black text-red-800 leading-snug" style={{ fontSize: '20pt' }}>
                  {COLLEGE_INFO.nameBn}
                </div>
                <div className="text-gray-700 mt-2 leading-relaxed" style={{ fontSize: '8.5pt' }}>
                  ডাকঘর- মঠেখোলা, উপজেলা-পাকুন্দিয়া, জেলা- কিশোরগঞ্জ।<br />
                  স্থাপিত ঃ {COLLEGE_INFO.established}ইং, ইআইআইএন- {COLLEGE_INFO.eiin}<br />
                  মোবাইল ঃ {COLLEGE_INFO.phone}<br />
                  E-mail: {COLLEGE_INFO.email}<br />
                  Web: {COLLEGE_INFO.website}
                </div>
              </div>

              {/* Logo */}
              <div className="flex items-center justify-center w-20 shrink-0 pt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="লোগো" className="w-16 h-16 object-contain" />
              </div>

              {/* English info */}
              <div className="flex-1 text-right" style={{ fontFamily: 'Arial,sans-serif' }}>
                <div className="font-black text-red-800 leading-snug" style={{ fontSize: '11.5pt' }}>
                  {COLLEGE_INFO.name.toUpperCase()}
                </div>
                <div className="text-gray-700 mt-2 leading-relaxed" style={{ fontSize: '8.5pt' }}>
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
            <div className="flex items-center justify-between py-2 border-b border-gray-500 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="font-bold">সূত্র ঃ</span>
                <input
                  value={sutro}
                  onChange={e => setSutro(e.target.value)}
                  placeholder="........................"
                  className="outline-none bg-transparent border-b border-dotted border-gray-400 min-w-40 px-1 text-sm"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">তারিখ ঃ</span>
                <div className="relative">
                  <input
                    type="date"
                    value={tarikh}
                    onChange={e => setTarikh(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full cursor-pointer"
                  />
                  <span className="border-b border-dotted border-gray-400 min-w-32 inline-block px-1 text-sm">
                    {tarikhDisplay || '............................'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Editor area */}
          <div className="px-10 py-6 min-h-[520px] relative">
            <style>{`
              #pad-editor:empty:before {
                content: attr(data-placeholder);
                color: #bbb;
                pointer-events: none;
              }
              #pad-editor:focus { outline: none; }
              #pad-editor p { margin: 0; }
            `}</style>
            <div
              id="pad-editor"
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="এখানে পত্রের বিষয়বস্তু লিখুন..."
              style={{
                fontFamily: "'Noto Serif Bengali','Vrinda','Nirmala UI',serif",
                fontSize: '12pt',
                lineHeight: '2',
                minHeight: '480px',
                color: '#111',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
