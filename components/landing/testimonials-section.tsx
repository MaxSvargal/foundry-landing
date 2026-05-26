"use client";

import { useEffect, useState, useRef } from "react";

const faqs = [
  {
    q: "Is this a low-code platform?",
    a: "No. Output is plain Ash code you own. Low-code platforms own the runtime; Foundry doesn't. Your app runs on plain BEAM with or without us.",
  },
  {
    q: "Won't the agent hallucinate?",
    a: "It doesn't just write raw DSL into your repo. It produces a graph diff, validated against your real schema. Invalid structure never compiles into your codebase.",
  },
  {
    q: "Is the \"ten minutes\" real?",
    a: "Yes, and it's the whole loop: ask, live preview, review the graph diff and traces, fix, commit, deploy. A real change you reviewed and shipped.",
  },
  {
    q: "Does it work with my existing Elixir app?",
    a: "If you're on Ash, mostly immediately. On raw Phoenix/Ecto, Foundry reads what maps cleanly and gets richer as you adopt Ash. No forced migration.",
  },
  {
    q: "What about our Python / TypeScript services?",
    a: "They appear in the graph as external resources with typed contracts. Foundry tracks the boundary; it won't pretend to understand their internals.",
  },
  {
    q: "How do you handle versioning and collaboration?",
    a: "Git and Phoenix LiveView. Code is the source of truth, the graph is derived deterministically, standard PR workflows apply. Multi-user graph editing in Foundry Cloud builds on the same foundation.",
  },
  {
    q: "Where does Foundry Cloud deploy?",
    a: "Into a Foundry-managed environment. You deploy your app; we run the infrastructure under it. The open-source platform stays fully usable on its own.",
  },
  {
    q: "What's the catch?",
    a: "You're betting on Elixir, Ash, and the BEAM. All three have been load-bearing in production for over a decade. That's the bet — and we think it's the right one for software meant to last.",
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
        <p className="pb-6 text-md leading-relaxed">{faq.a}</p>
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
        <div className="max-w-350 mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2">
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="font-mono text-2xl text-[#A4471C] tracking-widest uppercase block mb-4">
                FAQ
              </span>
              <h2 className="text-4xl lg:text-5xl font-display font-semibold text-[#1B1B19] leading-[1.05] tracking-tight">
                What Foundry is.
              </h2>
            </div>

            <div className="flex-2">
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
