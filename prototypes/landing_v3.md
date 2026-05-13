# FOUNDRY

---

## Your codebase is the spec.

## _It never lies._

Foundry is the governed development environment for complex domain platforms on Elixir and Ash. The code declares the domain. The spec captures the intent. The copilot holds both. Nothing drifts.

**[ Check Demo → ]** &nbsp;&nbsp; **[ Look on GitHub → ]**

---

## The problem nobody talks about honestly

Starting is no longer the hard part. An AI tool scaffolds a working application in an afternoon. The first demo runs. The database schema looks reasonable. Everyone is optimistic.

Then the system grows.

Six months after launch, **your original architect leaves.** A new engineer adds a delete action to the ledger resource. The linter doesn't catch it — nobody wrote that rule. Three weeks later there's an incident. The post-mortem says _process failure._ The real cause is entropy.

Google's 2025 DORA report put numbers to what every senior engineer already knows: a 90% increase in AI tool adoption correlated with a 9% rise in bug rates and a 91% increase in code review time. GitClear found that AI-assisted code churn doubled — not because the tools are careless, but because they write into a system they have never seen whole.

**This happens because:**

**01 — Constraints live in heads, not code.**
The reason a resource is sensitive exists in one person's memory and nowhere else. When that person leaves, the constraint vanishes.

**02 — Documentation drifts from reality.**
The diagram drawn in week one describes a system that no longer exists. Nobody notices until the new engineer makes the wrong assumption.

**03 — AI tools generate from training, not your domain.**
The copilot doesn't know your invariants. It knows what Elixir looked like in its training data. It guesses the rest — and its guesses degrade as the system grows.

**04 — Change is invisible until production.**
Nobody knew that modifying this action would break three downstream compliance obligations. There was no way to know.

This is not a tooling problem. It is a structural one. Imperative code accumulates opacity. The larger it gets, the harder it becomes for any person — or any agent — to hold the entire system in mind.

---

## Foundry solves the structure, not the symptoms

Most systems exist in three versions simultaneously:

- The system as it was **designed** — in documents nobody reads anymore
- The system as it was **built** — accumulated, shaped by a hundred undocumented decisions
- The system as anyone **understands it** — a partial, personal, and quietly incorrect mental model

These versions diverge from day one. Silently. Continuously. Until something breaks in a way nobody can explain.

**Foundry makes these three versions the same thing — permanently, by construction:**

**Code is the specification.**
Ash DSL is declarative enough to read as specification. You declare domain facts — resources, relationships, policies, state machines. The compiler enforces them. What the compiler knows cannot drift.

**Intent lives in the spec-kit.**
What code cannot express — decisions, rationale, compliance obligations — lives in a structured spec-kit that the linter keeps honest. ADRs, runbooks, regulation files. Not documentation. Executable constraints. When a rule is violated, the linter fires with the exact ADR that motivated it.

**The copilot knows the full picture.**
Structured retrieval over live DSL introspection — not RAG over stale indexes. The copilot reads the compiler's output, not a cached copy of it. Full project context. Always current. No sync steps.

One source of truth. Everything derives from it. Nothing can silently diverge.

---

## Why conventional tools fail at this

No-code platforms, workflow automation tools, and off-the-shelf SaaS can accelerate early-stage development for standard problems. The constraint is always the same: they work until your domain doesn't fit their model. At that point, you're either fighting the tool or rebuilding around it.

The real question is never "which tool is fastest to start with." It's "which approach handles what your domain actually is — with all its rules, edge cases, regulated behavior, and organizational complexity — without accumulating technical debt proportional to that complexity."

Foundry is not a configuration layer you approximate your domain against. You declare your domain exactly as it is. The more complex the domain, the greater the advantage — because complexity is where declarative, compiler-enforced architecture pays off, and where configuration-based tools break down.

---

## The infrastructure decision you'll never have to make

The BEAM virtual machine was built by Ericsson in the 1980s for telephone exchanges — systems that needed to run without failure under millions of concurrent connections. That requirement shaped every design decision in the runtime. The results in production are concrete:

- Phoenix: **2 million WebSocket connections on a single server** — one EC2 instance, 2ms latency, no GC pauses, ~1KB per connection
- Bleacher Report: **150 servers → 5** for equivalent peak traffic after moving to Elixir
- Pinterest: **200 Python servers → 4 Elixir nodes**, saving over $2M/year
- One engineering team: **$16,000/month AWS Lambda → $150/month on 3 Elixir nodes**, 12 million requests/hour

These are not benchmarks. They are infrastructure bills.

Traditional stacks reach for external services — a Redis cluster for pub/sub, a Kafka instance for message queuing, a separate job processor, a standalone WebSocket service — because the runtime cannot handle these concerns natively. Each external service is an integration to maintain, a failure mode to handle, a cost to pay, and another system the AI agent can't see.

**The BEAM handles all of it inside the same runtime.** Background jobs, pub/sub, real-time channels, distributed process state, clustering — native. Not a microservices architecture. Not infrastructure you provision and manage. The default.

Foundry gives you this foundation without the months of evaluation, integration, and tuning that would otherwise precede it. The stack is chosen, integrated, and proven in production from the first line you write.

---

### The system map — your domain, always true

Most codebases are labyrinths you navigate by memory. Foundry codebases are maps.

Because Ash DSL is declarative, the system map is not inferred from the code — it **is** the code. The map is a lossless rendering of your domain, generated directly from the same source the compiler validates. It cannot drift because there is nothing to drift from.

Every node carries what matters: sensitivity classification, compliance links, ADR references, relationship cardinality, state machine states. A new engineer reads the map and understands the domain in minutes — not by tracing file imports, but by seeing the whole graph at once. An auditor reads the same map and understands what the system does without reading a single line of code.

Wrong connections are visible. Missing connections are lint errors. The map is not a diagram someone drew once. It is a live, interactive graph that tells the truth about what is running in production — always.

### The copilot — full context, governed proposals

The reason most AI coding tools degrade as systems grow is not model quality. It is context.

A typical AI agent sees the file you are working on. Maybe adjacent files. It does not see the architectural decision from eight months ago that shaped the current pattern. It does not know which resources are sensitive. It does not know what invariants the system must maintain. It guesses — and its guesses get worse as the system grows.

**Foundry's copilot is different — not because of a better model, but because of what it reads before proposing anything.**

It reads your domain model live from the compiler: every resource, every action, every relationship, every policy. It reads your ADRs — the decisions that explain not just what the system does but why. It reads your compliance links, your sensitivity classifications, your invariants. It finds what already exists before proposing something new.

Then it proposes on a branch. It never touches your working tree. The diff goes to the review panel. The affected resources are highlighted on the system map. The change is classified — `:structural`, `:behavioral`, `:compliance` — and routed to the right approver. The system validates the proposal before it reaches you.

This is the distinction from vibe coding. The agent operates against your declared architecture as a gold standard. It is not autonomous. It is collaborative — with full context, bounded by rules you defined, on a branch you review before anything merges.

```
you: Add a spending limit rule to the withdrawal reactor. UK players, £500 daily.

copilot: Checking spec-kit for WithdrawalReactor… found RG-UK-014 and ADR-005.
         This is a :behavioral change — domain lead approval required.
         Plan: draft ADR → generate 3 BDD scenarios from RG-UK-014 → add SpendingLimitRule
         → run mix ash.codegen → open review panel.
         Confirm?
```

---

## What you actually get

A complete, production-grade platform — built to your domain exactly, owned entirely by you, simpler to maintain than anything you've built before.

**End-to-end from one declaration.** You model your domain once. From that model, Foundry derives the database schema, API surfaces, authorization logic, audit trail, real-time UI, test scaffolding, and system map. Change the model — everything downstream updates. No sync steps, no separate code generation scripts to remember, no layers that can diverge.

**Faster to build, easier to grow.** A small team can build and evolve a complex regulated platform that would otherwise require twice the headcount. The system map makes every architectural decision immediately visible. The linter catches violations before they merge. Code review is fast because the graph shows exactly what changed and what it connects to. Three years in, a new engineer reads the domain in the same amount of time it took on day one.

**No stack decisions, no infrastructure choices.** The ecosystem is chosen: BEAM for the runtime, Ash for the domain layer, Phoenix LiveView for real-time UI, Oban for background jobs, Postgres for persistence. Proven at scale in production. You don't choose between Redis and native pub/sub — you don't need Redis. You don't choose a job queue library — Oban is already integrated. You don't configure a WebSocket service — Phoenix handles it. **Ask the copilot to build something. It knows exactly how, in your codebase, to your conventions, constrained by your invariants.**

**No vendor lock-in. No black box.** Every Foundry project compiles to a standard Elixir application. You can read it, modify it, and run it entirely without Foundry. The platform is tooling over an architecture you own outright. No proprietary runtime. No configuration schema that approximates your domain. Your domain, exactly, in code that the compiler validates.

**What teams build with it:**

Business process platforms — approvals, escalations, parallel branches, exception handling — declared as deterministic workflows, visualizable at every step, evolvable without breaking what runs.

Financial platforms — ledger integrity, transfer governance, regulatory compliance, audit trails, dual-approval on sensitive changes.

Healthcare and clinical systems — PHI governance, protocol enforcement, human-in-the-loop gates on decisions that cannot be autonomous, audit-ready records.

Enterprise internal platforms — the most underserved category in software. Internal tools built badly, maintained expensively, understood only by whoever first wrote them. Foundry is the answer that didn't exist until now.

---

## The ask

If you are building something complex, domain-heavy, and long-lived — and you want to build it in a way your team, your AI, and your auditors can all understand three years from now — Foundry is built for you.
