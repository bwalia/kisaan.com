# Development

## Prerequisites

- Docker / Docker Compose
- Rust stable (`rustup`)
- Node 20+ and Yarn or npm

## Full stack

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:8081 |
| Postgres | localhost:5432 (`kisaan` / `kisaan` / db `kisaan`) |

Seed demo user:

```bash
chmod +x scripts/seed.sh
./scripts/seed.sh
```

Login: `admin@kisaan.local` / `kisaan-demo`

## API only (hot reload)

```bash
docker compose up -d postgres
export DATABASE_URL=postgres://kisaan:kisaan@localhost:5432/kisaan
export JWT_SECRET=dev-only-change-me
cargo run -p kisaan-api
```

Tests:

```bash
cargo test --workspace
cargo clippy --workspace --all-targets -- -D warnings
```

## Web only

```bash
cd apps/web
cp .env.local.example .env.local
yarn install   # or npm install
yarn dev
```

Open http://localhost:3000/uk

## Useful curls

```bash
curl -s localhost:8081/healthz
curl -s localhost:8081/readyz
curl -s localhost:8081/api/v1/countries
curl -s -X POST localhost:8081/api/v1/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"you@example.com","password":"secret123","name":"You"}'
```
