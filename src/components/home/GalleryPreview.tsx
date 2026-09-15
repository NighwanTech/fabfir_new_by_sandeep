"use client";

import React, { useRef, useState, useEffect } from "react";
import { homeData } from "@/data/dummy";
import { motion, useInView, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api } from "@/services/api";
import { fixImageUrl } from "@/lib/apiConfig";

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (url.includes('watch?v=')) videoId = url.split('watch?v=')[1]?.split('&')[0];
    else if (url.includes('shorts/')) videoId = url.split('shorts/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  }
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : url;
  }
  return url;
};

export function GalleryPreview() {
  const { gallery } = homeData;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10%" });
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await api.get('/gallery/preview');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            const sortedItems = [...data.data].sort((a: any, b: any) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
            setItems(sortedItems);
          }
        }
      } catch (e) {
        console.error("Failed to fetch gallery preview", e);
      }
    };
    fetchPreview();
  }, []);

  const easePremium = [0.16, 1, 0.3, 1] as const;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easePremium } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: easePremium } }
  };

  return (
    <section ref={sectionRef} id="gallery" className="bg-[#050505] relative overflow-hidden py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[1400px]">
        
        {/* Header Area with Top Right Button */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12"
        >
          <div>
            <span className="text-primary font-bold text-[10px] tracking-widest uppercase mb-4 block">
              {gallery.badge}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black leading-[0.9] uppercase tracking-tighter mb-4">
              <span className="block text-white mb-2">{gallery.headingLine1}</span>
              <span className="block text-primary">{gallery.headingLine2}</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base font-medium">
              {gallery.subHeader}
            </p>
          </div>

          <Link href="/gallery" className="group">
            <button className="px-6 py-3 border border-primary text-primary font-bold text-[10px] tracking-widest uppercase rounded flex items-center gap-2 transition-all duration-300 hover:bg-primary hover:text-black">
              EXPLORE GALLERY
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </Link>
        </motion.div>

        {/* Bento Box Grid (1 Large Left, 4 Small Right) */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px] lg:auto-rows-[250px]"
        >
          {items.map((item: any, index: number) => (
            <motion.div 
              key={item.id}
              variants={itemVariants}
              onClick={() => setSelectedItem(item)}
              className={`group relative rounded-xl overflow-hidden cursor-pointer border border-zinc-800/60 hover:border-primary transition-colors duration-500 bg-[#0a0a0a]
                ${index === 0 ? 'lg:col-span-2 lg:row-span-2 min-h-[300px]' : 'col-span-1 row-span-1'}
              `}
            >
              {/* Background Image */}
              <img 
                src={fixImageUrl((item.type === 'VIDEO' ? item.thumbnailUrl : item.mediaUrl) || '') || undefined} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
              />
              
              {/* Gradients for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              {/* Video Specific Overlay */}
              {item.type === 'VIDEO' && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-primary transition-colors duration-500
                      ${index === 0 ? 'w-16 h-16' : 'w-12 h-12'}
                    `}>
                      <PlayIcon />
                    </div>
                  </div>
                </>
              )}

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col">
                <h4 className={`text-white font-black uppercase tracking-wider mb-1 group-hover:text-primary transition-colors duration-300
                  ${index === 0 ? 'text-2xl lg:text-3xl' : 'text-sm'}
                `}>
                  {item.title}
                </h4>
                <p className={`text-zinc-400 font-medium tracking-wide
                  ${index === 0 ? 'text-sm' : 'text-[10px]'}
                `}>
                  {item.category}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-5xl flex flex-col items-end">
              <button 
                onClick={() => setSelectedItem(null)}
                className="mb-4 z-10 w-10 h-10 bg-black/50 hover:bg-primary text-white hover:text-black rounded-full flex items-center justify-center transition-colors border border-white/20"
              >
                ✕
              </button>
              <div 
                className="relative w-full max-h-[85vh] aspect-video flex items-center justify-center rounded-xl overflow-hidden bg-black border border-zinc-800"
                onClick={(e) => e.stopPropagation()}
              >
              
              {selectedItem.type === 'VIDEO' ? (
                (selectedItem.mediaUrl?.includes('youtube.com') || selectedItem.mediaUrl?.includes('youtu.be') || selectedItem.mediaUrl?.includes('vimeo.com')) ? (
                  <iframe
                    src={getEmbedUrl(selectedItem.mediaUrl)}
                    className="w-full h-full max-h-[90vh] object-contain bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={selectedItem.mediaUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full max-h-[90vh] object-contain bg-black"
                  />
                )
              ) : (
                <img 
                  src={selectedItem.mediaUrl || undefined}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain bg-black"
                />
              )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
