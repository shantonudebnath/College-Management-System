'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { loadWebsiteContent, DEFAULT_CONTENT, type GalleryItem } from '@/lib/website-content';
import { Images } from 'lucide-react';

export default function GallerySection() {
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_CONTENT.gallery);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    setGallery(loadWebsiteContent().gallery);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Images size={13} /> গ্যালারি
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">আমাদের ক্যাম্পাস</h2>
          <p className="text-gray-500 text-sm mt-2">মাদ্রাসার বিভিন্ন কার্যক্রম ও পরিবেশের ছবি</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {gallery.map(item => (
            <div key={item.id} className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-gray-100"
              onClick={() => setSelected(item)}>
              <Image src={item.url} alt={item.caption} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-xs font-medium">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="relative max-w-3xl w-full aspect-video rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <Image src={selected.url} alt={selected.caption} fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-medium">{selected.caption}</p>
            </div>
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-black/70">×</button>
          </div>
        </div>
      )}
    </section>
  );
}
