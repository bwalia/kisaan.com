# KISAAN — Product Requirements Document (PRD)

> Status: Draft v0.1 · Last updated: 2026-11-14 · Owner: KISAAN product & architecture · Source of truth index: [README](README.md)

Related: [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md) · [AI_AGENT_ARCHITECTURE](AI_AGENT_ARCHITECTURE.md) · [UX_UI_SPECIFICATION](UX_UI_SPECIFICATION.md) · [API_SPECIFICATION](API_SPECIFICATION.md) · [DATABASE_SCHEMA](DATABASE_SCHEMA.md) · [REQUIREMENTS_TRACEABILITY](REQUIREMENTS_TRACEABILITY.md) · [RISKS_AND_ASSUMPTIONS](RISKS_AND_ASSUMPTIONS.md)

---

## 0. How to read this document

- Every requirement has a stable ID `<AREA>-<NNN>`. IDs are never reused. If a requirement is removed, it is marked **Withdrawn** and kept in the table.
- **Priority / scope tiers:** **MVP** = Phases 1–6, the Punjab pilot launch. **P2** = Phase 7, the first 6 months after launch. **Future** = later.
- The six confirmed features in Master Prompt §2A are **WHL, GRP, MEM, STR, INV and CPN**. They are MVP unless a row is marked "⚠ Partial MVP".
- Acceptance criteria use **Given / When / Then**. The functional specification expands them into full workflows, business rules (`BR-*`) and edge cases.
- Markers: `[ASSUMPTION A-nn]`, `[DECISION D-nn]`, `[UNVERIFIED]`, `[LEGAL REVIEW]`, `[TAX REVIEW]`. All of them are collected in [RISKS_AND_ASSUMPTIONS](RISKS_AND_ASSUMPTIONS.md).
- This PRD does not define API endpoints or tables. Ownership by backend (`[OPSAPI: reuse|extend|new]`) is set in [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md).

---

## 1. Product summary

KISAAN is an **AI-first, voice-first agricultural marketplace**. It connects farmers and agricultural sellers with verified buyers: retailers, wholesalers, processors, restaurants, exporters and group-buying area leaders. Transporters move the goods. Users can run every major workflow by **speaking or chatting in Punjabi, Hindi or English, including mixed and romanised language**. AI agents draft listings, find matches, compare prices and offers, and coordinate logistics. Users stay in control: **an AI agent never commits the user to anything without explicit approval** (APR-*).

### 1.1 Goals (pilot, first 12 months after MVP launch)

| # | Goal | Measure (see §8) |
|---|---|---|
| G1 | Farmers can list produce in under 2 minutes by voice, with no typing | Median voice listing time |
| G2 | Buyers find verified supply that matches quantity, location and quality | Search-to-enquiry conversion |
| G3 | Transactions complete end to end on-platform: offer → order → payment → delivery | GMV, completed orders |
| G4 | Users trust the platform | Verified-user share, dispute rate, repeat rate |
| G5 | AI measurably reduces manual work | % of listings and offers drafted by AI and approved without edits |
| G6 | Bulk economics (wholesale tiers, group buying, membership) drive repeat purchasing | Share of GMV using WHL/GRP/MEM |

### 1.2 Non-goals (explicitly out of scope for MVP)

- KISAAN does not act as a **trader or principal**. It does not take title to goods. KISAAN is a marketplace e-commerce entity `[LEGAL REVIEW]`.
- KISAAN does not hold or escrow funds itself. All money flows through a licensed Payment Aggregator (see [PAYMENT_AND_BUSINESS_MODEL](PAYMENT_AND_BUSINESS_MODEL.md)).
- No guaranteed prices, price predictions or demand forecasts are presented as fact. Estimates are always labelled with source, date and confidence.
- AI image analysis does **not** certify quality or grade. Certified quality inspection is P2, run by human inspectors.
- No credit, lending, input financing or insurance in MVP.
- No sale of agri-inputs (seeds, fertilisers, pesticides) in MVP, because of licensing (see §3).
- No native mobile apps in MVP. MVP ships as a PWA plus a WhatsApp channel.
- In MVP a group leader does not collect money on behalf of members (see GRP-0xx and `[LEGAL REVIEW]`).
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
| CAT-001 | **Category tree:** hierarchical categories (L1 → L2 → commodity → variety), 2 levels exposed in MVP, data model supports N levels; every node has pa/hi/en names, synonyms (romanised, Gurmukhi, Devanagari) and a stable slug | System / Admin | MVP | Given a category tree with L1 "Cereals — Wheat" and commodity "Wheat" with variety "PBW-826", When a buyer searches "kanak", "ਕਣਕ", "गेहूं" or "wheat", Then the same commodity node is resolved |
| CAT-002 | **MVP category set** per `[DECISION D-01]`: Wheat, Paddy/Rice, Maize, Pulses, Vegetables (potato, onion, peas), Fruits (kinnow); all other categories exist in the tree but are inactive (not listable, not searchable) | System | MVP | Given category "Fertilisers" is inactive, When a seller (or the Listing agent) tries to create a listing in it, Then the request is rejected with `CATEGORY_NOT_ACTIVE` and the AI explains the category is not yet available |
| CAT-003 | **Category-specific attribute schemas** (§3.2): key, localised labels, type, unit, required flag, allowed values/range, `searchable`, `filterable`, `ai_extractable`; common produce attributes apply to every produce category | Seller / System | MVP | Given a wheat listing without `moisture_pct`, When the seller requests publish, Then validation fails naming the missing required attribute in the seller's language; Given `moisture_pct = 30`, Then it fails the 0–25 range rule |
| CAT-004 | **Schema versioning:** attribute-schema changes are versioned; existing listings keep the version they were created with and are re-validated only on edit/renewal | Admin / System | MVP | Given schema v2 adds a required attribute, When an existing v1 listing is viewed, Then it remains live; When it is edited or renewed, Then v2 validation applies |
| CAT-005 | **Units & conversion:** kg, quintal (100 kg), tonne (1,000 kg) plus category display units (e.g. kinnow box/crate with declared kg); canonical storage in kg `numeric(14,3)`; local units in speech (e.g. "man", "bori") are converted only after explicit readback confirmation (VOX-006) | System | MVP | Given a seller says "sau quintal", When the draft is created, Then quantity = 10,000.000 kg, display unit = quintal, and the readback states both |
| CAT-006 | **Category rules:** per-category flags for perishability (drives offer validity D-05, payment deadline D-07, acceptance window D-08, listing expiry D-03), commission rate (D-19), GST/HSN mapping, and checkout availability per state (APMC gating D-80) | Admin / System | MVP | Given potato is flagged perishable, When an offer is created without explicit validity, Then default validity = 6 h |
| CAT-007 | **Admin category management:** create/edit/deactivate categories, attributes, synonyms and rules; changes are audit-logged; deactivation hides listings but never deletes them or historical orders | Admin | MVP | Given an admin deactivates "Peas", Then active peas listings are hidden from search within 5 min, sellers are notified, and orders in progress are unaffected |
| CAT-008 | **Licensing-gated future categories:** agri-input categories (seeds, fertilisers, pesticides) can only be activated when seller licence capture and verification (licence no., validity, CIB&RC registration per SKU for pesticides) is implemented and legal sign-off is recorded (CMP-055..058) | Admin | Future | Given the "Pesticides" category, When an admin tries to activate it without the licensing feature flag and a recorded legal sign-off, Then activation is blocked |
| CAT-009 | **AI category suggestion:** the Listing agent suggests category, commodity and variety from text, voice or photo with a confidence score; the seller confirms; photo analysis never sets grade or quality certification | Seller / AI | MVP | Given a photo of kinnow, When the agent suggests "Fruits › Kinnow" at confidence ≥ 0.8, Then the seller sees the suggestion as editable and the grade field stays seller-declared |

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

### 4.3 Group Leader
- US-G01: As an area leader, I want a separate bulk-buyer signup so that I'm verified as a leader.
- US-G02: As a leader, I want to create a public group ("Sarabha Nagar — 40 qtl potato") that others can join.
- US-G03: As a member, I want to commit my quantity and pay for my share only.
- US-G04: As a leader, I want the group order placed once the target is met so that we unlock wholesale pricing.
- US-G05: As a member, I want to see the leader's verification and rating before joining.

### 4.4 Transporter
- US-T01: As a transporter, I want to register my vehicles and service districts.
- US-T02: As a transporter, I want transport requests near my route and the ability to quote.
- US-T03: As a transporter, I want to update pickup and delivery status by voice or one tap.
- US-T04: As a transporter, I want to see my completed trips and payouts.

### 4.5 Admin / Ops
- US-A01: As a verifier, I want a queue of KYC submissions with AI-flagged risks.
- US-A02: As a moderator, I want to review flagged listings, such as duplicates, abnormal prices or prohibited items.
- US-A03: As ops, I want to monitor orders, payments, disputes and AI agent performance and cost.
- US-A04: As finance, I want reconciliation reports and settlement status.
- US-A05: As admin, I want to configure commission, categories, membership plans and feature flags.

---

## 5. Functional requirements

Columns: **ID · Requirement · Role(s) · Priority · Acceptance criteria (G/W/T)**.

### 5.1 Authentication & registration (AUTH) — feature 1

> Backend note: opsapi provides email/password, email OTP, social SSO, PIN and refresh tokens. It does **not** provide SMS or phone OTP login. Phone OTP (AUTH-001/002) is therefore built as a new Kisaan plugin module that issues an opsapi-compatible session. The exact session-issuance mechanism through the plugin SDK is `[UNVERIFIED]` (see [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md)).

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| AUTH-001 | Users register and log in with an Indian mobile number and a one-time password (OTP) sent by SMS; WhatsApp OTP is an optional fallback | All | MVP | **Given** a valid +91 mobile, **When** the user requests an OTP, **Then** a 6-digit OTP arrives within 30 s (p95), is valid for 5 min, and allows max 5 attempts |
| AUTH-002 | OTP requests are rate-limited per number, device and IP | All | MVP | **Given** 5 OTP requests within 15 min, **When** a 6th is requested, **Then** it is rejected with a retry-after message in the user's language |
| AUTH-003 | Sessions use short-lived access tokens plus refresh tokens; a session can be revoked | All | MVP | **Given** an admin revokes a session, **When** the old token is used, **Then** the API returns 401 within 60 s |
| AUTH-004 | Optional email + password or SSO for business buyers and admins; MFA is mandatory for admin roles | Buyer, Admin | MVP (admin MFA), P2 (buyer SSO) | **Given** an admin without MFA, **When** they log in, **Then** they are forced to enrol in TOTP |
| AUTH-005 | During registration the user selects a primary role and can add roles later (multi-role) | All | MVP | **Given** a registered seller, **When** they enable "buyer", **Then** they can switch context without logging in again |
| AUTH-006 | Registration is possible by voice or through the AI chat, including name, village, district and role | Seller, Transporter | MVP | **Given** a voice registration, **When** the AI has extracted the fields, **Then** it reads them back and creates the account only after the user confirms (APR) |
| AUTH-007 | Consent capture during registration (privacy notice in the chosen language, purposes, marketing opt-in separate) | All | MVP | **Given** a new user, **When** they register, **Then** the consent record stores notice version, purposes, language and timestamp |
| AUTH-008 | Device binding and trusted-device list; login from a new device notifies the user | All | P2 | **Given** login from a new device, **Then** an SMS/WhatsApp alert is sent |
| AUTH-009 | Account deletion request flow (DPDP right to erasure, subject to legal retention) | All | MVP | **Given** a deletion request, **Then** the account is deactivated immediately and erased or anonymised within the policy period, except records under legal hold |

### 5.2 User profiles & multi-role (PROF) — feature 2

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| PROF-001 | Each user has a base profile: name, photo, preferred language, district, contact preferences | All | MVP | **Given** a user, **When** they set language to Punjabi, **Then** all UI, notifications and AI responses default to pa-IN |
| PROF-002 | Role-specific profiles: FarmerProfile (land acreage optional, crops, village), BuyerProfile (buyer_type, business name, GSTIN optional), TransporterProfile, GroupLeaderProfile | Role-specific | MVP | **Given** a user with seller+buyer roles, **Then** both profiles exist independently and are shown per active role |
| PROF-003 | Multiple addresses (pickup points, delivery addresses, farm location with geo-pin) | All | MVP | **Given** an address with a geo-pin, **Then** it can be selected as a listing pickup point |
| PROF-004 | Privacy settings: show or hide phone; contact via in-app chat only | Seller, Buyer | MVP | **Given** "hide phone", **Then** the phone number never appears on public store or listing pages |
| PROF-005 | Bank account / UPI ID for payouts, verified with a penny-drop | Seller, Transporter | MVP | **Given** a bank account, **When** penny-drop verification succeeds with a matching name, **Then** payouts are enabled |
| PROF-006 | Verification badges are shown on the profile (phone verified, KYC verified, business verified, leader verified) | All | MVP | **Given** a KYC-verified seller, **Then** the "Verified" badge appears on store, listing and offer cards |
| PROF-007 | Reputation summary on the profile: rating, completed orders, on-time %, response time | All | MVP | Computed nightly and displayed with the count of ratings |

### 5.3 Seller onboarding (ONB, seller) — feature 3

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| ONB-001 | Guided seller onboarding by voice, chat or form: profile → pickup address → bank/UPI → KYC → first listing | Seller | MVP | **Given** a new seller, **When** onboarding completes, **Then** the checklist shows 100% and listing publish is enabled |
| ONB-002 | Seller KYC tiers: **T0** phone verified (can draft listings, cannot publish); **T1** identity verified (publishes up to a value limit); **T2** bank verified + identity (receives payouts); **T3** business (GSTIN/PAN verified, no limit) | Seller | MVP | **Given** a T0 seller, **When** they try to publish, **Then** they are prompted to complete T1 |
| ONB-003 | Identity verification uses lawful methods only (e.g. DigiLocker / offline Aadhaar XML or masked document, PAN). Raw Aadhaar numbers are never stored `[LEGAL REVIEW]` | Seller, Buyer, Leader, Transporter | MVP | **Given** an Aadhaar-based document, **Then** only the masked number (last 4 digits) and the verification reference are stored |
| ONB-004 | Assisted onboarding: field agents or support staff may onboard on behalf of a farmer, with the farmer's OTP consent | Seller | MVP | **Given** an assisted session, **Then** the audit log records the agent ID and the farmer's OTP confirmation |
| ONB-005 | AI Trust agent pre-screens KYC (document legibility, name match, duplicate detection) and routes to the verifier queue | Verifier | MVP | **Given** a submission, **Then** a risk score with reasons is attached; the final decision is human |

### 5.4 Buyer onboarding (ONB, buyer / leader / transporter) — feature 4

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| ONB-010 | Buyer onboarding captures buyer_type (individual, retailer, wholesaler, distributor, processor, restaurant, exporter, agri_business), business name and delivery address | Buyer | MVP | **Given** buyer_type = processor, **Then** GSTIN is requested (optional at T1, required for GST invoice) |
| ONB-011 | Buyer verification tiers mirror ONB-002; business buyers above ₹2,00,000 order value must be T3 `[DECISION D-02]` | Buyer | MVP | **Given** an unverified buyer and a cart over the threshold, **When** they check out, **Then** checkout is blocked with a prompt to verify |
| ONB-012 | GSTIN verification against the GST public registry via a licensed provider `[UNVERIFIED provider]` | Buyer, Seller | MVP | **Given** a GSTIN, **Then** legal name, state and status are fetched and stored |
| ONB-013 | **Group Leader signup** is a distinct flow (see GRP-001) | Leader | MVP | See GRP-001 |
| ONB-014 | Transporter onboarding: identity, driving licence, vehicle RC, permit/insurance documents, service districts, bank | Transporter | MVP | **Given** a vehicle without a valid RC upload, **Then** it cannot receive assignments |

### 5.5 Product management (PRD) — feature 5

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| PRD-001 | Sellers create products (commodity + variety + attributes per the category schema) | Seller | MVP | **Given** category Wheat, **Then** moisture_pct is required before publish |
| PRD-002 | Create a listing via a form, AI chat, voice, photo or WhatsApp; all channels produce the same listing draft | Seller | MVP | **Given** a voice-created draft, **Then** it appears in "My drafts" in the PWA with source = voice |
| PRD-003 | Up to 10 photos per listing; EXIF stripped; automatic compression for low bandwidth; first photo is the cover | Seller | MVP | **Given** a 6 MB photo, **Then** it is stored and served as a ≤ 300 KB web variant plus a thumbnail |
| PRD-004 | AI-generated title and description in the seller's language with auto-translation to the other two languages; the seller can edit | Seller | MVP | **Given** a draft, **Then** title and description exist in pa/hi/en and are marked "AI-generated, reviewed by seller" after approval |
| PRD-005 | Unit entry in kg, qtl or tonne, with automatic conversion and display of both units | Seller | MVP | **Given** 100 qtl, **Then** the stored value is 10,000 kg and the display is "100 qtl (10 t)" |
| PRD-006 | Seller-declared grade is shown as "seller-declared"; AI photo assessment is shown only as "AI observation — not a certification" | Seller, Buyer | MVP | **Given** an AI photo assessment, **Then** no "certified" wording appears anywhere |
| PRD-007 | Edit, pause, resume, close and duplicate a listing; edits to price or quantity while offers are open notify the affected buyers | Seller | MVP | **Given** a price change with 3 open offers, **Then** those 3 buyers are notified and their offers stay valid at the offered price |
| PRD-008 | Prohibited and restricted items list (e.g. unlicensed agri-inputs, banned pesticides) blocks publish | Admin | MVP | **Given** a listing matching the prohibited list, **Then** publish is blocked and the listing goes to moderation |
| PRD-009 | Organic claims require a certificate upload to show the "certified organic" label; otherwise the listing shows "self-declared" | Seller | P2 | — |
| PRD-010 | Bulk listing upload (CSV) for large sellers | Seller | P2 | — |

### 5.6 Product listings (PRD, lifecycle) — feature 6

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| PRD-020 | Listing states: Draft → Pending review (if flagged) → Active → Paused / Out of stock → Closed / Expired / Removed | Seller, Admin | MVP | State transitions follow the FS state machine; invalid transitions are rejected |
| PRD-021 | Listings have an availability window and expire automatically (default 30 days for grains, 7 days for perishables) `[DECISION D-03]` | Seller | MVP | **Given** available_until is passed, **Then** the listing becomes Expired and the seller is notified 48 h before |
| PRD-022 | Auto-moderation on publish: duplicate detection, price outlier detection against mandi bands, prohibited terms. Flagged listings go to Pending review | Admin, AI | MVP | **Given** a price 3× the mandi modal price, **Then** the listing is flagged with a reason and the seller is told a review is pending |
| PRD-023 | A listing displays the seller's verification badges, rating, distance from the buyer, wholesale tiers and coupon availability | Buyer | MVP | — |
| PRD-024 | Featured / promoted listings (paid) | Seller | Future | — |

### 5.7 Product search (SRCH) — feature 7

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| SRCH-001 | Keyword search across commodity, variety, title and description in all three languages and romanised forms (e.g. "kanak" = wheat, "aloo" = potato) | All incl. anonymous | MVP | **Given** a query "kanak", **Then** wheat listings are returned |
| SRCH-002 | Natural-language and voice search through the AI Discovery agent | Buyer | MVP | **Given** "Ludhiana ke paas 50 quintal aloo", **Then** results are filtered for potato, ≥ 50 qtl, within the default radius of Ludhiana |
| SRCH-003 | Geo search by radius from the buyer's location or a chosen district | Buyer | MVP | Results include the distance in km |
| SRCH-004 | Only Active listings with available quantity > 0 are returned; never out-of-stock or paused listings | All | MVP | **Given** a listing with available = 0, **Then** it does not appear in search |
| SRCH-005 | Typo tolerance and synonyms dictionary managed by admin | Admin | MVP | — |
| SRCH-006 | Saved searches with alerts (feeds NOTF) | Buyer | MVP | **Given** a saved search, **When** a matching listing is published, **Then** an alert is sent at most once per listing |

### 5.8 Filters & sorting (SRCH) — feature 8

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| SRCH-010 | Filters: category, commodity, variety, district, radius, price range, available quantity ≥ X, grade, moisture ≤ X, harvest date, verified sellers only, wholesale available, coupon available, organic, seller rating ≥ X | Buyer | MVP | Each filter combination returns correct results; facet counts are shown |
| SRCH-011 | Sort: relevance, price (asc/desc, using the buyer's effective price for the requested quantity), distance, newest, rating | Buyer | MVP | **Given** a requested quantity of 100 qtl, **When** sorted by price, **Then** the effective price uses the applicable wholesale tier |
| SRCH-012 | Category-specific filters are generated from the attribute schema (`filterable = true`) | Admin | MVP | Adding a filterable attribute requires no code deployment |

### 5.9 Product details (SRCH) — feature 9

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| SRCH-020 | The product detail page shows photos, attributes, seller-declared grade, AI observation (with disclaimer), available quantity, MOQ, pickup district, wholesale tier table, active coupons, seller card and nearby mandi price reference | All | MVP | Mandi reference shows source, market and date (MKT-003) |
| SRCH-021 | Quantity selector computes the effective unit price and total live (PRC) | Buyer | MVP | **Given** a qty change crosses a tier, **Then** the price updates within 200 ms on the client |
| SRCH-022 | CTAs: Make offer, Buy now (at list/effective price), Ask question (enquiry), Add to group (if a group exists for this listing) | Buyer | MVP | — |
| SRCH-023 | Public product pages are SEO-indexable and viewable logged out; contact details are hidden according to privacy settings | Anonymous | MVP | — |

### 5.10 Inventory management (INV) — features 10 & 28 (§2A.5)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| INV-001 | Each listing has an inventory record with `on_hand`, `reserved` and `available = on_hand − reserved` (kg) | Seller | MVP | Invariant: `available ≥ 0` and `reserved ≤ on_hand` always hold |
| INV-002 | **Automatic reservation** when an offer is accepted or checkout starts (Buy now), with a TTL | System | MVP | **Given** an offer of 40 qtl is accepted, **Then** 4,000 kg is reserved and available decreases immediately |
| INV-003 | **Automatic deduction** on payment confirmation / order confirmation (reserved → deducted from on_hand) | System | MVP | **Given** payment is captured, **Then** on_hand −= qty and reserved −= qty atomically |
| INV-004 | **Automatic release** on cancellation, payment failure or reservation expiry | System | MVP | **Given** the reservation TTL expires, **Then** reserved −= qty and the buyer and seller are notified |
| INV-005 | **Overselling prevention** under concurrency: reservation succeeds only if `available ≥ qty` in a single atomic operation | System | MVP | **Given** 2 concurrent requests for 60 qtl each against 100 qtl available, **Then** exactly one succeeds |
| INV-006 | Manual adjustment (add / remove stock) requires a reason code (harvest added, spoilage, sold offline, correction, other with text); audit-logged | Seller | MVP | **Given** an adjustment without a reason, **Then** it is rejected |
| INV-007 | Low-stock alert when available falls below a seller-defined threshold (default 10% of initial quantity or MOQ, whichever is greater) | Seller | MVP | Alert sent once per threshold crossing |
| INV-008 | **Out-of-stock auto-hide**: when available = 0 (or below MOQ) the listing is hidden from search and shown as "Sold out" on the store; it is restored automatically if stock returns | System | MVP | **Given** a released reservation brings available ≥ MOQ, **Then** the listing becomes searchable again |
| INV-009 | Inventory movement ledger (every reserve / release / deduct / adjust with actor, reason, reference) | Seller, Admin | MVP | The ledger sum reconciles to on_hand for every listing (nightly check) |
| INV-010 | Voice / AI inventory update ("Mera 20 quintal aur wheat aa gaya") drafts an adjustment that requires confirmation | Seller | MVP | APR readback before apply |
| INV-011 | Multi-location stock per seller (warehouses) | Seller | Future | — |

### 5.11 Buyer enquiries & requirements (ENQ) — feature 11

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| ENQ-001 | A buyer can send a question/enquiry about a listing; it opens an in-app conversation thread with the seller | Buyer, Seller | MVP | Phone numbers are masked unless both parties opt in |
| ENQ-002 | A buyer can post a **Buyer Requirement (RFQ)**: commodity, variety, qty, quality specs, delivery location, needed-by date, target price (optional), validity | Buyer | MVP | **Given** a posted RFQ, **Then** the Matching agent notifies the top-N eligible sellers (default N = 20) |
| ENQ-003 | Sellers respond to an RFQ with a quotation (links to OFR) | Seller | MVP | — |
| ENQ-004 | Enquiry spam control: max open enquiries per buyer per day; new-account limits | System | MVP | — |
| ENQ-005 | AI suggests answers to common enquiries for the seller to approve | Seller | P2 | — |
| ENQ-006 | Public RFQs are visible to sellers in matching districts; the buyer's identity is hidden until the buyer accepts a quotation `[DECISION D-04]` | Seller | MVP | — |

### 5.12 Bidding & quotation system (OFR) — feature 12

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| OFR-001 | A buyer can make an **offer** on a listing: qty, price per unit, delivery terms (buyer pickup / seller delivery / platform logistics), payment terms, validity (default 24 h; 6 h for perishables) `[DECISION D-05]` | Buyer | MVP | **Given** qty < MOQ, **Then** the offer is rejected with a validation message |
| OFR-002 | A seller can send a **quotation** in response to an RFQ (same structure) | Seller | MVP | — |
| OFR-003 | **Multi-buyer quotation comparison**: a seller sees all open offers on a listing in a comparison view (net realisation after commission & transport, buyer rating, payment terms) | Seller | MVP | **Given** 3 offers, **Then** the comparison shows net realisation per offer and the AI explanation is available |
| OFR-004 | **Multi-seller comparison** for buyers on their RFQ | Buyer | MVP | — |
| OFR-005 | Offers do not reserve inventory until accepted (INV-002) | System | MVP | — |
| OFR-006 | A buyer may have at most one open offer per listing; new offers supersede old ones | Buyer | MVP | — |
| OFR-007 | Auction / reverse auction (time-bound bidding) | Seller, Buyer | Future | — |

### 5.13 Negotiation & counteroffers (OFR) — feature 13

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| OFR-010 | Either party can counter (price, qty, delivery terms, validity) and both parties see the full history | Seller, Buyer | MVP | Each counter creates an immutable negotiation event |
| OFR-011 | Max 10 counter rounds per negotiation; the negotiation expires at validity | System | MVP | **Given** round 11, **Then** the counter is rejected with an option to start a new offer |
| OFR-012 | **Accept** creates an "Agreed deal" → order draft (ORD) + inventory reservation; acceptance is always an explicit user action (APR) | Seller, Buyer | MVP | **Given** the AI drafted an acceptance, **Then** it executes only after an explicit approval tap/voice confirmation with readback |
| OFR-013 | Reject with an optional reason; withdraw by the offering party before acceptance | Seller, Buyer | MVP | — |
| OFR-014 | AI Negotiation assistant drafts counteroffers and explains differences, but never sends without approval | Seller, Buyer | MVP | See AI-NEG requirements |
| OFR-015 | Auto-counter rules set by the seller (e.g. "auto-reject below ₹2,300/qtl") apply **only** as reject or reply-with-floor, never auto-accept `[DECISION D-06]` | Seller | P2 | — |

### 5.14 Order management (ORD) — feature 14

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| ORD-001 | Orders are created from (a) Buy now checkout, (b) an accepted offer/quotation, or (c) a group order allocation | Buyer | MVP | Each order references its source |
| ORD-002 | Order states: Pending payment → Confirmed → Ready for pickup → In transit → Delivered → Completed (after acceptance window) / Cancelled / Disputed / Refunded (see FS) | All | MVP | — |
| ORD-003 | Order pricing snapshot: unit price, wholesale tier applied, coupon, membership benefit, delivery fee, commission, taxes; immutable after confirmation | System | MVP | **Given** a confirmed order, **Then** later listing price changes do not alter it |
| ORD-004 | Payment deadline for orders from accepted offers (default 24 h; 4 h for perishables) `[DECISION D-07]`; on expiry the order is cancelled and inventory released | System | MVP | — |
| ORD-005 | Cancellation rules: free before dispatch; after dispatch only through a dispute; seller cancellation counts against seller reliability | Buyer, Seller | MVP | Cancellation charges disclosed before order per e-commerce rules `[LEGAL REVIEW]` |
| ORD-006 | Buyer **acceptance window** after delivery (default 48 h, perishables 12 h) to confirm or raise a dispute; auto-complete after the window `[DECISION D-08]` | Buyer | MVP | — |
| ORD-007 | Delivery weight reconciliation: actual delivered weight recorded; the price adjusts pro-rata within a tolerance (±2%) or triggers a dispute beyond it | Buyer, Seller | MVP | — |
| ORD-008 | Order list and detail per role, with timeline and documents (invoice, weighbridge slip, e-way bill reference) | All | MVP | — |
| ORD-009 | Partial fulfilment (split deliveries) | Seller | P2 | — |

### 5.15 Payment processing (PAY) — feature 15

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| PAY-001 | Buyer pays through a licensed Payment Aggregator (UPI, net banking, cards, UPI collect for large tickets; NEFT/RTGS virtual account for large B2B) `[DECISION D-09: PA choice]` | Buyer | MVP | The platform never receives funds into its own operating account for seller proceeds |
| PAY-002 | Marketplace split settlement: seller share, transporter share and platform commission/fees routed by the PA | System | MVP | — |
| PAY-003 | Seller settlement is released after the order is Completed (acceptance window passed or buyer confirmed), via PA hold/release features | System | MVP | **Given** an order is Completed, **Then** a settlement instruction is issued within 1 h |
| PAY-004 | Payment confirmation only via a verified PA webhook + server-side verification; client callbacks never mark an order paid | System | MVP | — |
| PAY-005 | Idempotent payment creation and webhook processing | System | MVP | A duplicate webhook does not double-confirm |
| PAY-006 | Failed payment handling: retry within the payment deadline, reservation maintained until the deadline | Buyer | MVP | — |
| PAY-007 | Refunds (full/partial) to the original payment method; triggered by cancellation, dispute outcome or weight reconciliation | Finance, System | MVP | — |
| PAY-008 | Daily reconciliation of PA settlement reports against orders; mismatches surface in the finance queue | Finance | MVP | — |
| PAY-009 | Payment history and pending payment view for each role ("Show my pending payments" via AI) | All | MVP | — |
| PAY-010 | Recurring payments for membership (UPI AutoPay / card e-mandate) | Buyer | MVP | Pre-debit notification per RBI rules `[LEGAL REVIEW]` |
| PAY-011 | Pay-later / credit terms for verified businesses | Buyer | Future | — |
| PAY-012 | Cash-on-delivery | — | Not supported (MVP) | — |

### 5.16 Invoices & receipts (INVC) — feature 16

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| INVC-001 | A tax invoice / bill of supply is generated on behalf of the seller for each order (template depends on seller GST status: farmer selling own produce → bill of supply / exempt) `[TAX REVIEW]` | Seller, Buyer | MVP | PDF in the buyer's language + English |
| INVC-002 | The platform's own GST invoice to the seller for commission/fees; to the buyer for membership/delivery fees | Finance | MVP | `[TAX REVIEW]` |
| INVC-003 | Payment receipts for every successful payment and refund | Buyer | MVP | — |
| INVC-004 | Sequential, gap-free invoice numbering per issuer per financial year | System | MVP | — |
| INVC-005 | E-invoicing (IRN) and e-way bill integration where thresholds apply | Finance | P2 | `[TAX REVIEW]` |
| INVC-006 | GST TCS on e-commerce operator collections computed and reported where applicable | Finance | MVP (calculation), P2 (automated filing) | `[TAX REVIEW]` |

### 5.17 Delivery management (LOG) — feature 17

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| LOG-001 | Delivery modes per order: buyer self-pickup, seller-arranged, platform-arranged (transporter marketplace) | Buyer, Seller | MVP | — |
| LOG-002 | Transport request: pickup, drop, weight, commodity, date window, vehicle type; broadcast to eligible transporters in the service area | Seller, Buyer, AI | MVP | — |
| LOG-003 | Transporters submit quotations; the requester compares (price, ETA, rating) and accepts with approval | Transporter, Seller/Buyer | MVP | — |
| LOG-004 | Shipment states: Assigned → En route to pickup → Picked up (with weighbridge weight + photo) → In transit → Delivered (with photo + OTP from receiver) → Closed | Transporter | MVP | **Given** delivery, **Then** the receiver's OTP confirms handover |
| LOG-005 | Status updates via one-tap, voice or WhatsApp reply; optional live location sharing (consented) | Transporter | MVP (status), P2 (live location) | — |
| LOG-006 | AI Logistics agent estimates cost only when based on actual quotes or historical data; shows a range with basis | AI | MVP | — |
| LOG-007 | Transporter vehicle management (type, capacity, RC, insurance expiry alerts) | Transporter | MVP | — |
| LOG-008 | Transporter payout after the shipment is Closed via PA split | Transporter | MVP | — |
| LOG-009 | Integration with third-party logistics aggregators | — | Future | — |

### 5.18 Reviews & ratings (REV) — feature 18

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| REV-001 | Two-way ratings after order completion: buyer→seller, seller→buyer, both→transporter (1–5 stars + tags + optional text/voice note) | All | MVP | Only for Completed orders; one review per party per order |
| REV-002 | Review window: 14 days after completion | All | MVP | — |
| REV-003 | Ratings shown as an average plus count; new users show "New" until 3 ratings | All | MVP | — |
| REV-004 | Reviews moderated for abuse; the seller can reply once | Admin, Seller | MVP | — |
| REV-005 | Group leader ratings by group members | Members | MVP | — |

### 5.19 Notifications (NOTF) — feature 19

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| NOTF-001 | Channels: in-app, web push, SMS (transactional, DLT-registered), WhatsApp (template messages, opted-in), email (business users) | All | MVP | — |
| NOTF-002 | Per-user channel preferences and quiet hours (default 21:00–07:00, except critical) | All | MVP | — |
| NOTF-003 | Notification types: offer received/countered/accepted/expiring, order updates, payment events, shipment updates, price alerts, saved-search matches, group updates, membership renewal reminders, low stock | All | MVP | — |
| NOTF-004 | De-duplication and throttling: the same event is never notified twice on the same channel; digest mode for alerts (max N per day) | System | MVP | — |
| NOTF-005 | Notifications in the user's language; voice notifications (TTS audio on WhatsApp) for selected critical events | Seller | P2 | — |

### 5.20 Customer support (SUP) — feature 20

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| SUP-001 | AI Support agent answers platform FAQs, order/payment status in-language, with citations to help articles | All | MVP | — |
| SUP-002 | Ticket creation by AI or user, with category, linked order and attachments; escalation to human agents | All | MVP | **Given** the user says "insaan se baat karni hai", **Then** escalation is created immediately |
| SUP-003 | SLA tracking (first response ≤ 4 business hours for MVP) | Support | MVP | — |
| SUP-004 | Callback request (phone) for low-literacy users | Seller | MVP | — |
| SUP-005 | Grievance officer details and grievance redressal timelines displayed per e-commerce rules `[LEGAL REVIEW]` | All | MVP | — |

### 5.21 Disputes & refunds (DSP) — feature 21

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| DSP-001 | A buyer can raise a dispute within the acceptance window: quality mismatch, quantity/weight shortfall, non-delivery, damaged goods, wrong variety | Buyer | MVP | Evidence (photos, weighbridge slip, lab report optional) is required |
| DSP-002 | A seller can raise a dispute: non-payment, rejection without reason, buyer no-show | Seller | MVP | — |
| DSP-003 | A dispute freezes the related settlement until resolution | System | MVP | — |
| DSP-004 | Resolution options: full refund (with return logistics), partial refund / price adjustment, no refund, re-delivery | Admin | MVP | — |
| DSP-005 | Dispute SLA: initial response 24 h; resolution target 7 days | Admin | MVP | — |
| DSP-006 | AI summarises evidence and the timeline for the human resolver; it never decides | Admin | MVP | — |
| DSP-007 | Third-party quality inspection on request (paid) | Inspector | P2 | — |

### 5.22 Admin dashboard (ADM) — feature 22

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| ADM-001 | User management (search, view, suspend, role change, impersonate-read-only with audit) | Admin | MVP | — |
| ADM-002 | Verification queue (KYC, business, leader, transporter) with AI risk annotations | Verifier | MVP | — |
| ADM-003 | Listing moderation queue (flagged listings, prohibited items, price outliers, duplicates) | Moderator | MVP | — |
| ADM-004 | Order / payment / settlement monitoring; manual hold/release with dual approval for finance actions over ₹50,000 | Finance | MVP | — |
| ADM-005 | Dispute console | Admin | MVP | — |
| ADM-006 | Commission and fee configuration per category (effective-dated) | Admin | MVP | — |
| ADM-007 | Category and attribute schema management; synonyms | Admin | MVP | — |
| ADM-008 | Membership plan and T&C version management | Admin | MVP | — |
| ADM-009 | Platform coupons | Admin | Future | — |
| ADM-010 | AI agent monitoring: invocation counts, success/failure, approval rates, cost per agent, flagged conversations, prompt/model version | Admin | MVP | — |
| ADM-011 | Fraud / risk console (Trust agent flags) | Admin | MVP | — |
| ADM-012 | Audit log viewer (immutable) | Admin | MVP | — |
| ADM-013 | Feature flags and platform configuration (TTLs, thresholds) | Admin | MVP | — |

### 5.23 Analytics & reporting (ANL) — feature 23

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| ANL-001 | KPI dashboard: users by role and verification, active listings by category, orders, GMV, completed transactions, commission revenue, disputes, conversion funnel, AI usage and cost | Admin | MVP | Data freshness ≤ 1 h |
| ANL-002 | Event tracking taxonomy (see ADMIN/analytics doc) with consented analytics only | System | MVP | — |
| ANL-003 | Seller insights: views, enquiries, offers, conversion, average realised price vs mandi modal price | Seller | MVP (basic), P2 (AI insights) | — |
| ANL-004 | Buyer spend reports, exportable CSV | Buyer | P2 | — |
| ANL-005 | Crop availability forecasting (aggregated listing data); clearly labelled as indicative | Admin, Buyer | Future | Only once there is sufficient validated data |

### 5.24 Wholesale / bulk pricing (WHL) — feature 24 (§2A.1)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| WHL-001 | A seller can enable or disable wholesale pricing per listing | Seller | MVP | **Given** wholesale disabled, **Then** no tiers are shown or applied |
| WHL-002 | **Quantity tiers (slabs):** up to 5 tiers per listing, each with `min_qty` (in display unit, stored kg) and a discount of type **percentage** or **fixed amount per unit** | Seller | MVP | **Given** tiers 50+ qtl → 5% and 100+ qtl → 8%, **When** a buyer selects 120 qtl, **Then** 8% applies |
| WHL-003 | Tiers must have strictly increasing min_qty and non-decreasing effective discount; min_qty ≥ listing MOQ; the effective price must stay > 0 | Seller | MVP | Invalid tier sets are rejected with field-level errors |
| WHL-004 | **"Buy the whole lot" offer:** a special price (or discount) available only if the buyer purchases the **entire available quantity** at that moment | Seller | MVP | **Given** available = 200 qtl and the whole-lot price = ₹2,350/qtl, **When** the buyer selects all 200 qtl, **Then** ₹2,350/qtl applies |
| WHL-005 | Whole-lot eligibility is evaluated at reservation time; if available changes before reservation, the buyer is shown the new whole-lot qty | System | MVP | — |
| WHL-006 | Only the **single best** applicable wholesale benefit applies (the highest tier met, or whole-lot if better); tiers never compound | System | MVP | — |
| WHL-007 | Wholesale tiers are shown clearly on search cards ("Bulk deal: up to 8% off"), on the product page (tier table) and in the offer/cart total with the "you save" amount | Buyer | MVP | — |
| WHL-008 | Group orders count the **aggregated group quantity** for tier eligibility (GRP) | System | MVP | — |
| WHL-009 | Stacking with negotiation, coupons and membership follows PRC rules (PRC-001…) | System | MVP | — |
| WHL-010 | Changes to tiers do not affect existing reservations/orders (price snapshot) | System | MVP | — |
| WHL-011 | AI Listing agent can suggest tiers based on lot size and mandi price bands; the seller approves | Seller | P2 | — |
| WHL-012 | Wholesale tiers are funded entirely by the seller (commission is computed on the post-discount price) | System | MVP | — |

### 5.25 Group buying & area leaders (GRP) — feature 25 (§2A.2)

⚠ **Partial MVP:** In MVP a leader aggregates demand and members pay the platform's Payment Aggregator directly for their own allocations. **Leader-collects-money mode is Future**, blocked on `[LEGAL REVIEW]` (payment aggregation/escrow rules, fraud risk).

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| GRP-001 | **Separate "Bulk Buyer / Group Leader" signup flow**, distinct from normal buyer signup: identity KYC (T1 minimum), proof of area association (address proof / cooperative / RWA letter — optional in MVP), bank/UPI, leader T&C acceptance, admin approval | Leader | MVP | **Given** a pending leader application, **Then** the user cannot create groups until approved |
| GRP-002 | Leader verification badge plus rating; leader profile shows area, groups run, completion rate | Leader | MVP | — |
| GRP-003 | A leader creates a **buying group**: area (village/colony/mandi + geo radius), product (specific listing **or** a commodity spec for RFQ-based groups), target quantity, min/max per member, join deadline, delivery point, delivery mode | Leader | MVP | — |
| GRP-004 | Groups are **publicly visible**, including to logged-out users: "<Leader> is leading <area> to buy <qty> of <product>" with progress (committed / target), deadline and pricing preview | All | MVP | — |
| GRP-005 | Join a group: a member commits a quantity within min/max and the group capacity; joining requires login and phone verification | Buyer | MVP | — |
| GRP-006 | Member **payment authorisation per member**: on joining, the member pays (or authorises) for their allocation at the **projected** group price via the PA; the final price is computed at group close; any difference is refunded | Buyer | MVP | **Given** the projected 5% tier and the final 8% tier achieved, **Then** members are refunded the difference within 5 working days |
| GRP-007 | Leave a group before the join deadline (full refund); after the deadline leaving is not allowed except via dispute | Buyer | MVP | — |
| GRP-008 | Group close at the deadline: if target qty is met → the group order is placed (leader approval required); if not met → the leader chooses (with approval) to proceed at the achieved tier or cancel (full refunds) | Leader | MVP | — |
| GRP-009 | Group order = one order to the seller with **allocations** per member; inventory is reserved for the group total at the group-ready step | System | MVP | — |
| GRP-010 | Delivery to a **common delivery point**; the leader confirms receipt and distributes; each member confirms receipt of their allocation (or the leader marks it on their behalf with the member's OTP) | Leader, Members | MVP | — |
| GRP-011 | Dispute handling at member level (allocation) and group level (whole delivery); the leader cannot resolve money disputes | Members, Admin | MVP | — |
| GRP-012 | Anti-abuse: limits on concurrent groups per new leader, max group value for leaders < 3 completed groups, Trust agent monitoring of fake members, sudden-group patterns; reporting a leader | System, Admin | MVP | — |
| GRP-013 | Leader-collects-money mode (leader pays the seller for the whole group, collects from members off-platform or via sub-wallets) | Leader | Future | Blocked: `[LEGAL REVIEW]` |
| GRP-014 | Leader incentive/commission | Leader | Future | `[DECISION D-10]` |
| GRP-015 | Group chat/announcements between the leader and members (in-app; phone numbers hidden by default) | Leader, Members | MVP | — |
| GRP-016 | Groups are discoverable in search and through the AI ("Ludhiana mein koi aloo ka group hai?") | Buyer | MVP | — |

### 5.26 Membership programme & T&C (MEM) — feature 26 (§2A.3)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| MEM-001 | **KISAAN Plus** paid membership for buyers (plans: monthly, yearly; price placeholders ₹199/month, ₹1,999/year) `[DECISION D-11: pricing]` | Buyer | MVP | — |
| MEM-002 | Benefits (MVP): **free delivery** on platform-arranged deliveries up to a cap per order/month; **priority delivery** (priority dispatch to transporters + member SLA) — **P2, delivered with the Phase 7 transporter marketplace** `[DECISION D-96]`; **member-only deals** (seller opt-in member prices); **early access** to new bulk lots (e.g. 2 h before public); **priority support** | Buyer | MVP | Each benefit has eligibility rules (MEM-006) |
| MEM-003 | Benefits (P2/Future): extended acceptance window, free quality inspection credits (P2), member pricing on transport, seller-side membership (Future) | — | P2/Future | — |
| MEM-004 | Free trial (e.g. 30 days, once per user/business PAN) `[DECISION D-11]` | Buyer | MVP | **Given** a prior trial on the same PAN/phone, **Then** the trial is not offered |
| MEM-005 | **Mandatory T&C acceptance** before activation: versioned T&C document; acceptance stored with user ID, version, timestamp, IP/device, language, channel | Buyer | MVP | **Given** a new T&C version with material changes, **Then** members must re-accept before the next renewal or the renewal is not charged |
| MEM-006 | Benefit eligibility rules: free delivery cap (e.g. ₹500 per order, ₹2,000 per month), applicable only on platform logistics, within the service area; member deals per seller opt-in; benefits require an active membership at order placement | Buyer | MVP | — |
| MEM-007 | Auto-renewal with an explicit opt-in toggle at purchase (not pre-ticked); pre-debit notification per RBI e-mandate rules; renewal reminder 7 days before | Buyer | MVP | `[LEGAL REVIEW]` dark-pattern compliance |
| MEM-008 | Cancel anytime in ≤ 2 taps / one voice command (with confirmation); cancellation stops auto-renewal, and benefits continue until the end of the period | Buyer | MVP | — |
| MEM-009 | Refund policy: full refund if cancelled within 7 days and no benefit used; otherwise no pro-rata refund on monthly plans; yearly pro-rata minus benefits used `[DECISION D-12]` `[LEGAL REVIEW]` | Buyer | MVP | — |
| MEM-010 | Membership states: Trial, Active, Grace (payment failed, 3 days), Cancelled (active till end), Expired, Suspended (misuse) | System | MVP | — |
| MEM-011 | Misuse controls: sharing accounts, abnormal free-delivery usage → suspension per T&C | Admin | MVP | — |
| MEM-012 | Admin manages plans, benefits, T&C versions; changes to benefits are effective-dated and notified 30 days in advance | Admin | MVP | — |
| MEM-013 | A draft T&C document exists: see [MEMBERSHIP_TERMS_AND_CONDITIONS](MEMBERSHIP_TERMS_AND_CONDITIONS.md) `[LEGAL REVIEW]` | — | MVP | — |
| MEM-014 | Membership benefit cost tracking (platform-funded free delivery) for unit economics | Finance | MVP | — |

### 5.27 Public seller stores (STR) — feature 27 (§2A.4)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| STR-001 | Every seller automatically gets a **public store** at a shareable URL (`/store/<slug>`) on first publish | Seller | MVP | **Given** the seller publishes the first listing, **Then** the store is live and shareable via WhatsApp with a preview card |
| STR-002 | The store shows: name, banner, description, verification badges, rating, location/service area (district-level), all Active listings (sold-out items optionally shown), wholesale and coupon highlights, policies, groups using this seller's listings | All incl. anonymous | MVP | — |
| STR-003 | Store is discoverable by logged-out visitors and search engines; contact details follow privacy settings (PROF-004) | Anonymous | MVP | — |
| STR-004 | Seller customisation: store name, slug (unique, profanity-filtered, changeable at most once per 30 days with redirect), banner, logo, description (multi-language), policies (returns, delivery, payment) | Seller | MVP | — |
| STR-005 | Store QR code for offline sharing (mandi boards, posters) | Seller | MVP | — |
| STR-006 | Follow store → notifications on new listings | Buyer | P2 | — |
| STR-007 | Store suspended/hidden when the seller is suspended; the URL shows "store unavailable" | Admin | MVP | — |
| STR-008 | Store analytics (views, shares, enquiries) | Seller | MVP (basic) | — |

### 5.28 Automated inventory (INV) — feature 28 (§2A.5)

Covered by INV-001 … INV-011 in §5.10. The confirmed §2A.5 behaviours map as follows: automatic reserve (INV-002), deduct (INV-003), release (INV-004), overselling prevention (INV-005), manual adjustments with reason and audit (INV-006, INV-009), low-stock alerts (INV-007), out-of-stock auto-hide (INV-008).

### 5.29 Seller discount coupons (CPN) — feature 29 (§2A.6)

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| CPN-001 | Sellers create coupons for their own store/products | Seller | MVP | — |
| CPN-002 | Coupon fields: code (4–20 chars, A-Z0-9, unique per seller, case-insensitive), discount type (percentage / fixed per order), value, **max discount** cap (required for percentage), min order value and/or min quantity, applicable listings or categories (or all store), **start and end date/time** (IST), total usage limit, per-user usage limit, eligible users (all / members only / group leaders only / first-time buyers of this seller / group orders), status (draft / active / paused / expired / exhausted) | Seller | MVP | — |
| CPN-003 | Validation at apply-time and again at payment-confirmation time (time window, status, limits, eligibility, applicability, min order) | System | MVP | **Given** a coupon expires between cart and payment, **Then** the order is repriced and the buyer must re-approve |
| CPN-004 | Max **one seller coupon per order**; platform coupons Future | System | MVP | — |
| CPN-005 | Usage limits enforced atomically (no over-redemption under concurrency); redemption is reserved at checkout and committed on payment | System | MVP | — |
| CPN-006 | Coupon cost is borne by the seller; commission is computed on the post-coupon price | System | MVP | `[DECISION D-13]` |
| CPN-007 | Public coupons are displayed on the product page/store ("Use KINNOW10 till 20 Jan"); private coupons work by code only | Seller | MVP | — |
| CPN-008 | Abuse prevention: per-user limits keyed on verified phone and PAN/GSTIN, device fingerprint heuristics, block self-redemption (seller buying from own store), Trust agent anomaly flags | System | MVP | — |
| CPN-009 | Limited-time coupons show the real end time; no fake countdowns (dark-pattern guidelines) `[LEGAL REVIEW]` | System | MVP | — |
| CPN-010 | Coupon performance report (redemptions, discount given, GMV influenced) | Seller | MVP | — |
| CPN-011 | Coupons on accepted negotiated offers are **not allowed** by default (negotiation already sets the price); the seller can allow it per coupon | Seller | MVP | See PRC-004 |
| CPN-012 | Platform/admin coupons (platform-funded) | Admin | Future | — |

### 5.30 Pricing engine & discount stacking (PRC) — cross-cutting

| ID | Requirement | Role | Priority | Acceptance criteria |
|---|---|---|---|---|
| PRC-001 | A single pricing engine computes the effective price for any (listing, qty, buyer, context) and returns a **price breakdown** used by search, the product page, offers, checkout, group orders, invoices and AI | System | MVP | Every surface shows identical totals for the same inputs |
| PRC-002 | Stacking order: (1) base list price → (2) wholesale (best single tier or whole-lot) → (3) negotiated price **replaces** (1)+(2) if an accepted offer exists → (4) member-only price (if the seller opted in and the buyer is a member) — applies only to the non-negotiated path, and the lower of wholesale vs member price wins (no compounding) → (5) one seller coupon → (6) delivery fee, with membership free-delivery waiver → (7) taxes where applicable | System | MVP | Worked examples in FS §PRC |
| PRC-003 | Discounts are never applied in a way that makes the unit price < ₹0.01 or the order total negative; a seller-configurable **price floor** blocks coupon+tier combinations below the floor | System | MVP | — |
| PRC-004 | Coupons apply after negotiation only if the coupon has `allow_on_negotiated = true` | System | MVP | — |
| PRC-005 | Funding attribution in the breakdown: seller-funded (wholesale, coupon, member-only price), platform-funded (free delivery) | System | MVP | — |
| PRC-006 | Price quotes have a validity (e.g. 15 min on checkout) and are re-validated at payment confirmation | System | MVP | — |
| PRC-007 | Rounding: unit prices are computed and stored internally at ₹0.0001 per kg precision; every displayed and charged amount (line totals, discounts, fees, taxes, grand total) is rounded half-up to ₹0.01; prices are displayed per kg and per display unit | System | MVP | Golden tests TC-PRC-007 |

---

## 6. AI-first experience requirements

Detailed agent design is in [AI_AGENT_ARCHITECTURE](AI_AGENT_ARCHITECTURE.md). This section defines the product-level requirements.

### 6.1 Orchestrator & assistant (AI-ORC)

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| AI-001 | A persistent AI assistant ("Kisaan Sahayak") is available on every screen (floating mic + chat), on WhatsApp and as the default home for sellers | MVP | — |
| AI-002 | Intent understanding across pa/hi/en and mixed/romanised input; role-aware (acts in the user's active role) | MVP | Intent accuracy ≥ 90% on the pilot test set (TESTING_STRATEGY) |
| AI-003 | Slot filling: the AI asks only for missing required information, one question at a time for voice users | MVP | — |
| AI-004 | The AI acts only via tools using the **end-user's scoped permissions**; it cannot access other users' private data | MVP | — |
| AI-005 | Multi-step task tracking ("listing draft 80% complete") resumable across sessions and channels | MVP | — |
| AI-006 | Every AI-generated fact about prices, availability or status cites its source and timestamp; the AI says "I don't know" rather than inventing | MVP | 0 fabricated prices in the evaluation set |
| AI-007 | Graceful fallback: on low confidence or repeated misunderstanding → offer conventional screen / human support | MVP | — |
| AI-008 | Conversation history is visible to the user; users can delete their AI history (subject to audit retention of executed actions) | MVP | — |
| AI-009 | AI usage limits per user per day to control cost; premium AI features potentially in a paid tier | MVP (limits), Future (premium) | — |

### 6.2 Specialised agents (summary requirements)

| ID | Agent | Requirement | Priority |
|---|---|---|---|
| AI-010 | Listing (AI-LST) | Creates a listing draft from text, voice or photo; detects missing fields; converts units; suggests category; generates description; **never publishes without approval**; image analysis is never a quality certification | MVP |
| AI-011 | Discovery (AI-DSC) | Converts buyer needs into searches; explains rankings; never recommends unavailable listings | MVP |
| AI-012 | Price Intelligence (AI-PRI) | Retrieves mandi prices (MKT), compares markets, shows ranges with source and date; never invents or guarantees prices | MVP |
| AI-013 | Matching (AI-MAT) | Matches RFQs ↔ listings and listings ↔ buyers by location, quantity, variety, quality, rating; explains why; respects contact preferences | MVP |
| AI-014 | Negotiation (AI-NEG) | Compares offers (net realisation), explains, drafts counters; **never accepts/rejects without approval** | MVP |
| AI-015 | Logistics (AI-LGX) | Creates transport requests, compares quotes, tracks shipments; cost estimates only from quotes/historical data | MVP |
| AI-016 | Trust (AI-TRS) | KYC pre-screening, duplicate listings, abnormal price/transaction patterns, risk scores with reasons; **risk score is not proof**; escalates to humans | MVP |
| AI-017 | Notification (AI-NTF) | Chooses channel/timing/language, de-duplicates, composes messages from approved templates | MVP |
| AI-018 | Support (AI-SUP) | FAQ/RAG answers, status explanations, ticket creation, human escalation | MVP |
| AI-019 | Seller performance insights | Explains a seller's metrics and suggests actions | P2 |
| AI-020 | Crop availability forecasting / demand discovery | Aggregated, labelled indicative; requires validated data | Future |

### 6.3 Approvals (APR) — human in the loop

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| APR-001 | Action classes: **read** (no approval), **draft** (no approval, nothing external happens), **commit** (approval required): publish listing, send/accept/reject/counter offer, confirm/cancel order, initiate payment, accept transport quote, commit group quantity, close group order, purchase/cancel membership, accept T&C, apply inventory adjustment, create coupon | MVP | No commit-class tool executes without an `approved` ApprovalRequest |
| APR-002 | An approval shows a plain-language summary in the user's language (and TTS readback for voice) of exactly what will happen, including amounts in ₹ and quantities in the user's unit | MVP | — |
| APR-003 | Approval mechanisms: tap "Approve" in app; voice "haan, confirm" **plus** readback confirmation; WhatsApp interactive button. Payment always requires the PA's own authentication (UPI PIN, etc.) | MVP | — |
| APR-004 | Approvals expire (default 15 min) and are bound to the exact action parameters (hash); any parameter change invalidates the approval | MVP | — |
| APR-005 | Users can set **no** auto-approve for commit-class actions in MVP | MVP | — |
| APR-006 | All approvals are audit-logged (who, what, when, channel, the AI conversation reference) | MVP | — |
| APR-007 | Assisted/delegated actors (support agents, field agents) need the user's OTP consent for commit actions | MVP | — |

### 6.4 Voice & multilingual (VOX)

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| VOX-001 | Languages: Punjabi (Gurmukhi, pa-IN), Hindi (hi-IN), English (en-IN); UI, AI responses and notifications | MVP | — |
| VOX-002 | Speech-to-text for pa/hi/en and code-mixed speech; push-to-talk; noise robustness for outdoor/farm use | MVP | WER targets in TESTING_STRATEGY; pilot aspiration ≤ 20% WER on the domain test set `[ASSUMPTION A-01]`; **launch gate ≤ 25% WER** per language (TC-VOX-001) |
| VOX-003 | Text-to-speech replies in the user's language with adjustable speed; "repeat" command | MVP | — |
| VOX-004 | Automatic language detection per utterance; the user can lock a language | MVP | — |
| VOX-005 | Domain vocabulary: crop names, varieties, local units (e.g. "man", "killa/acre"), place names (Punjab villages/tehsils) | MVP | — |
| VOX-006 | Numerals and quantities confirmed by readback before any action ("Sau quintal, matlab 10,000 kilo — sahi hai?") | MVP | — |
| VOX-007 | Low-literacy UX: icons with text, audio prompts on key screens, minimal typing | MVP | — |
| VOX-008 | Voice notes in chats (enquiries, negotiation, support) with transcription | P2 | — |
| VOX-009 | Additional languages (Haryanvi-influenced Hindi, Gujarati, Marathi …) | Future | — |

### 6.5 WhatsApp channel (WA)

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| WA-001 | Official WhatsApp Business Platform integration (no unofficial clients) | MVP | — |
| WA-002 | Explicit opt-in captured and stored; opt-out via "STOP" honoured immediately | MVP | — |
| WA-003 | Users can talk to the KISAAN AI on WhatsApp (text + voice notes) to list, search, check orders, respond to offers | MVP (core: list, offers, order status) | — |
| WA-004 | Commit actions on WhatsApp use interactive buttons + readback; payments via a PA payment link | MVP | — |
| WA-005 | Proactive messages use approved templates only (outside the 24 h session window) | MVP | — |
| WA-006 | Store/listing share links with rich previews | MVP | — |

### 6.6 Mandi price data (MKT)

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| MKT-001 | Ingest daily mandi prices (min/max/modal) from official open-data sources (e.g. AGMARKNET / data.gov.in) `[UNVERIFIED — confirm API, licence, freshness]` | MVP | — |
| MKT-002 | Store source, market, commodity, variety, date, fetch time; never overwrite historical records | MVP | — |
| MKT-003 | Every displayed price shows source + market + date; stale data (> 3 days) is labelled stale | MVP | — |
| MKT-004 | Price alerts: notify the user when the modal price for a commodity/market crosses their threshold | MVP | — |
| MKT-005 | Trends and inter-market comparison charts (7/30/90 days) where data exists | MVP (basic), P2 (analysis) | — |
| MKT-006 | No price forecasts in MVP; any future forecast is labelled indicative with methodology | Future | — |
| MKT-007 | MSP display for MSP crops (official source, season) | MVP | — |

---

## 7. Cross-cutting requirements (summary)

Security (SEC-*), privacy (PRIV-*) and compliance (CMP-*) requirements are specified in [SECURITY_AND_COMPLIANCE](SECURITY_AND_COMPLIANCE.md). Measurable non-functional requirements (NFR-*) are defined in §7.1 below; the architecture that meets them is in [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md). These PRD-level constraints apply to every feature:

- Mobile-first PWA, usable on low-end Android (2 GB RAM) on 3G/2G-class networks, within the page-weight budgets in NFR-040.
- Offline-tolerant: drafts (listing, offer, status updates) are queued locally and synced; commit actions are never executed offline.
- Accessibility: WCAG 2.1 AA target; touch targets ≥ 48 px.
- Every state-changing action is audit-logged.
- India data residency for personal data `[ASSUMPTION A-02]`.


### 7.1 Non-functional requirements (NFR)

Targets apply to production at pilot scale (≤ ~10k MAU, ≤ ~1k orders/day `[ASSUMPTION A-33]`) unless stated otherwise. "p95" is measured server-side at the edge over a rolling 30 days, excluding third-party time (PA, LLM, STT/TTS) unless the requirement says otherwise. Test mapping: TC-NFR-* in [TESTING_STRATEGY](TESTING_STRATEGY.md).

| ID | Area | Requirement (measurable) | Priority |
|---|---|---|---|
| NFR-001 | Performance | Read APIs (listing detail, store page, order/offer reads): p95 ≤ 300 ms, p99 ≤ 800 ms | MVP |
| NFR-002 | Performance | Search with geo + filters: p95 ≤ 500 ms (TC-PERF-001); price quote (PRC): p95 ≤ 400 ms | MVP |
| NFR-003 | Performance | Write/commit APIs (offer, approval decision, checkout order creation excl. PA): p95 ≤ 800 ms | MVP |
| NFR-004 | Performance | AI text turn: time to first streamed token p95 ≤ 2 s; complete turn p95 ≤ 3 s for simple intents and ≤ 8 s for multi-tool turns; AI Gateway overhead (excl. model time) p95 ≤ 300 ms | MVP |
| NFR-005 | Performance | Voice round trip (end of user speech → start of TTS playback): p95 ≤ 6 s on 4G and ≤ 10 s on 3G; text reply is shown before TTS audio is ready | MVP |
| NFR-006 | Performance | Web vitals on farmer routes (simulated slow 4G, mid-range Android): LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1; time to interactive ≤ 5 s on 3G Fast for a cold PWA start | MVP |
| NFR-007 | Performance | Notifications: in-app/push delivered ≤ 30 s after the triggering event (p95); WhatsApp/SMS handed to the provider ≤ 60 s (p95) | MVP |
| NFR-010 | Scalability | Sustain 5× pilot peak load (k6 profile in TESTING §17) with all NFR-001..003 latency targets met | MVP |
| NFR-011 | Scalability | Horizontal scaling: API, web and AI Gateway are stateless (state in Postgres/Redis/object storage) and scale by replica count; documented growth path to 10× pilot (≈ 100k MAU, 10k orders/day) via read replicas, dedicated search engine and table partitioning, without re-architecture (SYSTEM_ARCHITECTURE scalability stages) | MVP (design) / P2 (execution) |
| NFR-012 | Scalability | Mandi price ingestion of a full daily dataset completes ≤ 15 min without degrading live-traffic latency | MVP |
| NFR-020 | Availability | Core marketplace (auth, search, listings, offers, orders, checkout, approvals): ≥ 99.5% monthly availability (≈ 3.6 h downtime/month), excluding announced maintenance ≤ 4 h/month in low-traffic windows (01:00–05:00 IST) | MVP |
| NFR-021 | Availability | AI assistant: ≥ 99.0% monthly; when AI or STT/TTS providers are degraded, conventional screens remain fully usable and the chat shows a degraded-mode notice (graceful degradation; automatic fallback to a secondary LLM provider) | MVP |
| NFR-022 | Availability | Payment webhook intake ≥ 99.9% (webhooks are acknowledged and persisted before processing; PA retries are absorbed) | MVP |
| NFR-030 | Reliability | Every state-changing API accepts an `Idempotency-Key`; retries of the same key never create duplicate listings, offers, orders, payments or refunds | MVP |
| NFR-031 | Reliability | Background jobs (reservation expiry, settlement release, reconciliation, notifications) are at-least-once with idempotent handlers; outbox lag ≤ 2 min p95; failed jobs retried with backoff and dead-lettered with alerts | MVP |
| NFR-032 | Reliability | Error budget: 5xx rate ≤ 0.5% of requests per day on core APIs; alert at > 2% over 5 min | MVP |
| NFR-033 | Data consistency | **Zero overselling:** under concurrent checkouts/acceptances, `reserved ≤ on_hand` always holds and no order is confirmed without a successful reservation (TC-CONC-*) | MVP |
| NFR-034 | Data consistency | **Payment integrity:** an order becomes Paid only after a signature-verified webhook plus server-side status fetch; each provider event is processed exactly once in effect | MVP |
| NFR-035 | Data consistency | **Ledger balance:** double-entry ledger sums to zero per order and per day; daily reconciliation against PA settlement reports with 0 unexplained differences > ₹1; mismatches alert finance within 1 h of the run | MVP |
| NFR-036 | Data consistency | Price shown in an approval card = price charged: approvals are bound to a parameter hash; any change invalidates the approval (APR-004) | MVP |
| NFR-040 | Low bandwidth | Farmer routes: ≤ 300 KB total transfer on first load excluding photos, of which JS ≤ 170 KB gzipped; repeat loads ≤ 50 KB with cached shell `[ASSUMPTION A-42]`; thumbnails ≤ 15 KB; uploaded photos compressed client-side to ≤ 200 KB; voice uploads ≤ 60 KB per 15 s (Opus) | MVP |
| NFR-041 | Low bandwidth | Core flows (login, create listing, view offers, approve, order status) remain usable on a 2G profile (250 kbps, 800 ms RTT) and on a lossy network (20% packet loss) with retries and visible progress | MVP |
| NFR-042 | Offline | **Offline-friendly:** app shell, active-language fonts and last-viewed listings/orders/prices are available offline with an "as of" timestamp; listing drafts, inventory adjustment drafts, transporter status updates and messages are queued in an on-device outbox and replayed with idempotency keys on reconnect | MVP |
| NFR-043 | Offline | **Commit actions are never executed offline** (approvals, payments, offer acceptance, order confirmation); they are disabled with an explanation until connectivity returns | MVP |
| NFR-044 | Offline | **Sync conflict rules:** server state wins for stock, prices and order/offer status; queued drafts are re-validated on sync and the user is shown any conflict (e.g. "listing sold out while you were offline") with a choice to edit or discard; transporter status updates keep their original device timestamps and are accepted only in valid state order | MVP |
| NFR-045 | Offline | Critical updates (offer received, order confirmed, payment received, pickup/delivery) are also sent via SMS or WhatsApp (subject to opt-in) so users without app connectivity still receive them | MVP |
| NFR-050 | Mobile responsiveness | Design baseline 360 × 640 px; no horizontal scroll or clipped primary actions at 360, 390, 768 and 1366 px widths; layouts hold at OS font scale 1.3×; buyer and admin views responsive to desktop (admin desktop-first ≥ 1280 px) | MVP |
| NFR-051 | Device support | Android 9+ with ≥ 2 GB RAM on Chrome-based browsers (PWA) `[ASSUMPTION A-43]`; latest 2 versions of Chrome, Safari (iOS 16+), Firefox, Edge on desktop | MVP |
| NFR-060 | Accessibility | WCAG 2.1 AA minimum for all public and app screens (UX targets 2.2 AA where feasible); text contrast ≥ 4.5:1; touch targets ≥ 48 × 48 px; colour never the only signal; axe-core zero serious/critical violations in CI | MVP |
| NFR-061 | Accessibility | Low-literacy support: every primary action has icon + text in the user's language; audio prompts on key screens; voice input available on every form field where text is expected; screen-reader (TalkBack) usable on the farmer flow | MVP |
| NFR-062 | Localisation | 100% of UI strings, notifications, legal notices and AI system messages available in pa, hi, en; CI fails on missing keys; Indian number grouping (₹2,79,500.00) and localised units | MVP |
| NFR-070 | Security | All SEC-*, PRIV-* requirements in [SECURITY_AND_COMPLIANCE](SECURITY_AND_COMPLIANCE.md) are met; zero open critical/high findings at each release (pen-test before launch); TLS 1.2+ everywhere; encryption at rest for databases, backups and object storage | MVP |
| NFR-071 | Security | Dependency and container image scanning on every build; critical CVEs patched ≤ 7 days, high ≤ 30 days; opsapi security releases adopted ≤ 7 days (OPSAPI_INTEGRATION) | MVP |
| NFR-080 | Maintainability | Kisaan plugin and web/AI code: automated test coverage ≥ 80% lines on pricing, inventory, payments, approvals and ledger modules (≥ 60% overall); lint + type-checks enforced in CI; OpenAPI spec generated and published for every Kisaan endpoint | MVP |
| NFR-081 | Maintainability | opsapi pinned to an immutable tag; an upgrade passes the opsapi contract suite (TC-OPS-*) before promotion; no Kisaan change requires modifying the opsapi repository | MVP |
| NFR-082 | Maintainability | Deployability: a production release (including Kisaan migrations as a pre-upgrade job) completes ≤ 30 min with zero-downtime rolling updates and a documented rollback ≤ 15 min | MVP |
| NFR-083 | Maintainability | Configuration over code: commission rates, tier caps, offer validity, TTLs, thresholds and feature flags are admin- or config-driven and effective-dated, without redeploys | MVP |
| NFR-090 | Observability | RED metrics (rate, errors, duration) per route for API, AI Gateway and web; business metrics (listings, offers, orders, GMV, reservation expiries, approval outcomes) on Grafana dashboards; alerts per SYSTEM_ARCHITECTURE observability table | MVP |
| NFR-091 | Observability | Distributed tracing with a `trace_id` propagated web → AI Gateway → Kisaan API → opsapi → jobs; ≥ 10% sampling, 100% for errors and commit actions; centralised logs retained 30 days hot and 1 year archived (PII-redacted) | MVP |
| NFR-092 | Observability | Every AI turn records agent, model/provider/version, prompt version, tokens, cost, latency, tool calls and approval outcome (SEC-098); per-user and per-day AI cost dashboards with budget alerts (D-56) | MVP |
| NFR-100 | Disaster recovery | **RPO ≤ 15 min** for PostgreSQL (continuous WAL / PITR; managed PITR typically achieves ≤ 5 min) and **RTO ≤ 4 h** for the core marketplace (SEC-110, SEC-113) | MVP |
| NFR-101 | Disaster recovery | Object storage: versioning plus cross-region/account replica; KYC documents and invoices RPO ≤ 1 h; other media ≤ 24 h | MVP |
| NFR-102 | Disaster recovery | DR drill (restore to a scratch environment, migrations check, smoke tests) before launch and quarterly, with results recorded; payment truth can be rebuilt from PA settlement reports plus stored raw webhook events | MVP |
| NFR-110 | Data residency | Personal data stored and processed in an India region `[ASSUMPTION A-02, A-32]`; any processing by non-India AI/STT providers is limited to the minimum necessary, disclosed in the privacy notice and covered by contract (CMP-012) | MVP |

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

---

## 9. Release scope summary

| Scope | Features |
|---|---|
| **MVP** | AUTH, PROF, ONB, CAT (MVP categories), PRD, SRCH, INV (all automated behaviours), ENQ, OFR (offers, quotations, negotiation), ORD, PAY (PA split, refunds, reconciliation, membership recurring), INVC (basic), LOG (transporter marketplace, status), REV, NOTF, SUP, DSP, ADM, ANL (basic), **WHL, GRP (member-direct payment), MEM, STR, CPN, PRC**, AI orchestrator + 9 agents (core skills), APR, VOX (pa/hi/en), WA (core), MKT (ingest, display, alerts), NFR (§7.1, all MVP-tagged rows) |
| **P2** | Quality inspection, live location, e-invoicing/e-way bill automation, buyer SSO, store follow, AI seller insights, auto-counter rules, partial fulfilment, voice notes, more categories (oilseeds, cotton, fodder) |
| **Future** | Agri-inputs, machinery, platform coupons, leader-collects-money groups, leader incentives, credit/pay-later, auctions, forecasting, native apps, more languages, 3PL integrations, featured listings |

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

Assumptions: A-01 (STT accuracy achievable for Punjabi with available engines), A-02 (personal data stored in India), A-03 (pilot targets indicative).
