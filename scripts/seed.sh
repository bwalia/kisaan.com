#!/usr/bin/env bash
set -euo pipefail

# Seed demo users + multi-country published shops after migrations.
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

register() {
  local email="$1" password="$2" name="$3"
  curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/api/v1/auth/register" \
    -H 'content-type: application/json' \
    -d "{\"email\":\"$email\",\"password\":\"$password\",\"name\":\"$name\"}" \
    || true
  echo
}

login_token() {
  local email="$1" password="$2"
  curl -sf -X POST "$API_URL/api/v1/auth/login" \
    -H 'content-type: application/json' \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
    | python3 -c 'import sys,json; print(json.load(sys.stdin)["token"])'
}

create_shop() {
  local token="$1" name="$2" slug="$3" country="$4" description="$5"
  curl -sf -X POST "$API_URL/api/v1/shops" \
    -H 'content-type: application/json' \
    -H "authorization: Bearer $token" \
    -d "{\"name\":\"$name\",\"slug\":\"$slug\",\"country_code\":\"$country\",\"description\":\"$description\"}"
}

publish_shop() {
  local token="$1" id="$2"
  curl -sf -X POST "$API_URL/api/v1/shops/$id/publish" \
    -H "authorization: Bearer $token" >/dev/null
}

add_product() {
  local token="$1" shop_id="$2" sku="$3" name="$4" amount="$5" qty="$6"
  local product
  product=$(curl -sf -X POST "$API_URL/api/v1/shops/$shop_id/products" \
    -H 'content-type: application/json' \
    -H "authorization: Bearer $token" \
    -d "{\"sku\":\"$sku\",\"name\":\"$name\",\"amount_minor_units\":$amount,\"quantity\":$qty}")
  local pid
  pid=$(echo "$product" | python3 -c 'import sys,json; print(json.load(sys.stdin)["data"]["id"])')
  curl -sf -X POST "$API_URL/api/v1/products/$pid/publish" \
    -H "authorization: Bearer $token" >/dev/null
}

echo "Registering demo users (idempotent)..."
register "admin@kisaan.local" "kisaan-demo" "Kisaan Admin"
register "farmer.uk@kisaan.local" "kisaan-demo" "Cotswold Greens"
register "farmer.in@kisaan.local" "kisaan-demo" "Punjab Harvest"
register "farmer.us@kisaan.local" "kisaan-demo" "Valley Organics"

seed_market() {
  local email="$1" name="$2" slug="$3" country="$4" desc="$5" sku="$6" product="$7" amount="$8"
  local token shop_json shop_id
  token=$(login_token "$email" "kisaan-demo")

  # Skip create if shop already published
  if curl -sf "$API_URL/api/v1/shops/$country/$slug" >/dev/null 2>&1; then
    echo "Shop $country/$slug already exists — skip"
    return
  fi

  shop_json=$(create_shop "$token" "$name" "$slug" "$country" "$desc" || true)
  if [[ -z "$shop_json" ]]; then
    echo "Could not create $slug (maybe slug taken) — listing my shops"
    return
  fi
  shop_id=$(echo "$shop_json" | python3 -c 'import sys,json; print(json.load(sys.stdin)["data"]["id"])')
  add_product "$token" "$shop_id" "$sku" "$product" "$amount" 25
  publish_shop "$token" "$shop_id"
  echo "Published $country/$slug"
}

echo "Seeding GB / IN / US shops..."
seed_market "farmer.uk@kisaan.local" "Cotswold Greens" "cotswold-greens" "GB" \
  "Seasonal veg from the Cotswolds." "KALE-1" "Curly kale bunch" 250
seed_market "farmer.in@kisaan.local" "Punjab Harvest" "punjab-harvest" "IN" \
  "Fresh produce from Punjab farms." "ATA-5" "Wholewheat atta 5kg" 34900
seed_market "farmer.us@kisaan.local" "Valley Organics" "valley-organics" "US" \
  "Organic boxes from the Central Valley." "TOMA-1" "Heirloom tomatoes lb" 499

echo
echo "Countries:"
curl -sf "$API_URL/api/v1/countries" | head -c 400
echo
echo "UK shops:"
curl -sf "$API_URL/api/v1/countries/uk/shops" | head -c 400
echo
echo "Seed complete."
echo "  Admin:  admin@kisaan.local / kisaan-demo"
echo "  Farmers: farmer.uk@kisaan.local, farmer.in@kisaan.local, farmer.us@kisaan.local / kisaan-demo"
echo "  Shops:  /uk/shops/cotswold-greens  /in/shops/punjab-harvest  /us/shops/valley-organics"
