"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Product", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "For your team", href: "#for-your-team" },
  { name: "Pricing", href: "#pricing" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed z-50 left-0 right-0 top-0">
      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled
            ? "max-w-225 mt-4 mx-4 lg:mx-auto border border-[#D8D2C8] bg-[#F5F1EA]/95 backdrop-blur-md shadow-sm"
            : "max-w-350 bg-transparent"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? "px-6 h-14 lg:px-8" : "px-6 h-20 lg:px-12"
          }`}
        >
          <Link href="#" className="flex items-center gap-2.5">
            <span
              className={`font-display font-semibold tracking-tight transition-all duration-500 ${
                isScrolled ? "text-[#1B1B19] text-lg" : "text-white text-xl"
              }`}
            >
              foundry
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${
                isScrolled ? "text-[#A4471C]" : "text-white/50"
              }`}
            >
              beta
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-[0.04em] transition-colors duration-300 ${
                  isScrolled
                    ? "text-[#6B6860] hover:text-[#1B1B19]"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#"
              className={`text-sm transition-colors duration-300 ${
                isScrolled
                  ? "text-[#6B6860] hover:text-[#1B1B19]"
                  : "text-white/65 hover:text-white"
              }`}
            >
              GitHub
            </Link>
            <Link
              href="#"
              className={`text-sm font-medium transition-all duration-300 ${
                isScrolled
                  ? "text-[#1B1B19] border-b border-[#1B1B19] hover:border-[#A4471C] hover:text-[#A4471C]"
                  : "text-white border-b border-white/50 hover:border-white"
              }`}
            >
              Start →
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`rounded-sm p-2 transition-colors md:hidden ${
              isScrolled
                ? "text-[#1B1B19] hover:bg-[#E8E2D9]"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#F5F1EA] transition-all duration-400 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full px-8 pt-24 pb-12">
          <div className="flex-1 flex flex-col justify-center gap-10">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-4xl font-display font-semibold text-[#1B1B19] transition-all duration-400 hover:text-[#A4471C] ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 60}ms` : "0ms" }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div
            className={`flex gap-4 border-t border-[#D8D2C8] pt-8 transition-all duration-400 ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "240ms" : "0ms" }}
          >
            <Link
              href="#"
              className="flex-1 h-12 flex items-center justify-center border border-[#D8D2C8] text-[#1B1B19] text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              GitHub
            </Link>
            <Link
              href="#"
              className="flex-1 h-12 flex items-center justify-center bg-[#1B1B19] text-[#F5F1EA] text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
