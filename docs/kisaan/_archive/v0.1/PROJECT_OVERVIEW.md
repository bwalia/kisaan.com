# KISAAN — Project Overview

> Status: Draft v0.1 · Last updated: 2026-11-14 · Owner: KISAAN product & architecture · Source of truth index: [README](README.md)

## 1. Business vision

Indian farmers — particularly small and marginal ones — usually sell through a local mandi, a commission agent (arhtiya) or a nearby trader. Price discovery is local, terms are often opaque, and the work around a sale (finding buyers, haggling, arranging a truck, chasing payment) is manual and phone-based. Buyers in turn struggle to find **verified** supply of a specific **quantity, variety and quality** near a given location.

KISAAN's thesis: **conversational AI in the farmer's own language can do most of this coordination work**, while a well-designed marketplace (verification, transparent pricing, licensed payment rails, automated inventory and logistics) supplies the trust. The farmer stays in charge: AI drafts, compares, explains and reminds; humans approve.

### 1.1 What makes KISAAN different (summary)

1. **AI-first, not a chatbot bolted on** — every core flow (list, find, negotiate, order, transport, pay status, support) can be completed through conversation, backed by tools with strict permissions. See [AI_AGENT_ARCHITECTURE.md](AI_AGENT_ARCHITECTURE.md).
2. **Voice-first, multilingual** — Punjabi, Hindi, English and code-mixed speech; confirmation read-back before any action.
3. **WhatsApp as a channel** — the same agents reachable where farmers already are (MVP core: opt-in notifications, conversational listing creation, responding to offers via interactive approval buttons, and order status; full flows such as negotiation, group buying and membership are P2 — see roadmap).
4. **Honest price intelligence** — sourced mandi prices with source and timestamp; never invented, never presented as guaranteed.
5. **Commerce mechanics designed for agri-B2B volume** — wholesale tiers and "buy the whole lot" pricing, public group buying led by area leaders, seller coupons and a Prime-style membership.
6. **Human-in-the-loop by design** — an Approval Request system gates every commitment the AI could otherwise make.

## 2. Product scope

### 2.1 In scope for MVP (Punjab pilot)

| Area | MVP scope |
|---|---|
| Users | Farmer/Seller, Buyer (all buyer types), Group Leader, Transporter, Admin (+ support, verifier, finance sub-roles) |
| Categories | Wheat, Rice/Paddy, Maize, Pulses, selected Vegetables (potato, onion), selected Fruits (e.g. kinnow) `[DECISION D-01]` |
| Marketplace | Registration (phone OTP), profiles, KYC-lite verification, listings with photos, category-specific attributes, search/filter, public seller stores, enquiries, offers & counteroffers, orders, payments via licensed payment aggregator, invoices/receipts, delivery via platform-listed transporters, reviews, notifications, support tickets, disputes |
| §2A features | Wholesale tiers, group buying (members pay platform directly), membership + T&C, public stores, automated inventory, seller coupons |
| AI | Orchestrator + Listing, Discovery, Price Intelligence, Matching, Negotiation Assistant, Logistics, Trust & Verification (flagging only), Notification, Support agents — all in drafting/assistive mode with approvals |
| Voice/Language | pa-IN, hi-IN, en-IN voice + text in web/PWA chat |
| Admin | Moderation, verification queue, orders/payments monitoring, disputes, commission config, AI monitoring, audit logs, core analytics |

### 2.2 Phase 2 (P2) and Future

| P2 | Future |
|---|---|
| Full WhatsApp flows (negotiation, group buying, membership); priority delivery for members; quality inspector role & inspection reports; crop-availability signals; seller performance insights v2; multi-buyer RFQ auctions; more districts/states | Additional languages beyond pa/hi/en; featured listings; Agri-inputs (seeds, fertilisers, pesticides, machinery) pending licensing; leader-collects-money group buying (pending legal review); warehouse operators & warehouse receipts; credit/financing partners; native mobile apps; export documentation workflows; price forecasting (only with validated data) |

### 2.3 Explicit non-goals (MVP)

- KISAAN does **not** certify produce quality from photos or AI analysis.
- KISAAN does **not** hold customer funds in its own account; all money moves through a licensed payment aggregator `[LEGAL REVIEW]`.
- KISAAN does **not** predict future prices or guarantee prices.
- KISAAN does **not** replace MSP/government procurement; it is an additional channel.
- No lending, insurance or credit in MVP.

## 3. User roles

| Role | Who | Core jobs | Notes |
|---|---|---|---|
| **Farmer / Seller** | Individual farmers, FPOs, small aggregators | List produce, receive enquiries/offers, negotiate, fulfil orders, arrange transport, get paid, run a public store, manage inventory, create coupons & wholesale tiers | Same role later covers agri-input sellers (Future, extra licensing KYC) |
| **Buyer** | Retailers, wholesalers, distributors, processors, restaurants, exporters, agri-businesses; individual consumers where applicable | Search, compare, enquire, post requirements (bulk purchase requests), negotiate, order, pay, track, review | `buyer_type` drives defaults (MOQ, GST invoice need) |
| **Group Leader** | A verified buyer leading an area (village, mandi, colony, cooperative) | Separate bulk-buyer signup; create public buying groups; aggregate member demand; place the group order to unlock wholesale pricing; coordinate delivery/distribution | Extra verification + ratings; no money collection in MVP |
| **Transporter** | Truck/tempo owners, fleet operators | Register vehicles & service areas, receive requests, quote, accept, update pickup/delivery | Verification of RC/licence `[ASSUMPTION A-13]` |
| **Admin** | Platform operations | Users, verification, moderation, orders, disputes, payments, commission, fraud, AI monitoring, config, audit | Sub-roles: Support Agent, Verifier/Moderator, Finance Ops |
| **Quality Inspector** (P2) | Independent/partner assayers | Inspect lots, upload grading reports | Recommended to resolve quality disputes |
| **Warehouse Operator** (Future) | WDRA-registered warehouses | Storage, receipts | Out of MVP |

A single account may hold several roles (e.g. a farmer who also buys seed, or a buyer who is also a group leader). Role switching is explicit in the UI and in the AI context.

## 4. Business model (summary)

Detailed analysis: [PAYMENT_AND_BUSINESS_MODEL.md](PAYMENT_AND_BUSINESS_MODEL.md).

| Stream | MVP? | Notes |
|---|---|---|
| Transaction commission (charged to the seller and deducted from the payout; rate configurable per category) | ✅ Recommended primary | Low % to stay competitive with mandi costs `[DECISION D-19]` |
| Paid membership (Prime-style) | ✅ Confirmed requirement | Free/priority delivery funded by platform; must be modelled against logistics cost |
| Logistics service fee | ✅ | Margin or booking fee on platform-arranged transport |
| Featured listings / store promotion | Future | Clearly labelled "Sponsored" (dark-pattern rules) |
| Seller subscriptions / premium AI tools | Future | After proving value |

Discount funding: wholesale tiers and seller coupons are **seller-funded**; membership delivery benefits are **platform-funded**; platform coupons (Future) platform-funded.

## 5. Key architectural principles

1. **opsapi is the backend** — consumed as image `bwalia/opsapi:<pinned-tag>`; Kisaan adds a project module (manifest, migrations, APIs) in this repo. No changes to opsapi. See [OPSAPI_INTEGRATION.md](OPSAPI_INTEGRATION.md).
2. **Modular monolith first** — opsapi + Kisaan module + a separate AI Gateway service + Next.js web app. No premature microservices.
3. **AI acts through tools with the user's permissions**, never direct DB access; commit-class actions need approvals.
4. **Mobile-first PWA, low-bandwidth friendly**, offline drafts and queued actions.
5. **Compliance by design** — DPDP consent, e-commerce rules, GST invoicing, licensed payments.

## 6. Stakeholders & decision owners

| Area | Owner (to be named) |
|---|---|
| Product & business decisions (`D-*`) | Founder / Product owner |
| Legal & regulatory (`[LEGAL REVIEW]`) | External counsel |
| Tax (`[TAX REVIEW]`) | Chartered accountant |
| Architecture | Tech lead |
| opsapi version pinning | Tech lead + opsapi maintainers |

## 7. Related documents

Requirements: [PRD](PRD.md) · Specs: [Functional](FUNCTIONAL_SPECIFICATION.md) · AI: [Agents](AI_AGENT_ARCHITECTURE.md) · Risks & decisions: [RISKS_AND_ASSUMPTIONS](RISKS_AND_ASSUMPTIONS.md) · Plan: [Roadmap](DEVELOPMENT_ROADMAP.md)
