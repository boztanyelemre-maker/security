# Admin Dashboard (Ekran 14) — KPI + Queue Query Set (MVP)

**Mantık:** Hızlı ve güvenilir. Risk band DB’de saklanmıyor; dashboard endpoint’i **query + küçük logic** ile hesaplayıp döner.

**Endpoint:** `GET /admin/dashboard` — aşağıdaki query’lerle doldurulacak önerilen JSON yapısı bölüm 7’de.

---

## 1) Temel KPI’lar

### 1.1 Aktif talepler

```sql
SELECT COUNT(*) AS active_requests
FROM requests
WHERE status IN ('PUBLISHED', 'UNDER_REVIEW');
```

### 1.2 Aktif sağlayıcı sayısı

```sql
SELECT COUNT(*) AS active_providers
FROM organizations
WHERE org_type = 'PROVIDER' AND status = 'ACTIVE';
```

### 1.3 Aktif alıcı sayısı (opsiyonel KPI)

```sql
SELECT COUNT(*) AS active_buyers
FROM organizations
WHERE org_type = 'BUYER' AND status = 'ACTIVE';
```

### 1.4 Son 7 gün yeni kayıtlar (buyer/provider)

```sql
SELECT
  org_type,
  COUNT(*) AS cnt
FROM organizations
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY org_type;
```

*Response’da örn. `new_signups_7d: { BUYER: n, PROVIDER: m }`.*

---

## 2) Risk & uyarı KPI’ları

### 2.1 Açık kritik risk flag sayısı (genel)

```sql
SELECT COUNT(*) AS critical_open_flags
FROM risk_flags
WHERE status = 'OPEN' AND severity = 'CRITICAL';
```

### 2.2 Açık yüksek risk flag sayısı (genel)

```sql
SELECT COUNT(*) AS high_open_flags
FROM risk_flags
WHERE status = 'OPEN' AND severity = 'HIGH';
```

### 2.3 Ödeme davranışı uyarıları (son 90 gün, onaylı) — UNPAID 90+ kaç adet?

```sql
SELECT COUNT(*) AS unpaid_90_plus_approved
FROM payment_reports pr
JOIN payment_report_reviews rr ON rr.payment_report_id = pr.id
WHERE rr.decision = 'APPROVED'
  AND rr.decided_at >= NOW() - INTERVAL '90 days'
  AND pr.reported_status = 'UNPAID'
  AND pr.unpaid_band = '90_PLUS';
```

---

## 3) Kuyruklar (Queues)

### 3.1 Admin review kuyruğu (OPEN / IN_PROGRESS)

```sql
SELECT
  queue_type,
  status,
  COUNT(*) AS cnt
FROM admin_reviews
WHERE status IN ('OPEN', 'IN_PROGRESS')
GROUP BY queue_type, status
ORDER BY queue_type, status;
```

*Response’da örn. `admin_reviews_open` toplam OPEN+IN_PROGRESS veya queue_type bazında dağılım.*

### 3.2 Ödeme raporu inceleme kuyruğu (PENDING)

Review kaydı yoksa “bekliyor” sayılır:

```sql
SELECT COUNT(*) AS payment_reports_pending
FROM payment_reports pr
LEFT JOIN payment_report_reviews rr ON rr.payment_report_id = pr.id
WHERE rr.payment_report_id IS NULL;
```

*İstersen `pr.created_at >= NOW() - INTERVAL '60 days'` eklenebilir.*

---

## 4) Buyer risk watchlist (MVP)

**Kural:** [RISK-BAND-STANDARD.md](RISK-BAND-STANDARD.md) — son 90 günde APPROVED ödeme raporlarına göre band (unpaid_90_plus ≥1 veya unpaid_total ≥2 → CRITICAL; late_total ≥2 veya unpaid_total = 1 → WATCH).

```sql
WITH stats AS (
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
    buyer_org_id,
    CASE
      WHEN unpaid_90_plus >= 1 THEN 'CRITICAL'
      WHEN unpaid_total >= 2 THEN 'CRITICAL'
      WHEN late_total >= 2 THEN 'WATCH'
      WHEN unpaid_total = 1 THEN 'WATCH'
      ELSE 'NORMAL'
    END AS buyer_risk_band
  FROM stats
)
SELECT
  SUM(CASE WHEN buyer_risk_band = 'WATCH' THEN 1 ELSE 0 END) AS buyers_watch,
  SUM(CASE WHEN buyer_risk_band = 'CRITICAL' THEN 1 ELSE 0 END) AS buyers_critical
FROM bands;
```

---

## 5) Provider risk watchlist (MVP)

**Kural:** Son 30 gün OPEN TOO_LOW_OFFER sayısı (≥5 → CRITICAL, ≥3 → WATCH). Bkz. [RISK-BAND-STANDARD.md](RISK-BAND-STANDARD.md).

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
bands AS (
  SELECT
    provider_org_id,
    CASE
      WHEN too_low_open_30d >= 5 THEN 'CRITICAL'
      WHEN too_low_open_30d >= 3 THEN 'WATCH'
      ELSE 'NORMAL'
    END AS provider_risk_band
  FROM too_low
)
SELECT
  SUM(CASE WHEN provider_risk_band = 'WATCH' THEN 1 ELSE 0 END) AS providers_watch,
  SUM(CASE WHEN provider_risk_band = 'CRITICAL' THEN 1 ELSE 0 END) AS providers_critical
FROM bands;
```

*Hiç too_low kaydı yoksa sonuç 0 satır dönebilir; uygulama 0/0 olarak yorumlar.*

---

## 6) Son aktiviteler (audit feed)

Dashboard’da 10–20 satır yeterli.

**Sadece audit:**

```sql
SELECT
  created_at,
  actor_user_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  metadata_json
FROM audit_logs
ORDER BY created_at DESC
LIMIT 20;
```

**Actor email ile (opsiyonel):**

```sql
SELECT
  a.created_at,
  u.email,
  a.actor_role,
  a.action,
  a.entity_type,
  a.entity_id,
  a.metadata_json
FROM audit_logs a
LEFT JOIN users u ON u.id = a.actor_user_id
ORDER BY a.created_at DESC
LIMIT 20;
```

---

## 7) Önerilen endpoint çıktısı (GET /admin/dashboard)

```json
{
  "kpis": {
    "active_requests": 0,
    "active_buyers": 0,
    "active_providers": 0,
    "critical_open_flags": 0,
    "high_open_flags": 0,
    "unpaid_90_plus_approved": 0
  },
  "risk_watchlists": {
    "buyers_watch": 0,
    "buyers_critical": 0,
    "providers_watch": 0,
    "providers_critical": 0
  },
  "queues": {
    "admin_reviews_open": 0,
    "admin_reviews_by_queue": [],
    "payment_reports_pending": 0
  },
  "recent_activity": []
}
```

- `admin_reviews_by_queue`: Bölüm 3.1 sonucu (queue_type, status, cnt) — isteğe bağlı.
- `recent_activity`: Bölüm 6 sonucu (created_at, actor_user_id veya email, actor_role, action, entity_type, entity_id, metadata_json).

---

## Sonraki adım (opsiyonel)

- **Admin list query paketleri:** [ADMIN-LIST-QUERIES.md](ADMIN-LIST-QUERIES.md) — requests, offers, buyers, providers, payment-reports, risk-flags; filtreli + sayfalı; response formatı.
- Sort (ORDER BY) whitelist şablonu — güvenli `sort` parametresi.

---

*Listeler: [ADMIN-LIST-QUERIES.md](ADMIN-LIST-QUERIES.md). Risk band: [RISK-BAND-STANDARD.md](RISK-BAND-STANDARD.md). API: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md). Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md).*
