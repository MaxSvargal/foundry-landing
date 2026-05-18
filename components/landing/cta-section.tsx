"use client";

import { useEffect, useRef, useState } from "react";

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F5F1EA] py-24 lg:py-40">
      {/* Full-width closer — breaks the grid intentionally */}
      <div className="px-6 lg:px-12">
        <div
          className={`border-t border-b border-[#D8D2C8] py-20 lg:py-32 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="max-w-[1400px] mx-auto">
            <p className="font-mono text-xs text-[#6B6860] tracking-widest uppercase mb-10">
              The map is the territory now.
            </p>
            <h2 className="text-5xl lg:text-8xl xl:text-9xl font-display font-semibold text-[#1B1B19] leading-[0.95] tracking-tight mb-10 lg:mb-16">
              Stop maintaining
              <br />
              two of them.
            </h2>
            <p className="text-lg lg:text-xl text-[#6B6860] leading-relaxed max-w-2xl mb-12 lg:mb-16">
              If you are building something complex, domain-heavy, and long-lived — and you want to build it in a way your team, your AI, and your auditors can all understand three years from now — foundry is built for you.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-[#1B1B19] text-[#F5F1EA] px-8 py-4 text-sm font-medium hover:bg-[#1B1B19]/85 transition-colors duration-200"
              >
                Install Foundry →
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 border border-[#D8D2C8] text-[#1B1B19] px-8 py-4 text-sm font-medium hover:border-[#1B1B19]/40 transition-colors duration-200"
              >
                Read the technical paper
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
