import Image from "next/image";
import Logo from "@/assets/logo.png";
import { Check, Trophy, Users, Shield, TrendingUp, Lock } from "lucide-react";
import Link from "next/link";

export function AssessmentSidebar() {
  return (
    <div className="w-full lg:w-80 shrink-0 bg-[#121215] border border-white/10 rounded-2xl p-6 lg:sticky lg:top-28 h-fit shadow-2xl relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Logo */}
      <div className="pb-4 relative z-10 border-b border-white/5 mb-6">
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <img src={Logo.src} alt="Fab Fit Performance Logo" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </Link>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Headings */}
        <div>
          <h2 className="font-heading font-black text-2xl xl:text-3xl text-white uppercase leading-tight tracking-tight">
            Online Coaching
            <br />
            <span className="text-primary">Application</span>
          </h2>
          <p className="text-zinc-400 text-xs xl:text-sm leading-relaxed mt-2">
            With over 15 years of experience in health and fitness, I&apos;m here to help you achieve sustainable, long-lasting results.
          </p>
        </div>

        {/* Coach Card */}
        <div className="relative rounded-xl overflow-hidden bg-[#18181c] border border-white/5 p-4 flex items-center gap-4">
          <img 
            src="/coach-dhiraj.png" 
            alt="Coach Ankit Baliyan" 
            className="w-14 h-14 rounded-full object-cover border-2 border-primary/50 shrink-0"
          />
          <div>
            <h4 className="text-white text-sm font-bold">Ankit Baliyan</h4>
            <p className="text-primary text-xs font-semibold">Head Performance Coach</p>
            <p className="text-zinc-500 text-[10px] mt-0.5">ASCA L2 | ACE | NASM CES</p>
          </div>
        </div>

        {/* Why this step card */}
        <div className="bg-[#18181c] border border-white/10 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="mt-0.5">
              <Check className="w-4 h-4 text-primary shrink-0" />
            </div>
            <div>
              <h3 className="text-primary font-bold text-xs tracking-wide uppercase mb-1">Why this step?</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                The more accurate your information, the more tailored and effective your plan will be.
              </p>
            </div>
          </div>
        </div>

        {/* Stats icons */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <div className="flex flex-col items-center text-center gap-1">
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-primary">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <span className="text-white text-[10px] font-bold">15+ Yrs</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-primary">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-white text-[10px] font-bold">1000+</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-primary">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-white text-[10px] font-bold">Science</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-primary">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-white text-[10px] font-bold">Results</span>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 text-zinc-500 text-xs border-t border-white/5 pt-4">
          <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
          <p>100% confidential & encrypted data.</p>
        </div>
      </div>
    </div>
  );
}
