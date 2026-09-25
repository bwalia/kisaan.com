#!/usr/bin/env bash
set -euo pipefail

# Seed demo admin user after migrations (API or sqlx migrate already applied country seed).
DATABASE_URL="${DATABASE_URL:-postgres://kisaan:kisaan@localhost:5432/kisaan}"
API_URL="${API_URL:-http://localhost:8081}"

echo "Waiting for API at $API_URL ..."
for i in $(seq 1 60); do
  if curl -sf "$API_URL/readyz" >/dev/null; then
    break
  fi
  sleep 1
done

curl -sf "$API_URL/readyz" >/dev/null || { echo "API not ready"; exit 1; }

echo "Registering demo admin (idempotent)..."
curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/api/v1/auth/register" \
  -H 'content-type: application/json' \
  -d '{"email":"admin@kisaan.local","password":"kisaan-demo","name":"Kisaan Admin"}' \
  || true

echo
echo "Countries:"
curl -sf "$API_URL/api/v1/countries" | head -c 500
echo
echo "Seed complete. Demo login: admin@kisaan.local / kisaan-demo"
