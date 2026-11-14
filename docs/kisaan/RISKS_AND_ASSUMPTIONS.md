# KISAAN — Risks, Assumptions & Decisions Required

> Status: Draft v0.2 · Last updated: 2026-11-14 · Owner: Product Owner (with Technical Architecture Lead) · Source of truth index: [README](README.md)

This is the **single consolidated register** of business risks, assumptions and open decisions across all KISAAN documents. Other documents tag items inline as `[DECISION D-nn]`, `[ASSUMPTION A-nn]` and `[RISK R-nn]`; **the canonical text lives here and wins over any local restatement**. IDs are not contiguous because ranges were allocated per document: D-01..D-19 product, D-20..D-37 architecture/OpsAPI, D-40..D-42 UX, D-50..D-56 AI, D-60..D-61 data model, D-70..D-72 functional, D-80..D-87 cross-cutting/legal, D-90..D-97 payments & membership. **v0.2 ranges:** D-101..D-106 / A-101..A-107 / R-101..R-112 cross-cutting; D-120..D-128 / A-120..A-122 / R-120..R-123 pricing, coupons & membership; D-130..D-138 / A-130..A-131 / R-130..R-131 marketplace, inventory & groups; D-140..D-142 / A-140 / R-140 single KISAAN AI.

Every D-/A-/R- ID used in any `docs/kisaan/*.md` file has exactly one row in this register (checked by script on 2026-11-14).

## 0. Owner sign-off queue

Ordered by launch criticality. "Founder" = product owner / founder; "Legal" = external counsel; "Tax" = chartered accountant. Each item links to its register row below.

| # | ID | What needs signing off | Who | Blocks |
|---|---|---|---|---|
| 1 | D-80 / D-81 / R-13 | Punjab APMC licence and market fee / RDF for on-platform wheat/paddy trades; checkout for notified produce stays flagged off until a written opinion | Legal, Tax | Phase 10 launch of wheat/paddy checkout |
| 2 | D-09 / A-04 / A-90 / A-105 | Payment aggregator, split-settlement holds, one consolidated group settlement | Founder (+ PA confirmation) | Phase 6 build; onboarding lead time starts Phase 0 |
| 3 | D-72 / D-124 / D-132 / D-95 | Group flow: commit free, pay after lock within 24 h, shortfall → seller honour / re-offer / decline | Founder, Legal | Phase 4 design, Phase 6 build |
| 4 | D-106 (+ D-106a withdrawn) | Open transporter marketplace is P2, not MVP; MVP delivery = buyer pickup, seller delivery (`SELLER_DELIVERS_FEE`), partner-arranged | Founder | Phase 0 scope freeze |
| 5 | D-134 / R-131 | Group partner/platform delivery charged as estimate + 10% buffer; platform absorbs any residual shortfall (alternative: post-delivery top-up) | Founder | Phase 4 / Phase 9 |
| 6 | D-133 | Requirement-bound groups (seller offers on a group requirement) are MVP | Founder | Phase 4 scope |
| 7 | D-19 / D-82 | Commission rate (seller-side) and GST treatment of commission | Founder, Tax | Phase 6 |
| 8 | D-84 / D-86 | FSSAI e-commerce FBO licence; symmetric cancellation-fee policy | Legal | Phase 6 food-category checkout |
| 9 | D-11 / D-12 / D-97 / D-105 / D-41 | KISAAN Plus price, trial, refunds, re-consent on price change, name/trademark | Founder, Legal | Phase 5 |
| 10 | R-122 / D-120 | Plus free delivery waives the seller's delivery fee (platform-funded) — changes T&C text; GST display convention | Founder, Legal, Tax | Phase 5 / Phase 6 |
| 11 | D-53 / D-54 / D-87 | Retention of AI transcripts, raw voice, user chats (DPDP) | Legal | Phase 7 |
| 12 | D-10 / A-92 | Group-leader incentive (with TDS) and e-commerce TDS on farmer sales | Founder, Tax | Phase 4 / Phase 6 |
| 13 | D-101 / D-102 | One KISAAN AI inside `kisaan-app` (architecture sign-off) | Founder, Tech lead | Phase 0 |
| 14 | D-30 / D-31 / R-31 | Pinned OpsAPI tag, escalation path, phone-OTP session spike | Tech lead | Phase 0 |

**v0.2 changes.** Master Prompt v2 (2026-11-14) supersedes v1 where they differ:
- the v0.2 decisions are registered in §1.6 (cross-cutting D-101..D-106, D-106a withdrawn) and §1.7 (domain decisions D-120..D-142);
- D-41 is **closed** by D-105; D-72 and D-95 are updated for the pay-after-lock group flow;
- D-25, D-32 and D-50 are superseded (no separate AI Gateway, no multi-agent design);
- "Needed by" phases are renumbered to the v0.2 roadmap (Phases 0–10, D-106);
- v0.1 agent codes (AI-PRI, AI-TRS, AI-LGX …) in risk owners are replaced by the tool category or backend module that now owns the concern.

**Phase key (v0.2, D-106):** 0 Discovery · 1 Foundation · 2 Marketplace · 3 Wholesale (incl. offers/negotiation) · 4 Buyer Groups · 5 Coupons & Membership · 6 Orders & Payments · 7 Single KISAAN AI · 8 Voice & Regional Languages · 9 Logistics · 10 Production.

## 1. Decisions required (owner confirmation needed)

Status: **Proposed** = the documented default the team will build to unless overridden; **Open** = must be answered before the stated phase; **Superseded** = replaced by a later decision.

### 1.1 Product & business

| ID | Decision | Proposed default | Needed by | Status | Source |
|---|---|---|---|---|---|
| D-01 | MVP categories | Wheat, Rice/Paddy, Maize, Pulses, potato, onion, kinnow. Agri-inputs are Future | Phase 0 | Proposed | PRD, PROJECT_OVERVIEW |
| D-02 | Buyer order-value threshold requiring business (T3) verification | ₹2,00,000 per order | Phase 1 | Proposed | FUNCTIONAL_SPECIFICATION BR-ONB-10 |
| D-03 | Listing expiry | 30 days (non-perishable), 7 days (perishable) | Phase 2 | Proposed | FS BR-LST-03 |
| D-04 | Buyer anonymity in public RFQs | Show buyer type, district and badge until a quotation is accepted | Phase 3 | Proposed | FS BR-ENQ-04 |
| D-05 | Offer validity | 24 h / 6 h perishable (range 1–72 h) | Phase 3 | Proposed | FS BR-OFR-03 |
| D-06 | Seller auto-counter rules (P2) | Never auto-accept | P2 | Proposed | FS BR-OFR-16 |
| D-07 | Payment deadline after acceptance | 24 h / 4 h perishable | Phase 6 | Proposed | FS |
| D-08 | Buyer acceptance window after delivery | 48 h / 12 h perishable, then auto-complete | Phase 6 | Proposed | FS BR-ORD-05 |
| D-09 | Payment aggregator | Razorpay Route primary, Cashfree Easy Split alternative, behind an adapter | **Phase 0** (onboarding lead time) | Open | FS BR-PAY-01, PAYMENT_AND_BUSINESS_MODEL |
| D-10 | Group-leader incentive model | KYC'd fee per completed group order, with TDS. The leader never collects member money | Phase 4 | Open | PRD, PAYMENT_AND_BUSINESS_MODEL |
| D-11 | Membership pricing and trial | KISAAN Plus ₹199/month, ₹1,999/year incl. GST, 30-day trial without mandatory autopay | Phase 5 | Open | COUPON_AND_MEMBERSHIP, MEMBERSHIP_TERMS_AND_CONDITIONS |
| D-12 | Membership refund policy | Full refund if cancelled within 7 days and no benefit used; no refund on monthly plans after that; yearly plans pro-rata minus the value of benefits used `[LEGAL REVIEW]` | Phase 5 | Open | FS BR-MEMBER-06 |
| D-13 | Coupon funding and commission base | 100% seller-funded; commission on post-coupon value | Phase 5 | Proposed | FS BR-COUPON-06 |
| D-14 | Pilot GMV target | After liquidity study | Phase 0 | Open | PRD |
| D-15 | Max AI cost per completed order | Set after the Phase 7 evaluation | Phase 7 | Open | PRD |
| D-16 | Admin/back-office login hardening | Email + **mandatory TOTP** + IP allow-list or step-up OTP (merged with D-27; SECURITY KIS-SEC-009) | Phase 1 | Proposed | FS BR-AUTH-04, OPSAPI_INTEGRATION |
| D-17 | Auto-approval of low-risk KYC | Off by default; admin may enable per tier | Phase 1 | Proposed | FS |
| D-18 | Open-order value cap for T1 sellers | ₹5,00,000 | Phase 2 | Proposed | FS |
| D-19 | Commission rate and who pays | **Seller-side**, deducted from the payout; illustrative 1.5% of goods value, per category, effective-dated (D-90 merged here) | Phase 6 | Open | FS, PAYMENT_AND_BUSINESS_MODEL, PROJECT_OVERVIEW |
| D-40 | Seller coupon percentage cap | 50% hard cap, no admin override in MVP | Phase 5 | Proposed | UX, COUPON_AND_MEMBERSHIP |
| D-41 | Membership brand name | **"KISAAN Plus"** — resolved by D-105 (trademark check still open, §4 item 10) | — | **Closed** (by D-105) | UX, D-105 |
| D-42 | Map view in buyer app at MVP | No (P2) | Phase 2 | Proposed | UX |
| D-60 | Max wholesale tier discount | 50% (DB CHECK constraint) | Phase 3 | Proposed | DATABASE_SCHEMA |
| D-61 | Group overfill tolerance | Commitments up to 120% of target | Phase 4 | Proposed | DATABASE_SCHEMA |
| D-70 | Transport cancellation fees | Configurable, disclosed in quote | Phase 9 | Proposed | FS BR-LOG-05 |
| D-71 | Group-leader limits | New: 2 open groups / ₹2,00,000; established: 10 / ₹20,00,000 | Phase 4 | Proposed | FS BR-GROUP-01 |
| D-72 | Group member payment timing *(updated v0.2)* | Members commit at join with **no payment**. After the leader locks the group order (approval), each member pays at the locked price within the member payment window (default 24 h, D-124). Unpaid commitments are `released`. If paid qty ≥ the seller's `group_min_paid_qty` the group is confirmed at the locked price; otherwise it enters `repricing` and the seller honours, re-offers or declines (D-132, D-95). Full refunds if the group order fails. Pre-auth / UPI block is a later option | Phase 4 (design) / Phase 6 (build) | Pending owner sign-off `[LEGAL REVIEW]` | WHOLESALE_AND_GROUP_BUYING §7, PRICING_ENGINE §8.2, FS BR-GROUP-06 |

### 1.2 Architecture & OpsAPI

| ID | Decision | Proposed default | Needed by | Status | Source |
|---|---|---|---|---|---|
| D-20 | Built-in first-party plugins in the OpsAPI image | Disable `property-deals`, `property-pa`, `ai-runner` and `opsapi-marketing` in the `kisaan` namespace | Phase 1 | Proposed | OPSAPI_INTEGRATION |
| D-21 | `PROJECT_CODE` | `ecommerce_chat,billing` | Phase 1 | Proposed | OPSAPI_INTEGRATION |
| D-22 | GST invoicing | Build in the KISAAN plugin (OpsAPI `invoices` lacks GSTIN/HSN) | Phase 6 | Proposed | OPSAPI_INTEGRATION |
| D-23 | Admin UI location | KISAAN Next.js admin plus the OpsAPI dashboard for back-office | Phase 2 | Proposed | OPSAPI_INTEGRATION |
| D-24 | Reuse OpsAPI billing plans/subscriptions for membership records | **KISAAN tables** (`kisaan_membership_plans`, `kisaan_memberships`); OpsAPI billing is Stripe/GBP-centric | Phase 5 | Proposed | OPSAPI_INTEGRATION |
| D-25 | AI assistant host | ~~Separate KISAAN AI Gateway~~ → **superseded by D-102** (AI runtime module inside `kisaan-app`). OpsAPI `chat-agent` is still not used for the marketplace AI | — | Superseded (v0.2) | SYSTEM_ARCHITECTURE |
| D-26 | Tenancy | One marketplace namespace `kisaan`, all stores inside it | Phase 1 | Proposed | OPSAPI_INTEGRATION |
| D-27 | Admin authentication | Email + 2FA (OpsAPI) in addition to phone. See D-16 | Phase 1 | Proposed | OPSAPI_INTEGRATION |
| D-28 | Direct writes to OpsAPI core tables (exhaustive list, all via one contract-tested adapter) | (a) `storeproducts` mirror fields (name, description, price, images, status, `inventory_quantity` synced from `kisaan_inventory`, the source of truth per A-06) with `track_inventory=true`; (b) `store_reviews` / `product_reviews` inserts (OpsAPI has no create API); (c) `orders` / `orderitems` creation server-side (spike S-02). Every other OpsAPI table is used through OpsAPI APIs only | Phase 2 | Proposed | OPSAPI_INTEGRATION |
| D-29 | OpsAPI payments/refunds tables | Not used. The KISAAN payment ledger is used instead | Phase 6 | Proposed | OPSAPI_INTEGRATION |
| D-30 | Pinned OpsAPI tag | `1.0.339`, re-confirmed in Phase 0 | Phase 0 | Open | OPSAPI_INTEGRATION |
| D-31 | Breaking-change escalation path with OpsAPI maintainers | Patch-release request, never fork | Phase 0 | Open | OPSAPI_INTEGRATION |
| D-32 | AI runtime language | TypeScript retained, but as the language of the single `kisaan-app` (D-102), not of a separate Gateway service | — | Superseded (v0.2) by D-102 | SYSTEM_ARCHITECTURE |
| D-33 | SMS / DLT provider | TBD | Phase 0 | Open | SYSTEM_ARCHITECTURE |
| D-34 | STT/TTS vendor(s) | Chosen on measured WER (merged with D-55) | Phase 0 spike → Phase 8 | Open | SYSTEM_ARCHITECTURE, SINGLE_AI_ARCHITECTURE |
| D-35 | LLM provider(s) | ≥ 2 providers behind the model abstraction; one tool-calling model serves the one KISAAN AI | Phase 7 | Open | SYSTEM_ARCHITECTURE |
| D-36 | Geocoding / distance provider | Pincode/LGD table + commercial distance API | Phase 2 | Open | SYSTEM_ARCHITECTURE |
| D-37 | Observability stack | Prometheus/Grafana (reuse), Loki, OTel, Sentry, LLM tracing | Phase 1 | Proposed | SYSTEM_ARCHITECTURE |

### 1.3 AI

| ID | Decision | Proposed default | Status |
|---|---|---|---|
| D-50 | AI Gateway language | → merged into D-32, now **superseded by D-102** | Superseded (v0.2) |
| D-51 | Step-up OTP threshold for high-risk approvals | Approval value ≥ ₹50,000 (SECURITY KIS-SEC-006), first deal with a new counterparty, flagged account, listing price drop > 20%, inventory removal > 50%, or a coupon ≥ 30% / unlimited-use (SINGLE_AI_ARCHITECTURE) | Proposed |
| D-52 | Price trends/forecasts | MVP: basic retrospective 7/30-day history of sourced prices with dates; P2: trend analysis/insights; no forecasts | Proposed |
| D-53 | AI transcript retention | 1 year, aligned to the DPDP Rule 8(3) log minimum (SECURITY retention schedule); audit/approvals retained per legal requirement | Proposed `[LEGAL REVIEW]` |
| D-54 | Raw voice audio retention | Delete after transcription unless the user consents (then max 30 days for quality review) | Proposed |
| D-55 | AI/STT/TTS providers | → merged into **D-34 / D-35** | Merged |
| D-56 | Per-user daily AI budget | ₹5/day free users, ₹15/day KISAAN Plus members | Open |
| D-87 | User-to-user chat retention | 2 years (SECURITY retention schedule) | Proposed `[LEGAL REVIEW]` |

### 1.4 Cross-cutting legal / compliance decisions

| ID | Decision | Proposed default | Needed by | Status |
|---|---|---|---|---|
| D-80 | **APMC gating:** whether wheat/paddy checkout is enabled in Punjab before a written legal opinion on Punjab APMC Act licence and market-fee obligations | **No.** Discovery, listings and enquiries may run; checkout for notified produce stays behind a feature flag until the opinion is received | Phase 0 → Phase 10 launch gate | Open `[LEGAL REVIEW]` |
| D-81 | Platform liability for market fee / RDF | Per legal opinion: either seller/buyer bears it, or it is collected and remitted via a licensed partner | Phase 6 | Open `[LEGAL REVIEW]` `[TAX REVIEW]` |
| D-82 | Commission GST treatment (the agri commission-agent exemption is contested) | Charge GST on commission until a CA confirms otherwise | Phase 6 | Open `[TAX REVIEW]` |
| D-83 | Minimum user age | 18+ only (avoids DPDP children's-data obligations) | Phase 1 | Proposed |
| D-84 | FSSAI licence for the platform | Apply for a Central Licence as an e-commerce FBO before food-category checkout | Phase 6 | Open `[LEGAL REVIEW]` |
| D-85 | Four-eyes threshold (second-admin approval) for refunds and manual settlement release | ₹50,000 (FS BR-ADM-02, PRD) | Phase 6 | Proposed |
| D-86 | Symmetric cancellation-fee policy (E-commerce Rules) | Platform-initiated cancellations carry equivalent compensation | Phase 6 | Open `[LEGAL REVIEW]` |

### 1.5 Payments & membership

| ID | Decision | Proposed default | Needed by | Status | Source |
|---|---|---|---|---|---|
| D-90 | Commission rates and payer | → merged into **D-19** (seller-side) | — | Merged | PAYMENT_AND_BUSINESS_MODEL |
| D-91 | Settlement hold mechanics (max PA hold; disputes extending the window) | Hold until the acceptance window (D-08) + dispute window | Phase 0 / 6 | Open | PAYMENT_AND_BUSINESS_MODEL |
| D-92 | Commission basis when platform coupons (Future) apply | — | Future | Open | PAYMENT_AND_BUSINESS_MODEL |
| D-93 | Large-ticket threshold and allowed payment methods | Steer to UPI / bank transfer above the threshold | Phase 6 | Open | PAYMENT_AND_BUSINESS_MODEL |
| D-94 | Reservation extension during PA outages | Extend TTL by the outage duration, capped | Phase 6 | Proposed | PAYMENT_AND_BUSINESS_MODEL |
| D-95 | Group order pricing when unpaid members drop out after lock *(updated v0.2)* | The locked price stands for members who paid; it is **not** recomputed. If paid qty < the seller's `group_min_paid_qty` (defaults to `group_min_qty`) the group enters `repricing` and the seller honours, re-offers or declines (D-132). The v0.1 "fall back to achieved tier and refund the difference" rule is retired | Phase 4 / 6 | Proposed (v0.2 update) | PRICING_ENGINE §8.2, PAYMENT_AND_BUSINESS_MODEL KIS-PAY-023 |
| D-96 | Priority delivery as a launch benefit | **Deferred to P2** (Phase 9 transporter marketplace); free delivery stays MVP | Phase 5 | Proposed (applied in PRD KIS-MEMBER-002) | MEMBERSHIP T&C |
| D-97 | Membership price-change mechanism | Active re-consent | Phase 5 | Proposed `[LEGAL REVIEW]` | MEMBERSHIP T&C |

### 1.6 v0.2 decisions (Master Prompt v2)

All are **Proposed — v0.2**: the team builds to them unless the product owner overrides them. The owner doc holds the normative detail.

| ID | Decision | Proposed default | Rationale | Needed by | Owner doc |
|---|---|---|---|---|---|
| D-101 | **Exactly one KISAAN AI** | One AI identity, one runtime, one reasoning loop and one conversation context per user session. Capabilities are **tool categories** (`seller`, `catalogue`, `inventory`, `pricing`, `discovery`, `market`, `matching`, `groups`, `offers`, `orders`, `payments`, `logistics`, `membership`, `coupons`, `support`, `account`), not agents. Tool classes READ / DRAFT / COMMIT; COMMIT needs a user-approved ApprovalRequest. Matching is a deterministic backend service. Trust/verification and notification work is ordinary backend jobs. The v0.1 agent codes AI-ORC … AI-SUP are retired | Prompt v2 §11 mandates a single all-rounder AI. One loop gives one coherent conversation, a simpler permission model (role-filtered tools + backend re-authorisation), fewer LLM hops (latency/cost) and simpler testing. Domain separation is still kept in code (tool categories, plugin modules) | Phase 0 (architecture sign-off); built in Phase 7 | SINGLE_AI_ARCHITECTURE |
| D-102 | **AI runtime location** | A module (`web/src/server/ai/`) inside the single KISAAN TypeScript application `kisaan-app` (Next.js UI + BFF + AI), one image with `web` and `worker` roles. No separate AI Gateway service. OpsAPI + KISAAN plugin remain the system of record | Prompt v2 §11.7 and §24: no microservice merely for scale; TypeScript/Next.js is the stated application layer. It removes a network hop and a deployable. The worker role handles long voice jobs without a new service | Phase 1 (repo/app skeleton) | SYSTEM_ARCHITECTURE |
| D-103 | **Pricing precedence incl. group discount** | Base → wholesale (best single quantity benefit; group tiers on total group qty) → **group discount** (seller-defined, group orders only) → negotiated (replaces earlier stages) → member price → one seller coupon (group-eligible coupons applied once by the leader at lock, pro-rata) → floor check → delivery (member waiver) → taxes. Quotes locked 15 min; group price locked at the leader's lock step for the member payment window (24 h default) | Prompt v2 §27 requires a formal, unambiguous stacking model that includes group discounts; seller-funded stages come before platform-funded waivers so commission and TCS bases stay clear | Phase 3 (engine) / Phase 4 (group stage) | PRICING_ENGINE |
| D-104 | **Buyer types & group roles** | Normal buyer (default sign-up); **Bulk buyer** (separate `/signup/bulk-buyer` onboarding with business profile); **Group leader** (verified, group-scoped role, mandatory "independent user, not KISAAN representative" disclaimer); **Group member** (own commitment, pays the platform's PA directly). Leaders cannot see members' contact or payment details, only status | Prompt v2 §3–4 require distinct definitions and privacy-safe leader permissions | Phase 1 (roles) / Phase 4 (groups) | WHOLESALE_AND_GROUP_BUYING, SECURITY_AND_COMPLIANCE §2.16 |
| D-105 | **Coupon & membership naming/rules** | Membership is **KISAAN Plus** (monthly, annual, trial without autopay), never "Prime". Coupon model covers every field in prompt v2 §8. Admins have emergency disable. Cancellation before dispatch voids the redemption and restores usage; a partial refund pro-rates the discount without restoring usage | Prompt v2 §8–9; avoid Amazon branding; deterministic refund behaviour | Phase 5 | COUPON_AND_MEMBERSHIP |
| D-106 | **Roadmap structure & MVP boundary** — *Pending owner sign-off* | Phases 0–10 as in prompt v2 §35. AI tool contracts are specified with each domain phase; the AI runtime lands in Phase 7; group *payment* completes in Phase 6. **MVP = Phases 0–7 + basic Hindi/Punjabi voice (Phase 8) + buyer pickup, seller delivery (`SELLER_DELIVERS`, `SELLER_DELIVERS_FEE`) and partner-arranged delivery (Phase 9 subset)**. The **open transporter marketplace** (transporter onboarding, quotes, E2E-11) is **P2, not MVP** | Matches the prompt v2 phase list while keeping a launchable MVP; avoids building two-sided logistics liquidity before the core marketplace works | Phase 0 | DEVELOPMENT_ROADMAP, PRD |
| D-106a | ~~Keep the core transporter marketplace in MVP~~ (roadmap writer's v0.2 proposal) | — | — | — | **Withdrawn** (2026-11-14 reconciliation; D-106 stands) | DEVELOPMENT_ROADMAP §2 |

### 1.7 v0.2 domain decisions

All are **Proposed — v0.2** unless the status column says otherwise. The source doc holds the normative detail.

| ID | Decision | Proposed default | Needed by | Status | Source |
|---|---|---|---|---|---|
| D-120 | GST display for taxable categories | Seller enters price excl. GST; product page shows excl. and incl.; checkout shows all-inclusive | Phase 6 | Proposed `[LEGAL REVIEW]` `[TAX REVIEW]` | PRICING_ENGINE |
| D-121 | Group delivery share at join vs at lock | The estimate shown at join is a ceiling; if the share computed at lock exceeds it, the member may withdraw without penalty or the leader may switch to buyer pickup before payment (KIS-TEST-PRC-116). Post-booking variance is handled by D-134 | Phase 4 | Proposed | PRICING_ENGINE §8.2 |
| D-122 | Coupon clawback | Clawback rule when a buyer-initiated partial cancellation breaks the coupon minimum | Phase 5 | Proposed | COUPON_AND_MEMBERSHIP §2.8, PRICING_ENGINE |
| D-123 | Store minimum order value (MOV) | Optional, seller-set, evaluated before coupons, not applied to negotiated orders | Phase 3 | Proposed | PRICING_ENGINE |
| D-124 | Member payment window after group lock | 24 h default, configurable 2–24 h (perishables use the low end, min 2 h) | Phase 4 | Proposed (aligned with D-72) | PRICING_ENGINE |
| D-125 | Member-only AI features (benefit B7) | None at launch | Phase 7 | Open | COUPON_AND_MEMBERSHIP |
| D-126 | Monthly → annual KISAAN Plus upgrade | Pro-rata credit of unused monthly days | Phase 5 | Proposed | COUPON_AND_MEMBERSHIP |
| D-127 | Coupon eligibility model | Segment set (`ALL`, `NEW_CUSTOMER`, `EXISTING_CUSTOMER`, `BULK_BUYERS`, `GROUP_ORDERS`, `MEMBERS`) plus optional user list, replacing v0.1 single `eligibility` | Phase 5 | Proposed (schema change) | COUPON_AND_MEMBERSHIP, DATABASE_SCHEMA |
| D-128 | "Total redemption limit" (prompt §8) | Implemented as a discount budget (`budget_limit`), separate from the usage-count limit | Phase 5 | Proposed | COUPON_AND_MEMBERSHIP |
| D-130 | Material inventory adjustment threshold (needs approval) | ≥ 20% of on-hand or ≥ 1,000 kg | Phase 2 | Proposed | SELLER_STORE_AND_INVENTORY |
| D-131 | Restock on post-payment, pre-dispatch cancellation | Default restock, with a 2-hour seller override | Phase 6 | Proposed | SELLER_STORE_AND_INVENTORY |
| D-132 | Group shortfall specifics (refines D-72) | Seller `group_min_paid_qty`; honour / re-offer / decline within 6 h; no response = decline; a member's unit price never increases without their re-confirmation | Phase 4 | Pending owner sign-off (with D-72) | WHOLESALE_AND_GROUP_BUYING |
| D-133 | Requirement-bound groups | Moved from P2 to **MVP** (prompt §4 needs seller offers on group requirements) | Phase 4 | Pending owner sign-off | WHOLESALE_AND_GROUP_BUYING, DEVELOPMENT_ROADMAP |
| D-134 | Group delivery via partner / platform logistics | Charge each member's estimated share + 10% buffer at confirmation; refund the unused amount after booking; the platform absorbs (and tracks) any residual shortfall. Alternative: post-delivery top-up charge | Phase 4 / Phase 9 | **PENDING OWNER SIGN-OFF** | WHOLESALE_AND_GROUP_BUYING, DEVELOPMENT_ROADMAP, TESTING E2E-15 |
| D-135 | Open RFQ limits | Normal buyer 3 open; bulk buyer 20 open | Phase 3 | Proposed | WHOLESALE_AND_GROUP_BUYING |
| D-136 | Late changes to group offers | A seller may not worsen group terms within 24 h of a group's deadline | Phase 4 | Proposed | WHOLESALE_AND_GROUP_BUYING |
| D-137 | Group allocation child orders | Created directly in `Confirmed` (payment precedes order creation) | Phase 6 | Proposed | MARKETPLACE_ARCHITECTURE |
| D-138 | Search ranking neutrality | Ranking ignores membership and coupons; quantity-aware price uses pricing stage 2 only (restates BR-SRCH-11) | Phase 2 | Proposed | MARKETPLACE_ARCHITECTURE |
| D-140 | Admin and the AI | Admin role gets no end-user AI tools in MVP; read-only admin insights are P2 in the admin console | Phase 7 | Proposed | SINGLE_AI_ARCHITECTURE |
| D-141 | Contacting another user | "Notify/contact counterparty" is COMMIT class (single-tap approval); the v0.1 "N" class is removed | Phase 7 | Proposed | SINGLE_AI_ARCHITECTURE |
| D-142 | Support tickets and human hand-off | DRAFT class (private, non-binding, addressed only to KISAAN) | Phase 7 | Proposed | SINGLE_AI_ARCHITECTURE |

## 2. Assumptions

| ID | Assumption | Impact if wrong | Validation | Source |
|---|---|---|---|---|
| A-01 | Punjabi/Hindi STT meets the **launch gate of ≤25% WER** (KIS-TEST-VOX-001) on the domain test set, with ≤20% as the pilot aspiration | Voice-first UX degrades; more text/tap fallbacks needed | Phase 0 spike, Phase 8 field test | PRD |
| A-02 | Personal data is hosted in India | Hosting choice changes | Legal opinion on DPDP cross-border rules | PRD |
| A-03 | Pilot metric targets are indicative and reviewed after 90 days | — | Pilot review | PRD |
| A-04 | The PA supports split transfers with on-hold/release | Settlement design changes; possible escrow partner | PA confirmation in Phase 0 (research indicates Razorpay Route supports holds) | FS |
| A-05 | Weighbridge slips are commonly available for grain lots; a buyer weighing photo is an acceptable fallback | Weight disputes harder to resolve | Pilot interviews | FS |
| A-06 | `kisaan_inventory` is the source of truth; OpsAPI stock is a synced value | Overselling risk | Concurrency tests | SELLER_STORE_AND_INVENTORY, OPSAPI_INTEGRATION (D-28) |
| A-10 | Core team of ~6–8 engineers | Roadmap durations change | Staffing plan | Roadmap |
| A-11 | ≥85% voice-listing task success is achievable in the field | Launch gate slips | Phase 8 field test | Roadmap |
| A-12 | LGD (Local Government Directory) codes are used as the geography master | Geo model changes | Phase 2 | DATABASE_SCHEMA |
| A-13 | Transporters can be verified via RC/driving licence documents | Weaker transporter trust | Phase 0 legal/ops check | PROJECT_OVERVIEW |
| A-14 | Production domains `kisaan.in`, `api.kisaan.in` are placeholders (the v0.1 `ai.kisaan.in` host is no longer needed after D-102) | Rebranding of URLs | Phase 1 | API_SPECIFICATION |
| A-30 | KISAAN never falls more than ~60 OpsAPI releases behind | Large risky upgrades | Monthly upgrade cadence | OPSAPI_INTEGRATION |
| A-31 | `pgvector` can be enabled on the managed Postgres (same as A-50) | A separate vector store is needed | Phase 0 infra check | SYSTEM_ARCHITECTURE |
| A-32 | Hosting is in an India region | Latency / residency | Infra decision | SYSTEM_ARCHITECTURE |
| A-33 | Pilot scale ≤10k MAU, ≤1k orders/day | Capacity plan changes | Pilot | SYSTEM_ARCHITECTURE |
| A-40 | A Radix/shadcn-style component library is acceptable | UI rework | Phase 1 | UX |
| A-41 | Per-script font subsets ≤60 KB | Page weight | Phase 1 | UX |
| A-42 | Page-weight budgets (≤300 KB first load) are achievable | Low-bandwidth UX | Phase 2 perf tests | UX |
| A-43 | Most target farmers use Android ≥2 GB RAM with Chrome-based browsers | The PWA approach may need a native/lite app | Phase 0 field survey | UX |
| A-50 | = A-31 (pgvector) | — | — | AI |
| A-51 | Family-shared phones are common; MVP enforces one number = one account (KIS-SEC-011); a profile picker is a P2 option | Onboarding friction for families | Pilot | SECURITY |
| A-52 | AI evaluation targets are realistic | Launch gate slips | Phase 7 eval | SINGLE_AI_ARCHITECTURE |
| A-90 | Razorpay Route supports on-hold transfers long enough for the delivery + acceptance window `[UNVERIFIED]` | Settlement redesign | PA confirmation, Phase 0 | PAYMENT |
| A-91 | The PA supports UPI AutoPay on the same merchant account as Route `[UNVERIFIED]` | A second PA is needed for membership | Phase 0 | PAYMENT |
| A-92 | Income-tax TDS on e-commerce may apply to farmer sales; PAN can be collected for most sellers `[TAX REVIEW]` | Onboarding friction | CA opinion | PAYMENT |
| A-93 | Membership is buyer-only at launch | Seller benefits are designed later | Phase 5 | MEMBERSHIP T&C |
| A-101 | One tool-calling LLM can pick the right tool from a **role-filtered** set (target ≤ ~30 tools exposed per role per turn) with ≥ 95% tool-selection accuracy and ≥ 98% schema-valid arguments on the KISAAN eval set | Need tool-category pre-selection inside the same loop, or a stronger model (cost) | Phase 0 prototype eval; Phase 7 gate | SINGLE_AI_ARCHITECTURE |
| A-102 | Next.js route handlers in `kisaan-app` can sustain pilot AI SSE concurrency (≈ 500 concurrent streams on 2–3 web replicas) without hurting page-render latency | Enable the worker role earlier or scale web replicas by open-stream count | Phase 7 load test | SYSTEM_ARCHITECTURE |
| A-103 | Sellers want to offer a group-buy discount on top of tier pricing, and accept that it is seller-funded | The group discount stage stays unused; groups rely on tiers only | Phase 0 seller interviews | PRICING_ENGINE |
| A-104 | Bulk buyers (traders, processors, retailers) will complete a separate onboarding with business details (type, volumes, frequency, areas, budget) | Fewer qualified bulk buyers; shorten the form and move fields to progressive profiling | Phase 0 interviews; Phase 3 funnel metrics | WHOLESALE_AND_GROUP_BUYING |
| A-105 | The PA can link several member payments to one consolidated seller order and settle it as one transfer (or one per member line) `[UNVERIFIED]` | Group settlement design changes | PA confirmation, Phase 0 | PAYMENT_AND_BUSINESS_MODEL |
| A-106 | Group members will pay within a 24 h window after the leader locks the group order | Higher drop-out → tier fallback (D-95) more often | Pilot data | WHOLESALE_AND_GROUP_BUYING |
| A-107 | The OpsAPI **project-plugin mechanism** (routes, RBAC modules, migrations, jobs, outbox) is sufficient as KISAAN's "dynamic API" mechanism; no runtime-generated endpoints are needed | Some KISAAN APIs may need another supported OpsAPI extension point, never an OpsAPI source change | Phase 0 plugin spike (with R-31) | OPSAPI_INTEGRATION |
| A-120 | Sellers accept that tier, group and member prices are validated against their floor price at save time | Publishing friction; more support | Phase 3 seller testing | PRICING_ENGINE |
| A-121 | A 15-minute checkout price lock is long enough for UPI on rural networks | Abandonment at lock expiry | Pilot (abandonment at expiry) | PRICING_ENGINE |
| A-122 | The payment provider can issue a retry debit within the 3-day membership grace period with a compliant pre-debit notice `[UNVERIFIED]` | Grace-period design changes | PA confirmation, Phase 0 | COUPON_AND_MEMBERSHIP |
| A-130 | One inventory row per listing is enough throughput at MVP scale (no stock sharding) | Hot-row contention on popular listings | Phase 2 concurrency/perf tests | SELLER_STORE_AND_INVENTORY |
| A-131 | Rural group members will complete payment within a 24 h window (UPI availability) (same premise as A-106) | More `repricing` events (R-130) | Pilot data | WHOLESALE_AND_GROUP_BUYING |
| A-140 | Native tool calling of the selected primary and fallback models handles the role/channel/task-filtered tool set per turn with ≥ 0.95 selection accuracy (see §5 note on the tool-count figure) | Tighter filtering or stronger model needed | Phase 7 benchmark | SINGLE_AI_ARCHITECTURE |

## 3. Business risks and mitigations

Likelihood (L) and Impact (I) are rated H/M/L.

| ID | Risk | L | I | Mitigation | Owner / docs |
|---|---|---|---|---|---|
| R-01 | **Farmer onboarding:** low digital literacy, distrust of apps | H | H | Voice-first Punjabi flows; assisted onboarding by field staff / FPO partners; WhatsApp entry point; a working listing in <3 min; local-language video help | PRD, UX, SINGLE_AI_ARCHITECTURE |
| R-02 | **User trust** in a new platform | H | H | Verification badges, public stores with ratings, licensed PA payments with settlement after delivery, transparent fees, grievance officer, visible human support | FS, PAYMENT, SECURITY |
| R-03 | **Product quality verification** (photos can mislead; AI does not certify) | H | H | Category grading attributes; weighbridge slips; buyer acceptance window; P2 quality inspectors / assayer partners; disputes with evidence; AI never certifies quality | FS (DSP), SINGLE_AI_ARCHITECTURE |
| R-04 | **Price fluctuations** between acceptance and delivery | M | M | Short offer validity and payment deadlines (D-05, D-07); price locked at acceptance; sourced, dated mandi references only | FS, PRICING_ENGINE, `market` tools |
| R-05 | **Buyer–seller disputes** (weight, quality, delay) | M | H | Evidence-based dispute flow, settlement holds, SLAs, reputation impact, inspector escalation (P2) | FS DSP, PAYMENT |
| R-06 | **Logistics reliability:** transporter no-shows, delays | M | H | Reliability scores and suspension (BR-LOG-05); multiple quotes; backup transporter; seller-arranged fallback; POD via OTP/photo | FS LOG, `logistics` tools |
| R-07 | **Payment failures** / webhook loss | M | H | Idempotent webhooks plus server-side verification; daily reconciliation; inventory released on failure; retry UX | PAYMENT, TESTING |
| R-08 | **Fake listings** and bait pricing | M | H | KYC tiers, duplicate-listing detection (backend risk rules), price-band moderation, value caps for new sellers (D-18), reports | FS, SECURITY §2.8 |
| R-09 | **Fraud:** fake group leaders, payment fraud, account takeover | M | H | Leaders never collect money (MVP); leader KYC, limits (D-71) and ratings; OTP step-up (D-51); risk signals escalated to humans (scores are not proof) | WHOLESALE_AND_GROUP_BUYING, SECURITY |
| R-10 | **Regional-language accuracy** (dialects, code-mixing, noise) | H | M | Vendor bake-off on field audio (D-34); domain vocabulary; read-back confirmation; tap fallback | SINGLE_AI_ARCHITECTURE, TESTING |
| R-11 | **AI hallucinations** (prices, stock, terms, completed actions) | M | H | Tool-grounded answers only; prices only from `pricing.get_quote` and sourced data with dates; "completed" claimed only after a backend-confirmed result; approval gates on every COMMIT action; eval suites; refusal when data is missing | SINGLE_AI_ARCHITECTURE, TESTING |
| R-12 | **Market data availability/quality:** Agmarknet lags 2–3 days; some mandis don't report | H | M | Show source and date; staleness labels; multi-mandi comparison; never extrapolate | `market` module, COMPETITOR_ANALYSIS |
| R-13 | **Regulatory: Punjab APMC** licence/market fee for trade outside mandis | **H** | **H** | Written legal opinion before enabling wheat/paddy checkout (D-80); start with discovery and non-notified/perishable categories if advised; licensed-partner model as a fallback | SECURITY_AND_COMPLIANCE |
| R-14 | Regulatory: PA/escrow (the platform must not hold funds) | M | H | Licensed PA marketplace split only; no leader collection (MVP) | PAYMENT |
| R-15 | Regulatory: DPDP obligations (main duties from ~May 2027) | M | H | Privacy by design now: consent records, notices, retention schedule, breach runbook | SECURITY_AND_COMPLIANCE |
| R-16 | Consumer protection / dark patterns (membership auto-renew, coupon timers) | M | M | One-tap cancel, pre-debit notices, real timers only, full price breakup | MEMBERSHIP T&C, UX |
| R-17 | **Marketplace liquidity** (cold start: no buyers → no farmers) | H | H | Concentrated pilot geography (D-01, a few Punjab districts); onboard anchor bulk buyers (processors/wholesalers) first; buyer requirements to pull supply; group buying to aggregate small buyers | PRD, ROADMAP |
| R-18 | AI operating cost overrun | M | M | Per-user budgets (D-56), role-filtered tool lists (smaller prompts), caching of safe READ results, bounded tool calls per turn, cost per order KPI (D-15) | SINGLE_AI_ARCHITECTURE |
| R-19 | WhatsApp policy changes (pricing, AI-bot restrictions) | M | M | Task-scoped marketplace assistant; PWA as the primary channel; INR billing migration before 31 Dec 2026 | SINGLE_AI_ARCHITECTURE, COMPETITOR_ANALYSIS |
| R-20 | Competitor response (well-funded agritech players) | M | M | Differentiate on voice/AI-first Punjabi UX, group buying, seller stores and the trust layer; stay asset-light | COMPETITOR_ANALYSIS |
| R-30 | OpsAPI `notifications` table clash between the ecommerce preset and core | M | M | See OPSAPI_INTEGRATION mitigation; KISAAN notifications use their own tables / the core API only | OPSAPI_INTEGRATION |
| R-31 | **Phone-OTP session issuance** relies on an OpsAPI helper outside the plugin SDK (no compatibility promise) | M | **H** | Phase 0 spike; contract test pinned to the tag; request an SDK hook from OpsAPI maintainers | OPSAPI_INTEGRATION |
| R-32 | OpsAPI upgrades break core routes KISAAN uses (only the SDK is compatibility-guaranteed) | M | M | Pin an immutable tag (D-30); contract tests; monthly upgrade cadence (A-30) | OPSAPI_INTEGRATION |
| R-90 | APMC market fee + RDF (~6% on wheat/paddy) may apply to on-platform trades, changing landed cost (≈ ₹14k on the 100-qtl example) | M | H | See R-13 / D-80 / D-81 | PAYMENT, SECURITY_AND_COMPLIANCE |
| R-91 | PA card fees exceed commission on low-margin grain orders | M | M | Steer to UPI; surcharge or minimum fee per D-93 | PAYMENT |
| R-92 | Free-delivery benefit abused or under-priced vs bulk logistics cost | M | M | Per-order and monthly caps; fair-use clause; monitor cost per member | PAYMENT, MEMBERSHIP T&C |
| R-101 | **Single-AI tool sprawl / context overload:** one AI with ~100 tools across all roles degrades tool selection, inflates prompts (latency, cost) and makes behaviour harder to test | M | H | Expose only the active role's tools per turn (A-101); short, linted tool descriptions; a tool-count budget per role; tool-selection accuracy in the eval gate; bounded context (summaries of older turns); new tools need an eval case before enabling | SINGLE_AI_ARCHITECTURE, TESTING |
| R-102 | **Larger blast radius of prompt injection** in one AI that holds many tool categories (e.g. a malicious group description or listing text steering a buyer's AI) | M | H | Untrusted-content isolation (KIS-SEC-093); role-filtered tools; delegated user token + backend re-authorisation; every COMMIT needs the user's approval in their own client; red-team suite blocks releases (KIS-SEC-099) | SECURITY_AND_COMPLIANCE §2.9 |
| R-103 | **AI runtime as a single point of failure** (LLM/STT provider outage, runtime bug) | M | M | Two LLM providers with fallback; conventional UI for every workflow (AI is never mandatory); kill switch per tool (KIS-SEC-141); AI availability target separate from core (KIS-NFR-021) | SYSTEM_ARCHITECTURE |
| R-104 | **Group coupon / group discount abuse:** a leader creates sham groups or fake members (multiple phones) to harvest group-eligible coupons and group discounts, possibly colluding with a seller to inflate GMV or fake reviews | M | M | A group coupon counts as one redemption against the coupon's total and the leader (and against each member's per-user limit only when the coupon sets `count_per_member`); members need ≥ T0 verified phones with device/bank linkage checks; minimum distinct verified members for group discounts; per-group coupon cap; reviews only from completed member orders; risk flags → human review | COUPON_AND_MEMBERSHIP, SECURITY KIS-SEC-079/080/155 |
| R-105 | **Group member drop-out after lock** pushes the group below a tier or the seller's minimum group qty | H | M | Member payment window (24 h); overfill tolerance (D-61); locked price stands for payers and a shortfall below `group_min_paid_qty` goes to seller honour / re-offer / decline (D-95, D-132); reliability strikes (R-130); transparent "remaining qty" | WHOLESALE_AND_GROUP_BUYING, PRICING_ENGINE |
| R-106 | **Leader misrepresentation** as a KISAAN official or agent | M | M | Mandatory disclaimer in UI/AI/notifications (KIS-SEC-153); badge rules; member reporting; leader suspension by a human with appeal | WHOLESALE_AND_GROUP_BUYING |
| R-107 | **Approval fatigue:** users approve AI-prepared actions without reading | M | H | Concise cards with amount/quantity/counterparty highlighted, voice read-back, step-up OTP above the threshold (D-51), no bundling of multiple COMMITs into one approval, cancellation windows where the law/product allows | SINGLE_AI_ARCHITECTURE, UX |
| R-108 | **Pricing complexity** (tiers + group discount + member price + coupon + waiver) confuses users or causes disputes | M | M | Full line-by-line breakup on every quote, invoice and approval card; published worked examples; golden test vectors for every stacking combination | PRICING_ENGINE, TESTING |
| R-109 | **Bulk-buyer identity fraud:** fake business profiles to access whole-lot offers or bulk pricing and then default | M | M | Optional GSTIN/PAN verification with badge; T3 required above D-02; prepaid orders only in MVP; order-value caps for new bulk buyers | WHOLESALE_AND_GROUP_BUYING, SECURITY KIS-SEC-075 |
| R-110 | **Shared-pod contention:** long AI/voice streams on the same `kisaan-app` pods as page rendering degrade UI latency | M | M | Scale web replicas on open-stream count; move long STT/TTS jobs to the worker role; per-turn timeouts; separate HPA metrics (A-102) | SYSTEM_ARCHITECTURE |
| R-111 | **Documentation drift after the v0.1 → v0.2 revision:** residual multi-agent references or old phase numbers mislead developers | M | M | Cross-document consistency review; the traceability matrix marks retired IDs; v0.1 kept only in `_archive/` | REQUIREMENTS_TRACEABILITY, README |
| R-112 | **Membership benefit cost on group orders:** free-delivery waivers applied per member on consolidated deliveries | L | M | Waiver applies only to the member's pro-rata share of the consolidated delivery fee, within caps (D-103) | PRICING_ENGINE, COUPON_AND_MEMBERSHIP |
| R-120 | **Seller regret on stacked discounts:** tier + group + coupon combine to a unit price the seller didn't intend | M | M | Combined-effect preview with worst-case unit price before publish; floor price check | PRICING_ENGINE |
| R-121 | **Preview drift:** client preview library diverges from the server engine and shows wrong numbers | M | M | Shared golden vectors in CI; server quote always authoritative | PRICING_ENGINE |
| R-122 | **Plus free-delivery value and cost** *(rewritten v0.2)*: in MVP the B1 benefit waives the seller's delivery fee (`SELLER_DELIVERS_FEE`), funded by the platform. Members in districts with few delivering sellers see little value; platform-funded waivers invite seller fee inflation. Changes the T&C benefit text `[LEGAL REVIEW]` | M | M | Show which sellers deliver; cap the waiver; flag seller delivery-fee increases after members order | COUPON_AND_MEMBERSHIP, PRICING_ENGINE, MEMBERSHIP T&C |
| R-123 | **Coupon misconfiguration** causes large unintended discounts | M | M | Liability preview, `budget_limit`, confirmation read-back, 50% cap (D-40), admin emergency disable | COUPON_AND_MEMBERSHIP |
| R-130 | **Commit-then-pay drop-outs:** no payment at join increases no-pay drop-outs vs capture-at-join | M | M | `group_min_paid_qty`; reliability strikes; capture-at-commit for repeat offenders | WHOLESALE_AND_GROUP_BUYING |
| R-131 | **Delivery cost exposure** from the platform absorbing group delivery shortfalls (D-134) | M | M | 10% buffer; tracked shortfall metric; revisit after pilot | WHOLESALE_AND_GROUP_BUYING |
| R-140 | **Tool-selection accuracy** degrades as the catalogue grows (113 tools) | M | H | Role/channel/task filtering; clear descriptions; eval gate (see R-101) | SINGLE_AI_ARCHITECTURE |

## 4. Unknowns (research still needed)

1. The live status and terms of the data.gov.in mandi price API key `[UNVERIFIED]`.
2. Punjab private e-trading licence details and fee `[UNVERIFIED]` `[LEGAL REVIEW]`.
3. Final DPDP commencement date after any amendment to the 18-month window `[LEGAL REVIEW]`.
4. Exact India WhatsApp per-message rates `[UNVERIFIED]`.
5. PA marketplace product terms for agri sellers without GSTIN (payout KYC) `[UNVERIFIED]`.
6. STT accuracy on rural Punjabi speech (only vendor availability is verified).
7. Whether OpsAPI's voice module handles Indic languages `[UNVERIFIED]`.
8. Tool-selection accuracy of candidate LLMs on a role-filtered KISAAN tool set in code-mixed Punjabi/Hindi (A-101).
9. PA support for linking several member payments to one consolidated group order (A-105) `[UNVERIFIED]`.
10. Trademark availability of "KISAAN Plus" (D-41/D-105) `[LEGAL REVIEW]`.

## 5. Cross-document conflicts found in the v0.2 register check (2026-11-14)

The register text above is canonical. **All conflicts below were resolved in the v0.2 final pass (2026-11-14)**; the table is kept as an audit trail. Resolutions: D-124 range = 2–24 h; D-53 = 1 year in SINGLE_AI; D-51 triggers merged into the register row; D-55 marked merged in SINGLE_AI; D-40 hard cap in UX; A-140 tool budget aligned to A-101 (≤ ~30 per turn); WHOLESALE D-72 row includes honour.

| ID | Conflict | Register position |
|---|---|---|
| see D-124 | PRICING_ENGINE gives the configurable member payment window as 4–48 h (perishables 4 h); FUNCTIONAL_SPECIFICATION and WHOLESALE_AND_GROUP_BUYING give 2–24 h | Default 24 h is agreed; Resolved: 2–24 h |
| see D-53 | Register: AI transcripts retained 1 year (DPDP Rule 8(3) log minimum). SINGLE_AI_ARCHITECTURE: 180 days | Register value (1 year) stands pending legal review |
| see D-51 | SINGLE_AI_ARCHITECTURE adds extra step-up triggers (listing price drop > 20%, inventory removal > 50%, coupon ≥ 30% or unlimited) not in the register | Treat as proposed additions; consolidate in SECURITY_AND_COMPLIANCE |
| see D-55 | Register: merged into D-34/D-35. SINGLE_AI_ARCHITECTURE lists it as Open | Use D-34 (STT/TTS) and D-35 (LLM) |
| see D-40 | Register: 50% hard cap, no admin override (KIS-SEC-161). UX: "without admin approval (proposal 50%)" | Hard cap, no override |
| see A-101 / A-140 | A-101 targets ≤ ~30 tools exposed per role per turn; A-140 assumes ~40–60 tools per filtered turn | Both are Phase 7 benchmark assumptions; Resolved: ≤ ~30 tools per turn; eval confirms |
| see D-72 | WHOLESALE_AND_GROUP_BUYING's D-72 row says a short group is "cancelled or re-offered" (omits *honour*) | Honour / re-offer / decline (D-132) |
| see D-121 / D-134 | Not a conflict: D-121 covers estimate-at-join vs share-at-lock; D-134 covers charged-at-confirmation vs actual-after-booking | Both stand |
