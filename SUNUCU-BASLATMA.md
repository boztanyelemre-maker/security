# Sunucu başlatma — Lokal & Prod

Model: **Lokal** Docker Postgres + Node/Express API | **Prod** Render (API + Postgres) | **Frontend** Netlify.

---

## 1) Lokal ortamda sunucu nasıl başlar?

### A) PostgreSQL (Docker)

```bash
docker run --name gus-psql \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=gus_mvp \
  -p 5432:5432 \
  -d postgres:16
```

Container zaten varsa: `docker start gus-psql`

### B) Backend (Node/Express)

Proje kökünde **backend** klasörü (planlardaki “server” = backend):

```bash
cd backend
npm install
cp .env.example .env
# .env içinde DATABASE_URL, JWT_SECRET, CORS_ORIGINS düzenle
npm run dev
```

- **dev:** `nodemon src/index.js` — API örn. **http://localhost:3000**
- **start:** `node src/index.js` — prod için

### C) Migration + seed (ilk kurulum / şema güncelleme)

Postgres çalışırken:

- **Linux/Mac (bash):**  
  `cd backend` → `npm run db:init`  
  (veya proje kökünden: `bash db/init.sh`)
- **Windows:**  
  `cd backend` → `npm run db:init:win`  
  (veya proje kökünden: `.\scripts\db-init.ps1`)

---

## 2) Hangi dosyalar? (minimum)

| Dosya | Açıklama |
|-------|-----------|
| **backend/package.json** | Script’ler: `dev`, `start`, `db:init`, `db:init:win` |
| **backend/.env** | Lokal env (kopyala: `cp .env.example .env`) |
| **backend/src/index.js** | Express app’i dinleyen giriş noktası |
| **db/init.sh** | Migration + seed (bash); `npm run db:init` ile çağrılır |

**backend/.env** örneği:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/gus_mvp
JWT_SECRET=change_me_super_secret
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 3) Express sunucusu nasıl ayağa kalkar?

- **backend/src/index.js** — `dotenv` yükler, `./app` require eder, `app.listen(port)`.
- **backend/src/app.js** — `express()`, CORS (origin callback; Postman/curl için origin yoksa izin verir), `express.json({ limit: '1mb' })`, `/health`, route’lar, 404, error handler.

Render’da **Start Command:** `npm start` (Render `PORT` verir; `app.listen(process.env.PORT)` kullanıyoruz).

---

## 4) Migration / seed (db:init)

- **npm run db:init** (backend içinde) → `bash ../db/init.sh`  
  - Proje köküne göre `docs/migrations` (M00→M09a) ve `docs/seed/minimum-seed.sql` çalıştırılır.
- **npm run db:init:win** (backend içinde) → proje köküne geçip `scripts/db-init.ps1` çalıştırır.

---

## 5) Prod (Render) — sunucu nasıl başlar?

1. **PostgreSQL:** Render’da “PostgreSQL” ekle → **Internal Database URL** alırsın.
2. **Web Service (Backend):** Repo’yu bağla, root’u backend yapma; **Start Command:** `npm start` (veya build sonrası `cd backend && npm start` — Render’da “Root Directory” backend ise sadece `npm start`).
3. **Env (Backend service):**  
   `DATABASE_URL` (Render’ın verdiği), `JWT_SECRET`, `CORS_ORIGINS` (Netlify domain + custom domain).

Render otomatik `PORT` verir; kod `process.env.PORT` ile dinler.

---

## 6) Frontend (Netlify) — API’ye nasıl gider?

- **Build env:**  
  `VITE_API_BASE_URL=https://<render-backend>.onrender.com`
- **Çağrı:**  
  `fetch(\`${import.meta.env.VITE_API_BASE_URL}/auth/login\`, ...)`

---

## Özet

| Ortam | Veritabanı | API |
|-------|------------|-----|
| **Lokal** | Docker Postgres (gus-psql) | `cd backend` → `npm run dev` → http://localhost:3000 |
| **Prod** | Render Postgres | Render Web Service → `npm start` |
| **Frontend** | — | Netlify; `VITE_API_BASE_URL` = Render API URL |

İlk kurulumda: Docker Postgres → `npm run db:init` (veya Windows’ta `db:init:win`) → `npm run dev`.
