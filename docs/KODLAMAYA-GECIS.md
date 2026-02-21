# Kodlamaya geçiş — Karar ve sıra

**Karar:** ARTIK KODLAMAYA GEÇİYORUZ.

Bu noktaya gelmeden önce yapılması gereken kritik hiçbir şey kalmadı.

---

## Neden şimdi?

- MVP ekranları net
- Veritabanı şeması FINAL
- Matching algoritması tanımlı
- Risk & ödeme davranışı kuralları net
- Admin listeleri, filtreler, sort kuralları hazır
- API contract mantığı oturmuş

Yani artık **“ne yapacağız?”** değil, **“nasıl yazacağız?”** aşamasındayız.

---

## Doğru kodlama sırası (MVP — gün gün)

| Faz | Gün | İçerik | Çalışan ekranlar |
|-----|-----|--------|-------------------|
| **1** | 1–2 | Altyapı & Auth: proje iskeleti, DB (PostgreSQL), Auth (register buyer/provider, admin login), RBAC middleware, GET /auth/me | 3, 4, 5, 13 |
| **2** | 3–4 | Buyer çekirdek: dashboard, talep oluştur (DRAFT), talep publish, matching job tetikleme | 6, 7, 8 |
| **3** | 5–6 | Provider çekirdek: profil tamamlama, uygun talepler listesi, talep detayı (provider view) | 10, 11, 12 |
| **4** | 7–8 | Offer & Risk: teklif ver, bütçe bandı kontrolü, aşırı düşük teklif flag, provider risk band | Alıcı etiketleri çalışır |
| **5** | 9–10 | Admin: dashboard, listeler, ödeme raporu bildirimi + inceleme | MVP TAM |

---

## Önerilen başlangıç

**Auth + Organization modelinden başla.**

- Tüm ekranlar buna bağlı
- RBAC olmadan admin / provider / buyer ayrımı çalışmaz
- Sonradan refactor zor

---

## İlk adımlar (seçenekler)

1. **Backend klasör yapısı + dosya isimleri** — stack’ten bağımsız iskelet → **[BACKEND-KLASOR-YAPISI.md](BACKEND-KLASOR-YAPISI.md)** ✅
2. **Auth & Register endpoint’leri** — ilk kod skeleton’u (seçilen stack’te)
3. **Buyer “Talep Oluştur” endpoint’i** — birebir kod (Node/Express veya Flask)

**Öneri:** 1 tamamlandı. **Stack seç** (Node/Express veya Flask) → 2 ve 3 o stack’e göre yazılır.

---

*Detaylı adımlar: [KODLAMA-SIRASI-BACKEND.md](KODLAMA-SIRASI-BACKEND.md). API: [MVP-API-SOZLESMESI.md](MVP-API-SOZLESMESI.md).*
