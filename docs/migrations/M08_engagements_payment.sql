-- M08 — İş + Ödeme davranışı (engagements, payment_reports, payment_report_reviews)
-- Bağımlılık: M02 (users), M03 (organizations), M05 (requests), M07 (offers)

BEGIN;

CREATE TABLE IF NOT EXISTS engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE RESTRICT,
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE RESTRICT,

  buyer_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  provider_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,

  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','COMPLETED','CANCELLED')),

  payment_terms_days INT CHECK (payment_terms_days IS NULL OR payment_terms_days IN (30,45,60,90)),

  started_at DATE,
  ended_at DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (offer_id)
);

CREATE INDEX IF NOT EXISTS idx_engagements_buyer ON engagements(buyer_org_id, status);
CREATE INDEX IF NOT EXISTS idx_engagements_provider ON engagements(provider_org_id, status);

CREATE TABLE IF NOT EXISTS payment_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  engagement_id UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  buyer_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  provider_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,

  reported_status TEXT NOT NULL CHECK (reported_status IN ('PAID_ON_TIME','PAID_LATE','UNPAID')),

  delay_band TEXT CHECK (delay_band IS NULL OR delay_band IN ('1_7','8_30','31_60','60_PLUS')),
  unpaid_band TEXT CHECK (unpaid_band IS NULL OR unpaid_band IN ('0_30','31_60','61_90','90_PLUS')),

  comment TEXT,
  attestation_checked BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_payment_bands
    CHECK (
      (reported_status = 'PAID_ON_TIME' AND delay_band IS NULL AND unpaid_band IS NULL)
      OR
      (reported_status = 'PAID_LATE' AND delay_band IS NOT NULL AND unpaid_band IS NULL)
      OR
      (reported_status = 'UNPAID' AND unpaid_band IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_payment_reports_buyer ON payment_reports(buyer_org_id, reported_status, created_at);
CREATE INDEX IF NOT EXISTS idx_payment_reports_provider ON payment_reports(provider_org_id, created_at);

CREATE TABLE IF NOT EXISTS payment_report_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  payment_report_id UUID NOT NULL UNIQUE REFERENCES payment_reports(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  decision TEXT NOT NULL CHECK (decision IN ('APPROVED','REJECTED','PENDING_MORE_SIGNAL')),
  decision_note TEXT NOT NULL,

  decided_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_review_admin ON payment_report_reviews(admin_user_id, decided_at);

COMMIT;
