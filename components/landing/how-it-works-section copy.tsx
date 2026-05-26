"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import cytoscape from "cytoscape";
// @ts-ignore
import coseBilkent from "cytoscape-cose-bilkent";
import type { Core, ElementDefinition } from "cytoscape";

if (typeof window !== "undefined") {
  try { cytoscape.use(coseBilkent); } catch { /* already registered */ }
}

// ─── Scene definitions ────────────────────────────────────────────────────────

const STEPS = [
  {
    number: "I",
    title: "Your domain as a live graph",
    description: "Foundry reads your Ash codebase and reflects it: every action, policy, relationship, and external boundary becomes a node; every call, dependency, and data flow becomes a typed edge.",
  },
  {
    number: "II",
    title: "Click a node. See everything.",
    description: "Select any node — see the transitive set of everything a change would touch, as a number and a highlighted subgraph. The graph is derived, never drifts. Code is the source of truth.",
  },
  {
    number: "III",
    title: "Tests light up the map",
    description: "Run a test and replay it as an inspectable trace — step by step, state by state — and validate the logic without opening a source file. Reviewers see what the system does, not just what it says.",
  },
  {
    number: "IV",
    title: "Copilot proposes a change",
    description: "Ask for a feature. The copilot reads your live domain model, finds constraints, and produces a graph diff, validated against your real schema. Invalid structure never compiles into your codebase.",
  },
  {
    number: "V",
    title: "Change lands on the graph",
    description: "The copilot's code changes light up in real time. Every edit is scoped before it lands. New rules, new transfers — all wired into the live domain map instantly.",
  },
];

// ─── Graph data ───────────────────────────────────────────────────────────────

const ELEMENTS: ElementDefinition[] = [
  // Finance domain
  { data: { id: "domain-finance",  label: "Finance",     type: "domain" }, classes: "domain" },
  { data: { id: "wallet",          label: "Wallet",          type: "resource", parent: "domain-finance" }, classes: "resource" },
  { data: { id: "balance",         label: "Balance",         type: "resource", parent: "domain-finance" }, classes: "resource" },
  { data: { id: "withdrawal-req",  label: "WithdrawalRequest", type: "resource", parent: "domain-finance" }, classes: "resource" },
  { data: { id: "transaction",     label: "Transaction",     type: "resource", parent: "domain-finance" }, classes: "resource" },
  { data: { id: "suf-balance",     label: "SufficientBalance", type: "rule",   parent: "domain-finance" }, classes: "rule" },
  { data: { id: "limit-rule",      label: "WithdrawalLimit",  type: "rule",    parent: "domain-finance" }, classes: "rule" },
  { data: { id: "daily-limit",     label: "DailyLimit",      type: "rule",     parent: "domain-finance" }, classes: "rule" },
  { data: { id: "withdrawal-xfer", label: "WithdrawalTransfer", type: "transfer", parent: "domain-finance" }, classes: "transfer" },
  { data: { id: "billing-reactor", label: "BillingReactor",  type: "reactor",  parent: "domain-finance" }, classes: "reactor" },

  // Players domain
  { data: { id: "domain-players", label: "Players", type: "domain" }, classes: "domain" },
  { data: { id: "player",         label: "Player",         type: "resource", parent: "domain-players" }, classes: "resource" },
  { data: { id: "player-profile", label: "PlayerProfile",  type: "resource", parent: "domain-players" }, classes: "resource" },
  { data: { id: "kyc",            label: "KycVerification",type: "resource", parent: "domain-players" }, classes: "resource" },
  { data: { id: "player-status",  label: "PlayerStatus",   type: "resource", parent: "domain-players" }, classes: "resource" },
  { data: { id: "self-exclusion", label: "SelfExclusion",  type: "rule",     parent: "domain-players" }, classes: "rule" },
  { data: { id: "age-check",      label: "AgeVerification",type: "rule",     parent: "domain-players" }, classes: "rule" },
  { data: { id: "kyc-reactor",    label: "KycReactor",     type: "reactor",  parent: "domain-players" }, classes: "reactor" },

  // Compliance domain
  { data: { id: "domain-compliance", label: "Compliance", type: "domain" }, classes: "domain" },
  { data: { id: "audit-log",         label: "AuditLog",       type: "resource", parent: "domain-compliance" }, classes: "resource" },
  { data: { id: "compliance-rule",   label: "ComplianceRule", type: "resource", parent: "domain-compliance" }, classes: "resource" },
  { data: { id: "compliance-event",  label: "ComplianceEvent",type: "resource", parent: "domain-compliance" }, classes: "resource" },

  // Reporting domain
  { data: { id: "domain-reporting", label: "Reporting", type: "domain" }, classes: "domain" },
  { data: { id: "report",           label: "Report",    type: "resource", parent: "domain-reporting" }, classes: "resource" },
  { data: { id: "analytics",        label: "Analytics", type: "resource", parent: "domain-reporting" }, classes: "resource" },
  { data: { id: "report-reactor",   label: "ReportReactor", type: "reactor", parent: "domain-reporting" }, classes: "reactor" },

  // Notifications domain
  { data: { id: "domain-notif",  label: "Notifications", type: "domain" }, classes: "domain" },
  { data: { id: "email-notif",   label: "EmailNotif",   type: "resource", parent: "domain-notif" }, classes: "resource" },
  { data: { id: "sms-notif",     label: "SmsNotif",     type: "resource", parent: "domain-notif" }, classes: "resource" },
  { data: { id: "notif-reactor", label: "NotifReactor", type: "reactor",  parent: "domain-notif" }, classes: "reactor" },

  // External
  { data: { id: "stripe",       label: "StripeGateway", type: "external" }, classes: "external" },
  { data: { id: "email-svc",    label: "EmailService",  type: "external" }, classes: "external" },

  // Finance edges
  { data: { source: "withdrawal-req",  target: "wallet"         }, classes: "read" },
  { data: { source: "withdrawal-req",  target: "balance"        }, classes: "read" },
  { data: { source: "suf-balance",     target: "balance"        }, classes: "guard" },
  { data: { source: "limit-rule",      target: "withdrawal-req" }, classes: "guard" },
  { data: { source: "daily-limit",     target: "withdrawal-req" }, classes: "guard" },
  { data: { source: "withdrawal-xfer", target: "withdrawal-req" }, classes: "write" },
  { data: { source: "withdrawal-xfer", target: "transaction"    }, classes: "write" },
  { data: { source: "billing-reactor", target: "wallet"         }, classes: "write" },
  { data: { source: "billing-reactor", target: "balance"        }, classes: "write" },
  { data: { source: "billing-reactor", target: "audit-log"      }, classes: "write" },
  { data: { source: "withdrawal-xfer", target: "stripe"         }, classes: "external-edge" },

  // Players edges
  { data: { source: "player",        target: "player-profile"  }, classes: "read" },
  { data: { source: "player",        target: "player-status"   }, classes: "read" },
  { data: { source: "player-profile",target: "kyc"             }, classes: "read" },
  { data: { source: "kyc",           target: "age-check"       }, classes: "guard" },
  { data: { source: "player-status", target: "self-exclusion"  }, classes: "guard" },
  { data: { source: "kyc-reactor",   target: "kyc"             }, classes: "write" },
  { data: { source: "kyc-reactor",   target: "compliance-event"}, classes: "write" },

  // Compliance edges
  { data: { source: "compliance-rule",  target: "audit-log"       }, classes: "write" },
  { data: { source: "audit-log",        target: "compliance-event"}, classes: "write" },

  // Reporting edges
  { data: { source: "report-reactor", target: "report"    }, classes: "write" },
  { data: { source: "report-reactor", target: "analytics" }, classes: "write" },
  { data: { source: "analytics",      target: "audit-log" }, classes: "read" },

  // Notification edges
  { data: { source: "notif-reactor", target: "email-notif" }, classes: "write" },
  { data: { source: "notif-reactor", target: "sms-notif"   }, classes: "write" },
  { data: { source: "email-notif",   target: "email-svc"   }, classes: "external-edge" },

  // Cross-domain
  { data: { source: "withdrawal-req", target: "player"          }, classes: "read" },
  { data: { source: "transaction",    target: "notif-reactor"   }, classes: "trigger" },
  { data: { source: "compliance-event", target: "report-reactor"}, classes: "trigger" },
];

// Scene V: copilot-added elements
const COPILOT_NODES: ElementDefinition[] = [
  { data: { id: "pre-limit-check", label: "PreLimitCheck", type: "transfer", parent: "domain-finance" }, classes: "transfer copilot-new" },
];
const COPILOT_EDGES: ElementDefinition[] = [
  { data: { source: "withdrawal-req",  target: "pre-limit-check" }, classes: "write copilot-new" },
  { data: { source: "daily-limit",     target: "pre-limit-check" }, classes: "guard copilot-new" },
  { data: { source: "pre-limit-check", target: "withdrawal-xfer" }, classes: "write copilot-new" },
];

// Trace path for scene III
const TRACE_NODE_IDS = ["withdrawal-req", "suf-balance", "withdrawal-xfer", "audit-log", "balance"];
const TRACE_EDGE_PAIRS: [string, string][] = [
  ["withdrawal-req", "balance"],
  ["suf-balance", "balance"],
  ["withdrawal-xfer", "withdrawal-req"],
  ["billing-reactor", "audit-log"],
];

// ─── Cytoscape styles ─────────────────────────────────────────────────────────

const CY_STYLE: cytoscape.StylesheetJson = [
  {
    selector: "node",
    style: {
      "background-color": "#2C2C35",
      "border-color": "rgba(255,255,255,0.15)",
      "border-width": 1.5,
      "shape": "round-rectangle",
      "width": 86,
      "height": 30,
      "text-valign": "center",
      "text-halign": "center",
      "font-size": 7.5,
      "font-family": "monospace",
      "color": "rgba(255,255,255,0.8)",
      "text-max-width": "78px",
      "text-wrap": "ellipsis",
      "label": "data(label)",
    },
  },
  // Domain clusters — tinted dark, NOT white
  {
    selector: "node.domain",
    style: {
      "background-color": "rgba(30,30,40,0.7)",
      "border-color": "rgba(255,255,255,0.1)",
      "border-width": 1,
      "border-style": "dashed",
      "font-size": 8.5,
      "font-weight": "bold",
      "color": "rgba(255,255,255,0.3)",
      "text-valign": "top",
      "text-halign": "center",
      "text-margin-y": -4,
      "padding": "20px",
      "min-width": "210px",
      "min-height": "130px",
      "shape": "round-rectangle",
    },
  },
  { selector: "node.resource", style: { "border-color": "#3B82F6", "border-width": 1.5 } },
  { selector: "node.transfer", style: { "border-color": "#22C55E", "border-width": 1.5 } },
  { selector: "node.reactor",  style: { "border-color": "#A855F7", "border-width": 1.5 } },
  { selector: "node.rule",     style: { "border-color": "#EAB308", "border-width": 1.5 } },
  {
    selector: "node.external",
    style: {
      "border-color": "#2DD4BF",
      "border-width": 1.5,
      "border-style": "dashed",
      "background-color": "#111E1E",
      "opacity": 0.8,
    },
  },
  // Scene II: highlighted node
  {
    selector: "node.hl-select",
    style: {
      "background-color": "#162416",
      "border-color": "#22C55E",
      "border-width": 2.5,
      "color": "rgba(255,255,255,1)",
      "z-index": 999,
    },
  },
  // Scene III/IV: trace path
  {
    selector: "node.hl-trace",
    style: {
      "background-color": "#231508",
      "border-color": "#F97316",
      "border-width": 2.5,
      "color": "rgba(255,255,255,1)",
      "z-index": 998,
    },
  },
  // Dimmed (non-active)
  {
    selector: "node.dimmed",
    style: { "opacity": 0.12 },
  },
  // Scene V: copilot-new nodes
  {
    selector: "node.copilot-new",
    style: {
      "background-color": "#0E2010",
      "border-color": "#22C55E",
      "border-width": 2.5,
      "color": "rgba(255,255,255,1)",
      "z-index": 997,
    },
  },

  // Edges
  {
    selector: "edge",
    style: {
      "line-color": "rgba(255,255,255,0.1)",
      "width": 1,
      "curve-style": "bezier",
      "target-arrow-shape": "none",
      "opacity": 0.5,
    },
  },
  { selector: "edge.read",  style: { "line-color": "rgba(59,130,246,0.25)", "target-arrow-shape": "none" } },
  {
    selector: "edge.write",
    style: {
      "line-color": "rgba(249,115,22,0.4)",
      "target-arrow-shape": "triangle",
      "target-arrow-color": "rgba(249,115,22,0.4)",
      "arrow-scale": 0.7,
    },
  },
  { selector: "edge.guard", style: { "line-color": "rgba(234,179,8,0.3)", "line-style": "dotted" } },
  {
    selector: "edge.trigger",
    style: {
      "line-color": "rgba(168,85,247,0.3)",
      "target-arrow-shape": "triangle",
      "target-arrow-color": "rgba(168,85,247,0.3)",
      "arrow-scale": 0.65,
    },
  },
  {
    selector: "edge.external-edge",
    style: {
      "line-color": "rgba(45,212,191,0.25)",
      "line-style": "dashed",
      "line-dash-pattern": [4, 4],
      "target-arrow-shape": "triangle",
      "target-arrow-color": "rgba(45,212,191,0.25)",
      "arrow-scale": 0.65,
    },
  },
  // Trace edge
  {
    selector: "edge.hl-trace",
    style: {
      "line-color": "#F97316",
      "width": 2.5,
      "opacity": 1,
      "z-index": 10,
      "target-arrow-shape": "triangle",
      "target-arrow-color": "#F97316",
      "arrow-scale": 0.85,
    },
  },
  { selector: "edge.dimmed", style: { "opacity": 0.05 } },
  {
    selector: "edge.copilot-new",
    style: { "line-color": "#22C55E", "width": 1.8, "opacity": 1, "z-index": 100 },
  },
];

// ─── Scene camera configs ──────────────────────────────────────────────────────

type SceneCamera =
  | { type: "fit-all" }
  | { type: "fit-nodes"; ids: string[]; padding: number }
  | { type: "fit-selector"; selector: string; padding: number };

const SCENE_CAMERAS: SceneCamera[] = [
  { type: "fit-all" },
  { type: "fit-selector", selector: "#domain-finance", padding: 55 },
  { type: "fit-nodes", ids: TRACE_NODE_IDS, padding: 70 },
  { type: "fit-nodes", ids: TRACE_NODE_IDS, padding: 70 },
  { type: "fit-selector", selector: "#domain-finance", padding: 55 },
];

function flyCamera(cy: Core, camera: SceneCamera, duration = 750) {
  let eles: cytoscape.Collection;
  if (camera.type === "fit-all") {
    eles = cy.elements();
    cy.animate({ fit: { eles, padding: 40 } }, { duration, easing: "ease-in-out-cubic" });
    return;
  }
  if (camera.type === "fit-nodes") {
    eles = cy.collection();
    for (const id of camera.ids) {
      const n = cy.$(`#${id}`);
      if (n.length) eles = eles.union(n);
    }
  } else {
    eles = cy.$(camera.selector);
  }
  cy.animate({ fit: { eles, padding: (camera as { padding: number }).padding } }, { duration, easing: "ease-in-out-cubic" });
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

interface ActivityEvent {
  id: string;
  kind: "info" | "success" | "coverage" | "user" | "thinking" | "proposal";
  title: string;
  body: string;
  badge?: string;
}

const FEED_SCENES: ActivityEvent[][] = [
  [],
  [
    { id: "a1", kind: "info", title: "WithdrawalTransfer", body: "5 actions · ADR-005 · RG-UK-014 · 87% coverage" },
  ],
  [
    { id: "b1", kind: "success",  title: "Test run complete",  body: "3 scenarios traced · Finance domain" },
    { id: "b2", kind: "coverage", title: "Coverage 87%",       body: "WithdrawalTransfer fully covered" },
  ],
  [
    { id: "c1", kind: "user",     title: "You",               body: "Add a spending limit. UK players, £500 daily." },
    { id: "c2", kind: "thinking", title: "Copilot",           body: "Checking ADR-005 and RG-UK-014…" },
    { id: "c3", kind: "proposal", title: "Proposal ready",    body: "3 BDD scenarios · domain lead approval required", badge: ":behavioral" },
  ],
  [
    { id: "d1", kind: "user",    title: "You",          body: "Add a spending limit. UK players, £500 daily." },
    { id: "d2", kind: "proposal",title: "Applied",      body: "PreLimitCheck added · 12 files changed", badge: ":behavioral" },
    { id: "d3", kind: "success", title: "All tests pass",body: "47 scenarios passing on new branch" },
  ],
];

function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="w-60 shrink-0 border-l border-white/5 bg-[#111118] flex flex-col">
      <div className="h-8 border-b border-white/5 px-3 flex items-center gap-2 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-[#A4471C]" />
        <span className="text-[11px] font-semibold text-white/70 font-mono">Activity Feed</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {events.length === 0 && (
          <p className="text-white/20 text-[10px] font-mono mt-6 text-center leading-relaxed px-2">
            Ask a question or describe a change…
          </p>
        )}
        {events.map((ev) => (
          <div
            key={ev.id}
            className={`rounded border p-2 text-[10px] font-mono space-y-1 ${
              ev.kind === "user"     ? "bg-[#A4471C]/12 border-[#A4471C]/25"     :
              ev.kind === "thinking"? "bg-white/4 border-white/8 animate-pulse"  :
              ev.kind === "proposal"? "bg-[#18142A] border-purple-500/25"        :
              ev.kind === "success" ? "bg-[#0B1A0F] border-green-500/25"         :
              ev.kind === "coverage"? "bg-[#181508] border-yellow-500/25"        :
                                     "bg-white/4 border-white/8"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className={`font-semibold truncate ${
                ev.kind === "user"     ? "text-[#A4471C]"   :
                ev.kind === "proposal" ? "text-purple-400"  :
                ev.kind === "success"  ? "text-green-400"   :
                ev.kind === "coverage" ? "text-yellow-400"  :
                                         "text-white/55"
              }`}>{ev.title}</span>
              {ev.badge && (
                <span className="shrink-0 px-1 py-0.5 rounded bg-purple-500/18 text-purple-300 border border-purple-500/25 text-[9px]">
                  {ev.badge}
                </span>
              )}
            </div>
            <p className="text-white/45 leading-snug">{ev.body}</p>
            {ev.kind === "proposal" && (
              <button className="w-full text-center py-0.5 mt-0.5 rounded bg-[#A4471C]/25 border border-[#A4471C]/35 text-[#A4471C] text-[10px] font-semibold">
                Review →
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 p-1.5 shrink-0">
        <div className="flex gap-1 items-center bg-white/4 rounded border border-white/8 px-2 py-1">
          <input type="text" placeholder="Ask anything…" readOnly
            className="flex-1 bg-transparent text-[10px] text-white placeholder-white/25 outline-none font-mono" />
          <span className="text-white/25 text-[10px]">↑</span>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

const DRAWER_DETAIL = {
  name: "WithdrawalTransfer",
  type: "transfer",
  domain: "Finance",
  actions: [
    { name: "initiate",      badge: "write" },
    { name: "verify_limit",  badge: "read"  },
    { name: "execute",       badge: "write" },
    { name: "settle",        badge: "write" },
    { name: "rollback",      badge: "write" },
  ],
  compliance: ["RG-UK-014"],
  adrs: ["ADR-005"],
  coverage: 87,
};

const TRACE_DETAIL = {
  title: "Test: withdrawal_with_balance_check",
  steps: [
    { node: "WithdrawalRequest", action: "request",      result: "ok",    ms: 2  },
    { node: "SufficientBalance", action: "guard_check",  result: "pass",  ms: 1  },
    { node: "WithdrawalTransfer",action: "execute",      result: "ok",    ms: 12 },
    { node: "BillingReactor",    action: "write_audit",  result: "ok",    ms: 3  },
    { node: "AuditLog",          action: "insert",       result: "ok",    ms: 1  },
  ],
  coverage: 87,
  assertions: 5,
};

function DetailDrawer({ sceneIndex }: { sceneIndex: number }) {
  const isOpen = sceneIndex >= 1;
  return (
    <div
      className="shrink-0 border-r border-white/5 bg-[#111118] flex flex-col overflow-hidden transition-all duration-500"
      style={{ width: isOpen ? "15rem" : 0, opacity: isOpen ? 1 : 0 }}
    >
      {sceneIndex === 1 && (
        <>
          <div className="border-b border-white/5 px-3 py-2 shrink-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-green-500/12 text-green-400 border border-green-500/20">
                transfer
              </span>
              <span className="text-white/30 text-[10px] font-mono">{DRAWER_DETAIL.domain}</span>
            </div>
            <h3 className="text-[11px] font-semibold text-white font-mono">{DRAWER_DETAIL.name}</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
            <div>
              <p className="text-white/35 uppercase tracking-widest text-[9px] mb-1 font-mono">Actions</p>
              <div className="space-y-0.5">
                {DRAWER_DETAIL.actions.map((a) => (
                  <div key={a.name} className="flex items-center justify-between px-1.5 py-0.5 rounded bg-white/4 border border-white/5">
                    <span className="font-mono text-white/75 text-[9px]">{a.name}</span>
                    <span className={`px-1 py-px rounded text-[8px] font-mono ${
                      a.badge === "write"
                        ? "bg-orange-500/12 text-orange-400 border border-orange-500/18"
                        : "bg-blue-500/12 text-blue-400 border border-blue-500/18"
                    }`}>{a.badge}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/35 uppercase tracking-widest text-[9px] mb-1 font-mono">Compliance</p>
              {DRAWER_DETAIL.compliance.map((c) => (
                <div key={c} className="px-1.5 py-0.5 rounded bg-white/4 border-l-2 border-[#A4471C]/70 font-mono text-white/65 text-[9px]">{c}</div>
              ))}
            </div>
            <div>
              <p className="text-white/35 uppercase tracking-widest text-[9px] mb-1 font-mono">Linked ADRs</p>
              {DRAWER_DETAIL.adrs.map((a) => (
                <div key={a} className="px-1.5 py-0.5 rounded bg-white/4 border-l-2 border-blue-500/40 font-mono text-white/65 text-[9px]">{a}</div>
              ))}
            </div>
            <div>
              <p className="text-white/35 uppercase tracking-widest text-[9px] mb-1 font-mono">Coverage</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${DRAWER_DETAIL.coverage}%` }} />
                </div>
                <span className="text-green-400 font-mono text-[9px] font-semibold">{DRAWER_DETAIL.coverage}%</span>
              </div>
            </div>
          </div>
        </>
      )}

      {(sceneIndex === 2 || sceneIndex === 3) && (
        <>
          <div className="border-b border-white/5 px-3 py-2 shrink-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span className="text-[9px] font-mono text-[#F97316]">TRACE</span>
            </div>
            <h3 className="text-[10px] font-semibold text-white/85 font-mono leading-snug">{TRACE_DETAIL.title}</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {TRACE_DETAIL.steps.map((s, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[9px] font-mono">
                <span className="text-white/25 w-3 shrink-0 pt-px">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-white/75 truncate">{s.node}</span>
                    <span className={`shrink-0 px-1 py-px rounded text-[8px] ${
                      s.result === "pass" ? "bg-yellow-500/12 text-yellow-400" :
                      "bg-green-500/12 text-green-400"
                    }`}>{s.result}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/30">
                    <span className="text-[#F97316]/70">{s.action}</span>
                    <span>·</span>
                    <span>{s.ms}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 p-2 shrink-0">
            <div className="flex justify-between text-[9px] font-mono text-white/40">
              <span>{TRACE_DETAIL.assertions} assertions</span>
              <span className="text-green-400">{TRACE_DETAIL.coverage}% covered</span>
            </div>
          </div>
        </>
      )}

      {sceneIndex === 4 && (
        <>
          <div className="border-b border-white/5 px-3 py-2 shrink-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-green-500/12 text-green-400 border border-green-500/20">
                new
              </span>
            </div>
            <h3 className="text-[11px] font-semibold text-white font-mono">PreLimitCheck</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
            <div>
              <p className="text-white/35 uppercase tracking-widest text-[9px] mb-1 font-mono">Added by Copilot</p>
              <div className="space-y-0.5">
                {["initiate", "check_daily_limit", "execute", "rollback"].map((name) => (
                  <div key={name} className="flex items-center justify-between px-1.5 py-0.5 rounded bg-green-500/6 border border-green-500/15">
                    <span className="font-mono text-white/75 text-[9px]">{name}</span>
                    <span className="px-1 py-px rounded text-[8px] font-mono bg-green-500/12 text-green-400 border border-green-500/18">new</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/35 uppercase tracking-widest text-[9px] mb-1 font-mono">Compliance</p>
              <div className="px-1.5 py-0.5 rounded bg-white/4 border-l-2 border-[#A4471C]/70 font-mono text-white/65 text-[9px]">RG-UK-014</div>
            </div>
            <div className="px-2 py-1.5 rounded bg-green-500/8 border border-green-500/20">
              <p className="text-green-400 text-[9px] font-mono font-semibold mb-0.5">3 BDD scenarios generated</p>
              <p className="text-white/45 text-[9px] font-mono">All passing on feature branch</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Cytoscape Graph ──────────────────────────────────────────────────────────

function CytoscapeGraph({ sceneIndex, onReady }: { sceneIndex: number; onReady?: (cy: Core) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const sceneRef = useRef(-1);

  // Build graph once, keep it alive across scene changes
  useEffect(() => {
    if (!containerRef.current) return;
    if (cyRef.current) return; // Already built

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...ELEMENTS],
      style: CY_STYLE,
      layout: {
        name: "cose-bilkent",
        // @ts-ignore
        idealEdgeLength: 72,
        // @ts-ignore
        nodeRepulsion: 5500,
        // @ts-ignore
        gravity: 0.38,
        // @ts-ignore
        nestingFactor: 0.45,
        padding: 40,
        animate: false,
        fit: true,
      },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
    });

    cyRef.current = cy;
    onReady?.(cy);

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply scene transitions when sceneIndex changes
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    if (sceneRef.current === sceneIndex) return;
    const prevScene = sceneRef.current;
    sceneRef.current = sceneIndex;

    // --- Step 1: zoom out slightly before class changes (avoids jump)
    const doTransition = () => {
      // --- Clear previous state
      cy.elements().removeClass("hl-select hl-trace dimmed copilot-new");
      // Remove copilot nodes/edges if going backward from scene V
      cy.$(".copilot-new").remove();

      // --- Apply new state
      if (sceneIndex === 0) {
        // Full overview — no highlights
        flyCamera(cy, SCENE_CAMERAS[0]);
      } else if (sceneIndex === 1) {
        cy.$("#withdrawal-xfer").addClass("hl-select");
        flyCamera(cy, SCENE_CAMERAS[1]);
      } else if (sceneIndex === 2 || sceneIndex === 3) {
        TRACE_NODE_IDS.forEach((id) => cy.$(`#${id}`).addClass("hl-trace"));
        TRACE_EDGE_PAIRS.forEach(([s, t]) => cy.$(`#${s}`).edgesWith(`#${t}`).addClass("hl-trace"));
        cy.nodes(":childless").forEach((n) => { if (!n.hasClass("hl-trace")) n.addClass("dimmed"); });
        cy.edges().forEach((e) => { if (!e.hasClass("hl-trace")) e.addClass("dimmed"); });
        flyCamera(cy, SCENE_CAMERAS[2]);
      } else if (sceneIndex === 4) {
        // Add copilot nodes/edges
        cy.add([...COPILOT_NODES, ...COPILOT_EDGES]);
        // Re-run layout only for the Finance cluster, no animation
        cy.$("#domain-finance").children().layout({
          name: "cose-bilkent",
          // @ts-ignore
          idealEdgeLength: 55,
          // @ts-ignore
          nodeRepulsion: 4000,
          animate: false,
          fit: false,
          padding: 10,
        }).run();
        cy.$(".copilot-new").addClass("copilot-new");
        flyCamera(cy, SCENE_CAMERAS[4]);
      }
    };

    // Brief zoom-out before switching (smooths the transition)
    if (prevScene >= 0 && prevScene !== sceneIndex) {
      cy.stop(true);
      // Zoom out toward full graph if coming from a zoomed state
      const fromZoomed = prevScene !== 0;
      const toZoomed = sceneIndex !== 0;
      if (fromZoomed && toZoomed) {
        // Zoomed → zoomed: first fit full, then fly to new
        cy.animate(
          { fit: { eles: cy.elements(), padding: 60 } },
          { duration: 350, easing: "ease-in-out-cubic", complete: () => {
            doTransition();
          }}
        );
      } else {
        doTransition();
      }
    } else {
      doTransition();
    }
  }, [sceneIndex]);

  return <div ref={containerRef} className="flex-1 bg-[#0C0C12] overflow-hidden" />;
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const restartAutoplay = useCallback((fromStep?: number) => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    let current = fromStep ?? activeStep;
    autoplayRef.current = setInterval(() => {
      current = (current + 1) % STEPS.length;
      setActiveStep(current);
    }, 7000);
  }, [activeStep]);

  useEffect(() => {
    if (!isVisible) return;
    restartAutoplay(0);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    restartAutoplay(index);
  };

  const feedEvents = FEED_SCENES[activeStep] ?? [];

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
            The on-ramp
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-semibold text-background mb-3 leading-tight">
            Reflection — code as a living map
          </h2>
          <p className="text-lg text-background/70 max-w-xl">
            Ten minutes, end to end — because every step operates on a structure, not on a wall of generated text.
          </p>
        </div>

        <div className="flex gap-8 lg:gap-12 items-stretch">
          {/* Step navigator */}
          <div className="w-60 shrink-0">
            <div className="space-y-0.5 sticky top-32">
              {STEPS.map((step, index) => (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => handleStepClick(index)}
                  className={`w-full text-left py-3.5 px-4 border-l-2 transition-all duration-300 group ${
                    activeStep === index
                      ? "opacity-100 border-l-[#A4471C] bg-white/5"
                      : "opacity-55 border-l-transparent hover:opacity-75"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-display text-base text-background/45 shrink-0 mt-px">{step.number}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-display font-semibold mb-0.5 text-background group-hover:translate-x-0.5 transition-transform">
                        {step.title}
                      </h3>
                      <p className="text-[11px] text-background/55 leading-relaxed">
                        {step.description}
                      </p>
                      {activeStep === index && (
                        <div className="mt-2.5 h-0.5 bg-background/15 overflow-hidden rounded-full">
                          <div className="h-full bg-[#A4471C] w-0" style={{ animation: "progress 7s linear forwards" }} />
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
            <div className="w-full rounded-xl overflow-hidden border border-white/[0.07] bg-[#0C0C12] flex flex-col" style={{ height: 560 }}>
              {/* Top bar */}
              <div className="h-8 bg-[#15151C] border-b border-white/5 flex items-center px-3 gap-3 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <div className="flex gap-0.5 ml-2">
                  {["System Map", "Coverage", "Compliance", "Activity"].map((tab) => (
                    <span key={tab} className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      tab === "System Map" ? "bg-white/8 text-white/75" : "text-white/28 hover:text-white/45"
                    }`}>{tab}</span>
                  ))}
                </div>
                <div className="ml-auto flex items-center bg-white/4 rounded border border-white/[0.07] px-2 py-0.5 gap-1.5">
                  <span className="text-white/25 text-[10px]">⌕</span>
                  <span className="text-[10px] font-mono text-white/20">Search modules…</span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 overflow-hidden">
                <DetailDrawer sceneIndex={activeStep} />
                <CytoscapeGraph sceneIndex={activeStep} />
                <ActivityFeed events={feedEvents} />
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeStep ? "w-6 h-2 bg-background" : "w-2 h-2 bg-background/25 hover:bg-background/45"
              }`}
              aria-label={`Scene ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  );
}
