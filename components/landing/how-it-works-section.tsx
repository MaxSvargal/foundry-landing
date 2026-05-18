"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Declare your domain.",
    description:
      "Write resources and actions in Ash. Subscription, Order, Invoice — the things, and what can be done to them. What code cannot express — decisions, rationale, compliance obligations — lives in a structured spec-kit that the linter keeps honest.",
    code: `defmodule Billing.Subscription do
  use Ash.Resource

  actions do
    update :upgrade do
      change Billing.Changes.ProrateAndCharge
      require_atomic? false
    end
  end

  invariants do
    invariant :balance_non_negative,
      expr(balance >= 0)
  end
end`,
    filename: "billing/subscription.ex",
  },
  {
    number: "02",
    title: "Foundry reflects it.",
    description:
      "Every action, policy, relationship, and external boundary becomes a node. Every call, dependency, and data flow becomes an edge. The map is not a diagram someone drew once — it is a live, interactive graph that tells the truth about what is running in production.",
    code: `# System map — derived from compiler output
# Not a diagram. Not documentation.
# The code, rendered as a graph.

Billing.Subscription
  ├── actions
  │   └── :upgrade → ProrateAndCharge
  ├── invariants
  │   └── :balance_non_negative
  ├── policies
  │   └── :read → actor_is_owner
  └── relationships
      ├── belongs_to :customer
      └── has_many :invoices`,
    filename: "foundry graph",
  },
  {
    number: "03",
    title: "Edit through the graph or through code.",
    description:
      "Ask the copilot for a change in plain language. It reads your domain model live from the compiler — every resource, every action, every policy — plus your ADRs and invariants. It proposes on a branch. It never touches your working tree.",
    code: `you: Add a spending limit rule to the
     withdrawal reactor. UK players,
     £500 daily.

copilot: Checking spec-kit for
         WithdrawalReactor…
         found RG-UK-014 and ADR-005.

         :behavioral change —
         domain lead approval required.

         Plan: draft ADR → generate 3
         BDD scenarios → add
         SpendingLimitRule → open
         review panel.

         Confirm?`,
    filename: "copilot.log",
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="bg-[#1B1B19] py-24 lg:py-40"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`mb-20 lg:mb-28 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-mono text-lg text-[#A4471C] tracking-widest uppercase block mb-6">
            How it works — three steps, no more
          </span>
          <h2 className="text-4xl lg:text-6xl font-display font-semibold text-[#F5F1EA] leading-[1.05] tracking-tight">
            One source of truth.
            <br />
            <span className="text-[#F5F1EA]/40">Everything derives from it.</span>
          </h2>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Steps */}
          <div>
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-full text-left py-8 border-b border-[#F5F1EA]/10 transition-all duration-400 group ${
                  activeStep === index
                    ? "opacity-100"
                    : "opacity-35 hover:opacity-60"
                }`}
              >
                <div className="flex items-start gap-6">
                  <span className="font-mono text-xs text-[#A4471C] tracking-wider pt-1.5">
                    {step.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl font-display font-semibold text-[#F5F1EA] mb-3 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[#F5F1EA]/55 leading-relaxed text-sm lg:text-base">
                      {step.description}
                    </p>

                    {activeStep === index && (
                      <div className="mt-5 h-px bg-[#F5F1EA]/10 overflow-hidden">
                        <div
                          className="h-full bg-[#A4471C]"
                          style={{ animation: "howItWorksProgress 6s linear forwards" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Code panel */}
          <div className="lg:sticky lg:top-32 self-start">
            <div className="border border-[#F5F1EA]/10">
              {/* Window bar */}
              <div className="px-5 py-3 border-b border-[#F5F1EA]/10 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F5F1EA]/15" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F5F1EA]/15" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F5F1EA]/15" />
                </div>
                <span className="font-mono text-[11px] text-[#F5F1EA]/30">
                  {steps[activeStep].filename}
                </span>
              </div>

              {/* Code */}
              <div className="p-6 lg:p-8 min-h-[280px] overflow-x-auto">
                <pre className="font-mono text-xs lg:text-sm leading-relaxed text-[#F5F1EA]/65 whitespace-pre">
                  {steps[activeStep].code}
                </pre>
              </div>

              {/* Status bar */}
              <div className="px-5 py-3 border-t border-[#F5F1EA]/10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="font-mono text-[11px] text-[#F5F1EA]/30">
                  {steps[activeStep].number === "01"
                    ? "mix compile — 0 errors"
                    : steps[activeStep].number === "02"
                    ? "foundry graph — live"
                    : "awaiting confirmation"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes howItWorksProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
