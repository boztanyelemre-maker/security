# Teknik Taraf %100 — Final Teknik Mimari (Scope Freeze)

**Kilit:** Bu doküman teknik kararları dondurur. Mimari, teknoloji, API, güvenlik ve deploy burada yazılanlarla uyumlu olacak.

---

## 1. Final Teknik Mimari

| Katman | Teknoloji | Not |
|--------|-----------|-----|
| **Frontend** | React + Vite | Netlify deploy, SPA routing (_redirects), env: `VITE_API_BASE_URL` |
| **Backend** | Node.js + Express | JWT (HS256), bcrypt, pg (native), salt SQL migrations |
| **Database** | PostgreSQL 16 | UUID (`gen_random_uuid`), JSONB metadata, uygun indexler |
| **Deploy** | Frontend → Netlify; Backend → Render Web Service; DB → Render Managed Postgres (paid) |

Bu kararlar değişmeyecek.

---

## 2. Ortam Yapısı

| Ortam | Veritabanı | API | Frontend |
|-------|------------|-----|----------|
| **Development** | Docker Postgres | Local Node server, `.env` local | Local Vite |
| **Production** | Render Managed Postgres | Render Web Service | Netlify |

Env: Development’ta `.env`; Production’da Render/Netlify UI’dan env vars.

---

## 3. Klasör Yapısı (Kesin)

```
server/                     # API
  src/
    index.js
    config/
    middleware/
    routes/
    controllers/
    services/
    repositories/
    jobs/
    utils/

db/                         # Migration + seed (proje kökü)
  init.sh
  # migration dosyaları: docs/migrations, seed: docs/seed

frontend/
  src/
    pages/
    components/
    services/api.js
    hooks/
    router/
```

Migrations: `docs/migrations/` (M00–M09a). Seed: `docs/seed/minimum-seed.sql`.

---

## 4. API Contract (Tüm Endpointler — Kilitli)

### Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/auth/register/buyer` | Buyer kayıt |
| POST | `/auth/register/provider` | Provider kayıt |
| POST | `/auth/login` | Login, JWT döner |
| GET | `/auth/me` | Mevcut kullanıcı + roller |

### Buyer
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/buyer/requests` | Talep oluştur (DRAFT) |
| PUT | `/buyer/requests/:id` | Talep güncelle |
| POST | `/buyer/requests/:id/publish` | Yayınla, matching tetiklenir |
| GET | `/buyer/requests` | Taleplerim listesi |
| GET | `/buyer/requests/:id` | Talep detayı |

### Provider
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/provider/profile` | Profil |
| PUT | `/provider/profile` | Profil güncelle |
| GET | `/provider/matches` | Uyumlu eşleşmeler (VISIBLE) |
| GET | `/provider/requests/:id` | Talep detayı (maskeli adres) |
| POST | `/provider/requests/:id/offers` | Teklif ver |
| GET | `/provider/offers` | Tekliflerim |

### Admin
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/admin/dashboard` | Özet |
| GET | `/admin/requests` | Talepler |
| GET | `/admin/offers` | Teklifler |
| GET | `/admin/buyers` | Alıcılar |
| GET | `/admin/providers` | Sağlayıcılar |
| GET | `/admin/payment-reports` | Ödeme raporları |
| GET | `/admin/risk-flags` | Risk bayrakları |
| POST | `/admin/payment-reports/:id/review` | Ödeme inceleme/onay |

**Kural:** OUT teklif → **403**. Standart hata JSON formatı kilitli: `{ code, message, details, requestId }`.

---

## 5. Güvenlik Modeli

- **Password:** bcrypt, salt rounds 10.
- **JWT:** HS256, expiry 7d (MVP).
- **Yetkilendirme:** Role-based middleware (BUYER_USER, PROVIDER_USER, ADMIN).
- **CORS:** Whitelist (Netlify + custom domain).
- **Rate limit:** Login + offer submit (MVP’de tanımlı).
- **SQL:** Sadece parameterized queries.
- **Helmet:** Middleware kullanılacak.

---

## 6. Risk Engine Mimarisi

- **Publish** → senkron matching (cron yok, MVP).
- **Offer submit** → bütçe bandı kontrolü; OUT → 403.
- **Aşırı düşük teklif** → `risk_flags` insert.
- Risk band hesabı: service katmanında net fonksiyon.

---

## 7. Backup & Recovery

- Render Postgres (paid): otomatik backup açık.
- Haftalık manuel dump script (opsiyonel).
- Migration’lar versiyonlu (M00–M09a); rollback planı migration geri alma ile.

---

## 8. Logging & Monitoring

- **Request ID:** Her istekte (X-Request-Id).
- **Error log:** Standart, requestId ile.
- **Audit:** Audit logs tablosu (admin aksiyonları vb.).
- **Uptime:** Render healthcheck; `GET /health` kullanılır.

---

## 9. CI/CD

- GitHub repo.
- Push → Render auto deploy (backend), Netlify auto deploy (frontend).
- Manuel FTP yok.

---

## 10. Performans (MVP Seviyesi)

- **Pagination:** List endpoint’lerde zorunlu.
- **Indexler:** `requests.status`, `request_matches.provider_id`, `offers.request_id`, `risk_flags.status` (ve şemada tanımlı diğerleri).
- **N+1 yok:** Gerekli yerlerde join kullanımı.

---

## Durum Özeti

| Alan | Durum |
|------|--------|
| Mimari | Kilitli |
| Teknoloji seçimi | Kilitli |
| API sözleşmesi | Kilitli |
| Güvenlik modeli | Kilitli |
| Deploy / backup / monitoring / CI/CD | Kilitli |
| **Sonraki adım** | Sadece implementasyon |

*Teknik belirsizlik kapatıldı. Kod yazımı bu dokümana göre ilerleyecek.*
