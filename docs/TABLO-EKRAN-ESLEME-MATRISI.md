# MVP Tablo–Ekran Eşleme Matrisi (Final)

**Amaç:** Kodlamada “hangi ekran hangi tabloyu okur/yazar?”ı kilitler; yanlış veri akışını engeller. Backend’de zorunlu kontroller buradan türetilir.

**Referans şema:** [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md). **Ekran listesi:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md).

---

## 1️⃣ Landing Page

- **READ:** —
- **WRITE:** —
- **Not:** Public statik.

---

## 2️⃣ Rol Seçimi (Register – Buyer/Provider)

- **READ:** —
- **WRITE:** —
- **Not:** Sadece navigasyon.

---

## 3️⃣ Alıcı Kayıt

- **WRITE:** users, organizations (org_type=BUYER), organization_users, user_roles (BUYER_USER)
- **Kritik kurallar:** email unique; tax_id unique.

---

## 4️⃣ Sağlayıcı Kayıt

- **WRITE:** users, organizations (org_type=PROVIDER), organization_users, user_roles (PROVIDER_USER); (opsiyonel) provider_profiles (minimum boş profil)
- **Kritik kurallar:** Faaliyet izni “yok” kayda izin verir; profil/teklif kilidi ileride devreye girer.

---

## 5️⃣ Login (User)

- **READ:** users, user_roles, organizations + organization_users
- **WRITE:** users.last_login_at, audit_logs (action=USER_LOGIN)
- **Kritik kurallar:** Rol sistemden okunur; UI rol sormaz.

---

## 6️⃣ Alıcı Dashboard

- **READ:** requests (buyer_org_id = current), offers (request_id in buyer requests; alıcıya sadece etiketler), (opsiyonel) risk_flags (buyer seviyesinde özet)
- **WRITE:** —
- **Kritik kurallar:** Alıcıya offers.monthly_offer_try gösterilmez.

---

## 7️⃣ Talep Oluşturma (Buyer – Create Request)

- **READ:** cities, districts (dropdown); (opsiyonel) organizations (buyer bilgisi)
- **WRITE:** requests (draft/publish), audit_logs (REQUEST_CREATED / REQUEST_PUBLISHED); (opsiyonel) admin_reviews (queue_type=REQUEST_PUBLISH eğer riskli alıcıysa)
- **Kritik kurallar:** budget_min_try ≤ budget_max_try; silahlı ⇒ GUN_LICENSE zorunlu; alt yüklenici var ⇒ oran zorunlu; **requires_salary_sgk_tax_on_time** zorunlu true.

---

## 8️⃣ Talep Detayı (Buyer)

- **READ:** requests, offers (alıcıya etiketler + uygunluk; ham fiyat yok), (opsiyonel) request_matches; risk_flags talep/teklif özetleri **sadece admin** görür, alıcıya değil
- **WRITE:** (opsiyonel) requests.status (CLOSE vb.), audit_logs (REQUEST_VIEWED)
- **Kritik kurallar:** Alıcı teklifte yalnız budget_fit_band, compliance_fit_band, risk_band vb. görür.

---

## 9️⃣ Sağlayıcı Dashboard

- **READ:** provider_profiles (completion %), request_matches (provider_org_id), requests (match edilen), offers (provider_org_id), engagements (ACTIVE), payment_reports (son bildirimler)
- **WRITE:** (opsiyonel) audit_logs (DASHBOARD_VIEW)
- **Kritik kurallar:** Profil %100 değilse “Teklif Ver” disabled.

---

## 🔟 Sağlayıcı Profil & Profil Tamamlama

- **READ:** provider_profiles, provider_service_areas, cities
- **WRITE:** provider_profiles, provider_service_areas, audit_logs (PROFILE_UPDATED)
- **Kritik kurallar:** **pays_salary_sgk_tax_on_time** zorunlu (true/false; boş olamaz). Profil completion % backend hesaplanır.

---

## 1️⃣1️⃣ Uygun Talepler Listesi (Provider)

- **READ:** request_matches (VISIBLE), requests (özet alanlar), provider_profiles (kısıtlar)
- **WRITE:** —
- **Kritik kurallar:** budget_fit_band = OUT olanlar default görünmez (match_status=HIDDEN/BLOCKED).

---

## 1️⃣2️⃣ Talep Detayı (Provider) + Teklif Verme

- **READ:** requests (adres vb. hassas alanlar UI’da maskelenebilir; DB’de var), request_matches (fit ikonları), provider_profiles, offers (varsa mevcut teklif)
- **WRITE:** offers (SUBMITTED), audit_logs (OFFER_SUBMITTED)
- **Kritik kurallar:** Profil %100 değilse teklif yazdırma; **provider_salary_sgk_tax_on_time_declared** zorunlu true; budget_fit_band=OUT ise teklif kabul etme (backend).

---

## 1️⃣3️⃣ Admin Login & Yetkilendirme

- **READ:** users, user_roles
- **WRITE:** users.last_login_at, audit_logs (ADMIN_LOGIN)
- **Kritik kurallar:** Admin login route’u sadece admin role’leri kabul eder.

---

## 1️⃣4️⃣ Admin Dashboard

- **READ:** requests (count by status), offers (count by status, too low patterns), organizations (buyer/provider stats), risk_flags (OPEN, severity), admin_reviews (OPEN queues), payment_reports + payment_report_reviews (kritik), audit_logs (recent)
- **WRITE:** —
- **Kritik kurallar:** RBAC; örn. RISK admin ödeme modülünü görür, SUPPORT görmez.

---

## 1️⃣5️⃣ Admin Liste & İnceleme Ekranları

### 15A Talepler

- **READ:** requests, offers (aggregate), risk_flags, admin_reviews
- **WRITE:** requests.status, admin_reviews.status, audit_logs, risk_flags (resolve)

### 15B Teklifler

- **READ:** offers, requests, risk_flags
- **WRITE:** offers.status (HIDDEN/REJECTED), risk_flags, audit_logs

### 15C Alıcılar

- **READ:** organizations (BUYER), requests, engagements, payment_reports, payment_report_reviews, risk_flags
- **WRITE:** organizations.status / limit flags (opsiyonel), audit_logs, admin_reviews

### 15D Sağlayıcılar

- **READ:** organizations (PROVIDER), provider_profiles, offers, risk_flags, payment_reports
- **WRITE:** organizations.status, risk_flags, audit_logs, admin_reviews

---

## Otomatik çalışan backend işleri (job/cron)

Bunlar UI ekranı değil; veri akışını tamamlar.

| İş | Input | Output | Not |
|----|--------|--------|-----|
| **Matching job** | requests(PUBLISHED) + provider_profiles | request_matches; match_status (VISIBLE/HIDDEN/BLOCKED) | Talep yayınlandığında / sağlayıcı profil güncellendiğinde |
| **Budget fit hesaplama** | offers.monthly_offer_try, requests.budget_min/max | offers.budget_fit_band, request_matches.budget_fit_band | Teklif submit / talep güncelleme |
| **Risk flag üretimi** | Aşırı düşük teklif (istatistik); ödenmedi 90+ (payment_reports + review) | risk_flags; gerekirse admin_reviews | Periyodik veya event-driven |
| **Engagement yaratma** | Offer ACCEPTED | engagements | Offer status değişince |

---

## Sıradaki adım

Bu matris ile **API Sözleşmesi** (endpoint listesi + request/response + RBAC) türetilir.

*Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md). API sözleşmesi: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md).*
