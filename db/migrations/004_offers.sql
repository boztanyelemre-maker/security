-- 004_offers — Teklifler
-- Tablo: offers

BEGIN;

CREATE TABLE IF NOT EXISTS offers (
  offer_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  request_id         UUID NOT NULL REFERENCES requests(request_id) ON DELETE CASCADE,
  provider_org_id    UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,

  total_price_try    INT NOT NULL,
  price_breakdown_json JSONB,

  notes              TEXT,

  status             TEXT NOT NULL CHECK (status IN ('SUBMITTED', 'WITHDRAWN')),

  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offers_request_id ON offers(request_id);
CREATE INDEX IF NOT EXISTS idx_offers_provider_org_id ON offers(provider_org_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);

COMMIT;
