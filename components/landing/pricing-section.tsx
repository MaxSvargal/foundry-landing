"use client";

import { useState } from "react";

const plans = [
  {
    index: "01",
    name: "Open Source",
    description: "The full Foundry, yours to own.",
    price: { monthly: 0, annual: 0 },
    features: [
      "Own Ash + Phoenix + Oban stack",
      "Spec-driven methodology",
      "Governance linter",
      "System map generation",
      "Behavior test visual tracing",
      "Basic copilot agent",
      "Community support",
    ],
    cta: "View on GitHub",
    ctaHref: "#",
    highlight: false,
  },
  {
    index: "02",
    name: "Team",
    description: "The governed copilot for teams building complex domains.",
    price: { monthly: 49, annual: 39 },
    features: [
      "Everything in Open Source",
      "Extended governed AI copilot",
      "Cloud infrastructure — 1 instance",
      "1 CPU, 512 MB RAM, 1 GB Postgres",
      "Priority support",
    ],
    cta: "Start trial",
    ctaHref: "#",
    highlight: true,
  },
  {
    index: "03",
    name: "Enterprise",
    description: "For regulated platforms and complex organisations.",
    price: { monthly: null, annual: null },
    features: [
      "Everything in Team",
      "Dedicated domain architect",
      "Branch-first proposals",
      "On-premise deployment",
      "SLA guarantee",
      "Custom contracts",
    ],
    cta: "Talk to us",
    ctaHref: "#",
    highlight: false,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="bg-[#1B1B19] py-24 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="font-mono text-xs text-[#A4471C] tracking-widest uppercase block mb-6">
            Pricing
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2 className="text-4xl lg:text-7xl font-display font-semibold text-[#F5F1EA] leading-[1.05] tracking-tight">
              Open source core.
              <br />
              <span className="text-[#F5F1EA]/35">Governed copilot.</span>
            </h2>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center gap-4 mb-12">
          <span className={`text-sm transition-colors ${!isAnnual ? "text-[#F5F1EA]" : "text-[#F5F1EA]/40"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-12 h-6 bg-[#F5F1EA]/15 p-0.5 transition-colors hover:bg-[#F5F1EA]/20"
          >
            <div
              className={`w-5 h-5 bg-[#F5F1EA] transition-transform duration-300 ${
                isAnnual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm transition-colors ${isAnnual ? "text-[#F5F1EA]" : "text-[#F5F1EA]/40"}`}>
            Annual
          </span>
          {isAnnual && (
            <span className="font-mono text-xs text-[#A4471C] border border-[#A4471C]/40 px-2 py-0.5">
              save 17%
            </span>
          )}
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-px bg-[#F5F1EA]/10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 lg:p-10 flex flex-col ${
                plan.highlight
                  ? "bg-[#F5F1EA] text-[#1B1B19]"
                  : "bg-[#1B1B19] text-[#F5F1EA]"
              }`}
            >
              {/* Plan header */}
              <div className="mb-8">
                <span className={`font-mono text-xs tracking-widest ${plan.highlight ? "text-[#A4471C]" : "text-[#F5F1EA]/30"}`}>
                  {plan.index}
                </span>
                <h3 className="text-2xl font-display font-semibold mt-2 mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.highlight ? "text-[#6B6860]" : "text-[#F5F1EA]/45"}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className={`pb-8 mb-8 border-b ${plan.highlight ? "border-[#D8D2C8]" : "border-[#F5F1EA]/10"}`}>
                {plan.price.monthly !== null ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-display font-semibold">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className={`text-sm ${plan.highlight ? "text-[#6B6860]" : "text-[#F5F1EA]/40"}`}>
                      /month
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-display font-semibold">Custom</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <span className={`font-mono mt-0.5 shrink-0 ${plan.highlight ? "text-[#A4471C]" : "text-[#F5F1EA]/30"}`}>
                      —
                    </span>
                    <span className={plan.highlight ? "text-[#6B6860]" : "text-[#F5F1EA]/55"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.ctaHref}
                className={`flex items-center justify-center py-3.5 text-sm font-medium transition-all duration-200 ${
                  plan.highlight
                    ? "bg-[#1B1B19] text-[#F5F1EA] hover:bg-[#1B1B19]/85"
                    : "border border-[#F5F1EA]/20 text-[#F5F1EA] hover:border-[#F5F1EA]/50 hover:bg-[#F5F1EA]/5"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
