-- 001_auth_core — Auth & org çekirdeği
-- Tablolar: roles, users, user_roles, cities, districts, organizations, organization_users, provider_profiles
-- Bağımlılık: pgcrypto (extension)

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Lookup (organizations FK için gerekli)
CREATE TABLE IF NOT EXISTS cities (
  id   INT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
  id      BIGSERIAL PRIMARY KEY,
  city_id INT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  name    TEXT NOT NULL,
  UNIQUE (city_id, name)
);

CREATE INDEX IF NOT EXISTS idx_districts_city_id ON districts(city_id);

-- Roller
CREATE TABLE IF NOT EXISTS roles (
  id   BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

-- Kullanıcılar
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  phone         TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Kullanıcı – rol
CREATE TABLE IF NOT EXISTS user_roles (
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id   BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Firma
CREATE TABLE IF NOT EXISTS organizations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_type       TEXT NOT NULL CHECK (org_type IN ('BUYER','PROVIDER')),
  legal_name     TEXT NOT NULL,
  tax_id         TEXT NOT NULL UNIQUE,
  company_type   TEXT CHECK (company_type IN ('AS','LTD','OTHER')),
  hq_city_id     INT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  hq_district_id BIGINT REFERENCES districts(id) ON DELETE SET NULL,
  address_text   TEXT,
  status         TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','SUSPENDED','REVIEW')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orgs_type_status ON organizations(org_type, status);

-- Firma – kullanıcı
CREATE TABLE IF NOT EXISTS organization_users (
  organization_id    UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_primary_contact BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_users_user_id ON organization_users(user_id);

-- Sağlayıcı profili (sadece PROVIDER organizasyonlar için)
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

COMMIT;
