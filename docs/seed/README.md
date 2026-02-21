# Seed verileri (MVP)

**PostgreSQL:** `minimum-seed.sql`  
**SQLite:** `minimum-seed-sqlite.sql` (DB Browser for SQLite ile kullanım için)

**İçerik:** roles (6), cities (8 pilot), districts (5 – İstanbul), süper admin (opsiyonel; hash placeholder).

## Ne zaman çalıştırılır?

Migration’lar **M01** (cities, districts) ve **M02** (users, roles, user_roles) çalıştıktan sonra. Tabloların var olduğunu varsayar.

## Nasıl çalıştırılır?

```bash
psql -U postgres -d <veritabani_adi> -f docs/seed/minimum-seed.sql
```

Veya migration aracınız (Flyway, Liquibase, Prisma seed, vb.) aynı SQL’i çalıştırabilir.

## Tablo beklentileri (migration’da olmalı)

- **roles:** `code` UNIQUE (ON CONFLICT (code) DO NOTHING).
- **cities:** `id` PRIMARY KEY (sabit id ile pilot şehirler).
- **districts:** `(city_id, name)` UNIQUE.
- **users:** `email` UNIQUE; `id` UUID (gen_random_uuid() kullanılıyor).
- **user_roles:** `(user_id, role_id)` UNIQUE veya PK.

## ID / veri stratejisi

- **roles:** id migration’da SERIAL/IDENTITY; script sadece `code`, `name` veriyor.
- **cities:** 1, 6, 7, 16, 34, 35, 41, 48 (Adana, Ankara, Antalya, Bursa, İstanbul, İzmir, Kocaeli, Muğla).
- **districts:** Sadece İstanbul (34) için 5 ilçe; id vermeden `(city_id, name)`.

## Süper admin

- Script içinde admin user + user_roles (ADMIN_SUPER) + audit_logs kaydı var.
- **Şifre:** `$2b$12$REPLACE_WITH_BCRYPT_HASH` — uygulamada bcrypt ile üretip bu metni değiştir; veya ilk login öncesi bir setup komutu ile hash’i env’den alıp güncelle.

## Kontrol sorguları

Dosya sonunda yorum satırında: roller, şehirler, admin–rol bağlantısı için örnek SELECT’ler.

---

## SQLite seed (`minimum-seed-sqlite.sql`)

- `INSERT OR IGNORE` kullanır (ON CONFLICT yerine).
- Süper admin için sabit id: `seed-admin-user-id` (SQLite’ta gen_random_uuid() olmadığı için).
- Migration’lar: [docs/migrations/sqlite/](../migrations/sqlite/README.md) çalıştırıldıktan sonra bu dosyayı çalıştır.

*Üst dizin: [MIGRATION-SIRASI-VE-SEED.md](../MIGRATION-SIRASI-VE-SEED.md).*
