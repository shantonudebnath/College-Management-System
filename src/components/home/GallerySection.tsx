'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { loadWebsiteContent, DEFAULT_CONTENT, type GalleryItem } from '@/lib/website-content';
import { X, ZoomIn } from 'lucide-react';

export default function GallerySection() {
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_CONTENT.gallery);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    setGallery(loadWebsiteContent().gallery);
  }, []);

  return (
    <section className="py-20 bg-[#f9f8ff]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-[0.2em] mb-3">গ্যালারি</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight">
              আমাদের ক্যাম্পাস
            </h2>
            <div className="w-10 h-[3px] bg-purple-500 rounded-full mt-4" />
          </div>
          <p className="hidden md:block text-sm text-gray-400">মাদ্রাসার বিভিন্ন কার্যক্রম ও পরিবেশের ছবি</p>
        </div>

        {/* Staggered Grid */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map((item, i) => {
              const isWide = i === 0;
              const isTall = i === 3;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`relative overflow-hidden rounded-2xl cursor-pointer group bg-gray-100
                    ${isWide ? 'col-span-2 aspect-[16/9]' : isTall ? 'row-span-2 aspect-[4/5]' : 'aspect-square'}
                  `}
                >
                  <Image
                    src={item.url}
                    alt={item.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white text-xs font-semibold leading-tight">{item.caption}</p>
                  </div>
                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={14} className="text-white" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl w-full aspect-video rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <Image src={selected.url} alt={selected.caption} fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-5">
              <p className="text-white font-semibold text-sm">{selected.caption}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
