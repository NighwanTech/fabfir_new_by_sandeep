"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle2, Clock, Calendar, BarChart, Dumbbell, Target, Sparkles, Activity, ArrowRight, HeartPulse, PersonStanding, Utensils, MonitorSmartphone, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import { fixImageUrl } from "@/lib/apiConfig";

const IconMap: Record<string, React.ElementType> = {
  Dumbbell,
  Target,
  Sparkles,
  Activity,
  HeartPulse,
  PersonStanding,
  Utensils,
  MonitorSmartphone
};

function ServiceDetailContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("id");
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${slug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setService(data.data);
            return;
          }
        }
        
        // Fallback to dummy data if not found in DB
        const dummyMod = await import("@/data/dummy");
        const homeData = dummyMod.homeData;
        const dummyService = homeData.services.items.find((item: any) => item.id.toString() === slug || item.slug === slug);
        
        if (dummyService) {
          setService({
            title: dummyService.title,
            slug: dummyService.id.toString(),
            badge: "Premium Program",
            shortDescription: dummyService.description,
            description: "Our program is designed for anyone looking to build muscle, get stronger and improve overall fitness. Whether you are a beginner or an experienced athlete, our certified trainers will guide you with a personalized approach.",
            heroImage: dummyService.image,
            cardImage: dummyService.image,
            duration: "8 - 12 Weeks",
            sessions: "3 - 5 Per Week",
            level: "All Levels",
            equipment: "Gym Equipment",
            
            features: [
              { title: "Strength Building", description: "Progressive training to build lean muscle and improve strength.", icon: "Dumbbell" },
              { title: "Proper Technique", description: "Learn correct form to maximize results and prevent injuries.", icon: "Target" },
              { title: "Personalized Plan", description: "Customized workout plans based on your goals and fitness level.", icon: "Sparkles" },
              { title: "Progress Tracking", description: "Track progress and celebrate every small win.", icon: "Activity" }
            ],

            methodologyDescription: "Transform your body with our science-backed approach. Designed by industry experts to push your limits and maximize your true potential.",
            
            items: [
              { title: "Increase muscle mass and strength", icon: "CheckCircle2" },
              { title: "Improve posture and body composition", icon: "CheckCircle2" },
              { title: "Boost confidence and energy levels", icon: "CheckCircle2" },
              { title: "Safe and effective training methods", icon: "CheckCircle2" }
            ],

            ctaPrimaryText: "Get Started",
            ctaPrimaryLink: "/assessment",
            ctaSecondaryText: "Book a Free Session",
            ctaSecondaryLink: "/#contact",

            ctaBadge: "Take The Next Step",
            ctaTitle: "Ready to Get Stronger?",
            ctaDescription: "Join our program today and start your journey towards a stronger, healthier you with elite coaching.",
            ctaButtonText: "Join Now",
            ctaButtonLink: "/assessment",
            ctaImage: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=800&auto=format&fit=crop"
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching service detail:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#020202] min-h-screen flex flex-col items-center justify-center text-[#d4af37]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-heading tracking-[0.2em] uppercase font-bold text-sm">Loading Service...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="bg-[#020202] min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="font-heading text-4xl md:text-6xl font-black mb-4">404</h1>
        <p className="text-zinc-400 mb-8 uppercase tracking-widest text-sm">Service Not Found</p>
        <Link href="/#services" className="px-6 py-3 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors rounded font-bold text-sm tracking-widest uppercase">
          Back to Services
        </Link>
      </div>
    );
  }

  // Aggregate features safely (max 4 on public UI)
  let features = [];
  if (Array.isArray(service.features)) {
    features = service.features.slice(0, 4).map((f: any) => ({
      title: f.title,
      desc: f.description,
      iconName: f.icon
    }));
  }

  // Aggregate benefits safely (max 4 on public UI)
  let benefits = [];
  if (Array.isArray(service.items)) {
    benefits = service.items.slice(0, 4).map((i: any) => ({
      title: i.title,
      iconName: i.icon
    }));
  }

  const metrics = [
    { icon: Clock, title: "DURATION", value: service.duration || "N/A" },
    { icon: Calendar, title: "SESSIONS", value: service.sessions || "N/A" },
    { icon: BarChart, title: "LEVEL", value: service.level || "N/A" },
    { icon: Dumbbell, title: "EQUIPMENT", value: service.equipment || "N/A" }
  ];

  return (
    <div className="bg-[#020202] min-h-screen text-white pt-10 pb-0 selection:bg-[#d4af37] selection:text-black">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#d4af37]/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 md:px-8 mb-8 relative z-10">
        <div className="flex items-center text-[11px] text-zinc-500 gap-3 font-semibold tracking-widest uppercase">
          <Link href="/" className="hover:text-[#d4af37] transition-colors duration-300">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <Link href="/#services" className="hover:text-[#d4af37] transition-colors duration-300">Services</Link>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <span className="text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">{service.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative border-b border-white/5 pb-20">
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center pt-8">
          
          {/* Hero Content */}
          <div className="w-full lg:w-1/2 lg:pr-16 z-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-[1px] w-8 bg-[#d4af37]"></span>
              <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase">{service.badge}</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-[#d4af37] leading-[1.1] uppercase mb-6 tracking-tighter drop-shadow-sm">
              {service.title}
            </h1>
            <p className="text-lg md:text-xl font-medium text-white/90 mb-6 max-w-lg leading-snug drop-shadow-md">
              {service.shortDescription}
            </p>
            <p className="text-zinc-300 text-sm mb-10 max-w-md leading-relaxed font-medium whitespace-pre-line">
              {service.description}
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              {service.ctaPrimaryText && service.ctaPrimaryLink && (
                <Link 
                  href={service.ctaPrimaryLink} 
                  className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-black tracking-widest text-black uppercase bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] overflow-hidden rounded transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  <span className="relative flex items-center gap-2">
                    {service.ctaPrimaryText} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              )}
              
              {service.ctaSecondaryText && service.ctaSecondaryLink && (
                <Link 
                  href={service.ctaSecondaryLink} 
                  className="group inline-flex items-center justify-center px-6 py-3 text-sm font-bold tracking-widest text-white uppercase border border-white/20 rounded transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]/5"
                >
                  {service.ctaSecondaryText}
                </Link>
              )}
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 relative h-[350px] md:h-[450px] lg:h-[500px] group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-1000"></div>
            
            <div className="relative w-full h-full overflow-hidden rounded-2xl md:rounded-[30px] border border-white/5 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-transparent z-10 hidden lg:block opacity-70"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent z-10 opacity-70"></div>
              <img 
                src={fixImageUrl(service.heroImage || 'https://via.placeholder.com/800')} 
                alt={service.title} 
                className="w-full h-full object-cover grayscale-[20%] contrast-110 transition-transform duration-[20s] group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <section className="container mx-auto px-4 md:px-8 relative z-30 -mt-12 md:-mt-16 mb-16">
        <div className="bg-[#050505]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 flex flex-wrap justify-center lg:justify-between items-center gap-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] w-full">
          {metrics.map((metric, i) => (
            <div key={i} className="flex items-center gap-4 min-w-[160px] group cursor-default">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#d4af37] bg-white/5 transition-all duration-500 group-hover:border-[#d4af37]/50 group-hover:bg-[#d4af37]/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <metric.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-[#d4af37] transition-colors">{metric.title}</div>
                <div className="text-white text-base md:text-lg font-black tracking-wide">{metric.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's Included Section */}
      {features.length > 0 && (
        <section className="py-20 container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase mb-4">Program Features</span>
            <h2 className="font-heading text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#d4af37] uppercase tracking-tighter mb-6">
              WHAT'S INCLUDED
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item: any, index: number) => {
              const IconComp = item.iconName ? IconMap[item.iconName] || Activity : Activity;
              return (
                <div key={index} className="group relative bg-[#080808] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:border-[#d4af37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center text-[#d4af37] mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="relative z-10 text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300 group-hover:from-[#d4af37] group-hover:to-[#f3e5ab] transition-all duration-500 mb-3 tracking-wide">{item.title}</h3>
                  <p className="relative z-10 text-zinc-400 text-sm leading-relaxed font-medium group-hover:text-zinc-300 transition-colors">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* About This Program */}
      {(service.methodologyDescription || benefits.length > 0) && (
        <section className="py-20 container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center max-w-6xl mx-auto">
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute -inset-4 border border-[#d4af37]/20 rounded-[2rem] transform -rotate-3 transition-transform duration-700 group-hover:rotate-0"></div>
              <div className="relative w-full h-[320px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[#d4af37]/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img 
                  src={fixImageUrl(service.cardImage || service.heroImage)} 
                  alt="About Training" 
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">The Methodology</span>
              <h2 className="font-heading text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#d4af37] uppercase tracking-tight mb-6 leading-tight">
                ABOUT THIS PROGRAM
              </h2>
              
              {service.methodologyDescription && (
                <p className="text-zinc-300 text-base leading-relaxed mb-8 font-medium whitespace-pre-line">
                  {service.methodologyDescription}
                </p>
              )}
              
              {benefits.length > 0 && (
                <ul className="space-y-4">
                  {benefits.map((benefit: any, i: number) => (
                    <li key={i} className="flex items-center gap-4 text-zinc-200 text-base font-medium group">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#d4af37]/10 group-hover:bg-[#d4af37] transition-colors duration-300 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37] group-hover:text-black transition-colors duration-300" />
                      </div>
                      <span className="group-hover:text-white transition-colors duration-300">{benefit.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Premium CTA Section */}
      {(service.ctaTitle || service.ctaBadge || service.ctaButtonText || service.ctaImage) && (
        <section className="container mx-auto px-4 md:px-8 pb-24 mt-12 relative z-10">
          <div className="relative rounded-3xl overflow-hidden bg-[#050505] border border-white/5 flex flex-col lg:flex-row lg:h-[340px] shadow-[0_0_40px_rgba(0,0,0,0.8)] group hover:border-[#d4af37]/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-all duration-700 max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 pointer-events-none"></div>
            
            <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col justify-center relative z-10">
              {service.ctaBadge && (
                <span className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase mb-3 block">
                  {service.ctaBadge}
                </span>
              )}
              {service.ctaTitle && (
                <h2 className="font-heading text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-white mb-4 uppercase tracking-tight leading-tight drop-shadow-sm line-clamp-2">
                  {service.ctaTitle}
                </h2>
              )}
              {service.ctaDescription && (
                <p className="text-zinc-400 mb-6 max-w-sm text-sm leading-relaxed font-medium line-clamp-2">
                  {service.ctaDescription}
                </p>
              )}
              
              {service.ctaButtonText && service.ctaButtonLink && (
                <div>
                  <Link 
                    href={service.ctaButtonLink} 
                    className="inline-flex items-center justify-center gap-2 bg-white text-black text-xs font-black uppercase tracking-widest px-6 py-3 rounded hover:bg-[#d4af37] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:-translate-y-1"
                  >
                    {service.ctaButtonText} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
            
            <div className="w-full lg:w-1/2 h-[250px] lg:h-full relative z-10 overflow-hidden">
               <div className="absolute top-0 left-[-40px] w-[80px] h-[120%] -top-[10%] bg-[#050505] transform skew-x-12 z-20 hidden lg:block"></div>
               
               <img 
                src={fixImageUrl(service.ctaImage || "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=800&auto=format&fit=crop")} 
                alt={service.ctaTitle || "CTA Image"} 
                className="object-cover h-full w-full opacity-80 grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000" 
                style={{ objectPosition: 'center center' }}
              />
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

export default function ServiceDetailPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#020202] min-h-screen flex flex-col items-center justify-center text-[#d4af37]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-heading tracking-[0.2em] uppercase font-bold text-sm">Loading...</p>
      </div>
    }>
      <ServiceDetailContent />
    </Suspense>
  );
}
