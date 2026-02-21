# Backend Deploy — Render (MVP → Pilot)

Backend için Render uygun; özellikle MVP ve ilk production geçişi için. Artı/eksi ve bu projeye özel kritik noktalar aşağıda.

---

## Render’ın bu proje için güçlü yanları

- Web Service + PostgreSQL aynı platformda; kurulum hızlı  
- Environment variable yönetimi sade  
- Docker ile deploy mümkün  
- Postgres oluşturma ve bağlantı yönetimi kolay  
- Matching, risk, ödeme review gibi “iş motoru” için stabil deploy + managed DB uygun  

---

## Dikkat: Free tier ile üretim olmaz (MVP demo olur)

- **Render Free Postgres:** 1 GB, **30 gün sonra expire**. Gerçek kullanıcı verisi tutacaksan **paid Postgres** gerekir.  
- Free web servislerde limit aşımında suspend olabilir.  

---

## Bu projeye özel teknik notlar

### 1) Dosya sistemi “ephemeral”

Web servis dosya sistemi deploy/restart’ta sıfırlanır; kalıcı disk paid planlarda ve ayrıca ayarlanır.  

➡️ Bu backend için genelde sorun değil (dosya tutmuyoruz). v2’de doküman yükleme olursa S3 benzeri storage gerekir.

### 2) Backup & recovery

Paid Render Postgres’ta PITR / backup vardır (plana göre pencere değişir).  

➡️ “Admin yanlışlıkla sildi” senaryoları için önemli.

### 3) SMTP / mail (ileride)

Free web servislerde SMTP portlarıyla kısıtlar olabiliyor.  

➡️ E-posta doğrulama / bildirim v2’deyse SendGrid/Resend gibi API kullanmak daha güvenli.

---

## Net öneri

| Aşama | Backend | DB |
|-------|---------|-----|
| **MVP / Demo (hızlı)** | Render Web Service (Free olabilir) | **Paid Postgres** (en azından veri kaybetmemek için) |
| **MVP → pilot (gerçek kullanım)** | Render Web Service (paid instance) | Render Postgres (paid) + backup |

**Son karar:** Render backend için iyi (özellikle hızlı MVP ve pilot). Free Postgres ile ilerleme: 30 gün expiry nedeniyle veri kaybı riski var.

---

## Netlify + Render birlikte

- **Frontend:** Netlify  
- **Backend/API:** Render  
- **CORS:** Netlify domain + custom domain whitelist (backend’de). İstersen Netlify proxy ile CORS’u kolaylaştırırsın.  

---

## Render’da kurulum adımları (Web Service + Postgres)

### 1) Postgres oluşturma

1. Render Dashboard → **New** → **PostgreSQL**.  
2. İsim ver (örn. `gus-mvp-db`), region seç.  
3. Plan: **Starter** (paid) önerilir; Free’de 30 gün sonra expire.  
4. **Create**.  
5. **Info** sekmesinden **Internal Database URL** ve **External Database URL** kopyala.  
   - Aynı Render’da web service kullanıyorsan **Internal** kullan (daha hızlı, ücretsiz trafik).  
   - Yerel / başka servisten bağlanacaksan **External**.  

### 2) Web Service oluşturma

1. **New** → **Web Service**.  
2. Repo’yu bağla (GitHub/GitLab); backend kök dizinini seç (örn. `backend/`).  
3. **Runtime:** Node / Docker (projeye göre).  
4. **Build command:** `npm install` veya `npm run build` (projeye göre).  
5. **Start command:** `npm start` veya `node dist/index.js` (projeye göre).  
6. **Instance type:** Free (demo) veya Paid (pilot).  

### 3) Environment variables (Web Service)

**Zorunlu (bu proje için):**

| Değişken | Açıklama | Örnek |
|----------|----------|--------|
| `NODE_ENV` | Ortam | `production` |
| `DATABASE_URL` | Postgres bağlantı (Internal URL Render’dan) | `postgresql://user:pass@host/dbname` |
| `JWT_SECRET` | JWT imza (güçlü, rastgele) | Uzun rastgele string |
| `CORS_ORIGINS` | İzin verilen origin’ler (virgülle ayrılmış) | `https://xyz.netlify.app,https://app.senin-domain.com` |

**Opsiyonel (MVP):**

| Değişken | Açıklama |
|----------|----------|
| `PORT` | Render otomatik atar; gerekirse 10000 vb. |
| `LOG_LEVEL` | `info` / `debug` |

Backend kodunda: `process.env.DATABASE_URL`, `process.env.JWT_SECRET`, `process.env.CORS_ORIGINS` okuyacak şekilde config kullan.

### 4) Postgres’e migration + seed (ilk deploy)

- **Seçenek A:** Build/start script’te migration çalıştır (örn. `npm run db:migrate` sonra `npm start`).  
- **Seçenek B:** Render’da tek seferlik **Background Worker** veya **Shell** ile migration + seed çalıştır.  
- **Seçenek C:** Yerelde `DATABASE_URL=External_URL` ile migration + seed çalıştır; sonra Web Service’i deploy et.  

Bu projede `docs/migrations` ve `docs/seed` var; backend’e `db/` veya script kopyalanıp `DATABASE_URL` ile çalıştırılır.

---

## Health check + deploy pipeline önerisi

### Health check (Render otomatik kullanır)

- **Path:** `GET /health`  
- **Beklenen:** 200 + body (örn. `{ "status": "ok", "db": "connected" }`).  
- Render **Health Check Path** alanına `/health` yaz. Böylece servis ayağa kalkmadan “live” sayılmaz.  

### Deploy pipeline (öneri)

1. **Auto-Deploy:** `main` (veya seçtiğin branch) push’ta deploy.  
2. **Build:** `npm install && npm run build` (veya `npm run db:migrate`).  
3. **Start:** `npm start`.  
4. İlk kurulumda **migration + seed** bir kez çalıştırılmış olsun (yukarıdaki seçeneklerden biri).  

### Backup stratejisi (paid Postgres)

- Render dashboard’dan **Backups** (PITR penceresi) kontrol et.  
- Kritik işlem öncesi manuel snapshot alınabilir (plan destekliyorsa).  

---

## Kısa checklist (Render backend)

1. ☐ Postgres oluştur (Starter/paid önerilir); Internal URL kopyala.  
2. ☐ Web Service oluştur; repo ve build/start command ayarla.  
3. ☐ Env: `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`.  
4. ☐ Health Check Path: `/health`.  
5. ☐ İlk deploy sonrası migration + seed çalıştır.  
6. ☐ Netlify frontend’den istek at; CORS hatası yoksa `CORS_ORIGINS` doğru demektir.  

---

*Frontend deploy: [NETLIFY-FRONTEND-DEPLOY.md](NETLIFY-FRONTEND-DEPLOY.md). Genel plan: [GUNLUK-PLAN-20-GUN.md](GUNLUK-PLAN-20-GUN.md).*
