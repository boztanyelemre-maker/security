-- M09 — Risk, inceleme, audit (risk_flags, admin_reviews, admin_notes, audit_logs) — SQLite
-- metadata_json: TEXT (JSON string). Bağımlılık: M02 (users)

BEGIN;

CREATE TABLE IF NOT EXISTS risk_flags (
  id TEXT PRIMARY KEY,

  entity_type TEXT NOT NULL CHECK (entity_type IN ('REQUEST','OFFER','BUYER','PROVIDER','PAYMENT_REPORT')),
  entity_id TEXT NOT NULL,

  flag_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','RESOLVED','DISMISSED')),

  reason TEXT,
  created_by TEXT NOT NULL DEFAULT 'SYSTEM' CHECK (created_by IN ('SYSTEM','ADMIN')),

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_risk_entity ON risk_flags(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_risk_severity_status ON risk_flags(severity, status);

CREATE TABLE IF NOT EXISTS admin_reviews (
  id TEXT PRIMARY KEY,

  queue_type TEXT NOT NULL CHECK (queue_type IN ('REQUEST_PUBLISH','PROVIDER_REVIEW','PAYMENT_BEHAVIOR','RISK_CASE')),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','IN_PROGRESS','DONE')),
  assigned_admin_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,

  priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),

  note TEXT,

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_reviews_status_priority ON admin_reviews(status, priority);
CREATE INDEX IF NOT EXISTS idx_admin_reviews_entity ON admin_reviews(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS admin_notes (
  id TEXT PRIMARY KEY,

  entity_type TEXT NOT NULL CHECK (entity_type IN ('REQUEST','OFFER','BUYER','PROVIDER')),
  entity_id TEXT NOT NULL,

  note_text TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_notes_entity ON admin_notes(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,

  actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  actor_role TEXT,

  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,

  metadata_json TEXT,

  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_action_time ON audit_logs(action, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);

COMMIT;
