# KISAAN — Documentation Completion Report

> Status: Draft v0.2 · Last updated: 2026-11-14 · Owner: KISAAN product & architecture · Source of truth index: [README](README.md)

This report closes Step 25 of the Master Prompt (v2). It replaces the v0.1 report, which is kept in [`_archive/v0.1/`](_archive/v0.1/DOCUMENTATION_COMPLETION_REPORT.md).

## 1. What was delivered

All **22 documents** required by Master Prompt §37 exist in `docs/kisaan/` at Draft v0.2, plus two supporting files:

| # | Document | # | Document |
|---|---|---|---|
| 1 | [README](README.md) | 12 | [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md) |
| 2 | [PROJECT_OVERVIEW](PROJECT_OVERVIEW.md) | 13 | [DATABASE_SCHEMA](DATABASE_SCHEMA.md) |
| 3 | [PRD](PRD.md) | 14 | [API_SPECIFICATION](API_SPECIFICATION.md) |
| 4 | [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md) | 15 | [PRICING_ENGINE](PRICING_ENGINE.md) |
| 5 | [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) | 16 | [PAYMENT_AND_BUSINESS_MODEL](PAYMENT_AND_BUSINESS_MODEL.md) |
| 6 | [WHOLESALE_AND_GROUP_BUYING](WHOLESALE_AND_GROUP_BUYING.md) | 17 | [SECURITY_AND_COMPLIANCE](SECURITY_AND_COMPLIANCE.md) |
| 7 | [SELLER_STORE_AND_INVENTORY](SELLER_STORE_AND_INVENTORY.md) | 18 | [TESTING_STRATEGY](TESTING_STRATEGY.md) |
| 8 | [COUPON_AND_MEMBERSHIP](COUPON_AND_MEMBERSHIP.md) | 19 | [DEVELOPMENT_ROADMAP](DEVELOPMENT_ROADMAP.md) |
| 9 | [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md) | 20 | [RISKS_AND_ASSUMPTIONS](RISKS_AND_ASSUMPTIONS.md) |
| 10 | [UX_UI_SPECIFICATION](UX_UI_SPECIFICATION.md) | 21 | [COMPETITOR_ANALYSIS](COMPETITOR_ANALYSIS.md) |
| 11 | [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) | 22 | [REQUIREMENTS_TRACEABILITY](REQUIREMENTS_TRACEABILITY.md) |

Supporting: [MEMBERSHIP_TERMS_AND_CONDITIONS](MEMBERSHIP_TERMS_AND_CONDITIONS.md) (draft, **requires legal review**) and this report.

**Size:** about 17,900 lines. **Requirements:** 726 IDs across 37 prefixes (613 MVP, 48 P2/Future, 63 compliance items, 2 retired). **AI tools:** 113 in 16 categories (61 READ, 17 DRAFT, 35 COMMIT). **Tests:** 681 test IDs plus E2E-01…E2E-15 ([TESTING_STRATEGY](TESTING_STRATEGY.md)), no duplicates.

No application code was written. Nothing was committed, pushed, merged or deployed (the folder is not a git repository). The OpsAPI repository was only read; nothing in it was changed.

## 2. What changed from v0.1 to v0.2

| Area | v0.1 | v0.2 |
|---|---|---|
| AI | Separate AI Gateway with an orchestrator and 10 specialist agents | **Exactly one KISAAN AI** runtime inside the Next.js app (`web/src/server/ai/`), working only through 113 permission-checked tools (D-101/D-102). COMMIT tools (`propose_*`) only create approval requests; the user's own client executes them |
| Documents | 18 | 22 (added MARKETPLACE_ARCHITECTURE, WHOLESALE_AND_GROUP_BUYING, SELLER_STORE_AND_INVENTORY, COUPON_AND_MEMBERSHIP, PRICING_ENGINE; SINGLE_AI_ARCHITECTURE replaced AI_AGENT_ARCHITECTURE) |
| Group buying | Members paid at join; refunds at close | Commit free → seller offers → leader locks → each member pays own share within 24 h (2–24 h configurable) → shortfall goes to repricing: seller honours / re-offers / declines (D-72, D-124, D-132) |
| Pricing | 5-stage order | 9-stage deterministic engine with group-discount stage, price locking and 10 rupee-exact worked examples, incl. Master Prompt §27 = ₹7,650.00 (D-103) |
| Buyer types | Implicit | Normal buyer, bulk buyer (separate sign-up), group leader, group member — defined with permissions and leader privacy (`GROUP_FORBIDDEN_FIELD`) |
| Coupons | Basic | Full §8 field set, buyer segments, time windows, 50% hard cap, admin emergency disable, group coupons (one redemption per group unless `count_per_member`) |
| Transporters | Open transporter marketplace in MVP | **P2** (D-106); MVP delivery = buyer pickup, seller delivery (`SELLER_DELIVERS_FEE`), partner-arranged |
| Roadmap | 6 phases | Phases 0–10 per Master Prompt §35, each with deliverables, dependencies, tasks, tests, acceptance criteria and risks |

## 3. Master Prompt §42 final review

| Check | Result | Evidence |
|---|---|---|
| Every major requirement has an ID | PASS | [REQUIREMENTS_TRACEABILITY](REQUIREMENTS_TRACEABILITY.md) — 0 undefined, 0 duplicated IDs |
| Every requirement has a feature owner | PASS (module level) | Traceability "owner" column; named people to be assigned at Phase 0 |
| Every feature has a data model | PASS | DATABASE_SCHEMA §2A entity map |
| Every feature has API requirements | PASS | API_SPECIFICATION, provenance-tagged (Existing OpsAPI / KISAAN-specific / Dynamic plugin / KISAAN-APP / To Be Verified) |
| Every feature has UI requirements | PASS (area level) | UX_UI_SPECIFICATION §8.0 covers every §31 interface |
| Every feature has test cases | PASS (MVP) | Every MVP requirement is named by a test row; 21 P2/Future items get tests when designed (§4) |
| One KISAAN AI with documented tool catalogue and explicit permissions | PASS | SINGLE_AI_ARCHITECTURE §8 (catalogue, role matrix, approval matrix) |
| Pricing deterministic | PASS | PRICING_ENGINE |
| Inventory transaction-safe | PASS | SELLER_STORE_AND_INVENTORY (row locks + conditional update, 700 kg + 500 kg race, KIS-TEST-CONC-*) |
| Wholesale, group buying, group leaders, stores, inventory, coupons, membership, membership terms | PASS | Domain owner docs + MEMBERSHIP_TERMS_AND_CONDITIONS (legal review pending) |
| OpsAPI integration, ownership, KISAAN migrations, dynamic API strategy | PASS | OPSAPI_INTEGRATION §0 (plugin = the only dynamic-API mechanism; KISAAN-owned migrations; no OpsAPI changes) |
| Security, compliance assumptions | PASS | SECURITY_AND_COMPLIANCE (confirmed law vs recommendation vs assumption; `[LEGAL REVIEW]` / `[TAX REVIEW]` flags) |
| MVP scope clear; future separated | PASS | DEVELOPMENT_ROADMAP §2–3, PRD scope tiers |
| No undocumented major dependency | PASS | §6 below |

## 4. Test coverage

Every domain has a test suite, and the full §32 scenario is **E2E-15** (18 steps with exact amounts and stock levels, variants 15a–15e). The final pass linked every requirement to a named test row: about 210 were matched to existing tests and 85 new test rows were written (security, privacy, OpsAPI contract, voice, WhatsApp, admin and others). Legal/process compliance items are covered by release-gate "compliance evidence check" rows rather than functional tests.

**Uncovered: 21**, all P2/Future items whose behaviour is not designed yet — P2: AI-019, ANL-004, DSP-007, ENQ-005, GROUP-024, PRD-010, VOX-008, WA-107, WHL-016; Future: ADM-009, AI-020, ANL-005, BULK-010, INV-011, LOG-009, OFR-007, PAY-011, PRD-024, VOX-009, VOX-110, VOX-111. Add tests when each is designed.

**Final consistency check (scripted, 2026-11-14):** all 22 required files present at Draft v0.2; no broken internal links; balanced code/Mermaid fences; no requirement or test ID defined twice in one doc; no ID used with two different meanings; no undefined D/A/R IDs; v0.1 terms (AI Gateway, specialist agents, `ai.kisaan.in`, group `/close`) appear only in labelled history rows.

## 5. Decisions waiting for sign-off

The full ordered list is [RISKS_AND_ASSUMPTIONS §0 "Owner sign-off queue"](RISKS_AND_ASSUMPTIONS.md) (14 items). The most launch-critical:

1. **D-80 / D-81 — Punjab APMC** licence and market fee for on-platform wheat/paddy trades. Checkout for notified produce stays switched off until a written legal opinion arrives. **Highest risk.**
2. **D-09 — Payment aggregator** (Razorpay Route proposed, Cashfree alternative) and split-settlement holds. Start onboarding in Phase 0.
3. **D-72 / D-124 / D-132 — Group flow** (pay after lock, 24 h window, seller honour / re-offer / decline). Founder + legal.
4. **D-106 — Transporter marketplace is P2.** Founder.
5. **D-134 — Group delivery** charged as estimate + 10% buffer, platform absorbs any overrun. Founder.
6. **D-133 — Requirement-bound groups in MVP.** Founder.
7. **D-19 / D-82 — Commission rate and GST on commission.** Founder + tax.
8. **KISAAN Plus** price, trial, refunds and the platform-funded free-delivery benefit (D-11, D-12, D-97, D-105, R-122). Founder + legal + tax.

## 6. External dependencies

Payment aggregator with marketplace split; DLT-registered SMS provider; WhatsApp Business Platform; STT/TTS/LLM providers (Punjabi accuracy **unmeasured** — Phase 0 bake-off); data.gov.in / Agmarknet mandi data; geocoding; S3-compatible storage; the OpsAPI Docker image (`bwalia/opsapi`, pinned tag; plugin mechanism re-checked against 1.0.345); legal counsel and a chartered accountant.

## 7. Recommended next steps

1. Founder reviews the sign-off queue (§5) and confirms or overrides each item.
2. Commission legal opinions (APMC, payment aggregator/escrow, group buying, DPDP, FSSAI, membership T&C) and a CA opinion (GST/TCS/TDS on commission and farmer sales).
3. Start long-lead onboarding now: payment aggregator, SMS DLT, WhatsApp Business verification.
4. Phase 0 spikes: OpsAPI plugin hello-world with phone-OTP sessions (R-31); Punjabi STT bake-off on field audio; tool-selection eval of candidate LLMs on the role-filtered tool set (A-101); mandi data ingestion.
5. Usability test of farmer voice-listing and group-join prototypes with at least 10 Punjab farmers.
6. Assign named owners to each module in the traceability matrix and initialise a git repository before implementation starts.
