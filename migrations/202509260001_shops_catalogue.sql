-- Phase 2: expand shops + catalogue (products, variants, inventory, members)
-- Shop slug uniqueness is country-scoped: UNIQUE(country_code, slug)

ALTER TABLE shops ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS default_currency CHAR(3) REFERENCES currencies(code);
ALTER TABLE shops ADD COLUMN IF NOT EXISTS contact TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Replace global slug uniqueness with country-scoped uniqueness
ALTER TABLE shops DROP CONSTRAINT IF EXISTS shops_slug_key;
DROP INDEX IF EXISTS shops_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS shops_country_slug_uidx ON shops (country_code, slug);

-- Backfill currency from country for any existing rows
UPDATE shops s
SET default_currency = c.default_currency
FROM countries c
WHERE s.country_code = c.code
  AND s.default_currency IS NULL;

-- New shops must always set currency; allow NOT NULL once backfilled
ALTER TABLE shops ALTER COLUMN default_currency SET NOT NULL;

CREATE TABLE IF NOT EXISTS shop_members (
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'OWNER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (shop_id, user_id),
    CONSTRAINT shop_members_role_check CHECK (role IN ('OWNER', 'STAFF'))
);

CREATE INDEX IF NOT EXISTS idx_shop_members_user ON shop_members(user_id);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT products_status_check CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    CONSTRAINT products_shop_sku_uidx UNIQUE (shop_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_products_shop ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Default',
    amount_minor_units BIGINT NOT NULL,
    currency CHAR(3) NOT NULL REFERENCES currencies(code),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT product_variants_amount_nonneg CHECK (amount_minor_units >= 0)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);

CREATE TABLE IF NOT EXISTS inventory (
    variant_id UUID PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT inventory_quantity_nonneg CHECK (quantity >= 0)
);
