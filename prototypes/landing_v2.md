# FOUNDRY

---

## The governed build environment for complex domain platforms.

**Your domain model. Your running code. Your system map. One source of truth — always.**

---

&nbsp;

---

## The wall every serious system hits

Starting is no longer the problem. An AI tool scaffolds a working app in an afternoon. The demo runs. Everyone is optimistic.

Then the system grows.

Six months in: the architecture doc describes a system that no longer exists. The original engineer is the only person who understands why. New engineers take weeks to become productive — not because the codebase is large, but because it's opaque. AI tools that helped you start now hallucinate into a system they can't see whole. They append instead of refactor. They solve the local problem while silently breaking three layers away.

**The 2025 DORA report:** 90% AI adoption increase → 9% more bugs, 91% more code review time. Not because the tools are careless. Because they write without context.

This is not a tooling problem. It's a structural one.

---

## Foundry solves the structure, not the symptoms

Most systems exist in three versions simultaneously:
- The system as it was **designed** — in documents nobody reads anymore
- The system as it was **built** — imperative, accumulated, shaped by a hundred undocumented decisions
- The system as anyone **understands it** — a partial, personal mental model held by whoever's been here longest

These versions diverge from day one. Silently. Until something breaks in a way nobody can explain.

**Foundry makes these three versions the same thing — permanently, by construction.**

Your domain is declared once in a clean, readable DSL. That declaration is not documentation alongside code. It is the running code. It is what the system map renders. It is what the AI agent reads before proposing any change.

When the model changes, the system changes. When the system changes, the map changes. No synchronization problem — no separation.

---

## Why not Tilda, Zapier, n8n, or low-code?

| | Low-code / No-code | Zapier / n8n | **Foundry** |
|---|---|---|---|
| **What it solves** | Simple CRUD apps, basic workflows | Event automation between SaaS tools | Complex domain platforms with real business logic |
| **Scales to** | Fixed schema, predefined patterns | Predefined integrations | Your domain, exactly as it is |
| **When it breaks** | When your domain doesn't fit the template | When logic gets complex | Designed for complexity — that's the point |
| **Code ownership** | Vendor lock-in, black box | Vendor lock-in | You own a standard Elixir app. Run it anywhere. |
| **AI + governance** | None | None | Full architectural context, governed proposals |
| **Compliance** | External, disconnected | None | Linked to code, enforced by the compiler |

**Low-code fails at the complexity wall.** Zapier and n8n handle automation — they don't model domains. When your domain has real invariants, regulated behavior, multi-step workflows with human gates, and audit requirements, you need a platform that models those things correctly — not one you configure to approximate them.

Foundry doesn't replace low-code for simple problems. It exists for the problems where low-code already failed you.

---

## The infrastructure decision you'll never have to make

The BEAM runtime was built by Ericsson to run telecom switches for years without failure under millions of concurrent connections. That requirement shaped every design decision in the runtime.

The results in production are concrete:

- Phoenix: **2 million WebSocket connections on one server** — one EC2 instance, 2ms latency, no GC pauses, ~1KB per connection
- Pinterest: **200 Python servers → 4 Elixir nodes**, saving $2M/year
- Bleacher Report: **150 servers → 5**
- One engineering team: **$16,000/month AWS Lambda → $150/month on 3 Elixir nodes**, 12M requests/hour

These are not benchmarks. They are infrastructure bills.

Traditional stacks reach for external services — a message queue, pub/sub, a caching tier, a job processor — because the runtime can't handle these concerns natively. Each external service is an integration to maintain, a failure mode to handle, a cost to pay.

**The BEAM handles all of it inside the same runtime.**

Foundry gives you this foundation without the months of evaluation, integration, and tuning that precede it. The stack is chosen, integrated, and production-ready from the first line you write.

---

## The AI agent that works because of what it sees

The reason most AI coding tools degrade as systems grow is not model quality. It is context.

A typical agent sees the file you're working on. Maybe adjacent files. It doesn't see the architectural decision from eight months ago. It doesn't know which resources are sensitive. It doesn't know what invariants the system must maintain. It guesses — and its guesses get worse as the system grows.

**Foundry's agent works differently — not because of a better model, but because of what it reads before proposing anything.**

It reads your domain model: every resource, every action, every relationship, every policy. It reads your architectural decisions — the ADRs that explain not just what the system does but why specific choices were made. It reads your compliance requirements, your sensitivity classifications, your existing patterns.

Then it proposes. You see the diff, the affected resources on the system map, the invariants checked. You decide.

This is the distinction from vibe coding: the agent operates against your declared architecture as a gold standard. The system validates every proposal before it reaches you. **Not autonomous. Collaborative — with full context, bounded by rules you defined.**

---

## What you get

```
Domain model (Ash + Spark DSL)
     ↓
Business logic (Reactors, State machines, Rules)
     ↓
API surfaces (GraphQL, REST — generated)
     ↓
Real-time UI (Phoenix LiveView — scaffolded)
     ↓
Tests (generated from model, compliance-driven)
     ↓
System map (live graph, always current, always correct)
     ↓
Governed proposals (AI-proposed, human-approved, classified, traceable)
```

Every layer from declaration to production. Every change governed. Nothing drifts.

**The system map** is not a diagram someone drew. It's a live, interactive graph generated from the running code — every domain, every resource, every relationship, every linked architectural decision. Always current. Readable by a new engineer on day one, or an auditor who has never seen the codebase.

---

## What teams build with Foundry

**Financial platforms** — Payment ledgers, wallets, transaction processing, regulatory reporting. Compiler-enforced invariants for money correctness. Dual-approval on sensitive changes. Full audit trail. The system handling 40,000 transactions/hour runs on three nodes.

**iGaming backends** — Real-time player wallets, odds, regulatory compliance per jurisdiction, fraud detection. 50,000 concurrent players on a single commodity server. Jurisdiction-aware compliance declarations in the DSL.

**Healthcare and clinical systems** — Patient flows, care coordination, clinical decisions with mandatory human gates. Complete audit trail. A system map that a compliance officer can read without engineering help.

**Enterprise internal platforms** — The most underserved category in software. Every large organization runs internal tools built badly, maintained expensively, understood only by whoever first wrote them. Foundry is the answer that didn't exist until now.

**Business process platforms** — Order orchestration, supply chain, legal case management, insurance policy administration. Complex long-running processes with approvals, escalations, parallel branches — declared as deterministic workflows, visualizable at every step, evolvable by the copilot without breaking what already runs.

---

## What it is not

**Not a black box.** Every Foundry project compiles to a standard Elixir application. You can read it, modify it, run it entirely without Foundry. The platform is a layer of tooling over an architecture you own outright.

**Not a product you configure.** You declare your domain exactly as it is. If your business logic doesn't fit a predefined schema, that's not a constraint to work around — it's a domain to model correctly.

**Not autonomous.** The agent proposes. The system validates. You decide. Every change is classified. Every sensitive change requires approval. Every decision is traceable. The speed of agentic development, bounded by the safety of declared architecture.

---

## Where we are

Pre-launch. Honest about it.

The structured data layer is complete. The system map runs live against real codebases. Domain introspection is stable and in use. The copilot answers questions about your domain accurately — reads your resources, your ADRs, your invariants — before proposing anything.

Code change proposals are in active development. Full-stack scaffolding, multi-agent workflow tooling, and the hosted cloud service follow in phases.

There are no published case studies yet. The design partner program exists to build them — together, on real systems, with teams who already feel the problem.

**What design partners get today:** live system map, domain introspection, copilot Q&A on their codebase, direct access to the team, and a seat at the table for every product decision that follows.

---

## Three ways to work with us

**Design Partner** — For teams building serious domain systems who want to shape the product. Early access, direct roadmap influence, Foundry team involvement in your actual architecture. Five to ten partners initially. A structured relationship, not a beta signup.

**Sponsored Domain Build** — Foundry builds alongside your team on a specific domain problem. You get a production-grade foundation at a fraction of the cost. The result becomes a public reference implementation — a proven starting point for every team facing the same domain after you.

**Cloud Hosted** — Zero infrastructure overhead. Foundry hosts the environment, system map, copilot, and CI integration. You own the domain model and application code entirely. Deploy to our infrastructure or eject to your own at any point — it's a standard Elixir app either way.

---

## The ask

We're looking for teams who have already felt the complexity wall.

Fintech teams rebuilding a ledger for the third time. iGaming platforms that have outgrown their original architecture. Healthcare organizations running clinical workflows in spreadsheets and Slack. Enterprise teams about to commission an internal platform for the second time.

If you're building something complex, domain-heavy, and long-lived — and you want to build it in a way your team, your AI, and your auditors can all understand three years from now — we should talk.

**[ Book a demo → ]** &nbsp;&nbsp;&nbsp; **[ Technical deep-dive → ]**

---

*Foundry is built on [Ash Framework](https://ash-hq.org), Phoenix LiveView, and the BEAM — a proven open-source ecosystem with real production adoption. Every Foundry project is a standard Elixir application you own and can run independently.*
