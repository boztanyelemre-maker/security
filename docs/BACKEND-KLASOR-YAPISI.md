# Backend klasör yapısı ve dosya isimleri (MVP)

Stack’ten bağımsız iskelet. Node/Express veya Flask seçildikten sonra aynı mantıkla doldurulur.

---

## Kök yapı (öneri)

```text
security/
├── backend/                 # veya api/, server/ — tek backend uygulaması
│   ├── src/                 # kaynak (veya doğrudan backend/ altında)
│   │   ├── config/          # DB, env, sabitler
│   │   ├── db/              # connection, pool, migration runner
│   │   ├── middleware/      # auth, rbac, error, logging
│   │   ├── routes/          # veya controllers/ + routes/
│   │   │   ├── auth/
│   │   │   ├── buyer/
│   │   │   ├── provider/
│   │   │   ├── admin/
│   │   │   └── meta/        # cities, districts
│   │   ├── services/        # iş mantığı (matching, risk, offer band)
│   │   ├── models/          # veya repositories/ — DB erişim
│   │   └── utils/           # helpers, validation
│   ├── tests/
│   ├── package.json         # Node   VEYA   requirements.txt  # Flask
│   └── README.md
├── docs/                    # mevcut
├── scripts/                 # db-init-docker vb.
└── ...
```

---

## Kritik dosya isimleri (ortak mantık)

| Amaç | Dosya / klasör |
|------|----------------|
| Uygulama girişi | `src/app.js` (Node) veya `src/main.py` / `app.py` (Flask) |
| Config | `src/config/index.js` veya `src/config.py` |
| DB bağlantı | `src/db/connection.js` veya `src/db/connection.py` |
| Auth middleware | `src/middleware/auth.js` veya `auth.py` |
| RBAC | `src/middleware/rbac.js` veya `rbac.py` |
| Auth route’lar | `src/routes/auth.js` veya `routes/auth.py` — register buyer/provider, login, /auth/me |
| Admin auth | `src/routes/admin/auth.js` veya admin altında login |
| Buyer requests | `src/routes/buyer/requests.js` veya `buyer/requests.py` |
| Provider profile | `src/routes/provider/profile.js` veya `provider/profile.py` |
| Provider requests (uygun talepler) | `src/routes/provider/requests.js` |
| Meta (cities/districts) | `src/routes/meta.js` veya `meta.py` |
| Matching job | `src/services/matching.js` veya `matching.py` |
| Offer band + risk | `src/services/offerBand.js` + `riskFlags.js` (veya tek service) |
| User/Org modelleri | `src/models/user.js`, `organization.js` (veya repositories/) |

---

## Auth & RBAC için minimum dosya seti

- `src/config/index.js` (veya `.py`) — env, DB URL
- `src/db/connection.js` (veya `.py`) — pool
- `src/middleware/auth.js` — token doğrula, req.user / req.organization
- `src/middleware/rbac.js` — role guard (BUYER / PROVIDER / ADMIN)
- `src/routes/auth.js` — POST register/buyer, register/provider, login; GET /auth/me
- `src/routes/admin/auth.js` (veya admin içinde) — POST admin/login
- `src/models/user.js`, `organization.js`, `role.js` (veya eşdeğer repository)

---

## Sonraki adım

**Stack seç:** Node/Express mi, Flask mi?

Seçtiğin stack’e göre bir sonraki adımda:
- **2)** Auth & Register endpoint’leri için gerçek kod skeleton’u (route + middleware + DB sorgu yerleri)
- **3)** İstersen Buyer “Talep Oluştur” (POST /buyer/requests) birebir kod

yazılabilir.

---

*Kodlama sırası: [KODLAMA-SIRASI-BACKEND.md](KODLAMA-SIRASI-BACKEND.md). Geçiş kararı: [KODLAMAYA-GECIS.md](KODLAMAYA-GECIS.md).*
