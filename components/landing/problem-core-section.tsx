"use client";

import { useEffect, useState, useRef } from "react";


export function ProblemCoreSection() {
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
      id="the-problem"
      ref={sectionRef}
      className="relative z-10 flex flex-col lg:flex-row"
    >
      {/* ── LEFT: THE PROBLEM — dark ── */}
      <div className="bg-[#1A1A18] lg:w-1/2 px-8 lg:px-14 xl:px-16 py-24 lg:py-56 flex flex-col">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-mono text-lg text-[#A4471C] tracking-widest uppercase block mb-4">
            The problem
          </span>

          <p className="text-4xl lg:text-5xl xl:text-6xl font-display font-semibold text-[#F4F0E8] leading-[1.05] tracking-tight mb-10">
            Every AI builder gets you to the first 80%
          </p>

          <div className="space-y-6 mb-14">
            <p className="text-lg lg:text-xl text-[#F4F0E8]/70 leading-relaxed">
              Then you ask for the fifth feature, and the agent edits text it no
              longer understands. Invariants break silently. Nobody can say what
              a change touches.
            </p>

            <p className="text-lg lg:text-xl text-[#F4F0E8]/70 leading-relaxed">
              That isn&apos;t an AI problem. It&apos;s a{" "}
              <span className="text-[#F4F0E8]/90 font-medium">coherence</span>{" "}
              problem. The agent has no model of what the system{" "}
              <span className="text-[#F4F0E8]/90 font-medium">is</span> — only
              the text of what it currently says.
            </p>
          </div>

          <div className="border-t border-[#F4F0E8]/10 pt-10">
            <p className="text-3xl lg:text-4xl font-display font-semibold text-[#F4F0E8] leading-tight">
              Foundry gives it one.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: THE CORE IDEA — light ── */}
      <div className="bg-[#F5F1EA] lg:w-1/2 px-8 lg:px-14 xl:px-20 py-24 lg:py-40 flex flex-col">
        <div
          className={`transition-all duration-700 delay-150 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-mono text-lg text-[#A4471C] tracking-widest uppercase block mb-2">
            The core idea
          </span>

          <p className="text-3xl lg:text-4xl xl:text-6xl font-display font-semibold text-[#1B1B19] leading-[1.1] tracking-tight mb-3">
            Foundry&apos;s agent doesn&apos;t edit text
          </p>
          <p className="text-3xl lg:text-4xl xl:text-4xl font-display font-semibold text-[#1B1B19]/40 leading-[1.1] tracking-tight mb-10">
            It edits a validated structure.
          </p>

          <p className="text-base lg:text-xl text-[#6B6860] leading-relaxed mb-12 max-w-lg">
            Other agents generate code and pray. Foundry&apos;s agent operates on
            a graph derived from your real codebase, constrained by structure,
            not by context window size.
          </p>

          <ul className="space-y-6 max-w-lg">
            <li className="text-base lg:text-lg text-[#1B1B19] leading-6">
              <span className="font-mono text-md text-[#A4471C] tracking-wide uppercase mr-2">It cannot reference</span>
              a resource that doesn&apos;t exist because the graph won&apos;t allow it.
            </li>
            <li className="text-base lg:text-lg text-[#1B1B19] leading-6">
              <span className="font-mono text-md text-[#A4471C] tracking-wide uppercase mr-2">It cannot reinvent</span>
              the same concept twice. The full compressed graph is in context.
            </li>
            <li className="text-base lg:text-lg text-[#1B1B19] leading-6">
              <span className="font-mono text-md text-[#A4471C] tracking-wide uppercase mr-2">It cannot change</span>
              without blast radius computed. Every edit is scoped before it lands.
            </li>
            <li className="text-base lg:text-lg text-[#1B1B19] leading-6">
              <span className="font-mono text-md text-[#A4471C] tracking-wide uppercase mr-2">It cannot violate</span>
              an invariant silently because the model rejects the change at the boundary.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
