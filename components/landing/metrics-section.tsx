"use client";

import { useEffect, useState, useRef } from "react";

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1800;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="text-5xl lg:text-7xl font-display font-semibold tracking-tight text-[#1B1B19] leading-none">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

const metrics = [
  {
    value: 90,
    suffix: "%",
    prefix: "",
    label: "increase in AI tool adoption",
    source: "Google DORA 2025",
  },
  {
    value: 9,
    suffix: "%",
    prefix: "+",
    label: "rise in bug rates correlated with that adoption",
    source: "Google DORA 2025",
  },
  {
    value: 91,
    suffix: "%",
    prefix: "+",
    label: "increase in code review time alongside AI adoption",
    source: "Google DORA 2025",
  },
  {
    value: 2,
    suffix: "×",
    prefix: "",
    label: "AI-assisted code churn doubled",
    source: "GitClear research",
  },
  {
    value: 80,
    suffix: ".3%",
    prefix: "",
    label: "LLM Pass@1 on Elixir — highest of any language in AutoCodeBench",
    source: "AutoCodeBench / Claude Opus 4",
  },
];

export function MetricsSection() {
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
      id="studio"
      ref={sectionRef}
      className="bg-[#1B1B19] py-24 lg:py-40"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`mb-20 lg:mb-28 grid lg:grid-cols-2 gap-12 lg:gap-24 items-end transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <span className="font-mono text-xs text-[#A4471C] tracking-widest uppercase block mb-6">
              The numbers
            </span>
            <h2 className="text-4xl lg:text-6xl font-display font-semibold text-[#F5F1EA] leading-[1.05] tracking-tight">
              AI adoption is rising.
              <br />
              <span className="text-[#F5F1EA]/40">So are bug rates. Elixir is the exception.</span>
            </h2>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-px bg-[#F5F1EA]/10">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`bg-[#1B1B19] p-8 lg:p-12 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <AnimatedCounter
                end={metric.value}
                suffix={metric.suffix}
                prefix={metric.prefix}
              />
              <p className="mt-4 text-base text-[#F5F1EA]/55 leading-snug">{metric.label}</p>
              <p className="mt-2 font-mono text-xs text-[#F5F1EA]/25">{metric.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
