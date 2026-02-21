-- M06 — Eşleşme (request_matches) — SQLite
-- Bağımlılık: M03 (organizations), M05 (requests)

BEGIN;

CREATE TABLE IF NOT EXISTS request_matches (
  id TEXT PRIMARY KEY,

  request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  provider_org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  match_status TEXT NOT NULL DEFAULT 'VISIBLE' CHECK (match_status IN ('VISIBLE','HIDDEN','BLOCKED')),

  fit_location INTEGER NOT NULL DEFAULT 0 CHECK (fit_location IN (0,1,2)),
  fit_capacity INTEGER NOT NULL DEFAULT 0 CHECK (fit_capacity IN (0,1,2)),
  fit_certifications INTEGER NOT NULL DEFAULT 0 CHECK (fit_certifications IN (0,1,2)),
  fit_salary_sgk_tax INTEGER NOT NULL DEFAULT 0 CHECK (fit_salary_sgk_tax IN (0,1,2)),
  fit_operational INTEGER NOT NULL DEFAULT 0 CHECK (fit_operational IN (0,1,2)),

  budget_fit_band TEXT NOT NULL DEFAULT 'OUT' CHECK (budget_fit_band IN ('IN','EDGE','OUT')),

  overall_fit_score INTEGER NOT NULL DEFAULT 0 CHECK (overall_fit_score >= 0 AND overall_fit_score <= 100),

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  UNIQUE (request_id, provider_org_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_provider_status ON request_matches(provider_org_id, match_status);
CREATE INDEX IF NOT EXISTS idx_matches_request ON request_matches(request_id);

COMMIT;
