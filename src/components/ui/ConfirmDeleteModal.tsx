'use client';
import { Trash2 } from 'lucide-react';

interface Props {
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({ itemName, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fadeIn">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">মুছে ফেলবেন?</h3>
          {itemName && (
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-semibold text-gray-700">&ldquo;{itemName}&rdquo;</span>
            </p>
          )}
          <p className="text-sm text-gray-400">এই তথ্য মুছে ফেলা হবে এবং পুনরুদ্ধার করা সম্ভব হবে না।</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            বাতিল
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors"
          >
            হ্যাঁ, মুছুন
          </button>
        </div>
      </div>
    </div>
  );
}
