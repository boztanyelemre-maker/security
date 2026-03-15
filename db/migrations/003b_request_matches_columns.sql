-- 003b — request_matches: match_status, overall_fit_score, budget_fit_band (kodla uyum)

BEGIN;

ALTER TABLE request_matches
  ADD COLUMN IF NOT EXISTS match_status TEXT NOT NULL DEFAULT 'VISIBLE'
    CHECK (match_status IN ('VISIBLE','HIDDEN','BLOCKED'));

ALTER TABLE request_matches
  ADD COLUMN IF NOT EXISTS overall_fit_score INT NOT NULL DEFAULT 50
    CHECK (overall_fit_score >= 0 AND overall_fit_score <= 100);

ALTER TABLE request_matches
  ADD COLUMN IF NOT EXISTS budget_fit_band TEXT
    CHECK (budget_fit_band IS NULL OR budget_fit_band IN ('IN','EDGE','OUT'));

-- Eski budget_band sütunu varsa budget_fit_band'a kopyala (yoksa atla)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'request_matches' AND column_name = 'budget_band') THEN
    UPDATE request_matches SET budget_fit_band = budget_band WHERE budget_fit_band IS NULL;
  END IF;
END $$;

ALTER TABLE request_matches ALTER COLUMN budget_fit_band SET DEFAULT 'EDGE';

COMMIT;
