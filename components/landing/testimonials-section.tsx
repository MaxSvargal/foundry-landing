"use client";

import { useEffect, useState, useRef } from "react";

const faqs = [
  {
    q: "Is this a low-code tool?",
    a: "No. The output is plain Ash code in your repo. If Foundry disappears, you still have an Elixir application. Low-code tools own the runtime. We don't.",
  },
  {
    q: "Does it work with my existing Elixir app?",
    a: "If you're using Ash, yes, immediately. If you're on raw Phoenix/Ecto, Foundry can read the parts that map cleanly, but the graph gets richer as you migrate to Ash. We don't force the migration.",
  },
  {
    q: "What about Python / TypeScript services we already have?",
    a: "They appear in the graph as external resources with typed boundaries (OpenAPI, Protobuf, JSON Schema). Foundry won't pretend to understand their internals, but it will track the contract.",
  },
  {
    q: "Won't the LLM hallucinate Ash code?",
    a: "Less than you'd expect — and structurally less than with TypeScript or Go. Elixir's pattern matching rejects hallucinated data shapes at compile time, not at runtime. Immutability means there's no shared state for the model to incorrectly assume. AutoCodeBench found Elixir scores 80.3% Pass@1 on Claude Opus 4 — roughly 30 percentage points above Python and Java. The benchmark authors note that low-resource languages may receive slightly easier test cases — read the 80.3% directionally rather than as an absolute ceiling. The structural reasons hold regardless. Beyond that: the agent doesn't write raw DSL. It produces a graph diff that Foundry validates against the actual Ash schema before anything reaches your codebase.",
  },
  {
    q: "How do you handle versioning?",
    a: "Git. Code is the source of truth, the graph is derived deterministically. Standard PR workflows. Schema-level migration tools (mix ash.codegen, ash_postgres) handle the database side.",
  },
  {
    q: "Can I host this myself?",
    a: "The CLI and graph are local-first. The SaaS — hosted history, team views, deploy — is opt-in and we publish a self-hosted edition for teams who need it.",
  },
  {
    q: "What's the catch?",
    a: "You're trusting Ash and the BEAM. Both have been load-bearing in production for over a decade. Neither is going anywhere. That's the bet.",
  },
];

function FaqItem({
  faq,
  index,
  isVisible,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isVisible: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border-b border-[#D8D2C8] transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left py-6 flex items-start justify-between gap-6 group"
      >
        <span className="text-base lg:text-lg font-display font-semibold text-[#1B1B19] leading-snug group-hover:text-[#A4471C] transition-colors duration-200">
          {faq.q}
        </span>
        <span
          className={`font-mono text-[#6B6860] text-sm shrink-0 mt-0.5 transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <p className="pb-6 text-[#6B6860] leading-relaxed">{faq.a}</p>
      )}
    </div>
  );
}

export function TestimonialsSection() {
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
    <>
      {/* FAQ Section */}
      <section
        ref={sectionRef}
        className="bg-[#F5F1EA] py-24 lg:py-40"
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="font-mono text-xs text-[#A4471C] tracking-widest uppercase block mb-6">
                FAQ
              </span>
              <h2 className="text-4xl lg:text-5xl font-display font-semibold text-[#1B1B19] leading-[1.05] tracking-tight">
                Handle the real objections,
                <br />
                <span className="text-[#1B1B19]/35">not the marketing ones.</span>
              </h2>
            </div>

            <div>
              {faqs.map((faq, index) => (
                <FaqItem
                  key={faq.q}
                  faq={faq}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* A Quiet Moment — off-grid, bordered honesty section */}
      {/* <section className="bg-[#F5F1EA] pb-24 lg:pb-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="border border-[#D8D2C8] p-10 lg:p-16 lg:ml-[8.333%] lg:mr-[8.333%]">
            <p className="font-mono text-xs text-[#6B6860] tracking-widest uppercase mb-6">
              A quiet moment
            </p>
            <h3 className="text-2xl lg:text-3xl font-display font-semibold text-[#1B1B19] mb-6">
              Foundry is not for everything.
            </h3>
            <div className="space-y-4 text-[#6B6860] leading-relaxed max-w-2xl">
              <p>We won't pretend otherwise.</p>
              <p>
                It's not for hard-real-time systems. Not for embedded BEAM. Not for CPU-bound workloads that don't cross a NIF boundary. Not for teams who want to ship in Python or Java — that's a different tool.
              </p>
              <p>
                It's also not magic. You still need taste, you still own your data model, and somewhere on your team you still want one person fluent in OTP for the day the 10% hits.
              </p>
              <p className="text-[#1B1B19]">
                Or you can buy that fluency from us. We staff senior BEAM engineers on the support tier. That's part of the product.
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}
