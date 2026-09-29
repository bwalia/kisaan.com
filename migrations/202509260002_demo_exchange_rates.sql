-- Demo exchange rates for approximate display conversion (Phase 2).
-- rate = numerator / denominator. Stored catalogue prices are never mutated.

INSERT INTO exchange_rates (base_currency, quote_currency, rate_numerator, rate_denominator, as_of)
VALUES
    ('GBP', 'USD', 127000000, 100000000, NOW()),
    ('GBP', 'INR', 10500000000, 100000000, NOW()),
    ('USD', 'GBP', 79000000, 100000000, NOW()),
    ('USD', 'INR', 8300000000, 100000000, NOW()),
    ('INR', 'GBP', 950000, 100000000, NOW()),
    ('INR', 'USD', 1200000, 100000000, NOW())
ON CONFLICT DO NOTHING;
