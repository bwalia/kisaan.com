# KISAAN — Risks, Assumptions & Decisions Required

> Status: Draft v0.1 · Last updated: 2026-11-14 · Owner: KISAAN product & architecture · Source of truth index: [README](README.md)

This is the **single consolidated register** of business risks, assumptions and open decisions across all KISAAN documents. Other documents tag items inline as `[DECISION D-nn]`, `[ASSUMPTION A-nn]` and `[RISK R-nn]`; the canonical text lives here. IDs are not contiguous: ID ranges were allocated per document (D-01..D-19 product, D-20..D-37 architecture/opsapi, D-40..D-42 UX, D-60..D-61 data model, D-50..D-56 AI, D-70..D-72 functional, D-80..D-87 cross-cutting/legal, D-90..D-97 payments & membership).

## 1. Decisions required (owner confirmation needed)

Status: **Proposed** = documented default the team will build to unless overridden; **Open** = must be answered before the stated phase.

### 1.1 Product & business

| ID | Decision | Proposed default | Needed by | Status | Source |
|---|---|---|---|---|---|
| D-01 | MVP categories | Wheat, Rice/Paddy, Maize, Pulses, potato, onion, kinnow. Agri-inputs are Future | Phase 0 | Proposed | PRD, PROJECT_OVERVIEW |
| D-02 | Buyer order-value threshold requiring business (T3) verification | ₹2,00,000 per order | Phase 1 | Proposed | FUNCTIONAL_SPECIFICATION BR-ONB-10 |
| D-03 | Listing expiry | 30 days (non-perishable), 7 days (perishable) | Phase 2 | Proposed | FS BR-LST-03 |
| D-04 | Buyer anonymity in public RFQs | Show buyer type, district and badge until a quotation is accepted | Phase 3 | Proposed | FS BR-ENQ-04 |
| D-05 | Offer validity | 24 h / 6 h perishable (range 1–72 h) | Phase 3 | Proposed | FS BR-OFR-03 |
| D-06 | Seller auto-counter rules (P2) | Never auto-accept | P2 | Proposed | FS BR-OFR-16 |
| D-07 | Payment deadline after acceptance | 24 h / 4 h perishable | Phase 4 | Proposed | FS |
| D-08 | Buyer acceptance window after delivery | 48 h / 12 h perishable, then auto-complete | Phase 4 | Proposed | FS BR-ORD-05 |
| D-09 | Payment aggregator | Razorpay Route primary, Cashfree Easy Split alternative, behind an adapter | **Phase 0** (onboarding lead time) | Open | FS BR-PAY-01, PAYMENT_AND_BUSINESS_MODEL |
| D-10 | Group-leader incentive model | KYC'd fee per completed group order, with TDS. The leader never collects member money | Phase 3 | Open | PRD, PAYMENT_AND_BUSINESS_MODEL |
| D-11 | Membership pricing and trial | ₹199/month, ₹1,999/year incl. GST, 30-day trial without mandatory autopay | Phase 4 | Open | FS, MEMBERSHIP_TERMS_AND_CONDITIONS |
| D-12 | Membership refund policy | Full refund if cancelled within 7 days and no benefit used; no refund on monthly plans after that; yearly plans pro-rata minus the value of benefits used `[LEGAL REVIEW]` | Phase 4 | Open | FS BR-MEM-06 |
| D-13 | Coupon funding and commission base | 100% seller-funded; commission on post-coupon value | Phase 4 | Proposed | FS BR-CPN-06 |
| D-14 | Pilot GMV target | After liquidity study | Phase 0 | Open | PRD |
| D-15 | Max AI cost per completed order | Set after Phase 5 eval | Phase 5 | Open | PRD |
| D-16 | Admin/back-office login hardening | Email + **mandatory TOTP** + IP allow-list or step-up OTP (merged with D-27; SECURITY SEC-009) | Phase 1 | Proposed | FS BR-AUTH-04, OPSAPI_INTEGRATION |
| D-17 | Auto-approval of low-risk KYC | Off by default; admin may enable per tier | Phase 1 | Proposed | FS |
| D-18 | Open-order value cap for T1 sellers | ₹5,00,000 | Phase 2 | Proposed | FS |
| D-19 | Commission rate and who pays | **Seller-side**, deducted from the payout; illustrative 1.5% of goods value, per category, effective-dated (D-90 merged here) | Phase 4 | Open | FS, PAYMENT_AND_BUSINESS_MODEL, PROJECT_OVERVIEW |
| D-41 | Membership brand name | Placeholder "KISAAN Plus" | Phase 4 | Open | UX |
| D-42 | Map view in buyer app at MVP | No (P2) | Phase 2 | Proposed | UX |
| D-40 | Seller coupon percentage cap | 50% hard cap, no admin override in MVP | Phase 4 | Proposed | UX, FS BR-CPN |
| D-70 | Transport cancellation fees | Configurable, disclosed in quote | Phase 7 | Proposed | FS BR-LOG-05 |
| D-71 | Group-leader limits | New: 2 open groups / ₹2,00,000; established: 10 / ₹20,00,000 | Phase 3 | Proposed | FS BR-GRP-01 |
| D-60 | Max wholesale tier discount | 50% (DB CHECK constraint) | Phase 2 | Proposed | DATABASE_SCHEMA |
| D-61 | Group overfill tolerance | Commitments up to 120% of target | Phase 3 | Proposed | DATABASE_SCHEMA |
| D-72 | Group member payment timing | Capture at join + auto-refund; evaluate pre-auth / UPI block | Phase 4 | Open `[LEGAL REVIEW]` | FS BR-GRP-06 |

### 1.2 Architecture & opsapi

| ID | Decision | Proposed default | Needed by | Status | Source |
|---|---|---|---|---|---|
| D-20 | Built-in first-party plugins in the opsapi image | Disable `property-deals`, `property-pa`, `ai-runner` and `opsapi-marketing` in the `kisaan` namespace | Phase 1 | Proposed | OPSAPI_INTEGRATION |
| D-21 | `PROJECT_CODE` | `ecommerce_chat,billing` | Phase 1 | Proposed | OPSAPI_INTEGRATION |
| D-22 | GST invoicing | Build in the Kisaan plugin (opsapi `invoices` lacks GSTIN/HSN) | Phase 4 | Proposed | OPSAPI_INTEGRATION |
| D-23 | Admin UI location | Kisaan Next.js admin plus opsapi dashboard for back-office | Phase 2 | Proposed | OPSAPI_INTEGRATION |
| D-24 | Reuse opsapi billing plans/subscriptions for membership records | **Kisaan tables** (`kisaan_membership_plans`, `kisaan_memberships`); opsapi billing is Stripe/GBP-centric | Phase 4 | Proposed | OPSAPI_INTEGRATION |
| D-25 | AI assistant host | Separate Kisaan AI Gateway, not opsapi `chat-agent` | Phase 5 | Proposed | OPSAPI_INTEGRATION |
| D-26 | Tenancy | One marketplace namespace `kisaan`, all stores inside it | Phase 1 | Proposed | OPSAPI_INTEGRATION |
| D-27 | Admin authentication | Email + 2FA (opsapi) in addition to phone. See D-16 | Phase 1 | Proposed | OPSAPI_INTEGRATION |
| D-28 | Direct writes to opsapi core tables (exhaustive list, all via one contract-tested adapter) | (a) `storeproducts` mirror fields (name, description, price, images, status, `inventory_quantity` synced from `kisaan_inventory`, the source of truth per A-06) with `track_inventory=true`; (b) `store_reviews` / `product_reviews` inserts (opsapi has no create API); (c) `orders` / `orderitems` creation server-side (spike S-02). Every other opsapi table is used through opsapi APIs only | Phase 2 | Proposed | OPSAPI_INTEGRATION |
| D-29 | opsapi payments/refunds tables | Not used. Kisaan payment ledger is used instead | Phase 4 | Proposed | OPSAPI_INTEGRATION |
| D-30 | Pinned opsapi tag | `1.0.339`, re-confirmed in Phase 0 | Phase 0 | Open | OPSAPI_INTEGRATION |
| D-31 | Breaking-change escalation path with opsapi maintainers | Patch-release request, never fork | Phase 0 | Open | OPSAPI_INTEGRATION |
| D-32 | AI Gateway runtime | TypeScript/Node (merged with D-50) | Phase 0 | Proposed | SYSTEM_ARCHITECTURE |
| D-33 | SMS / DLT provider | TBD | Phase 0 | Open | SYSTEM_ARCHITECTURE |
| D-34 | STT/TTS vendor(s) | Chosen on measured WER (merged with D-55) | Phase 0 spike → Phase 6 | Open | SYSTEM_ARCHITECTURE, AI |
| D-35 | LLM provider(s) | ≥2 providers behind abstraction | Phase 5 | Open | SYSTEM_ARCHITECTURE |
| D-36 | Geocoding / distance provider | Pincode/LGD table + commercial distance API | Phase 2 | Open | SYSTEM_ARCHITECTURE |
| D-37 | Observability stack | Prometheus/Grafana (reuse), Loki, OTel, Sentry, LLM tracing | Phase 1 | Proposed | SYSTEM_ARCHITECTURE |

### 1.3 AI

| ID | Decision | Proposed default | Status |
|---|---|---|---|
| D-50 | AI Gateway language | → merged into **D-32** | Merged |
| D-51 | Step-up OTP threshold for high-risk approvals | Approval value ≥ ₹50,000 (SECURITY SEC-006), first deal with a new counterparty, or flagged account | Proposed |
| D-52 | Price trends/forecasts | MVP: basic retrospective 7/30-day history of sourced prices with dates; P2: trend analysis/insights; no forecasts | Proposed |
| D-53 | AI transcript retention | 1 year, aligned to the DPDP Rule 8(3) log minimum (SECURITY retention schedule); audit/approvals retained per legal requirement | Proposed `[LEGAL REVIEW]` |
| D-87 | User-to-user chat retention | 2 years (SECURITY retention schedule) | Proposed `[LEGAL REVIEW]` |
| D-54 | Raw voice audio retention | Delete after transcription unless the user consents (then max 30 days for quality review) | Proposed |
| D-55 | AI/STT/TTS providers | → merged into **D-34 / D-35** | Merged |
| D-56 | Per-user daily AI budget | ₹5/day free users, ₹15/day members | Open |

### 1.4 Cross-cutting legal / compliance decisions

| ID | Decision | Proposed default | Needed by | Status |
|---|---|---|---|---|
| D-80 | **APMC gating:** whether wheat/paddy checkout is enabled in Punjab before a written legal opinion on the Punjab APMC Act licence and market-fee obligations | **No.** Discovery, listings and enquiries may run; checkout for notified produce stays behind a feature flag until the opinion is received | Phase 0 → Phase 8 gate | Open `[LEGAL REVIEW]` |
| D-81 | Platform liability for market fee / RDF | Per legal opinion: either seller/buyer bears it, or it is collected and remitted via a licensed partner | Phase 4 | Open `[LEGAL REVIEW]` `[TAX REVIEW]` |
| D-82 | Commission GST treatment (agri commission-agent exemption is contested) | Charge GST on commission until a CA confirms otherwise | Phase 4 | Open `[TAX REVIEW]` |
| D-83 | Minimum user age | 18+ only (avoids DPDP children's-data obligations) | Phase 1 | Proposed |
| D-84 | FSSAI licence for the platform | Apply for a Central Licence as an e-commerce FBO before food-category checkout | Phase 4 | Open `[LEGAL REVIEW]` |
| D-85 | Four-eyes threshold (second-admin approval) for refunds and manual settlement release | ₹50,000 (FS BR-ADM-02, PRD) | Phase 4 | Proposed |
| D-86 | Symmetric cancellation-fee policy (E-commerce Rules) | Platform-initiated cancellations carry equivalent compensation | Phase 4 | Open `[LEGAL REVIEW]` |

### 1.5 Payments & membership

| ID | Decision | Proposed default | Needed by | Status | Source |
|---|---|---|---|---|---|
| D-90 | Commission rates and payer | → merged into **D-19** (seller-side) | — | Merged | PAYMENT_AND_BUSINESS_MODEL |
| D-91 | Settlement hold mechanics (max PA hold; disputes extending the window) | Hold until acceptance window (D-08) + dispute window | Phase 0/4 | Open | PAYMENT_AND_BUSINESS_MODEL |
| D-92 | Commission basis when platform coupons (Future) apply | — | Future | Open | PAYMENT_AND_BUSINESS_MODEL |
| D-93 | Large-ticket threshold and allowed payment methods | Steer to UPI / bank transfer above threshold | Phase 4 | Open | PAYMENT_AND_BUSINESS_MODEL |
| D-94 | Reservation extension during PA outages | Extend TTL by outage duration, capped | Phase 4 | Proposed | PAYMENT_AND_BUSINESS_MODEL |
| D-95 | Group order pricing when unpaid members drop qty below a tier | Fall back to the achieved tier; members are notified and refunded the difference | Phase 4 | Open | PAYMENT_AND_BUSINESS_MODEL |
| D-96 | Priority delivery as a launch benefit | **Deferred to P2** (Phase 7 transporter marketplace); free delivery stays MVP | Phase 4 | Proposed (applied in PRD MEM-002) | MEMBERSHIP T&C |
| D-97 | Membership price-change mechanism | Active re-consent | Phase 4 | Proposed `[LEGAL REVIEW]` | MEMBERSHIP T&C |

## 2. Assumptions

| ID | Assumption | Impact if wrong | Validation | Source |
|---|---|---|---|---|
| A-01 | Punjabi/Hindi STT meets the **launch gate of ≤25% WER** (TC-VOX-001) on the domain test set, with ≤20% as the pilot aspiration | Voice-first UX degrades; more text/tap fallbacks needed | Phase 0 spike, Phase 6 field test | PRD |
| A-02 | Personal data is hosted in India | Hosting choice changes | Legal opinion on DPDP cross-border rules | PRD |
| A-03 | Pilot metric targets are indicative and reviewed after 90 days | — | Pilot review | PRD |
| A-04 | The PA supports split transfers with on-hold/release | Settlement design changes; possible escrow partner | PA confirmation in Phase 0 (research indicates Razorpay Route supports holds) | FS |
| A-05 | Weighbridge slips are commonly available for grain lots; a buyer weighing photo is an acceptable fallback | Weight disputes harder to resolve | Pilot interviews | FS |
| A-06 | `kisaan_inventory` is the source of truth; opsapi stock is a synced value | Overselling risk | Concurrency tests | FS, OPSAPI_INTEGRATION (D-28) |
| A-10 | Core team of ~6–8 engineers | Roadmap durations change | Staffing plan | Roadmap |
| A-11 | ≥85% voice-listing task success is achievable in the field | Launch gate slips | Phase 6 field test | Roadmap |
| A-12 | LGD (Local Government Directory) codes are used as the geography master | Geo model changes | Phase 2 | DATABASE_SCHEMA |
| A-13 | Transporters can be verified via RC/driving licence documents | Weaker transporter trust | Phase 0 legal/ops check | PROJECT_OVERVIEW |
| A-14 | Production domains `kisaan.in`, `api.kisaan.in`, `ai.kisaan.in` are placeholders | Rebranding of URLs | Phase 1 | API_SPECIFICATION |
| A-30 | Kisaan never falls more than ~60 opsapi releases behind | Large risky upgrades | Monthly upgrade cadence | OPSAPI_INTEGRATION |
| A-31 | `pgvector` can be enabled on the managed Postgres (same as A-50) | Separate vector store needed | Phase 0 infra check | SYSTEM_ARCHITECTURE, AI |
| A-32 | Hosting is in an India region | Latency / residency | Infra decision | SYSTEM_ARCHITECTURE |
| A-33 | Pilot scale ≤10k MAU, ≤1k orders/day | Capacity plan changes | Pilot | SYSTEM_ARCHITECTURE |
| A-40 | Radix/shadcn-style component library is acceptable | UI rework | Phase 1 | UX |
| A-41 | Per-script font subsets ≤60 KB | Page weight | Phase 1 | UX |
| A-42 | Page-weight budgets (≤300 KB first load) are achievable | Low-bandwidth UX | Phase 2 perf tests | UX |
| A-43 | Most target farmers use Android ≥2 GB RAM with Chrome-based browsers | PWA approach may need a native/lite app | Phase 0 field survey | UX |
| A-50 | = A-31 (pgvector) | — | — | AI |
| A-51 | Family-shared phones are common; MVP enforces one number = one account (SEC-011); a profile picker is a P2 option | Onboarding friction for families | Pilot | AI, SECURITY |
| A-52 | AI evaluation targets are realistic | Launch gate slips | Phase 5 eval | AI |
| A-90 | Razorpay Route supports on-hold transfers long enough for delivery + acceptance window `[UNVERIFIED]` | Settlement redesign | PA confirmation, Phase 0 | PAYMENT |
| A-91 | The PA supports UPI AutoPay on the same merchant account as Route `[UNVERIFIED]` | Second PA needed for membership | Phase 0 | PAYMENT |
| A-92 | Income-tax TDS on e-commerce may apply to farmer sales; PAN can be collected for most sellers `[TAX REVIEW]` | Onboarding friction | CA opinion | PAYMENT |
| A-93 | Membership is buyer-only at launch | Seller benefits are designed later | Phase 4 | MEMBERSHIP T&C |

## 3. Business risks and mitigations (Master Prompt §18)

Likelihood (L) and Impact (I) are rated H/M/L.

| ID | Risk | L | I | Mitigation | Owner / docs |
|---|---|---|---|---|---|
| R-01 | **Farmer onboarding:** low digital literacy, distrust of apps | H | H | Voice-first Punjabi flows; assisted onboarding by field agents / FPO partners; WhatsApp entry point; a working listing in <3 min; local-language video help | PRD, UX, AI |
| R-02 | **User trust** in a new platform | H | H | Verification badges, public stores with ratings, licensed PA payments with settlement after delivery, transparent fees, grievance officer, visible human support | FS, PAYMENT, SECURITY |
| R-03 | **Product quality verification** (photos can mislead; AI does not certify) | H | H | Category grading attributes; weighbridge slips; buyer acceptance window; P2 quality inspectors / assayer partners; disputes with evidence; AI never certifies quality | FS (DSP), AI |
| R-04 | **Price fluctuations** between acceptance and delivery | M | M | Short offer validity and payment deadlines (D-05, D-07); price locked at acceptance; sourced, dated mandi references only | FS, AI-PRI |
| R-05 | **Buyer–seller disputes** (weight, quality, delay) | M | H | Evidence-based dispute flow, settlement holds, SLAs, reputation impact, inspector escalation (P2) | FS DSP, PAYMENT |
| R-06 | **Logistics reliability:** transporter no-shows, delays | M | H | Reliability scores and suspension (BR-LOG-05); multiple quotes; backup transporter; seller-arranged fallback; POD via OTP/photo | FS LOG, AI-LGX |
| R-07 | **Payment failures** / webhook loss | M | H | Idempotent webhooks plus server-side verification; daily reconciliation; inventory released on failure; retry UX | PAYMENT, TESTING |
| R-08 | **Fake listings** and bait pricing | M | H | KYC tiers, duplicate-listing detection (AI-TRS), price-band moderation, value caps for new sellers (D-18), reports | FS, AI-TRS |
| R-09 | **Fraud:** fake group leaders, payment fraud, account takeover | M | H | Leaders never collect money (MVP); leader KYC, limits (D-71) and ratings; OTP step-up (D-51); risk signals escalated to humans (AI scores are not proof) | FS GRP, SECURITY |
| R-10 | **Regional-language accuracy** (dialects, code-mixing, noise) | H | M | Vendor bake-off on field audio (D-34); domain vocabulary; read-back confirmation; tap fallback | AI, TESTING |
| R-11 | **AI hallucinations** (prices, stock, terms) | M | H | Tool-grounded answers only; prices only from sourced data with dates; approval gates on every commit action; eval suites; refusal when data is missing | AI, TESTING |
| R-12 | **Market data availability/quality:** Agmarknet lags 2–3 days; some mandis don't report | H | M | Show source and date; staleness labels; multi-mandi comparison; never extrapolate | AI-PRI, COMPETITOR_ANALYSIS |
| R-13 | **Regulatory: Punjab APMC** licence/market fee for trade outside mandis | **H** | **H** | Written legal opinion before enabling wheat/paddy checkout (D-80); start with discovery and non-notified/perishable categories if advised; licensed-partner model as a fallback | SECURITY_AND_COMPLIANCE |
| R-14 | Regulatory: PA/escrow — platform must not hold funds | M | H | Licensed PA marketplace split only; no leader collection (MVP) | PAYMENT |
| R-15 | Regulatory: DPDP obligations (main duties from ~May 2027) | M | H | Privacy by design now: consent records, notices, retention schedule, breach runbook | SECURITY_AND_COMPLIANCE |
| R-16 | Consumer protection / dark patterns (membership auto-renew, coupon timers) | M | M | One-tap cancel, pre-debit notices, real timers only, full price breakup | MEMBERSHIP T&C, UX |
| R-17 | **Marketplace liquidity** (cold start: no buyers → no farmers) | H | H | Concentrated pilot geography (D-01, a few Punjab districts); onboard anchor buyers (processors/wholesalers) first; buyer RFQs to pull supply; group buying to aggregate small buyers | PRD, ROADMAP |
| R-18 | AI operating cost overrun | M | M | Per-user budgets (D-56), model routing, caching, cost per order KPI (D-15) | AI |
| R-19 | WhatsApp policy changes (pricing, AI-bot restrictions) | M | M | Task-scoped bot; PWA as primary channel; INR billing migration before 31 Dec 2026 | AI, COMPETITOR_ANALYSIS |
| R-20 | Competitor response (well-funded agritech players) | M | M | Differentiate on voice/AI-first Punjabi UX, group buying and trust layer; stay asset-light | COMPETITOR_ANALYSIS |
| R-30 | opsapi `notifications` table clash between the ecommerce preset and core | M | M | See OPSAPI_INTEGRATION mitigation; Kisaan notifications use their own tables / core API only | OPSAPI_INTEGRATION |
| R-31 | **Phone-OTP session issuance** relies on an opsapi helper outside the plugin SDK (no compatibility promise) | M | **H** | Phase 0 spike; contract test pinned to tag; request an SDK hook from opsapi maintainers | OPSAPI_INTEGRATION |
| R-32 | opsapi upgrades break core routes Kisaan uses (only the SDK is compatibility-guaranteed) | M | M | Pin immutable tag (D-30); contract tests; monthly upgrade cadence (A-30) | OPSAPI_INTEGRATION |
| R-90 | APMC market fee + RDF (~6% on wheat/paddy) may apply to on-platform trades, changing landed cost (≈ ₹14k on the 100-qtl example) | M | H | See R-13 / D-80 / D-81 | PAYMENT, SECURITY_AND_COMPLIANCE |
| R-91 | PA card fees exceed commission on low-margin grain orders | M | M | Steer to UPI; surcharge or minimum fee per D-93 | PAYMENT |
| R-92 | Free-delivery benefit abused or under-priced vs bulk logistics cost | M | M | Per-order and monthly caps; fair-use clause; monitor cost per member | PAYMENT, MEMBERSHIP T&C |

## 4. Unknowns (research still needed)

1. The live status and terms of the data.gov.in mandi price API key `[UNVERIFIED]`.
2. Punjab private e-trading licence details and fee `[UNVERIFIED]` `[LEGAL REVIEW]`.
3. Final DPDP commencement date after any amendment to the 18-month window `[LEGAL REVIEW]`.
4. Exact India WhatsApp per-message rates `[UNVERIFIED]`.
5. PA marketplace product terms for agri sellers without GSTIN (payout KYC) `[UNVERIFIED]`.
6. STT accuracy on rural Punjabi speech (only vendor availability is verified).
7. Whether opsapi's voice module handles Indic languages `[UNVERIFIED]`.
