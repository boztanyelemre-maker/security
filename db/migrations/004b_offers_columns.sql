-- 004b — offers: total_price_try, price_breakdown_json, notes (API ile uyum)
-- M07/docs şemasında monthly_offer_try, note var; bu migration eksik sütunları ekler.

BEGIN;

ALTER TABLE offers ADD COLUMN IF NOT EXISTS total_price_try INT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS price_breakdown_json JSONB;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS notes TEXT;

-- Mevcut satırlarda monthly_offer_try varsa total_price_try'ı doldur
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'offers' AND column_name = 'monthly_offer_try') THEN
    UPDATE offers SET total_price_try = (monthly_offer_try)::INT WHERE total_price_try IS NULL AND monthly_offer_try IS NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'offers' AND column_name = 'note') THEN
    UPDATE offers SET notes = note WHERE notes IS NULL AND note IS NOT NULL;
  END IF;
END $$;

COMMIT;
