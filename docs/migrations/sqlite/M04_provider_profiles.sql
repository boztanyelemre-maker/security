-- M04 — Sağlayıcı profili (provider_profiles, provider_service_areas) — SQLite
-- Array alanlar: TEXT (JSON string, örn. '["QR_PATROL","MOBILE_APP"]')
-- Bağımlılık: M01 (cities), M03 (organizations)

BEGIN;

CREATE TABLE IF NOT EXISTS provider_profiles (
  organization_id TEXT PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,

  total_personnel INTEGER NOT NULL DEFAULT 0 CHECK (total_personnel >= 0),
  armed_personnel_ratio REAL CHECK (armed_personnel_ratio IS NULL OR (armed_personnel_ratio >= 0 AND armed_personnel_ratio <= 100)),
  has_backup_staff_plan INTEGER NOT NULL DEFAULT 0,

  has_activity_license INTEGER NOT NULL DEFAULT 0,
  has_armed_authorization INTEGER NOT NULL DEFAULT 0,
  complies_5188 INTEGER NOT NULL DEFAULT 0,

  pays_salary_sgk_tax_on_time INTEGER NOT NULL DEFAULT 0,

  supervision_model TEXT,
  audit_frequency TEXT,
  reporting_frequency TEXT,

  digital_capabilities TEXT,

  sectors_served TEXT,
  has_large_enterprise_experience INTEGER NOT NULL DEFAULT 0,
  has_ongoing_contracts INTEGER NOT NULL DEFAULT 0,

  profile_completion_pct INTEGER NOT NULL DEFAULT 0 CHECK (profile_completion_pct >= 0 AND profile_completion_pct <= 100),

  min_monthly_price_try REAL CHECK (min_monthly_price_try IS NULL OR min_monthly_price_try >= 0),

  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS provider_service_areas (
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  PRIMARY KEY (organization_id, city_id)
);

CREATE INDEX IF NOT EXISTS idx_provider_service_areas_city ON provider_service_areas(city_id);

COMMIT;
