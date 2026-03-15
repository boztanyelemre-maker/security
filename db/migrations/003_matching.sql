-- 003_matching — Request–provider eşleşmeleri
-- Tablo: request_matches

BEGIN;

CREATE TABLE IF NOT EXISTS request_matches (
  match_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  request_id      UUID NOT NULL REFERENCES requests(request_id) ON DELETE CASCADE,
  provider_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,

  match_score     INT NOT NULL,
  budget_band     TEXT NOT NULL CHECK (budget_band IN ('IN', 'EDGE', 'OUT')),

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_request_matches_request_id ON request_matches(request_id);
CREATE INDEX IF NOT EXISTS idx_request_matches_provider_org_id ON request_matches(provider_org_id);

COMMIT;

