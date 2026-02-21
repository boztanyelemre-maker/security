# Server — Node.js + Express (MVP)

**Sunucu başlatma:** Proje kökündeki [SUNUCU-BASLATMA.md](../SUNUCU-BASLATMA.md) dosyasına bak.

## Kurulum

```bash
cd server
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

## Gün 1 çıktısı

- Express iskelet, config, logger, error handler, CORS
- `GET /health` → 200
- Auth middleware: `requireAuth`, `requireRole`
