-- M04b — Provider fiyat tabanı (bütçe bandı IN/EDGE/OUT için, teklif öncesi)
-- Bağımlılık: M04 (provider_profiles mevcut)
-- Opsiyonel: Bu alan yoksa matching job budget_fit_band = 'EDGE' (unknown) kullanır.

BEGIN;

ALTER TABLE provider_profiles
ADD COLUMN IF NOT EXISTS min_monthly_price_try NUMERIC(14,2)
  CHECK (min_monthly_price_try IS NULL OR min_monthly_price_try >= 0);

COMMENT ON COLUMN provider_profiles.min_monthly_price_try IS
  '1 lokasyon / standart hizmet için minimum aylık çalışılabilecek seviye (eşleşme bandı için; tam fiyat değil)';

COMMIT;
