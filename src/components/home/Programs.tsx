"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { homeData } from "@/data/dummy";
import { api } from "@/services/api";
import { fixImageUrl } from "@/lib/apiConfig";
import { Dumbbell, Activity, HeartPulse, PersonStanding, Accessibility, Footprints, Bike, Timer, Flame, Target, Trophy, Medal, Award, Star, Zap, CircleDot, BadgeCheck, Users, UserRound, Shield, ShieldCheck, Apple, Utensils, Salad, Waves, Wind, Sparkles, CalendarDays, Clock, TrendingUp } from 'lucide-react';

const LUCIDE_ICONS: Record<string, React.ElementType> = {
  'dumbbell': Dumbbell,
  'activity': Activity,
  'heart-pulse': HeartPulse,
  'person-standing': PersonStanding,
  'accessibility': Accessibility,
  'footprints': Footprints,
  'bike': Bike,
  'timer': Timer,
  'flame': Flame,
  'target': Target,
  'trophy': Trophy,
  'medal': Medal,
  'award': Award,
  'star': Star,
  'zap': Zap,
  'circle-dot': CircleDot,
  'badge-check': BadgeCheck,
  'users': Users,
  'user-round': UserRound,
  'shield': Shield,
  'shield-check': ShieldCheck,
  'apple': Apple,
  'utensils': Utensils,
  'salad': Salad,
  'waves': Waves,
  'wind': Wind,
  'sparkles': Sparkles,
  'calendar-days': CalendarDays,
  'clock': Clock,
  'trending-up': TrendingUp,
};

const getLucideIcon = (name: string) => {
  const IconComponent = LUCIDE_ICONS[name];
  return IconComponent ? <IconComponent size={20} /> : null;
};

// --- SVG Icons ---
// Main Cards
const BodyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M19.07 9.5a1 1 0 0 0-1.41-1.41L15 10.75V8a6 6 0 0 0-6-6v0a6 6 0 0 0-6 6v2.75l-2.66-2.66a1 1 0 0 0-1.41 1.41L3 13.5v5a2 2 0 0 0 2 2h2"/><path d="M17 20.5h2a2 2 0 0 0 2-2v-5l4.07-4.07a1 1 0 0 0 0-1.42Z"/></svg>;
const DumbbellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.4 14.4-4.8-4.8"/><path d="M6 12 12 6"/><path d="M14.4 14.4 12 16.8l-4.8-4.8 2.4-2.4"/><path d="m16.8 12-4.8-4.8 2.4-2.4 4.8 4.8z"/><path d="m18 15.6 2.4-2.4"/><path d="m3.6 8.4 2.4-2.4"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LaptopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>;

// Stage Prep Features
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14h6"/><path d="M9 10h6"/></svg>;
const UtensilsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
const FigureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 10v12"/><path d="M12 14c2.5 0 5-1.5 6-3.5"/><path d="M12 14c-2.5 0-5-1.5-6-3.5"/><path d="M12 4c2.5 0 5 1.5 6 3.5"/><path d="M12 4c-2.5 0-5 1.5-6 3.5"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;

// Footer Features
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const UserCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>;
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const AwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;

const getIcon = (type: string) => {
  switch (type) {
    case 'body': return <BodyIcon />;
    case 'dumbbell': return <DumbbellIcon />;
    case 'user': return <UserIcon />;
    case 'laptop': return <LaptopIcon />;
    case 'clipboard': return <ClipboardIcon />;
    case 'utensils': return <UtensilsIcon />;
    case 'figure': return <FigureIcon />;
    case 'calendar': return <CalendarIcon />;
    case 'target': return <TargetIcon />;
    case 'user-check': return <UserCheckIcon />;
    case 'bar-chart': return <BarChartIcon />;
    case 'message': return <MessageIcon />;
    case 'award': return <AwardIcon />;
    default: return <UserIcon />;
  }
};

export function Programs() {
  const [sectionData, setSectionData] = useState<any>(null);
  const [programsList, setProgramsList] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [secRes, progRes, highRes] = await Promise.all([
          api.get('/program-section'),
          api.get('/programs'),
          api.get('/program-highlights')
        ]);
        
        if (secRes.ok) {
          const d = await secRes.json();
          setSectionData(d.data?.find((s: any) => s.status === 'ACTIVE') || null);
        }
        if (progRes.ok) {
          const d = await progRes.json();
          setProgramsList(d.data || []);
        }
        if (highRes.ok) {
          const d = await highRes.json();
          setHighlights(d.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const fadeUp: Variants = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const featuredProgram = programsList.find(p => p.isFeatured && p.status === 'ACTIVE');
  const regularPrograms = programsList.filter(p => !p.isFeatured && p.status === 'ACTIVE').sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  const activeHighlights = highlights.filter(h => h.status === 'ACTIVE').sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

  return (
    <section ref={sectionRef} id="programs" className="bg-[#050505] relative overflow-hidden py-12 md:py-16 min-h-[600px]">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !sectionData ? null : (
        <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* Header Block */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-[#333]"></div>
            <span className="text-primary font-black text-xs md:text-sm lg:text-base tracking-[0.2em] uppercase">
              {sectionData.badge}
            </span>
            <div className="w-12 h-[1px] bg-[#333]"></div>
          </div>
          
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] uppercase tracking-tight mb-6 text-white">
            {(() => {
              const title = sectionData.title || "";
              const parts = title.split('.');
              if (parts.length >= 2 && parts[0] && parts[1]) {
                const firstLine = parts[0] + '.';
                const secondLine = parts.slice(1).join('.').trim();
                const words = secondLine.split(' ');
                
                if (words.length >= 2) {
                  const normalWords = words.slice(0, words.length - 2).join(' ');
                  const highlightWords = words.slice(words.length - 2).join(' ');
                  return (
                    <>
                      <div className="text-gray-200 drop-shadow-md">{firstLine}</div>
                      <div>
                        <span className="text-gray-200 drop-shadow-md">{normalWords} </span>
                        <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">{highlightWords}</span>
                      </div>
                    </>
                  );
                }
              }
              return <span className="text-gray-200">{title}</span>;
            })()}
          </h2>
          
          <p className="text-[#8ba3b8] font-medium max-w-3xl mx-auto text-base md:text-lg leading-relaxed whitespace-pre-wrap">
            {sectionData.description}
          </p>
        </motion.div>

        {/* 4-Card Grid Block */}
        {regularPrograms.length > 0 && (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {regularPrograms.map((card) => (
              <motion.div 
                key={card.id}
                variants={itemVariants}
                className="bg-[#0a0a0a] border border-primary/40 rounded-xl overflow-hidden flex flex-col group hover:border-primary transition-colors duration-500"
              >
                <div className="relative h-[320px] w-full overflow-hidden">
                  <img src={fixImageUrl(card.image) || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop'} alt={card.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]"></div>
                  
                  {/* Bordered Primary Icon Circle (Solid on Hover) */}
                  <div className="absolute top-6 left-6 w-12 h-12 rounded-full border-2 border-primary text-primary flex items-center justify-center bg-transparent group-hover:bg-primary group-hover:text-black transition-colors duration-500 shadow-lg">
                    <div className="-rotate-45">
                      {getIcon(card.icon)}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex-1 flex flex-col pt-0 z-10 -mt-6">
                  <h3 className="font-black text-3xl tracking-tighter uppercase leading-none mb-4">
                    {(() => {
                      const title = card.title || "";
                      const parts = title.trim().split(' ');
                      if (parts.length > 1) {
                        const lastWord = parts.pop();
                        return (
                          <>
                            <span className="text-white">{parts.join(' ')}</span>
                            <br />
                            <span className="text-primary">{lastWord}</span>
                          </>
                        );
                      }
                      return <span className="text-white">{title}</span>;
                    })()}
                  </h3>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed flex-1">
                    {card.shortDescription}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Wide Competition Prep Card Block (Featured Program) */}
        {featuredProgram && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="bg-[#0a0a0a] border border-zinc-800/60 hover:border-primary/50 transition-colors duration-500 rounded-xl overflow-hidden flex flex-col lg:flex-row mb-8 group"
          >
            {/* Left Image */}
            <div className="relative w-full lg:w-[40%] h-64 lg:h-auto">
              <img src={fixImageUrl(featuredProgram.image) || 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1200&auto=format&fit=crop'} alt={featuredProgram.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] hidden lg:block"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] block lg:hidden"></div>
              
              {/* Bordered Primary Icon Circle (Solid on Hover) */}
              <div className="absolute top-6 left-6 w-12 h-12 rounded-full border-2 border-primary text-primary flex items-center justify-center bg-transparent group-hover:bg-primary group-hover:text-black transition-colors duration-500 shadow-lg">
                <div className="-rotate-45">
                  {getIcon(featuredProgram.icon)}
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-[60%] p-8 lg:p-12 flex flex-col justify-center relative z-10 lg:-ml-12">
              <h3 className="font-black text-3xl md:text-4xl tracking-tighter uppercase mb-4 text-white drop-shadow-md">
                {(() => {
                  const title = featuredProgram.title || "";
                  if (title.includes('/')) {
                    const [first, ...rest] = title.split('/');
                    return (
                      <>
                        <span>{first.trim()} / </span>
                        <span className="text-primary">{rest.join('/').trim()}</span>
                      </>
                    );
                  }
                  return title;
                })()}
              </h3>
              <p className="text-zinc-300 text-[15px] md:text-base font-medium leading-relaxed max-w-2xl mb-8">
                {featuredProgram.shortDescription}
              </p>
              
              {/* Featured Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((num) => {
                  const title = featuredProgram[`featuredItem${num}Title`];
                  const icon = featuredProgram[`featuredItem${num}Icon`];
                  if (!title && !icon) return null;
                  
                  return (
                    <div key={num} className="flex items-center gap-3 group/item cursor-default">
                      <div className="w-8 h-8 rounded border border-primary bg-black/40 flex items-center justify-center text-primary group-hover/item:bg-primary/10 transition-colors duration-300 shrink-0 shadow-[0_0_10px_rgba(var(--primary-rgb),0.15)]">
                        {icon && getLucideIcon(icon)}
                      </div>
                      <span className="text-white font-bold text-[10px] tracking-widest uppercase leading-tight group-hover/item:text-primary transition-colors max-w-[80px]">
                        {title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom Features Strip Block */}
        {activeHighlights.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="bg-[#0a0a0a] border border-zinc-800/60 rounded-xl p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {activeHighlights.map((feat) => (
                <div key={feat.id} className="flex flex-col md:flex-row lg:flex-col xl:flex-row items-center lg:items-start xl:items-center gap-4 group cursor-pointer text-center md:text-left lg:text-center xl:text-left">
                  <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary bg-transparent group-hover:bg-primary/10 transition-colors duration-300 shrink-0 shadow-[0_0_10px_rgba(var(--primary-rgb),0.15)]">
                    {getIcon(feat.icon)}
                  </div>
                  <div>
                    <h4 className="text-white font-black text-xs tracking-widest uppercase mb-1.5 group-hover:text-primary transition-colors">{feat.title}</h4>
                    <p className="text-zinc-400 text-[11px] font-medium leading-relaxed max-w-[180px] mx-auto xl:mx-0">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      )}
    </section>
  );
}
