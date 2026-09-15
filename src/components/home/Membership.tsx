"use client";

import React, { useRef, useState, useEffect } from "react";
import { homeData } from "@/data/dummy";
import { motion, useInView, Variants } from "framer-motion";
import { api } from "@/services/api";
import { Activity, Dumbbell, Flame, Heart, Zap, Crosshair, Users, Trophy } from 'lucide-react';

// Reusing Icons from previous sections
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="12" y1="11" x2="12" y2="17"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const DumbbellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.4 14.4l-4.8-4.8"/><path d="M22.5 1.5l-6 6"/><path d="M1.5 22.5l6-6"/><path d="M6 10l-4-4 2-2 4 4"/><path d="M18 14l4 4-2 2-4-4"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;

const CheckIconSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1 shrink-0">
    <polyline points="20 6 9 17 4 12" />
    <circle cx="12" cy="12" r="10" strokeWidth="1.5" className="opacity-20" />
  </svg>
);

const getFooterIcon = (iconName: string) => {
  switch (iconName) {
    case 'users': return <UsersIcon />;
    case 'shield': return <ShieldIcon />;
    case 'dumbbell': return <DumbbellIcon />;
    case 'checkCircle': return <CheckCircleIcon />;
    case 'heart': return <HeartIcon />;
    default: return <StarIcon />;
  }
};

export function Membership() {
  const { membership } = homeData;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10%" });
  
  const [sectionData, setSectionData] = useState({
    badge: membership.badge,
    title: membership.headingLine1 + "." + membership.headingLine2,
    description: membership.subHeader,
  });
  
  const [plans, setPlans] = useState<any[]>(membership.plans);

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const [sectionRes, plansRes] = await Promise.all([
          api.get('/membership-section'),
          api.get('/membership-plans?status=ACTIVE')
        ]);

        if (sectionRes.ok) {
          const sectionData = await sectionRes.json();
          if (sectionData.success && sectionData.data) {
            setSectionData({
              badge: sectionData.data.badge,
              title: sectionData.data.title,
              description: sectionData.data.description,
            });
          }
        }

        if (plansRes.ok) {
          const plansData = await plansRes.json();
          if (plansData.success && plansData.data && plansData.data.length > 0) {
            const sortedPlans = [...plansData.data].sort((a: any, b: any) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
            setPlans(sortedPlans);
          }
        }
      } catch (error) {
        console.error('Error fetching membership data:', error);
      }
    };
    
    fetchMembershipData();
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
    <section ref={sectionRef} id="pricing" className="bg-[#050505] relative overflow-hidden flex flex-col py-12 md:py-16">
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 lg:w-1/3 h-full z-0 opacity-40 mix-blend-luminosity pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050505] z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10"></div>
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" alt="Background Texture" className="w-full h-full object-cover object-top" />
      </div>

      {/* Giant "07" Watermark */}
      <div className="absolute top-4 left-4 md:left-10 text-[200px] leading-none font-black text-transparent opacity-30 z-0 select-none pointer-events-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
        07
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[1200px]">
        
        {/* Header Section */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col mb-8 max-w-2xl relative z-20 pt-4"
        >
          <span className="text-primary font-bold text-[10px] tracking-widest uppercase mb-2">
            {sectionData.badge}
          </span>
          
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black leading-[0.9] uppercase tracking-tighter mb-4">
            {(() => {
              const title = sectionData.title || "";
              if (title.includes(".")) {
                const parts = title.split(".");
                const firstPart = parts[0] + ".";
                const secondPart = parts.slice(1).join(".").trim();
                if (!secondPart) return <span className="block text-white mb-1">{title}</span>;
                return (
                  <>
                    <span className="block text-white mb-1">{firstPart}</span>
                    <span className="block text-primary">{secondPart}</span>
                  </>
                );
              }
              return <span className="block text-white mb-1">{title}</span>;
            })()}
          </h2>
          
          <p className="text-zinc-400 text-sm font-medium max-w-lg leading-relaxed">
            {sectionData.description.split('full access').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i === 0 && arr.length > 1 && <span className="text-primary">full access</span>}
              </React.Fragment>
            ))}
          </p>
        </motion.div>

        {/* Pricing Cards List */}
        <div className="flex flex-col gap-4 mb-10">
          {plans.map((plan: any, index: number) => {
            const isHighlighted = plan.isPopular;
            
            return (
              <motion.div
                key={plan.id}
                custom={index}
                variants={staggerCards}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                className={`relative w-full rounded-xl flex flex-col md:flex-row overflow-hidden group bg-[#080808] border ${isHighlighted ? 'border-primary/40' : 'border-zinc-800/60'} hover:scale-[1.015] hover:border-primary/80 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)] transition-all duration-300 z-10 hover:z-30`}
              >
                {/* Animated Background Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-500 ease-out pointer-events-none"></div>

                {/* Most Popular Ribbon */}
                {isHighlighted && (
                  <div className="absolute top-0 left-0 bg-primary text-black font-black text-[9px] tracking-widest uppercase py-2 px-4 shadow-[0_5px_15px_rgba(var(--primary-rgb),0.3)] z-20 flex flex-col items-center leading-tight rounded-br-2xl">
                    <span>MOST</span>
                    <span>POPULAR</span>
                    <div className="absolute -bottom-2 right-0 w-0 h-0 border-t-[8px] border-t-primary border-r-[8px] border-r-transparent filter brightness-75"></div>
                  </div>
                )}

                {/* Left: Icon & Title */}
                <div className={`w-full md:w-[240px] p-6 md:p-8 flex items-center gap-5 border-b md:border-b-0 md:border-r border-zinc-800/60 ${isHighlighted ? 'pl-16 md:pl-10' : 'pl-6 md:pl-8'} relative overflow-hidden group-hover:border-primary/30 transition-colors duration-300`}>
                  {/* Subtle highlight behind icon */}
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className={`w-12 h-14 relative flex items-center justify-center shrink-0 text-primary opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]`}>
                    {/* Hexagon Shape */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 115" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="50,2 98,30 98,85 50,113 2,85 2,30" />
                    </svg>
                    <div className="relative z-10 scale-[0.8]">
                      {isHighlighted ? <StarIcon /> : <CalendarIcon />}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-white font-black text-lg md:text-xl tracking-tighter leading-tight uppercase group-hover:text-zinc-200 transition-colors duration-300 max-w-[200px]">
                      {plan.name}
                    </h3>
                    <p className="text-zinc-400 font-black text-xs md:text-sm tracking-widest uppercase mt-1.5 group-hover:text-primary transition-colors duration-300">
                      {plan.duration ? `${plan.duration} ` : ''}{plan.pricePeriod ? `${plan.pricePeriod} ` : ''}PLAN
                    </p>
                  </div>
                </div>

                {/* Middle: Features List */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-3 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    {plan.features.map((feature: any, i: number) => {
                      const featureTitle = typeof feature === 'string' ? feature : feature.title;
                      const featureIconName = typeof feature === 'string' ? 'check' : feature.icon;
                      
                      const renderIcon = () => {
                        const className = "text-primary mt-1 shrink-0";
                        switch (featureIconName) {
                          case 'activity': return <Activity size={12} strokeWidth={3} className={className} />;
                          case 'dumbbell': return <Dumbbell size={12} strokeWidth={3} className={className} />;
                          case 'flame': return <Flame size={12} strokeWidth={3} className={className} />;
                          case 'heart': return <Heart size={12} strokeWidth={3} className={className} />;
                          case 'zap': return <Zap size={12} strokeWidth={3} className={className} />;
                          case 'crosshair': return <Crosshair size={12} strokeWidth={3} className={className} />;
                          case 'users': return <Users size={12} strokeWidth={3} className={className} />;
                          case 'trophy': return <Trophy size={12} strokeWidth={3} className={className} />;
                          case 'check':
                          default:
                            return <CheckIconSmall />;
                        }
                      };

                      return (
                        <div 
                          key={i} 
                          className="flex items-start gap-3 cursor-default"
                        >
                          <div className="mt-0.5">
                            {renderIcon()}
                          </div>
                          <span className="text-zinc-300 text-xs md:text-sm font-bold">{featureTitle}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Price & CTA */}
                <div className="w-full md:w-[260px] p-6 md:p-8 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-zinc-800/60 bg-[#050505] relative z-10 group-hover:border-primary/30 transition-colors duration-300">
                  <div className="flex flex-col text-center">
                    <span className="text-white font-black text-3xl md:text-4xl tracking-tighter leading-none mb-2 drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                      ₹{plan.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-primary font-black text-[9px] tracking-widest uppercase">/ {plan.pricePeriod || 'MONTH'}</span>
                  </div>
                  
                  <a 
                    href={plan.enquiryLink || `https://wa.me/919220393004?text=${encodeURIComponent(`Hi Fab Fit Performance! I want to enquire about the ${plan.duration} ${plan.name} plan.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                    relative overflow-hidden px-8 py-3.5 font-black text-[10px] tracking-widest uppercase rounded flex items-center justify-center gap-2 transition-all duration-300 w-full md:w-auto
                    border border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] group-hover:bg-primary group-hover:text-black group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:!scale-105
                  `}>
                    <span className="relative z-10 flex items-center gap-2">
                      {plan.enquiryText || 'ENQUIRE'}
                      <span className="text-lg leading-none transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </span>
                  </a>
                </div>
                
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full bg-[#080808] border border-zinc-800/60 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 group hover:border-primary/30 transition-colors duration-500 mb-8"
        >
          <div className="w-10 h-12 relative flex items-center justify-center shrink-0 text-primary opacity-80">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 115" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="50,2 98,30 98,85 50,113 2,85 2,30" />
            </svg>
            <div className="relative z-10 scale-[0.7]">
              <UserIcon />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
            <div>
              <p className="text-zinc-300 text-sm font-medium mb-1">
                {membership.ptBanner.title.split('Personal training').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i === 0 && <span className="text-primary font-bold">Personal training</span>}
                  </React.Fragment>
                ))}
              </p>
              <p className="text-zinc-500 text-xs font-medium">
                {membership.ptBanner.subtitle.split('Contact for PT').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i === 0 && (
                      <a 
                        href={`https://wa.me/919220393004?text=${encodeURIComponent('Hi Fab Fit! I am interested in Personal Training. Can you share more details?')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary cursor-pointer hover:text-white transition-colors"
                      >
                        Contact for PT →
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Stats Strip (Re-implemented here) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full border-y border-zinc-800/60 py-6 px-4 md:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-4 items-center bg-[#080808]"
        >
          {membership.footerStats.map((stat: any, index: number) => (
            <div key={index} className={`flex items-center gap-3 justify-center lg:justify-start ${index !== membership.footerStats.length - 1 ? 'lg:border-r lg:border-zinc-800/60' : ''}`}>
              <div className="text-primary opacity-90 scale-90 md:scale-100">
                {getFooterIcon(stat.icon)}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-xs md:text-sm leading-none mb-1">{stat.value}</span>
                <span className="text-zinc-500 text-[8px] md:text-[9px] font-bold tracking-widest uppercase">{stat.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
