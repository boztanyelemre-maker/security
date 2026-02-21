# Frontend Deploy — Netlify (MVP)

Frontend için Netlify kullanmak MVP’de pratik ve yeterli. Backend (PostgreSQL + API) Netlify’de çalışmaz; Render / Fly / Railway / DigitalOcean vb. kullanılır.

---

## Netlify ne zaman “mükemmel” çalışır?

- Frontend: React / Next (static export) / Vue / Vite  
- API: Ayrı bir backend (farklı domain)  
- SPA routing + env değişkenleri doğru ayarlanır  

---

## 6 kritik ayar (checklist)

| # | Ayar | Neden | Yapıldı mı? |
|---|------|--------|--------------|
| 1 | **SPA routing** — `_redirects` | Refresh’te 404 almamak (15 ekran route) | ☐ |
| 2 | **Environment variables** — API base URL | Frontend’in backend’i bulması | ☐ |
| 3 | **CORS (backend)** | Netlify domain’i whitelist’te olmalı | ☐ |
| 4 | **Auth token** — localStorage (MVP) veya HttpOnly cookie (v2) | Netlify sadece hosting; token mantığı sende | ☐ |
| 5 | **Build command + Publish directory** | Doğru klasörün yayınlanması | ☐ |
| 6 | **(Opsiyonel) Reverse proxy** — `netlify.toml` | `/api/*` → backend; CORS kolaylaşır | ☐ |

---

## 1) SPA routing — `_redirects`

**Dosya:** Proje kökünde `public/_redirects` veya build çıktısının köküne kopyalanacak `_redirects`.

**İçerik (kopyala-yapıştır):**

```text
/*    /index.html   200
```

Böylece tüm path’ler `index.html`’e düşer; SPA router kendi route’unu işler. Refresh’te 404 olmaz.

---

## 2) Environment variables (API base URL)

**Netlify UI:** Site settings → Build & deploy → Environment variables

Stack’e göre **bir** tanesini kullan:

| Stack | Değişken adı | Örnek değer |
|-------|----------------|-------------|
| **Vite** | `VITE_API_BASE_URL` | `https://api.senin-backend.com` |
| **Create React App** | `REACT_APP_API_BASE_URL` | `https://api.senin-backend.com` |
| **Next.js** | `NEXT_PUBLIC_API_BASE_URL` | `https://api.senin-backend.com` |

Frontend’de tüm API çağrıları bu base URL ile yapılır (örn. `fetch(\`${import.meta.env.VITE_API_BASE_URL}/auth/login\`, ...)`).

---

## 3) CORS (backend tarafı)

Netlify’de yayınlanan site örneği: `https://xyz.netlify.app` veya custom domain.

**Backend CORS whitelist’e ekle:**

- `https://*.netlify.app`
- Custom domain (varsa) örn. `https://app.senin-domain.com`

Aksi halde tarayıcı login/register isteklerini bloklar.

---

## 4) Auth token saklama

- **MVP:** JWT’yi `localStorage`’da tutmak yaygın ve hızlı.  
- **v2 (daha güvenli):** Backend `Set-Cookie` (HttpOnly, Secure) ile token gönderir; frontend cookie’ye yazmaz, sadece istekler cookie ile gider.

Netlify sadece statik hosting sağlar; token mantığı frontend/backend kodunda.

---

## 5) Build ayarları (Netlify UI)

| Ayar | Değer |
|------|--------|
| **Build command** | `npm run build` |
| **Publish directory** | Vite: `dist` \| CRA: `build` \| Next (static): `out` |

Branch: `main` (veya kullandığın default).

---

## 6) (Opsiyonel) Reverse proxy — `netlify.toml`

Frontend’den aynı origin gibi `/api/...` kullanmak istersen Netlify redirect ile backend’e yönlendirirsin; CORS’u backend’de gevşetmene gerek kalmaz.

**Dosya:** Proje kökünde `netlify.toml`

**Örnek (kopyala-yapıştır, URL’i değiştir):**

```toml
[build]
  command   = "npm run build"
  publish   = "dist"

[[redirects]]
  from   = "/api/*"
  to     = "https://api.senin-backend.com/:splat"
  status = 200
  force  = true
```

- `publish`: Vite ise `dist`, CRA ise `build`, Next static ise `out`.  
- `https://api.senin-backend.com`: Kendi backend base URL’in.

Frontend artık `fetch("/api/auth/login", ...)` der; istek Netlify üzerinden backend’e gider, tarayıcı için origin aynı sayılır.

---

## Netlify ile “backend” olur mu?

| Bileşen | Netlify’de? |
|---------|-------------|
| **Frontend (SPA)** | ✅ Evet |
| **Backend (Node/Python + PostgreSQL)** | ❌ Hayır |

Backend için: **Render** ([RENDER-BACKEND-DEPLOY.md](RENDER-BACKEND-DEPLOY.md)), Fly.io, Railway, DigitalOcean App Platform veya VPS + Docker.

---

## Copy-paste deployment checklist

**Netlify’de yeni site açtıktan sonra:**

1. ☐ Repo’yu bağla (GitHub/GitLab), branch seç.  
2. ☐ **Build command:** `npm run build`  
3. ☐ **Publish directory:** `dist` (Vite) / `build` (CRA) / `out` (Next static)  
4. ☐ **Environment:** `VITE_API_BASE_URL` (veya `REACT_APP_` / `NEXT_PUBLIC_`) = backend base URL  
5. ☐ **`public/_redirects`** ekle: `/*    /index.html   200`  
6. ☐ (İstersen) **`netlify.toml`** ekle — build + proxy; backend URL’ini güncelle.  
7. ☐ **Backend CORS:** `https://*.netlify.app` ve custom domain’i ekle.  
8. ☐ Deploy et; login/register’ı dene.  

---

*Backend deploy: 20 günlük planda Gün 20. Genel plan: [GUNLUK-PLAN-20-GUN.md](GUNLUK-PLAN-20-GUN.md).*
