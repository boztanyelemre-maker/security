# MVP — Final veritabanı şeması (kodlama başlangıcı)

**Amaç:** Kodlamanın tek referansı. Buyer / Provider / Request / Offer / Compliance sinyali / Ödeme davranışı / Admin audit tek dokümanda.

**Referanslar:** [MVP-VERITABANI-TABLOLARI.md](MVP-VERITABANI-TABLOLARI.md), [ODEME-METRIKLERI-KAYNAKLARI.md](ODEME-METRIKLERI-KAYNAKLARI.md), [SGK-URET-VERGISI-ZORUNLU-KRITER.md](SGK-URET-VERGISI-ZORUNLU-KRITER.md), [FIGMA-BRIEF-15-ADMIN-LISTE-INCELEME.md](FIGMA-BRIEF-15-ADMIN-LISTE-INCELEME.md).

**Tablo sayısı:** 9 (mevcut 8 + ödeme davranışı için 1).

---

## Özet tablo listesi

| # | Tablo | Amaç |
|---|--------|------|
| 1 | companies | Firma + rol (BUYER/PROVIDER) + risk seviyesi |
| 2 | users | Giriş + user_role (ADMIN / COMPANY_USER) |
| 3 | provider_profiles | Sağlayıcı profil + “profil tamam” kilidi |
| 4 | requests | Talep (bütçe hariç) + vade beyanı + durum |
| 5 | request_budget_private | Bütçe gizli (sağlayıcıya join yok) |
| 6 | offers | Teklif + SGK beyanı + aşırı düşük flag + admin gizleme |
| 7 | provider_payment_feedback | Sağlayıcı ödeme durumu bildirimi + admin çözümü |
| 8 | admin_notes | Admin notu (talep/teklif/firma) |
| 9 | audit_logs | Aksiyon izi (kim ne yaptı) |

---

## 1. companies

Sistemdeki tüm firmalar (alıcı / sağlayıcı). Admin ayrı: `users.user_role = ADMIN`.

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK (uuid veya bigint) | |
| company_name | string | Firma ünvanı |
| tax_number | string | Unique, VKN |
| role | ENUM | **BUYER** \| **PROVIDER** |
| city | string | |
| district | string | |
| status | ENUM | ACTIVE \| PENDING \| SUSPENDED |
| risk_level | ENUM | **NORMAL** \| WATCH \| CRITICAL — Admin listeleri, eşleştirme |
| created_at | timestamp | |
| updated_at | timestamp | |

**Index:** `role`, `status`, `risk_level`, `tax_number` (unique).

---

## 2. users

Giriş yapan kullanıcı (firma yetkilisi veya admin).

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| company_id | FK (nullable) | → companies.id (admin için null) |
| full_name | string | |
| email | string | Unique |
| phone | string | |
| password_hash | string | |
| user_role | ENUM | **COMPANY_USER** \| **ADMIN** |
| status | ENUM | ACTIVE \| LOCKED |
| last_login_at | timestamp (nullable) | |
| created_at | timestamp | |
| updated_at | timestamp | |

Admin panel: `user_role = ADMIN` şart. `company_id` admin için null olabilir.

---

## 3. provider_profiles

Sağlayıcının teklif verebilmesi için minimum profil.

| Alan | Tip | Açıklama |
|------|-----|----------|
| company_id | PK, FK | → companies.id |
| service_cities | json veya text | Hizmet verilen şehirler |
| capacity_max_staff | int | |
| service_types | json veya text | Fiziki, etkinlik, mobil vb. |
| profile_completed | boolean | Teklif verebilir kilidi |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## 4. requests

Alıcı talebi. Bütçe bu tabloda yok → request_budget_private.

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| buyer_company_id | FK | → companies.id |
| service_type | enum/text | |
| service_model | enum/text | 24/7, vardiya, saatlik |
| start_date | date | |
| contract_duration_months | int (nullable) | |
| city | string | |
| district | string | |
| site_type | enum/text | AVM, ofis, fabrika, site |
| location_point_count | int | |
| required_staff_count | int | |
| armed_required | boolean | |
| requirements_note | text (nullable) | |
| payment_terms_days | int (nullable) | **30 \| 45 \| 60 \| 90** — alıcı vade beyanı (sağlayıcıya etiket) |
| status | ENUM | DRAFT \| PUBLISHED \| **UNDER_REVIEW** \| **SUSPENDED** \| CLOSED \| CANCELLED |
| created_at | timestamp | |
| published_at | timestamp (nullable) | |

**Index:** `buyer_company_id`, `status`, `city`, `published_at`.

---

## 5. request_budget_private

Bütçe gizli. Sağlayıcı sorgularında **hiç join edilmez**.

| Alan | Tip | Açıklama |
|------|-----|----------|
| request_id | PK, FK | → requests.id |
| budget_min | decimal | |
| budget_max | decimal | |
| currency | string | TRY |
| created_at | timestamp | |

---

## 6. offers

Sağlayıcının talebe verdiği teklif. Fiyat admin’de; alıcıya bütçe gösterilmez, sadece teklif tutarı (ve etiketler).

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| request_id | FK | → requests.id |
| provider_company_id | FK | → companies.id |
| monthly_price | decimal | Ham fiyat (admin listelerinde) |
| proposal_text | text (nullable) | |
| sgk_tax_declared_at | timestamp (nullable) | SGK + ücret vergisi beyanı (audit için) |
| very_low_price_flag | boolean | Aşırı düşük teklif (sistem veya admin) |
| hidden_from_buyer | boolean | Admin “alıcıdan gizle” — alıcı görmez |
| status | ENUM | SENT \| VIEWED \| SHORTLISTED \| AWARDED \| REJECTED \| **ADMIN_REJECTED** |
| created_at | timestamp | |
| updated_at | timestamp | |

**Index:** `request_id`, `provider_company_id`, `status`.

---

## 7. provider_payment_feedback *(yeni)*

Sağlayıcının “ödeme durumu” bildirimi. Geç ödeme / ödenmeyen iş metrikleri buradan + admin onayı ile türetilir.

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| request_id | FK | → requests.id (iş/talep) |
| provider_company_id | FK | → companies.id |
| buyer_company_id | FK | → companies.id |
| feedback_type | ENUM | **PAID_ON_TIME** \| **PAID_LATE** \| **NOT_PAID** |
| admin_resolved_at | timestamp (nullable) | Admin karar tarihi |
| admin_resolution | ENUM (nullable) | **APPROVED** \| REJECTED \| PENDING |
| created_at | timestamp | |

**Kural:** Geç ödeme sayısı = `PAID_LATE` + `admin_resolution = APPROVED`. Ödenmeyen iş = `NOT_PAID` + çoklu bildirim + süre + admin onayı. Tekil beyan tek başına yeterli değil.

---

## 8. admin_notes

Admin’in firmaya / talebe / teklife not bırakması.

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| entity_type | ENUM | COMPANY \| REQUEST \| OFFER |
| entity_id | uuid/int | İlgili kayıt id |
| note_text | text | |
| created_by_admin_user_id | FK | → users.id |
| created_at | timestamp | |

---

## 9. audit_logs

Kritik aksiyonların izi (pasife alma, yayınlama, onay, red, gizleme).

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| actor_user_id | FK | → users.id |
| action | string/enum | COMPANY_SUSPEND, REQUEST_PUBLISH, OFFER_HIDE, PAYMENT_FEEDBACK_APPROVE, vb. |
| entity_type | string | company, request, offer, provider_payment_feedback |
| entity_id | string/int | |
| reason | string (nullable) | Pasife alma / red sebebi (sabit liste önerilir) |
| metadata | json (nullable) | |
| created_at | timestamp | |

**Pasife alma / red:** `reason` zorunlu; sabit değerler: Sahte kayıt, Uygunsuz kullanım, Ödeme uyuşmazlığı, Spam, Diğer.

---

## İlişki özeti (ER kısa)

```
companies (role BUYER|PROVIDER, risk_level)
  ├── users (company_id; user_role ADMIN|COMPANY_USER)
  ├── provider_profiles (company_id) [PROVIDER]
  ├── requests (buyer_company_id) [BUYER]
  │     ├── request_budget_private (request_id)
  │     └── offers (request_id, provider_company_id)
  │           └── sgk_tax_declared_at, very_low_price_flag, hidden_from_buyer
  └── provider_payment_feedback (buyer_company_id, provider_company_id, request_id)
        └── admin_resolution → metrik (geç ödeme / ödenmeyen iş)

admin_notes (entity_type, entity_id)  ·  audit_logs (actor_user_id, action, entity_type, entity_id)
```

---

## Vizyon kontrolleri (şemada nasıl korunuyor)

| Kural | Nasıl |
|-------|--------|
| Bütçe gizliliği | `request_budget_private` ayrı tablo; sağlayıcı/listing sorgularında join yok. |
| Rol ayrımı | `companies.role` + `users.user_role` (ADMIN). |
| Ödeme metrikleri | `provider_payment_feedback` + `admin_resolution`; tek bildirim yetmez. |
| SGK/ücret beyanı | `offers.sgk_tax_declared_at`; audit’e yazılır; sayı/belge saklanmaz. |
| Risk | `companies.risk_level`; `offers.very_low_price_flag`; talep riski sorgu/uygulama ile türetilir. |
| Alıcıya veri sızmaması | Reddedilen/gizlenen teklif: `offers.hidden_from_buyer` veya `status = ADMIN_REJECTED`; alıcı listesinde filtrelenir. |

---

## MVP’de şimdilik olmayan (v2)

- documents (belge yükleme)
- messages / chat
- ratings, reviews
- payments, subscriptions
- shortlists (ayrı tablo; alıcı short-list)
- notifications

---

## Sonraki adım

Bu şema ile **API sözleşmesi** (endpoint listesi + request/response örnekleri) yazılabilir; ardından auth (RBAC) ve MVP çekirdek akışların kodlaması gelir.

*Güncel durum: [DURUM-OZET.md](DURUM-OZET.md). API şablonu: [API-KONTRAT-SABLONU.md](API-KONTRAT-SABLONU.md).*
