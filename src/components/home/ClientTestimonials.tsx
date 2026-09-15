"use client";

import React, { useRef, useState, useEffect } from "react";
import { homeData } from "@/data/dummy";
import { motion, useInView, Variants } from "framer-motion";
import { api } from "@/services/api";
import { fixImageUrl } from "@/lib/apiConfig";
import { FITNESS_ICONS } from "@/components/ui/IconSelect";

// Custom SVG Icons
const QuoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>;

const BicepIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20.2 11.5c-1-1.3-3.6-2.5-6.2-2.5V3c0-.6-.4-1-1-1H9C8.4 2 8 2.4 8 3v4c0 1.1-.9 2-2 2H4c-1.1 0-2 .9-2 2v2c0 3.3 2.7 6 6 6h1.4c.5 1.7 2.1 3 4.1 3 2.5 0 4.5-2 4.5-4.5 0-1.2-.5-2.3-1.3-3.1.5-.7 1.5-1.9 1.5-2.9 0-.3 0-.6-.1-.9z"/><path d="M12 9v4"/><path d="M16 13h-4"/></svg>;
const FlameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const LightningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const TimerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ArrowDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const DumbbellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.4 14.4l-4.8-4.8"/><path d="M22.5 1.5l-6 6"/><path d="M1.5 22.5l6-6"/><path d="M6 10l-4-4 2-2 4 4"/><path d="M18 14l4 4-2 2-4-4"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;

const getIcon = (iconName: string) => {
  const selectedIcon = FITNESS_ICONS.find(i => i.id === iconName);
  if (selectedIcon) {
    const IconComponent = selectedIcon.icon;
    return <IconComponent size={24} className="text-primary" />;
  }

  switch (iconName) {
    case 'arrowDown': return <ArrowDownIcon />;
    case 'bicep': return <BicepIcon />;
    case 'flame': return <FlameIcon />;
    case 'trophy': return <TrophyIcon />;
    case 'calendar': return <CalendarIcon />;
    case 'lightning': return <LightningIcon />;
    case 'timer': return <TimerIcon />;
    case 'chart': return <ChartIcon />;
    case 'star': return <StarIcon />;
    case 'users': return <UsersIcon />;
    case 'shield': return <ShieldIcon />;
    case 'dumbbell': return <DumbbellIcon />;
    case 'checkCircle': return <CheckCircleIcon />;
    case 'heart': return <HeartIcon />;
    default: return <StarIcon />;
  }
};

// Convert flat API testimonial to the card format the UI expects
const toReviewCard = (t: any) => ({
  id: t.id,
  name: t.name,
  role: t.profession,
  quote: t.quote,
  image: t.image || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop',
  stats: [
    t.stat1Value && { value: t.stat1Value, label: t.stat1Label || '', icon: t.stat1Icon || 'arrowDown' },
    t.stat2Value && { value: t.stat2Value, label: t.stat2Label || '', icon: t.stat2Icon || 'bicep' },
    t.stat3Value && { value: t.stat3Value, label: t.stat3Label || '', icon: t.stat3Icon || 'star' },
  ].filter(Boolean),
});

export function ClientTestimonials() {
  const { clientTestimonials } = homeData;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10%" });

  // Live data from API; falls back to dummy while loading
  const [reviews, setReviews] = useState<any[]>(clientTestimonials.reviews);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials?status=ACTIVE');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.length > 0) {
            const sortedData = [...data.data].sort((a: any, b: any) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
            setReviews(sortedData.map(toReviewCard));
          }
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      }
    };
    fetchTestimonials();
  }, []);

  const easePremium = [0.16, 1, 0.3, 1] as const;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easePremium } }
  };

  const staggerCards: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.97, filter: "blur(4px)" },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1, delay: custom * 0.15, ease: easePremium }
    })
  };

  return (
    <section ref={sectionRef} id="client-testimonials" className="bg-[#050505] relative overflow-hidden flex flex-col py-12 md:py-16">
      
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 lg:w-1/3 h-full z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050505] z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10"></div>
        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop" alt="Background Texture" className="w-full h-full object-cover object-right grayscale" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[1400px]">
        
        {/* Header Section */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-primary/40"></div>
            <span className="text-primary font-bold text-[10px] tracking-widest uppercase">
              {clientTestimonials.badge}
            </span>
            <div className="w-12 h-[1px] bg-primary/40"></div>
          </div>
          
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black leading-tight uppercase tracking-tighter mb-4">
            <span className="text-white">{clientTestimonials.headingLine1} </span>
            <span className="text-primary">{clientTestimonials.headingLine2}</span>
          </h2>
          
          <p className="text-zinc-400 text-sm md:text-base font-medium max-w-lg">
            {clientTestimonials.subHeader.split('. ').map((part, i, arr) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? <span className="text-primary">{part}</span> : <span>{part}. </span>}
              </React.Fragment>
            ))}
          </p>
        </motion.div>

        {/* Reviews List */}
        <div className="flex flex-col gap-4 mb-4">
          {reviews.map((review: any, index: number) => (
            <motion.div
              key={review.id}
              custom={index}
              variants={staggerCards}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              className="w-full bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl flex flex-col lg:flex-row overflow-hidden group hover:border-primary/30 transition-colors duration-500"
            >
              
              {/* Left: Client Image */}
              <div className="w-full lg:w-[220px] h-[220px] lg:h-auto shrink-0 relative overflow-hidden">
                <img src={fixImageUrl(review.image)} alt={review.name} className="w-full h-full object-cover object-center grayscale-[20%] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
              </div>

              {/* Middle: Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-4 relative">
                <div className="absolute top-6 left-6 opacity-20 transform -translate-x-2 -translate-y-2 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500">
                  <QuoteIcon />
                </div>
                
                <p className="text-zinc-300 text-sm leading-relaxed font-medium pl-6 z-10 border-l-2 border-primary/20">
                  "{review.quote}"
                </p>
                
                <div className="pl-6 z-10">
                  <h4 className="text-primary font-black text-sm tracking-wider uppercase">{review.name}</h4>
                  <p className="text-zinc-500 text-xs font-medium">{review.role}</p>
                </div>
              </div>

              {/* Right: Stats Area */}
              <div className="w-full lg:w-auto flex flex-row shrink-0 items-center border-t lg:border-t-0 lg:border-l border-zinc-800/60 bg-[#080808]">
                {review.stats.map((stat: any, i: number) => (
                  <div key={i} className={`flex-1 lg:flex-none flex items-center gap-3 p-6 lg:px-8 h-full ${i !== review.stats.length - 1 ? 'border-r border-zinc-800/60' : ''}`}>
                    <div className="text-primary opacity-80">
                      {getIcon(stat.icon)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-black text-sm md:text-base leading-none mb-1">{stat.value}</span>
                      <span className="text-zinc-500 text-[9px] font-bold tracking-widest uppercase">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
