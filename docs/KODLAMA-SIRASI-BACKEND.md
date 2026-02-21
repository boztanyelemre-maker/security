# MVP Kodlama Sırası (Backend-first)

**Amaç:** Her adımda “çıktı” net: hangi endpoint’ler çalışır, hangi tablo(lar) dolmaya başlar, hangi ekranlar ayağa kalkar.

**Referans:** [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md), [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md), [TABLO-EKRAN-ESLEME-MATRISI.md](TABLO-EKRAN-ESLEME-MATRISI.md).

---

## 1) Proje iskeleti + altyapı

**Amaç:** Ortak standartlar (logging, error, config) otursun.

**Çıktı:**

- `GET /health`
- `.env` + config loader
- DB bağlantısı + migration altyapısı
- Global error formatı (tek tip JSON)

---

## 2) Auth + RBAC middleware (kilit adım)

**Tablolar:** users, roles, user_roles, organizations, organization_users, audit_logs

**Endpoint’ler:**

- POST /auth/register/buyer
- POST /auth/register/provider
- POST /auth/login
- POST /admin/auth/login
- GET /auth/me

**Kritik:**

- Admin ve user token ayrımı
- Role guard (BUYER / PROVIDER / ADMIN)

**Ekranlar açılır:** 3, 4, 5, 13

---

## 3) Lookup servisleri (dropdown’lar)

**Tablolar:** cities, districts (seed)

**Endpoint’ler (öneri):**

- GET /meta/cities (veya /cities)
- GET /meta/districts?city_id= (veya /districts?city_id=)

**Ekranlar açılır:** 7, 10

---

## 4) Buyer Requests — Draft/Publish + Liste/Detay

**Tablolar:** requests, audit_logs, (opsiyonel) admin_reviews

**Endpoint’ler:**

- POST /buyer/requests
- PUT /buyer/requests/{id}
- POST /buyer/requests/{id}/publish
- GET /buyer/requests
- GET /buyer/requests/{id} (şimdilik offers boş döner)

**Kritik validasyonlar:**

- bütçe min/max
- silahlı → gun license
- subcontract ratio
- **requires_salary_sgk_tax_on_time = true**

**Ekranlar açılır:** 6, 7, 8 (kısmi)

---

## 5) Provider Profile — Profil tamamlama + % hesaplama

**Tablolar:** provider_profiles, provider_service_areas, audit_logs

**Endpoint’ler (öneri):**

- GET /provider/profile
- PUT /provider/profile

**Kritik:**

- completion % backend hesap
- **pays_salary_sgk_tax_on_time** zorunlu

**Ekranlar açılır:** 9, 10

---

## 6) Matching Job — request_matches üretimi

**Tablolar:** request_matches

**Çalışma şekli:**

- Request publish olunca tetiklenir (sync ya da async job)
- Provider profile güncellenince yeniden hesaplanabilir (v2)

**Çıktı:**

- fit_* alanları dolu
- budget_fit_band (request düzeyinde pre-band veya offer sonrası)

---

## 7) Provider Matches & Request Detail (Provider view)

**Tablolar:** request_matches, requests

**Endpoint’ler:**

- GET /provider/matches
- GET /provider/requests/{id} (maskeli adres)

**Kritik:**

- Sadece match_status = VISIBLE request’ler
- Adres provider’a null

**Ekranlar açılır:** 11, 12 (teklif formu hariç)

---

## 8) Offers — Teklif ver / listem / geri çek

**Tablolar:** offers, audit_logs, (opsiyonel) risk_flags

**Endpoint’ler:**

- POST /provider/requests/{id}/offers
- GET /provider/offers
- POST /provider/offers/{id}/withdraw (ops)

**Kritik:**

- profil %100 değilse 403
- **SGK/ücret beyanı zorunlu**
- budget_fit OUT ise 403
- unique(request_id, provider_org_id)

**Ekranlar açılır:** 12 tam, 9 “tekliflerim” dolmaya başlar

---

## 9) Buyer Request Detail — teklif etiketleriyle

**Tablolar:** offers

**Endpoint:**

- GET /buyer/requests/{id} artık offers[] döner (etiketler)

**Kritik:**

- Alıcıya ham fiyat yok
- Sadece budget_fit_band, compliance_fit_band, risk_band + provider özet sinyalleri

**Ekranlar açılır:** 8 tam

---

## 10) Admin Lists — Requests / Offers / Buyers / Providers

**Tablolar:** requests, offers, organizations, provider_profiles, risk_flags, audit_logs

**Endpoint’ler:**

- GET /admin/requests
- GET /admin/requests/{id}
- POST /admin/requests/{id}/status
- GET /admin/offers
- POST /admin/offers/{id}/hide
- POST /admin/offers/{id}/reject
- GET /admin/buyers
- GET /admin/providers

**Ekranlar açılır:** 14, 15 (çoğu)

---

## 11) Engagements — “aktif iş” nesnesi

**Tablolar:** engagements

**Kural:**

- Offer ACCEPTED (admin ya da buyer accept MVP’de eklenirse) → engagement yarat
- Not: MVP’de “accept” yoksa bile admin tarafında manuel accept ile başlatılabilir.

---

## 12) Payment Reports (Provider) + Review (Admin) + Risk Flags

**Tablolar:** payment_reports, payment_report_reviews, risk_flags, admin_reviews, audit_logs

**Endpoint’ler:**

- POST /provider/engagements/{id}/payment-reports
- GET /admin/payment-reports
- GET /admin/payment-reports/{id}
- POST /admin/payment-reports/{id}/review
- GET /admin/risk-flags
- POST /admin/risk-flags/{id}/resolve

**Ekranlar açılır:** Ödeme bildir modülü + admin inceleme kuyruğu + dashboard uyarıları

---

## 13) Son: Güvenlik / kalite tamamlayıcıları

- Rate limit (login, offer submit)
- Audit kapsamı genişletme
- Seed test data
- Integration tests (happy path)
- Basic monitoring

---

## En hızlı “demo” hedefi (sprint gibi)

| Demo | Adımlar | Ne gösterilir? |
|------|---------|----------------|
| **Demo 1 (çekirdek)** | 2 → 4 → 5 → 6 → 7 → 8 → 9 | Register/login → Buyer request publish → Provider profile complete → Provider matches görür → Provider offer verir → Buyer etiketli teklifleri görür |
| **Demo 2 (kontrol)** | 10 → 12 | Admin listeler + ödeme davranışı |

---

## Sıradaki adım (istersen)

- **Migration dosyası sıralaması** — Hangi tablo hangi sırayla oluşturulmalı (FK bağımlılıkları).
- **Minimum seed** — roles, cities (ve gerekirse districts) listesi.

---

*API: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md). Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md).*
