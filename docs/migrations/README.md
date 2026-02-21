# Migration DDL (PostgreSQL) — M00–M09

**Varsayım:** `id` alanlarında UUID, `gen_random_uuid()` (pgcrypto). Seed script ile uyumlu (roles.code unique, districts(city_id, name) unique).

---

## Çalıştırma sırası

```
M00_extensions.sql
M01_lookup.sql
M02_auth.sql
M03_organizations.sql
M04_provider_profiles.sql
M04b_provider_min_price.sql   (opsiyonel; M04 artık min_monthly_price_try içeriyor, mevcut DB için ALTER)
M05_requests.sql
...
M09_risk_admin_audit.sql
```

Sonra: **Seed** — [../seed/minimum-seed.sql](../seed/minimum-seed.sql) (roles + pilot cities + districts + opsiyonel super admin).

---

## Tek seferde (Unix tarzı)

```bash
cd docs/migrations
for f in M00_extensions.sql M01_lookup.sql M02_auth.sql M03_organizations.sql M04_provider_profiles.sql M04b_provider_min_price.sql M05_requests.sql M06_request_matches.sql M07_offers.sql M08_engagements_payment.sql M09_risk_admin_audit.sql; do
  psql -U postgres -d <veritabani_adi> -f "$f"
done
```

Windows PowerShell:

```powershell
cd docs\migrations
@("M00_extensions","M01_lookup","M02_auth","M03_organizations","M04_provider_profiles","M04b_provider_min_price","M05_requests","M06_request_matches","M07_offers","M08_engagements_payment","M09_risk_admin_audit") | ForEach-Object { psql -U postgres -d <veritabani_adi> -f "$_.sql" }
```

---

## Hızlı “DB hazır mı?” smoke check

```sql
-- Tablolar var mı?
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- FK'ler doğru mu?
SELECT conname, conrelid::regclass AS table_name
FROM pg_constraint
WHERE contype = 'f'
ORDER BY table_name;
```

---

## Dosya özeti

| Dosya | Tablolar |
|-------|----------|
| M00 | extensions (pgcrypto) |
| M01 | cities, districts |
| M02 | users, roles, user_roles |
| M03 | organizations, organization_users |
| M04 | provider_profiles (min_monthly_price_try dahil), provider_service_areas |
| M04b | provider_profiles.min_monthly_price_try (ALTER; zaten M04’te varsa atla) |
| M05 | requests |
| M06 | request_matches |
| M07 | offers |
| M08 | engagements, payment_reports, payment_report_reviews |
| M09 | risk_flags, admin_reviews, admin_notes, audit_logs |
| M09a | risk_flags partial unique (entity_type, entity_id, flag_type WHERE status='OPEN') — opsiyonel, idempotent TOO_LOW_OFFER |

---

*Sıra ve seed: [MIGRATION-SIRASI-VE-SEED.md](../MIGRATION-SIRASI-VE-SEED.md). Şema: [MVP-DB-SCHEMA-FINAL-POSTGRES.md](../MVP-DB-SCHEMA-FINAL-POSTGRES.md).*
