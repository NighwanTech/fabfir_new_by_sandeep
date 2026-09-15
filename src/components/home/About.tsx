"use client";

import { useState, useEffect } from "react";
import { homeData } from "@/data/dummy";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/services/api";
import { fixImageUrl } from "@/lib/apiConfig";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 1, ease: "easeOut" as const }
  },
};

interface AboutData {
  badge: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  checklist: string[];
  images: string[];
}

export function About() {
  const [data, setData] = useState<AboutData>({
    badge: homeData.intro?.badge || "ABOUT US",
    headingLine1: homeData.intro?.headingLine1 || "BUILD ON PASSION",
    headingLine2: homeData.intro?.headingLine2 || "DRIVEN BY RESULTS",
    description: homeData.intro?.description || "We're more than just a training facility.",
    checklist: homeData.intro?.checklist || [],
    images: homeData.intro?.images || ["/fabfit.jpeg", "/coach-dhiraj.png"]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await api.get('/about/active');
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data) {
            setData(resData.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch about section data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAboutData();
  }, []);

  return (
    <section id="about" className="py-12 md:py-16 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
          >
            {data.badge && (
              <motion.div variants={itemVariants} className="text-[#d4af37] text-[13px] font-black tracking-widest uppercase mb-6">
                {data.badge}
              </motion.div>
            )}
            
            <motion.h2 variants={itemVariants} className="font-heading text-5xl md:text-6xl lg:text-[72px] font-black text-white leading-[0.95] tracking-tight uppercase mb-8 whitespace-pre-line">
              {data.headingLine1}
              {data.headingLine2 && (
                <>
                  <br />
                  <span className="text-[#d4af37]">{data.headingLine2}</span>
                </>
              )}
            </motion.h2>
            
            {data.description && (
              <motion.p variants={itemVariants} className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl font-medium whitespace-pre-line">
                {data.description}
              </motion.p>
            )}

            {/* Checklist */}
            {data.checklist && data.checklist.length > 0 && (
              <motion.ul variants={containerVariants} className="space-y-4 mb-12">
                {data.checklist.map((item, i) => (
                  <motion.li variants={itemVariants} key={i} className="flex items-center gap-4 text-white text-lg font-bold">
                    <div className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-[#d4af37] text-black">
                      <Check className="w-4 h-4 stroke-[4]" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>

          {/* Right Images (Dynamic Grid) */}
          <motion.div 
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Dotted Pattern Background */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              transition={{ duration: 1.5 }}
              className="absolute -top-10 -right-10 w-40 h-40 text-[#d4af37] pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(currentColor 2px, transparent 2px)', backgroundSize: '20px 20px' }} 
            />
            
            {(() => {
              const activeImages = data.images && data.images.length > 0 ? data.images : ["/fabfit.jpeg", "/coach-dhiraj.png"];
              return (
                <div className={`relative grid gap-4 h-[600px] z-10 ${activeImages.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Main Image */}
                  <motion.div variants={imageVariants} className="col-span-1 h-full rounded-2xl overflow-hidden relative group shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/5">
                    <div className="absolute inset-0 bg-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                    <img 
                      src={fixImageUrl(activeImages[0])} 
                      alt="About visual 1" 
                      className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                    />
                  </motion.div>
                  
                  {/* Right column stacked images (only if 2 or more images) */}
                  {activeImages.length >= 2 && (
                    <div className="col-span-1 flex flex-col gap-4 h-full">
                      <motion.div variants={imageVariants} className={`rounded-2xl overflow-hidden relative group shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/5 ${activeImages.length === 2 ? 'h-full' : 'flex-1'}`}>
                        <div className="absolute inset-0 bg-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <img 
                          src={fixImageUrl(activeImages[1])} 
                          alt="About visual 2" 
                          className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                        />
                      </motion.div>
                      
                      {activeImages.length >= 3 && (
                        <motion.div variants={imageVariants} className="flex-1 rounded-2xl overflow-hidden relative group shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/5">
                          <div className="absolute inset-0 bg-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                          <img 
                            src={fixImageUrl(activeImages[2])} 
                            alt="About visual 3" 
                            className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                          />
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
