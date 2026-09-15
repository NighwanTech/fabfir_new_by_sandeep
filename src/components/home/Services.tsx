"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { homeData } from "@/data/dummy";
import { ArrowRight, ChevronLeft, ChevronRight, Dumbbell, PersonStanding, HeartPulse, Utensils, Activity, MonitorSmartphone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/services/api";
import { fixImageUrl } from "@/lib/apiConfig";

const IconMap: Record<string, React.ElementType> = {
  Dumbbell,
  PersonStanding,
  HeartPulse,
  Utensils,
  Activity,
  MonitorSmartphone,
};

export function Services() {
  const { services } = homeData;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start", dragFree: true });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [apiServices, setApiServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services?public=true');
        if (response.ok) {
          const data = await response.json();
          const fetchedItems = data.success ? data.data : data;
          if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
            const sortedItems = [...fetchedItems].sort((a: any, b: any) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
            setApiServices(sortedItems);
          }
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const displayItems = apiServices.length > 0 ? apiServices : services.items;

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect, displayItems]);

  return (
    <section id="services" className="py-12 md:py-16 bg-[#030303] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 relative z-10 max-w-[1440px]">

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-[1px] w-8 bg-white/20"></div>
            <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">
              {services.badge}
            </span>
            <div className="h-[1px] w-8 bg-white/20"></div>
          </div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight uppercase mb-3 tracking-tight">
            {services.headingLine1} <span className="text-primary">{services.headingLine2}</span>
          </h2>

          <p className="text-zinc-400 max-w-2xl mx-auto font-medium text-base md:text-lg leading-relaxed">
            {services.description}
          </p>
        </div>

        {/* Carousel Section */}
        <div className="relative group mt-6">
          <div className="overflow-hidden px-2 md:px-4 py-2" ref={emblaRef}>
            <div className="flex gap-4">
              {displayItems.map((item, index) => {
                const Icon = IconMap[item.icon] || Activity;
                return (
                  <Link
                    key={item.id}
                    href={`/services/detail?id=${item.slug || item.id}`}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] min-w-0"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                      className="h-[460px] rounded-xl overflow-hidden bg-[#020202] group/card cursor-pointer flex flex-col relative shadow-2xl border border-white/5 transition-all duration-700 hover:-translate-y-3 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)]"
                    >

                      {/* Background Image filling the card */}
                      <img
                        src={fixImageUrl(item.cardImage || item.image)}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />

                      {/* Premium Deep Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                      {/* Inner Glow effect on hover */}
                      <div className="absolute inset-0 bg-primary/5 mix-blend-overlay pointer-events-none" />

                      {/* Content overlay */}
                      <div className="relative h-full flex flex-col items-center justify-end px-6 pb-10 z-10">

                        {/* Premium Glowing Icon */}
                        <div className="w-14 h-14 rounded-full border border-primary flex items-center justify-center text-black mb-6 bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                          <Icon className="w-6 h-6" />
                        </div>

                        <h3 className="text-primary text-lg font-black text-center uppercase tracking-[0.15em] mb-4 drop-shadow-md">
                          {item.title}
                        </h3>

                        <p className="text-zinc-300 text-sm text-center leading-relaxed font-medium max-w-[95%] mx-auto">
                          {item.shortDescription || item.description}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Premium Floating Navigation Arrows */}
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="absolute top-1/2 -left-2 md:-left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center disabled:opacity-0 transition-all z-20 hover:bg-primary hover:text-black hover:border-primary hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="absolute top-1/2 -right-2 md:-right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center disabled:opacity-0 transition-all z-20 hover:bg-primary hover:text-black hover:border-primary hover:scale-110"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Premium Dots */}
        <div className="flex justify-center gap-2 mt-8 mb-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-1 rounded-full transition-all duration-500 ${index === selectedIndex ? "bg-primary w-6" : "bg-white/20 w-1 hover:bg-white/40"
                }`}
            />
          ))}
        </div>

        {/* Premium Outline CTA */}
        <div className="flex justify-center">
          <Link
            href="/assessment"
            target="_blank"
            className="group inline-flex items-center justify-center h-12 px-8 bg-transparent border border-white/20 text-white text-[11px] font-black tracking-widest uppercase transition-all duration-300 hover:bg-primary hover:border-primary hover:text-black hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] rounded-[4px]"
          >
            {services.cta} <ArrowRight className="ml-3 h-3 w-3 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

      </div>
    </section>
  );
}
