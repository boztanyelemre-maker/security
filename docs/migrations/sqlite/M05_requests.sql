-- M05 — Talep (requests) — SQLite
-- Array alanlar: TEXT (JSON string). GIN index yok.
-- Bağımlılık: M01 (cities, districts), M03 (organizations)

BEGIN;

CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,

  buyer_org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,

  status TEXT NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT','PUBLISHED','UNDER_REVIEW','CLOSED')),

  service_types TEXT NOT NULL,
  location_mode TEXT NOT NULL CHECK (location_mode IN ('SINGLE','MULTI')),

  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,

  address_text TEXT NOT NULL,
  site_type TEXT NOT NULL,

  point_count INTEGER NOT NULL CHECK (point_count > 0),
  area_sqm INTEGER CHECK (area_sqm IS NULL OR area_sqm > 0),

  personnel_count INTEGER NOT NULL CHECK (personnel_count > 0),
  shift_patterns TEXT NOT NULL,

  weapon_requirement TEXT NOT NULL CHECK (weapon_requirement IN ('ARMED','UNARMED')),
  required_certifications TEXT NOT NULL,

  contract_duration_months INTEGER NOT NULL CHECK (contract_duration_months IN (6,12,24)),
  start_date TEXT NOT NULL,
  trial_period_days INTEGER CHECK (trial_period_days IS NULL OR trial_period_days >= 0),

  requires_5188_compliance INTEGER NOT NULL DEFAULT 1,
  requires_activity_license INTEGER NOT NULL DEFAULT 1,
  requires_sgk_employment_commitment INTEGER NOT NULL DEFAULT 1,

  subcontracting_allowed INTEGER NOT NULL DEFAULT 0,
  subcontracting_ratio_pct REAL
    CHECK (subcontracting_ratio_pct IS NULL OR (subcontracting_ratio_pct >= 0 AND subcontracting_ratio_pct <= 100)),

  requires_salary_sgk_tax_on_time INTEGER NOT NULL DEFAULT 1,

  budget_min_try REAL NOT NULL CHECK (budget_min_try >= 0),
  budget_max_try REAL NOT NULL CHECK (budget_max_try >= 0),

  min_avg_experience_years REAL CHECK (min_avg_experience_years IS NULL OR min_avg_experience_years >= 0),
  training_requirements TEXT,
  max_turnover_pct REAL CHECK (max_turnover_pct IS NULL OR (max_turnover_pct >= 0 AND max_turnover_pct <= 100)),
  expected_audit_frequency TEXT,
  expected_reporting_frequency TEXT,
  expected_digital_capabilities TEXT,
  insurance_requirements TEXT,
  reference_requirements TEXT,

  notes TEXT,

  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  CHECK (budget_min_try <= budget_max_try),
  CHECK (
    (subcontracting_allowed = 0 AND subcontracting_ratio_pct IS NULL)
    OR (subcontracting_allowed = 1 AND subcontracting_ratio_pct IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_requests_buyer_status ON requests(buyer_org_id, status);
CREATE INDEX IF NOT EXISTS idx_requests_city_status ON requests(city_id, status);

COMMIT;
