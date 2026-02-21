-- M03 — Firma modeli (organizations, organization_users) — SQLite
-- Bağımlılık: M01 (cities, districts), M02 (users)

BEGIN;

CREATE TABLE IF NOT EXISTS organizations (
  id             TEXT PRIMARY KEY,
  org_type       TEXT NOT NULL CHECK (org_type IN ('BUYER','PROVIDER')),
  legal_name     TEXT NOT NULL,
  tax_id         TEXT NOT NULL UNIQUE,
  company_type   TEXT CHECK (company_type IN ('AS','LTD','OTHER')),
  hq_city_id     INTEGER NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  hq_district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
  address_text   TEXT,
  status         TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','SUSPENDED','REVIEW')),
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orgs_type_status ON organizations(org_type, status);

CREATE TABLE IF NOT EXISTS organization_users (
  organization_id    TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id            TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_primary_contact INTEGER NOT NULL DEFAULT 0,
  created_at         TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_users_user_id ON organization_users(user_id);

COMMIT;
