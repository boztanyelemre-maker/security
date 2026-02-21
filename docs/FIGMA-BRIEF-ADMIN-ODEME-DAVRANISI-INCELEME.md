# Figma brief — Admin: “Ödeme Davranışı İnceleme” ekranı (MVP)

**Amaç:** Sağlayıcı bildirimlerini doğrulamak / ayıklamak; alıcıya otomatik ceza vermeden önce **kontrollü karar** almak.

**URL (öneri):** `/admin/payment-behavior/review`

**Referans:** [ODEME-METRIKLERI-KAYNAKLARI.md](ODEME-METRIKLERI-KAYNAKLARI.md), [ALICI-TEMIZLEME-MEKANIZMASI.md](ALICI-TEMIZLEME-MEKANIZMASI.md).

---

## Vizyon & hukuk kuralları

- ❌ “Kara liste” dili yok  
- ✅ “İnceleme / doğrulama” dili  
- ✅ Admin kararları **loglanır** (audit)  

---

## Ekran yapısı

### Üst başlık

- **Başlık:** *Ödeme Davranışı İnceleme*

### KPI mini kartlar

- Bekleyen bildirim  
- Son 7 gün doğrulanan  
- Kritik (ödenmedi) bekleyen  

---

## Liste (kuyruk tablosu)

| Kolon | İçerik |
|--------|--------|
| Bildirim Tarihi | |
| Alıcı Firma | |
| Sağlayıcı Firma | |
| Talep / İş ID | |
| Beyan Vade | Badge |
| Bildirim Durumu | Zamanında / Gecikmeli / Ödenmedi |
| Süre bandı | 8–30 / 31–60 / 90+ |
| Güven sinyali | Badge: Tekil / Tekrarlı / Çoklu kaynak |
| **Aksiyon** | **İncele** (buton) |

### Filtreler (sol panel veya üstte)

- **Durum:** Bekleyen / Onaylandı / Reddedildi  
- **Bildirim tipi:** Gecikmeli / Ödenmedi  
- **Süre bandı:** 31–60, 90+  
- **Alıcı firma** arama  
- **Tarih:** Son 7 / 30 / 90 gün  

---

## “İncele” → Detay paneli (drawer) veya sayfa

### Başlık

- *Bildirim Detayı*  
- **Context:** Alıcı + Talep / İş ID  

### Bölüm 1 — Özet

- Alıcı beyan vadesi  
- Bildirilen durum + süre bandı  
- Sağlayıcı notu (varsa)  

### Bölüm 2 — Tutarlılık (MVP; kanıt yok)

Platform içi sinyal:

- Aynı alıcı için son 90 günde: Kaç farklı sağlayıcı bildirim yapmış?  
- Kaç kez “ödenmedi” işaretlenmiş?  
- Trend: artıyor mu?  

### Bölüm 3 — Karar (admin aksiyon)

**Radio:**

- ✅ **Onayla** (sinyali geçerli say)  
- 🟡 **Beklemeye al** (daha fazla sinyal bekle)  
- ❌ **Reddet** (geçersiz / uygunsuz)  

**Zorunlu alan:** *Karar Notu* (min 20 karakter) — audit için şart.

### Bölüm 4 — Otomatik sonuçlar (sadece admin görür)

Onaylanırsa sistem:

- Alıcının “davranış seviyesi”ni günceller: 🟡 / 🔵 / 🔴  
- “Kritik” ise talep yayınları manuel onaya düşer (kademeli kısıt)  
- (Opsiyonel) Sağlayıcıya: *İnceleme tamamlandı*  

---

## Validasyon & güvenlik

- Admin kararları **audit_logs**’a yazılır  
- Aynı bildirim için çakışan karar olmasın (lock)  
- (v2) Çoklu admin varsa “atama” opsiyonu  

---

## Component listesi

- Page / Admin layout  
- KPI cards (mini)  
- Table (queue)  
- Badge (vade, durum, güven sinyali)  
- Filters (dropdown, date range, search)  
- Drawer veya detay sayfası  
- Radio group  
- Textarea (karar notu)  
- Button / Primary · Secondary  

---

*Sağlayıcı tarafı bildirim UI: [FIGMA-BRIEF-PROVIDER-ODEME-DURUMU-BILDIR.md](FIGMA-BRIEF-PROVIDER-ODEME-DURUMU-BILDIR.md).*
