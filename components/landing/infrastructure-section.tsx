"use client";

import { useEffect, useState, useRef } from "react";

const infraFacts = [
  {
    company: "Phoenix",
    stat: "2M WebSocket connections",
    detail: "one EC2 instance, 2ms latency, ~1KB per connection, no GC pauses",
    narrative: "Before this benchmark existed, the assumption was that real-time at this scale required purpose-built infrastructure. One EC2 instance proved the assumption wrong.",
  },
  {
    company: "Bleacher Report",
    stat: "150 servers → 5",
    detail: "equivalent peak traffic after moving to Elixir",
    narrative: "Rails across 150 servers, aggressively horizontally scaled to compensate for per-request threading overhead. After moving to Phoenix, the same spike traffic ran on five. The infrastructure cost reduction was approximately 95%.",
  },
  {
    company: "Pinterest",
    stat: "200 Python servers → 4 Elixir nodes",
    detail: "saving over $2M/year",
    narrative: "Pinterest was running 200 Python nodes to serve notification and activity systems. Four Elixir nodes replaced them. The BEAM process model handled the concurrency that required 200 servers of horizontal scale.",
  },
  {
    company: "Discord",
    stat: "Go → Elixir, same load",
    detail: "read states service rewrite — fan-out problem eliminated",
    narrative: "The Go service degraded under pressure and required constant operational intervention. Fan-out on high-follower users caused latency spikes across the service. The Elixir rewrite handled the same load with dramatically simpler operations — the supervision tree handled failures that previously required manual intervention.",
  },
  {
    company: "WhatsApp",
    stat: "2M connections per server",
    detail: "50 engineers, 500M users — on Erlang (BEAM's predecessor)",
    narrative: "The ratio of engineers to users was extraordinary. BEAM's concurrency model scales to connection counts that require dramatically more infrastructure in conventional runtimes. This is the extreme case — but it illustrates the fundamental property.",
  },
  {
    company: "Bet365",
    stat: "Financial transactions at scale",
    detail: "real-time odds, concurrent sessions, audit trail — all on BEAM",
    narrative: "Regulated domain requirements — consistency, audit trail, fault tolerance — are exactly the properties BEAM was designed for. When the failure of a transaction must be recorded, not silently lost, BEAM's design constraints align with what the domain requires.",
  },
  {
    company: "One engineering team",
    stat: "$16,000/mo → $150/mo",
    detail: "AWS Lambda → 3 Elixir nodes, 12M requests/hour",
    narrative: "Twelve million requests per hour on three Elixir nodes. The workload did not shrink — the infrastructure did.",
  },
  {
    company: "Auth service, Go → Elixir",
    stat: "12,000 → 8,500 lines",
    detail: "30% reduction in backend LOC — no Redis, no Kafka, no separate job processor",
    narrative: "Go implementation across 12,000 lines needed separate infrastructure for background jobs and message queuing. Elixir's built-in concurrency primitives eliminated that layer. Phoenix LiveView further collapsed the API boundary, turning three tiers of architecture into one.",
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
  "LLM-verifiable at compile time",
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
          <span className="font-mono text-lg text-[#A4471C] tracking-widest uppercase block mb-6">
            Why Elixir and Ash — the part that makes this defensible
          </span>
          <h2 className="text-4xl lg:text-6xl font-display font-semibold text-[#1B1B19] leading-[1.05] tracking-tight max-w-3xl">
            This is a deliberate stack bet, and it's the reason Foundry is hard to copy.
          </h2>
        </div>

        {/* Two-column: rationale + capabilities */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20 lg:mb-28">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-lg space-y-6 text-[#6B6860] leading-relaxed">
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
                This also matters for LLM-generated code. Elixir's immutability forces local reasoning — functions can't share state, so the model can't silently hallucinate a race condition. Pattern matching rejects data shapes that don't exist in the spec at compile time. ExUnit tests pass on first attempt because pure functions have no mock APIs to invent. AutoCodeBench measured 80.3% Pass@1 for Elixir on Claude Opus 4 — against roughly 50–53% for Python, Java, and C++. 97.5% of Elixir problems were solved by at least one model, the highest of any language in the study.
              </p>

            <p className="mt-3 text-lg text-[#6B6860]">
              Built on a runtime where LLMs get it right 80% of the time, versus 50% on any other language.
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

        {/* Resource paradox */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20 lg:mb-28">
          <div
            className={`transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="font-mono text-xs text-[#6B6860] tracking-widest uppercase block mb-6">
              The resource paradox
            </span>
            <h3 className="text-3xl lg:text-4xl font-display font-semibold text-[#1B1B19] leading-snug">
              Higher per-request overhead.<br />Dramatically lower bills.
            </h3>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-lg space-y-5 text-[#6B6860] leading-relaxed">
              <p>
                <strong className="text-[#1B1B19] font-semibold">BEAM processes cost 2–3KB each.</strong>{" "}
                An OS thread costs around 1MB. That difference — three orders of magnitude — is why a single BEAM node holds millions of concurrent processes while a Java or Go server exhausts its thread pool.
              </p>
              <p>
                Each process has its own heap and runs its own GC cycle. There are no stop-the-world pauses. A garbage collection in one process does not stall any others. Latency stays predictable at scale in a way that shared-heap runtimes cannot match.
              </p>
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
            <span className="font-mono text-xl text-[#6B6860] tracking-widest uppercase">
              These are not benchmarks. They are infrastructure bills.
            </span>
            <div className="flex-1 h-px bg-[#D8D2C8]" />
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[#D8D2C8]">
            {infraFacts.map((fact, index) => (
              <div
                key={fact.company}
                className={`bg-[#F5F1EA] p-8 lg:p-10 transition-all duration-700 ${
                  index === infraFacts.length - 1 && infraFacts.length % 2 !== 0 ? "md:col-span-2" : ""
                } ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${200 + index * 80}ms` }}
              >
                <p className="font-mono text-xl text-[#6B6860] mb-3">{fact.company}</p>
                <p className="text-2xl lg:text-3xl font-display font-semibold text-[#1B1B19] mb-2 leading-tight">
                  {fact.stat}
                </p>
                <p className="text-sm text-[#6B6860]">{fact.detail}</p>
                {fact.narrative && (
                  <p className="text-sm text-[#6B6860] mt-3 leading-snug border-t border-[#D8D2C8] pt-3">
                    {fact.narrative}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BEAM → Ash → Foundry synthesis */}
        <div
          className={`mt-16 lg:mt-24 max-w-3xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <p className="text-xl leading-relaxed text-[#6B6860] border-l-2 border-[#A4471C] pl-6">
            The BEAM removes the infrastructure layer. Ash removes the boilerplate layer. Foundry removes the knowledge layer — compile-time domain constraints, context-complete AI generation, and accumulated domain rules that fire at the moment a violation is about to be introduced.
          </p>
          <p className="text-lg leading-relaxed text-[#6B6860] border-l-2 border-[#A4471C] pl-6 mt-6">
            In practice, the layers compound. Phoenix LiveView collapses frontend component, state manager, REST endpoint, and DTO validation into one module. Pattern matching replaces blocks of nil-checks and type guards. GenServer replaces Redis plus connection pools plus a job processor. Teams migrating from TypeScript or Go cut backend LOC by 30–50% before counting the frontend delta. And the AI generates tests that pass on the first run, because pure functions need no mocks and ExUnit assertions match data shapes directly.
          </p>
        </div>
      </div>
    </section>
  );
}
