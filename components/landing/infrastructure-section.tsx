"use client";

import { useEffect, useState, useRef } from "react";

const infraFacts = [
  {
    company: "Phoenix",
    stat: "2M WebSocket connections",
    detail: "one EC2 instance, 2ms latency, ~1KB per connection, no GC pauses",
  },
  {
    company: "Bleacher Report",
    stat: "150 servers → 5",
    detail: "equivalent peak traffic after moving to Elixir",
  },
  {
    company: "Pinterest",
    stat: "200 Python servers → 4 Elixir nodes",
    detail: "saving over $2M/year",
  },
  {
    company: "One engineering team",
    stat: "$16,000/mo → $150/mo",
    detail: "AWS Lambda → 3 Elixir nodes, 12M requests/hour",
  },
];

const nativeCapabilities = [
  "Background jobs",
  "Pub/sub",
  "Real-time channels",
  "Distributed process state",
  "Clustering",
  "WebSocket connections",
  "Fault tolerance",
  "Hot code reloads",
];

export function InfrastructureSection() {
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
    <section ref={sectionRef} id="infrastructure" className="bg-[#F5F1EA] py-24 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`mb-20 lg:mb-28 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-mono text-xs text-[#A4471C] tracking-widest uppercase block mb-6">
            Why Elixir and Ash
          </span>
          <h2 className="text-4xl lg:text-6xl font-display font-semibold text-[#1B1B19] leading-[1.05] tracking-tight max-w-3xl">
            Foundry isn't a wrapper. It's a layer on top of a stack chosen deliberately.
          </h2>
        </div>

        {/* Two-column: rationale + capabilities */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20 lg:mb-28">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="space-y-6 text-[#6B6860] leading-relaxed">
              <p>
                <strong className="text-[#1B1B19] font-semibold">Ash</strong> is already declarative. Resources, actions, policies, and relationships are data, not code-shaped prose. That's why the graph is honest — there's no hidden imperative layer to misrepresent.
              </p>
              <p>
                <strong className="text-[#1B1B19] font-semibold">Elixir on the BEAM</strong> was built by Ericsson for telephone exchanges — systems that needed to run without failure under millions of concurrent connections. That requirement shaped every design decision in the runtime.
              </p>
              <p>
                Traditional stacks reach for external services — Redis for pub/sub, Kafka for message queuing, a separate job processor — because the runtime cannot handle these concerns natively. <strong className="text-[#1B1B19] font-semibold">The BEAM handles all of it inside the same runtime.</strong>
              </p>
              <p>
                You don't need to be an Elixir expert to use Foundry. But the floor is high because the substrate is good.
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="font-mono text-xs text-[#6B6860] tracking-widest uppercase mb-5">
              Native — not infrastructure you provision
            </p>
            <div className="flex flex-wrap gap-2">
              {nativeCapabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-3 py-1.5 border border-[#D8D2C8] text-sm text-[#1B1B19] font-mono"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Infrastructure bills — not benchmarks */}
        <div
          className={`transition-all duration-700 delay-150 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-xs text-[#6B6860] tracking-widest uppercase">
              These are not benchmarks. They are infrastructure bills.
            </span>
            <div className="flex-1 h-px bg-[#D8D2C8]" />
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[#D8D2C8]">
            {infraFacts.map((fact, index) => (
              <div
                key={fact.company}
                className={`bg-[#F5F1EA] p-8 lg:p-10 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${200 + index * 80}ms` }}
              >
                <p className="font-mono text-xs text-[#6B6860] mb-3">{fact.company}</p>
                <p className="text-2xl lg:text-3xl font-display font-semibold text-[#1B1B19] mb-2 leading-tight">
                  {fact.stat}
                </p>
                <p className="text-sm text-[#6B6860]">{fact.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
