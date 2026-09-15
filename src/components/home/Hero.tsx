"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeData } from "@/data/dummy";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";
import { fixImageUrl } from "@/lib/apiConfig";

export function Hero() {
  const [heroSlides, setHeroSlides] = useState(homeData.heroSlides);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await api.get('/heroes');
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          const activeHeroes = result.data
            .filter((h: any) => h.status === 'ACTIVE' && h.title && h.title.trim() !== '')
            .sort((a: any, b: any) => {
              const orderA = typeof a.displayOrder === 'number' ? a.displayOrder : Number(a.displayOrder || 0);
              const orderB = typeof b.displayOrder === 'number' ? b.displayOrder : Number(b.displayOrder || 0);
              return orderA - orderB;
            });

          if (activeHeroes.length > 0) {
            const dynamicSlides = activeHeroes.map((h: any) => ({
              id: h.id,
              badge: h.badge || 'PROVEN METHODOLOGY',
              headingLine1: h.title,
              headingLine2: h.subtitle || '',
              description: h.description || '',
              primaryCTA: h.primaryButtonText || 'Start Your Journey',
              secondaryCTA: h.secondaryButtonText || 'View Programs',
              src: fixImageUrl(h.backgroundImage),
              type: "image"
            }));

            setHeroSlides(dynamicSlides);
            setCurrentSlide(0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dynamic heroes", error);
      }
    };

    fetchHeroes();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const slide = heroSlides[currentSlide];

  if (!slide) return null;

  return (
    <section id="home" className="relative min-h-[100dvh] md:h-[90vh] md:min-h-[650px] md:max-h-[900px] flex items-center bg-[#070709] overflow-hidden pt-[76px] pb-16 md:py-0">

      {/* Dynamic Backgrounds */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="w-full h-full relative">
            <img
              src={fixImageUrl(slide.src) || undefined}
              alt="Hero Background"
              className="w-full h-full object-cover object-center md:object-right opacity-50 brightness-[0.7] transition-all duration-1000 scale-105"
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/70 to-[#070709]/40 z-10 md:bg-gradient-to-r md:from-[#070709]/90 md:via-[#070709]/60 md:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/80 via-transparent to-[#070709] z-10" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="container relative z-20 mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="max-w-2xl w-full py-6 md:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-start"
            >
              {/* Eyebrow */}
              <div className="inline-block text-primary text-xs md:text-sm font-black tracking-[0.2em] uppercase mb-3 md:mb-4 bg-primary/10 px-3 py-1 rounded border border-primary/20">
                {slide.badge}
              </div>

              {/* Headings */}
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-black text-white leading-[1.05] uppercase tracking-tight mb-4 md:mb-6">
                {slide.headingLine1} <br />
                <span className="text-primary drop-shadow-[0_0_25px_rgba(var(--primary-rgb),0.3)]">{slide.headingLine2}</span>
              </h1>

              {/* Description */}
              <p className="text-zinc-300 text-sm sm:text-base md:text-lg mb-8 md:mb-10 leading-relaxed max-w-xl font-medium">
                {slide.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
                <Link
                  href="/assessment"
                  target="_blank"
                  className="group inline-flex items-center justify-center h-12 md:h-14 px-8 bg-primary text-black font-black text-sm md:text-base tracking-wider uppercase transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] rounded-md shadow-lg w-full sm:w-auto"
                >
                  {slide.primaryCTA}
                  <ArrowRight className="ml-2 h-4 w-4 stroke-[3] transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
                <Link
                  href="/#programs"
                  className="inline-flex items-center justify-center h-12 md:h-14 px-8 border border-zinc-600 bg-black/40 backdrop-blur-sm text-white font-bold text-sm md:text-base tracking-wider uppercase transition-all duration-300 hover:bg-white/10 hover:border-white rounded-md w-full sm:w-auto text-center"
                >
                  {slide.secondaryCTA}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 md:bottom-8 left-0 right-0 z-30">
        <div className="container mx-auto px-4 md:px-8 flex justify-center md:justify-start gap-2.5">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 transition-all duration-300 rounded-full ${
                index === currentSlide ? "w-10 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : "w-4 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
