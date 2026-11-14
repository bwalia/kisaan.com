# KISAAN — API Specification

> Status: Draft v0.2 · Last updated: 2026-11-14 · Owner: KISAAN backend lead (API) · Source of truth index: [README](README.md)

> **v0.2 changes:** a single KISAAN AI (D-101) replaces the v0.1 "AI Gateway + agents" endpoints (§3.17–§3.18 rewritten). The AI conversation API is served by the KISAAN Next.js app (D-102). There are new admin endpoints for the AI tool catalogue, executions, cost and prompt versions. Groups now have a commit → **lock** → member-pay flow, with group offers and a group coupon applied at lock (D-103). New bulk-buyer onboarding (D-104). New coupon fields and an admin emergency disable (D-105). Wholesale config gains group-discount fields. **Reconciliation pass (2026-11-14):** AI endpoints at `/api/ai/v1/*`; WhatsApp webhook at `/api/channels/whatsapp/webhook`; tool→endpoint map rewritten with the 113 exact SINGLE_AI catalogue tool names; `POST /kisaan/matching/run`; `wholesale/suggest` proxy removed; ✋ added for live listing changes, live tier changes, coupon creation, seller quotations and other COMMIT targets; tier-set endpoints; canonical group flow (forming → locked → repricing → confirmed, `/close` removed, `/lock`, confirm-and-pay, shortfall decision, group offers accept/share, handover, member removal); store visibility; preferred sellers; quote contexts + admin replay; coupon segments `ALL/NEW_CUSTOMER/EXISTING_CUSTOMER/BULK_BUYERS/GROUP_ORDERS/MEMBERS`; error codes `GROUP_FORBIDDEN_FIELD`, `COUPON_OUTSIDE_HOURS`, `QTY_ABOVE_MAX`; delivery token `seller_delivery_fee`; transporter marketplace marked P2 (D-106).

Related: [DATABASE_SCHEMA](DATABASE_SCHEMA.md) · [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md) · [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md) · [PRICING_ENGINE](PRICING_ENGINE.md) · [WHOLESALE_AND_GROUP_BUYING](WHOLESALE_AND_GROUP_BUYING.md) · [COUPON_AND_MEMBERSHIP](COUPON_AND_MEMBERSHIP.md) · [PRD](PRD.md) · [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md)

Every endpoint is tagged with its provenance (Master Prompt v2 §26, KIS-OPSAPI-011):

| Tag in tables | Meaning |
|---|---|
| **EXISTING-OPSAPI** | **Existing OpsAPI endpoint**, verified in the pinned image |
| **NEW-KISAAN** | **KISAAN-specific endpoint (OpsAPI plugin)**, i.e. a dynamic API created through OpsAPI's supported project-plugin mechanism. This is the only "dynamic API" mechanism OpsAPI offers ([OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md) §0) |
| **KISAAN-APP** | **KISAAN app endpoint (Next.js)**: route handlers in the KISAAN web app (AI conversation streaming, voice, WhatsApp inbound). Not part of OpsAPI. They hold no business logic and call NEW-KISAAN/EXISTING-OPSAPI endpoints with the user's token |
| **TO-BE-VERIFIED** | **To Be Verified**: an OpsAPI capability we expect but have not confirmed. It must be verified before implementation and never assumed |

- **EXISTING-OPSAPI**: provided by the pinned opsapi image (`bwalia/opsapi:1.0.<N>`). Paths were verified against `origin/main` @ `0544d487` (tag `1.0.339`); see [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md).
- **NEW-KISAAN**: implemented in the Kisaan repo as an opsapi plugin module (`projects/kisaan/api/*.lua`) using the plugin SDK (`helper.plugin-sdk` v1). It is auto-mounted under `/api/v2/kisaan/…`; anything under `/api/v2/kisaan/public/…` needs no login.

opsapi itself is never modified.

---

## 1. Conventions

### 1.1 Base URLs & surfaces

| Surface | Base | Notes |
|---|---|---|
| Kisaan API (authenticated) | `https://api.kisaan.in/api/v2/kisaan` `[ASSUMPTION A-14: domain]` | Plugin routes |
| Kisaan public API | `https://api.kisaan.in/api/v2/kisaan/public` | Stores, listings, groups, mandi prices for logged-out users and SEO |
| opsapi core (reused) | `https://api.kisaan.in/api/v2/...`, `/auth/...`, `/api/chat/...` | Same host. Only the endpoints listed in this document are used by KISAAN clients. |
| WebSocket (chat) | `wss://api.kisaan.in/api/chat/ws?token=<jwt>` | EXISTING-OPSAPI. Redis pub/sub fan-out. |
| KISAAN app (incl. KISAAN AI) | `https://kisaan.in/api/ai/v1/...`, `https://kisaan.in/api/channels/whatsapp/webhook` | KISAAN-APP. Next.js route handlers. The single KISAAN AI runtime runs here and calls the Kisaan API with the **user's** token. See §3.17. |
| Payment webhooks | `https://api.kisaan.in/api/v2/kisaan/public/webhooks/payments/:provider` | Signature-verified, no JWT |

**Not used by KISAAN clients:** opsapi `/api/v2/checkout`, `/api/v2/checkout-enhanced`, `/api/v2/cart/*`, `/api/v2/payments/*`, `/api/v2/webhooks/stripe`. They bypass Kisaan inventory, pricing and Indian payments. The API gateway / Cloudflare blocks them for the KISAAN host (see [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md)).

### 1.2 Headers

| Header | Required | Purpose |
|---|---|---|
| `Authorization: Bearer <jwt>` | All non-public | opsapi HS256 JWT (claims `userinfo{uuid, roles, namespace{…}}`). Server-to-server uses `Bearer opsk_…` API keys bound to the namespace. |
| `X-Namespace-Slug: kisaan` | All | Tenant resolution (opsapi middleware). Missing → `400`. |
| `Accept-Language: pa \| hi \| en` | Recommended | Localised messages and `*_i18n` field selection |
| `X-Kisaan-Active-Role: seller \| buyer \| group_leader \| transporter` | Multi-role users | Selects the acting role. Must be one the user holds, else `403 ROLE_NOT_HELD`. |
| `Idempotency-Key: <uuid v4>` | Required on all `POST` that create money-, stock- or commitment-affecting resources (marked 🔁) | Replays return the original response with `Idempotent-Replayed: true` (SDK `sdk.idempotent`). Keys live 24 h. |
| `If-Match: <version>` | Updates of versioned resources | Optimistic concurrency. Mismatch → `412 VERSION_CONFLICT`. |
| `X-Request-Id` | Optional | Echoed back; used in logs and traces |
| `X-Client: web/1.4.0 \| pwa/1.4.0 \| whatsapp \| kisaan-ai/1.0` | Recommended | Telemetry. Calls made by the KISAAN AI runtime are tagged `kisaan-ai` for audit |
| `X-AI-Tool-Execution-Id` | KISAAN AI tool calls only | Links the backend call to `kisaan_ai_tool_executions` (audit join). The backend never grants extra permission because of this header |

### 1.3 Envelope

Success (opsapi convention, `sdk.ok`):
```json
{ "success": true, "data": { }, "meta": { "request_id": "req_01JD…" } }
```
List:
```json
{ "success": true, "data": [ ], "meta": { "page": 1, "per_page": 20, "total": 134, "total_pages": 7 } }
```
Error (opsapi newer nested format):
```json
{ "success": false,
  "error": { "code": "INSUFFICIENT_STOCK", "message": "Only 32 qtl available", "context": { "available_kg": 3200.0 },
             "details": { "qty": "exceeds available quantity" } },
  "meta": { "request_id": "req_01JD…" } }
```
`message` is localised by `Accept-Language`; `code` is stable and machine-readable.

### 1.4 Pagination, filtering, sorting

- `?page=1&per_page=20` (max **100**, the SDK limit). The response includes `meta.total`, `meta.total_pages`.
- Search endpoints also support `?cursor=` (opaque) for infinite scroll on mobile. `meta.next_cursor` is returned.
- Filters use plain query params. Arrays are comma-separated (`district=LDH,MOG`). Ranges use `price_min` / `price_max`.
- `sort=field` or `sort=-field`.

### 1.5 Data formats

| Type | Format |
|---|---|
| IDs | UUID strings (`uuid` columns). Internal integer IDs are never exposed. |
| Money | Decimal **strings** in INR with 2 dp: `"2450.00"`. Rates per kg use 4 dp: `"24.5000"`. |
| Quantity | `{"value": "100", "unit": "qtl", "kg": "10000.000"}` in responses. Requests accept `qty` + `unit` (`kg`/`qtl`/`tonne`). |
| Time | ISO-8601 with offset, e.g. `2026-11-14T10:30:00+05:30` (stored UTC) |
| Localised text | `*_i18n` objects `{"pa": "...", "hi": "...", "en": "..."}`. With `?lang=pa` the server also returns a flattened `title`. |
| Phone | E.164 `+919812345678` in requests. Responses mask it (`+91 98xxxxx678`) unless the caller is the owner. |

### 1.6 Status codes & error catalogue

| HTTP | Code(s) | When |
|---|---|---|
| 400 | `BAD_REQUEST`, `NAMESPACE_REQUIRED` | Malformed JSON or missing header |
| 401 | `UNAUTHENTICATED`, `TOKEN_EXPIRED`, `OTP_INVALID`, `OTP_EXPIRED` | |
| 403 | `FORBIDDEN`, `ROLE_NOT_HELD`, `KYC_TIER_REQUIRED`, `NOT_OWNER`, `ACCOUNT_SUSPENDED`, `CHECKOUT_DISABLED_FOR_STATE`, `APMC_LICENCE_REQUIRED`, `GROUP_FORBIDDEN_FIELD`, `GROUP_CONTEXT_INVALID`, `COUPON_ADMIN_DISABLED`, `QUOTE_NOT_OWNED` | `CHECKOUT_DISABLED_FOR_STATE`/`APMC_LICENCE_REQUIRED` come from APMC gating (`[DECISION D-80]`, KIS-CMP-046). `GROUP_FORBIDDEN_FIELD`: a leader/co-leader asked for a member field outside the privacy allow-list (phone, address, payment instrument, amounts) |
| 404 | `NOT_FOUND` | Also returned by opsapi when a module is not deployed |
| 409 | `INSUFFICIENT_STOCK`, `STATE_CONFLICT`, `DUPLICATE`, `APPROVAL_REQUIRED`, `APPROVAL_INVALID`, `APPROVAL_EXPIRED`, `QUOTE_EXPIRED`, `QUOTE_INVALIDATED`, `PRICE_CHANGED_REAPPROVE`, `COUPON_EXHAUSTED`, `GROUP_FULL`, `ALREADY_MEMBER`, `GROUP_NOT_FORMING`, `GROUP_BELOW_MINIMUM`, `REPRICING_PENDING`, `TERMS_NOT_ACCEPTED`, `TERMS_VERSION_OUTDATED`, `LISTING_NOT_PURCHASABLE` | v0.1 `PRICE_CHANGED` is renamed `PRICE_CHANGED_REAPPROVE` (PRICING_ENGINE §15) |
| 412 | `VERSION_CONFLICT` | `If-Match` mismatch |
| 422 | `VALIDATION_FAILED` (with `details`), `COUPON_NOT_APPLICABLE` (with `context.reason`), `COUPON_OUTSIDE_HOURS`, `COUPON_MIN_NOT_MET`, `TIER_RULES_VIOLATED`, `PRICE_BELOW_FLOOR`, `PRICE_ABOVE_MRP`, `QTY_INVALID`, `QTY_BELOW_MOQ`, `QTY_ABOVE_MAX`, `MIN_ORDER_VALUE_NOT_MET`, `MAX_ROUNDS_REACHED` | Pricing codes are owned by [PRICING_ENGINE](PRICING_ENGINE.md) §15, coupon codes by [COUPON_AND_MEMBERSHIP](COUPON_AND_MEMBERSHIP.md). `COUPON_OUTSIDE_HOURS` is also returned as `COUPON_NOT_APPLICABLE` `context.reason = outside_valid_hours` for v0.1 clients |
| 429 | `RATE_LIMITED` | `Retry-After` header |
| 502/503 | `PROVIDER_UNAVAILABLE`, `INTEGRATION_NOT_CONFIGURED` | PA, SMS, STT etc. |
| 500 | `INTERNAL` | |

**Commit-class rule (APR):** any endpoint marked ✋ performs a commit-class action. Commit endpoints are called **only by the user's own client with the user's own token** (never by the KISAAN AI runtime's service identity). When the action was drafted by AI, the request **must** include `approval_request_id` referencing an `approved`, unexpired approval whose `params_hash` matches the request. Otherwise the response is `409 APPROVAL_REQUIRED` with a freshly created approval in `error.context.approval_request`. Direct UI calls create and approve inline: the UI shows the confirmation sheet, calls `POST /approvals` (§3.19) and then `POST /approvals/:uuid/approve`. So **every** commit is backed by an approval record (KIS-APR-006).

### 1.7 Rate limits (defaults; Cloudflare edge + opsapi/plugin limiter)

| Class | Limit |
|---|---|
| OTP request | 5 / 15 min per phone; 20 / hour per IP; 3 / min per device (KIS-AUTH-002) |
| OTP verify | 5 attempts per challenge |
| Public read | 120 / min per IP |
| Authenticated read | 600 / min per user |
| Authenticated write | 60 / min per user |
| Offers/counters | 30 / hour per buyer, 10 open offers per day for new accounts (KIS-ENQ-004) |
| AI chat | 30 messages / 10 min per user; daily token budget per user (KIS-AI-009) |
| Voice upload | 20 / 10 min per user, ≤ 60 s / 1 MB per clip |
| Webhooks inbound | Unlimited but signature-gated |
| Admin | 300 / min per admin |

### 1.8 Versioning

- The Kisaan API is versioned by path (`/api/v2/kisaan`, following the opsapi prefix). Breaking changes go to a new `api/v3` folder within the plugin, and the old version is kept for ≥ 6 months.
- Additive changes (new fields, endpoints) are non-breaking. Clients must ignore unknown fields.
- OpenAPI is published via the opsapi `/openapi.json` (plugin routes included through `sdk.doc`). A TypeScript client is generated in the Kisaan repo (the existing `@opsapi/client` is used for core routes).

### 1.9 Permissions model

RBAC permissions follow opsapi's form **`<machine_name>.<action>`** (standard actions `create`, `read`, `update`, `delete`, `manage`), e.g. `kisaan_listings.create`. The canonical module list is in [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md) §7.3:

`kisaan_profiles`, `kisaan_verification`, `kisaan_stores`, `kisaan_listings`, `kisaan_inventory`, `kisaan_pricing`, `kisaan_coupons`, `kisaan_requirements`, `kisaan_offers`, `kisaan_orders`, `kisaan_payments`, `kisaan_finance`, `kisaan_logistics`, `kisaan_groups`, `kisaan_membership`, `kisaan_legal`, `kisaan_reviews`, `kisaan_support`, `kisaan_disputes`, `kisaan_market`, `kisaan_ai`, `kisaan_approvals`, `kisaan_admin`.

Finer-grained operations (refund, settlement release, moderation, KYC decision) are expressed as `manage` on the owning module plus an in-code role check (e.g. `kisaan_finance.manage` + role `finance` + dual control). Whether opsapi RBAC accepts custom action names is `[UNVERIFIED]`, so the spec does not rely on them. The "Permission" column in endpoint tables gives the **ownership/role rule** (e.g. `owner`, `party`, `principal`); the RBAC permission is implied by the module of the section. Ownership checks are always enforced **in addition** to RBAC.

Role → permission summary (full matrix in [SECURITY_AND_COMPLIANCE](SECURITY_AND_COMPLIANCE.md) §2.2):

| Role | Key grants |
|---|---|
| seller | `kisaan_listings.*`, `kisaan_inventory.*`, `kisaan_pricing.*`, `kisaan_stores.update`, `kisaan_coupons.*`, `kisaan_offers.create/read/update` (respond, counter), `kisaan_orders.read/update` (own), `kisaan_logistics.create` (transport request), `kisaan_reviews.create` |
| buyer | `kisaan_requirements.*`, `kisaan_offers.create/read/update`, `kisaan_orders.create/read` (own), `kisaan_payments.create`, `kisaan_membership.create/read/update` (own), `kisaan_groups.read/update` (join/commit), `kisaan_reviews.create` |
| group_leader | buyer grants + `kisaan_groups.create/manage` (own groups) |
| transporter | `kisaan_logistics.read/update` (quote, shipment status), `kisaan_profiles.update` (vehicles) |
| all authenticated | `kisaan_profiles.read/update` (self), `kisaan_approvals.read/update` (decide **own** approvals only), `kisaan_legal.create` (own acceptances/consents), `kisaan_support.create`, `kisaan_disputes.create` (order party), `kisaan_market.read` |
| KISAAN AI runtime service identity | `kisaan_approvals.create`, `kisaan_ai.create` (telemetry), `kisaan_ai.read` (tool catalogue config) and the narrow WhatsApp delivery-status ingest only. All READ/DRAFT tools run with the **user's** token. It **never** approves or executes a commit (KIS-OPSAPI-012) |
| support_agent | `kisaan_support.manage`, `kisaan_disputes.read/update`, read-only orders/users (masked) |
| verifier | `kisaan_verification.manage`, `kisaan_listings.manage` (moderation), `kisaan_reviews.manage` |
| finance | `kisaan_finance.manage`, `kisaan_payments.read` (dual control on refunds/releases ≥ ₹50,000) |
| admin | `kisaan_admin.manage` + read on all modules; role grants need dual control |

---

## 2. Authentication (module 1)

opsapi has **no phone-OTP login** (email/password + email OTP only), so KISAAN adds phone-OTP auth as NEW-KISAAN endpoints. On success they issue an opsapi-compatible session: JWT (HS256, same `JWT_SECRET_KEY`, same `userinfo` claim shape) plus a refresh token. `[UNVERIFIED]` Whether the plugin SDK can call the opsapi JWT helper (`helper/jwt-helper.lua`) directly needs confirming in the Phase 1 spike. Fallback: the plugin signs a JWT with identical claims using the shared secret injected as `PLUGIN_KISAAN_*` env (see [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md) §Auth gap).

| Method | Path | Tag | Purpose | Auth | Perm | Rate limit | Idem |
|---|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/public/auth/otp/request` | NEW-KISAAN | Send OTP by SMS (DLT template) or WhatsApp | None | — | OTP class | key optional |
| POST | `/api/v2/kisaan/public/auth/otp/verify` | NEW-KISAAN | Verify OTP; login or register; returns tokens | None | — | 5/challenge | — |
| POST | `/api/v2/kisaan/auth/refresh` | NEW-KISAAN | Rotate refresh token (family rotation, reuse detection) | Refresh token | — | 30/min | — |
| POST | `/api/v2/kisaan/auth/logout` | NEW-KISAAN | Revoke current session | JWT | — | — | — |
| GET | `/api/v2/kisaan/auth/sessions` | NEW-KISAAN | List my sessions/devices (KIS-AUTH-008, P2) | JWT | self | read | — |
| DELETE | `/api/v2/kisaan/auth/sessions/:uuid` | NEW-KISAAN | Revoke a session | JWT | self | write | — |
| POST | `/auth/login`, `/auth/2fa/verify` | EXISTING-OPSAPI | Email + password with email-OTP 2FA, **admins & business buyers** (KIS-AUTH-004) | None | — | opsapi | — |
| GET | `/auth/google`, `/auth/google/callback` | EXISTING-OPSAPI | Google SSO for business buyers (P2) | None | — | — | — |
| POST | `/auth/refresh` | EXISTING-OPSAPI | Refresh for email/SSO sessions | Cookie/body | — | — | — |
| GET | `/auth/me` | EXISTING-OPSAPI | Raw identity (Kisaan clients use `/kisaan/me`) | JWT | — | — | — |

**Validation:** `phone` E.164 Indian mobile `^\+91[6-9]\d{9}$`; `purpose ∈ {login}` (register is implicit); `channel ∈ {sms, whatsapp}`; `otp` 6 digits; `device_id` ≤ 64 chars. Unknown phone + valid OTP → creates the user (opsapi `users` via SDK) + `kisaan_user_identities`, with `is_new_user: true`. Registration requires `consents` (KIS-AUTH-007) on the verify call when `is_new_user`.

**Errors:** `OTP_INVALID` (401, attempts left in context), `OTP_EXPIRED`, `RATE_LIMITED`, `ACCOUNT_SUSPENDED`, `PROVIDER_UNAVAILABLE` (SMS gateway; client offers the WhatsApp channel).

#### Example: request OTP
```http
POST /api/v2/kisaan/public/auth/otp/request
X-Namespace-Slug: kisaan
Accept-Language: pa
Content-Type: application/json

{ "phone": "+919812345678", "channel": "sms", "device_id": "pwa-7f3c9a" }
```
```json
{ "success": true,
  "data": { "challenge_id": "6f1d0c1e-4b8e-4f0a-9d4c-2f3b8a7c1e55", "expires_in_seconds": 300,
            "resend_after_seconds": 30, "channel": "sms", "phone_masked": "+91 98xxxxx678" },
  "meta": { "request_id": "req_01JD8M2Y" } }
```

#### Example: verify OTP (new user)
```http
POST /api/v2/kisaan/public/auth/otp/verify
{ "challenge_id": "6f1d0c1e-4b8e-4f0a-9d4c-2f3b8a7c1e55", "otp": "482913", "device_id": "pwa-7f3c9a",
  "preferred_language": "pa",
  "consents": [
    { "purpose": "account_service", "notice_document": "privacy_notice", "notice_version": "1.0.0", "granted": true },
    { "purpose": "whatsapp_messages", "notice_document": "privacy_notice", "notice_version": "1.0.0", "granted": true },
    { "purpose": "marketing", "notice_document": "privacy_notice", "notice_version": "1.0.0", "granted": false } ],
  "accepted_terms": { "doc_code": "platform_terms", "version": "1.0.0", "language": "pa" } }
```
```json
{ "success": true,
  "data": {
    "is_new_user": true,
    "access_token": "eyJhbGciOiJIUzI1NiJ9…", "access_token_expires_in": 900,
    "refresh_token": "rt_9c2e…", "refresh_token_expires_in": 2592000,
    "user": { "uuid": "0b8f6a1c-2d3e-4f5a-8b9c-0d1e2f3a4b5c", "roles": [], "preferred_language": "pa",
              "phone_masked": "+91 98xxxxx678", "onboarding_next_step": "choose_role" } },
  "meta": { "request_id": "req_01JD8M3A" } }
```

---

## 3. Endpoints by module

### 3.1 Users (module 2)

| Method | Path | Tag | Purpose | Auth | Perm |
|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/me` | NEW-KISAAN | Aggregated profile: identity, roles + KYC tiers, profiles, badges, membership, unread counts | JWT | self |
| PATCH | `/api/v2/kisaan/me` | NEW-KISAAN | Update name, language, script, contact preferences | JWT | self |
| POST | `/api/v2/kisaan/me/roles` | NEW-KISAAN | Add a role (`seller`, `buyer`, `transporter`). `group_leader` uses §3.23. | JWT | self |
| PUT | `/api/v2/kisaan/me/active-role` | NEW-KISAAN | Switch active role (also sets the AI context) | JWT | self |
| POST | `/api/v2/kisaan/me/data-requests` | NEW-KISAAN | DPDP access/correction/erasure/grievance (KIS-AUTH-009) | JWT | self |
| GET/PUT | `/api/v2/kisaan/me/consents` | NEW-KISAAN | View/withdraw consents | JWT | self |
| GET | `/api/v2/users/:id` | EXISTING-OPSAPI | Admin raw user record (admin console only) | JWT | `users.read` |
| GET | `/api/v2/users/search` | EXISTING-OPSAPI | Admin user search | JWT | `users.read` |

Validation: `preferred_language ∈ {pa,hi,en}`; adding `seller` requires phone verified; `transporter` creates an opsapi `delivery_partners` record via the opsapi register flow (§3.13).

### 3.2 Profiles (module 3)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| GET/PUT | `/api/v2/kisaan/me/seller-profile` | NEW-KISAAN | Farmer/seller profile (KIS-PROF-002) | JWT | seller | — |
| GET/PUT | `/api/v2/kisaan/me/buyer-profile` | NEW-KISAAN | Buyer profile (buyer_type, GSTIN…) | JWT | buyer | — |
| GET/PUT | `/api/v2/kisaan/me/transporter-profile` | NEW-KISAAN | Transporter extension | JWT | transporter | — |
| GET/POST | `/api/v2/kisaan/me/addresses` | NEW-KISAAN | List/create addresses (geo-pin) | JWT | self | 🔁 |
| PUT/DELETE | `/api/v2/kisaan/me/addresses/:uuid` | NEW-KISAAN | Update/soft-delete | JWT | owner | — |
| GET/POST | `/api/v2/kisaan/me/payout-accounts` | NEW-KISAAN | Bank/UPI for payouts; triggers penny-drop + PA linked-account creation | JWT | seller, transporter | 🔁 |
| POST | `/api/v2/kisaan/me/verifications` | NEW-KISAAN | Start a verification (`identity_digilocker`, `pan`, `gstin`, `driving_licence`, `vehicle_rc`, `fssai`, `organic_certificate`) | JWT | self | 🔁 |
| POST | `/api/v2/kisaan/me/verifications/:uuid/documents` | NEW-KISAAN | Upload KYC document (multipart ≤ 10 MB, jpeg/png/pdf). Stored in the private KYC bucket. | JWT | owner | 🔁 |
| GET | `/api/v2/kisaan/me/verifications` | NEW-KISAAN | Status list and current KYC tier | JWT | self | — |
| GET | `/api/v2/kisaan/public/profiles/:user_uuid` | NEW-KISAAN | Public reputation card (name, district, badges, rating) for privacy-filtered display | None | — | — |

Buyer profile also carries optional `apmc_licence_no`, `apmc_licence_state` (read-only `apmc_licence_verified_at`). Submitting a licence starts a verification with `check_type = apmc_licence`. It is required only where `kisaan_category_state_rules.requires_buyer_apmc_licence = true` (KIS-CMP-046).

Validation: GSTIN regex `^[0-9]{2}[A-Z0-9]{10}[0-9A-Z]{3}$`; PAN `^[A-Z]{5}[0-9]{4}[A-Z]$`; IFSC `^[A-Z]{4}0[A-Z0-9]{6}$`; pincode `^[1-9][0-9]{5}$`. **Aadhaar numbers are rejected** if posted in any field (pattern detection → `422 AADHAAR_NOT_ACCEPTED`, KIS-ONB-003).

### 3.3 Products — taxonomy & attributes (module 4)

| Method | Path | Tag | Purpose | Auth | Perm |
|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/public/categories` | NEW-KISAAN | Category tree (active only unless admin), localised | None | — |
| GET | `/api/v2/kisaan/public/categories/:code/attributes` | NEW-KISAAN | Attribute schema (drives dynamic forms, filters and AI slot filling) | None | — |
| GET | `/api/v2/kisaan/public/commodities?category=` | NEW-KISAAN | Commodities and varieties with synonyms | None | — |
| POST/PUT | `/api/v2/kisaan/admin/categories[/:uuid]` | NEW-KISAAN | Manage taxonomy (KIS-ADM-007) | JWT | `kisaan_admin.manage` |
| POST/PUT | `/api/v2/kisaan/admin/categories/:uuid/attributes[/:key]` | NEW-KISAAN | Manage attribute schema | JWT | admin |
| GET | `/api/v2/categories` | EXISTING-OPSAPI | Store-scoped categories, **not used** for the marketplace taxonomy | — | — |

### 3.4 Listings (module 5)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/listings` | NEW-KISAAN | Create a listing **draft** (also creates the backing opsapi `storeproducts` row and inventory record) | JWT | `kisaan_listings.create` (seller, T0+) | 🔁 |
| GET | `/api/v2/kisaan/listings?mine=true&status=` | NEW-KISAAN | My listings | JWT | seller | — |
| GET | `/api/v2/kisaan/listings/:uuid` | NEW-KISAAN | Detail (owner view incl. drafts) | JWT | owner/admin | — |
| PATCH | `/api/v2/kisaan/listings/:uuid` ✋ (active listing, if AI-drafted) | NEW-KISAAN | Update fields. Drafts: free edits. **Active** listing: price, quantity, MOQ/max order qty, delivery terms or public text changes drafted by KISAAN AI need an approved `listing.change` approval (`catalogue.propose_listing_change`); UI edits create the approval inline. Price/qty changes with open offers notify buyers (KIS-PRD-007). | JWT | owner, `If-Match` | — |
| POST | `/api/v2/kisaan/listings/:uuid/publish` ✋ | NEW-KISAAN | Publish (moderation checks; T1+ required) | JWT | owner | 🔁 |
| POST | `/api/v2/kisaan/listings/:uuid/pause` · `/resume` · `/close` · `/duplicate` | NEW-KISAAN | Lifecycle | JWT | owner | 🔁 |
| POST | `/api/v2/kisaan/listings/:uuid/media` | NEW-KISAAN | Upload photo (multipart, ≤ 8 MB, ≤ 10 per listing). EXIF strip, scan, resize. | JWT | owner | 🔁 |
| DELETE / PUT | `/api/v2/kisaan/listings/:uuid/media/:media_uuid` · `/media/order` | NEW-KISAAN | Remove/reorder | JWT | owner | — |
| GET | `/api/v2/kisaan/listings/:uuid/duplicate-check` | NEW-KISAAN | v0.2: similar listings of the same seller (commodity, variety, qty, location) — same check the publish step runs (KIS-PRD-022); used by `catalogue.check_duplicates` | JWT | owner | — |
| POST | `/api/v2/kisaan/listings/:uuid/translate` | NEW-KISAAN | Regenerate translations (KIS-PRD-004) | JWT | owner | — |
| GET | `/api/v2/kisaan/public/listings/:uuid` | NEW-KISAAN | Public product detail incl. tiers, public coupons, groups, seller card, mandi reference, **price breakdown for `?qty=&unit=`** | None (optional JWT for member/personal price) | — | — |

**Create listing — request schema**

| Field | Type | Req | Validation |
|---|---|---|---|
| category_code | string | ✔ | Active category |
| commodity_code | string | ✔ | Belongs to category |
| variety_code | string | | Belongs to commodity |
| title | string | | 5–120 chars; auto-generated if absent |
| description | string | | ≤ 2,000 chars |
| source_language | enum pa/hi/en | ✔ | |
| quantity | `{value, unit}` | ✔ | value > 0; unit ∈ kg/qtl/tonne |
| moq | `{value, unit}` | ✔ | ≤ quantity |
| max_order_qty | `{value, unit}` | | v0.2: ≥ moq; above it → `422 QTY_ABOVE_MAX` (KIS-PRC-012) |
| price | `{amount, per_unit}` | ✔ | amount > 0; per_unit ∈ kg/qtl/tonne |
| price_floor | `{amount, per_unit}` | | ≤ price |
| price_negotiable | bool | | default true |
| attributes | object | ✔ (required keys per schema) | Typed per `category_attributes` (e.g. `moisture_pct` 0–25) |
| seller_declared_grade | string | | Enum per category |
| harvest_date | date | | ≤ today + 60 d |
| available_from / expires_at | date / datetime | | expires ≤ +90 d |
| pickup_address_uuid | uuid | ✔ | Owner's address with purpose pickup/farm |
| delivery_options | array | ✔ | ⊆ buyer_pickup, seller_delivery, seller_delivery_fee, platform_logistics (FS terms `BUYER_PICKUP`, `SELLER_DELIVERS`, `SELLER_DELIVERS_FEE`, `PLATFORM_LOGISTICS`). `platform_logistics` → `422 VALIDATION_FAILED` in MVP (P2, D-106) |
| seller_delivery_fee | `{amount}` | if `seller_delivery_fee` | v0.2: ₹ ≥ 0 per order (per drop point for groups); KISAAN Plus free-delivery waiver applies (D-106) |
| mrp | `{amount, per}` | | v0.2, packaged goods only: price incl. GST must be ≤ MRP → else `422 PRICE_ABOVE_MRP` `[LEGAL REVIEW]` |
| group_buy | object | | v0.2 listing-level group defaults `{enabled, discount_type, value, min_group_qty}` (D-103); tier sets can override (§3.21) |
| wholesale | object | | See §3.21 |
| member_price | `{amount, per_unit}` | | < price |
| created_via | enum | | form/chat/voice/photo/whatsapp/assisted |
| ai_conversation_uuid | uuid | | When drafted by AI |

**Errors:** `422 VALIDATION_FAILED` (attribute schema), `422 PROHIBITED_ITEM` (KIS-PRD-008), `403 KYC_TIER_REQUIRED` (publish), `422 TIER_RULES_VIOLATED`, `409 DUPLICATE_LISTING_SUSPECTED` (publish, with similar listing refs; the seller can confirm it is not a duplicate), `409 APPROVAL_REQUIRED` (publish via AI).

#### Example: create listing with wholesale tiers
```http
POST /api/v2/kisaan/listings
Authorization: Bearer eyJ…
X-Namespace-Slug: kisaan
X-Kisaan-Active-Role: seller
Idempotency-Key: 3b6e2f0a-8a1c-4a55-9f20-6d0c2b1e7a90
Accept-Language: pa

{
  "category_code": "cereals.wheat",
  "commodity_code": "wheat",
  "variety_code": "hd_3086",
  "source_language": "pa",
  "title": "ਕਣਕ HD-3086, ਸਾਫ਼ ਤੇ ਸੁੱਕੀ, ਮੋਗਾ",
  "quantity": { "value": "100", "unit": "qtl" },
  "moq": { "value": "10", "unit": "qtl" },
  "price": { "amount": "2450.00", "per_unit": "qtl" },
  "price_floor": { "amount": "2300.00", "per_unit": "qtl" },
  "price_negotiable": true,
  "attributes": { "moisture_pct": 11.5, "foreign_matter_pct": 0.5, "packaging": "50kg_pp_bags", "storage": "covered_godown" },
  "seller_declared_grade": "FAQ",
  "harvest_date": "2026-04-18",
  "expires_at": "2026-12-14T23:59:59+05:30",
  "pickup_address_uuid": "a7e1c9d2-1f4b-4c3e-9a8d-5b6c7d8e9f01",
  "delivery_options": ["buyer_pickup", "seller_delivery_fee"],
  "seller_delivery_fee": { "amount": 800.00 },
  "wholesale": {
    "enabled": true,
    "tiers": [
      { "min_qty": { "value": "50", "unit": "qtl" }, "discount_type": "percentage", "value": "5" },
      { "min_qty": { "value": "80", "unit": "qtl" }, "discount_type": "percentage", "value": "8" } ],
    "whole_lot": { "enabled": true, "price": { "amount": "2230.00", "per_unit": "qtl" } } },
  "created_via": "voice",
  "ai_conversation_uuid": "c0ffee00-1234-4abc-8def-001122334455"
}
```
```json
{ "success": true,
  "data": {
    "uuid": "5d1f7c2a-9e3b-4d8a-b6c1-2e3f4a5b6c7d",
    "status": "draft",
    "store": { "uuid": "e2b4…", "slug": "gurpreet-farms-moga" },
    "title_i18n": { "pa": "ਕਣਕ HD-3086, ਸਾਫ਼ ਤੇ ਸੁੱਕੀ, ਮੋਗਾ", "hi": "गेहूं HD-3086, साफ़ और सूखा, मोगा", "en": "Wheat HD-3086, clean & dry, Moga", "source": "pa" },
    "quantity": { "value": "100", "unit": "qtl", "kg": "10000.000" },
    "inventory": { "on_hand_kg": "10000.000", "reserved_kg": "0.000", "available_kg": "10000.000" },
    "price": { "per_qtl": "2450.00", "per_kg": "24.5000" },
    "wholesale": {
      "enabled": true,
      "tiers": [
        { "tier_no": 1, "min_qty": { "value": "50", "unit": "qtl", "kg": "5000.000" }, "discount_type": "percentage", "value": "5", "effective_price_per_qtl": "2327.50" },
        { "tier_no": 2, "min_qty": { "value": "80", "unit": "qtl", "kg": "8000.000" }, "discount_type": "percentage", "value": "8", "effective_price_per_qtl": "2254.00" } ],
      "whole_lot": { "enabled": true, "price_per_qtl": "2230.00", "requires_qty_kg": "10000.000" } },
    "publish_readiness": { "ready": false, "missing": ["photos_min_1"], "kyc_tier": "T1", "warnings": [] },
    "version": 0 },
  "meta": { "request_id": "req_01JD8N0B" } }
```

### 3.5 Search (module 6)

| Method | Path | Tag | Purpose | Auth | Rate |
|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/public/search/listings` | NEW-KISAAN | Keyword + filters + geo; only Active with available ≥ MOQ (KIS-SRCH-004) | Optional JWT (personalised effective price) | public read |
| GET | `/api/v2/kisaan/public/search/suggest?q=` | NEW-KISAAN | Autocomplete across scripts and romanised synonyms | None | 300/min/IP |
| GET | `/api/v2/kisaan/public/search/sellers` | NEW-KISAAN | Find sellers/stores by commodity and district | None | public |
| GET | `/api/v2/kisaan/public/search/groups` | NEW-KISAAN | Find open buying groups (KIS-GROUP-016) | None | public |
| GET/POST/DELETE | `/api/v2/kisaan/saved-searches[/:uuid]` | NEW-KISAAN | Saved searches with alerts (KIS-SRCH-006) | JWT | write |

**Query params (listings):** `q`, `category`, `commodity`, `variety`, `district` (LGD codes, CSV), `lat`,`lng`,`radius_km` (≤ 300), `price_min`, `price_max` (per `price_unit`), `price_unit=qtl`, `qty_min` + `qty_unit`, `grade`, `attr.<key>=` / `attr.<key>_min=` / `attr.<key>_max=` (only `filterable` attributes), `verified_only=true`, `delivery_option=seller_delivery` (`platform_logistics` P2), `wholesale=true`, `organic=true`, `for_qty` + `for_unit` (compute effective price for this quantity, KIS-SRCH-011), v0.2 ([MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md) §4.2): `qty` (alias of `qty_min`), `moq_max`, `group_eligible=true`, `has_open_group=true`, `plus_price=true`, `plus_free_delivery=true`, `delivery` (CSV of delivery tokens), `rating_min`; ranking ignores membership and coupons and uses quantity-aware price from pricing stage 2 only (D-138), `sort ∈ relevance | price | -price | distance | -rating | -freshness`, `page`, `per_page`, `cursor`.

#### Example: search
```http
GET /api/v2/kisaan/public/search/listings?q=kanak&district=LDH,MOG&radius_km=80&lat=30.9010&lng=75.8573&qty_min=50&qty_unit=qtl&for_qty=60&for_unit=qtl&sort=price&per_page=2
X-Namespace-Slug: kisaan
Accept-Language: hi
```
```json
{ "success": true,
  "data": [
    { "uuid": "5d1f7c2a-9e3b-4d8a-b6c1-2e3f4a5b6c7d",
      "title": "गेहूं HD-3086, साफ़ और सूखा, मोगा",
      "commodity": { "code": "wheat", "name": "गेहूं" }, "variety": { "code": "hd_3086", "name": "HD-3086" },
      "seller": { "store_slug": "gurpreet-farms-moga", "display_name": "Gurpreet S.", "badges": ["phone_verified", "kyc_verified"], "rating": { "avg": "4.6", "count": 23 } },
      "district": { "code": "MOG", "name": "मोगा" }, "distance_km": "54.2",
      "available": { "value": "100", "unit": "qtl", "kg": "10000.000" }, "moq": { "value": "10", "unit": "qtl" },
      "list_price_per_qtl": "2450.00",
      "effective_price_for_qty": { "qty": { "value": "60", "unit": "qtl" }, "price_per_qtl": "2327.50", "applied": "wholesale_tier_1", "line_total": "139650.00" },
      "wholesale_badge": "थोक: 8% तक छूट", "whole_lot_available": true,
      "attributes_summary": { "moisture_pct": 11.5, "grade": "FAQ (विक्रेता द्वारा घोषित)" },
      "cover_image": "https://cdn.kisaan.in/l/5d1f…/cover_480.webp",
      "mandi_reference": { "market": "Moga", "modal_price_per_qtl": "2425.00", "date": "2026-11-12", "source": "Agmarknet via data.gov.in", "stale": false },
      "open_group": null },
    { "uuid": "8a2b…", "title": "गेहूं PBW-826, जगराओं", "…": "…" } ],
  "meta": { "page": 1, "per_page": 2, "total": 17, "total_pages": 9, "next_cursor": "eyJwIjoyfQ", "query_interpreted": { "commodity": "wheat", "from_synonym": "kanak" } } }
```

### 3.6 Inventory (module 7) — 2A.5

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/listings/:uuid/inventory` | NEW-KISAAN | On hand / reserved (pending) / available / sold / damaged / unavailable / returned (P2) / threshold | JWT | owner | — |
| POST | `/api/v2/kisaan/listings/:uuid/inventory/adjustments` ✋ (if AI-drafted, or material per D-130) | NEW-KISAAN | Manual add/remove with reason (KIS-INV-006, KIS-INV-010). Material adjustments (≥ 20 % of on hand or ≥ 1,000 kg, D-130) always need an approval (`inventory.adjust`), also from the UI | JWT | owner | 🔁 |
| GET | `/api/v2/kisaan/listings/:uuid/inventory/movements` | NEW-KISAAN | Ledger (KIS-INV-009) | JWT | owner/admin | — |
| GET | `/api/v2/kisaan/listings/:uuid/inventory/reservations?status=held` | NEW-KISAAN | Active holds with source & expiry | JWT | owner | — |
| POST | `/api/v2/kisaan/inventory/reservations/:uuid/extend` | NEW-KISAAN | v0.2: one-time TTL extension of an offer/group hold, seller-approved ([SELLER_STORE_AND_INVENTORY](SELLER_STORE_AND_INVENTORY.md) §11.2). `409 STATE_CONFLICT` if already extended or not `held` | JWT | owner (seller) | 🔁 |
| PUT | `/api/v2/kisaan/listings/:uuid/inventory/threshold` | NEW-KISAAN | Low-stock threshold (KIS-INV-007) | JWT | owner | — |
| GET | `/api/v2/kisaan/inventory/summary` | NEW-KISAAN | Seller-wide stock dashboard, low-stock list | JWT | seller | — |

Reservations are **not** created by a public endpoint. They are side effects of offer acceptance (§3.9), checkout (§3.10) and group lock (§3.22) (KIS-INV-002).

Adjustment request: `{ "type": "add" | "remove" | "mark_damaged" | "mark_unavailable" | "restore_unavailable" | "quarantine" | "unquarantine" | "write_off", "qty": {"value": "20", "unit": "qtl"}, "reason_code": "harvest_added" | "spoilage" | "sold_offline" | "correction" | "order_cancelled_restock" | "quality_downgrade" | "other", "reason_text": "…", "approval_request_id": "…?" }`. Errors: `409 INSUFFICIENT_STOCK` (remove/mark > available; reserved stock cannot be removed or marked), `422 REASON_REQUIRED`. `mark_damaged`/`mark_unavailable` move stock out of `on_hand` into the damaged/unavailable buckets (v0.2; [SELLER_STORE_AND_INVENTORY](SELLER_STORE_AND_INVENTORY.md)).

### 3.7 Buyer requirements / RFQ (module 8)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/requirements` | NEW-KISAAN | Create RFQ draft. v0.2 `owner_type: buyer \| group` (`group` only by the group's leader, with `group_uuid`; requirement-bound groups are MVP, D-133). Open-RFQ limit 3 (normal) / 20 (verified bulk buyer) → `409 STATE_CONFLICT` (D-135) | JWT | buyer / leader | 🔁 |
| POST | `/api/v2/kisaan/requirements/:uuid/publish` ✋ | NEW-KISAAN | Open to matching sellers (the deterministic matching service notifies them) | JWT | owner | 🔁 |
| GET | `/api/v2/kisaan/requirements?mine=true` | NEW-KISAAN | My RFQs | JWT | buyer | — |
| GET | `/api/v2/kisaan/requirements/feed` | NEW-KISAAN | Sellers: open RFQs matching my districts/commodities (buyer identity masked, KIS-ENQ-006) | JWT | seller | — |
| GET | `/api/v2/kisaan/requirements/:uuid` | NEW-KISAAN | Detail + quotations (owner) / own quotation (seller) | JWT | party | — |
| POST | `/api/v2/kisaan/requirements/:uuid/close` | NEW-KISAAN | Close/cancel | JWT | owner | 🔁 |
| POST | `/api/v2/kisaan/requirements/:uuid/quotations` ✋ | NEW-KISAAN | Seller quotation (binding until `valid_until`) → opens a negotiation (`context_type = rfq_quotation`). Approval `quotation.send` (`offers.propose_send_quotation`) | JWT | seller | 🔁 |
| GET | `/api/v2/kisaan/requirements/:uuid/compare` | NEW-KISAAN | Multi-seller comparison (KIS-OFR-004): landed price, distance, rating, delivery date | JWT | owner | — |
| POST | `/api/v2/kisaan/listings/:uuid/enquiries` | NEW-KISAAN | Start an enquiry thread (creates an opsapi chat channel) | JWT | buyer | 🔁 |
| GET/POST | `/api/chat/channels/:channel_uuid/messages` | EXISTING-OPSAPI | Enquiry messages (opsapi chat) | JWT | channel member | — |

### 3.8 Offers (module 9)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/listings/:uuid/offers` ✋ (if AI-drafted) | NEW-KISAAN | Buyer makes an offer (supersedes any open one, KIS-OFR-006) | JWT | buyer | 🔁 |
| GET | `/api/v2/kisaan/offers?role=buyer\|seller&status=` | NEW-KISAAN | My offers (sent/received) | JWT | party | — |
| GET | `/api/v2/kisaan/listings/:uuid/offers/compare` | NEW-KISAAN | Seller's multi-buyer comparison with **net realisation** (KIS-OFR-003) | JWT | owner | — |
| POST | `/api/v2/kisaan/offers/:uuid/withdraw` ✋ (if AI-drafted) | NEW-KISAAN | Offering party withdraws before decision (`offer.withdraw`) | JWT | party | 🔁 |

Body v0.2: `offer_kind: listing_terms | custom_price` (`listing_terms` = buy at the published tiers, engine-priced; `custom_price` = negotiated price replacing pricing stages 1–3 and 5, D-103), `delivery_terms` ⊆ delivery tokens (`seller_delivery_fee` requires `delivery_fee`). Validation: qty ≥ MOQ, ≤ max order qty (`422 QTY_ABOVE_MAX`) and ≤ available; price > 0; **P2 (not enabled in MVP, D-06):** if `price_per_kg < auto_reject_below` the offer is created as `auto_rejected` with a polite templated reply (KIS-OFR-015: auto-reject or floor reply only, never auto-accept); `valid_until` between 1 h and 72 h (default 24 h, 6 h perishables, D-05). Errors: `409 STATE_CONFLICT` (listing not active), `409 INSUFFICIENT_STOCK`, `429 RATE_LIMITED`, `403 KYC_TIER_REQUIRED` (offer value above tier limit).

#### Example: place offer
```http
POST /api/v2/kisaan/listings/5d1f7c2a-9e3b-4d8a-b6c1-2e3f4a5b6c7d/offers
Authorization: Bearer eyJ…   X-Kisaan-Active-Role: buyer
Idempotency-Key: 0e5c…

{ "qty": { "value": "60", "unit": "qtl" },
  "price": { "amount": "2280.00", "per_unit": "qtl" },
  "delivery_terms": "seller_delivery_fee", "delivery_fee": 1200.00,
  "delivery_address_uuid": "d4e5f6a7-…",
  "delivery_by": "2026-11-22",
  "valid_until": "2026-11-15T18:00:00+05:30",
  "message": "Atta chakki, Ludhiana. Regular buyer, payment same day." }
```
```json
{ "success": true,
  "data": { "offer_uuid": "f1a2b3c4-…", "negotiation_uuid": "9b8a7c6d-…", "round_no": 1, "status": "pending",
            "qty": { "value": "60", "unit": "qtl", "kg": "6000.000" }, "price_per_qtl": "2280.00", "offer_value": "136800.00",
            "list_price_comparison": { "list_price_per_qtl": "2450.00", "wholesale_price_for_qty_per_qtl": "2327.50" },
            "valid_until": "2026-11-15T18:00:00+05:30" },
  "meta": { "request_id": "req_01JD8P1C" } }
```

### 3.9 Negotiations (module 10)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/negotiations/:uuid` | NEW-KISAAN | Full history (all rounds), current terms, expiry | JWT | party | — |
| POST | `/api/v2/kisaan/negotiations/:uuid/counter` ✋ (if AI-drafted) | NEW-KISAAN | Counter (price/qty/terms/validity); max 10 rounds (KIS-OFR-010/011) | JWT | party (alternating) | 🔁 |
| POST | `/api/v2/kisaan/negotiations/:uuid/accept` ✋ | NEW-KISAAN | Accept the **current** offer → reserve inventory + create order (pending_payment) (KIS-OFR-012) | JWT | counter-party of current offer | 🔁 |
| POST | `/api/v2/kisaan/negotiations/:uuid/reject` ✋ | NEW-KISAAN | Reject with optional reason | JWT | counter-party | 🔁 |
| POST | `/api/v2/kisaan/negotiations/:uuid/counter-drafts` | NEW-KISAAN | Save a **private draft** counter (price/qty/terms + rationale). Used by the UI and by KISAAN AI tool `offers.draft_counter`. Nothing is sent to the other party | JWT | party | 🔁 |

Rules: only the party who did **not** author the current offer may accept/reject/counter. Accepting requires `approval_request_id` (always: accept is commit-class even from the UI, which creates the approval inline). Errors: `409 MAX_ROUNDS_REACHED` (422), `409 STATE_CONFLICT` (already decided/expired), `409 INSUFFICIENT_STOCK` (at acceptance → offer stays pending, user told), `409 APPROVAL_INVALID`.

#### Example: counter
```http
POST /api/v2/kisaan/negotiations/9b8a7c6d-…/counter
Idempotency-Key: 77aa…
{ "qty": { "value": "60", "unit": "qtl" }, "price": { "amount": "2350.00", "per_unit": "qtl" },
  "delivery_terms": "seller_delivery_fee", "delivery_fee": 1200.00, "valid_until": "2026-11-15T20:00:00+05:30",
  "message": "2350 final, maal ekdum sukha hai (11.5% moisture).",
  "approval_request_id": "ap_2c9e…" }
```
```json
{ "success": true, "data": { "negotiation_uuid": "9b8a7c6d-…", "round_no": 2, "current_offer": { "uuid": "aa11…", "from_party": "seller", "price_per_qtl": "2350.00", "status": "pending" }, "rounds_remaining": 8 } }
```

#### Example: accept offer (requires approval)
```http
POST /api/v2/kisaan/negotiations/9b8a7c6d-…/accept
Authorization: Bearer eyJ…   X-Kisaan-Active-Role: seller
Idempotency-Key: 5c4d…
X-AI-Execution-Id: ex_01JD8Q

{ "offer_uuid": "bb22…", "approval_request_id": "ap_7f31d2e0-6a54-4c1b-9b7e-3e2d1c0b9a88" }
```
Without a valid approval:
```json
{ "success": false,
  "error": { "code": "APPROVAL_REQUIRED", "message": "ਇਹ ਸੌਦਾ ਪੱਕਾ ਕਰਨ ਲਈ ਤੁਹਾਡੀ ਮਨਜ਼ੂਰੀ ਚਾਹੀਦੀ ਹੈ",
    "context": { "approval_request": { "uuid": "ap_7f31d2e0-…", "action_type": "offer.accept", "expires_at": "2026-11-15T17:45:00+05:30",
      "summary": { "pa": "ਤੁਸੀਂ 60 ਕੁਇੰਟਲ ਕਣਕ ₹2,300/ਕੁਇੰਟਲ (ਕੁੱਲ ₹1,38,000) 'ਤੇ ਵੇਚਣ ਲਈ ਮੰਨ ਰਹੇ ਹੋ। ਖਰੀਦਦਾਰ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਭੁਗਤਾਨ ਕਰੇਗਾ।" },
      "amount_inr": "138000.00", "qty_kg": "6000.000" } } } }
```
With an approved approval:
```json
{ "success": true,
  "data": { "negotiation": { "uuid": "9b8a7c6d-…", "status": "agreed" },
            "order": { "uuid": "0d9c…", "order_number": "KSN-2026-004812", "kisaan_status": "pending_payment",
                       "grand_total": "138000.00", "payment_due_at": "2026-11-16T17:31:00+05:30" },
            "inventory_reservation": { "uuid": "r_55aa…", "qty_kg": "6000.000", "expires_at": "2026-11-16T17:31:00+05:30" },
            "other_open_offers_notified": 2 } }
```

### 3.10 Orders (module 11)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/checkout/quote` | NEW-KISAAN | Price quote with full stacking breakdown (owner doc [PRICING_ENGINE](PRICING_ENGINE.md)). Body `context` ∈ `preview` · `checkout` (default) · `offer_accept` (PRICING_ENGINE §13.1; `group_join`/`group_lock` quotes are created only by the group endpoints in §3.22). `checkout`/`offer_accept` create a quote (`status: issued`, 15 min / offer deadline) and reserve the coupon use and membership waiver. `preview` (v0.1 `dry_run: true`, still accepted) persists a short-TTL quote for audit/replay but reserves nothing and is labelled *estimate*; it cannot be used for checkout. KISAAN AI `pricing.get_quote` uses `preview`. Response includes `rule_versions` and `breakdown_hash`. Errors: `422 QTY_BELOW_MOQ` / `QTY_ABOVE_MAX` / `MIN_ORDER_VALUE_NOT_MET` (with `qty_needed_kg` nudge) / `COUPON_NOT_APPLICABLE` / `COUPON_OUTSIDE_HOURS`, `409 LISTING_NOT_PURCHASABLE` | JWT | buyer | 🔁 (not needed for `dry_run`) |
| POST | `/api/v2/kisaan/checkout/orders` ✋ | NEW-KISAAN | "Buy now": create order from quote → reserves inventory → returns payment intent | JWT | buyer | 🔁 |
| GET | `/api/v2/kisaan/orders?role=buyer\|seller&status=` | NEW-KISAAN | Orders list with Kisaan statuses | JWT | party | — |
| GET | `/api/v2/kisaan/orders/:uuid` | NEW-KISAAN | Detail: timeline, pricing snapshot, shipment, documents | JWT | party/admin | — |
| POST | `/api/v2/kisaan/orders/:uuid/ready` ✋ (if AI-drafted) | NEW-KISAAN | Seller marks ready for pickup/dispatch (`order.mark_ready`) | JWT | seller | 🔁 |
| POST | `/api/v2/kisaan/orders/:uuid/cancel` ✋ | NEW-KISAAN | Cancel (rules KIS-ORD-005) → release stock, refund | JWT | party | 🔁 |
| POST | `/api/v2/kisaan/orders/:uuid/confirm-receipt` ✋ | NEW-KISAAN | Buyer accepts delivery (with delivered weight) → completes and releases settlement | JWT | buyer | 🔁 |
| POST | `/api/v2/kisaan/orders/:uuid/weight-reconciliation` | NEW-KISAAN | Record weighbridge weights; computes pro-rata adjustment (KIS-ORD-007) | JWT | party | 🔁 |
| GET | `/api/v2/kisaan/orders/:uuid/documents` | NEW-KISAAN | Invoice, receipt, weighbridge slip (signed URLs, 5 min) | JWT | party | — |
| GET | `/api/v2/kisaan/quotes/:uuid` | NEW-KISAAN | v0.2: a stored quote (inputs summary, lines, totals, status, `valid_until`) | JWT | quote owner | — |
| GET | `/api/v2/buyer/orders`, `/api/v2/seller/orders` | EXISTING-OPSAPI | Raw opsapi order views (admin/debug; Kisaan apps use `/kisaan/orders`) | JWT | — | — |
| GET | `/api/v2/orders/:id/status-history` | EXISTING-OPSAPI | Coarse status history (admin) | JWT | admin | — |

Order `kisaan_status` values: `pending_payment`, `confirmed`, `ready_for_pickup`, `in_transit`, `delivered`, `completed`, `cancelled`, `disputed`, `payment_received_stock_unavailable` (auto-refund path). Group child orders (`source_type = group_allocation`) are created directly in `confirmed` (D-137). State machines: [MARKETPLACE_ARCHITECTURE](MARKETPLACE_ARCHITECTURE.md).

#### Example: checkout price quote with stacking breakdown
Scenario: buyer (KISAAN Plus member, retailer) wants 60 qtl from the listing above, applies the seller's coupon `KANAK2`; the seller delivers for a seller-set fee of ₹3,200 (`seller_delivery_fee`, MVP delivery term per D-106).
```http
POST /api/v2/kisaan/checkout/quote
Idempotency-Key: 1f2e…
{ "listing_uuid": "5d1f7c2a-9e3b-4d8a-b6c1-2e3f4a5b6c7d", "qty": { "value": "60", "unit": "qtl" },
  "context": "checkout", "coupon_code": "KANAK2", "delivery_mode": "seller_delivery_fee", "delivery_address_uuid": "d4e5f6a7-…" }
```
```json
{ "success": true,
  "data": {
    "quote_uuid": "q_3a4b5c6d-…", "context": "checkout", "status": "issued", "valid_until": "2026-11-14T11:05:00+05:30",
    "rule_versions": { "engine": "1.0.0", "tax_table": "2026-10", "benefits": "2", "commission_rule": "cr_12", "tier_set": "ts_5d1f_v1" },
    "qty": { "value": "60", "unit": "qtl", "kg": "6000.000" },
    "steps": [
      { "step": 1, "rule": "base_list_price", "price_per_qtl": "2450.00", "line_total": "147000.00" },
      { "step": 2, "rule": "wholesale", "applied": "tier_1", "detail": "50+ qtl: 5% off", "price_per_qtl": "2327.50", "discount": "7350.00", "funded_by": "seller",
        "alternatives_considered": [ { "rule": "whole_lot", "eligible": false, "reason": "requires 100 qtl" } ] },
      { "step": 3, "rule": "group_discount", "applied": false, "reason": "not a group order" },
      { "step": 4, "rule": "negotiated_price", "applied": false, "reason": "no accepted offer" },
      { "step": 5, "rule": "member_price", "applied": false, "reason": "seller has not set a member price" },
      { "step": 6, "rule": "seller_coupon", "code": "KANAK2", "detail": "2% off, max ₹3,000", "discount": "2793.00", "funded_by": "seller" },
      { "step": 7, "rule": "floor_check", "ok": true } ],
    "goods_total": "136857.00",
    "delivery": { "step": 8, "mode": "seller_delivery_fee", "fee": "3200.00", "basis": "seller-set delivery fee (store delivery policy v3)", "membership_waiver": { "benefit": "free_delivery", "amount": "500.00", "funded_by": "platform", "cap_remaining_calendar_month": "1500.00" }, "fee_payable": "2700.00" },
    "platform_fee_buyer": "0.00",
    "taxes": { "step": 9, "gst_on_goods": "0.00", "note": "Unprocessed wheat: GST nil/exempt [TAX REVIEW]" },
    "grand_total": "139557.00",
    "seller_view": { "commission_payer": "seller", "commission_pct": "1.50", "commission": "2052.86", "gst_on_commission_18pct": "369.51", "seller_net_estimate": "134434.63" },
    "breakdown_hash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" } }
```
Stacking order follows the canonical 9-stage model in [PRICING_ENGINE](PRICING_ENGINE.md) §5 (D-103): 1 base → 2 wholesale tier / whole-lot → 3 group discount (group orders only) → 4 negotiated price (replaces 1–3 and 5) → 5 member price (seller opt-in) → 6 seller coupon (max one, ≤ 50 % of goods value) → 7 floor check → 8 delivery and fees (membership waiver) → 9 taxes. The membership free-delivery waiver applies to the delivery-fee line, not to goods. Arithmetic: after tier, 60 × 2,327.50 = **139,650.00**; no negotiated or member price applies; coupon 2% × 139,650.00 = **2,793.00** (≤ cap 3,000) → goods_total **136,857.00**; grand_total = 136,857.00 + 2,700.00 delivery = **139,557.00**. Commission is **seller-paid** (D-19): 1.5% × 136,857.00 = 2,052.86, plus 18% GST on commission = 369.51 `[TAX REVIEW]`, so seller_net_estimate = 136,857.00 − 2,052.86 − 369.51 = **134,434.63**. The buyer pays no platform fee. Seller funds wholesale and coupon discounts; the platform funds the delivery waiver.

#### Example: create order from quote (Buy now)
```http
POST /api/v2/kisaan/checkout/orders
Idempotency-Key: 8d7c…
{ "quote_uuid": "q_3a4b5c6d-…", "breakdown_hash": "9f86d0…0a08", "approval_request_id": "ap_c1d2…" }
```
```json
{ "success": true,
  "data": { "order": { "uuid": "0e1f…", "order_number": "KSN-2026-004813", "kisaan_status": "pending_payment", "grand_total": "139557.00", "payment_due_at": "2026-11-14T11:20:00+05:30" },
            "reservation": { "qty_kg": "6000.000", "expires_at": "2026-11-14T11:20:00+05:30" },
            "payment": { "uuid": "p_9a8b…", "provider": "razorpay", "provider_order_id": "order_PqR123abc", "amount": "139557.00", "methods": ["upi", "netbanking", "card"], "client_payload": { "key_id": "rzp_live_…", "order_id": "order_PqR123abc" } } } }
```
Errors: `409 QUOTE_EXPIRED`, `409 QUOTE_INVALIDATED`, `409 PRICE_CHANGED_REAPPROVE` (re-quote; hash mismatch or higher total), `409 INSUFFICIENT_STOCK`, `409 COUPON_EXHAUSTED`, `403 CHECKOUT_DISABLED_FOR_STATE`, `403 APMC_LICENCE_REQUIRED`.

**APMC gating (KIS-CMP-046, `[DECISION D-80]`).** Before creating any order (Buy now, offer accept, group lock), the service resolves `kisaan_category_state_rules` for (listing category, seller pickup state):
- No rule, or `checkout_enabled = false` → `403 CHECKOUT_DISABLED_FOR_STATE`. The UI falls back to "enquire / offer only" mode and the AI explains why. It is fail-closed.
- `requires_buyer_apmc_licence = true` and the buyer has no verified licence → `403 APMC_LICENCE_REQUIRED`.
- `levies` templates are applied: the quote's `levies` array lists each levy (type, rate, base, amount, payer), buyer-payable levies are added to `grand_total`, and rows are written to `kisaan_order_levies` on order creation.

Quote fragment when levies apply:
```json
"levies": [ { "levy_type": "market_fee", "rate_pct": "2.000", "base_amount": "136857.00", "amount": "2737.14", "payer": "buyer", "jurisdiction": "PB" },
            { "levy_type": "rural_dev_fee", "rate_pct": "2.000", "base_amount": "136857.00", "amount": "2737.14", "payer": "buyer", "jurisdiction": "PB" } ],
"levies_buyer_total": "5474.28"
```
(Rates are illustrative placeholders `[LEGAL REVIEW]`. The main quote example above assumes no levy rule applies.)

### 3.11 Payments (module 12)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/payments` | NEW-KISAAN | Create/retry PA order for an order, group allocation or membership | JWT | payer | 🔁 |
| GET | `/api/v2/kisaan/payments/:uuid` | NEW-KISAAN | Status (server-verified) | JWT | payer/admin | — |
| POST | `/api/v2/kisaan/payments/:uuid/client-callback` | NEW-KISAAN | Client success callback: **only triggers a server-side fetch**; never marks paid by itself (KIS-PAY-004) | JWT | payer | — |
| POST | `/api/v2/kisaan/public/webhooks/payments/:provider` | NEW-KISAAN | PA webhook (signature verified, dedup by event id) | HMAC signature | — | event id |
| GET | `/api/v2/kisaan/me/payments?status=pending` | NEW-KISAAN | "Show my pending payments" (KIS-PAY-009) | JWT | self | — |
| GET | `/api/v2/kisaan/me/settlements` | NEW-KISAAN | Seller/transporter payouts & holds | JWT | seller/transporter | — |
| POST | `/api/v2/kisaan/admin/refunds` ✋ | NEW-KISAAN | Finance-initiated refund | JWT | `kisaan_finance.manage` (finance; dual control ≥ ₹50,000) | 🔁 |
| POST | `/api/v2/kisaan/admin/settlements/:uuid/release` | NEW-KISAAN | Manual release (dual control: 2 finance users) | JWT | `kisaan_finance.manage` (finance, dual control) | 🔁 |
| GET | `/api/v2/kisaan/admin/reconciliation/runs[/:uuid]` | NEW-KISAAN | Daily reconciliation results (KIS-PAY-008) | JWT | finance | — |
| POST/GET | `/api/v2/payments/*`, `/api/v2/webhooks/stripe` | EXISTING-OPSAPI | Stripe flows, **not used** (blocked for KISAAN) | — | — | — |

#### Example: payment webhook (Razorpay-style; provider choice is `[DECISION D-09]`)
```http
POST /api/v2/kisaan/public/webhooks/payments/razorpay
X-Razorpay-Signature: 5b3c…
X-Razorpay-Event-Id: evt_PqS789xyz
Content-Type: application/json

{ "entity": "event", "event": "payment.captured", "created_at": 1763098320,
  "payload": { "payment": { "entity": { "id": "pay_PqS456def", "order_id": "order_PqR123abc", "amount": 13955700, "currency": "INR",
                                         "status": "captured", "method": "upi", "notes": { "kisaan_payment_uuid": "p_9a8b…" } } } } }
```
Processing contract:
1. Verify the HMAC signature with the webhook secret. If invalid, return `401` and store it with `signature_valid=false`.
2. `INSERT kisaan_payment_events … ON CONFLICT (provider, event_id) DO NOTHING`. On conflict, return `200 {"duplicate": true}`.
3. **Server-side fetch** of the payment from the PA API, then compare amount (paise) to `kisaan_payments.amount` and the `order_id` mapping.
4. In one DB transaction: payment → `captured`; inventory reservation → `committed` (deduct); coupon redemption → `redeemed`; order → `confirmed`; ledger journal; settlement rows (`on_hold`, transfer created via PA Route/Split with `on_hold=true`); outbox events.
5. Respond `200` within 5 s. Heavy work (invoice PDF, notifications) is asynchronous via jobs.

```json
{ "success": true, "data": { "processed": true, "payment_uuid": "p_9a8b…", "order_status": "confirmed" } }
```
Edge cases: reservation expired before capture → re-reserve; if stock is gone, order → `payment_received_stock_unavailable` + automatic full refund + apology notification. Amount mismatch → payment flagged, finance queue, no confirmation.

### 3.12 Invoices & receipts (supporting module)

| Method | Path | Tag | Purpose | Auth | Perm |
|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/invoices?order_uuid=` | NEW-KISAAN | Invoices/bills of supply/receipts for an order | JWT | party |
| GET | `/api/v2/kisaan/invoices/:uuid/pdf` | NEW-KISAAN | 302 to signed URL (5 min) | JWT | party |
| POST | `/api/v2/kisaan/admin/invoices/:uuid/credit-notes` | NEW-KISAAN | Issue credit note | JWT | finance |

### 3.13 Logistics (module 13)

> **Scope (D-106):** the transporter marketplace (transport requests, quotes, transporter onboarding) is **P2**. In MVP, delivery is `buyer_pickup`, `seller_delivery` or `seller_delivery_fee`, and the seller (or buyer) posts shipment status through `POST /shipments/:uuid/events` on a seller-managed shipment. The endpoints below are specified now so the schema and AI tools are stable; P2 endpoints return `404 NOT_FOUND` (feature flag off) in MVP.

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/delivery-partners/register` | EXISTING-OPSAPI | Create the opsapi delivery-partner record for a transporter | JWT | transporter | — |
| GET/PUT | `/api/v2/delivery-partners/profile`, `/areas` | EXISTING-OPSAPI | Partner profile & service areas | JWT | transporter | — |
| GET | `/api/v2/delivery-partner/dashboard`, `/earnings` | EXISTING-OPSAPI | Partner dashboard & earnings (fed by assignments Kisaan creates) | JWT | transporter | — |
| GET/POST/PUT/DELETE | `/api/v2/kisaan/me/vehicles[/:uuid]` | NEW-KISAAN | Vehicles, RC & insurance (KIS-LOG-007) | JWT | transporter | 🔁 |
| POST | `/api/v2/kisaan/transport-requests` | NEW-KISAAN | P2. Create a **draft** request for an order/group order (`logistics.draft_transport_request`); capacity check | JWT | seller/buyer/leader (order party) | 🔁 |
| POST | `/api/v2/kisaan/transport-requests/:uuid/publish` ✋ | NEW-KISAAN | P2. Publish → broadcast to eligible transporters (KIS-LOG-002). Approval `transport.publish_request` (`logistics.propose_publish_transport_request`) | JWT | requester | 🔁 |
| GET | `/api/v2/kisaan/transport-requests/:uuid` | NEW-KISAAN | Request + quotes comparison (price, ETA, rating, vehicle) | JWT | requester | — |
| GET | `/api/v2/kisaan/transport-requests/feed` | NEW-KISAAN | Transporter's open requests in their districts | JWT | transporter | — |
| POST | `/api/v2/kisaan/transport-requests/:uuid/quotes` ✋ (if AI-drafted) | NEW-KISAAN | P2. Submit quote (`transport.submit_quote`) | JWT | transporter (verified) | 🔁 |
| POST | `/api/v2/kisaan/transport-quotes/:uuid/accept` ✋ | NEW-KISAAN | Accept a quote → shipment + opsapi `order_delivery_assignments` | JWT | requester | 🔁 |
| GET | `/api/v2/kisaan/shipments/:uuid` | NEW-KISAAN | Shipment detail & timeline | JWT | party | — |
| POST | `/api/v2/kisaan/shipments/:uuid/events` ✋ (if AI-drafted) | NEW-KISAAN | Status update (`shipment.event`; MVP: seller for `seller_delivery*` orders; P2: assigned transporter): `en_route_pickup`, `picked_up` (weight + photo required), `in_transit`, `delivered` (photo + buyer OTP), `failed` | JWT | seller (MVP seller delivery) / assigned transporter (P2) | 🔁 |
| POST | `/api/v2/kisaan/shipments/:uuid/delivery-otp` | NEW-KISAAN | Generate/resend buyer delivery OTP | JWT | buyer | — |
| GET | `/api/v2/delivery/fee-estimate` | EXISTING-OPSAPI | Distance-based fee estimate (INR slabs). Used only as a fallback hint, labelled "estimate" (KIS-LOG-006). | JWT | — | — |
| GET | `/api/v2/delivery-partner/assignments` | EXISTING-OPSAPI | Partner's assignments list | JWT | transporter | — |

Shipment event validation: transitions follow the KIS-LOG-004 state machine; `picked_up` requires `weight_kg` and ≥ 1 photo; `delivered` requires the buyer OTP (or a photo + recipient name with a support override flag) and ≥ 1 photo; location (if shared) requires consent.

### 3.14 Notifications (module 14)

| Method | Path | Tag | Purpose | Auth |
|---|---|---|---|---|
| GET | `/api/v2/notifications` | EXISTING-OPSAPI | In-app inbox | JWT |
| PUT | `/api/v2/notifications/:id/read`, `/mark-all-read` | EXISTING-OPSAPI | Mark read | JWT |
| POST/GET/DELETE | `/api/v2/device-tokens[/:uuid]` | EXISTING-OPSAPI | FCM token registration | JWT |
| GET/PUT | `/api/v2/kisaan/me/notification-preferences` | NEW-KISAAN | Channels per event type, quiet hours, language (KIS-NOTF-002) | JWT |
| GET/PUT | `/api/v2/kisaan/me/channel-optins` | NEW-KISAAN | WhatsApp/SMS opt-in/out with consent text (KIS-WA-002) | JWT |
| GET/POST/DELETE | `/api/v2/kisaan/price-alerts[/:uuid]` | NEW-KISAAN | Mandi price alerts (KIS-MKT-004) | JWT |
| GET/POST | `https://kisaan.in/api/channels/whatsapp/webhook` | KISAAN-APP | WhatsApp Cloud API webhook (D-102; path per [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md) §5.3, replaces v0.1 `/api/v2/kisaan/public/webhooks/whatsapp`). Inbound messages go to the KISAAN AI conversation for the phone-linked user. Status callbacks are forwarded to `POST /api/v2/kisaan/notify/channel-events` (NEW-KISAAN, service key, notification log only) | Meta signature (`X-Hub-Signature-256`) |
| POST | `/api/v2/kisaan/public/webhooks/sms/:provider` | NEW-KISAAN | SMS delivery reports | Provider signature/IP allow-list |

All outbound SMS/WhatsApp sending is internal (notification service via plugin jobs). No public "send" endpoint.

### 3.15 Reviews (module 15)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/orders/:uuid/reviews` | NEW-KISAAN | Create review of counter-party/transporter (within 14 days of completion) | JWT | order party | 🔁 |
| POST | `/api/v2/kisaan/groups/:uuid/leader-review` | NEW-KISAAN | Member rates leader (KIS-REV-005) | JWT | member | 🔁 |
| POST | `/api/v2/kisaan/reviews/:uuid/reply` | NEW-KISAAN | Single seller reply | JWT | subject | — |
| POST | `/api/v2/kisaan/reviews/:uuid/report` | NEW-KISAAN | Report abusive review | JWT | any | — |
| GET | `/api/v2/kisaan/public/users/:uuid/reviews` | NEW-KISAAN | Public reviews for seller/buyer/transporter/leader | None | — | — |
| GET | `/api/v2/public/stores/:slug/reviews` | EXISTING-OPSAPI | Store reviews (fed by Kisaan mirror writes) | None | — | — |

Validation: `rating` 1–5; `tags` from an allowed list; comment ≤ 1,000 chars; one review per (order, reviewer, subject_type).

### 3.16 Admin (module 16)

All under `/api/v2/kisaan/admin/*` (NEW-KISAAN), JWT with MFA-backed admin session (KIS-AUTH-004), permission `kisaan_admin.manage` or the sub-role module permission (`kisaan_verification.manage`, `kisaan_finance.manage`, `kisaan_support.manage`), rate 300/min. Every mutating call writes `kisaan_audit_log`.

| Method | Path | Purpose | Perm |
|---|---|---|---|
| GET | `/admin/dashboard/kpis?from=&to=` | KPIs (users by role/verification, active listings by category, orders, GMV, commission, disputes, AI cost) (KIS-ANL-001) | admin |
| GET/PATCH | `/admin/users[/:uuid]` | Search, view (masked PII), suspend/reinstate, role change | admin |
| GET | `/admin/verification-queue?type=&status=` | KYC/business/leader/transporter queue with AI risk annotations (KIS-ADM-002) | verifier |
| POST | `/admin/verifications/:uuid/decision` | Approve/reject with reason | verifier |
| GET | `/admin/kyc-documents/:uuid/url` | 5-min signed URL. Access logged (`kyc.document.view`). | verifier |
| GET | `/admin/moderation/listings?flag=` | Flagged listings (KIS-ADM-003) | verifier |
| POST | `/admin/listings/:uuid/moderation` | Approve/reject/remove | verifier |
| GET | `/admin/orders?status=&risk=` · `/admin/orders/:uuid` | Order monitoring (KIS-ADM-004) | admin, finance |
| GET/POST | `/admin/disputes[/:uuid]` · `/admin/disputes/:uuid/resolve` | Dispute console (KIS-ADM-005). Resolution by a human only. | admin |
| GET/POST | `/admin/commission-rules` | Effective-dated commission (KIS-ADM-006) | finance |
| GET/POST/PUT | `/admin/membership-plans[/:uuid]` | Plans (KIS-ADM-008) | admin |
| GET/POST | `/admin/legal-documents` · `POST /admin/legal-documents/:uuid/publish` | T&C/privacy versions. Publishing requires `legal_reviewed_by`. | admin |
| GET | `/admin/risk/flags` · `POST /admin/risk/flags/:uuid/decision` | Fraud console (KIS-ADM-011) | admin |
| GET | `/admin/ai/metrics?from=&to=` | AI KPIs: conversations, task completion, approval conversion, tool error rate, p95 latency (KIS-ADM-010) | admin |
| GET | `/admin/ai/tool-executions?tool=&category=&class=&status=&user_uuid=&from=&to=` | Tool execution log (redacted args, result status, approval link) | admin, support (masked) |
| GET | `/admin/ai/approvals?status=&action_type=` | Approval log: requested → approved/rejected/expired → executed | admin |
| GET | `/admin/ai/cost?from=&to=&group_by=day\|model\|channel\|role` | AI cost dashboard from `kisaan_ai_usage_daily` (LLM tokens, STT seconds, TTS chars, ₹) | admin, finance |
| GET | `/admin/ai/tool-catalogue` | All tools: category, class, code-allowed roles, enabled, overrides, limits | admin |
| PATCH | `/admin/ai/tool-catalogue/:tool_name` | Enable/disable a tool, **narrow** roles, set rate limit/timeout. `422 OVERRIDE_WIDENS_PERMISSION` if roles ⊄ code roles; `422 COMMIT_REQUIRES_APPROVAL` if trying to unset approval on a COMMIT tool. `If-Match` | admin (dual control for enabling COMMIT tools) |
| PUT | `/admin/ai/kill-switch` | `{ "enabled": false, "reason": "…" }` turns the KISAAN AI off globally. The UI falls back to conventional screens | admin |
| GET/POST | `/admin/ai/prompt-versions` · `POST /admin/ai/prompt-versions/:uuid/activate` | Prompt/model versions. Activation requires `eval_report` status `passed` (`409 EVAL_NOT_PASSED`) | admin (dual control) |
| GET | `/admin/coupons?flag=&store=` · `POST /admin/coupons/:uuid/disable` · `/enable` | Coupon moderation and **emergency disable** (D-105). Body `{ "reason": "…" }`. Sets `status = disabled` + `admin_disabled_*`, invalidates open quotes (`QUOTE_INVALIDATED`), emits `kisaan.coupon.admin_disabled`. The seller cannot re-enable | admin |
| POST | `/admin/quotes/:uuid/replay` | v0.2 (KIS-PRC-019): recompute a stored quote with its pinned `inputs` + `rule_versions`; returns the recomputed breakdown and `hash_match: true\|false` (mismatch → P1 alert). Read-only, audit-logged | admin, support, finance |
| GET | `/admin/groups/:uuid` · `POST /admin/groups/:uuid/unsuspend` | v0.2: full group view for moderation (member PII masked unless reason code given) | admin |
| GET | `/admin/bulk-buyers?verification=` · `POST /admin/bulk-buyers/:uuid/verification-decision` | Bulk-buyer business verification queue (D-104) | verifier |
| GET | `/admin/groups?status=&flag=` · `POST /admin/groups/:uuid/suspend` | Buyer-group oversight, suspend a group or leader | admin |
| GET | `/admin/audit-log?entity=&actor=` | Immutable audit viewer (KIS-ADM-012) | admin |
| GET/PUT | `/admin/settings[/:key]` | Platform config (KIS-ADM-013) | admin |
| GET/POST | `/admin/category-state-rules` · `PUT /admin/category-state-rules/:uuid` | APMC gating: checkout enabled per category per state, licence requirement, levy templates (KIS-CMP-046, D-80). Effective-dated and audit-logged. | admin (+ legal sign-off note) |
| GET | `/admin/orders/:uuid/levies` · `POST /admin/levies/:uuid/remittance` | View levies, record remittance reference | finance |
| GET/PUT | `/admin/search/synonyms` | Synonym dictionary (KIS-SRCH-005) | admin |
| POST | `/admin/mandi/import` · GET `/admin/mandi/runs` | Trigger/inspect mandi ingestion | admin |
| GET | `/api/v2/admin/ai-usage`, `/api/v2/namespace/audit-logs`, `/api/v2/namespace/activity` | EXISTING-OPSAPI: platform AI usage and namespace audit/activity | admin |
| GET | `/api/v2/plugins/kisaan`, `POST /api/v2/plugins/kisaan/events/retry`, `POST /api/v2/plugins/kisaan/jobs/:job/run` | EXISTING-OPSAPI: plugin ops (event retries, manual job runs) | platform admin |

### 3.17 KISAAN AI — conversation API (module 17) — KISAAN-APP

There is exactly **one** KISAAN AI (D-101). Its runtime is a module of the KISAAN Next.js app (D-102), served from `https://kisaan.in/api/ai/v1/*` (path-versioned, D-102). Clients call it with the **same OpsAPI JWT** (HTTP-only cookie on web, bearer on PWA). The route handler validates the token by calling `GET /api/v2/kisaan/me` (NEW-KISAAN). It resolves the user's roles **server-side** and ignores any role or user ID claimed in the message text. Every tool call goes to NEW-KISAAN/EXISTING-OPSAPI endpoints **with that user's token**. OpsAPI's own `/api/chat/agent` is **not** used for KISAAN end users. It remains available to admins in the opsapi dashboard. Full design: [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md).

| Method | Path | Tag | Purpose | Auth | Perm | Rate | Idem |
|---|---|---|---|---|---|---|---|
| POST | `/api/ai/v1/conversations` | KISAAN-APP | Start a conversation. Body `{ channel, language?, client_context? }`. The active role comes from `X-Kisaan-Active-Role`, validated server-side | JWT | self | 10/min | 🔁 |
| GET | `/api/ai/v1/conversations?page=` · `/api/ai/v1/conversations/:uuid` | KISAAN-APP | My history (KIS-AI-008), read via `GET /api/v2/kisaan/me/ai/conversations` | JWT | owner | read | — |
| DELETE | `/api/ai/v1/conversations/:uuid` | KISAAN-APP | Delete my AI history (executed actions stay in the audit log) | JWT | owner | write | — |
| POST | `/api/ai/v1/conversations/:uuid/messages` | KISAAN-APP | Send a text/voice/image turn. Response is an **SSE stream** (`Accept: text/event-stream`) or JSON (low-bandwidth mode `?mode=compact`) | JWT | owner | AI class (30 msg/10 min; daily ₹/token budget, KIS-AI-009) | `Idempotency-Key` required (retried turn → same reply) |
| POST | `/api/ai/v1/conversations/:uuid/messages/:message_uuid/stop` | KISAAN-APP | Stop generation. Tools already executed are not rolled back (READ/DRAFT only, since COMMIT always waits for approval) | JWT | owner | write | — |
| POST | `/api/ai/v1/uploads` | KISAAN-APP | Voice (Opus/WebM/OGG ≤ 60 s, ≤ 1 MB) or image (≤ 5 MB JPEG/PNG/WebP) for a turn. Returns `upload_uuid` | JWT | self | voice class | 🔁 |
| POST | `/api/ai/v1/voice/transcribe` | KISAAN-APP | STT only (for search boxes) → `{ text, language_detected, confidence }` | JWT | self | voice class | — |
| POST | `/api/ai/v1/voice/speak` | KISAAN-APP | TTS (`text` ≤ 600 chars, `language`, `speed`) → audio/ogg | JWT | self | 60/10 min | — |
| POST | `/api/ai/v1/conversations/:uuid/feedback` | KISAAN-APP | Thumbs up/down + reason (eval data) | JWT | owner | write | — |

**Message request:** `{ "input": { "type": "text" | "voice" | "image", "text": "…", "upload_uuid": "…" }, "client_context": { "screen": "listing_detail", "listing_uuid": "…" } }`. Validation: exactly one of `text` / `upload_uuid`; `text` ≤ 2,000 chars; `client_context` is a **hint** only and is re-authorised by every tool.

**SSE events:** `transcript` (voice turns), `token` (reply text delta), `tool_status` (`{ "category": "pricing", "status": "running|ok|failed" }`, never raw arguments), `card`, `approval_required` (approval card with `approval_request_uuid`, summary, amount, qty, expiry), `task_state`, `done` (final message object), `error` (`{ code }`). The JSON/compact mode returns the final message object only.

**Final message object:** `{ "message_uuid", "transcript"?, "reply": { "text", "language", "tts_audio_url"? }, "cards": [ ... ], "citations": [ ... ], "task_state": { ... }, "pending_approvals": [ ... ], "labels": { "kind": "estimate|recommendation|draft|confirmed" } }`. Card types: `listing_preview`, `search_results`, `price_table`, `quote_breakdown` (from `pricing.get_quote`, labelled *indicative* unless it carries a backend `quote_id`), `offer_comparison`, `group_progress`, `approval`, `order_status`, `form_fallback` (deep link to the conventional screen, KIS-AI-007).

**Errors:** `401 UNAUTHENTICATED`, `403 ROLE_NOT_HELD`, `409 CONVERSATION_ARCHIVED`, `413 UPLOAD_TOO_LARGE`, `415 UNSUPPORTED_MEDIA`, `422 VALIDATION_FAILED`, `429 RATE_LIMITED` / `AI_BUDGET_EXHAUSTED` (with `form_fallback`), `503 AI_DISABLED` (kill switch or provider outage, with `form_fallback`), `502 PROVIDER_UNAVAILABLE` (STT/LLM).

#### Example: KISAAN AI message (farmer, Punjabi/Hinglish voice)
```http
POST https://kisaan.in/api/ai/v1/conversations/c0ffee00-1234-4abc-8def-001122334455/messages
Authorization: Bearer eyJ…   X-Namespace-Slug: kisaan   X-Kisaan-Active-Role: seller   Idempotency-Key: 1f0e…
Accept: application/json

{ "input": { "type": "voice", "upload_uuid": "au_91b2…" }, "client_context": { "screen": "home" } }
```
```json
{ "success": true,
  "data": {
    "message_uuid": "m_4410…",
    "transcript": { "text": "Mere paas 100 quintal wheat hai Moga mein. Main poora maal ek buyer ko dena chahta hoon, lekin agar koi 20 quintal ya usse zyada leta hai toh discount dena hai.", "language_detected": "hi-Latn+pa", "confidence": 0.91 },
    "reply": { "language": "pa",
      "text": "ਠੀਕ ਹੈ! ਮੈਂ 100 ਕੁਇੰਟਲ ਕਣਕ (ਮੋਗਾ) ਦੀ ਲਿਸਟਿੰਗ ਦਾ ਡਰਾਫਟ ਬਣਾਇਆ ਹੈ — ਪੂਰਾ ਲਾਟ ਇੱਕ ਖਰੀਦਦਾਰ ਨੂੰ, ਅਤੇ 20 ਕੁਇੰਟਲ ਜਾਂ ਵੱਧ 'ਤੇ ਛੋਟ। ਕਿਸਮ ਕਿਹੜੀ ਹੈ, ਅਤੇ 20+ ਕੁਇੰਟਲ 'ਤੇ ਕਿੰਨੀ ਛੋਟ ਦੇਣੀ ਹੈ? ਕੁਝ ਵੀ ਪ੍ਰਕਾਸ਼ਿਤ ਨਹੀਂ ਹੋਇਆ।",
      "tts_audio_url": "https://kisaan.in/api/ai/v1/audio/tts_77ab….ogg" },
    "cards": [
      { "type": "listing_preview", "draft_listing_uuid": "5d1f7c2a-…", "status": "draft", "completion_pct": 50,
        "extracted": { "commodity": "wheat", "qty": { "value": "100", "unit": "qtl" }, "location": "Moga", "whole_lot_enabled": true, "tier_1_min_qty": { "value": "20", "unit": "qtl" } },
        "needs_confirmation": ["commodity", "qty", "location"], "missing": ["variety", "moisture_pct", "list_price", "tier_1_discount", "photos"] },
      { "type": "price_table", "commodity": "wheat", "rows": [
          { "market": "Moga", "date": "2026-11-12", "min": "2400.00", "max": "2460.00", "modal": "2425.00" } ],
        "disclaimer": "Mandi prices are reference only, not a guaranteed sale price." } ],
    "citations": [ { "source": "Agmarknet via data.gov.in", "fetched_at": "2026-11-13T06:10:00+05:30" } ],
    "task_state": { "workflow": "listing_create", "step": "collect_details", "draft_listing_uuid": "5d1f7c2a-…" },
    "labels": { "kind": "draft" },
    "pending_approvals": [] } }
```
(Mandi figures are illustrative placeholders. Real values come from `market.get_mandi_prices` with source and date.)

### 3.18 KISAAN AI internal tool API — persistence, context, matching and tool mapping (module 18) — NEW-KISAAN

These plugin endpoints let the one KISAAN AI runtime persist telemetry and read configuration. They **never write business data**. Service calls use a namespace-bound API key (`opsk_…`) with only `kisaan_ai.create`, `kisaan_ai.read` and `kisaan_approvals.create`, **plus** `X-On-Behalf-Of: <user_uuid>`. The plugin checks that this user has an active conversation; this header is a KISAAN convention, not an OpsAPI feature. User-scoped reads use the user's JWT.

| Method | Path | Tag | Purpose | Auth | Perm | Rate | Idem |
|---|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/ai/conversations` | NEW-KISAAN | Create a conversation record → `kisaan_ai_conversations` | Service key + on-behalf | `kisaan_ai.create` | 600/min | 🔁 |
| PATCH | `/api/v2/kisaan/ai/conversations/:uuid` | NEW-KISAAN | Update `task_state`, `summary`, title | Service key + on-behalf | `kisaan_ai.create` | 600/min | `If-Match` |
| POST | `/api/v2/kisaan/ai/messages` | NEW-KISAAN | Append a message (redacted content, model, prompt version, tokens, cost, latency, guardrail events) → `kisaan_ai_messages` | Service key + on-behalf | `kisaan_ai.create` | 1200/min | 🔁 |
| POST | `/api/v2/kisaan/ai/tool-executions` | NEW-KISAAN | Record one tool execution (name, version, category, class, acting user/role, redacted args + hash, result status, http status, error code, approval link, latency) → `kisaan_ai_tool_executions` | Service key + on-behalf | `kisaan_ai.create` | 2400/min | 🔁 |
| GET | `/api/v2/kisaan/ai/tool-catalogue` | NEW-KISAAN | Effective runtime config (enabled, narrowed roles, limits, timeouts). Cached ≤ 60 s by the runtime | Service key | `kisaan_ai.read` | 60/min | — |
| GET | `/api/v2/kisaan/me/ai/context` | NEW-KISAAN | Minimal, masked context for the turn: roles held, language, KISAAN Plus status, open drafts/listings/orders/groups counts, pending approvals | **User JWT** | self | 120/min | — |
| GET | `/api/v2/kisaan/me/ai/budget` | NEW-KISAAN | Remaining daily AI budget (KIS-AI-009) | User JWT | self | 120/min | — |
| GET/DELETE | `/api/v2/kisaan/me/ai/conversations[/:uuid]` | NEW-KISAAN | History list/detail and user deletion | User JWT | owner | read/write | — |
| POST | `/api/v2/kisaan/matching/run` | NEW-KISAAN | v0.2 generic entry for `matching.find_matches`: body `{ subject_type: requirement\|listing\|group, subject_uuid, limit? }` → same ranked result as the subject-specific GETs below. Not an AI endpoint (v0.1 `/kisaan/ai/matching/run` renamed) | User JWT | owner of the subject (leader for groups) | 30/min | — |
| GET | `/api/v2/kisaan/matching/requirements/:uuid/matches` · `/api/v2/kisaan/matching/listings/:uuid/matches` · `/api/v2/kisaan/matching/groups/:uuid/matches` | NEW-KISAAN | **Deterministic matching service** (scored query: commodity, quality specs, qty, distance, delivery, trust, price). Returns ranked candidates with score components. Used by UI and `matching.find_matches` | User JWT | owner of the requirement/listing/group (leader) | 30/min | — |

Validation on telemetry writes: `tool_name` must exist in the catalogue; `action_class` must match it; `arguments_redacted` must pass the PII redaction check (phone/UPI/account patterns → `422 PII_NOT_REDACTED`). Errors: `403 FORBIDDEN` (key lacks scope), `404 CONVERSATION_NOT_FOUND`, `409 DUPLICATE` (idempotent replay returns the original).

**Tool → endpoint mapping (v0.2, reconciled).** Tool names are copied **exactly** from the catalogue in [SINGLE_AI_ARCHITECTURE](SINGLE_AI_ARCHITECTURE.md) §8 (113 tools: 61 READ, 17 DRAFT, 35 COMMIT). That document owns tool schemas, the role matrix and the approval matrix; this table owns the endpoints. Paths are abbreviated: `/kisaan/…` = `/api/v2/kisaan/…` (NEW-KISAAN). **AL** = handled inside the KISAAN AI module with no backend write (task state, deterministic library or model adapter). Every READ/DRAFT call uses the **user's** delegated token. Every COMMIT (`propose_*`) tool only calls `POST /kisaan/approvals` (service identity + `X-On-Behalf-Of`) with the `action_type` shown; the **user's own client** then calls the ✋ endpoint with `approval_request_id` (§3.19). v0.1 tool names (`*.request_*`, `pricing.suggest_wholesale_tiers`, `catalogue.extract_attributes_from_image`, `offers.compare`, `groups.get_member_summary`, …) are retired.

| Category | Tool | Class | Endpoint(s) | Approval `action_type` |
|---|---|---|---|---|
| account | `account.get_my_profile` · `account.get_my_roles` | READ | GET `/kisaan/me` | — |
| account | `account.set_language_preference` | DRAFT | PATCH `/kisaan/me` | — |
| account | `account.get_verification_status` | READ | GET `/kisaan/me/verifications` | — |
| account | `account.get_bulk_buyer_profile` | READ | GET `/kisaan/me/bulk-buyer-profile` (§3.23) | — |
| account | `account.prefill_bulk_buyer_onboarding` | DRAFT | AL (prefill token in task state; the user submits POST `/kisaan/bulk-buyer/onboarding` from the form) | — |
| account | `account.list_pending_approvals` · `account.get_approval_status` | READ | GET `/kisaan/approvals?status=pending`, GET `/kisaan/approvals/:uuid` | — |
| seller | `seller.get_my_store` · `seller.get_store_analytics` · `seller.get_settlements` | READ | GET `/kisaan/me/store`, `/kisaan/me/store/analytics`, `/kisaan/me/settlements` | — |
| seller | `seller.draft_store_update` | DRAFT | AL (draft diff in task state) | — |
| seller | `seller.propose_store_update` | COMMIT | PATCH `/kisaan/me/store` ✋ | `store.publish` |
| catalogue | `catalogue.list_categories` · `catalogue.get_attribute_schema` | READ | GET `/kisaan/public/categories`, `/kisaan/public/categories/:code/attributes` | — |
| catalogue | `catalogue.convert_units` · `catalogue.extract_image_hints` | READ | AL (deterministic unit table; vision adapter — hints only, never grade/certification) | — |
| catalogue | `catalogue.upload_listing_image` | DRAFT | POST `/kisaan/listings/:uuid/media` (draft listing) | — |
| catalogue | `catalogue.create_listing_draft` · `catalogue.update_listing_draft` | DRAFT | POST `/kisaan/listings` (`status: draft`), PATCH `/kisaan/listings/:uuid` (draft only) | — |
| catalogue | `catalogue.check_duplicates` | READ | GET `/kisaan/listings/:uuid/duplicate-check` (v0.2) | — |
| catalogue | `catalogue.propose_publish_listing` | COMMIT | POST `/kisaan/listings/:uuid/publish` ✋ | `listing.publish` |
| catalogue | `catalogue.propose_listing_change` | COMMIT | PATCH `/kisaan/listings/:uuid` ✋ (active) or POST `/pause` · `/resume` · `/close` | `listing.change` (`listing.update_price` for price-only) |
| inventory | `inventory.get_listing_inventory` · `inventory.get_summary` · `inventory.get_movements` | READ | GET `/kisaan/listings/:uuid/inventory`, `/kisaan/inventory/summary`, `/kisaan/listings/:uuid/inventory/movements` | — |
| inventory | `inventory.set_low_stock_threshold` | DRAFT | PUT `/kisaan/listings/:uuid/inventory/threshold` | — |
| inventory | `inventory.propose_adjustment` | COMMIT | POST `/kisaan/listings/:uuid/inventory/adjustments` ✋ | `inventory.adjust` |
| pricing | `pricing.get_quote` | READ | POST `/kisaan/checkout/quote` (`context: preview`) | — |
| pricing | `pricing.get_listing_price` · `pricing.get_wholesale_tiers` | READ | GET `/kisaan/public/listings/:uuid/price`, GET `/kisaan/listings/:uuid/tier-sets` (owner) or `/kisaan/listings/:uuid/wholesale` | — |
| pricing | `pricing.draft_wholesale_tiers` | DRAFT | POST `/kisaan/listings/:uuid/tier-sets` (`status: draft`) | — |
| pricing | `pricing.propose_wholesale_tiers` | COMMIT | POST `/kisaan/tier-sets/:uuid/publish` ✋ (or PUT `/kisaan/listings/:uuid/wholesale` ✋ for v0.1 clients) | `wholesale.publish` |
| market | `market.get_mandi_prices` · `market.compare_markets` · `market.get_msp` · `market.get_price_trend` | READ | GET `/kisaan/public/mandi/prices`, `/mandi/compare`, `/kisaan/public/msp`, `/mandi/trend` | — |
| discovery | `discovery.search_listings` · `discovery.search_sellers` · `discovery.get_listing` · `discovery.get_store` | READ | GET `/kisaan/public/search/listings`, `/search/sellers`, `/kisaan/public/listings/:uuid`, `/kisaan/public/stores/:slug` | — |
| discovery | `discovery.create_requirement_draft` | DRAFT | POST `/kisaan/requirements` (draft) | — |
| discovery | `discovery.propose_publish_requirement` | COMMIT | POST `/kisaan/requirements/:uuid/publish` ✋ | `requirement.publish` |
| discovery | `discovery.get_my_requirements` · `discovery.compare_quotations` | READ | GET `/kisaan/requirements?mine=true`, `/kisaan/requirements/:uuid/compare` | — |
| matching | `matching.find_matches` | READ | POST `/kisaan/matching/run` (v0.2; replaces v0.1 `/kisaan/ai/matching/run`) or the subject-specific GET `/kisaan/matching/{requirements\|listings\|groups}/:uuid/matches` | — |
| matching | `matching.get_requirement_feed` | READ | GET `/kisaan/requirements/feed` | — |
| matching | `matching.propose_send_enquiry` | COMMIT | POST `/kisaan/listings/:uuid/enquiries` ✋ | `enquiry.send` |
| offers | `offers.list_my_offers` · `offers.get_negotiation` · `offers.compare_offers` | READ | GET `/kisaan/offers`, `/kisaan/negotiations/:uuid`, `/kisaan/listings/:uuid/offers/compare` | — |
| offers | `offers.draft_offer` · `offers.draft_counter` | DRAFT | AL (task state); optional private copy via POST `/kisaan/negotiations/:uuid/counter-drafts` | — |
| offers | `offers.propose_send_offer` | COMMIT | POST `/kisaan/listings/:uuid/offers` ✋ | `offer.send` |
| offers | `offers.propose_counter` · `offers.propose_accept` · `offers.propose_reject` | COMMIT | POST `/kisaan/negotiations/:uuid/counter` · `/accept` · `/reject` ✋ | `offer.counter` · `offer.accept` · `offer.reject` |
| offers | `offers.propose_withdraw` | COMMIT | POST `/kisaan/offers/:uuid/withdraw` ✋ | `offer.withdraw` |
| offers | `offers.propose_send_quotation` | COMMIT | POST `/kisaan/requirements/:uuid/quotations` ✋ | `quotation.send` |
| coupons | `coupons.list_my_coupons` · `coupons.get_coupon_report` · `coupons.get_store_coupons` · `coupons.validate_coupon` | READ | GET `/kisaan/me/store/coupons`, `/kisaan/me/store/coupons/:uuid/report`, `/kisaan/public/stores/:slug/coupons`, POST `/kisaan/coupons/validate` | — |
| coupons | `coupons.draft_coupon` | DRAFT | AL (task state) | — |
| coupons | `coupons.propose_create_coupon` | COMMIT | POST `/kisaan/me/store/coupons` ✋ (`created_via: ai`) | `coupon.publish` |
| coupons | `coupons.propose_pause_or_resume` | COMMIT | POST `/kisaan/me/store/coupons/:uuid/pause` · `/resume` ✋ | `coupon.pause_resume` |
| membership | `membership.get_plans` · `membership.get_my_membership` · `membership.get_terms` | READ | GET `/kisaan/public/membership/plans`, `/kisaan/me/membership`, `/kisaan/public/legal/membership_tc` | — |
| membership | `membership.propose_purchase` | COMMIT | client: POST `/kisaan/legal/acceptances` then POST `/kisaan/memberships` ✋ (T&C acceptance on the membership screen, never by voice alone) | `membership.subscribe` |
| membership | `membership.propose_cancel_or_autorenew` | COMMIT | POST `/kisaan/me/membership/cancel` ✋ or PUT `/kisaan/me/membership/auto-renew` ✋ | `membership.cancel` · `membership.autorenew` |
| groups | `groups.search_groups` · `groups.get_group` | READ | GET `/kisaan/public/groups`, `/kisaan/public/groups/:slug` | — |
| groups | `groups.get_my_commitment` | READ | GET `/kisaan/groups/:uuid/my-commitment` (own row only) | — |
| groups | `groups.get_leader_summary` | READ | GET `/kisaan/groups/:uuid/members` (leader allow-list projection; other fields → `403 GROUP_FORBIDDEN_FIELD`) | — |
| groups | `groups.draft_group` | DRAFT | AL (task state) | — |
| groups | `groups.propose_create_group` | COMMIT | POST `/kisaan/groups` ✋ then POST `/kisaan/groups/:uuid/publish` | `group.create` |
| groups | `groups.propose_update_group` | COMMIT | PATCH `/kisaan/groups/:uuid` ✋ | `group.update` |
| groups | `groups.propose_join_and_commit` · `groups.propose_change_commitment` · `groups.propose_leave_group` | COMMIT | POST `/kisaan/groups/:uuid/join` ✋, PATCH `/kisaan/groups/:uuid/membership` ✋, POST `/kisaan/groups/:uuid/leave` ✋ | `group.commit` · `group.change_commitment` · `group.leave` |
| groups | `groups.list_group_offers` | READ | GET `/kisaan/groups/:uuid/offers` | — |
| groups | `groups.propose_accept_group_offer` | COMMIT | POST `/kisaan/groups/:uuid/offers/:offer_uuid/accept` ✋ | `group.accept_offer` |
| groups | `groups.propose_lock_group_order` | COMMIT | POST `/kisaan/groups/:uuid/lock` ✋ (one group-eligible coupon via `coupon_code`) | `group.lock` (+ `group.apply_coupon` when a coupon is set) |
| groups | `groups.propose_confirm_receipt` | COMMIT | POST `/kisaan/group-orders/:uuid/leader-receipt` ✋ (leader) or `/kisaan/group-allocations/:uuid/confirm-receipt` ✋ (member) | `group.confirm_receipt` |
| orders | `orders.list_my_orders` · `orders.get_order` · `orders.get_documents` | READ | GET `/kisaan/orders`, `/kisaan/orders/:uuid`, `/kisaan/orders/:uuid/documents` | — |
| orders | `orders.propose_place_order` | COMMIT | POST `/kisaan/checkout/orders` ✋ (needs a `checkout` quote) | `order.confirm` |
| orders | `orders.propose_cancel_order` · `orders.propose_mark_ready` · `orders.propose_confirm_receipt` | COMMIT | POST `/kisaan/orders/:uuid/cancel` · `/ready` · `/confirm-receipt` ✋ | `order.cancel` · `order.mark_ready` · `order.confirm_receipt` |
| orders | `orders.propose_raise_dispute` | COMMIT | POST `/kisaan/orders/:uuid/disputes` ✋ | `dispute.raise` |
| payments | `payments.list_pending` · `payments.get_status` · `payments.get_invoice` | READ | GET `/kisaan/me/payments?status=pending`, `/kisaan/payments/:uuid`, `/kisaan/invoices?order_uuid=` (+ `/:uuid/pdf`) | — |
| payments | `payments.propose_pay` | COMMIT | POST `/kisaan/payments` (order / membership) or POST `/kisaan/group-allocations/:uuid/confirm-and-pay` ✋ (group member) — then the PA's own authentication | `payment.initiate` |
| logistics | `logistics.get_fee_estimate` | READ | GET `/api/v2/delivery/fee-estimate` (EXISTING-OPSAPI; labelled estimate) | — |
| logistics | `logistics.draft_transport_request` | DRAFT | POST `/kisaan/transport-requests` (draft; P2) | — |
| logistics | `logistics.propose_publish_transport_request` | COMMIT | POST `/kisaan/transport-requests/:uuid/publish` ✋ (P2) | `transport.publish_request` |
| logistics | `logistics.get_transport_request` · `logistics.get_shipment` · `logistics.get_transport_feed` | READ | GET `/kisaan/transport-requests/:uuid`, `/kisaan/shipments/:uuid`, `/kisaan/transport-requests/feed` | — |
| logistics | `logistics.compare_quotes` | READ | AL over `logistics.get_transport_request` output (deterministic) | — |
| logistics | `logistics.propose_accept_quote` · `logistics.propose_submit_quote` | COMMIT | POST `/kisaan/transport-quotes/:uuid/accept` ✋, POST `/kisaan/transport-requests/:uuid/quotes` ✋ (P2) | `transport.accept_quote` · `transport.submit_quote` |
| logistics | `logistics.propose_shipment_event` | COMMIT | POST `/kisaan/shipments/:uuid/events` ✋ | `shipment.event` |
| support | `support.search_help` | READ | AL retriever over the KISAAN help/policy corpus | — |
| support | `support.get_policy` · `support.get_grievance_officer` | READ | GET `/kisaan/public/legal/:doc_code`, `/kisaan/public/grievance-officer` | — |
| support | `support.create_ticket` · `support.add_ticket_message` · `support.request_human` | DRAFT | POST `/kisaan/support/tickets`, `/kisaan/support/tickets/:uuid/messages`, `/kisaan/support/callback-requests` (non-binding, private to the user and support) | — |

### 3.19 Approvals (module 19)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/approvals` | NEW-KISAAN | Create an approval request (UI inline confirm, KISAAN AI COMMIT tool, human support/field staff) | JWT or KISAAN AI service key + on-behalf | self / KISAAN AI service (`kisaan_approvals.create`) | 🔁 |
| GET | `/api/v2/kisaan/approvals?status=pending` | NEW-KISAAN | My pending approvals (shown as cards) | JWT | self | — |
| GET | `/api/v2/kisaan/approvals/:uuid` | NEW-KISAAN | Detail incl. localised summary | JWT | principal | — |
| POST | `/api/v2/kisaan/approvals/:uuid/approve` | NEW-KISAAN | Approve (tap / voice readback / WhatsApp button / OTP) | JWT (**the principal only**; the AI service key can never approve) | principal | 🔁 |
| POST | `/api/v2/kisaan/approvals/:uuid/reject` | NEW-KISAAN | Reject | JWT | principal | 🔁 |
| POST | `/api/v2/kisaan/approvals/:uuid/otp` | NEW-KISAAN | Send OTP for `requires_otp` approvals (assisted/high-value, KIS-APR-007) | JWT | principal | — |

Create body (v0.2 additions): `tool_name` (exact catalogue name, AI only), `origin` (`ai_chat`, `ai_voice`, `ai_whatsapp`, `ui`, `support_assisted`, `field_assisted`, `system`) and `prompt_version` (AI only); `active_role` is resolved server-side and stored, never taken from the body. One `action_type` exists per COMMIT tool ([DATABASE_SCHEMA](DATABASE_SCHEMA.md) §12).

Rate limit: approve/reject 30/min per user. An approval is bound to `user_id`, `action_type`, `target`, `params_hash` and `expires_at`. It is single-use: a stale or reused approval → `409 APPROVAL_INVALID`.

Approve request: `{ "channel": "app_tap" | "voice_readback" | "whatsapp_button" | "otp", "readback_transcript": "haan ji, 60 quintal 2300 te pakka", "otp": "123456" }`. Validation: the principal must equal `user_id`; status `pending`; not expired (15 min); for `voice_readback` the transcript must contain an affirmative intent **and** the KISAAN app must have played back the amount and qty (logged); `otp` required when `requires_otp`. Errors: `409 APPROVAL_EXPIRED`, `409 STATE_CONFLICT`, `403 NOT_PRINCIPAL`, `401 OTP_INVALID`.

#### Example: approve
```http
POST /api/v2/kisaan/approvals/ap_7f31d2e0-6a54-4c1b-9b7e-3e2d1c0b9a88/approve
Authorization: Bearer eyJ…(farmer's own token)
Idempotency-Key: 2b1a…
{ "channel": "voice_readback", "readback_transcript": "ਹਾਂ ਜੀ, ਪੱਕਾ ਕਰ ਦਿਓ" }
```
```json
{ "success": true,
  "data": { "uuid": "ap_7f31d2e0-…", "status": "approved", "action_type": "offer.accept", "params_hash": "c3ab8ff1…", "valid_until": "2026-11-15T17:45:00+05:30",
            "next": "Your app will now submit the action; you will see the confirmation." } }
```
The user's client (not the KISAAN AI runtime) then calls `POST /negotiations/:uuid/accept` with this `approval_request_id`. The API re-validates the approval (status, expiry, params hash, principal) and atomically marks it `executed`. The KISAAN AI runtime learns the outcome from the `kisaan.approval.*` / domain events (or the next turn's context) and resumes the conversation. It reports "done" only after the backend confirms `executed`. For `voice_readback`, the read-back is played by the client, but the approve call itself is made by the client after the user's explicit confirmation.

### 3.20 Seller stores (module 20) — 2A.4

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/public/stores/:slug` | NEW-KISAAN | Public store page data: profile, badges, rating, service area (district), active listings (with tiers), public coupons, open groups, policies. 301 for old slugs. | None | — | — |
| GET | `/api/v2/kisaan/public/stores/:slug/listings?page=` | NEW-KISAAN | Paginated store listings | None | — | — |
| GET | `/api/v2/public/stores/:slug`, `/:slug/products`, `/:slug/reviews` | EXISTING-OPSAPI | Base public store (reused for SEO fallbacks & reviews) | None | — | — |
| GET | `/api/v2/kisaan/me/store` | NEW-KISAAN | My store (auto-created on first publish, KIS-STORE-001) | JWT | seller | — |
| PATCH | `/api/v2/kisaan/me/store` ✋ (if AI-drafted) | NEW-KISAAN | Name, slug (once/30 days), banner, logo, description, policies (bumps `policies_version`), contact mode, location precision (district/village), store MOV `min_order_value` (KIS-STORE-004, D-123). Public-content changes drafted by KISAAN AI need a `store.publish` approval (`seller.propose_store_update`) | JWT | seller | — |
| POST | `/api/v2/kisaan/me/store/visibility` | NEW-KISAAN | v0.2 vacation mode (KIS-STORE-012): `{ "hidden": true, "reopen_on": "2026-12-01" }` → store and listings hidden from search; open orders unaffected | JWT | seller | — |
| POST | `/api/v2/kisaan/me/store/banner` · `/logo` | NEW-KISAAN | Image uploads | JWT | seller | 🔁 |
| GET | `/api/v2/kisaan/me/store/qr` | NEW-KISAAN | QR PNG/SVG (KIS-STORE-005) | JWT | seller | — |
| GET | `/api/v2/kisaan/me/store/analytics?from=&to=` | NEW-KISAAN | Views, shares, enquiries (KIS-STORE-008) | JWT | seller | — |
| PUT | `/api/v2/stores/:id` | EXISTING-OPSAPI | Underlying opsapi store update (called by Kisaan service, not clients) | — | — | — |

Slug validation: `^[a-z0-9](?:[a-z0-9-]{2,48}[a-z0-9])$`, profanity list (pa/hi/en), reserved words.

### 3.21 Wholesale pricing (module 21) — 2A.1

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/listings/:uuid/wholesale` | NEW-KISAAN | Tiers + whole-lot config | JWT | owner | — |
| PUT | `/api/v2/kisaan/listings/:uuid/wholesale` ✋ (live listing) | NEW-KISAAN | v0.1-compatible: replace the **active** config atomically (enable flag, up to 5 tiers, whole-lot, group defaults). Internally creates and publishes a new tier set. On a live listing it needs a `wholesale.publish` approval (UI inline or `pricing.propose_wholesale_tiers`) | JWT | owner, `If-Match` | — |
| POST | `/api/v2/kisaan/listings/:uuid/tier-sets` | NEW-KISAAN | v0.2: create a **draft** tier set (tiers incl. `unit_price` type, `starts_at`/`ends_at`, `eligible_buyer_types`, `max_order_qty`, `group_eligible`, group discount, `group_min_qty`, `group_min_paid_qty`) — `pricing.draft_wholesale_tiers` | JWT | owner | 🔁 |
| GET | `/api/v2/kisaan/listings/:uuid/tier-sets` | NEW-KISAAN | v0.2: active + scheduled + history | JWT | owner | — |
| POST | `/api/v2/kisaan/tier-sets/:uuid/publish` ✋ | NEW-KISAAN | v0.2: publish (→ `active`, or `scheduled` if `starts_at` is future). Approval `wholesale.publish`. `409 STATE_CONFLICT` on overlapping window; `422 TIER_RULES_VIOLATED`. Never changes existing reservations/orders (KIS-WHL-010). D-136: a seller may not worsen terms for a listing with a `forming` group whose deadline is < 24 h away (`409 STATE_CONFLICT`, `reason: group_deadline_protection`) | JWT | owner | 🔁 |
| POST | `/api/v2/kisaan/tier-sets/:uuid/disable` | NEW-KISAAN | v0.2: disable an active/scheduled set (falls back to list price) | JWT | owner | 🔁 |
| GET | `/api/v2/kisaan/public/listings/:uuid/price?qty=&unit=` | NEW-KISAAN | Public price calculator (tier/whole-lot applied) for product page & search (KIS-WHL-007) | Optional JWT | — | — |
| — | ~~`/api/v2/kisaan/listings/:uuid/wholesale/suggest`~~ | — | **Removed in v0.2.** Tier suggestions are drafted inside the KISAAN AI module (`pricing.draft_wholesale_tiers`, using `market.get_mandi_prices` and listing data) or by the UI's tier editor; nothing is persisted until a tier set is created | — | — | — |

PUT body:
```json
{ "enabled": true,
  "tiers": [ { "min_qty": { "value": "50", "unit": "qtl" }, "discount_type": "percentage", "value": "5" },
             { "min_qty": { "value": "80", "unit": "qtl" }, "discount_type": "fixed_per_unit", "value": "200.00", "value_per_unit": "qtl" } ],
  "whole_lot": { "enabled": true, "price": { "amount": "2230.00", "per_unit": "qtl" } },
  "group_buy": { "enabled": true, "discount_type": "fixed_per_unit", "value": "50.00", "value_per_unit": "qtl", "min_group_qty": { "value": "100", "unit": "qtl" } },
  "tier_defaults": { "applies_to_group_total": true, "eligible_buyer_kinds": ["normal", "bulk"], "starts_at": null, "ends_at": null },
  "max_order_qty": { "value": "500", "unit": "qtl" },
  "approval_request_id": "ap_wh_12…" }
```
Tier `discount_type` ∈ `percentage` · `fixed_per_unit` · `unit_price` (v0.2: seller types the tier price directly, e.g. 10 kg → ₹48/kg). Validation (KIS-WHL-003): ≤ 5 tiers; strictly increasing `min_qty`; non-decreasing effective discount; `min_qty ≥ MOQ`; effective price ≥ price floor and > 0; whole-lot price < list price; group discount: percentage ≤ 50, fixed > 0, `min_group_qty ≥ MOQ`, and the price after tier + group discount must stay ≥ floor (D-103). `approval_request_id` is required when the change was drafted by KISAAN AI (`wholesale.publish`). Errors: `422 TIER_RULES_VIOLATED` / `GROUP_DISCOUNT_INVALID` with per-field `details`, `412 VERSION_CONFLICT`, `409 APPROVAL_INVALID`. Rate: authenticated write. Changes never affect existing reservations or orders (KIS-WHL-010).

### 3.22 Buying groups & group orders (module 22) — 2A.2

Owner doc for rules: [WHOLESALE_AND_GROUP_BUYING](WHOLESALE_AND_GROUP_BUYING.md); pricing at join/lock: [PRICING_ENGINE](PRICING_ENGINE.md) §8. **Canonical v0.2 flow (reconciliation R5, D-72):** commit (no payment) → seller offers (requirement-bound groups, MVP per D-133) → leader **locks** ✋ (final price, ≤ 1 group-eligible coupon) → each member confirms and pays **their own** allocation within the payment window (default 24 h, D-124) → unpaid members are `released` → if paid quantity < seller minimum (`group_min_qty`) the group enters `repricing` and the seller chooses **honour / re-offer / decline** (6 h, no answer = decline, D-132) → `confirmed` → `fulfilling` → `completed`.

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/groups` ✋ | NEW-KISAAN | Leader creates a group in `draft` (`basis: listing` or `rfq`; for `rfq` the group requirement is created with `owner_type = group`) | JWT | group_leader (verified) | 🔁 |
| POST | `/api/v2/kisaan/groups/:uuid/publish` | NEW-KISAAN | v0.2: `draft` → `forming`; publishes the group requirement (rfq basis) to matching sellers | JWT | leader | 🔁 |
| GET | `/api/v2/kisaan/public/groups/:slug` | NEW-KISAAN | **Public** group page: leader (name, "Verified Group Leader" badge, rating, disclaimer), area, product, target, committed and remaining qty, deadline, projected price (KIS-GROUP-004). Aggregates only | None | — | — |
| GET | `/api/v2/kisaan/public/groups?district=&commodity=&lat=&lng=&radius_km=` | NEW-KISAAN | Discover `forming` groups | None | — | — |
| GET | `/api/v2/kisaan/groups/:uuid` | NEW-KISAAN | Group detail for leader/co-leader/members (role-filtered) | JWT | leader, member | — |
| PATCH | `/api/v2/kisaan/groups/:uuid` ✋ | NEW-KISAAN | Edit description, extend deadline, change target (members notified). Only in `draft`/`forming` (`409 GROUP_NOT_FORMING`) | JWT | leader | — |
| POST | `/api/v2/kisaan/groups/:uuid/join` ✋ | NEW-KISAAN | Member **commits** a quantity. **No payment** (D-72). Response shows the guaranteed goods-price ceiling from a `group_join` quote (KIS-PRC-011). Members flagged in `kisaan_member_reliability.capture_at_commit_until` must pay at commit (R-130) | JWT | buyer (phone-verified) | 🔁 |
| GET | `/api/v2/kisaan/groups/:uuid/my-commitment` | NEW-KISAAN | **Own** commitment, price basis (projected/locked), own payable, payment status and deadline (`groups.get_my_commitment`) | JWT | member (own row only) | — |
| PATCH | `/api/v2/kisaan/groups/:uuid/membership` ✋ | NEW-KISAAN | Change own committed qty — before lock only | JWT | member | 🔁 |
| POST | `/api/v2/kisaan/groups/:uuid/leave` ✋ | NEW-KISAAN | Withdraw before lock (member → `released`, `release_reason = withdrew`; nothing was charged). After lock a member who does not want to pay simply lets the window lapse; after payment, cancellation follows order rules | JWT | member | 🔁 |
| GET | `/api/v2/kisaan/groups/:uuid/members` | NEW-KISAAN | Leader/co-leader view — allow-list only: `display_name_public` (or "Member N" if `name_visible_to_leader = false`), committed qty, status (`committed`/`payment_due`/`paid`/`released`). **Never** phone, address, payment instrument, payment IDs or amounts other than qty × unit price; any field request outside the allow-list → `403 GROUP_FORBIDDEN_FIELD` (D-104) | JWT | leader, co-leader | — |
| POST | `/api/v2/kisaan/groups/:uuid/members/:member_uuid/remove` | NEW-KISAAN | v0.2: leader removes a member before lock with a reason (shown to the member, audit-logged) | JWT | leader | 🔁 |
| POST | `/api/v2/kisaan/groups/:uuid/co-leader` · `/handover` | NEW-KISAAN | v0.2: appoint a co-leader / hand leadership over (recipient must be a verified leader and accept) | JWT | leader | 🔁 |
| POST | `/api/v2/kisaan/groups/:uuid/offers` ✋ (if AI-drafted) | NEW-KISAAN | Seller sends a **group offer** (`offer_kind`, price/kg, `group_min_total_qty`, `max_total_qty`, `group_min_paid_qty`, delivery terms incl. `seller_delivery_fee`, validity) → negotiation `context_type = group_offer` | JWT | seller (verified) | 🔁 |
| GET | `/api/v2/kisaan/groups/:uuid/offers` | NEW-KISAAN | Offers for the group with an engine-computed group price per member qty (`groups.list_group_offers`). Leader sees full terms; members see seller, price, terms and validity (no seller contact data before order) | JWT | leader, members | — |
| POST | `/api/v2/kisaan/groups/:uuid/offers/:offer_uuid/share` | NEW-KISAAN | v0.2: leader shares an offer with members (creates an `offer_shared` announcement) | JWT | leader | — |
| POST | `/api/v2/kisaan/groups/:uuid/offers/:offer_uuid/accept` ✋ | NEW-KISAAN | v0.2: leader accepts a group offer as the price basis (`group.accept_offer`). Members are asked to re-confirm only if their goods price would exceed their guaranteed ceiling | JWT | leader | 🔁 |
| POST | `/api/v2/kisaan/groups/:uuid/coupon` | NEW-KISAAN | v0.2: leader sets (or clears) the one group-eligible coupon before lock (validated, not reserved; reserved at lock) | JWT | leader | — |
| POST | `/api/v2/kisaan/groups/:uuid/lock/preview` | NEW-KISAAN | READ: per-member indicative quote at the current committed total, with optional `coupon_code` and accepted offer. Nothing is reserved | JWT | leader | — |
| POST | `/api/v2/kisaan/groups/:uuid/lock` ✋ | NEW-KISAAN | Leader **locks**: price basis (listing tier set + group discount, or the accepted group offer), at most **one group-eligible coupon** (D-103), `group_lock` quotes (group + per member), inventory reservation for the committed total (TTL = payment window), group → `locked`, members → `payment_due` | JWT | leader | 🔁 |
| POST | `/api/v2/kisaan/group-allocations/:uuid/confirm-and-pay` ✋ | NEW-KISAAN | Member confirms **their own** line at the locked price and gets the PA payment order (KIS-GROUP-006; replaces v0.1 `/pay`). The member pays the PA directly — the leader never collects money | JWT | member (own allocation) | 🔁 |
| POST | `/api/v2/kisaan/groups/:uuid/shortfall-decision` ✋ | NEW-KISAAN | v0.2 (R5, D-132): seller's decision while the group is `repricing`: `{ "decision": "honour" \| "re_offer" \| "decline", "new_offer"?: {…} }`. `honour` → `confirmed` at the locked price for paid members (`honour_locked_price = true`); `re_offer` → new offer, paid members re-confirm (a member's unit price never increases without their re-confirmation); `decline` → `cancelled`, full refunds. Deadline 6 h, no response = `decline` | JWT | seller of the locked basis | 🔁 |
| POST | `/api/v2/kisaan/groups/:uuid/cancel` ✋ | NEW-KISAAN | Leader cancels in `draft`/`forming`, or after lock before any payment (v0.2; the v0.1 `/close` endpoint is **removed** — its `proceed_partial` path is now the automatic `repricing` rule) | JWT | leader | 🔁 |
| GET | `/api/v2/kisaan/group-orders/:uuid` | NEW-KISAAN | Group order + allocations + shipment | JWT | leader, seller, member (own allocation only) | — |
| POST | `/api/v2/kisaan/group-orders/:uuid/leader-receipt` ✋ | NEW-KISAAN | Leader confirms bulk receipt at the drop point (seller/transporter OTP) (KIS-GROUP-010) | JWT | leader | 🔁 |
| POST | `/api/v2/kisaan/group-allocations/:uuid/collect` | NEW-KISAAN | v0.2: member collects own share at the drop point with their own allocation OTP | JWT | member / leader at drop point | 🔁 |
| POST | `/api/v2/kisaan/group-allocations/:uuid/confirm-receipt` ✋ | NEW-KISAAN | Member confirms own allocation (or disputes) | JWT | member | 🔁 |
| GET/POST | `/api/v2/kisaan/groups/:uuid/announcements` | NEW-KISAAN | Leader → members announcements (`kisaan_group_announcements`; phone/UPI masked) (KIS-GROUP-015) | JWT | leader/co-leader post, members read | — |

**Lock request:** `{ "price_basis": "listing" | "group_offer", "offer_uuid"?: "…", "coupon_code"?: "GROUP5", "payment_window_hours"?: 24, "approval_request_id": "ap_…" }`. **Group states:** `draft → forming → locked → (repricing) → confirmed → fulfilling → completed`, plus `cancelled`, `expired` (join deadline passed without lock); `target_reached` is a derived flag, not a state. **Member states:** `committed → payment_due → paid`, or `released` (`release_reason`: lapsed_unpaid, withdrew, removed_by_leader, group_cancelled, declined_reoffer). Fulfilment (`collected`, `received`, `disputed`, `refunded`) lives on the allocation. At window expiry unpaid allocations are released (a reliability strike is recorded). If paid quantity ≥ `group_min_qty` the group becomes `confirmed` at the locked price; otherwise `repricing`.

**Coupon allocation:** a group coupon counts as one redemption against the coupon (and the leader's per-user limit), not against each member's per-user limit. The discount is allocated pro-rata by member goods value with paise rounding by largest remainder. A fixed-amount coupon is **not** redistributed to remaining members when someone lapses; it is re-allocated only at a re-offer re-lock.

Validation (lock): status `forming`; not suspended; committed total ≥ `min_close_qty`; for `group_offer` the offer is accepted and its `group_min_total_qty` is met; the coupon is `group_eligible`, active, not admin-disabled, inside `valid_days_of_week`/`valid_hours`, and passes min-order/qty rules on the group total; no coupon if the basis is a negotiated offer with `coupon_allowed = false`; inventory is available for the total. Errors: `409 GROUP_NOT_FORMING`, `409 GROUP_BELOW_MINIMUM`, `409 INSUFFICIENT_STOCK`, `422 COUPON_NOT_APPLICABLE` (`reason: not_group_eligible|negotiated_price|…`), `422 COUPON_OUTSIDE_HOURS`, `409 STATE_CONFLICT`, `409 APPROVAL_INVALID`, `403 GROUP_CONTEXT_INVALID`. Response: `group_order_uuid`, `payment_window_ends_at`, per-member allocation summary (leader gets only the allow-list projection), and the breakdown (wholesale tier, group discount, coupon total, delivery total). Each member is notified with **their own** payable via `kisaan.group.member_payment_due`.

#### Example: create group
```http
POST /api/v2/kisaan/groups
X-Kisaan-Active-Role: group_leader
Idempotency-Key: 4e3d…
{ "basis": "listing", "listing_uuid": "kinnow-7c1e…",
  "title": "Dugri Phase 2 — Abohar Kinnow peti",
  "area": { "name": "Dugri Phase 2, Ludhiana", "district_code": "LDH", "lat": 30.8695, "lng": 75.8380, "radius_km": 3 },
  "drop_point_address_uuid": "addr_dp_88…",
  "target_qty": { "value": "2000", "unit": "kg" }, "min_close_qty": { "value": "1500", "unit": "kg" },
  "member_min_qty": { "value": "20", "unit": "kg" }, "member_max_qty": { "value": "200", "unit": "kg" },
  "join_deadline": "2026-11-20T20:00:00+05:30", "payment_window_hours": 24, "delivery_strategy": "single_drop", "visibility": "public",
  "approval_request_id": "ap_aa90…" }
```
```json
{ "success": true,
  "data": { "uuid": "g_51c2…", "slug": "dugri-phase-2-abohar-kinnow", "status": "draft", "next": "POST /groups/g_51c2…/publish to start accepting commitments",
            "public_url": "https://kisaan.in/groups/dugri-phase-2-abohar-kinnow",
            "public_summary": { "en": "Simran K. (verified leader ★4.8) is leading Dugri Phase 2, Ludhiana to buy 2,000 kg of Kinnow", "pa": "…", "hi": "…" },
            "projected_price_per_kg": "38.0000", "list_price_per_kg": "42.0000", "applied": "wholesale_tier_2 (1,500+ kg)",
            "money_model": "member_direct",
            "notice": "Each member pays KISAAN's payment partner directly. The leader never collects money." } }
```

#### Example: join group (member commits)
```http
POST /api/v2/kisaan/groups/g_51c2…/join
Idempotency-Key: 6a5b…
{ "qty": { "value": "40", "unit": "kg" }, "approval_request_id": "ap_bb12…" }
```
```json
{ "success": true,
  "data": { "member_uuid": "gm_0193…", "status": "committed", "committed_qty_kg": "40.000",
            "guaranteed_goods_ceiling": "1520.00", "price_basis": "₹38.00/kg ceiling at the minimum close qty (group_join quote q_gj_…); final price fixed when the leader locks",
            "payment": null, "payment_due": "after lock; you will get 24 h to pay your own share",
            "group_progress": { "committed_kg": "1180.000", "target_kg": "2000.000", "pct": 59, "members": 24 } } }
```

### 3.23 Bulk buyer / group leader signup (module 23)

**Bulk buyer (D-104).** This is a separate onboarding path from normal buyer signup (`/signup/bulk-buyer` screen).

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/bulk-buyer/onboarding` | NEW-KISAAN | Create the bulk-buyer profile and set `buyer_kind = 'bulk'` (KIS-BULK-001) | JWT (phone verified) | self | 🔁 |
| GET/PATCH | `/api/v2/kisaan/me/bulk-buyer-profile` | NEW-KISAAN | View/update procurement profile (`If-Match`) | JWT | self | — |
| POST | `/api/v2/kisaan/me/bulk-buyer-profile/verification` | NEW-KISAAN | Submit GSTIN / business documents for business verification (private KYC bucket) | JWT | self | 🔁 |
| GET/PUT | `/api/v2/kisaan/me/preferred-sellers` | NEW-KISAAN | v0.2: buyer's private preferred-seller list `[{store_uuid, commodity_code?, note?}]` (`kisaan_buyer_preferred_sellers`); used as a matching boost; sellers never see it | JWT | buyer | — |
| GET | `/api/v2/kisaan/seller/bulk-demand?commodity=&district=` | NEW-KISAAN | Seller view of **aggregated** bulk demand (counts and qty bands per commodity/district). No buyer identities | JWT | seller | — |

Onboarding request: `{ "business_type": "processor", "business_name": "Moga Atta Mills", "required_commodities": ["wheat"], "typical_order_qty": { "value": "200", "unit": "qtl" }, "purchase_frequency": "monthly", "delivery_district_codes": ["MOG", "LDH"], "budget_range_inr": { "min": "400000.00", "max": "600000.00" }, "quality_requirements": { "wheat": { "moisture_pct": { "max": 12 } } }, "preferred_store_uuids": [], "gstin": "03ABCDE1234F1Z5" }`. Validation: business type enum; commodities exist; qty > 0; budget min ≤ max (budget is private and never shown to sellers); GSTIN format (checksum) if given; district codes valid. Errors: `409 DUPLICATE` (profile exists), `422 VALIDATION_FAILED`. Rate: authenticated write. Response: the profile with `business_verification_status: unverified|pending`.

**Group leader signup.**

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/group-leader/applications` | NEW-KISAAN | **Separate leader signup** (KIS-GROUP-001): leader_type, organisation, area, proof of association doc, identity (T1+), acceptance of the group-leader agreement | JWT (buyer role, phone verified) | self | 🔁 |
| GET | `/api/v2/kisaan/group-leader/applications/me` | NEW-KISAAN | Status & missing items | JWT | self | — |
| POST | `/api/v2/kisaan/group-leader/applications/me/documents` | NEW-KISAAN | Upload area proof (private KYC bucket) | JWT | self | 🔁 |
| GET | `/api/v2/kisaan/public/group-leaders/:user_uuid` | NEW-KISAAN | Public leader profile: display name, area, "Verified Group Leader" badge, groups run, completion rate, rating, and the mandatory disclaimer `"Group leaders are independent KISAAN users, not KISAAN employees or representatives."` (KIS-GROUP-002, D-104) | None | — | — |
| POST | `/api/v2/kisaan/admin/group-leader/applications/:uuid/decision` | NEW-KISAAN | Verifier approves/rejects → grants `group_leader` role | JWT | verifier | 🔁 |

Request (application): `{ "leader_type": "rwa", "organisation_name": "Dugri Phase 2 Residents Welfare Assoc.", "area": {...}, "identity_verification_uuid": "…", "agreement": { "doc_code": "group_leader_agreement", "version": "1.0.0", "language": "pa" } }`. Errors: `403 KYC_TIER_REQUIRED` (T1), `409 DUPLICATE` (pending application exists), `409 TERMS_VERSION_OUTDATED`.

### 3.24 Membership & T&C acceptance (module 24) — 2A.3

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/public/membership/plans` | NEW-KISAAN | Plans, benefits (MVP list), prices, trial | None | — | — |
| GET | `/api/v2/kisaan/public/legal/:doc_code?lang=&version=` | NEW-KISAAN | Current (or specific) legal document text + version + sha256 | None | — | — |
| POST | `/api/v2/kisaan/legal/acceptances` | NEW-KISAAN | Record acceptance of a specific doc version (append-only) | JWT | self | 🔁 |
| GET | `/api/v2/kisaan/me/legal/acceptances` | NEW-KISAAN | My acceptance history | JWT | self | — |
| POST | `/api/v2/kisaan/memberships` ✋ | NEW-KISAAN | Subscribe: plan + **terms acceptance** + auto-renew choice → payment/mandate | JWT | buyer | 🔁 |
| GET | `/api/v2/kisaan/me/membership` | NEW-KISAAN | Status, period, benefits used/remaining, next renewal & pre-debit info | JWT | self | — |
| POST | `/api/v2/kisaan/me/membership/cancel` ✋ | NEW-KISAAN | Cancel (≤ 2 taps / one voice command); stops renewal; refund per KIS-MEMBER-009 | JWT | self | 🔁 |
| PUT | `/api/v2/kisaan/me/membership/auto-renew` ✋ | NEW-KISAAN | Toggle auto-renew (turning on requires mandate setup; `membership.autorenew`) | JWT | self | — |
| POST | `/api/v2/kisaan/me/membership/re-accept-terms` | NEW-KISAAN | Accept a materially changed T&C version | JWT | self | 🔁 |

Validation: `terms.version` must equal the current `membership_tc` version for the language, else `409 TERMS_VERSION_OUTDATED`. `terms.body_sha256` must match. `auto_renew` defaults to **false** and must be explicitly set (KIS-MEMBER-007). A trial is not allowed if the identity key has had a trial (KIS-MEMBER-004 → `409 TRIAL_ALREADY_USED`). **No autopay is tied to a trial** (D-11, T&C): with `start_trial: true`, `auto_renew` must be false and no `mandate_method` may be sent (`422 TRIAL_NO_MANDATE`). The trial ends automatically; the user buys a plan separately (that request creates the mandate if auto-renew is chosen).

#### Example: subscribe with T&C acceptance
```http
POST /api/v2/kisaan/memberships
X-Kisaan-Active-Role: buyer
Idempotency-Key: 9c8b…
Accept-Language: hi

{ "plan_code": "plus_yearly",
  "start_trial": true,
  "auto_renew": false,
  "terms": { "doc_code": "membership_tc", "version": "1.0.0", "language": "hi",
             "body_sha256": "4a7d1ed414474e4033ac29ccb8653d9b0b2c5f8f3c1c9d9b2a1e0f5c6d7e8f90",
             "statement_shown": "मैंने KISAAN Plus सदस्यता नियम व शर्तें (v1.0.0) पढ़ ली हैं और स्वीकार करता/करती हूँ। ट्रायल 30 दिन बाद अपने-आप समाप्त हो जाएगा और कोई ऑटो-डेबिट नहीं होगा।",
             "checkbox_checked": true },
  "approval_request_id": "ap_mem_31…" }
```
```json
{ "success": true,
  "data": { "membership": { "uuid": "mem_7d6e…", "plan_code": "plus_yearly", "status": "trial",
                            "current_period_start": "2026-11-14T10:40:00+05:30", "current_period_end": "2026-12-14T10:40:00+05:30",
                            "auto_renew": false, "trial_ends_automatically_on": "2026-12-14", "charge_scheduled": null },
            "terms_acceptance": { "uuid": "ta_0a1b…", "doc_code": "membership_tc", "version": "1.0.0", "language": "hi", "accepted_at": "2026-11-14T10:40:02+05:30" },
            "benefits": [ { "code": "free_delivery", "per_order_cap": "500.00", "monthly_cap": "2000.00" }, { "code": "member_prices" }, { "code": "early_access", "hours": 2 }, { "code": "priority_support" } ] } }
```
Missing or outdated T&C → `409 TERMS_NOT_ACCEPTED` / `TERMS_VERSION_OUTDATED`. The membership is **never** activated without a stored acceptance (DB NOT NULL FK).

### 3.25 Coupons (module 25) — 2A.6

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/me/store/coupons` ✋ (if AI-drafted, or `status` ≠ `draft`) | NEW-KISAAN | Create coupon. With `status: draft` it is saved privately; creating it `active`/`scheduled` makes it usable by buyers and needs a `coupon.publish` approval (UI inline or `coupons.propose_create_coupon`) | JWT | seller | 🔁 |
| GET | `/api/v2/kisaan/me/store/coupons?status=` | NEW-KISAAN | List | JWT | seller | — |
| GET/PATCH | `/api/v2/kisaan/me/store/coupons/:uuid` | NEW-KISAAN | Edit (limits/time/status). Code/type immutable after first redemption. | JWT | owner, `If-Match` | — |
| POST | `/api/v2/kisaan/me/store/coupons/:uuid/activate` ✋ (if AI-drafted) | NEW-KISAAN | Publish a `draft` coupon (`coupon.publish` approval when drafted by KISAAN AI) | JWT | owner | 🔁 |
| POST | `/api/v2/kisaan/me/store/coupons/:uuid/pause` · `/resume` ✋ (if AI-drafted) | NEW-KISAAN | Status (`coupon.pause_resume`). `resume` → `403 COUPON_ADMIN_DISABLED` if the platform disabled it | JWT | owner | — |
| POST | `/api/v2/kisaan/me/store/coupons/:uuid/archive` | NEW-KISAAN | v0.2: hide an expired/exhausted/paused coupon from the list (history kept) | JWT | owner | — |
| GET | `/api/v2/kisaan/me/store/coupons/:uuid/report` | NEW-KISAAN | Redemptions, discount given, GMV influenced (KIS-COUPON-010) | JWT | owner | — |
| POST | `/api/v2/kisaan/coupons/validate` | NEW-KISAAN | Validate a code for a cart/quote context (no reservation) | JWT | buyer | — |
| GET | `/api/v2/kisaan/public/stores/:slug/coupons` | NEW-KISAAN | Public coupons (KIS-COUPON-007) with real end times (KIS-COUPON-009) | None | — | — |
| — | `/api/v2/billing/coupons`, `/api/v2/public/billing/coupons/check` | EXISTING-OPSAPI | Platform **billing** coupons, not used for seller coupons. Candidate for Future platform coupons (KIS-COUPON-012). | — | — | — |

#### Example: create coupon
```http
POST /api/v2/kisaan/me/store/coupons
Idempotency-Key: c0de…
{ "code": "KANAK2", "title": "2% off on wheat", "discount_type": "percentage", "discount_value": "2",
  "max_discount_amount": "3000.00", "min_order_value": "50000.00", "min_qty": { "value": "20", "unit": "qtl" },
  "applies_to": "listings", "listing_uuids": ["5d1f7c2a-9e3b-4d8a-b6c1-2e3f4a5b6c7d"],
  "starts_at": "2026-11-14T00:00:00+05:30", "ends_at": "2026-11-30T23:59:59+05:30",
  "total_usage_limit": 20, "per_user_limit": 1, "budget_limit": "40000.00", "eligible_segments": ["ALL"], "group_eligible": false, "count_per_member": false,
  "valid_days_of_week": [1,2,3,4,5,6,7], "valid_hours": { "from": "06:00", "to": "20:00" },
  "allow_on_negotiated": false, "visibility": "public", "status": "active" }
```
```json
{ "success": true, "data": { "uuid": "cp_8e7f…", "code": "KANAK2", "status": "active", "created_via": "ui", "funded_by": "seller", "used_count": 0, "remaining": 20, "budget_remaining": "40000.00" } }
```

#### Example: apply / validate coupon
```http
POST /api/v2/kisaan/coupons/validate
{ "code": "kanak2", "listing_uuid": "5d1f7c2a-…", "qty": { "value": "60", "unit": "qtl" } }
```
```json
{ "success": true,
  "data": { "valid": true, "code": "KANAK2", "discount_amount": "2793.00", "applies_after": "wholesale_tier_1",
            "stacking_note": "Max one seller coupon per order; not valid with negotiated prices", "ends_at": "2026-11-30T23:59:59+05:30", "uses_left_for_you": 1 } }
```
Create validation: `count_per_member` (boolean, default false) is only allowed when `group_eligible` is true — false = a group coupon is one redemption (leader), true = it also consumes each paying member's `per_user_limit`. `code` `^[A-Z0-9]{4,20}$`, unique per store; percentage 0 < v ≤ 50 with `max_discount_amount` required; fixed > 0. At apply time the computed discount is capped at **50% of the eligible goods value** for any coupon type (D-40; DB CHECK on `kisaan_coupon_redemptions`); `ends_at > starts_at`; `eligible_segments` ⊆ {`ALL`, `NEW_CUSTOMER`, `EXISTING_CUSTOMER`, `BULK_BUYERS`, `GROUP_ORDERS`, `MEMBERS`} (`ALL` alone; v0.1 `FIRST_TIME_BUYER`→`NEW_CUSTOMER`, `GROUP_LEADERS`/`group_buyer`→`GROUP_ORDERS`); `eligible_user_ids` ≤ 500 and only for `visibility: private`; `GROUP_ORDERS` requires `group_eligible: true`; `valid_days_of_week` ⊆ 1–7; `valid_hours` one well-formed IST window; `per_user_limit` 1–100; `total_usage_limit` 1–100,000; `budget_limit` > 0 if set; `ends_at ≤ starts_at + 365 days`; ≤ 20 active+scheduled coupons per store. Statuses: `draft`, `scheduled`, `active`, `paused`, `expired`, `exhausted` (usage or budget), `disabled` (admin), `archived`. A seller cannot set `funded_by = platform` or touch admin flags. Errors: `422 VALIDATION_FAILED`, `409 DUPLICATE`. Rate: 30 coupon writes/hour per store.

Invalid example: `422 COUPON_OUTSIDE_HOURS` (outside `valid_days_of_week`/`valid_hours`), or `422 COUPON_NOT_APPLICABLE` with `context.reason ∈ {expired, not_started, outside_valid_hours, budget_exhausted, admin_disabled, not_group_eligible, segment_not_eligible, paused, min_order_not_met, min_qty_not_met, listing_not_eligible, user_not_eligible, per_user_limit_reached, negotiated_price, self_redemption}`; or `409 COUPON_EXHAUSTED`. The actual reservation of a use happens in `POST /checkout/quote` (§3.10) and is committed on payment capture.

---

## 4. Supporting modules

### 4.1 Mandi prices (MKT)

| Method | Path | Tag | Purpose | Auth |
|---|---|---|---|---|
| GET | `/api/v2/kisaan/public/mandi/prices?commodity=&market=&district=&from=&to=` | NEW-KISAAN | Daily min/max/modal with source, date, `stale` flag (KIS-MKT-003) | None |
| GET | `/api/v2/kisaan/public/mandi/compare?commodity=&markets=` | NEW-KISAAN | Inter-market comparison (KIS-MKT-005) | None |
| GET | `/api/v2/kisaan/public/mandi/trend?commodity=&market=&days=30` | NEW-KISAAN | Series where data exists (no forecasts, KIS-MKT-006) | None |
| GET | `/api/v2/kisaan/public/msp?commodity=` | NEW-KISAAN | MSP with season & source (KIS-MKT-007) | None |
| GET | `/api/v2/kisaan/public/trade-rules?category=&state=` | NEW-KISAAN | Whether checkout is enabled for a category in a state (UI mode switch, KIS-CMP-046) | None |

Response rows always include `source`, `source_dataset`, `arrival_date`, `fetched_at`, `quality_flags`.

### 4.2 Support & disputes (SUP, DSP)

| Method | Path | Tag | Purpose | Auth |
|---|---|---|---|---|
| POST | `/api/v2/kisaan/support/tickets` | NEW-KISAAN | Create ticket `{category, summary, refs}` — UI or `support.create_ticket` (DRAFT class: private, non-binding) | JWT |
| GET | `/api/v2/kisaan/support/tickets[/:uuid]` | NEW-KISAAN | List / detail of my tickets | JWT |
| POST | `/api/v2/kisaan/support/tickets/:uuid/messages` | NEW-KISAAN | Reply | JWT |
| POST | `/api/v2/kisaan/support/callback-requests` | NEW-KISAAN | Phone callback for low-literacy users (KIS-SUP-004) | JWT |
| GET | `/api/v2/kisaan/public/grievance-officer` | NEW-KISAAN | Grievance officer details (KIS-SUP-005) `[LEGAL REVIEW]` | None |
| POST | `/api/v2/kisaan/orders/:uuid/disputes` ✋ | NEW-KISAAN | Raise dispute within the acceptance window → freezes settlement | JWT |
| GET | `/api/v2/kisaan/disputes/:uuid` | NEW-KISAAN | Status, timeline | JWT (party) |
| POST | `/api/v2/kisaan/disputes/:uuid/evidence` | NEW-KISAAN | Upload photos/weighbridge slip/statement | JWT (party) |
| POST | `/api/v2/kisaan/disputes/:uuid/respond` | NEW-KISAAN | Counter-party response | JWT (party) |

### 4.3 Uploads

Media uploads go through Kisaan endpoints (multipart), which store files via the opsapi MinIO helper/documents service (`/api/v2/documents/upload`, EXISTING-OPSAPI, used server-side). Voice clips and images for KISAAN AI go to `POST https://kisaan.in/api/ai/v1/uploads` (KISAAN-APP), which stores them through the same Kisaan upload endpoint. Clients never get write credentials to buckets. Read access uses signed URLs (KYC ≤ 5 min; listing media via public CDN for approved, non-KYC images only).

---

## 5. Events & webhooks

### 5.1 Domain events (published by the Kisaan plugin through the opsapi outbox; manifest `publishes`)

Delivery is at-least-once via the opsapi plugin event outbox (retries up to 8 times). Consumers: notification jobs, matching service, analytics, namespace webhooks (`/api/v2/namespace/webhooks`, EXISTING-OPSAPI) for partner integrations.

| Event | Payload (key fields) | Typical consumers |
|---|---|---|
| `kisaan.listing.published` / `.paused` / `.closed` / `.out_of_stock` | listing_uuid, seller_uuid, commodity, district, available_kg, list_price_per_kg | Matching, saved-search alerts, store cache |
| `kisaan.inventory.low_stock` | listing_uuid, available_kg, threshold_kg | Seller notification |
| `kisaan.inventory.reservation_expired` | reservation_uuid, listing_uuid, source | Notifications |
| `kisaan.requirement.published` | requirement_uuid, commodity, qty_kg, districts | Matching |
| `kisaan.offer.created` / `.countered` / `.accepted` / `.rejected` / `.expired` | negotiation_uuid, offer_uuid, round_no, parties | Notifications, KISAAN AI runtime (conversation updates) |
| `kisaan.order.created` / `.confirmed` / `.ready` / `.in_transit` / `.delivered` / `.completed` / `.cancelled` / `.payment_received_stock_unavailable` | order_uuid, status, totals | Notifications, invoices, settlement, analytics |
| `kisaan.payment.captured` / `.failed` / `.refunded` | payment_uuid, purpose, amount | Orders, finance |
| `kisaan.settlement.released` / `.frozen` | settlement_uuid, beneficiary_type | Finance, notifications |
| `kisaan.transport.request_created` / `.quote_submitted` / `.quote_accepted` | request/quote uuids | Transporters, requester |
| `kisaan.shipment.status_changed` | shipment_uuid, status | Buyer/seller notifications |
| `kisaan.group.created` / `.published` / `.target_reached` / `.cancelled` / `.expired` / `.member_committed` / `.member_released` | group_uuid, committed_kg, target_kg (v0.1 `.threshold_met`/`.closed`/`.member_joined`/`.member_left` renamed) | Members, leader, discovery |
| `kisaan.group.repricing_started` / `.repricing_decided` / `.confirmed` / `.offer_received` / `.offer_accepted` | group_uuid, decision?, paid_kg, group_min_qty_kg | Seller (decision needed), leader, members |
| `kisaan.tier_set.published` / `.scheduled_activated` / `.disabled` | listing_uuid, tier_set_uuid | Search index, open quotes, groups on the listing |
| `kisaan.membership.activated` / `.renewal_upcoming` / `.renewed` / `.payment_failed` / `.cancelled` / `.expired` | membership_uuid, period_end | Notifications (pre-debit notice), finance |
| `kisaan.coupon.exhausted` / `.expired` | coupon_uuid | Seller |
| `kisaan.dispute.opened` / `.resolved` | dispute_uuid, resolution | Finance, parties |
| `kisaan.verification.decided` | user_uuid, check_type, status | User notification, role activation |
| `kisaan.risk.flag_raised` | subject, score, reasons | Admin risk console |
| `kisaan.approval.created` / `.approved` / `.executed` / `.expired` | approval_uuid, action_type | KISAAN AI runtime (resumes `task_state`), notifications |
| `kisaan.group.locked` / `.member_payment_due` / `.allocation_released` | group_uuid, group_order_uuid, payment_window_ends_at | Members (own payable only), leader (aggregates), seller |
| `kisaan.coupon.admin_disabled` | coupon_uuid, reason | Seller, open quotes invalidated |
| `kisaan.mandi.prices_ingested` | date, records, markets | Price alerts |

Also consumed from opsapi core (`order` business events `confirmed`, `shipped`, `delivered`, `cancelled`, `paid`, `refunded`) for compatibility. KISAAN logic relies on its own `kisaan.*` events because payloads of core events mirror DB rows and may change between opsapi releases.

### 5.2 Inbound webhooks

| Source | Endpoint | Verification |
|---|---|---|
| Payment aggregator | `/api/v2/kisaan/public/webhooks/payments/:provider` | HMAC signature + server-side fetch |
| WhatsApp Cloud API | `https://kisaan.in/api/channels/whatsapp/webhook` (KISAAN-APP; GET verify token, POST events; D-102) | `X-Hub-Signature-256` with app secret |
| SMS provider DLRs | `/api/v2/kisaan/public/webhooks/sms/:provider` | Provider signature / IP allow-list |
| KYC provider (DigiLocker/aggregator) | `/api/v2/kisaan/public/webhooks/kyc/:provider` | Provider signature `[UNVERIFIED provider]` |

### 5.3 Outbound webhooks to partners (Future)
Through opsapi namespace webhooks (`/api/v2/namespace/webhooks`, EXISTING-OPSAPI) with signed payloads and redelivery support. Subscribing to `kisaan.*` events is P2, for buyer ERP integrations.

---

## 6. Endpoint count summary

| # | Module | NEW-KISAAN | EXISTING-OPSAPI used |
|---|---|---|---|
| 1 | Authentication | 6 | 4 |
| 2 | Users | 6 | 2 |
| 3 | Profiles | 10 | 0 |
| 4 | Products (taxonomy) | 5 | 0 (1 not used) |
| 5 | Listings | 13 | 0 |
| 6 | Search | 5 | 0 |
| 7 | Inventory | 7 | 0 |
| 8 | Buyer requirements & enquiries | 8 | 1 |
| 9 | Offers | 4 | 0 |
| 10 | Negotiations | 5 | 0 |
| 11 | Orders & checkout | 10 | 2 |
| 12 | Payments (+ invoices) | 9 + 3 | 0 (Stripe blocked) |
| 13 | Logistics (transporter marketplace P2, D-106) | 10 | 6 |
| 14 | Notifications | 6 | 3 |
| 15 | Reviews | 5 | 1 |
| 16 | Admin | 36 | 2 groups |
| 17 | KISAAN AI conversation API (`/api/ai/v1`) | 9 (KISAAN-APP) | 0 |
| 18 | KISAAN AI internal tool API (persistence/context/matching) | 10 | 0 (OpsAPI `/api/chat/agent` not used) |
| 19 | Approvals | 6 | 0 |
| 20 | Seller stores | 8 | 2 |
| 21 | Wholesale pricing (tier sets) | 6 | 0 |
| 22 | Buying groups & group orders | 28 | 0 |
| 23 | Bulk buyer + group leader signup | 5 + 5 | 0 |
| 24 | Membership & T&C | 9 | 0 |
| 25 | Coupons | 9 | 0 (billing coupons Future) |
| — | Mandi/trade rules, support/disputes | 5 + 9 | 0 |
| — | Inbound webhooks | 3 + 1 KISAAN-APP (WhatsApp) | 0 |

(Counts treat each method+path row as one endpoint; grouped rows such as `pause · resume` count as one.)

---

## 7. Open items

| ID | Item |
|---|---|
| `[UNVERIFIED]` | Plugin SDK ability to mint opsapi-compatible JWTs / reuse `refresh_tokens` (Phase 1 spike) |
| `[UNVERIFIED]` | Whether opsapi chat channel creation can be called from plugin code for enquiry threads (else use HTTP to `/api/chat/channels`) |
| `[UNVERIFIED]` | Exact opsapi `orders.status` / `financial_status` value sets for the mapping in [DATABASE_SCHEMA](DATABASE_SCHEMA.md) §7.1 |
| `[DECISION D-09]` | Payment aggregator (Razorpay vs Cashfree); webhook payload examples follow the chosen PA |
| `[DECISION D-80]` | APMC gating per category × state, buyer licence requirement, levy rates (KIS-CMP-046) |
| `[ASSUMPTION A-14]` | Production domains `kisaan.in` (app incl. KISAAN AI) and `api.kisaan.in` (placeholders). There is no separate AI domain in v0.2 |
| `[DECISION D-103]` / D-72 / D-124 / D-132 | Group lock window (24 h default) and the canonical repricing rule for unpaid allocations (honour / re-offer / decline). Owner doc: [WHOLESALE_AND_GROUP_BUYING](WHOLESALE_AND_GROUP_BUYING.md) |
| `[DECISION D-106]` | Transporter marketplace is P2; MVP delivery tokens `buyer_pickup`, `seller_delivery`, `seller_delivery_fee` |
| `[DECISION D-134]` | Group platform-logistics delivery buffer (+10 %, platform absorbs residual) — **PENDING OWNER SIGN-OFF**; only relevant once `platform_logistics` is enabled (P2) |
| `[DECISION D-136]` | Seller may not worsen tier/group terms within 24 h of a `forming` group's deadline (enforced on tier-set publish) |
| `TO-BE-VERIFIED` | Whether the KISAAN app may read provider keys from OpsAPI `namespace_ai_providers` through a supported route. Until verified, keys come from the app secret store |
| `[TAX REVIEW]` | GST treatment shown in quote examples (unprocessed cereals) and TCS/TDS on settlements |
