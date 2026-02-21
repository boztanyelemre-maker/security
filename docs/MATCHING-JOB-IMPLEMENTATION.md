# Matching Job — Uygulama Spec (dil bağımsız)

Hangi teknolojiyle yazılırsa yazılsın **birebir** uygulanacak: pseudo-code, SQL query’ler, endpoint/job bağlantısı. Kuralların özeti: [MATCHING-JOB-KURALLAR.md](MATCHING-JOB-KURALLAR.md).

---

## 1) Fit hesaplama fonksiyonları

### 1.1 fitLocation

```
function fitLocation(request, providerServiceCities):
    return (request.city_id in providerServiceCities) ? 2 : 0
```

### 1.2 fitSalarySgkTax

```
function fitSalarySgkTax(request, providerProfile):
    if request.requires_salary_sgk_tax_on_time == true:
        return providerProfile.pays_salary_sgk_tax_on_time ? 2 : 0
    return 2
```

### 1.3 fitCertifications

Kritik yasal kontroller; 0 olursa match **BLOCKED**.

```
function fitCertifications(request, providerProfile):
    if request.requires_activity_license and not providerProfile.has_activity_license:
        return 0
    if request.requires_5188_compliance and not providerProfile.complies_5188:
        return 0
    if request.weapon_requirement == 'ARMED' and not providerProfile.has_armed_authorization:
        return 0
    return 2   # MVP: detaylı sertifika matrisi v2
```

### 1.4 fitCapacity

```
function fitCapacity(request, providerProfile):
    if providerProfile.total_personnel >= request.personnel_count:
        return 2
    if providerProfile.total_personnel >= request.personnel_count * 0.7:
        return 1
    return 0
```

### 1.5 fitOperational

```
function fitOperational(request, providerProfile):
    if request.expected_reporting_frequency is null and request.expected_digital_capabilities is empty:
        return 2

    score = 0
    maxScore = 0

    if request.expected_reporting_frequency not null:
        maxScore += 1
        if providerProfile.reporting_frequency == request.expected_reporting_frequency:
            score += 1

    if request.expected_digital_capabilities not empty:
        maxScore += 1
        if providerProfile.digital_capabilities covers request.expected_digital_capabilities:
            score += 1

    if maxScore == 0: return 2
    if score == maxScore: return 2
    if score > 0: return 1
    return 0
```

*Not: “covers” = provider’ın listesi talepteki tüm değerleri içeriyor (array/JSON karşılaştırma).*

### 1.6 budgetBand

```
function budgetBand(request, providerProfile):
    if providerProfile.min_monthly_price_try is null:
        return 'EDGE'

    providerMin = providerProfile.min_monthly_price_try
    requestMax = request.budget_max_try

    if requestMax >= providerMin * 1.05: return 'IN'
    if requestMax >= providerMin * 0.95: return 'EDGE'
    return 'OUT'
```

### 1.7 overallScore (admin için, 0–100)

```
function overallScore(f):
    # f: {loc, cert, sgk, cap, ops} each 0/1/2
    map = (x) => (x==0 ? 0 : (x==1 ? 50 : 100))
    return round(
        map(f.loc)  * 0.25 +
        map(f.cert) * 0.25 +
        map(f.sgk)  * 0.25 +
        map(f.cap)  * 0.15 +
        map(f.ops)  * 0.10
    )
```

### 1.8 decideMatchStatus

```
function decideMatchStatus(fits, budgetBand):
    if fits.loc == 0: return 'BLOCKED'
    if fits.cert == 0: return 'BLOCKED'
    if fits.sgk == 0: return 'BLOCKED'
    if budgetBand == 'OUT': return 'HIDDEN'
    return 'VISIBLE'
```

---

## 2) Job 1 — Request publish olunca match üret

```
function runMatchingForRequest(request_id):
    request = db.getRequestPublished(request_id)
    if request is null: return

    providers = db.getActiveProvidersByCity(request.city_id)
    # providers: [{ org_id, profile..., serviceCities[] }]

    for each p in providers:
        fits.loc  = fitLocation(request, p.serviceCities)
        fits.sgk  = fitSalarySgkTax(request, p.profile)
        fits.cert = fitCertifications(request, p.profile)
        fits.cap  = fitCapacity(request, p.profile)
        fits.ops  = fitOperational(request, p.profile)

        band   = budgetBand(request, p.profile)
        score  = overallScore(fits)
        status = decideMatchStatus(fits, band)

        db.upsertRequestMatch(
            request_id, p.org_id,
            status, fits.loc, fits.cap, fits.cert, fits.sgk, fits.ops,
            band, score
        )
```

---

## 3) Job 2 — Provider profil güncellenince match’leri güncelle

```
function runMatchingForProvider(provider_org_id):
    provider = db.getProviderWithProfile(provider_org_id)
    if provider is null or provider.status != 'ACTIVE': return

    requests = db.getPublishedRequestsByCities(provider.serviceCities)

    for each request in requests:
        fits.loc  = fitLocation(request, provider.serviceCities)
        fits.sgk  = fitSalarySgkTax(request, provider.profile)
        fits.cert = fitCertifications(request, provider.profile)
        fits.cap  = fitCapacity(request, provider.profile)
        fits.ops  = fitOperational(request, provider.profile)
        band   = budgetBand(request, provider.profile)
        score  = overallScore(fits)
        status = decideMatchStatus(fits, band)
        db.upsertRequestMatch(...)
```

---

## 4) SQL query’ler (minimum set)

### 4.1 getRequestPublished

```sql
SELECT *
FROM requests
WHERE id = $1 AND status = 'PUBLISHED';
```

### 4.2 getActiveProvidersByCity (tek şehir)

```sql
SELECT
  o.id AS provider_org_id,
  pp.total_personnel,
  pp.has_activity_license,
  pp.has_armed_authorization,
  pp.complies_5188,
  pp.pays_salary_sgk_tax_on_time,
  pp.reporting_frequency,
  pp.digital_capabilities,
  pp.min_monthly_price_try,
  ARRAY_AGG(psa.city_id) AS service_cities
FROM organizations o
JOIN provider_profiles pp ON pp.organization_id = o.id
JOIN provider_service_areas psa ON psa.organization_id = o.id
WHERE o.org_type = 'PROVIDER'
  AND o.status = 'ACTIVE'
  AND psa.city_id = $1
GROUP BY
  o.id, pp.total_personnel, pp.has_activity_license, pp.has_armed_authorization,
  pp.complies_5188, pp.pays_salary_sgk_tax_on_time, pp.reporting_frequency,
  pp.digital_capabilities, pp.min_monthly_price_try;
```

*Not: `requests` tarafında `personnel_count`, `weapon_requirement`, `requires_activity_license`, `requires_5188_compliance`, `requires_salary_sgk_tax_on_time`, `expected_reporting_frequency`, `expected_digital_capabilities`, `budget_max_try`, `city_id` gerekir; getRequestPublished ile alınır.*

### 4.3 getProviderWithProfile

```sql
SELECT
  o.id AS provider_org_id,
  o.status,
  pp.*,
  COALESCE(ARRAY_AGG(psa.city_id) FILTER (WHERE psa.city_id IS NOT NULL), ARRAY[]::INT[]) AS service_cities
FROM organizations o
JOIN provider_profiles pp ON pp.organization_id = o.id
LEFT JOIN provider_service_areas psa ON psa.organization_id = o.id
WHERE o.id = $1 AND o.org_type = 'PROVIDER'
GROUP BY o.id, pp.organization_id;
```

### 4.4 getPublishedRequestsByCities (provider güncelleme için)

```sql
SELECT *
FROM requests
WHERE status = 'PUBLISHED'
  AND city_id = ANY($1::INT[]);
```

### 4.5 upsertRequestMatch

```sql
INSERT INTO request_matches (
  request_id, provider_org_id,
  match_status,
  fit_location, fit_capacity, fit_certifications, fit_salary_sgk_tax, fit_operational,
  budget_fit_band, overall_fit_score,
  created_at, updated_at
)
VALUES (
  $1, $2,
  $3,
  $4, $5, $6, $7, $8,
  $9, $10,
  NOW(), NOW()
)
ON CONFLICT (request_id, provider_org_id)
DO UPDATE SET
  match_status       = EXCLUDED.match_status,
  fit_location       = EXCLUDED.fit_location,
  fit_capacity       = EXCLUDED.fit_capacity,
  fit_certifications = EXCLUDED.fit_certifications,
  fit_salary_sgk_tax = EXCLUDED.fit_salary_sgk_tax,
  fit_operational    = EXCLUDED.fit_operational,
  budget_fit_band    = EXCLUDED.budget_fit_band,
  overall_fit_score  = EXCLUDED.overall_fit_score,
  updated_at         = NOW();
```

*Parametre sırası: $1 request_id, $2 provider_org_id, $3 match_status, $4–$8 fit_location, fit_capacity, fit_certifications, fit_salary_sgk_tax, fit_operational, $9 budget_fit_band, $10 overall_fit_score.*

---

## 5) Job’ı ne zaman çalıştıracağız? (MVP)

| Seçenek | Ne zaman | Artı / eksi |
|--------|----------|--------------|
| **A — Sync (MVP)** | Request publish endpoint’inde: status → PUBLISHED, hemen ardından `runMatchingForRequest(id)` | Kurulum kolay; provider çoksa publish yanıtı yavaşlayabilir (MVP kabul edilebilir). |
| **B — Async** | Publish sonrası job queue / background worker ile matching | Daha doğru; MVP sonrası tercih edilebilir. |

MVP için **Seçenek A** yeterli.

---

## 6) Endpoint’lere bağlama

| Endpoint | Aksiyon |
|----------|--------|
| **PUT /buyer/requests/{id}/publish** | 1) `request.status` → `PUBLISHED`<br>2) `runMatchingForRequest(id)` çağır<br>3) Response 200 |
| **PUT /provider/profile** (veya PATCH) | 1) Provider profile güncelle<br>2) `runMatchingForProvider(provider_org_id)` çağır<br>3) Response 200 |

*API sözleşmesi: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md).*

---

## 7) Bütçe bandı vizyonu (kısa)

- Band **fiyat pazarlığı değil**, “uygunluk sinyali”.
- Provider’da `min_monthly_price_try` yoksa → band `'EDGE'` (unknown); UI’da “Bütçe sinyali: değerlendiriliyor” gibi ifade kullanılabilir.
- Teklif aşamasında `offers.budget_fit_band` teklif tutarına göre ayrıca hesaplanır (ileride).

---

## Sonraki adım (opsiyonel)

- **Offer bütçe bandı + risk:** `offers.budget_fit_band` hesaplama + “aşırı düşük teklif” için ilk MVP risk kuralı → `risk_flags. Detay: [OFFER-BUDGET-AND-RISK-RULES.md](OFFER-BUDGET-AND-RISK-RULES.md).

---

*Kurallar: [MATCHING-JOB-KURALLAR.md](MATCHING-JOB-KURALLAR.md). Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md). Offer/risk: [OFFER-BUDGET-AND-RISK-RULES.md](OFFER-BUDGET-AND-RISK-RULES.md).*
