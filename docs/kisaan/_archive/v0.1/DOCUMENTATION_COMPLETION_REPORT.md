# KISAAN — Documentation Completion Report

> Status: Draft v0.1 · Last updated: 2026-11-14 · Owner: KISAAN product & architecture · Source of truth index: [README](README.md)

## 1. Documents created (`docs/kisaan/`)

All 18 documents required by MASTER_PROMPT §20 exist, plus this report:

README · PROJECT_OVERVIEW · PRD · FUNCTIONAL_SPECIFICATION · AI_AGENT_ARCHITECTURE · UX_UI_SPECIFICATION · SYSTEM_ARCHITECTURE · DATABASE_SCHEMA · API_SPECIFICATION · SECURITY_AND_COMPLIANCE · PAYMENT_AND_BUSINESS_MODEL · TESTING_STRATEGY · DEVELOPMENT_ROADMAP · RISKS_AND_ASSUMPTIONS · COMPETITOR_ANALYSIS · REQUIREMENTS_TRACEABILITY · OPSAPI_INTEGRATION · MEMBERSHIP_TERMS_AND_CONDITIONS (draft, **requires legal review**).

No application code was written. Nothing was committed, pushed or deployed. The opsapi repository was only read (`origin/main` @ `0544d487`, tag `1.0.339`); nothing in it was changed.

## 2. Requirements covered

- **About 476 requirement IDs** across all prefixes (see [REQUIREMENTS_TRACEABILITY](REQUIREMENTS_TRACEABILITY.md)), plus business rules (BR-*), screens (SCR-*), tests (TC-*, E2E-01..14) and decisions/assumptions/risks (D/A/R).
- **All six confirmed §2A features** (wholesale, group buying, membership + T&C, public stores, automated inventory, seller coupons) appear in the PRD, functional spec, database, API, UX, tests and roadmap. Group buying is **partial MVP**: members pay the platform's payment provider directly. The mode where the leader collects members' money is **Future, pending legal review**. This is flagged, not dropped.

## 3. Major architectural decisions (proposed)

1. **Backend:** opsapi consumed as image `bwalia/opsapi:1.0.339` (pinned). KISAAN is an opsapi **plugin** (`/app/projects/kisaan`, routes under `/api/v2/kisaan`, migrations tracked in `project_migrations`). There are no opsapi changes and no `ALTER` on opsapi tables.
2. **opsapi setting:** `PROJECT_CODE=ecommerce_chat,billing`, with one marketplace namespace `kisaan`.
3. **New Kisaan modules** (things opsapi lacks): phone/SMS OTP login, an Indian payment-provider adapter (Razorpay Route proposed; opsapi supports Stripe only), GST invoicing, inventory reservations, wholesale tiers, offers/negotiation, group buying, seller coupons, membership, mandi prices and approvals.
4. **AI:** a separate Kisaan AI Gateway (TypeScript/Node) runs an orchestrator plus 10 agents that act only through tools carrying the user's permissions. Every commit action needs an ApprovalRequest that the **user's own client** approves.
5. **Frontend:** Next.js PWA, mobile-first and low-bandwidth, in pa/hi/en. Voice support plus WhatsApp (core in MVP).
6. **Pricing:** stacking order is base → wholesale → negotiated → member price → seller coupon; free delivery for members is a delivery-fee waiver. Commission is seller-side (1.5%, a placeholder).

## 4. Unresolved questions (top items — full list in [RISKS_AND_ASSUMPTIONS](RISKS_AND_ASSUMPTIONS.md))

- **D-80 Punjab APMC:** licence and market fee/rural development fee for trading outside mandis. Wheat/paddy checkout stays switched off until a written legal opinion is received. This is the highest risk.
- **D-09 / A-90:** the payment provider and whether settlement can be held at the provider. D-19 commission rate. D-11/D-12 membership pricing and refunds. D-82 GST on commission `[TAX REVIEW]`.
- **R-31:** how phone-OTP users are issued opsapi sessions. It relies on an opsapi helper outside the plugin SDK, so it needs a Phase 0 spike.
- **D-34 / A-01:** speech-to-text vendor and Punjabi accuracy. Only vendor availability has been verified; accuracy has not been measured.

## 5. External dependencies

Payment aggregator (marketplace split), DLT-registered SMS provider, WhatsApp Business Platform (INR billing by 31 Dec 2026), STT/TTS/LLM providers, the data.gov.in/Agmarknet mandi dataset (API key not yet verified), a geocoding provider, S3-compatible storage, Docker Hub opsapi images, legal counsel and a CA.

## 6. Key risks

Punjab APMC regulation (R-13), marketplace liquidity / cold start (R-17), farmer onboarding and trust (R-01/R-02), quality disputes (R-03), AI hallucination (R-11), regional-language accuracy (R-10), opsapi upgrade/compatibility (R-31/R-32).

## 7. Consistency review

An independent cross-document review found 34 issues. All of them were given a canonical resolution and applied: commission payer, stacking order, membership trial with no autopay, refund rule, thresholds, retention periods, approval-execution model, RBAC naming, table names, scope tiers and ID collisions. **If any document still contradicts these resolutions, the resolutions win.** They are recorded in the decision register.

## 8. Recommended next steps

1. Founder/product owner reviews [RISKS_AND_ASSUMPTIONS](RISKS_AND_ASSUMPTIONS.md) §1 and confirms or overrides each `D-*`.
2. Commission legal opinions (APMC, payment provider/escrow, group buying, DPDP timing, FSSAI) and a CA opinion (GST/TCS/TDS).
3. Start payment-provider onboarding, SMS DLT registration and WhatsApp verification now; these have the longest lead times.
4. Phase 0 spikes: opsapi plugin hello-world with phone-OTP sessions (R-31), Punjabi STT bake-off on field audio, mandi data ingestion.
5. Usability test of the farmer voice-listing prototype with ≥10 Punjab farmers.
6. Re-run the traceability matrix after decisions land, and close the test gaps listed there.
