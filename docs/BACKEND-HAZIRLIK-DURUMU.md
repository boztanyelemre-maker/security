# API Endpoint Backend — Hazırlık Durumu

**Kısa cevap:** “Çalışır durumda” hazır değil — ama **tasarım + sözleşme (contract) + DB şeması hazır**. Backend’i yazmaya başlamak için tüm gereksinimler net ve kilitli.

---

## Şu an “hazır” olanlar

| Alan | Durum |
|------|--------|
| Endpoint listesi ve davranışları (hangi ekran ne çağıracak) | ✅ [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md) |
| DB şeması (PostgreSQL migration DDL) | ✅ docs/migrations M00–M09 |
| Seed mantığı | ✅ roles, cities, districts, (ops) admin |
| Matching job kuralları | ✅ [MATCHING-JOB-KURALLAR.md](MATCHING-JOB-KURALLAR.md), [MATCHING-JOB-IMPLEMENTATION.md](MATCHING-JOB-IMPLEMENTATION.md) |
| Risk / ödeme davranışı kuralları | ✅ [OFFER-BUDGET-AND-RISK-RULES.md](OFFER-BUDGET-AND-RISK-RULES.md), [RISK-BAND-STANDARD.md](RISK-BAND-STANDARD.md) |
| Admin list filtre/sort query paketleri | ✅ [ADMIN-LIST-QUERIES.md](ADMIN-LIST-QUERIES.md), [ADMIN-DASHBOARD-KPI-QUERIES.md](ADMIN-DASHBOARD-KPI-QUERIES.md) |

---

## “Hazır olmayan” (kodlanması gereken)

| Parça | Açıklama |
|-------|----------|
| Backend servis kodu | controller / service / repo katmanları |
| JWT auth + RBAC middleware | implementasyon |
| Matching job | trigger + upsert (request publish sonrası) |
| Offer submit + risk flag otomasyonu | budget band + TOO_LOW_OFFER |
| Admin dashboard endpoint | KPI + queue query’lerinin çalışır hali |
| Test datalarıyla uçtan uca smoke test | — |

---

## MVP’de “endpoint backend hazır” minimum checklist

Aşağıdakiler **çalışıyorsa** “hazır” denir.

### 1) Auth (5 ekranın temeli)

- POST /auth/register/buyer  
- POST /auth/register/provider  
- POST /auth/login  
- POST /admin/auth/login  
- GET /auth/me  

### 2) Buyer core

- POST /buyer/requests  
- PUT /buyer/requests/{id}  
- POST /buyer/requests/{id}/publish ✅ matching tetikler  
- GET /buyer/requests  
- GET /buyer/requests/{id}  

### 3) Provider core

- GET /provider/profile  
- PUT /provider/profile  
- GET /provider/matches  
- GET /provider/requests/{id}  
- POST /provider/requests/{id}/offers  
- GET /provider/offers  

### 4) Admin core

- GET /admin/dashboard  
- GET /admin/requests + GET /admin/requests/{id}  
- GET /admin/offers  
- GET /admin/buyers  
- GET /admin/providers  
- GET /admin/payment-reports  
- GET /admin/risk-flags  

### 5) Payment behavior

- POST /provider/engagements/{id}/payment-reports  
- POST /admin/payment-reports/{id}/review  

---

## Auth + RBAC — Request/Response (kesin contract)

Base URL örneği: `/api/v1`. Tüm Auth istekleri `Content-Type: application/json`.

### POST /auth/register/buyer

**Request:**

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

**Response:** `201 Created`

```json
{
  "message": "Buyer registered successfully",
  "user_id": "uuid",
  "organization_id": "uuid"
}
```

**Hatalar:** 400 validasyon, 409 EMAIL_EXISTS / TAX_ID_EXISTS. Şifre response’da dönmez.

---

### POST /auth/register/provider

**Request:**

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

**Response:** `201 Created`

```json
{
  "message": "Provider registered successfully",
  "organization_id": "uuid",
  "profile_completion_pct": 0
}
```

**Backend:** users, organizations (PROVIDER), organization_users, user_roles (PROVIDER_USER), provider_profiles (min kayıt). 409 email/tax_id.

---

### POST /auth/login

**Request:**

```json
{
  "email": "user@firma.com",
  "password": "StrongPassword123!"
}
```

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

**Hatalar:** 401 hatalı giriş, 403 hesap pasif. Frontend: `organization.type` → dashboard (buyer / provider).

---

### POST /admin/auth/login

**Request:**

```json
{
  "email": "admin@platform.com",
  "password": "AdminStrongPassword!"
}
```

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

**Backend:** Kullanıcı admin rolünde değilse 403. Admin token, user endpoint’lerinde ayrı namespace.

---

### GET /auth/me

**Headers:** `Authorization: Bearer <token>`

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

**Auth:** Bearer (Buyer veya Provider). Admin token ile farklı payload (admin.*) olabilir; admin paneli GET /admin/me kullanıyorsa ayrı endpoint.

---

## Sonraki adım (önerilen sıra)

1. **Auth + RBAC (JWT)** — middleware + token üretimi/doğrulama  
2. **Register Buyer/Provider** — DB insert zinciri (users → organizations → organization_users → user_roles; provider için provider_profiles)  
3. **Login + GET /auth/me**  
4. **Buyer request publish + matching job (sync)**  

Bunlar bitince **5 ekran** (1–5 + 13) tamamen çalışır.

**Kod skeleton:** Stack seçildikten sonra (Node/Express veya Flask) Auth + RBAC + Register/Login/me için dosya ve fonksiyon iskeleti çıkarılabilir.

---

*Tam API: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md). Klasör yapısı: [BACKEND-KLASOR-YAPISI.md](BACKEND-KLASOR-YAPISI.md).*
