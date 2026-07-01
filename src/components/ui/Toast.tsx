'use client';
import { useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

const STYLES: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
};

const ICONS: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error:   AlertCircle,
  info:    AlertCircle,
};

export function useToast() {
  const [state, setState] = useState<ToastState>({ message: '', type: 'success', visible: false });

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    setState({ message, type, visible: true });
    setTimeout(() => setState(s => ({ ...s, visible: false })), 4000);
  }, []);

  const close = useCallback(() => setState(s => ({ ...s, visible: false })), []);

  const ToastEl = state.visible ? (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-xl max-w-sm animate-in slide-in-from-bottom-4 duration-300 ${STYLES[state.type]}`}>
      {(() => { const Icon = ICONS[state.type]; return <Icon size={18} className="shrink-0 mt-0.5" />; })()}
      <p className="text-sm font-medium leading-snug flex-1">{state.message}</p>
      <button onClick={close} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-1">
        <X size={15} />
      </button>
    </div>
  ) : null;

  return { toast, ToastEl };
}
