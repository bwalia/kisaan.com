# KISAAN — UX / UI Specification

> Status: Draft v0.2 · Last updated: 2026-11-14 · Owner: UX Lead (KISAAN) · Source of truth index: [README](README.md)

> **v0.2 changes:** one KISAAN AI (D-101) — `AgentCard` renamed `DraftCard`, AI monitoring re-based on tools; new §8.0 interface coverage matrix (Master Prompt v2 §31) incl. landing page and **bulk-buyer onboarding**; group screens re-based on *commit → offers → lock → pay* with leader disclaimer and permission boundary; wholesale pricing editor with offer settings and group discount; full coupon creator; KISAAN Plus naming; transporter screens marked P2 (D-106); admin AI configuration, tool catalogue, tool executions and AI cost screens.

This document covers the user experience and interface design for KISAAN: design principles for rural, low-literacy and low-bandwidth users, the design system, navigation and page hierarchy per role, the AI chat experience, and screen-by-screen specifications (master prompt §6, §8).

Related: [PRD](PRD.md) · [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md) · [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md) · [API_SPECIFICATION](API_SPECIFICATION.md) · [TESTING_STRATEGY](TESTING_STRATEGY.md)

---

## Table of contents

1. UX principles
2. Personas and key journeys
3. Design system
4. Platform, layout and responsiveness
5. Navigation and page hierarchy per role
6. Dashboard layouts
7. AI chat interface
8. Screen specifications
9. Interaction states (global standards)
10. Accessibility
11. Low-bandwidth and offline UX
12. Localisation rules
13. Open decisions and assumptions raised here

---

## 1. UX principles

| # | Principle | Practical rule |
|---|---|---|
| U1 | **Speak first, type last** | A large microphone button is on every primary screen. Every form field accepts voice. |
| U2 | **One task per screen, one question per turn** | Wizard-style flows with ≤ 3 inputs per step; progress dots. |
| U3 | **Show, don't write** | Icons + photos + colour + short labels; numbers are large. Every critical text has a 🔊 "listen" control. |
| U4 | **Same pattern everywhere** | One approval card, one product card, one status chip vocabulary across the app. |
| U5 | **Trust is visible** | Verification badges, "Seller-declared" vs "Verified" labels, data source + "as of" time on every price. |
| U6 | **Forgiving** | Drafts auto-save; undo for 10 s on non-committing actions; no data loss on network drop. |
| U7 | **Lightweight** | First load ≤ 200 KB JS (gzipped) on the farmer shell; images lazy-loaded and served as WebP/AVIF at the right size. |
| U8 | **AI and screens are equal paths** | Every AI action has a conventional screen; every screen has an "Ask KISAAN" entry pre-filled with context. |
| U10 | **One assistant** | There is one KISAAN AI with one name, voice and conversation everywhere (app, WhatsApp, voice). No "agents" are shown to users; the AI never claims something is done unless the server confirmed it (status chips come from backend responses). |
| U11 | **AI is optional** | Every AI flow has a conventional screen listed in §8.0; if AI is unavailable the app works fully and shows "AI unavailable — use the screens". |
| U9 | **Respect for the user** | No dark patterns: no fake urgency, no pre-ticked auto-renewal, cancellation as easy as sign-up (see MEMBER and [SECURITY_AND_COMPLIANCE](SECURITY_AND_COMPLIANCE.md)). |

---

## 2. Personas and key journeys

| Persona | Profile | Primary goals | Design implications |
|---|---|---|---|
| **Gurpreet (Farmer, Moga)** | 45, 12 acres wheat/paddy, Punjabi speaker, reads Gurmukhi slowly, Android phone (2–3 GB RAM), patchy 4G, WhatsApp daily | Sell harvest at a fair rate, get paid reliably | Voice-first, Punjabi default, big buttons, WhatsApp parity |
| **Rajesh (Wholesaler, Ludhiana)** | 38, buys 500–2,000 qtl/month, Hindi/English, uses laptop + phone | Find reliable supply, compare offers, manage orders | Dense list views on desktop, filters, bulk actions |
| **Amit (Bulk buyer, flour mill, Khanna)** | Procurement manager, buys 500+ t/season, desktop + phone, Hindi/English | Recurring supply at known grade, comparisons, GST invoices | Separate bulk onboarding, procurement profile, requirement + quotation views, dense comparison tables |
| **Group member (household / shop)** | Joins a neighbour's group from a WhatsApp link, low data budget | Commit a small quantity, pay only their share, privacy | One-screen join, clear "pay later at lock" message, own status only |
| **Harjit (Group Leader, village)** | 50, respected in village, coordinates purchases for 20 families | Aggregate demand, get wholesale rate | Group dashboard, member list, share link to WhatsApp |
| **Sukhdev (Transporter, Bathinda)** | 33, owns two trucks, Punjabi/Hindi | Get loads, quote fast, get paid | Job feed, one-tap quote, OTP delivery proof |
| **Admin / Verifier (Ops team)** | Desktop users | Verify sellers, moderate, resolve disputes, monitor AI | Data tables, queues, keyboard shortcuts |

Key journeys (step-level detail in [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md)):

```mermaid
journey
    title Farmer sells wheat (voice-first)
    section Onboard
      Open link from WhatsApp: 4: Farmer
      Choose ਪੰਜਾਬੀ, phone OTP: 4: Farmer
    section List
      Tap mic, speak crop details: 5: Farmer
      Confirm readback, add photo: 4: Farmer
      Approve publish: 5: Farmer
    section Sell
      Receive 3 offers (push/WhatsApp): 5: Farmer
      Compare with AI, counter one: 4: Farmer
      Approve acceptance + OTP: 4: Farmer
    section Fulfil
      Choose transport quote: 3: Farmer
      Hand over, buyer confirms with OTP: 4: Farmer
      Payout received: 5: Farmer
```

---

## 3. Design system

Name: **"Khet" design system**. Implemented as Tailwind theme tokens + a React component library (shadcn/ui-style headless primitives, Radix) [ASSUMPTION A-40: Radix/shadcn acceptable].

### 3.1 Colour tokens

| Token | Hex | Use | Contrast vs `#FFFFFF` |
|---|---|---|---|
| `green-700` (primary) | `#1B6E3A` | Primary buttons, active nav, links | ≈ 6.3 : 1 (AA normal text) |
| `green-800` | `#145A2F` | Pressed state, headers | ≈ 8 : 1 |
| `green-100` | `#E3F1E7` | Selected backgrounds, success surfaces | n/a (background) |
| `white` (secondary) | `#FFFFFF` | Surfaces | — |
| `cream-50` (page bg) | `#FAF7F0` | App background | — |
| `earth-700` | `#6B4F2A` | Secondary text accents, category chips | ≈ 7.4 : 1 |
| `earth-200` | `#E8DCC8` | Dividers, card borders | — |
| `amber-700` | `#B45309` | Offers, deals, coupon chips, warnings text | ≈ 5.0 : 1 (AA) |
| `amber-100` | `#FEF3C7` | Deal/warning backgrounds | — |
| `ink-900` (text) | `#1F2A1F` | Body text | ≈ 14.9 : 1 |
| `ink-600` (muted) | `#5B6459` | Secondary text | ≈ 6.1 : 1 |
| `red-700` (error) | `#B42318` | Errors, destructive actions | ≈ 6.6 : 1 |
| `blue-700` (info) | `#1D4ED8` | Info, links in admin | ≈ 6.7 : 1 |

Rules: text contrast ≥ 4.5 : 1 (WCAG 2.2 AA), large text/icons ≥ 3 : 1. Colour is **never** the only signal; status chips always carry an icon and a word. Contrast values are approximate and must be verified with tooling in the design QA step.

Dark mode: Future (outdoor sunlight readability is the priority; a high-contrast mode is MVP — see §10).

### 3.2 Typography

| Script | Font (all open-licence) | Fallback |
|---|---|---|
| Latin | Noto Sans (or Inter) | system-ui |
| Gurmukhi | Noto Sans Gurmukhi | system Gurmukhi font |
| Devanagari | Noto Sans Devanagari | system Devanagari font |
| Numerals | Tabular figures (`font-variant-numeric: tabular-nums`) for prices/quantities | — |

Fonts are subset per script and loaded only for the active language (`font-display: swap`), keeping each font ≤ 60 KB WOFF2 [ASSUMPTION A-41].

Type scale (mobile; desktop +2 px on body):

| Token | Size / line height | Weight | Use |
|---|---|---|---|
| `display` | 28 / 36 | 700 | Key numbers (price, quantity) |
| `h1` | 24 / 32 | 700 | Screen titles |
| `h2` | 20 / 28 | 600 | Section titles |
| `body-lg` | 18 / 28 | 400 | Default body for farmer/transporter UI |
| `body` | 16 / 24 | 400 | Buyer/admin body; minimum anywhere |
| `caption` | 14 / 20 | 500 | Metadata, timestamps (never for critical info) |

Gurmukhi and Devanagari need about 10–15% extra line height (applied via `:lang(pa)`, `:lang(hi)` selectors).

### 3.3 Spacing, sizing, radius, elevation

- Spacing scale: 4, 8, 12, 16, 24, 32, 48 px.
- **Touch targets ≥ 48 × 48 px** (56 px for primary actions in farmer/transporter UI), with ≥ 8 px between targets.
- Radius: 8 px (inputs), 12 px (cards), 999 px (chips, mic button).
- Elevation: two levels only (card, sheet/modal) to keep rendering cheap.

### 3.4 Iconography and imagery

- Icon set: Lucide (outline, 24 px; 28 px in farmer UI) plus a custom crop icon set (wheat, paddy, maize, pulses, potato, onion, kinnow) drawn as simple pictograms recognisable without text.
- Units always shown with an icon + word: ⚖ quintal / kg / tonne.
- Product photos: 1:1 thumbnails (160 px) and 4:3 detail (up to 1080 px wide); a blur-up placeholder ≤ 1 KB.

### 3.5 Core components

| Component | Variants / notes |
|---|---|
| `Button` | primary, secondary, ghost, destructive; sizes md (48 px), lg (56 px); loading state with spinner and preserved width |
| `MicButton` | Floating 64 px circle; states: idle, listening (pulsing ring + live waveform), processing, error; hold-to-talk and tap-to-toggle |
| `ListenButton` (🔊) | Plays TTS of the adjacent text block |
| `ProductCard` | Photo, crop icon, name + variety, qty available, price/unit, wholesale badge ("Thok rate"), distance, seller badge, member price tag (if any) |
| `PriceBlock` | Large unit price, unit, wholesale tiers table, applied discounts breakdown, "as of"/source for reference prices |
| `ApprovalCard` | Fixed layout: icon + action title, terms list, total, counterparty, expiry countdown, 🔊 readback, **✔ Approve** (primary) / **✖ Cancel** (secondary); step-up OTP sheet when required |
| `StatusChip` | draft, live, paused, sold out, pending, accepted, rejected, expired, paid, in transit, delivered, disputed — each with fixed icon + colour |
| `TrustBadge` | Phone verified, KYC verified, bank verified, GST verified, top seller (P2) |
| `QuantityInput` | Number pad + unit selector (kg/qtl/t); shows converted value ("100 qtl = 10,000 kg") |
| `Stepper` | Progress dots + step label |
| `OfflineBanner` | "You're offline — changes will be sent when connected" |
| `EmptyState` | Illustration + one sentence + one primary action + "Ask KISAAN" |
| `Toast` | Success/error; ≤ 6 s; with undo where applicable |
| `BottomSheet` | Filters, unit picker, OTP, confirmation |
| `DataTable` (admin) | Sort, filter, column chooser, bulk select, CSV export |
| `ChatBubble`, `DraftCard`, `ApprovalCard`, `QuickReplies` | KISAAN AI chat (see §7) |
| `LanguageSwitcher` | ਪੰਜਾਬੀ / हिंदी / English, always reachable from profile and onboarding |

---

## 4. Platform, layout and responsiveness

- **Next.js PWA** (installable, offline shell, background sync). Breakpoints: `sm` 360 px (design baseline), `md` 768 px, `lg` 1024 px, `xl` 1280 px.
- Farmer, transporter and group leader UIs are designed for 360 × 640 first. Buyer UI is responsive with a desktop list/detail layout. Admin is desktop-first (≥ 1280 px) with a usable tablet layout.
- Bottom navigation on mobile (max 5 items); left sidebar on `lg+`.
- Server-rendered public pages (store, product, group) for SEO and fast first paint; app pages use client navigation with cached data.

---

## 5. Navigation and page hierarchy per role

Role switching: a multi-role user sees a **role switcher** in the header ("Selling / Buying / Transport") and the bottom nav changes accordingly. The AI chat is shared and role-aware.

### 5.1 Farmer / Seller

Bottom nav: **Home · Sell (+) · Offers · Orders · Chat (🎤)**. Profile/Store/Inventory/Coupons are under Home → "My shop" and the avatar menu.

```mermaid
flowchart TD
    H[Home dashboard SCR-HOME-01] --> SELL[Create listing SCR-LST-01..05]
    H --> MYSHOP[My shop / store mgmt SCR-STORE-02]
    MYSHOP --> LISTINGS[My listings SCR-LST-06]
    MYSHOP --> INV[Inventory SCR-INV-01]
    MYSHOP --> WHL[Wholesale pricing editor SCR-WHL-01]
    H --> GREQ[Group requirements near me SCR-GROUP-11]
    MYSHOP --> CPN[Coupons SCR-COUPON-01..02]
    MYSHOP --> PUB[View public store SCR-STORE-01]
    H --> OFFERS[Offers inbox SCR-OFR-01]
    OFFERS --> NEG[Negotiation thread SCR-OFR-02]
    OFFERS --> CMP[Compare offers SCR-OFR-03]
    H --> ORD[Orders SCR-ORD-01]
    ORD --> ORDD[Order detail SCR-ORD-02]
    ORDD --> TRN[Arrange transport SCR-LOG-01]
    H --> PRICES[Mandi prices SCR-MKT-01]
    H --> EARN[Payments & earnings SCR-PAY-04]
    H --> CHAT[AI chat SCR-AI-01]
    H --> APRV[Approvals inbox SCR-AI-02]
    H --> PROF[Profile, KYC, bank, language SCR-PROF-01]
    H --> NOTIF[Notifications SCR-NOTF-01]
    H --> HELP[Help & support SCR-SUP-01]
```

### 5.2 Buyer

Bottom nav: **Home · Search · Groups · Orders · Chat (🎤)**; Cart/Offers via header icons.

```mermaid
flowchart TD
    BH[Buyer home SCR-HOME-02] --> S[Search & results SCR-SRCH-01]
    S --> F[Filters sheet SCR-SRCH-02]
    S --> PD[Product detail SCR-SRCH-03]
    PD --> ST[Seller public store SCR-STORE-01]
    PD --> OF[Make offer SCR-OFR-04]
    PD --> CART[Cart SCR-PAY-01]
    CART --> CO[Checkout SCR-PAY-02]
    CO --> PS[Payment status SCR-PAY-03]
    BH --> RFQ[Post requirement SCR-ENQ-01]
    BH --> GRP[Groups discovery SCR-GROUP-01]
    GRP --> GD[Group detail / commit SCR-GROUP-02]
    BH --> MYOF[My offers SCR-OFR-01]
    BH --> O[Orders SCR-ORD-01]
    O --> OD[Order detail + tracking SCR-ORD-02]
    BH --> MEM[KISAAN Plus SCR-MEMBER-01..03]
    BH --> BULK[Bulk dashboard SCR-BULK-02 - bulk buyers]
    BULK --> BPROF[Procurement profile SCR-BULK-03]
    BH --> CHAT[AI chat SCR-AI-01]
    BH --> PROF[Profile SCR-PROF-01]
```

### 5.3 Group Leader (buyer with `group_leader` role)

Additional nav item under Groups: **My groups**.

```mermaid
flowchart TD
    LS[Leader signup SCR-GROUP-05] --> LV[Leader verification status SCR-GROUP-06]
    LV --> MG[My groups SCR-GROUP-03]
    MG --> GC[Create group wizard SCR-GROUP-04]
    MG --> GM[Group dashboard: commitments, remaining, status SCR-GROUP-07]
    GM --> GOF[Seller offers for the group SCR-GROUP-09]
    GOF --> GO[Lock group order SCR-GROUP-08]
    GO --> GP[Member payment window tracker SCR-GROUP-07]
    GM --> SH[Share group link to WhatsApp]
```

### 5.4 Transporter (P2 — D-106)

Transporter screens ship with the platform transporter marketplace in roadmap Phase 9 (P2). In MVP, delivery is buyer pickup or seller-arranged (SCR-LOG-08).

Bottom nav: **Jobs · My quotes · Trips · Earnings · Chat (🎤)**.

```mermaid
flowchart TD
    TJ[Job feed SCR-LOG-03] --> TQ[Submit quote SCR-LOG-04]
    TQ --> MQ[My quotes SCR-LOG-05]
    MQ --> TR[Trip detail: pickup/delivery, OTP SCR-LOG-06]
    TJ --> VH[Vehicles & service areas SCR-LOG-07]
    TJ --> TE[Earnings SCR-PAY-04]
```

### 5.5 Admin (desktop)

Left sidebar sections:

```mermaid
flowchart TD
    AD[Admin overview SCR-ADM-01] --> U[Users & roles SCR-ADM-02]
    AD --> V[Verification queue SCR-ADM-03]
    AD --> M[Listing moderation SCR-ADM-04]
    AD --> O[Orders monitor SCR-ADM-05]
    AD --> P[Payments & settlements SCR-ADM-06]
    AD --> D[Disputes SCR-ADM-07]
    AD --> T[Trust flags SCR-ADM-08]
    AD --> G[Groups & leaders SCR-ADM-09]
    AD --> MB[Membership plans & T&C versions SCR-ADM-10]
    AD --> C[Commission & fees config SCR-ADM-11]
    AD --> AI[AI monitoring & costs SCR-ADM-12]
    AD --> R[Reports & analytics SCR-ADM-13]
    AD --> CFG[Platform configuration & audit log SCR-ADM-14]
```

---

## 6. Dashboard layouts

### 6.1 Farmer home — SCR-HOME-01 (mobile 360 px)

```text
┌──────────────────────────────────┐
│ ☰  KISAAN        ਪੰ  🔔3   (GP) │  header: lang, notifications, avatar
├──────────────────────────────────┤
│ ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਗੁਰਪ੍ਰੀਤ ਜੀ 🔊       │
│ ┌──────────────────────────────┐ │
│ │ 🎤  ਬੋਲ ਕੇ ਦੱਸੋ — ਕੀ ਵੇਚਣਾ ਹੈ? │ │  big voice CTA (56px)
│ └──────────────────────────────┘ │
│ ┌──────────┐ ┌──────────┐        │
│ │ 💬 3     │ │ 📦 1      │        │  tiles: New offers / Active orders
│ │ ਨਵੀਆਂ    │ │ ਆਰਡਰ     │        │
│ │ ਪੇਸ਼ਕਸ਼ਾਂ │ │ ਚੱਲ ਰਹੇ   │        │
│ └──────────┘ └──────────┘        │
│ ┌──────────┐ ┌──────────┐        │
│ │ ✅ 2      │ │ ₹ 48,000 │        │  Pending approvals / Payments due
│ │ ਮਨਜ਼ੂਰੀਆਂ │ │ ਆਉਣੇ ਹਨ  │        │
│ └──────────┘ └──────────┘        │
│ ਮੰਡੀ ਰੇਟ (ਕਣਕ) · as of 09:00 🔊   │
│ Moga ₹—  Jagraon ₹—  Khanna ₹—   │  from MKT feed; "—" if unavailable
│ ਮੇਰਾ ਮਾਲ                          │
│ [🌾 ਕਣਕ PBW-826 · 100 ਕੁ. · Live]│  listing cards
├──────────────────────────────────┤
│ 🏠  ➕ਵੇਚੋ  💬ਪੇਸ਼ਕਸ਼  📦ਆਰਡਰ  🎤 │  bottom nav
└──────────────────────────────────┘
```

Content priority: (1) voice CTA, (2) items needing action (offers, approvals), (3) money, (4) prices, (5) listings.

### 6.2 Buyer home — SCR-HOME-02

Mobile: search bar with mic → "Your requirements" chips → "Near you" product cards → active groups near you → orders in progress. Desktop: two-column layout (search + results feed left; orders/offers summary right).

### 6.3 Transporter home — Job feed SCR-LOG-03

Cards sorted by distance to pickup: route (A → B, km), load (qty, packaging), pickup window, required vehicle, "Quote" button. Filter: my service areas / vehicle type.

### 6.4 Admin overview — SCR-ADM-01 (desktop)

```text
┌───────────┬─────────────────────────────────────────────────────────────┐
│ KISAAN    │ Overview  [Today|7d|30d|Custom]       Search ⌘K   (Admin)   │
│ Admin     ├─────────────────────────────────────────────────────────────┤
│ Overview  │ KPI tiles: Users | Verified farmers | Buyers | Active        │
│ Users     │ listings | Orders (pending/completed) | GMV | Commission     │
│ Verify(12)│ | Open disputes | Trust flags | AI cost today                │
│ Listings  ├───────────────────────────────┬─────────────────────────────┤
│ Orders    │ GMV & orders trend (line)     │ Listings by category (bar)  │
│ Payments  ├───────────────────────────────┼─────────────────────────────┤
│ Disputes  │ Funnel: search→enquiry→offer→ │ Queues needing action:      │
│ Trust (5) │ order→paid→delivered          │ verification, moderation,   │
│ Groups    │                               │ disputes, failed payouts    │
│ Membership├───────────────────────────────┴─────────────────────────────┤
│ Fees      │ KISAAN AI: tool success %, approvals, P95 latency, cost/day │
│ AI        │ Recent audit events                                           │
│ Reports   │                                                               │
│ Config    │                                                               │
└───────────┴─────────────────────────────────────────────────────────────┘
```

KPI definitions are in the ANL section of the [PRD](PRD.md).

---

## 7. AI chat interface — SCR-AI-01

The chat is the **central interaction point**: reachable from the bottom-nav 🎤 button, from "Ask KISAAN" on every screen (opens with context, e.g. the current listing), and from WhatsApp.

### 7.1 Layout (mobile)

```text
┌──────────────────────────────────┐
│ ←  KISAAN ਸਹਾਇਕ   ਪੰ ▾   ⋮        │  language override, menu (history, clear)
├──────────────────────────────────┤
│              ┌──────────────────┐│
│              │🎤 0:06 ▶  "ਮੇਰੇ ││  user voice bubble + transcript
│              │ਕੋਲ 100 ਕੁਇੰਟਲ…" ││  (tap transcript to edit)
│              └──────────────────┘│
│┌──────────────────────────────┐  │
││ ਠੀਕ ਹੈ। ਕਣਕ ਦੀ ਕਿਹੜੀ ਕਿਸਮ ਹੈ? 🔊│  │  assistant bubble with listen
│└──────────────────────────────┘  │
│ [PBW-826] [HD-3086] [ਹੋਰ] [ਪਤਾ ਨਹੀਂ]│  quick replies (≥48px)
│┌──────────────────────────────┐  │
││ 📝 Draft listing               │  │  DraftCard
││ 🌾 ਕਣਕ · 100 ਕੁ. · ਮੋਗਾ          │  │
││ ਕਿਸਮ: — · ਰੇਟ: —               │  │  missing fields highlighted
││ [Edit on screen]               │  │  deep link to SCR-LST-02
│└──────────────────────────────┘  │
├──────────────────────────────────┤
│ 📷  [ ਲਿਖੋ…               ]  (🎤) │  composer: camera, text, big mic
└──────────────────────────────────┘
```

### 7.2 Message and card types

| Type | Purpose | Notes |
|---|---|---|
| Text bubble | Assistant/user messages | Max 3 short sentences; 🔊 on assistant bubbles; auto-play TTS when the user's last turn was voice (setting) |
| Voice bubble | User voice | Waveform, duration, transcript (editable before sending in "review transcript" mode, default off for farmers) |
| Quick replies | Fast answers | Max 4, plus "Other / ਹੋਰ" |
| Product/listing card | Results | Same as `ProductCard`; horizontally scrollable list of ≤ 5 |
| Comparison table card | Offer/transport comparison | Collapses to stacked cards on 360 px |
| Price card | Mandi prices | Source + as-of always shown; "Reference only" label |
| Draft card | Listing/offer/requirement/group drafts | Missing fields marked; "Edit on screen" deep link |
| **Approval card** | Commit actions | Standard `ApprovalCard`; never auto-approved; voice "haan" requires a second confirmation for payments/orders/offer acceptance (see APR) |
| Status/timeline card | Orders, shipments, payments | Step timeline with current step highlighted |
| Handoff card | Human support | Ticket number, expected response time |
| System notice | Offline, degraded AI, budget limit | Neutral style |

### 7.3 Voice interaction states (MicButton)

| State | Visual | Audio/haptic | Text |
|---|---|---|---|
| Idle | Green mic | — | "ਬੋਲੋ / बोलिए / Speak" |
| Listening | Pulsing ring + live waveform; timer | Short beep + vibrate on start | "ਸੁਣ ਰਿਹਾ ਹਾਂ…" |
| Too quiet / noisy | Amber ring | — | "ਥੋੜ੍ਹਾ ਨੇੜੇ ਹੋ ਕੇ ਬੋਲੋ" (speak closer) |
| Processing | Spinner inside mic | — | "ਸਮਝ ਰਿਹਾ ਹਾਂ…" |
| Low confidence | Transcript shown with uncertain words underlined | — | "ਕੀ ਤੁਸੀਂ '100 ਕੁਇੰਟਲ' ਕਿਹਾ?" + Yes/No |
| Offline | Mic disabled with cloud-off icon; voice notes can still be recorded and queued (P2) | — | "ਇੰਟਰਨੈੱਟ ਨਹੀਂ — ਬਾਅਦ ਵਿੱਚ ਭੇਜਾਂਗੇ" |
| Error | Red ring | Double vibrate | "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ" + type fallback |
| Permission denied | Mic with slash | — | Instructions to enable microphone + text fallback |

### 7.4 Approvals inbox — SCR-AI-02

A list of pending approvals (action, amount, counterparty, expiry countdown) with Approve/Cancel actions; filter by type; history tab (approved/rejected/expired with timestamps). Badge count in the header.

### 7.5 AI transparency

- Every AI message has a small "AI" label; long-press shows "Why this?" (sources, data timestamps).
- Thumbs up/down on assistant messages (feeds evaluation, see [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md) §15).
- "Talk to a person" is always in the ⋮ menu.

---

## 8. Screen specifications

### 8.0 Interface coverage (Master Prompt v2 §31)

Every interface below is mobile-first (designed at 360 px, then scaled up), meets the page-weight budgets in §11, and has a conventional (non-AI) path. "AI path" is optional help through the one KISAAN AI.

| Interface | Screen IDs | Scope | Low-bandwidth notes | AI path (optional) | Conventional path |
|---|---|---|---|---|---|
| Landing page | SCR-LAND-01 | MVP | SSR, ≤ 120 KB first load, no video autoplay | "Ask KISAAN" demo prompt | Sign-up CTAs per role |
| Farmer onboarding | SCR-ONB-01…05 | MVP | Text-first, images optional | Voice registration (readback + confirm) | Wizard |
| Buyer onboarding | SCR-ONB-03/04 | MVP | Same | Chat | Wizard |
| **Bulk buyer onboarding** | SCR-BULK-01 | MVP | Multi-step, each step saves offline | AI pre-fills profile from conversation (DRAFT) | Wizard |
| Buyer group creation | SCR-GROUP-04, SCR-GROUP-05 (leader application) | MVP | Wizard steps ≤ 3 inputs | `groups` tools draft the group | Wizard |
| Group dashboard | SCR-GROUP-07 (leader), SCR-GROUP-10 (member) | MVP | Polling ≤ 1/min, delta updates | "How many more kg do we need?" | Dashboard |
| Seller store (public) | SCR-STORE-01 | MVP | Edge-cached SSR ≤ 150 KB | — | Page |
| Seller dashboard | SCR-HOME-01, SCR-STORE-02, SCR-PAY-04 | MVP | Cached tiles, last-updated time | Ask about sales, orders, payouts | Dashboard |
| Product listing | SCR-LST-01…06 | MVP | Photos compressed client-side ≤ 200 KB | Voice/photo listing draft | Form wizard |
| Wholesale pricing editor | SCR-WHL-01 | MVP | Live preview computed by server quote, debounced | Tier/offer draft from speech | Editor |
| Inventory dashboard | SCR-INV-01/02 | MVP | Read-mostly, history paginated | Explain stock, draft adjustment | Dashboard + adjust form |
| Coupon creator | SCR-COUPON-01/02 | MVP | Single form | Coupon draft from speech | Form |
| Membership page | SCR-MEMBER-01…04 | MVP | Static content cached | Explain benefits | Plan page + checkout |
| Product search | SCR-SRCH-01/02 | MVP | 10 results/page, thumbnails 20 KB | Natural-language/voice search | Search + filters |
| Product details | SCR-SRCH-03 | MVP | Lazy-load gallery | Explain price for my qty | Page |
| Cart | SCR-PAY-01 | MVP | — | Add to cart via chat (DRAFT) | Cart |
| Checkout | SCR-PAY-02/03 | MVP | Server quote only; retry-safe | Explain breakdown | Checkout (Pay button = approval) |
| Offers | SCR-OFR-01, SCR-OFR-03/04 | MVP | — | Compare offers | Inbox |
| Negotiation | SCR-OFR-02 | MVP | Text thread, voice notes P2 | Draft counter (approval) | Thread |
| Orders | SCR-ORD-01/02 | MVP | Timeline cached | Order status | List + detail |
| Logistics | SCR-LOG-08 (MVP seller delivery), SCR-LOG-01…07 (P2 transporter) | MVP/P2 | Offline-queued status updates | Delivery status | Screens |
| AI chat | SCR-AI-01, SCR-AI-02 | MVP | Text-only mode toggle (no TTS) | — | — |
| Voice interaction | MicButton states §7.3 on every primary screen | MVP | Audio upload ≤ 16 kbps Opus; push-to-talk only | — | Typing always available |
| Admin dashboard | SCR-ADM-01…20 | MVP | Desktop | — (no admin tools in the user assistant) | Console |

### 8.0a Landing and bulk-buyer screens (new in v0.2)

#### SCR-LAND-01 Landing page
- **Purpose:** explain KISAAN in 5 seconds and route each visitor to the right sign-up. **Roles:** logged-out.
- **Components:** language tiles (ਪੰਜਾਬੀ / हिंदी / English) at top; hero line "Sell, buy in bulk, or buy together with your village — with KISAAN AI"; four CTAs: **Sell my crop**, **Buy**, **I buy in bulk** (→ SCR-BULK-01), **Start or join a buying group** (→ SCR-GROUP-01); "How KISAAN AI helps" (3 steps with icons, one 15-s optional audio clip); live public groups near you (district from IP is never stored; user can pick district); trust strip (verified sellers, payments via licensed payment provider, KISAAN Plus link); footer with policies, grievance officer contact, language switch.
- **States:** offline (cached shell), slow network (text-only hero).
- **Related:** KIS-REQ-006, KIS-BULK-001, KIS-GROUP-004.

#### SCR-BULK-01 Bulk-buyer onboarding (separate path)
- **Entry:** `/signup/bulk-buyer`, landing CTA, "I buy in bulk" toggle in SCR-ONB-03, or KISAAN AI.
- **Steps (≤ 3 inputs each):** (1) phone OTP; (2) business type + business name; (3) products (commodity + variety chips, multi-select); (4) typical quantity per purchase (`QuantityInput`) + frequency (one-off / weekly / fortnightly / monthly / seasonal); (5) delivery areas (districts multi-select + delivery address); (6) required quality (category attribute fields, e.g. moisture ≤ 12 %); (7) budget range (optional; lock icon "private — never shown to sellers") + preferred sellers (optional search); (8) optional GSTIN/business verification → done.
- **Actions:** save each step (resumable); "Fill with KISAAN" opens chat with a DraftCard of the profile.
- **Related:** KIS-BULK-001…011.

#### SCR-BULK-02 Bulk dashboard
- Tiles: open requirements (with response counts), matching lots for my profile, quotations awaiting me, active orders, spend this month. Desktop: dense table views with sort and CSV export (P2).

#### SCR-BULK-03 Procurement profile
- Edit all SCR-BULK-01 fields; recurrence settings (P2); preferred sellers (P2 effect); visibility note per field.

Format per screen: **Purpose · Roles · Entry points · Components · Data · Actions · States · Accessibility · Related requirements.** Global states follow §9; only screen-specific deviations are listed.

### 8.1 Onboarding and profile

#### SCR-ONB-01 Language and welcome
- **Purpose:** Choose language before anything else. **Roles:** all (logged out).
- **Components:** Three large tiles with native-script labels and 🔊 (ਪੰਜਾਬੀ, हिंदी, English); short welcome video/animation (≤ 300 KB, optional, P2).
- **Actions:** Select language → SCR-ONB-02. **States:** none beyond default.
- **Accessibility:** Tiles 96 px tall; each auto-reads its label on focus.
- **Related:** VOX, AUTH.

#### SCR-ONB-02 Phone sign-in (OTP)
- **Purpose:** Register/login with mobile number. **Components:** Phone input with +91 prefix, numeric keypad, consent checkbox (not pre-ticked) linking to privacy notice in the chosen language (PRIV), "Send OTP" button; OTP screen with 6 boxes, SMS autofill (WebOTP API where supported), resend timer (30 s), "Get OTP on WhatsApp" option (WA, if enabled).
- **States:** wrong OTP (inline error, remaining attempts), rate-limited (wait time), SMS delay (show WhatsApp option after 30 s).
- **Related:** AUTH, PRIV. Note: phone-OTP auth is a Kisaan plugin capability, since opsapi lacks SMS OTP (see OPSAPI_INTEGRATION).

#### SCR-ONB-03 Role selection
- **Purpose:** Pick what the user wants to do: "ਮੈਂ ਵੇਚਣਾ ਚਾਹੁੰਦਾ ਹਾਂ (Sell)", "ਖਰੀਦਣਾ (Buy)", "ਟਰਾਂਸਪੋਰਟ (Transport)". Multi-select allowed. Group leader sign-up is a **separate entry** ("Buy for my village/group?" → SCR-GROUP-05).
- **Related:** PROF, ONB.

#### SCR-ONB-04 Basic profile wizard (per role)
- Steps (≤ 3 inputs each): name (voice-enabled) → village/town + district (GPS "use my location" with consent, or picker) → role-specific fields (seller: main crops, land size range optional; buyer: buyer type, business name, GSTIN optional; transporter: vehicle summary). Skip-able non-mandatory steps.
- **Related:** ONB.

#### SCR-ONB-05 Verification centre
- **Purpose:** Show verification level and next steps. **Components:** checklist with badges: phone ✔, identity (method per ONB, e.g. DigiLocker/offline verification — see SECURITY_AND_COMPLIANCE) , bank account (penny-drop) — required before first payout, GSTIN (buyers/businesses, optional for farmers), transporter documents (RC, licence).
- **States:** pending review (with expected time), rejected (reason + re-upload), verified.
- **Related:** ONB, Trust rules engine (human-reviewed).

#### SCR-PROF-01 Profile and settings
- Sections: personal details, roles, language, notification preferences (push / WhatsApp / SMS toggles, quiet hours), privacy (show village vs district only on store; discoverable for outreach), bank account (view masked; change requires OTP and is never done via AI), conversation history management (delete), membership status, logout, delete account request.
- **Related:** PROF, PRIV, NOTF.

### 8.2 Listing creation and management (seller)

#### SCR-LST-01 Create listing — method choice
- **Components:** three large options: 🎤 "ਬੋਲ ਕੇ (Speak)", 📷 "ਫੋਟੋ ਤੋਂ (From photo)", ✍ "ਫਾਰਮ ਭਰ ਕੇ (Fill form)". Speak and photo open the chat with the KISAAN AI listing flow; the form opens SCR-LST-02.

#### SCR-LST-02 Listing form wizard (4 steps)
| Step | Fields | Notes |
|---|---|---|
| 1. Crop | Category (icon grid of MVP categories), variety (searchable list + "other"), | Attribute schema loads per category (CAT) |
| 2. Quantity & quality | Quantity + unit (`QuantityInput`), harvest date, grade (seller-declared, optional), moisture % (optional), packaging (loose / bags + bag weight), storage | Labels show "Seller-declared" |
| 3. Price & terms | Expected price per unit, negotiable toggle, minimum order qty, available from/until, pickup location (default farm address), delivery option (buyer pickup / seller can deliver) | Mandi reference price card shown with source and as-of, labelled "reference only" |
| 4. Photos | Up to 6; camera or gallery; client-side compression to ≤ 200 KB each; AI hints shown as suggestions | EXIF stripped before upload |
- **Actions:** Save draft (auto every change), Next/Back, "Review".
- **States:** validation errors inline per field in user's language; offline → saved locally, banner shows "will publish when online" (publish still needs approval once online).
- **Related:** PRD, CAT, INV, KISAAN AI (`catalogue` tools).

#### SCR-LST-03 Review and publish
- Summary card (all fields, photos), price shown per unit and total value, **wholesale offer toggle** (→ SCR-WHL-01), 🔊 readback, `ApprovalCard` "Publish listing".
- **Success:** confirmation with share-to-WhatsApp button and link to the public product page.

#### SCR-LST-04 Photo capture helper
- Camera overlay with guidance ("ਦਾਣੇ ਨੇੜੇ ਤੋਂ ਦਿਖਾਓ — show grain close-up", "ਪੂਰਾ ਢੇਰ — whole heap"); retake; quality check (blur/dark warning).

#### SCR-LST-05 AI suggestions panel
- Shows AI-extracted hints with confidence chips ("AI suggestion — please check"), accept/reject per field. Never displays grade/moisture as AI-derived (G2 in AI architecture).

#### SCR-LST-06 My listings
- Tabs: Live · Draft · Paused · Sold out · Expired. Card shows available/reserved quantities, views/enquiries count, status chip. Actions: edit, pause/resume, mark sold out, duplicate, share. Price or quantity edits on live listings require approval.

### 8.3 Wholesale offers (seller) — SCR-WHL-01
- **Purpose:** Configure "Buy the whole lot" price and quantity tiers per listing (see WHL requirements in PRD).
- **Components:** Toggle "Wholesale offers on"; "Whole lot price" (per unit or % off); tier table (min qty, discount type %/₹ per unit, value) — add/remove rows (max 5 tiers); **offer settings** (minimum bulk qty, MOQ, max order qty, start/end date-time IST, applicable listings, buyer types: all / bulk buyers / group orders); **group buying** section (`group_eligible` toggle, group discount ₹/unit or %, minimum group qty, "honour locked price if some members don't pay" toggle); live preview from a **server quote** ("Buyer buying 120 qtl pays ₹2,300/qtl (₹2,76,000)"; "A group of 40 qtl pays ₹1,360/qtl"); stacking info per [PRICING_ENGINE](PRICING_ENGINE.md).
- **AI path:** the seller can say "20 quintal ya zyada lene par discount" → DraftCard with the tier structure; the AI asks for the discount value rather than assuming it; publishing uses the same ApprovalCard.
- **Validation:** tiers strictly ascending in min qty; discounts strictly increasing; effective price > 0; whole lot price ≤ lowest tier price (warn otherwise); tiers can't exceed available qty (warn).
- **Actions:** Save (C if listing is live → approval).
- **Related:** KIS-WHL-001…020, KIS-PRC.

### 8.4 Inventory — SCR-INV-01 / SCR-INV-02
- **SCR-INV-01 Inventory overview (inventory dashboard):** per listing: total, **available, reserved** (with link to the orders/offers/groups holding it), **sold, pending** (awaiting dispatch), **damaged, expired/unavailable**; low-stock threshold setting; stock alerts list; badges "Low stock", "Out of stock — hidden from search".
- **SCR-INV-02 Adjust stock:** quantity +/-; mandatory reason (damage/spoilage, sold offline, recount, other + note); approval card (material adjustments are COMMIT-class, also when drafted by KISAAN AI); movement history list (timestamp, type: reservation/release/deduction/adjustment, qty, reference, actor). Automatic movements are read-only.
- **States:** concurrent change conflict ("stock changed since you opened this — review") with refresh.
- **Related:** INV.

### 8.5 Search and discovery (buyer)

#### SCR-SRCH-01 Search and results
- **Components:** Search bar (text + 🎤, suggestions in all three scripts), active filter chips, sort (Relevance, Price low→high, Distance, Newest, Rating), result list of `ProductCard`s (mobile) / grid with map toggle (desktop, P2 map). Wholesale badge and "from ₹X with wholesale" line; member price tag if eligible; coupon chip "Coupon available".
- **Empty:** "No matches" + actions: widen distance, post a requirement (SCR-ENQ-01), set alert, ask KISAAN.
- **Related:** SRCH.

#### SCR-SRCH-02 Filters (bottom sheet)
- Category, variety, quantity available ≥, price range, distance/district, quality grade (seller-declared), verified sellers only, wholesale available, delivery available, harvest date. "Apply (N results)" button with live count.

#### SCR-SRCH-03 Product detail
```text
┌──────────────────────────────────┐
│ ←                         ♡  ⤴   │
│ [ photo carousel 4:3 ]  1/4      │
│ 🌾 Wheat · PBW-826               │
│ ₹2,500 / quintal   ✓ Negotiable  │  display size price
│ 100 qtl available · Moga (32 km) │
│ ┌ Wholesale (Thok rate) ───────┐ │
│ │ 50+ qtl   ₹2,450 (−2%)        │ │
│ │ 80+ qtl   ₹2,425 (−3%)        │ │
│ │ Whole lot (100 qtl) ₹2,400    │ │
│ └──────────────────────────────┘ │
│ 🏷 Coupon KANAK50: ₹50/qtl off   │  amber chip, validity date shown
│ ⭐ Member: free delivery         │  if membership benefit applies
│ Quality (seller-declared): Gr A  │
│ Harvested: Apr 2026 · Bags 50kg  │
│ Mandi ref: Moga ₹— (as of …) ℹ   │
│ ┌ Seller ──────────────────────┐ │
│ │ Gurpreet Farms ✔KYC ⭐4.7 (23)│ │
│ │ [Visit store]                 │ │
│ └──────────────────────────────┘ │
│ Qty: [ 60 ] qtl  → ₹2,450/qtl    │  live price calc via pricing quote
│ Subtotal ₹1,47,000  Coupon −3,000│
├──────────────────────────────────┤
│ [Make offer]     [Add to cart]   │  sticky actions
└──────────────────────────────────┘
```
- **Data:** listing, tiers, coupon(s) applicable, membership eligibility, seller summary, reference price.
- **Actions:** quantity entry → price breakdown recalculated server-side (PRC); Make offer → SCR-OFR-04; Add to cart → SCR-PAY-01; Ask seller (platform chat; contact details hidden); Ask KISAAN.
- **States:** listing paused/sold out (actions disabled, "Notify me" button); reserved quantity reduces available in real time; quantity > available → inline error.
- **Accessibility:** price breakdown readable by 🔊; tier table is a real table with headers.
- **Related:** SRCH, WHL, COUPON, MEMBER, PRC.

#### SCR-ENQ-01 Post a requirement (RFQ)
- Wizard: product + variety → quantity + quality → delivery location + date → budget (optional, private or visible) → review with approval card. After publishing: matched sellers count, offers received.
- **Related:** ENQ, KISAAN AI (`discovery` tools), matching service (`matching.find_matches`).

### 8.6 Public seller store — SCR-STORE-01 / SCR-STORE-02

#### SCR-STORE-01 Public store page (logged-out accessible, SEO-rendered)
- **URL:** `/store/{store-slug}` (shareable).
- **Components:** banner image, store name, verification badges, rating and review count, location (village or district only per privacy setting), service area, member since, response-time indicator (P2), description and policies (cancellation, delivery), list of live listings (product cards), reviews list, "Share" (WhatsApp/copy link), "Report store".
- **Privacy:** phone and exact address never shown; contact via platform after login.
- **States:** store paused ("This store is not taking orders right now"), no live listings (empty state with "Follow store", P2).
- **Related:** STORE.

#### SCR-STORE-02 Store management
- Edit store name, slug (once per 30 days), banner (upload with crop), description (voice dictation + AI "improve text" suggestion), policies (templates), visibility toggle, preview as public.
- **Related:** STORE.

### 8.7 Offers and negotiation

#### SCR-OFR-01 Offers inbox
- Tabs: Received · Sent · Closed. Each row: counterparty + trust badge, product, qty, offered price vs listing price (difference in ₹ and %), expiry countdown, status chip. "Compare" multi-select (2–4) → SCR-OFR-03.

#### SCR-OFR-02 Negotiation thread
```text
┌──────────────────────────────────┐
│ ← Sharma Traders ✔ ⭐4.6          │
│ Wheat PBW-826 · 100 qtl          │
├──────────────────────────────────┤
│ Your listing     ₹2,500/qtl      │
│ ▸ Offer #1 (buyer)  ₹2,420  ✖    │  timeline of offers/counters
│ ▸ Counter (you)     ₹2,480       │
│ ▸ Offer #2 (buyer)  ₹2,460  ⏳23h │  current, with expiry
│ Terms: buyer pickup · pay via    │
│ KISAAN on delivery               │
│ 💡 AI: Moga ref ₹— (as of …).     │  KISAAN AI (`offers` tools) hint, grounded, dismissable
│ Offer is ₹40 below your listing. │
├──────────────────────────────────┤
│ [Accept]  [Counter]  [Reject]    │
│ [Ask KISAAN to compare]          │
└──────────────────────────────────┘
```
- **Actions:** Accept / Reject / Counter — each opens an `ApprovalCard` (C-class); Counter opens a sheet with price + qty + message (AI draft available). Messages within the thread are moderated; phone numbers/UPI IDs masked with a warning ("Pay only through KISAAN").
- **States:** offer expired (actions disabled, "Make new offer"); listing stock changed (warning); counterparty withdrew.
- **Related:** OFR, KISAAN AI (`offers` tools), APR.

#### SCR-OFR-03 Compare offers
- Normalised table (mobile: stacked cards) with price/unit, quantity, payment terms, transport responsibility, estimated net-to-seller (only if a transport quote exists; else "unknown"), buyer trust, expiry. AI summary at the top with the explicit line "Decision is yours".

#### SCR-OFR-04 Make offer (buyer)
- Quantity, price per unit (shows listing price, wholesale price for that quantity, and difference), delivery preference, message, validity (default 24 h). Approval card to send.

### 8.8 Cart, checkout and payments

#### SCR-PAY-01 Cart
- Items grouped **by seller** (one order per seller). Per item: qty editing with live tier pricing, reservation timer once checkout starts ("Stock held for 15:00"). Coupon field per seller (one seller coupon per order, PRC). Membership benefits line.

#### SCR-PAY-02 Checkout
- Sections: delivery address/pickup, delivery method (MVP: buyer pickup / seller delivers / seller delivers with fee; P2: KISAAN transport request), price breakdown from the **server quote** in [PRICING_ENGINE](PRICING_ENGINE.md) order (base → wholesale → group discount (group orders) → negotiated → member price → coupon → delivery fee → KISAAN Plus waiver → taxes if applicable → total), quote validity timer, GSTIN for invoice (optional), payment method (handled by the Payment Aggregator: UPI intent/collect, cards, net banking), T&C/cancellation policy summary, "Pay ₹X" button.
- The **Pay button is the approval** for payment (KIS-APR-004): tapping it opens the PA flow; the AI cannot trigger it.
- **States:** price changed since cart (show diff, require re-confirmation), stock reservation expired (re-reserve or remove), coupon invalid (reason shown), PA unavailable (retry / alternative method).
- **Related:** PAY, PRC, COUPON, MEMBER, INV, KIS-REQ-001.

#### SCR-PAY-03 Payment status
- States: processing (do not close), success (order number(s), invoice link, next steps), failed (reason in plain language, retry, "money debited?" help link), pending (explains auto-reconciliation and time, creates watch; push when resolved).

#### SCR-PAY-04 Payments & earnings (seller/transporter)
- Summary: received this month, pending settlement (with expected date), on hold (dispute). List of settlements (order, gross, commission, fees, net, UTR/reference, date). Download statement (PDF/CSV). Bank account (masked) with verification status.
- **Related:** PAY, INVC.

### 8.9 Orders

#### SCR-ORD-01 Orders list
- Tabs: Active · Completed · Cancelled. Card: order no., counterparty, product, qty, total, status chip, next action ("Arrange transport", "Confirm pickup", "Rate seller").

#### SCR-ORD-02 Order detail
- Status timeline (Placed → Confirmed → Paid → Pickup scheduled → In transit → Delivered → Completed / Disputed), parties, items with price breakdown, payment status, invoice download, transport info (transporter, vehicle no., contact via platform call masking P2), delivery OTP (shown to buyer only, with 🔊), actions: cancel (policy-dependent, approval), raise issue/dispute (SCR-SUP-02), rate & review (after completion).
- **Related:** ORD, LOG, INVC, DSP, REV.

### 8.10 Logistics

#### SCR-LOG-08 Seller delivery status (MVP)
- For `SELLER_DELIVERS` / `SELLER_DELIVERS_FEE` orders: big-button steps **Dispatched** (optional vehicle no., photo) → **Delivered** (buyer's delivery OTP + photo). Offline: queued with timestamp; OTP check needs connectivity (fallback: buyer confirms in their app). Group orders: delivery to the group's delivery point, leader confirms bulk receipt.

> SCR-LOG-01…07 below are **P2** (transporter marketplace, D-106).

#### SCR-LOG-01 Arrange transport (seller/buyer)
- Pre-filled from order: pickup, drop, load (kg, packaging), date window. Options: "Request quotes from KISAAN transporters" (approval to publish), "I'll arrange my own" (enter vehicle no. optional).
#### SCR-LOG-02 Transport quotes
- Comparison cards: transporter (badges, rating), vehicle type/capacity, price, pickup window, quote expiry; AI summary; Accept → approval card.
#### SCR-LOG-03 Job feed (transporter) — see §6.3.
#### SCR-LOG-04 Submit quote
- Price (total), vehicle selection, pickup date/time window, notes; validity; submit (approval card for transporter).
#### SCR-LOG-05 My quotes — status: submitted, accepted, rejected, expired.
#### SCR-LOG-06 Trip detail (transporter)
- Steps with big buttons: "Reached pickup" → "Loaded" (photo of loaded vehicle + seller OTP or seller confirmation) → "In transit" → "Delivered" (buyer's delivery OTP + photo). Navigation link to maps (deep link). Offline: actions queued with timestamps and GPS, synced later; OTP validation requires connectivity (fallback: buyer confirms in their app).
#### SCR-LOG-07 Vehicles & service areas
- Add vehicle (type, capacity, registration no., RC photo), service districts (multi-select map/list), availability toggle.
- **Related:** LOG, KISAAN AI (`logistics` tools).

### 8.11 Membership — SCR-MEMBER-01..04

#### SCR-MEMBER-01 Membership overview (marketing + plans)
- Name is always **KISAAN Plus**. Benefits list is generated from the active benefit configuration for the user's pincode (never promises unavailable benefits, KIS-MEMBER-020) (MVP: free delivery on eligible delivery fees charged through KISAAN, member-only deals from opted-in sellers, early access (2 h) to new bulk lots and groups, priority support; shown as "coming later": priority delivery (P2, D-96) — final list per KIS-MEMBER requirements). Plans: Monthly / Yearly with price placeholders (₹—), trial info if enabled. "Who funds benefits" is not shown to users. Clear auto-renewal statement next to the price.

#### SCR-MEMBER-02 Plan checkout and T&C acceptance
```text
┌──────────────────────────────────┐
│ ← KISAAN Plus · Yearly ₹—        │
│ Renews automatically every year  │
│ on 14 Nov. Cancel anytime in     │
│ Settings → Membership.           │
│ ┌ Terms & Conditions v1.0 ─────┐ │
│ │ (scrollable, in your language)│ │
│ │ 🔊 Listen to summary          │ │
│ └──────────────────────────────┘ │
│ ☐ I have read and accept the     │  NOT pre-ticked; enabled after
│   Membership T&C (v1.0)          │  T&C viewed
│ ☐ Allow auto-renewal (UPI        │  separate explicit consent for
│   AutoPay / card mandate)        │  recurring mandate
│ [ Pay ₹— and join ]              │
└──────────────────────────────────┘
```
- T&C acceptance is **screen-only** (never by voice alone or WhatsApp free text); the acceptance record stores version, timestamp, channel and IP/device. Disabled CTA until the checkbox is ticked.
- **Related:** MEMBER, PAY, PRIV.

#### SCR-MEMBER-03 My membership
- Status (active/trial/grace/cancelled), renewal date, plan, benefits used (e.g. deliveries saved ₹), manage auto-renewal, cancel (≤ 2 taps after entering, with a single neutral retention message, no guilt-shaming), refund eligibility statement, T&C version accepted + link.
#### SCR-MEMBER-04 T&C update re-acceptance
- When a new T&C version materially changes terms: modal summarising changes, accept or cancel membership, deadline shown.

### 8.12 Group buying — SCR-GROUP-01..08

Group screens follow [WHOLESALE_AND_GROUP_BUYING](WHOLESALE_AND_GROUP_BUYING.md) and FS §25 (v0.2: **commit → seller offers → lock → pay**). Every leader surface shows the badge and the disclaimer *"Group leaders are independent KISAAN users, not KISAAN employees or representatives."*

#### SCR-GROUP-01 Groups discovery (public)
- List/map of public groups: product, area, leader name + "Verified Group Leader" badge + rating, target / committed / remaining qty (progress bar), indicative price per unit, deadline, status chip. Logged-out users can view; committing requires login.
#### SCR-GROUP-02 Group detail / commit
```text
┌──────────────────────────────────┐
│ 🌾 Moga Agriculture Buying Group │
│ Harneet Dhiman ✔ Verified Group  │
│ Leader ⭐4.8                      │
│ ⓘ Group leaders are independent  │  mandatory disclaimer (KIS-GROUP-019)
│   KISAAN users, not KISAAN staff │
│ Wheat · target 2,500 kg          │
│ ████████░░ 2,000 / 2,500 kg      │  current group demand / target
│ Remaining: 500 kg · 25 members   │
│ Indicative: ₹25.20/kg            │  labelled indicative until lock
│ Deadline: 20 Nov, 6 pm           │
│ Delivery point: Moga grain market│
│ No payment now. When the leader  │
│ locks the order you'll get your  │
│ exact price and 24 h to pay      │
│ KISAAN directly.                 │  leader never collects money
│ Your quantity: [ 100 ] kg        │
│ [ Commit 100 kg ]                │  commitment, no payment
└──────────────────────────────────┘
```
- **States:** Open (forming), Target reached, Offer selected, Locked (pay now — countdown), Seller deciding (shortfall: honour / re-offer — re-confirm / decline — refund), Confirmed, Cancelled (refund status), full, deadline passed. Member chip: Committed / Payment due / Paid / Released.
#### SCR-GROUP-03 My groups (leader)
- Cards per group with status chip, committed/target, next action (review offers, lock, confirm receipt).
#### SCR-GROUP-04 Create group wizard
- Step 1 type: **listing-bound** (pick a listing/seller) or **requirement-bound** (product + specs, sellers send offers). Step 2: group name, description, area + delivery point. Step 3: target qty, member min/max, min close qty, deadline. Step 4: delivery mode (MVP: seller delivers / leader picks up). Review → ApprovalCard "Publish group".
#### SCR-GROUP-05 Group leader application (separate flow)
- Explanation of leader responsibilities and the disclaimer → extra verification (identity, area, optional references) → leader agreement acceptance (versioned) → submit for review.
#### SCR-GROUP-06 Leader verification status
#### SCR-GROUP-07 Group dashboard (leader)
- Header: target, committed, remaining, deadline, status. Members table: **display name, committed qty, paid/pending** only — no phone, address or payment details (BR-GROUP-19); announcements to members through the in-app group channel (templated; phone numbers never shared); lock early (APR); extend deadline once; after lock: payment-window countdown with paid qty vs the seller minimum (`group_min_paid_qty`) and a warning if a seller shortfall decision is likely. Members table status values: committed / payment due / paid / released.
#### SCR-GROUP-08 Lock group order (leader)
- Summary from the server group quote: seller, total qty, tier price, group discount, group coupon (only `group_eligible`), delivery fee split rule, payment window length; per-member breakdown preview **shown to each member only on their own screen** (the leader sees totals). ApprovalCard "Lock group order and open payment window". After Confirmed: delivery point scheduling and distribution checklist (member collects with own OTP).
#### SCR-GROUP-09 Seller offers for the group (leader; members read-only after sharing)
- Comparison cards: seller (badges, rating), unit price, group discount, max qty, delivery terms, validity, effective price at current committed qty (server quote); "Share with members"; "Select offer" (ApprovalCard).
#### SCR-GROUP-10 My commitment (member)
- My quantity, my locked breakdown (goods, group discount, coupon share, KISAAN Plus price/waiver, delivery share, tax, total), pay button during the window (= approval + PA authentication), my delivery OTP, raise issue. Never shows other members' data beyond counts.
#### SCR-GROUP-11 Group requirements near me (seller)
- Open requirement-bound groups matching the seller's categories/area: product, specs, target, deadline, delivery point (area-level); "Send group offer" form (unit price, group discount, max qty, validity) → ApprovalCard. Seller never sees member identities.
- **Related:** KIS-GROUP-001…026, KIS-WHL-013, KIS-PRC-011, PAY, LOG.

### 8.13 Coupons (seller) — SCR-COUPON-01 / SCR-COUPON-02

#### SCR-COUPON-01 Coupons list
- Tabs: Active · Scheduled · Paused · Expired. Row: code, discount, validity window, usage (used/limit), status chip; quick pause/resume.
#### SCR-COUPON-02 Create/edit coupon
- Fields: code (auto-suggest, editable, uppercase A–Z0–9, 4–20 chars), discount type (% / ₹ fixed per order), value, max discount cap, min order value or qty, eligible products and categories, start and end date-time (IST), optional time-of-day window (`valid_hours`), total redemption limit, per-user limit, eligible buyer segments (combinable chips: everyone, new customers, existing customers, bulk buyers, group orders, KISAAN Plus members), flags (allow on negotiated offers; exclude when a wholesale tier applies; public/private), active/inactive toggle.
- **Example prefill:** WELCOME10 · 10 % · min ₹1,000 · max ₹500 · until 31 Dec 2026 · new customers · 1 per user.
- **AI path:** "WELCOME10 bana do, 10 percent…" → DraftCard → same ApprovalCard. Admin-disabled coupons show a locked banner "Disabled by KISAAN" with reason.
- **Preview:** "A buyer ordering 60 qtl at ₹2,450 pays ₹—", with stacking note (e.g. "Can be used with wholesale prices; one coupon per order").
- **Validation:** end > start; % ≤ 50 % and any discount ≤ 50 % of goods value (hard cap, no admin override in MVP) [DECISION D-40, KIS-SEC-161]; value > 0; can't change code after first redemption.
- **Compliance:** "Limited time" display only shows real end dates — no fake countdowns (U9).
- **Related:** KIS-COUPON-001…022, PRC.

### 8.14 Support and disputes

#### SCR-SUP-01 Help centre
- Search (text/voice), top articles per role, "Ask KISAAN", "Talk to a person", my tickets.
#### SCR-SUP-02 Raise issue / dispute
- Select order → issue type (quality mismatch, quantity short, not delivered, payment issue, other) → description (voice) + photos → desired resolution → submit. Status tracker with SLA.
- **Related:** SUP, DSP.

#### SCR-NOTF-01 Notifications
- Grouped by day; types with icons; tap → deep link; settings shortcut.

#### SCR-MKT-01 Mandi prices
- Commodity selector, my district default, table of nearby markets (min/modal/max per quintal, arrival date, source, as-of), "Reference only" note, set price alert, and a simple 7/30-day history chart of sourced prices with dates (MVP basic, retrospective only, no forecasts — D-52; analysis/insights P2).
- **Related:** MKT, KISAAN AI (`market` tools).

### 8.15 Admin

| Screen | Purpose | Key components and actions |
|---|---|---|
| SCR-ADM-01 Overview | Health at a glance | See §6.4 |
| SCR-ADM-02 Users & roles | Manage users | Search, filters (role, verification, district), user detail (profile, roles, activity, orders, flags), suspend/reinstate (reason required, audited), role assignment |
| SCR-ADM-03 Verification queue | KYC/leader/transporter review | Document viewer, verification results (name match), Trust rules engine hints labelled advisory, approve/reject with reason templates, SLA timers |
| SCR-ADM-04 Listing moderation | Policy enforcement | Flagged/new listings queue, duplicate clusters, price anomaly flags; actions: approve, request changes, remove (reason → seller notified) |
| SCR-ADM-05 Orders monitor | Operations | Filters by status/age; stuck orders (unpaid > X, undelivered > Y); order timeline; intervene (contact parties, cancel with reason) |
| SCR-ADM-06 Payments & settlements | Finance | Payment events, reconciliation mismatches, settlement batches, refunds queue (finance role), holds |
| SCR-ADM-07 Disputes | Resolution | Case view: order, evidence from both sides, chat log, timeline; decision with resolution type (refund/partial/reject), notes; escalation |
| SCR-ADM-08 Trust flags | Fraud signals | Flag list (severity, signal, subject), evidence, link to user/listing, actions: dismiss, escalate, take action (separate screen with reason) |
| SCR-ADM-09 Buyer groups & leaders | GROUP oversight | Groups list (status, value, members count), leader performance, complaints, suspend group (refunds), revoke leader badge; member PII only with reason + audit |
| SCR-ADM-02a Bulk buyers | Ops | Bulk-buyer profiles (business type, verification), requirements, activity |
| SCR-ADM-10 KISAAN Plus & T&C | MEMBER config | Plans, prices, benefits mapping, T&C versions (draft/publish with effective date), member stats |
| SCR-ADM-11 Commission & fees | Revenue config | Commission rules by category/role, fee schedules, effective dates, change history |
| SCR-ADM-12 AI monitoring | AI ops | KISAAN AI health: conversations, per-tool success/error/timeout and latency, approval acceptance and edit rates, fallback-to-screen rate, flagged conversations (prompt-injection, complaints), conversation sampler (PII-redacted, access audited), red-team/eval results |
| SCR-ADM-15 AI configuration | AI admin | Model/provider per task class, prompt versions (draft → canary % → 100 %, rollback), per-user token budget, platform daily ₹ budget, **global and per-tool kill switch**; dual control + audit (KIS-ADM-014) |
| SCR-ADM-16 AI tool catalogue | AI admin | Table of every tool: name, category, class (READ/DRAFT/COMMIT), allowed roles (code-defined), admin override (disable / narrow roles / lower rate limit — never widen), timeout, schema viewer (KIS-ADM-015) |
| SCR-ADM-17 AI tool executions & approvals | AI admin, support | Searchable log: time, user (pseudonymised; reveal with reason), tool, status, duration, linked ApprovalRequest (created/approved/rejected/expired) and conversation; PII-redacted payloads (KIS-ADM-016) |
| SCR-ADM-18 AI cost | AI admin, finance | Cost by day/model/tool/channel/role, STT/TTS minutes, cost per completed order, budget burn and alerts (KIS-ADM-017) |
| SCR-ADM-19 Coupons, discounts & wholesale offers | Moderation | All seller coupons and wholesale offers, abuse flags, **emergency disable** with reason (KIS-ADM-018) |
| SCR-ADM-20 Stores & inventory | Ops | Store list (status, suspensions), inventory anomalies (negative adjustments, large manual changes), adjustment audit trail |
| SCR-ADM-13 Reports & analytics | BI | KPI dashboards (ANL), funnels, cohort retention, category/district breakdowns, export |
| SCR-ADM-14 Configuration & audit | Platform settings | Feature flags, category/attribute management, notification templates, language strings, audit log search (actor, action, entity, time) |

Admin screens require role-based access (admin, verifier, support_agent, finance); destructive actions need a reason and are audited (SEC, ADM).

---

## 9. Interaction states (global standards)

| State | Standard |
|---|---|
| Loading | Skeletons matching layout (no full-screen spinners); for > 3 s show a text hint ("Network is slow — still loading"). |
| Empty | `EmptyState` with one sentence, one primary action and "Ask KISAAN". |
| Error (recoverable) | Inline message in the user's language explaining what happened + what to do + Retry; never raw error codes (an error ID is shown small for support). |
| Error (blocking) | Full-screen with Retry, "Go home", and "Get help". |
| Offline | `OfflineBanner`; cached data shown with "last updated" time; writes queued where safe (drafts, status updates); commit actions (payments, approvals) disabled offline. |
| Success | Toast or success screen with next best action. |
| Partial data | Show what's available; mark unknowns as "—" with an info tooltip (e.g. mandi price unavailable). |
| Permission | Explain why before requesting OS permissions (mic, camera, location, notifications). |
| Session expired | Silent refresh; otherwise re-login preserving the current draft. |

---

## 10. Accessibility

- Conformance target: **WCAG 2.2 AA** for all public and app screens (NFR).
- Screen-reader support (TalkBack primary on Android): labelled controls, logical focus order, `lang` attributes per text block so TalkBack uses the right voice.
- All critical information is available as audio (🔊) and as text.
- High-contrast mode and text size up to 200% without loss of function; layouts reflow at 320 px width.
- No time limits on forms except security-related ones (OTP, reservations, approvals) — those show a visible timer and can be extended once where safe.
- Motion reduced when `prefers-reduced-motion` is set.
- Icon-only buttons always have accessible names; key icons are paired with words in the farmer UI.
- Usability testing with low-literacy farmers in Punjab is part of the plan (TESTING_STRATEGY).

---

## 11. Low-bandwidth and offline UX

| Area | Behaviour |
|---|---|
| App shell | PWA service worker caches the shell, fonts for the active language, icons, last-viewed screens |
| Data | Stale-while-revalidate for listings, orders and prices; "as of" timestamps visible |
| Images | Responsive `srcset`; thumbnails ≤ 15 KB; "Data saver" setting loads images on tap only |
| Uploads | Client-side compression (photos ≤ 200 KB, audio Opus); resumable/chunked uploads; retry with backoff |
| Writes | Offline queue (IndexedDB) for drafts, listing edits, transporter status updates (with original timestamps); conflicts surfaced on sync |
| Commit actions | Not queued — require connectivity (prevents stale approvals) |
| Notifications | Critical updates also via SMS/WhatsApp so offline app users still get them |
| Budgets | Farmer home ≤ 300 KB total transfer on first load (excluding photos); subsequent loads ≤ 50 KB (cached shell) [ASSUMPTION A-42] |

---

## 12. Localisation rules

- All UI strings externalised (ICU MessageFormat) with pa-IN, hi-IN, en-IN; no concatenated sentences.
- Translations reviewed by native speakers from the farming community, not machine-only; agricultural terms follow a glossary shared with the AI lexicon (see AI architecture §9).
- Numbers: Indian grouping (1,00,000), ₹ prefix, units localised (ਕੁਇੰਟਲ / क्विंटल / quintal).
- Dates: `14 ਨਵੰ 2026` / `14 नव॰ 2026` / `14 Nov 2026`; times in IST with 12-hour format by default.
- Text expansion: layouts tolerate +40% string length; no truncation of prices or quantities.
- Language switch takes effect immediately without data loss; the AI follows the UI language unless the user speaks another.

---

## 13. Open decisions and assumptions raised here

| ID | Item | Type |
|---|---|---|
| D-40 | Seller coupon cap: 50% of goods value, hard cap with no admin override in MVP (KIS-SEC-161) | Decision |
| D-41 | Brand name for membership — **resolved by D-105: KISAAN Plus** | Decision (closed) |
| D-101…D-106 | v0.2 decisions affecting UX (single AI, buyer types and bulk onboarding, group flow, KISAAN Plus, transporter screens P2) | Decision |
| D-42 | Whether the buyer app shows a map view in MVP (proposal P2) | Decision |
| A-40 | Radix/shadcn-style headless components are acceptable for the design system | Assumption |
| A-41 | Subset Noto fonts per script keep each font ≤ 60 KB | Assumption |
| A-42 | Page-weight budgets in §11 are achievable with Next.js + PWA | Assumption |
| A-43 | Most target farmers use Android phones with ≥ 2 GB RAM and Chrome-based browsers (PWA-capable) | Assumption |

These items are consolidated in [RISKS_AND_ASSUMPTIONS](RISKS_AND_ASSUMPTIONS.md).
