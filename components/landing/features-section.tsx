"use client";

import { useEffect, useRef, useState } from "react";
import { LiquidGlassBackdrop } from "./liquid-glass-backdrop";

const features = [
  {
    number: "01",
    title: "Constraints become code.",
    description:
      "Right now the reason a resource is sensitive exists in one person's memory and nowhere else. When that person leaves, the constraint vanishes. Foundry makes constraints executable — they live in code as specs, and the linter fires when they're violated.",
    visual: "collab",
  },
  {
    number: "02",
    title: "The map is the code.",
    description:
      "The diagram drawn in week one describes a system that no longer exists. In Foundry, the system map is not inferred from code — it is the code. A lossless rendering generated from the same source the compiler validates. It cannot drift.",
    visual: "deploy",
  },
  {
    number: "03",
    title: "Your copilot reads your domain, not its training data.",
    description:
      "The copilot doesn't know your invariants. It knows what Elixir looked like in its training data. Foundry's copilot reads your domain model live from the compiler, your ADRs, your compliance links, and your sensitivity classifications before proposing anything.",
    visual: "ai",
  },
  {
    number: "04",
    title: "Blast radius before merge, not after.",
    description:
      "Nobody knew that modifying this action would break three downstream compliance obligations. Foundry proposes on a branch, classifies the change as :structural, :behavioral, or :compliance, and routes it to the right approver before anything merges.",
    visual: "security",
  },
];

const SVGVisuals = {
  deploy: () => (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <defs>
        <clipPath id="deployClip">
          <rect x="30" y="20" width="140" height="120" rx="4" />
        </clipPath>
      </defs>
      <rect x="30" y="20" width="140" height="120" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <g clipPath="url(#deployClip)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x="40" y={35 + i * 16} width="120" height="10" rx="2" fill="currentColor" opacity="0.15">
            <animate attributeName="opacity" values="0.15;0.8;0.15" dur="2s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
            <animate attributeName="width" values="20;120;20" dur="2s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>
      <circle cx="100" cy="155" r="3" fill="currentColor" opacity="0.3">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  ),
  ai: () => {
    const nodes = [0, 1, 2, 3, 4, 5].map((i) => ({
      x: (100 + Math.cos((i * 60) * (Math.PI / 180)) * 50).toFixed(1),
      y: (80 + Math.sin((i * 60) * (Math.PI / 180)) * 50).toFixed(1),
      delay: `${i * 0.3}s`,
    }));
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <circle cx="100" cy="80" r="12" fill="currentColor">
          <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite" />
        </circle>
        {nodes.map((node, i) => (
          <g key={i}>
            <line x1="100" y1="80" x2={node.x} y2={node.y} stroke="currentColor" strokeWidth="1" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin={node.delay} repeatCount="indefinite" />
            </line>
            <circle cx={node.x} cy={node.y} r="6" fill="none" stroke="currentColor" strokeWidth="2">
              <animate attributeName="r" values="6;8;6" dur="2s" begin={node.delay} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        <circle cx="100" cy="80" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
          <animate attributeName="r" values="20;60" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    );
  },
  collab: () => (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <g>
        <rect x="30" y="50" width="50" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <text x="55" y="85" textAnchor="middle" fontSize="20" fontFamily="monospace" fill="currentColor">A</text>
        <circle cx="55" cy="35" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      </g>
      <g>
        <rect x="120" y="50" width="50" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <text x="145" y="85" textAnchor="middle" fontSize="20" fontFamily="monospace" fill="currentColor">B</text>
        <circle cx="145" cy="35" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      </g>
      <line x1="80" y1="80" x2="120" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
        <animate attributeName="strokeDashoffset" values="0;-8" dur="0.5s" repeatCount="indefinite" />
      </line>
      <circle r="4" fill="currentColor">
        <animateMotion dur="1.5s" repeatCount="indefinite">
          <mpath href="#dataPath" />
        </animateMotion>
      </circle>
      <path id="dataPath" d="M 80 80 L 120 80" fill="none" />
      <g transform="translate(100, 130)">
        <circle r="6" fill="none" stroke="currentColor" strokeWidth="2">
          <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  ),
  security: () => (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <path
        d="M 100 20 L 150 40 L 150 90 Q 150 130 100 145 Q 50 130 50 90 L 50 40 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M 100 35 L 135 50 L 135 85 Q 135 115 100 128 Q 65 115 65 85 L 65 50 Z" fill="currentColor" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.2;0.1" dur="2s" repeatCount="indefinite" />
      </path>
      <rect x="85" y="70" width="30" height="25" rx="3" fill="currentColor" />
      <path
        d="M 90 70 L 90 60 Q 90 50 100 50 Q 110 50 110 60 L 110 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="100" cy="80" r="4" fill="white" />
      <rect x="98" y="82" width="4" height="8" fill="white" />
      <line x1="60" y1="60" x2="140" y2="60" stroke="currentColor" strokeWidth="1" opacity="0">
        <animate attributeName="y1" values="40;120;40" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y2" values="40;120;40" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite" />
      </line>
    </svg>
  ),
};

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

  const Visual = SVGVisuals[feature.visual as keyof typeof SVGVisuals] || SVGVisuals.deploy;

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col gap-8 border-b border-black/10 py-12 lg:flex-row lg:gap-16 lg:py-4">
        <div className="shrink-0">
          <span className="font-mono text-sm text-black/40">{feature.number}</span>
        </div>
        <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="mb-4 text-3xl font-display text-black transition-transform duration-500 group-hover:translate-x-2 lg:text-4xl">
              {feature.title}
            </h3>
            <p className="text-lg leading-relaxed text-black/72">
              {feature.description}
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="h-64 w-64 text-black/80">
              <Visual />
            </div>
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
              The problem nobody talks about honestly
            </span>
            <h2
              className={`text-4xl font-display tracking-tight text-black transition-all duration-700 lg:text-8xl ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Starting is no longer
              <br />
              <span className="text-black/45">the hard part.</span>
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
