# KISAAN — API Specification

> Status: Draft v0.1 · Last updated: 2026-11-14 · Owner: KISAAN product & architecture · Source of truth index: [README](README.md)

Related: [DATABASE_SCHEMA](DATABASE_SCHEMA.md) · [OPSAPI_INTEGRATION](OPSAPI_INTEGRATION.md) · [AI_AGENT_ARCHITECTURE](AI_AGENT_ARCHITECTURE.md) · [PRD](PRD.md) · [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md)

Every endpoint is tagged:

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
| AI Gateway | `https://ai.kisaan.in/v1` | KISAAN AI service (not opsapi). It calls the Kisaan API with the user's token. See §3.17. |
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
| `X-Client: web/1.4.0 \| pwa/1.4.0 \| whatsapp \| ai-gateway/0.9` | Recommended | Telemetry; AI Gateway calls are tagged for audit |
| `X-AI-Execution-Id` | AI Gateway only | Links the API call to `kisaan_ai_agent_executions` |

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
| 403 | `FORBIDDEN`, `ROLE_NOT_HELD`, `KYC_TIER_REQUIRED`, `NOT_OWNER`, `ACCOUNT_SUSPENDED`, `CHECKOUT_DISABLED_FOR_STATE`, `APMC_LICENCE_REQUIRED` | The last two come from APMC gating (`[DECISION D-80]`, CMP-046) |
| 404 | `NOT_FOUND` | Also returned by opsapi when a module is not deployed |
| 409 | `INSUFFICIENT_STOCK`, `STATE_CONFLICT`, `DUPLICATE`, `APPROVAL_REQUIRED`, `APPROVAL_INVALID`, `APPROVAL_EXPIRED`, `QUOTE_EXPIRED`, `PRICE_CHANGED`, `COUPON_EXHAUSTED`, `GROUP_FULL`, `ALREADY_MEMBER`, `TERMS_NOT_ACCEPTED`, `TERMS_VERSION_OUTDATED` | |
| 412 | `VERSION_CONFLICT` | `If-Match` mismatch |
| 422 | `VALIDATION_FAILED` (with `details`), `COUPON_NOT_APPLICABLE`, `TIER_RULES_VIOLATED`, `PRICE_BELOW_FLOOR`, `MAX_ROUNDS_REACHED` | |
| 429 | `RATE_LIMITED` | `Retry-After` header |
| 502/503 | `PROVIDER_UNAVAILABLE`, `INTEGRATION_NOT_CONFIGURED` | PA, SMS, STT etc. |
| 500 | `INTERNAL` | |

**Commit-class rule (APR):** any endpoint marked ✋ performs a commit-class action. Commit endpoints are called **only by the user's own client with the user's own token** (never by the AI Gateway service identity). When the action was drafted by AI, the request **must** include `approval_request_id` referencing an `approved`, unexpired approval whose `params_hash` matches the request. Otherwise the response is `409 APPROVAL_REQUIRED` with a freshly created approval in `error.context.approval_request`. Direct UI calls create and approve inline: the UI shows the confirmation sheet, calls `POST /approvals` (§3.19) and then `POST /approvals/:uuid/approve`. So **every** commit is backed by an approval record (APR-006).

### 1.7 Rate limits (defaults; Cloudflare edge + opsapi/plugin limiter)

| Class | Limit |
|---|---|
| OTP request | 5 / 15 min per phone; 20 / hour per IP; 3 / min per device (AUTH-002) |
| OTP verify | 5 attempts per challenge |
| Public read | 120 / min per IP |
| Authenticated read | 600 / min per user |
| Authenticated write | 60 / min per user |
| Offers/counters | 30 / hour per buyer, 10 open offers per day for new accounts (ENQ-004) |
| AI chat | 30 messages / 10 min per user; daily token budget per user (AI-009) |
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
| AI Gateway service identity | `kisaan_approvals.create` only, plus read/draft tools on behalf of the user with the user's token; **never** approves or executes |
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
| GET | `/api/v2/kisaan/auth/sessions` | NEW-KISAAN | List my sessions/devices (AUTH-008, P2) | JWT | self | read | — |
| DELETE | `/api/v2/kisaan/auth/sessions/:uuid` | NEW-KISAAN | Revoke a session | JWT | self | write | — |
| POST | `/auth/login`, `/auth/2fa/verify` | EXISTING-OPSAPI | Email + password with email-OTP 2FA, **admins & business buyers** (AUTH-004) | None | — | opsapi | — |
| GET | `/auth/google`, `/auth/google/callback` | EXISTING-OPSAPI | Google SSO for business buyers (P2) | None | — | — | — |
| POST | `/auth/refresh` | EXISTING-OPSAPI | Refresh for email/SSO sessions | Cookie/body | — | — | — |
| GET | `/auth/me` | EXISTING-OPSAPI | Raw identity (Kisaan clients use `/kisaan/me`) | JWT | — | — | — |

**Validation:** `phone` E.164 Indian mobile `^\+91[6-9]\d{9}$`; `purpose ∈ {login}` (register is implicit); `channel ∈ {sms, whatsapp}`; `otp` 6 digits; `device_id` ≤ 64 chars. Unknown phone + valid OTP → creates the user (opsapi `users` via SDK) + `kisaan_user_identities`, with `is_new_user: true`. Registration requires `consents` (AUTH-007) on the verify call when `is_new_user`.

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
| POST | `/api/v2/kisaan/me/data-requests` | NEW-KISAAN | DPDP access/correction/erasure/grievance (AUTH-009) | JWT | self |
| GET/PUT | `/api/v2/kisaan/me/consents` | NEW-KISAAN | View/withdraw consents | JWT | self |
| GET | `/api/v2/users/:id` | EXISTING-OPSAPI | Admin raw user record (admin console only) | JWT | `users.read` |
| GET | `/api/v2/users/search` | EXISTING-OPSAPI | Admin user search | JWT | `users.read` |

Validation: `preferred_language ∈ {pa,hi,en}`; adding `seller` requires phone verified; `transporter` creates an opsapi `delivery_partners` record via the opsapi register flow (§3.13).

### 3.2 Profiles (module 3)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| GET/PUT | `/api/v2/kisaan/me/seller-profile` | NEW-KISAAN | Farmer/seller profile (PROF-002) | JWT | seller | — |
| GET/PUT | `/api/v2/kisaan/me/buyer-profile` | NEW-KISAAN | Buyer profile (buyer_type, GSTIN…) | JWT | buyer | — |
| GET/PUT | `/api/v2/kisaan/me/transporter-profile` | NEW-KISAAN | Transporter extension | JWT | transporter | — |
| GET/POST | `/api/v2/kisaan/me/addresses` | NEW-KISAAN | List/create addresses (geo-pin) | JWT | self | 🔁 |
| PUT/DELETE | `/api/v2/kisaan/me/addresses/:uuid` | NEW-KISAAN | Update/soft-delete | JWT | owner | — |
| GET/POST | `/api/v2/kisaan/me/payout-accounts` | NEW-KISAAN | Bank/UPI for payouts; triggers penny-drop + PA linked-account creation | JWT | seller, transporter | 🔁 |
| POST | `/api/v2/kisaan/me/verifications` | NEW-KISAAN | Start a verification (`identity_digilocker`, `pan`, `gstin`, `driving_licence`, `vehicle_rc`, `fssai`, `organic_certificate`) | JWT | self | 🔁 |
| POST | `/api/v2/kisaan/me/verifications/:uuid/documents` | NEW-KISAAN | Upload KYC document (multipart ≤ 10 MB, jpeg/png/pdf). Stored in the private KYC bucket. | JWT | owner | 🔁 |
| GET | `/api/v2/kisaan/me/verifications` | NEW-KISAAN | Status list and current KYC tier | JWT | self | — |
| GET | `/api/v2/kisaan/public/profiles/:user_uuid` | NEW-KISAAN | Public reputation card (name, district, badges, rating) for privacy-filtered display | None | — | — |

Buyer profile also carries optional `apmc_licence_no`, `apmc_licence_state` (read-only `apmc_licence_verified_at`). Submitting a licence starts a verification with `check_type = apmc_licence`. It is required only where `kisaan_category_state_rules.requires_buyer_apmc_licence = true` (CMP-046).

Validation: GSTIN regex `^[0-9]{2}[A-Z0-9]{10}[0-9A-Z]{3}$`; PAN `^[A-Z]{5}[0-9]{4}[A-Z]$`; IFSC `^[A-Z]{4}0[A-Z0-9]{6}$`; pincode `^[1-9][0-9]{5}$`. **Aadhaar numbers are rejected** if posted in any field (pattern detection → `422 AADHAAR_NOT_ACCEPTED`, ONB-003).

### 3.3 Products — taxonomy & attributes (module 4)

| Method | Path | Tag | Purpose | Auth | Perm |
|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/public/categories` | NEW-KISAAN | Category tree (active only unless admin), localised | None | — |
| GET | `/api/v2/kisaan/public/categories/:code/attributes` | NEW-KISAAN | Attribute schema (drives dynamic forms, filters and AI slot filling) | None | — |
| GET | `/api/v2/kisaan/public/commodities?category=` | NEW-KISAAN | Commodities and varieties with synonyms | None | — |
| POST/PUT | `/api/v2/kisaan/admin/categories[/:uuid]` | NEW-KISAAN | Manage taxonomy (ADM-007) | JWT | `kisaan_admin.manage` |
| POST/PUT | `/api/v2/kisaan/admin/categories/:uuid/attributes[/:key]` | NEW-KISAAN | Manage attribute schema | JWT | admin |
| GET | `/api/v2/categories` | EXISTING-OPSAPI | Store-scoped categories, **not used** for the marketplace taxonomy | — | — |

### 3.4 Listings (module 5)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/listings` | NEW-KISAAN | Create a listing **draft** (also creates the backing opsapi `storeproducts` row and inventory record) | JWT | `kisaan_listings.create` (seller, T0+) | 🔁 |
| GET | `/api/v2/kisaan/listings?mine=true&status=` | NEW-KISAAN | My listings | JWT | seller | — |
| GET | `/api/v2/kisaan/listings/:uuid` | NEW-KISAAN | Detail (owner view incl. drafts) | JWT | owner/admin | — |
| PATCH | `/api/v2/kisaan/listings/:uuid` | NEW-KISAAN | Update fields. Price/qty changes with open offers notify buyers (PRD-007). | JWT | owner, `If-Match` | — |
| POST | `/api/v2/kisaan/listings/:uuid/publish` ✋ | NEW-KISAAN | Publish (moderation checks; T1+ required) | JWT | owner | 🔁 |
| POST | `/api/v2/kisaan/listings/:uuid/pause` · `/resume` · `/close` · `/duplicate` | NEW-KISAAN | Lifecycle | JWT | owner | 🔁 |
| POST | `/api/v2/kisaan/listings/:uuid/media` | NEW-KISAAN | Upload photo (multipart, ≤ 8 MB, ≤ 10 per listing). EXIF strip, scan, resize. | JWT | owner | 🔁 |
| DELETE / PUT | `/api/v2/kisaan/listings/:uuid/media/:media_uuid` · `/media/order` | NEW-KISAAN | Remove/reorder | JWT | owner | — |
| POST | `/api/v2/kisaan/listings/:uuid/translate` | NEW-KISAAN | Regenerate translations (PRD-004) | JWT | owner | — |
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
| price | `{amount, per_unit}` | ✔ | amount > 0; per_unit ∈ kg/qtl/tonne |
| price_floor | `{amount, per_unit}` | | ≤ price |
| price_negotiable | bool | | default true |
| attributes | object | ✔ (required keys per schema) | Typed per `category_attributes` (e.g. `moisture_pct` 0–25) |
| seller_declared_grade | string | | Enum per category |
| harvest_date | date | | ≤ today + 60 d |
| available_from / expires_at | date / datetime | | expires ≤ +90 d |
| pickup_address_uuid | uuid | ✔ | Owner's address with purpose pickup/farm |
| delivery_options | array | ✔ | ⊆ buyer_pickup, seller_delivery, platform_logistics |
| wholesale | object | | See §3.21 |
| member_price | `{amount, per_unit}` | | < price |
| created_via | enum | | form/chat/voice/photo/whatsapp/assisted |
| ai_conversation_uuid | uuid | | When drafted by AI |

**Errors:** `422 VALIDATION_FAILED` (attribute schema), `422 PROHIBITED_ITEM` (PRD-008), `403 KYC_TIER_REQUIRED` (publish), `422 TIER_RULES_VIOLATED`, `409 DUPLICATE_LISTING_SUSPECTED` (publish, with similar listing refs; the seller can confirm it is not a duplicate), `409 APPROVAL_REQUIRED` (publish via AI).

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
  "delivery_options": ["buyer_pickup", "platform_logistics"],
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
| GET | `/api/v2/kisaan/public/search/listings` | NEW-KISAAN | Keyword + filters + geo; only Active with available ≥ MOQ (SRCH-004) | Optional JWT (personalised effective price) | public read |
| GET | `/api/v2/kisaan/public/search/suggest?q=` | NEW-KISAAN | Autocomplete across scripts and romanised synonyms | None | 300/min/IP |
| GET | `/api/v2/kisaan/public/search/sellers` | NEW-KISAAN | Find sellers/stores by commodity and district | None | public |
| GET | `/api/v2/kisaan/public/search/groups` | NEW-KISAAN | Find open buying groups (GRP-016) | None | public |
| GET/POST/DELETE | `/api/v2/kisaan/saved-searches[/:uuid]` | NEW-KISAAN | Saved searches with alerts (SRCH-006) | JWT | write |

**Query params (listings):** `q`, `category`, `commodity`, `variety`, `district` (LGD codes, CSV), `lat`,`lng`,`radius_km` (≤ 300), `price_min`, `price_max` (per `price_unit`), `price_unit=qtl`, `qty_min` + `qty_unit`, `grade`, `attr.<key>=` / `attr.<key>_min=` / `attr.<key>_max=` (only `filterable` attributes), `verified_only=true`, `delivery_option=platform_logistics`, `wholesale=true`, `organic=true`, `for_qty` + `for_unit` (compute effective price for this quantity, SRCH-011), `sort ∈ relevance | price | -price | distance | -rating | -freshness`, `page`, `per_page`, `cursor`.

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
| GET | `/api/v2/kisaan/listings/:uuid/inventory` | NEW-KISAAN | On hand / reserved / available / sold / threshold | JWT | owner | — |
| POST | `/api/v2/kisaan/listings/:uuid/inventory/adjustments` ✋ (if AI-drafted) | NEW-KISAAN | Manual add/remove with reason (INV-006, INV-010) | JWT | owner | 🔁 |
| GET | `/api/v2/kisaan/listings/:uuid/inventory/movements` | NEW-KISAAN | Ledger (INV-009) | JWT | owner/admin | — |
| GET | `/api/v2/kisaan/listings/:uuid/inventory/reservations?status=held` | NEW-KISAAN | Active holds with source & expiry | JWT | owner | — |
| PUT | `/api/v2/kisaan/listings/:uuid/inventory/threshold` | NEW-KISAAN | Low-stock threshold (INV-007) | JWT | owner | — |
| GET | `/api/v2/kisaan/inventory/summary` | NEW-KISAAN | Seller-wide stock dashboard, low-stock list | JWT | seller | — |

Reservations are **not** created by a public endpoint. They are side effects of offer acceptance (§3.9), checkout (§3.15) and group close (§3.22) (INV-002).

Adjustment request: `{ "type": "add" | "remove", "qty": {"value": "20", "unit": "qtl"}, "reason_code": "harvest_added" | "spoilage" | "sold_offline" | "correction" | "other", "reason_text": "…", "approval_request_id": "…?" }`. Errors: `409 INSUFFICIENT_STOCK` (remove > available; reserved stock cannot be removed), `422 REASON_REQUIRED`.

### 3.7 Buyer requirements / RFQ (module 8)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/requirements` | NEW-KISAAN | Create RFQ draft | JWT | buyer | 🔁 |
| POST | `/api/v2/kisaan/requirements/:uuid/publish` ✋ | NEW-KISAAN | Open to matching sellers (AI-MAT notifies) | JWT | owner | 🔁 |
| GET | `/api/v2/kisaan/requirements?mine=true` | NEW-KISAAN | My RFQs | JWT | buyer | — |
| GET | `/api/v2/kisaan/requirements/feed` | NEW-KISAAN | Sellers: open RFQs matching my districts/commodities (buyer identity masked, ENQ-006) | JWT | seller | — |
| GET | `/api/v2/kisaan/requirements/:uuid` | NEW-KISAAN | Detail + quotations (owner) / own quotation (seller) | JWT | party | — |
| POST | `/api/v2/kisaan/requirements/:uuid/close` | NEW-KISAAN | Close/cancel | JWT | owner | 🔁 |
| POST | `/api/v2/kisaan/requirements/:uuid/quotations` | NEW-KISAAN | Seller quotation → opens a negotiation (`context_type = rfq_quotation`) | JWT | seller | 🔁 |
| GET | `/api/v2/kisaan/requirements/:uuid/compare` | NEW-KISAAN | Multi-seller comparison (OFR-004): landed price, distance, rating, delivery date | JWT | owner | — |
| POST | `/api/v2/kisaan/listings/:uuid/enquiries` | NEW-KISAAN | Start an enquiry thread (creates an opsapi chat channel) | JWT | buyer | 🔁 |
| GET/POST | `/api/chat/channels/:channel_uuid/messages` | EXISTING-OPSAPI | Enquiry messages (opsapi chat) | JWT | channel member | — |

### 3.8 Offers (module 9)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/listings/:uuid/offers` ✋ (if AI-drafted) | NEW-KISAAN | Buyer makes an offer (supersedes any open one, OFR-006) | JWT | buyer | 🔁 |
| GET | `/api/v2/kisaan/offers?role=buyer\|seller&status=` | NEW-KISAAN | My offers (sent/received) | JWT | party | — |
| GET | `/api/v2/kisaan/listings/:uuid/offers/compare` | NEW-KISAAN | Seller's multi-buyer comparison with **net realisation** (OFR-003) | JWT | owner | — |
| POST | `/api/v2/kisaan/offers/:uuid/withdraw` | NEW-KISAAN | Offering party withdraws before decision | JWT | party | 🔁 |

Validation: qty ≥ MOQ and ≤ available; price > 0; **P2 (not enabled in MVP, D-06):** if `price_per_kg < auto_reject_below` the offer is created as `auto_rejected` with a polite templated reply (OFR-015: auto-reject or floor reply only, never auto-accept); `valid_until` between 1 h and 72 h (default 24 h, 6 h perishables, D-05). Errors: `409 STATE_CONFLICT` (listing not active), `409 INSUFFICIENT_STOCK`, `429 RATE_LIMITED`, `403 KYC_TIER_REQUIRED` (offer value above tier limit).

#### Example: place offer
```http
POST /api/v2/kisaan/listings/5d1f7c2a-9e3b-4d8a-b6c1-2e3f4a5b6c7d/offers
Authorization: Bearer eyJ…   X-Kisaan-Active-Role: buyer
Idempotency-Key: 0e5c…

{ "qty": { "value": "60", "unit": "qtl" },
  "price": { "amount": "2280.00", "per_unit": "qtl" },
  "delivery_terms": "platform_logistics",
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
| POST | `/api/v2/kisaan/negotiations/:uuid/counter` ✋ (if AI-drafted) | NEW-KISAAN | Counter (price/qty/terms/validity); max 10 rounds (OFR-010/011) | JWT | party (alternating) | 🔁 |
| POST | `/api/v2/kisaan/negotiations/:uuid/accept` ✋ | NEW-KISAAN | Accept the **current** offer → reserve inventory + create order (pending_payment) (OFR-012) | JWT | counter-party of current offer | 🔁 |
| POST | `/api/v2/kisaan/negotiations/:uuid/reject` ✋ | NEW-KISAAN | Reject with optional reason | JWT | counter-party | 🔁 |
| POST | `/api/v2/kisaan/negotiations/:uuid/ai/draft-counter` | NEW-KISAAN (proxy to AI Gateway) | AI-NEG drafts a counter + rationale (draft class; returns a draft, nothing sent) | JWT | party | — |

Rules: only the party who did **not** author the current offer may accept/reject/counter. Accepting requires `approval_request_id` (always: accept is commit-class even from the UI, which creates the approval inline). Errors: `409 MAX_ROUNDS_REACHED` (422), `409 STATE_CONFLICT` (already decided/expired), `409 INSUFFICIENT_STOCK` (at acceptance → offer stays pending, user told), `409 APPROVAL_INVALID`.

#### Example: counter
```http
POST /api/v2/kisaan/negotiations/9b8a7c6d-…/counter
Idempotency-Key: 77aa…
{ "qty": { "value": "60", "unit": "qtl" }, "price": { "amount": "2350.00", "per_unit": "qtl" },
  "delivery_terms": "platform_logistics", "valid_until": "2026-11-15T20:00:00+05:30",
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
| POST | `/api/v2/kisaan/checkout/quote` | NEW-KISAAN | Price quote with full stacking breakdown (PRC). Creates a 15-min quote; reserves coupon use. | JWT | buyer | 🔁 |
| POST | `/api/v2/kisaan/checkout/orders` ✋ | NEW-KISAAN | "Buy now": create order from quote → reserves inventory → returns payment intent | JWT | buyer | 🔁 |
| GET | `/api/v2/kisaan/orders?role=buyer\|seller&status=` | NEW-KISAAN | Orders list with Kisaan statuses | JWT | party | — |
| GET | `/api/v2/kisaan/orders/:uuid` | NEW-KISAAN | Detail: timeline, pricing snapshot, shipment, documents | JWT | party/admin | — |
| POST | `/api/v2/kisaan/orders/:uuid/ready` | NEW-KISAAN | Seller marks ready for pickup | JWT | seller | 🔁 |
| POST | `/api/v2/kisaan/orders/:uuid/cancel` ✋ | NEW-KISAAN | Cancel (rules ORD-005) → release stock, refund | JWT | party | 🔁 |
| POST | `/api/v2/kisaan/orders/:uuid/confirm-receipt` ✋ | NEW-KISAAN | Buyer accepts delivery (with delivered weight) → completes and releases settlement | JWT | buyer | 🔁 |
| POST | `/api/v2/kisaan/orders/:uuid/weight-reconciliation` | NEW-KISAAN | Record weighbridge weights; computes pro-rata adjustment (ORD-007) | JWT | party | 🔁 |
| GET | `/api/v2/kisaan/orders/:uuid/documents` | NEW-KISAAN | Invoice, receipt, weighbridge slip (signed URLs, 5 min) | JWT | party | — |
| GET | `/api/v2/buyer/orders`, `/api/v2/seller/orders` | EXISTING-OPSAPI | Raw opsapi order views (admin/debug; Kisaan apps use `/kisaan/orders`) | JWT | — | — |
| GET | `/api/v2/orders/:id/status-history` | EXISTING-OPSAPI | Coarse status history (admin) | JWT | admin | — |

#### Example: checkout price quote with stacking breakdown
Scenario: buyer (KISAAN Plus member, retailer) wants 60 qtl from the listing above, applies the seller's coupon `KANAK2`, with platform logistics.
```http
POST /api/v2/kisaan/checkout/quote
Idempotency-Key: 1f2e…
{ "listing_uuid": "5d1f7c2a-9e3b-4d8a-b6c1-2e3f4a5b6c7d", "qty": { "value": "60", "unit": "qtl" },
  "coupon_code": "KANAK2", "delivery_mode": "platform_logistics", "delivery_address_uuid": "d4e5f6a7-…" }
```
```json
{ "success": true,
  "data": {
    "quote_uuid": "q_3a4b5c6d-…", "valid_until": "2026-11-14T11:05:00+05:30",
    "qty": { "value": "60", "unit": "qtl", "kg": "6000.000" },
    "steps": [
      { "step": 1, "rule": "base_list_price", "price_per_qtl": "2450.00", "line_total": "147000.00" },
      { "step": 2, "rule": "wholesale", "applied": "tier_1", "detail": "50+ qtl: 5% off", "price_per_qtl": "2327.50", "discount": "7350.00", "funded_by": "seller",
        "alternatives_considered": [ { "rule": "whole_lot", "eligible": false, "reason": "requires 100 qtl" } ] },
      { "step": 3, "rule": "negotiated_price", "applied": false, "reason": "no accepted offer" },
      { "step": 4, "rule": "member_price", "applied": false, "reason": "seller has not set a member price" },
      { "step": 5, "rule": "seller_coupon", "code": "KANAK2", "detail": "2% off, max ₹3,000", "discount": "2793.00", "funded_by": "seller" } ],
    "goods_total": "136857.00",
    "delivery": { "mode": "platform_logistics", "estimated_fee": "3200.00", "basis": "3 transporter quotes avg (Moga→Ludhiana, 62 km)", "membership_waiver": { "benefit": "free_delivery", "amount": "500.00", "funded_by": "platform", "cap_remaining_calendar_month": "1500.00" }, "fee_payable": "2700.00" },
    "platform_fee_buyer": "0.00",
    "taxes": { "gst_on_goods": "0.00", "note": "Unprocessed wheat: GST nil/exempt [TAX REVIEW]" },
    "grand_total": "139557.00",
    "seller_view": { "commission_payer": "seller", "commission_pct": "1.50", "commission": "2052.86", "gst_on_commission_18pct": "369.51", "seller_net_estimate": "134434.63" },
    "breakdown_hash": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" } }
```
Stacking order follows [FUNCTIONAL_SPECIFICATION](FUNCTIONAL_SPECIFICATION.md) §30.1: base → wholesale tier / whole-lot → negotiated price (replaces list + tier) → member price (seller opt-in) → seller coupon (max one). The membership free-delivery waiver applies to the delivery-fee line, not to goods. Arithmetic: after tier, 60 × 2,327.50 = **139,650.00**; no negotiated or member price applies; coupon 2% × 139,650.00 = **2,793.00** (≤ cap 3,000) → goods_total **136,857.00**; grand_total = 136,857.00 + 2,700.00 delivery = **139,557.00**. Commission is **seller-paid** (D-19): 1.5% × 136,857.00 = 2,052.86, plus 18% GST on commission = 369.51 `[TAX REVIEW]`, so seller_net_estimate = 136,857.00 − 2,052.86 − 369.51 = **134,434.63**. The buyer pays no platform fee. Seller funds wholesale and coupon discounts; the platform funds the delivery waiver.

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
Errors: `409 QUOTE_EXPIRED`, `409 PRICE_CHANGED` (re-quote; hash mismatch), `409 INSUFFICIENT_STOCK`, `409 COUPON_EXHAUSTED`, `403 CHECKOUT_DISABLED_FOR_STATE`, `403 APMC_LICENCE_REQUIRED`.

**APMC gating (CMP-046, `[DECISION D-80]`).** Before creating any order (Buy now, offer accept, group close), the service resolves `kisaan_category_state_rules` for (listing category, seller pickup state):
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
| POST | `/api/v2/kisaan/payments/:uuid/client-callback` | NEW-KISAAN | Client success callback: **only triggers a server-side fetch**; never marks paid by itself (PAY-004) | JWT | payer | — |
| POST | `/api/v2/kisaan/public/webhooks/payments/:provider` | NEW-KISAAN | PA webhook (signature verified, dedup by event id) | HMAC signature | — | event id |
| GET | `/api/v2/kisaan/me/payments?status=pending` | NEW-KISAAN | "Show my pending payments" (PAY-009) | JWT | self | — |
| GET | `/api/v2/kisaan/me/settlements` | NEW-KISAAN | Seller/transporter payouts & holds | JWT | seller/transporter | — |
| POST | `/api/v2/kisaan/admin/refunds` ✋ | NEW-KISAAN | Finance-initiated refund | JWT | `kisaan_finance.manage` (finance; dual control ≥ ₹50,000) | 🔁 |
| POST | `/api/v2/kisaan/admin/settlements/:uuid/release` | NEW-KISAAN | Manual release (dual control: 2 finance users) | JWT | `kisaan_finance.manage` (finance, dual control) | 🔁 |
| GET | `/api/v2/kisaan/admin/reconciliation/runs[/:uuid]` | NEW-KISAAN | Daily reconciliation results (PAY-008) | JWT | finance | — |
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

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/delivery-partners/register` | EXISTING-OPSAPI | Create the opsapi delivery-partner record for a transporter | JWT | transporter | — |
| GET/PUT | `/api/v2/delivery-partners/profile`, `/areas` | EXISTING-OPSAPI | Partner profile & service areas | JWT | transporter | — |
| GET | `/api/v2/delivery-partner/dashboard`, `/earnings` | EXISTING-OPSAPI | Partner dashboard & earnings (fed by assignments Kisaan creates) | JWT | transporter | — |
| GET/POST/PUT/DELETE | `/api/v2/kisaan/me/vehicles[/:uuid]` | NEW-KISAAN | Vehicles, RC & insurance (LOG-007) | JWT | transporter | 🔁 |
| POST | `/api/v2/kisaan/transport-requests` | NEW-KISAAN | Create a request for an order/group order; broadcast to eligible transporters (LOG-002) | JWT | seller/buyer/leader (order party) | 🔁 |
| GET | `/api/v2/kisaan/transport-requests/:uuid` | NEW-KISAAN | Request + quotes comparison (price, ETA, rating, vehicle) | JWT | requester | — |
| GET | `/api/v2/kisaan/transport-requests/feed` | NEW-KISAAN | Transporter's open requests in their districts | JWT | transporter | — |
| POST | `/api/v2/kisaan/transport-requests/:uuid/quotes` | NEW-KISAAN | Submit quote | JWT | transporter (verified) | 🔁 |
| POST | `/api/v2/kisaan/transport-quotes/:uuid/accept` ✋ | NEW-KISAAN | Accept a quote → shipment + opsapi `order_delivery_assignments` | JWT | requester | 🔁 |
| GET | `/api/v2/kisaan/shipments/:uuid` | NEW-KISAAN | Shipment detail & timeline | JWT | party | — |
| POST | `/api/v2/kisaan/shipments/:uuid/events` | NEW-KISAAN | Status update: `en_route_pickup`, `picked_up` (weight + photo required), `in_transit`, `delivered` (photo + buyer OTP), `failed` | JWT | assigned transporter | 🔁 |
| POST | `/api/v2/kisaan/shipments/:uuid/delivery-otp` | NEW-KISAAN | Generate/resend buyer delivery OTP | JWT | buyer | — |
| GET | `/api/v2/delivery/fee-estimate` | EXISTING-OPSAPI | Distance-based fee estimate (INR slabs). Used only as a fallback hint, labelled "estimate" (LOG-006). | JWT | — | — |
| GET | `/api/v2/delivery-partner/assignments` | EXISTING-OPSAPI | Partner's assignments list | JWT | transporter | — |

Shipment event validation: transitions follow the LOG-004 state machine; `picked_up` requires `weight_kg` and ≥ 1 photo; `delivered` requires the buyer OTP (or a photo + recipient name with a support override flag) and ≥ 1 photo; location (if shared) requires consent.

### 3.14 Notifications (module 14)

| Method | Path | Tag | Purpose | Auth |
|---|---|---|---|---|
| GET | `/api/v2/notifications` | EXISTING-OPSAPI | In-app inbox | JWT |
| PUT | `/api/v2/notifications/:id/read`, `/mark-all-read` | EXISTING-OPSAPI | Mark read | JWT |
| POST/GET/DELETE | `/api/v2/device-tokens[/:uuid]` | EXISTING-OPSAPI | FCM token registration | JWT |
| GET/PUT | `/api/v2/kisaan/me/notification-preferences` | NEW-KISAAN | Channels per event type, quiet hours, language (NOTF-002) | JWT |
| GET/PUT | `/api/v2/kisaan/me/channel-optins` | NEW-KISAAN | WhatsApp/SMS opt-in/out with consent text (WA-002) | JWT |
| GET/POST/DELETE | `/api/v2/kisaan/price-alerts[/:uuid]` | NEW-KISAAN | Mandi price alerts (MKT-004) | JWT |
| POST | `/api/v2/kisaan/public/webhooks/whatsapp` | NEW-KISAAN | WhatsApp Cloud API webhook (inbound messages → AI Gateway; status callbacks → notification log) | Meta signature (`X-Hub-Signature-256`) |
| POST | `/api/v2/kisaan/public/webhooks/sms/:provider` | NEW-KISAAN | SMS delivery reports | Provider signature/IP allow-list |

All outbound SMS/WhatsApp sending is internal (Notification service / AI-NTF via jobs). No public "send" endpoint.

### 3.15 Reviews (module 15)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/orders/:uuid/reviews` | NEW-KISAAN | Create review of counter-party/transporter (within 14 days of completion) | JWT | order party | 🔁 |
| POST | `/api/v2/kisaan/groups/:uuid/leader-review` | NEW-KISAAN | Member rates leader (REV-005) | JWT | member | 🔁 |
| POST | `/api/v2/kisaan/reviews/:uuid/reply` | NEW-KISAAN | Single seller reply | JWT | subject | — |
| POST | `/api/v2/kisaan/reviews/:uuid/report` | NEW-KISAAN | Report abusive review | JWT | any | — |
| GET | `/api/v2/kisaan/public/users/:uuid/reviews` | NEW-KISAAN | Public reviews for seller/buyer/transporter/leader | None | — | — |
| GET | `/api/v2/public/stores/:slug/reviews` | EXISTING-OPSAPI | Store reviews (fed by Kisaan mirror writes) | None | — | — |

Validation: `rating` 1–5; `tags` from an allowed list; comment ≤ 1,000 chars; one review per (order, reviewer, subject_type).

### 3.16 Admin (module 16)

All under `/api/v2/kisaan/admin/*` (NEW-KISAAN), JWT with MFA-backed admin session (AUTH-004), permission `kisaan_admin.manage` or the sub-role module permission (`kisaan_verification.manage`, `kisaan_finance.manage`, `kisaan_support.manage`), rate 300/min. Every mutating call writes `kisaan_audit_log`.

| Method | Path | Purpose | Perm |
|---|---|---|---|
| GET | `/admin/dashboard/kpis?from=&to=` | KPIs (users by role/verification, active listings by category, orders, GMV, commission, disputes, AI cost) (ANL-001) | admin |
| GET/PATCH | `/admin/users[/:uuid]` | Search, view (masked PII), suspend/reinstate, role change | admin |
| GET | `/admin/verification-queue?type=&status=` | KYC/business/leader/transporter queue with AI risk annotations (ADM-002) | verifier |
| POST | `/admin/verifications/:uuid/decision` | Approve/reject with reason | verifier |
| GET | `/admin/kyc-documents/:uuid/url` | 5-min signed URL. Access logged (`kyc.document.view`). | verifier |
| GET | `/admin/moderation/listings?flag=` | Flagged listings (ADM-003) | verifier |
| POST | `/admin/listings/:uuid/moderation` | Approve/reject/remove | verifier |
| GET | `/admin/orders?status=&risk=` · `/admin/orders/:uuid` | Order monitoring (ADM-004) | admin, finance |
| GET/POST | `/admin/disputes[/:uuid]` · `/admin/disputes/:uuid/resolve` | Dispute console (ADM-005). Resolution by a human only. | admin |
| GET/POST | `/admin/commission-rules` | Effective-dated commission (ADM-006) | finance |
| GET/POST/PUT | `/admin/membership-plans[/:uuid]` | Plans (ADM-008) | admin |
| GET/POST | `/admin/legal-documents` · `POST /admin/legal-documents/:uuid/publish` | T&C/privacy versions. Publishing requires `legal_reviewed_by`. | admin |
| GET | `/admin/risk/flags` · `POST /admin/risk/flags/:uuid/decision` | Fraud console (ADM-011) | admin |
| GET | `/admin/ai/metrics` · `/admin/ai/executions?agent=&status=` | AI monitoring (ADM-010) | admin |
| GET | `/admin/audit-log?entity=&actor=` | Immutable audit viewer (ADM-012) | admin |
| GET/PUT | `/admin/settings[/:key]` | Platform config (ADM-013) | admin |
| GET/POST | `/admin/category-state-rules` · `PUT /admin/category-state-rules/:uuid` | APMC gating: checkout enabled per category per state, licence requirement, levy templates (CMP-046, D-80). Effective-dated and audit-logged. | admin (+ legal sign-off note) |
| GET | `/admin/orders/:uuid/levies` · `POST /admin/levies/:uuid/remittance` | View levies, record remittance reference | finance |
| GET/PUT | `/admin/search/synonyms` | Synonym dictionary (SRCH-005) | admin |
| POST | `/admin/mandi/import` · GET `/admin/mandi/runs` | Trigger/inspect mandi ingestion | admin |
| GET | `/api/v2/admin/ai-usage`, `/api/v2/namespace/audit-logs`, `/api/v2/namespace/activity` | EXISTING-OPSAPI: platform AI usage and namespace audit/activity | admin |
| GET | `/api/v2/plugins/kisaan`, `POST /api/v2/plugins/kisaan/events/retry`, `POST /api/v2/plugins/kisaan/jobs/:job/run` | EXISTING-OPSAPI: plugin ops (event retries, manual job runs) | platform admin |

### 3.17 AI assistant (module 17) — AI Gateway

The AI Gateway is a separate KISAAN service ([AI_AGENT_ARCHITECTURE](AI_AGENT_ARCHITECTURE.md)). Clients call it with the **same opsapi JWT**. The gateway validates the token (shared JWKS/secret) and calls Kisaan APIs **on behalf of the user with that token**, never with elevated credentials. opsapi's own `/api/chat/agent` is **not** used for KISAAN end users. It remains available to admins in the opsapi dashboard.

| Method | Path | Purpose | Auth | Rate |
|---|---|---|---|---|
| POST | `https://ai.kisaan.in/v1/conversations` | Start a conversation (`channel`, `language`, `active_role`) | JWT | 10/min |
| GET | `/v1/conversations?page=` · `/v1/conversations/:uuid` | History (AI-008) | JWT | read |
| DELETE | `/v1/conversations/:uuid` | Delete my AI history (executed actions stay in audit) | JWT | write |
| POST | `/v1/conversations/:uuid/messages` | Send text/voice/image message; streaming response via SSE (`Accept: text/event-stream`) or JSON | JWT | AI class |
| POST | `/v1/voice/transcribe` | STT only (Opus/WebM/OGG ≤ 60 s) | JWT | voice class |
| POST | `/v1/voice/speak` | TTS (`text`, `language`, `speed`) → audio/ogg | JWT | 60/10 min |
| POST | `/v1/conversations/:uuid/feedback` | Thumbs up/down + reason (eval data) | JWT | write |

**Message request:** `{ "input": { "type": "text" | "voice" | "image", "text": "…", "audio_upload_uuid": "…", "image_upload_uuid": "…" }, "client_context": { "screen": "listing_detail", "listing_uuid": "…" } }`.

**Message response:** `{ "message_uuid", "reply": { "text", "language", "tts_audio_url"? }, "cards": [ ... ], "citations": [ ... ], "task_state": { ... }, "pending_approvals": [ ... ] }`. Cards: `listing_preview`, `search_results`, `price_table`, `offer_comparison`, `approval`, `order_status`, `form_fallback` (deep link to a conventional screen, AI-007).

#### Example: AI chat message (farmer, Punjabi/Hinglish voice)
```http
POST https://ai.kisaan.in/v1/conversations/c0ffee00-1234-4abc-8def-001122334455/messages
Authorization: Bearer eyJ…   X-Namespace-Slug: kisaan   X-Kisaan-Active-Role: seller

{ "input": { "type": "voice", "audio_upload_uuid": "au_91b2…" }, "client_context": { "screen": "home" } }
```
```json
{ "success": true,
  "data": {
    "message_uuid": "m_4410…",
    "transcript": { "text": "Mere paas 100 quintal wheat hai aur main Moga mein hoon. Mujhe achha buyer chahiye.", "language_detected": "hi-Latn+pa", "confidence": 0.91 },
    "reply": { "language": "pa",
      "text": "ਠੀਕ ਹੈ! ਮੈਂ ਤੁਹਾਡੀ 100 ਕੁਇੰਟਲ (10,000 ਕਿਲੋ) ਕਣਕ ਦੀ ਲਿਸਟਿੰਗ ਬਣਾ ਰਿਹਾ ਹਾਂ। ਕਿਸਮ ਕਿਹੜੀ ਹੈ — HD-3086, PBW-826 ਜਾਂ ਕੋਈ ਹੋਰ? ਮੋਗਾ ਮੰਡੀ ਵਿੱਚ 12 ਨਵੰਬਰ ਨੂੰ ਕਣਕ ਦਾ ਮਾਡਲ ਭਾਅ ₹2,425/ਕੁਇੰਟਲ ਸੀ (ਸਰੋਤ: Agmarknet)।",
      "tts_audio_url": "https://ai.kisaan.in/v1/audio/tts_77ab….ogg" },
    "cards": [
      { "type": "listing_preview", "draft_listing_uuid": "5d1f7c2a-…", "completion_pct": 45, "missing": ["variety", "moisture_pct", "expected_price", "photos"] },
      { "type": "price_table", "commodity": "wheat", "rows": [
          { "market": "Moga", "date": "2026-11-12", "min": "2400.00", "max": "2460.00", "modal": "2425.00" },
          { "market": "Jagraon", "date": "2026-11-12", "min": "2405.00", "max": "2470.00", "modal": "2430.00" } ],
        "msp": { "season": "RMS 2026-27", "per_qtl": "[from kisaan_msp_rates]" },
        "disclaimer": "Mandi prices are reference only, not a guaranteed sale price." } ],
    "citations": [ { "source": "Agmarknet via data.gov.in", "fetched_at": "2026-11-13T06:10:00+05:30" } ],
    "task_state": { "task": "create_listing", "step": "collect_details", "draft_listing_uuid": "5d1f7c2a-…" },
    "pending_approvals": [] } }
```

### 3.18 AI agents (module 18) — internal tool API

Agents call **only** the Kisaan/opsapi endpoints in this document, through the gateway's tool layer, with the user's token. A small set of NEW-KISAAN internal endpoints support agent operations. They require a service API key (`opsk_…`, namespace-bound, permissions `kisaan_ai.manage` + `kisaan_approvals.create`) **plus** `X-On-Behalf-Of: <user_uuid>` and `X-AI-Execution-Id`. They never write business data directly.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v2/kisaan/ai/executions` | Record agent execution (agent, model, tokens, cost, latency, status) → `kisaan_ai_agent_executions` |
| POST | `/api/v2/kisaan/ai/tool-calls` | Record a tool call (name, class, redacted args, result) |
| GET | `/api/v2/kisaan/ai/context/:user_uuid` | Minimal context: roles, language, active tasks, open listings/orders counts. Scoped and masked. |
| POST | `/api/v2/kisaan/ai/matching/run` | Trigger AI-MAT matching for an RFQ/listing (system job) |
| GET | `/api/v2/kisaan/ai/budget/:user_uuid` | Remaining daily AI budget (AI-009) |

Tool → endpoint mapping (excerpt; full catalogue in [AI_AGENT_ARCHITECTURE](AI_AGENT_ARCHITECTURE.md)):

| Tool | Class | Endpoint |
|---|---|---|
| `listing.create_draft` | draft | POST /kisaan/listings |
| `listing.publish` | commit | POST /kisaan/listings/:uuid/publish (+approval) |
| `search.listings` | read | GET /kisaan/public/search/listings |
| `price.mandi_lookup` | read | GET /kisaan/public/mandi/prices |
| `offer.compare` | read | GET /kisaan/listings/:uuid/offers/compare |
| `offer.draft_counter` | draft | (gateway-local draft) |
| `offer.send_counter` | commit | POST /kisaan/negotiations/:uuid/counter (+approval) |
| `offer.accept` | commit | POST /kisaan/negotiations/:uuid/accept (+approval) |
| `order.status` | read | GET /kisaan/orders/:uuid |
| `transport.request` | draft→commit | POST /kisaan/transport-requests |
| `payment.pending` | read | GET /kisaan/me/payments?status=pending |
| `support.create_ticket` | draft | POST /kisaan/support/tickets |

### 3.19 Approvals (module 19)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/approvals` | NEW-KISAAN | Create an approval request (UI inline confirm, AI Gateway, support/field agent) | JWT or AI service key + on-behalf | self / AI Gateway service (`kisaan_approvals.create`) | 🔁 |
| GET | `/api/v2/kisaan/approvals?status=pending` | NEW-KISAAN | My pending approvals (shown as cards) | JWT | self | — |
| GET | `/api/v2/kisaan/approvals/:uuid` | NEW-KISAAN | Detail incl. localised summary | JWT | principal | — |
| POST | `/api/v2/kisaan/approvals/:uuid/approve` | NEW-KISAAN | Approve (tap / voice readback / WhatsApp button / OTP) | JWT (**the principal only**; the AI service key can never approve) | principal | 🔁 |
| POST | `/api/v2/kisaan/approvals/:uuid/reject` | NEW-KISAAN | Reject | JWT | principal | 🔁 |
| POST | `/api/v2/kisaan/approvals/:uuid/otp` | NEW-KISAAN | Send OTP for `requires_otp` approvals (assisted/high-value, APR-007) | JWT | principal | — |

Approve request: `{ "channel": "app_tap" | "voice_readback" | "whatsapp_button" | "otp", "readback_transcript": "haan ji, 60 quintal 2300 te pakka", "otp": "123456" }`. Validation: the principal must equal `user_id`; status `pending`; not expired (15 min); for `voice_readback` the transcript must contain an affirmative intent **and** the gateway must have played back the amount and qty (logged); `otp` required when `requires_otp`. Errors: `409 APPROVAL_EXPIRED`, `409 STATE_CONFLICT`, `403 NOT_PRINCIPAL`, `401 OTP_INVALID`.

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
The user's client (not the AI Gateway) then calls `POST /negotiations/:uuid/accept` with this `approval_request_id`. The API re-validates the approval (status, expiry, params hash, principal) and atomically marks it `executed`. The Gateway learns the outcome from the `kisaan.approval.*` / domain events and resumes the conversation. For `voice_readback`, the read-back is played by the client/Gateway, but the approve call itself is made by the client after the user's explicit confirmation.

### 3.20 Seller stores (module 20) — 2A.4

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/public/stores/:slug` | NEW-KISAAN | Public store page data: profile, badges, rating, service area (district), active listings (with tiers), public coupons, open groups, policies. 301 for old slugs. | None | — | — |
| GET | `/api/v2/kisaan/public/stores/:slug/listings?page=` | NEW-KISAAN | Paginated store listings | None | — | — |
| GET | `/api/v2/public/stores/:slug`, `/:slug/products`, `/:slug/reviews` | EXISTING-OPSAPI | Base public store (reused for SEO fallbacks & reviews) | None | — | — |
| GET | `/api/v2/kisaan/me/store` | NEW-KISAAN | My store (auto-created on first publish, STR-001) | JWT | seller | — |
| PATCH | `/api/v2/kisaan/me/store` | NEW-KISAAN | Name, slug (once/30 days), banner, logo, description, policies, contact mode (STR-004) | JWT | seller | — |
| POST | `/api/v2/kisaan/me/store/banner` · `/logo` | NEW-KISAAN | Image uploads | JWT | seller | 🔁 |
| GET | `/api/v2/kisaan/me/store/qr` | NEW-KISAAN | QR PNG/SVG (STR-005) | JWT | seller | — |
| GET | `/api/v2/kisaan/me/store/analytics?from=&to=` | NEW-KISAAN | Views, shares, enquiries (STR-008) | JWT | seller | — |
| PUT | `/api/v2/stores/:id` | EXISTING-OPSAPI | Underlying opsapi store update (called by Kisaan service, not clients) | — | — | — |

Slug validation: `^[a-z0-9](?:[a-z0-9-]{2,48}[a-z0-9])$`, profanity list (pa/hi/en), reserved words.

### 3.21 Wholesale pricing (module 21) — 2A.1

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| GET | `/api/v2/kisaan/listings/:uuid/wholesale` | NEW-KISAAN | Tiers + whole-lot config | JWT | owner | — |
| PUT | `/api/v2/kisaan/listings/:uuid/wholesale` | NEW-KISAAN | Replace config atomically (enable flag, up to 5 tiers, whole-lot) | JWT | owner, `If-Match` | — |
| GET | `/api/v2/kisaan/public/listings/:uuid/price?qty=&unit=` | NEW-KISAAN | Public price calculator (tier/whole-lot applied) for product page & search (WHL-007) | Optional JWT | — | — |
| POST | `/api/v2/kisaan/listings/:uuid/wholesale/suggest` | NEW-KISAAN → AI | AI-suggested tiers (P2, WHL-011), draft only | JWT | owner | — |

PUT body:
```json
{ "enabled": true,
  "tiers": [ { "min_qty": { "value": "50", "unit": "qtl" }, "discount_type": "percentage", "value": "5" },
             { "min_qty": { "value": "80", "unit": "qtl" }, "discount_type": "fixed_per_unit", "value": "200.00", "value_per_unit": "qtl" } ],
  "whole_lot": { "enabled": true, "price": { "amount": "2230.00", "per_unit": "qtl" } } }
```
Validation (WHL-003): ≤ 5 tiers; strictly increasing `min_qty`; non-decreasing effective discount; `min_qty ≥ MOQ`; effective price ≥ price floor and > 0; whole-lot price < list price. Errors: `422 TIER_RULES_VIOLATED` with per-tier `details`. Changes never affect existing reservations or orders (WHL-010).

### 3.22 Buying groups & group orders (module 22) — 2A.2

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/groups` ✋ | NEW-KISAAN | Leader creates group (listing- or RFQ-based) | JWT | group_leader (verified) | 🔁 |
| GET | `/api/v2/kisaan/public/groups/:slug` | NEW-KISAAN | **Public** group page: leader (name, badge, rating), area, product, target, committed qty, progress, deadline, projected price (GRP-004) | None | — | — |
| GET | `/api/v2/kisaan/public/groups?district=&commodity=&lat=&lng=&radius_km=` | NEW-KISAAN | Discover groups | None | — | — |
| PATCH | `/api/v2/kisaan/groups/:uuid` | NEW-KISAAN | Edit before first member joins (title, deadlines within limits) | JWT | leader | — |
| POST | `/api/v2/kisaan/groups/:uuid/join` ✋ | NEW-KISAAN | Member commits qty → **pays the PA directly** for allocation at projected price (GRP-005, GRP-006) | JWT | buyer (phone-verified) | 🔁 |
| PATCH | `/api/v2/kisaan/groups/:uuid/membership` | NEW-KISAAN | Change committed qty before deadline (adjusts payment/refund) | JWT | member | 🔁 |
| POST | `/api/v2/kisaan/groups/:uuid/leave` | NEW-KISAAN | Leave before deadline → full refund (GRP-007) | JWT | member | 🔁 |
| GET | `/api/v2/kisaan/groups/:uuid/members` | NEW-KISAAN | Leader view (masked names, qty, payment status) | JWT | leader | — |
| POST | `/api/v2/kisaan/groups/:uuid/close` ✋ | NEW-KISAAN | Leader closes: `proceed_full` / `proceed_partial` / `cancel` (GRP-008) → group order + inventory reservation for the total | JWT | leader | 🔁 |
| GET | `/api/v2/kisaan/group-orders/:uuid` | NEW-KISAAN | Group order + allocations + shipment | JWT | leader, seller, member (own allocation) | — |
| POST | `/api/v2/kisaan/group-orders/:uuid/leader-receipt` | NEW-KISAAN | Leader confirms receipt at the drop point (GRP-010) | JWT | leader | 🔁 |
| POST | `/api/v2/kisaan/group-allocations/:uuid/confirm-receipt` | NEW-KISAAN | Member confirms own allocation (or disputes) | JWT | member | 🔁 |
| GET/POST | `/api/v2/kisaan/groups/:uuid/announcements` | NEW-KISAAN | Leader → members announcements (in-app chat channel, phone hidden) (GRP-015) | JWT | leader post / members read | — |

#### Example: create group
```http
POST /api/v2/kisaan/groups
X-Kisaan-Active-Role: group_leader
Idempotency-Key: 4e3d…
{ "basis": "listing", "listing_uuid": "kinnow-7c1e…",
  "title": "Dugri Phase 2 — Abohar Kinnow peti",
  "area": { "name": "Dugri Phase 2, Ludhiana", "district_code": "LDH", "lat": 30.8695, "lng": 75.8380, "radius_km": 3 },
  "drop_point_address_uuid": "addr_dp_88…",
  "target_qty": { "value": "2000", "unit": "kg" }, "min_qty_to_proceed": { "value": "1500", "unit": "kg" },
  "member_min_qty": { "value": "20", "unit": "kg" }, "member_max_qty": { "value": "200", "unit": "kg" },
  "join_deadline": "2026-11-20T20:00:00+05:30", "visibility": "public",
  "approval_request_id": "ap_aa90…" }
```
```json
{ "success": true,
  "data": { "uuid": "g_51c2…", "slug": "dugri-phase-2-abohar-kinnow", "status": "open",
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
            "amount_payable": "1520.00", "price_basis": "projected price ₹38.00/kg at target qty",
            "if_group_closes_partial": "Price recalculated at actual group qty; difference refunded or the extra (max ₹168) needs your approval",
            "payment": { "uuid": "p_ff01…", "provider_order_id": "order_Rst901", "amount": "1520.00" },
            "group_progress": { "committed_kg": "1180.000", "target_kg": "2000.000", "pct": 59, "members": 24 } } }
```

### 3.23 Bulk buyer / group leader signup (module 23)

| Method | Path | Tag | Purpose | Auth | Perm | Idem |
|---|---|---|---|---|---|---|
| POST | `/api/v2/kisaan/group-leader/applications` | NEW-KISAAN | **Separate leader signup** (GRP-001): leader_type, organisation, area, proof of association doc, identity (T1+), acceptance of the group-leader agreement | JWT (buyer role, phone verified) | self | 🔁 |
| GET | `/api/v2/kisaan/group-leader/applications/me` | NEW-KISAAN | Status & missing items | JWT | self | — |
| POST | `/api/v2/kisaan/group-leader/applications/me/documents` | NEW-KISAAN | Upload area proof (private KYC bucket) | JWT | self | 🔁 |
| GET | `/api/v2/kisaan/public/group-leaders/:user_uuid` | NEW-KISAAN | Public leader profile: area, badge, groups run, completion rate, rating (GRP-002) | None | — | — |
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
| POST | `/api/v2/kisaan/me/membership/cancel` ✋ | NEW-KISAAN | Cancel (≤ 2 taps / one voice command); stops renewal; refund per MEM-009 | JWT | self | 🔁 |
| PUT | `/api/v2/kisaan/me/membership/auto-renew` | NEW-KISAAN | Toggle auto-renew (turning on requires mandate setup) | JWT | self | — |
| POST | `/api/v2/kisaan/me/membership/re-accept-terms` | NEW-KISAAN | Accept a materially changed T&C version | JWT | self | 🔁 |

Validation: `terms.version` must equal the current `membership_tc` version for the language, else `409 TERMS_VERSION_OUTDATED`. `terms.body_sha256` must match. `auto_renew` defaults to **false** and must be explicitly set (MEM-007). A trial is not allowed if the identity key has had a trial (MEM-004 → `409 TRIAL_ALREADY_USED`). **No autopay is tied to a trial** (D-11, T&C): with `start_trial: true`, `auto_renew` must be false and no `mandate_method` may be sent (`422 TRIAL_NO_MANDATE`). The trial ends automatically; the user buys a plan separately (that request creates the mandate if auto-renew is chosen).

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
| POST | `/api/v2/kisaan/me/store/coupons` | NEW-KISAAN | Create coupon | JWT | seller | 🔁 |
| GET | `/api/v2/kisaan/me/store/coupons?status=` | NEW-KISAAN | List | JWT | seller | — |
| GET/PATCH | `/api/v2/kisaan/me/store/coupons/:uuid` | NEW-KISAAN | Edit (limits/time/status). Code/type immutable after first redemption. | JWT | owner, `If-Match` | — |
| POST | `/api/v2/kisaan/me/store/coupons/:uuid/pause` · `/resume` | NEW-KISAAN | Status | JWT | owner | — |
| GET | `/api/v2/kisaan/me/store/coupons/:uuid/report` | NEW-KISAAN | Redemptions, discount given, GMV influenced (CPN-010) | JWT | owner | — |
| POST | `/api/v2/kisaan/coupons/validate` | NEW-KISAAN | Validate a code for a cart/quote context (no reservation) | JWT | buyer | — |
| GET | `/api/v2/kisaan/public/stores/:slug/coupons` | NEW-KISAAN | Public coupons (CPN-007) with real end times (CPN-009) | None | — | — |
| — | `/api/v2/billing/coupons`, `/api/v2/public/billing/coupons/check` | EXISTING-OPSAPI | Platform **billing** coupons, not used for seller coupons. Candidate for Future platform coupons (CPN-012). | — | — | — |

#### Example: create coupon
```http
POST /api/v2/kisaan/me/store/coupons
Idempotency-Key: c0de…
{ "code": "KANAK2", "title": "2% off on wheat", "discount_type": "percentage", "discount_value": "2",
  "max_discount_amount": "3000.00", "min_order_value": "50000.00", "min_qty": { "value": "20", "unit": "qtl" },
  "applies_to": "listings", "listing_uuids": ["5d1f7c2a-9e3b-4d8a-b6c1-2e3f4a5b6c7d"],
  "starts_at": "2026-11-14T00:00:00+05:30", "ends_at": "2026-11-30T23:59:59+05:30",
  "total_usage_limit": 20, "per_user_limit": 1, "eligibility": "all", "allow_on_negotiated": false, "visibility": "public" }
```
```json
{ "success": true, "data": { "uuid": "cp_8e7f…", "code": "KANAK2", "status": "active", "funded_by": "seller", "used_count": 0, "remaining": 20 } }
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
Invalid example: `422 COUPON_NOT_APPLICABLE` with `context.reason ∈ {expired, not_started, paused, min_order_not_met, min_qty_not_met, listing_not_eligible, user_not_eligible, per_user_limit_reached, negotiated_price, self_redemption}`; or `409 COUPON_EXHAUSTED`. The actual reservation of a use happens in `POST /checkout/quote` (§3.10) and is committed on payment capture.

---

## 4. Supporting modules

### 4.1 Mandi prices (MKT)

| Method | Path | Tag | Purpose | Auth |
|---|---|---|---|---|
| GET | `/api/v2/kisaan/public/mandi/prices?commodity=&market=&district=&from=&to=` | NEW-KISAAN | Daily min/max/modal with source, date, `stale` flag (MKT-003) | None |
| GET | `/api/v2/kisaan/public/mandi/compare?commodity=&markets=` | NEW-KISAAN | Inter-market comparison (MKT-005) | None |
| GET | `/api/v2/kisaan/public/mandi/trend?commodity=&market=&days=30` | NEW-KISAAN | Series where data exists (no forecasts, MKT-006) | None |
| GET | `/api/v2/kisaan/public/msp?commodity=` | NEW-KISAAN | MSP with season & source (MKT-007) | None |
| GET | `/api/v2/kisaan/public/trade-rules?category=&state=` | NEW-KISAAN | Whether checkout is enabled for a category in a state (UI mode switch, CMP-046) | None |

Response rows always include `source`, `source_dataset`, `arrival_date`, `fetched_at`, `quality_flags`.

### 4.2 Support & disputes (SUP, DSP)

| Method | Path | Tag | Purpose | Auth |
|---|---|---|---|---|
| POST/GET | `/api/v2/kisaan/support/tickets[/:uuid]` | NEW-KISAAN | Create/list tickets (AI or user) | JWT |
| POST | `/api/v2/kisaan/support/tickets/:uuid/messages` | NEW-KISAAN | Reply | JWT |
| POST | `/api/v2/kisaan/support/callback-requests` | NEW-KISAAN | Phone callback for low-literacy users (SUP-004) | JWT |
| GET | `/api/v2/kisaan/public/grievance-officer` | NEW-KISAAN | Grievance officer details (SUP-005) `[LEGAL REVIEW]` | None |
| POST | `/api/v2/kisaan/orders/:uuid/disputes` ✋ | NEW-KISAAN | Raise dispute within the acceptance window → freezes settlement | JWT |
| GET | `/api/v2/kisaan/disputes/:uuid` | NEW-KISAAN | Status, timeline | JWT (party) |
| POST | `/api/v2/kisaan/disputes/:uuid/evidence` | NEW-KISAAN | Upload photos/weighbridge slip/statement | JWT (party) |
| POST | `/api/v2/kisaan/disputes/:uuid/respond` | NEW-KISAAN | Counter-party response | JWT (party) |

### 4.3 Uploads

Media uploads go through Kisaan endpoints (multipart), which store files via the opsapi MinIO helper/documents service (`/api/v2/documents/upload`, EXISTING-OPSAPI, used server-side). Voice clips for AI go to the AI Gateway upload endpoint. Clients never get write credentials to buckets. Read access uses signed URLs (KYC ≤ 5 min; listing media via public CDN for approved, non-KYC images only).

---

## 5. Events & webhooks

### 5.1 Domain events (published by the Kisaan plugin through the opsapi outbox; manifest `publishes`)

Delivery is at-least-once via the opsapi plugin event outbox (retries up to 8 times). Consumers: AI-NTF (notifications), AI-MAT (matching), analytics, namespace webhooks (`/api/v2/namespace/webhooks`, EXISTING-OPSAPI) for partner integrations.

| Event | Payload (key fields) | Typical consumers |
|---|---|---|
| `kisaan.listing.published` / `.paused` / `.closed` / `.out_of_stock` | listing_uuid, seller_uuid, commodity, district, available_kg, list_price_per_kg | Matching, saved-search alerts, store cache |
| `kisaan.inventory.low_stock` | listing_uuid, available_kg, threshold_kg | Seller notification |
| `kisaan.inventory.reservation_expired` | reservation_uuid, listing_uuid, source | Notifications |
| `kisaan.requirement.published` | requirement_uuid, commodity, qty_kg, districts | Matching |
| `kisaan.offer.created` / `.countered` / `.accepted` / `.rejected` / `.expired` | negotiation_uuid, offer_uuid, round_no, parties | Notifications, AI-NEG |
| `kisaan.order.created` / `.confirmed` / `.ready` / `.in_transit` / `.delivered` / `.completed` / `.cancelled` | order_uuid, status, totals | Notifications, invoices, settlement, analytics |
| `kisaan.payment.captured` / `.failed` / `.refunded` | payment_uuid, purpose, amount | Orders, finance |
| `kisaan.settlement.released` / `.frozen` | settlement_uuid, beneficiary_type | Finance, notifications |
| `kisaan.transport.request_created` / `.quote_submitted` / `.quote_accepted` | request/quote uuids | Transporters, requester |
| `kisaan.shipment.status_changed` | shipment_uuid, status | Buyer/seller notifications |
| `kisaan.group.created` / `.threshold_met` / `.closed` / `.cancelled` / `.member_joined` / `.member_left` | group_uuid, committed_kg, target_kg | Members, leader, discovery |
| `kisaan.membership.activated` / `.renewal_upcoming` / `.renewed` / `.payment_failed` / `.cancelled` / `.expired` | membership_uuid, period_end | Notifications (pre-debit notice), finance |
| `kisaan.coupon.exhausted` / `.expired` | coupon_uuid | Seller |
| `kisaan.dispute.opened` / `.resolved` | dispute_uuid, resolution | Finance, parties |
| `kisaan.verification.decided` | user_uuid, check_type, status | User notification, role activation |
| `kisaan.risk.flag_raised` | subject, score, reasons | Admin risk console |
| `kisaan.approval.created` / `.approved` / `.expired` | approval_uuid, action_type | AI Gateway, notifications |
| `kisaan.mandi.prices_ingested` | date, records, markets | Price alerts |

Also consumed from opsapi core (`order` business events `confirmed`, `shipped`, `delivered`, `cancelled`, `paid`, `refunded`) for compatibility. KISAAN logic relies on its own `kisaan.*` events because payloads of core events mirror DB rows and may change between opsapi releases.

### 5.2 Inbound webhooks

| Source | Endpoint | Verification |
|---|---|---|
| Payment aggregator | `/api/v2/kisaan/public/webhooks/payments/:provider` | HMAC signature + server-side fetch |
| WhatsApp Cloud API | `/api/v2/kisaan/public/webhooks/whatsapp` (GET verify token, POST events) | `X-Hub-Signature-256` with app secret |
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
| 5 | Listings | 12 | 0 |
| 6 | Search | 5 | 0 |
| 7 | Inventory | 6 | 0 |
| 8 | Buyer requirements & enquiries | 8 | 1 |
| 9 | Offers | 4 | 0 |
| 10 | Negotiations | 5 | 0 |
| 11 | Orders & checkout | 9 | 2 |
| 12 | Payments (+ invoices) | 9 + 3 | 0 (Stripe blocked) |
| 13 | Logistics | 9 | 6 |
| 14 | Notifications | 6 | 3 |
| 15 | Reviews | 5 | 1 |
| 16 | Admin | 22 | 2 groups |
| 17 | AI assistant (AI Gateway) | 7 | 0 |
| 18 | AI agents (internal) | 5 | 0 |
| 19 | Approvals | 6 | 0 |
| 20 | Seller stores | 7 | 2 |
| 21 | Wholesale pricing | 4 | 0 |
| 22 | Buying groups & group orders | 12 | 0 |
| 23 | Group leader signup | 5 | 0 |
| 24 | Membership & T&C | 9 | 0 |
| 25 | Coupons | 7 | 0 (billing coupons Future) |
| — | Mandi/trade rules, support/disputes | 5 + 8 | 0 |
| — | Inbound webhooks | 4 | 0 |

(Counts treat each method+path row as one endpoint; grouped rows such as `pause · resume` count as one.)

---

## 7. Open items

| ID | Item |
|---|---|
| `[UNVERIFIED]` | Plugin SDK ability to mint opsapi-compatible JWTs / reuse `refresh_tokens` (Phase 1 spike) |
| `[UNVERIFIED]` | Whether opsapi chat channel creation can be called from plugin code for enquiry threads (else use HTTP to `/api/chat/channels`) |
| `[UNVERIFIED]` | Exact opsapi `orders.status` / `financial_status` value sets for the mapping in [DATABASE_SCHEMA](DATABASE_SCHEMA.md) §7.1 |
| `[DECISION D-09]` | Payment aggregator (Razorpay vs Cashfree); webhook payload examples follow the chosen PA |
| `[DECISION D-80]` | APMC gating per category × state, buyer licence requirement, levy rates (CMP-046) |
| `[ASSUMPTION A-14]` | Production domains `kisaan.in`, `api.kisaan.in`, `ai.kisaan.in` (placeholders) |
| `[TAX REVIEW]` | GST treatment shown in quote examples (unprocessed cereals) and TCS/TDS on settlements |
