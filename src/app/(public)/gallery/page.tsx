"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";
import Link from "next/link";
import { fixImageUrl } from "@/lib/apiConfig";

// --- SVG Icons ---
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const ChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M8 5v14l11-7z"/></svg>;

type ViewState = 'landing' | 'photos' | 'videos';

// Helper function to get valid embed URL
const getEmbedUrl = (url: string) => {
  if (!url) return '';
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    } else if (url.includes('shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : url;
  }
  
  return url;
};

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [view, setView] = useState<ViewState>('landing');
  
  // Filtering states
  const [activePhotoCategory, setActivePhotoCategory] = useState("ALL");
  const [activeVideoCategory, setActiveVideoCategory] = useState("ALL");

  // Lightbox states
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number | null>(null);
  const [lightboxVideo, setLightboxVideo] = useState<any | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.get('/gallery');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setItems(data.data);
          }
        }
      } catch (e) {
        console.error("Failed to load gallery");
      }
    };
    fetchGallery();
  }, []);

  const allPhotos = items.filter(i => i.type === 'IMAGE' && i.status === 'ACTIVE');
  const allVideos = items.filter(i => i.type === 'VIDEO' && i.status === 'ACTIVE');

  const photoCategories = ["ALL", ...Array.from(new Set(allPhotos.map(p => p.category)))];
  const videoCategories = ["ALL", ...Array.from(new Set(allVideos.map(v => v.category)))];

  // Derived filtered data
  const filteredPhotos = allPhotos.filter(p => activePhotoCategory === "ALL" || p.category === activePhotoCategory);
  const filteredVideos = allVideos.filter(v => activeVideoCategory === "ALL" || v.category === activeVideoCategory);

  // Animation settings
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxPhotoIndex !== null) {
      setLightboxPhotoIndex((lightboxPhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxPhotoIndex !== null) {
      setLightboxPhotoIndex((lightboxPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  // Ensure window starts at top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 relative">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 relative">
          <Link href="/" className="absolute left-0 top-0 text-zinc-400 hover:text-white font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 transition-colors">
            <ArrowLeft /> BACK TO HOME
          </Link>
          
          <div className="w-full text-center mt-12 md:mt-0">
            <h1 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter">
              {view === 'landing' && <><span className="text-white">EXPLORE </span><span className="text-primary">GALLERY</span></>}
              {view === 'photos' && <><span className="text-white">PHOTO </span><span className="text-primary">GALLERY</span></>}
              {view === 'videos' && <><span className="text-white">VIDEO </span><span className="text-primary">GALLERY</span></>}
            </h1>
            
            {view === 'landing' && (
              <p className="text-zinc-400 text-sm mt-4">Discover our best moments, stories and highlights.</p>
            )}
            
            {view === 'photos' && (
              <p className="text-zinc-400 text-sm mt-4">All our best moments captured in photos.</p>
            )}

            {view === 'videos' && (
              <p className="text-zinc-400 text-sm mt-4">Watch our workouts, events, transformations and more.</p>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* LANDING VIEW */}
          {view === 'landing' && (
            <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto mt-20">
              
              {/* Photo Card */}
              <div 
                onClick={() => setView('photos')}
                className="w-full md:w-1/2 bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-10 flex flex-col items-center text-center cursor-pointer group hover:border-primary transition-all duration-500 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)] hover:-translate-y-2 active:scale-[0.98]"
              >
                <div className="mb-6 transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500">
                  <PhotoIcon />
                </div>
                <h3 className="font-black text-2xl tracking-tighter mb-4 group-hover:text-primary transition-colors duration-500">PHOTOS</h3>
                <p className="text-zinc-400 text-sm font-medium mb-8 px-4 group-hover:text-zinc-300 transition-colors duration-500">
                  Explore our photo gallery from events, training, community and more.
                </p>
                <button className="px-8 py-3 bg-primary text-black font-black text-[11px] tracking-widest uppercase rounded flex items-center gap-3 group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 transform group-hover:-translate-y-1">
                  VIEW PHOTOS 
                  <span className="transform group-hover:translate-x-2 transition-transform duration-500">→</span>
                </button>
              </div>

              {/* Video Card */}
              <div 
                onClick={() => setView('videos')}
                className="w-full md:w-1/2 bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-10 flex flex-col items-center text-center cursor-pointer group hover:border-primary transition-all duration-500 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)] hover:-translate-y-2 active:scale-[0.98]"
              >
                <div className="mb-6 transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500">
                  <VideoIcon />
                </div>
                <h3 className="font-black text-2xl tracking-tighter mb-4 group-hover:text-primary transition-colors duration-500">VIDEOS</h3>
                <p className="text-zinc-400 text-sm font-medium mb-8 px-4 group-hover:text-zinc-300 transition-colors duration-500">
                  Watch our workout sessions, events, transformations and much more.
                </p>
                <button className="px-8 py-3 bg-primary text-black font-black text-[11px] tracking-widest uppercase rounded flex items-center gap-3 group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 transform group-hover:-translate-y-1">
                  VIEW VIDEOS 
                  <span className="transform group-hover:translate-x-2 transition-transform duration-500">→</span>
                </button>
              </div>

            </motion.div>
          )}

          {/* PHOTOS VIEW */}
          {view === 'photos' && (
            <motion.div key="photos" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col">
              
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-zinc-800/60 pb-6">
                <button onClick={() => setView('landing')} className="text-zinc-500 hover:text-white font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 transition-colors">
                  <ArrowLeft /> BACK TO SELECTION
                </button>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
                  {photoCategories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActivePhotoCategory(cat)}
                      className={`px-4 py-1.5 rounded font-bold text-[9px] tracking-widest uppercase transition-all duration-300 border ${
                        activePhotoCategory === cat 
                          ? 'bg-primary border-primary text-black' 
                          : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-primary/50 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button onClick={() => setView('videos')} className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-black font-bold text-[10px] tracking-widest uppercase rounded transition-colors duration-300">
                  SWITCH TO VIDEOS →
                </button>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((photo, index) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    key={photo.id}
                    onClick={() => setLightboxPhotoIndex(index)}
                    className="aspect-square bg-zinc-900 rounded-lg overflow-hidden cursor-pointer group relative"
                  >
                    <img 
                      src={fixImageUrl(photo.mediaUrl)} 
                      alt={photo.category} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white font-bold text-[10px] tracking-widest uppercase">{photo.title}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* VIDEOS VIEW */}
          {view === 'videos' && (
            <motion.div key="videos" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col">
              
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-zinc-800/60 pb-6">
                <button onClick={() => setView('landing')} className="text-zinc-500 hover:text-white font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 transition-colors">
                  <ArrowLeft /> BACK TO SELECTION
                </button>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
                  {videoCategories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveVideoCategory(cat)}
                      className={`px-4 py-1.5 rounded font-bold text-[9px] tracking-widest uppercase transition-all duration-300 border ${
                        activeVideoCategory === cat 
                          ? 'bg-primary border-primary text-black' 
                          : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-primary/50 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button onClick={() => setView('photos')} className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-black font-bold text-[10px] tracking-widest uppercase rounded transition-colors duration-300">
                  SWITCH TO PHOTOS →
                </button>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredVideos.map((video, index) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    key={video.id}
                    onClick={() => setLightboxVideo(video)}
                    className="aspect-video bg-[#0a0a0a] border border-zinc-800/60 rounded-xl overflow-hidden cursor-pointer group relative"
                  >
                    {video.thumbnailUrl ? (
                      <img 
                        src={fixImageUrl(video.thumbnailUrl)} 
                        alt={video.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100" 
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">No Preview</div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/90 text-black flex items-center justify-center transform scale-90 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <PlayIcon />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end">
                      <div className="flex flex-col">
                        <h4 className="text-white font-black text-[11px] tracking-widest uppercase leading-tight mb-1">{video.title}</h4>
                        <span className="text-zinc-400 font-bold text-[8px] uppercase">{video.category}</span>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- PHOTO LIGHTBOX --- */}
      <AnimatePresence>
        {lightboxPhotoIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
            onClick={() => setLightboxPhotoIndex(null)}
          >
            {/* Close Button */}
            <button className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors p-2 bg-zinc-900/50 rounded-full" onClick={() => setLightboxPhotoIndex(null)}>
              <XIcon />
            </button>

            {/* Main Image */}
            <div className="relative w-full max-w-6xl h-[70vh] flex items-center justify-center px-12">
              <button className="absolute left-4 md:left-12 text-white/50 hover:text-white transition-colors" onClick={handlePrevPhoto}>
                <ChevronLeft />
              </button>

              <motion.img
                key={lightboxPhotoIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                src={fixImageUrl(filteredPhotos[lightboxPhotoIndex].mediaUrl)}
                alt="Fullscreen view"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              <button className="absolute right-4 md:right-12 text-white/50 hover:text-white transition-colors" onClick={handleNextPhoto}>
                <ChevronRight />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-8 w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {filteredPhotos.map((photo, index) => (
                  <button 
                    key={photo.id}
                    onClick={() => setLightboxPhotoIndex(index)}
                    className={`shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-all duration-300 ${index === lightboxPhotoIndex ? 'border-primary scale-110 opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}
                  >
                    <img src={fixImageUrl(photo.mediaUrl)} className="w-full h-full object-cover" alt={`Thumb ${index}`} />
                  </button>
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-zinc-500 font-bold text-[10px] tracking-widest">{lightboxPhotoIndex + 1} / {filteredPhotos.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- VIDEO LIGHTBOX --- */}
      <AnimatePresence>
        {lightboxVideo !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
            onClick={() => setLightboxVideo(null)}
          >
            <button className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors p-2 bg-zinc-900/50 rounded-full" onClick={() => setLightboxVideo(null)}>
              <XIcon />
            </button>

            <div className="w-full max-w-5xl px-4 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-full aspect-video bg-black border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative flex items-center justify-center">
                {(lightboxVideo.mediaUrl.includes('youtube.com') || lightboxVideo.mediaUrl.includes('youtu.be') || lightboxVideo.mediaUrl.includes('vimeo.com')) ? (
                  <iframe 
                    src={getEmbedUrl(lightboxVideo.mediaUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video 
                    src={lightboxVideo.mediaUrl}
                    poster={lightboxVideo.thumbnailUrl || ''}
                    controls
                    autoPlay
                    className="w-full h-full object-contain bg-black"
                  ></video>
                )}
              </div>

              <div className="w-full mt-6 text-left">
                <h2 className="text-white font-black text-2xl tracking-tighter uppercase mb-2">{lightboxVideo.title}</h2>
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold text-[10px] tracking-widest uppercase">{lightboxVideo.category}</span>
                  {lightboxVideo.description && <span className="text-zinc-400 font-medium text-sm">{lightboxVideo.description}</span>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
