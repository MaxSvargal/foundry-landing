"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Why Foundry", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "The stack", href: "#infrastructure" },
  { name: "Pricing", href: "#pricing" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "left-4 right-4 top-4" 
          : "left-0 right-0 top-0"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "max-w-[1320px] rounded-[2rem] border bg-[#0c0a12]/72 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            : "max-w-[1400px] bg-transparent"
        }`}
      >
        <div 
          className={`flex items-center justify-between px-6 transition-all duration-500 lg:px-8 ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          <Link href="#" className="group flex items-center gap-3">
            <span className={`font-display tracking-tight text-white transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}>
              Foundry
            </span>
            <span className={`rounded-full border border-white/12 bg-white/6 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white/55 transition-all duration-500 ${isScrolled ? "mt-0" : "mt-0.5"}`}>
              beta
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative text-sm tracking-[0.08em] text-white/70 transition-colors duration-300 hover:text-white"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#FC7B03] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="#" className={`text-white/60 transition-all duration-500 hover:text-white ${isScrolled ? "text-xs" : "text-sm"}`}>
              Source Code
            </Link>
            <Button
              asChild
              size="sm"
              className={`rounded-full border border-white bg-white text-black transition-all duration-500 hover:bg-white/92 ${isScrolled ? "h-9 px-4 text-xs" : "px-6"}`}
            >
              <Link href="#">Take a Tour</Link>
            </Button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full border border-white/12 bg-white/5 p-2 text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </nav>
      
      <div
        className={`fixed inset-0 z-40 bg-[#050408]/96 transition-all duration-500 md:hidden ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-white transition-all duration-500 hover:text-[#FC7B03] ${
                  isMobileMenuOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className={`flex gap-4 border-t border-white/10 pt-8 transition-all duration-500 ${
            isMobileMenuOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Button 
              asChild
              variant="outline"
              className="h-14 flex-1 rounded-full border-white/20 bg-transparent text-base text-white hover:bg-white/6 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="#">Source Code</Link>
            </Button>
            <Button 
              asChild
              className="h-14 flex-1 rounded-full bg-white text-base text-black hover:bg-white/92"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="#">Take a Tour</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
