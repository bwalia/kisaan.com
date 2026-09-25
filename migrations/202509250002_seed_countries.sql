-- Seed currencies and countries for Phase 1

INSERT INTO currencies (code, name, minor_units, symbol) VALUES
    ('GBP', 'Pound Sterling', 2, '£'),
    ('EUR', 'Euro', 2, '€'),
    ('USD', 'US Dollar', 2, '$'),
    ('INR', 'Indian Rupee', 2, '₹'),
    ('CAD', 'Canadian Dollar', 2, 'C$'),
    ('AUD', 'Australian Dollar', 2, 'A$')
ON CONFLICT (code) DO NOTHING;

INSERT INTO countries (code, name, default_currency, default_locale, measurement_system, is_active) VALUES
    ('GB', 'United Kingdom', 'GBP', 'en-GB', 'metric', true),
    ('IN', 'India', 'INR', 'en-IN', 'metric', true),
    ('US', 'United States', 'USD', 'en-US', 'imperial', true),
    ('IE', 'Ireland', 'EUR', 'en-IE', 'metric', true),
    ('DE', 'Germany', 'EUR', 'de-DE', 'metric', true),
    ('FR', 'France', 'EUR', 'fr-FR', 'metric', true),
    ('CA', 'Canada', 'CAD', 'en-CA', 'metric', true),
    ('AU', 'Australia', 'AUD', 'en-AU', 'metric', true)
ON CONFLICT (code) DO NOTHING;

-- Demo admin: password is "kisaan-demo" (Argon2id hash generated at seed time by script if needed)
-- Placeholder hash for "kisaan-demo" — scripts/seed.sh upserts a real hash.
