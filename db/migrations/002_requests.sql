-- 002_requests — Talepler
-- Tablo: requests

BEGIN;

CREATE TABLE IF NOT EXISTS requests (
  request_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  buyer_org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,

  status            TEXT NOT NULL CHECK (status IN ('DRAFT','PUBLISHED','CLOSED')),

  service_type      TEXT NOT NULL CHECK (service_type IN ('SILAHLI','SILAHSIZ','VIP','MOBIL','KARMA')),

  city_id           INT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  address_text      TEXT NOT NULL,

  site_type         TEXT NOT NULL,

  personnel_count   INT NOT NULL CHECK (personnel_count > 0),
  shift_type        TEXT NOT NULL CHECK (shift_type IN ('8','12','24')),

  start_date        DATE NOT NULL,
  contract_months   INT NOT NULL CHECK (contract_months > 0),

  budget_min_try    INT NOT NULL,
  budget_max_try    INT NOT NULL,

  subcontract_allowed BOOLEAN NOT NULL DEFAULT FALSE,
  subcontract_percent  INT NULL CHECK (subcontract_percent IS NULL OR (subcontract_percent >= 0 AND subcontract_percent <= 100)),

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requests_buyer_org_id ON requests(buyer_org_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_city_id ON requests(city_id);

COMMIT;

