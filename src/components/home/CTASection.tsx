import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeData } from "@/data/dummy";

export function CTASection() {
  const hero = homeData.heroSlides[0]; // Reusing first slide's CTA text for now

  return (
    <section className="relative py-10 md:py-12 bg-surface overflow-hidden border-t border-white/5">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-4xl">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
          Ready to demand more?
        </h2>
        <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Join the elite. Start your transformation journey with a comprehensive data-driven assessment today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/assessment"
            target="_blank"
            className="group inline-flex items-center justify-center h-14 px-10 bg-primary text-primary-foreground font-bold tracking-wide uppercase transition-all hover:bg-primary-hover"
          >
            {hero.primaryCTA}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
