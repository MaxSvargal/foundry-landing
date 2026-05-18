# Foundry — Landing Page

> Format: structured markdown spec for landing copy + section design intent.
> Tone: confident, technically specific, no enterprise gloss.
> Aesthetic direction (for implementation): **refined minimalism, editorial typography, monospace accents.** Single dominant ink color on warm off-white, with one sharp accent (e.g. signal red or oxidized copper) used sparingly for emphasis. No purple gradients. No glassmorphism. Generous vertical rhythm. The page should feel like a well-set technical book, not a SaaS brochure.

---

## NAV (top bar, sticky)

`foundry`  ·  Product  ·  How it works  ·  For your team  ·  Docs  ·  GitHub  ·  **Start →**

---

## HERO

### The system of record for how your software actually works.

Foundry turns your codebase into a living, queryable map of itself — built on Elixir and Ash, navigated as a graph, kept honest by invariants instead of folklore.

`[ Install with one command → ]`   `[ See it on a real codebase → ]`

> *Visual:* large monospace block showing a small graph of resources (3 nodes, 4 edges), animated to reveal in stages on load. Each node labelled with a domain term — `Subscription`, `Invoice`, `Customer`. No screenshots of UI chrome. The graph *is* the hero image.

---

## THE PROBLEM (one screen, three lines, lots of whitespace)

You don't read code to understand systems. You assemble it — across files, dashboards, Notion pages, the one engineer who's been here three years.

The map of your software lives in five places, none of them current.

Foundry collapses it to one.

---

## HOW IT WORKS — three steps, no more

### 01 — Declare your domain.

Write resources and actions in Ash. `Subscription`, `Order`, `Invoice` — the things, and what can be done to them. No controllers, no schemas, no glue.

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

Every action, policy, relationship, and external boundary becomes a node. Every call, dependency, and data flow becomes an edge. Hover any node — see code, tests, traces, and the decision record that put it there.

> *Visual:* split panel. Left: code from step 01. Right: the same thing rendered as a graph. They animate in sync when you scroll.

### 03 — Edit through the graph or through code. Both round-trip.

Ask copilot for a change in plain language. Foundry produces a graph diff *first*, validates it against the schema, and only then writes Ash code. The generated code is the same Ash you'd have written. No runtime layer. No lock-in.

---

## WHAT'S DIFFERENT (positioning grid)

|  | Code editor | Architecture diagram | Low-code platform | **Foundry** |
|---|---|---|---|---|
| Source of truth | files | a Figma you forgot | proprietary | your Ash code |
| Stays current | only what you read | never | yes, but you can't leave | yes, and you can leave |
| Runs in production | n/a | n/a | their runtime | plain BEAM |
| Understands your domain | no | sort of | yes | yes |
| You can grep it | yes | no | no | yes |

The line that matters: **everything Foundry shows you is derived from code you own. Delete Foundry tomorrow and your app keeps running.**

---

## WHY ELIXIR AND ASH (the technical credibility section)

Foundry isn't a wrapper. It's a layer on top of a stack chosen deliberately.

**Ash** is already declarative. Resources, actions, policies, and relationships are data, not code-shaped prose. That's why the graph is honest — there's no hidden imperative layer to misrepresent.

**Elixir on the BEAM** gives you concurrency that doesn't cost you sleep. Per-process heaps. Preemptive scheduling. Supervision trees. The runtime that lets Discord serve millions of concurrent connections from a handful of nodes, and Pinterest cut their backend fleet from 200 servers to 4.

**The OTP discipline** means failure is a first-class concept, not a runtime surprise.

You don't need to be an Elixir expert to use Foundry. But the floor is high because the substrate is good.

---

## FOR YOUR TEAM (the multi-persona expansion)

> *Layout:* five cards in a 1×5 or 2-3 grid. Each card has a small monospace label, a short claim, and one concrete artifact mocked up next to it. Don't write feature lists.

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

## A QUIET MOMENT (the honesty section — bordered, slightly off-grid)

### Foundry is not for everything.

We won't pretend otherwise.

It's not for hard-real-time systems. Not for embedded BEAM. Not for CPU-bound workloads that don't cross a NIF boundary. Not for teams who want to ship in Python or Java — that's a different tool.

It's also not magic. You still need taste, you still own your data model, and somewhere on your team you still want one person fluent in OTP for the day the 10% hits. (Or you can buy that fluency from us. We staff senior BEAM engineers on the support tier. That's part of the product.)

---

## WHAT YOU GET ON DAY ONE

> *Layout:* monospace list, no icons, no checkmarks. Just the things, plainly stated.

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

`[ Install Foundry → ]`   `[ Read the technical paper → ]`

---

## FOOTER

`foundry`  
Built on Ash, Elixir, and the BEAM. Open source. Made by people who've shipped distributed systems and don't want to do it the hard way again.

Product · Docs · GitHub · Changelog · Security · Pricing
Company · Manifesto · Hiring · Contact

---

## DESIGN NOTES FOR THE IMPLEMENTER

**Typography**
- Display: a refined serif with character — something like *Söhne Breit*, *GT Sectra*, *Tiempos*, or *Editorial New*. Avoid Space Grotesk, Inter, anything currently saturated.
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
