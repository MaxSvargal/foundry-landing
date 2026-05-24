"use client";

import { useEffect, useRef, useState } from "react";
import { LiquidGlassBackdrop } from "./liquid-glass-backdrop";

const features = [
  {
    number: "01",
    title: "Foundry's agent doesn't edit text. It edits a validated structure.",
    description:
      "Other agents generate code and pray. Foundry's agent operates on a graph derived from your real codebase: It cannot reference a resource that doesn't exist — the graph won't allow it. It cannot make a change without the blast radius being computed — every edit is scoped before it lands. It cannot violate an invariant silently — the model rejects the change at the boundary.",
    visual: "collab",
  },
  {
    number: "02",
    title: "Foundry reads your Ash codebase and reflects it.",
    description:
      "Every action, policy, relationship, and external boundary becomes a node; every call, dependency, and data flow becomes a typed edge. You stop reading code to understand the system. You read the system. Navigate by meaning, not by filename. Blast radius is computed, not guessed. The graph is derived, never drifts. Execution is an overlay, not a guess.",
    visual: "deploy",
  },
  {
    number: "03",
    title: "From idea to running app, without leaving Studio.",
    description:
      "Ask. Describe the project or the feature in Foundry Studio. Preview. Studio spins up a live dev server. You see it running, immediately. Review. Inspect the change as a graph diff, walk the test traces, read the invariants. Fix. Correct in plain language or in code. Both round-trip. Commit & deploy. One click to production.",
    visual: "ai",
  },
  {
    number: "04",
    title: "Tests you can read without reading code.",
    description:
      "A serious system needs a real test pyramid: Unit, Property (thousands of inputs and action sequences), Integration, Scenario (end-to-end domain flows in business language), Regression (every fixed bug, pinned). Each test attaches to the graph node it exercises. Click a node, watch the test execute as a trace — and Foundry checks the tests themselves with mutation analysis.",
    visual: "security",
  },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col gap-8 border-b border-black/10 py-12 lg:flex-row lg:gap-16 lg:py-8">
        {/* <div className="shrink-0">
          <span className="font-mono text-sm text-black/40">{feature.number}</span>
        </div> */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="mb-4 text-2xl font-display text-black transition-transform duration-500 group-hover:translate-x-2 lg:text-3xl">
              {feature.title}
            </h3>
          </div>
          <div className="flex justify-center lg:justify-end">
            {/* <div className="h-64 w-64 text-black/80">
              <Visual />
            </div> */}

            <p className="text-lg leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden bg-transparent text-[#14110f]"
    >
      <LiquidGlassBackdrop />
      <div className="pointer-events-none absolute inset-x-6 top-0 z-3 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,1),rgba(255,255,255,0.54)_36%,transparent_76%)] blur-3xl lg:inset-x-12" />
      <div className="pointer-events-none absolute inset-0 z-3 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08)_20%,rgba(255,255,255,0.02)_52%,rgba(255,255,255,0.14)_100%)]" />
      <div className="relative z-10 mx-auto max-w-350 px-6 lg:px-12">
        <div className="px-1 py-10 lg:px-4 lg:py-16">
          <div className="mb-16">
            <span className="mb-6 inline-flex items-center gap-3 text-sm font-mono text-black/52">
              <span className="h-px w-8 bg-black/20" />
              The core idea
            </span>
            <h2
              className={`text-4xl font-display tracking-tight text-black transition-all duration-700 lg:text-8xl ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Foundry's agent doesn't
              <br />
              <span className="text-black/45">edit text.</span>
            </h2>
          </div>
          <div>
            {features.map((feature, index) => (
              <FeatureCard key={feature.number} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
