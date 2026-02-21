# API kontrat şablonu (MVP)

**Amaç:** Backend kodlamaya girmeden önce endpoint’lerin request/response sözleşmesi + 8 tablo + RBAC kurallarının tek yerde toplanması.

**Referans:** [MVP-TAM-KAPSAM.md](MVP-TAM-KAPSAM.md) §3–4, [MVP-VERITABANI-TABLOLARI.md](MVP-VERITABANI-TABLOLARI.md).

---

## 1. Endpoint listesi ve kontrat iskeleti

### Auth

| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| POST | `/auth/register-buyer` | Public | Alıcı firma + kullanıcı kaydı |
| POST | `/auth/register-provider` | Public | Sağlayıcı firma + kullanıcı kaydı |
| POST | `/auth/login` | Public | E-posta + şifre → token + role |
| POST | `/auth/logout` | Auth | Token invalidation (opsiyonel) |

**Request örnekleri (şema iskeleti):**

- `POST /auth/register-buyer`  
  Body: `company_name`, `tax_number`, `city`, `district`, `full_name`, `email`, `phone`, `password`  
  Response: `201` + `{ user_id, company_id, role: "BUYER" }` veya `400` (validation)

- `POST /auth/register-provider`  
  Body: aynı yapı; `role` backend’de PROVIDER  
  Response: aynı mantık

- `POST /auth/login`  
  Body: `email`, `password`  
  Response: `200` + `{ token, refresh_token?, user_id, company_id, role }` veya `401`

---

### Buyer

| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| POST | `/requests` | Buyer | Taslak talep oluştur (body’de bütçe ayrı alan veya ayrı endpoint) |
| POST | `/requests/:id/publish` | Buyer | Talebi yayınla |
| GET | `/buyer/requests` | Buyer | Alıcının talepleri (liste) |
| GET | `/buyer/requests/:id` | Buyer | Talep detayı (bütçe dahil) |
| GET | `/buyer/requests/:id/offers` | Buyer | O talebe gelen teklifler |

**Request/Response iskeleti:**

- `POST /requests`  
  Body: talep alanları (hizmet türü, süre, şehir, personel sayısı, vb.) + **bütçe min/max** (ayrı key veya ayrı tablo ile saklanır)  
  Response: `201` + `{ request_id, status: "DRAFT" }`

- `GET /buyer/requests/:id`  
  Response: talep + **bütçe** (sadece buyer).  
  `GET /buyer/requests/:id/offers`: teklif listesi (sağlayıcı adı, fiyat, durum).

---

### Provider

| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| PUT | `/provider/profile` | Provider | Profil güncelle (şehirler, kapasite, türler); profile_completed |
| GET | `/provider/requests` | Provider | Eşleşen talepler (bütçe yok; uygun/uygun değil bayrağı) |
| GET | `/provider/requests/:id` | Provider | Talep detayı (bütçe yok) |
| POST | `/offers` | Provider | Teklif ver (request_id, fiyat, not) |

**Kontrat notu:**

- `GET /provider/requests` ve `GET /provider/requests/:id`: response’ta **bütçe alanı yok**; varsa sadece `budget_fits: true | false` (veya eşdeğeri).
- `POST /offers`: Body: `request_id`, `amount` (veya `monthly_amount`), `note` (opsiyonel). Response: `201` + `{ offer_id }`.

---

### Admin (MVP minimum)

| Method | Endpoint | Rol | Açıklama |
|--------|----------|-----|----------|
| GET | `/admin/buyers` | Admin | Alıcı firmalar listesi (filtre: durum) |
| GET | `/admin/providers` | Admin | Sağlayıcı firmalar listesi |
| POST | `/admin/companies/:id/status` | Admin | status = ACTIVE | SUSPENDED; **body’de reason zorunlu** (audit için) |

**Request iskeleti:**

- `POST /admin/companies/:id/status`  
  Body: `{ "status": "SUSPENDED", "reason": "..." }`  
  Response: `200` veya `400` (reason eksikse).

---

## 2. Veritabanı — 8 tablo (migration başlıkları)

| # | Tablo | Amaç |
|---|--------|------|
| 1 | `companies` | Firma (role=BUYER/PROVIDER, tax_number unique) |
| 2 | `users` | Giriş (email unique, user_role=COMPANY_USER/ADMIN) |
| 3 | `provider_profiles` | Sağlayıcı profil (profile_completed) |
| 4 | `requests` | Talep (buyer_company_id, city, status, vb.; bütçe yok) |
| 5 | `request_budget_private` | Bütçe min/max (request_id FK); sadece buyer + sistem |
| 6 | `offers` | Teklif (request_id, provider_company_id, amount, status) |
| 7 | `admin_notes` | Admin notları (company_id veya request_id) |
| 8 | `audit_logs` | Kim ne yaptı (user_id, action, entity_type, entity_id, payload) |

**Indexler:** `requests (city, status)`, `offers (request_id)`, `users (email)`; unique: `email`, `tax_number`.

---

## 3. RBAC kuralları (API seviyesi)

| Endpoint grubu | İzin verilen rol(ler) |
|----------------|------------------------|
| `/auth/*` (register, login) | Public |
| `/auth/logout` | Authenticated (her rol) |
| `/requests`, `/buyer/*` | **BUYER** (company_id eşleşmeli) |
| `/provider/*`, `/offers` (POST) | **PROVIDER** (company_id eşleşmeli) |
| `/admin/*` | **ADMIN** (user_role=ADMIN) |

- Yetkisiz rol → **403**.
- Başka firmanın talebi/tekliği → **403** veya **404** (gizlilik için 404 tercih edilebilir).
- Bütçe: `request_budget_private` sadece buyer’ın kendi talepleri ve admin (gerekirse) için dönülür; provider endpoint’lerinde hiç dönülmez.

---

## 4. Sonraki adım

- Bu şablonu OpenAPI (Swagger) veya Postman collection’a dönüştürmek.
- Migration dosyalarını (SQL veya ORM) yazmak.
- Kodlama sırası: Auth + RBAC → Buyer → Provider → Admin.

---

*Paralel doküman: [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md). Sıra kararı: [TASARIM-KODLAMA-SIRASI.md](TASARIM-KODLAMA-SIRASI.md).*
