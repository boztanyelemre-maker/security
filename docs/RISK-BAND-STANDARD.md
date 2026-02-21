# Risk Band Standardı — Tek dil (Offer / Provider / Buyer)

**Prensip:** Risk band fiyat değil, **davranış ve güven sinyali**. Offer, Provider ve Buyer için aynı mantıkla çalışır; Admin dashboard, Alıcı etiketi ve Sağlayıcı görünümü tutarlı olur.

---

## 1) Risk band değerleri

| Band       | Anlam (UI)     |
|-----------|-----------------|
| **NORMAL**  | Risk sinyali yok |
| **WATCH**   | İzleme altında   |
| **CRITICAL**| Kritik; admin incelemesi |

**Hesaplama kaynakları (2):**

1. **Risk flag’ler** (`risk_flags` — entity_type + entity_id + severity + status)
2. **Ödeme davranışı onayı** (`payment_report_reviews.decision = 'APPROVED'` — sadece onaylanan raporlar band hesabına girer)

---

## 2) OFFER risk_band (teklif bazında)

### Kaynak flag’ler (MVP + ileride)

- **TOO_LOW_OFFER** (HIGH / CRITICAL) — MVP
- COMPLIANCE_CONFLICT (HIGH/CRITICAL) — ileride
- SUSPICIOUS_PATTERN (MEDIUM/HIGH) — ileride

### Kural

| Koşul | risk_band |
|-------|-----------|
| Offer üzerinde **CRITICAL** severity OPEN flag var | **CRITICAL** |
| Offer üzerinde **HIGH** severity OPEN flag var | **WATCH** |
| Yok | **NORMAL** |

*Not: MEDIUM’u MVP’de alıcıya yansıtmak istemezsen sadece admin görür.*

### Pseudo

```
function offerRiskBand(offer_id):
  flags = getOpenFlags(entity_type='OFFER', entity_id=offer_id)
  if any(flags.severity == 'CRITICAL'): return 'CRITICAL'
  if any(flags.severity == 'HIGH'): return 'WATCH'
  return 'NORMAL'
```

---

## 3) PROVIDER risk_band (sağlayıcı bazında)

### Girdi sinyalleri

- **A)** Provider entity flag’leri: REPEATED_TOO_LOW_OFFERS (HIGH/CRITICAL), COMPLIANCE_RISK_PROVIDER (HIGH) — ileride
- **B)** Son 30 gün offer flag yoğunluğu: OPEN **TOO_LOW_OFFER** sayısı (bu provider’ın tekliflerine ait)

### MVP kural seti

| Koşul | risk_band |
|-------|-----------|
| Provider üzerinde **CRITICAL** OPEN flag var | **CRITICAL** |
| Son 30 günde TOO_LOW_OFFER (OPEN) sayısı ≥ 5 | **CRITICAL** |
| Son 30 günde TOO_LOW_OFFER (OPEN) sayısı ≥ 3 | **WATCH** |
| Provider üzerinde **HIGH** OPEN flag var (yukarıdakiler yoksa) | **WATCH** |
| Aksi | **NORMAL** |

### Pseudo

```
function providerRiskBand(provider_org_id):
  if hasOpenFlag('PROVIDER', provider_org_id, severity='CRITICAL'): return 'CRITICAL'

  tooLow = countOpenOfferFlags(provider_org_id, 'TOO_LOW_OFFER', last_30_days)
  if tooLow >= 5: return 'CRITICAL'
  if tooLow >= 3: return 'WATCH'

  if hasOpenFlag('PROVIDER', provider_org_id, severity='HIGH'): return 'WATCH'
  return 'NORMAL'
```

---

## 4) BUYER risk_band (alıcı bazında)

### Girdi sinyalleri

- **A)** Onaylanmış ödeme raporları: `payment_report_reviews.decision = 'APPROVED'` (en değerli sinyal)
- **B)** Buyer entity flag’leri: REPEATED_LATE_PAYMENTS, REPEATED_UNPAID, PAYMENT_UNPAID_90P

### MVP kural seti

**Sadece APPROVED ödeme raporları** (son 90 gün) sayılır. “Provider bildirimi” tek başına yetmez; admin onayı ile adalet sağlanır.

| Koşul | risk_band |
|-------|-----------|
| Onaylı **UNPAID** (unpaid_band = 90_PLUS) ≥ 1 | **CRITICAL** |
| Onaylı **UNPAID** toplam ≥ 2 (farklı engagement olabilir) | **CRITICAL** |
| Onaylı **PAID_LATE** ≥ 2 | **WATCH** |
| Onaylı **UNPAID** = 1 (90 altı band) | **WATCH** |
| Buyer üzerinde CRITICAL OPEN flag | **CRITICAL** |
| Buyer üzerinde HIGH OPEN flag (yukarıdakiler yoksa) | **WATCH** |
| Aksi | **NORMAL** |

### Pseudo

```
function buyerRiskBand(buyer_org_id):
  stats = getApprovedPaymentStats(buyer_org_id, last_90_days)

  if stats.unpaid_90_plus >= 1: return 'CRITICAL'
  if stats.unpaid_total >= 2: return 'CRITICAL'

  if stats.late_total >= 2: return 'WATCH'
  if stats.unpaid_total == 1: return 'WATCH'

  if hasOpenFlag('BUYER', buyer_org_id, severity='CRITICAL'): return 'CRITICAL'
  if hasOpenFlag('BUYER', buyer_org_id, severity='HIGH'): return 'WATCH'
  return 'NORMAL'
```

---

## 5) UI’da nerede görünür?

| Yer | Ne görünür |
|-----|------------|
| **Alıcı (Ekran 8 — Talep detayı)** | Teklif etiketi: **risk_band** (NORMAL / WATCH / CRITICAL). Provider adı ve fiyat yok; sadece sinyal. |
| **Sağlayıcı (Ekran 11–12)** | MVP’de provider’a kendi risk band’ı göstermeyebilirsin. İleride admin tarafında görünebilir. |
| **Admin (Ekran 14–15)** | Buyer/Provider listelerinde risk_band; Offer listesinde risk_band; Dashboard “kritik uyarılar” risk_band ile beslenir. |

---

## 6) SQL “istatistik” query’leri

### 6.1 Offer open flags (max severity)

```sql
SELECT MAX(
  CASE severity
    WHEN 'CRITICAL' THEN 4
    WHEN 'HIGH' THEN 3
    WHEN 'MEDIUM' THEN 2
    WHEN 'LOW' THEN 1
    ELSE 0
  END
) AS max_sev
FROM risk_flags
WHERE entity_type = 'OFFER' AND entity_id = $1 AND status = 'OPEN';
```

*Yorum: max_sev 4 → CRITICAL, 3 → WATCH, 0 veya NULL → NORMAL.*

### 6.2 Provider: son 30 gün TOO_LOW_OFFER (OPEN) sayısı

```sql
SELECT COUNT(*)
FROM risk_flags rf
JOIN offers o ON o.id = rf.entity_id
WHERE rf.entity_type = 'OFFER'
  AND rf.flag_type = 'TOO_LOW_OFFER'
  AND rf.status = 'OPEN'
  AND rf.created_at >= NOW() - INTERVAL '30 days'
  AND o.provider_org_id = $1;
```

### 6.3 Buyer: onaylı ödeme istatistikleri (son 90 gün)

```sql
SELECT
  SUM(CASE WHEN pr.reported_status = 'PAID_LATE' THEN 1 ELSE 0 END) AS late_total,
  SUM(CASE WHEN pr.reported_status = 'UNPAID' THEN 1 ELSE 0 END) AS unpaid_total,
  SUM(CASE WHEN pr.reported_status = 'UNPAID' AND pr.unpaid_band = '90_PLUS' THEN 1 ELSE 0 END) AS unpaid_90_plus
FROM payment_reports pr
JOIN payment_report_reviews rr ON rr.payment_report_id = pr.id
WHERE pr.buyer_org_id = $1
  AND rr.decision = 'APPROVED'
  AND rr.decided_at >= NOW() - INTERVAL '90 days';
```

---

## 7) MVP pratik: hesaplama nerede?

- **Band’ı tabloda tutmak (denormalize)** yerine MVP’de: **response üretirken hesapla** (yukarıdaki query’ler + küçük mantık).
- İleride performans gerekirse: `buyer_risk_summary` / `provider_risk_summary` tabloları veya materialized view eklenebilir.

---

## Sonraki adım (opsiyonel)

- **Admin Dashboard KPI:** [ADMIN-DASHBOARD-KPI-QUERIES.md](ADMIN-DASHBOARD-KPI-QUERIES.md) — Ekran 14: KPI’lar, kuyruklar, risk watchlist, audit feed, önerilen JSON.
- Admin list endpoint’leri için filtreli/sayfalı liste query paketleri (requests, offers, buyers, providers).

---

*Dashboard: [ADMIN-DASHBOARD-KPI-QUERIES.md](ADMIN-DASHBOARD-KPI-QUERIES.md). Offer/risk: [OFFER-BUDGET-AND-RISK-RULES.md](OFFER-BUDGET-AND-RISK-RULES.md). Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md). API: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md).*
