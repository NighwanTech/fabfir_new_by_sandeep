import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, Scale, AlertTriangle, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the Terms of Service for FabFit Performance gym memberships, online coaching programs, personal training, and website usage.",
  alternates: {
    canonical: "https://fabfitperformance.com/terms",
  },
  openGraph: {
    title: "Terms of Service | FabFit Performance",
    description: "Read the rules, policies, and health disclaimers for FabFit Performance coaching and gym facilities.",
    url: "https://fabfitperformance.com/terms",
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "September 15, 2026";

  return (
    <div className="bg-[#09090b] text-white min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb / Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-primary uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Hero Header */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-10 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
            <Scale className="w-4 h-4" /> Legal Agreement & Policies
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            TERMS OF <span className="text-primary">SERVICE</span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            Please read these terms and conditions carefully before enrolling in FabFit Performance online coaching programs, personal training services, or gym memberships.
          </p>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Effective Date: {lastUpdated}</span>
            <span>FabFit Performance · Gurgaon, India</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-10 text-zinc-300 text-sm sm:text-base leading-relaxed">
          
          {/* Section 1: Health & Medical Disclaimer */}
          <section className="space-y-4">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">01.</span> Health & Exercise Medical Disclaimer
            </h2>
            
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 sm:p-5 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                <strong className="text-amber-400 uppercase tracking-wide block mb-1">Consult Your Physician First</strong>
                Physical exercise, weight training, and intense physical conditioning involve inherent risk of physical injury. You must consult a qualified physician or medical professional before commencing any training program prescribed by FabFit Performance.
              </p>
            </div>

            <p>
              By accessing our coaching blueprints or training at our Gurgaon facility, you acknowledge that you are participating voluntarily, assume all risk of injury or medical aggravation, and release FabFit Performance and Head Performance Coach Ankit Baliyan from claims arising out of voluntary workout execution.
            </p>
          </section>

          {/* Section 2: Online Coaching & Assessment */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">02.</span> Coaching & Assessment Accuracy
            </h2>
            <p>
              Our custom workout blueprints, progressive overload structures, and macronutrient strategies are engineered based on the accurate data provided in your assessment form.
            </p>
            <ul className="space-y-2.5 pl-4 border-l-2 border-primary/40 text-sm sm:text-base">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span>You agree to provide truthful, accurate metrics (age, height, weight, waist circumference, medical conditions, and injuries).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span>Coach feedback and weekly plan revisions require active client participation and adherence to check-in schedules.</span>
              </li>
            </ul>
          </section>

          {/* Section 3: Memberships & Payment Terms */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">03.</span> Memberships, Fees & Cancellations
            </h2>
            <p>
              All online coaching packages and gym memberships must be paid in full prior to program initiation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#18181c] p-4 rounded-xl border border-white/5">
                <h3 className="text-white font-bold text-sm mb-1">Non-Transferable</h3>
                <p className="text-xs text-zinc-400">Memberships and coaching access are strictly personal to the enrolled client and cannot be transferred or shared.</p>
              </div>
              <div className="bg-[#18181c] p-4 rounded-xl border border-white/5">
                <h3 className="text-white font-bold text-sm mb-1">Fee Adjustments</h3>
                <p className="text-xs text-zinc-400">FabFit Performance reserves the right to modify service fees for future enrollment periods with advance notice.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Gym Facility Code of Conduct */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">04.</span> Gym Facility Etiquette
            </h2>
            <p>
              Members training on-site at our Gurgaon center (62C, 6th Floor, Supermart 1, DLF Phase-4) must follow facility guidelines:
            </p>
            <ul className="space-y-2 text-sm pl-4 list-disc marker:text-primary">
              <li>Re-rack all weights, dumbbells, and plates after set completion.</li>
              <li>Wipe down equipment after use and wear appropriate athletic footwear.</li>
              <li>Respect fellow members, trainers, and staff at all times.</li>
            </ul>
          </section>

          {/* Section 5: Intellectual Property */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">05.</span> Intellectual Property
            </h2>
            <p>
              All program blueprints, workout video guides, branding logos, text, and website materials are the exclusive intellectual property of FabFit Performance. Content may not be reproduced, resold, or redistributed without prior written consent.
            </p>
          </section>

          {/* Section 6: Governing Law & Contact */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">06.</span> Governing Law & Legal Contact
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Haryana, India. For questions regarding these Terms of Service:
            </p>

            <div className="bg-[#18181c] border border-white/10 rounded-xl p-5 space-y-3 max-w-md text-sm">
              <div className="flex items-center gap-3 text-zinc-300">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>FabFit Performance · 62C, 6th Floor, Supermart 1, DLF Phase-4, Gurgaon</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:fabfitgym04@gmail.com" className="hover:text-primary transition-colors">fabfitgym04@gmail.com</a>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+919220393004" className="hover:text-primary transition-colors">+91 92203 93004</a>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link href="/privacy" className="text-xs font-semibold text-zinc-400 hover:text-primary uppercase tracking-wider transition-colors">
            Read Privacy Policy →
          </Link>
        </div>

      </div>
    </div>
  );
}
