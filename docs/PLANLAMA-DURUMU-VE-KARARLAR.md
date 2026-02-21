# Planlama Durumu ve Kararlar — MVP

**Özet:** Ürün kararlarının büyük kısmı verildi. Teknik uygulama için birkaç karar daha kilitlendi (aşağıda default’lar yazıldı). Bu dokümanla planlama “tamamen kilitli” kabul edilir; artık %100 kodlamaya geçilebilir.

---

## A) Verilen kararlar (kilitli)

### Ürün / MVP

- B2B: Alıcı ↔ Sağlayıcı güvenlik hizmeti platformu  
- MVP: 15 ekran (genel + buyer + provider + admin)  
- Talep ekranı kapsamı: zorunlu + opsiyonel alanlar net  
- Teklif yaklaşımı: İhaleleşmeden; band + kalite sinyali  
- “SGK + ücret vergisi düzenli ödeme” şartı akışa dahil  
- Ödeme davranışı sistemi + admin onayı + alıcı risk bandı  
- Risk band standardı: NORMAL / WATCH / CRITICAL  
- Admin dashboard + listeler + filtre/sort/pagination standardı  

### Teknik

- DB: PostgreSQL  
- Şema: migrations (M00–M09) + seed  
- Matching job kural seti + request_matches upsert  
- Offer budget band + too-low risk flag  
- Frontend deploy: Netlify  
- Backend deploy: Render (öneri + kabul)  

---

## B) Kapanması gereken kararlar — MVP default’ları (kilitlendi)

Bunlar vizyonu değiştirmez; sadece uygulama detayını kilitler. **Aşağıdaki default’lar kabul edildi;** refactor ihtiyacı en az.

| Karar | Seçim (MVP default) | Not |
|-------|----------------------|-----|
| **Backend stack** | **Node + Express** | Framework-agnostic alternatifler veya Nest/FastAPI sonra seçilebilir. |
| **Auth token stratejisi** | **JWT localStorage (MVP)** | v2’de HttpOnly cookie düşünülebilir. |
| **Offer OUT davranışı** | **Blokla (403)** | OUT teklif kaydedilmez; admin review’a düşmez. |

### Diğer (şu an sabit kabul)

- **Migration:** Salt SQL migration (M00–M09); ORM sonra eklenebilir.  
- **Admin modülü:** Tek “Admin Yönetim” alanı; içeride tab’lı listeler (Talepler, Teklifler, Alıcılar, Sağlayıcılar, Ödeme raporları, Risk flag’leri). Route planı: tek base + tab veya ayrı path’ler (uygulama sırasında netleşir).  
- **Domain & CORS:** Netlify default domain + Render default domain ile başlanır; custom domain deploy aşamasında eklenir. CORS: Netlify origin + (varsa) custom frontend domain.  

Bu maddeler “büyük plan”ı değiştirmez; uygulama şeklini kilitler.

---

## C) Bundan sonra planlama nasıl olacak?

Büyük plan bitti. Planlama artık **3 seviyede** ilerler:

### 1) Sprint planı (1 hafta)

- Hangi ekranlar “çalışır” hale gelecek  
- Hangi endpoint’ler tamamlanacak  
- Kabul kriterleri (Definition of Done)  

### 2) Günlük plan (her gün)

- 3–5 task  
- 1 deliverable (çalışan endpoint veya ekran)  
- 5–10 test case geçişi  

### 3) Release plan (MVP release)

- Staging → Pilot → Prod  
- Backup, monitoring, rate limit, audit  

Referans: [GUNLUK-PLAN-20-GUN.md](GUNLUK-PLAN-20-GUN.md), [GELISTIRME-SIRASI-VE-SPRINT1.md](GELISTIRME-SIRASI-VE-SPRINT1.md).

---

## Sonuç

- **Evet:** Ürün kararları büyük ölçüde verildi.  
- **Evet:** Teknik uygulama kararları (backend stack, auth token, offer OUT) default’larla kilitlendi.  
- **Artık:** Planlama tamamen kilitli kabul edilir; %100 kodlamaya geçilebilir.  

---

*20 günlük plan: [GUNLUK-PLAN-20-GUN.md](GUNLUK-PLAN-20-GUN.md). Backend: [BACKEND-HAZIRLIK-DURUMU.md](BACKEND-HAZIRLIK-DURUMU.md), [BACKEND-KLASOR-YAPISI.md](BACKEND-KLASOR-YAPISI.md).*
