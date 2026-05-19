# Foundry — Landing Page

> Format: structured markdown spec for landing copy + section design intent.
> Tone: confident, technically specific, no enterprise gloss.
> Aesthetic direction (for implementation): **refined minimalism, editorial typography, monospace accents.** Single dominant ink color on warm off-white, with one sharp accent (e.g. signal red or oxidized copper) used sparingly for emphasis. No purple gradients. No glassmorphism. Generous vertical rhythm. The page should feel like a well-set technical book, not a SaaS brochure.

---

## NAV (top bar, sticky)

`foundry` · Product · How it works · For your team · Docs · GitHub · **Start →**

---

## HERO

#### Build, run, and understand complex platforms — without the complexity.

A full-stack Elixir/Ash environment with a live system graph that knows your domain. Your AI copilot works from code, tests, traces, and decisions — not from guesses. Everything your team needs from day one. Eject any layer, any time.

`[ Take a Tour → ]` `[ Source Code → ]`

> _Visual:_ large monospace block showing a small graph of resources (3 nodes, 4 edges), animated to reveal in stages on load. Each node labelled with a domain term — `Subscription`, `Invoice`, `Customer`. No screenshots of UI chrome. The graph _is_ the hero image.

---

You don't read code to understand systems. You assemble it — across files, dashboards, Notion pages, the one engineer who's been here three years.

---

## THE PROBLEM (one screen, three lines, lots of whitespace)

Starting is no longer the hard part. An AI tool scaffolds a working application in an afternoon. The first demo runs. The database schema looks reasonable. Everyone is optimistic.

Then the system grows.

Six months after launch, your original architect leaves. A new engineer adds a delete action to the ledger resource. The linter doesn't catch it — nobody wrote that rule. Three weeks later there's an incident. The post-mortem says _process failure._ The real cause is entropy.

Google's 2025 DORA report put numbers to what every senior engineer already knows: a 90% increase in AI tool adoption correlated with a 9% rise in bug rates and a 91% increase in code review time. AI-assisted code churn doubled — not because the tools are careless, but because they write into a system they have never seen whole.

**This happens because:**

**01 — Constraints become code.**
Right now the reason a resource is sensitive exists in one person's memory and nowhere else. When that person leaves, the constraint vanishes. Foundry makes constraints executable — they live in code as specs, and the linter fires when they're violated.

**02 — The map is the code.**
The diagram drawn in week one describes a system that no longer exists. In Foundry, the system map is not inferred from code — it _is_ the code. A lossless rendering generated from the same source the compiler validates. It cannot drift.

**03 — Your copilot reads your domain, not its training data.**
The copilot doesn't know your invariants. It knows what Elixir looked like in its training data. Foundry's copilot reads your domain model live from the compiler, your ADRs, your compliance links, and your sensitivity classifications before proposing anything.

**04 — Blast radius before merge, not after.**
Nobody knew that modifying this action would break three downstream compliance obligations. Foundry proposes on a branch, classifies the change as `:structural`, `:behavioral`, or `:compliance`, and routes it to the right approver before anything merges.

This is not a tooling problem. It is a structural one. Imperative code accumulates opacity. The larger it gets, the harder it becomes for any person — or any agent — to hold the entire system in mind.

The map of your software lives in five places, none of them current.

Foundry collapses it to one.

---

## HOW IT WORKS — three steps, no more

### 01 — Declare your domain.

Write resources and actions in Ash. `Subscription`, `Order`, `Invoice` — the things, and what can be done to them. What code cannot express — decisions, rationale, compliance obligations — lives in a structured spec-kit that the linter keeps honest. Not documentation. Executable constraints.

```elixir
defmodule Billing.Subscription do
  use Ash.Resource

  actions do
    update :upgrade do
      change Billing.Changes.ProrateAndCharge
      require_atomic? false
    end
  end

  invariants do
    invariant :balance_non_negative, expr(balance >= 0)
  end
end
```

### 02 — Foundry reflects it.

Every action, policy, and relationship becomes a node. Hover any node — see code, tests, traces, and the decision that put it there. The map isn't drawn once. It's derived from the compiler, always.

```
# System map — derived from compiler output
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
      └── has_many :invoices
```

> _Visual:_ split panel. Left: code from step 01. Right: the same thing rendered as a graph. They animate in sync when you scroll.

### 03 — Edit through the graph or through code. Both round-trip.

The copilot reads your live domain model before proposing anything. It finds what already exists. Proposes on a branch. Classifies the change. Routes it to the right approver. You confirm.

```
you: Add a spending limit rule to the withdrawal reactor. UK players, £500 daily.

copilot: Checking spec-kit for WithdrawalReactor… found RG-UK-014 and ADR-005.
         This is a :behavioral change — domain lead approval required.
         Plan: draft ADR → generate 3 BDD scenarios from RG-UK-014 → add SpendingLimitRule
         → run mix ash.codegen → open review panel.
         Confirm?
```

The generated code is the same Ash you'd have written. No runtime layer. No lock-in. This is the distinction from vibe coding — the agent operates against your declared architecture as a gold standard.

---

## WHAT'S DIFFERENT (positioning grid)

|                         | Code editor        | Architecture diagram | Low-code platform        | **Foundry**            |
| ----------------------- | ------------------ | -------------------- | ------------------------ | ---------------------- |
| Source of truth         | files              | a Figma you forgot   | proprietary              | your Ash code          |
| Stays current           | only what you read | never                | yes, but you can't leave | yes, and you can leave |
| Runs in production      | n/a                | n/a                  | their runtime            | plain BEAM             |
| Understands your domain | no                 | sort of              | yes                      | yes                    |
| AI first-try rate       | ~50%               | n/a                  | proprietary              | 80.3%                  |
| You can grep it         | yes                | no                   | no                       | yes                    |

**Everything Foundry shows you is derived from code you own. Delete Foundry tomorrow and your app keeps running.**

---

## THE NUMBERS

AI adoption is rising. So are bug rates. Elixir is the exception.

| Metric | Value | Source |
|---|---|---|
| Increase in AI tool adoption | 90% | Google DORA 2025 |
| Rise in bug rates correlated with that adoption | +9% | Google DORA 2025 |
| Increase in code review time alongside AI adoption | +91% | Google DORA 2025 |
| AI-assisted code churn | 2× | GitClear research |
| LLM Pass@1 on Elixir — highest of any language | 80.3% | AutoCodeBench / Claude Opus 4 |

> _Note:_ The first four numbers are the problem. The last one is why Foundry is built on Elixir.

---

## WHY ELIXIR AND ASH (the technical credibility section)

Foundry isn't a wrapper. It's a layer on top of a stack chosen deliberately.

**Ash** is already declarative. Resources, actions, policies, and relationships are data, not code-shaped prose. That's why the graph is honest — there's no hidden imperative layer to misrepresent.

**Elixir on the BEAM** was built by Ericsson for telephone exchanges — systems that needed to run without failure under millions of concurrent connections. That requirement shaped every design decision in the runtime.

Traditional stacks reach for external services — Redis for pub/sub, Kafka for message queuing, a separate job processor — because the runtime cannot handle these concerns natively. **The BEAM handles all of it inside the same runtime.** Background jobs, pub/sub, real-time channels, distributed process state, clustering — native. Not infrastructure you provision and manage. The default.

These are not benchmarks. They are infrastructure bills.

- Phoenix: **2 million WebSocket connections on a single server** — one EC2 instance, 2ms latency, no GC pauses, ~1KB per connection
- Bleacher Report: **150 servers → 5** for equivalent peak traffic after moving to Elixir
- Pinterest: **200 Python servers → 4 Elixir nodes**, saving over $2M/year
- One engineering team: **$16,000/month AWS Lambda → $150/month on 3 Elixir nodes**, 12 million requests/hour

The BEAM removes the infrastructure layer. Ash removes the boilerplate layer. Foundry removes the knowledge layer — compile-time domain constraints, context-complete AI generation, and accumulated domain rules that fire at the moment a violation is about to be introduced.

You don't need to be an Elixir expert to use Foundry. But the floor is high because the substrate is good.

---

## FOR YOUR TEAM (the multi-persona expansion)

> _Layout:_ five cards in a 1×5 or 2-3 grid. Each card has a small monospace label, a short claim, and one concrete artifact mocked up next to it. Don't write feature lists.

### For the developer

**Stop reading code to understand systems.**
Navigate by meaning, not by filename. Refactor with blast radius shown, not guessed.

### For the staff engineer

**Architecture decisions that survive contact with the codebase.**
Pin ADRs to nodes. Foundry tells you when a decision has been silently violated.

### For the engineering manager

**See your system's health the way you see your business metrics.**
Bus-factor, drift, fragility — derived from real artifacts, not self-reported sprint data.

### For the product manager

**Finally looking at the same picture as your engineers.**
The domain layer, in business language. Click `:upgrade_subscription`, read what it actually does.

### For the auditor

**Your authorization model is the documentation auditors want.**
Export the access matrix for any resource, at any commit, with provenance.

---

## WHAT YOU GET ON DAY ONE

A complete, production-grade platform — built to your domain exactly, owned entirely by you, simpler to maintain than anything you've built before.

**End-to-end from one declaration.** You model your domain once. From that model, Foundry derives the database schema, API surfaces, authorization logic, audit trail, real-time UI, test scaffolding, and system map. Change the model — everything downstream updates. No sync steps, no separate code generation scripts, no layers that can diverge.

**No stack decisions.** The ecosystem is chosen: BEAM for the runtime, Ash for the domain layer, Phoenix LiveView for real-time UI, Oban for background jobs, Postgres for persistence. Proven at scale in production. You don't choose between Redis and native pub/sub — you don't need Redis. You don't configure a WebSocket service — Phoenix handles it.

**What teams build with it:**

Business process platforms — approvals, escalations, parallel branches, exception handling — declared as deterministic workflows, visualizable at every step, evolvable without breaking what runs.

Financial platforms — ledger integrity, transfer governance, regulatory compliance, audit trails, dual-approval on sensitive changes.

Healthcare and clinical systems — PHI governance, protocol enforcement, human-in-the-loop gates on decisions that cannot be autonomous, audit-ready records.

Enterprise internal platforms — the most underserved category in software. Internal tools built badly, maintained expensively, understood only by whoever first wrote them.

> _Layout:_ monospace CLI list, no icons, no checkmarks. Just the things, plainly stated.

```
foundry init                      Start from a template or an existing Ash project.
foundry graph                     Render the system map. Open in browser, or pipe to dot.
foundry blast-radius <node>       What breaks if I change this?
foundry invariants check          Run all invariants across the model.
foundry decisions                 List ADRs. Show which are stale.
foundry agent                     Pair-program against the graph, not against text.
```

Open source CLI. The graph stays on your machine. The SaaS tier is opt-in, for teams who want hosted history, multi-user views, and one-click deploys.

---

## A QUIET MOMENT (the honesty section — bordered, slightly off-grid)

### Foundry is not for everything.

We won't pretend otherwise.

It's not for hard-real-time systems. Not for embedded BEAM. Not for CPU-bound workloads that don't cross a NIF boundary. Not for teams who want to ship in Python or Java — that's a different tool.

It's also not magic. You still need taste, you still own your data model, and somewhere on your team you still want one person fluent in OTP for the day the 10% hits. (Or you can buy that fluency from us. We staff senior BEAM engineers on the support tier. That's part of the product.)

---

## FAQ (handle the real objections, not the marketing ones)

**Is this a low-code tool?**
No. The output is plain Ash code in your repo. If Foundry disappears, you still have an Elixir application. Low-code tools own the runtime. We don't.

**Does it work with my existing Elixir app?**
If you're using Ash, yes, immediately. If you're on raw Phoenix/Ecto, Foundry can read the parts that map cleanly, but the graph gets richer as you migrate to Ash. We don't force the migration.

**What about Python / TypeScript services we already have?**
They appear in the graph as external resources with typed boundaries (OpenAPI, Protobuf, JSON Schema). Foundry won't pretend to understand their internals, but it will track the contract.

**Won't the LLM hallucinate Ash code?**
The agent doesn't write raw DSL. It produces a graph diff that Foundry validates against the actual Ash schema. Invalid DSL never reaches your codebase. This is the single biggest reason Foundry exists.

**How do you handle versioning?**
Git. Code is the source of truth, the graph is derived deterministically. Standard PR workflows. Schema-level migration tools (`mix ash.codegen`, `ash_postgres`) handle the database side.

**Can I host this myself?**
The CLI and graph are local-first. The SaaS — hosted history, team views, deploy — is opt-in and we publish a self-hosted edition for teams who need it.

**What's the catch?**
You're trusting Ash and the BEAM. Both have been load-bearing in production for over a decade. Neither is going anywhere. That's the bet.

---

## CLOSER (full width, large type, low ink)

### The map is the territory now.

Stop maintaining two of them.

If you are building something complex, domain-heavy, and long-lived — and you want to build it in a way your team, your AI, and your auditors can all understand three years from now — foundry is built for you.

`[ Install Foundry → ]` `[ Read the technical paper → ]`

---

## FOOTER

`foundry`  
Built on Ash, Elixir, and the BEAM. Open source. Made by people who've shipped distributed systems and don't want to do it the hard way again.

Product · Docs · GitHub · Changelog · Security · Pricing  
Company · Manifesto · Hiring · Contact

---

## DESIGN NOTES FOR THE IMPLEMENTER

**Typography**

- Display: a refined serif with character — something like _Söhne Breit_, _GT Sectra_, _Tiempos_, or _Editorial New_. Avoid Space Grotesk, Inter, anything currently saturated.
- Body: a quiet humanist sans, or a literary serif at slightly larger sizes than usual.
- Mono: `Berkeley Mono`, `JetBrains Mono`, or `IBM Plex Mono`. Used liberally for code, labels, and structural accents.

**Color**

- Background: warm off-white `#F5F1EA` (or full dark mode equivalent `#0E0E0C`).
- Ink: `#1B1B19` — not pure black.
- Accent: oxidized copper `#A4471C` or signal red `#D4341A`. Used for one thing per screen, max. Never for body text. Never for hover states on everything.
- No gradients in the chrome. Gradients allowed only inside the hero graph visualization, and only subtle.

**Layout**

- 12-column grid, but break it deliberately at least twice per page (the honesty section is off-grid; the closer is full-width).
- Vertical rhythm is generous — 120–160px between sections at desktop. The page should breathe.
- Code blocks are not boxed-in cards. They sit on the page in the rhythm of the prose.

**Motion**

- One orchestrated reveal on hero load (graph nodes appearing in sequence over ~800ms).
- One scroll-triggered animation when the code-to-graph transformation appears.
- Otherwise: stillness. No parallax, no fade-on-scroll on every paragraph, no cursors trailing things.

**Voice rules (enforce in copy review)**

- No "powerful." No "seamless." No "revolutionize." No "AI-powered" as a top-level claim.
- Specifics over adjectives. "Cuts your backend fleet from 200 to 4" beats "highly scalable."
- Willing to name what we're not. The honesty section is non-negotiable.
- Lowercase product name in body copy; only capitalized at sentence start.

**Anti-patterns to refuse**

- Hero with three-card "feature" grid.
- Testimonial section with five logos and one beige quote.
- "Get started in seconds" with an animated gradient button.
- Anything that looks like every other dev-tool landing page launched since 2022.
