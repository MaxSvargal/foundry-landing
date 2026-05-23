# Foundry — Landing Page

> Format: structured markdown spec — landing copy + per-section design intent.
> Aesthetic direction (for implementation): **refined, editorial, engineered.** Warm off-white or deep ink background, single sharp accent (oxidized copper / signal red), distinctive serif display + humanist body + a real monospace. Monospace used structurally, not just for code. No purple gradients, no glassmorphism, no card-grid hero. The page should read like a well-set technical manual written by people with strong opinions.
> Audience: serious engineers and teams building real production apps — greenfield, but not prototypes or throwaway dashboards. The copy should make prototype-seekers self-deselect.

---

## NAV (sticky, thin)

`foundry`  ·  Platform  ·  How it works  ·  Foundry Cloud  ·  Why Elixir  ·  Docs  ·  GitHub  ·  **Start →**

---

## HERO

### The system of record for software that AI helped build.

Generating an app is the easy part now. Keeping it understandable, changeable, and correct as it grows is the part nobody solved. That's Foundry.

Open-source. Built on Elixir and Ash. Your codebase, reflected as a living graph that the agent can read, reason about, and never lie to.

`[ Install Foundry → ]`   `[ See it on a real system → ]`

> *Visual:* the hero is a graph, revealed in staggered order on load — domain nodes (`Subscription`, `Order`, `LedgerEntry`), typed edges, one node highlighted with its blast radius lit up downstream. No app screenshots. No browser chrome. The graph is the image.

---

## THE PROBLEM (one screen, sparse, high contrast)

Every AI builder gets you to the first 80%.

Then you ask for the fifth feature, and the agent edits text it no longer understands. Invariants break silently. Nobody can say what a change touches. The system becomes a black box that gets worse every time it's edited.

That isn't an AI problem. It's a *coherence* problem. The agent has no model of what the system **is** — only the text of what it currently says.

Foundry gives it one.

---

## THE CORE IDEA (the part to put above the fold in spirit)

### Foundry's agent doesn't edit text. It edits a validated structure.

Other agents generate code and pray. Foundry's agent operates on a graph derived from your real codebase:

- It **cannot** reference a resource that doesn't exist — the graph won't allow it.
- It **cannot** make a change without the blast radius being computed — every edit is scoped before it lands.
- It **cannot** violate an invariant silently — the model rejects the change at the boundary.

The agent is constrained by the structure of your system, not by the size of its context window. That is the entire product.

> *Visual:* split — left, a plain-text agent producing a diff with a red "?" over an unknowable side effect; right, Foundry's agent producing a graph diff with the affected subgraph highlighted and an invariant check passing. Same model. Different floor.

---

## THE LOOP (the on-ramp — honest, no asterisks)

### From idea to running app, without leaving Studio.

1. **Ask.** Describe the project or the feature in Foundry Studio.
2. **Preview.** Studio spins up a live dev server. You see it running, immediately.
3. **Review.** Inspect the change as a graph diff, walk the test traces, read the invariants it had to satisfy.
4. **Fix.** Correct in plain language or in code. Both round-trip.
5. **Commit & deploy.** One click to production.

Ten minutes, end to end — because every step operates on a structure, not on a wall of generated text. This is the on-ramp. The reason it's still standing after the fiftieth change is everything below.

---

## REFLECTION — code as a living map

Foundry reads your Ash codebase and reflects it: every action, policy, relationship, and external boundary becomes a node; every call, dependency, and data flow becomes a typed edge.

You stop reading code to understand the system. You read the system.

- **Navigate by meaning, not by filename.** Start at a domain concept, expand along the edges that matter.
- **Blast radius is computed, not guessed.** Select any node — see the transitive set of everything a change would touch, as a number and a highlighted subgraph.
- **The graph is derived, never drifts.** Code is the source of truth. The graph is recomputed from it. It cannot lie, because there's nothing for it to lie about.
- **Execution is an overlay, not a guess.** Traces feed back onto the graph as weight — which paths run hot, which run never, which one quietly got slower last week.

---

## CODE AS SPEC — intent that travels with the code

Foundry makes the agent tag what it builds. Every non-obvious piece of logic carries an inline, structured link back to the reasoning that produced it — the project constitution, the ADR, the runbook.

```elixir
update :upgrade do
  @rationale "Sync charge required by PSD2 SCA; async breaks the 3DS callback"
  @decision_ref "ADR-0042"
  change Billing.Changes.ProrateAndCharge
end
```

Decisions are typed records with required shape — context, options, consequences, reversibility — pinned to the graph nodes they govern. When the code under a decision changes, the decision is flagged stale. Documentation stops being a separate thing that rots. It *is* the code, and the graph keeps it honest.

---

## TESTS YOU CAN READ WITHOUT READING CODE

A serious system needs a real test pyramid, and Foundry builds one as the app grows — wide at the base, narrow at the top:

- **Unit** — individual functions and changes, the broad base.
- **Property** — instead of fixed examples, Foundry generates thousands of inputs and action sequences and checks your invariants survive all of them. This is where "balance is never negative" stops being a hope.
- **Integration** — resources and boundaries working together.
- **Scenario** — end-to-end domain flows, expressed in business language.
- **Regression** — every fixed bug, pinned so it cannot return.

Each test attaches to the graph node it exercises. Click a node, **watch the test execute as a trace** — step by step, state by state — and validate the logic without opening a source file. Reviewers see what the system *does*, not just what it *says*.

**And Foundry checks the tests themselves.** An agent that writes its own tests can write tests that pass without proving anything. Foundry runs mutation analysis — deliberately breaking the code to confirm the tests notice. A suite that survives a mutation is theater; Foundry tells you which tests are real.

---

## WHY ELIXIR AND ASH — the part that makes this defensible

This is a deliberate stack bet, and it's the reason Foundry is hard to copy.

**LLMs write Elixir unusually well — and there's a measured reason.** Tencent's AutoCodeBench — 3,920 problems across 20 languages, generated and verified in sandboxes rather than hand-picked — found Elixir had the highest completion rate across models. Not because it's popular; because of what it is: immutability enables local reasoning, the ecosystem's documentation quality gives clean training signal, and the language's stability means that signal stays correct over time.

**Ash makes it better still.** Generated JavaScript rots because nothing enforces structure — the agent can produce any shape, and usually does. Ash is declarative and introspectable: invalid DSL doesn't compile, structure is uniform, and many runtime failures become compile-time errors. An AI generating Ash *cannot* produce the unmaintainable sprawl it produces in a typical Next.js app. The framework won't let it.

**The BEAM is the cheapest serious runtime at scale.** One Elixir node handles what would otherwise be ten services. Per-process heaps, preemptive scheduling, supervision trees — the runtime that lets a single VPS hold millions of concurrent connections and stay up. Pinterest cut its backend fleet from 200 servers to 4 on this stack. You get concurrency, soft real-time, and fault tolerance without standing up Redis, Kafka, etcd, and a workflow engine on day one — the ecosystem already covers most of what those exist to do.

The combination — a language AI writes well, a framework that keeps that output structurally honest, a runtime that scales without a microservice sprawl — is not a feature anyone can ship next quarter.

---

## WHO THIS IS FOR

Foundry is built for **greenfield production systems** — real applications meant to carry real load. Real-time apps, high-connection services, systems where uptime and correctness are not optional.

It is **not** a prototype toy, and not a landing-page generator. If you want a throwaway demo by tonight, other tools are faster and that's fine. Foundry is for the app you intend to still be running, and still be able to reason about, in three years.

---

## A QUIET MOMENT (the honesty section — off-grid, bordered)

### What Foundry is not.

It's not low-code. The output is plain Ash in your repo — delete Foundry tomorrow and your app keeps running on plain BEAM.

It's not for hard-real-time, embedded BEAM, or CPU-bound workloads that never cross a NIF boundary.

It's not magic. You still own your domain model and your taste. And LLMs are still, on raw first-pass, marginally stronger at mainstream languages than at Elixir — Foundry's bet is that Elixir's *durability* under change beats a head start on generation, and that the graph closes the rest of the gap. We think that trade is correct. We'd rather you know the shape of it than discover it later.

---

## FOUNDRY, OPEN SOURCE

The platform is open source and local-first.

```
foundry init                 Start a new system, or open an existing Ash project.
foundry studio               Open the visual workspace — graph, agent, traces.
foundry graph                Render the system map. Browser, or pipe to dot.
foundry blast-radius <node>  What breaks if I change this?
foundry invariants check     Run every invariant across the model.
foundry decisions            List ADRs. Show which have gone stale.
foundry test --trace         Run tests and replay them as inspectable traces.
```

The graph stays on your machine. GitHub is the source of truth — Studio's project manager opens any repo you point it at. **Foundry Studio is one workspace; it runs the same whether on your laptop or in Foundry Cloud.**

---

## FOUNDRY CLOUD

The hosted home for Foundry apps — the same Studio, with infrastructure attached.

- **Model, build, ship — in one place.** The full loop, hosted: ask, preview, review, deploy.
- **One click to production.** Foundry Cloud runs a managed environment for your app. You don't assemble infrastructure; you deploy into it.
- **Built the way the apps are built.** Foundry Cloud is itself a Foundry app. We run our own thesis in production.
- **History that compounds.** Hosted graph history, multi-user views, blast-radius alerts on high-fan-in changes, audit-ready exports.

Foundry Cloud is opt-in. The open-source platform never depends on it.

> *Note for implementer:* present this as a calm two-column block, not a pricing-style feature grid. Cloud is the same product, hosted — sell continuity, not a bigger locked tier.

---

## FOR THE REST OF YOUR TEAM

The same graph, projected for whoever needs it. One source of truth, many lenses.

- **Staff engineers** — architecture decisions pinned to nodes; drift surfaced before an incident finds it.
- **Product** — the domain layer in business language; click an action, read what it actually does.
- **Audit & compliance** — the authorization model *is* the documentation; export the access matrix at any commit, with provenance, and see which protected resources have a policy gap before an attacker does.

No separate documents to fall out of date. There are no separate documents — only the graph, derived from code, projected per role.

---

## FAQ (real objections, answered straight)

**Is this a low-code platform?**
No. Output is plain Ash code you own. Low-code platforms own the runtime; Foundry doesn't. Your app runs on plain BEAM with or without us.

**Won't the agent hallucinate Ash code?**
It doesn't write raw DSL into your repo. It produces a graph diff, validated against your real schema. Invalid structure never compiles into your codebase.

**Is the "ten minutes" real?**
Yes — and it's the whole loop, not a build metric: ask, live preview, review the graph diff and traces, fix, commit, deploy. Not a template drop. A real change you reviewed and shipped.

**Does it work with my existing Elixir app?**
If you're on Ash, immediately. On raw Phoenix/Ecto, Foundry reads what maps cleanly and gets richer as you adopt Ash. No forced migration.

**What about our Python / TypeScript services?**
They appear in the graph as external resources with typed contracts. Foundry tracks the boundary; it won't pretend to understand their internals.

**How do you handle versioning and collaboration?**
Git. Code is the source of truth, the graph is derived deterministically, standard PR workflows apply. Multi-user graph editing in Foundry Cloud builds on the same foundation.

**Where does Foundry Cloud deploy?**
Into a Foundry-managed environment. You deploy your app; we run the infrastructure under it. The open-source platform stays fully usable on its own.

**What's the catch?**
You're betting on Elixir, Ash, and the BEAM. All three have been load-bearing in production for over a decade. That's the bet — and we think it's the right one for software meant to last.

---

## CLOSER (full width, large type, low ink)

### Software you can still understand.

That's the whole promise. Start with Foundry.

`[ Install Foundry → ]`   `[ Open Foundry Cloud → ]`

---

## FOOTER

`foundry`
Open-source platform for software that AI helped build. Elixir, Ash, BEAM.
Made by people who've run distributed systems and refuse to do it the hard way again.

Platform · Foundry Cloud · Docs · GitHub · Changelog · Security · Manifesto

---

## DESIGN NOTES FOR THE IMPLEMENTER

**Typography**
- Display: a serif with engineering character — *GT Sectra*, *Tiempos Headline*, *Editorial New*. Not Space Grotesk, not Inter.
- Body: a quiet humanist sans, or a literary serif at generous size.
- Mono: *Berkeley Mono*, *JetBrains Mono*, or *IBM Plex Mono* — used for code, CLI blocks, nav, and structural labels.

**Color**
- Background: warm off-white `#F4F0E8`, or deep ink `#0D0D0B` for a dark cut.
- Ink: `#1A1A18`, never pure black.
- Accent: oxidized copper `#A4471C` or signal red `#D4341A` — one element per screen, never body text, never every hover.
- Gradients only inside the hero graph, and only subtle.

**Layout**
- 12-column grid, deliberately broken at least twice (the honesty section off-grid; the closer full-bleed).
- 120–160px between sections at desktop. The page breathes.
- Code blocks sit in the prose rhythm — not boxed in cards.

**Motion**
- One orchestrated hero reveal: graph nodes in staggered sequence (~800ms), then the blast-radius lighting up downstream.
- One scroll-triggered moment: the code-to-graph transformation in the Reflection section.
- Otherwise stillness. No parallax, no fade-on-every-paragraph.

**Voice rules (enforce in copy review)**
- No "powerful," "seamless," "revolutionize." "AI-powered" never as a top-level claim.
- Specifics beat adjectives — "200 servers to 4" beats "scalable."
- The benchmark claim must stay exact: Tencent AutoCodeBench, 3,920 problems, 20 languages, highest completion rate. Never "30 languages," never a flat "best language for AI."
- The honesty section is non-negotiable.
- Lowercase product name in body; capitalized only at sentence start.

**Anti-patterns to refuse**
- Hero with a three-card feature grid.
- Logo wall + one beige testimonial.
- Animated gradient "Get started in seconds" button.
- Anything indistinguishable from every dev-tool page shipped since 2022.
