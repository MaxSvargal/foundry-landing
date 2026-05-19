"use client";

import { useEffect, useState, useRef } from "react";

const cliCommands = [
  { cmd: "foundry init", desc: "Start from a template or an existing Ash project." },
  { cmd: "foundry graph", desc: "Render the system map. Open in browser, or pipe to dot." },
  { cmd: "foundry blast-radius <node>", desc: "What breaks if I change this?" },
  { cmd: "foundry invariants check", desc: "Run all invariants across the model." },
  { cmd: "foundry decisions", desc: "List ADRs. Show which are stale." },
  { cmd: "foundry agent", desc: "Pair-program against the graph, not against text." },
];

const whatTeamsBuild = [
  {
    domain: "Business process platforms",
    description:
      "Approvals, escalations, parallel branches, exception handling — declared as deterministic workflows, visualizable at every step, evolvable without breaking what runs.",
  },
  {
    domain: "Financial platforms",
    description:
      "Ledger integrity, transfer governance, regulatory compliance, audit trails, dual-approval on sensitive changes.",
  },
  {
    domain: "Healthcare and clinical systems",
    description:
      "PHI governance, protocol enforcement, human-in-the-loop gates on decisions that cannot be autonomous, audit-ready records.",
  },
  {
    domain: "Enterprise internal platforms",
    description:
      "The most underserved category in software. Internal tools built badly, maintained expensively, understood only by whoever first wrote them.",
  },
];

export function SecuritySection() {
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
    <section id="security" ref={sectionRef} className="bg-[#1B1B19] py-24 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`mb-20 lg:mb-28 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-mono text-xs text-[#A4471C] tracking-widest uppercase block mb-6">
            What you get on day one
          </span>
          <h2 className="text-4xl lg:text-6xl font-display font-semibold text-[#F5F1EA] leading-[1.05] tracking-tight max-w-3xl">
            A complete, production-grade platform — built to your domain exactly, owned entirely by you.
          </h2>
        </div>

        {/* Two columns: what teams build + CLI */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20 lg:mb-28">
          {/* Domain types */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="font-mono text-xs text-[#F5F1EA]/30 tracking-widest uppercase mb-8">
              What teams build with it
            </p>
            <div className="space-y-0">
              {whatTeamsBuild.map((item, index) => (
                <div
                  key={item.domain}
                  className={`py-6 border-b border-[#F5F1EA]/10 transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${100 + index * 80}ms` }}
                >
                  <p className="font-mono text-xs text-[#A4471C] mb-2">{item.domain}</p>
                  <p className="text-sm text-[#F5F1EA]/55 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
