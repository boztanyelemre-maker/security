# Migration Sıralaması & Minimum Seed (Final / MVP)

**Amaç:** FK bağımlılıklarını kırmadan tabloların tek seferde ayağa kalkması; kurulumda zorunlu seed verileri.

**Referans:** [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md), [KODLAMA-SIRASI-BACKEND.md](KODLAMA-SIRASI-BACKEND.md).

---

## Migration sıralaması

Sıra, bağımlılıklara göre. Önce bağımsız tablolar, sonra FK ile bağlı olanlar.

---

### M00 — Altyapı

**Extensions (PostgreSQL öneri):**

- `uuid-ossp` veya `pgcrypto` (uuid üretimi için)
- (Opsiyonel) `citext` (email case-insensitive için)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "citext";
```

---

### M01 — Lookup / Sözlük

| Sıra | Tablo | FK | Sebep |
|------|--------|-----|-------|
| 1 | **cities** | — | Register ve formlar dropdown ister |
| 2 | **districts** | → cities.id | İlçe il'e bağlı |

---

### M02 — Kimlik & Yetki

| Sıra | Tablo | FK | Sebep |
|------|--------|-----|-------|
| 1 | **users** | — | Login/register + RBAC en temel |
| 2 | **roles** | — | Rol kodları (BUYER_USER, ADMIN_*, vb.) |
| 3 | **user_roles** | → users.id, roles.id | Kullanıcı–rol ilişkisi |

---

### M03 — Firma modeli

| Sıra | Tablo | FK | Sebep |
|------|--------|-----|-------|
| 1 | **organizations** | → cities.id, districts.id (hq) | Kullanıcıyı firmaya bağlamadan ürün akışı yok |
| 2 | **organization_users** | → organizations.id, users.id | Firma–kullanıcı bağlantısı |

---

### M04 — Sağlayıcı profili

| Sıra | Tablo | FK | Sebep |
|------|--------|-----|-------|
| 1 | **provider_profiles** | PK/FK → organizations.id | Matching için provider profil verisi şart |
| 2 | **provider_service_areas** | → organizations.id, cities.id | Hizmet verilen şehirler |

---

### M05 — Talep

| Sıra | Tablo | FK | Sebep |
|------|--------|-----|-------|
| 1 | **requests** | → organizations (buyer), cities, districts | Ürün kalbi; teklif ve match bunun üstüne |

---

### M06 — Eşleşme

| Sıra | Tablo | FK | Sebep |
|------|--------|-----|-------|
| 1 | **request_matches** | → requests.id, organizations.id (provider) | “Uygun talepler listesi” bu tablodan beslenir |

---

### M07 — Teklif

| Sıra | Tablo | FK | Sebep |
|------|--------|-----|-------|
| 1 | **offers** | → requests.id, organizations.id (provider) | Teklif ver / etiketli gösterim |

---

### M08 — İş (Engagement) + Ödeme davranışı

| Sıra | Tablo | FK | Sebep |
|------|--------|-----|-------|
| 1 | **engagements** | → requests, offers, buyer_org_id, provider_org_id | Aktif iş (offer ACCEPTED) |
| 2 | **payment_reports** | → engagements.id | “Ödeme Durumu Bildir” |
| 3 | **payment_report_reviews** | → payment_reports.id, users.id (admin) | Admin inceleme kararı |

---

### M09 — Risk & İnceleme & Audit

| Sıra | Tablo | FK | Sebep |
|------|--------|-----|-------|
| 1 | **risk_flags** | (entity_type, entity_id) | Admin kontrol merkezi |
| 2 | **admin_reviews** | → users.id (assigned_admin) | İnceleme kuyruğu |
| 3 | **admin_notes** | → users.id (created_by) | Admin notu (firma/talep/teklif) |
| 4 | **audit_logs** | → users.id (actor, opsiyonel) | İzlenebilir kararlar |

---

## İndeks / Constraint checklist (migration sırasında ekle)

| Nerede | Ne |
|--------|-----|
| users | `email` UNIQUE |
| organizations | `tax_id` UNIQUE |
| offers | UNIQUE(request_id, provider_org_id) |
| request_matches | UNIQUE(request_id, provider_org_id) |
| provider_service_areas | PK(organization_id, city_id) |
| requests | CHECK(budget_min_try <= budget_max_try) |

---

# Minimum Seed (Kurulumda zorunlu)

## 1) roles (mutlaka)

Aşağıdaki kodlar migration veya seed script ile eklenmeli:

| code | Açıklama |
|------|----------|
| BUYER_USER | Alıcı firma kullanıcısı |
| PROVIDER_USER | Sağlayıcı firma kullanıcısı |
| ADMIN_SUPER | Süper admin |
| ADMIN_OPS | Operasyon admin |
| ADMIN_RISK | Risk / ödeme admin |
| ADMIN_SUPPORT | Destek admin |

---

## 2) cities ve districts

**MVP için iki seçenek:**

| Seçenek | Açıklama |
|---------|----------|
| **A – Hızlı MVP seed** | Sadece pilot şehirler: İstanbul (34), Ankara (6), İzmir (35) … (pilot kapsamına göre). District’leri sonradan ekleyebilirsin (district nullable kalır). |
| **B – Tam TR seed** | 81 il + ilçeler. Daha doğru ama yük; prod’da ideal. |

---

## 3) İlk Super Admin kullanıcı (opsiyonel ama pratik)

- `users` içine 1 admin user
- `user_roles` ile ADMIN_SUPER
- audit_logs gerekmez (ilk login ile oluşur)

**Not:** Bunu migration’da değil **setup script** ile yapmak daha temiz (şifre env’den veya tek seferlik komutla).

---

## Seed script (hazır)

**SQL:** [docs/seed/minimum-seed.sql](seed/minimum-seed.sql)

- **roles:** 6 kayıt (BUYER_USER, PROVIDER_USER, ADMIN_SUPER, ADMIN_OPS, ADMIN_RISK, ADMIN_SUPPORT).
- **cities:** 3 pilot (İstanbul 34, Ankara 6, İzmir 35).
- **districts:** Pilot ilçeler (İstanbul 5, Ankara 3, İzmir 3).
- **Süper admin:** Yorum satırında örnek; gerçek kurulum setup script ile (şifre hash backend’de üretilmeli).

Çalıştırma: Migration’lar (M01, M02) sonrası `psql -d <db> -f docs/seed/minimum-seed.sql`. Ayrıntı: [docs/seed/README.md](seed/README.md).

---

## Migration DDL (hazır)

### PostgreSQL (production / staging)

**Klasör:** [docs/migrations/](migrations/README.md)

- **M00** — pgcrypto
- **M01** – **M09** — (yukarıdaki tablo listesi)
- Çalıştırma: M00 → … → M09, sonra [seed/minimum-seed.sql](seed/minimum-seed.sql). Smoke check: migrations/README.md.

### SQLite (lokal MVP / DB Browser for SQLite)

**Klasör:** [docs/migrations/sqlite/](migrations/sqlite/README.md)

- Aynı sıra (M00–M09); UUID → TEXT, array → TEXT (JSON), JSONB → TEXT, GIN index yok.
- **Seed:** [docs/seed/minimum-seed-sqlite.sql](seed/minimum-seed-sqlite.sql) (`INSERT OR IGNORE`, sabit admin id).
- DB Browser’da sırayla her `.sql` dosyasını Execute ile çalıştır; sonra seed.
- Detay ve fark tablosu: [migrations/sqlite/README.md](migrations/sqlite/README.md).

---

## Sonraki adım (istersen)

- **ERD / DB diagram** — Tablo ilişkileri tek sayfada; geliştirici handoff.
- **Minimum test datası** — register → login → request publish → match → offer submit (SQL).

---

*Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](MVP-DB-SCHEMA-FINAL-POSTGRES.md). Kodlama sırası: [KODLAMA-SIRASI-BACKEND.md](KODLAMA-SIRASI-BACKEND.md).*
