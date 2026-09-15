"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { homeData } from "@/data/dummy";

// --- SVG Icons ---
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const InstaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>; // simplified WA icon

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const PhoneInputIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const SubjectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;

export function Contact() {
  const { contact } = homeData;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  const handleWhatsAppConnect = () => {
    if (!name.trim()) {
      alert("Please enter your name to connect.");
      return;
    }
    if (!goal) {
      alert("Please select your goal.");
      return;
    }
    const message = `Hi Fab Fit Performance! I'm ${name.trim()} and my goal is: ${goal}. I'd like to book my assessment.`;
    window.open(`https://wa.me/919220393004?text=${encodeURIComponent(message)}`, "_blank");
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <section ref={sectionRef} id="contact" className="bg-[#020202] relative overflow-hidden py-12 md:py-16 border-t border-zinc-900">
      
      {/* Left Column Background Image */}
      <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full opacity-60 pointer-events-none z-0">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" 
          alt="Gym Consultation Background" 
          className="w-full h-full object-cover grayscale brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/80 via-[#020202]/50 to-[#020202] lg:to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[1400px]">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
          
          {/* Left Column: Info */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col pr-0 lg:pr-12"
          >
            <motion.div variants={fadeUp} className="mb-10">
              <span className="text-primary font-bold text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-primary"></span>
                {contact.badge}
                <span className="w-4 h-[1px] bg-primary"></span>
              </span>
              
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black leading-[1] uppercase tracking-tighter mb-6">
                <span className="block text-white mb-2">{contact.headingLine1}</span>
                <span className="block text-white mb-2">{contact.headingLine2}</span>
                <span className="block text-primary">{contact.headingLine3}</span>
              </h2>
              
              <p className="text-zinc-400 text-sm md:text-base font-medium max-w-md">
                {contact.subHeader}
              </p>
            </motion.div>

            {/* Info List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 mb-12">
              {contact.info.map((item) => {
                const isEmail = item.type === 'email';
                const isPhone = item.type === 'phone';
                const isAddress = item.type === 'address';
                
                // For phone use tel:, for email use Gmail compose URL, for address use Google Maps
                const href = isPhone 
                  ? `tel:${item.details.replace(/[^\\d+]/g, '')}` 
                  : isEmail 
                  ? `https://mail.google.com/mail/?view=cm&fs=1&to=${item.details}` 
                  : isAddress
                  ? `https://maps.google.com/?q=${encodeURIComponent(item.details)}`
                  : undefined;

                const InnerContent = (
                  <div className="flex flex-col gap-4 h-full">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all duration-500 shadow-lg shrink-0 hover:scale-110 hover:-rotate-3">
                      {item.type === 'phone' && <PhoneIcon />}
                      {item.type === 'email' && <EmailIcon />}
                      {item.type === 'address' && <MapPinIcon />}
                      {item.type === 'hours' && <ClockIcon />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-black text-xs tracking-widest uppercase mb-1.5">{item.title}</span>
                      <span className={`text-zinc-400 text-sm font-medium leading-relaxed whitespace-pre-line transition-colors ${href ? 'hover:text-primary hover:underline' : ''}`}>
                        {item.details}
                      </span>
                    </div>
                  </div>
                );

                return (
                  <motion.div key={item.id} variants={itemVariants} className="h-full">
                    {href ? (
                      <a 
                        href={href}
                        target={isEmail || isAddress ? "_blank" : undefined}
                        rel={isEmail || isAddress ? "noopener noreferrer" : undefined}
                        className="block h-full cursor-pointer"
                      >
                        {InnerContent}
                      </a>
                    ) : (
                      InnerContent
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Socials */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <span className="text-white font-black text-[11px] tracking-widest uppercase">FOLLOW US</span>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-primary hover:text-primary transition-colors duration-300"><InstaIcon /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-primary hover:text-primary transition-colors duration-300"><FacebookIcon /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-primary hover:text-primary transition-colors duration-300"><YouTubeIcon /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-primary hover:text-primary transition-colors duration-300"><WhatsAppIcon /></a>
              </div>
            </motion.div>
            
          </motion.div>

          {/* Right Column: Form & Map */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col gap-6"
          >
            {/* Contact Form */}
            <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden group">
              <div className="mb-6">
                <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter flex flex-col sm:flex-row sm:gap-2 mb-2 leading-none">
                  <span className="text-white drop-shadow-md">SEND US A</span>
                  <span className="text-primary drop-shadow-md">MESSAGE</span>
                </h3>
              </div>

              <form className="flex flex-col gap-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name');
                const subject = formData.get('subject');
                const message = formData.get('message');
                const text = `Hi Fab Fit! I'm ${name}. Subject: ${subject}. Message: ${message}`;
                window.open(`https://wa.me/919220393004?text=${encodeURIComponent(text)}`, '_blank');
              }}>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="relative group/input">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder=" "
                      className="peer w-full bg-[#0a0a0a] border border-zinc-800/80 text-white text-sm rounded-xl pl-12 pr-5 py-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 peer-focus:text-primary transition-colors">
                      <UserIcon />
                    </div>
                    <label 
                      htmlFor="name" 
                      className="absolute left-10 -top-2.5 bg-[#050505] px-1.5 text-[11px] text-zinc-500 transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:left-12 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-10 peer-focus:text-[11px] peer-focus:text-primary peer-focus:bg-[#050505]"
                    >
                      Full Name
                    </label>
                  </div>

                  {/* Email Address */}
                  <div className="relative group/input">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder=" "
                      className="peer w-full bg-[#0a0a0a] border border-zinc-800/80 text-white text-sm rounded-xl pl-12 pr-5 py-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 peer-focus:text-primary transition-colors">
                      <MailIcon />
                    </div>
                    <label 
                      htmlFor="email" 
                      className="absolute left-10 -top-2.5 bg-[#050505] px-1.5 text-[11px] text-zinc-500 transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:left-12 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-10 peer-focus:text-[11px] peer-focus:text-primary peer-focus:bg-[#050505]"
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="relative group/input">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder=" "
                    className="peer w-full bg-[#0a0a0a] border border-zinc-800/80 text-white text-sm rounded-xl pl-12 pr-5 py-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 peer-focus:text-primary transition-colors">
                    <PhoneInputIcon />
                  </div>
                  <label 
                    htmlFor="phone" 
                    className="absolute left-10 -top-2.5 bg-[#050505] px-1.5 text-[11px] text-zinc-500 transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:left-12 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-10 peer-focus:text-[11px] peer-focus:text-primary peer-focus:bg-[#050505]"
                  >
                    Phone Number
                  </label>
                </div>

                {/* Subject */}
                <div className="relative group/input">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder=" "
                    className="peer w-full bg-[#0a0a0a] border border-zinc-800/80 text-white text-sm rounded-xl pl-12 pr-5 py-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 peer-focus:text-primary transition-colors">
                    <SubjectIcon />
                  </div>
                  <label 
                    htmlFor="subject" 
                    className="absolute left-10 -top-2.5 bg-[#050505] px-1.5 text-[11px] text-zinc-500 transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:left-12 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-10 peer-focus:text-[11px] peer-focus:text-primary peer-focus:bg-[#050505]"
                  >
                    Subject
                  </label>
                </div>

                {/* Your Message */}
                <div className="relative group/input">
                  <textarea
                    id="message"
                    name="message"
                    placeholder=" "
                    rows={4}
                    className="peer w-full bg-[#0a0a0a] border border-zinc-800/80 text-white text-sm rounded-xl pl-12 pr-5 py-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300 resize-none"
                    required
                  ></textarea>
                  <div className="absolute top-4 left-4 flex pointer-events-none text-zinc-500 peer-focus:text-primary transition-colors">
                    <EditIcon />
                  </div>
                  <label 
                    htmlFor="message" 
                    className="absolute left-10 -top-2.5 bg-[#050505] px-1.5 text-[11px] text-zinc-500 transition-all duration-300 pointer-events-none rounded-md peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:left-12 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:left-10 peer-focus:text-[11px] peer-focus:text-primary peer-focus:bg-[#050505]"
                  >
                    Your Message
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-primary text-black font-black text-sm tracking-widest uppercase rounded-xl py-4 mt-2 flex items-center justify-center gap-2 hover:bg-white transition-all duration-500 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] group/btn"
                >
                  SEND MESSAGE
                  <span className="text-lg leading-none transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </form>
            </div>

            {/* Map Box */}
            <div className="relative w-full h-[220px] bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden group shadow-2xl">
              <iframe
                src="https://maps.google.com/maps?q=Supermart+1,+DLF+Phase-4,+Gurgaon&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              ></iframe>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-1000 pointer-events-none mix-blend-overlay"></div>
              {/* Floating Address Mini-Card */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                <MapPinIcon />
                <span className="text-white text-xs font-bold tracking-widest uppercase">{contact.mapAddress.title}</span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
