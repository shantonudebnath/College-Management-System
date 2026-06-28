import { Globe, Mail, Phone } from 'lucide-react';

export default function DevFooter() {
  return (
    <div className="border-t border-gray-100 bg-white px-6 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
        <p>© {new Date().getFullYear()} সকল স্বত্ব সংরক্ষিত।</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-gray-500 font-semibold">Developed by</span>
          <a
            href="https://fivolix.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold transition-colors"
          >
            <Globe size={11} /> fivolix.tech
          </a>
          <a
            href="mailto:fivolix@gmail.com"
            className="flex items-center gap-1 hover:text-gray-600 transition-colors"
          >
            <Mail size={11} /> fivolix@gmail.com
          </a>
          <a
            href="tel:01908549552"
            className="flex items-center gap-1 hover:text-gray-600 transition-colors"
          >
            <Phone size={11} /> 01908549552
          </a>
        </div>
      </div>
    </div>
  );
}
