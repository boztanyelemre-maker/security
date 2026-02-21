-- M06 — Eşleşme (request_matches)
-- Bağımlılık: M03 (organizations), M05 (requests)

BEGIN;

CREATE TABLE IF NOT EXISTS request_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  provider_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  match_status TEXT NOT NULL DEFAULT 'VISIBLE' CHECK (match_status IN ('VISIBLE','HIDDEN','BLOCKED')),

  fit_location SMALLINT NOT NULL DEFAULT 0 CHECK (fit_location IN (0,1,2)),
  fit_capacity SMALLINT NOT NULL DEFAULT 0 CHECK (fit_capacity IN (0,1,2)),
  fit_certifications SMALLINT NOT NULL DEFAULT 0 CHECK (fit_certifications IN (0,1,2)),
  fit_salary_sgk_tax SMALLINT NOT NULL DEFAULT 0 CHECK (fit_salary_sgk_tax IN (0,1,2)),
  fit_operational SMALLINT NOT NULL DEFAULT 0 CHECK (fit_operational IN (0,1,2)),

  budget_fit_band TEXT NOT NULL DEFAULT 'OUT' CHECK (budget_fit_band IN ('IN','EDGE','OUT')),

  overall_fit_score INT NOT NULL DEFAULT 0 CHECK (overall_fit_score >= 0 AND overall_fit_score <= 100),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (request_id, provider_org_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_provider_status ON request_matches(provider_org_id, match_status);
CREATE INDEX IF NOT EXISTS idx_matches_request ON request_matches(request_id);

COMMIT;
