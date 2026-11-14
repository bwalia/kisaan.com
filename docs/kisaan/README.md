# KISAAN — AI-Powered Agriculture Marketplace

> Status: Draft v0.2 · Last updated: 2026-11-14 · Owner: KISAAN product & architecture · Source of truth index: this file

## 1. What KISAAN is

KISAAN is an **AI-first, voice-first agricultural marketplace** for India. It connects **farmers and agricultural sellers** with **buyers** (retailers, wholesalers, distributors, processors, restaurants, exporters, agri-businesses and — where applicable — individual consumers), **group-buying area leaders**, and **transporters**.

Instead of forms and dashboards, users can simply *talk* to KISAAN — in **Punjabi, Hindi or English** (including mixed "Hinglish/Punglish") — by voice or chat, in the web app or on WhatsApp:

> 🧑‍🌾 *"Mere paas 100 quintal wheat hai aur main Moga mein hoon. Mujhe achha buyer chahiye."*
>
> 🤖 KISAAN AI asks for missing details (variety, moisture, harvest date, expected price), drafts the listing, shows the latest **sourced** mandi prices with their date, finds matching buyers, collects offers and helps compare them — but **the farmer approves** every important decision (publishing, accepting offers, confirming orders, payments).

## 2. Vision

Build an intelligent agricultural marketplace where farmers sell directly to buyers, buyers discover verified suppliers, and one central KISAAN AI takes over most repetitive operational work through secure, permission-checked tools — while humans stay in control of every commitment.

## 3. Objectives

| # | Objective | How we will measure (see [PRD §Success metrics](PRD.md)) |
|---|---|---|
| O1 | Let a low-literacy farmer list produce in under 3 minutes by voice | Median voice-listing completion time, completion rate |
| O2 | Give farmers better price discovery than a single local mandi | % listings with ≥2 offers; realised price vs reference mandi modal price |
| O3 | Give buyers verified, quantity-matched supply in one place | Search-to-enquiry conversion; repeat buyers |
| O4 | Reduce coordination effort (offers, orders, transport, payments) via the single KISAAN AI | % workflow steps drafted by AI; support tickets per order |
| O5 | Be trustworthy: verified users, safe payments, transparent pricing | Dispute rate, fraud loss rate, verified-user share |
| O6 | Grow volume through wholesale tiers, group buying, membership and seller coupons | GMV share from these features; membership retention |

## 4. Confirmed must-have features (Master Prompt §2A)

| Feature | Req. prefix | Scope |
|---|---|---|
| Wholesale / bulk pricing ("buy whole lot", quantity tiers) | `KIS-WHL` | MVP |
| Group buying with area leaders (separate bulk-buyer signup, public groups) | `KIS-GROUP` | MVP (members pay platform directly); leader-collects-money mode **Future, pending legal review** |
| Paid membership (**KISAAN Plus**) + versioned T&C acceptance | `KIS-MEMBER` | MVP |
| Public seller stores | `KIS-STORE` | MVP |
| Automated inventory (reserve/deduct/release, no overselling) | `KIS-INV` | MVP |
| Seller-controlled discount coupons | `KIS-COUPON` | MVP |

## 5. Documentation index

Revision v0.2 (2026-11-14) aligns the suite with **Master Prompt v2**. It replaces the v0.1 multi-agent AI with a **single KISAAN AI** (D-101/D-102), adds six domain-owner documents, adds the `KIS-` ID namespace and adds a group-discount stage to pricing (D-103). The v0.1 snapshot is kept read-only in [`_archive/v0.1/`](_archive/v0.1/).

| # | Document | What it contains |
|---|---|---|
| 1 | [README.md](README.md) | Overview, vision, objectives, this index, conventions |
| 2 | [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | Business vision, scope, roles, business model summary |
| 3 | [PRD.md](PRD.md) | Product requirements, personas, user stories, scope tiers, KPIs, acceptance criteria |
| 4 | [FUNCTIONAL_SPECIFICATION.md](FUNCTIONAL_SPECIFICATION.md) | Feature-by-feature specs, workflows, business rules, edge cases (links to owner docs) |
| 5 | [MARKETPLACE_ARCHITECTURE.md](MARKETPLACE_ARCHITECTURE.md) | Domain map, categories, listings, search, requirements/RFQ, offers & negotiation, order state machines |
| 6 | [WHOLESALE_AND_GROUP_BUYING.md](WHOLESALE_AND_GROUP_BUYING.md) | Wholesale tiers, buyer types, bulk-buyer onboarding, buying groups, leader/member permissions & privacy |
| 7 | [SELLER_STORE_AND_INVENTORY.md](SELLER_STORE_AND_INVENTORY.md) | Public stores, inventory model, reservations, concurrency & overselling prevention |
| 8 | [COUPON_AND_MEMBERSHIP.md](COUPON_AND_MEMBERSHIP.md) | Seller coupons, KISAAN Plus membership lifecycle, benefits engine |
| 9 | [SINGLE_AI_ARCHITECTURE.md](SINGLE_AI_ARCHITECTURE.md) | The one KISAAN AI: runtime, tool catalogue, permissions, approvals, voice, safety, cost |
| 10 | [UX_UI_SPECIFICATION.md](UX_UI_SPECIFICATION.md) | Design system, navigation, screen-by-screen specs (mobile-first) |
| 11 | [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | Stack, containers, infrastructure, integrations, NFRs |
| 12 | [OPSAPI_INTEGRATION.md](OPSAPI_INTEGRATION.md) | OpsAPI reuse map, ownership boundaries, plugin ("dynamic API") approach, migrations, image pinning |
| 13 | [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Entities (OpsAPI-owned vs KISAAN-owned), fields, constraints, ER diagrams |
| 14 | [API_SPECIFICATION.md](API_SPECIFICATION.md) | Endpoints labelled Existing OpsAPI / KISAAN-specific / To Be Verified |
| 15 | [PRICING_ENGINE.md](PRICING_ENGINE.md) | Deterministic pricing, discount precedence & stacking, rounding, price locking |
| 16 | [PAYMENT_AND_BUSINESS_MODEL.md](PAYMENT_AND_BUSINESS_MODEL.md) | Revenue model, payment lifecycle, settlement, refunds, reconciliation |
| 17 | [SECURITY_AND_COMPLIANCE.md](SECURITY_AND_COMPLIANCE.md) | Security controls, privacy (DPDP), Indian regulatory analysis |
| 18 | [TESTING_STRATEGY.md](TESTING_STRATEGY.md) | QA approach, AI/voice/prompt-injection testing, end-to-end scenarios |
| 19 | [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) | Phases 0–10, deliverables, dependencies, acceptance criteria, risks |
| 20 | [RISKS_AND_ASSUMPTIONS.md](RISKS_AND_ASSUMPTIONS.md) | Risks, assumptions, decision register |
| 21 | [COMPETITOR_ANALYSIS.md](COMPETITOR_ANALYSIS.md) | Sourced market research and differentiation |
| 22 | [REQUIREMENTS_TRACEABILITY.md](REQUIREMENTS_TRACEABILITY.md) | Requirement → owner doc → DB → API → UI → test mapping |
| S1 | [MEMBERSHIP_TERMS_AND_CONDITIONS.md](MEMBERSHIP_TERMS_AND_CONDITIONS.md) | Draft KISAAN Plus T&C (**requires legal review**) |
| S2 | [DOCUMENTATION_COMPLETION_REPORT.md](DOCUMENTATION_COMPLETION_REPORT.md) | Completion report, unresolved questions, next steps |

**Owner-document rule:** a normative rule lives in exactly one owner document; others link to it. If documents conflict, the owner doc wins: pricing → PRICING_ENGINE; groups/wholesale → WHOLESALE_AND_GROUP_BUYING; store/inventory → SELLER_STORE_AND_INVENTORY; coupons/membership → COUPON_AND_MEMBERSHIP; AI → SINGLE_AI_ARCHITECTURE; tables → DATABASE_SCHEMA; endpoints → API_SPECIFICATION.

**Suggested reading order:** README → PROJECT_OVERVIEW → PRD → MARKETPLACE_ARCHITECTURE → the domain owner docs (5–9, 15) → SYSTEM_ARCHITECTURE → OPSAPI_INTEGRATION → DATABASE_SCHEMA → API_SPECIFICATION → the rest.

## 6. Documentation conventions

- **Scope tiers:** `MVP` (Punjab pilot launch, roadmap Phases 0–7, basic Hindi/Punjabi voice from Phase 8, seller-delivered/buyer-pickup logistics from Phase 9, and launch hardening in Phase 10 (D-106)), `P2` (first ~6 months after launch), `Future`.
- **Requirement IDs:** `KIS-<DOMAIN>-NNN` (e.g. `KIS-WHL-003`, `KIS-AI-012`, `KIS-BULK-001`, `KIS-OPSAPI-004`; cross-cutting principles use `KIS-REQ-NNN`). Tests: `KIS-TEST-<DOMAIN>-NNN`; E2E scenarios `E2E-NN`; business rules `BR-<DOMAIN>-NN`; screens `SCR-<DOMAIN>-NN`; decisions `D-NN`, assumptions `A-NN`, risks `R-NN` (v0.2 additions start at 101). IDs were reconciled once in the v0.2 final pass (old→new mappings are recorded in each doc's changelog) and are stable from v0.2 onward. Full domain table in [REQUIREMENTS_TRACEABILITY.md](REQUIREMENTS_TRACEABILITY.md).
- **Markers:** `[ASSUMPTION A-nn]`, `[DECISION D-nn]` (needs owner confirmation), `[UNVERIFIED]`, `[LEGAL REVIEW]`, `[TAX REVIEW]`, `[OPSAPI: reuse | extend | new]`.
- **Units & money:** quantities stored in kg (1 quintal = 100 kg, 1 tonne = 1000 kg); money in INR `numeric(14,2)`.
- **Backend rule:** opsapi is **consumed, not modified**. All Kisaan migrations and new APIs live in this repository (see [OPSAPI_INTEGRATION.md](OPSAPI_INTEGRATION.md)).

## 7. Repository status

This repository currently contains **documentation only** (`MASTER_PROMPT.md` and `docs/kisaan/`). No application code has been written, and nothing has been committed, pushed or deployed.
