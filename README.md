# Kisaan.com

Global **farmer-first grocery marketplace**. Consumers buy from independent farmer shops under one platform. More of the customer’s money reaches the grower.

## Stack (Phase 1)

| Layer | Choice |
|-------|--------|
| Web | Next.js App Router (`apps/web`) |
| API | Rust / Axum (`apps/api`) |
| DB | **PostgreSQL 16** (primary). NebulaDB deferred for semantic search / AI. |
| Domain | Shop is a first-class aggregate |

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

- Web: http://localhost:3000 → redirects to `/uk`
- API: http://localhost:8081/healthz
- Countries: http://localhost:8081/api/v1/countries
- OpenAPI stub: http://localhost:8081/openapi.json

```bash
chmod +x scripts/seed.sh && ./scripts/seed.sh
# Demo: admin@kisaan.local / kisaan-demo
```

## Repo layout

```text
apps/web          Next.js
apps/api          Axum binary
crates/           common, auth, users, countries, db
migrations/       SQLx SQL migrations
docker/           Dockerfiles
docs/             Architecture & development
```

## Docs

- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [DATABASE.md](docs/DATABASE.md)
- [DEVELOPMENT.md](docs/DEVELOPMENT.md)

## Phases

1. **Foundation** (this) — monorepo, Postgres, auth stubs, country config, homepage  
2. Marketplace — farmers, shops, products, search  
3. Commerce — cart, multi-farmer checkout, payments  
4–8 — fulfilment, farmer platform, AI, global, scale  

Legacy PHP Helm charts remain under `devops/` for reference only.
