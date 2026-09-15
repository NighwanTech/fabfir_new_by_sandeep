"use client";

import React, { useRef, useEffect, useState } from "react";
import { api } from "@/services/api";
import { fixImageUrl } from "@/lib/apiConfig";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";

interface HeadCoachData {
  coachName: string;
  label: string;
  subtitle: string;
  heading: string;
  description: string;
  image: string;
  badgeText: string;
  ctaText: string;
  ctaLink: string;
}

export function Coaches() {
  const [expert, setExpert] = useState<HeadCoachData | null>(null);

  useEffect(() => {
    const fetchHeadCoach = async () => {
      try {
        const response = await api.get('/head-coach?public=true');
        if (response.ok) {
          const data = await response.json();
          const rawData = data.success ? data.data : data;
          if (rawData) {
            if (Array.isArray(rawData)) {
              if (rawData.length > 0) setExpert(rawData[0]);
            } else {
              setExpert(rawData);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch head coach:", error);
      }
    };
    fetchHeadCoach();
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const yImage = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const scaleGlow = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  const isInView = useInView(sectionRef, { once: false, margin: "-15%" });

  // Premium Easing Curve
  const easePremium = [0.16, 1, 0.3, 1] as const;

  const textRevealVariants = {
    hidden: { y: "100%", opacity: 0, rotate: 2 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: { duration: 1.2, delay: custom * 0.1, ease: easePremium }
    })
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: custom * 0.1, ease: easePremium }
    })
  };

  const imageRevealVariants = {
    hidden: { scale: 1.1, opacity: 0, filter: "blur(20px)" },
    visible: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 1.5, ease: easePremium }
    }
  };

  return (
    <section ref={sectionRef} id="coaches" className="flex items-center min-h-[60vh] py-12 md:py-16 bg-[#070709] relative overflow-hidden">
      {/* Background Glow */}
      <motion.div
        style={{ scale: scaleGlow }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"
      />

      {expert && (
        <div className="container mx-auto px-4 md:px-12 relative z-10 max-w-[1400px]">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">

          {/* Left Column: Typography & Content */}
          <motion.div style={{ y: yText }} className="w-full lg:w-1/2 flex flex-col pt-10">
            {/* Name & Role */}
            <div className="mb-10 relative pl-6 md:pl-8">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 1, ease: easePremium, delay: 0.2 }}
                className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary origin-top rounded-full hidden lg:block"
              />
              <div className="overflow-hidden py-2">
                <motion.h2
                  custom={1}
                  variants={textRevealVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="font-heading text-4xl md:text-5xl lg:text-[4.5rem] font-black text-white leading-[0.9] uppercase tracking-tighter drop-shadow-lg"
                >
                  {expert.coachName}
                </motion.h2>
              </div>
              <div className="overflow-hidden mt-3">
                <motion.p
                  custom={2}
                  variants={textRevealVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="text-primary font-bold uppercase text-xs md:text-sm lg:text-base tracking-[0.2em]"
                >
                  {expert.label} • {expert.subtitle}
                </motion.p>
              </div>
            </div>

            {/* Catchy Text */}
            <div className="mb-6">
              {expert.heading?.split(/\.\s+/).map((sentence: string, idx: number, arr: string[]) => (
                <div key={idx} className="overflow-hidden py-1">
                  <motion.h3
                    custom={3 + idx}
                    variants={textRevealVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className={`font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight uppercase ${
                      idx % 2 === 0 ? 'text-white/95' : 'text-primary'
                    }`}
                  >
                    {sentence}{idx < arr.length - 1 ? '.' : ''}
                  </motion.h3>
                </div>
              ))}
            </div>

            {/* Description */}
            <motion.p
              custom={6}
              variants={fadeUpVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="text-zinc-400 text-base md:text-lg font-medium leading-relaxed max-w-xl mb-10"
            >
              {expert.description}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              custom={7}
              variants={fadeUpVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Link
                href={expert.ctaLink || "/assessment"}
                target="_blank"
                className="inline-flex items-center justify-center bg-primary text-black font-black text-base md:text-lg px-8 py-4 md:px-10 md:py-5 rounded-sm uppercase tracking-widest transition-all duration-500 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] relative overflow-hidden group"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">{expert.ctaText}</span>
                <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Image & Credentials */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-end relative mt-16 lg:mt-0 lg:h-[700px]">

            {/* Image Container for Cutout */}
            <div className="relative w-full max-w-[600px] flex justify-center items-end h-full z-20">

              <motion.div
                style={{ y: yImage }}
                className="w-full h-auto flex justify-center"
              >
                <motion.img
                  variants={imageRevealVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  src={fixImageUrl(expert.image)}
                  alt={expert.coachName}
                  className="w-auto h-auto max-h-[600px] lg:max-h-[750px] object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                />
              </motion.div>

            </div>

            {/* Decorative Accent (Behind Image) */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/40 rounded-full blur-[80px] z-10"
            />

            {/* Bottom Credentials */}
            {expert.badgeText && (
              <motion.div
                custom={8}
                variants={fadeUpVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative z-30 -mt-8 lg:-mt-12 text-center bg-[#070709]/90 backdrop-blur-xl px-10 py-5 rounded-full border border-primary/40 shadow-[0_15px_40px_rgba(var(--primary-rgb),0.3)]"
              >
                <p className="text-primary font-black text-sm md:text-base lg:text-lg tracking-widest">
                  {expert.badgeText}
                </p>
              </motion.div>
            )}
          </div>

        </div>
      </div>
      )}
    </section>
  );
}
