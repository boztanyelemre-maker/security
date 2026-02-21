# Migration DDL — SQLite (DB Browser for SQLite uyumlu)

**Amaç:** Lokal MVP geliştirme ve DB Browser for SQLite ile şemayı ayağa kaldırmak. Production için PostgreSQL migration’ları kullanın.

---

## PostgreSQL vs SQLite farkları (bu sette)

| Özellik | PostgreSQL | SQLite (bu set) |
|---------|------------|------------------|
| UUID | `gen_random_uuid()` | `id TEXT` — uygulama üretir |
| Array (TEXT[]) | `TEXT[]`, GIN index | `TEXT` (JSON string, örn. `'["A","B"]'`) |
| JSON | `JSONB` | `TEXT` |
| Boolean | `BOOLEAN` | `INTEGER` (0/1) |
| Serial | `BIGSERIAL` | `INTEGER PRIMARY KEY AUTOINCREMENT` |
| Zaman | `TIMESTAMPTZ`, `NOW()` | `TEXT`, `datetime('now')` |

Kuralların büyük kısmı **backend’de** kontrol edilmeli (CHECK’ler SQLite’ta zayıf).

---

## Çalıştırma sırası

```
M00_extensions.sql   (no-op)
M01_lookup.sql
M02_auth.sql
M03_organizations.sql
M04_provider_profiles.sql
M05_requests.sql
M06_request_matches.sql
M07_offers.sql
M08_engagements_payment.sql
M09_risk_admin_audit.sql
```

Sonra: **Seed** — [../../seed/minimum-seed-sqlite.sql](../../seed/minimum-seed-sqlite.sql)

---

## DB Browser for SQLite ile

1. **Execute SQL** sekmesini aç.
2. Sırayla her `Mxx_....sql` dosyasını açıp **Execute** (Play) ile çalıştır.
3. Tüm migration’lar bittikten sonra `minimum-seed-sqlite.sql` dosyasını çalıştır.

Veya tek dosyada birleştirip tek seferde çalıştırabilirsin (M00 → M09 → seed).

---

## Uygulama tarafında

- **UUID:** Her INSERT öncesi uygulama `id` üretmeli (örn. dil kütüphanesi: uuid v4).
- **Array alanlar:** Kayıt: `["UNARMED","MOBILE_PATROL"]` → JSON string olarak yaz. Okuma: string’i parse et.
- **Boolean:** 0 = false, 1 = true.
- **Tarih:** ISO 8601 string (`datetime('now')` zaten buna uygun).

---

## Ne zaman PostgreSQL’e geçmeli?

- Çoklu kullanıcı / eşzamanlı yazma
- Production / staging
- Eşleşme job’ları ve yoğun admin işlemleri

PostgreSQL migration’ları: [../README.md](../README.md) (ana `migrations/` klasörü).

---

*Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](../../MVP-DB-SCHEMA-FINAL-POSTGRES.md). Seed: [minimum-seed-sqlite.sql](../../seed/minimum-seed-sqlite.sql).*
