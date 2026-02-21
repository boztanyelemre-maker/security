# Günlük Plan — 20 İş Günü (Production’a Yakın MVP Web)

**Kapsam:** MVP + DB + Backend + API + Frontend + Admin + Test + Deploy — hepsi tam.

**Süre:** 20 iş günü (~4 hafta, yoğun çalışmayla).

**Prensip:** Önce DB + Backend motor, sonra API contract, sonra Frontend bağlama, en sonda hardening + deploy.

---

## Günlük çalışma formatı (her gün aynı)

Her gün sonunda şunlar **“done”** olmalı:

- 1–3 endpoint gerçek data ile çalışıyor  
- 1 ekran API’ye bağlandı (veya admin tab’ı)  
- 5–10 test senaryosu geçti  
- Kısa changelog  

---

## Faz 1 — Altyapı & Auth (Gün 1–4)

### Gün 1 — Proje kurulumu ve standartlar

- Repo yapısı (server / web / db)  
- Environment (.env), config loader  
- Logging + error handler (tek tip hata JSON)  
- Docker Postgres + db:init script (migrations + seed)  

**Çıktı:** GET /health, DB ayağa kalkıyor, seed çalışıyor.

---

### Gün 2 — PostgreSQL migration’lar (M00–M09) + seed final

- Migration dosyalarını çalıştır, constraint/index kontrolü  
- Seed: roles + pilot cities + super admin  
- Smoke test SQL’leri  

**Çıktı:** Tüm tablolar, roller, şehirler, admin hazır.

---

### Gün 3 — Auth temeli (JWT) + RBAC

- Register buyer/provider (DB insert zinciri)  
- Login (JWT)  
- GET /auth/me  
- Role guard (BUYER / PROVIDER / ADMIN)  

**Çıktı:** Ekran 3–4–5–13’ün backend’i çalışır.

---

### Gün 4 — Organization & Profile servisleri

- Organization_users bağları  
- Provider profile GET/PUT (completion % backend hesap)  
- Provider service areas (şehirler)  

**Çıktı:** Sağlayıcı profil tamamlama motoru hazır.

---

## Faz 2 — Buyer & Matching (Gün 5–6)

### Gün 5 — Buyer Requests (Draft/Create/Edit)

- Buyer request create (DRAFT)  
- Update request  
- List my requests  
- Validasyonlar (5188, silahlı, subcontract vb.)  

**Çıktı:** Ekran 6–7 backend çekirdeği.

---

### Gün 6 — Publish + Matching Job (sync MVP)

- Publish endpoint  
- runMatchingForRequest() implement  
- request_matches upsert  
- Provider matches query  

**Çıktı:** Ekran 11 “uygun talepler listesi” data üretir.

---

## Faz 3 — Provider & Offer & Risk (Gün 7–8)

### Gün 7 — Provider Request View (maskeli) + Offer submit

- Provider request detail (address mask)  
- Offer submit (budget band IN/EDGE kapısı)  
- Offer list  

**Çıktı:** Ekran 12 teklif verme çalışır.

---

### Gün 8 — Risk engine v1 (Too-low offer + provider band)

- Too low teklif flag üret  
- Provider 30g too-low sayacı → WATCH/CRITICAL  
- Risk flags list endpoint temeli  

**Çıktı:** Risk otomasyonu çalışır, admin görebilir.

---

## Faz 4 — Ödeme Davranışı & Admin (Gün 9–10)

### Gün 9 — Engagement & Payment Reports (sağlayıcı bildirimi)

- Engagement create (MVP: admin manuel başlatabilir)  
- Provider “payment report submit”  
- Payment report pending list  

**Çıktı:** Ödeme davranışı akışı başlar.

---

### Gün 10 — Admin review & Buyer risk band

- Admin payment report review (approve/reject)  
- Buyer payment stats (90g) → risk band hesap  
- Buyers list endpoint (risk filtreli)  

**Çıktı:** Alıcı ödeme puanı/risk bandı oluşur.

---

## Faz 5 — Frontend Sprint (Gün 11–16)

### Gün 11 — Frontend kurulum + tasarım sistemi

- UI kit: layout, navbar, form components, table, badge, drawer  
- Route skeleton (15 ekranın route’ları)  
- Auth state (token storage) + guard  

**Çıktı:** Uygulama kabuğu ve navigasyon hazır.

---

### Gün 12 — Ekran 1–5 (Landing / Rol / Kayıt / Login)

- Buyer/provider register formları  
- Login + /me  
- Role bazlı yönlendirme  

**Çıktı:** Kullanıcı uçtan uca kayıt olup içeri girer.

---

### Gün 13 — Alıcı Dashboard + Talep Oluşturma (Ekran 6–7)

- Talep formu (zorunlu/opsiyonel alanlar)  
- Draft kaydet / güncelle  
- Publish butonu  

**Çıktı:** Alıcı talep açar ve yayınlar.

---

### Gün 14 — Talep Detayı (Alıcı) + teklif etiketleri (Ekran 8)

- Talep detayı + teklifler (band + risk + compliance)  
- Karşılaştırma UI (basit kart/table)  

**Çıktı:** Ekran 8 tam.

---

### Gün 15 — Sağlayıcı Profil + Dashboard (Ekran 9–10)

- Profil completion %  
- Hizmet şehirleri seçimi  
- “SGK/vergiler düzenli ödenir” beyanı  

**Çıktı:** Ekran 9–10 tam.

---

### Gün 16 — Uygun Talepler + Talep Detayı (Sağlayıcı) + Teklif (Ekran 11–12)

- Matches list (fit ikonları + band)  
- Talep detayı (maskeli)  
- Teklif formu + submit  

**Çıktı:** Ekran 11–12 tam.

---

## Faz 6 — Admin Sprint (Gün 17–18)

### Gün 17 — Admin Login + Dashboard (Ekran 13–14)

- Admin login  
- KPI kartları  
- Queue sayaçları  
- Recent activity (audit feed)  

**Çıktı:** Ekran 13–14 tam.

---

### Gün 18 — Admin List ekranları (Ekran 15 — tablı yönetim)

- Requests / Offers / Buyers / Providers / Payment Reports / Risk Flags  
- Filtre + sort whitelist + pagination  
- Drawer detayları (MVP)  

**Çıktı:** Admin yönetim alanı tam.

---

## Faz 7 — Hardening + Test + Deploy (Gün 19–20)

### Gün 19 — Test günü (kritik)

- 15 ekran manuel test checklist (TC-001…)  
- API smoke tests (Postman collection)  
- Edge case: duplicate email, duplicate tax_id, OUT budget, blocked match, pending payment review  

**Çıktı:** Test raporu + bug listesi.

---

### Gün 20 — Deploy & üretim hazırlığı

- Production env config  
- DB migration pipeline  
- Basic monitoring/logging  
- Rate limit (login / offer submit)  
- Backup stratejisi notu  

**Çıktı:** Canlıya çıkabilir “MVP production candidate”.

---

## Özet tablo (20 gün)

| Gün | Faz | Odak | Çıktı |
|-----|-----|------|--------|
| 1 | Altyapı | Repo, config, Docker, health | DB + seed çalışır |
| 2 | Altyapı | Migrations + seed final | Tablolar hazır |
| 3 | Auth | JWT, RBAC, register, login, /me | Ekran 3–5, 13 backend |
| 4 | Backend | Org + provider profile | Profil motoru |
| 5 | Backend | Buyer requests (draft/list) | Ekran 6–7 backend |
| 6 | Backend | Publish + matching job | Ekran 11 data |
| 7 | Backend | Offer submit + provider request view | Ekran 12 |
| 8 | Backend | Risk engine (too-low, band) | Risk otomasyonu |
| 9 | Backend | Engagement + payment report | Ödeme akışı |
| 10 | Backend | Admin review + buyer risk band | Alıcı risk bandı |
| 11 | Frontend | UI kit, routes, auth state | Kabuk + navigasyon |
| 12 | Frontend | 1–5 ekranlar | Kayıt + giriş E2E |
| 13 | Frontend | 6–7 ekranlar | Talep oluştur + publish |
| 14 | Frontend | 8 ekran | Talep detayı + teklifler |
| 15 | Frontend | 9–10 ekranlar | Sağlayıcı profil |
| 16 | Frontend | 11–12 ekranlar | Uygun talepler + teklif |
| 17 | Frontend | 13–14 ekranlar | Admin login + dashboard |
| 18 | Frontend | 15 ekran | Admin listeler |
| 19 | Test | Manuel + API smoke + edge case | Test raporu |
| 20 | Deploy | Prod config, migration, rate limit, backup | Production candidate |

---

## Hemen başlamak için ilk adım

**Gün 1–2’yi bugün bitirelim** mantığıyla:

- DB migrations + seed + docker script + smoke test  

**Sonraki adım (hazırlanabilir):**

- `db/` klasör yapısı, `db/init.sh` (tek komutla migrate + seed), Postman smoke test listesi  
- Frontend deploy: [NETLIFY-FRONTEND-DEPLOY.md](NETLIFY-FRONTEND-DEPLOY.md) — _redirects, netlify.toml, env, CORS, checklist  

---

*Sprint 1 (7 gün): [GELISTIRME-SIRASI-VE-SPRINT1.md](GELISTIRME-SIRASI-VE-SPRINT1.md). Test planı: [MVP-TEST-PLANI-15-SAYFA.md](MVP-TEST-PLANI-15-SAYFA.md). API: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md).*
