# Kisaan.com

Global **farmer-first grocery marketplace**. Kisaan is the online warehouse; each seller runs a branded sub-shop with its own catalogue and currency.

## Stack (Phase 2)

| Layer | Choice |
|-------|--------|
| Web | Next.js App Router (`apps/web`) — `/uk`, `/in`, `/us` markets |
| API | Rust / Axum (`apps/api`) |
| DB | **PostgreSQL 16** (primary). NebulaDB deferred for semantic search / AI. |
| Domain | Shop is a first-class sub-shop aggregate (`crates/shops`) |

## Quick start

```bash
# Postgres + API + Web
docker compose up --build

# Or local (API + Postgres only)
docker compose up -d postgres
export DATABASE_URL=postgres://kisaan:kisaan@localhost:5432/kisaan
export JWT_SECRET=dev-only-change-me
cargo run -p kisaan-api

cd apps/web && cp .env.local.example .env.local && yarn dev
```

- Web: http://localhost:3000 → `/uk`
- Shops: http://localhost:3000/uk/shops
- Seller: http://localhost:3000/uk/seller
- API: http://localhost:8081/healthz
- Countries: http://localhost:8081/api/v1/countries

```bash
chmod +x scripts/seed.sh && ./scripts/seed.sh
# Admin:   admin@kisaan.local / kisaan-demo
# Farmers: farmer.uk@kisaan.local (and .in / .us) / kisaan-demo
# Demo shops: /uk/shops/cotswold-greens, /in/shops/punjab-harvest, /us/shops/valley-organics
```

## Repo layout

```text
apps/web          Next.js country storefront + seller dashboard
apps/api          Axum binary
crates/           common, auth, users, countries, shops, db
migrations/       SQLx SQL migrations
docker/           Dockerfiles
docs/             Architecture & development
```

## Docs

- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [DATABASE.md](docs/DATABASE.md)
- [DEVELOPMENT.md](docs/DEVELOPMENT.md)

## Phases

1. **Foundation** — monorepo, Postgres, auth stubs, country config, homepage  
2. **Marketplace** (this) — multi-country shops, products, seller dashboard  
3. Commerce — cart, multi-farmer checkout, payments  
4–8 — fulfilment, farmer platform, AI, global, scale  

Legacy PHP Helm charts remain under `devops/` for reference only.
