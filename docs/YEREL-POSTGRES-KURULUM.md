# Yerel PostgreSQL kurulumu (Docker olmadan)

Docker Desktop açılmıyorsa Windows’a PostgreSQL kurarak aynı projeyi kullanabilirsin.

---

## 1. İndir ve kur

1. Tarayıcıda aç: **https://www.postgresql.org/download/windows/**
2. **“Download the installer”** → **EDB’nin sitesine** git (postgresql.org’dan yönlendirir).
3. **PostgreSQL 16** (veya en güncel) → **Windows x86-64** indir.
4. İndirilen `.exe` dosyasını çalıştır.
5. Kurulumda:
   - **Installation directory:** Varsayılan kalsın.
   - **Select components:** PostgreSQL Server, pgAdmin 4, Stack Builder isteğe bağlı (Command Line Tools işaretli olsun).
   - **Data directory:** Varsayılan.
   - **Password:** **postgres** yaz (veya aklında kalacak bir şifre — bunu `.env`’e yazacaksın).
   - **Port:** **5432** (varsayılan).
   - **Locale:** Varsayılan.
6. Kurulum bitene kadar Next → Finish.

---

## 2. Veritabanı oluştur

Kurulumla gelen **pgAdmin 4** veya **psql** ile `gus_mvp` veritabanını oluştur.

### pgAdmin ile

1. Başlat menüsünden **pgAdmin 4** aç.
2. Sol tarafta **Servers** → **PostgreSQL** (şifre: kurulumda verdiğin, örn. `postgres`).
3. **Databases**’e sağ tık → **Create** → **Database**.
4. **Database** adı: **gus_mvp**. **Save**.

### CMD ile (psql PATH’teyse)

```cmd
psql -U postgres -c "CREATE DATABASE gus_mvp;"
```

Şifre sorarsa kurulumda verdiğin şifreyi yaz.

---

## 3. Proje .env ayarı

**server/.env** dosyasında (yoksa **server/.env.example**’ı kopyala → **.env** yap):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:POSTRES_SIFREN@localhost:5432/gus_mvp
JWT_SECRET=change-me-in-production-min-32-chars
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**POSTRES_SIFREN** yerine kurulumda verdiğin şifreyi yaz (örn. `postgres`).

---

## 4. Migration + seed çalıştır

Proje kökünde (PowerShell’de script çalışmıyorsa **CMD** kullan):

```cmd
cd /d "C:\Users\merts\OneDrive\Masaüstü\security"
scripts\db-init.ps1
```

PowerShell’de script engelli ise:

```cmd
cd /d "C:\Users\merts\OneDrive\Masaüstü\security\docs\migrations"
psql -U postgres -d gus_mvp -f M00_extensions.sql
psql -U postgres -d gus_mvp -f M01_lookup.sql
psql -U postgres -d gus_mvp -f M02_auth.sql
REM ... (M03–M09a ve seed için db/init.sh listesine bak)
```

Veya **db/init.sh**’i Git Bash’te çalıştırıyorsan (psql PATH’te olmalı):

```bash
cd /c/Users/merts/OneDrive/Masaüstü/security
bash db/init.sh
```

---

## 5. Kontrol

- **pgAdmin**’de `gus_mvp` → **Schemas** → **public** → **Tables**: Tablolar görünmeli.
- **Server**’ı çalıştır: `cd server` → `npm run dev` → Tarayıcıda `http://localhost:3000/health`.

Bu adımlar bittikten sonra “Docker Postgres başlat” maddesi yerel Postgres ile tamamlanmış sayılır.
