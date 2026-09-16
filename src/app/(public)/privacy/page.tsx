import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy of FabFit Performance. Learn how we collect, store, and protect your personal health, fitness, and assessment data.",
  alternates: {
    canonical: "https://fabfitperformance.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | FabFit Performance",
    description: "Your health data privacy matters to us. Read how FabFit Performance protects your personal information.",
    url: "https://fabfitperformance.com/privacy",
  },
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-4 h-4" /> Data Protection & Trust
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            PRIVACY <span className="text-primary">POLICY</span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            At FabFit Performance, we respect your privacy and are committed to protecting the personal, biometric, and medical information you share with us.
          </p>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Effective Date: {lastUpdated}</span>
            <span>FabFit Performance · Gurgaon, India</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-10 text-zinc-300 text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">01.</span> Information We Collect
            </h2>
            <p>
              When you submit our Online Coaching Assessment, register for a gym membership, or contact us, we collect specific information to design your tailored fitness and nutrition programs:
            </p>
            <ul className="space-y-2.5 pl-4 border-l-2 border-primary/40 text-sm sm:text-base">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span><strong className="text-white">Personal Identifiers:</strong> Your full name, email address, phone number, age, and gender.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span><strong className="text-white">Biometric & Fitness Metrics:</strong> Height, current weight, waist circumference, occupation, daily step count, sleep hours, stress levels, and workout background.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span><strong className="text-white">Health & Dietary Background:</strong> Diagnosed medical conditions, active medications, past injuries or surgeries, dietary preferences, supplements, and allergies.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span><strong className="text-white">Optional Media Files:</strong> Progress photos or blood work reports uploaded voluntarily during your assessment submission.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">02.</span> How We Use Your Information
            </h2>
            <p>
              Your data is exclusively utilized to deliver a personalized, high-performance coaching experience. Specifically, we use your information to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#18181c] p-4 rounded-xl border border-white/5">
                <h3 className="text-white font-bold text-sm mb-1">Custom Blueprint Engineering</h3>
                <p className="text-xs text-zinc-400">Design custom workout split, progressive overload targets, and macronutrient nutrition plans.</p>
              </div>
              <div className="bg-[#18181c] p-4 rounded-xl border border-white/5">
                <h3 className="text-white font-bold text-sm mb-1">Coach-Client Communication</h3>
                <p className="text-xs text-zinc-400">Reach out via WhatsApp or phone to review your assessment and conduct weekly check-ins.</p>
              </div>
              <div className="bg-[#18181c] p-4 rounded-xl border border-white/5">
                <h3 className="text-white font-bold text-sm mb-1">Safety Screening</h3>
                <p className="text-xs text-zinc-400">Identify potential medical constraints or joint restrictions before prescribing heavy lifts.</p>
              </div>
              <div className="bg-[#18181c] p-4 rounded-xl border border-white/5">
                <h3 className="text-white font-bold text-sm mb-1">Account & Membership Service</h3>
                <p className="text-xs text-zinc-400">Manage gym access, billing notifications, and membership renewals seamlessly.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">03.</span> Confidentiality & Data Security
            </h2>
            <p>
              We enforce strict confidentiality protocols. Your health data, assessment metrics, progress photos, and blood reports will <strong className="text-white">NEVER be sold, rented, or shared</strong> with third-party advertisers or external marketing agencies.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-4">
              <Lock className="w-8 h-8 text-primary shrink-0" />
              <p className="text-xs sm:text-sm text-zinc-300">
                All uploaded files and assessment submissions are transmitted using SSL/TLS encryption and stored on secure server infrastructure accessible only by authorized coaches.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">04.</span> Cookies & Analytics
            </h2>
            <p>
              FabFit Performance uses essential cookies and light web analytics to monitor page performance, visitor traffic, and improve user navigation. You can adjust your browser settings to disable non-essential cookies at any time.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-white font-bold text-xl sm:text-2xl uppercase tracking-wide flex items-center gap-3">
              <span className="text-primary font-mono text-base">05.</span> Your Rights & Contact Us
            </h2>
            <p>
              You have the right to inspect, update, or request the deletion of your personal assessment data at any time. For privacy inquiries or data update requests, please contact Head Performance Coach Ankit Baliyan:
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
          <Link href="/terms" className="text-xs font-semibold text-zinc-400 hover:text-primary uppercase tracking-wider transition-colors">
            Read Terms of Service →
          </Link>
        </div>

      </div>
    </div>
  );
}
