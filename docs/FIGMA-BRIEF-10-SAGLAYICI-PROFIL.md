# Figma çizim brief’i — 10. Ekran: Sağlayıcı Profil & Profil Tamamlama (Provider Profile)

**Amaç:** Sağlayıcının sisteme “girmek için” değil; **sistemde ciddiye alınmak için** gerekli bilgileri tamamlamasını sağlamak.

- ❌ CV ekranı değil  
- ❌ Belge yükleme ekranı değil (MVP)  
- ❌ Kendini pazarlama alanı değil  
- ✅ **Yeterlilik & uyum** ekranı  

**Durum:** ✔️ Tamamlandı & güncel; kilitli brief.

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 10 · [SGK-URET-VERGISI-ZORUNLU-KRITER.md](SGK-URET-VERGISI-ZORUNLU-KRITER.md).

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Layout** | Sol içerik (%70) / Sağ durum paneli (%30) |
| **Background** | Açık |

---

## Genel sayfa yapısı

```
| Profil alanları (Sol – ~%70)  | Profil durumu (Sağ – ~%30) |
```

---

## 1. Sayfa başlığı

- **Başlık (H1):** *Sağlayıcı Profili*
- **Alt metin:** *Profiliniz, yalnızca uygun taleplerle eşleşmeniz için kullanılır.*

Pazarlama dili yok → güven dili var.

---

## 2. Sol kolon — Profil bölümleri (form)

Profil **5 ana blok**tan oluşur; her blok tek başına anlamlı, birlikte filtre motorudur.

### A) Firma bilgileri (zorunlu)

| Alan | UI | Zorunlu | Not |
|------|-----|---------|-----|
| Firma ünvanı | Text | ✅ | |
| Vergi türü | Dropdown | ✅ | |
| Vergi no | Text | ✅ | |
| Faaliyet ili | Dropdown | ✅ | |
| Hizmet verilen iller | Multi-select | ✅ | |
| Firma büyüklüğü (personel) | Dropdown | ⚠️ | |

**Amaç:** Lokasyon & kapasite filtresi.

---

### B) Yasal & yetki bilgileri (zorunlu)

| Alan | UI | Zorunlu | Not |
|------|-----|---------|-----|
| Özel güvenlik faaliyet izni | Checkbox | ✅ | |
| Silahlı güvenlik yetkisi | Checkbox | ⚠️ | Silahlı talepler eşleşir / eşleşmez |
| 5188 uygunluk beyanı | Checkbox | ✅ | |

**UX kuralı:** Silahlı yetki işaretliyse silahlı talepler eşleşir; değilse asla.

---

### C) Personel & ücret uyumu (zorunlu – kritik)

**Personel yapısı:**

| Alan | UI | Zorunlu |
|------|-----|---------|
| Toplam personel sayısı | Numeric | ✅ |
| Silahlı / silahsız oranı | Numeric | ⚠️ |
| Yedek personel planı | Checkbox | ⚠️ |

**Ücret, SGK & vergi beyanı (zorunlu):**

- ☑️ *Personel maaşları, SGK primleri ve ücret vergileri yasal süresinde ve düzenli olarak ödenmektedir.*  
- **Checkbox zorunlu.** İşaretlenmezse profil %100 olmaz, teklif verilemez.

**Micro-copy (alt):** *Bu beyan, platform içi kalite ve uyum değerlendirmesi için kullanılır.*

---

### D) Operasyonel yetenekler (zorunlu / opsiyonel karışık)

| Alan | UI | Zorunlu |
|------|-----|---------|
| Denetim mekanizması | Dropdown | ⚠️ |
| Süpervizör yapısı | Dropdown | ⚠️ |
| Raporlama sıklığı | Dropdown | ⚠️ |
| Dijital sistemler | Multi-select | ❌ QR devriye, Mobil uygulama, Kamera entegrasyonu |

**Amaç:** Kalite farkı yaratmak.

---

### E) Referans & deneyim (opsiyonel)

| Alan | UI |
|------|-----|
| Hizmet verilen sektörler | Multi-select |
| Büyük ölçekli müşteri | Checkbox |
| Devam eden sözleşmeler | Checkbox |

**Not:** MVP’de belge yok → beyan var.

---

## 3. Sağ kolon — Profil durum paneli (çok önemli)

### Profil tamamlama kartı

- **Progress bar** (%)  
- Tamamlanan / eksik bölümler  
- “Eksik alanlar” listesi  
- **CTA:** *Eksik Bilgileri Tamamla*  

**Kritik kural (kilit):** Profil %100 olmadan **Teklif Ver** ve **Uygun Talepler** aktif olmaz.

### Bilgilendirme kutusu

*Profil bilgileriniz yalnızca eşleşme ve değerlendirme amacıyla kullanılır. Diğer firmalarla paylaşılmaz.*

---

## 4. Kaydetme & durumlar

**CTA’lar:**
- *Kaydet*
- *Kaydet ve Devam Et*

**State’ler:**
- Kaydedildi  
- Eksik alan uyarısı  
- Zorunlu checkbox eksik  

---

## Component listesi

- Form / Section  
- Input / Text  
- Select / Dropdown  
- Checkbox / Required  
- Progress Bar  
- Info Box  
- Button / Primary · Disabled  

---

## Vizyon kırmızı çizgileri

- ❌ Belge yükleme (MVP) · Serbest metinle “kendini övme” · Pazarlama cümleleri  
- ✅ Beyan · Filtrelenebilir veri · Operasyonel gerçeklik  

---

## Teslim kriterleri (checklist)

- [ ] Profil tamamlanmadan teklif verilebiliyor mu? → **Hayır** olmalı  
- [ ] SGK & ücret beyanı zorunlu mu? → **Evet**  
- [ ] Bilgiler eşleşme için yeterli mi?  
- [ ] Ekran sade mi?  

---

## Sonuç

Bu ekran sayesinde:
- Sağlayıcı ciddiyet filtresinden geçer  
- Kalitesiz firma sistemde tutunamaz  
- Admin yükü azalır  
- Alıcı memnuniyeti artar  

---

## Sonraki adım

**11. ekran – Uygun Talepler Listesi (Sağlayıcı)** — algoritmanın UI karşılığı.

---

*Ekran 9 (Dashboard) bu profili besler: profil %100 değilse teklif pasif. [FIGMA-BRIEF-09-SAGLAYICI-DASHBOARD.md](FIGMA-BRIEF-09-SAGLAYICI-DASHBOARD.md).*
