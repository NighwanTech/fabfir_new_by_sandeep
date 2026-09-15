"use client";

import { useEffect, useState, useRef } from "react";
import { homeData } from "@/data/dummy";
import { api } from "@/services/api";
import { FITNESS_ICONS } from "@/components/ui/IconSelect";
import { Activity } from "lucide-react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";

// Custom animated counter component
function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  
  // Extract the first number and the rest of the string (e.g. "500+" -> "500", "+")
  const match = value.match(/^([\d.]+)(.*)$/);
  const targetNumber = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const isDecimal = value.includes(".");

  // Removed once: true so it triggers every time it enters the viewport
  const isInView = useInView(ref, { margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2500, bounce: 0 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(targetNumber);
    } else {
      // Reset to 0 when it leaves view, so it counts up again next time!
      motionValue.set(0);
    }
  }, [isInView, motionValue, targetNumber]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = isDecimal 
          ? latest.toFixed(1) + suffix 
          : Math.floor(latest) + suffix;
      }
    });
  }, [springValue, suffix, isDecimal]);

  return <span ref={ref}>0{suffix}</span>;
}

export function Stats() {
  const [stats, setStats] = useState<any[]>(homeData.stats);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const res = await api.get('/counters');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          // Filter only ACTIVE counters
          const activeCounters = data.data.filter((c: any) => c.status === 'ACTIVE');
          if (activeCounters.length > 0) {
            setStats(activeCounters.map((c: any) => ({
              label: c.label,
              value: c.value + (c.suffix || ''),
              icon: c.icon || 'Activity'
            })));
          }
        }
      } catch (error) {
        console.error('Failed to fetch counters:', error);
      }
    };
    fetchCounters();
  }, []);

  return (
    <section className="relative bg-black border-y border-white/5 py-10 md:py-12 z-20 overflow-hidden">
      
      {/* BG Image - very subtle, darkened to match theme */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.20] contrast-125"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000&auto=format&fit=crop')" }}
      />
      {/* Dark overlay on top */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 divide-x-0 md:divide-x divide-white/10">
          {stats.map((stat, index) => {
            // Match the ID saved in the database with the FITNESS_ICONS list
            const iconObj = FITNESS_ICONS.find(i => i.id === stat.icon);
            const Icon = iconObj ? iconObj.icon : Activity;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="flex items-center justify-center gap-4 px-4"
              >
                <Icon className="w-10 h-10 text-primary stroke-[1.5]" />
                <div className="flex flex-col">
                  <span className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white leading-none mb-1">
                    <AnimatedNumber value={stat.value} />
                  </span>
                  <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase mt-1">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
