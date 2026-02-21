# Backend — Node.js + Express (MVP)

Planlardaki **“server”** = bu **backend** klasörü.

**Sunucu başlatma (lokal/prod):** proje kökündeki **[SUNUCU-BASLATMA.md](../SUNUCU-BASLATMA.md)** dosyasına bak.

## Gün 1 çıktısı

- Express iskelet, config (dotenv), logger (pino) + request id
- Global error handler: `{ code, message, details, requestId }`
- `GET /health` → 200
- Auth middleware skeleton: `requireAuth`, `requireRole` (JWT + RBAC)

## Kurulum

```bash
cd backend
cp .env.example .env
# .env içinde DATABASE_URL, JWT_SECRET, CORS_ORIGINS düzenle
npm install
npm run dev
```

## Scripts

- `npm start` — production (Render’da bu kullanılır)
- `npm run dev` — nodemon ile watch (lokal)
- `npm run db:init` — migration + seed (bash; Linux/Mac)
- `npm run db:init:win` — migration + seed (PowerShell; Windows)

## Standart response

- Başarılı: `{ "data": {...}, "meta": {...} }`
- Hata: `{ "code": "BUDGET_OUT", "message": "...", "details": {}, "requestId": "..." }`

## Sprint 1

Bkz. `docs/GELISTIRME-SIRASI-VE-SPRINT1.md`, `docs/GUNLUK-PLAN-20-GUN.md`.
