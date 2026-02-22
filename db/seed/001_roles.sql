-- Roles seed: BUYER_USER, PROVIDER_USER, ADMIN
-- Idempotent: ON CONFLICT (code) DO NOTHING
-- Kontrol: SELECT * FROM roles;

BEGIN;

INSERT INTO roles (code, name)
VALUES
  ('BUYER_USER',    'Buyer User'),
  ('PROVIDER_USER', 'Provider User'),
  ('ADMIN',         'Admin')
ON CONFLICT (code) DO NOTHING;

COMMIT;
