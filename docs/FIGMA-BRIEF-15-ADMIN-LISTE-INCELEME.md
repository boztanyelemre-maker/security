# Figma çizim brief’i — 15. Ekran: Admin Liste & İnceleme Ekranları (Requests / Offers / Buyers / Providers)

**Amaç:** Admin’in **karar vermesi gereken noktaları** hızlıca görmesi ve **güvenli aksiyon** alması.

- ❌ Operasyon ekranı değil  
- ❌ Manuel iş yapma alanı değil  
- ✅ **Filtrelenmiş karar ekranları**  

**Yapı:** Tek tip admin altyapısı + **4 farklı liste** (Talep, Teklif, Alıcılar, Sağlayıcılar). Mantık bir kez kurulur, her yerde aynı çalışır.

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 15 · [ADMIN-PANEL-WIREFRAME.md](ADMIN-PANEL-WIREFRAME.md).

**Durum:** ✔️ Tamamlandı & güncel; kilitli brief. **MVP ekran setinin son parçası.**

---

## Ortak frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column |
| **Layout** | Sol filtre – Sağ liste |
| **Background** | Açık / kurumsal |

---

## Ortak yapı (tüm listeler için)

```
| Filtreler (Sol)  | Liste (Sağ)                |
|                  | Satır → İncele → Aksiyon   |
```

---

## Ortak filtre paneli (sol)

Tüm admin listelerinde aynı yapı:

- **Durum:** Aktif · İncelemede · Askıda · Kapalı  
- **Risk seviyesi:** 🟢 Normal · 🟡 İzlemede · 🔴 Kritik  
- **Tarih aralığı**  
- **Serbest arama** (ID / firma adı)  

**Menü / filtreler role göre** açılıp kapanır.

---

## 15A. Talepler listesi (admin)

### Liste kolonları

Talep ID · Alıcı Firma · Lokasyon · Hizmet Türü · Gelen Teklif Sayısı · Risk Flag’i · Durum · **İncele** (aksiyon).

### Otomatik flag’ler

- Bütçe–teklif uyumsuzluğu  
- Aşırı düşük teklif yoğunluğu  
- Riskli alıcı  

### Talep inceleme detayı (drawer/sayfa)

Admin görür: Talep içeriği (tam) · **Gizli bütçe** · Gelen tekliflerin **ham fiyatları** · Sistem puanlaması · Risk nedenleri.

**Aksiyonlar:** Yayında bırak · Askıya al · Manuel eşleşme · Kapat.

---

## 15B. Teklifler listesi (admin)

### Liste kolonları

Teklif ID · Talep ID · Sağlayıcı Firma · **Fiyat (ham – sadece admin)** · Bütçe uyumu · Aşırı düşük flag’i · Durum · İncele.

### Teklif inceleme (drawer/sayfa)

Admin görür: Fiyat kırılımı (varsa) · SGK & ücret beyanı · Sertifika uyumu · Operasyonel yeterlilik · Referans beyanları.

**Aksiyonlar:** Onayla · İşaretle (risk) · Gizle (alıcıdan) · Reddet.  
Alıcı reddedilen teklifi **hiç görmez**.

---

## 15C. Alıcılar listesi (admin)

### Liste kolonları

Firma Adı · Açık Talepler · Ödeme Davranışı · Risk Seviyesi · Son Aktivite · İncele.

### Alıcı detayı (drawer/sayfa)

Admin görür: Talep geçmişi · Ödeme vade beyanları · Geç ödeme sayısı · Ödenmeyen iş sayısı · Sağlayıcı bildirimleri.

**Aksiyonlar:** İzlemeye al · Talep limiti düşür · Manuel onay zorunlu · **Hesabı pasife al** (son çare; sebep zorunlu).

---

## 15D. Sağlayıcılar listesi (admin)

### Liste kolonları

Firma Adı · Profil % durumu · Verilen Teklifler · SGK & ücret uyumu · Risk Seviyesi · İncele.

### Sağlayıcı detayı (drawer/sayfa)

Admin görür: Profil beyanları · Teklif geçmişi · Aşırı düşük teklif sayısı · Ödeme durumu bildirimleri · Personel devir sinyalleri.

**Aksiyonlar:** Profil onayı · İzlemeye al · Eşleşmeyi sınırla · **Pasife al** (kritik durum; sebep zorunlu).

---

## Component listesi

- Sidebar / Filters  
- Data Table  
- Badge / Risk · Badge / Status  
- Drawer / Detail  
- Button / Primary · Button / Destructive (admin only)  

---

## Vizyon kırmızı çizgileri

- ❌ Admin her şeye müdahale etmez · Manuel iş yükü yaratılmaz · Kullanıcıya ham veri sızmaz  
- ✅ Otomatik flag · İnsan + sistem dengesi · İzlenebilir kararlar  

---

## Teslim kriterleri (checklist)

- [ ] Admin riskleri tek bakışta görüyor mu?
- [ ] Kritik aksiyonlar hızlı mı?
- [ ] Karar log’ları tutuluyor mu?
- [ ] Alıcı / sağlayıcıya haksız veri sızıyor mu? (Sızmamalı)

---

## Sonuç

Bu ekran seti ile **MVP’nin 15 ekranı tasarım brief’i olarak tamamlandı.**

- Akışlar net  
- Vizyon kilitli  
- İhaleleşme riski kapalı  
- Premium B2B mimari hazır  
- Figma’ya birebir çizilebilir; backend & frontend aynı dili konuşuyor  

---

## Bundan sonraki doğal adımlar

1. MVP fonksiyonel kapsam checklist’i (done / not done)  
2. Veri tabanı tabloları – final schema  
3. API endpoint listesi (frontend sözleşmesi)  
4. Figma → geliştirme handoff rehberi  

---

*Admin Dashboard: [FIGMA-BRIEF-14-ADMIN-DASHBOARD.md](FIGMA-BRIEF-14-ADMIN-DASHBOARD.md). Ödeme inceleme: [FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md](FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md).*
