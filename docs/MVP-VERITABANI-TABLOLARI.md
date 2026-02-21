# MVP için veritabanı tabloları — kesin liste

Minimum ama vizyonu bozmayan (rol ayrımı, bütçe gizliliği, denetim izi) tablolar. Bu listeyle MVP çekirdek akışı uçtan uca çalışır: **Kayıt → Rol → Talep → Eşleşme → Teklif → Admin listeleme**.

**MVP tablo sayısı: 8**

---

## 1. companies

**Amaç:** Sistemdeki tüm firmalar (alıcı / sağlayıcı).

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| company_name | string | |
| tax_number | string | unique |
| role | ENUM | **BUYER** / **PROVIDER** — kritik ayrım |
| city, district | string | Min lokasyon |
| status | ENUM | ACTIVE / PENDING / SUSPENDED |
| created_at, updated_at | timestamp | |

MVP’de en sade hali: `companies.role`. Admin ayrı yaklaşım: `users.user_role = ADMIN`.

---

## 2. users

**Amaç:** Giriş yapan kullanıcı hesapları (firma yetkilisi veya admin).

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| company_id | FK | → companies.id (admin için null veya ayrı mantık) |
| full_name | string | |
| email | string | unique |
| phone | string | |
| password_hash | string | (veya harici auth uid) |
| user_role | ENUM | **COMPANY_USER** / **ADMIN** — admin panel için kritik |
| status | ENUM | ACTIVE / LOCKED |
| last_login_at | timestamp | |
| created_at, updated_at | timestamp | |

Admin panel güvenliği: `user_role = ADMIN` şart.

---

## 3. provider_profiles

**Amaç:** Sağlayıcının teklif verebilmesi için gerekli minimum profil.

| Alan | Tip | Açıklama |
|------|-----|----------|
| company_id | PK, FK | → companies.id |
| service_cities | json/text | Hizmet verilen şehirler |
| capacity_max_staff | int | |
| service_types | json/text | Fiziki, etkinlik, mobil vb. |
| profile_completed | bool | Teklif verebilir kilidi |
| created_at, updated_at | timestamp | |

MVP’de “profil tamam” kuralı buradan kilitlenir. (İleride min/max iş büyüklüğü eşleştirme için eklenebilir.)

---

## 4. requests

**Amaç:** Alıcı talebi — platformun kalbi.

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| buyer_company_id | FK | → companies.id |
| service_type | enum/text | |
| service_model | enum/text | 24/7, vardiya, saatlik |
| start_date | date | |
| contract_duration_months | int | opsiyonel |
| city, district | string | |
| site_type | enum/text | AVM, ofis, fabrika, site |
| location_point_count | int | |
| required_staff_count | int | |
| armed_required | bool | |
| requirements_note | text | opsiyonel |
| status | ENUM | DRAFT / PUBLISHED / CLOSED / CANCELLED |
| created_at, published_at | timestamp | |

**Bütçe bu tabloda yok** — ayrı tabloda (request_budget_private).

---

## 5. request_budget_private

**Amaç:** Bütçeyi gizli tutmak (vizyon için kritik).

| Alan | Tip | Açıklama |
|------|-----|----------|
| request_id | PK, FK | → requests.id |
| budget_min | decimal | |
| budget_max | decimal | |
| currency | string | TRY |
| created_at | timestamp | |

- Sağlayıcı sorgularında **hiç join edilmez**.
- Admin’de bile yetkiye göre gösterilebilir.
- Eşleştirme algoritması sadece “uygundur / uygun değildir” üretir; tutar sağlayıcıya gitmez.

---

## 6. offers

**Amaç:** Sağlayıcının talebe verdiği teklif.

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| request_id | FK | → requests.id |
| provider_company_id | FK | → companies.id |
| monthly_price | decimal | MVP’de gerekli; alıcıya bütçe gösterilmez, sadece teklif tutarı |
| proposal_text | text | |
| status | ENUM | SENT / VIEWED / SHORTLISTED / AWARDED / REJECTED |
| created_at, updated_at | timestamp | |

Sağlayıcı teklif verir; alıcı teklifleri görür/değerlendirir; admin sayıları izler.

---

## 7. admin_notes

**Amaç:** Admin’in firmaya / talebe / teklife not bırakması.

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| entity_type | ENUM | COMPANY / REQUEST / OFFER |
| entity_id | uuid/int | |
| note_text | text | |
| created_by_admin_user_id | FK | → users.id |
| created_at | timestamp | |

MVP’de basit; denetim ve iletişim için yeterli.

---

## 8. audit_logs

**Amaç:** Kritik aksiyonları izlemek (pasife alma, yayınlama, onay vb.).

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | PK | |
| actor_user_id | FK | → users.id |
| action | text/enum | COMPANY_SUSPEND, REQUEST_PUBLISH, vb. |
| entity_type, entity_id | | |
| metadata | json | opsiyonel |
| created_at | timestamp | |

MVP’de zorunlu değil ama B2B güvenlik alanında önerilir; “kim ne yaptı?” sorusu için.

---

## MVP’de şimdilik olmayan (v2’ye bırakılan)

| Tablo / konu | Açıklama |
|--------------|----------|
| documents | Belge yükleme / inceleme kuyruğu |
| messages | Chat |
| ratings / reviews | Puanlama, yorum |
| payments / subscriptions | Komisyon, üyelik |
| shortlists | Alıcı short-list (ayrı tablo) |
| notifications | Bildirim merkezi |

---

## Vizyon kontrolü

| Kural | Nasıl korunuyor |
|------|------------------|
| **Bütçe gizliliği** | `request_budget_private` ayrı tablo; sağlayıcı sorgularında join yok. |
| **Rol ayrımı** | `companies.role` + `users.user_role` (ADMIN). |
| **İhaleleşme riski** | Bütçe sağlayıcıya görünmediği için düşüyor. |

---

## Özet: 8 tablo

1. **companies** — Firma + role (BUYER/PROVIDER)  
2. **users** — Giriş + user_role (ADMIN)  
3. **provider_profiles** — Sağlayıcı profil, profil tamam kilidi  
4. **requests** — Alıcı talebi (bütçe hariç)  
5. **request_budget_private** — Bütçe gizli  
6. **offers** — Teklif  
7. **admin_notes** — Admin notları  
8. **audit_logs** — Aksiyon izi (önerilir)

Bu listeyle MVP uçtan uca çıkar.

---

## Sonraki adımlar (istersen)

- **Her tablo için PK/FK şeması** — İlişki diyagramı, zorunlu foreign key’ler.
- **Index önerileri** — Özellikle `requests`, `offers` (filtreleme, liste sorguları).
- **MVP için 8 API endpoint** — register, login, request oluşturma, offer, admin listeleri.
