"use client";

import { useEffect, useRef, useState } from "react";
import { LiquidGlassBackdrop } from "./liquid-glass-backdrop";

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40" />
      <span>{children}</span>
    </li>
  );
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-black">{children}</strong>;
}

const features = [
  {
    number: "01",
    title: <>Other agents generate code and pray.<br/>Foundry's agent operates on a graph derived from your real codebase:</>,
    description: (
      <div className="space-y-3">
        <ul className="space-y-2">
          <Bullet>Cannot <B>reference</B> or a resource that doesn't exist.<br/>The graph structure won't allow it.</Bullet>
          <Bullet>Cannot <B>reinvent</B> the same concept twice.<br/>The full compressed graph is in context.</Bullet>
          <Bullet>Cannot <B>make a change</B> without the blast radius being computed<br/>and every edit is scoped before it lands.</Bullet>
          <Bullet>Cannot <B>violate</B> an invariant silently - the model rejects the change<br/>at the boundary.</Bullet>
        </ul>
      </div>
    ),
  },
  {
    number: "02",
    title: <>You stop reading code to understand the system.<br/>You read the system as a map.</>,
    description: (
      <div className="space-y-3">
        <p>Every action, policy, rule, relationship, and external boundary becomes a node; every call, dependency, and data flow becomes a typed edge.</p>
        <ul className="space-y-1">
          <Bullet><B>Navigate by meaning, not by filename.</B> Start at a domain concept, expand along the edges that matter.</Bullet>
          <Bullet><B>Blast radius is computed, not guessed.</B> Select any node and see the transitive set of everything a change would touch as a highlighted subgraph.</Bullet>
          <Bullet><B>The graph is derived, never drifts.</B> Code is the source of truth. The graph is computed from compiled code. It cannot lie.</Bullet>
          <Bullet><B>Execution is an overlay, not a guess.</B> Traces feed back onto the graph, showing which paths run hot, which run never, which one has no connected rules or features, which one quietly got slower against last runs.</Bullet>
        </ul>
      </div>
    ),
  },
  {
    number: "03",
    title: "Tests you can read without reading code.",
    description: (
      <div className="space-y-3">
        <p>A complex system needs a real test pyramid:</p>
        <ul className="space-y-1">
          <Bullet><B>Unit</B> — isolated logic, fast feedback</Bullet>
          <Bullet><B>Property</B> — thousands of inputs and action sequences</Bullet>
          <Bullet><B>Integration</B> — boundaries and contracts</Bullet>
          <Bullet><B>Scenario</B> — end-to-end domain flows in business language</Bullet>
          <Bullet><B>Regression</B> — every fixed bug, pinned</Bullet>
        </ul>
        <p>Each test attaches to the graph node it exercises. Click a node, watch the test execute as a trace — and Foundry checks the tests themselves with <B>mutation analysis</B>.</p>
      </div>
    ),
  },
  {
    number: "04",
    title: "Code as Specification — intent that travels with the code",
    description: (
      <div className="space-y-3">
        <p>Foundry makes the agent tag what it builds. Every non-obvious piece of logic carries an inline, structured link back to the reasoning that produced it — the project constitution, the ADR, the runbook.</p>
        <p>Decisions are typed records with required shape — context, options, consequences, reversibility — pinned to the graph nodes they govern. When the code under a decision changes, the decision is flagged stale. Documentation stops being a separate thing that rots. It *is* the code, and the graph keeps it honest.</p>
      </div>
    ),
  },
{
    number: "05",
    title: "From idea to running app, without leaving Studio",
    description: (
      <div className="space-y-3">
        <ul className="space-y-1">
          <Bullet><B>Ask</B> — Describe the project or the feature in Foundry Studio</Bullet>
          <Bullet><B>Preview</B> — Studio spins up a live dev server. You see it running, immediately</Bullet>
          <Bullet><B>Review</B> — Inspect the change as a graph diff, walk the test traces, read the invariants</Bullet>
          <Bullet><B>Fix</B> — Correct in plain language or in code. Both round-trip</Bullet>
          <Bullet><B>Commit &amp; deploy</B> — One click to production</Bullet>
        </ul>
        <p>Ten minutes, end to end — because every step operates on a structure, not on a wall of generated text. This is the on-ramp. The reason it's still standing after the fiftieth change is everything below.</p>
      </div>
    ),
  },
];

type Feature = {
  number: string;
  title: React.ReactNode;
  description: React.ReactNode;
};

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
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
        <div className="flex-1 grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl leading-10 font-display text-black transition-transform duration-500 group-hover:translate-x-2 lg:text-2xl">
              {feature.title}
            </h3>
          </div>
          <div className="text-lg leading-relaxed">
            {feature.description}
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
          <div className="mb-16 mt-8">
            <span className="mb-6 inline-flex gap-3 text-2xl font-mono text-black/52">
              <span className="h-px w-8 bg-black/20" />
              The core idea
            </span>
            <h2
              className={`text-3xl font-display tracking-tight text-black transition-all duration-700 lg:text-7xl ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              Foundry's agent doesn't edit text. 
              <br />
              <span className="text-black/45">It edits a validated structure.</span>
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
