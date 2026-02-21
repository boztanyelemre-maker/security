-- M00 — Altyapı (PostgreSQL extensions)
-- Çalıştırma: psql -d <db> -f M00_extensions.sql

BEGIN;

-- UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Optional (email case-insensitive)
-- CREATE EXTENSION IF NOT EXISTS citext;

COMMIT;
