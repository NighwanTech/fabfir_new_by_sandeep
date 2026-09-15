"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ArrowUpRight,
  Mail,
  ChevronRight,
} from "lucide-react";

// Inline SVGs for brand icons not in this lucide-react version
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Programs", href: "/#programs" },
  { label: "Transformations", href: "/#transformations" },
  { label: "Coaches", href: "/#coaches" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Gallery", href: "/gallery" },
];

const socialLinks = [
  {
    icon: InstagramIcon,
    label: "Instagram",
    href: "https://instagram.com/fabfitperformance",
  },
  {
    icon: YoutubeIcon,
    label: "YouTube",
    href: "https://youtube.com/@fabfitperformance",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/919220393004",
  },
];

export function Footer() {
  return (
    <footer className="relative bg-[#050505] overflow-hidden">
      {/* Top golden border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* BG gym machine image - subtle, light enough to see */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.12]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop')" }}
      />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* CTA Strip */}
      <div className="relative border-b border-white/5">
        <div className="container mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-primary font-bold text-xs tracking-widest uppercase mb-2">
              Ready to Transform?
            </p>
            <h3 className="font-heading text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Start Your Journey{" "}
              <span className="text-primary">Today.</span>
            </h3>
          </div>
          <Link
            href="/assessment"
            target="_blank"
            className="group inline-flex items-center gap-2 bg-primary text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-sm hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(255,184,28,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.2)] shrink-0"
          >
            Book Free Assessment
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <Image
                src={Logo}
                alt="FabFit Performance"
                width={160}
                height={160}
                className="object-contain"
              />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Built on strength, refined by science. The premium destination for elite fitness and performance coaching in Gurgaon.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-1">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:border-primary/60 hover:text-primary transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,184,28,0.25)]"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-black text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-primary inline-block" />
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center text-zinc-500 hover:text-primary text-sm font-medium transition-all duration-300 cursor-pointer w-full py-1"
                  >
                    <span className="relative flex items-center">
                      <ChevronRight className="absolute -left-4 w-3 h-3 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-primary" />
                      <span className="transition-transform duration-300 group-hover:translate-x-3">
                        {label}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit + Hours */}
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="font-heading font-black text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-primary inline-block" />
                Visit Us
              </h4>
              <a
                href="https://www.google.com/maps/search/?api=1&query=62C,+6th+Floor,+Supermart+1,+DLF+Phase-4,+Gurugram"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 text-zinc-500 hover:text-primary text-sm leading-relaxed transition-colors duration-200"
              >
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  62C, 6th Floor, Supermart 1,<br />
                  DLF Phase-4, Gurgaon
                </span>
              </a>
            </div>

            <div>
              <h4 className="font-heading font-black text-white text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-primary inline-block" />
                Hours
              </h4>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-3 text-zinc-500">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Mon – Sat &nbsp;·&nbsp; 6:00 – 22:00</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-500">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Sunday &nbsp;·&nbsp; 7:00 – 12:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-black text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-primary inline-block" />
              Get In Touch
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+919220393004"
                className="group flex items-center gap-3 text-zinc-500 hover:text-primary text-sm font-medium transition-all duration-300 cursor-pointer w-full py-1.5 hover:translate-x-2"
              >
                <Phone className="w-4 h-4 text-primary shrink-0 transition-transform duration-300 group-hover:scale-125" />
                <span>+91 92203 93004</span>
              </a>
              <a
                href="https://wa.me/919220393004"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-zinc-500 hover:text-primary text-sm font-medium transition-all duration-300 cursor-pointer w-full py-1.5 hover:translate-x-2"
              >
                <MessageCircle className="w-4 h-4 text-primary shrink-0 transition-transform duration-300 group-hover:scale-125" />
                <span>WhatsApp Us</span>
              </a>
              <a
                href="mailto:fabfitgym04@gmail.com"
                className="group flex items-center gap-3 text-zinc-500 hover:text-primary text-sm font-medium transition-all duration-300 cursor-pointer w-full py-1.5 hover:translate-x-2"
              >
                <Mail className="w-4 h-4 text-primary shrink-0 transition-transform duration-300 group-hover:scale-125" />
                <span>fabfitgym04@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-medium md:pr-20">
          <p className="tracking-wide">
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-bold">FabFit Performance</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors font-semibold">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors font-semibold">
              Terms of Service
            </Link>
            <span className="text-zinc-600">|</span>
            <span>
              Made with{" "}
              <span className="text-primary">♥</span>{" "}
              for fitness
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
