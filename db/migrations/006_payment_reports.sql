-- 006_payment_reports — Ödeme davranışı V1 (request bazlı)
-- Not: Geliştirme ortamı için idempotent olması adına tabloyu yeniden oluşturuyor.

BEGIN;

DROP TABLE IF EXISTS payment_reports CASCADE;

CREATE TABLE payment_reports (
  payment_report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  buyer_org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  provider_org_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  request_id        UUID NOT NULL REFERENCES requests(request_id) ON DELETE CASCADE,

  status            TEXT NOT NULL CHECK (status IN ('ON_TIME', 'LATE', 'UNPAID')),
  note              TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_reports_buyer ON payment_reports(buyer_org_id);
CREATE INDEX idx_payment_reports_provider ON payment_reports(provider_org_id);
CREATE INDEX idx_payment_reports_request ON payment_reports(request_id);
CREATE INDEX idx_payment_reports_status ON payment_reports(status);

COMMIT;

