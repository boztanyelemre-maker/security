-- 004c_offers_status_enum — offers.status setine SHORTLISTED ekle

BEGIN;

-- Eski CHECK constraint'i kaldırıp yeni set ile ekle (Postgres varsayılan adı için korumalı drop)
ALTER TABLE offers DROP CONSTRAINT IF EXISTS offers_status_check;
ALTER TABLE offers
  ADD CONSTRAINT offers_status_check
  CHECK (status IN ('SUBMITTED', 'SHORTLISTED', 'WITHDRAWN', 'REJECTED'));

COMMIT;

