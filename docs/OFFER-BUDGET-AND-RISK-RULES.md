# Offer Submit: Bütçe Bandı + Aşırı Düşük Teklif Risk Kuralları

Teklif gönderilirken **offers.budget_fit_band** nasıl hesaplanır ve **risk_flags** (TOO_LOW_OFFER) nasıl üretilir — kesin kurallar ve uygulama akışı.

---

## 1) Offer Submit → offers.budget_fit_band

### 1.1 Girdi

- `offer.monthly_offer_try` (teklif tutarı)
- `request.budget_min_try`, `request.budget_max_try`

### 1.2 Band kuralları (alıcıya etiket; rakam gitmez)

| Band  | Anlam                          |
|-------|---------------------------------|
| **IN**  | Teklif bütçe aralığının içinde   |
| **EDGE**| Bütçeye çok yakın (±%5 tolerans)|
| **OUT** | Belirgin dışarıda               |

**MVP formülü (tol = 0.05):**

```
min = request.budget_min_try
max = request.budget_max_try
x   = offer.monthly_offer_try
tol = 0.05

if x >= min and x <= max:
    band = 'IN'
else if x >= min * (1 - tol) and x < min:
    band = 'EDGE'   # biraz düşük
else if x > max and x <= max * (1 + tol):
    band = 'EDGE'   # biraz yüksek
else:
    band = 'OUT'
```

### 1.3 Backend kapı (ihaleleşmeyi kesen)

**MVP kuralı:**

- **band = OUT** ise → **403 BUDGET_OUT** — teklif kaydedilmez.

Böylece bütçeden kopuk teklif gelmez; alıcı tarafında “kötü teklif çöplüğü” oluşmaz.

*Alternatif (MVP dışı): OUT’ları kaydedip admin review’a göndermek.*

### 1.4 SQL ile band (Postgres)

Request satırı zaten çekilmiş varsayımıyla (`r`):

```sql
CASE
  WHEN :x BETWEEN r.budget_min_try AND r.budget_max_try THEN 'IN'
  WHEN :x >= r.budget_min_try * 0.95 AND :x < r.budget_min_try THEN 'EDGE'
  WHEN :x > r.budget_max_try AND :x <= r.budget_max_try * 1.05 THEN 'EDGE'
  ELSE 'OUT'
END
```

`:x` = `monthly_offer_try`.

---

## 2) Aşırı düşük teklif (TOO_LOW_OFFER) — MVP risk kuralı

**Amaç:** “Fiyat tek başına kazanmaz” vizyonu; aşırı düşük / dumping davranışını bütçeye göre yakalamak (sadece sistem içi; bütçe gizliliği korunur).

### 2.1 Teklif seviyesi (bütçeye göre anormal düşük)

| Koşul | Severity   |
|-------|------------|
| `monthly_offer_try < request.budget_min_try * 0.70` | **CRITICAL** |
| `monthly_offer_try < request.budget_min_try * 0.80` | **HIGH**    |
| Aksi | Flag yok   |

### 2.2 Sağlayıcı bazlı tekrar (son 30 gün)

Aynı sağlayıcı için TOO_LOW_OFFER (OPEN) sayısı:

| Sayı | Aksiyon |
|-----|--------|
| ≥ 5 | Provider için REPEATED_TOO_LOW_OFFERS **CRITICAL** + admin review kuyruğu; offer.risk_band = CRITICAL |
| ≥ 3 | Provider için REPEATED_TOO_LOW_OFFERS **HIGH**; offer.risk_band = WATCH |
| < 3 | Sadece teklif seviyesi flag; offer.risk_band = WATCH (tek teklif flag’i varsa) veya NORMAL |

### 2.3 Ne zaman tetiklenir?

**Teklif submit sonrası** (offer insert/update tamamlandıktan sonra):

1. Offer kaydet (band ≠ OUT).
2. Too-low kontrolü yap.
3. Gerekirse `risk_flags` upsert.
4. `offers.risk_band` güncelle (NORMAL / WATCH / CRITICAL).
5. Gerekirse `admin_reviews` oluştur (RISK_CASE, PROVIDER).

---

## 3) Offer Submit işlem akışı (pseudo-code)

```
function submitOffer(provider_org_id, request_id, payload):
    assert provider profile completion == 100
    assert payload.provider_salary_sgk_tax_on_time_declared == true

    request = db.getRequest(request_id)
    assert request.status == 'PUBLISHED'

    band = calcBudgetBand(request, payload.monthly_offer_try)
    if band == 'OUT':
        return 403 BUDGET_OUT

    offer_id = db.upsertOffer(request_id, provider_org_id, payload, band)

    tooLowSeverity = null
    if payload.monthly_offer_try < request.budget_min_try * 0.70:
        tooLowSeverity = 'CRITICAL'
    else if payload.monthly_offer_try < request.budget_min_try * 0.80:
        tooLowSeverity = 'HIGH'

    if tooLowSeverity not null:
        db.createRiskFlag(entity_type='OFFER', entity_id=offer_id,
                          flag_type='TOO_LOW_OFFER', severity=tooLowSeverity,
                          reason='Offer below budget_min threshold')

        cnt = db.countTooLowOffers(provider_org_id, last_30_days)
        if cnt >= 5:
            db.createRiskFlag(entity_type='PROVIDER', entity_id=provider_org_id,
                              flag_type='REPEATED_TOO_LOW_OFFERS', severity='CRITICAL')
            db.createAdminReview(queue_type='RISK_CASE', entity_type='PROVIDER',
                                 entity_id=provider_org_id, priority=1)
            db.updateOfferRiskBand(offer_id, 'CRITICAL')
        else if cnt >= 3:
            db.createRiskFlag(entity_type='PROVIDER', entity_id=provider_org_id,
                              flag_type='REPEATED_TOO_LOW_OFFERS', severity='HIGH')
            db.updateOfferRiskBand(offer_id, 'WATCH')
        else:
            db.updateOfferRiskBand(offer_id, 'WATCH')
    else:
        db.updateOfferRiskBand(offer_id, 'NORMAL')

    return 201 offer_id
```

---

## 4) Gerekli SQL query’ler

### 4.1 Bütçe bandı (tek satır; request zaten var)

Yukarıdaki CASE ifadesi; `r` = request row, `:x` = monthly_offer_try.

### 4.2 Too-low severity (tek offer)

```sql
SELECT
  CASE
    WHEN $1 < r.budget_min_try * 0.70 THEN 'CRITICAL'
    WHEN $1 < r.budget_min_try * 0.80 THEN 'HIGH'
    ELSE NULL
  END AS severity
FROM requests r
WHERE r.id = $2;
-- $1 = monthly_offer_try, $2 = request_id
```

### 4.3 Son 30 gün too-low sayısı (provider)

```sql
SELECT COUNT(*)
FROM risk_flags rf
WHERE rf.entity_type = 'OFFER'
  AND rf.flag_type = 'TOO_LOW_OFFER'
  AND rf.status = 'OPEN'
  AND rf.created_at >= NOW() - INTERVAL '30 days'
  AND rf.entity_id IN (
    SELECT o.id FROM offers o
    WHERE o.provider_org_id = $1
  );
```

*Performans v2: risk_flags’a provider_org_id denormalize veya materialized view.*

### 4.4 Risk flag insert

```sql
INSERT INTO risk_flags (
  entity_type, entity_id, flag_type, severity, status, reason, created_by
)
VALUES ($1, $2, $3, $4, 'OPEN', $5, 'SYSTEM');
-- $1 entity_type, $2 entity_id (UUID offer veya provider org), $3 flag_type,
-- $4 severity, $5 reason
```

**İdempotent davranış (MVP):** Aynı offer için aynı flag’i tekrar üretmemek için uygulama tarafında “bu offer_id için OPEN TOO_LOW_OFFER var mı?” kontrolü yapılabilir. İstersen DB’de **partial unique index** eklenebilir (aşağıda opsiyonel migration).

---

## 5) Opsiyonel: risk_flags idempotent unique

MVP’de aynı (entity_type, entity_id, flag_type) için aynı anda yalnızca bir OPEN kayıt olsun istersen:

**Postgres (partial unique index):**

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_risk_flags_entity_type_id_flag_open
ON risk_flags (entity_type, entity_id, flag_type)
WHERE status = 'OPEN';
```

Bu sayede aynı teklif için ikinci TOO_LOW_OFFER INSERT çakışır; uygulama ON CONFLICT DO NOTHING veya “var mı?” kontrolü ile idempotent yapılabilir.

*M09’da bu index yok; eklemek istersen ayrı migration (örn. M09a_risk_flags_idempotent.sql) kullanılabilir.*

---

## 6) Vizyon uyumu (kısa)

Bu “aşırı düşük teklif” kuralı:

- Fiyatı tek kriter yapmıyor.
- Şeffaflık ve sürdürülebilirlik sinyali veriyor.
- İhaleleşmeye dönmüyor (bütçe alıcıda kalıyor; band sadece etiket).

---

## Sonraki adım (opsiyonel)

- **risk_band standart:** [RISK-BAND-STANDARD.md](RISK-BAND-STANDARD.md) — Offer / Provider / Buyer tek dil, UI tutarlılığı, SQL istatistik query’leri.
- Admin Dashboard KPI query seti (kritik/izleme sayıları, kuyruklar) — Ekran 14 backend.

---

*Risk band: [RISK-BAND-STANDARD.md](RISK-BAND-STANDARD.md). API: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md). Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md). Matching: [MATCHING-JOB-IMPLEMENTATION.md](MATCHING-JOB-IMPLEMENTATION.md).*
