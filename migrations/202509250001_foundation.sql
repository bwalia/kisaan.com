-- Foundation schema: users, countries, currencies, shops (first-class)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE currencies (
    code CHAR(3) PRIMARY KEY,
    name TEXT NOT NULL,
    minor_units SMALLINT NOT NULL DEFAULT 2,
    symbol TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE countries (
    code CHAR(2) PRIMARY KEY,
    name TEXT NOT NULL,
    default_currency CHAR(3) NOT NULL REFERENCES currencies(code),
    default_locale TEXT NOT NULL,
    measurement_system TEXT NOT NULL DEFAULT 'metric',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency CHAR(3) NOT NULL REFERENCES currencies(code),
    quote_currency CHAR(3) NOT NULL REFERENCES currencies(code),
    rate_numerator BIGINT NOT NULL,
    rate_denominator BIGINT NOT NULL DEFAULT 100000000,
    as_of TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (base_currency, quote_currency, as_of)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'CUSTOMER',
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_user_id UUID NOT NULL REFERENCES users(id),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    country_code CHAR(2) NOT NULL REFERENCES countries(code),
    status TEXT NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shops_farmer ON shops(farmer_user_id);
CREATE INDEX idx_shops_country ON shops(country_code);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
