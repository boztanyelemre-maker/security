-- M07 — Teklif (offers)
-- Bağımlılık: M03 (organizations), M05 (requests)

BEGIN;

CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  provider_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  status TEXT NOT NULL DEFAULT 'SUBMITTED'
    CHECK (status IN ('SUBMITTED','WITHDRAWN','HIDDEN_BY_ADMIN','ACCEPTED','REJECTED')),

  monthly_offer_try NUMERIC(14,2) NOT NULL CHECK (monthly_offer_try >= 0),

  provider_confirms_start BOOLEAN NOT NULL DEFAULT FALSE,

  provider_salary_sgk_tax_on_time_declared BOOLEAN NOT NULL DEFAULT FALSE,

  note TEXT,

  budget_fit_band TEXT NOT NULL DEFAULT 'OUT' CHECK (budget_fit_band IN ('IN','EDGE','OUT')),
  compliance_fit_band TEXT NOT NULL DEFAULT 'PENDING' CHECK (compliance_fit_band IN ('OK','PENDING','FAIL')),
  risk_band TEXT NOT NULL DEFAULT 'NORMAL' CHECK (risk_band IN ('NORMAL','WATCH','CRITICAL')),

  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (request_id, provider_org_id)
);

CREATE INDEX IF NOT EXISTS idx_offers_provider_status ON offers(provider_org_id, status);
CREATE INDEX IF NOT EXISTS idx_offers_request_status ON offers(request_id, status);
CREATE INDEX IF NOT EXISTS idx_offers_budget_fit ON offers(budget_fit_band);

COMMIT;
