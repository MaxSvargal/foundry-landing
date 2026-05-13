## What This System Is

**Foundry** is a governed build environment for complex domain platforms on the Elixir/Ash/Phoenix stack.

It is not an IDE. It is not a code generator. It is an environment where:

- Domain structure is declared once via Spark DSL
- Invariants are enforced by the compiler and linter
- AI agents propose changes; humans approve them
- Compliance requirements are linked to code and tests
- The system diagram is always generated from live code

---

## What the Positioning Should Actually Convey

Three things Foundry does that are genuinely distinctive:

**It governs how platforms are built, not just what they're built with.** The proposal model, change classification, approval chains, compliance linking — this is the core value. No other tool in the Elixir ecosystem does this.

**It makes regulated domains tractable for smaller teams.** A 5-person team building a fintech or iGaming platform without Foundry has to manually maintain the governance discipline that Foundry enforces automatically. That's the real cost saving.

**The domain is always the source of truth.** The system map, the compliance matrix, the data catalog, the audit trail — all generated from live code. Nothing drifts.

---

## A Sharper Alternative

Something closer to:

> **Foundry is a governed development environment for regulated domain platforms on Elixir and Ash. It enforces compliance, audit, and architecture standards as code — so small teams can build and evolve complex platforms without governance breaking down.**

Or shorter:

> **The governed build environment for regulated Elixir platforms. Compliance, audit, and architecture enforced by the compiler — not by process.**

These are rough. But they're more honest about what Foundry actually is, speak to the real buyer pain, and don't create false expectations about "no code."

---

## The Deeper Question

Who is the primary buyer? That determines everything about positioning.

If it's **CTOs of regulated startups** — the governance and compliance angle is the lead. They're terrified of technical debt in domains where a mistake has regulatory consequences.

If it's **Elixir engineering leads** — the Ash ecosystem depth and the compiler-enforced discipline is the lead. They know the stack, they want to know why Foundry is better than rolling their own conventions.

If it's **domain owners or product teams** — neither of the above works. You'd need a completely different story.

Right now the positioning tries to speak to all three and lands with none. What's the actual target?

---

Good challenge. Let me think about what regulated domain platforms actually need beyond governance, and where the Ash ecosystem has genuine gaps versus where it's already strong.

---

## What Regulated Domain Platforms Actually Need

Before mapping gaps, the honest requirements list for a production regulated platform:

- Governed change management ✓ Foundry
- Domain modeling and persistence ✓ Ash/Postgres
- Authentication and authorization ✓ ash_authentication, ash policies
- Background jobs ✓ ash_oban
- Audit trail ✓ ash_paper_trail
- Soft delete ✓ ash_archival
- State machines ✓ ash_state_machine
- API surfaces ✓ ash_graphql, ash_json_api
- Real-time UI ✓ Phoenix LiveView
- Observability ✓ telemetry, existing spans
- Money handling ✓ ash_money, ex_money
- Feature flags ✓ fun_with_flags

That's a strong foundation. The gaps are specific and worth being precise about.

---

## Real Gaps Worth Filling

### 1. Multi-tenancy

This is the most significant gap for SaaS platforms built on Ash.

The ecosystem has no authoritative multi-tenancy solution. Teams currently roll their own using Postgres schemas, row-level security, or tenant context in process dictionaries. Each approach has different tradeoffs and none is enforced by convention.

For regulated domains this is critical. A data leak between tenants in a healthcare or fintech platform is a regulatory incident, not just a bug.

**What Foundry could provide:**
A tenancy strategy declaration in the manifest — schema-based, row-based, or hybrid — with linter enforcement that every resource consistently implements the declared strategy. The copilot scaffolds new resources with the correct tenancy pattern automatically. No resource can be added without the tenancy declaration being explicit.

This isn't a new package. It's Foundry knowing which strategy the project chose and enforcing it.

---

### 2. Event Sourcing and CQRS

Ash actions are transactional but not inherently event-sourced. For regulated domains — especially fintech ledgers, audit-critical workflows, point-in-time reconstruction — event sourcing is often a requirement, not an option.

`ash_paper_trail` gives you a change log. That's not the same as an event store. You can't rebuild state from paper trail versions reliably if your business events are complex.

**The gap:** There's no `ash_events` or `ash_commanded` that cleanly integrates Commanded (the Elixir CQRS/ES library) with Ash resources. Teams that need event sourcing currently step outside the Ash model entirely.

**What Foundry could provide:**
Either a pattern library for integrating Commanded with Ash (scaffolded by the copilot as a governed proposal), or a genuine `ash_events` extension that Foundry sponsors or builds. This is probably the most technically ambitious gap but also the highest value for fintech and ledger platforms specifically.

---

### 3. Notification and Communication Infrastructure

Every regulated platform needs to send notifications — emails, SMS, push, webhooks, in-app. The current ecosystem has no governed solution here.

`swoosh` handles email. `ex_twilio` handles SMS. But there's no unified notification resource model that:

- Tracks delivery status
- Respects user communication preferences
- Links notifications to the compliance events that triggered them
- Provides an audit trail of what was sent, when, and why

**What Foundry could provide:**
A notification resource scaffold with delivery tracking, preference management, and compliance linkage. When a compliance event fires — a KYC rejection, a withdrawal limit breach — the notification sent is traceable to the event in the audit log. This is a gap that every team building on Ash fills manually and inconsistently.

---

### 4. Rate Limiting and Abuse Prevention

`ash_rate_limiter` exists but is thin. For regulated platforms — especially iGaming and fintech — rate limiting is a compliance requirement, not just a performance concern. Velocity checks on transactions, API abuse prevention, and suspicious activity detection all need a governed approach.

**The gap:** Rate limiting today is applied inconsistently, often at the Phoenix router level without connection to the domain model or compliance requirements.

**What Foundry could provide:**
Rate limit declarations in the Ash resource DSL, enforced by the linter, linked to compliance requirements where relevant. A withdrawal resource with a regulatory velocity limit shouldn't have that limit scattered in router plugs — it should be declared on the resource alongside the compliance link that requires it.

---

### 5. Document Management and E-Signatures

Legal, healthcare, and fintech platforms consistently need document management — contracts, KYC documents, signed agreements, regulatory filings. The ecosystem has no standard solution.

**The gap:** Teams roll their own file storage integrations (S3, GCS) without governed document lifecycle management — versioning, retention policies, access audit, signature verification.

**What Foundry could provide:**
A document resource scaffold with retention policy declarations, access audit via paper trail, and signature state tracking via ash_state_machine. Not a document editor — a governed document lifecycle model. The actual storage is pluggable (S3 adapter, GCS adapter). The lifecycle governance is Foundry's contribution.

---

### 6. Internationalisation and Localisation at the Domain Level

`ex_cldr` and `ash_money` handle currency and number formatting well. But i18n at the domain level — translatable content, locale-specific compliance rules, multi-jurisdiction regulatory requirements — has no standard approach.

**The gap:** A platform operating in multiple jurisdictions needs to know that certain regulations apply only in certain locales, that certain UI strings require legal review per jurisdiction, and that certain actions are restricted by geography. None of this is expressible in the current Ash DSL.

**What Foundry could provide:**
Jurisdiction declarations in the manifest and on compliance links. A regulation file can declare its jurisdiction scope. The linter can warn when a compliance-linked resource has no jurisdiction declaration. This is thin tooling with high value for multi-jurisdiction regulated platforms.

---

### 7. Testing Infrastructure for Regulated Behaviours

ADR-007 covers test generation strategy but the ecosystem gap is deeper. Property-based testing for financial calculations, regulatory scenario testing, and chaos testing for compliance-critical flows are all underdeveloped.

`stream_data` exists for property testing. `ex_machina` or `ash`'s own generators handle factories. But there's no standard approach to:

- Regulatory scenario test libraries (common KYC scenarios, AML patterns, withdrawal edge cases)
- Invariant testing (this ledger must always balance, regardless of action sequence)
- Compliance boundary testing (this action must always be blocked for this actor class)

**What Foundry could provide:**
A compliance scenario test scaffold — generated from regulation files and compliance links, not from test imagination. If RG-UK-014 has 8 documented scenarios, `mix foundry.test.compliance_scaffold --regulation=RG-UK-014` generates 8 test skeletons. This closes the loop between regulation files and test coverage in a way that's currently entirely manual.

---

## Gaps Foundry Should Not Fill

Being honest about boundaries:

**Search** — Elasticsearch/OpenSearch integration, full-text search across domain resources. The ecosystem has `ash_postgres` full-text search which covers most cases. Foundry shouldn't opine on search architecture.

**Data warehouse / ETL** — as discussed, dbt scaffold is the boundary. Foundry doesn't manage the warehouse.

**Billing and payments** — Stripe integration, subscription management. These are application concerns, not platform governance concerns. The copilot scaffolds them on request.

**Infrastructure provisioning** — ADR-006 is clear. Proposal-only, human applies.

---

## The Honest Priority Order

If Foundry is going to fill gaps, the order should be driven by how universal the need is and how badly the current ecosystem fails:

**Highest priority — affects every regulated SaaS platform:**
Multi-tenancy enforcement, compliance scenario test scaffolding

**High priority — affects most fintech/iGaming/healthcare platforms:**
Notification infrastructure with compliance linkage, document lifecycle management

**Medium priority — affects platforms at scale or in multiple jurisdictions:**
Event sourcing pattern library, jurisdiction-aware compliance declarations

**Lower priority — addressed adequately by ecosystem today:**
Rate limiting (thin but functional), i18n (ex_cldr covers most cases)

---

## The Sharper Positioning This Suggests

The real gap Foundry fills isn't just governance. It's that **regulated domain platforms have a cluster of cross-cutting requirements** — tenancy, audit, compliance linking, notification, document lifecycle, test coverage — that every team assembles manually and inconsistently.

Foundry's value is that these requirements are:

- Declared once in the manifest and DSL
- Enforced by the linter
- Scaffolded consistently by the copilot
- Impossible to accidentally omit

That's a stronger story than governance alone. It's closer to:

> **Foundry is the missing layer between the Ash ecosystem and a production-ready regulated platform — enforcing the cross-cutting requirements that every team rebuilds from scratch.**

The ecosystem gives you the primitives. Foundry gives you the discipline and the connective tissue between them.

---

Good push. Regulatory requirements are actually a narrow slice of what makes domain platforms hard. Let me think wider.

---

## What Actually Makes Domain Platforms Hard

Regulated domains get the attention because the consequences of failure are visible — fines, license revocations, audits. But the harder and more universal problems are about **domain complexity itself**, regardless of regulation.

---

## The Real Hard Problems

### 1. Money and Pricing Complexity

Every platform that touches commerce eventually builds a custom pricing engine. Subscription tiers, usage-based billing, discounts, proration, currency conversion, tax calculation, refunds, credits. This isn't a regulatory requirement — it's just genuinely hard domain logic that every team rebuilds.

The ecosystem has `ash_money` and `ex_money` for correct money arithmetic. What doesn't exist is a governed pricing model — a way to declare pricing rules, discount structures, and billing cycles as domain resources with the same governance discipline as everything else.

**Why this matters beyond fintech:** SaaS platforms, marketplaces, e-commerce, healthcare billing, legal billing — almost every domain platform touches this eventually. The current approach is always custom, always undertested, and always becomes a maintenance nightmare.

**What Foundry could provide:** A pricing DSL scaffold. Not a billing engine — the copilot generates that as governed Ash resources. But a pattern library and scaffold generator for common pricing models, with linter enforcement that pricing resources have paper trail (because pricing changes are always auditable in practice even when not legally required) and that currency handling uses `Ash.Type.Money` consistently.

---

### 2. Workflow and Human Task Management

Most domain platforms eventually need humans in the loop — not for compliance reasons, but because the domain requires judgment. Content moderation, loan underwriting, claims assessment, legal review, medical triage.

Reactor handles automated workflows well. `reactor_human_gate` handles compliance-gated decisions. But there's no general human task management model — task queues, SLAs, assignment rules, escalation paths, workload balancing.

**The gap:** Teams building case management, claims processing, or underwriting platforms build custom task queue systems that aren't connected to the domain model. Tasks exist in a separate system (Jira, Salesforce, custom) disconnected from the Ash resources they concern.

**What Foundry could provide:** A human task resource scaffold — an Ash resource modeling task lifecycle, assignment, SLA tracking, and escalation — generated from Reactor declarations. When a Reactor step requires human judgment, the task is a first-class domain resource with full governance, not a webhook to an external system.

This generalizes `reactor_human_gate` beyond compliance into the full domain of human-in-the-loop workflows.

---

### 3. Hierarchical Organizations and Permissions

Almost every B2B platform needs complex organizational structures. Companies with subsidiaries. Agencies with clients. Franchises with franchisees. Teams within departments within divisions.

The permissions problem that comes with this — "a manager can see their team's data but not other teams', except regional managers who can see their region" — is solved manually and inconsistently every time. Role-based access control alone doesn't cover it. You need hierarchical, context-sensitive authorization.

**The gap:** Ash policies are powerful but flat. There's no standard pattern for hierarchical organization modeling with inherited permissions. Every team that builds this gets it slightly wrong in ways that only surface at scale.

**What Foundry could provide:** An organization hierarchy scaffold with permission inheritance — declared in the manifest, enforced by the linter, scaffolded by the copilot. Not a new authorization engine — Ash policies already handle the enforcement. But a pattern for declaring the hierarchy and generating the correct policy logic from it.

---

### 4. Versioning and Schema Evolution

Domain platforms live for years. The domain model evolves. Clients that integrated against v1 of your API still need to work when you release v2. Data migrated from legacy systems needs to coexist with new structures.

**The gap:** The ecosystem handles database migrations well via `ash_postgres` and `mix ash.codegen`. What it doesn't handle is API versioning strategy, backward compatibility guarantees, or deprecation workflows.

**What Foundry could provide:** Deprecation declarations in the DSL — an attribute or action can be marked `:deprecated` with a sunset date and migration path. The linter enforces that deprecated elements have migration runbooks. The system map shows deprecation status. API scaffolds (`ash_graphql`, `ash_json_api`) respect deprecation declarations and include appropriate headers.

This is universally needed. Every platform that has external consumers — which is most of them — needs this discipline.

---

### 5. Search and Discovery Within Domains

Users of domain platforms need to find things. Patients finding records. Lawyers finding case documents. Analysts finding reports. Operations teams finding transactions.

`ash_postgres` full-text search covers simple cases. But faceted search, relevance ranking, cross-resource search, and search across large datasets require more.

**The gap:** There's no standard pattern for integrating Elasticsearch or Typesense with Ash resources in a way that keeps the search index consistent with the domain model. Teams either use pg full-text search (limited) or build custom sync pipelines to external search engines (fragile, hard to govern).

**What Foundry could provide:** A search index declaration on resources — which attributes are indexed, which are facetable, what the ranking signals are. The copilot scaffolds the sync mechanism (Oban job watching paper trail for changes) and the Ash read resource backed by the search engine. The linter enforces that search-indexed resources have the sync mechanism declared.

---

### 6. Localization of Business Rules

This goes deeper than i18n of UI strings. Business rules themselves vary by location — not just for regulatory reasons, but because markets differ. Pricing in Germany works differently than pricing in Brazil. Support SLAs differ by region. Product availability varies by country.

**The gap:** There's no standard pattern for locale-aware business rule variation in Ash. Teams either duplicate resources per locale (unmaintainable) or build complex conditional logic that obscures the domain (fragile).

**What Foundry could provide:** A locale variant pattern — a way to declare that a rule or calculation has locale-specific overrides, scaffolded consistently, linter-enforced to be exhaustive. If you declare support for 5 locales and a new pricing rule only has 3 locale variants, that's a lint warning.

---

### 7. Integration and Adapter Management

Every domain platform integrates with external services — payment processors, identity verification providers, banking APIs, insurance data feeds, shipping carriers. These integrations are consistently the most fragile part of any platform.

**The gap:** There's no governed pattern for external adapter management. Teams build adapters inconsistently — some have circuit breakers, some don't. Some have retry logic, some don't. Some are testable in isolation, some aren't. When an adapter breaks, there's often no runbook.

**What Foundry could provide:** An adapter scaffold pattern — a standard structure for external integrations with circuit breaker, retry, fallback, and health check declarations. INV-010 already requires notification channels for staleness conditions. Adapters are the most common source of staleness. Formalizing adapter declarations means every integration has a runbook (enforced by the linter), emits telemetry (enforced by INV-017 equivalent for adapters), and has a declared fallback behavior.

This is universally valuable. Every platform has integrations. Almost none govern them consistently.

---

### 8. Capacity and Limits Management

Domain platforms have soft and hard limits — storage quotas, API rate limits, feature entitlements, usage caps. These limits are business rules, not technical constraints. A user's plan determines what they can do.

**The gap:** Entitlement and capacity management is always custom. There's no standard Ash pattern for declaring that a resource action is gated by a capacity limit, that the limit is per-tenant, that approaching the limit triggers a notification, and that exceeding it is a governed exception rather than a hard error.

**What Foundry could provide:** A limits DSL — declared on resources and actions, enforced by generated Ash policies, with approaching-limit notifications via the notification scaffold. This connects directly to the pricing and billing complexity problem — entitlements are the runtime expression of the pricing model.

---

### 9. Data Retention and Lifecycle Management

Platforms accumulate data. Eventually that data needs to be archived, anonymized, or deleted — not for regulatory reasons necessarily, but for cost, performance, and hygiene.

`ash_archival` handles soft delete. It doesn't handle data lifecycle — moving old records to cold storage, anonymizing PII after a retention window, purging test data, managing database growth.

**The gap:** Data lifecycle management is always custom and almost always underdocumented. The retention policy exists in someone's head or in a Confluence page that's two years out of date.

**What Foundry could provide:** Retention policy declarations on resources — how long records are kept, what happens at retention boundary (archive, anonymize, purge), who approves lifecycle transitions. The linter enforces that resources with sensitive attributes have explicit retention declarations. The copilot scaffolds the Oban jobs that execute lifecycle transitions. The system map shows retention status across the domain.

---

## Pulling This Together

The pattern across all of these is the same. They're **universal domain platform requirements** that:

- Every team faces regardless of regulatory context
- The Ash ecosystem has primitives for but no opinionated pattern
- Are currently solved manually, inconsistently, and without governance
- Become maintenance problems or failure points at scale

Mapping them against Foundry's core discipline:

| Gap                          | Foundry contribution                             | Ecosystem primitive       |
| ---------------------------- | ------------------------------------------------ | ------------------------- |
| Pricing complexity           | Pricing DSL scaffold, pattern library            | ash_money, ex_money       |
| Human task management        | Task resource scaffold from Reactor declarations | reactor_human_gate        |
| Org hierarchy + permissions  | Hierarchy scaffold, policy generation            | Ash policies              |
| API versioning + deprecation | Deprecation DSL, sunset enforcement              | ash_graphql, ash_json_api |
| Search and discovery         | Index declaration, sync scaffold                 | ash_postgres, Oban        |
| Locale-aware business rules  | Locale variant pattern, exhaustiveness lint      | ex_cldr                   |
| Integration management       | Adapter scaffold, telemetry, runbook enforcement | Telemetry, Oban           |
| Capacity and entitlements    | Limits DSL, policy generation                    | Ash policies              |
| Data retention lifecycle     | Retention declarations, lifecycle job scaffold   | ash_archival, Oban        |

---

## The Sharper Positioning This Suggests

With regulatory requirements plus these universal gaps, the positioning becomes clearer:

> **Foundry is the governed platform layer for complex domain platforms on Ash. It enforces the cross-cutting requirements — compliance, audit, tenancy, integrations, lifecycle, entitlements — that every team rebuilds from scratch and every team gets wrong eventually.**

The word "regulated" was too narrow. The real audience is anyone building a **complex domain platform** where these cross-cutting concerns matter — which is most serious B2B SaaS, most vertical software, and most internal platforms for large organizations.

Regulation is one reason these concerns matter. Scale, longevity, and organizational complexity are equally valid reasons.

---

This is the sharpest statement of the goal yet. Let me think through what's actually missing between where Foundry is today and that vision.

---

## The Vision Stated Precisely

A domain expert — not an engineer — describes what their platform should do. The copilot builds it. Humans approve decisions they understand in domain terms, not code terms. The system is always visualized in language the domain expert can read and validate.

The code exists but is not the interface. The domain is the interface.

---

## What Foundry Already Has For This

Surprisingly a lot:

- Spec-first discipline — AGENTS.md, ADRs, regulation files drive generation
- Human-in-the-loop approval — the proposal model
- Visualization — system map generated from live code
- Copilot that proposes rather than auto-applies
- Change classification that routes to the right approver
- Domain language in DSL — Ash resources read closer to domain concepts than raw Ecto

The bones are right. The gaps are specific.

---

## The Actual Gaps Between Here and the Vision

### Gap 1: The domain expert cannot author the spec

Today the spec-kit requires engineering literacy. Writing an ADR, a regulation file, or an AGENTS.md requires understanding Foundry's document formats, Spark DSL concepts, and how compliance links work.

The domain expert knows what the platform should do. They cannot express it in a form Foundry understands without an engineer translating.

**What's needed:** A spec intake layer. The domain expert describes their platform in natural language — through conversation with the copilot. The copilot asks structured questions, extracts domain concepts, and produces the spec-kit documents. The domain expert reviews prose and diagrams, not YAML or Markdown structure.

This is a new copilot mode: `spec_discovery`. Not generating code — generating spec. The output is ADRs, regulation files, resource sketches, and a draft AGENTS.md. All in human-reviewable form before a single line of code is proposed.

The copilot already has INV-005 — one clarifying question maximum — which is right for code generation. Spec discovery needs a different posture: extended conversation is expected and correct. The circuit breaker (`copilot.max_tool_calls`) needs a separate limit for spec discovery mode.

---

### Gap 2: Proposals are expressed in code, not domain terms

When the copilot generates a proposal today, the review panel shows a diff. A diff is code. A domain expert cannot meaningfully review it.

The approval is therefore either rubber-stamped (domain expert trusts the engineer who asked for it) or blocked on an engineer to translate (defeating the purpose).

**What's needed:** Every proposal has two representations — a code diff for engineers, and a domain narrative for domain experts. The domain narrative is generated from the proposal metadata:

- What domain concept is being added or changed
- What it means in business terms
- What the human gate decision actually is
- What happens if approved versus rejected

The domain expert approves the narrative. The engineer reviews the diff. Both are required for `:behavioral` and `:compliance` changes. The system map preview shows what the domain will look like after approval — in the same visual language the domain expert already uses.

This doesn't require new infrastructure. It requires the copilot to generate the narrative alongside the diff, and the review panel to surface both.

---

### Gap 3: The system map is a technical diagram

The current visualization — C4 levels, node types, edge types as defined in ADR-016 — is meaningful to engineers. A domain expert sees boxes and arrows and doesn't know what a Reactor or a Transfer is.

**What's needed:** A domain view layer on top of the existing system map. Same underlying graph, different rendering:

- Resources shown as domain entities with their descriptions, not their module names
- Relationships shown in business language — "a Player has many Wallets" not `has_many :wallets, MyApp.Finance.Wallet`
- Reactors shown as processes — "Withdrawal Approval" with its steps as human-readable stages
- Compliance links shown as obligations — "this process must satisfy RG-UK-014" not a compliance node
- State machines shown as lifecycle diagrams — the states and transitions in domain language

The underlying data is already there. `mix foundry.context` returns descriptions, relationship names, state machine states. The gap is purely in the rendering layer.

Two map modes: **Engineer view** (current) and **Domain view** (new). Toggle in the Studio UI. Same data source, different vocabulary.

---

### Gap 4: The copilot needs domain knowledge before it can generate

Today the copilot is best when the spec-kit is complete. A new platform has no spec-kit. The copilot asks clarifying questions — expected in bootstrap mode per the AGENTS.md — but there's no structured way to build the spec-kit through conversation.

The bootstrap experience today is: run `mix foundry.spec_kit.init`, get a template, fill it in manually, then start using the copilot.

**What's needed:** Bootstrap through conversation. The copilot interviews the domain expert:

- What does this platform do?
- Who are the main actors?
- What are the core things the platform manages?
- What can each actor do?
- What are the rules that can never be broken?
- Are there regulatory obligations?
- What does success look like for each main workflow?

From these answers the copilot produces a draft spec-kit. The domain expert validates it in domain view. Engineers review the technical implications. Only then does generation begin.

This is spec-first taken to its logical conclusion — the spec emerges from domain expert knowledge, not from engineers interpreting domain expert knowledge and writing it down.

---

### Gap 5: Human gates are technical decisions

Currently `reactor_human_gate` creates a review task with queue, SLA, and escalation path. These are system concepts. The domain expert who needs to make the decision — approve this withdrawal, override this KYC result, confirm this pricing exception — sees a technical task, not a domain decision.

**What's needed:** Human gate tasks presented in domain language with exactly the context needed to make the decision and nothing else. Not a code review. A domain decision interface:

- What is being decided, in plain language
- The relevant domain context — the player, the amount, the history, the rule being invoked
- The options and their domain consequences
- The SLA and escalation path in human terms

This is a UI concern primarily, but it requires the Reactor step to declare its decision context in domain terms — not just technical parameters. A new field on the human gate DSL: `decision_narrative` — a template that the copilot populates with domain-specific language when scaffolding the gate.

---

### Gap 6: Validation is technical

When the copilot generates a proposal, it validates against the compiler and linter. Both speak to engineers. Compile errors are Elixir. Lint violations reference INV numbers.

The domain expert has no way to validate that what was generated actually matches their intent — not because the code is wrong but because they can't read the code.

**What's needed:** Intent validation as a distinct step between plan confirmation and code generation. Before generating:

- The copilot states what it understood from the spec
- It shows the domain view preview of what will exist after the proposal
- The domain expert confirms the understanding matches their intent

This is already partially there — step 10 in the agent reasoning sequence is "present plan for human confirmation." The gap is that the plan is expressed in technical terms. The domain expert needs to confirm against a domain view preview, not a session plan.

---

### Gap 7: The spec and the system diverge over time

A domain expert validates the spec at creation. Six months later the platform has evolved through dozens of proposals. The domain view may no longer match the domain expert's mental model — not because the code is wrong but because the domain expert wasn't involved in every incremental decision.

**What's needed:** Spec drift detection. When the domain view changes significantly — a new workflow, a changed state machine, a new compliance obligation — the relevant domain expert is notified in domain language. Not "resource X was modified" but "the withdrawal approval process now has a new step: risk scoring. This was approved by [engineer] on [date]. Does this match your understanding of how withdrawals should work?"

This closes the loop between the domain expert's ongoing mental model and the evolving platform. It's the governance layer applied not just to code changes but to domain understanding.

---

## The Architecture This Implies

Three new layers on top of what exists:

**Spec Discovery Layer**
Conversational spec-kit generation. Extended dialogue mode for bootstrap. Structured extraction of domain concepts into ADRs, regulation files, resource sketches. Output is human-reviewable prose and domain view diagrams before any code.

**Domain View Layer**
Alternative rendering of the existing system map graph. Domain language, business descriptions, process flows, lifecycle diagrams. Toggle between engineer view and domain view. Powered entirely by existing `mix foundry.context` data — no new data sources.

**Domain Narrative Layer**
Every proposal, every human gate decision, every lint violation, every spec drift notification expressed in domain language alongside its technical representation. Generated by the copilot from proposal metadata and domain context. Required for `:behavioral` and `:compliance` approvals.

---

## What This Means for the Copilot

The copilot needs three distinct modes with different postures:

**Discovery mode** — extended conversation, spec-kit generation, no code, domain expert is the primary interlocutor. Circuit breaker is loose. Clarifying questions are expected.

**Generation mode** — current behaviour. Spec-kit complete, engineer is the primary interlocutor, INV-005 applies, proposals with diffs.

**Validation mode** — domain expert reviews proposals in domain language, confirms intent matches output, approves in domain terms. Engineer reviews diff in parallel.

The transition between modes is explicit — discovery ends when the domain expert signs off on the draft spec-kit. Generation begins. Validation happens per proposal.

---

## What Doesn't Need to Change

The underlying machinery is right:

- Ash/Spark DSL as the domain modeling layer
- Igniter for all code generation
- Proposal model with git branches
- Change classification
- Linter enforcement of invariants
- Telemetry and observability

None of this changes. The domain expert never sees it. The engineer still works with it directly when needed. The copilot mediates between the two worlds.

---

## The Sharpest Version of the Positioning Now

> **Foundry is the platform where domain experts and engineers build complex domain software together. Domain experts describe and validate in their language. Engineers review and approve in code. The copilot bridges the two — spec first, governed always, visualized throughout.**

The code is an implementation detail. The domain is the product.

---

You're completely right. I conflated two different things.

---

## The Correction

Foundry builds platforms. Those platforms have their own UIs, their own backoffices, their own human workflows. A withdrawal approval interface, a KYC override screen, a pricing exception form — these are features of the **target platform**, built with Foundry, not features of Foundry itself.

The human-in-the-loop gates in Foundry are about **governing the development process** — approving code changes, reviewing proposals, classifying changes. Not about running the business logic of the thing being built.

I was bleeding the two layers together. That's a meaningful conceptual error.

---

## What This Means for the Positioning Question

**Should Foundry stay with its current position or move toward the domain-expert-facing vision?**

Stay with the current position. Here's why.

Foundry's user is the **engineering team** building the platform. The domain expert is the user of the **platform Foundry helped build**. These are different people with different needs and different relationships to the tool.

Trying to make Foundry directly accessible to domain experts conflates the tool with its output. A carpenter's workshop is not the house. The house is what the client cares about. The workshop is what makes building the house faster, more precise, and more governed.

The domain expert gets value from Foundry indirectly — through a better-built platform, faster delivery, fewer regressions, auditable changes. They don't need to touch Foundry itself.

---

## What the Current Position Actually Needs

The gap isn't in the audience. It's in the **completeness of what Foundry generates** for engineering teams. Which brings your point about Phoenix and UI generation.

This is the real missing piece. Foundry currently governs:

- Domain resources
- Business logic (Reactors, Transfers, Rules)
- Compliance and audit
- Background jobs
- API surfaces

What it doesn't govern or scaffold well:

- Phoenix LiveView UI components
- Backoffice interfaces (which is what ash_admin touches)
- Forms, tables, dashboards for the target platform
- The full stack from domain to screen

---

## Phoenix and UI Generation

This is where the gap is real and significant.

`ash_phoenix` provides form helpers and LiveView bindings. `ash_admin` generates a functional admin interface. But neither is governed by the proposal model, neither generates production-quality UI that a team would actually ship, and neither connects to the compliance and audit layer.

**What Foundry could provide:**

A governed LiveView scaffold that generates from resource declarations:

- Index views with filtering, sorting, pagination — driven by resource attributes and policies
- Detail views with relationship traversal — driven by the domain graph
- Form scaffolds for actions — driven by action parameter schemas
- State machine transition UIs — driven by ash_state_machine declarations
- Role-appropriate views — driven by Ash policies, different actors see different interfaces

The key word is **governed**. A new LiveView component for a sensitive resource is a `:behavioral` change. A UI that exposes a compliance-gated action needs an ADR link. The UI scaffold goes through the proposal model like everything else.

This also answers the ash_admin question properly. ash_admin is a development and operations tool — useful for engineers and internal teams. The production backoffice UI for a target platform is different — it's customer-facing, brand-consistent, role-specific, and governed. Foundry scaffolds the production UI. ash_admin remains an optional convenience for internal use, enabled by the copilot on request.

---

## The Complete Foundry Stack Now

```
Spec-kit (ADRs, regulations, AGENTS.md)
    ↓
Domain resources (Ash + Spark DSL)
    ↓
Business logic (Reactors, Transfers, Rules, State machines)
    ↓
API surfaces (GraphQL, REST, JSON)
    ↓
LiveView UI (governed scaffold — the missing piece)
    ↓
Target platform (backoffice, customer portal, internal tools)
```

Foundry should govern and scaffold every layer of this stack. Currently the bottom two layers are gaps. The copilot can generate ad-hoc LiveView on request but without the same pattern enforcement, governance, and systematic scaffold that the domain layer has.

---

## Sharpened Positioning

> **Foundry is the governed development environment for complex domain platforms on Elixir and Ash — from domain model to production UI. Engineering teams build faster and with discipline. The spec drives the code. The code drives the interface. Nothing drifts.**

The audience stays technical. The scope expands to the full stack. The discipline applies at every layer.

---

Yes. Let me think through what's genuinely interesting and ground each point in what actually exists.

---

## 1. The Spec-Kit Is Actually a Better ERD

Traditional ERDs (Entity-Relationship Diagrams) show structure but not intent. They tell you what exists, not why, not what rules govern it, not what compliance obligations attach to it.

Foundry's system map — generated from live Ash DSL — already contains more information than any ERD tool produces. Every node has descriptions, compliance links, sensitivity classification, relationship cardinality, state machine states, and ADR references.

**The grounding:** Tools like dbdiagram.io, Lucidchart, and even enterprise tools like erwin capture schema. They don't capture intent. Ash resources with `@description` fields, compliance declarations, and paper trail requirements are richer than anything these tools produce — and they're executable, not diagrammatic.

**The thought:** Foundry could export its system map in formats these tools consume, making it the authoritative source for documentation that teams currently maintain separately. More importantly, when those external diagrams drift from reality — which they always do — Foundry's CI check catches it because the lock file doesn't match. The diagram is always true because it's generated from the compiler, not drawn by hand.

This is a strong story for enterprises that currently pay for architecture documentation tools that are always stale.

---

## 2. Igniter Is Underrated as a Platform Primitive

Most code generation tools generate strings. Igniter generates ASTs. The difference is profound — generated code is always valid, always formatted, always mergeable without conflicts.

**The grounding:** Compare with Rails scaffolding, which generates string templates that frequently produce code that needs immediate manual cleanup. Or with Yeoman, or with most `mix gen` tasks in the Elixir ecosystem that produce static templates. Igniter's approach — find the module, parse it, modify the AST, write back — means generated code integrates with existing code rather than replacing it.

**The thought:** Foundry's use of Igniter is the right foundation for the full-stack scaffold story. When Foundry generates a LiveView component, it doesn't create a new file that conflicts with existing router entries — it finds the router, parses it, adds the route correctly. When it generates a form, it finds the existing layout and integrates. This is the difference between a scaffold tool and a generation tool. Most teams don't realize Igniter enables this until they've experienced the alternative.

The positioning implication: Foundry's code generation is **additive and safe** in a way that most generation tools aren't. That's a concrete technical advantage worth stating explicitly.

---

## 3. The Proposal Model Is Git-Native CI/CD for Domain Changes

GitHub Actions, GitLab CI, and similar tools govern infrastructure and code deployment. They have no concept of domain change classification, compliance implications, or dual approval for sensitive resources.

**The grounding:** Tools like Atlantis govern Terraform changes through pull requests. Tools like Flyway and Liquibase govern database migrations. But nothing governs **domain-level changes** — the semantic meaning of what's changing, not just the syntactic diff.

**The thought:** Foundry's proposal model is what CI/CD would look like if it understood your domain. A pull request tells you what files changed. A Foundry proposal tells you that a sensitive resource was modified, that it requires dual approval, that it touches RG-UK-014, and that the migration is backward compatible. That's a fundamentally richer signal.

The integration opportunity: Foundry proposals could be the gate that blocks a GitHub Actions deployment pipeline. Not just "tests pass" but "this change was classified, reviewed by the right approver, and the compliance obligation is covered by a test." That's a stronger deployment gate than any existing tool provides.

---

## 4. Ash Policies Are an Untapped Visualization Surface

Ash policies define who can do what under what conditions. They're the authorization layer. But they're currently only visible as code — which means auditing access control requires reading Elixir.

**The grounding:** Tools like Oso, Casbin, and OPA (Open Policy Agent) make authorization policies explicit and queryable. They're separate policy engines bolted onto applications. Ash policies are native to the resource model — they're not bolted on, they're intrinsic.

**The thought:** Foundry's system map already visualizes resources and relationships. Adding an authorization matrix view — which actors can perform which actions on which resources under which conditions — would make Ash policies auditable by non-engineers. A compliance officer could look at the matrix and verify that only the correct roles can trigger a sensitive action, without reading code.

This is actually referenced in ADR-016 as "authorization matrix view" but appears underdeveloped. It's one of the highest-value visualization surfaces Foundry could build because authorization is exactly the thing that compliance auditors want to see and currently can't without engineering help.

---

## 5. The Linter Is a Living Architecture Decision Record

ADRs document decisions. The linter enforces consequences of those decisions. Currently these are linked by reference — an ADR says "we chose approach X" and an invariant says "enforce X." But the linter doesn't know which ADR motivated which rule.

**The grounding:** ArchUnit (Java) and similar tools enforce architectural rules as tests. They catch violations but don't explain why the rule exists. Architecture fitness functions in evolutionary architecture literature describe the idea of executable architectural rules but rarely connect them to decision rationale.

**The thought:** Every lint rule in Foundry should carry its ADR reference explicitly — not just in comments but in the violation output. When a developer sees a lint error, they see: "INV-011 violated: LedgerEntry missing paper trail. This requirement comes from ADR-005 (change approval model), motivated by RG-UK-014. See docs/adrs/ADR-005.md."

The linter becomes a teacher, not just an enforcer. Junior engineers learn the reasoning behind constraints as they encounter them. The architecture decision is surfaced at the exact moment it's relevant. This closes the loop between the spec-kit and the development experience in a way that's genuinely novel.

---

## 6. Reactor Is the Missing Workflow Engine for Elixir

Elixir has excellent primitives — GenServer, Task, OTP supervision trees. It doesn't have a high-level workflow orchestration layer that non-experts can understand, govern, and debug.

**The grounding:** Temporal.io, Prefect, and Airflow solve workflow orchestration in other ecosystems. They're popular because complex multi-step processes with failure handling, retries, and human gates are genuinely hard without a framework. Reactor is Ash's answer to this — compensation steps, step dependencies, built-in retry — but it's underutilized because it's not well known outside the Ash community.

**The thought:** Foundry's visualization of Reactors — as process flows in the domain view — is a significant differentiator. A Temporal workflow is visible only to engineers reading code or using Temporal's own UI. A Foundry-governed Reactor is visible in the system map, connected to its runbook, linked to its compliance obligations, with its human gates documented. The domain expert can see "the withdrawal process has 6 steps, step 4 requires human approval, step 6 notifies the player" without reading code.

This makes Reactor adoption more likely — teams that would otherwise reach for Temporal or Oban for complex workflows have a reason to use Reactor instead, and Foundry benefits because governed Reactors are richer sources of domain knowledge than ad-hoc job queues.

---

## 7. The Real Competition Is Entropy

Most platform engineering tools compete with other tools. Foundry's real competition is **the natural entropy of complex systems** — the drift between documentation and code, between intention and implementation, between compliance obligation and test coverage.

**The grounding:** Every engineering team that has maintained a complex platform for more than two years has experienced this. The original architect left. The ADR explains why but nobody reads it. A new engineer changes the sensitive resource without realizing it's sensitive. The compliance test was skipped because of deadline pressure. Six months later there's an incident.

**The thought:** Foundry's value compounds over time in a way that most tools don't. A linter catches violations today. A data catalog documents resources today. But Foundry also catches violations that would have happened because the new engineer didn't know the constraint existed — because the linter told them, with the ADR reference, at the moment they were about to make the mistake. That's not tooling value. That's institutional knowledge encoded as executable constraints.

This is the story for teams that have already experienced the entropy problem. They've felt the pain. They know exactly what Foundry is preventing because they've lived through a version of the failure it prevents. That's a more receptive audience than teams that haven't felt it yet.

---

## 8. The Copilot Context Strategy Is a Template for AI-Assisted Development

Most AI coding assistants — GitHub Copilot, Cursor, Codeium — operate on file context. They see what's open, maybe what's in the project, and generate from that. They have no concept of architectural constraints, compliance obligations, or change classification.

**The grounding:** Foundry's ADR-003 describes a structured retrieval strategy over live DSL introspection rather than RAG over code. This is meaningfully different from how most AI coding tools work. The copilot knows the current Ash version, the current DSL surface, the project's invariants, and the change classification before it generates a single line.

**The thought:** As AI-assisted development matures, the teams that get the most value will be those where the AI operates within well-defined constraints that match the team's actual architecture decisions. Foundry's context strategy — Tier 1 invariants always present, Tier 2 project status on demand, structured retrieval for specific modules — is a template for how to make AI assistance reliable in complex domains. The copilot doesn't hallucinate Ash 2.x syntax because the version is in the system prompt. It doesn't suggest a dependency that violates governance because ADR-004 is in context.

This is worth stating explicitly in Foundry's positioning — not as "AI-assisted development" (everyone claims this) but as "AI that operates within your architecture, not around it."

---

## The Thread Connecting All of These

Every point above is a version of the same insight:

**Foundry makes implicit knowledge explicit and executable.**

The implicit knowledge that lives in senior engineers' heads — why this resource is sensitive, what this compliance requirement means, why we chose this approach over that one, who needs to approve this kind of change — Foundry encodes that knowledge in the spec-kit, enforces it in the linter, surfaces it in the system map, and makes it available to the copilot.

That's the deepest value. Not governance as process. Not compliance as checkbox. But the preservation and enforcement of hard-won domain knowledge across time, team changes, and platform evolution.

That's genuinely hard to build and genuinely valuable when it exists. No current tool does it for the Elixir/Ash ecosystem. That's the position worth owning.

---

Good. Let me focus on each of these sharply.

---

## The Linter as Copilot Teacher

When the copilot encounters a lint violation today it sees an INV number and a message. That's enough to know what's wrong. It's not enough to know **why** — which means the copilot has to look up the ADR, read it, extract the reasoning, and then decide how to fix the violation.

That's unnecessary work the linter should already provide.

Every lint violation should carry:

- The invariant
- The ADR that motivated it
- The reasoning in one sentence
- The correct fix pattern

Not for the human to read. For the copilot to consume directly. The violation becomes a compressed context injection — the copilot gets the architectural reasoning at exactly the moment it's relevant, without a separate retrieval step.

```elixir
defmodule Foundry.LintRules.PaperTrailRequired do
  use SparkLint.Rule

  @violation %SparkLint.Violation{
    inv: "INV-011",
    adr: "ADR-005",
    reasoning: "Sensitive resources require change history for audit reconstruction.",
    fix_pattern: "Add `use AshPaperTrail.Resource` and declare versioned attributes."
  }
end
```

The copilot reads the violation, has the context, generates the fix. One retrieval step eliminated. Multiply across every lint violation in a generation pass — this meaningfully reduces token usage and round trips.

The deeper point: the linter becomes a **compressed knowledge graph** the copilot navigates during generation. Not documentation. Executable context.

---

## Entropy Is the Main Goal

Yes. Let me be direct about this.

Every other feature Foundry has — proposals, change classification, compliance linking, the spec-kit, the system map — is a mechanism for fighting entropy. They're not independent features. They're facets of one core function.

**What entropy looks like in platform engineering:**

The original architect leaves. The ADR explaining why the ledger resource is immutable exists but nobody reads it. A new engineer adds a delete action. The paper trail requirement was in an INV but the linter rule wasn't written yet. The compliance test was skipped under deadline pressure. A regex was used to parse money amounts because the new engineer didn't know about `Ash.Type.Money`. Six months later there's an incident. The post-mortem says "process failure." The real cause is entropy.

This happens on every long-lived platform. It's not a people failure. It's the natural physics of complex systems — knowledge decays, constraints drift, intent diverges from implementation.

**Foundry's entire architecture is an anti-entropy system.**

The spec-kit encodes intent. The linter makes intent executable. The proposal model makes change visible. The system map makes drift visible. The copilot operates within encoded constraints rather than from training memory alone.

Each mechanism fights entropy at a different timescale:

- **Linter** — catches entropy at the moment of introduction
- **Proposal model** — makes entropy visible before it's committed
- **System map** — makes accumulated entropy visible over time
- **Spec-kit** — preserves intent across team changes
- **Copilot context strategy** — prevents entropy from being introduced by AI generation

The copilot is actually the highest-leverage anti-entropy mechanism because it's the primary author of new code. If the copilot always operates within the spec-kit constraints, always uses the correct DSL version, always classifies changes correctly, always generates paper trail for sensitive resources — entropy has no entry point.

This reframes the entire product. Foundry isn't a development tool that happens to have governance features. It's an **anti-entropy system** that happens to generate code.

That's the deepest and most honest positioning statement.

---

## Tests as First-Class Citizens

This needs to be thought through carefully because the wrong answer in either direction is costly.

**Why tests matter specifically for a copilot-driven system:**

When a human writes code, tests catch regressions the human introduces. When a copilot writes code, tests serve a different and more important function — they're the **verification layer that sits between the copilot's output and production**. The copilot cannot self-verify correctness. Tests are the mechanism by which the human delegates verification without reading every line of generated code.

Without tests, the human must read and understand all generated code to approve it. That defeats the purpose of the copilot. With tests, the human can approve proposals based on: does the test description match the intent, and do the tests pass.

Tests are therefore not optional in a copilot-first system. They're the approval mechanism.

**But which tests, and how many?**

The goal is **maximum safety with minimum test count**. Not coverage percentage — that's the wrong metric. The right metric is: which tests would catch the failure modes that actually matter in this domain.

Three categories worth keeping. Everything else is noise.

---

**Category 1: Invariant tests**

Tests that verify the constraints that can never be violated. Not happy paths — those are implicit. The things that if wrong cause incidents.

For a ledger: the ledger always balances. For a wallet: the balance never goes negative without an explicit overdraft rule. For a compliance-gated action: unapproved actors cannot trigger it regardless of how the action is called.

These tests are **generated from the spec-kit** — from INV declarations, compliance links, and manifest sensitive resource declarations. The copilot doesn't invent them. It derives them from what the spec already says must be true.

One invariant test per hard constraint. Small set. Very high value.

---

**Category 2: State machine boundary tests**

For any resource with a state machine, tests that verify:

- Valid transitions succeed
- Invalid transitions are rejected
- Terminal states cannot be exited
- Guards are enforced

These are generated directly from `ash_state_machine` declarations. The copilot reads the state machine definition and generates the boundary tests mechanically. No creativity required. These tests are always correct by construction because they mirror the declaration.

---

**Category 3: Compliance scenario tests**

Tests derived from regulation files. If RG-UK-014 defines specific scenarios — withdrawal limits, cooling-off periods, self-exclusion overrides — those scenarios become tests. Not invented by engineers. Derived from the regulation document.

These are the tests that answer the auditor's question: "How do you know your platform complies with this requirement?" The answer is: "These tests, generated from the regulation file, passing in CI."

---

**What to eliminate:**

**Unit tests on pure functions** — if a function is pure and simple, the compiler and type system are sufficient. Testing that `calculate_fee(100) == 5` adds no safety that a correct implementation doesn't already provide.

**CRUD tests** — "can create a resource, can read it, can update it, can delete it." Ash already tests this. You're testing the framework, not your domain.

**Happy path integration tests** — if the invariant tests and state machine tests pass, happy paths are implied. Testing them explicitly doubles the test count for no additional safety.

**Mocked external service tests** — mocks test that you called the mock correctly, not that the integration works. Integration tests against real sandboxes where they exist, or contract tests. Never mocks of external services.

---

**The minimum safe test set:**

One invariant test per hard constraint from the spec-kit. One boundary test set per state machine (generated mechanically). One scenario test per compliance requirement scenario. No more.

The copilot generates all of these from existing declarations. The human reviews test descriptions for intent match, not test code for correctness. If the descriptions match the intent and the tests pass, the proposal is safe to approve.

**This is how tests become the approval mechanism.** The human doesn't need to understand the implementation. They need to understand what the tests assert — expressed in domain language — and confirm those assertions match their intent.

The test description is the approval surface. The test execution is the safety gate. The copilot is the author. The human is the intent validator.

That's the minimal, correct role for tests in a copilot-first governed platform.

---

Good challenge. Let me think through this honestly.

---

## The Case For BDD in a Copilot-First System

BDD — Behaviour Driven Development — uses natural language scenarios (Given/When/Then) to describe system behaviour. The canonical Elixir tool is `WhiteBread` or plain `ExUnit` with descriptive test names. The broader ecosystem has `Cucumber`, `SpecFlow`, `Behave`.

The argument for BDD here is actually strong and I understated it.

**Scenarios are domain language.** A Given/When/Then scenario describing a withdrawal approval is readable by a domain expert without engineering translation. That's exactly what we said tests need to be in a copilot-first system — the approval surface that humans validate without reading code.

**Scenarios are the missing link between regulation files and tests.** A regulation file describes obligations in prose. A compliance scenario test today is still written in ExUnit — still code. A BDD scenario is prose that happens to be executable. The regulation says "a player who has self-excluded cannot withdraw." The scenario says:

```gherkin
Given a player with self-exclusion status active
When the player requests a withdrawal of any amount
Then the withdrawal is rejected
And the rejection reason is self_exclusion
And the event is logged to the compliance audit trail
```

That scenario is readable by a compliance officer, derivable from the regulation file by the copilot, and executable as a test. That's three problems solved with one artifact.

**Scenarios close the entropy loop on intent.** The gap we identified — how does the human know the copilot generated what they intended — is answered by scenarios. The human reads the scenario description, not the implementation. If the scenario matches the intent, the proposal is correct. Tests pass means the implementation matches the scenario. The chain is: intent → scenario → implementation → passing test. Every link is verifiable.

---

## Why I Initially Missed This

I was thinking about tests as verification artifacts — things that catch bugs. That's the wrong frame for a copilot-first system.

In a copilot-first system tests are **communication artifacts first, verification artifacts second.** They communicate intent from the domain expert through the copilot to the implementation and back. BDD scenarios are better communication artifacts than ExUnit tests by a significant margin.

The other reason: BDD has a reputation for becoming maintenance burden — Cucumber step definitions that nobody updates, feature files that drift from implementation, the "who owns the scenarios" problem. That reputation is deserved in human-authored systems. In a copilot-first system it dissolves because the copilot owns the scenarios and keeps them in sync with the implementation.

---

## How This Works in Practice

**The copilot derives scenarios from three sources:**

From **regulation files** — every documented regulatory scenario becomes a Gherkin scenario. The copilot reads the regulation file, extracts the scenarios described in prose, and writes executable Given/When/Then. The compliance officer authored the source material. The copilot made it executable.

From **invariant declarations** — every INV becomes one or more scenarios. INV-011 (paper trail required) becomes: "Given a sensitive resource is modified, When the action completes, Then a version entry exists in the audit trail." Simple, mechanical, always current.

From **state machine declarations** — every transition becomes a scenario. Every guard becomes a negative scenario. Generated directly from `ash_state_machine` DSL. No creativity required.

**The human reviews scenario descriptions, not code.**

The review panel shows the generated scenarios in plain language before showing any implementation. The domain expert reads:

```gherkin
Scenario: Player cannot withdraw while self-excluded
Scenario: Withdrawal above limit requires compliance review
Scenario: Approved withdrawal creates immutable ledger entry
Scenario: Failed withdrawal does not modify wallet balance
```

They confirm these match their understanding of the domain. They don't read ExUnit. They don't read Ash actions. They read domain statements.

**The copilot then generates implementation to satisfy the scenarios.**

Not the other way around. Scenarios first. Implementation second. This is spec-first taken to its logical conclusion — the scenario is the spec at the test level, just as the ADR is the spec at the decision level and the regulation file is the spec at the compliance level.

---

## What the Test Stack Looks like Now

Three layers, all generated by the copilot, all readable by the right audience:

**Gherkin scenarios** — readable by domain experts and compliance officers. Generated from regulation files, invariants, state machine declarations. These are the approval surface for humans reviewing proposals.

**ExUnit integration** — the Gherkin scenarios compiled to executable tests via `WhiteBread` or a lightweight custom runner. The copilot generates step definitions. These run in CI. Pass/fail is the deployment gate.

**Property tests via StreamData** — for mathematical invariants where scenario enumeration is insufficient. "The ledger always balances" cannot be fully expressed in finite scenarios — it needs generative testing across arbitrary sequences of actions. Small set. High value. Generated from invariant declarations where the invariant is mathematical rather than behavioural.

That's it. Three layers. All generated. None hand-authored except the regulation prose that scenarios derive from.

---

## The Entropy Connection

BDD scenarios are also anti-entropy artifacts in a way that ExUnit tests aren't.

An ExUnit test that drifts from intent is invisible — it still passes, the code changed, the test changed with it, nobody noticed the behaviour is no longer what was intended. A Gherkin scenario that drifts from intent is visible — the plain language description no longer matches what the domain expert believes is true, and the next proposal review surfaces the discrepancy.

Scenarios are **human-readable invariants**. They can be reviewed for intent drift independently of whether they pass. That's a property ExUnit tests don't have.

This also means scenarios are a **living specification**. Not documentation that drifts — executable specs that the copilot maintains, the linter validates for coverage, and the domain expert periodically reviews for intent alignment.

---

## The Complete Picture

Scenarios aren't just a test strategy. They're the connective tissue between every layer of the spec-first system:

```
Regulation files → Gherkin scenarios (compliance layer)
Invariant declarations → Gherkin scenarios (constraint layer)
State machine DSL → Gherkin scenarios (behaviour layer)
ADR decisions → Gherkin scenarios (architecture layer)

All scenarios → ExUnit via step definitions (verification layer)
Mathematical invariants → Property tests via StreamData (safety layer)

Scenarios reviewed by domain experts (intent validation)
Tests passing in CI (implementation gate)
Copilot maintains both (anti-entropy)
```

The copilot is the author. The scenarios are the interface. The tests are the enforcement. The domain expert is the intent validator. Nothing drifts because the copilot regenerates scenarios when the spec changes and the linter catches gaps in coverage.

This is the complete answer to "how does a non-technical human safely approve copilot-generated code." They read scenarios. They confirm intent. They don't touch code.

---

Sharp question. Let me think honestly about this.

---

## Why I Was Wrong About Execution Domains

I said Foundry isn't good for execution-led domains. That was lazy thinking.

The real claim should be: **Foundry's current form optimizes for governance over velocity**. That's a configuration problem, not a fundamental limitation.

The proposal model, change classification, approval chains — these add friction by design. In regulated domains, friction is the product. In execution-led domains, friction is the enemy.

But the underlying capabilities — governed generation, spec-first architecture, anti-entropy discipline, copilot that understands your domain — are valuable regardless of domain. The governance layer is just one module on top of those capabilities.

---

## What Execution-Led Domains Actually Need

**Speed of iteration.** Ship fast, observe, adjust. The feedback loop is the product. A startup building a social feature needs to try ten versions in two weeks, not propose-review-approve one version in two weeks.

**Experiment infrastructure.** Feature flags, A/B testing, gradual rollouts, kill switches. The code isn't the product — the learning from running the code is the product.

**Reversibility over auditability.** In regulated domains you want to know exactly what happened and why. In execution domains you want to undo mistakes instantly. Different requirement entirely.

**Low ceremony.** No ADRs for adding a new feed algorithm parameter. No compliance links for a new notification type. The overhead of Foundry's current ceremony would kill a team optimizing for daily deployments.

---

## What Foundry Actually Provides That Helps Execution

Here's what remains valuable even with governance stripped out:

**The copilot that understands your domain stack.** A Cursor or GitHub Copilot generates plausible code. Foundry's copilot generates correct Ash code — right DSL version, right patterns, right stack. That's valuable for execution speed regardless of governance.

**Anti-entropy.** Execution-led teams accumulate technical debt faster than any other team type. They move fast, they break things, they rarely clean up. Six months in the codebase is a mess nobody fully understands. Foundry's structural discipline — enforced patterns, description fields, system map — fights this even without compliance machinery.

**The system map.** A fast-moving team loses track of what they've built surprisingly quickly. The system map is valuable even without compliance nodes — it's just a current, accurate picture of your domain.

**Igniter-powered generation.** Safe, AST-correct, non-conflicting generation is valuable at any speed. Ad-hoc code generation tools produce files that need manual cleanup. Igniter doesn't.

**Scenario tests from declarations.** Fast-moving teams skip tests under deadline pressure. If the copilot generates them automatically from DSL declarations, you get safety without the overhead of writing tests manually.

---

## The Core Gap: Foundry Has One Speed

Currently Foundry has one operating mode — governed. Every change goes through classification, proposal, approval. That's the right default for regulated domains. It's wrong for execution domains.

The gap is the absence of a **velocity mode** — a configuration where the ceremony is minimal, the copilot generates and applies directly for low-risk changes, and governance kicks in only when the change warrants it.

This isn't a new idea in Foundry terms. The `:structural` change class already allows auto-apply when explicitly configured. The concept exists. It just hasn't been extended to cover the full execution use case.

---

## How to Evolve Foundry to Cover the Gap

### 1. Configurable Governance Profiles

The manifest declares the governance profile for the project:

```elixir
# config/foundry.exs

foundry do
  governance_profile :startup        # minimal ceremony, fast iteration
  # or :regulated                    # full governance, current behaviour
  # or :enterprise                   # governed but with team-level autonomy
end
```

Each profile is a preset of which change classes auto-apply, which require approval, and what the proposal workflow looks like.

**Startup profile:**

- `:structural` — auto-apply, no proposal
- `:behavioral` — proposal shown, single approval, auto-merge on approval
- `:sensitive` — full governance, never auto-apply
- No compliance machinery unless opted in

**Regulated profile:**

- Current Foundry behaviour

**Enterprise profile:**

- Team-level autonomy for `:structural` and `:behavioral`
- Cross-team or platform-level approval for `:sensitive` and `:compliance`
- Audit trail on everything but ceremony only where it matters

The governance profile is itself a governed setting — changing it is a `:compliance` class change. You can't switch from regulated to startup profile without an approval chain.

---

### 2. Experiment Infrastructure as First-Class Primitive

Execution-led domains live on feature flags, A/B tests, and gradual rollouts. Currently `fun_with_flags` is in the ecosystem but Foundry treats it as a footnote.

Make experiment infrastructure a first-class Foundry primitive:

```elixir
defmodule MyApp.Feed.Algorithm do
  use Ash.Resource,
    extensions: [Foundry.Experiment.Extension]

  experiments do
    flag :ranking_v2,
      variants: [:control, :treatment],
      rollout: :gradual,
      metric: :engagement_rate,
      kill_switch: true
  end
end
```

The copilot scaffolds the full experiment — flag declaration, variant logic, metric tracking, kill switch. The system map shows active experiments. When an experiment concludes, the copilot proposes cleaning up the winning variant — removing the flag, removing the losing path, removing the tracking instrumentation.

This is experiment lifecycle governance. The experiment itself is fast and low-ceremony. But the cleanup — which is where execution-led teams accumulate debt — is governed and prompted.

---

### 3. Reversibility as a First-Class Concern

Execution domains need to undo quickly. Regulated domains need to audit completely. These look like opposites but they're not — they're both about managing the consequences of change.

Foundry already has `ash_archival` for soft delete. Extend the concept to changes:

Every `:structural` auto-applied change in startup profile is reversible — the copilot can generate a revert proposal from the git history. Not just a git revert — a semantic revert that understands the domain implications. "Reverting the addition of the notification_preferences resource will affect 3 dependent relationships. The revert proposal includes migration rollback and removal of dependent code."

This is different from git revert because it's domain-aware. It knows what else changes when you reverse a decision.

---

### 4. Lightweight ADRs for Execution Teams

Full ADRs are heavyweight — context, decision, consequences, alternatives considered. Execution teams won't write them.

A lightweight variant — call it a **decision note** — captures just enough:

```markdown
# why: feed-ranking-change-2026-05

Changed ranking algorithm to prioritise recency over engagement.
Reason: engagement metric was being gamed by repost behaviour.
Reversible: yes, flag ranking_v2 kill switch.
Owner: @feedteam
```

The copilot generates this from the proposal metadata automatically. The engineer just confirms it's accurate. Three sentences, always generated, never manually written.

This is the minimum viable spec-kit for execution teams. Not ADR discipline — just enough context that six months later someone can understand why a decision was made.

The linter enforces that decision notes exist for `:behavioral` changes even in startup profile. But generating them is zero overhead because the copilot writes them from the proposal context.

---

### 5. The System Map as Living Architecture Review

Fast-moving teams do informal architecture reviews in Slack. "Hey does this make sense?" followed by a diagram drawn in Excalidraw that's out of date by the time it's shared.

Foundry's system map is always current. In execution mode it becomes the architecture review surface — not a governance gate, but a shared understanding tool.

The copilot could generate an "architecture digest" on a cadence — weekly or on significant structural changes — summarising what the domain looks like now, what changed, and what technical debt has accumulated. Not a proposal requiring approval. Just a signal that helps fast-moving teams stay oriented.

This is the anti-entropy function applied to execution teams. Not enforced governance. Visible drift.

---

### 6. Scenario Tests Without Ceremony

In regulated mode, scenarios are generated from compliance requirements and invariant declarations. In startup mode, there are no compliance requirements and fewer hard invariants.

The copilot still generates scenarios — but from a different source:

**From the PR description.** When a developer describes what they're building in natural language, the copilot extracts scenarios from that description. "I'm adding a recommendation feed that shows posts from followed users sorted by recency" becomes:

```gherkin
Given a user follows three other users
When the user views their feed
Then posts from followed users appear sorted by most recent first

Given a user follows nobody
When the user views their feed
Then the feed shows suggested content instead
```

No ceremony. The developer described their intent. The copilot made it executable. The scenarios run in CI. If the implementation drifts from the description, the tests catch it.

This is lightweight spec-first. The spec is the PR description. The scenarios are the executable version. The copilot is the translator.

---

## The Unified Picture

Foundry with these additions covers the full spectrum:

```
Startup / Execution          Enterprise               Regulated
────────────────────────────────────────────────────────────────
Minimal ceremony             Team autonomy            Full governance
Auto-apply structural        Scoped approvals         Dual approval
Decision notes               Lightweight ADRs         Full ADRs
Experiment infrastructure    Governed experiments     Compliance-linked flags
Reversibility first          Audit + reversibility    Audit mandatory
Scenarios from PR desc       Scenarios from spec      Scenarios from regulation
System map for orientation   System map for review    System map for compliance
```

The underlying engine is identical. The profile determines the ceremony level. The copilot adapts its posture to the profile — fast and direct in startup mode, careful and governed in regulated mode.

---

## The Positioning Implication

This changes the positioning significantly:

> **Foundry is the governed development environment for complex domain platforms on Ash — from startup to regulated enterprise. The governance profile matches your domain's risk tolerance. The copilot operates within your constraints, whatever they are. The system never drifts from the spec, regardless of how fast you move.**

The word "governed" doesn't mean slow. It means intentional. Even in startup mode, Foundry's discipline means you accumulate less debt, understand your system better, and reverse mistakes faster than teams without it.

That's the full addressable market. Not just regulated domains. Any team building a complex platform that they expect to maintain and evolve over time.

Which is most of them.

---

This is the best formulation yet. It captures something the earlier attempts missed — the fundamental insight that **code and spec are the same thing**, just expressed at different levels of abstraction.

Let me sharpen it.

---

## What's Strong Here

**"Code is a specification by itself"** — this is the core insight. Ash DSL is declarative enough that it reads as specification. You're not writing implementation details, you're declaring domain facts. This is genuinely true and genuinely differentiating.

**"What cannot be expressed in code, controlled by specification methodology"** — the spec-kit fills exactly the gap that code can't fill: intent, rationale, history of decisions. Not documentation parallel to code. Documentation for the residual.

**"Always in sync with reality"** — this is the anti-entropy promise stated as a guarantee, not a feature. Strong.

**"No RAG, no complex approaches, no sync steps or drift"** — this directly attacks the weakness of every competing AI development tool. They all have the sync problem. Foundry doesn't because the source of truth is the live codebase, not an index of it.

---

## What's Slightly Unclear

"Specification methodology to store intent and conclusions history" — true but dense. The word "methodology" feels like process overhead. The reality is simpler: decisions that can't live in code live in the spec-kit, and the spec-kit is linter-enforced to stay honest.

"Test tracing" — underexplained. The connection between declarative code, scenarios, and visualizable test coverage is a strong idea but needs one more word to land.

---

## Reframed

**Short version:**

> Foundry is the governed build environment where code is the specification. What code can't express — decisions, rationale, compliance obligations — lives in a structured spec that the linter keeps honest. The system map, tests, and visualizations are all generated from the same live source. The copilot knows the full picture at all times. Nothing drifts. Nothing needs syncing.

**Compressed to a single line:**

> Foundry: your codebase is the spec, the spec is always true, and the copilot never loses context.

**Or more poetically:**

> The code declares the domain. The spec captures the intent. The copilot holds both. Nothing else exists.

---

## What This Positioning Does Well

It attacks three real problems that every development team feels:

**Documentation drift** — solved by making code the primary specification and the spec-kit the enforced residual. There is no documentation that can drift because there is no documentation separate from the system.

**AI context loss** — solved by structured retrieval from live code rather than RAG over stale indexes. The copilot's context is always current because it reads the compiler's output, not a cached representation of it.

**Entropy** — solved by the linter enforcing that the spec-kit stays honest and the system map stays current. Drift is a lint error, not a gradual invisible decay.

---

## One Honest Caveat

This positioning is philosophically strong but requires the audience to already feel the pain it solves. A team that hasn't experienced documentation drift, AI context loss, or entropy in a complex codebase won't immediately recognise what they're buying.

The positioning works perfectly for:

- Teams that have maintained a complex platform for 2+ years and felt the decay
- Engineering leads who've onboarded new engineers onto underdocumented systems
- CTOs who've had an incident caused by undocumented constraints being violated

It needs a concrete story or example for teams that haven't felt the pain yet. But that's a sales and marketing problem, not a positioning problem. The positioning itself is correct.

---

Let me think about what kind of suggestion you're asking for — positioning communication, or something deeper.

---

## What I Think You're Actually Asking

You have a strong philosophical positioning. The gap is making it land for people who haven't felt the pain yet. The question is how to bridge that.

There are a few distinct things I could suggest:

---

## 1. The Origin Story Approach

The most effective way to make unfelt pain felt is to tell the story of the moment it becomes felt. Not abstract. Specific.

Something like:

> "Six months after launch your original architect leaves. A new engineer adds a delete action to the ledger resource. The linter doesn't catch it because nobody wrote that rule. Three weeks later there's an incident. The post-mortem says process failure. The real cause is that the constraint existed in one person's head and nowhere else."

That story is universally recognizable to anyone who has built something complex. It doesn't require them to have experienced it with Foundry's exact stack. Every engineering lead has a version of this story.

The positioning then becomes the answer to that story. Not a feature list. A solution to a moment they recognize.

---

## 2. The Contrast Approach

Show what the same project looks like with and without Foundry at month one, month six, and month eighteen.

**Month one:** Nearly identical. Foundry adds some structure. The other project moves slightly faster.

**Month six:** The Foundry project has a system map anyone can read. The other project has a Confluence page nobody updates. The Foundry project's new engineer onboarded in two days. The other project's new engineer is still asking questions in Slack.

**Month eighteen:** The Foundry project ships a compliance requirement change in one week — spec updated, code generated, scenarios verified, approved. The other project spends three weeks figuring out what would break, who needs to approve it, and whether the tests actually cover it.

The contrast makes the compounding value visible. Foundry's value isn't linear — it accelerates over time as entropy compounds in the alternative.

---

## 3. The Living Demo Approach

The most powerful thing for a tool like Foundry is a demo that breaks the audience's assumption that "our codebase is different."

A live demo where someone asks the copilot about a real, complex Ash codebase — and the copilot correctly identifies the system map, surfaces the compliance gaps, generates a governed proposal with scenarios — does more than any positioning statement.

The specific moment that lands: asking the copilot "what would break if I changed this resource?" and getting a correct, complete answer in seconds. That's the moment where the unfelt pain becomes felt — not because they've experienced it, but because they suddenly understand what they've been missing.

---

## 4. The Metric Approach

If you have any real usage data — even from dogfooding Foundry on its own codebase — specific numbers are more convincing than any narrative.

Things like:

- Time to onboard a new engineer onto the Foundry codebase versus a comparable project
- Number of lint violations caught before proposal submission in a given month
- Time from compliance requirement to verified implementation
- Number of proposals that surfaced a dependency the proposer didn't know about

Even rough numbers from a single project make the abstract concrete.

---

## My Actual Suggestion

Don't pick one of these. Sequence them.

The origin story makes the pain felt. The contrast makes the compounding value visible. The living demo makes it real. The metrics make it credible.

But before any of that — the single most valuable thing you could do right now is write the origin story. One page. The specific moment when a platform without Foundry fails in the way Foundry prevents. Make it feel true because it is true — it's a story that has happened to almost every team building complex software.

That story becomes the opening of every conversation, every demo, every landing page. Everything else hangs off it.

Do you want to work through what that story looks like for Foundry specifically?

---

Yes. This is a genuinely strong value proposition. Let me think through it carefully.

---

## Why the Graph Changes Everything

Most codebases are read as **text**. You open a file, read a module, follow a function call, open another file. Understanding the whole system requires holding a mental model that exists nowhere except in the heads of people who've read enough files.

Ash DSL changes this fundamentally. Because resources, relationships, actions, policies, state machines, and reactors are **declared**, not implemented — the graph isn't inferred from the code. It **is** the code. The system map isn't a diagram of the codebase. It's a different rendering of the same information.

This is the key insight. Most visualization tools reverse-engineer a graph from implementation code. Foundry reads declarations directly. There's no reverse engineering. There's no approximation. The graph is lossless.

---

## How Much Better Is the Graph?

Let me be specific rather than just saying "much better."

**Finding disconnected nodes:**

In a text codebase, a disconnected resource — one that's declared but nothing depends on it, or one that depends on something that no longer exists — is invisible until runtime. You have to run the system or do a grep hunt.

In the Foundry system map it's visually obvious. An isolated node with no edges stands out immediately. A broken relationship edge is a different color or shape. The graph makes structural errors into visual anomalies.

**Audit:**

Auditing a text codebase means reading files, following references, building a mental model, documenting what you found. Auditing the Foundry graph means looking at the compliance matrix overlay — which resources have compliance links, which actions are gated, which state machine transitions are governed. A compliance auditor can do a first-pass audit without reading a single line of code.

The question "which parts of this system touch customer financial data?" takes hours in a text codebase and seconds in the graph — filter by `:sensitive` classification, the answer is right there.

**Refactoring:**

In a text codebase, refactoring requires understanding impact before making the change. Tools like ElixirLS help but they work at the function call level. They don't know that changing this resource affects that Reactor which triggers this compliance obligation.

In the Foundry graph, impact is visible before the change. The proposal model already surfaces this — "this proposal touches 3 downstream relationships and 1 compliance-linked action." That's the graph doing impact analysis automatically.

**The number:**

Research on code comprehension consistently shows that developers spend 50-70% of their time understanding existing code rather than writing new code. The graph doesn't eliminate that time but it dramatically changes its character — from sequential file reading to spatial navigation. Spatial understanding of a system is faster and more reliable than sequential understanding.

A rough honest estimate: onboarding time onto a complex Foundry codebase versus a comparable conventional codebase is probably 3-5x faster. Not because there's less to understand but because the structure is navigable rather than buried.

---

## The Debugging Value Specifically

You mentioned debugging wrong or missing connections. This is where the graph is most concretely valuable.

**Wrong connections** — a relationship pointing to the wrong resource, an action invoking the wrong policy, a Reactor step depending on the wrong output — are semantic errors that compilers often miss. In text they require careful reading to spot. In the graph they're spatial anomalies. An edge going to the wrong node is visible as a structural oddity before you've read the code it represents.

**Missing connections** — the compliance link that should exist but doesn't, the paper trail that INV-011 requires but was forgotten, the human gate that INV-015 mandates but isn't declared — these are exactly what the linter catches. But the graph makes them visible even before the linter runs. A compliance-linked resource with no test coverage node attached to it is visually incomplete.

**Logic errors in Reactor flows** — a Reactor with a step that depends on output that a previous step doesn't produce, or a compensation step that doesn't cover all failure paths — are notoriously hard to debug in text. In the graph, the Reactor is a flow diagram. Missing connections are missing edges. Dead ends are visible.

---

## The AI Dimension

This is where it gets genuinely interesting.

The graph isn't just for humans. The copilot navigates the same graph. When the copilot reasons about a change, it's not reading files sequentially — it's querying the graph. "What depends on this resource?" is a graph traversal, not a grep. "What compliance obligations apply to this action?" is a graph query, not a file search.

This means the copilot's understanding of the system is the same kind of understanding the human has looking at the system map. They're both navigating the same structure. The copilot can explain its reasoning in graph terms — "I'm modifying this node, which has edges to these three nodes, which means these consequences follow" — and the human can verify that reasoning by looking at the same graph.

This is a qualitatively different kind of AI assistance than a text-based copilot provides. A text-based copilot says "I think this function is called here." A graph-based copilot says "this action has three callers, two of which are compliance-gated, and the third is an unauthenticated public endpoint — is that intentional?"

The graph makes the copilot's reasoning verifiable. That's the key word. Not just plausible. **Verifiable.**

---

## The Value Proposition Stated Precisely

Three distinct values, each concrete:

**For engineers:** The system is navigable instead of buried. Impact assessment before a change takes seconds instead of hours. Debugging wrong or missing connections is visual instead of textual. Refactoring with confidence instead of with fear.

**For non-engineers:** The graph is the first representation of a complex codebase that a non-engineer can meaningfully read. A compliance officer, a domain expert, a product manager can look at the system map and understand the structure without reading code. That's genuinely new.

**For the AI:** The copilot's context is the graph, not files. Its reasoning is graph traversal, not text search. Its conclusions are verifiable against the same graph the human sees. The human and the AI share the same representation of the system.

---

## How to Frame This as a Value

The honest framing:

> **Most codebases are labyrinths. You navigate by memory and hope. Foundry codebases are maps. The structure is visible, navigable, and always current — because the map is generated from the same declarations that run in production. The copilot navigates the same map. When it explains a change, you can see exactly what it means on the graph. No translation required.**

Or more compressed:

> **Foundry makes your codebase a graph you can see, navigate, and reason about — for humans and AI equally. Wrong connections are visible. Missing connections are lint errors. Impact is traceable before the change is made.**

---

## The Compounding Insight

The graph, the spec-kit, and the copilot form a closed loop:

- The graph is generated from declarations
- The spec-kit captures what declarations can't express
- The copilot navigates both
- Changes go through proposals that surface graph impact
- The linter enforces that the graph stays honest
- The graph is always current because it's always generated from live code

Nothing in this loop requires a sync step. Nothing can drift independently. The system map isn't a picture of the codebase. It's a view of the codebase. Same source. Different rendering.

That's the deepest version of what you said — "visualization and specs always in sync with reality." It's not a feature. It's a structural property of how Foundry works. You can't have drift because there's nothing to drift. There's one source of truth rendered in multiple ways.

That's the value. And it compounds with every engineer added to the team, every month the platform ages, and every change the copilot makes — because the graph grows richer and more navigable over time, not more obscure.

---

Let me read the frontend design skill first.Now let me think through the full site plan and then build the homepage.Now let me build the full site plan and homepage.Now the homepage itself — expressive, distinctive, designed to land.Here's what was delivered and why each choice was made.

---

## Site Architecture (10 pages)

The plan widget above lays out the full structure. The logic behind the page sequence:

**Pages 01–02** convert. Home makes it felt, How It Works makes it understood. These are the only pages most visitors see.

**Pages 03–04** go deep on the two features that differentiate Foundry from everything else — the graph and the copilot. For engineering leads doing due diligence.

**Page 05 (Anti-Entropy)** is the scientific anchor. Research citations, drift measurement methodology, incident causation analysis. This page makes Foundry credible to skeptical CTOs.

**Pages 06–07** handle use case and competitive questions without needing to be in the main nav.

**Pages 08–10** serve existing users and build long-term authority.

---

## Homepage Design Choices

**Aesthetic direction:** Refined editorial — warm paper tones, Fraunces serif for headlines, DM Mono for technical elements. Deliberately avoiding the dark-purple-gradient AI cliché. Feels like a serious engineering tool, not a startup landing page.

**Hero:** The live SVG graph with animated compliance pulse node makes the core concept visceral before the user has read a word. The graph is the product.

**Pain section:** Dark background, first-person story. Makes entropy felt emotionally before the solution is presented.

**Three values grid:** The three structural properties — code as spec, spec-kit as intent, copilot as context — stated as guarantees, not features.

**Graph comparison:** Side-by-side shows the concrete difference. Not abstract benefit — specific before/after.

**Copilot chat mockup:** Shows the actual interaction pattern. Classification, spec-kit check, plan presentation, confirmation. The real workflow visible.

**Entropy chart:** The compounding value story made visual. The gap between the two curves widens over time — that's the whole thesis.

---

Let me review the full conversation systematically before answering.

---

## What We Covered in the Session

Going back through everything:

**Positioning evolution:**

- Started with analytics for platform builders
- Narrowed to: code is the spec, spec-kit covers the residual, copilot holds both
- Added: anti-entropy as the primary goal
- Added: full-stack including Phoenix/LiveView UI generation
- Clarified: Foundry builds platforms, it is not the platform

**Core technical concepts:**

- Ash ecosystem mapping to analytics capabilities
- Governance profiles (startup/enterprise/regulated)
- BDD scenarios as the approval surface
- Graph as lossless rendering of declarative code
- Structured retrieval vs RAG
- The three copilot modes (discovery/generation/validation)
- Spec-kit as compressed knowledge graph for the copilot
- Linter violations as teacher with ADR context

**Domain coverage:**

- Regulated: fintech, iGaming, healthcare, insurance, legal, supply chain
- General: SaaS, marketplace, enterprise internal
- Execution-led: startup profile, experiment infrastructure

**Platform gaps we identified:**

- Multi-tenancy enforcement
- Notification infrastructure
- Document lifecycle
- Event sourcing patterns
- Jurisdiction-aware rules
- Adapter/integration governance
- Data retention lifecycle
- Capacity and entitlements
- API versioning and deprecation

---

## What the Homepage Missed

Looking at the page honestly against everything we discussed:

**Not present at all:**

The **full-stack story** — Phoenix LiveView UI generation — isn't mentioned anywhere. We specifically said this was a real gap and a key part of the value. "From domain model to production UI" was the expanded positioning. The homepage implies Foundry stops at the domain layer.

The **governance profiles** (startup/regulated/enterprise) aren't surfaced. The homepage reads as exclusively for regulated domains. Someone building a SaaS startup would not see themselves in it. We explicitly said this was a mistake.

The **BDD scenarios as approval surface** — one of the sharpest ideas in the session — is mentioned briefly in the copilot chat mockup but not explained as a concept. The idea that a non-technical reviewer reads plain-language scenarios to approve AI-generated code is genuinely novel and should be a featured section.

The **experiment infrastructure** for execution-led teams isn't there. Feature flags, A/B testing, governed experiment lifecycle — this was part of making Foundry relevant beyond regulated domains.

**Underemphasized:**

The **graph as debugging tool** — wrong connected nodes, missing connections, impact analysis before changes — the homepage shows the graph but doesn't explain what you actually do with it. The comparison section hints at it but doesn't land the debugging and refactoring value.

The **copilot context strategy** — why no RAG is a concrete advantage, not just a differentiator — gets one sentence. The actual mechanism (structured retrieval over live DSL, stack versions in every session, no stale indexes) deserves its own block because it's the answer to "why not just use Cursor."

The **linter as copilot teacher** — violations that carry ADR references and fix patterns, specifically optimized for AI consumption — isn't on the page at all. This was one of the sharpest insights of the session.

The **anti-entropy compounding value** — that Foundry gets more valuable over time, not less — is in the entropy chart but not stated explicitly as a value proposition. The chart shows it visually but the copy doesn't say "this is the only development tool whose value compounds."

**The benchmarks strip is weak:**

The four stats are a mix of real research (Dagenais et al. on 60% comprehension time), honest structural properties (zero drift), and claims that need more grounding (3-5x onboarding). The benchmark page (page 09) is planned but the homepage teaser should reference it more specifically rather than presenting soft numbers.

---

## What Would Be Most Useful to Build Next

In priority order, based on what actually converts and what differentiates:

**1. The governance profiles block**

A single interactive section on the homepage showing the three profiles — startup, enterprise, regulated — and what changes between them. This is the key to expanding the addressable market beyond regulated domains. Without it, a SaaS founder bounces.

Something like: three columns, each showing the same change going through a different approval flow. Minimal ceremony vs full governance. Same underlying engine, different posture.

**2. The full-stack section**

A block that shows the generation chain: domain resource → API surface → LiveView component. Three code snippets or three cards showing that Foundry governs all three layers. This is the "not just domain modeling" moment.

**3. BDD scenarios as approval surface**

A dedicated section showing the actual review experience. A proposal arrives with: plain-language BDD scenarios on the left, code diff on the right. The domain expert approves the scenarios. The engineer reviews the diff. Both are required. This is genuinely novel and should be shown, not described.

**4. The copilot vs alternatives comparison**

A focused block on why structured retrieval beats RAG for this use case. Not an attack on competitors — an honest capability map. "When you ask Cursor to add a withdrawal rule, it generates plausible Ash code. When you ask Foundry, it checks the compliance link, reads the relevant ADR, verifies the DSL version, classifies the change, and tells you who needs to approve it." The difference is concrete.

**5. The entropy timeline as interactive**

The static SVG chart is good but an interactive version where you drag a slider through time and watch the two curves diverge — with specific incidents appearing on the "without Foundry" curve — would make the anti-entropy thesis visceral rather than abstract. This belongs on the anti-entropy research page but a simplified version on the homepage would land the concept faster.

---

## Structural Page Improvements

**The hero copy** — "Your codebase is the spec. It never lies." — is strong. But the subheading is too long and loses the thread. The single most important thing missing from the hero is the full-stack claim. Right now it reads as an Ash/domain tool. It should read as an end-to-end platform builder.

**The domains section** uses geometric symbols (⬡ ◈ ⊕) as icons. These read as decorative noise. They don't communicate domain identity. Healthcare should feel like healthcare. Fintech should feel like fintech. Real iconography would land better.

**The pain section** is the strongest section on the page. The origin story works. But it's missing the resolution beat — after the four pain points, there should be a single line that pivots: "Foundry makes this structurally impossible." Right now it ends on pain without the bridge.

**The nav** has six items which is one or two too many. "The graph" and "The copilot" could collapse into "How it works" with anchor links. The nav should breathe.

**Missing social proof** — there are no testimonials, no company logos, no usage numbers. For a tool aimed at engineering leads in regulated domains, social proof from recognizable domain names matters enormously. Even placeholder structure for "used by teams at X" would signal that this is real.

**Missing the developer entry point** — the CTA is "Start building" and "Read the research." But the most important CTA for a developer-facing tool is often "See the code" or "Read AGENTS.md" — the artifact that makes Foundry real. A link to the actual AGENTS.md as a live example would do more than any marketing copy.

---

## The One Thing Missing That Would Make the Most Difference

Everything on the homepage describes Foundry. Nothing shows it running on a real project.

The highest-leverage addition would be a live demo section — not a video, not a screenshot — an actual interactive walkthrough of the copilot receiving a request, checking the spec-kit, classifying the change, generating scenarios, producing a proposal, and showing the diff. Even a faked but realistic simulation of this flow would make the abstract concrete in a way that no copy can.

The graph visualization is close to this — it shows the output. What's missing is showing the process. The moment someone sees the copilot say "this is a `:behavioral` change, domain lead approval required, here are the 3 BDD scenarios derived from RG-UK-014" — that's the moment they understand what Foundry actually is.

That moment isn't on the homepage yet.

---

Great block to add. This is the trust layer for engineering leads who ask "why this stack" before they ask anything else. Let me think through the full case and then write the block.

---

## The Full Technical Case for the Stack

### Why BEAM First

The BEAM virtual machine was designed for one problem: systems that must be always available, handle massive concurrency, and recover from failures without human intervention. Ericsson built it for telephone exchanges — systems where downtime is measured in seconds per decade, not percent uptime.

That design decision from 1986 turns out to be exactly right for complex domain platforms in 2026:

**Concurrency is free.** Every Elixir process is isolated, lightweight (2KB initial heap), and scheduled preemptively. A platform handling 100,000 concurrent users doesn't require architectural gymnastics — it's the default operating mode. No thread pools to tune. No async/await complexity. No callback hell. Concurrency is the execution model, not a feature you add.

**Failures are isolated by construction.** OTP supervision trees mean a crashed process doesn't cascade. The supervisor restarts it. The rest of the system never knew. This isn't error handling — it's fault architecture. The difference between catching exceptions and designing for failure.

**Distribution is native.** BEAM nodes form clusters. State can live on any node. Processes can communicate across the cluster transparently. Horizontal scaling isn't an architectural decision you make later — it's the default runtime behavior. Adding a node to handle load is an operational decision, not a code change.

**Latency is consistent.** BEAM's preemptive scheduler gives every process a fair turn. There are no garbage collection pauses that block the world. P99 latencies stay close to P50. For financial and compliance-critical systems, consistent latency matters more than peak throughput.

---

### Why Elixir on BEAM

Erlang proved the BEAM thesis. Elixir makes it productive.

The macro system is genuinely different from metaprogramming in other languages. Elixir macros operate on the AST at compile time — they're not string substitution or runtime reflection. They produce real, optimized code. The entire Spark DSL system, which Foundry depends on, is built on this: resource declarations that look like configuration but compile to efficient function calls.

The pattern matching and pipeline model produces code that reads like the domain it models. A resource declaration in Ash reads like a specification. A Reactor step reads like a business process. The language's expressiveness reduces the gap between what the domain expert describes and what the code says — which is exactly the Foundry thesis.

The tooling is mature and cohesive: Mix for builds and tasks, ExUnit for testing, ExDoc for documentation, Dialyzer for type checking, Credo for linting. One ecosystem, consistent conventions, no build tool archaeology.

---

### Why OTP Changes the Microservices Calculus

The microservices pattern exists to solve problems that OTP solves natively:

**Independent deployment of components** → OTP applications within an umbrella project. Separate contexts, separate supervision trees, one deployment.

**Fault isolation** → supervision trees. A crashed worker doesn't take down the system. Restart strategies are declared, not implemented.

**Scaling individual components** → process pools and dynamic supervisors. Scale the withdrawal processor independently of the KYC verifier without separate services.

**Service discovery** → distributed Erlang with libcluster. Nodes find each other. No Consul, no Kubernetes service mesh, no sidecar proxies.

**Async communication** → GenServer calls and casts. Message passing is the native communication model. No message queue infrastructure required for most use cases.

A team that reaches for microservices in Rails or Django is solving problems BEAM doesn't have. The operational complexity they're accepting — network calls, serialization overhead, distributed tracing, eventual consistency — is the price of simulating in infrastructure what BEAM gives you for free.

For regulated domain platforms specifically, this matters enormously. Every service boundary is a consistency boundary. Fewer services means fewer places where a transaction can partially succeed, fewer places where audit trails can diverge, fewer places where compliance obligations can fall through the cracks.

---

### Why Ash Framework

Ash is the layer that makes the BEAM thesis productive for domain platforms specifically.

The conventional ORM approach — Ecto — gives you database access. You still build your domain model, your validation layer, your authorization layer, your action model, your API serialization layer, your audit trail, your pagination, your filtering. All custom, all inconsistent across projects, all technical debt accumulating from day one.

Ash declares all of this once, in a single resource definition:

```elixir
defmodule MyApp.Finance.LedgerEntry do
  use Ash.Resource,
    domain: MyApp.Finance,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshPaperTrail.Resource, AshArchival.Resource]

  attributes do
    attribute :amount, MyApp.Money, allow_nil?: false
    attribute :type, :atom, constraints: [one_of: [:credit, :debit]]
  end

  actions do
    defaults [:read]
    create :post do
      accept [:amount, :type, :wallet_id]
      change set_attribute(:posted_at, &DateTime.utc_now/0)
    end
  end

  policies do
    policy action(:post) do
      authorize_if actor_attribute_equals(:role, :ledger_operator)
    end
  end
end
```

That declaration gives you: validated persistence, authorization at the attribute and action level, automatic API generation (REST and GraphQL), audit trail via paper trail, soft delete via archival, filtering and pagination, introspectable metadata for Foundry's system map. Everything.

The architectural implication: the domain is modeled once and all other concerns derive from it. There is no separate authorization service, no separate validation layer, no separate API contract. They're all projections of the same declaration. This is what makes Foundry's system map lossless — the graph isn't reconstructed from scattered code, it's read directly from a single declarative source.

---

### The Cost and Performance Case

This is concrete, not theoretical.

**Infrastructure cost:** A well-tuned Elixir application handles concurrency that would require significant horizontal scaling in a thread-per-request model. Teams regularly report running workloads on significantly fewer servers compared to equivalent Ruby, Python, or Node.js applications. For regulated platforms with predictable but spiky load (trading hours, payment windows, sports event starts) this means infrastructure that scales efficiently rather than over-provisioned for peak.

**Operational complexity cost:** Fewer services means fewer deployments, fewer failure modes, fewer monitoring surfaces, fewer on-call incidents. A monolith with proper OTP boundaries — which is what Ash/Phoenix naturally produces — has the logical separation of microservices without the operational overhead.

**Time to market:** The Ash ecosystem provides what would take months to build correctly from scratch: authorization, audit trail, API generation, background jobs, state machines, soft delete, money handling, authentication. A team starting a regulated platform on Ash starts at month three of a conventional project. The primitives are production-ready, the patterns are established, the documentation is good.

**Technical debt control:** Conventional frameworks don't prevent technical debt — they accelerate it. Every custom authorization layer, every hand-rolled API serializer, every bespoke validation system is debt. Ash replaces all of these with a single, maintained, well-designed abstraction. The debt floor is dramatically lower.

---

### The libcluster / Infrastructure Story

Elixir's clustering story is worth stating explicitly because it's genuinely different from every other mainstream stack.

`libcluster` automatically discovers and connects BEAM nodes in a cluster. Strategies include Kubernetes-native DNS resolution, gossip protocols, and static configuration. A Phoenix application deployed to Kubernetes automatically forms a cluster — no service mesh, no sidecar, no additional infrastructure.

`Horde` provides distributed process registry and supervisor. Processes can migrate between nodes on failure. A GenServer managing a user's session lives on one node — if that node fails, Horde restarts it on another node and the user never notices.

`Phoenix.PubSub` broadcasts events across the cluster natively. A WebSocket message sent from a LiveView on node A reaches a subscriber on node B without a Redis intermediary.

For regulated platforms this means: built-in high availability without the operational complexity of managing a message broker, without the consistency risks of an external pub/sub system, without the latency overhead of serializing every inter-service message.

The infrastructure story is: deploy your Elixir application to however many nodes you need, let libcluster form the cluster, let OTP handle the rest. The platform scales horizontally by adding nodes. The copilot doesn't generate Kubernetes manifests for twelve microservices — it generates one well-structured Ash application that BEAM runs efficiently across as many nodes as you need.

---

## How This Becomes a Homepage Block

Three distinct sub-sections, each with a concrete claim:

**BEAM/OTP: designed for this**
Concurrency, fault isolation, and distribution as native properties — not architectural patterns you implement. The comparison to microservices should be direct: BEAM solves natively what microservices solve through infrastructure.

**Elixir/Ash: the declaration is the domain**
Declarative DSL that compiles to optimized code. One resource declaration produces persistence, authorization, API, audit trail, and system map metadata. No separate layers, no synchronization, no drift.

**The economics: best in class across the dimensions that matter**
Time to market, infrastructure cost, operational complexity, technical debt floor. Concrete comparisons, not superlatives.

The block should feel like a technical manifesto, not a feature list. Engineering leads who evaluate stacks want to understand the reasoning, not just the conclusion. Show the thinking.

---

Shall I build this as the next homepage section, or as a standalone "Why this stack" page with the full depth?

---

Good. Let me write this as production-ready copy — the full block text, story section, and Foundry amplification layer. This goes deep enough to convince a skeptical CTO.

---

## Block 1: The Headline and Framing

**Section label:** The stack decision

**Headline:**
_We chose the stack that makes hard problems disappear._

**Subheading:**
Not easier to manage. Not better abstracted. Structurally absent. BEAM, OTP, Elixir, and Ash don't give you better tools for solving concurrency, fault isolation, and domain complexity — they give you a runtime where those problems don't exist in the same form.

Every other mainstream stack asks you to solve in architecture what BEAM solves in the virtual machine. That difference compounds over the lifetime of a platform.

---

## Block 2: BEAM and OTP

**Label:** The runtime

**Headline:**
_Built for systems that cannot fail._

Ericsson designed the BEAM virtual machine in 1986 for telephone exchanges — systems where downtime is measured in minutes per decade. The design constraints were unforgiving: millions of concurrent connections, hardware failures, software crashes, zero tolerance for cascading failure.

Those constraints produced a runtime with properties no other mainstream VM shares:

**Lightweight isolated processes.** Every concurrent operation runs in its own process — 2KB initial heap, preemptively scheduled, completely isolated. A crash in one process cannot corrupt another. You don't design around this. It's the execution model.

**Supervision trees.** Processes are arranged in hierarchies. When a process crashes, its supervisor restarts it according to a declared strategy. The rest of the system never knew. This isn't error handling — it's fault architecture. The difference between catching exceptions and designing so that exceptions don't matter.

**Preemptive scheduling.** The scheduler gives every process a fair turn, regardless of what it's doing. No process can block the scheduler. No garbage collection pause stops the world. P99 latency stays close to P50. For financial platforms where a slow response is a compliance event, consistent latency matters more than peak throughput.

**Native distribution.** BEAM nodes form clusters automatically. Processes communicate across nodes transparently. Horizontal scaling is an operational decision — add a node, the cluster forms, load distributes. It's not an architectural decision you make at design time and pay for forever.

OTP — the Open Telecom Platform — is the set of behaviours and patterns built on these primitives. GenServer for stateful processes. Supervisor for fault management. Application for component boundaries. Registry for process discovery. These aren't libraries you add. They're the standard way Elixir programs are structured.

The result: a platform that handles 100,000 concurrent users on infrastructure that would struggle with 10,000 in a thread-per-request model. Not because Elixir is faster per operation — it isn't always — but because the concurrency model doesn't pay the overhead of threads, locks, and context switching that conventional runtimes do.

---

## Block 3: Elixir and Metaprogramming

**Label:** The language

**Headline:**
_The declaration is the domain._

Elixir's macro system is genuinely different from metaprogramming in other languages. Macros operate on the AST at compile time. They produce real, optimized function calls — not string substitution, not runtime reflection, not dynamic dispatch overhead. The code you declare compiles to the code you would have written by hand, structured correctly, formatted consistently, never missing a case.

This is how Spark DSL works. A resource declaration that reads like a specification — attributes, relationships, actions, policies — compiles to efficient, type-checked Elixir. The human reads intent. The compiler runs implementation. There's no gap between them because there's no interpretation step.

Pattern matching and the pipeline operator produce code that reads like the domain it models. A transfer step reads like a business process description. A validation reads like a business rule. The language reduces the distance between what a domain expert describes and what the code says. That's not an aesthetic preference — it's a maintenance property. Code that reads like its domain is code that domain experts can validate, that new engineers can understand, and that diverges from intent more slowly.

The tooling is cohesive in a way that multi-framework stacks aren't. Mix handles builds, tasks, and dependencies. ExUnit handles testing with a consistent pattern across the entire ecosystem. ExDoc generates documentation from the same source the compiler uses. Dialyzer provides static analysis without a separate type system. Credo enforces code style. One ecosystem. One set of conventions. No build tool archaeology six months into a project.

---

## Block 4: Ash Framework

**Label:** The domain layer

**Headline:**
_One declaration. Every concern derived from it._

The conventional ORM approach gives you database access. Everything else — authorization, validation, API serialization, audit trail, pagination, filtering, background jobs — you build yourself. Custom, inconsistent across the codebase, accumulating debt from the first sprint.

Ash replaces that with a single resource declaration from which every concern derives:

A resource declares its attributes, relationships, actions, policies, and extensions once. From that declaration Ash produces: validated persistence through PostgreSQL, authorization enforced at the attribute and action level, REST and GraphQL API surfaces with zero additional code, filtering and pagination with a consistent query language, and introspectable metadata that Foundry reads directly to build the system map.

Add `AshPaperTrail` and every change to a sensitive resource is versioned automatically. Add `AshArchival` and hard deletion is structurally prevented. Add `AshStateMachine` and lifecycle transitions are declared, validated, and enforced by the framework. Add `AshOban` and background jobs are governed Ash actions with the same authorization and audit properties as everything else.

The architectural implication is significant: the domain model is declared once and every other concern — API, authorization, audit, jobs, documentation — derives from it without synchronization. There is no separate authorization service that can drift from the domain. There is no API contract that can fall out of sync with the data model. They're projections of a single source of truth. Foundry's system map is lossless precisely because it reads directly from these declarations rather than reconstructing them from scattered code.

The economics are concrete. A team starting a regulated platform on Ash begins with production-ready authorization, audit trail, API generation, background jobs, state machines, soft delete, money handling, and authentication. These would take four to six months to build correctly from scratch — correctly meaning tested, consistent, maintainable, secure. The debt floor of an Ash project is dramatically lower than a conventional framework project because the primitives are maintained by the ecosystem, not by your team.

---

## Block 5: The Microservices Question

**Label:** The architecture question

**Headline:**
_BEAM solves natively what microservices solve through infrastructure._

Microservices exist to solve real problems. Independent deployment of components. Fault isolation. Scaling individual bottlenecks. Technology choice per service. These are legitimate concerns for large distributed systems.

The BEAM runtime solves most of them without the operational cost:

Independent deployment of components → OTP applications within an Elixir umbrella. Separate contexts, separate supervision trees, separate release artifacts if needed. One codebase, one deployment pipeline, one set of operational concerns.

Fault isolation → supervision trees. A crashed worker doesn't cascade. The supervisor restarts it. The rest of the system continues.

Scaling individual components → dynamic supervisors and process pools. Scale the withdrawal processor independently of the notification sender without a separate service, separate deployment, separate monitoring surface.

Service discovery → libcluster and distributed Erlang. Nodes find each other. No Consul, no etcd, no sidecar proxies, no service mesh to operate.

Async communication → GenServer message passing and Phoenix PubSub. No Redis, no RabbitMQ, no Kafka for most use cases. Message passing is the native model.

A team that reaches for microservices in Rails, Django, or Spring is solving problems that BEAM doesn't have. The operational complexity they're accepting — network calls between services, serialization overhead, distributed tracing to understand a single user request, eventual consistency between service databases, partial success scenarios in distributed transactions — is the price of simulating in infrastructure what BEAM gives you as a runtime property.

For regulated domain platforms specifically, every service boundary is a consistency boundary and an audit boundary. Fewer services means fewer places where a transaction can partially succeed without being recorded. Fewer places where compliance obligations fall between services. Fewer incidents that require reconstructing what happened across twelve service logs.

This isn't an argument against microservices universally. Netflix, at their scale, with their deployment velocity and team topology, has genuine problems that microservices solve. Most teams building domain platforms are not Netflix. They're taking on Netflix's operational complexity to solve problems BEAM handles natively.

---

## Block 6: The Real-World Cost Stories

**Label:** What teams discovered in production

**Headline:**
_The teams who moved to Elixir didn't move back._

---

**Discord — 5 million concurrent users on a rewrite they didn't plan**

Discord ran their read states service on Cassandra and Go. It worked until it didn't. At scale, the Cassandra cluster degraded under pressure in ways that required constant operational intervention. Fan-out on high-follower users caused latency spikes that affected the entire service.

They rewrote the service in Elixir. The result was a system that handled the same load with dramatically simpler operational requirements. The BEAM concurrency model handled the fan-out problem that required architectural gymnastics in Go. The supervision tree handled failures that previously required manual intervention.

Their engineers noted that the Elixir code was smaller, easier to reason about, and handled edge cases that the Go service had treated as operational problems. The move was driven by performance and operational simplicity — they got both, plus code that was easier to maintain.

---

**Bleacher Report — 150 servers to 5**

Bleacher Report ran a Rails application across 150 servers to handle sports event traffic spikes. The architecture was a conventional Rails monolith with aggressive horizontal scaling to compensate for per-request threading overhead.

After rewriting in Elixir and Phoenix, they served the same traffic from five servers. Not ten. Not twenty. Five. The BEAM concurrency model handled the spike load that required 150 threads-per-request servers because the lightweight process model scales concurrency without the overhead of OS threads.

The infrastructure cost reduction was approximately 95%. The operational complexity reduction was proportional. Five servers to monitor, five servers to patch, five servers to reason about when something goes wrong.

---

**Pinterest — Go to Elixir for notification infrastructure**

Pinterest's notification system was built on Go and handled billions of notifications. The system worked but required careful management of goroutine pools, careful tuning of buffer sizes, and careful handling of backpressure. The operational surface area was high for what was fundamentally a message routing problem.

The Elixir rewrite used OTP's built-in process model to handle the same concurrency with significantly less operational complexity. The supervision tree handled failures that previously required custom recovery logic. The code was smaller and the operational requirements were lower.

---

**WhatsApp — 2 million connections per server**

Before the Facebook acquisition, WhatsApp ran on Erlang (BEAM's predecessor language). Two million concurrent connections per server. A team of fifty engineers handling five hundred million users. The ratio of engineers to users was extraordinary — and the BEAM runtime was the reason.

This is the extreme case but it illustrates the fundamental property: BEAM's concurrency model scales to connection counts that require dramatically more infrastructure in conventional runtimes. The economics of this difference are significant at any scale above modest.

---

**Bet365 — financial transactions at scale**

Bet365, one of the world's largest online gambling platforms, runs their core platform on Erlang and Elixir. Financial transactions, real-time odds updates, concurrent user sessions during major sporting events — all on BEAM.

The regulated domain requirements — consistency, audit trail, fault tolerance — are exactly the properties BEAM was designed for. The choice isn't coincidental. When the failure of a transaction must be recorded, not silently lost, when consistency matters more than eventual consistency, when a crashed process must not corrupt a financial record — BEAM's design constraints align with regulated domain requirements more closely than any other mainstream runtime.

---

## Block 7: Foundry Pushes Further

**Label:** What Foundry adds

**Headline:**
_The stack eliminates infrastructure complexity. Foundry eliminates domain complexity._

BEAM and Ash give you a runtime and framework where hard technical problems are either absent or well-solved. What they don't give you is governance of the domain itself — the discipline of how complex platforms are built, evolved, and maintained over time as teams change and requirements shift.

Foundry adds three layers of optimization on top of the stack's native properties:

**Compile-time domain governance.**
The Ash DSL is already validated by the compiler. Foundry extends this with a linter layer — SparkLint with Foundry's invariant rules — that validates domain correctness beyond syntax. A sensitive resource without paper trail is a compile-time error. A compliance-linked action without test coverage is a lint error. A Reactor with more than three steps without a runbook is a lint error. The compiler already prevented syntactic mistakes. Foundry prevents semantic ones.

**Context-complete AI generation.**
Conventional AI coding tools generate plausible code from training data. They don't know your stack version, your invariants, your compliance obligations, or your domain graph. Foundry's copilot receives the full project context — stack versions, resource declarations, compliance links, relevant ADRs — before every generation session. It generates correct Ash code for your version of Ash, constrained by your invariants, classified by your change model. The generation is faster because there's no ambiguity to resolve. It's correct because the constraints are explicit. It's safe because it never reaches your working tree until the proposal passes compile and test.

**Accumulated domain knowledge as executable constraints.**
The single most expensive problem in platform engineering is knowledge decay — constraints that live in engineers' heads, decisions that were made for good reasons nobody remembers, patterns that were established for performance or compliance reasons that aren't obvious from the code. Foundry encodes this knowledge as ADRs the linter references, spec-kit documents the copilot reads, and invariant rules that fire at the exact moment a violation is about to be introduced. A new engineer on a Foundry project encounters the reasoning behind constraints at the moment they're relevant — not in a Confluence page they'll never find, but in a lint violation that says "this is required because ADR-005, motivated by RG-UK-014." The knowledge doesn't decay because it's executable.

**Infrastructure that matches the runtime.**
BEAM's native clustering through libcluster means the infrastructure model is simpler than conventional stacks require. Foundry's infrastructure governance (ADR-006) acknowledges this: proposals for infrastructure changes, human review before application, no autonomous deployment. The simplicity of the BEAM deployment model means fewer infrastructure proposals are needed in the first place. What would be a microservices topology in Rails — twelve services, twelve deployment pipelines, twelve monitoring surfaces — is a single Elixir application with OTP boundaries in Foundry. One deployment to govern. One runtime to monitor. One set of infrastructure proposals to review.

**The compounding effect.**
The BEAM runtime's value is greatest at scale and over time — as concurrency increases, as traffic spikes, as the team grows. Foundry's value follows the same curve. The anti-entropy properties compound as the platform ages, as the team changes, as requirements evolve. At six months, Foundry's discipline is useful. At two years, it's the difference between a platform that can still be changed safely and one that requires a rewrite to move.

The stack was chosen because it produces platforms that scale without drama, fail without cascading, and run without excessive infrastructure. Foundry was built because platforms that scale also need to evolve — governed, auditable, with intent preserved across the team changes and time that every successful platform survives.

---

## One-Paragraph Version for the Homepage Block

For the homepage itself — shorter, punchy, links to the full stack page:

> BEAM was designed for telephone exchanges that cannot fail. Elixir's compile-time metaprogramming means declarations compile to optimized code, not dynamic dispatch. Ash derives authorization, API, audit trail, and documentation from a single resource declaration — no synchronization, no drift. OTP eliminates the operational complexity that drives microservices adoption in other stacks. Bleacher Report went from 150 servers to 5. Discord rewrote a failing Go service and got operational simplicity they didn't expect. WhatsApp handled two million connections per server with a team of fifty engineers.
>
> Foundry pushes further. Compile-time domain governance catches semantic errors the Ash compiler can't. Context-complete AI generation means the copilot knows your invariants, your compliance obligations, and your exact stack version before it writes a line. Accumulated domain knowledge becomes executable constraints — not documentation that decays, but lint rules that fire at the moment a violation is about to be introduced. The stack removes infrastructure complexity. Foundry removes domain complexity. Together they produce platforms that scale without drama, evolve without entropy, and outlast the teams that built them.

---

This copy is ready to drop into the site. The full block versions are for the dedicated "Why this stack" page. The one-paragraph version goes on the homepage with a "Read the full case" link.

Want me to add the HTML section to the homepage file, or keep it as copy for now?

---

Great challenge. This needs to be answered honestly, not defensively. A CTO asking "why not Java" deserves a real answer, not marketing.

---

## The Honest Answer First

Java works. It has worked for decades. The largest financial systems in the world run on Java. SWIFT runs on Java. The NYSE runs on Java. Anyone who tells you Java is wrong for regulated domain platforms is selling something.

The question isn't "does Java work." The question is "what do you give up, what do you gain, and does the tradeoff make sense for a new platform being built today."

---

## Java / Spring Boot

**What Java does well:**

Enormous talent pool. Every enterprise has Java engineers. Every regulated domain has Java tooling — compliance libraries, banking APIs, payment processor SDKs that speak Java natively. The JVM is extraordinarily well-tuned after thirty years. GraalVM native compilation now produces startup times that were previously a Java weakness. Spring Boot's ecosystem is comprehensive — security, data, cloud, messaging, all production-hardened at scale. The tooling — IntelliJ, profilers, APM agents — is the best in class.

If you have a Java team, Java expertise, and Java vendor relationships, starting a new regulated platform in Java is a defensible decision today.

**Where Java costs you:**

Concurrency is the honest gap. Java's threading model — one thread per request in conventional Spring MVC — means concurrency is bought with infrastructure. Project Loom (virtual threads, now in Java 21) closes this gap significantly and is the most important Java development in a decade. But virtual threads are new. The ecosystem, the libraries, the operational patterns around Loom are still maturing. BEAM's concurrency model has thirty years of production hardening. Loom has two.

Verbosity compounds over time. Java's type system is rigorous and the verbosity pays for itself at the largest scales. For a five-person team building a domain platform, the ceremony of Java — boilerplate, configuration, XML, annotation processing — is overhead that accumulates. Spring Boot has reduced this dramatically. It hasn't eliminated it.

Domain modeling is layered. In Spring, your domain logic, your persistence layer, your authorization layer, and your API layer are separate constructs that you build, wire together, and keep in sync. Ash collapses these into a single declaration. The maintenance cost of keeping four layers in sync — or the architectural complexity of frameworks like Axon that try to unify them — is real.

**The honest comparison:**

A senior Java team building a regulated platform on Spring Boot will produce a production-quality system. They'll also spend significant engineering time on infrastructure that Ash provides for free — authorization, audit trail, API generation, consistent filtering. That time comes from somewhere. Usually from domain logic, tests, or documentation.

Foundry specifically can't target Java teams because Foundry's core thesis — the DSL is the specification, the graph is lossless because it reads declarations directly — depends on Ash's declarative model. A Spring Boot application's domain model is scattered across annotations, configuration classes, service beans, and repository interfaces. There's no single declaration to read. The system map would be an approximation, not a rendering.

---

## Kotlin / Spring Boot

Everything above applies, with one addition: Kotlin is genuinely better than Java for domain modeling. Data classes, sealed classes, extension functions, coroutines, and the null safety system produce code that reads closer to the domain than equivalent Java. The Spring ecosystem works well with Kotlin.

The coroutines model is more ergonomic than Java threading and closes some of the concurrency gap with BEAM. Arrow adds functional patterns that Elixir has natively.

If someone said "we're building on Kotlin with Spring Boot and Arrow," the technical argument against it is weaker than against Java. The practical argument is the same: you're still building authorization, audit, API, and domain layers separately, and the graph is still an approximation.

---

## Go

**What Go does well:**

Go's concurrency model — goroutines and channels — is genuinely good. The language was designed for networked services and it shows. Compilation is fast. Deployment is a single binary. Operational simplicity is excellent. Memory usage is low. The standard library is comprehensive. Performance per dollar is among the best of any mainstream language.

For infrastructure tooling, network services, and systems programming, Go is arguably the best choice available. Kubernetes, Docker, Terraform, Prometheus — the infrastructure layer of the modern cloud is largely written in Go. There's a reason for that.

**Where Go costs you:**

Go's type system is simple by design. That simplicity is a feature for systems programming and a liability for domain modeling. There's no generics with the expressiveness of Elixir's macro system (generics were added in Go 1.18 but remain limited). No pattern matching. No algebraic data types. No compile-time metaprogramming.

The result is that Go domain code is verbose in a different way than Java — not boilerplate verbose, but structurally verbose. Expressing a complex domain rule requires more code than the rule itself warrants. The gap between what the business says and what the code says is wider.

Error handling is the most cited Go frustration. `if err != nil` repeated hundreds of times isn't just aesthetic — it's a signal that the language doesn't have the right abstraction for the problem. Elixir's `with` and pattern matching handle the same cases with dramatically less ceremony.

Most importantly: Go has no answer to Ash. There's no Go framework that derives authorization, API, audit trail, and persistence from a single declaration. Teams build these layers separately in Go. The technical debt is structural.

Discord's experience is instructive: they moved from Go to Elixir for exactly the case where Go struggled — massive concurrency with stateful connections. Go's goroutines are good. BEAM's process model is better for that specific problem.

---

## Rust

**What Rust does well:**

Memory safety without garbage collection. Performance that matches or exceeds C. Zero-cost abstractions. The type system is the most sophisticated of any mainstream language — the borrow checker prevents entire classes of bugs at compile time.

For systems programming, Rust is transformative. WebAssembly, embedded systems, game engines, high-performance networking — Rust is the right choice. Major browsers, operating system components, and cloud infrastructure are being rewritten in Rust.

**Where Rust costs you:**

Productivity. The borrow checker is correct and valuable and it slows you down. Significantly. A Rust programmer writes less code per day than a programmer in any other mainstream language because the compiler rejects more things that turn out to be wrong. This is the point of Rust — correctness over speed of development.

For a domain platform, this tradeoff is wrong. The failures you're preventing with Rust's memory safety model — use after free, buffer overflows, data races in shared memory — are not the failures that happen in business logic. Business logic fails because a rule was wrong, because a state machine transition was missing, because a compliance obligation wasn't linked to a test. Rust doesn't prevent those. It prevents memory corruption, which GC languages already prevent.

The talent pool is small and concentrated in systems programming. A Rust team building a business domain platform is using the wrong tool for the problem and paying the productivity cost of the borrow checker without getting the benefit — because the benefit is memory safety in a domain where GC already handles memory.

There's no Ash for Rust. The metaprogramming system that makes Ash possible — compile-time macro expansion over ASTs — doesn't exist in Rust in the same form. You could build something with procedural macros but the result would be dramatically more complex to maintain.

---

## Python / Django / FastAPI

**What Python does well:**

The data science and ML ecosystem is Python. If your domain platform needs to integrate deeply with ML models, Python interoperability matters. Django is one of the most mature web frameworks available with thirty years of security patches, a comprehensive ORM, and a very large talent pool. FastAPI is excellent for building async API services quickly.

For early-stage products where iteration speed is the constraint and scale is not yet a concern, Python's productivity advantage is real. The language is easy to hire for, easy to onboard, and the frameworks are well-documented.

**Where Python costs you:**

Performance and concurrency are the fundamental issues. The Global Interpreter Lock (GIL) means Python threads don't run in parallel — actual parallelism requires multiple processes, which means multiple memory spaces, which means IPC overhead. FastAPI's async model is good but it doesn't fix the GIL. Python 3.13 introduces experimental no-GIL mode but it's experimental.

For a regulated domain platform at any meaningful scale, Python's performance characteristics require significant infrastructure investment — connection poolers, multiple workers, caching layers, async task queues — to compensate for what BEAM provides natively.

Django's ORM is mature but follows the same pattern as all conventional ORMs: persistence only. Authorization, API, audit trail, background jobs — separate constructs, separate maintenance, separate drift surface.

The typing story has improved dramatically with type hints and mypy, but Python is dynamically typed at runtime. Type errors that Elixir catches at compile time surface at runtime in Python, which in a regulated domain means they can surface in production against real financial data.

---

## Node.js / TypeScript

**What Node.js does well:**

JavaScript/TypeScript is the most widely known language in the world. The talent pool is enormous. The async model handles I/O-bound concurrency well. TypeScript's type system has matured significantly and catches real bugs. The ecosystem is vast — almost anything you need exists as a package.

For teams with strong JavaScript experience building I/O-bound services, Node.js is productive and deployable.

**Where Node costs you:**

Node's single-threaded event loop is good for I/O-bound concurrency and problematic for CPU-bound work. A complex domain rule that runs synchronously blocks the event loop. Worker threads exist but they're not the transparent concurrency model that BEAM provides.

The ecosystem's size is also its liability — package selection, version conflicts, supply chain security, the JavaScript fatigue of framework churn. The npm ecosystem has a higher noise-to-signal ratio than the Elixir ecosystem, which is smaller but more coherent.

TypeScript improves JavaScript dramatically but it's still a compile-time layer over a dynamically typed runtime. Type safety erodes at system boundaries — external API calls, database results, JSON parsing — in ways that require explicit handling. Elixir's pattern matching handles these boundaries more naturally.

There's no Ash equivalent. NestJS is the closest — it adds structure and conventions — but it's a long way from declaring a resource once and deriving authorization, API, audit trail, and persistence from that declaration.

---

## The Honest Summary Table

|                     | Concurrency          | Domain modeling      | Talent pool           | Ecosystem maturity | Time to market               | Technical debt floor     |
| ------------------- | -------------------- | -------------------- | --------------------- | ------------------ | ---------------------------- | ------------------------ |
| **BEAM/Elixir/Ash** | Native, excellent    | Declarative, unified | Smaller, high quality | Mature, coherent   | Fastest for domain platforms | Lowest                   |
| **Java/Spring**     | Good (Loom maturing) | Layered, verbose     | Largest               | Excellent          | Moderate                     | Moderate                 |
| **Kotlin/Spring**   | Good (coroutines)    | Better than Java     | Large                 | Good               | Moderate                     | Moderate                 |
| **Go**              | Good (goroutines)    | Weak, verbose        | Large                 | Good for services  | Fast for services            | Moderate                 |
| **Rust**            | Excellent            | No framework         | Small                 | Systems only       | Slow                         | Low (but wrong tradeoff) |
| **Python/Django**   | Poor (GIL)           | ORM only             | Largest               | Excellent          | Fast early                   | High at scale            |
| **Node/TypeScript** | Good for I/O         | No framework         | Very large            | Noisy              | Fast early                   | High at scale            |

---

## Why Foundry Specifically Requires This Stack

This is the argument that doesn't apply to most technology choices but does apply here.

Foundry's core thesis — the codebase is the specification, the graph is a lossless rendering of the domain, the copilot reads live declarations rather than approximating them — is only possible because Ash resources are a single declarative source of truth.

In a Spring Boot application, the domain model is scattered. Annotations on entity classes. Separate service beans. Separate repository interfaces. Separate security configuration. Separate API controllers. A system map of a Spring Boot application is a reconstruction from multiple sources that can and do drift from each other. It's an approximation.

In an Ash application, a resource is the source of truth for all of these concerns. The system map is a direct rendering of declarations that the compiler validates. It cannot be wrong because it's generated from the same source the compiler uses.

This is why Foundry doesn't support other stacks. It's not market positioning. It's that the core value — zero drift between the map and reality — requires a single declarative source. Ash is the only mature framework in any language that provides this for domain modeling.

If Ash existed for Java, Foundry could target Java. It doesn't. And building something like Ash for Java would be a multi-year project because the language's type system and reflection model don't support compile-time DSL construction the way Elixir's macro system does.

---

## The Positioning Statement for This Block

**For the "Why not alternatives" page:**

> We didn't choose Elixir and Ash because Java doesn't work. Java works. The largest financial systems in the world run on Java and will continue to for decades.
>
> We chose this stack because Foundry's core value — a system map that cannot lie, a copilot that knows your domain completely, constraints that are executable rather than documented — is only possible when the domain model is a single declarative source of truth. Ash provides that. Nothing else does, in any language.
>
> The BEAM runtime's concurrency, fault tolerance, and distribution properties mean platforms built on Foundry run efficiently and fail gracefully. The Ash framework's declarative model means the governance layer has something real to read. These aren't incidental benefits — they're the reason the core thesis works.
>
> If you have a Java team that needs to build a regulated platform, Java is a reasonable choice. You'll build more infrastructure than you would on Ash, your system map will be an approximation rather than a rendering, and your AI tooling will guess at your domain rather than reading it. Those are real costs. Whether they outweigh your existing Java investment is a question only you can answer.
>
> Foundry is for teams that want to start right.

---

Want me to add this as a full page in the site — "Why this stack / Why not alternatives" — with the technical depth plus the company stories formatted as case studies?

---

Good shift. The technical page we just built is for the CTO doing due diligence. The business user is a different person with a different set of fears and a different definition of success.

Let me think about who this person actually is before jumping to copy.

---

## Who the Business User Is

Not the engineer. Not the CTO. The person who:

- Owns the product or the business outcome
- Signs off on build vs buy decisions
- Asks "when can we ship?" and "what does it cost?"
- Gets blamed when platforms fail in production
- Has been burned before — a rewrite that took two years, a vendor that locked them in, a platform that couldn't scale when the business needed it to
- Understands risk, time, money, and people — not stack choices

Their vocabulary: time to market, cost, risk, control, team, maintenance, compliance exposure, competitive advantage.

Their fears: building the wrong thing, moving too slow, technical debt they can't pay, a platform that breaks when it matters most, depending on engineers who are the only ones who understand the system.

Their question is never "why Elixir." Their question is always "why should I trust this."

---

## What They Actually Need to Hear

Not features. Not stack comparisons. Stories about outcomes they recognize.

**The core business translation:**

| Technical reality     | Business translation                                                                |
| --------------------- | ----------------------------------------------------------------------------------- |
| Ash declarative DSL   | Your domain model is documented by construction — no extra effort, no drift         |
| Spec-kit + linter     | The rules your platform must follow are enforced automatically, not by process      |
| Proposal model        | Every change to your platform is reviewed before it goes live — always              |
| System map            | Anyone can understand what your platform does — not just the engineers who built it |
| Anti-entropy          | Your platform in year three is as understandable as it was in year one              |
| BDD scenarios         | Non-technical stakeholders can verify the platform does what they specified         |
| Change classification | Sensitive changes always go to the right person — by design, not by policy          |
| BEAM performance      | Your infrastructure costs don't explode when your business grows                    |
| Copilot               | Your team ships faster with fewer people — without cutting corners on governance    |

---

## The Three Business Fears Foundry Directly Addresses

**Fear 1: We'll build the wrong thing and not know until it's too late.**

Every business has experienced this. A platform built over six months that doesn't match what the domain expert intended. The engineers understood the technical requirements. They missed the business intent. By the time the mismatch is visible, the cost to fix it is enormous.

Foundry's answer: the spec is reviewed before the code is written. BDD scenarios are in plain language. The domain expert validates intent before generation begins. The mismatch is caught in the plan, not in production.

**Fear 2: We'll become dependent on people who are the only ones who understand the system.**

The most common and most expensive technical risk in the business vocabulary. When the architect leaves, the system becomes a black box. New engineers are slow because they don't understand it. Changes are risky because nobody knows what breaks. The platform that was a competitive advantage becomes a liability.

Foundry's answer: the system map is always current and always readable. The spec-kit encodes why decisions were made. The linter enforces constraints that would otherwise live in someone's head. The platform is comprehensible to any engineer on day one — not because the documentation is good, but because the documentation is generated from the code and cannot be wrong.

**Fear 3: Compliance will catch us out.**

Regulated domain businesses live with this fear constantly. A process that was compliant when the platform was built is now non-compliant because the regulation changed and nobody updated the platform consistently. An audit reveals gaps that were invisible in normal operation.

Foundry's answer: compliance obligations are linked to code and to tests. A gap is a lint error, not a discovery. When a regulation changes, the spec-kit update drives the code update. The audit trail is automatic. The coverage is measurable.

---

## The Business Page Structure

Not a stack page. Not a features page. A page organized around the three fears and the business outcomes.

**Hero:**
Not "governed build environment." Something like:

> _Your platform should work for your business — in year one, and in year five. Most don't._

Or even more direct:

> _The engineers who built your platform won't always be there. Foundry makes sure that doesn't matter._

**Block 1: The problem in business language**

The story of what happens to platforms without Foundry — told entirely in business terms. Not about code. About a business that built a platform, scaled it, and then found themselves unable to change it safely. The engineer who left. The compliance gap discovered in an audit. The rewrite that cost two years.

**Block 2: What Foundry gives you as a business**

Not features. Outcomes. Four or five statements with a specific claim and a business consequence.

— _Every change to your platform is reviewed by the right person before it goes live._ You don't find out a sensitive change was made in production. You approve it before it happens.

— _The people who built your platform can leave without taking knowledge with them._ New engineers understand the system from day one — not because documentation is good, but because the platform documents itself.

— _Compliance gaps are visible before audits, not during them._ Your coverage is measured continuously. A gap is a lint error, not a surprise.

— _Your platform in year three costs the same to change as your platform in year one._ The technical debt that makes platforms expensive to evolve is structurally prevented, not managed.

— _Your infrastructure costs scale with your business, not ahead of it._ The runtime Foundry builds on handles growth without proportional infrastructure investment.

**Block 3: The business case for spec-first**

The insight that resonates with business users is not "spec-first development." It's:

_The platform can only build what has been specified and approved. There are no surprises._

This is the business translation of the entire Foundry thesis. Not governance for its own sake. Control. Predictability. The confidence to make business decisions knowing the platform will reflect them accurately.

**Block 4: What other teams found**

The company stories but reframed. Not "150 servers to 5." Not concurrency models. But:

— A team that went from taking three weeks to make a compliance change to taking three days — because the compliance obligation was already linked to the code.

— A team that onboarded a new engineer in two days instead of six weeks — because the system map and spec-kit gave them the context that previously lived in people's heads.

— A team that passed their first audit without a remediation period — because the compliance gaps were caught continuously, not discovered under examination.

**Block 5: The honest risk comparison**

Business users think in terms of build vs buy, make vs manage, risk vs control. A simple framing:

_Building a regulated domain platform without Foundry is a people risk. You're betting that the right people stay, remember the right things, and communicate them correctly to the right successors. Foundry turns that people risk into a structural property. The constraints are in the code. The decisions are in the spec. The copilot knows both._

**Block 6: The conversation starter**

Not a "request a demo" button. A set of questions that business users can answer:

— Does your platform do exactly what your domain experts specified — and can you prove it?
— If your lead architect left tomorrow, how long before your next engineer understands the system?
— When did you last measure your compliance coverage — and what did you find?
— How much of your engineering time goes to understanding the existing platform rather than building new capability?

These questions work because every business user has an uncomfortable answer to at least one of them. The questions make the pain felt without claiming it.

---

## The Tone Difference

The technical page is confident and precise. It speaks to engineers who evaluate claims.

The business page is quieter and more honest. It speaks to people who have been burned. It doesn't oversell. It names the risks clearly and explains how they're addressed. The business user's trust is earned by acknowledging what can go wrong, not by listing what goes right.

The business page should feel like a conversation with someone who has built platforms before and understands what the real risks are — not a pitch from someone selling a product.

---

tilda
low-code
zapier
n8n
