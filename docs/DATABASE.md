# Database

## Primary: PostgreSQL 16

Transactional source of truth for marketplace state.

### Money

Never store money as floating point.

```text
amount_minor_units  BIGINT
currency            CHAR(3)
```

Example: `1299` + `GBP` = £12.99.

Exchange rates use rational storage (`rate_numerator` / `rate_denominator`).
Catalogue prices are **never mutated** by conversion — display-only approximate amounts may be
returned when `?display_currency=` differs from the shop currency.

### Migrations

SQLx migrations live in `/migrations`. The API runs them on boot via `kisaan_db::migrate`.

| File | Contents |
|------|----------|
| `202509250001_foundation.sql` | currencies, countries, exchange_rates, users, refresh_tokens, shops |
| `202509250002_seed_countries.sql` | GBP/EUR/USD/INR/CAD/AUD + GB/IN/US/IE/DE/FR/CA/AU |
| `202509260001_shops_catalogue.sql` | Shop branding fields, shop_members, products, variants, inventory |
| `202509260002_demo_exchange_rates.sql` | Sample rates for display conversion |

### Shop (sub-warehouse stall)

```sql
shops (
  id, farmer_user_id, slug, name,
  description, logo_url, banner_url,
  country_code, default_currency, contact,
  status, published_at, created_at, updated_at
)
-- UNIQUE (country_code, slug)
```

`status`: `DRAFT` → `PUBLISHED` (later `SUSPENDED`).

Members:

```sql
shop_members (shop_id, user_id, role OWNER|STAFF)
```

### Catalogue

```sql
products (id, shop_id, sku, name, description, status DRAFT|PUBLISHED|ARCHIVED)
product_variants (id, product_id, label, amount_minor_units, currency)
inventory (variant_id, quantity)
```

Phase 2 creates one default variant per product priced in `shop.default_currency`.

## NebulaDB (later)

Repo: https://github.com/bwalia/nebuladb

Keep product writes on Postgres; async dual-write to NebulaDB for discovery in Phase 6.
