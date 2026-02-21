# MVP API Sözleşmesi

**Amaç:** Backend ve frontend’in aynı dili konuşması. Endpoint listesi, request/response örnekleri, RBAC tek dokümanda.

**Referans:** [TABLO-EKRAN-ESLEME-MATRISI.md](TABLO-EKRAN-ESLEME-MATRISI.md), [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md).

**Sıra:** 1) Auth & Register → 2) Buyer Request API → 3) Provider / Offers → 4) Admin.

---

## Genel

- **Base URL (örnek):** `/api/v1`
- **Auth modeli:** JWT (access token), role-based access (RBAC), admin ve user login ayrı endpoint.
- **Content-Type:** `application/json`. Tarih/saat: ISO 8601.

---

# Bölüm 1 — Auth & Register (Final / MVP)

Bu bölüm tamamlandığında frontend–backend el sıkışması başlar.

---

## 1.1 Lokasyon (kayıt formları için)

### GET /cities

**Auth:** Public.

**Response:** `200 OK`

```json
[
  { "id": 34, "name": "İstanbul" },
  { "id": 6, "name": "Ankara" }
]
```

### GET /districts?city_id={id}

**Auth:** Public.

**Response:** `200 OK`

```json
[
  { "id": 1, "city_id": 34, "name": "Kadıköy" },
  { "id": 2, "city_id": 34, "name": "Üsküdar" }
]
```

---

## 1.2 Kullanıcı Kayıt – Alıcı

### POST /auth/register/buyer

**Amaç:** Alıcı firma + ilk kullanıcıyı oluşturmak.

**Auth:** Public.

**Request**

```json
{
  "email": "buyer@firma.com",
  "password": "StrongPassword123!",
  "full_name": "Ali Yılmaz",
  "phone": "5XXXXXXXXX",
  "company": {
    "legal_name": "ABC Holding A.Ş.",
    "tax_id": "1234567890",
    "company_type": "AS",
    "city_id": 34,
    "district_id": 1,
    "address_text": "Maslak Mah. ..."
  }
}
```

**Backend işlemleri**

- `users` → insert
- `organizations` → insert (org_type=BUYER)
- `organization_users` → bağla
- `user_roles` → BUYER_USER
- `audit_logs` → BUYER_REGISTER

**Response:** `201 Created`

```json
{
  "message": "Buyer registered successfully",
  "user_id": "uuid",
  "organization_id": "uuid"
}
```

**Hatalar:** `400` validasyon, `409` email veya tax_id zaten kayıtlı (code: EMAIL_EXISTS / TAX_ID_EXISTS).

---

## 1.3 Kullanıcı Kayıt – Sağlayıcı

### POST /auth/register/provider

**Auth:** Public.

**Request**

```json
{
  "email": "provider@guvenlik.com",
  "password": "StrongPassword123!",
  "full_name": "Mehmet Kaya",
  "phone": "5XXXXXXXXX",
  "company": {
    "legal_name": "XYZ Özel Güvenlik Ltd. Şti.",
    "tax_id": "9876543210",
    "company_type": "LTD",
    "city_id": 6,
    "district_id": 10
  }
}
```

**Backend**

- Buyer ile aynı (users, organizations org_type=PROVIDER, organization_users, user_roles PROVIDER_USER).
- Ek: `provider_profiles` → boş/minimum kayıt, `profile_completion_pct = 0`.

**Response:** `201 Created`

```json
{
  "message": "Provider registered successfully",
  "organization_id": "uuid",
  "profile_completion_pct": 0
}
```

---

## 1.4 Kullanıcı Login (Buyer / Provider)

### POST /auth/login

**Auth:** Public.

**Request**

```json
{
  "email": "user@firma.com",
  "password": "StrongPassword123!"
}
```

**Backend**

- users doğrula
- user_roles oku
- organizations bağla
- JWT üret
- audit_logs → USER_LOGIN

**Response:** `200 OK`

```json
{
  "access_token": "jwt_token",
  "user": {
    "id": "uuid",
    "full_name": "Ali Yılmaz",
    "roles": ["BUYER_USER"],
    "organization": {
      "id": "uuid",
      "type": "BUYER"
    }
  }
}
```

**Frontend:** `organization.type` → dashboard routing (buyer / provider).

**Hatalar:** `401` hatalı giriş, `403` hesap pasif.

---

## 1.5 Admin Login

### POST /admin/auth/login

**Auth:** Public (response sadece admin role’lere).

**Request**

```json
{
  "email": "admin@platform.com",
  "password": "AdminStrongPassword!"
}
```

**Backend**

- Kullanıcı admin rolüne sahip mi? Değilse → 403.
- JWT + admin roles.

**Response:** `200 OK`

```json
{
  "access_token": "jwt_token",
  "admin": {
    "id": "uuid",
    "roles": ["ADMIN_RISK"]
  }
}
```

**Not:** Admin token, user token’dan ayrı namespace; admin endpoint’lerinde zorunlu.

---

## 1.6 Token Kontrol (Session Restore)

### GET /auth/me

**Headers:** `Authorization: Bearer <token>`

**Auth:** Bearer (Buyer veya Provider).

**Response:** `200 OK`

```json
{
  "user": {
    "id": "uuid",
    "full_name": "Ali Yılmaz",
    "roles": ["BUYER_USER"],
    "organization": {
      "id": "uuid",
      "type": "BUYER"
    }
  }
}
```

**Not:** Mobil / web için kritik endpoint (sayfa yenilemede session restore).

---

## 1.7 Logout (Opsiyonel – MVP sade)

JWT stateless olduğu için MVP’de:

- Frontend token’ı siler.
- (v2) Blacklist eklenebilir.

---

## RBAC — Auth seviyesinde kilit

| Endpoint | Buyer | Provider | Admin |
|----------|-------|----------|-------|
| /auth/register/* | ✅ | ✅ | ❌ |
| /auth/login | ✅ | ✅ | ❌ |
| /admin/auth/login | ❌ | ❌ | ✅ |
| /auth/me | ✅ | ✅ | ✅ |

---

## Bu aşama neyi kilitledi?

- ✔️ Login / register akışı
- ✔️ Role & organization bağlama
- ✔️ Admin–user ayrımı
- ✔️ Audit başlangıcı

Böylece frontend auth’ı yazabilir, backend auth middleware’i hazır hale gelir.

---

---

# Bölüm 2 — Buyer – Talep Oluşturma & Yönetimi (Final / MVP)

Bu bölüm ürünün kalbidir; Ekran 7–8’i birebir karşılar.

**Base URL:** `/api/v1`  
**Yetki:** Sadece BUYER_USER. Admin read-only (inceleme için).

---

## 2.1 Talep Oluştur (Draft / Publish)

### POST /buyer/requests

**Amaç:** Talep oluşturmak. İlk etapta DRAFT ya da direkt PUBLISHED.

**Auth:** Bearer (BUYER_USER).

**Request**

```json
{
  "status": "DRAFT",
  "service_types": ["UNARMED", "MOBILE_PATROL"],
  "location_mode": "SINGLE",
  "city_id": 34,
  "district_id": 1,
  "address_text": "Maslak Mah. Büyükdere Cad. No:10",
  "site_type": "PLAZA",
  "point_count": 1,
  "area_sqm": 5000,
  "personnel_count": 6,
  "shift_patterns": ["H12", "DAY", "NIGHT"],
  "weapon_requirement": "UNARMED",
  "required_certifications": ["OGG"],
  "contract_duration_months": 12,
  "start_date": "2026-04-01",
  "trial_period_days": 30,
  "subcontracting_allowed": false,
  "requires_salary_sgk_tax_on_time": true,
  "budget_min_try": 350000,
  "budget_max_try": 420000,
  "min_avg_experience_years": 2,
  "training_requirements": ["FIRST_AID", "FIRE"],
  "expected_reporting_frequency": "MONTHLY",
  "expected_digital_capabilities": ["QR_PATROL"],
  "notes": "Plaza ortamına uygun, iletişimi güçlü personel tercih edilir."
}
```

**Backend kontroller (zorunlu)**

- `budget_min_try <= budget_max_try`
- Silahlı ⇒ GUN_LICENSE zorunlu
- `subcontracting_allowed = false` ⇒ oran boş
- **requires_salary_sgk_tax_on_time = true** (platform kuralı)

**Backend işlemleri**

- `requests` → insert
- `audit_logs` → REQUEST_CREATED
- Eğer `status = PUBLISHED`: `published_at` set edilir; `admin_reviews` oluşturulabilir (riskli alıcıysa).

**Response:** `201 Created`

```json
{
  "request_id": "uuid",
  "status": "DRAFT"
}
```

---

## 2.2 Talep Güncelle

### PUT /buyer/requests/{request_id}

**Auth:** Bearer (BUYER_USER). Sadece kendi org’un talebi.

**Kural:** Sadece DRAFT veya PUBLISHED ama hiç teklif almamışsa güncellenebilir.

**Request:** Talep alanları (2.1 ile aynı yapı; kısmi güncelleme veya tam body).

**Response:** `200 OK`

```json
{
  "message": "Request updated",
  "status": "DRAFT"
}
```

---

## 2.3 Talep Yayınla

### POST /buyer/requests/{request_id}/publish

**Auth:** Bearer (BUYER_USER).

**Backend**

- status → PUBLISHED
- published_at set edilir
- Matching job tetiklenir
- audit_logs → REQUEST_PUBLISHED

**Response:** `200 OK`

```json
{
  "message": "Request published"
}
```

---

## 2.4 Alıcı – Talep Listesi (Dashboard)

### GET /buyer/requests

**Auth:** Bearer (BUYER_USER). Admin read-only için de kullanılabilir (filtre farklı olabilir).

**Response:** `200 OK`

```json
{
  "items": [
    {
      "request_id": "uuid",
      "status": "PUBLISHED",
      "city": "İstanbul",
      "site_type": "PLAZA",
      "personnel_count": 6,
      "offers_count": 4,
      "created_at": "2026-02-11"
    }
  ]
}
```

**Not:** Bütçe asla listede dönmez.

---

## 2.5 Talep Detayı (Alıcı – Ekran 8)

### GET /buyer/requests/{request_id}

**Auth:** Bearer (BUYER_USER). Admin read-only ✅.

**Response:** `200 OK`

```json
{
  "request": {
    "id": "uuid",
    "status": "PUBLISHED",
    "service_types": ["UNARMED"],
    "city": "İstanbul",
    "site_type": "PLAZA",
    "personnel_count": 6,
    "contract_duration_months": 12
  },
  "offers": [
    {
      "offer_id": "uuid",
      "provider_summary": {
        "service_cities": ["İstanbul"],
        "has_large_enterprise_experience": true
      },
      "budget_fit_band": "IN",
      "compliance_fit_band": "OK",
      "risk_band": "NORMAL"
    }
  ]
}
```

**Alıcı:**

- ❌ Fiyat görmez
- ❌ Sağlayıcı adı görmez
- ✅ Kalite & uyum etiketlerini görür (budget_fit_band, compliance_fit_band, risk_band, provider_summary sınırlı).

---

## 2.6 Talep Kapat (Opsiyonel – MVP)

### POST /buyer/requests/{request_id}/close

**Auth:** Bearer (BUYER_USER).

**Backend:** Yeni teklif alınmaz; mevcut teklifler arşivlenir (status → CLOSED vb.).

**Response:** `200 OK` + `{ "message": "Request closed" }`

---

## RBAC — Buyer talep endpoint’leri

| Endpoint | Buyer | Provider | Admin |
|----------|-------|----------|-------|
| POST /buyer/requests | ✅ | ❌ | ❌ |
| PUT /buyer/requests/{id} | ✅ | ❌ | ❌ |
| POST /buyer/requests/{id}/publish | ✅ | ❌ | ❌ |
| GET /buyer/requests | ✅ | ❌ | ✅ |
| GET /buyer/requests/{id} | ✅ | ❌ | ✅ |

---

## Bu aşama neyi kilitledi?

- ✔️ Talep oluşturma kuralları
- ✔️ Gizli bütçe mimarisi
- ✔️ Alıcı–ihaleleşme riski kapandı
- ✔️ Matching job’a sağlam veri girişi

---

---

# Bölüm 3 — Provider – Uygun Talepler & Teklif (Final / MVP)

Bu bölüm Ekran 9–11–12’yi birebir karşılar.

**Base URL:** `/api/v1`  
**Yetki:** PROVIDER_USER.

---

## 3.1 Profil Durumu (Dashboard için gerekli)

### GET /provider/profile

**Amaç:** Profil completion + kritik beyanlar.

**Auth:** Bearer (PROVIDER_USER). Admin read-only ✅.

**Response:** `200 OK`

```json
{
  "organization_id": "uuid",
  "profile_completion_pct": 85,
  "pays_salary_sgk_tax_on_time": true,
  "has_activity_license": true,
  "complies_5188": true,
  "service_areas_city_ids": [34, 6]
}
```

**Frontend kuralı:** %100 değilse “Teklif Ver” butonları disabled.

---

## 3.2 Uygun Talepler Listesi (Ekran 11)

### GET /provider/matches

**Auth:** Bearer (PROVIDER_USER).

**Query (opsiyonel)**

- `status=VISIBLE` (default)
- `city_id=34` (opsiyonel)
- `service_type=UNARMED` (opsiyonel)

**Response:** `200 OK`

```json
{
  "items": [
    {
      "request_id": "uuid",
      "summary": {
        "city": "İstanbul",
        "site_type": "PLAZA",
        "service_types": ["UNARMED", "MOBILE_PATROL"],
        "personnel_count": 6,
        "contract_duration_months": 12,
        "start_date": "2026-04-01"
      },
      "match": {
        "fit_location": 2,
        "fit_capacity": 2,
        "fit_certifications": 1,
        "fit_salary_sgk_tax": 2,
        "fit_operational": 1,
        "budget_fit_band": "IN"
      }
    }
  ]
}
```

**Not:** Provider’a ağırlık/skor dönmez (overall_fit_score yok).

---

## 3.3 Talep Detayı (Sağlayıcı – Ekran 12)

### GET /provider/requests/{request_id}

**Amaç:** Sağlayıcının göreceği talep detayları; hassas alanlar maskeli.

**Auth:** Bearer (PROVIDER_USER).

**Response:** `200 OK`

```json
{
  "request": {
    "id": "uuid",
    "status": "PUBLISHED",
    "service_types": ["UNARMED"],
    "location": {
      "city": "İstanbul",
      "district": "Sarıyer",
      "location_mode": "SINGLE",
      "address_text": null
    },
    "site_type": "PLAZA",
    "point_count": 1,
    "area_sqm": 5000,
    "personnel_count": 6,
    "shift_patterns": ["H12", "DAY", "NIGHT"],
    "weapon_requirement": "UNARMED",
    "required_certifications": ["OGG"],
    "contract_duration_months": 12,
    "start_date": "2026-04-01",
    "subcontracting_allowed": false,
    "requires_salary_sgk_tax_on_time": true,
    "optional_quality": {
      "min_avg_experience_years": 2,
      "training_requirements": ["FIRST_AID"],
      "expected_reporting_frequency": "MONTHLY",
      "expected_digital_capabilities": ["QR_PATROL"]
    },
    "notes": "Plaza ortamına uygun..."
  },
  "match": {
    "fit_location": 2,
    "fit_capacity": 2,
    "fit_certifications": 1,
    "fit_salary_sgk_tax": 2,
    "fit_operational": 1,
    "budget_fit_band": "IN"
  },
  "offer": null
}
```

**Kural:** MVP’de `address_text` provider’a `null` döner (pazarlık/ihaleleşme riskini kapatır). Varsa mevcut teklif `offer` içinde döner.

---

## 3.4 Teklif Ver (Ekran 12)

### POST /provider/requests/{request_id}/offers

**Auth:** Bearer (PROVIDER_USER).

**Request**

```json
{
  "monthly_offer_try": 395000,
  "provider_confirms_start": true,
  "provider_salary_sgk_tax_on_time_declared": true,
  "note": "12 saat vardiya + raporlama aylık sunulur."
}
```

**Backend kontroller (kritik)**

- Provider profile %100 değilse → **403** `PROFILE_INCOMPLETE`
- `provider_salary_sgk_tax_on_time_declared` true değilse → **400**
- Match `budget_fit_band = OUT` ise → **403** `BUDGET_OUT`
- Aynı request için aktif teklif varsa → **409** `OFFER_EXISTS`

**Backend işlemleri**

- offers insert/update
- offers.budget_fit_band hesapla (IN/EDGE/OUT)
- audit_logs → OFFER_SUBMITTED
- (opsiyonel) risk job: aşırı düşük teklif flag’leri

**Response:** `201 Created`

```json
{
  "offer_id": "uuid",
  "status": "SUBMITTED",
  "budget_fit_band": "IN"
}
```

---

## 3.5 Tekliflerim (Dashboard özet / detay)

### GET /provider/offers

**Auth:** Bearer (PROVIDER_USER). Admin read-only ✅.

**Response:** `200 OK`

```json
{
  "items": [
    {
      "offer_id": "uuid",
      "request_id": "uuid",
      "status": "SUBMITTED",
      "budget_fit_band": "IN",
      "submitted_at": "2026-02-11T10:20:00Z"
    }
  ]
}
```

**Not:** Provider kendi fiyatını görebilir (kendi verisi).

---

## 3.6 Teklifi Geri Çek (MVP opsiyonel)

### POST /provider/offers/{offer_id}/withdraw

**Auth:** Bearer (PROVIDER_USER).

**Response:** `200 OK`

```json
{
  "message": "Offer withdrawn"
}
```

---

## RBAC — Provider

| Endpoint | Provider | Buyer | Admin |
|----------|----------|-------|-------|
| GET /provider/profile | ✅ | ❌ | ✅ |
| GET /provider/matches | ✅ | ❌ | ✅ |
| GET /provider/requests/{id} | ✅ | ❌ | ✅ |
| POST /provider/requests/{id}/offers | ✅ | ❌ | ❌ |
| GET /provider/offers | ✅ | ❌ | ✅ |
| POST /provider/offers/{id}/withdraw | ✅ | ❌ | ❌ |

---

## Bu bölüm neyi kilitledi?

- ✔️ Provider’ın yalnız “eşleştiği” talepleri görmesi (açık pool yok)
- ✔️ Bütçenin rakam olarak sızmaması; sadece band (IN/EDGE/OUT)
- ✔️ Profil tamamlama kapısı (teklif spam’ini keser)
- ✔️ SGK + ücret vergisi şartının teklif aşamasında zorunlu beyan olması

---

---

# Bölüm 4 — Admin – İnceleme, Risk, Ödeme Davranışı (Final / MVP)

Bu bölüm **Ekran 14–15** + “Ödeme Durumu Bildir” & “Ödeme Davranışı İnceleme”yi kapsar.

**Base URL:** `/api/v1`  
**Yetki:** Admin token zorunlu (ADMIN_*). RBAC notları her endpoint altında.

---

## 4.1 Admin Dashboard (Ekran 14)

### GET /admin/dashboard

**Auth:** Bearer (ADMIN_*).

**Response:** `200 OK`

```json
{
  "kpis": {
    "active_requests": 128,
    "active_providers": 54,
    "buyers_risk_watch": 7,
    "providers_risk_watch": 5
  },
  "queues": {
    "pending_reviews": 12,
    "critical_risk_flags": 3,
    "payment_reports_pending": 4
  },
  "recent_activity": [
    {
      "at": "2026-02-11T10:00:00Z",
      "actor": "admin@platform.com",
      "action": "PAYMENT_REPORT_APPROVED",
      "entity_type": "PAYMENT_REPORT",
      "entity_id": "uuid"
    }
  ]
}
```

**RBAC:** ADMIN_SUPER, ADMIN_OPS, ADMIN_RISK, ADMIN_SUPPORT.

---

## 4.2 Admin — Talepler Listesi & Detayı (Ekran 15A)

### GET /admin/requests

**Query:** `status=PUBLISHED|UNDER_REVIEW|CLOSED`, `risk=CRITICAL|HIGH|...`, `q=` (firma adı / request id), `from=`, `to=`.

**Response:** `200 OK`

```json
{
  "items": [
    {
      "request_id": "uuid",
      "buyer_legal_name": "ABC Holding A.Ş.",
      "city": "İstanbul",
      "status": "PUBLISHED",
      "offers_count": 4,
      "risk_severity": "MEDIUM",
      "created_at": "2026-02-10"
    }
  ]
}
```

**RBAC:** ADMIN_OPS, ADMIN_SUPER, ADMIN_SUPPORT.

---

### GET /admin/requests/{request_id}

**Amaç:** Admin tam görür; gizli bütçe dahil.

**Response:** `200 OK`

```json
{
  "request": {
    "id": "uuid",
    "buyer_org_id": "uuid",
    "status": "PUBLISHED",
    "budget_min_try": 350000,
    "budget_max_try": 420000,
    "requires_salary_sgk_tax_on_time": true
  },
  "offers": [
    {
      "offer_id": "uuid",
      "provider_org_id": "uuid",
      "monthly_offer_try": 395000,
      "budget_fit_band": "IN",
      "status": "SUBMITTED"
    }
  ],
  "risk_flags": [
    { "flag_type": "TOO_LOW_OFFER", "severity": "HIGH", "status": "OPEN" }
  ]
}
```

**RBAC:** ADMIN_OPS, ADMIN_SUPER.

---

### POST /admin/requests/{request_id}/status

**Amaç:** Askıya alma / kapatma vb.

**Request**

```json
{
  "status": "UNDER_REVIEW",
  "note": "Riskli alıcı - manuel inceleme"
}
```

**Response:** `200 OK` — `{ "message": "Request status updated" }`

**RBAC:** ADMIN_OPS, ADMIN_SUPER.

---

## 4.3 Admin — Teklifler Listesi & Aksiyonlar (Ekran 15B)

### GET /admin/offers

**Query:** `status=SUBMITTED|HIDDEN_BY_ADMIN|...`, `budget_fit=IN|EDGE|OUT`, `flag=TOO_LOW_OFFER`.

**Response:** `200 OK`

```json
{
  "items": [
    {
      "offer_id": "uuid",
      "request_id": "uuid",
      "provider_legal_name": "XYZ Özel Güvenlik Ltd.",
      "monthly_offer_try": 395000,
      "budget_fit_band": "IN",
      "status": "SUBMITTED",
      "risk_severity": "LOW"
    }
  ]
}
```

**RBAC:** ADMIN_OPS, ADMIN_SUPER.

---

### POST /admin/offers/{offer_id}/hide

**Amaç:** Alıcıdan gizle (UI’da görünmesin).

**Request:** `{ "reason": "Compliance conflict" }`

**Response:** `200 OK` — `{ "message": "Offer hidden" }`

**RBAC:** ADMIN_OPS, ADMIN_SUPER.

---

### POST /admin/offers/{offer_id}/reject

**Request:** `{ "reason": "Aşırı düşük teklif tekrarı" }`

**RBAC:** ADMIN_OPS, ADMIN_SUPER.

---

## 4.4 Admin — Alıcılar (Ekran 15C)

### GET /admin/buyers

**Response:** `200 OK`

```json
{
  "items": [
    {
      "buyer_org_id": "uuid",
      "legal_name": "ABC Holding A.Ş.",
      "status": "ACTIVE",
      "open_requests": 3,
      "payment_behavior_band": "WATCH",
      "risk_severity": "MEDIUM"
    }
  ]
}
```

**RBAC:** ADMIN_RISK, ADMIN_SUPER, ADMIN_SUPPORT.

---

### GET /admin/buyers/{buyer_org_id}

**Response:** `200 OK`

```json
{
  "buyer": {
    "buyer_org_id": "uuid",
    "status": "ACTIVE",
    "payment_terms_common_days": 60
  },
  "payment_stats": {
    "late_payments_approved": 2,
    "unpaid_jobs_approved": 1
  },
  "recent_payment_reports": [
    {
      "payment_report_id": "uuid",
      "reported_status": "UNPAID",
      "created_at": "2026-01-20"
    }
  ],
  "risk_flags": []
}
```

**RBAC:** ADMIN_RISK, ADMIN_SUPER.

---

### POST /admin/buyers/{buyer_org_id}/status

**Request:** `{ "status": "REVIEW", "note": "Ödeme davranışı izleniyor" }`

**RBAC:** ADMIN_RISK, ADMIN_SUPER.

---

## 4.5 Admin — Sağlayıcılar (Ekran 15D)

### GET /admin/providers

**Response:** `200 OK`

```json
{
  "items": [
    {
      "provider_org_id": "uuid",
      "legal_name": "XYZ Özel Güvenlik Ltd.",
      "status": "ACTIVE",
      "profile_completion_pct": 100,
      "pays_salary_sgk_tax_on_time": true,
      "risk_severity": "LOW"
    }
  ]
}
```

**RBAC:** ADMIN_OPS, ADMIN_SUPER, ADMIN_SUPPORT.

---

### GET /admin/providers/{provider_org_id}

**Response:** `200 OK`

```json
{
  "provider": {
    "provider_org_id": "uuid",
    "profile_completion_pct": 100,
    "pays_salary_sgk_tax_on_time": true
  },
  "offer_stats": {
    "submitted": 10,
    "too_low_flags_open": 1
  },
  "risk_flags": []
}
```

**RBAC:** ADMIN_OPS, ADMIN_SUPER.

---

### POST /admin/providers/{provider_org_id}/status

**Request:** `{ "status": "REVIEW", "note": "Compliance conflict review" }`

**RBAC:** ADMIN_OPS, ADMIN_SUPER.

---

## 4.6 Ödeme Durumu Bildir (Provider → sisteme)

Bu endpoint provider tarafında çağrılır; admin inceleme sürecinin parçasıdır.

### POST /provider/engagements/{engagement_id}/payment-reports

**Auth:** Bearer (PROVIDER_USER).

**Request**

```json
{
  "reported_status": "PAID_LATE",
  "delay_band": "31_60",
  "comment": "Vade 45 gündü, 2 ayda ödendi.",
  "attestation_checked": false
}
```

**Backend kontroller**

- engagement provider’a ait mi?
- UNPAID ise `attestation_checked = true` zorunlu.

**Response:** `201 Created`

```json
{
  "payment_report_id": "uuid",
  "status": "RECEIVED",
  "review_state": "PENDING"
}
```

**RBAC:** PROVIDER_USER.

---

## 4.7 Admin — Ödeme Davranışı İnceleme Kuyruğu

### GET /admin/payment-reports

**Query:** `status=PENDING|REVIEWED`, `reported_status=UNPAID|PAID_LATE`, `min_band=90_PLUS` (opsiyonel).

**Response:** `200 OK`

```json
{
  "items": [
    {
      "payment_report_id": "uuid",
      "engagement_id": "uuid",
      "buyer_legal_name": "ABC Holding A.Ş.",
      "provider_legal_name": "XYZ Özel Güvenlik Ltd.",
      "reported_status": "UNPAID",
      "unpaid_band": "90_PLUS",
      "signal_strength": "MULTI_SOURCE",
      "created_at": "2026-01-20"
    }
  ]
}
```

**RBAC:** ADMIN_RISK, ADMIN_SUPER.

---

### GET /admin/payment-reports/{payment_report_id}

**Response:** `200 OK`

```json
{
  "payment_report": {
    "id": "uuid",
    "reported_status": "UNPAID",
    "unpaid_band": "90_PLUS",
    "comment": "Tahsilat olmadı.",
    "created_at": "2026-01-20"
  },
  "history": {
    "buyer_reports_last_90d": 3,
    "distinct_providers_last_90d": 2
  },
  "current_review": null
}
```

**RBAC:** ADMIN_RISK, ADMIN_SUPER.

---

### POST /admin/payment-reports/{payment_report_id}/review

**Request**

```json
{
  "decision": "APPROVED",
  "decision_note": "2 farklı sağlayıcıdan tekrar eden UNPAID sinyali. İzleme->Kritik."
}
```

**Response:** `200 OK` — `{ "message": "Review saved" }`

**Backend işlemleri**

- payment_report_reviews insert
- audit_logs → PAYMENT_REPORT_APPROVED
- Gerekirse: risk_flags oluştur (BUYER / PAYMENT_REPORT), organizations.status → REVIEW (kademeli).

**RBAC:** ADMIN_RISK, ADMIN_SUPER.

---

## 4.8 Risk Flags (Genel)

### GET /admin/risk-flags

**Query:** `status=OPEN`, `severity=CRITICAL`, vb.

**Response:** `200 OK`

```json
{
  "items": [
    {
      "flag_id": "uuid",
      "entity_type": "BUYER",
      "entity_id": "uuid",
      "flag_type": "REPEATED_LATE_PAYMENTS",
      "severity": "HIGH",
      "status": "OPEN",
      "created_at": "2026-02-01"
    }
  ]
}
```

**RBAC:** ADMIN_RISK, ADMIN_OPS, ADMIN_SUPER.

---

### POST /admin/risk-flags/{flag_id}/resolve

**Request:** `{ "resolution_note": "İnceleme tamamlandı, kısıt uygulanmadı." }`

**RBAC:** ADMIN_RISK, ADMIN_SUPER.

---

## Bu bölüm neyi kilitledi?

- ✔️ Admin listeleri (requests / offers / buyers / providers)
- ✔️ Teklif gizleme/red (ihaleleşmeyi engeller)
- ✔️ Ödeme durumu bildirimleri + admin doğrulama
- ✔️ Risk flag altyapısı + audit trail

---

# MVP API Sözleşmesi — Tamamlandı

**Auth** + **Buyer Requests** + **Provider Offers/Matches** + **Admin Review/Risk** + **Payment Behavior** tamam.

---

## Kodlama sırası önerisi (backend-first)

İstersen modül modül geliştirme sırası:

1. Auth + RBAC middleware
2. Requests CRUD + publish
3. Matching job + request_matches
4. Offer submit + budget_fit_band
5. Buyer request detail (offer etiketleri)
6. Admin review endpoints
7. Payment reports + review + risk flags

---

*Matris: [TABLO-EKRAN-ESLEME-MATRISI.md](TABLO-EKRAN-ESLEME-MATRISI.md). Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md).*
