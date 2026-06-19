'use client';
import { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Minus } from 'lucide-react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'এখানে লিখুন...', minHeight = '180px' }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef(value);

  useEffect(() => {
    if (editorRef.current && value !== lastRef.current) {
      editorRef.current.innerHTML = value;
      lastRef.current = value;
    }
  }, [value]);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    const html = editorRef.current?.innerHTML ?? '';
    lastRef.current = html;
    onChange(html);
  };

  const handleInput = () => {
    const html = editorRef.current?.innerHTML ?? '';
    lastRef.current = html;
    onChange(html);
  };

  const btn = (content: React.ReactNode, cmd: string, val?: string, title?: string) => (
    <button
      key={cmd + (val ?? '')}
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); exec(cmd, val); }}
      className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all text-xs font-bold"
    >
      {content}
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-purple-400 transition-colors">
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-100 flex-wrap">
        {btn(<Bold size={13} />, 'bold', undefined, 'মোটা (Bold)')}
        {btn(<Italic size={13} />, 'italic', undefined, 'তির্যক (Italic)')}
        {btn(<Underline size={13} />, 'underline', undefined, 'আন্ডারলাইন')}
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        {btn('H1', 'formatBlock', 'h2', 'বড় শিরোনাম')}
        {btn('H2', 'formatBlock', 'h3', 'ছোট শিরোনাম')}
        {btn('P', 'formatBlock', 'p', 'সাধারণ লেখা')}
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        {btn(<List size={13} />, 'insertUnorderedList', undefined, 'বুলেট তালিকা')}
        {btn(<ListOrdered size={13} />, 'insertOrderedList', undefined, 'সংখ্যা তালিকা')}
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        {btn(<Minus size={13} />, 'insertHorizontalRule', undefined, 'লাইন')}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="rich-editor px-4 py-3 text-sm text-gray-800 outline-none leading-relaxed overflow-auto"
      />
    </div>
  );
}
