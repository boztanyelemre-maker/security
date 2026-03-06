-- 005_risk_flags — Aşırı düşük teklif vb. risk bayrakları (mini v1)
-- Bağımlılık: offers, requests mevcut

BEGIN;

CREATE TABLE IF NOT EXISTS risk_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  entity_type TEXT NOT NULL CHECK (entity_type IN ('REQUEST','OFFER','BUYER','PROVIDER','PAYMENT_REPORT')),
  entity_id UUID NOT NULL,

  flag_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','RESOLVED','DISMISSED')),

  reason TEXT,
  created_by TEXT NOT NULL DEFAULT 'SYSTEM' CHECK (created_by IN ('SYSTEM','ADMIN')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_risk_flags_entity ON risk_flags(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_risk_flags_severity_status ON risk_flags(severity, status);

COMMIT;
