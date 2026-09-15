"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { About } from "@/components/home/About";
import { Coaches } from "@/components/home/Coaches";
import { Trainers } from "@/components/home/Trainers";
import { Services } from "@/components/home/Services";
import { Programs } from "@/components/home/Programs";
import { Transformations } from "@/components/home/Transformations";
import { ClientTestimonials } from "@/components/home/ClientTestimonials";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Membership } from "@/components/home/Membership";
import { Contact } from "@/components/home/Contact";

const USE_DYNAMIC_CMS = true; // Enabled for testing

// Map component IDs to actual React components
const componentMap: Record<string, React.ReactNode> = {
  home: <Hero key="hero" />,
  about: <About key="about" />,
  programs: <Programs key="programs" />,
  services: <Services key="services" />,
  coaches: <Coaches key="coaches" />,
  transformations: <Transformations key="transformations" />,
  membership: <Membership key="membership" />,
  gallery: <GalleryPreview key="gallery" />,
  contact: <Contact key="contact" />,
};

// Static order (fallback)
const staticOrder = [
  <Hero key="hero" />,
  <Stats key="stats" />,
  <About key="about" />,
  <Programs key="programs" />,
  <Services key="services" />,
  <Coaches key="coaches" />,
  <Trainers key="trainers" />,
  <Transformations key="transform" />,
  <ClientTestimonials key="testi" />,
  <Membership key="memb" />,
  <GalleryPreview key="gall" />,
  <Contact key="contact" />
];

export default function Home() {
  const [dynamicComponents, setDynamicComponents] = useState<React.ReactNode[] | null>(null);

  useEffect(() => {
    if (USE_DYNAMIC_CMS) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/page-structure`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const activeSections = data.data.filter((s: any) => s.isActive);
            // Always include Stats, Trainers, Testimonials in default spots or just omit them from dynamic map 
            // and let the CMS fully control the main sections. For this demo, we'll map what's available.
            const newOrder = activeSections.flatMap((s: any) => {
              if (s.sectionId === 'coaches') return [componentMap[s.sectionId], <Trainers key="trainers" />];
              if (s.sectionId === 'transformations') return [componentMap[s.sectionId], <ClientTestimonials key="testi" />];
              return componentMap[s.sectionId];
            }).filter(Boolean);
            // Re-insert unmanaged components in roughly their original places or at the top
            setDynamicComponents([
              newOrder[0], // Hero
              <Stats key="stats" />, // Always show stats after hero
              ...newOrder.slice(1)
            ]);
          }
        })
        .catch(err => console.error("Failed to load page structure:", err));
    }
  }, []);

  return (
    <main className="flex flex-col w-full">
      <h1 className="sr-only">FabFit Performance - Premium Gym & Elite Fitness Coaching in Gurgaon</h1>
      {USE_DYNAMIC_CMS && dynamicComponents ? dynamicComponents : staticOrder}
    </main>
  );
}

