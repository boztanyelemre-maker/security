-- M05 — Talep (requests)
-- Bağımlılık: M01 (cities, districts), M03 (organizations)

BEGIN;

CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  buyer_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,

  status TEXT NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT','PUBLISHED','UNDER_REVIEW','CLOSED')),

  service_types TEXT[] NOT NULL,
  location_mode TEXT NOT NULL CHECK (location_mode IN ('SINGLE','MULTI')),

  city_id INT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  district_id BIGINT REFERENCES districts(id) ON DELETE SET NULL,

  address_text TEXT NOT NULL,
  site_type TEXT NOT NULL,

  point_count INT NOT NULL CHECK (point_count > 0),
  area_sqm INT CHECK (area_sqm IS NULL OR area_sqm > 0),

  personnel_count INT NOT NULL CHECK (personnel_count > 0),
  shift_patterns TEXT[] NOT NULL,

  weapon_requirement TEXT NOT NULL CHECK (weapon_requirement IN ('ARMED','UNARMED')),
  required_certifications TEXT[] NOT NULL,

  contract_duration_months INT NOT NULL CHECK (contract_duration_months IN (6,12,24)),
  start_date DATE NOT NULL,
  trial_period_days INT CHECK (trial_period_days IS NULL OR trial_period_days >= 0),

  requires_5188_compliance BOOLEAN NOT NULL DEFAULT TRUE,
  requires_activity_license BOOLEAN NOT NULL DEFAULT TRUE,
  requires_sgk_employment_commitment BOOLEAN NOT NULL DEFAULT TRUE,

  subcontracting_allowed BOOLEAN NOT NULL DEFAULT FALSE,
  subcontracting_ratio_pct NUMERIC(5,2)
    CHECK (subcontracting_ratio_pct IS NULL OR (subcontracting_ratio_pct >= 0 AND subcontracting_ratio_pct <= 100)),

  requires_salary_sgk_tax_on_time BOOLEAN NOT NULL DEFAULT TRUE,

  budget_min_try NUMERIC(14,2) NOT NULL CHECK (budget_min_try >= 0),
  budget_max_try NUMERIC(14,2) NOT NULL CHECK (budget_max_try >= 0),

  min_avg_experience_years NUMERIC(4,1) CHECK (min_avg_experience_years IS NULL OR min_avg_experience_years >= 0),
  training_requirements TEXT[],
  max_turnover_pct NUMERIC(5,2) CHECK (max_turnover_pct IS NULL OR (max_turnover_pct >= 0 AND max_turnover_pct <= 100)),
  expected_audit_frequency TEXT,
  expected_reporting_frequency TEXT,
  expected_digital_capabilities TEXT[],
  insurance_requirements TEXT[],
  reference_requirements TEXT[],

  notes TEXT,

  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_budget_range CHECK (budget_min_try <= budget_max_try),
  CONSTRAINT chk_subcontract_ratio
    CHECK (
      (subcontracting_allowed = FALSE AND subcontracting_ratio_pct IS NULL)
      OR
      (subcontracting_allowed = TRUE AND subcontracting_ratio_pct IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_requests_buyer_status ON requests(buyer_org_id, status);
CREATE INDEX IF NOT EXISTS idx_requests_city_status ON requests(city_id, status);

CREATE INDEX IF NOT EXISTS gin_requests_service_types ON requests USING GIN (service_types);
CREATE INDEX IF NOT EXISTS gin_requests_shift_patterns ON requests USING GIN (shift_patterns);
CREATE INDEX IF NOT EXISTS gin_requests_required_certs ON requests USING GIN (required_certifications);

COMMIT;
