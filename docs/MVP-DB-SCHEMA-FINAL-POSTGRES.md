# MVP — Final veritabanı şeması (PostgreSQL)

**Amaç:** Kodlamanın tek referansı. 15 ekran + kuralların tamamını taşır. “Belge yükleme” yok; “beyan + admin inceleme + audit” var.

**Varsayım:** PostgreSQL (enum/lookup, jsonb, array, GIN index).

---

## Çekirdek prensip

- **Tek kullanıcı tabanı** — buyers, providers, admin aynı `users`.
- **Firma bilgisi** `organizations`; kullanıcılar firmaya `organization_users` ile bağlı.
- **Rol bazlı erişim:** `user_roles` + `roles`.
- **Talep/teklif ve uyum:** `requests`, `offers`; bütçe `requests` içinde (gizli alanlar).
- **Otomatik flag + admin inceleme:** `risk_flags`, `admin_reviews`, `audit_logs`.
- **Ödeme davranışı sinyali:** `payment_reports` (sağlayıcı bildirimi) + `payment_report_reviews` (admin kararı).

---

## 0) Enum / sabit sözlükler (mantıksal)

MVP’de DB’de **lookup tablo** önerilir (esnek). Örnek kodlar metin içinde belirtildi.

---

## 1) Kimlik ve yetkilendirme

### 1.1 users

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| email | string, unique, not null | |
| password_hash | string, not null | |
| full_name | string, not null | |
| phone | string, nullable | |
| is_active | bool, default true | |
| last_login_at | timestamp, nullable | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Index:** unique(email), (is_active).

### 1.2 roles

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| code | string, unique | BUYER_USER, PROVIDER_USER, ADMIN_SUPER, ADMIN_OPS, ADMIN_RISK, ADMIN_SUPPORT |
| name | string | |

### 1.3 user_roles

| Alan | Tip | Açıklama |
|------|-----|----------|
| user_id | FK → users | |
| role_id | FK → roles | |
| created_at | timestamp | |

**PK:** (user_id, role_id).

**Not:** Admin login ayrı URL/akış; DB aynı.

---

## 2) Firma (Alıcı / Sağlayıcı) modeli

### 2.1 organizations

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| org_type | text, not null | BUYER \| PROVIDER (MVP’de 1 firma tek tip) |
| legal_name | string, not null | |
| tax_id | string, unique, not null | VKN |
| company_type | string, nullable | AS, LTD, OTHER |
| hq_city_id | FK → cities, not null | |
| hq_district_id | FK → districts, nullable | |
| address_text | text, nullable | |
| status | text, default ACTIVE | ACTIVE, SUSPENDED, REVIEW |
| created_at | timestamp | |
| updated_at | timestamp | |

**Index:** unique(tax_id), (org_type, status).

### 2.2 organization_users

| Alan | Tip | Açıklama |
|------|-----|----------|
| organization_id | FK → organizations | |
| user_id | FK → users | |
| is_primary_contact | bool | |
| created_at | timestamp | |

**PK:** (organization_id, user_id).

---

## 3) Lokasyon sözlüğü

### 3.1 cities

| Alan | Tip |
|------|-----|
| id | PK |
| name | string |

### 3.2 districts

| Alan | Tip |
|------|-----|
| id | PK |
| city_id | FK → cities |
| name | string |

---

## 4) Sağlayıcı profil & profil tamamlama (Ekran 10)

### 4.1 provider_profiles

| Alan | Tip | Açıklama |
|------|-----|----------|
| organization_id | PK, FK → organizations | org_type = PROVIDER |
| total_personnel | int, not null | |
| armed_personnel_ratio | numeric(5,2), nullable | % |
| has_backup_staff_plan | bool, default false | |
| has_activity_license | bool, not null | |
| has_armed_authorization | bool, default false | |
| complies_5188 | bool, not null | |
| pays_salary_sgk_tax_on_time | bool, not null | ✅ Kritik şart |
| supervision_model | text, nullable | lookup |
| audit_frequency | text, nullable | lookup |
| reporting_frequency | text, nullable | lookup |
| digital_capabilities | text[], nullable | QR_PATROL, MOBILE_APP, CAMERA_INTEGRATION |
| sectors_served | text[], nullable | |
| has_large_enterprise_experience | bool, default false | |
| has_ongoing_contracts | bool, default false | |
| profile_completion_pct | int, default 0 | Backend hesaplar |
| updated_at | timestamp | |

### 4.2 provider_service_areas (önerilen join)

| Alan | Tip |
|------|-----|
| organization_id | FK → organizations |
| city_id | FK → cities |

**PK:** (organization_id, city_id). Dizi yerine join; raporlama/matching için daha sağlıklı.

---

## 5) Talep (Ekran 7) & Talep Detay (Ekran 8)

### 5.1 requests

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| buyer_org_id | FK → organizations, not null | |
| status | text | DRAFT, PUBLISHED, UNDER_REVIEW, CLOSED |
| service_types | text[], not null | ARMED, UNARMED, VIP, MOBILE_PATROL, HYBRID |
| location_mode | text, not null | SINGLE, MULTI |
| city_id | FK → cities, not null | |
| district_id | FK → districts, nullable | |
| address_text | text, not null | |
| site_type | text, not null | AVM, FACTORY, PLAZA, SITE, WAREHOUSE, HOSPITAL, SCHOOL, OTHER |
| point_count | int, not null | |
| area_sqm | int, nullable | |
| personnel_count | int, not null | |
| shift_patterns | text[], not null | H8, H12, H24, DAY, NIGHT |
| weapon_requirement | text, not null | ARMED, UNARMED |
| required_certifications | text[], not null | OGG, PSYCHOTECHNIC, GUN_LICENSE |
| contract_duration_months | int, not null | 6, 12, 24 |
| start_date | date, not null | |
| trial_period_days | int, nullable | |
| requires_5188_compliance | bool, not null, default true | |
| requires_activity_license | bool, not null, default true | |
| requires_sgk_employment_commitment | bool, not null, default true | |
| subcontracting_allowed | bool, not null | |
| subcontracting_ratio_pct | numeric(5,2), nullable | allowed=true ise zorunlu |
| requires_salary_sgk_tax_on_time | bool, not null, default true | ✅ Alıcı zorunlu şartı |
| **budget_min_try** | numeric(14,2), not null | Gizli bütçe |
| **budget_max_try** | numeric(14,2), not null | Gizli bütçe |
| min_avg_experience_years | numeric(4,1), nullable | |
| training_requirements | text[], nullable | FIRST_AID, FIRE, CRISIS |
| max_turnover_pct | numeric(5,2), nullable | |
| expected_audit_frequency | text, nullable | |
| expected_reporting_frequency | text, nullable | |
| expected_digital_capabilities | text[], nullable | |
| insurance_requirements | text[], nullable | |
| reference_requirements | text[], nullable | |
| notes | text, nullable | |
| published_at | timestamp, nullable | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Constraints:** budget_min_try ≤ budget_max_try; subcontracting_allowed = true ⇒ subcontracting_ratio_pct not null; weapon_requirement = 'ARMED' ⇒ GUN_LICENSE in required_certifications (uygulama tarafında da doğrula).

**Index:** (buyer_org_id, status), (city_id, status), GIN(service_types), GIN(shift_patterns), GIN(required_certifications).

---

## 6) Eşleşme & Uygun talepler listesi (Ekran 11)

### 6.1 request_matches

“Neden görüyorum?”un DB karşılığı.

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| request_id | FK → requests, not null | |
| provider_org_id | FK → organizations, not null | |
| match_status | text | VISIBLE, HIDDEN, BLOCKED |
| fit_location | smallint | 0 no, 1 partial, 2 yes |
| fit_capacity | smallint | |
| fit_certifications | smallint | |
| fit_salary_sgk_tax | smallint | |
| fit_operational | smallint | |
| budget_fit_band | text | IN, EDGE, OUT (rakam gösterilmez) |
| overall_fit_score | int | 0–100 (admin/algoritma; provider’a gösterilmez) |
| created_at | timestamp | |
| updated_at | timestamp | |

**Unique:** (request_id, provider_org_id). **Index:** (provider_org_id, match_status), (request_id).

---

## 7) Teklif (Ekran 12) & Alıcı teklif görümü (Ekran 8)

### 7.1 offers

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| request_id | FK → requests, not null | |
| provider_org_id | FK → organizations, not null | |
| status | text | SUBMITTED, WITHDRAWN, HIDDEN_BY_ADMIN, ACCEPTED, REJECTED |
| monthly_offer_try | numeric(14,2), not null | Admin görür; alıcıya gösterilir (bütçe değil) |
| provider_confirms_start | bool, not null | |
| provider_salary_sgk_tax_on_time_declared | bool, not null | ✅ Sağlayıcı beyanı |
| note | text, nullable | max 280 uygulamada |
| budget_fit_band | text | IN, EDGE, OUT (hesaplanmış) |
| compliance_fit_band | text | OK, PENDING, FAIL |
| risk_band | text | NORMAL, WATCH, CRITICAL |
| submitted_at | timestamp, not null | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Unique:** (request_id, provider_org_id) — 1 talebe 1 aktif teklif. **Index:** (provider_org_id, status), (request_id, status), (budget_fit_band).

---

## 8) Ödeme davranışı sinyali (Provider bildirim + Admin doğrulama)

### 8.1 engagements (“iş” kavramı)

MVP’de ödeme bildirimi için “aktif iş” = offer ACCEPTED. Offer ACCEPTED olduğunda otomatik oluşur.

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| request_id | FK → requests | |
| offer_id | FK → offers | |
| buyer_org_id | FK → organizations | |
| provider_org_id | FK → organizations | |
| status | text | ACTIVE, COMPLETED, CANCELLED |
| payment_terms_days | int, nullable | 30, 45, 60, 90 (alıcı beyanı) |
| started_at | date, nullable | |
| ended_at | date, nullable | |
| created_at | timestamp | |
| updated_at | timestamp | |

### 8.2 payment_reports (sağlayıcı bildirimi)

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| engagement_id | FK → engagements, not null | |
| buyer_org_id | FK → organizations | |
| provider_org_id | FK → organizations | |
| reported_status | text | PAID_ON_TIME, PAID_LATE, UNPAID |
| delay_band | text, nullable | 1_7, 8_30, 31_60, 60_PLUS |
| unpaid_band | text, nullable | 0_30, 31_60, 61_90, 90_PLUS |
| comment | text, nullable | |
| attestation_checked | bool, default false | UNPAID için zorunlu |
| created_at | timestamp | |

**Index:** (buyer_org_id, reported_status, created_at), (provider_org_id, created_at).

### 8.3 payment_report_reviews (admin kararı)

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| payment_report_id | FK → payment_reports, unique | |
| admin_user_id | FK → users | |
| decision | text | APPROVED, REJECTED, PENDING_MORE_SIGNAL |
| decision_note | text, not null | |
| decided_at | timestamp, not null | |

---

## 9) Risk flag & admin inceleme kuyruğu

### 9.1 risk_flags

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| entity_type | text | REQUEST, OFFER, BUYER, PROVIDER, PAYMENT_REPORT |
| entity_id | uuid, not null | |
| flag_type | text | TOO_LOW_OFFER, HIGH_SUBCONTRACT, PAYMENT_UNPAID_90P, COMPLIANCE_CONFLICT, REPEATED_LATE_PAYMENTS, vb. |
| severity | text | LOW, MEDIUM, HIGH, CRITICAL |
| status | text | OPEN, RESOLVED, DISMISSED |
| reason | text | |
| created_by | text | SYSTEM, ADMIN |
| created_at | timestamp | |
| resolved_at | timestamp, nullable | |

**Index:** (entity_type, entity_id), (severity, status).

### 9.2 admin_notes (admin notu – firma/talep/teklif)

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| entity_type | text | REQUEST, OFFER, BUYER, PROVIDER |
| entity_id | uuid, not null | |
| note_text | text, not null | |
| created_by | FK → users | |
| created_at | timestamp | |

**Index:** (entity_type, entity_id).

### 9.3 admin_reviews (genel inceleme iş akışı)

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| queue_type | text | REQUEST_PUBLISH, PROVIDER_REVIEW, PAYMENT_BEHAVIOR, RISK_CASE |
| entity_type | text | |
| entity_id | uuid | |
| status | text | OPEN, IN_PROGRESS, DONE |
| assigned_admin_user_id | FK → users, nullable | |
| priority | smallint, default 3 | 1 yüksek |
| note | text, nullable | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## 10) Audit / loglama

### 10.1 audit_logs

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK, uuid | |
| actor_user_id | FK → users, nullable | SYSTEM için null |
| actor_role | text, nullable | |
| action | text, not null | ADMIN_LOGIN, REQUEST_SUSPEND, OFFER_HIDE, PAYMENT_REPORT_APPROVE, vb. |
| entity_type | text, nullable | |
| entity_id | uuid, nullable | |
| metadata_json | jsonb, nullable | |
| created_at | timestamp | |

**Index:** (action, created_at), (entity_type, entity_id).

---

## 11) Opsiyonel: raporlama özetleri (MVP’de şart değil)

İleride performans için: buyer_risk_summary, provider_risk_summary (materialized/view).

---

## Tablo listesi (özet)

| # | Tablo | Amaç |
|---|--------|------|
| 1 | users | Tek kullanıcı tabanı |
| 2 | roles | BUYER_USER, PROVIDER_USER, ADMIN_* |
| 3 | user_roles | Kullanıcı–rol ilişkisi |
| 4 | organizations | Firma (BUYER/PROVIDER) |
| 5 | organization_users | Firma–kullanıcı ilişkisi |
| 6 | cities | Lokasyon sözlüğü |
| 7 | districts | Lokasyon sözlüğü |
| 8 | provider_profiles | Sağlayıcı profil + SGK/ücret beyanı |
| 9 | provider_service_areas | Sağlayıcı hizmet şehirleri |
| 10 | requests | Talep + gizli bütçe (budget_min/max_try) |
| 11 | request_matches | Eşleşme + fit skorları + budget_fit_band |
| 12 | offers | Teklif + SGK beyanı + bütçe/compliance/risk band |
| 13 | engagements | İş (offer ACCEPTED) |
| 14 | payment_reports | Sağlayıcı ödeme bildirimi |
| 15 | payment_report_reviews | Admin kararı (onay/red) |
| 16 | risk_flags | Otomatik/manuel risk bayrakları |
| 17 | admin_notes | Admin notu (firma/talep/teklif) |
| 18 | admin_reviews | İnceleme kuyruğu |
| 19 | audit_logs | Aksiyon izi |

---

## Vizyon kontrolü (şemada nasıl taşınır)

| Kural | Nasıl |
|-------|--------|
| Bütçe gizli | requests içinde; UI’da etiket (IN/EDGE/OUT); rakam sağlayıcıya gitmez. request_matches.budget_fit_band, offers.budget_fit_band. |
| SGK + ücret vergisi | requests.requires_salary_sgk_tax_on_time; provider_profiles.pays_salary_sgk_tax_on_time; offers.provider_salary_sgk_tax_on_time_declared. |
| Ödeme davranışı | payment_reports + payment_report_reviews (admin onayı). |
| Algoritma UI karşılığı | request_matches (fit alanları + budget_fit_band). |
| Admin inceleme | admin_reviews, risk_flags, audit_logs. |

---

**Sıradaki adım:** Tablo–ekran eşleme matrisi (hangi ekran hangi tablolara yazar/okur) → ardından API sözleşmesi.

*Eşleme matrisi: [TABLO-EKRAN-ESLEME-MATRISI.md](TABLO-EKRAN-ESLEME-MATRISI.md).*
