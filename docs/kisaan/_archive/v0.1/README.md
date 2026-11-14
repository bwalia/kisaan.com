# KISAAN — AI-Powered Agriculture Marketplace

> Status: Draft v0.1 · Last updated: 2026-11-14 · Owner: KISAAN product & architecture · Source of truth index: this file

## 1. What KISAAN is

KISAAN is an **AI-first, voice-first agricultural marketplace** for India. It connects **farmers and agricultural sellers** with **buyers** (retailers, wholesalers, distributors, processors, restaurants, exporters, agri-businesses and — where applicable — individual consumers), **group-buying area leaders**, and **transporters**.

Instead of forms and dashboards, users can simply *talk* to KISAAN — in **Punjabi, Hindi or English** (including mixed "Hinglish/Punglish") — by voice or chat, in the web app or on WhatsApp:

> 🧑‍🌾 *"Mere paas 100 quintal wheat hai aur main Moga mein hoon. Mujhe achha buyer chahiye."*
>
> 🤖 KISAAN AI asks for missing details (variety, moisture, harvest date, expected price), drafts the listing, shows the latest **sourced** mandi prices with their date, finds matching buyers, collects offers and helps compare them — but **the farmer approves** every important decision (publishing, accepting offers, confirming orders, payments).

## 2. Vision

Build an intelligent agricultural marketplace where farmers sell directly to buyers, buyers discover verified suppliers, and AI agents take over most repetitive operational work — while humans stay in control of every commitment.

## 3. Objectives

| # | Objective | How we will measure (see [PRD §Success metrics](PRD.md)) |
|---|---|---|
| O1 | Let a low-literacy farmer list produce in under 3 minutes by voice | Median voice-listing completion time, completion rate |
| O2 | Give farmers better price discovery than a single local mandi | % listings with ≥2 offers; realised price vs reference mandi modal price |
| O3 | Give buyers verified, quantity-matched supply in one place | Search-to-enquiry conversion; repeat buyers |
| O4 | Reduce coordination effort (offers, orders, transport, payments) via AI agents | % workflow steps drafted by AI; support tickets per order |
| O5 | Be trustworthy: verified users, safe payments, transparent pricing | Dispute rate, fraud loss rate, verified-user share |
| O6 | Grow volume through wholesale tiers, group buying, membership and seller coupons | GMV share from these features; membership retention |

## 4. Confirmed must-have features (Master Prompt §2A)

| Feature | Req. prefix | Scope |
|---|---|---|
| Wholesale / bulk pricing ("buy whole lot", quantity tiers) | `WHL` | MVP |
| Group buying with area leaders (separate bulk-buyer signup, public groups) | `GRP` | MVP (members pay platform directly); leader-collects-money mode **Future, pending legal review** |
| Prime-style paid membership + versioned T&C acceptance | `MEM` | MVP |
| Public seller stores | `STR` | MVP |
| Automated inventory (reserve/deduct/release, no overselling) | `INV` | MVP |
| Seller-controlled discount coupons | `CPN` | MVP |

## 5. Documentation index

| # | Document | What it contains |
|---|---|---|
| 1 | [README.md](README.md) | Overview, vision, objectives, this index |
| 2 | [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | Business vision, scope, roles, business model summary |
| 3 | [PRD.md](PRD.md) | Product requirements, personas, user stories, requirement IDs, acceptance criteria |
| 4 | [FUNCTIONAL_SPECIFICATION.md](FUNCTIONAL_SPECIFICATION.md) | Feature-by-feature specs, workflows, business rules, edge cases, state machines |
| 5 | [AI_AGENT_ARCHITECTURE.md](AI_AGENT_ARCHITECTURE.md) | Orchestrator + 10 agents, tools, permissions, approvals, voice & multilingual, differentiators |
| 6 | [UX_UI_SPECIFICATION.md](UX_UI_SPECIFICATION.md) | Design system, navigation, screen-by-screen specs |
| 7 | [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | Stack, components, infrastructure, integrations, Mermaid diagrams |
| 8 | [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Entities (opsapi reused / extended / new), fields, ER diagram |
| 9 | [API_SPECIFICATION.md](API_SPECIFICATION.md) | REST endpoints (opsapi existing vs new Kisaan), schemas, examples |
| 10 | [SECURITY_AND_COMPLIANCE.md](SECURITY_AND_COMPLIANCE.md) | Security controls, privacy (DPDP), Indian regulatory analysis |
| 11 | [PAYMENT_AND_BUSINESS_MODEL.md](PAYMENT_AND_BUSINESS_MODEL.md) | Revenue model, payment lifecycle, settlement, refunds, discount funding |
| 12 | [TESTING_STRATEGY.md](TESTING_STRATEGY.md) | QA approach, AI/voice/prompt-injection testing, E2E scenarios |
| 13 | [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) | Phases 0–8, deliverables, dependencies, completion criteria |
| 14 | [RISKS_AND_ASSUMPTIONS.md](RISKS_AND_ASSUMPTIONS.md) | Risks, assumptions, open decisions |
| 15 | [COMPETITOR_ANALYSIS.md](COMPETITOR_ANALYSIS.md) | Market research and differentiation (sourced) |
| 16 | [REQUIREMENTS_TRACEABILITY.md](REQUIREMENTS_TRACEABILITY.md) | Requirement → feature → API → DB → test mapping |
| 17 | [OPSAPI_INTEGRATION.md](OPSAPI_INTEGRATION.md) | opsapi reuse map, PROJECT_CODE, Kisaan project module, migrations, image pinning |
| 18 | [MEMBERSHIP_TERMS_AND_CONDITIONS.md](MEMBERSHIP_TERMS_AND_CONDITIONS.md) | Draft membership T&C (**requires legal review**) |
| — | [DOCUMENTATION_COMPLETION_REPORT.md](DOCUMENTATION_COMPLETION_REPORT.md) | Completion report, unresolved questions, next steps |

**Suggested reading order:** README → PROJECT_OVERVIEW → PRD → FUNCTIONAL_SPECIFICATION → AI_AGENT_ARCHITECTURE → SYSTEM_ARCHITECTURE → OPSAPI_INTEGRATION → DATABASE_SCHEMA → API_SPECIFICATION → the rest.

## 6. Documentation conventions

- **Scope tiers:** `MVP` (Punjab pilot launch, roadmap Phases 1–6 plus launch work in Phase 8), `P2` (Phase 7 / first ~6 months after launch), `Future`.
- **Requirement IDs:** `<AREA>-<NNN>` (e.g. `WHL-003`); business rules `BR-<AREA>-NN`; tests `TC-<AREA>-NNN`, E2E scenarios `E2E-NN`; decisions `D-NN`; assumptions `A-NN`; risks `R-NN`. Full prefix table in [REQUIREMENTS_TRACEABILITY.md](REQUIREMENTS_TRACEABILITY.md).
- **Markers:** `[ASSUMPTION A-nn]`, `[DECISION D-nn]` (needs owner confirmation), `[UNVERIFIED]`, `[LEGAL REVIEW]`, `[TAX REVIEW]`, `[OPSAPI: reuse | extend | new]`.
- **Units & money:** quantities stored in kg (1 quintal = 100 kg, 1 tonne = 1000 kg); money in INR `numeric(14,2)`.
- **Backend rule:** opsapi is **consumed, not modified**. All Kisaan migrations and new APIs live in this repository (see [OPSAPI_INTEGRATION.md](OPSAPI_INTEGRATION.md)).

## 7. Repository status

This repository currently contains **documentation only** (`MASTER_PROMPT.md` and `docs/kisaan/`). No application code has been written, and nothing has been committed, pushed or deployed.
