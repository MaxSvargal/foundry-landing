"use client";

import { useEffect, useState, useRef } from "react";

const personas = [
  {
    role: "developer",
    headline: "Stop reading code to understand systems.",
    body: "Navigate by meaning, not by filename. Refactor with blast radius shown, not guessed.",
    artifact: "foundry blast-radius <node>",
  },
  {
    role: "staff engineer",
    headline: "Architecture decisions that survive contact with the codebase.",
    body: "Pin ADRs to nodes. Foundry tells you when a decision has been silently violated.",
    artifact: "foundry decisions --stale",
  },
  {
    role: "engineering manager",
    headline: "See your system's health the way you see your business metrics.",
    body: "Bus-factor, drift, fragility — derived from real artifacts, not self-reported sprint data.",
    artifact: "foundry graph --health",
  },
  {
    role: "product manager",
    headline: "Finally looking at the same picture as your engineers.",
    body: "The domain layer, in business language. Click :upgrade_subscription, read what it actually does.",
    artifact: ":upgrade_subscription → ProrateAndCharge",
  },
  {
    role: "auditor",
    headline: "Your authorization model is the documentation auditors want.",
    body: "Export the access matrix for any resource, at any commit, with provenance.",
    artifact: "foundry audit --resource Ledger.Transfer",
  },
];

export function IntegrationsSection() {
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
      id="for-your-team"
      ref={sectionRef}
      className="bg-[#F5F1EA] py-24 lg:py-40 relative z-10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`mb-20 lg:mb-28 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-mono text-xs text-[#A4471C] tracking-widest uppercase block mb-6">
            For your team
          </span>
          <h2 className="text-4xl lg:text-6xl font-display font-semibold text-[#1B1B19] leading-[1.05] tracking-tight">
            One system.
            <br />
            <span className="text-[#1B1B19]/35">Every perspective.</span>
          </h2>
        </div>

        {/* Persona grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D8D2C8]">
          {personas.map((persona, index) => (
            <div
              key={persona.role}
              className={`bg-[#F5F1EA] p-8 lg:p-10 group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              } ${index === personas.length - 1 && personas.length % 2 !== 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <p className="font-mono text-xs text-[#A4471C] tracking-widest uppercase mb-5">
                For the {persona.role}
              </p>
              <h3 className="text-lg lg:text-xl font-display font-semibold text-[#1B1B19] leading-snug mb-3">
                {persona.headline}
              </h3>
              <p className="text-sm text-[#6B6860] leading-relaxed mb-6">
                {persona.body}
              </p>
              <div className="border-t border-[#D8D2C8] pt-5">
                <code className="font-mono text-xs text-[#1B1B19]/60 block">
                  {persona.artifact}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
