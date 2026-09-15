"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/assets/logo.png";
import { Menu, X, ArrowRight } from "lucide-react";

const navbarData = {
  links: [
    { name: "HOME", href: "/#home" },
    { name: "ABOUT", href: "/#about" },
    { name: "PROGRAMS", href: "/#programs" },
    { name: "SERVICES", href: "/#services" },
    { name: "COACHES", href: "/#coaches" },
    { name: "TRANSFORMATIONS", href: "/#transformations" },
    { name: "MEMBERSHIP", href: "/#pricing" },
    { name: "GALLERY", href: "/#gallery" },
    { name: "CONTACT", href: "/#contact" },
  ],
  cta: "BOOK ASSESSMENT"
};

const USE_DYNAMIC_CMS = true;

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dynamicLinks, setDynamicLinks] = useState(navbarData.links);
  const navbar = { ...navbarData, links: dynamicLinks };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (USE_DYNAMIC_CMS) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/page-structure`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const activeSections = data.data.filter((s: any) => s.isActive);
            const newLinks = activeSections.map((s: any) => ({
              name: s.title,
              href: `/#${s.sectionId === 'membership' ? 'pricing' : s.sectionId}`
            }));
            setDynamicLinks(newLinks);
          }
        })
        .catch(err => console.error("Error fetching dynamic navbar:", err));
    }
  }, []);

  // ✅ Auto-scroll to hash target when arriving at home page from another route (e.g. /gallery)
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const sectionId = window.location.hash.replace("#", "");
      if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const timer = setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  // ✅ Core fix: only handle smooth scroll via e.preventDefault() when on the home page ("/")
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle hash links on the home page
    if (pathname !== "/" || !href.startsWith("/#")) return;

    e.preventDefault();
    const sectionId = href.replace("/#", "");

    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/#home");
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL without triggering a navigation
      window.history.pushState(null, "", href);
    }
  };

  return (
    <div className="fixed w-full z-50 top-0 left-0">
      <div
        className={`absolute inset-0 bg-[#050505]/60 backdrop-blur-md border-b border-white/10 shadow-lg transition-opacity duration-300 pointer-events-none ${isScrolled ? "opacity-100" : "opacity-0"}`}
      />

      <nav className="w-full h-[72px] flex items-center px-4 md:px-8 lg:px-12 relative z-10">

        {/* Left: Brand / Logo */}
        <div className="flex-1 flex justify-start">
          <Link
            href="/#home"
            className="flex items-center gap-3 group"
            onClick={(e) => handleNavClick(e, "/#home")}
          >
            <img src={Logo.src} alt="FabFit Logo" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <div className="hidden lg:flex flex-[2] items-center justify-center gap-5 xl:gap-8 h-full">
          {navbar.links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="group text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 flex items-center h-full text-zinc-400 hover:text-primary"
            >
              <span className="relative">
                {link.name}
                {/* Hover Underline */}
                <span className="absolute -bottom-1.5 left-0 w-full flex justify-center">
                  <span className="h-[2px] bg-primary rounded-full transition-all duration-300 ease-out w-0 group-hover:w-full" />
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center h-full">
          {/* Desktop CTA */}
          <Link
            href="/assessment"
            target="_blank"
            className="hidden lg:flex group items-center justify-center h-[42px] px-6 bg-transparent border border-primary text-primary hover:bg-primary hover:text-black text-[12px] font-bold tracking-wide uppercase transition-all duration-300 hover:bg-white hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] rounded-md"
          >
            {navbar.cta}
            <ArrowRight className="ml-2 h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 -mr-2 text-white hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl overflow-hidden">
          <div className="px-6 py-8 flex flex-col gap-6">
            {navbar.links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setIsOpen(false);
                  handleNavClick(e, link.href);
                }}
                className="text-sm font-bold tracking-widest uppercase transition-colors text-white hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/assessment"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="mt-6 flex items-center justify-center h-12 bg-transparent border border-primary text-primary hover:bg-primary hover:text-black text-sm font-bold tracking-wide uppercase transition-all rounded-md"
            >
              {navbar.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


