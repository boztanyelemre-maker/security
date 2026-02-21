# db-init — Migration + seed tek komut

PostgreSQL veritabanını sıfırdan oluşturur: M00–M09 migration’lar + minimum seed (roles, cities, districts, opsiyonel admin).

---

## Önerilen: Docker ile (psql gerekmez)

**Tek komut** — container yoksa oluşturur, varsa başlatır; migration + seed çalıştırır; smoke test yapar.

### Linux / macOS / Git Bash

```bash
chmod +x scripts/db-init-docker.sh
./scripts/db-init-docker.sh
```

### Windows PowerShell

```powershell
.\scripts\db-init-docker.ps1
```

Varsayılan: container adı `gus-psql`, DB `gus_mvp`, user/pass `postgres`. Ortam: `CONTAINER_NAME`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`.

---

## Alternatif: Yerel psql ile

PostgreSQL ve `psql` zaten kuruluysa (Docker kullanmıyorsan):

### Linux / macOS / Git Bash

```bash
chmod +x scripts/db-init.sh
./scripts/db-init.sh
```

Varsayılan bağlantı: `localhost:5432`, DB `gus_mvp`, user `postgres`, password `postgres`. Override: `PGDATABASE=my_db PGUSER=my_user PGPASSWORD=secret ./scripts/db-init.sh`

### Windows PowerShell

```powershell
.\scripts\db-init.ps1
```

---

*Kurulum rehberi: [docs/POSTGRES-KURULUM-VE-CALISTIRMA.md](../docs/POSTGRES-KURULUM-VE-CALISTIRMA.md).*
