import { NOTICES } from '@/lib/data';
import { AlertCircle } from 'lucide-react';

export default function NoticeTicker() {
  const urgent = NOTICES.filter(n => n.isImportant);
  return (
    <div className="bg-amber-50 border-b border-amber-200 py-2 overflow-hidden">
      <div className="flex items-center max-w-full">
        <div className="gradient-primary text-white text-xs font-bold px-4 py-1 flex items-center gap-2 shrink-0 z-10">
          <AlertCircle size={13} />
          <span>নোটিশ</span>
        </div>
        <div className="overflow-hidden flex-1 relative">
          <div className="notice-marquee inline-block text-xs text-amber-800 font-medium">
            {urgent.map((n, i) => (
              <span key={n.id} className="mx-8">
                🔔 {n.title} {i < urgent.length - 1 ? '  |  ' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
