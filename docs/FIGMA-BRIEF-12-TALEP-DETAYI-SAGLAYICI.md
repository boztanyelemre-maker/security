# Figma çizim brief’i — 12. Ekran: Talep Detayı (Sağlayıcı) (Provider – Request Detail & Offer)

**Amaç:** Sağlayıcının talebi **doğru anlayıp**, sadece **gerçekten karşılayabileceği** işe teklif vermesini sağlamak.

- ❌ Karşılaştırma ekranı değil  
- ❌ Rakipleri görme ekranı değil  
- ❌ Pazarlık ekranı değil  
- ✅ **Uygunluk + sorumluluk** ekranı  

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 12 · [SGK-URET-VERGISI-ZORUNLU-KRITER.md](SGK-URET-VERGISI-ZORUNLU-KRITER.md).

**Durum:** ✔️ Tamamlandı & güncel; kilitli brief.

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Layout** | Sol detay (%65) / Sağ özet + teklif (%35) |
| **Background** | Açık |

---

## Genel sayfa yapısı

```
| Talep detayları (Sol – ~%65)  | Uygunluk & teklif (Sağ – ~%35) |
```

---

## 1. Sayfa başlığı & bağlam

- **Başlık (H1):** *Güvenlik Hizmeti Talebi*
- **Alt bilgi (muted):** Talep ID · Lokasyon · Oluşturma tarihi

**MVP:** Alıcı adı bu ekranda **gösterilmez** → ihaleleşme & pazarlık riski kapalı.

---

## 2. Sol kolon — Talep detayları (read-only)

### A) Hizmetin kapsamı

- Hizmet türleri (etiket)  
- Lokasyon (şehir / ilçe)  
- Alan türü (AVM, fabrika, site vb.)  
- Tek / çoklu lokasyon  

**Not:** Açık adres yok (gizlilik + pazarlık önleme).

### B) Personel & vardiya

- Personel sayısı · Vardiya düzeni · Gündüz / gece · Silahlı / silahsız  

### C) Sertifika & yasal şartlar

- ÖGG kimliği (zorunlu) · Psikoteknik (varsa) · Silah ruhsatı (silahlıysa) · 5188 uygunluğu  

“Uygun değilsem çıkayım” filtresi.

### D) Süre & takvim

- Sözleşme süresi · Başlangıç tarihi · Deneme süresi (varsa)  

### E) Alıcının zorunlu şartları

- Alt yüklenici kullanımı (var/yok + oran)  
- **SGK & ücret vergisi düzenli ödeme şartı** ✅  
- Diğer yasal & operasyonel şartlar  

Bu alan **vurgulanır** (ikon + uyarı).

### F) Opsiyonel ayırt edici kriterler

Sadece alıcı doldurmuşsa gösterilir: personel tecrübe, denetim & raporlama, dijital sistem, sigorta / referans beklentileri.

---

## 3. Sağ kolon — Uygunluk & teklif

### A) Uygunluk özeti (sistem tarafı)

Kart: Lokasyon 🟢 · Kapasite 🟢 · Sertifikalar 🟡 · SGK & ücret beyanı 🟢 · Operasyonel yapı 🟡  

**Tooltip:** *Bu değerlendirme, profil bilgileriniz ile talep gereksinimlerinin eşleşmesine göre yapılır.*

### B) Finansal uygunluk sinyali

- 🟢 Bütçe ile uyumlu  
- 🟡 Bütçe sınırında  
- 🔴 Bütçe dışında → **Teklif Ver** butonu **pasif**  

Rakam yok; pazarlık yok.

---

## 4. Teklif verme alanı (MVP)

### Teklif formu (sade & sorumlu)

| Alan | UI | Zorunlu |
|------|-----|---------|
| Aylık teklif tutarı | Numeric | ✅ |
| Para birimi | Otomatik (TRY) | — |
| Hizmet başlangıç onayı | Checkbox | ✅ |
| **SGK & ücret ödeme beyanı** | **Checkbox** | **✅** *Personel maaşları, SGK primleri ve ücret vergileri yasal süresinde ve düzenli olarak ödenmektedir.* |

Bu beyan alıcının zorunlu şartıyla eşleşir; admin & puanlamada kullanılır.

### Bilgilendirme kutusu (zorunlu)

*Teklif tutarınız alıcıyla paylaşılmaz. Sistem yalnızca bütçe uyumu değerlendirmesi yapar.*

### CTA’lar

- **Teklif Ver**  
- **İptal**  

**Submit sonrası:** Toast: *Teklifiniz alındı.* → Sağlayıcı Tekliflerim ekranına yönlenir.

---

## 5. State & kontroller

| Durum | Davranış |
|--------|----------|
| **Profil eksik** | Teklif alanı kilitli. Mesaj: *Teklif verebilmek için profilinizi tamamlamanız gerekmektedir.* |
| **Bütçe dışı (🔴)** | Teklif verilemez; kart varsayılan olarak **gösterilmez**. |

---

## Component listesi

- Section / Read-only  
- Match Card  
- Compliance Badge · Budget Fit Badge  
- Form / Offer  
- Checkbox / Required  
- Info Box  
- Button / Primary · Disabled  

---

## Vizyon kırmızı çizgileri

- ❌ Rakip teklif sayısı · Rakip fiyatlar · Pazarlık alanı · “En düşük teklif” vurgusu  
- ✅ Uygunluk · Yasal & ücret uyumu · Sorumlu teklif · Kalite  

---

## Teslim kriterleri (checklist)

- [ ] Sağlayıcı “uygun muyum?”u net görüyor mu?
- [ ] Fiyat hiçbir yerde sızmıyor mu?
- [ ] SGK & ücret şartı zorunlu mu?
- [ ] İhale hissi var mı? (Varsa revize)

---

## Sonuç

Bu ekran:
- Sağlayıcıyı düşünmeye zorlar  
- Rastgele teklif atmayı azaltır  
- Alıcı–sağlayıcı ilişkisinde kaliteyi yükseltir  

---

## Sonraki adım

**13. ekran – Admin Login & Yetkilendirme** veya **Admin Dashboard** (çekirdek metrikler).

---

*Uygun talepler listesi: [FIGMA-BRIEF-11-UYGUN-TALEPLER-LISTESI.md](FIGMA-BRIEF-11-UYGUN-TALEPLER-LISTESI.md).*
