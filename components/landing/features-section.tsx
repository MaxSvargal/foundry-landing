"use client";

import { useEffect, useRef, useState } from "react";

const problems = [
  {
    number: "01",
    title: "Constraints live in heads, not code.",
    description:
      "The reason a resource is sensitive exists in one person's memory and nowhere else. When that person leaves, the constraint vanishes. Foundry makes constraints executable — they live in the spec-kit and the linter fires when they're violated.",
  },
  {
    number: "02",
    title: "Documentation drifts from reality.",
    description:
      "The diagram drawn in week one describes a system that no longer exists. In Foundry, the system map is not inferred from code — it is the code. A lossless rendering generated from the same source the compiler validates. It cannot drift.",
  },
  {
    number: "03",
    title: "AI tools generate from training, not your domain.",
    description:
      "The copilot doesn't know your invariants. Foundry's copilot is different — it reads your domain model live from the compiler, your ADRs, your compliance links, and your sensitivity classifications before proposing anything.",
  },
  {
    number: "04",
    title: "Change is invisible until production.",
    description:
      "Nobody knew that modifying this action would break three downstream compliance obligations. Foundry proposes on a branch, classifies the change as :structural, :behavioral, or :compliance, and routes it to the right approver before anything merges.",
  },
];

function ProblemRow({
  problem,
  index,
}: {
  problem: (typeof problems)[0];
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className={`grid grid-cols-[3rem_1fr] lg:grid-cols-[5rem_1fr_1fr] gap-6 lg:gap-12 py-10 lg:py-14 border-b border-[#D8D2C8] transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="pt-1">
        <span className="font-mono text-xs text-[#A4471C] tracking-wider">{problem.number}</span>
      </div>
      <div className="lg:col-span-1">
        <h3 className="text-xl lg:text-2xl font-display font-semibold text-[#1B1B19] leading-snug">
          {problem.title}
        </h3>
      </div>
      <div className="col-start-2 lg:col-start-3">
        <p className="text-lg leading-relaxed text-[#6B6860]">{problem.description}</p>
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
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="bg-[#F5F1EA] py-24 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Bridging paragraph */}
        <div
          className={`max-w-2xl mb-20 lg:mb-28 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-xl lg:text-xl leading-relaxed text-[#6B6860] border-l-2 border-[#A4471C] pl-6">
            Starting is no longer the hard part. An AI tool scaffolds a working application in an afternoon. The first demo runs. The database schema looks reasonable. Everyone is optimistic.
            <br /><br />
            Then the system grows.
          </p>
        </div>

        {/* Section label */}
        <div
          className={`flex items-center gap-4 mb-12 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="font-mono text-xs text-[#6B6860] tracking-widest uppercase">
            This happens because
          </span>
          <div className="flex-1 h-px bg-[#D8D2C8]" />
        </div>

        {/* Problem list */}
        <div>
          {problems.map((problem, index) => (
            <ProblemRow key={problem.number} problem={problem} index={index} />
          ))}
        </div>

        {/* Closing statement */}
        <div
          className={`text-center mt-20 lg:mt-28 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-3xl lg:text-4xl font-display font-semibold text-[#1B1B19] leading-snug">
            The map of your software lives in five places, none of them current.
          </p>
          <p className="mt-4 text-2xl lg:text-3xl font-display text-[#A4471C]">
            Foundry collapses it to one.
          </p>
        </div>
      </div>
    </section>
  );
}
