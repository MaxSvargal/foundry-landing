"use client";

import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
// @ts-ignore
import coseBilkent from "cytoscape-cose-bilkent";
import type { Core, ElementDefinition } from "cytoscape";

if (typeof window !== "undefined") {
  try {
    cytoscape.use(coseBilkent);
  } catch {
    // already registered
  }
}

const steps = [
  {
    number: "I",
    title: "Your domain as a live graph",
    description:
      "The system map is extracted directly from your Ash code by the compiler. Every node is a resource. Every edge is a relationship or side effect.",
  },
  {
    number: "II",
    title: "Click a node. See everything.",
    description:
      "Click any resource to open the details panel. You see its code, tests, linked ADRs, compliance rules, and test coverage.",
  },
  {
    number: "III",
    title: "Tests light up the map",
    description:
      "Run a test. The execution path highlights on the graph. You see every node touched, in order, with side effects.",
  },
  {
    number: "IV",
    title: "Copilot reads your domain",
    description:
      "Ask for a feature. The copilot reads your live domain model, finds constraints, and proposes on a branch with blast radius shown.",
  },
];

// Activity feed event cards per scene
const activityFeedScenes = [
  // Scene I — idle
  [] as ActivityEvent[],
  // Scene II — node detail open
  [
    {
      id: "a1",
      kind: "info" as const,
      title: "WithdrawalTransfer selected",
      body: "5 actions · ADR-005 · RG-UK-014",
    },
  ],
  // Scene III — test trace
  [
    {
      id: "b1",
      kind: "success" as const,
      title: "Test run complete",
      body: "3 scenarios traced across Finance domain",
    },
    {
      id: "b2",
      kind: "coverage" as const,
      title: "Coverage: 87%",
      body: "WithdrawalTransfer fully covered",
    },
  ],
  // Scene IV — copilot proposal
  [
    {
      id: "c1",
      kind: "user" as const,
      title: "You",
      body: "Add a spending limit to withdrawals. UK players, £500 daily.",
    },
    {
      id: "c2",
      kind: "thinking" as const,
      title: "Foundry Copilot",
      body: "Analyzing WithdrawalReactor… checking ADRs and compliance…",
    },
    {
      id: "c3",
      kind: "proposal" as const,
      title: "Proposal ready",
      body: ":behavioral change · Domain lead approval required · 3 BDD scenarios generated",
      badge: ":behavioral",
    },
  ],
];

interface ActivityEvent {
  id: string;
  kind: "info" | "success" | "coverage" | "user" | "thinking" | "proposal";
  title: string;
  body: string;
  badge?: string;
}

// Detail drawer data for WithdrawalTransfer (shown in scenes II+)
const drawerDetail = {
  name: "WithdrawalTransfer",
  type: "transfer",
  actions: [
    { name: "initiate", badge: "write" },
    { name: "verify_limit", badge: "read" },
    { name: "execute", badge: "write" },
    { name: "settle", badge: "write" },
    { name: "rollback", badge: "write" },
  ],
  compliance: ["RG-UK-014"],
  adrs: ["ADR-005"],
  coverage: 87,
};

function ActivityFeed({
  events,
  sceneIndex,
}: {
  events: ActivityEvent[];
  sceneIndex: number;
}) {
  return (
    <div className="w-64 shrink-0 border-l border-white/5 bg-[#13131A] flex flex-col text-xs">
      {/* Header */}
      <div className="border-b border-white/5 px-3 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A4471C]" />
          <span className="text-xs font-semibold text-white/80 font-mono">
            Activity Feed
          </span>
        </div>
      </div>

      {/* Events */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {events.length === 0 && (
          <p className="text-white/25 text-xs font-mono mt-4 text-center leading-relaxed">
            Ask a question or describe a change…
          </p>
        )}
        {events.map((ev) => (
          <div
            key={ev.id}
            className={`rounded border p-2 space-y-1 text-xs font-mono ${
              ev.kind === "user"
                ? "bg-[#A4471C]/15 border-[#A4471C]/30"
                : ev.kind === "thinking"
                ? "bg-white/5 border-white/10 animate-pulse"
                : ev.kind === "proposal"
                ? "bg-[#1E1A2E] border-purple-500/30"
                : ev.kind === "success"
                ? "bg-[#0E1E12] border-green-500/30"
                : ev.kind === "coverage"
                ? "bg-[#1A1A0E] border-yellow-500/30"
                : "bg-white/5 border-white/10"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span
                className={`font-semibold truncate ${
                  ev.kind === "user"
                    ? "text-[#A4471C]"
                    : ev.kind === "proposal"
                    ? "text-purple-400"
                    : ev.kind === "success"
                    ? "text-green-400"
                    : ev.kind === "coverage"
                    ? "text-yellow-400"
                    : "text-white/60"
                }`}
              >
                {ev.title}
              </span>
              {ev.badge && (
                <span className="shrink-0 px-1 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {ev.badge}
                </span>
              )}
            </div>
            <p className="text-white/50 leading-relaxed">{ev.body}</p>
            {ev.kind === "proposal" && (
              <button className="mt-1 w-full text-center py-1 rounded bg-[#A4471C]/30 border border-[#A4471C]/40 text-[#A4471C] text-xs font-semibold hover:bg-[#A4471C]/50 transition-colors">
                Review →
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-white/5 p-2 shrink-0">
        <div className="flex gap-1 items-center bg-white/5 rounded border border-white/10 px-2 py-1">
          <input
            type="text"
            placeholder="Ask anything…"
            className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none font-mono"
            readOnly
          />
          <span className="text-white/30 text-xs">↑</span>
        </div>
      </div>
    </div>
  );
}

function DetailDrawer({
  visible,
  sceneIndex,
}: {
  visible: boolean;
  sceneIndex: number;
}) {
  return (
    <div
      className={`w-72 shrink-0 border-r border-white/5 bg-[#13131A] flex flex-col text-xs transition-all duration-500 overflow-hidden ${
        visible ? "opacity-100" : "opacity-0 w-0"
      }`}
      style={{ width: visible ? "18rem" : 0 }}
    >
      {/* Header */}
      <div className="border-b border-white/5 px-3 py-2.5 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-green-500/15 text-green-400 border border-green-500/25">
            transfer
          </span>
          <span className="text-white/30 text-xs">Finance</span>
        </div>
        <h3 className="text-sm font-semibold text-white font-mono">
          {drawerDetail.name}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
        {/* Actions */}
        <div>
          <p className="text-white/40 uppercase tracking-widest text-xs mb-1.5 font-mono">
            Actions
          </p>
          <div className="space-y-1">
            {drawerDetail.actions.map((a) => (
              <div
                key={a.name}
                className="flex items-center justify-between px-2 py-1 rounded bg-white/5 border border-white/5"
              >
                <span className="font-mono text-white/80 text-xs">
                  {a.name}
                </span>
                <span
                  className={`px-1 py-0.5 rounded text-xs font-mono ${
                    a.badge === "write"
                      ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                      : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {a.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <div>
          <p className="text-white/40 uppercase tracking-widest text-xs mb-1.5 font-mono">
            Compliance
          </p>
          <div className="space-y-1">
            {drawerDetail.compliance.map((c) => (
              <div
                key={c}
                className="px-2 py-1 rounded bg-white/5 border-l-2 border-[#A4471C] font-mono text-white/70 text-xs"
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* ADRs */}
        <div>
          <p className="text-white/40 uppercase tracking-widest text-xs mb-1.5 font-mono">
            Linked ADRs
          </p>
          <div className="space-y-1">
            {drawerDetail.adrs.map((a) => (
              <div
                key={a}
                className="px-2 py-1 rounded bg-white/5 border-l-2 border-blue-500/50 font-mono text-white/70 text-xs"
              >
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Coverage */}
        <div>
          <p className="text-white/40 uppercase tracking-widest text-xs mb-1.5 font-mono">
            Test Coverage
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${drawerDetail.coverage}%` }}
              />
            </div>
            <span className="text-green-400 font-mono text-xs font-semibold">
              {drawerDetail.coverage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const ELEMENTS: ElementDefinition[] = [
  // Finance domain
  {
    data: { id: "domain-finance", label: "Finance", type: "domain", domainColor: "#3B82F6" },
    classes: "domain",
  },
  {
    data: { id: "wallet", label: "Wallet", type: "resource", parent: "domain-finance" },
    classes: "resource",
  },
  {
    data: { id: "withdrawal-request", label: "WithdrawalRequest", type: "resource", parent: "domain-finance" },
    classes: "resource",
  },
  {
    data: { id: "sufficient-balance", label: "SufficientBalance", type: "rule", parent: "domain-finance" },
    classes: "rule",
  },
  {
    data: { id: "limit-rule", label: "WithdrawalLimitNotExceeded", type: "rule", parent: "domain-finance" },
    classes: "rule",
  },
  {
    data: { id: "withdrawal-transfer", label: "WithdrawalTransfer", type: "transfer", parent: "domain-finance" },
    classes: "transfer",
  },
  {
    data: { id: "billing-reactor", label: "BillingReactor", type: "reactor", parent: "domain-finance" },
    classes: "reactor",
  },

  // Players domain
  {
    data: { id: "domain-players", label: "Players", type: "domain", domainColor: "#A855F7" },
    classes: "domain",
  },
  {
    data: { id: "player", label: "Player", type: "resource", parent: "domain-players" },
    classes: "resource",
  },
  {
    data: { id: "kyc", label: "KycVerification", type: "resource", parent: "domain-players" },
    classes: "resource",
  },
  {
    data: { id: "self-exclusion", label: "SelfExclusion", type: "rule", parent: "domain-players" },
    classes: "rule",
  },

  // Compliance domain
  {
    data: { id: "domain-compliance", label: "Compliance", type: "domain", domainColor: "#EAB308" },
    classes: "domain",
  },
  {
    data: { id: "audit-log", label: "AuditLog", type: "resource", parent: "domain-compliance" },
    classes: "resource",
  },
  {
    data: { id: "compliance-rule", label: "ComplianceRule", type: "resource", parent: "domain-compliance" },
    classes: "resource",
  },

  // External
  {
    data: { id: "stripe-gateway", label: "StripeGateway", type: "external" },
    classes: "external",
  },

  // Edges
  { data: { source: "withdrawal-request", target: "wallet" }, classes: "read" },
  { data: { source: "sufficient-balance", target: "wallet" }, classes: "guard" },
  { data: { source: "limit-rule", target: "withdrawal-request" }, classes: "guard" },
  { data: { source: "withdrawal-transfer", target: "withdrawal-request" }, classes: "write" },
  { data: { source: "billing-reactor", target: "wallet" }, classes: "write" },
  { data: { source: "billing-reactor", target: "audit-log" }, classes: "write" },
  { data: { source: "withdrawal-transfer", target: "stripe-gateway" }, classes: "external-edge" },
  { data: { source: "player", target: "kyc" }, classes: "read" },
  { data: { source: "self-exclusion", target: "player" }, classes: "guard" },
  { data: { source: "withdrawal-request", target: "player" }, classes: "read" },
  { data: { source: "compliance-rule", target: "audit-log" }, classes: "write" },
  { data: { source: "billing-reactor", target: "compliance-rule" }, classes: "read" },
];

// Nodes that get highlighted in scene III trace
const TRACE_NODES = ["withdrawal-request", "sufficient-balance", "withdrawal-transfer", "audit-log"];
const TRACE_EDGES_PAIRS: [string, string][] = [
  ["withdrawal-request", "wallet"],
  ["sufficient-balance", "wallet"],
  ["withdrawal-transfer", "withdrawal-request"],
  ["billing-reactor", "audit-log"],
];

function CytoscapeGraph({ sceneIndex }: { sceneIndex: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Init graph once
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: ELEMENTS,
      style: [
        // Base node
        {
          selector: "node",
          style: {
            "background-color": "#2A2A32",
            "border-color": "rgba(255,255,255,0.18)",
            "border-width": 1.5,
            "shape": "round-rectangle",
            "width": 84,
            "height": 32,
            "text-valign": "center",
            "text-halign": "center",
            "font-size": 8,
            "font-family": "monospace",
            "color": "rgba(255,255,255,0.75)",
            "text-max-width": "76px",
            "text-wrap": "ellipsis",
            "label": "data(label)",
          },
        },
        // Domain compound
        {
          selector: "node.domain",
          style: {
            "background-color": "rgba(255,255,255,0.02)",
            "border-color": "rgba(255,255,255,0.08)",
            "border-width": 1,
            "border-style": "dashed",
            "font-size": 9,
            "font-weight": "bold",
            "color": "rgba(255,255,255,0.25)",
            "text-valign": "top",
            "text-halign": "center",
            "text-margin-y": -4,
            "padding": "18px",
            "min-width": "180px",
            "min-height": "100px",
            "shape": "round-rectangle",
          },
        },
        // Resource — blue border
        {
          selector: "node.resource",
          style: {
            "border-color": "#3B82F6",
            "border-width": 1.5,
          },
        },
        // Transfer — green border
        {
          selector: "node.transfer",
          style: {
            "border-color": "#22C55E",
            "border-width": 1.5,
          },
        },
        // Reactor — purple border
        {
          selector: "node.reactor",
          style: {
            "border-color": "#A855F7",
            "border-width": 1.5,
          },
        },
        // Rule — yellow border
        {
          selector: "node.rule",
          style: {
            "border-color": "#EAB308",
            "border-width": 1.5,
          },
        },
        // External — teal dashed
        {
          selector: "node.external",
          style: {
            "border-color": "#2DD4BF",
            "border-width": 1.5,
            "border-style": "dashed",
            "background-color": "#1A2A2A",
            "opacity": 0.75,
          },
        },
        // Highlighted (scene II selected)
        {
          selector: "node.highlighted",
          style: {
            "background-color": "#1E2A1E",
            "border-color": "#22C55E",
            "border-width": 2.5,
            "color": "rgba(255,255,255,0.95)",
            "z-index": 999,
          },
        },
        // Trace nodes (scene III)
        {
          selector: "node.trace",
          style: {
            "background-color": "#2A1A0E",
            "border-color": "#A4471C",
            "border-width": 2.5,
            "color": "rgba(255,255,255,0.95)",
            "z-index": 998,
          },
        },
        // Dimmed (scene III non-trace)
        {
          selector: "node.dimmed",
          style: {
            "opacity": 0.15,
          },
        },
        // Base edge
        {
          selector: "edge",
          style: {
            "line-color": "rgba(255,255,255,0.12)",
            "width": 1,
            "curve-style": "bezier",
            "target-arrow-shape": "none",
            "opacity": 0.6,
          },
        },
        {
          selector: "edge.read",
          style: {
            "line-color": "rgba(59,130,246,0.3)",
            "target-arrow-shape": "none",
          },
        },
        {
          selector: "edge.write",
          style: {
            "line-color": "rgba(249,115,22,0.45)",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "rgba(249,115,22,0.45)",
            "arrow-scale": 0.8,
          },
        },
        {
          selector: "edge.guard",
          style: {
            "line-color": "rgba(234,179,8,0.35)",
            "line-style": "dotted",
            "target-arrow-shape": "none",
          },
        },
        {
          selector: "edge.external-edge",
          style: {
            "line-color": "rgba(45,212,191,0.3)",
            "line-style": "dashed",
            "line-dash-pattern": [4, 4],
            "target-arrow-shape": "triangle",
            "target-arrow-color": "rgba(45,212,191,0.3)",
            "arrow-scale": 0.7,
          },
        },
        // Trace edges
        {
          selector: "edge.trace",
          style: {
            "line-color": "#A4471C",
            "width": 2.5,
            "line-style": "solid",
            "target-arrow-color": "#A4471C",
            "target-arrow-shape": "triangle",
            "arrow-scale": 0.9,
            "opacity": 1,
            "z-index": 10,
          },
        },
        {
          selector: "edge.dimmed",
          style: {
            "opacity": 0.08,
          },
        },
      ],
      layout: {
        name: "cose-bilkent",
        // @ts-ignore
        idealEdgeLength: 70,
        // @ts-ignore
        nodeRepulsion: 5000,
        // @ts-ignore
        gravity: 0.35,
        // @ts-ignore
        nestingFactor: 0.4,
        padding: 36,
        animate: false,
        fit: true,
      },
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  // React to scene changes
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // Reset all classes
    cy.elements().removeClass("highlighted trace dimmed");

    if (sceneIndex === 0) {
      // Scene I: fit full graph
      cy.animate(
        { fit: { eles: cy.elements(), padding: 36 } },
        { duration: 700, easing: "ease-in-out-cubic" }
      );
    } else if (sceneIndex === 1) {
      // Scene II: zoom Finance cluster, highlight WithdrawalTransfer
      cy.$('#withdrawal-transfer').addClass("highlighted");
      cy.animate(
        {
          fit: {
            eles: cy.$("#domain-finance").union(cy.$(".external")),
            padding: 60,
          },
        },
        { duration: 700, easing: "ease-in-out-cubic" }
      );
    } else if (sceneIndex === 2) {
      // Scene III: trace path, dim others
      const traceSet = cy.collection();
      TRACE_NODES.forEach((id) => {
        const node = cy.$(`#${id}`);
        node.addClass("trace");
        traceSet.merge(node);
      });
      TRACE_EDGES_PAIRS.forEach(([src, tgt]) => {
        cy.$(`#${src}`).edgesWith(`#${tgt}`).addClass("trace");
      });
      // Dim non-trace leaves (not domain parents)
      cy.nodes(":childless").forEach((n) => {
        if (!n.hasClass("trace")) n.addClass("dimmed");
      });
      cy.edges().forEach((e) => {
        if (!e.hasClass("trace")) e.addClass("dimmed");
      });
      cy.animate(
        {
          fit: {
            eles: cy.$(".trace"),
            padding: 80,
          },
        },
        { duration: 700, easing: "ease-in-out-cubic" }
      );
    } else if (sceneIndex === 3) {
      // Scene IV: same trace + activity feed shows proposal
      TRACE_NODES.forEach((id) => {
        cy.$(`#${id}`).addClass("trace");
      });
      TRACE_EDGES_PAIRS.forEach(([src, tgt]) => {
        cy.$(`#${src}`).edgesWith(`#${tgt}`).addClass("trace");
      });
      cy.nodes(":childless").forEach((n) => {
        if (!n.hasClass("trace")) n.addClass("dimmed");
      });
      cy.edges().forEach((e) => {
        if (!e.hasClass("trace")) e.addClass("dimmed");
      });
      cy.animate(
        {
          fit: { eles: cy.$(".trace"), padding: 80 },
        },
        { duration: 700, easing: "ease-in-out-cubic" }
      );
    }
  }, [sceneIndex]);

  return <div ref={containerRef} className="flex-1 bg-[#0E0E12] overflow-hidden" />;
}

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    autoplayRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isVisible]);

  const showDrawer = activeStep >= 1;
  const feedEvents = activityFeedScenes[activeStep];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-40 bg-foreground text-background overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-background/60 mb-4">
            <span className="h-px w-8 bg-background/20" />
            Interactive walkthrough
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-semibold text-background mb-3 leading-tight">
            Foundry Studio
          </h2>
          <p className="text-lg text-background/70 max-w-xl">
            See how the domain model becomes your single source of truth — and
            how AI reads it in real time.
          </p>
        </div>

        {/* Two-column: step nav + studio shell */}
        <div className="flex gap-8 lg:gap-12 items-stretch">
          {/* Step navigator */}
          <div className="w-64 shrink-0">
            <div className="space-y-1 sticky top-32">
              {steps.map((step, index) => (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left py-4 px-4 border-l-2 transition-all duration-300 group ${
                    activeStep === index
                      ? "opacity-100 border-l-[#A4471C] bg-white/5"
                      : "opacity-60 border-l-transparent hover:opacity-80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-display text-lg text-background/50 shrink-0">
                      {step.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-display font-semibold mb-1 group-hover:translate-x-0.5 transition-transform text-background">
                        {step.title}
                      </h3>
                      <p className="text-xs text-background/60 leading-relaxed">
                        {step.description}
                      </p>
                      {activeStep === index && (
                        <div className="mt-3 h-0.5 bg-background/20 overflow-hidden rounded-full">
                          <div
                            className="h-full bg-[#A4471C] w-0"
                            style={{ animation: "progress 6s linear forwards" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Studio shell */}
          <div
            className={`flex-1 min-w-0 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div
              className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#0E0E12] flex flex-col"
              style={{ height: 560 }}
            >
              {/* Top bar */}
              <div className="h-9 bg-[#16161A] border-b border-white/5 flex items-center px-3 gap-3 shrink-0">
                {/* Traffic lights */}
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>

                {/* Tabs */}
                <div className="flex gap-0.5 ml-2">
                  {["System Map", "Coverage", "Compliance", "Activity"].map(
                    (tab) => (
                      <span
                        key={tab}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                          tab === "System Map"
                            ? "bg-white/10 text-white/80"
                            : "text-white/30 hover:text-white/50"
                        }`}
                      >
                        {tab}
                      </span>
                    )
                  )}
                </div>

                {/* Search */}
                <div className="ml-auto flex items-center bg-white/5 rounded border border-white/8 px-2 py-0.5 gap-1.5">
                  <span className="text-white/30 text-xs">⌕</span>
                  <span className="text-xs font-mono text-white/25">
                    Search modules…
                  </span>
                </div>
              </div>

              {/* Body: detail drawer + graph + activity feed */}
              <div className="flex flex-1 overflow-hidden">
                {/* Left detail drawer */}
                <DetailDrawer visible={showDrawer} sceneIndex={activeStep} />

                {/* Cytoscape graph */}
                <CytoscapeGraph sceneIndex={activeStep} />

                {/* Right activity feed */}
                <ActivityFeed events={feedEvents} sceneIndex={activeStep} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeStep
                  ? "w-6 h-2 bg-background"
                  : "w-2 h-2 bg-background/30 hover:bg-background/50"
              }`}
              aria-label={`Scene ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
