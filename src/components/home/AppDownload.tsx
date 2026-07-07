'use client';
import { useEffect, useState } from 'react';
import { Smartphone, Download, CheckCircle, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AppDownload() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setDeferredPrompt(null);
    } else {
      setShowManual(true);
    }
  };

  if (dismissed || installed) return null;

  return (
    <section className="py-12 bg-gradient-to-br from-[#1e1b4b] to-[#3730a3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Left side */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Smartphone size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">মোবাইল অ্যাপ ডাউনলোড করুন</h2>
              <p className="text-indigo-200 text-sm mt-1">
                Android ফোনে ইনস্টল করুন — ইন্টারনেট ছাড়াও ব্যবহার করা যাবে
              </p>
              <div className="flex gap-3 mt-2">
                {['অফলাইন সাপোর্ট', 'দ্রুত লোড', 'হোম স্ক্রিনে শর্টকাট'].map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs text-indigo-300">
                    <CheckCircle size={10} className="text-green-400" /> {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right side — buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 bg-white text-[#1e1b4b] font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-sm"
            >
              <Download size={16} /> এখনই ইনস্টল করুন
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="বন্ধ করুন"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Manual instructions */}
        {showManual && (
          <div className="mt-6 bg-white/10 rounded-2xl p-5 text-white text-sm">
            <p className="font-semibold mb-3 text-indigo-200">Android Chrome এ ইনস্টল করার নিয়ম:</p>
            <ol className="space-y-2 list-decimal list-inside text-indigo-100">
              <li>Chrome ব্রাউজারে এই পেজটি খুলুন</li>
              <li>উপরে ডান কোণে তিনটি বিন্দু (⋮) মেনুতে ট্যাপ করুন</li>
              <li><strong>&quot;Add to Home screen&quot;</strong> বা <strong>&quot;হোম স্ক্রিনে যোগ করুন&quot;</strong> এ ট্যাপ করুন</li>
              <li><strong>&quot;Add&quot;</strong> বাটনে ট্যাপ করুন</li>
              <li>হোম স্ক্রিনে অ্যাপটি দেখা যাবে!</li>
            </ol>
            <button onClick={() => setShowManual(false)} className="mt-4 text-xs text-indigo-300 hover:text-white underline">বন্ধ করুন</button>
          </div>
        )}
      </div>
    </section>
  );
}
