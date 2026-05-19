"use client";

import { useState, useEffect, useRef } from "react";

const rows = [
  {
    label: "Source of truth",
    editor: "files",
    diagram: "a Figma you forgot",
    lowcode: "proprietary",
    foundry: "your Ash code",
  },
  {
    label: "Stays current",
    editor: "only what you read",
    diagram: "never",
    lowcode: "yes, but you can't leave",
    foundry: "yes, and you can leave",
    foundryAccent: true,
  },
  {
    label: "Runs in production",
    editor: "n/a",
    diagram: "n/a",
    lowcode: "their runtime",
    foundry: "plain BEAM",
    foundryAccent: true,
  },
  {
    label: "Understands your domain",
    editor: "no",
    diagram: "sort of",
    lowcode: "yes",
    foundry: "yes",
  },
  {
    label: "AI first-try rate",
    editor: "~50%",
    diagram: "n/a",
    lowcode: "proprietary",
    foundry: "80.3%",
    foundryAccent: true,
  },
  {
    label: "You can grep it",
    editor: "yes",
    diagram: "no",
    lowcode: "no",
    foundry: "yes",
    foundryAccent: true,
  },
];

export function DevelopersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="developers"
      ref={sectionRef}
      className="bg-[#F5F1EA] py-24 lg:py-40"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`mb-20 lg:mb-28 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-mono text-xs text-[#A4471C] tracking-widest uppercase block mb-6">
            What's different
          </span>
          <h2 className="text-4xl lg:text-6xl font-display font-semibold text-[#1B1B19] leading-[1.05] tracking-tight">
            The line that matters.
          </h2>
        </div>

        {/* Comparison table */}
        <div
          className={`transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Table header */}
          <div className="grid grid-cols-5 border-b border-[#D8D2C8] pb-4 mb-0">
            <div className="col-span-1" />
            <div className="col-span-1 font-mono text-xs text-[#6B6860] tracking-wider uppercase px-3">
              Code editor
            </div>
            <div className="col-span-1 font-mono text-xs text-[#6B6860] tracking-wider uppercase px-3">
              Architecture diagram
            </div>
            <div className="col-span-1 font-mono text-xs text-[#6B6860] tracking-wider uppercase px-3">
              Low-code platform
            </div>
            <div className="col-span-1 font-mono text-xs text-[#A4471C] tracking-wider uppercase px-3">
              Foundry
            </div>
          </div>

          {/* Table rows */}
          <div>
            {rows.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-5 border-b border-[#D8D2C8] transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${150 + index * 60}ms` }}
              >
                <div className="col-span-1 py-5 font-mono text-xs text-[#6B6860] tracking-wide">
                  {row.label}
                </div>
                <div className="col-span-1 py-5 px-3 text-sm text-[#6B6860]">{row.editor}</div>
                <div className="col-span-1 py-5 px-3 text-sm text-[#6B6860]">{row.diagram}</div>
                <div className="col-span-1 py-5 px-3 text-sm text-[#6B6860]">{row.lowcode}</div>
                <div
                  className={`col-span-1 py-5 px-3 text-sm font-medium ${
                    row.foundryAccent ? "text-[#A4471C]" : "text-[#1B1B19]"
                  }`}
                >
                  {row.foundry}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key statement */}
        <div
          className={`mt-14 lg:mt-20 max-w-3xl transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-xl lg:text-2xl font-display font-semibold text-[#1B1B19] leading-snug">
            Everything Foundry shows you is derived from code you own.
          </p>
          <p className="mt-3 text-base text-[#6B6860]">
            Delete Foundry tomorrow and your app keeps running. This is the distinction from vibe coding — the agent operates against your declared architecture as a gold standard. Elixir's compile-time guarantees mean the model can't hallucinate a valid-looking function that silently mishandles state: pattern matching fails loudly, or the code doesn't compile.
          </p>
            <p className=" leading-relaxed">
              The architecture is yours, regardless of plan. No proprietary runtime. No black box. Every Foundry project compiles to a standard Elixir application you own entirely.
            </p>


        {/* Key guarantee */}
        <div
          className={`border border-[#F5F1EA]/10 p-8 lg:p-12 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-lg lg:text-xl leading-relaxed font-display font-semibold">
            Everything Foundry shows you is derived from code you own.{" "}
            
              Delete Foundry tomorrow and your app keeps running.
            
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
