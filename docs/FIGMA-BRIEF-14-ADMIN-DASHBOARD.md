# Figma çizim brief’i — 14. Ekran: Admin Dashboard (Kontrol Merkezi)

**Amaç:** Platformun **sağlığını**, **risklerini** ve **kritik aksiyon** gerektiren alanlarını tek bakışta göstermek.

- ❌ Detay işlem ekranı değil  
- ❌ Liste boğulması değil  
- ✅ **Durum + uyarı + yönlendirme** ekranı  

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 14 · [ADMIN-PANEL-WIREFRAME.md](ADMIN-PANEL-WIREFRAME.md).

**Durum:** ✔️ Tamamlandı & güncel; kilitli brief.

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Layout** | Widget bazlı (kart sistemi) |
| **Background** | Açık / kurumsal |

---

## Genel yapı (3 katman)

```
| KPI özetleri (üst sıra)                          |
| Risk & uyarılar (sol)  | Operasyonel akışlar (sağ) |
| Son aksiyonlar / loglar                          |
```

---

## 1. KPI özet kartları (üst sıra)

Kartlar **tıklanabilir** → ilgili listeye gider.

| Kart | İçerik |
|------|--------|
| **Aktif talepler** | Sayı · Trend ↑↓ (son 7 gün) |
| **Aktif sağlayıcılar** | Profil %100 olan · Uygun eşleşmeye açık |
| **Riskli alıcılar** | 🔵 İzlemede · 🔴 Kritik |
| **Riskli sağlayıcılar** | SGK / ücret uyumu · Ödeme bildirimi çakışmaları |

---

## 2. Sol kolon — Risk & uyarı paneli (en kritik)

### Kritik uyarılar (kuyruk)

Liste **öncelik sırasıyla**:

| Uyarı tipi | Örnek |
|------------|--------|
| 🔴 Ödeme alınmadı bildirimi (90+ gün) | |
| 🔴 Aşırı düşük teklif (tekrar eden) | |
| 🔴 Yüksek alt yüklenici oranı | |
| 🔴 SGK & ücret beyanı çakışması | |

**Her satır:** Entity (Alıcı / Sağlayıcı) · Sebep (kısa) · **İncele** (CTA).

Bu alan **proaktif** olmalı; sadece reaktif değil.

---

## 3. Sağ kolon — Operasyonel akışlar

### A) Manuel onay bekleyenler

- Talep yayın onayı  
- Profil doğrulama (flag’li)  
- Kritik eşleşmeler  

**CTA:** *İncele*

### B) Eşleşme sağlığı (mini metrikler)

- Ortalama teklif sayısı / talep  
- Talep → teklif dönüşüm oranı  
- Uygunsuz teklif oranı  

Algoritmanın “iyi çalışıp çalışmadığı” burada anlaşılır.

---

## 4. Alt bölüm — Son aksiyonlar / log

**Aktivite akışı (örnek satırlar):**
- Admin X → ödeme bildirimi onayladı  
- Admin Y → sağlayıcıyı izlemeye aldı  
- Admin Z → talebi askıya aldı  

Audit & şeffaflık.

---

## 5. Global nav (admin)

Sol sidebar veya üst nav:

- Dashboard  
- Talepler  
- Teklifler  
- Alıcılar  
- Sağlayıcılar  
- Ödeme Davranışı  
- Risk & İnceleme  
- Loglar  
- Ayarlar  

**Menü role göre açılır** (yetkisiz öğeler gizlenir).

---

## Component listesi

- KPI Card  
- Risk / Alert row  
- Queue list  
- Activity log row  
- Sidebar / Top nav  
- Button / Primary · Secondary  

---

## Vizyon kırmızı çizgileri

- ❌ Her şeyi aynı ekranda yapma · Excel gibi tablo · Ham finans verisi  
- ✅ Öncelik · Uyarı · Yönlendirme  

---

## Teslim kriterleri (checklist)

- [ ] Admin 30 sn’de “problem var mı?”yı anlıyor mu?
- [ ] Kritik işler listede mi?
- [ ] Aksiyonlar tek tıkla erişilebilir mi?
- [ ] Gereksiz veri yok mu?

---

## Sonuç

Bu dashboard:
- Admin’i boğmaz  
- Kontrol hissi verir  
- Platformun güvenliğini ve kalitesini korur  

---

## Sonraki adım (MVP’nin son ekranı)

**15. ekran – Admin Liste & İnceleme Ekranları** (Talep / Teklif / Alıcılar / Sağlayıcılar).

Bu tamamlandığında **MVP ekran seti tamamlanmış** olacak.

---

*Admin login: [FIGMA-BRIEF-13-ADMIN-LOGIN.md](FIGMA-BRIEF-13-ADMIN-LOGIN.md). Ödeme inceleme: [FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md](FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md).*
