"use client";

import React, { useRef, useState, useEffect } from "react";
import { homeData } from "@/data/dummy";
import { motion, useInView, Variants } from "framer-motion";
import { fixImageUrl } from "@/lib/apiConfig";

// Custom SVG Icons
const BicepIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20.2 11.5c-1-1.3-3.6-2.5-6.2-2.5V3c0-.6-.4-1-1-1H9C8.4 2 8 2.4 8 3v4c0 1.1-.9 2-2 2H4c-1.1 0-2 .9-2 2v2c0 3.3 2.7 6 6 6h1.4c.5 1.7 2.1 3 4.1 3 2.5 0 4.5-2 4.5-4.5 0-1.2-.5-2.3-1.3-3.1.5-.7 1.5-1.9 1.5-2.9 0-.3 0-.6-.1-.9z"/><path d="M12 9v4"/><path d="M16 13h-4"/></svg>;
const FlameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const TimerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

// Icon Mapping
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'bicep': return <BicepIcon />;
    case 'flame': return <FlameIcon />;
    case 'user': return <UserIcon />;
    case 'chart': return <ChartIcon />;
    case 'trophy': return <TrophyIcon />;
    case 'timer': return <TimerIcon />;
    case 'star': return <StarIcon />;
    default: return <CheckIcon />;
  }
};

export function Transformations() {
  const { testimonials } = homeData;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10%" });
  const [sectionData, setSectionData] = useState<any>(null);
  const [cardsData, setCardsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/transformation-section?public=true`);
        const json = await res.json();
        if (json.success && json.data) {
          setSectionData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch transformation section:", error);
      }
    };
    
    const fetchCards = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/transformations?public=true`);
        const json = await res.json();
        if (json.success && json.data) {
          const sortedCards = [...json.data].sort((a: any, b: any) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
          setCardsData(sortedCards);
        }
      } catch (error) {
        console.error("Failed to fetch transformation cards:", error);
      }
    };

    fetchSection();
    fetchCards();
  }, []);

  const featuredTransformations = cardsData.filter(card => card.showInMain);
  const progressGrid = cardsData.filter(card => !card.showInMain);

  const easePremium = [0.16, 1, 0.3, 1] as const;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easePremium } }
  };

  const staggerCards: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: custom * 0.1, ease: easePremium }
    })
  };

  return (
    <section ref={sectionRef} id="transformations" className="bg-[#050505] relative overflow-hidden flex flex-col py-12 md:py-16">
      
      {/* PART 1: Top Featured Hero */}
      <div className="relative w-full mb-8">
        {/* Background for the left column (faded athlete) */}
        <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full z-0 opacity-40 lg:opacity-80">
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] lg:to-[#050505] z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] z-10"></div>
          <img 
            src={sectionData?.backgroundImage || "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000&auto=format&fit=crop"} 
            alt="Background Coach" 
            className="w-full h-full object-cover object-left mask-image-linear-left" 
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[1500px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
            
            {/* Left Column: Headers and CTA */}
            <div className="w-full lg:w-[40%] flex gap-8 lg:pl-10 lg:pt-10">
              <motion.div 
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="flex-1"
              >
                {sectionData?.badge && (
                  <div className="inline-block px-3 py-1 border border-primary/50 text-primary font-bold text-[10px] tracking-widest uppercase mb-6">
                    {sectionData.badge}
                  </div>
                )}
                
                {sectionData?.title && (
                  <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black leading-[0.9] uppercase tracking-tighter mb-8">
                    {sectionData.title.split(/\.\s+/).map((sentence: string, idx: number, arr: string[]) => (
                      <span key={idx} className={`block ${idx % 2 === 0 ? 'text-white' : 'text-primary'}`}>
                        {sentence}{idx < arr.length - 1 ? '.' : ''}
                      </span>
                    ))}
                  </h2>
                )}
                
                {sectionData?.description && (
                  <p className="text-zinc-400 text-sm md:text-base font-medium max-w-sm mb-12 leading-relaxed">
                    {sectionData.description}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Right Column: Stacked Transformation Cards */}
            <div className="w-full lg:w-[60%] flex flex-col gap-6 lg:pr-10">
              {featuredTransformations.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  custom={index}
                  variants={staggerCards}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="group flex flex-col md:flex-row w-full bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden shadow-2xl hover:border-primary/50 transition-colors duration-500"
                >
                  {/* Card Left: Content Panel */}
                  <div className="w-full md:w-[35%] p-6 md:p-8 flex flex-col justify-center relative">
                    {/* Subtle Glow */}
                    <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Hexagon Icon and Title */}
                    <div className="flex items-start gap-4 mb-6 relative z-10">
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center border border-primary/40 rounded-xl relative">
                        <div className="absolute inset-0 rotate-45 border border-primary/20 rounded-xl scale-95"></div>
                        {getIcon(item.icon)}
                      </div>
                      <div>
                        <h4 className="text-white font-black text-xl md:text-2xl uppercase leading-tight tracking-tight mt-1">
                          {item.title.split(' ').map((word: string, i: number) => (
                            <span key={i} className="block">{word}</span>
                          ))}
                        </h4>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-8 h-[2px] bg-primary mb-6 relative z-10"></div>

                    {/* Bullets */}
                    <ul className="flex flex-col gap-5 md:gap-6 mb-4 flex-grow relative z-10">
                      {(item.highlights || []).map((highlight: string, i: number) => (
                        <li key={i} className="text-zinc-400 font-bold text-[10px] md:text-xs tracking-wider uppercase flex items-center gap-3">
                          <CheckIcon />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Right: Split Image */}
                  <div className="w-full md:w-[65%] h-[250px] md:h-[350px] relative flex">
                    {/* Glowing Center Line */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-primary z-20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] transform -translate-x-1/2"></div>
                    
                    {/* Before */}
                    <div className="w-1/2 h-full relative overflow-hidden bg-zinc-900">
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-zinc-800/90 border border-zinc-600 text-zinc-300 text-[9px] font-bold px-3 py-1 tracking-widest uppercase rounded">
                        BEFORE
                      </div>
                      <img src={fixImageUrl(item.beforeImage) || undefined} alt="Before" className="absolute inset-0 w-full h-full object-cover object-center grayscale-[50%] transition-transform duration-700 group-hover:scale-110" />
                    </div>

                    {/* After */}
                    <div className="w-1/2 h-full relative overflow-hidden bg-zinc-900">
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-primary border border-primary text-black text-[9px] font-black px-3 py-1 tracking-widest uppercase rounded shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]">
                        AFTER
                      </div>
                      <img src={fixImageUrl(item.afterImage) || undefined} alt="After" className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>

    {/* PART 2: Bottom Progress Grid */}
    <div className="w-full bg-[#0a0a0a] border-t border-zinc-800/50 pt-8 pb-8 px-4 md:px-8 rounded-t-[3rem]">
      <div className="container mx-auto max-w-[1600px]">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
                <span className="text-white">REAL PEOPLE. </span>
                <span className="text-primary">REAL PROGRESS.</span>
              </h2>
              <p className="text-zinc-400 font-medium text-sm">
                {testimonials.bottomSubHeader}
              </p>
            </div>
          </div>

          {/* 5-Column Vertical Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
            {progressGrid.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={staggerCards}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-5%" }}
                className="bg-[#111] rounded-xl border border-zinc-800/80 overflow-hidden flex flex-col group hover:border-primary/50 transition-colors duration-300"
              >
                {/* Card Header (Icon, Title, Subtitle) */}
                <div className="p-5 border-b border-zinc-800/50 flex gap-4 items-center">
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center border border-primary/40 rounded-lg relative">
                    <div className="absolute inset-0 rotate-45 border border-primary/20 rounded-lg scale-95"></div>
                    <div className="scale-90">{getIcon(item.icon)}</div>
                  </div>
                  <div>
                    <h5 className="text-white font-black text-sm uppercase tracking-wider leading-none mb-1.5">{item.title}</h5>
                    <p className="text-zinc-500 text-[10px] font-bold tracking-wide">{item.subtitle}</p>
                  </div>
                </div>

                {/* Card Middle (Split Images) */}
                <div className="relative w-full aspect-[4/5] flex bg-zinc-900">
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                  
                  {/* Before */}
                  <div className="w-1/2 h-full relative overflow-hidden">
                    <img src={fixImageUrl(item.beforeImage) || undefined} className="absolute inset-0 w-full h-full object-cover object-center grayscale-[30%] transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  
                  {/* After */}
                  <div className="w-1/2 h-full relative overflow-hidden border-l border-zinc-800">
                    <img src={fixImageUrl(item.afterImage) || undefined} className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                  </div>

                  {/* Center Arrow Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black border border-zinc-700 rounded-full flex items-center justify-center z-20">
                    <span className="text-primary text-[12px] font-bold">&gt;</span>
                  </div>
                </div>

                {/* Card Footer (Stats) */}
                <div className="p-4 border-t border-zinc-800/50 flex justify-between bg-[#0a0a0a]">
                  
                  {/* Stat 1 */}
                  {item.stat1Value && (
                    <div className="flex flex-col items-center justify-center w-1/2 border-r border-zinc-800/50">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-white font-black text-sm">{item.stat1Value}</span>
                      </div>
                      <span className="text-zinc-500 text-[9px] font-bold tracking-widest uppercase">{item.stat1Label}</span>
                    </div>
                  )}

                  {/* Stat 2 */}
                  {item.stat2Value && (
                    <div className="flex flex-col items-center justify-center w-1/2">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-white font-black text-sm">{item.stat2Value}</span>
                      </div>
                      <span className="text-zinc-500 text-[9px] font-bold tracking-widest uppercase">{item.stat2Label}</span>
                    </div>
                  )}

                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
