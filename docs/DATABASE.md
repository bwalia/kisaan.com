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

Exchange rates use rational storage (`rate_numerator` / `rate_denominator`) and must be snapshotted onto any converted payment (Phase 3).

### Migrations

SQLx migrations live in `/migrations`. The API runs them on boot via `kisaan_db::migrate`.

| File | Contents |
|------|----------|
| `202509250001_foundation.sql` | currencies, countries, exchange_rates, users, refresh_tokens, **shops** |
| `202509250002_seed_countries.sql` | GBP/EUR/USD/INR/CAD/AUD + GB/IN/US/IE/DE/FR/CA/AU |

### Shop table (first-class)

```sql
shops (
  id, farmer_user_id, slug, name, country_code, status, created_at, updated_at
)
```

`status` values start as `DRAFT` / later `PUBLISHED` / `SUSPENDED`.

## NebulaDB (later)

Repo: https://github.com/bwalia/nebuladb

Capabilities we will use in Phase 6:

- REST `/api/v1` document ingest + `/api/v1/ai/search`
- Postgres wire + `semantic_match()`
- gRPC Document/Search/AI services
- HNSW vectors + embeddings

**Gaps for commerce:** limited SQL (no OR, outer joins, subqueries, CTEs); not designed as a financial ledger. Do not invent fake NebulaDB APIs.

### Planned adapter

```text
ProductUpdated event
  → search indexer worker
  → NebulaDB document upsert + embed
```

Keep product writes on Postgres; async dual-write to NebulaDB for discovery.
