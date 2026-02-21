-- M03 — Firma modeli (organizations, organization_users)
-- Bağımlılık: M01 (cities, districts), M02 (users)

BEGIN;

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

CREATE TABLE IF NOT EXISTS organization_users (
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_primary_contact BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_users_user_id ON organization_users(user_id);

COMMIT;
