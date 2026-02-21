-- M07 — Teklif (offers) — SQLite
-- Bağımlılık: M03 (organizations), M05 (requests)

BEGIN;

CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,

  request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  provider_org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  status TEXT NOT NULL DEFAULT 'SUBMITTED'
    CHECK (status IN ('SUBMITTED','WITHDRAWN','HIDDEN_BY_ADMIN','ACCEPTED','REJECTED')),

  monthly_offer_try REAL NOT NULL CHECK (monthly_offer_try >= 0),

  provider_confirms_start INTEGER NOT NULL DEFAULT 0,

  provider_salary_sgk_tax_on_time_declared INTEGER NOT NULL DEFAULT 0,

  note TEXT,

  budget_fit_band TEXT NOT NULL DEFAULT 'OUT' CHECK (budget_fit_band IN ('IN','EDGE','OUT')),
  compliance_fit_band TEXT NOT NULL DEFAULT 'PENDING' CHECK (compliance_fit_band IN ('OK','PENDING','FAIL')),
  risk_band TEXT NOT NULL DEFAULT 'NORMAL' CHECK (risk_band IN ('NORMAL','WATCH','CRITICAL')),

  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  UNIQUE (request_id, provider_org_id)
);

CREATE INDEX IF NOT EXISTS idx_offers_provider_status ON offers(provider_org_id, status);
CREATE INDEX IF NOT EXISTS idx_offers_request_status ON offers(request_id, status);
CREATE INDEX IF NOT EXISTS idx_offers_budget_fit ON offers(budget_fit_band);

COMMIT;
