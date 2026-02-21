# Matching Job — request_matches üretimi (MVP kural seti)

**Amaç:** Talep yayınlandığında (veya sağlayıcı profil güncellendiğinde) hangi sağlayıcıların o talebi “uygun talepler” listesinde göreceğini belirleyen kurallar. Ekran 11–12 gerçek veriyle çalışır.

**Tablo:** `request_matches` (request_id, provider_org_id, match_status, fit_*, budget_fit_band, overall_fit_score).

**Not:** UI’da “Bütçe uyumu (IN/EDGE/OUT)” sağlayıcı ekranında görünüyor; bunu teklif vermeden hesaplamak için provider’a tek alan eklenir (aşağıda 0️⃣). Vizyonuna aykırı değil; spam’i azaltır, eşleşmeyi kaliteye taşır.

---

## 0️⃣ Mini ekleme (önerilir): Provider fiyat tabanı

**Amaç:** Provider bütçe bandını (IN/EDGE/OUT) teklif vermeden önce hesaplayabilmek.

**Seçenek A (en basit):** `provider_profiles`’a 1 kolon:

- **min_monthly_price_try** (NUMERIC) — “1 lokasyon / standart hizmet için minimum aylık çalışılabilecek seviye” (tam fiyat değil, sadece eşleşme bandı için).

**Migration:** [migrations/M04b_provider_min_price.sql](migrations/M04b_provider_min_price.sql)

```sql
ALTER TABLE provider_profiles
ADD COLUMN IF NOT EXISTS min_monthly_price_try NUMERIC(14,2)
  CHECK (min_monthly_price_try IS NULL OR min_monthly_price_try >= 0);
```

Bu alanı eklemezsen: `request_matches.budget_fit_band` default `'EDGE'` (unknown’a yakın) tutulabilir; UI’daki band netliği düşer. Aşağıdaki kurallar alan **varmış** gibi yazıldı.

---

## 1️⃣ Matching job ne zaman çalışır?

| Tetikleyici | Aksiyon |
|-------------|--------|
| **requests.status = PUBLISHED** olduğunda | O request için match üret (tüm uygun provider’lar). |
| **provider_profiles** güncellenince (service area / lisans / SGK beyanı) | O provider’ın match’lerini güncelle (ilgili PUBLISHED request’ler). |

---

## 2️⃣ Match üretim adımları (yüksek seviye)

- **Input:** requests (PUBLISHED), organizations (PROVIDER), provider_profiles, provider_service_areas.
- **Output:** request_matches (UPSERT).

---

## 3️⃣ Fit kuralları (0 = uyumsuz, 1 = kısmi, 2 = uyumlu)

### 3.1 fit_location

- Request’in **city_id**’si, provider’ın **provider_service_areas** içinde varsa → **2**.
- Yoksa → **0**.
- (İleride “komşu şehir” gibi **1** eklenebilir.)

### 3.2 fit_salary_sgk_tax (kritik)

- `request.requires_salary_sgk_tax_on_time = true` **ve** `provider.pays_salary_sgk_tax_on_time = true` → **2**.
- Talep true, provider false → **0**.
- Talep false → **2** (engel yok).

### 3.3 fit_certifications

- **ARMED:** `request.weapon_requirement = 'ARMED'` ise `provider.has_armed_authorization = true` olmalı; değilse → 0.
- **Lisans:** `request.requires_activity_license = true` ise `provider.has_activity_license = true` olmalı.
- **5188:** `request.requires_5188_compliance = true` ise `provider.complies_5188 = true` olmalı.
- **Skor:** Hepsi sağlandı → 2; bazısı sağlandı → 1; kritik biri eksik → 0.

### 3.4 fit_capacity

- `provider.total_personnel >= request.personnel_count` → **2**.
- `provider.total_personnel >= request.personnel_count * 0.7` → **1**.
- Aksi → **0**.

### 3.5 fit_operational

- `request.expected_digital_capabilities` varsa: `provider.digital_capabilities` bunları kapsıyorsa → +puan.
- `request.expected_reporting_frequency` varsa: `provider.reporting_frequency` eşleşiyorsa → +puan.
- **Skor:** Beklenti yoksa → 2; beklenti var ve karşılıyor → 2; kısmen → 1; hiç karşılamıyor → 0.

### 3.6 budget_fit_band (IN / EDGE / OUT)

**Kural (min_monthly_price_try varsa):**

- `provider_min = provider_profiles.min_monthly_price_try`
- `request_max = requests.budget_max_try`
- **IN:** `request_max >= provider_min * 1.05`
- **EDGE:** `request_max >= provider_min * 0.95` (ve IN değilse)
- **OUT:** aksi

Rakam göstermiyoruz; “bu iş o firmaya mantıklı gelir mi?” sinyali.

**min_monthly_price_try yoksa:** `budget_fit_band = 'EDGE'`. Offer aşamasında gerçek band teklif üzerinden tekrar hesaplanır.

---

## 4️⃣ overall_fit_score (0–100, admin/algoritma; provider’a gösterme)

MVP ağırlıkları (fiyatı domine etmiyor):

| Fit | Ağırlık |
|-----|---------|
| Location | 25 |
| Compliance/Cert | 25 |
| SGK/Ücret | 25 |
| Capacity | 15 |
| Operational | 10 |

Her fit 0/1/2 → 0 / 50 / 100’e map edip ağırlıkla topla.

---

## 5️⃣ match_status (VISIBLE / HIDDEN / BLOCKED)

| Durum | Koşul | UI |
|-------|--------|-----|
| **BLOCKED** | fit_salary_sgk_tax = 0 **veya** fit_certifications = 0 **veya** fit_location = 0 | Asla gösterilmez |
| **HIDDEN** | budget_fit_band = OUT (ve BLOCKED değilse) | Default göstermeyebilirsin |
| **VISIBLE** | Diğerleri | Ekran 11’de listelenir |

**Kalite kilidi:** BLOCKED koşuluna girenleri DB’ye yaz ama `match_status = 'BLOCKED'` yap. Böylece “neden görünmediği” admin analiz edebilir; provider’a gösterilmez.

---

## 6️⃣ Uygulama mantığı (pseudo)

**Job: on request publish**

1. Request’i al (id, status = PUBLISHED).
2. O şehirde hizmet veren provider’ları bul (provider_service_areas + request.city_id).
3. Her provider için fit hesapla (3.1–3.6), overall_fit_score, match_status.
4. request_matches UPSERT.

**Job: on provider profile update**

1. Provider’ın (organization_id) ilgili request_matches satırlarını bul.
2. İlgili request’ler için fit’leri yeniden hesapla.
3. UPSERT.

---

## 7️⃣ SQL ile tek request için match (skeleton)

Tam hesaplamayı SQL’de yapmak mümkün; MVP’de okunabilirlik için backend code tercih edilebilir. Skeleton mantık:

```sql
WITH req AS (
  SELECT * FROM requests WHERE id = :request_id AND status = 'PUBLISHED'
),
prov AS (
  SELECT
    o.id AS provider_org_id,
    pp.total_personnel,
    pp.has_activity_license,
    pp.has_armed_authorization,
    pp.complies_5188,
    pp.pays_salary_sgk_tax_on_time,
    pp.reporting_frequency,
    pp.digital_capabilities,
    pp.min_monthly_price_try
  FROM organizations o
  JOIN provider_profiles pp ON pp.organization_id = o.id
  JOIN provider_service_areas psa ON psa.organization_id = o.id
  JOIN req ON req.city_id = psa.city_id
  WHERE o.org_type = 'PROVIDER' AND o.status = 'ACTIVE'
)
INSERT INTO request_matches (
  request_id, provider_org_id,
  match_status,
  fit_location, fit_capacity, fit_certifications, fit_salary_sgk_tax, fit_operational,
  budget_fit_band, overall_fit_score,
  created_at, updated_at
)
SELECT
  (SELECT id FROM req),
  p.provider_org_id,
  'VISIBLE',
  2,
  CASE
    WHEN p.total_personnel >= (SELECT personnel_count FROM req) THEN 2
    WHEN p.total_personnel >= (SELECT personnel_count FROM req) * 0.7 THEN 1
    ELSE 0
  END,
  CASE
    WHEN (SELECT requires_activity_license FROM req) = true AND NOT p.has_activity_license THEN 0
    WHEN (SELECT requires_5188_compliance FROM req) = true AND NOT p.complies_5188 THEN 0
    WHEN (SELECT weapon_requirement FROM req) = 'ARMED' AND NOT p.has_armed_authorization THEN 0
    ELSE 2
  END,
  CASE
    WHEN (SELECT requires_salary_sgk_tax_on_time FROM req) = true AND NOT p.pays_salary_sgk_tax_on_time THEN 0
    ELSE 2
  END,
  2,
  CASE
    WHEN p.min_monthly_price_try IS NULL THEN 'EDGE'
    WHEN (SELECT budget_max_try FROM req) >= p.min_monthly_price_try * 1.05 THEN 'IN'
    WHEN (SELECT budget_max_try FROM req) >= p.min_monthly_price_try * 0.95 THEN 'EDGE'
    ELSE 'OUT'
  END,
  0,
  NOW(), NOW()
FROM prov p
ON CONFLICT (request_id, provider_org_id)
DO UPDATE SET
  match_status = EXCLUDED.match_status,
  fit_location = EXCLUDED.fit_location,
  fit_capacity = EXCLUDED.fit_capacity,
  fit_certifications = EXCLUDED.fit_certifications,
  fit_salary_sgk_tax = EXCLUDED.fit_salary_sgk_tax,
  fit_operational = EXCLUDED.fit_operational,
  budget_fit_band = EXCLUDED.budget_fit_band,
  updated_at = NOW();
```

(Match_status’u BLOCKED/HIDDEN yapacak koşullar backend’de net yönetilebilir; yukarıdaki örnek sadece VISIBLE ve fit/budget hesaplarını gösterir.)

---

## 8️⃣ Çıktı: Ekranlara yansıması

| Ekran | Veri | Not |
|-------|------|-----|
| **11 – Uygun Talepler** | `request_matches WHERE provider_org_id = me AND match_status = 'VISIBLE'` | fit ikonları = fit_*; bütçe sinyali = budget_fit_band |
| **12 – Talep Detayı / Teklif** | Aynı match satırı | Teklif verince offer band yeniden hesaplanır (teklif üzerinden) |

---

## 9️⃣ Kalite kilidi

Match üretirken BLOCKED koşuluna girenleri DB’ye yaz; `match_status = 'BLOCKED'` yap. Böylece:

- Neden görünmediği admin tarafından analiz edilebilir.
- Provider’a gösterilmez.

---

## 🔟 Backend uygulama rehberi (pseudo + query listesi)

Dil bağımsız; hızlı kodlamak için hangi verilerin alınıp nasıl hesaplanacağı.

### Tetikleyici 1: Request PUBLISHED

```
INPUT: request_id
1. request = GET request BY id WHERE status = 'PUBLISHED'
2. IF request IS NULL THEN return
3. candidate_providers = providers that have provider_service_areas.city_id = request.city_id
   (JOIN organizations o, provider_profiles pp, provider_service_areas psa
    WHERE o.org_type='PROVIDER' AND o.status='ACTIVE' AND psa.city_id = request.city_id)
4. FOR EACH provider IN candidate_providers:
   a. fit_location = 2  (zaten city eşleşti)
   b. fit_salary_sgk_tax = (request.requires_salary_sgk_tax_on_time AND NOT pp.pays_salary_sgk_tax_on_time) ? 0 : 2
   c. fit_certifications = cert_score(request, pp)  // ARMED, activity_license, 5188 → 0/1/2
   d. fit_capacity = capacity_score(pp.total_personnel, request.personnel_count)  // 0/1/2
   e. fit_operational = operational_score(request, pp)  // 0/1/2
   f. budget_fit_band = band(pp.min_monthly_price_try, request.budget_max_try)  // IN/EDGE/OUT
   g. overall_fit_score = weighted_sum(fit_* with weights 25,25,25,15,10, map 0→0 1→50 2→100)
   h. match_status = BLOCKED if (fit_salary_sgk_tax=0 OR fit_certifications=0 OR fit_location=0)
                 else HIDDEN if budget_fit_band='OUT'
                 else VISIBLE
   i. UPSERT request_matches (request_id, provider_org_id, ...)
5. (Opsiyonel) BLOCKED olanları da yaz; admin analizi için.
```

**Kullanılacak query’ler (özet):**

| Amaç | Query / kaynak |
|------|-----------------|
| Request (tek) | `SELECT * FROM requests WHERE id = :id AND status = 'PUBLISHED'` |
| Aday provider’lar (şehir eşleşen) | `SELECT o.id, pp.* FROM organizations o JOIN provider_profiles pp ON pp.organization_id = o.id JOIN provider_service_areas psa ON psa.organization_id = o.id WHERE o.org_type='PROVIDER' AND o.status='ACTIVE' AND psa.city_id = :city_id` |
| Match kaydet/güncelle | `INSERT INTO request_matches (...) VALUES (...) ON CONFLICT (request_id, provider_org_id) DO UPDATE SET ...` |

### Tetikleyici 2: Provider profile güncellendi

```
INPUT: organization_id (provider)
1. active_matches = SELECT request_id FROM request_matches WHERE provider_org_id = :organization_id
2. FOR EACH request_id IN active_matches:
   RUN "tek request için match üret" (yukarıdaki mantık, sadece o request için aday listesinde bu provider zaten var; tüm fit’leri yeniden hesapla → UPSERT)
```

**Kullanılacak query’ler:**

| Amaç | Query |
|------|--------|
| Provider’ın match’leri | `SELECT request_id FROM request_matches WHERE provider_org_id = :org_id` |
| Her request için | Aynı request + “adaylar” yerine sadece bu provider için fit yeniden hesapla, UPSERT |

### Yardımcı fonksiyonlar (pseudo)

- **cert_score(req, pp):** (req.weapon_requirement='ARMED' AND NOT pp.has_armed_authorization)→0; (req.requires_activity_license AND NOT pp.has_activity_license)→0; (req.requires_5188_compliance AND NOT pp.complies_5188)→0; aksi 2 (veya kısmi 1).
- **capacity_score(total, need):** total≥need→2; total≥0.7*need→1; else 0.
- **band(provider_min, request_max):** provider_min NULL→'EDGE'; request_max≥provider_min*1.05→'IN'; request_max≥provider_min*0.95→'EDGE'; else 'OUT'.

---

## Sonraki adım

- Migration **M04b**’yi çalıştır (veya M04 zaten min_monthly_price_try içeriyor; mevcut DB için M04b ALTER).
- API’de request PUBLISHED olduğunda bu job’ı tetikle (örn. servis çağrısı veya kuyruk).

---

*Uygulama: [MATCHING-JOB-IMPLEMENTATION.md](MATCHING-JOB-IMPLEMENTATION.md). Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md). Tablo–ekran: [TABLO-EKRAN-ESLEME-MATRISI.md](TABLO-EKRAN-ESLEME-MATRISI.md). Migration M04b: [migrations/M04b_provider_min_price.sql](migrations/M04b_provider_min_price.sql).*
