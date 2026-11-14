# KISAAN — Product Requirements Document (PRD)

> Status: Draft v0.2 · Last updated: 2026-11-14 · Owner: Head of Product (KISAAN) · Source of truth index: [README](README.md)
>
> **v0.2 changes (Master Prompt v2):** one KISAAN AI with tools replaces the v0.1 orchestrator + agents (D-101); buyer types defined (normal / bulk / group leader / group member, D-104) with a separate bulk-buyer onboarding path (KIS-BULK-*); seller-defined **group discount** and group-coupon rules added (D-103, owner doc [PRICING_ENGINE](PRICING_ENGINE.md)); full coupon field set (D-105); scope tiers re-based on the Phase 0–10 roadmap (D-106); KPIs per prompt §34 (§8); cross-cutting principles (KIS-REQ-*) in §7.0.


Related: [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md) · [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) · [WHOLESALE_AND_GROUP_BUYING](WHOLESALE_AND_GROUP_BUYING.md) · [SELLER_STORE_AND_INVENTORY](SELLER_STORE_AND_INVENTORY.md) · [COUPON_AND_MEMBERSHIP](COUPON_AND_MEMBERSHIP.md) · [PRICING_ENGINE](PRICING_ENGINE.md) · [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md) · [UX_UI_SPECIFICATION](UX_UI_SPECIFICATION.md) · [API_SPECIFICATION](API_SPECIFICATION.md) · [DATABASE_SCHEMA](DATABASE_SCHEMA.md) · [REQUIREMENTS_TRACEABILITY](REQUIREMENTS_TRACEABILITY.md) · [RISKS_AND_ASSUMPTIONS](RISKS_AND_ASSUMPTIONS.md)

---

## 0. How to read this document

- Every requirement has a stable ID `KIS-<DOMAIN>-<NNN>` (e.g. `KIS-GROUP-005`). IDs are never reused. If a requirement is removed, it is marked **Withdrawn** or **Retired (v0.2)** and kept in the table. Tests use `KIS-TEST-<DOMAIN>-NNN`, business rules `BR-<DOMAIN>-NN`, screens `SCR-<DOMAIN>-NN`.
- **Priority / scope tiers (v0.2, D-106):** **MVP** = roadmap Phases 0–7 in full, plus Phase 8 *basic* (Punjabi/Hindi/English text + push-to-talk voice) and Phase 9 *basic* (buyer self-pickup and seller-arranged delivery) — the Punjab pilot launch. **P2** = the rest of Phases 8–10 (platform transporter marketplace, live tracking, richer voice), first 6 months after launch. **Future** = later. See [DEVELOPMENT_ROADMAP](DEVELOPMENT_ROADMAP.md).
- The six confirmed must-have features are **WHL, GROUP, MEMBER, STORE, INV and COUPON**. They are MVP unless a row is marked "⚠ Partial MVP".
- **Owner documents.** This PRD states *what* is required. Normative rules live in the owner docs: pricing/stacking → [PRICING_ENGINE](PRICING_ENGINE.md); wholesale, bulk buyers, groups, leader permissions → [WHOLESALE_AND_GROUP_BUYING](WHOLESALE_AND_GROUP_BUYING.md); store, inventory, concurrency → [SELLER_STORE_AND_INVENTORY](SELLER_STORE_AND_INVENTORY.md); coupons and membership → [COUPON_AND_MEMBERSHIP](COUPON_AND_MEMBERSHIP.md); search, catalogue, offers, order state machines → [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md); the AI → [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md). If a rule here conflicts with its owner doc, the owner doc wins.
- Acceptance criteria use **Given / When / Then**. The functional specification expands them into full workflows, business rules (`BR-*`) and edge cases.
- Markers: `[ASSUMPTION A-nn]`, `[DECISION D-nn]`, `[UNVERIFIED]`, `[LEGAL REVIEW]`, `[TAX REVIEW]`. All of them are collected in [RISKS_AND_ASSUMPTIONS](RISKS_AND_ASSUMPTIONS.md).
- This PRD does not define API endpoints or tables. Ownership by backend (`[OPSAPI: reuse|extend|new]`) is set in [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md).

---

## 1. Product summary

KISAAN is an **AI-first, voice-first agricultural marketplace**. It connects farmers and agricultural sellers with verified buyers: retailers, wholesalers, processors, restaurants, exporters and group-buying area leaders. Transporters move the goods. Users can run every major workflow by **speaking or chatting in Punjabi, Hindi or English, including mixed and romanised language**. One central **KISAAN AI** — a single assistant using secure, permission-checked tools — drafts listings, finds matches, compares prices and offers, organises group purchases and coordinates logistics. Users stay in control: **KISAAN AI never commits the user to anything without explicit approval** (APR-*).

### 1.1 Goals (pilot, first 12 months after MVP launch)

| # | Goal | Measure (see §8) |
|---|---|---|
| G1 | Farmers can list produce in under 2 minutes by voice, with no typing | Median voice listing time |
| G2 | Buyers find verified supply that matches quantity, location and quality | Search-to-enquiry conversion |
| G3 | Transactions complete end to end on-platform: offer → order → payment → delivery | GMV, completed orders |
| G4 | Users trust the platform | Verified-user share, dispute rate, repeat rate |
| G5 | AI measurably reduces manual work | % of listings and offers drafted by AI and approved without edits |
| G6 | Bulk economics (wholesale tiers, group buying, membership) drive repeat purchasing | Share of GMV using WHL/GROUP/MEMBER |

### 1.2 Non-goals (explicitly out of scope for MVP)

- KISAAN does not act as a **trader or principal**. It does not take title to goods. KISAAN is a marketplace e-commerce entity `[LEGAL REVIEW]`.
- KISAAN does not hold or escrow funds itself. All money flows through a licensed Payment Aggregator (see [PAYMENT_AND_BUSINESS_MODEL](PAYMENT_AND_BUSINESS_MODEL.md)).
- No guaranteed prices, price predictions or demand forecasts are presented as fact. Estimates are always labelled with source, date and confidence.
- AI image analysis does **not** certify quality or grade. Certified quality inspection is P2, run by human inspectors.
- No credit, lending, input financing or insurance in MVP.
- No sale of agri-inputs (seeds, fertilisers, pesticides) in MVP, because of licensing (see §3).
- No native mobile apps in MVP. MVP ships as a PWA plus a WhatsApp channel.
- In MVP a group leader does not collect money on behalf of members (see KIS-GROUP-013 and `[LEGAL REVIEW]`).
- KISAAN does not run multiple AI agents. There is exactly one KISAAN AI (D-101); background automation (trust rules, notifications, matching scores) is ordinary deterministic backend logic.
- The platform transporter marketplace (bidding, live tracking) is not in MVP (D-106): MVP delivery is buyer self-pickup or seller-arranged.
- MVP does not cover cross-border or export documentation, although exporters can buy domestically.

---

## 2. Personas

| Persona | Profile | Goals | Pain points | Primary channel |
|---|---|---|---|---|
| **P1 — Gurpreet, Punjab farmer (seller)** | 45, owns 12 acres near Moga. Grows wheat (rabi) and paddy (kharif). Uses WhatsApp and YouTube. Reads Gurmukhi slowly and types very little. | Gets a better price than the local commission agent offers, gets paid on time, avoids mandi queues for non-MSP lots | Opaque prices, delayed payments, transport hassle, distrust of apps | Voice in Punjabi, WhatsApp, PWA |
| **P2 — Rajesh, mandi trader / arhtiya-style buyer** | Runs a trading firm in Khanna mandi. Buys 200–2,000 qtl per week. Has a GSTIN. | Steady supply of the right grade, fewer middle layers, credit terms | Inconsistent quality, verifying sellers, logistics coordination | PWA on desktop and mobile, phone calls |
| **P3 — Neha, retailer (kirana / F&V shop)** | Runs a fruit and vegetable shop in Ludhiana. Buys 2–10 qtl of potato or onion per week. | Fresh stock at wholesale price, delivered | Small volumes don't unlock wholesale rates | PWA in Hindi/English |
| **P4 — Amit, processor (flour mill / food processor)** | Procurement manager at an atta mill. Buys 500+ tonnes of wheat per season. | Contracted volume at known moisture and grade, with invoices for GST input credit | Grade disputes, documentation | Desktop PWA, email |
| **P5 — Harjit, group leader (area leader)** | Runs a village cooperative or is a colony RWA member. Aggregates demand from 20–50 households or shops. | Unlocks wholesale tiers for the group, earns reputation, maybe a leader incentive later | Coordinating members, collecting money, trust | WhatsApp groups, PWA |
| **P6 — Balwinder, transporter** | Owns 2 trucks (a 10-tonne and a 16-tonne). Operates in the Moga–Ludhiana–Jalandhar region. | Fills empty return trips, gets paid reliably | Idle days, payment delays | Voice, WhatsApp, PWA |
| **P7 — Priya, platform admin / ops** | KISAAN operations team member | Verifies users, moderates listings, resolves disputes, monitors fraud and AI | Volume of manual checks | Admin web console |

**Buyer types (D-104 — use these definitions everywhere):**

| Buyer type | How they join | What they can do | Persona examples |
|---|---|---|---|
| **Normal (individual) buyer** | Default buyer sign-up | Buy listed quantities (tier pricing applies automatically), apply coupons, use KISAAN Plus, join groups | P3 Neha |
| **Bulk buyer** | Separate bulk-buyer onboarding path (`/signup/bulk-buyer`, KIS-BULK-001) capturing business type, products, typical quantity, frequency, delivery areas, budget range, quality, preferred sellers; optional GSTIN/business verification | Everything a normal buyer can do, plus buyer requirements (RFQ) at scale, recurring procurement, whole-lot offers, negotiated quotations | P2 Rajesh, P4 Amit |
| **Group leader** | A verified user approved through the leader application (KIS-GROUP-001); holds `group_leader` for the groups they lead | Create and run a buying group, invite members, publish the group requirement, review and share seller offers, lock the group order | P5 Harjit |
| **Group member** | Any logged-in, phone-verified buyer who joins a group | Commit their own quantity, see group aggregates, pay for their own allocation directly through KISAAN's payment provider | Households/shops in P5's area |

Leaders are shown with a **"Verified Group Leader"** badge and the mandatory disclaimer: *"Group leaders are independent KISAAN users, not KISAAN employees or representatives."* (KIS-GROUP-019).

Supporting roles: Support Agent, Verifier/Moderator, Finance Ops, Quality Inspector (P2) and Warehouse Operator (Future). Role names follow the conventions file: `seller`, `buyer`, `group_leader`, `transporter`, `admin`, `support_agent`, `verifier`, `finance`, `inspector`. One person may hold several roles; for example, a farmer can also be a buyer.

---

## 3. Product categories

### 3.1 Category tree (2 levels in MVP, extensible to N levels)

| Category (L1) | Example L2 / commodities | Scope | Notes |
|---|---|---|---|
| Cereals — Wheat | Wheat (HD-3086, PBW-725, PBW-826, DBW-187 …) | **MVP** | MSP context; procurement-season sensitivity |
| Cereals — Rice / Paddy | Paddy (PR-126, Pusa-44*, Basmati 1121/1509/1718), Rice (milled) | **MVP** | *Variety bans vary by state/season — validate [UNVERIFIED] |
| Cereals — Maize | Kharif/Spring maize | **MVP** | |
| Pulses | Moong, Masoor, Chana, Arhar | **MVP** | |
| Vegetables | Potato, Onion, Tomato, Cauliflower, Peas | **MVP** (potato, onion, peas); others P2 | Perishable — shorter offer/reservation TTL |
| Fruits | Kinnow, Guava, Mango, Litchi | **MVP** (kinnow); others P2 | Perishable |
| Oilseeds | Mustard, Sunflower, Groundnut, Soybean | P2 | |
| Spices | Turmeric, Chilli, Coriander | Future | |
| Cotton | Kapas (raw cotton) | P2 | Moisture / staple-length attributes |
| Sugarcane | Cane | Future | Mostly sold to mills under contracts |
| Seeds | Certified seeds | Future | Seeds Act / Seeds Control Order licensing `[LEGAL REVIEW]` |
| Fertilisers | Urea, DAP, NPK | Future | Fertiliser Control Order licensing `[LEGAL REVIEW]` |
| Pesticides | Insecticides, herbicides | Future | Insecticides Act licensing `[LEGAL REVIEW]` |
| Agricultural machinery | Tractors, implements (sale/rent) | Future | |
| Farming equipment | Sprayers, pumps, tools | Future | |
| Animal feed | Cattle feed, fodder, straw/bhusa | P2 (fodder/straw) | |
| Other agricultural products | Jaggery (gur), honey, dairy (Future) | Future | FSSAI applicability `[LEGAL REVIEW]` |

`[DECISION D-01]` The MVP category list is Wheat, Paddy/Rice, Maize, Pulses, Vegetables (potato, onion, peas) and Fruits (kinnow). It needs confirmation from the business owner.

### 3.2 Category-specific attribute sets

Attributes are defined per category using an **attribute schema** with these properties: key, label in pa/hi/en, type, unit, required flag, allowed values or range, `searchable`, `filterable`, and `ai_extractable`. Common attributes apply to every produce listing.

**Common (all produce):** `commodity`, `variety`, `quantity` (stored in kg), `display_unit` (kg/qtl/tonne), `grade` (seller-declared), `harvest_date`, `packaging` (loose / jute bag 50 kg / PP bag), `storage` (open / covered / cold store / warehouse), `expected_price` (INR per display unit), `min_order_qty`, `pickup_location` (village, tehsil, district, geo-point), `available_from`, `available_until`, `photos` (1–10), `organic_claim` (none / self-declared / certified with certificate upload).

| Category | Extra attributes (required ★) |
|---|---|
| Wheat | ★moisture_pct (0–25), foreign_matter_pct, damaged_grain_pct, lustre_loss (Y/N), hectolitre_weight (opt), protein_pct (opt) |
| Paddy / Rice | ★moisture_pct, ★type (paddy/milled rice), grain_length_mm (opt), broken_pct (rice), aroma (basmati Y/N), chalky_pct (opt) |
| Maize | ★moisture_pct, aflatoxin_tested (Y/N + cert), colour (yellow/white) |
| Pulses | ★moisture_pct, ★whole_or_split, foreign_matter_pct, weevilled_pct |
| Vegetables | ★size_grade (S/M/L/mixed), ★harvest_date, shelf_life_days (est), cold_storage (Y/N), defect_pct (opt) |
| Fruits | ★size_count (e.g. kinnow count/box), ★harvest_date, ★packaging (crate/box kg), brix (opt), wax_coated (Y/N) |
| Cotton (P2) | ★moisture_pct, staple_length_mm, trash_pct, micronaire (opt) |
| Agri-inputs (Future) | ★brand, ★licence_no, ★batch_no, ★mfg_date, ★expiry_date, technical_name, pack_size |

**Units:** 1 quintal (qtl) = 100 kg; 1 tonne = 1,000 kg. Quantities are stored canonically in kg, using `numeric(14,3)`. Money is stored in INR as `numeric(14,2)`.

### 3.3 Category requirements (CAT)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-CAT-001 | **Category tree:** hierarchical categories (L1 → L2 → commodity → variety), 2 levels exposed in MVP, data model supports N levels; every node has pa/hi/en names, synonyms (romanised, Gurmukhi, Devanagari) and a stable slug | System / Admin | MVP | Given a category tree with L1 "Cereals — Wheat" and commodity "Wheat" with variety "PBW-826", When a buyer searches "kanak", "ਕਣਕ", "गेहूं" or "wheat", Then the same commodity node is resolved |
| KIS-CAT-002 | **MVP category set** per `[DECISION D-01]`: Wheat, Paddy/Rice, Maize, Pulses, Vegetables (potato, onion, peas), Fruits (kinnow); all other categories exist in the tree but are inactive (not listable, not searchable) | System | MVP | Given category "Fertilisers" is inactive, When a seller (or KISAAN AI) tries to create a listing in it, Then the request is rejected with `CATEGORY_NOT_ACTIVE` and the AI explains the category is not yet available |
| KIS-CAT-003 | **Category-specific attribute schemas** (§3.2): key, localised labels, type, unit, required flag, allowed values/range, `searchable`, `filterable`, `ai_extractable`; common produce attributes apply to every produce category | Seller / System | MVP | Given a wheat listing without `moisture_pct`, When the seller requests publish, Then validation fails naming the missing required attribute in the seller's language; Given `moisture_pct = 30`, Then it fails the 0–25 range rule |
| KIS-CAT-004 | **Schema versioning:** attribute-schema changes are versioned; existing listings keep the version they were created with and are re-validated only on edit/renewal | Admin / System | MVP | Given schema v2 adds a required attribute, When an existing v1 listing is viewed, Then it remains live; When it is edited or renewed, Then v2 validation applies |
| KIS-CAT-005 | **Units & conversion:** kg, quintal (100 kg), tonne (1,000 kg) plus category display units (e.g. kinnow box/crate with declared kg); canonical storage in kg `numeric(14,3)`; local units in speech (e.g. "man", "bori") are converted only after explicit readback confirmation (KIS-VOX-006) | System | MVP | Given a seller says "sau quintal", When the draft is created, Then quantity = 10,000.000 kg, display unit = quintal, and the readback states both |
| KIS-CAT-006 | **Category rules:** per-category flags for perishability (drives offer validity D-05, payment deadline D-07, acceptance window D-08, listing expiry D-03), commission rate (D-19), GST/HSN mapping, and checkout availability per state (APMC gating D-80) | Admin / System | MVP | Given potato is flagged perishable, When an offer is created without explicit validity, Then default validity = 6 h |
| KIS-CAT-007 | **Admin category management:** create/edit/deactivate categories, attributes, synonyms and rules; changes are audit-logged; deactivation hides listings but never deletes them or historical orders | Admin | MVP | Given an admin deactivates "Peas", Then active peas listings are hidden from search within 5 min, sellers are notified, and orders in progress are unaffected |
| KIS-CAT-008 | **Licensing-gated future categories:** agri-input categories (seeds, fertilisers, pesticides) can only be activated when seller licence capture and verification (licence no., validity, CIB&RC registration per SKU for pesticides) is implemented and legal sign-off is recorded (KIS-CMP-055..058) | Admin | Future | Given the "Pesticides" category, When an admin tries to activate it without the licensing feature flag and a recorded legal sign-off, Then activation is blocked |
| KIS-CAT-009 | **AI category suggestion:** KISAAN AI suggests category, commodity and variety from text, voice or photo with a confidence score; the seller confirms; photo analysis never sets grade or quality certification | Seller / AI | MVP | Given a photo of kinnow, When KISAAN AI suggests "Fruits › Kinnow" at confidence ≥ 0.8, Then the seller sees the suggestion as editable and the grade field stays seller-declared |
| KIS-CAT-010 | Phase-2 attribute schemas (oilseeds, cotton, fodder) defined before category activation | Admin | P2 | See [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) §13.1 |

---

## 4. User stories (by role)

### 4.1 Farmer / Seller
- US-S01: As a farmer, I want to say "Mere paas 100 quintal wheat hai, Moga mein" and get a draft listing so that I don't have to fill forms.
- US-S02: As a farmer, I want to photograph my produce and have the details pre-filled so that listing is fast.
- US-S03: As a farmer, I want to see today's mandi prices near me, with their source and date, so that I can set a fair price.
- US-S04: As a farmer, I want to offer a discount if a buyer takes my whole lot or a large quantity so that I can sell faster.
- US-S05: As a farmer, I want offers from buyers compared and explained in Punjabi so that I can choose the best one.
- US-S06: As a farmer, I want to counter-offer by voice so that negotiating is easy.
- US-S07: As a farmer, I want stock to update automatically when I sell so that I never oversell.
- US-S08: As a farmer, I want a shareable shop link so that I can send it in my WhatsApp groups.
- US-S09: As a seller, I want to create limited-time coupons so that I can attract buyers.
- US-S10: As a farmer, I want transport arranged for me so that the buyer receives the goods.
- US-S11: As a farmer, I want to see what is paid, what is pending and my total earnings.

### 4.2 Buyer (trader / retailer / processor / restaurant / exporter)
- US-B01: As a trader, I want to search for "PBW-826 wheat, moisture under 12%, within 50 km of Khanna" and see verified sellers.
- US-B02: As a buyer, I want to post a requirement ("need 500 qtl wheat by 20 April") so that sellers come to me.
- US-B03: As a buyer, I want wholesale tiers shown, with my price calculated automatically for my quantity.
- US-B04: As a buyer, I want to negotiate and get a binding order once both sides agree.
- US-B05: As a processor, I want GST invoices for input tax credit.
- US-B06: As a buyer, I want to track the truck and confirm delivery quality before the seller is paid.
- US-B07: As a buyer, I want alerts when matching produce is listed.
- US-B08: As a member, I want free and priority delivery and member deals.

### 4.2a Bulk buyer (separate onboarding)
- US-K01: As a flour-mill buyer, I want a separate bulk-buyer sign-up where I state my business type, products, typical quantity, frequency, delivery areas, budget range and quality needs, so that KISAAN shows me suitable lots and sellers.
- US-K02: As a bulk buyer, I want to save a recurring requirement ("200 qtl wheat every week to Khanna") so that matching sellers are notified each cycle.
- US-K03: As a bulk buyer, I want to compare sellers by tier price for my quantity, delivered cost and trust signals in one view.
- US-K04: As a bulk buyer, I want to mark preferred sellers so that their new lots reach me first.
- US-K05: As a bulk buyer, I want KISAAN AI to read my procurement profile so I don't repeat my requirements every time.

### 4.3 Group Leader and group member
- US-G01: As an area leader, I want a separate bulk-buyer signup so that I'm verified as a leader.
- US-G02: As a leader, I want to create a public group ("Sarabha Nagar — 40 qtl potato") that others can join.
- US-G03: As a member, I want to commit my quantity now and pay only for my own share after the leader locks the group order, within the payment window.
- US-G04: As a leader, I want to lock the group order once the target is met (or the best seller offer is chosen) so that we unlock wholesale and group pricing and members get 24 h to pay.
- US-G05: As a member, I want to see the leader's verification and rating before joining.
- US-G06: As a member, I want my phone number, address and payment details hidden from the leader and other members.
- US-G07: As a leader, I want to see seller offers for the group and share them with members, without being able to commit anyone else's money.
- US-G08: As a member, I want the group discount and any group coupon shown on my own share before I pay.

### 4.4 Transporter
- US-T01: As a transporter, I want to register my vehicles and service districts.
- US-T02: As a transporter, I want transport requests near my route and the ability to quote.
- US-T03: As a transporter, I want to update pickup and delivery status by voice or one tap.
- US-T04: As a transporter, I want to see my completed trips and payouts.

### 4.5 Admin / Ops
- US-A01: As a verifier, I want a queue of KYC submissions with AI-flagged risks.
- US-A02: As a moderator, I want to review flagged listings, such as duplicates, abnormal prices or prohibited items.
- US-A03: As ops, I want to monitor orders, payments, disputes and KISAAN AI tool executions, approvals and cost.
- US-A06: As an AI admin, I want to enable/disable individual AI tools, set limits, roll prompt/model versions and hit a kill switch.
- US-A04: As finance, I want reconciliation reports and settlement status.
- US-A05: As admin, I want to configure commission, categories, membership plans and feature flags.

---

## 5. Functional requirements

Columns: **ID · Requirement · Role(s) · Priority · Acceptance criteria (G/W/T)**.

### 5.1 Authentication & registration (AUTH) — feature 1

> Backend note: opsapi provides email/password, email OTP, social SSO, PIN and refresh tokens. It does **not** provide SMS or phone OTP login. Phone OTP (KIS-AUTH-001/002) is therefore built as a new Kisaan plugin module that issues an opsapi-compatible session. The exact session-issuance mechanism through the plugin SDK is `[UNVERIFIED]` (see [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md)).

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-AUTH-001 | Users register and log in with an Indian mobile number and a one-time password (OTP) sent by SMS; WhatsApp OTP is an optional fallback | All | MVP | **Given** a valid +91 mobile, **When** the user requests an OTP, **Then** a 6-digit OTP arrives within 30 s (p95), is valid for 5 min, and allows max 5 attempts |
| KIS-AUTH-002 | OTP requests are rate-limited per number, device and IP | All | MVP | **Given** 5 OTP requests within 15 min, **When** a 6th is requested, **Then** it is rejected with a retry-after message in the user's language |
| KIS-AUTH-003 | Sessions use short-lived access tokens plus refresh tokens; a session can be revoked | All | MVP | **Given** an admin revokes a session, **When** the old token is used, **Then** the API returns 401 within 60 s |
| KIS-AUTH-004 | Optional email + password or SSO for business buyers and admins; MFA is mandatory for admin roles | Buyer, Admin | MVP (admin MFA), P2 (buyer SSO) | **Given** an admin without MFA, **When** they log in, **Then** they are forced to enrol in TOTP |
| KIS-AUTH-005 | During registration the user selects a primary role and can add roles later (multi-role) | All | MVP | **Given** a registered seller, **When** they enable "buyer", **Then** they can switch context without logging in again |
| KIS-AUTH-006 | Registration is possible by voice or through the AI chat, including name, village, district and role | Seller, Transporter | MVP | **Given** a voice registration, **When** the AI has extracted the fields, **Then** it reads them back and creates the account only after the user confirms (APR) |
| KIS-AUTH-007 | Consent capture during registration (privacy notice in the chosen language, purposes, marketing opt-in separate) | All | MVP | **Given** a new user, **When** they register, **Then** the consent record stores notice version, purposes, language and timestamp |
| KIS-AUTH-008 | Device binding and trusted-device list; login from a new device notifies the user | All | P2 | **Given** login from a new device, **Then** an SMS/WhatsApp alert is sent |
| KIS-AUTH-009 | Account deletion request flow (DPDP right to erasure, subject to legal retention) | All | MVP | **Given** a deletion request, **Then** the account is deactivated immediately and erased or anonymised within the policy period, except records under legal hold |

### 5.2 User profiles & multi-role (PROF) — feature 2

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-PROF-001 | Each user has a base profile: name, photo, preferred language, district, contact preferences | All | MVP | **Given** a user, **When** they set language to Punjabi, **Then** all UI, notifications and AI responses default to pa-IN |
| KIS-PROF-002 | Role-specific profiles: FarmerProfile (land acreage optional, crops, village), BuyerProfile (buyer_type, business name, GSTIN optional), TransporterProfile, GroupLeaderProfile | Role-specific | MVP | **Given** a user with seller+buyer roles, **Then** both profiles exist independently and are shown per active role |
| KIS-PROF-003 | Multiple addresses (pickup points, delivery addresses, farm location with geo-pin) | All | MVP | **Given** an address with a geo-pin, **Then** it can be selected as a listing pickup point |
| KIS-PROF-004 | Privacy settings: show or hide phone; contact via in-app chat only | Seller, Buyer | MVP | **Given** "hide phone", **Then** the phone number never appears on public store or listing pages |
| KIS-PROF-005 | Bank account / UPI ID for payouts, verified with a penny-drop | Seller, Transporter | MVP | **Given** a bank account, **When** penny-drop verification succeeds with a matching name, **Then** payouts are enabled |
| KIS-PROF-006 | Verification badges are shown on the profile (phone verified, KYC verified, business verified, leader verified) | All | MVP | **Given** a KYC-verified seller, **Then** the "Verified" badge appears on store, listing and offer cards |
| KIS-PROF-007 | Reputation summary on the profile: rating, completed orders, on-time %, response time | All | MVP | Computed nightly and displayed with the count of ratings |

### 5.3 Seller onboarding (ONB, seller) — feature 3

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-ONB-001 | Guided seller onboarding by voice, chat or form: profile → pickup address → bank/UPI → KYC → first listing | Seller | MVP | **Given** a new seller, **When** onboarding completes, **Then** the checklist shows 100% and listing publish is enabled |
| KIS-ONB-002 | Seller KYC tiers: **T0** phone verified (can draft listings, cannot publish); **T1** identity verified (publishes up to a value limit); **T2** bank verified + identity (receives payouts); **T3** business (GSTIN/PAN verified, no limit) | Seller | MVP | **Given** a T0 seller, **When** they try to publish, **Then** they are prompted to complete T1 |
| KIS-ONB-003 | Identity verification uses lawful methods only (e.g. DigiLocker / offline Aadhaar XML or masked document, PAN). Raw Aadhaar numbers are never stored `[LEGAL REVIEW]` | Seller, Buyer, Leader, Transporter | MVP | **Given** an Aadhaar-based document, **Then** only the masked number (last 4 digits) and the verification reference are stored |
| KIS-ONB-004 | Assisted onboarding: field agents or support staff may onboard on behalf of a farmer, with the farmer's OTP consent | Seller | MVP | **Given** an assisted session, **Then** the audit log records the agent ID and the farmer's OTP confirmation |
| KIS-ONB-005 | The Trust rules engine (deterministic backend job, not AI) pre-screens KYC (document legibility, name match, duplicate detection) and routes to the verifier queue | Verifier | MVP | **Given** a submission, **Then** a risk score with reasons is attached; the final decision is human |

### 5.4 Buyer onboarding (ONB, buyer / leader / transporter) — feature 4

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-ONB-010 | Buyer onboarding captures buyer_type (individual, retailer, wholesaler, distributor, processor, restaurant, exporter, agri_business), business name and delivery address | Buyer | MVP | **Given** buyer_type = processor, **Then** GSTIN is requested (optional at T1, required for GST invoice) |
| KIS-ONB-011 | Buyer verification tiers mirror KIS-ONB-002; business buyers above ₹2,00,000 order value must be T3 `[DECISION D-02]` | Buyer | MVP | **Given** an unverified buyer and a cart over the threshold, **When** they check out, **Then** checkout is blocked with a prompt to verify |
| KIS-ONB-012 | GSTIN verification against the GST public registry via a licensed provider `[UNVERIFIED provider]` | Buyer, Seller | MVP | **Given** a GSTIN, **Then** legal name, state and status are fetched and stored |
| KIS-ONB-013 | **Group Leader signup** is a distinct flow (see KIS-GROUP-001) | Leader | MVP | See KIS-GROUP-001 |
| KIS-BULK-001 | **Separate bulk-buyer onboarding path** (`/signup/bulk-buyer`, also "I buy in bulk" in buyer sign-up and via KISAAN AI), plus upgrade from an existing buyer profile without a new account, by form, chat or voice | Bulk buyer, Buyer | MVP | **Given** a user chooses "I buy in bulk", **When** they finish onboarding, **Then** a bulk-buyer procurement profile exists and the bulk dashboard is their buyer home |
| KIS-BULK-002 | Bulk-buyer procurement profile: business type, required products (commodity/variety), typical quantity per purchase, purchase frequency, delivery areas, budget range, required quality (grade/moisture/specs), preferred sellers; editable; draft-then-confirm when filled by AI | Bulk buyer | MVP | **Given** missing mandatory fields (business type, ≥ 1 product, typical qty, ≥ 1 delivery area), **Then** the profile cannot be saved; other fields are optional |
| KIS-BULK-003 | Verification and limits: T1 to activate; T3 for orders above ₹2,00,000 (D-02); GSTIN verification for GST invoices | Bulk buyer | MVP | See KIS-ONB-011/012 |
| KIS-BULK-004 | "Verified Business Buyer" badge on offers, RFQs and quotations seen by sellers | Bulk buyer | MVP | — |
| KIS-BULK-005 | Higher RFQ limits (20 open), whole-lot offer visibility, seller quotations, multi-seller split acceptance, RFQ directly to preferred sellers | Bulk buyer | MVP | — |
| KIS-BULK-006 | Profile-driven matching: new listings matching required products, quality and delivery areas (preferred sellers first) alert the bulk buyer; new bulk RFQs reach matching sellers via the deterministic matching service | Bulk buyer | MVP | — |
| KIS-BULK-007 | Procurement profile is private: budget range and preferred-seller list are used only for the buyer's own filtering/ranking, never disclosed to sellers or used to raise prices | Bulk buyer | MVP | **Given** a seller views a requirement, **Then** budget range and preferred-seller list are never shown |
| KIS-BULK-008 | Recurring procurement: saved RFQ templates and scheduled RFQs (weekly/fortnightly/monthly) | Bulk buyer | P2 | **Given** a recurring requirement, **When** the cycle starts, **Then** a new requirement instance is created and matching runs again |
| KIS-BULK-009 | Bulk-buyer dashboard: open RFQs, quotation comparison, orders, preferred sellers (spend analytics P2) | Bulk buyer | MVP | — |
| KIS-BULK-010 | Business accounts with multiple users (purchaser, approver, accounts) | Bulk buyer | Future | — |
| KIS-BULK-011 | Wholesale tier sets may be restricted to bulk buyers (`eligible_buyer_types`, KIS-WHL-015) | Seller, Bulk buyer | MVP | — |
| KIS-ONB-014 | Transporter onboarding: identity, driving licence, vehicle RC, permit/insurance documents, service districts, bank | Transporter | MVP | **Given** a vehicle without a valid RC upload, **Then** it cannot receive assignments |

### 5.5 Product management (PRD) — feature 5

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-PRD-001 | Sellers create products (commodity + variety + attributes per the category schema) | Seller | MVP | **Given** category Wheat, **Then** moisture_pct is required before publish |
| KIS-PRD-002 | Create a listing via a form, AI chat, voice, photo or WhatsApp; all channels produce the same listing draft | Seller | MVP | **Given** a voice-created draft, **Then** it appears in "My drafts" in the PWA with source = voice |
| KIS-PRD-003 | Up to 10 photos per listing; EXIF stripped; automatic compression for low bandwidth; first photo is the cover | Seller | MVP | **Given** a 6 MB photo, **Then** it is stored and served as a ≤ 300 KB web variant plus a thumbnail |
| KIS-PRD-004 | AI-generated title and description in the seller's language with auto-translation to the other two languages; the seller can edit | Seller | MVP | **Given** a draft, **Then** title and description exist in pa/hi/en and are marked "AI-generated, reviewed by seller" after approval |
| KIS-PRD-005 | Unit entry in kg, qtl or tonne, with automatic conversion and display of both units | Seller | MVP | **Given** 100 qtl, **Then** the stored value is 10,000 kg and the display is "100 qtl (10 t)" |
| KIS-PRD-006 | Seller-declared grade is shown as "seller-declared"; AI photo assessment is shown only as "AI observation — not a certification" | Seller, Buyer | MVP | **Given** an AI photo assessment, **Then** no "certified" wording appears anywhere |
| KIS-PRD-007 | Edit, pause, resume, close and duplicate a listing; edits to price or quantity while offers are open notify the affected buyers | Seller | MVP | **Given** a price change with 3 open offers, **Then** those 3 buyers are notified and their offers stay valid at the offered price |
| KIS-PRD-008 | Prohibited and restricted items list (e.g. unlicensed agri-inputs, banned pesticides) blocks publish | Admin | MVP | **Given** a listing matching the prohibited list, **Then** publish is blocked and the listing goes to moderation |
| KIS-PRD-009 | Organic claims require a certificate upload to show the "certified organic" label; otherwise the listing shows "self-declared" | Seller | P2 | — |
| KIS-PRD-010 | Bulk listing upload (CSV) for large sellers | Seller | P2 | — |

### 5.6 Product listings (PRD, lifecycle) — feature 6

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-PRD-020 | Listing states: Draft → Pending review (if flagged) → Active → Paused / Out of stock → Closed / Expired / Removed | Seller, Admin | MVP | State transitions follow the FS state machine; invalid transitions are rejected |
| KIS-PRD-021 | Listings have an availability window and expire automatically (default 30 days for grains, 7 days for perishables) `[DECISION D-03]` | Seller | MVP | **Given** available_until is passed, **Then** the listing becomes Expired and the seller is notified 48 h before |
| KIS-PRD-022 | Auto-moderation on publish: duplicate detection, price outlier detection against mandi bands, prohibited terms. Flagged listings go to Pending review | Admin, AI | MVP | **Given** a price 3× the mandi modal price, **Then** the listing is flagged with a reason and the seller is told a review is pending |
| KIS-PRD-023 | A listing displays the seller's verification badges, rating, distance from the buyer, wholesale tiers and coupon availability | Buyer | MVP | — |
| KIS-PRD-024 | Featured / promoted listings (paid) | Seller | Future | — |

### 5.7 Product search (SRCH) — feature 7

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-SRCH-001 | Keyword search across commodity, variety, title and description in all three languages and romanised forms (e.g. "kanak" = wheat, "aloo" = potato) | All incl. anonymous | MVP | **Given** a query "kanak", **Then** wheat listings are returned |
| KIS-SRCH-002 | Natural-language and voice search through KISAAN AI (`discovery` tools) | Buyer | MVP | **Given** "Ludhiana ke paas 50 quintal aloo", **Then** results are filtered for potato, ≥ 50 qtl, within the default radius of Ludhiana |
| KIS-SRCH-003 | Geo search by radius from the buyer's location or a chosen district | Buyer | MVP | Results include the distance in km |
| KIS-SRCH-004 | Only Active listings with available quantity > 0 are returned; never out-of-stock or paused listings | All | MVP | **Given** a listing with available = 0, **Then** it does not appear in search |
| KIS-SRCH-005 | Typo tolerance and synonyms dictionary managed by admin | Admin | MVP | — |
| KIS-SRCH-006 | Saved searches with alerts (feeds NOTF) | Buyer | MVP | **Given** a saved search, **When** a matching listing is published, **Then** an alert is sent at most once per listing |

### 5.8 Filters & sorting (SRCH) — feature 8

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-SRCH-010 | Filters: category, commodity, variety, district, radius, price range, available quantity ≥ X, grade, moisture ≤ X, harvest date, verified sellers only, wholesale available, coupon available, organic, seller rating ≥ X | Buyer | MVP | Each filter combination returns correct results; facet counts are shown |
| KIS-SRCH-011 | Sort: relevance, price (asc/desc, using the buyer's effective price for the requested quantity), distance, newest, rating | Buyer | MVP | **Given** a requested quantity of 100 qtl, **When** sorted by price, **Then** the effective price uses the applicable wholesale tier |
| KIS-SRCH-012 | Category-specific filters are generated from the attribute schema (`filterable = true`) | Admin | MVP | Adding a filterable attribute requires no code deployment |

### 5.9 Product details (SRCH) — feature 9

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-SRCH-020 | The product detail page shows photos, attributes, seller-declared grade, AI observation (with disclaimer), available quantity, MOQ, pickup district, wholesale tier table, active coupons, seller card and nearby mandi price reference | All | MVP | Mandi reference shows source, market and date (KIS-MKT-003) |
| KIS-SRCH-021 | Quantity selector computes the effective unit price and total live (PRC) | Buyer | MVP | **Given** a qty change crosses a tier, **Then** the price updates within 200 ms on the client |
| KIS-SRCH-022 | CTAs: Make offer, Buy now (at list/effective price), Ask question (enquiry), Add to group (if a group exists for this listing) | Buyer | MVP | — |
| KIS-SRCH-023 | Public product pages are SEO-indexable and viewable logged out; contact details are hidden according to privacy settings | Anonymous | MVP | — |
| KIS-SRCH-024 | Quantity-aware search: ranking, price filter and availability use the requested quantity | Buyer | MVP | See [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) §4.3 |
| KIS-SRCH-025 | Filters for MOQ, wholesale availability, KISAAN Plus benefits, delivery mode, group eligibility, open groups | Buyer | MVP | See [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) §4.3 |
| KIS-SRCH-026 | Seller/store search by commodity, district and badges | Buyer | MVP | See [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) §4.3 |
| KIS-SRCH-027 | Natural-language/voice search via KISAAN AI maps to the same structured query and endpoint; the AI may not show results not returned by the endpoint | Buyer | MVP | See [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) §4.3 |

### 5.10 Inventory management (INV) — features 10 & 28 (§2A.5)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-INV-001 | Each listing has an inventory record with `on_hand`, `reserved` and `available = on_hand − reserved` (kg) | Seller | MVP | Invariant: `available ≥ 0` and `reserved ≤ on_hand` always hold |
| KIS-INV-002 | **Automatic reservation** when an offer is accepted or checkout starts (Buy now), with a TTL | System | MVP | **Given** an offer of 40 qtl is accepted, **Then** 4,000 kg is reserved and available decreases immediately |
| KIS-INV-003 | **Automatic deduction** on payment confirmation / order confirmation (reserved → deducted from on_hand) | System | MVP | **Given** payment is captured, **Then** on_hand −= qty and reserved −= qty atomically |
| KIS-INV-004 | **Automatic release** on cancellation, payment failure or reservation expiry | System | MVP | **Given** the reservation TTL expires, **Then** reserved −= qty and the buyer and seller are notified |
| KIS-INV-005 | **Overselling prevention** under concurrency: reservation succeeds only if `available ≥ qty` in a single atomic operation | System | MVP | **Given** 2 concurrent requests for 60 qtl each against 100 qtl available, **Then** exactly one succeeds |
| KIS-INV-006 | Manual adjustment (add / remove stock) requires a reason code (harvest added, spoilage, sold offline, correction, other with text); audit-logged | Seller | MVP | **Given** an adjustment without a reason, **Then** it is rejected |
| KIS-INV-007 | Low-stock alert when available falls below a seller-defined threshold (default 10% of initial quantity or MOQ, whichever is greater) | Seller | MVP | Alert sent once per threshold crossing |
| KIS-INV-008 | **Out-of-stock auto-hide**: when available = 0 (or below MOQ) the listing is hidden from search and shown as "Sold out" on the store; it is restored automatically if stock returns | System | MVP | **Given** a released reservation brings available ≥ MOQ, **Then** the listing becomes searchable again |
| KIS-INV-009 | Inventory movement ledger (every reserve / release / deduct / adjust with actor, reason, reference) | Seller, Admin | MVP | The ledger sum reconciles to on_hand for every listing (nightly check) |
| KIS-INV-010 | Voice / AI inventory update ("Mera 20 quintal aur wheat aa gaya") drafts an adjustment that requires confirmation | Seller | MVP | APR readback before apply |
| KIS-INV-011 | Multi-location stock per seller (warehouses) | Seller | Future | — |

### 5.11 Buyer enquiries & requirements (ENQ) — feature 11

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-ENQ-001 | A buyer can send a question/enquiry about a listing; it opens an in-app conversation thread with the seller | Buyer, Seller | MVP | Phone numbers are masked unless both parties opt in |
| KIS-ENQ-002 | A buyer can post a **Buyer Requirement (RFQ)**: commodity, variety, qty, quality specs, delivery location, needed-by date, target price (optional), validity | Buyer | MVP | **Given** a posted RFQ, **Then** the matching service notifies the top-N eligible sellers (default N = 20) |
| KIS-ENQ-003 | Sellers respond to an RFQ with a quotation (links to OFR) | Seller | MVP | — |
| KIS-ENQ-004 | Enquiry spam control: max open enquiries per buyer per day; new-account limits | System | MVP | — |
| KIS-ENQ-005 | AI suggests answers to common enquiries for the seller to approve | Seller | P2 | — |
| KIS-ENQ-006 | Public RFQs are visible to sellers in matching districts; the buyer's identity is hidden until the buyer accepts a quotation `[DECISION D-04]` | Seller | MVP | — |
| KIS-ENQ-007 | RFQ lifecycle incl. PartiallyFulfilled and group-owned requirements | Buyer, Leader | MVP | See [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) §13.1 |

### 5.12 Bidding & quotation system (OFR) — feature 12

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-OFR-001 | A buyer can make an **offer** on a listing: qty, price per unit, delivery terms (buyer pickup / seller delivery / platform logistics), payment terms, validity (default 24 h; 6 h for perishables) `[DECISION D-05]` | Buyer | MVP | **Given** qty < MOQ, **Then** the offer is rejected with a validation message |
| KIS-OFR-002 | A seller can send a **quotation** in response to an RFQ (same structure) | Seller | MVP | — |
| KIS-OFR-003 | **Multi-buyer quotation comparison**: a seller sees all open offers on a listing in a comparison view (net realisation after commission & transport, buyer rating, payment terms) | Seller | MVP | **Given** 3 offers, **Then** the comparison shows net realisation per offer and the AI explanation is available |
| KIS-OFR-004 | **Multi-seller comparison** for buyers on their RFQ | Buyer | MVP | — |
| KIS-OFR-005 | Offers do not reserve inventory until accepted (KIS-INV-002) | System | MVP | — |
| KIS-OFR-006 | A buyer may have at most one open offer per listing; new offers supersede old ones | Buyer | MVP | — |
| KIS-OFR-007 | Auction / reverse auction (time-bound bidding) | Seller, Buyer | Future | — |

### 5.13 Negotiation & counteroffers (OFR) — feature 13

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-OFR-010 | Either party can counter (price, qty, delivery terms, validity) and both parties see the full history | Seller, Buyer | MVP | Each counter creates an immutable negotiation event |
| KIS-OFR-011 | Max 10 counter rounds per negotiation; the negotiation expires at validity | System | MVP | **Given** round 11, **Then** the counter is rejected with an option to start a new offer |
| KIS-OFR-012 | **Accept** creates an "Agreed deal" → order draft (ORD) + inventory reservation; acceptance is always an explicit user action (APR) | Seller, Buyer | MVP | **Given** the AI drafted an acceptance, **Then** it executes only after an explicit approval tap/voice confirmation with readback |
| KIS-OFR-013 | Reject with an optional reason; withdraw by the offering party before acceptance | Seller, Buyer | MVP | — |
| KIS-OFR-014 | KISAAN AI (`offers` tools) drafts counteroffers and explains differences, but never sends without approval | Seller, Buyer | MVP | See KISAAN AI (`offers` tools) requirements |
| KIS-OFR-015 | Auto-counter rules set by the seller (e.g. "auto-reject below ₹2,300/qtl") apply **only** as reject or reply-with-floor, never auto-accept `[DECISION D-06]` | Seller | P2 | — |
| KIS-OFR-016 | `group_offer` context with `listing_terms` / `custom_price` kinds; seller ↔ leader negotiation (approval-gated) | Seller, Leader | MVP | See [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) §13.1 |

### 5.14 Order management (ORD) — feature 14

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-ORD-001 | Orders are created from (a) Buy now checkout, (b) an accepted offer/quotation, or (c) a group order allocation | Buyer | MVP | Each order references its source |
| KIS-ORD-002 | Order states: Pending payment → Confirmed → Ready for pickup → In transit → Delivered → Completed (after acceptance window) / Cancelled / Disputed / Refunded (see FS) | All | MVP | — |
| KIS-ORD-003 | Order pricing snapshot: unit price, wholesale tier applied, coupon, membership benefit, delivery fee, commission, taxes; immutable after confirmation | System | MVP | **Given** a confirmed order, **Then** later listing price changes do not alter it |
| KIS-ORD-004 | Payment deadline for orders from accepted offers (default 24 h; 4 h for perishables) `[DECISION D-07]`; on expiry the order is cancelled and inventory released | System | MVP | — |
| KIS-ORD-005 | Cancellation rules: free before dispatch; after dispatch only through a dispute; seller cancellation counts against seller reliability | Buyer, Seller | MVP | Cancellation charges disclosed before order per e-commerce rules `[LEGAL REVIEW]` |
| KIS-ORD-006 | Buyer **acceptance window** after delivery (default 48 h, perishables 12 h) to confirm or raise a dispute; auto-complete after the window `[DECISION D-08]` | Buyer | MVP | — |
| KIS-ORD-007 | Delivery weight reconciliation: actual delivered weight recorded; the price adjusts pro-rata within a tolerance (±2%) or triggers a dispute beyond it | Buyer, Seller | MVP | — |
| KIS-ORD-008 | Order list and detail per role, with timeline and documents (invoice, weighbridge slip, e-way bill reference) | All | MVP | — |
| KIS-ORD-009 | Partial fulfilment (split deliveries) | Seller | P2 | — |
| KIS-ORD-010 | Three order sources incl. group-allocation child orders under a parent group order | System | MVP | See [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) §13.1 |
| KIS-ORD-011 | `PaymentReceivedStockUnavailable` state with automatic full refund | System | MVP | See [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) §13.1 |

### 5.15 Payment processing (PAY) — feature 15

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-PAY-001 | Buyer pays through a licensed Payment Aggregator (UPI, net banking, cards, UPI collect for large tickets; NEFT/RTGS virtual account for large B2B) `[DECISION D-09: PA choice]` | Buyer | MVP | The platform never receives funds into its own operating account for seller proceeds |
| KIS-PAY-002 | Marketplace split settlement: seller share, transporter share and platform commission/fees routed by the PA | System | MVP | — |
| KIS-PAY-003 | Seller settlement is released after the order is Completed (acceptance window passed or buyer confirmed), via PA hold/release features | System | MVP | **Given** an order is Completed, **Then** a settlement instruction is issued within 1 h |
| KIS-PAY-004 | Payment confirmation only via a verified PA webhook + server-side verification; client callbacks never mark an order paid | System | MVP | — |
| KIS-PAY-005 | Idempotent payment creation and webhook processing | System | MVP | A duplicate webhook does not double-confirm |
| KIS-PAY-006 | Failed payment handling: retry within the payment deadline, reservation maintained until the deadline | Buyer | MVP | — |
| KIS-PAY-007 | Refunds (full/partial) to the original payment method; triggered by cancellation, dispute outcome or weight reconciliation | Finance, System | MVP | — |
| KIS-PAY-008 | Daily reconciliation of PA settlement reports against orders; mismatches surface in the finance queue | Finance | MVP | — |
| KIS-PAY-009 | Payment history and pending payment view for each role ("Show my pending payments" via AI) | All | MVP | — |
| KIS-PAY-010 | Recurring payments for membership (UPI AutoPay / card e-mandate) | Buyer | MVP | Pre-debit notification per RBI rules `[LEGAL REVIEW]` |
| KIS-PAY-011 | Pay-later / credit terms for verified businesses | Buyer | Future | — |
| KIS-PAY-012 | Cash-on-delivery | — | Not supported (MVP) | — |

### 5.16 Invoices & receipts (INVC) — feature 16

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-INVC-001 | A tax invoice / bill of supply is generated on behalf of the seller for each order (template depends on seller GST status: farmer selling own produce → bill of supply / exempt) `[TAX REVIEW]` | Seller, Buyer | MVP | PDF in the buyer's language + English |
| KIS-INVC-002 | The platform's own GST invoice to the seller for commission/fees; to the buyer for membership/delivery fees | Finance | MVP | `[TAX REVIEW]` |
| KIS-INVC-003 | Payment receipts for every successful payment and refund | Buyer | MVP | — |
| KIS-INVC-004 | Sequential, gap-free invoice numbering per issuer per financial year | System | MVP | — |
| KIS-INVC-005 | E-invoicing (IRN) and e-way bill integration where thresholds apply | Finance | P2 | `[TAX REVIEW]` |
| KIS-INVC-006 | GST TCS on e-commerce operator collections computed and reported where applicable | Finance | MVP (calculation), P2 (automated filing) | `[TAX REVIEW]` |

### 5.17 Delivery management (LOG) — feature 17

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-LOG-001 | Delivery modes per order: buyer self-pickup, seller-arranged, platform-arranged (transporter marketplace) | Buyer, Seller | MVP (self-pickup, seller-arranged); P2 (platform-arranged) — D-106 | — |
| KIS-LOG-002 | Transport request: pickup, drop, weight, commodity, date window, vehicle type; broadcast to eligible transporters in the service area | Seller, Buyer, AI | P2 (Phase 9; was MVP in v0.1, moved by D-106) | — |
| KIS-LOG-003 | Transporters submit quotations; the requester compares (price, ETA, rating) and accepts with approval | Transporter, Seller/Buyer | P2 (Phase 9; was MVP in v0.1, moved by D-106) | — |
| KIS-LOG-004 | Shipment states: Assigned → En route to pickup → Picked up (with weighbridge weight + photo) → In transit → Delivered (with photo + OTP from receiver) → Closed | Transporter | MVP | **Given** delivery, **Then** the receiver's OTP confirms handover |
| KIS-LOG-005 | Status updates via one-tap, voice or WhatsApp reply; optional live location sharing (consented) | Seller (MVP, seller-arranged), Transporter (P2) | MVP (status by seller), P2 (transporter, live location) | — |
| KIS-LOG-006 | KISAAN AI (`logistics` tools) estimates cost only when based on actual quotes or historical data; shows a range with basis | AI | MVP | — |
| KIS-LOG-007 | Transporter vehicle management (type, capacity, RC, insurance expiry alerts) | Transporter | P2 (Phase 9; was MVP in v0.1, moved by D-106) | — |
| KIS-LOG-008 | Transporter payout after the shipment is Closed via PA split | Transporter | P2 (Phase 9; was MVP in v0.1, moved by D-106) | — |
| KIS-LOG-009 | Integration with third-party logistics aggregators | — | Future | — |

### 5.18 Reviews & ratings (REV) — feature 18

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-REV-001 | Two-way ratings after order completion: buyer→seller, seller→buyer, both→transporter (1–5 stars + tags + optional text/voice note) | All | MVP | Only for Completed orders; one review per party per order |
| KIS-REV-002 | Review window: 14 days after completion | All | MVP | — |
| KIS-REV-003 | Ratings shown as an average plus count; new users show "New" until 3 ratings | All | MVP | — |
| KIS-REV-004 | Reviews moderated for abuse; the seller can reply once | Admin, Seller | MVP | — |
| KIS-REV-005 | Group leader ratings by group members | Members | MVP | — |

### 5.19 Notifications (NOTF) — feature 19

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-NOTF-001 | Channels: in-app, web push, SMS (transactional, DLT-registered), WhatsApp (template messages, opted-in), email (business users) | All | MVP | — |
| KIS-NOTF-002 | Per-user channel preferences and quiet hours (default 21:00–07:00, except critical) | All | MVP | — |
| KIS-NOTF-003 | Notification types: offer received/countered/accepted/expiring, order updates, payment events, shipment updates, price alerts, saved-search matches, group updates, membership renewal reminders, low stock | All | MVP | — |
| KIS-NOTF-004 | De-duplication and throttling: the same event is never notified twice on the same channel; digest mode for alerts (max N per day) | System | MVP | — |
| KIS-NOTF-005 | Notifications in the user's language; voice notifications (TTS audio on WhatsApp) for selected critical events | Seller | P2 | — |

### 5.20 Customer support (SUP) — feature 20

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-SUP-001 | KISAAN AI (`support` tools) answers platform FAQs, order/payment status in-language, with citations to help articles | All | MVP | — |
| KIS-SUP-002 | Ticket creation by AI or user, with category, linked order and attachments; escalation to human agents | All | MVP | **Given** the user says "insaan se baat karni hai", **Then** escalation is created immediately |
| KIS-SUP-003 | SLA tracking (first response ≤ 4 business hours for MVP) | Support | MVP | — |
| KIS-SUP-004 | Callback request (phone) for low-literacy users | Seller | MVP | — |
| KIS-SUP-005 | Grievance officer details and grievance redressal timelines displayed per e-commerce rules `[LEGAL REVIEW]` | All | MVP | — |

### 5.21 Disputes & refunds (DSP) — feature 21

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-DSP-001 | A buyer can raise a dispute within the acceptance window: quality mismatch, quantity/weight shortfall, non-delivery, damaged goods, wrong variety | Buyer | MVP | Evidence (photos, weighbridge slip, lab report optional) is required |
| KIS-DSP-002 | A seller can raise a dispute: non-payment, rejection without reason, buyer no-show | Seller | MVP | — |
| KIS-DSP-003 | A dispute freezes the related settlement until resolution | System | MVP | — |
| KIS-DSP-004 | Resolution options: full refund (with return logistics), partial refund / price adjustment, no refund, re-delivery | Admin | MVP | — |
| KIS-DSP-005 | Dispute SLA: initial response 24 h; resolution target 7 days | Admin | MVP | — |
| KIS-DSP-006 | AI summarises evidence and the timeline for the human resolver; it never decides | Admin | MVP | — |
| KIS-DSP-007 | Third-party quality inspection on request (paid) | Inspector | P2 | — |

### 5.22 Admin dashboard (ADM) — feature 22

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-ADM-001 | User management (search, view, suspend, role change, impersonate-read-only with audit) | Admin | MVP | — |
| KIS-ADM-002 | Verification queue (KYC, business, leader, transporter) with AI risk annotations | Verifier | MVP | — |
| KIS-ADM-003 | Listing moderation queue (flagged listings, prohibited items, price outliers, duplicates) | Moderator | MVP | — |
| KIS-ADM-004 | Order / payment / settlement monitoring; manual hold/release with dual approval for finance actions over ₹50,000 | Finance | MVP | — |
| KIS-ADM-005 | Dispute console | Admin | MVP | — |
| KIS-ADM-006 | Commission and fee configuration per category (effective-dated) | Admin | MVP | — |
| KIS-ADM-007 | Category and attribute schema management; synonyms | Admin | MVP | — |
| KIS-ADM-008 | Membership plan and T&C version management | Admin | MVP | — |
| KIS-ADM-009 | Platform coupons | Admin | Future | — |
| KIS-ADM-010 | KISAAN AI monitoring: conversations, tool executions (count, success/failure, latency per tool), approval rates, cost per tool/channel/day, flagged conversations, prompt/model version | Admin | MVP | — |
| KIS-ADM-011 | Fraud / risk console (Trust rules engine flags) | Admin | MVP | — |
| KIS-ADM-012 | Audit log viewer (immutable) | Admin | MVP | — |
| KIS-ADM-013 | Feature flags and platform configuration (TTLs, thresholds) | Admin | MVP | — |
| KIS-ADM-014 | **AI configuration:** model/provider selection per task class, prompt version management with staged rollout and rollback, token and daily cost budgets, global and per-tool kill switch | AI admin | MVP | **Given** the global kill switch is on, **Then** the AI replies with a localised "AI unavailable, use the app screens" message and no tool executes |
| KIS-ADM-015 | **AI tool catalogue:** list every tool with category, class (READ/DRAFT/COMMIT), allowed roles, rate limit, timeout; admin can disable a tool or *narrow* its roles/limits but never widen the code-defined permission | AI admin | MVP | **Given** an admin tries to add a role not in the code-defined allow-list, **Then** the change is rejected |
| KIS-ADM-016 | **AI tool execution log:** searchable by user, tool, status, time; shows inputs/outputs PII-redacted, linked approval and conversation; access is audited | AI admin, Support | MVP | — |
| KIS-ADM-017 | **AI cost dashboard:** tokens and ₹ cost by day, model, tool, channel and role; STT/TTS minutes; budget alerts | AI admin, Finance | MVP | Data freshness ≤ 1 h |
| KIS-ADM-018 | Coupon emergency disable (any seller coupon) and buyer-group moderation (suspend group, remove leader badge) with reason and audit | Admin | MVP | **Given** an admin disables a coupon, **Then** new applications fail within 60 s and unpaid quotes using it are repriced |

### 5.23 Analytics & reporting (ANL) — feature 23

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-ANL-001 | KPI dashboard: users by role and verification, active listings by category, orders, GMV, completed transactions, commission revenue, disputes, conversion funnel, AI usage and cost | Admin | MVP | Data freshness ≤ 1 h |
| KIS-ANL-002 | Event tracking taxonomy (see ADMIN/analytics doc) with consented analytics only | System | MVP | — |
| KIS-ANL-003 | Seller insights: views, enquiries, offers, conversion, average realised price vs mandi modal price | Seller | MVP (basic), P2 (AI insights) | — |
| KIS-ANL-004 | Buyer spend reports, exportable CSV | Buyer | P2 | — |
| KIS-ANL-005 | Crop availability forecasting (aggregated listing data); clearly labelled as indicative | Admin, Buyer | Future | Only once there is sufficient validated data |

### 5.24 Wholesale / bulk pricing (WHL) — feature 24 (§2A.1)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-WHL-001 | A seller can enable or disable wholesale pricing per listing | Seller | MVP | **Given** wholesale disabled, **Then** no tiers are shown or applied |
| KIS-WHL-002 | **Quantity tiers (slabs):** up to 5 tiers per listing, each with `min_qty` (in display unit, stored kg) and a discount of type **percentage** or **fixed amount per unit** | Seller | MVP | **Given** tiers 50+ qtl → 5% and 100+ qtl → 8%, **When** a buyer selects 120 qtl, **Then** 8% applies |
| KIS-WHL-003 | Tiers must have strictly increasing min_qty and non-decreasing effective discount; min_qty ≥ listing MOQ; the effective price must stay > 0 | Seller | MVP | Invalid tier sets are rejected with field-level errors |
| KIS-WHL-004 | **"Buy the whole lot" offer:** a special price (or discount) available only if the buyer purchases the **entire available quantity** at that moment | Seller | MVP | **Given** available = 200 qtl and the whole-lot price = ₹2,350/qtl, **When** the buyer selects all 200 qtl, **Then** ₹2,350/qtl applies |
| KIS-WHL-005 | Whole-lot eligibility is evaluated at reservation time; if available changes before reservation, the buyer is shown the new whole-lot qty | System | MVP | — |
| KIS-WHL-006 | Only the **single best** applicable wholesale benefit applies (the highest tier met, or whole-lot if better); tiers never compound | System | MVP | — |
| KIS-WHL-007 | Wholesale tiers are shown clearly on search cards ("Bulk deal: up to 8% off"), on the product page (tier table) and in the offer/cart total with the "you save" amount | Buyer | MVP | — |
| KIS-WHL-008 | Group orders count the **aggregated group quantity** for tier eligibility (GROUP) | System | MVP | — |
| KIS-WHL-009 | Stacking with negotiation, coupons and membership follows PRC rules (KIS-PRC-001…) | System | MVP | — |
| KIS-WHL-010 | Changes to tiers do not affect existing reservations/orders (price snapshot) | System | MVP | — |
| KIS-WHL-011 | KISAAN AI can suggest tiers based on lot size and mandi price bands; the seller approves | Seller | P2 | — |
| KIS-WHL-012 | Wholesale tiers are funded entirely by the seller (commission is computed on the post-discount price) | System | MVP | — |
| KIS-WHL-013 | **Group options per tier set:** `group_eligible`, `group_min_qty`, **group discount** (₹/unit or %) applied on group orders meeting the minimum, on top of the tier evaluated on total group quantity (PRICING_ENGINE stage 3, KIS-PRC-008), and `group_min_paid_qty` (seller minimum after payment) | Seller | MVP | **Given** tier ₹90/kg on 100 kg and group discount ₹5/kg, **When** a qualifying group orders, **Then** the unit price before member price/coupon is ₹85/kg |
| KIS-WHL-014 | Tier-set validity window (start/end date-time IST), scheduling, one active set per listing, versioning; minimum bulk quantity and applicable listings | Seller | MVP | **Given** an offer with end date passed, **Then** it is not applied and the listing reverts to list/tier pricing |
| KIS-WHL-015 | `eligible_buyer_types` restriction (all / individual / bulk buyer / group) | Seller | MVP | **Given** a set restricted to bulk buyers, **When** a normal buyer quotes, **Then** list price applies |
| KIS-WHL-016 | Apply a tier-set template to several listings of the same commodity | Seller | P2 | — |
| KIS-WHL-017 | Per-order `max_order_qty`; above it the order is rejected with `QTY_ABOVE_MAX` and the AI suggests a quotation | Seller | MVP | — |
| KIS-WHL-018 | `unit_price` tier type (seller enters ₹48/kg directly instead of a discount) | Seller | MVP | — |
| KIS-WHL-019 | Admin emergency disable of a tier set, with seller notification and audit | Admin | MVP | — |
| KIS-WHL-020 | KISAAN AI turns a spoken pricing intent ("20 quintal ya zyada lene par discount") into a draft tier set (`pricing.draft_wholesale_tiers`) shown for seller confirmation; publishing is COMMIT (`pricing.propose_wholesale_tiers`) | Seller | MVP | **Given** the master-prompt Moga wheat utterance, **Then** a draft with min bulk qty 20 qtl is produced and nothing is published until the seller approves |

Normative rules: [WHOLESALE_AND_GROUP_BUYING](WHOLESALE_AND_GROUP_BUYING.md), [PRICING_ENGINE](PRICING_ENGINE.md).

### 5.25 Group buying & area leaders (GROUP) — feature 25 (§2A.2)

⚠ **Partial MVP:** In MVP a leader aggregates demand and members pay the platform's Payment Aggregator directly for their own allocations. **Leader-collects-money mode is Future**, blocked on `[LEGAL REVIEW]` (payment aggregation/escrow rules, fraud risk).

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-GROUP-001 | **Separate Group Leader application flow** (offered from the bulk-buyer path, KIS-BULK-001, and from any buyer profile), distinct from normal buyer signup: identity KYC (T1 minimum), proof of area association (address proof / cooperative / RWA letter — optional in MVP), bank/UPI, leader T&C acceptance, admin approval | Leader | MVP | **Given** a pending leader application, **Then** the user cannot create groups until approved |
| KIS-GROUP-002 | Leader verification badge plus rating; leader profile shows area, groups run, completion rate | Leader | MVP | — |
| KIS-GROUP-003 | A leader creates a **buying group**: area (village/colony/mandi + geo radius), product (specific listing **or** a commodity spec for RFQ-based groups), target quantity, min/max per member, join deadline, delivery point, delivery mode | Leader | MVP | — |
| KIS-GROUP-004 | Groups are **publicly visible**, including to logged-out users: "<Leader> is leading <area> to buy <qty> of <product>" with progress (committed / target), deadline and pricing preview | All | MVP | — |
| KIS-GROUP-005 | Join a group: a member commits a quantity within min/max and the group capacity; joining requires login and phone verification | Buyer | MVP | — |
| KIS-GROUP-006 | *(Revised v0.2, D-103)* **Member payment after lock:** joining records a commitment only (no money). When the leader locks the group order, each member receives their own locked breakdown and pays it directly to KISAAN's payment provider within the payment window (default 24 h; 6 h perishables). v0.1 capture-at-join is retired | Buyer | MVP | **Given** a member commits 5 qtl, **Then** no payment is taken until lock; **Given** the group is locked, **Then** the member pays exactly the locked breakdown |
| KIS-GROUP-007 | *(Revised v0.2)* Members can change or withdraw their commitment freely until lock (no money involved); after lock an unpaid member simply drops out; refunds after payment follow dispute/refund rules | Buyer | MVP | — |
| KIS-GROUP-008 | *(Revised v0.2)* Group lock and close: when the target is met or the deadline passes, the leader (requirement-bound: after selecting a seller offer) locks the group order (APR); inventory is reserved for the total at lock; at window end, if paid quantity still meets the locked tier/group minimum → Confirmed, otherwise the seller decides within 6 h: honour (proceed at the locked price), re-offer (new price for the paid quantity; each paid member re-confirms within 12 h or is refunded) or decline (group cancelled, full refunds); no response = decline (D-132) | Leader | MVP | See FS BR-GROUP-07/08 |
| KIS-GROUP-009 | Group order = one consolidated order to the seller with **allocations** per member; inventory is reserved for the group total at lock (TTL = payment window) | System | MVP | — |
| KIS-GROUP-010 | Delivery to a **common delivery point**; the leader confirms receipt and distributes; each member confirms receipt of their allocation (or the leader marks it on their behalf with the member's OTP) | Leader, Members | MVP | — |
| KIS-GROUP-011 | Dispute handling at member level (allocation) and group level (whole delivery); the leader cannot resolve money disputes | Members, Admin | MVP | — |
| KIS-GROUP-012 | Anti-abuse: limits on concurrent groups per new leader, max group value for leaders < 3 completed groups, Trust rules engine monitoring of fake members, sudden-group patterns; reporting a leader | System, Admin | MVP | — |
| KIS-GROUP-013 | Leader-collects-money mode (leader pays the seller for the whole group, collects from members off-platform or via sub-wallets) | Leader | Future | Blocked: `[LEGAL REVIEW]` |
| KIS-GROUP-014 | Leader incentive/commission | Leader | Future | `[DECISION D-10]` |
| KIS-GROUP-015 | Group chat/announcements between the leader and members (in-app; phone numbers hidden by default) | Leader, Members | MVP | — |
| KIS-GROUP-016 | Groups are discoverable in search and through the AI ("Ludhiana mein koi aloo ka group hai?") | Buyer | MVP | — |
| KIS-GROUP-017 | **Requirement-bound groups (MVP, D-133):** group requirement fields (product, variety/spec, target qty, min_close, per-member min/max, deadline, area, drop point, delivery strategy); remaining = target − committed, server-side; sellers in the area/category submit **group offers** (unit price, group discount, validity, min/max qty); the leader shortlists, shares and selects one offer (APR); members confirm their own commitment against it | Leader, Seller, Members | MVP | **Given** the leader selects an offer, **Then** members are notified and must each re-confirm before their payment window opens |
| KIS-GROUP-018 | **Commit-then-pay lifecycle:** Draft → Open → (TargetReached) → (OfferSelection) → Locked (payment window, default 24 h) → Confirmed → InDelivery → Delivered → Completed / Cancelled; reservation at lock; at window close, if paid qty < seller minimum the seller decides honour / re-offer / decline (D-132). Members: committed → payment_due → paid, or released | Members, Leader | MVP | **Given** a member commits, **Then** no payment is taken until lock; status is visible to all members |
| KIS-GROUP-019 | Leader display block on every group surface: display name, "Verified Group Leader" badge, group name, area, current group demand (e.g. "Current group demand: 2,500 kg") and the mandatory disclaimer "Group leaders are independent KISAAN users, not KISAAN employees or representatives" in pa/hi/en, in UI, AI speech and receipts | All | MVP | **Given** any group page, card or AI answer naming a leader, **Then** the disclaimer is shown (UI) or spoken/written (AI) |
| KIS-GROUP-020 | **Leader permission boundary**, enforced server-side: the leader sees members' display names, committed quantities and paid/due/released status only; never phone, address, payment method/IDs, amounts beyond qty × unit price, or KYC (`GROUP_FORBIDDEN_FIELD`). Members see the leader's display name/badge and group aggregates only | System | MVP | **Given** a leader calls any group API or AI tool, **Then** no member PII field is returned (KIS-TEST-GROUP permission tests) |
| KIS-GROUP-021 | Member verification (verified phone; one membership per verified phone per group; optional T1-only groups) and member reliability: 2 no-pays in 90 days → pay at commitment for the next 3 groups | System | MVP | — |
| KIS-GROUP-022 | Leader handover to a co-leader before lock; leader exit/suspension handling | Leader, Admin | MVP | — |
| KIS-GROUP-023 | Delivery strategies: common drop point, collect from seller, seller delivers, platform logistics with estimate + 10 % buffer (D-134, pending owner sign-off); multi-drop P2 | Leader | MVP / P2 | — |
| KIS-GROUP-024 | Member voting/polls on offers | Members | P2 | — |
| KIS-GROUP-025 | Leader may remove a member before lock with a reason code (max 3 per group, audited, member notified) | Leader | MVP | — |
| KIS-GROUP-026 | Leader announcements to all members (masked, moderated, rate-limited 5/day) | Leader | MVP | — |

> Group coupons (one `group_eligible` coupon applied by the leader at lock, allocated pro-rata with largest-remainder rounding) are specified as **KIS-COUPON-016**; group pricing and allocation as **KIS-PRC-008/010/011**.

Normative rules: [WHOLESALE_AND_GROUP_BUYING](WHOLESALE_AND_GROUP_BUYING.md).

### 5.26 Membership programme & T&C (MEMBER) — feature 26 (§2A.3)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-MEMBER-001 | **KISAAN Plus** paid membership for buyers (plans: monthly, yearly; price placeholders ₹199/month, ₹1,999/year) `[DECISION D-11: pricing]` | Buyer | MVP | — |
| KIS-MEMBER-002 | Benefits (MVP): **free delivery** (delivery-fee waiver) on deliveries charged through KISAAN up to a cap per order/month; **priority delivery** (priority dispatch to transporters + member SLA) — **P2, delivered with the Phase 7 transporter marketplace** `[DECISION D-96]`; **member-only deals** (seller opt-in member prices); **early access** to new bulk lots (e.g. 2 h before public); **priority support** | Buyer | MVP | Each benefit has eligibility rules (KIS-MEMBER-006) |
| KIS-MEMBER-003 | Benefits (P2/Future): extended acceptance window, free quality inspection credits (P2), member pricing on transport, seller-side membership (Future) | — | P2/Future | — |
| KIS-MEMBER-004 | Free trial (e.g. 30 days, once per user/business PAN) `[DECISION D-11]` | Buyer | MVP | **Given** a prior trial on the same PAN/phone, **Then** the trial is not offered |
| KIS-MEMBER-005 | **Mandatory T&C acceptance** before activation: versioned T&C document; acceptance stored with user ID, version, timestamp, IP/device, language, channel | Buyer | MVP | **Given** a new T&C version with material changes, **Then** members must re-accept before the next renewal or the renewal is not charged |
| KIS-MEMBER-006 | Benefit eligibility rules: free delivery cap (e.g. ₹500 per order, ₹2,000 per month), applicable only on platform logistics, within the service area; member deals per seller opt-in; benefits require an active membership at order placement | Buyer | MVP | — |
| KIS-MEMBER-007 | Auto-renewal with an explicit opt-in toggle at purchase (not pre-ticked); pre-debit notification per RBI e-mandate rules; renewal reminder 7 days before | Buyer | MVP | `[LEGAL REVIEW]` dark-pattern compliance |
| KIS-MEMBER-008 | Cancel anytime in ≤ 2 taps / one voice command (with confirmation); cancellation stops auto-renewal, and benefits continue until the end of the period | Buyer | MVP | — |
| KIS-MEMBER-009 | Refund policy: full refund if cancelled within 7 days and no benefit used; otherwise no pro-rata refund on monthly plans; yearly pro-rata minus benefits used `[DECISION D-12]` `[LEGAL REVIEW]` | Buyer | MVP | — |
| KIS-MEMBER-010 | Membership states: Trial, Active, Grace (payment failed, 3 days), Cancelled (active till end), Expired, Suspended (misuse) | System | MVP | — |
| KIS-MEMBER-011 | Misuse controls: sharing accounts, abnormal free-delivery usage → suspension per T&C | Admin | MVP | — |
| KIS-MEMBER-012 | Admin manages plans, benefits, T&C versions; changes to benefits are effective-dated and notified 30 days in advance | Admin | MVP | — |
| KIS-MEMBER-013 | A draft T&C document exists: see [MEMBERSHIP_TERMS_AND_CONDITIONS](MEMBERSHIP_TERMS_AND_CONDITIONS.md) `[LEGAL REVIEW]` | — | MVP | — |
| KIS-MEMBER-014 | Membership benefit cost tracking (platform-funded free delivery) for unit economics | Finance | MVP | — |
| KIS-MEMBER-015 | Benefits and eligibility engine returning entitlements, remaining caps, benefit version and not-applied reason codes | System | MVP | — |
| KIS-MEMBER-016 | Benefit usage ledger with reserve / consume / release / restore semantics | System | MVP | — |
| KIS-MEMBER-017 | Group orders: per-member waiver on the member's delivery share within the member's caps | System | MVP | — |
| KIS-MEMBER-018 | Benefit catalogue versioning with effective dates and 30-day notice for reductions | Admin | MVP | — |
| KIS-MEMBER-019 | Grace handling: benefits continue 3 days; at most one automatic retry with a fresh pre-debit notice; manual pay link `[LEGAL REVIEW]` | System | MVP | — |
| KIS-MEMBER-020 | No benefit is promised that the platform cannot guarantee: every benefit is published with its limit and availability state; "faster delivery" only where a member SLA exists (P2, platform logistics); the plan page is generated from the active benefit configuration | System | MVP | **Given** free delivery is not available in a pincode, **Then** the plan page and AI say so for that pincode |
| KIS-MEMBER-021 | Suspension needs human review, reason, notification and appeal; suspension invalidates open quotes | Admin | MVP | — |
| KIS-MEMBER-022 | KISAAN AI may explain and prepare membership actions (`membership.propose_purchase`, `membership.propose_cancel_or_autorenew`) but never grant, extend or refund | System | MVP | — |
| KIS-MEMBER-023 | Naming: the membership is **KISAAN Plus** everywhere (UI, AI, T&C, invoices); third-party programme names are never used | — | MVP | — |

Normative rules: [COUPON_AND_MEMBERSHIP](COUPON_AND_MEMBERSHIP.md); T&C text: [MEMBERSHIP_TERMS_AND_CONDITIONS](MEMBERSHIP_TERMS_AND_CONDITIONS.md).

### 5.27 Public seller stores (STORE) — feature 27 (§2A.4)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-STORE-001 | Every seller automatically gets a **public store** at a shareable URL (`/store/<slug>`) on first publish | Seller | MVP | **Given** the seller publishes the first listing, **Then** the store is live and shareable via WhatsApp with a preview card |
| KIS-STORE-002 | The store shows: name, banner, description, verification badges, rating, location/service area (district-level), all Active listings (sold-out items optionally shown), wholesale and coupon highlights, policies, groups using this seller's listings | All incl. anonymous | MVP | — |
| KIS-STORE-003 | Store is discoverable by logged-out visitors and search engines; contact details follow privacy settings (KIS-PROF-004) | Anonymous | MVP | — |
| KIS-STORE-004 | Seller customisation: store name, slug (unique, profanity-filtered, changeable at most once per 30 days with redirect), banner, logo, description (multi-language), policies (returns, delivery, payment) | Seller | MVP | — |
| KIS-STORE-005 | Store QR code for offline sharing (mandi boards, posters) | Seller | MVP | — |
| KIS-STORE-006 | Follow store → notifications on new listings | Buyer | P2 | — |
| KIS-STORE-007 | Store suspended/hidden when the seller is suspended; the URL shows "store unavailable" | Admin | MVP | — |
| KIS-STORE-008 | Store analytics (views, shares, enquiries) | Seller | MVP (basic) | — |
| KIS-STORE-009 | Structured store policies (returns/refund, delivery, payment) with platform minimums that sellers cannot weaken | Seller | MVP | — |
| KIS-STORE-010 | Indexing, sitemap, canonical, hreflang and structured-data rules for store pages | System | MVP | — |
| KIS-STORE-011 | Store-level display of wholesale, public coupon, open-group and KISAAN Plus benefit badges (e.g. member prices, free-delivery eligibility); values come from server-side pricing quotes, never client-computed | All | MVP | — |
| KIS-STORE-012 | Vacation mode: hide the store and pause its listings with an optional reopen date; existing orders and reservations are unaffected | Seller | MVP | — |
| KIS-STORE-013 | Public/private field boundary enforced by a serializer allow-list on public endpoints | System | MVP | — |

Normative rules: [SELLER_STORE_AND_INVENTORY](SELLER_STORE_AND_INVENTORY.md).

### 5.28 Automated inventory (INV) — feature 28 (§2A.5)

Covered by KIS-INV-001 … KIS-INV-011 in §5.10. The confirmed §2A.5 behaviours map as follows: automatic reserve (KIS-INV-002), deduct (KIS-INV-003), release (KIS-INV-004), overselling prevention (KIS-INV-005), manual adjustments with reason and audit (KIS-INV-006, KIS-INV-009), low-stock alerts (KIS-INV-007), out-of-stock auto-hide (KIS-INV-008). Inventory buckets (available, reserved, sold, pending, damaged, expired), the reservation/concurrency strategy and the 700 kg + 500 kg race are normative in [SELLER_STORE_AND_INVENTORY](SELLER_STORE_AND_INVENTORY.md). KISAAN AI may only *draft* inventory adjustments; material adjustments are COMMIT-class (KIS-APR-001).

### 5.29 Seller discount coupons (COUPON) — feature 29 (§2A.6)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-COUPON-001 | Sellers create coupons for their own store/products | Seller | MVP | — |
| KIS-COUPON-002 | Coupon fields: code (4–20 chars, A-Z0-9, unique per seller, case-insensitive), discount type (percentage / fixed per order), value, **max discount** cap (required for percentage), min order value and/or min quantity, applicable listings or categories (or all store), **start and end date/time** (IST), total usage limit, per-user usage limit, eligible users (all / members only / group leaders only / first-time buyers of this seller / group orders), status (draft / active / paused / expired / exhausted) | Seller | MVP | — |
| KIS-COUPON-003 | Validation at apply-time and again at payment-confirmation time (time window, status, limits, eligibility, applicability, min order) | System | MVP | **Given** a coupon expires between cart and payment, **Then** the order is repriced and the buyer must re-approve |
| KIS-COUPON-004 | Max **one seller coupon per order**; any coupon discount is capped at 50 % of the goods value it applies to (D-40, KIS-SEC-161); platform coupons Future | System | MVP | — |
| KIS-COUPON-005 | Usage limits enforced atomically (no over-redemption under concurrency); redemption is reserved at checkout and committed on payment | System | MVP | — |
| KIS-COUPON-006 | Coupon cost is borne by the seller; commission is computed on the post-coupon price | System | MVP | `[DECISION D-13]` |
| KIS-COUPON-007 | Public coupons are displayed on the product page/store ("Use KINNOW10 till 20 Jan"); private coupons work by code only | Seller | MVP | — |
| KIS-COUPON-008 | Abuse prevention: per-user limits keyed on verified phone and PAN/GSTIN, device fingerprint heuristics, block self-redemption (seller buying from own store), Trust rules engine anomaly flags | System | MVP | — |
| KIS-COUPON-009 | Limited-time coupons show the real end time; no fake countdowns (dark-pattern guidelines) `[LEGAL REVIEW]` | System | MVP | — |
| KIS-COUPON-010 | Coupon performance report (redemptions, discount given, GMV influenced) | Seller | MVP | — |
| KIS-COUPON-011 | Coupons on accepted negotiated offers are **not allowed** by default (negotiation already sets the price); the seller can allow it per coupon | Seller | MVP | See KIS-PRC-004 |
| KIS-COUPON-012 | Platform/admin coupons (platform-funded) | Admin | Future | — |
| KIS-COUPON-013 | Buyer segment eligibility as a combinable set (`eligible_segments`): `NEW_CUSTOMER`, `EXISTING_CUSTOMER`, `BULK_BUYERS`, `GROUP_ORDERS`, `MEMBERS`, `ALL`, plus specific users; eligible categories; active/inactive toggle independent of dates; `allow_on_negotiated` flag | Seller | MVP | **Given** `valid_hours` 06:00–10:00 and an apply at 11:00 IST, **Then** the coupon is rejected with `COUPON_OUTSIDE_HOURS` |
| KIS-COUPON-014 | Time-of-day (`valid_hours`) and day-of-week restrictions (IST); outside them → `COUPON_OUTSIDE_HOURS` | Seller | MVP | — |
| KIS-COUPON-015 | Discount budget limit (total ₹ across redemptions), with partial application when the remaining budget is smaller than the computed discount | Seller | MVP | — |
| KIS-COUPON-016 | `group_eligible` flag; one group coupon applied by the leader at lock and allocated pro-rata to member lines (largest-remainder rounding); a fixed-amount share unused because of non-payers is not redistributed; counts as one redemption for the group | Leader | MVP | — |
| KIS-COUPON-017 | Admin emergency disable and re-enable with mandatory reason, audit entry, seller notification and invalidation of unpaid checkout quotes within 60 s | Admin | MVP | — |
| KIS-COUPON-018 | Cancellation/refund behaviour: whole order cancelled before dispatch → redemption voided and usage restored; partial refund → discount pro-rated, usage not restored; clawback on buyer-initiated partial cancellation | System | MVP | — |
| KIS-COUPON-019 | Deterministic validation order and precise localised failure reasons | System | MVP | — |
| KIS-COUPON-020 | Platform rules (stacking, max one coupon, floor, 50 % cap) are not seller-editable; violating configurations are rejected | System | MVP | — |
| KIS-COUPON-021 | KISAAN AI can prepare a coupon draft (`coupons.draft_coupon`) from a request ("WELCOME10, 10% off, ₹1,000 minimum, ₹500 max, till 31 Dec"); publishing requires seller approval (`coupons.propose_create_coupon`) with readback of type, value, cap, dates and limits | Seller | MVP | — |
| KIS-COUPON-022 | Coupon audit trail: every create, edit, status change and admin action recorded with actor, channel and before/after values | System | MVP | — |

Normative rules: [COUPON_AND_MEMBERSHIP](COUPON_AND_MEMBERSHIP.md).

### 5.30 Pricing engine & discount stacking (PRC) — cross-cutting

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| KIS-PRC-001 | A single pricing engine computes the effective price for any (listing, qty, buyer, context) and returns a **price breakdown** used by search, the product page, offers, checkout, group orders, invoices and AI | System | MVP | Every surface shows identical totals for the same inputs |
| KIS-PRC-002 | Stacking order (v0.2, D-103; normative in [PRICING_ENGINE](PRICING_ENGINE.md)): (1) base → (2) wholesale (best single tier or whole-lot; group orders on total group qty) → (3) **group discount** (group orders only) → (4) negotiated price **replaces** (1)–(3) and (5) → (5) member price = min(current, member price) → (6) one seller coupon (group orders: one `group_eligible` coupon at group level) → (7) floor check → (8) delivery fee with KISAAN Plus waiver → (9) taxes | System | MVP | §27 worked example in PRICING_ENGINE: ₹100 list, 100 kg, ₹90 tier, ₹5 group, 10% coupon, member free delivery → ₹7,650.00 |
| KIS-PRC-003 | Discounts are never applied in a way that makes the unit price < ₹0.01 or the order total negative; a seller-configurable **price floor** blocks coupon+tier combinations below the floor | System | MVP | — |
| KIS-PRC-004 | Coupons apply after negotiation only if the coupon has `allow_on_negotiated = true` | System | MVP | — |
| KIS-PRC-005 | Funding attribution in the breakdown: seller-funded (wholesale, coupon, member-only price), platform-funded (free delivery) | System | MVP | — |
| KIS-PRC-006 | Price quotes have a validity (e.g. 15 min on checkout) and are re-validated at payment confirmation | System | MVP | — |
| KIS-PRC-007 | Rounding: unit prices are computed and stored internally at ₹0.0001 per kg precision; every displayed and charged amount (line totals, discounts, fees, taxes, grand total) is rounded half-up to ₹0.01; prices are displayed per kg and per display unit | System | MVP | Golden tests KIS-TEST-PRC-007 |
| KIS-PRC-008 | **Group discount stage:** a seller-defined group-buy discount (₹/kg or %) on a `group_eligible` listing or group offer, applied only on group orders meeting `group_min_qty` (PRICING_ENGINE stage 3) | System | MVP | — |
| KIS-PRC-009 | The stack/no-stack matrix is enforced; violating configurations are rejected at save time (`PRICING_RULE_CONFLICT`) | System | MVP | — |
| KIS-PRC-010 | **Group allocation:** the engine prices the group total, then allocates goods, coupon and delivery to member lines with the largest-remainder method so member lines sum exactly | System | MVP | — |
| KIS-PRC-011 | **Group price lock:** indicative price at commitment (no payment); the final group price is locked at the leader's lock and held for the payment window (default 24 h); each member pays exactly the locked breakdown | System | MVP | **Given** a member pays within the window, **Then** they pay exactly the locked breakdown |
| KIS-PRC-012 | Order limits: listing MOQ, `max_order_qty`, available quantity, store minimum order value | System | MVP | — |
| KIS-PRC-013 | Tier types (fixed unit price, % off, ₹/kg off) with optional time window, eligible buyer types and group flag | System | MVP | — |
| KIS-PRC-014 | Quotes are persisted, owned by one user, single-use, carry a rule-version snapshot and breakdown hash | System | MVP | — |
| KIS-PRC-015 | Checkout re-validation at order creation, payment initiation and payment capture | System | MVP | — |
| KIS-PRC-016 | Tax stage: GST per line on post-discount taxable value from a configurable rate table; TCS/TDS are seller-payout withholdings `[TAX REVIEW]` | System | MVP | — |
| KIS-PRC-017 | Display: all-inclusive total before any payment; tier table, "you save" and next-tier nudge only from engine output | Buyer | MVP | — |
| KIS-PRC-018 | KISAAN AI states prices only from engine responses (`pricing.get_quote`), labelled estimate or locked quote | System | MVP | — |
| KIS-PRC-019 | Replay and audit: every quote stores inputs and rule versions so support can reproduce the identical breakdown | Admin | MVP | — |
| KIS-PRC-020 | Configurable buyer-side fee lines (default ₹0 for goods) | System | MVP | — |

---

## 6. AI-first experience requirements

KISAAN has **exactly one AI — KISAAN AI** (D-101): one identity, one runtime, one conversation per user session. It works through secure, narrowly-scoped **tools** (ordinary permission-checked API operations grouped into categories); there are no specialist agents or sub-agents. Detailed design: [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md). This section defines product-level requirements.

### 6.1 KISAAN AI — assistant behaviour

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| KIS-AI-001 | KISAAN AI is available on every screen (floating mic + chat), on WhatsApp and as the default home for sellers. It is never mandatory: every workflow also has a conventional UI path | MVP | **Given** any AI-supported workflow, **Then** an equivalent non-AI screen exists (UX_UI_SPECIFICATION §2) |
| KIS-AI-002 | Intent understanding across pa/hi/en and mixed/romanised input; role-aware (acts in the user's active role, taken from the server-side session, never from chat text) | MVP | Intent accuracy ≥ 90% on the pilot test set (TESTING_STRATEGY) |
| KIS-AI-003 | Slot filling: the AI asks only for missing required information, one question at a time for voice users | MVP | — |
| KIS-AI-004 | The AI acts only via tools using the **end-user's own delegated token and permissions**; it cannot access other users' private data | MVP | — |
| KIS-AI-005 | Multi-step task tracking ("listing draft 80% complete") resumable across sessions and channels | MVP | — |
| KIS-AI-006 | Every AI-stated price, stock level, order/payment status or completion is backed by a tool result; it cites source and timestamp, and says "I don't know" rather than inventing | MVP | 0 fabricated prices in the evaluation set |
| KIS-AI-007 | Graceful fallback: on low confidence or repeated misunderstanding → offer conventional screen / human support | MVP | — |
| KIS-AI-008 | Conversation history is visible to the user; users can delete their AI history (subject to audit retention of executed actions) | MVP | — |
| KIS-AI-009 | AI usage limits per user per day to control cost; premium AI features potentially in a paid tier | MVP (limits), Future (premium) | — |

### 6.2 KISAAN AI — capabilities by tool category

The capabilities below are delivered by the same KISAAN AI calling tools in the named category. v0.1 "agent" wording is retired; IDs are kept.

| ID | Tool category | Requirement | Priority |
|---|---|---|---|
| KIS-AI-010 | `catalogue`, `seller` | Creates store and listing drafts from text, voice or photo; detects missing fields; converts units; suggests category; generates description; **never publishes without approval**; image analysis is never a quality certification | MVP |
| KIS-AI-011 | `discovery` | Converts buyer needs into searches (product, location, quality, quantity, price, delivery); explains rankings; never recommends unavailable listings | MVP |
| KIS-AI-012 | `market` | Retrieves mandi prices (MKT), compares markets, shows ranges with source and date; never invents or guarantees prices | MVP |
| KIS-AI-013 | `matching` | Calls the **deterministic backend matching service** (`matching.find_matches`) for RFQ ↔ listing and listing ↔ buyer matches; explains why; respects contact preferences; never invents matches | MVP |
| KIS-AI-014 | `offers` | Compares offers (net realisation), explains, drafts counters; **never accepts/rejects/sends without approval** | MVP |
| KIS-AI-015 | `logistics` | Explains delivery options and status; drafts transport requests and compares quotes (P2 with the transporter marketplace); cost estimates only from quotes/historical data | MVP (explain/status), P2 (transport requests) |
| KIS-AI-016 | *Retired (v0.2)* — trust/verification is a **deterministic Trust rules engine** (backend job), not AI. KISAAN AI may read a user's own verification status via `account` tools | — | Retired |
| KIS-AI-017 | *Retired (v0.2)* — notification channel/timing selection is the backend **notification dispatcher** using approved templates, not AI | — | Retired |
| KIS-AI-018 | `support` | FAQ/RAG answers, status explanations, ticket creation, human escalation | MVP |
| KIS-AI-019 | `seller` (analytics) | Explains a seller's metrics and suggests actions | P2 |
| KIS-AI-020 | — | Crop availability forecasting / demand discovery: aggregated, labelled indicative; requires validated data | Future |
| KIS-AI-021 | — | **Exactly one AI:** one identity, one runtime, one reasoning loop per turn, one conversation context per session; no specialist agents, sub-agents or agent services. Domain separation is expressed as tools and backend modules only | MVP |
| KIS-AI-022…035, 037…039 | — | Single-AI runtime requirements (tool registry, double authorisation, trusted identity, outcome labelling, deterministic matching, no background agents, bounded loop, workflow state, kill switches, versioned prompts, cost metering, group privacy, admin AI, provider fallback, retention, no AI execution of financial operations, bulk-buyer assistance) — normative in [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md) §3.2 | MVP |
| KIS-AI-036 | — | Untrusted content (listing text, offer messages, reviews, names, OCR, documents, RAG content) is passed as delimited data, never as instructions; tool permissions cannot be widened by content (prompt-injection defence, KIS-SEC) | MVP |
| KIS-AI-040 | `groups` | Helps leaders draft groups and requirements; explains target/committed/remaining quantities and deadlines; compares seller offers for the group; explains **only the requesting member's own** commitment and payment status (`groups.get_my_commitment`) | MVP |
| KIS-AI-041 | `inventory` | Explains availability, reserved/sold quantities and movement history; drafts adjustments (`inventory.propose_adjustment`, COMMIT to apply) | MVP |
| KIS-AI-042 | `pricing`, `coupons`, `membership` | Calls the pricing engine for every price/discount stated (`pricing.get_quote`); explains wholesale tiers, group discount, coupons, KISAAN Plus benefits, delivery and taxes; prepares tier/coupon drafts for seller review | MVP |
| KIS-AI-043 | `orders`, `payments` | Assists with cart, checkout, order status, refunds and disputes without bypassing backend validation; initiates payment only via approval (`payments.propose_pay`) plus the payment provider's own authentication | MVP |

### 6.3 Approvals (APR) — human in the loop

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| KIS-APR-001 | Tool classes: **READ** (no approval), **DRAFT** (no approval, private draft only), **COMMIT** (approval required): publish or materially change a listing/store, apply material inventory adjustment, publish/change coupon, promotion or wholesale offer, send/accept/reject/counter offer, commit a buyer or group to a purchase, confirm/cancel order, initiate payment/refund/payout, accept transport quote, commit group quantity, lock group order, purchase/renew/cancel KISAAN Plus, accept T&C | MVP | No commit-class tool executes without an `approved` ApprovalRequest |
| KIS-APR-002 | An approval shows a plain-language summary in the user's language (and TTS readback for voice) of exactly what will happen, including amounts in ₹ and quantities in the user's unit | MVP | — |
| KIS-APR-003 | Approval mechanisms: tap "Approve" in app; voice "haan, confirm" **plus** readback confirmation; WhatsApp interactive button. Payment always requires the PA's own authentication (UPI PIN, etc.) | MVP | — |
| KIS-APR-004 | Approvals expire (default 15 min) and are bound to the exact action parameters (hash); any parameter change invalidates the approval | MVP | — |
| KIS-APR-005 | Users can set **no** auto-approve for commit-class actions in MVP | MVP | — |
| KIS-APR-006 | All approvals are audit-logged (who, what, when, channel, the AI conversation reference) | MVP | — |
| KIS-APR-007 | Assisted/delegated actors (support agents, field agents) need the user's OTP consent for commit actions | MVP | — |

### 6.4 Voice & multilingual (VOX)

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| KIS-VOX-001 | Languages: Punjabi (Gurmukhi, pa-IN), Hindi (hi-IN), English (en-IN); UI, AI responses and notifications | MVP | — |
| KIS-VOX-002 | Speech-to-text for pa/hi/en and code-mixed speech; push-to-talk; noise robustness for outdoor/farm use | MVP | WER targets in TESTING_STRATEGY; pilot aspiration ≤ 20% WER on the domain test set `[ASSUMPTION A-01]`; **launch gate ≤ 25% WER** per language (KIS-TEST-VOX-001) |
| KIS-VOX-003 | Text-to-speech replies in the user's language with adjustable speed; "repeat" command | MVP | — |
| KIS-VOX-004 | Automatic language detection per utterance; the user can lock a language | MVP | — |
| KIS-VOX-005 | Domain vocabulary: crop names, varieties, local units (e.g. "man", "killa/acre"), place names (Punjab villages/tehsils) | MVP | — |
| KIS-VOX-006 | Numerals and quantities confirmed by readback before any action ("Sau quintal, matlab 10,000 kilo — sahi hai?") | MVP | — |
| KIS-VOX-007 | Low-literacy UX: icons with text, audio prompts on key screens, minimal typing | MVP | — |
| KIS-VOX-008 | Voice notes in chats (enquiries, negotiation, support) with transcription | P2 | — |
| KIS-VOX-009 | Additional languages (Haryanvi-influenced Hindi, Gujarati, Marathi …) | Future | — |

### 6.5 WhatsApp channel (WA)

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| KIS-WA-001 | Official WhatsApp Business Platform integration (no unofficial clients) | MVP | — |
| KIS-WA-002 | Explicit opt-in captured and stored; opt-out via "STOP" honoured immediately | MVP | — |
| KIS-WA-003 | Users can talk to the KISAAN AI on WhatsApp (text + voice notes) to list, search, check orders, respond to offers | MVP (core: list, offers, order status) | — |
| KIS-WA-004 | Commit actions on WhatsApp use interactive buttons + readback; payments via a PA payment link | MVP | — |
| KIS-WA-005 | Proactive messages use approved templates only (outside the 24 h session window) | MVP | — |
| KIS-WA-006 | Store/listing share links with rich previews | MVP | — |

### 6.6 Mandi price data (MKT)

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| KIS-MKT-001 | Ingest daily mandi prices (min/max/modal) from official open-data sources (e.g. AGMARKNET / data.gov.in) `[UNVERIFIED — confirm API, licence, freshness]` | MVP | — |
| KIS-MKT-002 | Store source, market, commodity, variety, date, fetch time; never overwrite historical records | MVP | — |
| KIS-MKT-003 | Every displayed price shows source + market + date; stale data (> 3 days) is labelled stale | MVP | — |
| KIS-MKT-004 | Price alerts: notify the user when the modal price for a commodity/market crosses their threshold | MVP | — |
| KIS-MKT-005 | Trends and inter-market comparison charts (7/30/90 days) where data exists | MVP (basic), P2 (analysis) | — |
| KIS-MKT-006 | No price forecasts in MVP; any future forecast is labelled indicative with methodology | Future | — |
| KIS-MKT-007 | MSP display for MSP crops (official source, season) | MVP | — |

---

## 7. Cross-cutting requirements (summary)

Security (SEC-*), privacy (PRIV-*) and compliance (CMP-*) requirements are specified in [SECURITY_AND_COMPLIANCE](SECURITY_AND_COMPLIANCE.md). Measurable non-functional requirements (NFR-*) are defined in §7.1 below; the architecture that meets them is in [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md). These PRD-level constraints apply to every feature:

- Mobile-first PWA, usable on low-end Android (2 GB RAM) on 3G/2G-class networks, within the page-weight budgets in KIS-NFR-040.
- Offline-tolerant: drafts (listing, offer, status updates) are queued locally and synced; commit actions are never executed offline.
- Accessibility: WCAG 2.1 AA target; touch targets ≥ 48 px.
- Every state-changing action is audit-logged.
- India data residency for personal data `[ASSUMPTION A-02]`.


### 7.0 Cross-cutting product principles (KIS-REQ)

| ID | Principle | Priority | Acceptance criteria |
|---|---|---|---|
| KIS-REQ-001 | **Backend-authoritative pricing:** the backend pricing engine computes every payable amount; the frontend, WhatsApp layer and KISAAN AI only display `quote_id`-backed results and never compute a final amount | MVP | **Given** a client submits a tampered total, **Then** checkout uses the server quote and rejects mismatches with `PRICE_CHANGED` |
| KIS-REQ-002 | **Backend-authoritative inventory, orders, payments, permissions:** state changes happen only in backend services inside DB transactions; no client or AI claim of "reserved/paid/placed" is shown unless a backend response confirms it | MVP | — |
| KIS-REQ-003 | **Human approval for consequential actions** by the correctly authorised user, bound to the exact action, data and expiry (KIS-APR-001…007) | MVP | — |
| KIS-REQ-004 | **AI is optional:** every workflow has a conventional UI path; AI failure never blocks commerce | MVP | Kill-switch test: all MVP E2E flows pass with AI disabled |
| KIS-REQ-005 | **Data isolation:** seller, buyer and group-member private data are isolated by row ownership on every API and tool call; group leaders get no member PII (KIS-GROUP-020) | MVP | — |
| KIS-REQ-006 | **Mobile-first, low-bandwidth:** every buyer/seller screen works on a 360 px viewport over 3G within KIS-NFR-040 budgets | MVP | — |
| KIS-REQ-007 | **Multilingual:** Punjabi, Hindi, English (incl. mixed) for UI, AI and notifications; critical extracted details are confirmed before consequential actions | MVP | — |
| KIS-REQ-008 | **OpsAPI reuse, no upstream modification:** OpsAPI is consumed as a pinned Docker image; KISAAN functionality lives in the KISAAN plugin and KISAAN-owned migrations (KIS-OPSAPI-*, [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md)) | MVP | — |
| KIS-REQ-009 | **No invented facts:** no invented market data, prices, stock, OpsAPI endpoints or regulatory claims; unverified items carry `[UNVERIFIED]` / `[LEGAL REVIEW]` / `[TAX REVIEW]` | MVP | — |
| KIS-REQ-010 | **Every commercial workflow** (purchase, wholesale, group, offer, coupon, membership, refund) defines failure and edge-case handling and acceptance criteria before build | MVP | Reviewed at each phase gate (DEVELOPMENT_ROADMAP) |

### 7.1 Non-functional requirements (NFR)

Targets apply to production at pilot scale (≤ ~10k MAU, ≤ ~1k orders/day `[ASSUMPTION A-33]`) unless stated otherwise. "p95" is measured server-side at the edge over a rolling 30 days, excluding third-party time (PA, LLM, STT/TTS) unless the requirement says otherwise. Test mapping: TC-NFR-* in [TESTING_STRATEGY](TESTING_STRATEGY.md).

| ID | Area | Requirement (measurable) | Priority |
|---|---|---|---|
| KIS-NFR-001 | Performance | Read APIs (listing detail, store page, order/offer reads): p95 ≤ 300 ms, p99 ≤ 800 ms | MVP |
| KIS-NFR-002 | Performance | Search with geo + filters: p95 ≤ 500 ms (TC-PERF-001); price quote (PRC): p95 ≤ 400 ms | MVP |
| KIS-NFR-003 | Performance | Write/commit APIs (offer, approval decision, checkout order creation excl. PA): p95 ≤ 800 ms | MVP |
| KIS-NFR-004 | Performance | AI text turn: time to first streamed token p95 ≤ 2 s; complete turn p95 ≤ 3 s for simple intents and ≤ 8 s for multi-tool turns; KISAAN AI runtime overhead (excl. model time) p95 ≤ 300 ms | MVP |
| KIS-NFR-005 | Performance | Voice round trip (end of user speech → start of TTS playback): p95 ≤ 6 s on 4G and ≤ 10 s on 3G; text reply is shown before TTS audio is ready | MVP |
| KIS-NFR-006 | Performance | Web vitals on farmer routes (simulated slow 4G, mid-range Android): LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1; time to interactive ≤ 5 s on 3G Fast for a cold PWA start | MVP |
| KIS-NFR-007 | Performance | Notifications: in-app/push delivered ≤ 30 s after the triggering event (p95); WhatsApp/SMS handed to the provider ≤ 60 s (p95) | MVP |
| KIS-NFR-010 | Scalability | Sustain 5× pilot peak load (k6 profile in TESTING §17) with all KIS-NFR-001..003 latency targets met | MVP |
| KIS-NFR-011 | Scalability | Horizontal scaling: API and the KISAAN app (web + AI runtime module) are stateless (state in Postgres/Redis/object storage) and scale by replica count; documented growth path to 10× pilot (≈ 100k MAU, 10k orders/day) via read replicas, dedicated search engine and table partitioning, without re-architecture (SYSTEM_ARCHITECTURE scalability stages) | MVP (design) / P2 (execution) |
| KIS-NFR-012 | Scalability | Mandi price ingestion of a full daily dataset completes ≤ 15 min without degrading live-traffic latency | MVP |
| KIS-NFR-020 | Availability | Core marketplace (auth, search, listings, offers, orders, checkout, approvals): ≥ 99.5% monthly availability (≈ 3.6 h downtime/month), excluding announced maintenance ≤ 4 h/month in low-traffic windows (01:00–05:00 IST) | MVP |
| KIS-NFR-021 | Availability | AI assistant: ≥ 99.0% monthly; when AI or STT/TTS providers are degraded, conventional screens remain fully usable and the chat shows a degraded-mode notice (graceful degradation; automatic fallback to a secondary LLM provider) | MVP |
| KIS-NFR-022 | Availability | Payment webhook intake ≥ 99.9% (webhooks are acknowledged and persisted before processing; PA retries are absorbed) | MVP |
| KIS-NFR-030 | Reliability | Every state-changing API accepts an `Idempotency-Key`; retries of the same key never create duplicate listings, offers, orders, payments or refunds | MVP |
| KIS-NFR-031 | Reliability | Background jobs (reservation expiry, settlement release, reconciliation, notifications) are at-least-once with idempotent handlers; outbox lag ≤ 2 min p95; failed jobs retried with backoff and dead-lettered with alerts | MVP |
| KIS-NFR-032 | Reliability | Error budget: 5xx rate ≤ 0.5% of requests per day on core APIs; alert at > 2% over 5 min | MVP |
| KIS-NFR-033 | Data consistency | **Zero overselling:** under concurrent checkouts/acceptances, `reserved ≤ on_hand` always holds and no order is confirmed without a successful reservation (TC-CONC-*) | MVP |
| KIS-NFR-034 | Data consistency | **Payment integrity:** an order becomes Paid only after a signature-verified webhook plus server-side status fetch; each provider event is processed exactly once in effect | MVP |
| KIS-NFR-035 | Data consistency | **Ledger balance:** double-entry ledger sums to zero per order and per day; daily reconciliation against PA settlement reports with 0 unexplained differences > ₹1; mismatches alert finance within 1 h of the run | MVP |
| KIS-NFR-036 | Data consistency | Price shown in an approval card = price charged: approvals are bound to a parameter hash; any change invalidates the approval (KIS-APR-004) | MVP |
| KIS-NFR-040 | Low bandwidth | Farmer routes: ≤ 300 KB total transfer on first load excluding photos, of which JS ≤ 170 KB gzipped; repeat loads ≤ 50 KB with cached shell `[ASSUMPTION A-42]`; thumbnails ≤ 15 KB; uploaded photos compressed client-side to ≤ 200 KB; voice uploads ≤ 60 KB per 15 s (Opus) | MVP |
| KIS-NFR-041 | Low bandwidth | Core flows (login, create listing, view offers, approve, order status) remain usable on a 2G profile (250 kbps, 800 ms RTT) and on a lossy network (20% packet loss) with retries and visible progress | MVP |
| KIS-NFR-042 | Offline | **Offline-friendly:** app shell, active-language fonts and last-viewed listings/orders/prices are available offline with an "as of" timestamp; listing drafts, inventory adjustment drafts, transporter status updates and messages are queued in an on-device outbox and replayed with idempotency keys on reconnect | MVP |
| KIS-NFR-043 | Offline | **Commit actions are never executed offline** (approvals, payments, offer acceptance, order confirmation); they are disabled with an explanation until connectivity returns | MVP |
| KIS-NFR-044 | Offline | **Sync conflict rules:** server state wins for stock, prices and order/offer status; queued drafts are re-validated on sync and the user is shown any conflict (e.g. "listing sold out while you were offline") with a choice to edit or discard; transporter status updates keep their original device timestamps and are accepted only in valid state order | MVP |
| KIS-NFR-045 | Offline | Critical updates (offer received, order confirmed, payment received, pickup/delivery) are also sent via SMS or WhatsApp (subject to opt-in) so users without app connectivity still receive them | MVP |
| KIS-NFR-050 | Mobile responsiveness | Design baseline 360 × 640 px; no horizontal scroll or clipped primary actions at 360, 390, 768 and 1366 px widths; layouts hold at OS font scale 1.3×; buyer and admin views responsive to desktop (admin desktop-first ≥ 1280 px) | MVP |
| KIS-NFR-051 | Device support | Android 9+ with ≥ 2 GB RAM on Chrome-based browsers (PWA) `[ASSUMPTION A-43]`; latest 2 versions of Chrome, Safari (iOS 16+), Firefox, Edge on desktop | MVP |
| KIS-NFR-060 | Accessibility | WCAG 2.1 AA minimum for all public and app screens (UX targets 2.2 AA where feasible); text contrast ≥ 4.5:1; touch targets ≥ 48 × 48 px; colour never the only signal; axe-core zero serious/critical violations in CI | MVP |
| KIS-NFR-061 | Accessibility | Low-literacy support: every primary action has icon + text in the user's language; audio prompts on key screens; voice input available on every form field where text is expected; screen-reader (TalkBack) usable on the farmer flow | MVP |
| KIS-NFR-062 | Localisation | 100% of UI strings, notifications, legal notices and AI system messages available in pa, hi, en; CI fails on missing keys; Indian number grouping (₹2,79,500.00) and localised units | MVP |
| KIS-NFR-070 | Security | All SEC-*, PRIV-* requirements in [SECURITY_AND_COMPLIANCE](SECURITY_AND_COMPLIANCE.md) are met; zero open critical/high findings at each release (pen-test before launch); TLS 1.2+ everywhere; encryption at rest for databases, backups and object storage | MVP |
| KIS-NFR-071 | Security | Dependency and container image scanning on every build; critical CVEs patched ≤ 7 days, high ≤ 30 days; opsapi security releases adopted ≤ 7 days (OPSAPI_INTEGRATION) | MVP |
| KIS-NFR-080 | Maintainability | Kisaan plugin and web/AI code: automated test coverage ≥ 80% lines on pricing, inventory, payments, approvals and ledger modules (≥ 60% overall); lint + type-checks enforced in CI; OpenAPI spec generated and published for every Kisaan endpoint | MVP |
| KIS-NFR-081 | Maintainability | opsapi pinned to an immutable tag; an upgrade passes the opsapi contract suite (TC-OPS-*) before promotion; no Kisaan change requires modifying the opsapi repository | MVP |
| KIS-NFR-082 | Maintainability | Deployability: a production release (including Kisaan migrations as a pre-upgrade job) completes ≤ 30 min with zero-downtime rolling updates and a documented rollback ≤ 15 min | MVP |
| KIS-NFR-083 | Maintainability | Configuration over code: commission rates, tier caps, offer validity, TTLs, thresholds and feature flags are admin- or config-driven and effective-dated, without redeploys | MVP |
| KIS-NFR-090 | Observability | RED metrics (rate, errors, duration) per route for API, KISAAN AI runtime and web; business metrics (listings, offers, orders, GMV, reservation expiries, approval outcomes) on Grafana dashboards; alerts per SYSTEM_ARCHITECTURE observability table | MVP |
| KIS-NFR-091 | Observability | Distributed tracing with a `trace_id` propagated web → KISAAN AI runtime → Kisaan API → opsapi → jobs; ≥ 10% sampling, 100% for errors and commit actions; centralised logs retained 30 days hot and 1 year archived (PII-redacted) | MVP |
| KIS-NFR-092 | Observability | Every AI turn records model/provider/version, prompt version, tokens, cost, latency, tool calls and approval outcome (KIS-SEC-098); per-user and per-day AI cost dashboards with budget alerts (D-56) | MVP |
| KIS-NFR-100 | Disaster recovery | **RPO ≤ 15 min** for PostgreSQL (continuous WAL / PITR; managed PITR typically achieves ≤ 5 min) and **RTO ≤ 4 h** for the core marketplace (KIS-SEC-110, KIS-SEC-113) | MVP |
| KIS-NFR-101 | Disaster recovery | Object storage: versioning plus cross-region/account replica; KYC documents and invoices RPO ≤ 1 h; other media ≤ 24 h | MVP |
| KIS-NFR-102 | Disaster recovery | DR drill (restore to a scratch environment, migrations check, smoke tests) before launch and quarterly, with results recorded; payment truth can be rebuilt from PA settlement reports plus stored raw webhook events | MVP |
| KIS-NFR-110 | Data residency | Personal data stored and processed in an India region `[ASSUMPTION A-02, A-32]`; any processing by non-India AI/STT providers is limited to the minimum necessary, disclosed in the privacy notice and covered by contract (KIS-CMP-012) | MVP |

---

## 8. Success metrics (pilot)

Targets are indicative, set for the pilot and reviewed after 90 days `[ASSUMPTION A-03]`.

| Metric | Definition | Pilot target |
|---|---|---|
| Activated sellers | Sellers with ≥ 1 published listing | 1,000 in 6 months |
| Activated buyers | Buyers with ≥ 1 offer or order | 300 in 6 months |
| GMV | Value of Completed orders | Tracked; target set after liquidity study `[DECISION D-14]` |
| Listing time (voice) | Median time from first utterance to approved draft | ≤ 2 min |
| AI draft acceptance | % of AI listing drafts approved with ≤ 1 edit | ≥ 70% |
| Search → enquiry/offer conversion | Sessions with search that lead to enquiry/offer | ≥ 8% |
| Offer → order conversion | Accepted offers that become paid orders | ≥ 60% |
| On-time delivery | Shipments delivered by the promised date | ≥ 90% |
| Dispute rate | Disputes / completed orders | ≤ 3% |
| Payment success | Successful payment attempts / attempts | ≥ 95% |
| Seller payout time | Completed → settlement credited | ≤ T+2 working days |
| Repeat buyers | Buyers with ≥ 2 orders in 90 days | ≥ 35% |
| Wholesale/group share | Share of GMV with a WHL tier or group order | Tracked |
| Membership | Paid members; trial→paid conversion | Tracked; ≥ 20% trial conversion |
| AI cost | AI cost per completed order | Below ₹X (set in Phase 5) `[DECISION D-15]` |
| Voice accuracy | Intent accuracy on voice | ≥ 90% |
| CSAT | Support satisfaction | ≥ 4.2/5 |

### 8.1 KPI definitions (Master Prompt v2 §34)

All KPIs are computed from the analytics event stream (KIS-ANL-002) over a stated window; targets marked *Tracked* are baselined in the first 90 days.

| KPI | Definition | Pilot target |
|---|---|---|
| Seller activation | % of registered sellers who publish ≥ 1 listing within 14 days of sign-up | ≥ 40% |
| Buyer activation | % of registered buyers placing ≥ 1 paid order within 30 days | ≥ 20% |
| GMV | Σ goods value of Completed orders (after discounts, before tax/delivery) | Tracked `[DECISION D-14]` |
| Conversion | Paid orders / buyer sessions with a product view | Tracked |
| Repeat purchase | Buyers with ≥ 2 paid orders in 90 days / buyers with ≥ 1 | ≥ 35% |
| Group purchase rate | Group orders reaching Confirmed / groups created; group GMV share | ≥ 50% of groups confirm; share tracked |
| Average order value | GMV / Completed orders, split normal / bulk / group | Tracked |
| Membership conversion | Paid KISAAN Plus starts / plan-page views; trial→paid | ≥ 20% trial→paid |
| Coupon usage | Orders with a coupon / orders; discount ₹ / GMV; redemption per active coupon | Tracked; seller-funded discount ≤ 5% of GMV (alert) |
| Inventory turnover | Quantity sold / average available quantity per listing per 30 days | Tracked |
| AI automation rate | Workflows completed with ≥ 1 AI DRAFT or tool step and user approval / total workflows of that type (listing, RFQ, offer, group, checkout) | ≥ 40% listings, tracked others |
| AI cost per completed order | (LLM + STT/TTS cost) / Completed orders | `[DECISION D-15]` |
| Marketplace liquidity | % active listings with ≥ 1 enquiry/offer in 7 days; % RFQs with ≥ 2 seller responses in 48 h | ≥ 30% / ≥ 50% |

**Tracked event families (§34):** user registrations, seller onboarding steps, store creation, listings, inventory changes (by movement type), searches (incl. zero-result), AI conversations, AI tool calls (by tool/status), buyer requirements, group creation, group membership changes, offers and negotiations, orders, coupon applications/redemptions, membership lifecycle events, delivery events, revenue, commission, AI cost. Event taxonomy: [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md) §23.

---

## 9. Release scope summary

Scope tiers follow D-106 and the Phase 0–10 roadmap in [DEVELOPMENT_ROADMAP](DEVELOPMENT_ROADMAP.md).

| Scope | Roadmap phases | Features |
|---|---|---|
| **MVP** | 0 Discovery · 1 Foundation · 2 Marketplace · 3 Wholesale · 4 Buyer Groups · 5 Coupons & Membership · 6 Orders & Payments · 7 Single KISAAN AI · 8 (basic) · 9 (basic) | AUTH, PROF, ONB, **BULK** (onboarding, profile, one-off RFQ), CAT (MVP categories), PRD, SRCH, STORE, INV (all automated behaviours), WHL (tiers, whole-lot, offer settings, group discount), ENQ, OFR (offers, quotations, negotiation), GROUP (member-direct payment, leader permission boundary), COUPON (seller coupons, group coupons), MEMBER (KISAAN Plus + T&C), PRC, ORD, PAY (PA split, refunds, reconciliation, membership recurring), INVC (basic), LOG (**buyer self-pickup, seller-arranged delivery, status**), REV, NOTF, SUP, DSP, ADM (incl. AI configuration, tool catalogue, tool executions, AI cost), ANL (basic + §8.1 KPIs), **one KISAAN AI** with the MVP tool catalogue, APR, VOX (pa/hi/en text + push-to-talk voice), WA (core), MKT (ingest, display, alerts), NFR (§7.1 MVP rows), KIS-REQ-001…010 |
| **P2** | Rest of 8 · 9 · 10 hardening | Platform transporter marketplace (KIS-LOG-002/003/007/008), live location, KISAAN Plus priority delivery, quality inspection, recurring bulk requirements (KIS-BULK-005), preferred sellers (KIS-BULK-006), e-invoicing/e-way bill automation, buyer SSO, store follow, AI seller insights, auto-counter rules, partial fulfilment, voice notes, more categories (oilseeds, cotton, fodder) |
| **Future** | — | Agri-inputs, machinery, platform coupons, leader-collects-money groups, leader incentives, credit/pay-later, auctions, forecasting, native apps, more languages, 3PL integrations, featured listings/stores, premium AI tier |

> **Scope change flagged (v0.2):** v0.1 had the platform transporter marketplace in MVP. D-106 moves it to P2; MVP delivery is buyer self-pickup or seller-arranged. KISAAN Plus free delivery in MVP therefore applies to delivery fees charged through KISAAN on seller-arranged delivery where the seller charges a delivery fee (see [COUPON_AND_MEMBERSHIP](COUPON_AND_MEMBERSHIP.md)). Needs product-owner confirmation (D-106).

---

## 10. Open decisions referenced in this PRD

| ID | Decision needed |
|---|---|
| D-01 | Confirm MVP categories |
| D-02 | Order-value threshold requiring buyer T3 business verification (proposed ₹2,00,000) |
| D-03 | Default listing expiry (30 d grains / 7 d perishables) |
| D-04 | Public RFQs hide buyer identity until a quotation is accepted |
| D-05 | Default offer validity (24 h / 6 h perishables) |
| D-06 | Seller auto-counter rules can never auto-accept |
| D-07 | Payment deadline after an accepted offer (24 h / 4 h perishables) |
| D-08 | Buyer acceptance window after delivery (48 h / 12 h perishables) |
| D-09 | Payment Aggregator choice (recommended: Razorpay Route; alternative: Cashfree) |
| D-10 | Group leader incentive model |
| D-11 | Membership pricing and trial length |
| D-12 | Membership refund policy |
| D-13 | Seller bears coupon cost; commission on post-discount price |
| D-14 | Pilot GMV target |
| D-15 | AI cost ceiling per order |
| D-101 | Exactly one KISAAN AI with tool categories; v0.1 agents retired |
| D-102 | KISAAN AI runtime is a module inside the single KISAAN TypeScript app; OpsAPI + KISAAN plugin are the system of record |
| D-103 | Pricing precedence incl. group discount and group-level coupons |
| D-104 | Buyer type definitions; separate bulk-buyer onboarding; leader permission boundary and disclaimer |
| D-105 | Membership named KISAAN Plus; coupon field set and cancellation behaviour |
| D-106 | Scope tiers re-based on Phase 0–10; transporter marketplace moved to P2 |

Assumptions: A-01 (STT accuracy achievable for Punjabi with available engines), A-02 (personal data stored in India), A-03 (pilot targets indicative).
