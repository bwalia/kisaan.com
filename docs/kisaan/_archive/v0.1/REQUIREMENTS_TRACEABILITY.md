# KISAAN — Requirements Traceability Matrix

> Status: Draft v0.1 · Last updated: 2026-11-14 · Owner: KISAAN product & architecture · Source of truth index: [README](README.md)

This matrix links every requirement ID defined in the KISAAN documentation to its feature, scope, functional specification, API endpoints, database entities, screens, test cases and roadmap phase. It is the checklist for "is this requirement designed, built and tested?"

## 1. How this matrix was built

- **Requirement sources** (where an ID is *defined*, i.e. appears as the first cell of a requirement-table row): [PRD](PRD.md), [SECURITY_AND_COMPLIANCE](SECURITY_AND_COMPLIANCE.md) (SEC, PRIV, CMP), [PAYMENT_AND_BUSINESS_MODEL](PAYMENT_AND_BUSINESS_MODEL.md) (PAY-013..026, INVC-007..010), [AI_AGENT_ARCHITECTURE](AI_AGENT_ARCHITECTURE.md) (APR, VOX, WA additions).
- **Links** were extracted mechanically from the documents (including ranges such as `WHL-001…012`):
  - *FS / spec*: [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md) sections whose text cites the ID; otherwise the area's FS section.
  - *API*: endpoint rows in [API_SPECIFICATION](API_SPECIFICATION.md) that cite the ID, shown as `METHOD path (new-kisaan | existing-opsapi | ai-gateway)`, with `…` = `/api/v2/kisaan`. Most endpoint rows do not cite IDs, so the fallback is the API module section for the area (`area: API §x`).
  - *DB*: tables in [DATABASE_SCHEMA](DATABASE_SCHEMA.md) whose definition cites the ID, else the schema section that cites it, else the area section (`area: DB §x`).
  - *Tests*: `TC-*` rows and `E2E-*` scenarios in [TESTING_STRATEGY](TESTING_STRATEGY.md) that cite the ID. For SEC, PRIV and WA, where tests are written per area rather than per ID, the area tests are shown as `area: …`.
  - *Screens*: [UX_UI_SPECIFICATION](UX_UI_SPECIFICATION.md) rarely cites requirement IDs, so screens are mapped **per area** (by the screen's area code, e.g. `SCR-WHL-01`) in each area's header line.
  - *Phase*: [DEVELOPMENT_ROADMAP](DEVELOPMENT_ROADMAP.md) feature placement for MVP rows; `P2` rows → Phase 7 / post-launch; `Future` rows are not phased.
- **GAP** means no link was found in the documents. Nothing has been invented to fill a gap.
- marks an ID that is defined **differently in two documents** (see §4).

## 2. ID prefix legend

| Prefix | Area | Defined in | Prefix | Area | Defined in |
|---|---|---|---|---|---|
| AUTH | Authentication & registration | PRD | WHL | §2A.1 Wholesale / bulk pricing | PRD |
| PROF | Profiles & multi-role | PRD | GRP | §2A.2 Group buying & area leaders | PRD |
| ONB | Onboarding & verification (KYC) | PRD | MEM | §2A.3 Membership & T&C | PRD |
| CAT | Categories & attributes | PRD §3 (no IDs assigned) | STR | §2A.4 Public seller stores | PRD |
| PRD | Product management & listings | PRD | INV | §2A.5 (Automated) inventory | PRD |
| SRCH | Search, filters, product details | PRD | CPN | §2A.6 Seller coupons | PRD |
| ENQ | Enquiries & buyer requirements (RFQ) | PRD | PRC | Pricing engine / discount stacking | PRD |
| OFR | Offers, quotations, negotiation | PRD | AI | AI assistant & agents | PRD |
| ORD | Orders | PRD | APR | Approvals (human-in-the-loop) | PRD + AI-ARCH |
| PAY | Payments, refunds, settlement | PRD (001–012), PAY&BM (013–026) | VOX | Voice & multilingual | PRD + AI-ARCH |
| INVC | Invoices & receipts | PRD (001–006), PAY&BM (007–010) | WA | WhatsApp channel | PRD + AI-ARCH |
| LOG | Logistics / delivery | PRD | MKT | Mandi price data | PRD |
| REV | Reviews & ratings | PRD | SEC | Security | SEC&C |
| NOTF | Notifications | PRD | PRIV | Privacy / DPDP | SEC&C |
| SUP | Customer support | PRD | CMP | Regulatory compliance | SEC&C |
| DSP | Disputes & refunds | PRD | NFR | Non-functional | *(not yet defined, see §5)* |
| ADM | Admin & moderation | PRD | BR-* | Business rules | FUNCTIONAL_SPECIFICATION |
| ANL | Analytics & reporting | PRD | TC-* / E2E-* | Test cases / end-to-end scenarios | TESTING_STRATEGY |

Abbreviations in the *Source* column: PRD = [PRD.md](PRD.md), SEC&C = [SECURITY_AND_COMPLIANCE.md](SECURITY_AND_COMPLIANCE.md), PAY&BM = [PAYMENT_AND_BUSINESS_MODEL.md](PAYMENT_AND_BUSINESS_MODEL.md), AI-ARCH = [AI_AGENT_ARCHITECTURE.md](AI_AGENT_ARCHITECTURE.md). For CMP rows, *Scope* shows the compliance classification (Legal req / Recommendation / Assumption) and review flag instead of MVP/P2.

## 3. §2A confirmed-feature coverage checklist

Every confirmed must-have feature (Master Prompt §2A) is present in every layer of the documentation. None has been dropped or deferred. The one partial-MVP item is flagged.

| §2A feature | PRD | Functional spec | DB | API | UX screens | Tests | E2E | Roadmap | Status |
|---|---|---|---|---|---|---|---|---|---|
| 2A.1 Wholesale / bulk pricing (WHL) | ✅ WHL-001..012 | ✅ §24, §30 | ✅ §5.5 `kisaan_wholesale_tiers` | ✅ §3.21 | ✅ SCR-WHL-01, SCR-SRCH-03 | ✅ TC-WHL-001..006, TC-PRC-* | E2E-02, E2E-03 | Phase 2 → 4 | Covered |
| 2A.2 Group buying & area leaders (GRP) | ✅ GRP-001..016 | ✅ §25 | ✅ §9 (groups, members, group orders, allocations, leader profiles) | ✅ §3.22, §3.23 (separate leader signup) | ✅ SCR-GRP-01..08 | ✅ TC-GRP-001..012 | E2E-05, E2E-06 | Phase 1 → 3 → 4 | Partial MVP: members pay directly; **leader-collects-money mode is Future, pending `[LEGAL REVIEW]`** |
| 2A.3 Membership & T&C (MEM) | ✅ MEM-001..014 | ✅ §26 | ✅ §10 (plans, memberships, legal documents, acceptances) | ✅ §3.24 | ✅ SCR-MEM-01..04 | ✅ TC-MEM-001..010 | E2E-04 | Phase 4 (priority delivery Phase 7, D-96) | Covered; priority-delivery benefit is P2 |
| 2A.4 Public seller stores (STR) | ✅ STR-001..008 | ✅ §27 | ✅ §5.3 (`stores` ↔ `kisaan_store_profiles`) | ✅ §3.20 | ✅ SCR-STR-01..02 | ✅ TC-STR-001..005 | E2E-04, E2E-14 (touch stores) | Phase 2 | Covered (no dedicated store E2E) |
| 2A.5 Automated inventory (INV) | ✅ INV-001..011 | ✅ §10, §28 | ✅ §5.4 (inventory, reservations, movements) | ✅ §3.6 | ✅ SCR-INV-01..02 | ✅ TC-INV-001..008, TC-CONC-* | E2E-10 | Phase 2 → 3 → 4 | Covered |
| 2A.6 Seller coupons (CPN) | ✅ CPN-001..012 | ✅ §29 | ✅ §7.5 (coupons, coupon products, redemptions) | ✅ §3.25 | ✅ SCR-CPN-01..02 | ✅ TC-CPN-001..011 | E2E-03, E2E-13 | Phase 4 | Covered |
| Discount stacking across 2A.1/2A.3/2A.6 (PRC) | ✅ PRC-001..007 | ✅ §30 (5 worked INR examples) | ✅ §7.2 | ✅ §3.10 checkout quote | SCR-PAY-02 | ✅ TC-PRC-001..010 | E2E-03 | Phase 4 | Covered |
| Bulk buyer / group-leader separate signup | ✅ GRP-001..002 | ✅ §25.1 | ✅ `kisaan_group_leader_profiles` | ✅ §3.23 | SCR-GRP-* | ✅ TC-GRP-* | E2E-05 | Phase 1 | Covered |
| Membership T&C draft (legal review) | MEM-* | §26 | `kisaan_legal_documents`, `kisaan_legal_acceptances` | §3.24 (`terms.version`, `body_sha256`) | SCR-MEM-02, SCR-MEM-04 | TC-MEM-* | E2E-04 | Phase 4; legal sign-off at Phase 8 | Draft in [MEMBERSHIP_TERMS_AND_CONDITIONS](MEMBERSHIP_TERMS_AND_CONDITIONS.md) |

## 4. ID conflicts — resolved

Earlier drafts used `APR-0xx`, `VOX-0xx` and `WA-0xx` with different meanings in PRD.md and AI_AGENT_ARCHITECTURE.md. **Resolution (applied):** the PRD IDs (APR-001…007, VOX-001…009, WA-001…006) are canonical and are the ones cited by FS, DB, API and tests. The AI architecture's detailed design requirements were renumbered to **APR-101…110, VOX-101…111, WA-101…107**. Each refines a PRD parent, e.g. APR-105 → APR-004 (expiry 15 min, parameter binding); APR-108 (step-up OTP, D-51) → APR-007; VOX-108 (readback) → VOX-006; WA-104 (interactive-button approvals) → WA-004. AI-only detailed IDs are listed in their area tables below.

## 5. Coverage summary

Counts are mechanical (see §1). "Explicit" means the target document cites the requirement ID itself, so area-level links are not counted there.

| Prefix | Requirements | Explicit test link | Area-level test only | No test (GAP) | Explicit API endpoint cites ID | DB entity/section cites ID |
|---|---|---|---|---|---|---|
| WHL | 12 | 11 | 0 | 1 | 2 | 12 |
| GRP | 16 | 14 | 0 | 2 | 10 | 16 |
| MEM | 14 | 13 | 0 | 1 | 1 | 14 |
| STR | 8 | 6 | 0 | 2 | 4 | 8 |
| INV | 11 | 10 | 0 | 1 | 4 | 10 |
| CPN | 12 | 11 | 0 | 1 | 3 | 12 |
| PRC | 7 | 7 | 0 | 0 | 0 | 7 |
| AUTH | 9 | 9 | 0 | 0 | 3 | 7 |
| PROF | 7 | 6 | 0 | 1 | 1 | 5 |
| ONB | 10 | 9 | 0 | 1 | 0 | 8 |
| PRD | 15 | 13 | 0 | 2 | 2 | 13 |
| SRCH | 13 | 10 | 0 | 3 | 3 | 3 |
| ENQ | 6 | 5 | 0 | 1 | 1 | 4 |
| OFR | 13 | 13 | 0 | 0 | 5 | 13 |
| ORD | 9 | 8 | 0 | 1 | 2 | 8 |
| PAY | 26 | 15 | 0 | 11 | 3 | 10 |
| INVC | 10 | 6 | 0 | 4 | 0 | 6 |
| LOG | 9 | 8 | 0 | 1 | 3 | 9 |
| REV | 5 | 5 | 0 | 0 | 1 | 5 |
| NOTF | 5 | 5 | 0 | 0 | 1 | 5 |
| SUP | 5 | 5 | 0 | 0 | 2 | 5 |
| DSP | 7 | 5 | 0 | 2 | 0 | 7 |
| ADM | 13 | 7 | 0 | 6 | 11 | 6 |
| ANL | 5 | 2 | 0 | 3 | 1 | 0 |
| AI | 20 | 18 | 0 | 2 | 2 | 2 |
| APR | 10 | 5 | 0 | 5 | 1 | 7 |
| VOX | 11 | 8 | 0 | 3 | 0 | 0 |
| WA | 7 | 0 | 7 | 0 | 1 | 1 |
| MKT | 7 | 2 | 0 | 5 | 5 | 7 |
| SEC | 98 | 12 | 86 | 0 | 0 | 0 |
| PRIV | 15 | 0 | 15 | 0 | 0 | 0 |
| CMP | 61 | 0 | 0 | 61 | 1 | 1 |
| **Total** | **476** | **248** | **108** | **120** | **73** | **211** |

**Requirements with no test case at ID or area level (GAP):** WHL-012, GRP-014..015, MEM-013, STR-006, STR-008, INV-011, CPN-012, PROF-007, ONB-010, PRD-023..024, SRCH-010, SRCH-020, SRCH-022, ENQ-005, ORD-009, PAY-016..026, INVC-007..010, LOG-009, DSP-005, DSP-007, ADM-005, ADM-007..009, ADM-011, ADM-013, ANL-003..005, AI-019..020, APR-003, APR-005, APR-108..010, VOX-009..011, MKT-001..002, MKT-004..005, MKT-007, CMP-001..012, CMP-020..028, CMP-030..047, CMP-050..053, CMP-055..058, CMP-060..065, CMP-070..072, CMP-080..082, CMP-090..091

**Requirements covered only by area-level tests (no TC cites the ID):** WA-001..007, SEC-020..027, SEC-030..038, SEC-040..046, SEC-050..056, SEC-060..064, SEC-070..072, SEC-075..086, SEC-090..104, SEC-110..115, SEC-120..126, SEC-130..136, PRIV-001..015

**Requirements with no DB entity (GAP):** ANL-001..005

### 5.1 Gap analysis and recommended actions

| # | Gap | Recommended action | Owner |
|---|---|---|---|
| G-1 | **API rows rarely cite requirement IDs**: only 73 of 476 requirements are cited by an endpoint row. All other API links are area-level. | Add a `Req` column to API_SPECIFICATION endpoint tables during Phase 0 grooming. | Tech lead |
| G-2 | **CMP-* (61) have no test cases.** Compliance checks are only implied (e.g. TC-INVC-005 TCS, TC-CPN-008 dark patterns, TC-SUP-003 grievance officer) and do not cite CMP IDs. | Add a `TC-CMP-*` suite: compliance acceptance checks (notices, grievance SLAs, price breakup, invoice fields, APMC gating flag, DLT templates) plus a pre-launch legal checklist sign-off. | QA + counsel |
| G-3 | **SEC-* / PRIV-* tested only at area level** (TC-SEC-001..013, TC-PI-*, TC-RBAC-*). | Cite SEC/PRIV IDs in TC-SEC rows; add specific tests for retention (PRIV), backups/DR (SEC-110..115) and incident response (SEC-120..126). | Security lead |
| G-4 | **PAY-016..026 and INVC-007..010** (added in PAYMENT_AND_BUSINESS_MODEL) have no tests. | Extend TC-PAY / TC-INVC (settlement holds, reconciliation, payment links via AI, TDS/TCS statements). | QA |
| G-5 | **WA-001..007 have no ID-level tests.** Only prompt-injection cases TC-PI-007/012 touch WhatsApp. | Add TC-WA suite: opt-in/STOP, template-only outside 24 h, interactive-button approvals, webhook signature/idempotency. | QA + AI |
| G-6 | **ANL-001..005 have no DB entity** (no analytics event or KPI tables), and ANL-003..005 have no tests. | Decide analytics storage (events table vs external analytics tool) and add it to DATABASE_SCHEMA. | Tech lead |
| G-7 | **APR-003, APR-005, APR-108..110 have no ID-level tests**, although the approval invariant is tested by TC-AI-005 and TC-PI-013. The ID conflict is resolved (§4) | Map TC-AI approval tests to APR IDs. | AI lead |
| G-8 | **NFR prefix is not defined anywhere.** Measurable NFRs (performance, availability, accessibility, low-bandwidth) are spread across SYSTEM_ARCHITECTURE, UX (budgets) and TESTING (TC-PERF, TC-UI). | Create an NFR-* table (e.g. in SYSTEM_ARCHITECTURE) and link it to TC-PERF/TC-UI. | Architect |
| G-9 | **CAT has no requirement IDs** (categories are described in PRD §3). | Assign CAT-* IDs for the category tree, attribute schemas and MVP vs future categories. | Product |
| G-10 | **Screens without an area screen:** INVC (no invoice screen specified) and REV (no review-writing screen). | Add invoice view/download to SCR-ORD-02 and a review screen to UX spec. | Design |
| G-11 | **Roadmap does not explicitly place SUP (support tickets) or review writing (REV).** | Place support tickets in Phase 4/5 and review writing in Phase 4 (after order completion). | Product |
| G-12 | Other individual requirements without tests: listed above under "no test case at ID or area level". | Add TC rows during Phase 0 test planning. | QA |

## 6. Traceability tables

The §2A features come first, followed by the core marketplace, AI and voice, and then security and compliance. Each area starts with its **area links** (FS section, API module, DB section, screens, roadmap placement), which apply to every row in that area that has no more specific link.

### WHL — 2A.1 Wholesale / bulk pricing

Area links: FS §24 · API §3.21 · DB §5.5 (kisaan_wholesale_tiers) · Screens: SCR-WHL-01, SCR-SRCH-03 · Roadmap: Phase 2 (config/display) → Phase 4 (checkout)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| WHL-001 | A seller can enable or disable wholesale pricing per listing | MVP | PRD §5.24 | FS §24 | area: API §3.21 | kisaan_listings | TC-WHL-001 | Phase 2 (config/display) → Phase 4 (checkout) |
| WHL-002 | Quantity tiers (slabs): up to 5 tiers per listing, each with min_qty (in display unit, st… | MVP | PRD §5.24 | FS §24 | area: API §3.21 | DB §5.5 | TC-PRC-001, TC-WHL-002, TC-WHL-003 | Phase 2 (config/display) → Phase 4 (checkout) |
| WHL-003 | Tiers must have strictly increasing min_qty and non-decreasing effective discount; min_qt… | MVP | PRD §5.24 | FS §24 | area: API §3.21 | kisaan_wholesale_tiers | TC-WHL-002, TC-WHL-003 | Phase 2 (config/display) → Phase 4 (checkout) |
| WHL-004 | "Buy the whole lot" offer: a special price (or discount) available only if the buyer purc… | MVP | PRD §5.24 | FS §24 | area: API §3.21 | kisaan_listings | TC-PRC-002, TC-WHL-004 | Phase 2 (config/display) → Phase 4 (checkout) |
| WHL-005 | Whole-lot eligibility is evaluated at reservation time; if available changes before reser… | MVP | PRD §5.24 | FS §24 | area: API §3.21 | DB §5.5 | TC-WHL-004, TC-WHL-005, E2E-02 | Phase 2 (config/display) → Phase 4 (checkout) |
| WHL-006 | Only the single best applicable wholesale benefit applies (the highest tier met, or whole… | MVP | PRD §5.24 | FS §24 | area: API §3.21 | DB §5.5 | TC-PRC-002, TC-WHL-006 | Phase 2 (config/display) → Phase 4 (checkout) |
| WHL-007 | Wholesale tiers are shown clearly on search cards ("Bulk deal: up to 8% off"), on the pro… | MVP | PRD §5.24 | FS §24 | GET `…/public/listings/:uuid/price?qty=&unit=` (new-kisaan) | DB §5.5 | TC-WHL-005 | Phase 2 (config/display) → Phase 4 (checkout) |
| WHL-008 | Group orders count the aggregated group quantity for tier eligibility (GRP) | MVP | PRD §5.24 | FS §24, FS §25 | area: API §3.21 | kisaan_buying_groups | TC-PRC-005 | Phase 2 (config/display) → Phase 4 (checkout) |
| WHL-009 | Stacking with negotiation, coupons and membership follows PRC rules (PRC-001…) | MVP | PRD §5.24 | FS §24 | area: API §3.21 | DB §5.5 | TC-OFR-008 | Phase 2 (config/display) → Phase 4 (checkout) |
| WHL-010 | Changes to tiers do not affect existing reservations/orders (price snapshot) | MVP | PRD §5.24 | FS §24 | area: API §3.21 | kisaan_wholesale_tiers | TC-PRD-006 | Phase 2 (config/display) → Phase 4 (checkout) |
| WHL-011 | AI Listing agent can suggest tiers based on lot size and mandi price bands; the seller ap… | P2 | PRD §5.24 | FS §24 | POST `…/listings/:uuid/wholesale/suggest` (new-kisaan) | DB §5.5 | TC-WHL-006 | P2 (Phase 7 / post-launch) |
| WHL-012 | Wholesale tiers are funded entirely by the seller (commission is computed on the post-dis… | MVP | PRD §5.24 | FS §24 | area: API §3.21 | DB §5.5 | **GAP** | Phase 2 (config/display) → Phase 4 (checkout) |

### GRP — 2A.2 Group buying & area leaders

Area links: FS §25 · API §3.22, §3.23 · DB §9 (kisaan_buying_groups, _members, kisaan_group_orders, _allocations) · Screens: SCR-GRP-01..08, SCR-ADM-09 · Roadmap: Phase 1 (leader signup) → Phase 3 → Phase 4

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| GRP-001 | Separate "Bulk Buyer / Group Leader" signup flow, distinct from normal buyer signup: iden… | MVP | PRD §5.25 | FS §25 | POST `…/group-leader/applications` (new-kisaan) | kisaan_group_leader_profiles, kisaan_verification_records | TC-ONB-006, TC-GRP-001 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-002 | Leader verification badge plus rating; leader profile shows area, groups run, completion… | MVP | PRD §5.25 | FS §25 | GET `…/public/group-leaders/:user_uuid` (new-kisaan) | kisaan_group_leader_profiles | TC-GRP-002 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-003 | A leader creates a buying group: area (village/colony/mandi + geo radius), product (speci… | MVP | PRD §5.25 | FS §25 | area: API §3.22, §3.23 | kisaan_buyer_requirements | TC-GRP-001, TC-GRP-003 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-004 | Groups are publicly visible, including to logged-out users: "<Leader> is leading <area> t… | MVP | PRD §5.25 | FS §25 | GET `…/public/groups/:slug` (new-kisaan) | kisaan_buying_groups | TC-GRP-002, TC-GRP-004 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-005 | Join a group: a member commits a quantity within min/max and the group capacity; joining… | MVP | PRD §5.25 | FS §25 | POST `…/groups/:uuid/join` (new-kisaan) | DB §9 | TC-GRP-003, TC-GRP-005 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-006 | Member payment authorisation per member: on joining, the member pays (or authorises) for… | MVP | PRD §5.25 | FS §25 | POST `…/groups/:uuid/join` (new-kisaan) | kisaan_buying_group_members | TC-GRP-004, TC-GRP-006, TC-PAY-013 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-007 | Leave a group before the join deadline (full refund); after the deadline leaving is not a… | MVP | PRD §5.25 | FS §25 | POST `…/groups/:uuid/leave` (new-kisaan) | DB §9 | TC-GRP-005, TC-GRP-007 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-008 | Group close at the deadline: if target qty is met → the group order is placed (leader app… | MVP | PRD §5.25 | FS §25 | POST `…/groups/:uuid/close` (new-kisaan) | kisaan_buying_groups | TC-PRC-005, TC-GRP-006, TC-GRP-007, TC-GRP-008 (+1) | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-009 | Group order = one order to the seller with allocations per member; inventory is reserved… | MVP | PRD §5.25 | FS §25 | area: API §3.22, §3.23 | DB §9 | TC-PRC-005, TC-GRP-006, TC-GRP-009 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-010 | Delivery to a common delivery point; the leader confirms receipt and distributes; each me… | MVP | PRD §5.25 | FS §25 | POST `…/group-orders/:uuid/leader-receipt` (new-kisaan) | kisaan_buying_groups | TC-GRP-009, TC-GRP-010 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-011 | Dispute handling at member level (allocation) and group level (whole delivery); the leade… | MVP | PRD §5.25 | FS §25 | area: API §3.22, §3.23 | kisaan_disputes | TC-GRP-009, TC-GRP-011 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-012 | Anti-abuse: limits on concurrent groups per new leader, max group value for leaders < 3 c… | MVP | PRD §5.25 | FS §25 | area: API §3.22, §3.23 | kisaan_group_leader_profiles | TC-GRP-001, TC-GRP-010, TC-GRP-012 | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-013 | Leader-collects-money mode (leader pays the seller for the whole group, collects from mem… | Future | PRD §5.25 | FS §25 | area: API §3.22, §3.23 | DB §9 | TC-GRP-004 | Future (not phased) |
| GRP-014 | Leader incentive/commission | Future | PRD §5.25 | FS §25 | area: API §3.22, §3.23 | DB §9 | **GAP** | Future (not phased) |
| GRP-015 | Group chat/announcements between the leader and members (in-app; phone numbers hidden by… | MVP | PRD §5.25 | FS §25 | GET `…/groups/:uuid/announcements` (new-kisaan) | DB §9 | **GAP** | Phase 1 (leader signup) → Phase 3 → Phase 4 |
| GRP-016 | Groups are discoverable in search and through the AI ("Ludhiana mein koi aloo ka group ha… | MVP | PRD §5.25 | FS §25 | GET `…/public/search/groups` (new-kisaan) | DB §9 | TC-GRP-012 | Phase 1 (leader signup) → Phase 3 → Phase 4 |

### MEM — 2A.3 Membership & T&C

Area links: FS §26 · API §3.24 · DB §10 (kisaan_membership_plans, kisaan_memberships, kisaan_legal_documents, kisaan_legal_acceptances) · Screens: SCR-MEM-01..04, SCR-ADM-10 · Roadmap: Phase 4 (priority delivery Phase 7)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| MEM-001 | KISAAN Plus paid membership for buyers (plans: monthly, yearly; price placeholders ₹199/m… | MVP | PRD §5.26 | FS §26 | area: API §3.24 | DB §10 | TC-MEM-001 | Phase 4 |
| MEM-002 | Benefits (MVP): free delivery on platform-arranged deliveries up to a cap per order/month… | MVP | PRD §5.26 | FS §17, FS §26 | area: API §3.24 | kisaan_transport_requests | TC-PRC-001, TC-PRC-004, TC-MEM-002 | Phase 4 |
| MEM-003 | Benefits (P2/Future): extended acceptance window, free quality inspection credits (P2), m… | P2/Future | PRD §5.26 | FS §26 | area: API §3.24 | DB §10 | TC-MEM-003 | P2 (Phase 7 / post-launch) |
| MEM-004 | Free trial (e.g. 30 days, once per user/business PAN) [DECISION D-11] | MVP | PRD §5.26 | FS §26 | area: API §3.24 | kisaan_memberships | TC-MEM-003, TC-MEM-004, TC-MEM-009 | Phase 4 |
| MEM-005 | Mandatory T&C acceptance before activation: versioned T&C document; acceptance stored wit… | MVP | PRD §5.26 | FS §26 | area: API §3.24 | kisaan_memberships | TC-MEM-001, TC-MEM-002, TC-MEM-005 | Phase 4 |
| MEM-006 | Benefit eligibility rules: free delivery cap (e.g. ₹500 per order, ₹2,000 per month), app… | MVP | PRD §5.26 | FS §26 | area: API §3.24 | kisaan_membership_benefit_usage | TC-PRC-005, TC-MEM-006, TC-MEM-008 | Phase 4 |
| MEM-007 | Auto-renewal with an explicit opt-in toggle at purchase (not pre-ticked); pre-debit notif… | MVP | PRD §5.26 | FS §26 | area: API §3.24 | kisaan_payment_mandates, kisaan_memberships | TC-MEM-003, TC-MEM-004, TC-MEM-007 | Phase 4 |
| MEM-008 | Cancel anytime in ≤ 2 taps / one voice command (with confirmation); cancellation stops au… | MVP | PRD §5.26 | FS §26 | area: API §3.24 | DB §10 | TC-MEM-005, TC-MEM-008 | Phase 4 |
| MEM-009 | Refund policy: full refund if cancelled within 7 days and no benefit used; otherwise no p… | MVP | PRD §5.26 | FS §26 | POST `…/me/membership/cancel` (new-kisaan) | DB §10 | TC-MEM-006, TC-MEM-009 | Phase 4 |
| MEM-010 | Membership states: Trial, Active, Grace (payment failed, 3 days), Cancelled (active till… | MVP | PRD §5.26 | FS §26 | area: API §3.24 | kisaan_memberships | TC-MEM-007, TC-MEM-010, TC-PAY-012 | Phase 4 |
| MEM-011 | Misuse controls: sharing accounts, abnormal free-delivery usage → suspension per T&C | MVP | PRD §5.26 | FS §26 | area: API §3.24 | kisaan_memberships | TC-MEM-010 | Phase 4 |
| MEM-012 | Admin manages plans, benefits, T&C versions; changes to benefits are effective-dated and… | MVP | PRD §5.26 | FS §26 | area: API §3.24 | DB §10 | TC-MEM-002 | Phase 4 |
| MEM-013 | A draft T&C document exists: see [MEMBERSHIP_TERMS_AND_CONDITIONS](MEMBERSHIP_TERMS_AND_C… | MVP | PRD §5.26 | FS §26 | area: API §3.24 | DB §10 | **GAP** | Phase 4 |
| MEM-014 | Membership benefit cost tracking (platform-funded free delivery) for unit economics | MVP | PRD §5.26 | FS §26 | area: API §3.24 | kisaan_membership_benefit_usage | TC-MEM-008 | Phase 4 |

### STR — 2A.4 Public seller stores

Area links: FS §27 · API §3.20 · DB §5.3 (stores ↔ kisaan_store_profiles) · Screens: SCR-STR-01..02 · Roadmap: Phase 2

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| STR-001 | Every seller automatically gets a public store at a shareable URL (/store/<slug>) on firs… | MVP | PRD §5.27 | FS §27 | GET `…/me/store` (new-kisaan) | kisaan_store_profiles | TC-STR-001 | Phase 2 |
| STR-002 | The store shows: name, banner, description, verification badges, rating, location/service… | MVP | PRD §5.27 | FS §27 | area: API §3.20 | kisaan_store_profiles | TC-STR-001, TC-STR-002 | Phase 2 |
| STR-003 | Store is discoverable by logged-out visitors and search engines; contact details follow p… | MVP | PRD §5.27 | FS §27 | area: API §3.20 | kisaan_store_profiles | TC-STR-002, TC-STR-003 | Phase 2 |
| STR-004 | Seller customisation: store name, slug (unique, profanity-filtered, changeable at most on… | MVP | PRD §5.27 | FS §27 | PATCH `…/me/store` (new-kisaan) | kisaan_store_profiles | TC-STR-003, TC-STR-004 | Phase 2 |
| STR-005 | Store QR code for offline sharing (mandi boards, posters) | MVP | PRD §5.27 | FS §27 | GET `…/me/store/qr` (new-kisaan) | kisaan_store_profiles | TC-STR-005 | Phase 2 |
| STR-006 | Follow store → notifications on new listings | P2 | PRD §5.27 | FS §27 | area: API §3.20 | kisaan_store_profiles | **GAP** | P2 (Phase 7 / post-launch) |
| STR-007 | Store suspended/hidden when the seller is suspended; the URL shows "store unavailable" | MVP | PRD §5.27 | FS §27 | area: API §3.20 | kisaan_store_profiles | TC-STR-004 | Phase 2 |
| STR-008 | Store analytics (views, shares, enquiries) | MVP | PRD §5.27 | FS §27 | GET `…/me/store/analytics?from=&to=` (new-kisaan) | kisaan_store_profiles | **GAP** | Phase 2 |

### INV — 2A.5 Inventory & automated inventory

Area links: FS §10, §28 · API §3.6 · DB §5.4 (kisaan_inventory, _reservations, _movements) · Screens: SCR-INV-01..02 · Roadmap: Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| INV-001 | Each listing has an inventory record with on_hand, reserved and available = on_hand − res… | MVP | PRD §5.10 | FS §10 | area: API §3.6 | kisaan_inventory | TC-INV-001, TC-INV-008 | Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release) |
| INV-002 | Automatic reservation when an offer is accepted or checkout starts (Buy now), with a TTL | MVP | PRD §5.10 | FS §10 | area: API §3.6 | kisaan_inventory_movements | TC-INV-001, TC-INV-002, TC-OFR-004 | Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release) |
| INV-003 | Automatic deduction on payment confirmation / order confirmation (reserved → deducted fro… | MVP | PRD §5.10 | FS §10 | area: API §3.6 | kisaan_inventory_movements | TC-INV-002, TC-INV-003 | Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release) |
| INV-004 | Automatic release on cancellation, payment failure or reservation expiry | MVP | PRD §5.10 | FS §10 | area: API §3.6 | kisaan_inventory_movements | TC-INV-003, TC-INV-004, TC-ORD-003, TC-PAY-005 | Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release) |
| INV-005 | Overselling prevention under concurrency: reservation succeeds only if available ≥ qty in… | MVP | PRD §5.10 | FS §10 | area: API §3.6 | kisaan_inventory, kisaan_inventory_movements | TC-INV-005, TC-GRP-008 | Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release) |
| INV-006 | Manual adjustment (add / remove stock) requires a reason code (harvest added, spoilage, s… | MVP | PRD §5.10 | FS §10 | POST `…/listings/:uuid/inventory/adjustments` (new-kisaan) | kisaan_inventory_movements | TC-INV-004, TC-INV-006 | Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release) |
| INV-007 | Low-stock alert when available falls below a seller-defined threshold (default 10% of ini… | MVP | PRD §5.10 | FS §10 | PUT `…/listings/:uuid/inventory/threshold` (new-kisaan) | kisaan_inventory | TC-INV-005, TC-INV-007 | Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release) |
| INV-008 | Out-of-stock auto-hide: when available = 0 (or below MOQ) the listing is hidden from sear… | MVP | PRD §5.10 | FS §6, FS §10 | area: API §3.6 | kisaan_inventory_movements | TC-INV-006, TC-INV-008 | Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release) |
| INV-009 | Inventory movement ledger (every reserve / release / deduct / adjust with actor, reason,… | MVP | PRD §5.10 | FS §10 | GET `…/listings/:uuid/inventory/movements` (new-kisaan) | kisaan_inventory_movements | TC-INV-002 | Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release) |
| INV-010 | Voice / AI inventory update ("Mera 20 quintal aur wheat aa gaya") drafts an adjustment th… | MVP | PRD §5.10 | FS §10 | POST `…/listings/:uuid/inventory/adjustments` (new-kisaan) | kisaan_inventory_movements | TC-INV-007 | Phase 2 → Phase 3 (reserve) → Phase 4 (deduct/release) |
| INV-011 | Multi-location stock per seller (warehouses) | Future | PRD §5.10 | FS §10 | area: API §3.6 | area: DB §5.4 | **GAP** | Future (not phased) |

### CPN — 2A.6 Seller coupons

Area links: FS §29 · API §3.25 · DB §7.5 (kisaan_coupons, _products, _redemptions) · Screens: SCR-CPN-01..02 · Roadmap: Phase 4

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| CPN-001 | Sellers create coupons for their own store/products | MVP | PRD §5.29 | FS §29 | area: API §3.25 | kisaan_coupons | TC-CPN-001 | Phase 4 |
| CPN-002 | Coupon fields: code (4–20 chars, A-Z0-9, unique per seller, case-insensitive), discount t… | MVP | PRD §5.29 | FS §29 | area: API §3.25 | DB §7.5 | TC-PRC-004, TC-CPN-001, TC-CPN-002, TC-CPN-007 (+1) | Phase 4 |
| CPN-003 | Validation at apply-time and again at payment-confirmation time (time window, status, lim… | MVP | PRD §5.29 | FS §29 | area: API §3.25 | DB §7.5 | TC-CPN-002, TC-CPN-003 | Phase 4 |
| CPN-004 | Max one seller coupon per order; platform coupons Future | MVP | PRD §5.29 | FS §29 | area: API §3.25 | DB §7.5 | TC-CPN-003, TC-CPN-004, TC-CONC-005 | Phase 4 |
| CPN-005 | Usage limits enforced atomically (no over-redemption under concurrency); redemption is re… | MVP | PRD §5.29 | FS §29 | area: API §3.25 | kisaan_coupons, kisaan_coupon_redemptions | TC-CPN-004, TC-CPN-005 | Phase 4 |
| CPN-006 | Coupon cost is borne by the seller; commission is computed on the post-coupon price | MVP | PRD §5.29 | FS §29 | area: API §3.25 | DB §7.5 | TC-PRC-001, TC-CPN-006, TC-CPN-011 | Phase 4 |
| CPN-007 | Public coupons are displayed on the product page/store ("Use KINNOW10 till 20 Jan"); priv… | MVP | PRD §5.29 | FS §29 | GET `…/public/stores/:slug/coupons` (new-kisaan) | kisaan_coupons | TC-CPN-007 | Phase 4 |
| CPN-008 | Abuse prevention: per-user limits keyed on verified phone and PAN/GSTIN, device fingerpri… | MVP | PRD §5.29 | FS §29 | area: API §3.25 | kisaan_coupon_redemptions | TC-CPN-005, TC-CPN-006, TC-CPN-008, TC-CPN-010 | Phase 4 |
| CPN-009 | Limited-time coupons show the real end time; no fake countdowns (dark-pattern guidelines)… | MVP | PRD §5.29 | FS §29 | GET `…/public/stores/:slug/coupons` (new-kisaan) | DB §7.5 | TC-CPN-008, TC-CPN-009 | Phase 4 |
| CPN-010 | Coupon performance report (redemptions, discount given, GMV influenced) | MVP | PRD §5.29 | FS §29 | GET `…/me/store/coupons/:uuid/report` (new-kisaan) | DB §7.5 | TC-CPN-010 | Phase 4 |
| CPN-011 | Coupons on accepted negotiated offers are not allowed by default (negotiation already set… | MVP | PRD §5.29 | FS §29 | area: API §3.25 | kisaan_coupons | TC-PRC-003, TC-CPN-011 | Phase 4 |
| CPN-012 | Platform/admin coupons (platform-funded) | Future | PRD §5.29 | FS §29 | area: API §3.25 | kisaan_coupons | **GAP** | Future (not phased) |

### PRC — Pricing engine & discount stacking

Area links: FS §30 · API §3.10 (checkout quote) · DB §7.2 (kisaan_price_quotes, kisaan_order_item_pricing) · Screens: SCR-PAY-02, SCR-SRCH-03 · Roadmap: Phase 4

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| PRC-001 | A single pricing engine computes the effective price for any (listing, qty, buyer, contex… | MVP | PRD §5.30 | FS §24, FS §30 | area: API §3.10 (checkout quote) | DB §7.2 | TC-SRCH-005, TC-PRC-001, TC-PRC-009, E2E-02 (+1) | Phase 4 |
| PRC-002 | Stacking order: (1) base list price → (2) wholesale (best single tier or whole-lot) → (3)… | MVP | PRD §5.30 | FS §13, FS §24 (+2) | area: API §3.10 (checkout quote) | DB §7.2 | TC-PRC-001, TC-PRC-002 | Phase 4 |
| PRC-003 | Discounts are never applied in a way that makes the unit price < ₹0.01 or the order total… | MVP | PRD §5.30 | FS §24, FS §29 (+1) | area: API §3.10 (checkout quote) | kisaan_listings | TC-PRC-003, TC-PRC-004, TC-PRC-008 | Phase 4 |
| PRC-004 | Coupons apply after negotiation only if the coupon has allow_on_negotiated = true | MVP | PRD §5.30 | FS §24, FS §29 (+1) | area: API §3.10 (checkout quote) | kisaan_coupons | TC-PRC-003, TC-PRC-004 | Phase 4 |
| PRC-005 | Funding attribution in the breakdown: seller-funded (wholesale, coupon, member-only price… | MVP | PRD §5.30 | FS §24, FS §29 (+1) | area: API §3.10 (checkout quote) | kisaan_price_quotes | TC-ORD-007, TC-PRC-005, TC-PRC-008, TC-GRP-006 (+1) | Phase 4 |
| PRC-006 | Price quotes have a validity (e.g. 15 min on checkout) and are re-validated at payment co… | MVP | PRD §5.30 | FS §24, FS §29 | area: API §3.10 (checkout quote) | kisaan_price_quotes | TC-PRC-006, TC-PRC-010 | Phase 4 |
| PRC-007 | Rounding: unit prices to ₹0.01; line totals rounded half-up to ₹0.01; displayed per kg an… | MVP | PRD §5.30 | FS §24, FS §30 | area: API §3.10 (checkout quote) | DB §7.2 | TC-PRC-007 | Phase 4 |

### AUTH — Authentication & registration

Area links: FS §1 · API §2 · DB §4.1 · Screens: SCR-ONB-02 · Roadmap: Phase 1

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| AUTH-001 | Users register and log in with an Indian mobile number and a one-time password (OTP) sent… | MVP | PRD §5.1 | FS §1 | area: API §2 | kisaan_user_identities | TC-AUTH-001, TC-AUTH-003 | Phase 1 |
| AUTH-002 | OTP requests are rate-limited per number, device and IP | MVP | PRD §5.1 | FS §1 | area: API §2 | kisaan_user_identities, kisaan_otp_challenges | TC-AUTH-002, TC-SEC-003 | Phase 1 |
| AUTH-003 | Sessions use short-lived access tokens plus refresh tokens; a session can be revoked | MVP | PRD §5.1 | FS §1 | area: API §2 | kisaan_user_identities, kisaan_sessions | TC-AUTH-001, TC-AUTH-003, TC-AUTH-004 | Phase 1 |
| AUTH-004 | Optional email + password or SSO for business buyers and admins; MFA is mandatory for adm… | MVP | PRD §5.1 | FS §1 | POST `/auth/login` (existing-opsapi) | area: DB §4.1 | TC-AUTH-004, TC-AUTH-005 | Phase 1 |
| AUTH-005 | During registration the user selects a primary role and can add roles later (multi-role) | MVP | PRD §5.1 | FS §1 | area: API §2 | kisaan_user_roles | TC-AUTH-005, TC-AUTH-006 | Phase 1 |
| AUTH-006 | Registration is possible by voice or through the AI chat, including name, village, distri… | MVP | PRD §5.1 | FS §1 | area: API §2 | area: DB §4.1 | TC-AUTH-006, TC-AUTH-007 | Phase 1 |
| AUTH-007 | Consent capture during registration (privacy notice in the chosen language, purposes, mar… | MVP | PRD §5.1 | FS §1 | area: API §2 | kisaan_consents | TC-AUTH-007, TC-AUTH-008, E2E-01 | Phase 1 |
| AUTH-008 | Device binding and trusted-device list; login from a new device notifies the user | P2 | PRD §5.1 | FS §1 | GET `…/auth/sessions` (new-kisaan) | kisaan_user_identities | TC-AUTH-008 | P2 (Phase 7 / post-launch) |
| AUTH-009 | Account deletion request flow (DPDP right to erasure, subject to legal retention) | MVP | PRD §5.1 | FS §1 | POST `…/me/data-requests` (new-kisaan) | kisaan_data_requests | TC-AUTH-009 | Phase 1 |

### PROF — User profiles & multi-role

Area links: FS §2 · API §3.1, §3.2 · DB §4.2 · Screens: SCR-PROF-01, SCR-ONB-03..04 · Roadmap: Phase 1

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| PROF-001 | Each user has a base profile: name, photo, preferred language, district, contact preferen… | MVP | PRD §5.2 | FS §2 | area: API §3.1, §3.2 | area: DB §4.2 | TC-PROF-001 | Phase 1 |
| PROF-002 | Role-specific profiles: FarmerProfile (land acreage optional, crops, village), BuyerProfi… | MVP | PRD §5.2 | FS §2 | GET `…/me/seller-profile` (new-kisaan) | kisaan_seller_profiles | TC-AUTH-006, TC-PROF-002 | Phase 1 |
| PROF-003 | Multiple addresses (pickup points, delivery addresses, farm location with geo-pin) | MVP | PRD §5.2 | FS §2 | area: API §3.1, §3.2 | kisaan_addresses | TC-PROF-003 | Phase 1 |
| PROF-004 | Privacy settings: show or hide phone; contact via in-app chat only | MVP | PRD §5.2 | FS §2, FS §27 | area: API §3.1, §3.2 | kisaan_seller_profiles, kisaan_store_profiles, enquiries | TC-PROF-001, TC-STR-002, TC-AI-015 | Phase 1 |
| PROF-005 | Bank account / UPI ID for payouts, verified with a penny-drop | MVP | PRD §5.2 | FS §2 | area: API §3.1, §3.2 | kisaan_payout_accounts | TC-PROF-002, TC-PAY-009 | Phase 1 |
| PROF-006 | Verification badges are shown on the profile (phone verified, KYC verified, business veri… | MVP | PRD §5.2 | FS §2 | area: API §3.1, §3.2 | area: DB §4.2 | TC-PROF-003 | Phase 1 |
| PROF-007 | Reputation summary on the profile: rating, completed orders, on-time %, response time | MVP | PRD §5.2 | FS §2 | area: API §3.1, §3.2 | kisaan_seller_profiles | **GAP** | Phase 1 |

### ONB — Onboarding & verification

Area links: FS §3, §4 · API §3.2, §3.23 · DB §4.2, §4.3 · Screens: SCR-ONB-01..05, SCR-ADM-03 · Roadmap: Phase 1

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| ONB-001 | Guided seller onboarding by voice, chat or form: profile → pickup address → bank/UPI → KY… | MVP | PRD §5.3 | FS §3 | area: API §3.2, §3.23 | area: DB §4.2, §4.3 | TC-ONB-001 | Phase 1 |
| ONB-002 | Seller KYC tiers: T0 phone verified (can draft listings, cannot publish); T1 identity ver… | MVP | PRD §5.3 | FS §3 | area: API §3.2, §3.23 | kisaan_user_roles, kisaan_verification_records | TC-ONB-001, TC-ONB-002 | Phase 1 |
| ONB-003 | Identity verification uses lawful methods only (e.g. DigiLocker / offline Aadhaar XML or… | MVP | PRD §5.3 | FS §3 | area: API §3.2, §3.23 | kisaan_verification_records | TC-ONB-002, TC-ONB-003 | Phase 1 |
| ONB-004 | Assisted onboarding: field agents or support staff may onboard on behalf of a farmer, wit… | MVP | PRD §5.3 | FS §3 | area: API §3.2, §3.23 | kisaan_verification_records | TC-ONB-003, TC-ONB-004 | Phase 1 |
| ONB-005 | AI Trust agent pre-screens KYC (document legibility, name match, duplicate detection) and… | MVP | PRD §5.3 | FS §3 | area: API §3.2, §3.23 | kisaan_verification_records | TC-ONB-005 | Phase 1 |
| ONB-010 | Buyer onboarding captures buyer_type (individual, retailer, wholesaler, distributor, proc… | MVP | PRD §5.4 | FS §4 | area: API §3.2, §3.23 | kisaan_buyer_profiles | **GAP** | Phase 1 |
| ONB-011 | Buyer verification tiers mirror ONB-002; business buyers above ₹2,00,000 order value must… | MVP | PRD §5.4 | FS §4 | area: API §3.2, §3.23 | kisaan_user_roles | TC-ONB-004 | Phase 1 |
| ONB-012 | GSTIN verification against the GST public registry via a licensed provider [UNVERIFIED pr… | MVP | PRD §5.4 | FS §4 | area: API §3.2, §3.23 | kisaan_verification_records | TC-ONB-005 | Phase 1 |
| ONB-013 | Group Leader signup is a distinct flow (see GRP-001) | MVP | PRD §5.4 | FS §4 | area: API §3.2, §3.23 | area: DB §4.2, §4.3 | TC-ONB-006 | Phase 1 |
| ONB-014 | Transporter onboarding: identity, driving licence, vehicle RC, permit/insurance documents… | MVP | PRD §5.4 | FS §4 | area: API §3.2, §3.23 | kisaan_transporter_profiles, kisaan_verification_records | TC-ONB-007 | Phase 1 |

### PRD — Product management & listings

Area links: FS §5, §6 · API §3.3, §3.4 · DB §5.1, §5.2 · Screens: SCR-LST-01..06, SCR-ADM-04 · Roadmap: Phase 2

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| PRD-001 | Sellers create products (commodity + variety + attributes per the category schema) | MVP | PRD §5.5 | FS §5 | area: API §3.3, §3.4 | kisaan_listings | TC-PRD-001 | Phase 2 |
| PRD-002 | Create a listing via a form, AI chat, voice, photo or WhatsApp; all channels produce the… | MVP | PRD §5.5 | FS §5 | area: API §3.3, §3.4 | kisaan_listings | TC-PRD-002 | Phase 2 |
| PRD-003 | Up to 10 photos per listing; EXIF stripped; automatic compression for low bandwidth; firs… | MVP | PRD §5.5 | FS §5 | area: API §3.3, §3.4 | kisaan_listings, kisaan_listing_media | TC-PRD-003, TC-SEC-004 | Phase 2 |
| PRD-004 | AI-generated title and description in the seller's language with auto-translation to the… | MVP | PRD §5.5 | FS §5 | POST `…/listings/:uuid/translate` (new-kisaan) | kisaan_listings | TC-PRD-004 | Phase 2 |
| PRD-005 | Unit entry in kg, qtl or tonne, with automatic conversion and display of both units | MVP | PRD §5.5 | FS §5 | area: API §3.3, §3.4 | kisaan_listings | TC-PRD-004, TC-PRD-005 | Phase 2 |
| PRD-006 | Seller-declared grade is shown as "seller-declared"; AI photo assessment is shown only as… | MVP | PRD §5.5 | FS §5 | area: API §3.3, §3.4 | kisaan_listings | TC-PRD-005, TC-PRD-006, TC-AI-007 | Phase 2 |
| PRD-007 | Edit, pause, resume, close and duplicate a listing; edits to price or quantity while offe… | MVP | PRD §5.5 | FS §5 | PATCH `…/listings/:uuid` (new-kisaan) | kisaan_listings | TC-PRD-006, TC-PRD-007 | Phase 2 |
| PRD-008 | Prohibited and restricted items list (e.g. unlicensed agri-inputs, banned pesticides) blo… | MVP | PRD §5.5 | FS §5 | area: API §3.3, §3.4 | kisaan_listings | TC-PRD-007, TC-PRD-008 | Phase 2 |
| PRD-009 | Organic claims require a certificate upload to show the "certified organic" label; otherw… | P2 | PRD §5.5 | FS §5 | area: API §3.3, §3.4 | kisaan_listings | TC-PRD-008, TC-PRD-009 | P2 (Phase 7 / post-launch) |
| PRD-010 | Bulk listing upload (CSV) for large sellers | P2 | PRD §5.5 | FS §5 | area: API §3.3, §3.4 | area: DB §5.1, §5.2 | TC-PRD-010 | P2 (Phase 7 / post-launch) |
| PRD-020 | Listing states: Draft → Pending review (if flagged) → Active → Paused / Out of stock → Cl… | MVP | PRD §5.6 | FS §5, §6 | area: API §3.3, §3.4 | kisaan_listings | TC-PRD-009 | Phase 2 |
| PRD-021 | Listings have an availability window and expire automatically (default 30 days for grains… | MVP | PRD §5.6 | FS §5, §6 | area: API §3.3, §3.4 | kisaan_listings | TC-PRD-010 | Phase 2 |
| PRD-022 | Auto-moderation on publish: duplicate detection, price outlier detection against mandi ba… | MVP | PRD §5.6 | FS §5, §6 | area: API §3.3, §3.4 | kisaan_listings | TC-PRD-011 | Phase 2 |
| PRD-023 | A listing displays the seller's verification badges, rating, distance from the buyer, who… | MVP | PRD §5.6 | FS §5, §6 | area: API §3.3, §3.4 | kisaan_listings | **GAP** | Phase 2 |
| PRD-024 | Featured / promoted listings (paid) | Future | PRD §5.6 | FS §6 | area: API §3.3, §3.4 | area: DB §5.1, §5.2 | **GAP** | Future (not phased) |

### SRCH — Search, filters, product details

Area links: FS §7, §8, §9 · API §3.5 · DB §5.1, §5.2 · Screens: SCR-SRCH-01..03 · Roadmap: Phase 2

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| SRCH-001 | Keyword search across commodity, variety, title and description in all three languages an… | MVP | PRD §5.7 | FS §7 | area: API §3.5 | area: DB §5.1, §5.2 | TC-SRCH-001, TC-LANG-006 | Phase 2 |
| SRCH-002 | Natural-language and voice search through the AI Discovery agent | MVP | PRD §5.7 | FS §7 | area: API §3.5 | area: DB §5.1, §5.2 | TC-SRCH-002, E2E-02 | Phase 2 |
| SRCH-003 | Geo search by radius from the buyer's location or a chosen district | MVP | PRD §5.7 | FS §7 | area: API §3.5 | area: DB §5.1, §5.2 | TC-SRCH-002, TC-SRCH-003 | Phase 2 |
| SRCH-004 | Only Active listings with available quantity > 0 are returned; never out-of-stock or paus… | MVP | PRD §5.7 | FS §7 | GET `…/public/search/listings` (new-kisaan) | area: DB §5.1, §5.2 | TC-SRCH-003, TC-SRCH-004 | Phase 2 |
| SRCH-005 | Typo tolerance and synonyms dictionary managed by admin | MVP | PRD §5.7 | FS §7 | GET `/admin/search/synonyms` (new-kisaan) | kisaan_categories | TC-SRCH-001, TC-SRCH-005 | Phase 2 |
| SRCH-006 | Saved searches with alerts (feeds NOTF) | MVP | PRD §5.7 | FS §7 | GET `…/saved-searches[/:uuid]` (new-kisaan) | kisaan_saved_searches | TC-SRCH-006 | Phase 2 |
| SRCH-010 | Filters: category, commodity, variety, district, radius, price range, available quantity… | MVP | PRD §5.8 | FS §8 | area: API §3.5 | area: DB §5.1, §5.2 | **GAP** | Phase 2 |
| SRCH-011 | Sort: relevance, price (asc/desc, using the buyer's effective price for the requested qua… | MVP | PRD §5.8 | FS §8 | area: API §3.5 | area: DB §5.1, §5.2 | TC-SRCH-005 | Phase 2 |
| SRCH-012 | Category-specific filters are generated from the attribute schema (filterable = true) | MVP | PRD §5.8 | FS §8 | area: API §3.5 | kisaan_category_attributes | TC-SRCH-004 | Phase 2 |
| SRCH-020 | The product detail page shows photos, attributes, seller-declared grade, AI observation (… | MVP | PRD §5.9 | FS §9 | area: API §3.5 | area: DB §5.1, §5.2 | **GAP** | Phase 2 |
| SRCH-021 | Quantity selector computes the effective unit price and total live (PRC) | MVP | PRD §5.9 | FS §9 | area: API §3.5 | area: DB §5.1, §5.2 | TC-WHL-005 | Phase 2 |
| SRCH-022 | CTAs: Make offer, Buy now (at list/effective price), Ask question (enquiry), Add to group… | MVP | PRD §5.9 | FS §9 | area: API §3.5 | area: DB §5.1, §5.2 | **GAP** | Phase 2 |
| SRCH-023 | Public product pages are SEO-indexable and viewable logged out; contact details are hidde… | MVP | PRD §5.9 | FS §9 | area: API §3.5 | area: DB §5.1, §5.2 | TC-SRCH-007 | Phase 2 |

### ENQ — Enquiries & buyer requirements (RFQ)

Area links: FS §11 · API §3.7 · DB §6.1 · Screens: SCR-ENQ-01 · Roadmap: Phase 2 (enquiries) → Phase 3 (RFQ)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| ENQ-001 | A buyer can send a question/enquiry about a listing; it opens an in-app conversation thre… | MVP | PRD §5.11 | FS §11 | area: API §3.7 | enquiries | TC-ENQ-001 | Phase 2 (enquiries) → Phase 3 (RFQ) |
| ENQ-002 | A buyer can post a Buyer Requirement (RFQ): commodity, variety, qty, quality specs, deliv… | MVP | PRD §5.11 | FS §11 | area: API §3.7 | kisaan_buyer_requirements | TC-ENQ-002 | Phase 2 (enquiries) → Phase 3 (RFQ) |
| ENQ-003 | Sellers respond to an RFQ with a quotation (links to OFR) | MVP | PRD §5.11 | FS §11 | area: API §3.7 | area: DB §6.1 | TC-ENQ-003 | Phase 2 (enquiries) → Phase 3 (RFQ) |
| ENQ-004 | Enquiry spam control: max open enquiries per buyer per day; new-account limits | MVP | PRD §5.11 | FS §11 | area: API §3.7 | enquiries | TC-ENQ-003 | Phase 2 (enquiries) → Phase 3 (RFQ) |
| ENQ-005 | AI suggests answers to common enquiries for the seller to approve | P2 | PRD §5.11 | FS §11 | area: API §3.7 | area: DB §6.1 | **GAP** | P2 (Phase 7 / post-launch) |
| ENQ-006 | Public RFQs are visible to sellers in matching districts; the buyer's identity is hidden… | MVP | PRD §5.11 | FS §11 | GET `…/requirements/feed` (new-kisaan) | kisaan_buyer_requirements | TC-ENQ-002 | Phase 2 (enquiries) → Phase 3 (RFQ) |

### OFR — Offers, quotations, negotiation

Area links: FS §12, §13 · API §3.8, §3.9 · DB §6.2 · Screens: SCR-OFR-01..04 · Roadmap: Phase 3

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| OFR-001 | A buyer can make an offer on a listing: qty, price per unit, delivery terms (buyer pickup… | MVP | PRD §5.12 | FS §12 | area: API §3.8, §3.9 | DB §6.2 | TC-OFR-001, TC-OFR-008 | Phase 3 |
| OFR-002 | A seller can send a quotation in response to an RFQ (same structure) | MVP | PRD §5.12 | FS §12 | area: API §3.8, §3.9 | DB §6.2 | TC-OFR-002 | Phase 3 |
| OFR-003 | Multi-buyer quotation comparison: a seller sees all open offers on a listing in a compari… | MVP | PRD §5.12 | FS §12 | GET `…/listings/:uuid/offers/compare` (new-kisaan) | kisaan_offers | TC-OFR-003, TC-OFR-006 | Phase 3 |
| OFR-004 | Multi-seller comparison for buyers on their RFQ | MVP | PRD §5.12 | FS §12 | GET `…/requirements/:uuid/compare` (new-kisaan) | DB §6.2 | TC-OFR-004 | Phase 3 |
| OFR-005 | Offers do not reserve inventory until accepted (INV-002) | MVP | PRD §5.12 | FS §12 | area: API §3.8, §3.9 | DB §6.2 | TC-OFR-005 | Phase 3 |
| OFR-006 | A buyer may have at most one open offer per listing; new offers supersede old ones | MVP | PRD §5.12 | FS §12 | POST `…/listings/:uuid/offers` (new-kisaan) | kisaan_negotiations | TC-OFR-002, TC-OFR-006 | Phase 3 |
| OFR-007 | Auction / reverse auction (time-bound bidding) | Future | PRD §5.12 | FS §12 | area: API §3.8, §3.9 | DB §6.2 | TC-OFR-007 | Future (not phased) |
| OFR-010 | Either party can counter (price, qty, delivery terms, validity) and both parties see the… | MVP | PRD §5.13 | FS §13 | POST `…/negotiations/:uuid/counter` (new-kisaan) | DB §6.2 | TC-OFR-003 | Phase 3 |
| OFR-011 | Max 10 counter rounds per negotiation; the negotiation expires at validity | MVP | PRD §5.13 | FS §13 | area: API §3.8, §3.9 | kisaan_negotiations | TC-OFR-003 | Phase 3 |
| OFR-012 | Accept creates an "Agreed deal" → order draft (ORD) + inventory reservation; acceptance i… | MVP | PRD §5.13 | FS §13 | POST `…/negotiations/:uuid/accept` (new-kisaan) | kisaan_offers | TC-OFR-004 | Phase 3 |
| OFR-013 | Reject with an optional reason; withdraw by the offering party before acceptance | MVP | PRD §5.13 | FS §13 | area: API §3.8, §3.9 | DB §6.2 | TC-OFR-007 | Phase 3 |
| OFR-014 | AI Negotiation assistant drafts counteroffers and explains differences, but never sends w… | MVP | PRD §5.13 | FS §13 | area: API §3.8, §3.9 | kisaan_offers | TC-AI-013 | Phase 3 |
| OFR-015 | Auto-counter rules set by the seller (e.g. "auto-reject below ₹2,300/qtl") apply only as… | P2 | PRD §5.13 | FS §12, FS §13 | area: API §3.8, §3.9 | kisaan_listings | TC-OFR-005 | P2 (Phase 7 / post-launch) |

### ORD — Order management

Area links: FS §14 · API §3.10 · DB §7.1 · Screens: SCR-ORD-01..02, SCR-ADM-05 · Roadmap: Phase 4

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| ORD-001 | Orders are created from (a) Buy now checkout, (b) an accepted offer/quotation, or (c) a g… | MVP | PRD §5.14 | FS §14 | area: API §3.10 | kisaan_order_details | TC-ORD-001 | Phase 4 |
| ORD-002 | Order states: Pending payment → Confirmed → Ready for pickup → In transit → Delivered → C… | MVP | PRD §5.14 | FS §14 | area: API §3.10 | kisaan_order_details | TC-ORD-002 | Phase 4 |
| ORD-003 | Order pricing snapshot: unit price, wholesale tier applied, coupon, membership benefit, d… | MVP | PRD §5.14 | FS §14 | area: API §3.10 | kisaan_order_details | TC-ORD-001, TC-ORD-003 | Phase 4 |
| ORD-004 | Payment deadline for orders from accepted offers (default 24 h; 4 h for perishables) [DEC… | MVP | PRD §5.14 | FS §14 | area: API §3.10 | kisaan_categories, kisaan_inventory_reservations, kisaan_order_details | TC-ORD-003, TC-ORD-004 | Phase 4 |
| ORD-005 | Cancellation rules: free before dispatch; after dispatch only through a dispute; seller c… | MVP | PRD §5.14 | FS §14 | POST `…/orders/:uuid/cancel` (new-kisaan) | kisaan_order_details | TC-ORD-004, TC-ORD-005 | Phase 4 |
| ORD-006 | Buyer acceptance window after delivery (default 48 h, perishables 12 h) to confirm or rai… | MVP | PRD §5.14 | FS §14 | area: API §3.10 | kisaan_order_details | TC-ORD-005, TC-ORD-006, E2E-01 | Phase 4 |
| ORD-007 | Delivery weight reconciliation: actual delivered weight recorded; the price adjusts pro-r… | MVP | PRD §5.14 | FS §14 | POST `…/orders/:uuid/weight-reconciliation` (new-kisaan) | kisaan_order_details, kisaan_shipments | TC-ORD-006, TC-ORD-007 | Phase 4 |
| ORD-008 | Order list and detail per role, with timeline and documents (invoice, weighbridge slip, e… | MVP | PRD §5.14 | FS §14 | area: API §3.10 | kisaan_order_details | TC-ORD-007 | Phase 4 |
| ORD-009 | Partial fulfilment (split deliveries) | P2 | PRD §5.14 | FS §14 | area: API §3.10 | area: DB §7.1 | **GAP** | P2 (Phase 7 / post-launch) |

### PAY — Payments, refunds, settlement

Area links: FS §15 · API §3.11 · DB §7.3 · Screens: SCR-PAY-01..04, SCR-ADM-06 · Roadmap: Phase 4

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| PAY-001 | Buyer pays through a licensed Payment Aggregator (UPI, net banking, cards, UPI collect fo… | MVP | PRD §5.15 | FS §15 | area: API §3.11 | kisaan_offers | TC-PAY-001 | Phase 4 |
| PAY-002 | Marketplace split settlement: seller share, transporter share and platform commission/fee… | MVP | PRD §5.15 | FS §15 | area: API §3.11 | kisaan_settlements | TC-LOG-008, TC-PAY-002, TC-PAY-008, TC-PAY-009 | Phase 4 |
| PAY-003 | Seller settlement is released after the order is Completed (acceptance window passed or b… | MVP | PRD §5.15 | FS §15 | area: API §3.11 | kisaan_settlements | TC-ORD-005, TC-PAY-003, TC-PAY-008 | Phase 4 |
| PAY-004 | Payment confirmation only via a verified PA webhook + server-side verification; client ca… | MVP | PRD §5.15 | FS §10, FS §15 | POST `…/payments/:uuid/client-callback` (new-kisaan) | kisaan_payments | TC-PAY-001, TC-PAY-003, TC-PAY-004 | Phase 4 |
| PAY-005 | Idempotent payment creation and webhook processing | MVP | PRD §5.15 | FS §15 | area: API §3.11 | kisaan_payments, kisaan_payment_events | TC-PAY-002, TC-PAY-005, TC-PAY-011 | Phase 4 |
| PAY-006 | Failed payment handling: retry within the payment deadline, reservation maintained until… | MVP | PRD §5.15 | FS §15 | area: API §3.11 | DB §7.3 | TC-PAY-005, TC-PAY-006 | Phase 4 |
| PAY-007 | Refunds (full/partial) to the original payment method; triggered by cancellation, dispute… | MVP | PRD §5.15 | FS §15 | area: API §3.11 | kisaan_refunds | TC-DSP-002, TC-PAY-006, TC-PAY-007, TC-PAY-015 | Phase 4 |
| PAY-008 | Daily reconciliation of PA settlement reports against orders; mismatches surface in the f… | MVP | PRD §5.15 | FS §15 | GET `…/admin/reconciliation/runs[/:uuid]` (new-kisaan) | kisaan_ledger_entries | TC-PAY-008, TC-PAY-010, TC-PAY-014 | Phase 4 |
| PAY-009 | Payment history and pending payment view for each role ("Show my pending payments" via AI) | MVP | PRD §5.15 | FS §15 | GET `…/me/payments?status=pending` (new-kisaan) | DB §7.3 | TC-PAY-009 | Phase 4 |
| PAY-010 | Recurring payments for membership (UPI AutoPay / card e-mandate) | MVP | PRD §5.15 | FS §15, FS §26 | area: API §3.11 | kisaan_payment_mandates | TC-MEM-004, TC-PAY-010, TC-PAY-012 | Phase 4 |
| PAY-011 | Pay-later / credit terms for verified businesses | Future | PRD §5.15 | FS §15 | area: API §3.11 | area: DB §7.3 | TC-PAY-011 | Future (not phased) |
| PAY-012 | Cash-on-delivery | MVP | PRD §5.15 | FS §15 | area: API §3.11 | area: DB §7.3 | TC-PAY-012 | Phase 4 |
| PAY-013 | Provider-neutral PA adapter in the kisaan plugin (interface in §6); provider credentials… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | TC-PAY-013 | Phase 4 |
| PAY-014 | Seller payout onboarding: create PA linked account/vendor for each seller and transporter… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | TC-PAY-014 | Phase 4 |
| PAY-015 | Payment ledger (double-entry, append-only) recording every intent, capture, transfer, hol… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | TC-PAY-015 | Phase 4 |
| PAY-016 | Order-level payment intent created only from a server-side price quote (PRC-006); the amo… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Phase 4 |
| PAY-017 | Webhook endpoint verifies PA signature, stores the raw event, deduplicates by provider ev… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Phase 4 |
| PAY-018 | Transfers to seller/transporter created on hold at capture; released by settlement job wh… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Phase 4 |
| PAY-019 | Large-ticket payment rails: orders above ₹[threshold] default to UPI / net banking / bank… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Phase 4 |
| PAY-020 | Payment link for AI/WhatsApp flows: the AI can only request a checkout link (payment.requ… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Phase 4 |
| PAY-021 | Chargeback/dispute intake from PA webhooks → finance queue, evidence pack auto-assembled… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Phase 4 |
| PAY-022 | Commission & fee configuration per category, side (buyer/seller) and effective date; hist… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Phase 4 |
| PAY-023 | Group order payments: per-member payment intents linked to a group order; group order con… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Phase 4 |
| PAY-024 | Leader incentive payouts (if D-10 approves) from platform funds via PA payouts, after lea… | Future | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Future (not phased) |
| PAY-025 | Membership e-mandate lifecycle: create (with AFA), notify, debit, failure → grace, cancel… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Phase 4 |
| PAY-026 | Weight/quantity reconciliation adjustments: if delivered weight differs within tolerance,… | MVP | PAY&BM §7 | FS §15 | area: API §3.11 | area: DB §7.3 | **GAP** | Phase 4 |

### INVC — Invoices & receipts

Area links: FS §16 · API §3.12 · DB §7.4 · Screens: GAP (no dedicated screen; invoice link in SCR-ORD-02 not stated) · Roadmap: Phase 4

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| INVC-001 | A tax invoice / bill of supply is generated on behalf of the seller for each order (templ… | MVP | PRD §5.16 | FS §16 | area: API §3.12 | DB §7.4 | TC-INVC-001 | Phase 4 |
| INVC-002 | The platform's own GST invoice to the seller for commission/fees; to the buyer for member… | MVP | PRD §5.16 | FS §16 | area: API §3.12 | DB §7.4 | TC-INVC-002 | Phase 4 |
| INVC-003 | Payment receipts for every successful payment and refund | MVP | PRD §5.16 | FS §16 | area: API §3.12 | DB §7.4 | TC-INVC-003, TC-PAY-007 | Phase 4 |
| INVC-004 | Sequential, gap-free invoice numbering per issuer per financial year | MVP | PRD §5.16 | FS §16 | area: API §3.12 | kisaan_invoice_sequences | TC-INVC-004, TC-CONC-005 | Phase 4 |
| INVC-005 | E-invoicing (IRN) and e-way bill integration where thresholds apply | P2 | PRD §5.16 | FS §16 | area: API §3.12 | kisaan_invoices | TC-INVC-005 | P2 (Phase 7 / post-launch) |
| INVC-006 | GST TCS on e-commerce operator collections computed and reported where applicable | MVP | PRD §5.16 | FS §16 | area: API §3.12 | kisaan_order_details | TC-INVC-005 | Phase 4 |
| INVC-007 | Withholding computation: TDS (e-commerce participant) on seller payouts and GST TCS on ta… | MVP | PAY&BM §7 | FS §16 | area: API §3.12 | area: DB §7.4 | **GAP** | Phase 4 |
| INVC-008 | Seller monthly statement: gross sales, coupons, commission (if seller-side), TDS, TCS, ne… | MVP | PAY&BM §7 | FS §16 | area: API §3.12 | area: DB §7.4 | **GAP** | Phase 4 |
| INVC-009 | Membership invoices (platform's own GST invoice) on every charge; credit notes on refunds | MVP | PAY&BM §7 | FS §16 | area: API §3.12 | area: DB §7.4 | **GAP** | Phase 4 |
| INVC-010 | Credit/debit notes for post-invoice adjustments (partial refunds, weight differences) | MVP | PAY&BM §7 | FS §16 | area: API §3.12 | area: DB §7.4 | **GAP** | Phase 4 |

### LOG — Delivery / logistics

Area links: FS §17 · API §3.13 · DB §8 · Screens: SCR-LOG-01..07 · Roadmap: Phase 4 (minimal) → Phase 7

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| LOG-001 | Delivery modes per order: buyer self-pickup, seller-arranged, platform-arranged (transpor… | MVP | PRD §5.17 | FS §17 | area: API §3.13 | DB §8 | TC-LOG-001 | Phase 4 (minimal) → Phase 7 |
| LOG-002 | Transport request: pickup, drop, weight, commodity, date window, vehicle type; broadcast… | MVP | PRD §5.17 | FS §17 | POST `…/transport-requests` (new-kisaan) | kisaan_transport_requests | TC-LOG-002 | Phase 4 (minimal) → Phase 7 |
| LOG-003 | Transporters submit quotations; the requester compares (price, ETA, rating) and accepts w… | MVP | PRD §5.17 | FS §17 | area: API §3.13 | kisaan_transport_quotes | TC-LOG-003 | Phase 4 (minimal) → Phase 7 |
| LOG-004 | Shipment states: Assigned → En route to pickup → Picked up (with weighbridge weight + pho… | MVP | PRD §5.17 | FS §17 | area: API §3.13 | kisaan_shipments | TC-LOG-004, TC-LOG-007 | Phase 4 (minimal) → Phase 7 |
| LOG-005 | Status updates via one-tap, voice or WhatsApp reply; optional live location sharing (cons… | MVP | PRD §5.17 | FS §17 | area: API §3.13 | kisaan_shipments | TC-LOG-005 | Phase 4 (minimal) → Phase 7 |
| LOG-006 | AI Logistics agent estimates cost only when based on actual quotes or historical data; sh… | MVP | PRD §5.17 | FS §17 | GET `/api/v2/delivery/fee-estimate` (existing-opsapi) | DB §8 | TC-LOG-006 | Phase 4 (minimal) → Phase 7 |
| LOG-007 | Transporter vehicle management (type, capacity, RC, insurance expiry alerts) | MVP | PRD §5.17 | FS §17 | GET `…/me/vehicles[/:uuid]` (new-kisaan) | kisaan_vehicles | TC-ONB-007, TC-LOG-007 | Phase 4 (minimal) → Phase 7 |
| LOG-008 | Transporter payout after the shipment is Closed via PA split | MVP | PRD §5.17 | FS §17 | area: API §3.13 | kisaan_settlements | TC-LOG-008 | Phase 4 (minimal) → Phase 7 |
| LOG-009 | Integration with third-party logistics aggregators | Future | PRD §5.17 | FS §17 | area: API §3.13 | DB §8 | **GAP** | Future (not phased) |

### REV — Reviews & ratings

Area links: FS §18 · API §3.15 · DB §11.1 · Screens: GAP (no dedicated review screen) · Roadmap: Phase 2 (read only; write not phased explicitly)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| REV-001 | Two-way ratings after order completion: buyer→seller, seller→buyer, both→transporter (1–5… | MVP | PRD §5.18 | FS §18 | area: API §3.15 | DB §11.1 | TC-REV-001 | Phase 2 |
| REV-002 | Review window: 14 days after completion | MVP | PRD §5.18 | FS §18 | area: API §3.15 | kisaan_reviews | TC-REV-001, TC-REV-002 | Phase 2 |
| REV-003 | Ratings shown as an average plus count; new users show "New" until 3 ratings | MVP | PRD §5.18 | FS §18 | area: API §3.15 | DB §11.1 | TC-REV-002, TC-REV-003 | Phase 2 |
| REV-004 | Reviews moderated for abuse; the seller can reply once | MVP | PRD §5.18 | FS §18 | area: API §3.15 | kisaan_reviews | TC-REV-003 | Phase 2 |
| REV-005 | Group leader ratings by group members | MVP | PRD §5.18 | FS §18 | POST `…/groups/:uuid/leader-review` (new-kisaan) | kisaan_group_leader_profiles, kisaan_reviews | TC-GRP-011 | Phase 2 |

### NOTF — Notifications

Area links: FS §19 · API §3.14 · DB §11.2 · Screens: SCR-NOTF-01 · Roadmap: Phase 6

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| NOTF-001 | Channels: in-app, web push, SMS (transactional, DLT-registered), WhatsApp (template messa… | MVP | PRD §5.19 | FS §19 | area: API §3.14 | DB §11.2 | TC-NOTF-001 | Phase 6 |
| NOTF-002 | Per-user channel preferences and quiet hours (default 21:00–07:00, except critical) | MVP | PRD §5.19 | FS §19 | GET `…/me/notification-preferences` (new-kisaan) | kisaan_channel_optins | TC-NOTF-002 | Phase 6 |
| NOTF-003 | Notification types: offer received/countered/accepted/expiring, order updates, payment ev… | MVP | PRD §5.19 | FS §19 | area: API §3.14 | DB §11.2 | TC-NOTF-003 | Phase 6 |
| NOTF-004 | De-duplication and throttling: the same event is never notified twice on the same channel… | MVP | PRD §5.19 | FS §19 | area: API §3.14 | kisaan_notification_log | TC-SRCH-006, TC-NOTF-001 | Phase 6 |
| NOTF-005 | Notifications in the user's language; voice notifications (TTS audio on WhatsApp) for sel… | P2 | PRD §5.19 | FS §19 | area: API §3.14 | DB §11.2 | TC-NOTF-003 | P2 (Phase 7 / post-launch) |

### SUP — Customer support

Area links: FS §20 · API §4.2 · DB §11.3 · Screens: SCR-SUP-01..02 · Roadmap: GAP (support tickets not explicitly phased; AI-SUP Phase 5)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| SUP-001 | AI Support agent answers platform FAQs, order/payment status in-language, with citations… | MVP | PRD §5.20 | FS §20 | area: API §4.2 | DB §11.3 | TC-SUP-001 | GAP |
| SUP-002 | Ticket creation by AI or user, with category, linked order and attachments; escalation to… | MVP | PRD §5.20 | FS §20 | area: API §4.2 | DB §11.3 | TC-SUP-002 | GAP |
| SUP-003 | SLA tracking (first response ≤ 4 business hours for MVP) | MVP | PRD §5.20 | FS §20 | area: API §4.2 | DB §11.3 | TC-SUP-002, TC-SUP-003 | GAP |
| SUP-004 | Callback request (phone) for low-literacy users | MVP | PRD §5.20 | FS §20 | POST `…/support/callback-requests` (new-kisaan) | DB §11.3 | TC-AI-010 | GAP |
| SUP-005 | Grievance officer details and grievance redressal timelines displayed per e-commerce rule… | MVP | PRD §5.20 | FS §20 | GET `…/public/grievance-officer` (new-kisaan) | DB §11.3 | TC-SUP-003 | GAP |

### DSP — Disputes & refunds

Area links: FS §21 · API §4.2 · DB §11.3 · Screens: SCR-SUP-02, SCR-ADM-07 · Roadmap: Phase 4 (basic)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| DSP-001 | A buyer can raise a dispute within the acceptance window: quality mismatch, quantity/weig… | MVP | PRD §5.21 | FS §21 | area: API §4.2 | DB §11.3 | TC-DSP-001 | Phase 4 |
| DSP-002 | A seller can raise a dispute: non-payment, rejection without reason, buyer no-show | MVP | PRD §5.21 | FS §21 | area: API §4.2 | DB §11.3 | TC-DSP-002 | Phase 4 |
| DSP-003 | A dispute freezes the related settlement until resolution | MVP | PRD §5.21 | FS §21 | area: API §4.2 | kisaan_settlements, kisaan_disputes | TC-DSP-001, TC-DSP-003, TC-PAY-008, TC-PAY-015 | Phase 4 |
| DSP-004 | Resolution options: full refund (with return logistics), partial refund / price adjustmen… | MVP | PRD §5.21 | FS §21 | area: API §4.2 | DB §11.3 | TC-DSP-002 | Phase 4 |
| DSP-005 | Dispute SLA: initial response 24 h; resolution target 7 days | MVP | PRD §5.21 | FS §21 | area: API §4.2 | kisaan_disputes | **GAP** | Phase 4 |
| DSP-006 | AI summarises evidence and the timeline for the human resolver; it never decides | MVP | PRD §5.21 | FS §21 | area: API §4.2 | kisaan_disputes | TC-DSP-003 | Phase 4 |
| DSP-007 | Third-party quality inspection on request (paid) | P2 | PRD §5.21 | FS §21 | area: API §4.2 | DB §11.3 | **GAP** | P2 (Phase 7 / post-launch) |

### ADM — Admin dashboard & moderation

Area links: FS §22 · API §3.16 · DB §7.6, §13 · Screens: SCR-ADM-01..14 · Roadmap: Phase 1 → Phase 2 → Phase 5

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| ADM-001 | User management (search, view, suspend, role change, impersonate-read-only with audit) | MVP | PRD §5.22 | FS §22 | area: API §3.16 | area: DB §7.6, §13 | TC-ADM-001 | Phase 1 → Phase 2 → Phase 5 |
| ADM-002 | Verification queue (KYC, business, leader, transporter) with AI risk annotations | MVP | PRD §5.22 | FS §22 | GET `/admin/verification-queue?type=&status=` (new-kisaan) | kisaan_verification_records | TC-ADM-002 | Phase 1 → Phase 2 → Phase 5 |
| ADM-003 | Listing moderation queue (flagged listings, prohibited items, price outliers, duplicates) | MVP | PRD §5.22 | FS §22 | GET `/admin/moderation/listings?flag=` (new-kisaan) | area: DB §7.6, §13 | TC-ADM-003 | Phase 1 → Phase 2 → Phase 5 |
| ADM-004 | Order / payment / settlement monitoring; manual hold/release with dual approval for finan… | MVP | PRD §5.22 | FS §15, FS §22 | GET `/admin/orders?status=&risk=` (new-kisaan) | kisaan_settlements | TC-ADM-001, TC-ADM-004 | Phase 1 → Phase 2 → Phase 5 |
| ADM-005 | Dispute console | MVP | PRD §5.22 | FS §22 | GET `/admin/disputes[/:uuid]` (new-kisaan) | area: DB §7.6, §13 | **GAP** | Phase 1 → Phase 2 → Phase 5 |
| ADM-006 | Commission and fee configuration per category (effective-dated) | MVP | PRD §5.22 | FS §15, FS §22 | GET `/admin/commission-rules` (new-kisaan) | DB §7.6 | TC-ADM-002 | Phase 1 → Phase 2 → Phase 5 |
| ADM-007 | Category and attribute schema management; synonyms | MVP | PRD §5.22 | FS §22 | POST `…/admin/categories[/:uuid]` (new-kisaan) | kisaan_categories | **GAP** | Phase 1 → Phase 2 → Phase 5 |
| ADM-008 | Membership plan and T&C version management | MVP | PRD §5.22 | FS §22 | GET `/admin/membership-plans[/:uuid]` (new-kisaan) | area: DB §7.6, §13 | **GAP** | Phase 1 → Phase 2 → Phase 5 |
| ADM-009 | Platform coupons | Future | PRD §5.22 | FS §22 | area: API §3.16 | area: DB §7.6, §13 | **GAP** | Future (not phased) |
| ADM-010 | AI agent monitoring: invocation counts, success/failure, approval rates, cost per agent,… | MVP | PRD §5.22 | FS §22 | GET `/admin/ai/metrics` (new-kisaan) | area: DB §7.6, §13 | TC-ADM-004 | Phase 1 → Phase 2 → Phase 5 |
| ADM-011 | Fraud / risk console (Trust agent flags) | MVP | PRD §5.22 | FS §22 | GET `/admin/risk/flags` (new-kisaan) | area: DB §7.6, §13 | **GAP** | Phase 1 → Phase 2 → Phase 5 |
| ADM-012 | Audit log viewer (immutable) | MVP | PRD §5.22 | FS §22 | GET `/admin/audit-log?entity=&actor=` (new-kisaan) | kisaan_audit_log | TC-ADM-003, TC-SEC-009 | Phase 1 → Phase 2 → Phase 5 |
| ADM-013 | Feature flags and platform configuration (TTLs, thresholds) | MVP | PRD §5.22 | FS §22 | GET `/admin/settings[/:key]` (new-kisaan) | kisaan_settings | **GAP** | Phase 1 → Phase 2 → Phase 5 |

### ANL — Analytics & reporting

Area links: FS §23 · API §3.16 (/admin/dashboard/kpis) · GAP (no analytics/event tables in DB schema) · Screens: SCR-ADM-13 · Roadmap: Phase 7

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| ANL-001 | KPI dashboard: users by role and verification, active listings by category, orders, GMV,… | MVP | PRD §5.23 | FS §23 | GET `/admin/dashboard/kpis?from=&to=` (new-kisaan) | GAP | TC-ANL-001 | Phase 7 |
| ANL-002 | Event tracking taxonomy (see ADMIN/analytics doc) with consented analytics only | MVP | PRD §5.23 | FS §23 | area: API §3.16 (/admin/dashboard/kpis) | GAP | TC-ANL-001 | Phase 7 |
| ANL-003 | Seller insights: views, enquiries, offers, conversion, average realised price vs mandi mo… | MVP | PRD §5.23 | FS §23 | area: API §3.16 (/admin/dashboard/kpis) | GAP | **GAP** | Phase 7 |
| ANL-004 | Buyer spend reports, exportable CSV | P2 | PRD §5.23 | FS §23 | area: API §3.16 (/admin/dashboard/kpis) | GAP | **GAP** | P2 (Phase 7 / post-launch) |
| ANL-005 | Crop availability forecasting (aggregated listing data); clearly labelled as indicative | Future | PRD §5.23 | FS §23 | area: API §3.16 (/admin/dashboard/kpis) | GAP | **GAP** | Future (not phased) |

### AI — AI assistant & agents

Area links: AI-ARCH · API §3.17, §3.18 · DB §12 · Screens: SCR-AI-01 · Roadmap: Phase 5

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| AI-001 | A persistent AI assistant ("Kisaan Sahayak") is available on every screen (floating mic +… | MVP | PRD §6.1 | AI-ARCH | area: API §3.17, §3.18 | area: DB §12 | TC-AI-001 | Phase 5 |
| AI-002 | Intent understanding across pa/hi/en and mixed/romanised input; role-aware (acts in the u… | MVP | PRD §6.1 | AI-ARCH | area: API §3.17, §3.18 | area: DB §12 | TC-AI-001, TC-AI-002 | Phase 5 |
| AI-003 | Slot filling: the AI asks only for missing required information, one question at a time f… | MVP | PRD §6.1 | AI-ARCH | area: API §3.17, §3.18 | area: DB §12 | TC-AI-002, TC-AI-003, TC-AI-004 | Phase 5 |
| AI-004 | The AI acts only via tools using the end-user's scoped permissions; it cannot access othe… | MVP | PRD §6.1 | AI-ARCH | area: API §3.17, §3.18 | area: DB §12 | TC-AI-004, TC-AI-005, TC-AI-015 | Phase 5 |
| AI-005 | Multi-step task tracking ("listing draft 80% complete") resumable across sessions and cha… | MVP | PRD §6.1 | AI-ARCH | area: API §3.17, §3.18 | kisaan_ai_conversations | TC-AI-003, TC-AI-005, E2E-08 | Phase 5 |
| AI-006 | Every AI-generated fact about prices, availability or status cites its source and timesta… | MVP | PRD §6.1 | AI-ARCH | area: API §3.17, §3.18 | kisaan_ai_messages | TC-AI-006, E2E-01 | Phase 5 |
| AI-007 | Graceful fallback: on low confidence or repeated misunderstanding → offer conventional sc… | MVP | PRD §6.1 | AI-ARCH | area: API §3.17, §3.18 | area: DB §12 | TC-AI-007, TC-AI-010, TC-PI-004 | Phase 5 |
| AI-008 | Conversation history is visible to the user; users can delete their AI history (subject t… | MVP | PRD §6.1 | AI-ARCH | GET `/v1/conversations?page=` (ai-gateway) | area: DB §12 | TC-AI-008, TC-AI-016 | Phase 5 |
| AI-009 | AI usage limits per user per day to control cost; premium AI features potentially in a pa… | MVP | PRD §6.1 | AI-ARCH | GET `…/ai/budget/:user_uuid` (new-kisaan) | area: DB §12 | TC-AI-009, TC-AI-014 | Phase 5 |
| AI-010 | Listing (AI-LST) | MVP | PRD §6.2 | FS §5 | area: API §3.17, §3.18 | area: DB §12 | TC-AI-003, TC-AI-010 | Phase 5 |
| AI-011 | Discovery (AI-DSC) | MVP | PRD §6.2 | FS §7 | area: API §3.17, §3.18 | area: DB §12 | TC-AI-003, TC-AI-011 | Phase 5 |
| AI-012 | Price Intelligence (AI-PRI) | MVP | PRD §6.2 | AI-ARCH | area: API §3.17, §3.18 | area: DB §12 | TC-AI-003, TC-AI-012 | Phase 5 |
| AI-013 | Matching (AI-MAT) | MVP | PRD §6.2 | FS §11 | area: API §3.17, §3.18 | area: DB §12 | TC-AI-003, TC-AI-012, TC-AI-013, E2E-01 | Phase 5 |
| AI-014 | Negotiation (AI-NEG) | MVP | PRD §6.2 | FS §12, FS §13 | area: API §3.17, §3.18 | area: DB §12 | TC-OFR-006, TC-AI-003, TC-AI-013, TC-AI-014 | Phase 5 |
| AI-015 | Logistics (AI-LGX) | MVP | PRD §6.2 | FS §17 | area: API §3.17, §3.18 | area: DB §12 | TC-LOG-006, TC-AI-003, TC-AI-015 | Phase 5 |
| AI-016 | Trust (AI-TRS) | MVP | PRD §6.2 | AI-ARCH | area: API §3.17, §3.18 | area: DB §12 | TC-GRP-010, TC-AI-003, TC-AI-009, TC-AI-016 | Phase 5 |
| AI-017 | Notification (AI-NTF) | MVP | PRD §6.2 | FS §19 | area: API §3.17, §3.18 | area: DB §12 | TC-AI-003 | Phase 5 |
| AI-018 | Support (AI-SUP) | MVP | PRD §6.2 | FS §20 | area: API §3.17, §3.18 | area: DB §12 | TC-SUP-001, TC-AI-003, TC-AI-011 | Phase 5 |
| AI-019 | Seller performance insights | P2 | PRD §6.2 | AI-ARCH | area: API §3.17, §3.18 | area: DB §12 | **GAP** | P2 (Phase 7 / post-launch) |
| AI-020 | Crop availability forecasting / demand discovery | Future | PRD §6.2 | AI-ARCH | area: API §3.17, §3.18 | area: DB §12 | **GAP** | Future (not phased) |

### APR — Approvals (human-in-the-loop)

Area links: FS §31; AI-ARCH · API §3.19 · DB §12 (kisaan_approval_requests) · Screens: SCR-AI-02 · Roadmap: Phase 5

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| APR-001 | Action classes: read (no approval), draft (no approval, nothing external happens), commit… | MVP | PRD §6.3 | FS §13, FS §31 | area: API §3.19 | kisaan_listings, kisaan_approval_requests | TC-INV-007, TC-DSP-003, TC-AI-005 | Phase 5 |
| APR-002 | An approval shows a plain-language summary in the user's language (and TTS readback for v… | MVP | PRD §6.3 | FS §13 | area: API §3.19 | kisaan_approval_requests | TC-VOX-005 | Phase 5 |
| APR-003 | Approval mechanisms: tap "Approve" in app; voice "haan, confirm" plus readback confirmati… | MVP | PRD §6.3 | FS §13 | area: API §3.19 | kisaan_approval_requests | **GAP** | Phase 5 |
| APR-004 | Approvals expire (default 15 min) and are bound to the exact action parameters (hash); an… | MVP | PRD §6.3 | FS §13 | area: API §3.19 | kisaan_price_quotes, kisaan_approval_requests | TC-AI-005, TC-PI-013 | Phase 5 |
| APR-005 | Users can set no auto-approve for commit-class actions in MVP | MVP | PRD §6.3 | FS §31; AI-ARCH | area: API §3.19 | kisaan_approval_requests | **GAP** | Phase 5 |
| APR-006 | All approvals are audit-logged (who, what, when, channel, the AI conversation reference) | MVP | PRD §6.3 | FS §31; AI-ARCH | area: API §3.19 | kisaan_approval_requests, kisaan_audit_log | TC-SEC-009 | Phase 5 |
| APR-007 | Assisted/delegated actors (support agents, field agents) need the user's OTP consent for… | MVP | PRD §6.3 | FS §20, FS §31 | POST `…/approvals/:uuid/otp` (new-kisaan) | kisaan_legal_acceptances, kisaan_approval_requests | TC-ONB-003 | Phase 5 |
| APR-108 | High-risk approvals (e.g. order total > configurable threshold, first transaction with a… | MVP | AI-ARCH §5.1 | FS §31; AI-ARCH | area: API §3.19 | area: DB §12 | **GAP** | Phase 5 |
| APR-109 | Users can view and revoke pending approvals from an "Approvals" inbox. | MVP | AI-ARCH §5.1 | FS §31; AI-ARCH | area: API §3.19 | area: DB §12 | **GAP** | Phase 5 |
| APR-110 | Standing / delegated approvals (e.g. "auto-counter any offer below ₹X") are not in MVP. | Future | AI-ARCH §5.1 | FS §31; AI-ARCH | area: API §3.19 | area: DB §12 | **GAP** | Future (not phased) |

### VOX — Voice & multilingual

Area links: AI-ARCH · API §3.17 (/v1/voice/*) · DB §12 (kisaan_ai_messages.audio_object_key) · Screens: SCR-AI-01 · Roadmap: Phase 6

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| VOX-001 | Languages: Punjabi (Gurmukhi, pa-IN), Hindi (hi-IN), English (en-IN); UI, AI responses an… | MVP | PRD §6.4 | AI-ARCH | area: API §3.17 (/v1/voice/*) | area: DB §12 | TC-VOX-001, TC-VOX-008, TC-LANG-001, TC-LANG-002 (+2) | Phase 6 |
| VOX-002 | Speech-to-text for pa/hi/en and code-mixed speech; push-to-talk; noise robustness for out… | MVP | PRD §6.4 | AI-ARCH | area: API §3.17 (/v1/voice/*) | area: DB §12 | TC-VOX-001, TC-VOX-002, TC-VOX-003, TC-VOX-007 (+1) | Phase 6 |
| VOX-003 | Text-to-speech replies in the user's language with adjustable speed; "repeat" command | MVP | PRD §6.4 | AI-ARCH | area: API §3.17 (/v1/voice/*) | area: DB §12 | TC-VOX-003, TC-VOX-006, TC-VOX-008 | Phase 6 |
| VOX-004 | Automatic language detection per utterance; the user can lock a language | MVP | PRD §6.4 | AI-ARCH | area: API §3.17 (/v1/voice/*) | area: DB §12 | TC-VOX-004, TC-VOX-008 | Phase 6 |
| VOX-005 | Domain vocabulary: crop names, varieties, local units (e.g. "man", "killa/acre"), place n… | MVP | PRD §6.4 | AI-ARCH | area: API §3.17 (/v1/voice/*) | area: DB §12 | TC-VOX-002, TC-VOX-005, TC-VOX-008 | Phase 6 |
| VOX-006 | Numerals and quantities confirmed by readback before any action ("Sau quintal, matlab 10,… | MVP | PRD §6.4 | FS §32 | area: API §3.17 (/v1/voice/*) | area: DB §12 | TC-AI-002, TC-VOX-002, TC-VOX-005, TC-VOX-006 (+1) | Phase 6 |
| VOX-007 | Low-literacy UX: icons with text, audio prompts on key screens, minimal typing | MVP | PRD §6.4 | AI-ARCH | area: API §3.17 (/v1/voice/*) | area: DB §12 | TC-VOX-007, TC-VOX-008, TC-LANG-003 | Phase 6 |
| VOX-008 | Voice notes in chats (enquiries, negotiation, support) with transcription | P2 | PRD §6.4 | AI-ARCH | area: API §3.17 (/v1/voice/*) | area: DB §12 | TC-VOX-008 | P2 (Phase 7 / post-launch) |
| VOX-009 | Additional languages (Haryanvi-influenced Hindi, Gujarati, Marathi …) | Future | PRD §6.4 | AI-ARCH | area: API §3.17 (/v1/voice/*) | area: DB §12 | **GAP** | Future (not phased) |
| VOX-110 | Additional languages (e.g. Haryanvi-accented Hindi, Gujarati, Marathi) through configurat… | Future | AI-ARCH §11.1 | AI-ARCH | area: API §3.17 (/v1/voice/*) | area: DB §12 | **GAP** | Future (not phased) |
| VOX-111 | IVR / missed-call channel for feature phones. | Future | AI-ARCH §11.1 | AI-ARCH | area: API §3.17 (/v1/voice/*) | area: DB §12 | **GAP** | Future (not phased) |

### WA — WhatsApp channel

Area links: AI-ARCH · API §3.14 (/public/webhooks/whatsapp) · DB §11.2 (kisaan_channel_optins) · Screens: n/a (WhatsApp channel) · Roadmap: Phase 6 (notifications) → Phase 7/P2 (conversational)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| WA-001 | Official WhatsApp Business Platform integration (no unofficial clients) | MVP | PRD §6.5 | AI-ARCH | area: API §3.14 (/public/webhooks/whatsapp) | area: DB §11.2 | area: TC-PI-007, TC-PI-012 (partial) | Phase 6 (notifications) → Phase 7/P2 (conversational) |
| WA-002 | Explicit opt-in captured and stored; opt-out via "STOP" honoured immediately | MVP | PRD §6.5 | AI-ARCH | GET `…/me/channel-optins` (new-kisaan) | kisaan_channel_optins | area: TC-PI-007, TC-PI-012 (partial) | Phase 6 (notifications) → Phase 7/P2 (conversational) |
| WA-003 | Users can talk to the KISAAN AI on WhatsApp (text + voice notes) to list, search, check o… | MVP | PRD §6.5 | AI-ARCH | area: API §3.14 (/public/webhooks/whatsapp) | area: DB §11.2 | area: TC-PI-007, TC-PI-012 (partial) | Phase 6 (notifications) → Phase 7/P2 (conversational) |
| WA-004 | Commit actions on WhatsApp use interactive buttons + readback; payments via a PA payment… | MVP | PRD §6.5 | AI-ARCH | area: API §3.14 (/public/webhooks/whatsapp) | area: DB §11.2 | area: TC-PI-007, TC-PI-012 (partial) | Phase 6 (notifications) → Phase 7/P2 (conversational) |
| WA-005 | Proactive messages use approved templates only (outside the 24 h session window) | MVP | PRD §6.5 | AI-ARCH | area: API §3.14 (/public/webhooks/whatsapp) | area: DB §11.2 | area: TC-PI-007, TC-PI-012 (partial) | Phase 6 (notifications) → Phase 7/P2 (conversational) |
| WA-006 | Store/listing share links with rich previews | MVP | PRD §6.5 | AI-ARCH | area: API §3.14 (/public/webhooks/whatsapp) | area: DB §11.2 | area: TC-PI-007, TC-PI-012 (partial) | Phase 6 (notifications) → Phase 7/P2 (conversational) |
| WA-107 | WhatsApp Flows (forms) for structured listing creation. | P2 | AI-ARCH §12 | AI-ARCH | area: API §3.14 (/public/webhooks/whatsapp) | area: DB §11.2 | area: TC-PI-007, TC-PI-012 (partial) | P2 (Phase 7 / post-launch) |

### MKT — Mandi price data

Area links: AI-ARCH (AI-PRI) · API §4.1 · DB §14 · Screens: SCR-MKT-01 · Roadmap: Phase 5

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| MKT-001 | Ingest daily mandi prices (min/max/modal) from official open-data sources (e.g. AGMARKNET… | MVP | PRD §6.6 | AI-ARCH (AI-PRI) | area: API §4.1 | DB §14 | **GAP** | Phase 5 |
| MKT-002 | Store source, market, commodity, variety, date, fetch time; never overwrite historical re… | MVP | PRD §6.6 | AI-ARCH (AI-PRI) | area: API §4.1 | kisaan_mandi_prices | **GAP** | Phase 5 |
| MKT-003 | Every displayed price shows source + market + date; stale data (> 3 days) is labelled sta… | MVP | PRD §6.6 | FS §9 | GET `…/public/mandi/prices?commodity=&market=&district=&from=&to=` (new-kisaan) | DB §14 | TC-AI-006 | Phase 5 |
| MKT-004 | Price alerts: notify the user when the modal price for a commodity/market crosses their t… | MVP | PRD §6.6 | AI-ARCH (AI-PRI) | GET `…/price-alerts[/:uuid]` (new-kisaan) | kisaan_price_alerts | **GAP** | Phase 5 |
| MKT-005 | Trends and inter-market comparison charts (7/30/90 days) where data exists | MVP | PRD §6.6 | AI-ARCH (AI-PRI) | GET `…/public/mandi/compare?commodity=&markets=` (new-kisaan) | DB §14 | **GAP** | Phase 5 |
| MKT-006 | No price forecasts in MVP; any future forecast is labelled indicative with methodology | Future | PRD §6.6 | AI-ARCH (AI-PRI) | GET `…/public/mandi/trend?commodity=&market=&days=30` (new-kisaan) | DB §14 | TC-AI-008 | Future (not phased) |
| MKT-007 | MSP display for MSP crops (official source, season) | MVP | PRD §6.6 | AI-ARCH (AI-PRI) | GET `…/public/msp?commodity=` (new-kisaan) | kisaan_msp_rates | **GAP** | Phase 5 |

### SEC — Security

Area links: SEC&C §2 · cross-cutting · DB §13 (audit, consents) · Screens: cross-cutting · Roadmap: Phase 1 → Phase 8 (audit/pen-test)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| SEC-001 | Primary login is mobile number + 6-digit OTP, sent by SMS via a TRAI DLT-registered heade… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-001 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-002 | OTP validity is 5 minutes and single use. It is stored only as a salted hash and bound to… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-002 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-003 | OTP limits: max 3 sends per phone per 15 min and 10 per day; max 5 verify attempts per OT… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-003 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-004 | Sessions use opsapi JWT access tokens (short TTL, target 15 min) plus refresh tokens (tar… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-004 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-005 | The HS256 signing secret is held in the secret manager (never in the image or repo), is ≥… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-005 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-006 | Step-up OTP (fresh OTP within the last 5 min) is required for: approvals with value ≥ the… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-006 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-007 | Device binding: record a device fingerprint on login. A new device triggers an in-app + S… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-007 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-008 | Users can list active sessions and log out one or all devices. Changing the phone number… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-008 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-009 | Admin and internal staff accounts use opsapi email/password + mandatory 2FA (email-OTP at… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-010 | Machine-to-machine access (AI Gateway, ingestion jobs) uses opsapi API keys (opsk_…) scop… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-010 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-011 | Shared family phones [ASSUMPTION A-51]: one phone number maps to exactly one KISAAN accou… | MVP | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-011 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-012 | WhatsApp channel: the WhatsApp sender's phone must match a verified KISAAN account. Commi… | P2 | SEC&C §2.1 | SEC&C §2 | cross-cutting | area: DB §13 | TC-SEC-012 | P2 (Phase 7 / post-launch) |
| SEC-020 | Deny by default: every endpoint declares its permission. Unknown or missing permission re… | MVP | SEC&C §2.2 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-021 | Object-level authorisation: a seller can only mutate their own store, listings, inventory… | MVP | SEC&C §2.2 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-022 | Multi-role users act under an explicit active role (UI role switcher; AI context active_r… | MVP | SEC&C §2.2 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-023 | Admin sub-roles follow least privilege: Support Agent (read orders/users, write tickets),… | MVP | SEC&C §2.2 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-024 | Four-eyes rule: refunds above a threshold [DECISION D-85], manual settlement release, com… | MVP | SEC&C §2.2 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-025 | KYC documents are viewable only by Verifier and Super Admin, and every view is audit-logg… | MVP | SEC&C §2.2 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-026 | Contact details (phone) of counterparties are hidden until an order or accepted offer exi… | MVP | SEC&C §2.2 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-027 | Public endpoints (/api/v2/kisaan/public/...: stores, listings, groups, mandi prices) expo… | MVP | SEC&C §2.2 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-030 | TLS 1.2+ everywhere (TLS 1.3 preferred) with HSTS. Cloudflare at the edge with WAF manage… | MVP | SEC&C §2.3 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-031 | Every request carries Authorization: Bearer + X-Namespace-Slug. Tokens are never accepted… | MVP | SEC&C §2.3 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-032 | Idempotency-Key (UUID) is mandatory on all money- and stock-affecting POSTs (checkout, pa… | MVP | SEC&C §2.3 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-033 | Payment-gateway webhooks are verified by HMAC signature (gateway secret), checked for tim… | MVP | SEC&C §2.3 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-034 | Outbound opsapi webhooks consumed by the AI Gateway/Notification agent are signed and ver… | MVP | SEC&C §2.3 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-035 | CORS: only KISAAN web origins. CSRF: the web app uses Bearer tokens in memory plus a refr… | MVP | SEC&C §2.3 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-036 | Security headers: CSP (no inline scripts except hashed), X-Content-Type-Options, Referrer… | MVP | SEC&C §2.3 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-037 | Error responses follow opsapi {error:{code,message,context}} and never leak stack traces,… | MVP | SEC&C §2.3 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-038 | OpenAPI specs for Kisaan endpoints, with schema validation in contract tests; API invento… | MVP | SEC&C §2.3 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-040 | Encryption in transit for all hops (client↔edge↔ingress↔services; services↔Postgres/Redis… | MVP | SEC&C §2.4 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-041 | Encryption at rest: Postgres volumes, backups, MinIO/S3 buckets (SSE), Redis persistence… | MVP | SEC&C §2.4 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-042 | Field-level encryption (application-layer AES-256-GCM, envelope keys from KMS/secret mana… | MVP | SEC&C §2.4 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-043 | KYC documents and images go in a separate private bucket, accessed via short-lived (≤5 mi… | MVP | SEC&C §2.4 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-044 | Masking in UI and logs: phone 98xxxxxx21, PAN ABxxxxx4F, bank xxxxxx6789. | MVP | SEC&C §2.4 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-045 | Keys are rotated yearly, with crypto-shredding capability for erased users' encrypted fie… | MVP | SEC&C §2.4 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-046 | Secrets (DB, JWT, PA, SMS, WhatsApp, LLM keys) live in the secret manager / sealed Kubern… | MVP | SEC&C §2.4 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-050 | Allowed types: product photos JPEG/PNG/WebP/HEIC; KYC docs JPEG/PNG/PDF; voice notes Opus… | MVP | SEC&C §2.5 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-051 | Size limits: photos ≤10 MB (client downscales to ≤1600 px before upload for low bandwidth… | MVP | SEC&C §2.5 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-052 | Uploads go direct to object storage via a pre-signed PUT into a quarantine prefix. An asy… | MVP | SEC&C §2.5 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-053 | Product images are re-encoded to WebP plus thumbnails; original bytes are never served pu… | MVP | SEC&C §2.5 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-054 | Filenames are server-generated UUIDs; user filenames are never used in paths. | MVP | SEC&C §2.5 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-055 | AI vision input uses only clean, re-encoded images. Text found in images is treated as un… | MVP | SEC&C §2.5 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-056 | Duplicate/stolen photo detection via perceptual hash across listings (Trust agent signal). | MVP | SEC&C §2.5 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-060 | Server-side schema validation on every Kisaan endpoint (types, ranges, enums, max lengths… | MVP | SEC&C §2.6 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-061 | Domain bounds: quantity >0 and ≤ configured max per category (e.g. 10,000 t); price per u… | MVP | SEC&C §2.6 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-062 | Parameterised queries only (opsapi models / prepared statements); no string-built SQL in… | MVP | SEC&C §2.6 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-063 | Free text (listing descriptions, chat, reviews): Unicode normalisation (NFC), allowed scr… | MVP | SEC&C §2.6 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-064 | Phone numbers in E.164 (+91) and validated; PAN/GSTIN/IFSC regex + checksum (GSTIN) befor… | MVP | SEC&C §2.6 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-070 | The limits above are configurable in admin config without redeploy. | MVP | SEC&C §2.7 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-071 | Limits apply per user and per device/IP to resist multi-account abuse. | MVP | SEC&C §2.7 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-072 | Breaches feed Trust agent signals (not automatic bans, except OTP lockouts). | MVP | SEC&C §2.7 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-075 | Verification tiers: T0 phone verified → T1 profile + location + selfie/photo → T2 ID docu… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-076 | Duplicate detection: perceptual image hash, near-duplicate text, same bank account / PAN… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-077 | Anti-scraping on public stores and listings: edge caching, bot management, no bulk-export… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-078 | Fake reviews: reviews only from completed orders, one per order per side, velocity and te… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-079 | Coupon abuse: per-user limits enforced server-side in a transaction, device/phone/bank li… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-080 | Group-leader abuse (fake leaders): T2+PAN+manual approval, public leader rating, member f… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-081 | Price-anomaly signals: listing price far outside the mandi reference band or category his… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-082 | Payment fraud signals: many failed payments, refund ratio, chargebacks, payout bank chang… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-083 | Transporter signals: POD mismatch (GPS/OTP), repeated no-shows, quote-then-renegotiate pa… | P2 | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | P2 (Phase 7 / post-launch) |
| SEC-084 | Flag workflow: Trust flag → admin queue with evidence and explanation → human decision (d… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-085 | Model governance: risk rules and model features are documented, reviewed for bias (e.g. a… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-086 | Bot sign-up defence: OTP limits, device attestation (Play Integrity for a future native a… | MVP | SEC&C §2.8 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-090 | The AI Gateway has no direct database access. All actions go through the tool layer calli… | MVP | SEC&C §2.9 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-091 | Tool classes: read, draft, commit. Commit-class effects (publish listing, send/accept/rej… | MVP | SEC&C §2.9 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-092 | Approval requests are bound to an exact payload hash (amount, quantity, counterparty, pri… | MVP | SEC&C §2.9 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-093 | Untrusted content isolation: listing text, buyer messages, reviews, OCR from images, web/… | MVP | SEC&C §2.9 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-094 | Tool allow-list per agent (least privilege). For example, the Price Intelligence agent ha… | MVP | SEC&C §2.9 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-095 | Tool arguments are schema-validated server-side. Cross-user identifiers are rejected unle… | MVP | SEC&C §2.9 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-096 | Output guardrails: no invented prices (mandi data is shown only with source + timestamp f… | MVP | SEC&C §2.9 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-097 | Data minimisation to LLM vendors: only the fields needed for the task; KYC numbers, bank… | MVP | SEC&C §2.9 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-098 | AI audit trail: every agent execution logs conversation id, agent, tool calls (name, args… | MVP | SEC&C §2.9 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-099 | Red-team suite (prompt injection in listings, reviews, voice and images; jailbreaks; cros… | MVP | SEC&C §2.9 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-100 | Reuse opsapi audit/activity logs for core events. KISAAN adds kisaan_audit_events for dom… | MVP | SEC&C §2.10 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-101 | Audit records hold actor (user / admin / AI-on-behalf-of-user with approval id / system j… | MVP | SEC&C §2.10 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-102 | Audit tables are append-only: no UPDATE/DELETE grants for the application role. A daily h… | MVP | SEC&C §2.10 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-103 | Retention ≥ 1 year (DPDP Rule 8(3) minimum, CMP-006); financial records ≥ 8 years [TAX RE… | MVP | SEC&C §2.10 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-104 | Security monitoring alerts: admin logins from new IPs, bulk data access, repeated 403s, O… | MVP | SEC&C §2.10 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-110 | Postgres: continuous WAL archiving + daily full base backup → RPO ≤ 15 min; point-in-time… | MVP | SEC&C §2.13 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-111 | Backups are encrypted (separate key), stored in a different region/provider account from… | MVP | SEC&C §2.13 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-112 | Object storage (photos, KYC docs, invoices): versioning + cross-region replication; KYC b… | MVP | SEC&C §2.13 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-113 | RTO ≤ 4 h for the core marketplace; AI Gateway is stateless and redeployable. | MVP | SEC&C §2.13 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-114 | Quarterly restore drill to an isolated environment with verification queries; results rec… | MVP | SEC&C §2.13 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-115 | Redis is treated as a cache/queue (not system of record). Payment and inventory state is… | MVP | SEC&C §2.13 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-120 | Incident response runbook with roles (incident commander, comms, legal/DPO, engineering),… | MVP | SEC&C §2.14 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-121 | Personal data breach (DPDP Rule 7, CMP-004): see the timeline below. | MVP | SEC&C §2.14 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-122 | CERT-In: report cyber incidents to CERT-In within the timeline in the CERT-In Directions… | MVP | SEC&C §2.14 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-123 | Payment incidents: notify the PA immediately; PA/RBI incident obligations follow the PA a… | MVP | SEC&C §2.14 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-124 | Evidence preservation: snapshot logs, keep forensic copies, keep a chain of custody. | MVP | SEC&C §2.14 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-125 | Annual tabletop exercise covering a breach scenario plus a payment-fraud scenario. | MVP | SEC&C §2.14 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-126 | Post-incident review within 10 working days, with tracked corrective actions. | MVP | SEC&C §2.14 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-130 | Code review on all changes; SAST (Lua + TypeScript), dependency scanning, container image… | MVP | SEC&C §2.15 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-131 | Kisaan image built FROM bwalia/opsapi:1.0.<N> (immutable tag, digest pinned); SBOM genera… | MVP | SEC&C §2.15 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-132 | Separate dev/staging/prod environments, secrets and data; production data never copied to… | MVP | SEC&C §2.15 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-133 | Pre-launch third-party penetration test (web, API, AI prompt injection, payments); then a… | MVP | SEC&C §2.15 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-134 | Least-privilege cloud IAM; break-glass access logged; production DB access only via basti… | MVP | SEC&C §2.15 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-135 | Vulnerability disclosure policy and security.txt. | MVP | SEC&C §2.15 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |
| SEC-136 | Kubernetes hardening: non-root containers, read-only root filesystems where possible, net… | MVP | SEC&C §2.15 | SEC&C §2 | cross-cutting | area: DB §13 | area: TC-SEC-001..013, TC-PI-001..015, TC-RBAC-001..009 | Phase 1 → Phase 8 (audit/pen-test) |

### PRIV — Privacy / DPDP

Area links: SEC&C §2.11 · API §3.1 (/me/consents, /me/data-requests) · DB §13, §16 · Screens: SCR-PROF-01 (settings) · Roadmap: Phase 1 (consent capture)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| PRIV-001 | A standalone privacy notice (DPDP Rule 3) in Punjabi, Hindi and English, with an itemised… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-002 | Granular consent toggles, never pre-ticked: (a) core marketplace processing (required to… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-003 | Consent records: kisaan_consents (user, purpose, notice version, language, channel — app/… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-004 | Withdrawal "as easy as giving": a one-tap toggle in Settings → Privacy, the voice command… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-005 | 18+ only: age declaration at signup; under-18 sign-ups blocked (avoids the verifiable-par… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-006 | Data principal rights: access/export, correction, erasure, nomination, grievance. Self-se… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-007 | Erasure honours legal holds: transaction, invoice and tax records and logs needed for leg… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-008 | Purpose limitation: KYC data is used only for verification, payouts and legal compliance,… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-009 | Location precision: public views show village/tehsil/district; the exact pickup address i… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-010 | Voice data: raw audio is processed transiently for STT and not retained by default [DECIS… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-011 | Processor contracts (DPAs) with the cloud, SMS, WhatsApp BSP, PA, KYC vendor, STT/TTS and… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-012 | Cross-border transfer register: list each vendor's processing location; prefer India regi… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-013 | Privacy-by-design reviews (lightweight DPIA) for each new feature touching personal data;… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-014 | Cookie/analytics: first-party privacy-preserving analytics; no third-party ad trackers in… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |
| PRIV-015 | WhatsApp opt-in recorded with timestamp, channel and the wording shown (also DPDP evidenc… | MVP | SEC&C §2.11 | SEC&C §2.11 | area: API §3.1 (/me/consents, /me/data-requests) | area: DB §13, §16 | area: TC-SEC-007, TC-SEC-010, TC-SEC-011, TC-AUTH-008 | Phase 1 |

### CMP — Regulatory compliance

Area links: SEC&C §3 · cross-cutting · cross-cutting · Screens: cross-cutting · Roadmap: Phase 0 (opinions) → Phase 8 (sign-off)

| Req ID | Requirement (short) | Scope | Source | FS / spec | API | DB | Tests | Phase |
|---|---|---|---|---|---|---|---|---|
| CMP-001 | The DPDP Rules 2025 were notified as G.S.R. 846(E), gazette dated 13 Nov 2025. Rule 4 (Co… | Legal req | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-002 | Notice: standalone, clear, itemised data and purposes, links to withdraw consent / exerci… | Legal req | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-003 | Consent must be free, specific, informed, unconditional, unambiguous, by clear affirmativ… | Legal req [LEGAL] | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-004 | Breach (Rule 7): inform affected Data Principals without delay; inform the Board without… | Legal req | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-005 | Children = under 18; verifiable parental consent; no tracking or targeted ads at children… | Legal req | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-006 | Security safeguards (Rule 6): encryption/masking/tokenisation, access control, logging an… | Legal req | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-007 | Rights requests answered within 90 days max (Rule 14); KISAAN targets ≤15 days. Publish a… | Legal req | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-008 | Erasure after 3 years' inactivity with 48 h notice applies to e-commerce entities with ≥2… | Legal req | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-009 | Significant Data Fiduciary duties (DPO in India, independent auditor, annual DPIA, algori… | Legal req | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-010 | Penalties up to ₹250 crore (security safeguards), ₹200 crore (breach notification, childr… | Legal req | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-011 | Consent Managers: KISAAN need not become one, but may later need to accept consent artefa… | Assumption | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-012 | Cross-border transfer allowed except to restricted countries (s.16). Relevant to non-Indi… | Legal req | SEC&C §3.2 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-020 | Rules notified as G.S.R. 462(E), 23 Jul 2020; they apply to marketplace e-commerce entiti… | Legal req [LEGAL] | SEC&C §3.3 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-021 | Entity duties (Rule 4): be a company; appoint a nodal person resident in India; display l… | Legal req | SEC&C §3.3 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-022 | Cancellation charges on a consumer's post-confirmation cancellation only if the platform… | Legal req | SEC&C §3.3 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-023 | No price manipulation for unreasonable profit; no discrimination between consumers of the… | Legal req | SEC&C §3.3 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-024 | Marketplace duties (Rule 5): seller undertaking that descriptions and images are accurate… | Legal req | SEC&C §3.3 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-025 | Seller duties collected and displayed (Rule 6): prior written contract (seller agreement… | Legal req | SEC&C §3.3 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-026 | Status of the 2021 draft amendments (flash sales, Chief Compliance Officer, DPIIT registr… | Legal review [LEGAL] | SEC&C §3.3 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-027 | Dark Patterns Guidelines 2023 (CPA s.18; 13 patterns). Required design: membership — one-… | Legal req | SEC&C §3.3 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-028 | CCPA advisory of 5 Jun 2025 asks platforms to self-audit dark patterns → documented self-… | Legal req | SEC&C §3.3 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-030 | Agriculturists are not liable to register for supply of produce from cultivation (CGST s.… | Legal req | SEC&C §3.4 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-031 | Loose/unbranded wheat, rice, wheat flour not "pre-packaged and labelled" are nil-rated; p… | Legal req [TAX] | SEC&C §3.4 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-032 | KISAAN as e-commerce operator: compulsory GST registration regardless of turnover (s.24(x… | Legal req [TAX] | SEC&C §3.4 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-033 | GST on KISAAN revenue: commission/platform fee generally 18%; the entry 54(g) exemption (… | Assumption [TAX] | SEC&C §3.4 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-034 | Coupons/discounts: treatment of platform-funded vs seller-funded discounts affects value… | Assumption [TAX] | SEC&C §3.4 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-035 | E-invoicing mandatory above ₹5 crore aggregate annual turnover (since 1 Aug 2023); the 30… | Legal req | SEC&C §3.4 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-036 | E-way bill above ₹50,000 consignment value, but nil-rated goods are exempt (Rule 138(14))… | Legal req | SEC&C §3.4 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-037 | Income-tax TDS by ECO on gross sales of e-commerce participants: 0.1% (former s.194-O fro… | Legal req [TAX] | SEC&C §3.4 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-038 | Group-leader coordination fees likely attract TDS on commission; leader GST status (agent… | Assumption [TAX] | SEC&C §3.4 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-039 | Market-fee / RDF pass-through (if any): whether it forms part of value of supply. | Assumption [TAX] | SEC&C §3.4 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-040 | Punjab Agricultural Produce Markets Act 1961 s.6: after notification of a market area, no… | Legal req | SEC&C §3.5 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-041 | Reported Punjab levies on wheat/paddy: ~3% market fee + ~3% Rural Development Fee (Punjab… | Legal req | SEC&C §3.5 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-042 | Punjab APM (Second Amendment) Act 2017: private market yards (s.7C), direct marketing (s.… | Legal req | SEC&C §3.5 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-043 | The 2020 central farm laws (fee-free "trade area") were repealed (Farm Laws Repeal Act 20… | Legal req | SEC&C §3.5 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-044 | Working analysis: Punjab market areas reportedly cover the state, so buyers of wheat/padd… | Assumption [LEGAL] | SEC&C §3.5 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-045 | MSP procurement runs through state agencies/FCI via arhtiyas in notified mandis — KISAAN… | Legal req | SEC&C §3.5 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-046 | Launch gating [DECISION D-80]: wheat and paddy checkout in Punjab is feature-flagged OFF… | Recommendation | SEC&C §3.5 | SEC&C §3 | GET `/admin/category-state-rules` (new-kisaan), GET `…/public/trade-rules?category=&state=` (new-kisaan) | kisaan_buyer_profiles, kisaan_category_state_rules, kisaan_order_levies | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-047 | Model APLM Act 2017 (optional for states): Punjab adopted it "excepting few major provisi… | Legal req | SEC&C §3.5 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-050 | FSSAI e-commerce guidance (Order 2 Feb 2017, later folded into Licensing Regulations): e-… | Legal req | SEC&C §3.6 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-051 | Raw agricultural produce is "food", but FSSAI's 31 May 2016 order says mandi traders shou… | Assumption [LEGAL] | SEC&C §3.6 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-052 | Because KISAAN takes orders and payments, it likely needs a Central Licence as an e-comme… | Assumption [LEGAL] | SEC&C §3.6 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-053 | Legal Metrology (Packaged Commodities) declarations must be shown for pre-packaged goods… | Legal req | SEC&C §3.6 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-055 | Pesticides: Insecticides Rules Rule 10E (2022) permits licensees to sell via e-commerce;… | Legal req | SEC&C §3.7 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-056 | Fertilisers: Fertiliser (Control) Order 1985 — dealers need a certificate of registration… | Legal req | SEC&C §3.7 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-057 | Seeds: dealer licence under the Seeds (Control) Order 1983; labelling/certification for n… | Legal req | SEC&C §3.7 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-058 | Recommendation for when agri-inputs are enabled: onboard only licensed sellers; verify CI… | Recommendation | SEC&C §3.7 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-060 | RBI (Regulation of Payment Aggregators) Directions 2025 (15 Sep 2025): non-bank PAs need… | Legal req | SEC&C §3.8 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-061 | KISAAN must not collect buyer funds into its own account and pay sellers later — that is… | Assumption [LEGAL] | SEC&C §3.8 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-062 | Shortlist: Razorpay Route (Linked Accounts, transfers, settlement hold until conditions s… | Recommendation | SEC&C §3.8 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-063 | Membership recurring payments: RBI E-mandate Framework 2026 (21 Apr 2026): registration w… | Legal req | SEC&C §3.8 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-064 | Group leaders must not collect members' money in MVP: risks of an unauthorised payment sy… | Assumption | SEC&C §3.8 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-065 | Simplified PA due diligence for merchants with turnover ≤ ₹40 lakh (contact-point verific… | Legal req | SEC&C §3.8 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-070 | Puttaswamy (2018) struck down Aadhaar Act s.57 (private use by contract). The Aadhaar Goo… | Legal req | SEC&C §3.9 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-071 | Offline verification (Aadhaar Offline Verification Regulations 2021): inform purpose and… | Legal req | SEC&C §3.9 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-072 | Verify PAN via an authorised service (Protean/UTIITSL or KYC vendor); GSTIN via the GST p… | Recommendation | SEC&C §3.9 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-080 | KISAAN is an intermediary. s.79 safe harbour needs IT Rules 2021 due diligence: publish r… | Legal req | SEC&C §3.10 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-081 | IT Rules Amendment 2026 (notified ~10 Feb 2026, in force ~20 Feb 2026): synthetically gen… | Legal req | SEC&C §3.10 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-082 | MeitY AI advisory (1 Mar 2024, revised 15 Mar 2024): label under-tested/unreliable AI out… | Legal req | SEC&C §3.10 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-090 | TRAI TCCCPR 2018: all commercial SMS, including transactional OTP, via DLT — Principal En… | Legal req | SEC&C §3.11 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |
| CMP-091 | WhatsApp Business: opt-in required before business-initiated messages, stating the user a… | Legal req | SEC&C §3.11 | SEC&C §3 | cross-cutting | cross-cutting | **GAP** | Phase 0 (opinions) → Phase 8 (sign-off) |

## 7. Maintenance

- When a requirement is added or changed, update the defining document first, then regenerate this matrix and resolve any new GAPs.
- Pull requests in the Kisaan repo should reference requirement IDs in the description; test files should carry the `TC-*` ID and the requirement IDs they verify.
- Related registers: [RISKS_AND_ASSUMPTIONS](RISKS_AND_ASSUMPTIONS.md) (D-/A-/R- IDs), [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md) (BR-* business rules), [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md) (C-01..C-14 opsapi contract register, tested by TC-OPS-001..014).
