-- M04 — Sağlayıcı profili (provider_profiles, provider_service_areas)
-- Bağımlılık: M01 (cities), M03 (organizations)

BEGIN;

CREATE TABLE IF NOT EXISTS provider_profiles (
  organization_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,

  total_personnel INT NOT NULL DEFAULT 0 CHECK (total_personnel >= 0),
  armed_personnel_ratio NUMERIC(5,2) CHECK (armed_personnel_ratio IS NULL OR (armed_personnel_ratio >= 0 AND armed_personnel_ratio <= 100)),
  has_backup_staff_plan BOOLEAN NOT NULL DEFAULT FALSE,

  has_activity_license BOOLEAN NOT NULL DEFAULT FALSE,
  has_armed_authorization BOOLEAN NOT NULL DEFAULT FALSE,
  complies_5188 BOOLEAN NOT NULL DEFAULT FALSE,

  pays_salary_sgk_tax_on_time BOOLEAN NOT NULL DEFAULT FALSE,

  supervision_model TEXT,
  audit_frequency TEXT,
  reporting_frequency TEXT,

  digital_capabilities TEXT[],

  sectors_served TEXT[],
  has_large_enterprise_experience BOOLEAN NOT NULL DEFAULT FALSE,
  has_ongoing_contracts BOOLEAN NOT NULL DEFAULT FALSE,

  profile_completion_pct INT NOT NULL DEFAULT 0 CHECK (profile_completion_pct >= 0 AND profile_completion_pct <= 100),

  min_monthly_price_try NUMERIC(14,2) CHECK (min_monthly_price_try IS NULL OR min_monthly_price_try >= 0),

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_service_areas (
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  city_id INT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  PRIMARY KEY (organization_id, city_id)
);

CREATE INDEX IF NOT EXISTS idx_provider_service_areas_city ON provider_service_areas(city_id);

COMMIT;
