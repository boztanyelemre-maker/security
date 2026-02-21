# Admin List Endpoint’leri — Filtreli + Sayfalı Query Paketleri (MVP)

**Pagination:** `limit` (default 20, max 100) + `offset` (default 0).  
**Arama:** `q` (ILIKE). **Tarih:** `from`, `to` (created_at / published_at).  
*Büyük veride keyset pagination’a geçilebilir (v2).*

**Response formatı (tüm listeler):** Bölüm 7.  
**Güvenli SORT (ORDER BY whitelist):** Bölüm 8.  
**Örnek URL’ler + response mock’ları (frontend):** Bölüm 11.

---

## 1) Admin Requests List

**Endpoint:** `GET /admin/requests?status=&city_id=&risk=&q=&from=&to=&limit=&offset=`

### 1.1 Liste query

Parametre sırası: $1 status, $2 city_id, $3 from (timestamptz), $4 to (timestamptz), $5 q, $6 risk, $7 limit, $8 offset.

```sql
WITH base AS (
  SELECT
    r.id AS request_id,
    r.status,
    r.city_id,
    c.name AS city_name,
    r.site_type,
    r.personnel_count,
    r.created_at,
    r.published_at,
    o.legal_name AS buyer_legal_name,
    o.id AS buyer_org_id,
    (SELECT COUNT(*) FROM offers off WHERE off.request_id = r.id) AS offers_count,
    COALESCE((
      SELECT MAX(
        CASE rf.severity
          WHEN 'CRITICAL' THEN 4
          WHEN 'HIGH' THEN 3
          WHEN 'MEDIUM' THEN 2
          WHEN 'LOW' THEN 1
          ELSE 0
        END
      )
      FROM risk_flags rf
      WHERE rf.status = 'OPEN' AND rf.entity_type = 'REQUEST' AND rf.entity_id = r.id
    ), 0) AS risk_rank
  FROM requests r
  JOIN organizations o ON o.id = r.buyer_org_id
  JOIN cities c ON c.id = r.city_id
  WHERE 1 = 1
    AND ($1::TEXT IS NULL OR r.status = $1)
    AND ($2::INT IS NULL OR r.city_id = $2)
    AND ($3::TIMESTAMPTZ IS NULL OR r.created_at >= $3)
    AND ($4::TIMESTAMPTZ IS NULL OR r.created_at < $4)
    AND (
      $5::TEXT IS NULL OR
      o.legal_name ILIKE '%' || $5 || '%' OR
      r.id::TEXT ILIKE '%' || $5 || '%'
    )
)
SELECT *
FROM base
WHERE (
  $6::TEXT IS NULL OR
  ($6 = 'CRITICAL' AND risk_rank = 4) OR
  ($6 = 'HIGH' AND risk_rank = 3) OR
  ($6 = 'MEDIUM' AND risk_rank = 2) OR
  ($6 = 'LOW' AND risk_rank = 1)
)
ORDER BY created_at DESC
LIMIT $7 OFFSET $8;
```

### 1.2 Count query

*Aynı filtreler (status, city_id, from, to, q). Risk filtresi için toplamı liste ile aynı yapmak istersen, count’u base CTE üzerinden al veya risk subquery’yi count’ta da kullan.*

```sql
SELECT COUNT(*)
FROM requests r
JOIN organizations o ON o.id = r.buyer_org_id
WHERE 1 = 1
  AND ($1::TEXT IS NULL OR r.status = $1)
  AND ($2::INT IS NULL OR r.city_id = $2)
  AND ($3::TIMESTAMPTZ IS NULL OR r.created_at >= $3)
  AND ($4::TIMESTAMPTZ IS NULL OR r.created_at < $4)
  AND (
    $5::TEXT IS NULL OR
    o.legal_name ILIKE '%' || $5 || '%' OR
    r.id::TEXT ILIKE '%' || $5 || '%'
  );
```

---

## 2) Admin Offers List

**Endpoint:** `GET /admin/offers?status=&budget_fit=&risk=&q=&from=&to=&limit=&offset=`

### 2.1 Liste query

$1 status, $2 budget_fit_band, $3 from, $4 to, $5 q, $6 risk, $7 limit, $8 offset.

```sql
WITH base AS (
  SELECT
    off.id AS offer_id,
    off.status,
    off.budget_fit_band,
    off.risk_band,
    off.compliance_fit_band,
    off.monthly_offer_try,
    off.submitted_at,
    off.created_at,
    r.id AS request_id,
    bo.legal_name AS buyer_legal_name,
    po.legal_name AS provider_legal_name,
    po.id AS provider_org_id,
    COALESCE((
      SELECT MAX(
        CASE rf.severity
          WHEN 'CRITICAL' THEN 4
          WHEN 'HIGH' THEN 3
          WHEN 'MEDIUM' THEN 2
          WHEN 'LOW' THEN 1
          ELSE 0
        END
      )
      FROM risk_flags rf
      WHERE rf.status = 'OPEN' AND rf.entity_type = 'OFFER' AND rf.entity_id = off.id
    ), 0) AS risk_rank
  FROM offers off
  JOIN requests r ON r.id = off.request_id
  JOIN organizations bo ON bo.id = r.buyer_org_id
  JOIN organizations po ON po.id = off.provider_org_id
  WHERE 1 = 1
    AND ($1::TEXT IS NULL OR off.status = $1)
    AND ($2::TEXT IS NULL OR off.budget_fit_band = $2)
    AND ($3::TIMESTAMPTZ IS NULL OR off.created_at >= $3)
    AND ($4::TIMESTAMPTZ IS NULL OR off.created_at < $4)
    AND (
      $5::TEXT IS NULL OR
      bo.legal_name ILIKE '%' || $5 || '%' OR
      po.legal_name ILIKE '%' || $5 || '%' OR
      off.id::TEXT ILIKE '%' || $5 || '%' OR
      r.id::TEXT ILIKE '%' || $5 || '%'
    )
)
SELECT *
FROM base
WHERE (
  $6::TEXT IS NULL OR
  ($6 = 'CRITICAL' AND (risk_rank = 4 OR risk_band = 'CRITICAL')) OR
  ($6 = 'HIGH' AND risk_rank = 3) OR
  ($6 = 'WATCH' AND risk_band = 'WATCH') OR
  ($6 = 'NORMAL' AND risk_band = 'NORMAL')
)
ORDER BY created_at DESC
LIMIT $7 OFFSET $8;
```

### 2.2 Count query

*Risk filtresi ($6) yok; aynı toplam için base CTE üzerinden COUNT(*) kullanılabilir.*

```sql
SELECT COUNT(*)
FROM offers off
JOIN requests r ON r.id = off.request_id
JOIN organizations bo ON bo.id = r.buyer_org_id
JOIN organizations po ON po.id = off.provider_org_id
WHERE 1 = 1
  AND ($1::TEXT IS NULL OR off.status = $1)
  AND ($2::TEXT IS NULL OR off.budget_fit_band = $2)
  AND ($3::TIMESTAMPTZ IS NULL OR off.created_at >= $3)
  AND ($4::TIMESTAMPTZ IS NULL OR off.created_at < $4)
  AND (
    $5::TEXT IS NULL OR
    bo.legal_name ILIKE '%' || $5 || '%' OR
    po.legal_name ILIKE '%' || $5 || '%' OR
    off.id::TEXT ILIKE '%' || $5 || '%'
  );
```

---

## 3) Admin Buyers List (ödeme davranışı bandıyla)

**Endpoint:** `GET /admin/buyers?status=&risk=&q=&limit=&offset=`

### 3.1 Liste query

$1 status, $2 q, $3 risk (payment_behavior_band), $4 limit, $5 offset.

```sql
WITH approved AS (
  SELECT
    pr.buyer_org_id,
    SUM(CASE WHEN pr.reported_status = 'PAID_LATE' THEN 1 ELSE 0 END) AS late_total,
    SUM(CASE WHEN pr.reported_status = 'UNPAID' THEN 1 ELSE 0 END) AS unpaid_total,
    SUM(CASE WHEN pr.reported_status = 'UNPAID' AND pr.unpaid_band = '90_PLUS' THEN 1 ELSE 0 END) AS unpaid_90_plus
  FROM payment_reports pr
  JOIN payment_report_reviews rr ON rr.payment_report_id = pr.id
  WHERE rr.decision = 'APPROVED'
    AND rr.decided_at >= NOW() - INTERVAL '90 days'
  GROUP BY pr.buyer_org_id
),
bands AS (
  SELECT
    o.id AS buyer_org_id,
    o.legal_name,
    o.status,
    COALESCE(a.late_total, 0) AS late_total,
    COALESCE(a.unpaid_total, 0) AS unpaid_total,
    COALESCE(a.unpaid_90_plus, 0) AS unpaid_90_plus,
    CASE
      WHEN COALESCE(a.unpaid_90_plus, 0) >= 1 THEN 'CRITICAL'
      WHEN COALESCE(a.unpaid_total, 0) >= 2 THEN 'CRITICAL'
      WHEN COALESCE(a.late_total, 0) >= 2 THEN 'WATCH'
      WHEN COALESCE(a.unpaid_total, 0) = 1 THEN 'WATCH'
      ELSE 'NORMAL'
    END AS payment_behavior_band
  FROM organizations o
  LEFT JOIN approved a ON a.buyer_org_id = o.id
  WHERE o.org_type = 'BUYER'
    AND ($1::TEXT IS NULL OR o.status = $1)
    AND (
      $2::TEXT IS NULL OR
      o.legal_name ILIKE '%' || $2 || '%' OR
      o.tax_id ILIKE '%' || $2 || '%' OR
      o.id::TEXT ILIKE '%' || $2 || '%'
    )
)
SELECT *
FROM bands
WHERE ($3::TEXT IS NULL OR payment_behavior_band = $3)
ORDER BY legal_name ASC
LIMIT $4 OFFSET $5;
```

### 3.2 Count query

*Risk filtresi ($3) yok; band filtresi için toplamı liste ile aynı almak istersen bands CTE üzerinden COUNT(*) kullan.*

```sql
SELECT COUNT(*)
FROM organizations o
WHERE o.org_type = 'BUYER'
  AND ($1::TEXT IS NULL OR o.status = $1)
  AND (
    $2::TEXT IS NULL OR
    o.legal_name ILIKE '%' || $2 || '%' OR
    o.tax_id ILIKE '%' || $2 || '%'
  );
```

---

## 4) Admin Providers List (too-low yoğunluğu + profil)

**Endpoint:** `GET /admin/providers?status=&risk=&q=&limit=&offset=`

### 4.1 Liste query

$1 status, $2 q, $3 risk (provider_risk_band), $4 limit, $5 offset.

```sql
WITH too_low AS (
  SELECT
    o.provider_org_id,
    COUNT(*) AS too_low_open_30d
  FROM risk_flags rf
  JOIN offers o ON o.id = rf.entity_id
  WHERE rf.entity_type = 'OFFER'
    AND rf.flag_type = 'TOO_LOW_OFFER'
    AND rf.status = 'OPEN'
    AND rf.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY o.provider_org_id
),
base AS (
  SELECT
    org.id AS provider_org_id,
    org.legal_name,
    org.status,
    pp.profile_completion_pct,
    pp.pays_salary_sgk_tax_on_time,
    COALESCE(t.too_low_open_30d, 0) AS too_low_open_30d,
    CASE
      WHEN COALESCE(t.too_low_open_30d, 0) >= 5 THEN 'CRITICAL'
      WHEN COALESCE(t.too_low_open_30d, 0) >= 3 THEN 'WATCH'
      ELSE 'NORMAL'
    END AS provider_risk_band
  FROM organizations org
  LEFT JOIN provider_profiles pp ON pp.organization_id = org.id
  LEFT JOIN too_low t ON t.provider_org_id = org.id
  WHERE org.org_type = 'PROVIDER'
    AND ($1::TEXT IS NULL OR org.status = $1)
    AND (
      $2::TEXT IS NULL OR
      org.legal_name ILIKE '%' || $2 || '%' OR
      org.tax_id ILIKE '%' || $2 || '%' OR
      org.id::TEXT ILIKE '%' || $2 || '%'
    )
)
SELECT *
FROM base
WHERE ($3::TEXT IS NULL OR provider_risk_band = $3)
ORDER BY legal_name ASC
LIMIT $4 OFFSET $5;
```

### 4.2 Count query

*Aynı filtreler (status, q, risk) için base CTE’yi kullanıp COUNT(*) döndür; veya organizations + too_low/band mantığını tek sorguda say.*

```sql
-- Örnek: risk filtresi olmadan (status + q)
SELECT COUNT(*)
FROM organizations org
LEFT JOIN provider_profiles pp ON pp.organization_id = org.id
WHERE org.org_type = 'PROVIDER'
  AND ($1::TEXT IS NULL OR org.status = $1)
  AND (
    $2::TEXT IS NULL OR
    org.legal_name ILIKE '%' || $2 || '%' OR
    org.tax_id ILIKE '%' || $2 || '%'
  );
```

---

## 5) Admin Payment Reports List (pending / reviewed)

**Endpoint:** `GET /admin/payment-reports?state=pending|reviewed&reported_status=&buyer_q=&limit=&offset=`

### 5.1 Liste query

$1 reported_status, $2 buyer_q (ILIKE legal_name/tax_id), $3 state ('pending' | 'reviewed' | NULL), $4 limit, $5 offset.

```sql
WITH base AS (
  SELECT
    pr.id AS payment_report_id,
    pr.engagement_id,
    pr.reported_status,
    pr.delay_band,
    pr.unpaid_band,
    pr.created_at,
    bo.legal_name AS buyer_legal_name,
    po.legal_name AS provider_legal_name,
    rr.decision,
    rr.decided_at
  FROM payment_reports pr
  JOIN organizations bo ON bo.id = pr.buyer_org_id
  JOIN organizations po ON po.id = pr.provider_org_id
  LEFT JOIN payment_report_reviews rr ON rr.payment_report_id = pr.id
  WHERE 1 = 1
    AND ($1::TEXT IS NULL OR pr.reported_status = $1)
    AND (
      $2::TEXT IS NULL OR
      bo.legal_name ILIKE '%' || $2 || '%' OR
      bo.tax_id ILIKE '%' || $2 || '%'
    )
)
SELECT *
FROM base
WHERE (
  ($3 = 'pending' AND decision IS NULL)
  OR ($3 = 'reviewed' AND decision IS NOT NULL)
  OR ($3 IS NULL)
)
ORDER BY created_at DESC
LIMIT $4 OFFSET $5;
```

*Count: aynı WHERE ile base üzerinden COUNT(*).*

---

## 6) Admin Risk Flags List

**Endpoint:** `GET /admin/risk-flags?status=&severity=&entity_type=&q=&limit=&offset=`

### 6.1 Liste + count

$1 status, $2 severity, $3 entity_type, $4 q (flag_type veya entity_id ILIKE), $5 limit, $6 offset.

```sql
SELECT
  id AS flag_id,
  entity_type,
  entity_id,
  flag_type,
  severity,
  status,
  created_by,
  created_at,
  resolved_at,
  reason
FROM risk_flags
WHERE 1 = 1
  AND ($1::TEXT IS NULL OR status = $1)
  AND ($2::TEXT IS NULL OR severity = $2)
  AND ($3::TEXT IS NULL OR entity_type = $3)
  AND (
    $4::TEXT IS NULL OR
    flag_type ILIKE '%' || $4 || '%' OR
    entity_id::TEXT ILIKE '%' || $4 || '%'
  )
ORDER BY created_at DESC
LIMIT $5 OFFSET $6;
```

*Toplam için aynı WHERE ile COUNT(*) (LIMIT/OFFSET olmadan).*

---

## 7) Response formatı (tüm listeler)

Her list endpoint şu yapıyı dönsün:

```json
{
  "items": [],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 123
  }
}
```

- `limit`: istekten gelen (default 20, max 100).
- `offset`: istekten gelen (default 0).
- `total`: yukarıdaki count query sonucu (risk/band filtreleri liste ile aynı olmalı; count’u CTE ile eşleştirmek gerekebilir).

---

## 8) Güvenli SORT (ORDER BY whitelist)

**Amaç:** `sort_by` / `sort_dir` sadece izin verilen sütunlarla kullanılır; SQL injection kapanır. ORDER BY parametre bind alamadığı için whitelist zorunlu.

### 8.1 API parametreleri (ortak)

- **sort_by** (string): Sadece endpoint whitelist'indeki alanlardan biri.
- **sort_dir**: `asc` | `desc` (default endpoint'e göre; çoğu `desc`).

Örnek: `/admin/requests?sort_by=created_at&sort_dir=desc`, `/admin/providers?sort_by=legal_name&sort_dir=asc`.

### 8.2 Backend şablonu

```
ALLOWED_SORT = { "created_at": "created_at", ... }  # endpoint bazında
sortCol = ALLOWED_SORT.get(query.sort_by, default_col)
sortDir = (query.sort_dir in ["asc","desc"]) ? query.sort_dir : "desc"
sql = baseSql + " ORDER BY " + sortCol + " " + sortDir + " LIMIT ... OFFSET ..."
```

### 8.3 Endpoint whitelist tabloları

**/admin/requests:** created_at, published_at, status, city (city_name), buyer (buyer_legal_name), offers_count, risk_rank, personnel_count. Default: created_at desc.

**/admin/offers:** created_at, submitted_at, status, budget_fit_band, risk_band, risk_rank, monthly_offer_try, buyer, provider. Default: created_at desc.

**/admin/buyers:** legal_name, status, late_total, unpaid_total, unpaid_90_plus, payment_behavior_band, payment_band_rank. Default: legal_name asc.

**/admin/providers:** legal_name, status, profile_completion_pct, pays_salary_sgk_tax_on_time, too_low_open_30d, provider_risk_band, provider_band_rank. Default: legal_name asc.

**/admin/payment-reports:** created_at, reported_status, buyer, provider, decision, decided_at. Default: created_at desc.

**/admin/risk-flags:** created_at, severity, status, entity_type, flag_type. Default: created_at desc.

### 8.4 Band rank (kritik üstte)

- **Buyers:** CTE'ye `CASE payment_behavior_band WHEN 'CRITICAL' THEN 3 WHEN 'WATCH' THEN 2 ELSE 1 END AS payment_band_rank`. sort_by=payment_band_rank, sort_dir=desc.
- **Providers:** CTE'ye `CASE provider_risk_band WHEN 'CRITICAL' THEN 3 WHEN 'WATCH' THEN 2 ELSE 1 END AS provider_band_rank`. sort_by=provider_band_rank, sort_dir=desc.

### 8.5 Örnek URL'ler

- Kritik talepler üstte: `/admin/requests?sort_by=risk_rank&sort_dir=desc`
- En çok teklif: `/admin/requests?sort_by=offers_count&sort_dir=desc`
- Ödemesi problemli alıcılar: `/admin/buyers?sort_by=payment_band_rank&sort_dir=desc`
- Too-low yoğun sağlayıcılar: `/admin/providers?sort_by=too_low_open_30d&sort_dir=desc`

---

## 11) Örnek URL'ler + response mock'ları (frontend hazır)

Tüm listeler aynı yapıyı kullanır: `{ "items": [...], "pagination": { "limit", "offset", "total" } }`. Base path: `/api/v1/admin/`.

### 11.1 Admin Requests

**Örnek URL'ler:**

- Son yayınlananlar: `/api/v1/admin/requests?status=PUBLISHED&sort_by=created_at&sort_dir=desc&limit=20&offset=0`
- Riskli talepler (kritik üstte): `/api/v1/admin/requests?risk=CRITICAL&sort_by=risk_rank&sort_dir=desc&limit=20&offset=0`
- İstanbul + arama: `/api/v1/admin/requests?city_id=34&q=ABC&sort_by=created_at&sort_dir=desc&limit=20&offset=0`

**Response mock:**

```json
{
  "items": [
    {
      "request_id": "a1b2-req-uuid",
      "status": "PUBLISHED",
      "city_id": 34,
      "city_name": "İstanbul",
      "site_type": "PLAZA",
      "personnel_count": 6,
      "buyer_org_id": "b1-buyer-uuid",
      "buyer_legal_name": "ABC Holding A.Ş.",
      "offers_count": 4,
      "risk_rank": 3,
      "created_at": "2026-02-10T12:30:00Z",
      "published_at": "2026-02-10T13:00:00Z"
    }
  ],
  "pagination": { "limit": 20, "offset": 0, "total": 128 }
}
```

### 11.2 Admin Offers

**Örnek URL'ler:**

- Son teklifler: `/api/v1/admin/offers?sort_by=created_at&sort_dir=desc&limit=20&offset=0`
- Bütçe uyumlu: `/api/v1/admin/offers?budget_fit=IN&sort_by=submitted_at&sort_dir=desc&limit=20&offset=0`
- Riskli teklifler: `/api/v1/admin/offers?risk=CRITICAL&sort_by=risk_rank&sort_dir=desc&limit=20&offset=0`

**Response mock:**

```json
{
  "items": [
    {
      "offer_id": "o1-offer-uuid",
      "status": "SUBMITTED",
      "budget_fit_band": "IN",
      "risk_band": "WATCH",
      "risk_rank": 3,
      "compliance_fit_band": "OK",
      "monthly_offer_try": 395000,
      "request_id": "a1b2-req-uuid",
      "buyer_legal_name": "ABC Holding A.Ş.",
      "provider_org_id": "p1-prov-uuid",
      "provider_legal_name": "XYZ Özel Güvenlik Ltd. Şti.",
      "submitted_at": "2026-02-11T08:05:00Z",
      "created_at": "2026-02-11T08:05:00Z"
    }
  ],
  "pagination": { "limit": 20, "offset": 0, "total": 412 }
}
```

### 11.3 Admin Buyers

**Örnek URL'ler:**

- Watchlist: `/api/v1/admin/buyers?risk=WATCH&sort_by=payment_band_rank&sort_dir=desc&limit=20&offset=0`
- Kritik alıcılar: `/api/v1/admin/buyers?risk=CRITICAL&sort_by=payment_band_rank&sort_dir=desc&limit=20&offset=0`
- Arama (vergi no / firma): `/api/v1/admin/buyers?q=1234567890&sort_by=legal_name&sort_dir=asc&limit=20&offset=0`

**Response mock:**

```json
{
  "items": [
    {
      "buyer_org_id": "b1-buyer-uuid",
      "legal_name": "ABC Holding A.Ş.",
      "status": "ACTIVE",
      "late_total": 2,
      "unpaid_total": 1,
      "unpaid_90_plus": 0,
      "payment_behavior_band": "WATCH",
      "payment_band_rank": 2
    },
    {
      "buyer_org_id": "b2-buyer-uuid",
      "legal_name": "DEF Sanayi A.Ş.",
      "status": "ACTIVE",
      "late_total": 0,
      "unpaid_total": 2,
      "unpaid_90_plus": 1,
      "payment_behavior_band": "CRITICAL",
      "payment_band_rank": 3
    }
  ],
  "pagination": { "limit": 20, "offset": 0, "total": 57 }
}
```

### 11.4 Admin Providers

**Örnek URL'ler:**

- Riskli sağlayıcılar: `/api/v1/admin/providers?risk=WATCH&sort_by=too_low_open_30d&sort_dir=desc&limit=20&offset=0`
- Profil tamamlama düşük: `/api/v1/admin/providers?sort_by=profile_completion_pct&sort_dir=asc&limit=20&offset=0`
- Arama: `/api/v1/admin/providers?q=XYZ&sort_by=legal_name&sort_dir=asc&limit=20&offset=0`

**Response mock:**

```json
{
  "items": [
    {
      "provider_org_id": "p1-prov-uuid",
      "legal_name": "XYZ Özel Güvenlik Ltd. Şti.",
      "status": "ACTIVE",
      "profile_completion_pct": 100,
      "pays_salary_sgk_tax_on_time": true,
      "too_low_open_30d": 3,
      "provider_risk_band": "WATCH",
      "provider_band_rank": 2
    }
  ],
  "pagination": { "limit": 20, "offset": 0, "total": 84 }
}
```

### 11.5 Admin Payment Reports

**Örnek URL'ler:**

- Pending inceleme: `/api/v1/admin/payment-reports?state=pending&sort_by=created_at&sort_dir=desc&limit=20&offset=0`
- Reviewed + UNPAID: `/api/v1/admin/payment-reports?state=reviewed&reported_status=UNPAID&sort_by=decided_at&sort_dir=desc&limit=20&offset=0`
- Buyer arama: `/api/v1/admin/payment-reports?state=pending&buyer_q=ABC&sort_by=created_at&sort_dir=desc&limit=20&offset=0`

**Response mock:**

```json
{
  "items": [
    {
      "payment_report_id": "pr-uuid-1",
      "engagement_id": "eng-uuid-1",
      "reported_status": "UNPAID",
      "delay_band": null,
      "unpaid_band": "90_PLUS",
      "buyer_legal_name": "ABC Holding A.Ş.",
      "provider_legal_name": "XYZ Özel Güvenlik Ltd. Şti.",
      "decision": null,
      "decided_at": null,
      "created_at": "2026-02-11T09:20:00Z"
    }
  ],
  "pagination": { "limit": 20, "offset": 0, "total": 14 }
}
```

### 11.6 Admin Risk Flags

**Örnek URL'ler:**

- Açık kritikler: `/api/v1/admin/risk-flags?status=OPEN&severity=CRITICAL&sort_by=created_at&sort_dir=desc&limit=20&offset=0`
- Offer flag'leri: `/api/v1/admin/risk-flags?status=OPEN&entity_type=OFFER&sort_by=severity&sort_dir=desc&limit=20&offset=0`
- Arama: `/api/v1/admin/risk-flags?q=TOO_LOW&sort_by=created_at&sort_dir=desc&limit=20&offset=0`

**Response mock:**

```json
{
  "items": [
    {
      "flag_id": "rf-uuid-1",
      "entity_type": "OFFER",
      "entity_id": "o1-offer-uuid",
      "flag_type": "TOO_LOW_OFFER",
      "severity": "CRITICAL",
      "status": "OPEN",
      "created_by": "SYSTEM",
      "reason": "Offer below budget_min threshold",
      "created_at": "2026-02-11T08:06:00Z",
      "resolved_at": null
    }
  ],
  "pagination": { "limit": 20, "offset": 0, "total": 23 }
}
```

### 11.7 Frontend entegrasyonu notları

- **Pagination:** `limit` / `offset` / `total` ile “Sayfa 1 / 2 / 3” kolay.
- **Sort:** Dropdown’larda sadece whitelist alanları göster (Bölüm 8).
- **risk_rank** varsa “kritik üstte” sıralama doğrudan kullanılabilir.

---

## Sonraki adım (opsiyonel)

Admin list ekranları için **tablo kolonları + filtre component’leri** UI spec’i — [ADMIN-LIST-UI-SPEC.md](ADMIN-LIST-UI-SPEC.md) — kolonlar, filtreler, aksiyonlar, drawer; Figma 1:1 hiyerarşi opsiyonel.

---

*Dashboard KPI: [ADMIN-DASHBOARD-KPI-QUERIES.md](ADMIN-DASHBOARD-KPI-QUERIES.md). API: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md). Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md).*
