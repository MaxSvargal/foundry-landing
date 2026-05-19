"use client";

import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import type { Core, ElementDefinition } from "cytoscape";

const steps = [
  {
    number: "I",
    title: "Your domain as a live graph",
    description: "The system map is extracted directly from your Ash code by the compiler. Every node is a resource. Every edge is a relationship or side effect.",
  },
  {
    number: "II",
    title: "Click a node. See everything.",
    description: "Click any resource to open the details panel. You see its code, tests, linked ADRs, compliance rules, and test coverage.",
  },
  {
    number: "III",
    title: "Tests light up the map",
    description: "Run a test. The execution path highlights on the graph. You see every node touched, in order, with side effects.",
  },
  {
    number: "IV",
    title: "Copilot reads your domain",
    description: "Ask for a feature. The copilot reads your live domain model, finds constraints, and proposes on a branch with blast radius shown.",
  },
];

interface Message {
  id: string;
  type: 'user' | 'copilot' | 'thinking';
  content: string;
}

const copilotMessages: Message[][] = [
  [],
  [],
  [
    { id: '1', type: 'user', content: 'Add a spending limit to withdrawals. UK players, £500 daily.' },
  ],
  [
    { id: '1', type: 'user', content: 'Add a spending limit to withdrawals. UK players, £500 daily.' },
    { id: '2', type: 'thinking', content: 'Analyzing WithdrawalReactor… checking ADRs and compliance…' },
    { id: '3', type: 'copilot', content: 'Found ADR-005 (enforcement at reactor boundary) and RG-UK-014 (UK compliance).\n\nThis is a :behavioral change.\nDomain lead approval required.\n\nProposal:\n• Add SpendingLimitRule\n• Generate 3 BDD scenarios\n• Link RG-UK-014\n• Open for review\n\nConfirm?' },
  ],
];

interface ResourceDetail {
  id: string;
  name: string;
  type: string;
  actions: string[];
  attributes: number;
  relationships: number;
  adrs: string[];
}

const resourceDetails: Record<string, ResourceDetail> = {
  'withdrawal-reactor': {
    id: 'withdrawal-reactor',
    name: 'WithdrawalReactor',
    type: 'reactor',
    actions: ['handle_withdrawal', 'apply_compliance'],
    attributes: 0,
    relationships: 3,
    adrs: ['ADR-005', 'RG-UK-014'],
  },
  'withdrawal': {
    id: 'withdrawal',
    name: 'Withdrawal',
    type: 'resource',
    actions: ['request', 'approve', 'process'],
    attributes: 7,
    relationships: 3,
    adrs: ['ADR-003'],
  },
};

function CytoscapeGraph({ sceneIndex }: { sceneIndex: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Graph data with proper domain clustering
    const elements: ElementDefinition[] = [
      // Accounting domain
      { data: { id: 'domain-accounting', label: 'Accounting', type: 'domain' }, classes: 'domain' },
      { data: { id: 'invoice', label: 'Invoice', type: 'resource', parent: 'domain-accounting' }, classes: 'resource' },
      { data: { id: 'ledger', label: 'Ledger', type: 'resource', parent: 'domain-accounting' }, classes: 'resource' },

      // Billing domain
      { data: { id: 'domain-billing', label: 'Billing', type: 'domain' }, classes: 'domain' },
      { data: { id: 'subscription', label: 'Subscription', type: 'resource', parent: 'domain-billing' }, classes: 'resource' },
      { data: { id: 'plan', label: 'Plan', type: 'resource', parent: 'domain-billing' }, classes: 'resource' },
      { data: { id: 'billing-reactor', label: 'BillingReactor', type: 'reactor', parent: 'domain-billing' }, classes: 'reactor' },

      // Payments domain
      { data: { id: 'domain-payments', label: 'Payments', type: 'domain' }, classes: 'domain' },
      { data: { id: 'payment', label: 'Payment', type: 'resource', parent: 'domain-payments' }, classes: 'resource' },
      { data: { id: 'payment-method', label: 'PaymentMethod', type: 'resource', parent: 'domain-payments' }, classes: 'resource' },
      { data: { id: 'stripe-gateway', label: 'Stripe', type: 'external', parent: 'domain-payments' }, classes: 'external' },

      // Accounts domain
      { data: { id: 'domain-accounts', label: 'Accounts', type: 'domain' }, classes: 'domain' },
      { data: { id: 'user', label: 'User', type: 'resource', parent: 'domain-accounts' }, classes: 'resource' },
      { data: { id: 'customer', label: 'Customer', type: 'resource', parent: 'domain-accounts' }, classes: 'resource' },

      // Withdrawals domain
      { data: { id: 'domain-withdrawals', label: 'Withdrawals', type: 'domain' }, classes: 'domain' },
      { data: { id: 'withdrawal', label: 'Withdrawal', type: 'resource', parent: 'domain-withdrawals' }, classes: 'resource' },
      { data: { id: 'withdrawal-state', label: 'WithdrawalStateMachine', type: 'resource', parent: 'domain-withdrawals' }, classes: 'resource' },
      { data: { id: 'withdrawal-reactor', label: 'WithdrawalReactor', type: 'reactor', parent: 'domain-withdrawals' }, classes: 'reactor' },

      // Compliance domain
      { data: { id: 'domain-compliance', label: 'Compliance', type: 'domain' }, classes: 'domain' },
      { data: { id: 'compliance-rule', label: 'ComplianceRule', type: 'resource', parent: 'domain-compliance' }, classes: 'resource' },
      { data: { id: 'audit-log', label: 'AuditLog', type: 'resource', parent: 'domain-compliance' }, classes: 'resource' },

      // Edges
      { data: { source: 'subscription', target: 'plan' }, classes: 'relationship' },
      { data: { source: 'subscription', target: 'customer' }, classes: 'relationship' },
      { data: { source: 'billing-reactor', target: 'invoice' }, classes: 'sideeffect' },
      { data: { source: 'billing-reactor', target: 'ledger' }, classes: 'sideeffect' },
      { data: { source: 'payment', target: 'payment-method' }, classes: 'relationship' },
      { data: { source: 'payment', target: 'ledger' }, classes: 'sideeffect' },
      { data: { source: 'payment', target: 'stripe-gateway' }, classes: 'external-edge' },
      { data: { source: 'customer', target: 'user' }, classes: 'relationship' },
      { data: { source: 'customer', target: 'subscription' }, classes: 'relationship' },
      { data: { source: 'withdrawal', target: 'customer' }, classes: 'relationship' },
      { data: { source: 'withdrawal', target: 'withdrawal-state' }, classes: 'relationship' },
      { data: { source: 'withdrawal-reactor', target: 'payment' }, classes: 'sideeffect' },
      { data: { source: 'withdrawal-reactor', target: 'compliance-rule' }, classes: 'sideeffect' },
      { data: { source: 'withdrawal-reactor', target: 'ledger' }, classes: 'sideeffect' },
      { data: { source: 'compliance-rule', target: 'audit-log' }, classes: 'sideeffect' },
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#3A3A3F',
            'border-color': 'rgba(255, 255, 255, 0.3)',
            'border-width': 1.5,
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 8,
            'font-family': 'monospace',
            'color': 'rgba(255, 255, 255, 0.85)',
            'padding': 4,
            'text-max-width': '60px',
            'text-overflow': 'ellipsis',
          },
        },
        {
          selector: 'node.domain',
          style: {
            'background-color': 'transparent',
            'border-color': 'rgba(164, 71, 28, 0.2)',
            'border-width': 1,
            'border-style': 'dashed',
            'font-size': 9,
            'font-weight': 'bold',
            'color': 'rgba(164, 71, 28, 0.6)',
            'text-background-color': 'rgba(14, 14, 12, 0.8)',
            'text-background-padding': 3,
            'text-background-shape': 'rectangle',
            'text-background-opacity': 0.8,
          },
        },
        {
          selector: 'node.resource',
          style: {
            'width': 28,
            'height': 28,
            'shape': 'circle',
          },
        },
        {
          selector: 'node.reactor',
          style: {
            'width': 34,
            'height': 34,
            'shape': 'circle',
            'background-color': '#2B2B2F',
            'border-color': 'rgba(255, 255, 255, 0.4)',
            'border-width': 2,
          },
        },
        {
          selector: 'node.external',
          style: {
            'width': 26,
            'height': 26,
            'shape': 'circle',
            'background-color': '#4B3F37',
            'border-color': 'rgba(164, 71, 28, 0.6)',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#A4471C',
            'border-color': '#A4471C',
            'border-width': 2.5,
            'box-shadow': '0 0 8px rgba(164, 71, 28, 0.6)',
          },
        },
        {
          selector: 'node.highlighted',
          style: {
            'background-color': '#A4471C',
            'border-color': '#A4471C',
            'border-width': 2.5,
            'box-shadow': '0 0 12px rgba(164, 71, 28, 0.8)',
          },
        },
        {
          selector: 'edge',
          style: {
            'line-color': 'rgba(255, 255, 255, 0.15)',
            'width': 1,
            'curve-style': 'bezier',
            'target-arrow-shape': 'none',
          },
        },
        {
          selector: 'edge.relationship',
          style: {
            'line-color': 'rgba(255, 255, 255, 0.15)',
            'width': 1,
          },
        },
        {
          selector: 'edge.sideeffect',
          style: {
            'line-color': 'rgba(164, 71, 28, 0.3)',
            'width': 1.5,
            'line-style': 'dashed',
            'line-dash-pattern': [4, 3],
          },
        },
        {
          selector: 'edge.external-edge',
          style: {
            'line-color': 'rgba(164, 71, 28, 0.4)',
            'width': 1.5,
            'line-style': 'dotted',
          },
        },
        {
          selector: 'edge.trace',
          style: {
            'line-color': '#A4471C',
            'width': 2.5,
            'line-style': 'solid',
            'z-index': 10,
          },
        },
      ],
      layout: {
        name: 'breadthfirst',
        roots: ['domain-accounting', 'domain-billing', 'domain-payments', 'domain-accounts', 'domain-withdrawals', 'domain-compliance'],
        directed: true,
        spacingFactor: 1.5,
      },
    });

    cyRef.current = cy;

    // Handle scene changes
    cy.elements().removeClass('highlighted');

    if (sceneIndex >= 1) {
      const node = cy.$('#withdrawal-reactor');
      node.addClass('highlighted');
      cy.animate(
        {
          fit: {
            eles: cy.$('#domain-withdrawals').descendants(),
            padding: 50,
          },
        },
        {
          duration: 800,
          easing: 'ease-in-out-cubic',
        }
      );
    } else {
      cy.animate(
        {
          fit: {
            eles: cy.elements(),
            padding: 80,
          },
        },
        {
          duration: 800,
          easing: 'ease-in-out-cubic',
        }
      );
    }

    // Trace path for scenes 2-3
    if (sceneIndex === 2 || sceneIndex === 3) {
      const tracePath = ['withdrawal-reactor', 'ledger', 'compliance-rule', 'audit-log'];
      for (let i = 0; i < tracePath.length - 1; i++) {
        const edge = cy.$(`#${tracePath[i]}`).edgesWith(`#${tracePath[i + 1]}`);
        edge.addClass('trace');
      }
    }

    // Node click handler
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      if (!node.isParent()) {
        setSelectedNode(node.id());
      }
    });

    return () => {
      cy.destroy();
    };
  }, [sceneIndex]);

  const focusedResource = selectedNode ? resourceDetails[selectedNode] : null;

  return (
    <div className="relative w-full bg-[#0E0E0C] rounded-lg overflow-hidden border border-white/10 flex flex-col h-full" style={{ minHeight: '600px' }}>
      {/* macOS title bar */}
      <div className="h-8 bg-[#16161A] border-b border-white/5 flex items-center px-3 gap-2 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs font-mono text-white/40 ml-1.5">foundry.studio</span>
      </div>

      {/* Main 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Resources */}
        <div className="w-32 border-r border-white/5 bg-[#16161A] flex flex-col text-xs shrink-0">
          {/* Tabs */}
          <div className="border-b border-white/5 flex px-2 py-1.5 gap-0.5 shrink-0">
            <button className="px-1.5 py-0.5 text-xs font-mono uppercase tracking-wide text-[#A4471C] bg-white/5 rounded">
              Map
            </button>
            <button className="px-1.5 py-0.5 text-xs font-mono uppercase tracking-wide text-white/30">
              Spec
            </button>
          </div>

          {/* Resources list */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 text-xs">
            {['Withdrawal', 'Customer', 'Payment', 'Ledger', 'Compliance'].map((item) => (
              <div
                key={item}
                className={`px-1.5 py-0.5 rounded text-xs font-mono transition-all cursor-pointer truncate ${
                  selectedNode && item === 'Withdrawal'
                    ? 'bg-[#A4471C] text-white font-semibold'
                    : 'text-white/50 hover:bg-white/5'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Center - Cytoscape graph */}
        <div
          ref={containerRef}
          className="flex-1 bg-[#0E0E0C] overflow-hidden relative"
          style={{ minHeight: '600px' }}
        />

        {/* Right sidebar - Copilot */}
        <div className="w-28 border-l border-white/5 bg-[#16161A] flex flex-col text-xs shrink-0">
          {/* Header */}
          <div className="border-b border-white/5 px-2 py-1.5 shrink-0">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A4471C]" />
              <h3 className="text-xs font-semibold text-white">Chat</h3>
            </div>
            <p className="text-xs text-white/50 leading-tight">AI reads domain</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1 flex flex-col justify-end text-xs">
            {copilotMessages[sceneIndex].slice(0, 2).map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-16 px-1.5 py-1 rounded text-xs leading-tight font-mono break-words ${
                    msg.type === 'user'
                      ? 'bg-[#A4471C] text-white'
                      : msg.type === 'thinking'
                      ? 'bg-white/5 text-white/60 italic border border-white/10'
                      : 'bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {msg.type === 'thinking'
                    ? 'Analyzing…'
                    : msg.content.substring(0, 25) + (msg.content.length > 25 ? '…' : '')}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-white/5 p-1 shrink-0">
            <div className="bg-white/5 rounded p-1 border border-white/10">
              <input
                type="text"
                placeholder="Ask"
                className="w-full bg-transparent text-xs text-white placeholder-white/40 outline-none font-mono"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resource details panel */}
      {focusedResource && (
        <div className="absolute bottom-3 left-36 w-56 bg-[#16161A]/95 backdrop-blur border border-white/10 rounded-lg p-2.5 space-y-2 animate-fadeIn-slow text-xs shadow-xl z-20">
          <div>
            <h4 className="text-sm font-display font-semibold text-[#A4471C] mb-0.5">
              {focusedResource.name}
            </h4>
            <p className="text-xs font-mono text-white/50">
              {focusedResource.type} · {focusedResource.actions.length} actions
            </p>
          </div>

          {/* Actions */}
          <div className="bg-[#0E0E0C] p-1.5 rounded border border-white/10 space-y-1">
            <p className="text-xs font-mono text-white/50 uppercase tracking-wider">Actions</p>
            <div className="flex flex-wrap gap-1">
              {focusedResource.actions.map((action) => (
                <span key={action} className="px-1 py-0.5 bg-[#2B2B2F] rounded text-xs font-mono text-white/70 border border-white/5">
                  {action}
                </span>
              ))}
            </div>
          </div>

          {/* Attributes & Relationships */}
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="bg-white/5 rounded p-1 border border-white/10">
              <p className="text-white/50 uppercase tracking-wider mb-0.5 font-mono text-xs">Attrs</p>
              <p className="font-mono font-semibold text-white text-sm">{focusedResource.attributes}</p>
            </div>
            <div className="bg-white/5 rounded p-1 border border-white/10">
              <p className="text-white/50 uppercase tracking-wider mb-0.5 font-mono text-xs">Rels</p>
              <p className="font-mono font-semibold text-white text-sm">{focusedResource.relationships}</p>
            </div>
          </div>

          {/* Linked specs */}
          {focusedResource.adrs.length > 0 && (
            <div>
              <p className="text-xs font-mono text-white/50 uppercase tracking-wider font-semibold mb-1">
                Specs
              </p>
              <div className="space-y-1">
                {focusedResource.adrs.map((adr) => (
                  <div key={adr} className="px-1.5 py-0.5 bg-[#2B2B2F] rounded text-xs border-l-2 border-[#A4471C] font-mono text-white/70">
                    {adr}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn-slow {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn-slow {
          animation: fadeIn-slow 0.6s ease-out;
        }
      `}</style>
    </div>
  );
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
            See how the domain model becomes your single source of truth — and how AI reads it in real time.
          </p>
        </div>

        {/* Two-column layout: Steps on left, Demo on right */}
        <div className="flex gap-8 lg:gap-12 items-stretch">
          {/* Left column - Steps navigation */}
          <div className="w-72 shrink-0">
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
                    <span className="font-display text-lg text-background/50 shrink-0">{step.number}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-display font-semibold mb-1 group-hover:translate-x-0.5 transition-transform text-background">
                        {step.title}
                      </h3>
                      <p className="text-xs text-background/60 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Progress bar */}
                      {activeStep === index && (
                        <div className="mt-3 h-0.5 bg-background/20 overflow-hidden rounded-full">
                          <div
                            className="h-full bg-[#A4471C] w-0"
                            style={{
                              animation: 'progress 6s linear forwards'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right column - Studio Demo with Cytoscape */}
          <div
            className={`flex-1 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <CytoscapeGraph sceneIndex={activeStep} />
          </div>
        </div>

        {/* Navigation dots - below demo */}
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
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
