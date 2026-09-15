"use client";

import React, { useRef, useEffect, useState } from "react";
import { homeData } from "@/data/dummy";
import { api } from "@/services/api";
import { fixImageUrl } from "@/lib/apiConfig";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface TeamSection {
  badge: string;
  title: string;
  description: string;
}

export function Trainers() {
  const { trainers } = homeData; // Fallback data for members
  const [teamSection, setTeamSection] = useState<TeamSection | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10%" });

  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionRes, membersRes] = await Promise.all([
          api.get('/team-section?public=true'),
          api.get('/team-members?public=true')
        ]);
        
        if (sectionRes.ok) {
          const sectionData = await sectionRes.json();
          const items = sectionData.success ? sectionData.data : sectionData;
          if (Array.isArray(items) && items.length > 0) {
            setTeamSection(items[0]);
          }
        }

        if (membersRes.ok) {
          const membersData = await membersRes.json();
          const items = membersData.success ? membersData.data : membersData;
          if (Array.isArray(items)) {
            const sortedItems = [...items].sort((a: any, b: any) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
            setTeamMembers(sortedItems);
          }
        }
      } catch (error) {
        console.error("Failed to fetch Trainers data:", error);
      }
    };
    fetchData();
  }, []);

  const easePremium = [0.16, 1, 0.3, 1] as const;

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: easePremium } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2 + custom * 0.1, ease: easePremium }
    })
  };

  // Determine display text (either from API or fallback to dummy)
  const displayBadge = teamSection?.badge || trainers.badge;
  const displayTitle = teamSection?.title || `${trainers.headingLine1} ${trainers.headingLine2}`;
  const displayDesc = teamSection?.description || trainers.description;
  
  // Use API members if available, otherwise fallback to dummy items
  const displayMembers = teamMembers.length > 0 ? teamMembers : trainers.items;

  return (
    <section ref={sectionRef} id="trainers" className="py-20 md:py-32 bg-[#0a0a0c] relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
      />
      
      <div className="container mx-auto px-4 md:px-12 relative z-10 max-w-[1400px]">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-8 bg-primary/50" />
            <span className="text-primary font-bold text-xs md:text-sm lg:text-base tracking-[0.2em] uppercase">
              {displayBadge}
            </span>
            <div className="h-px w-8 bg-primary/50" />
          </motion.div>
          
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-black leading-tight uppercase tracking-tight drop-shadow-lg mb-6"
          >
            {displayTitle.split(/\.\s+/).map((sentence: string, idx: number, arr: string[]) => (
              <span key={idx} className={`block ${idx % 2 === 0 ? 'text-white' : 'text-primary'}`}>
                {sentence}{idx < arr.length - 1 ? '.' : ''}
              </span>
            ))}
          </motion.h2>
          
          <motion.p
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-zinc-400 text-base md:text-lg font-medium leading-relaxed whitespace-pre-line"
          >
            {displayDesc}
          </motion.p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {displayMembers.map((trainer, index) => {
            // Adapt API properties to match Dummy structure where necessary
            const trainerImage = fixImageUrl(trainer.image);
            const trainerName = trainer.name;
            const trainerCategory = trainer.category || trainer.specialty; // specialty is dummy property
            const trainerRole = trainer.specialization || trainer.role; // role is dummy property
            const trainerDesc = trainer.description;
            
            // Social handling
            const instaUrl = trainer.instagramUrl || trainer.socials?.instagram;
            // Explicitly handling facebook instead of linkedin/twitter for dynamic ones
            const facebookUrl = trainer.facebookUrl;
            
            return (
              <motion.div
                key={trainer.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-colors duration-500"
              >
                {/* Card Image */}
                <div className="relative h-[320px] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent z-10" />
                  <motion.img
                    src={trainerImage}
                    alt={trainerName}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 ease-[0.16,1,0.3,1]"
                  />
                  
                  {/* Category Badge over the image */}
                  <div className="absolute bottom-5 left-6 z-20">
                    <span className="inline-block px-3 py-1.5 bg-black/40 backdrop-blur-md text-primary border border-primary/30 text-xs font-bold tracking-wider rounded-md shadow-lg">
                      {trainerCategory}
                    </span>
                  </div>
                  
                  {/* Social Links on Hover */}
                  <div className="absolute top-6 right-6 z-20 flex flex-col gap-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[0.16,1,0.3,1]">
                    {instaUrl && (
                      <a href={instaUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </a>
                    )}
                    {facebookUrl && (
                      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      </a>
                    )}
                    {!teamMembers.length && trainer.socials?.twitter && (
                      <a href={trainer.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                      </a>
                    )}
                    {!teamMembers.length && trainer.socials?.linkedin && (
                      <a href={trainer.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="relative z-20 px-6 pb-6 pt-5">
                  <div className="mb-2">
                    <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-md bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent">
                      {trainerName}
                    </h3>
                    <p className="text-white/80 font-semibold text-sm tracking-widest mt-1">
                      {trainerRole}
                    </p>
                  </div>
                  
                  <div className="overflow-hidden mt-4">
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-4">
                      {trainerDesc}
                    </p>
                  </div>

                  {/* Decorative Line */}
                  <div className="w-full h-px bg-white/10 group-hover:bg-primary/30 transition-colors duration-500 relative">
                    <div className="absolute left-0 top-0 h-full w-0 bg-primary group-hover:w-full transition-all duration-700 ease-[0.16,1,0.3,1]" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
