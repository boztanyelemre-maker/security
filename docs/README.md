# PostgreSQL ile devam — Kurulum ve çalıştırma

Bu ürün için PostgreSQL daha doğru (array/JSON, eşleşme job’ları, indeksler, eşzamanlı işlem). DB Browser for SQLite bırakılır; Postgres’e bağlanan bir araç kullanılır.

---

## 1) PostgreSQL’i kur / çalıştır

### A) Docker ile (en hızlı)

```bash
docker run --name gus-psql \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=gus_mvp \
  -p 5432:5432 \
  -d postgres:16
```

Container’ı durdurup tekrar başlatmak:

```bash
docker stop gus-psql
docker start gus-psql
```

### B) Normal kurulum

- **Windows:** [PostgreSQL installer](https://www.postgresql.org/download/windows/) + pgAdmin
- **macOS:** `brew install postgresql@16` (veya `postgresql`)
- **Linux:** `apt install postgresql postgresql-client` / `yum install postgresql-server`

---

## 2) DB’yi yönetmek için araç

| Araç | Not |
|------|-----|
| **DBeaver** | Önerilen; ücretsiz, şema görseli + sorgu + export/import |
| pgAdmin | Postgres ile gelen resmi araç |
| DataGrip | Ücretli, profesyonel |

DBeaver’da: Yeni bağlantı → PostgreSQL → Host/Port/DB/User/Password gir.

---

## 3) Migration’ları çalıştırma sırası

Sırayla (bir kez):

1. `docs/migrations/M00_extensions.sql`
2. `docs/migrations/M01_lookup.sql`
3. `docs/migrations/M02_auth.sql`
4. `docs/migrations/M03_organizations.sql`
5. `docs/migrations/M04_provider_profiles.sql`
6. `docs/migrations/M05_requests.sql`
7. `docs/migrations/M06_request_matches.sql`
8. `docs/migrations/M07_offers.sql`
9. `docs/migrations/M08_engagements_payment.sql`
10. `docs/migrations/M09_risk_admin_audit.sql`
11. **Seed:** `docs/seed/minimum-seed.sql`

DBeaver/pgAdmin’de her dosyayı açıp **Execute** ile çalıştır. Veya **tek komut (önerilen):** **[scripts/db-init-docker.sh](../scripts/db-init-docker.sh)** / **[scripts/db-init-docker.ps1](../scripts/db-init-docker.ps1)** — Docker ile container’ı başlatır, migration + seed çalıştırır (yerel psql gerekmez). Detay: [scripts/db-init.md](../scripts/db-init.md).

---

## 4) Bağlantı bilgileri (Docker örnek)

| Alan | Değer |
|------|--------|
| Host | localhost |
| Port | 5432 |
| Database | gus_mvp |
| User | postgres |
| Password | postgres |

---

## 5) Hızlı doğrulama (çalıştı mı?)

```sql
SELECT current_database(), current_user, now();

SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Roller ve admin kullanıcı:

```sql
SELECT code, name FROM roles ORDER BY code;
SELECT id, name FROM cities ORDER BY id;
SELECT u.email, r.code
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE u.email = 'admin@platform.com';
```

---

## 6) Kodlama tarafında

Postgres şemasıyla uyumlu bırakılacaklar:

- **UUID:** DB default `gen_random_uuid()`
- **Array alanlar:** `TEXT[]` (service_types, shift_patterns, required_certifications vb.)
- **Log metadata:** `JSONB`

---

## Sonraki adım (kodlama)

**Matching job:** Talep yayınlandığında `request_matches` tablosunu kimin VISIBLE/HIDDEN olacağına göre dolduran kural seti: [MATCHING-JOB-KURALLAR.md](MATCHING-JOB-KURALLAR.md). Ekran 11–12 gerçek veriyle çalışır.

---

*Migration’lar: [migrations/README.md](migrations/README.md). Seed: [seed/minimum-seed.sql](seed/minimum-seed.sql).*
