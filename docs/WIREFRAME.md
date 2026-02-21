# Wireframe: B2B Güvenlik Hizmetleri Platformu

**İlkeler:**
- Talep ekranına girilen her bilgi teklif veren için anlamlı olmalı.
- Bütçeyi alıcı girer; **sağlayıcı görmez**.
- Platform **ihale değil**, **akıllı eşleştirme** mantığında çalışır.

---

## 1. Kayıt Oluşturma Seçim Ekranı (Entry)

| Özellik | Değer |
|--------|--------|
| **Ekran adı** | Firma Türü Seçimi |
| **URL** | `/register` → `register.html` |

**İçerik:**
- **[ Güvenlik Hizmeti Almak İstiyorum ]** — Talep oluşturur, teklif alırım.
- **[ Güvenlik Hizmeti Vermek İstiyorum ]** — Profil oluşturur, teklif veririm.

**Kurallar:**
- Zorunlu seçim: devam etmeden geçilemez (iki karttan biri seçilerek ilerlenir).

---

## 2. Akış: Güvenlik Hizmeti Almak İsteyen (Buyer)

### 2.1 Firma Kayıt Ekranı

| Özellik | Değer |
|--------|--------|
| **Ekran adı** | Alıcı Firma Kaydı |
| **URL** | `/register/buyer` → `register-buyer.html` |

| Alan | Zorunlu | Açıklama | Doğrulama |
|-----|---------|----------|-----------|
| Firma Ünvanı | ✅ | Resmi ticari unvan | Min 5 karakter |
| Vergi No / VKN | ✅ | Fatura & teyit | 10 hane, sadece rakam |
| Yetkili Ad Soyad | ✅ | İletişim kişisi | Harf + boşluk |
| Yetkili E-posta | ✅ | Giriş & bildirim | Geçerli e-posta formatı |
| Telefon | ✅ | Hızlı iletişim | TR format (05XX XXX XX XX) |
| İl / İlçe | ✅ | Hizmet lokasyonu | Dropdown (İl + İlçe) |
| Şifre | ✅ | Hesap güvenliği | Min 8 karakter, en az 1 büyük harf |

**CTA:** Hesap Oluştur → Sonrasında Talep Oluşturma ekranına yönlendir.

---

### 2.2 Talep Oluşturma (Çekirdek Ekran)

| Özellik | Değer |
|--------|--------|
| **Ekran adı** | Güvenlik Hizmeti Talebi |
| **URL** | `/buyer/request/create` → `buyer/request-create.html` |

#### A) Hizmet Bilgileri

| Alan | Zorunlu | Açıklama |
|-----|---------|----------|
| Hizmet Türü | ✅ | Fiziki / Özel / Mobil / Etkinlik |
| Hizmet Süresi | ✅ | 24/7 – Vardiya – Saatlik |
| Başlangıç Tarihi | ✅ | Hizmet başlangıcı |
| Sözleşme Süresi | ⚠️ Opsiyonel | 1 ay – 6 ay – 12 ay |

#### B) Lokasyon & Alan

| Alan | Zorunlu | Açıklama |
|-----|---------|----------|
| Hizmet Lokasyonu | ✅ | İl / İlçe |
| Alan Türü | ✅ | AVM, Site, Ofis, Fabrika, Hastane, Diğer |
| Nokta Sayısı | ✅ | Kaç giriş / kaç bina (sayı) |
| Alan Büyüklüğü | ⚠️ Opsiyonel | m² |

#### C) Personel İhtiyacı

| Alan | Zorunlu | Açıklama |
|-----|---------|----------|
| Personel Sayısı | ✅ | Toplam (sayı) |
| Silahlı / Silahsız | ✅ | Seçim (tek veya çoklu) |
| Özel Nitelik | ⚠️ Opsiyonel | Yabancı dil, kadın personel vb. (metin) |

#### D) Bütçe (Kritik Kural)

| Alan | Zorunlu | Kural |
|-----|---------|--------|
| Aylık Bütçe Aralığı | ✅ | Min–Max (TL); **sadece sistem görür** |
| Bütçe Gizliliği | 🔒 | **Sağlayıcı rakam görmez** |

**Sağlayıcıya gösterilen ifade:**  
“Bu talep sizin fiyat aralığınıza **uygundur**” / “**uygun değildir**”

**CTA:** Talebi Yayınla

---

## 3. Akış: Güvenlik Hizmeti Veren (Provider)

### 3.1 Firma Kayıt Ekranı

| Özellik | Değer |
|--------|--------|
| **Ekran adı** | Sağlayıcı Firma Kaydı |
| **URL** | `/register/provider` → `register-provider.html` |

| Alan | Zorunlu | Açıklama | Doğrulama |
|-----|---------|----------|-----------|
| Firma Ünvanı | ✅ | Ticari unvan | Min 5 karakter |
| Vergi No | ✅ | Resmi kayıt | 10 hane, sadece rakam |
| Yetki Belgesi Var mı | ✅ | ÖGG vb. | Evet / Hayır |
| Yetkili Ad Soyad | ✅ | İrtibat | Harf + boşluk |
| E-posta | ✅ | Giriş | E-posta formatı |
| Telefon | ✅ | İletişim | TR format |
| Şifre | ✅ | Güvenlik | Min 8 karakter, en az 1 büyük harf |

**CTA:** Hesap Oluştur → Sonrasında Firma Profili ekranına yönlendir.

**Not:** Hizmet Verilen Şehirler ve kapasite bilgisi **Firma Profili** ekranında toplanır.

---

### 3.2 Firma Profili (Teklif Öncesi Zorunlu)

| Özellik | Değer |
|--------|--------|
| **Ekran adı** | Firma Profili |
| **URL** | `/provider/profile` → `provider/profile.html` |

#### A) Operasyonel Kapasite

| Alan | Zorunlu | Açıklama |
|-----|---------|----------|
| Hizmet Verilen Şehirler | ✅ | Çoklu seçim (İl listesi) |
| Maks. Personel Kapasitesi | ✅ | Toplam personel sayısı |
| Hizmet Türleri | ✅ | Fiziki, Özel, Mobil, Etkinlik (çoklu) |

#### B) Finansal & Fiyat Mantığı (Eşleştirme İçin)

| Alan | Zorunlu | Kural |
|-----|---------|--------|
| Ortalama Personel Maliyeti | ⚠️ Opsiyonel | Sadece sistem içi; eşleştirmede kullanılır |
| Min Aylık İş Büyüklüğü (TL) | ✅ | Eşleştirme için alt sınır |
| Max Aylık İş Büyüklüğü (TL) | ✅ | Eşleştirme için üst sınır |

#### C) Referans & Güven

| Alan | Zorunlu | Açıklama |
|-----|---------|----------|
| Referanslı İş Var mı | ⚠️ Opsiyonel | Evet / Hayır |
| Belgeler (PDF) | ⚠️ Opsiyonel | Lisans, sertifika yükleme |

**CTA:** Tekliflere Açık Hale Gel

---

### 3.3 Talep Görüntüleme (Bütçe Görünmez)

| Özellik | Değer |
|--------|--------|
| **Ekran adı** | Uygun Talepler |
| **URL** | `/provider/requests` → `provider/requests.html` |

**Sağlayıcıya gösterilenler:**
- Lokasyon (İl / İlçe)
- Hizmet türü
- Personel sayısı
- Süre (sözleşme / vardiya bilgisi)

**Bütçe yerine gösterilen:**
- 🟢 “Bu talep fiyat politikanıza **uygundur**”
- 🔴 “Bu talep fiyat politikanıza **uygun değildir**”

**CTA:** Teklif Ver (satır veya kart bazlı)

---

### 3.4 Teklif Verme Ekranı

| Özellik | Değer |
|--------|--------|
| **Ekran adı** | Teklif Ver |
| **URL** | `/provider/request/:id/offer` → `provider/offer.html` |

| Alan | Zorunlu | Açıklama |
|-----|---------|----------|
| Aylık Teklif Bedeli (TL) | ✅ | Sayı |
| Hizmet Açıklaması | ✅ | Metin (kapsam, koşullar) |
| Başlangıç Süresi | ⚠️ Opsiyonel | İşe başlama süresi (örn. X gün içinde) |
| Ek Notlar | ⚠️ Opsiyonel | Serbest metin |

**CTA:** Teklifi Gönder

---

## 4. Kritik Platform Kuralları (Vizyonla Uyumlu)

| Kural | Açıklama |
|-------|----------|
| ✔️ Bütçe gizliliği | Alıcı bütçeyi girer; **karşı tarafa açıklanmaz**. |
| ✔️ Eşleştirme, ihale değil | Sağlayıcı fiyatına göre **sıralanmaz / filtrelenmez**; sadece “uygun / uygun değil” gösterilir. |
| ✔️ Anlamlı talep | Talep ekranındaki her alan, teklif veren için **gereklidir** (bilinçli teklif). |
| ✔️ Karar destek | Platform **ihale** değil, **akıllı eşleştirme ve karar destek** sistemidir. |

---

## 5. Özet Akış Şeması

```
[ Landing ]
    → Kayıt Ol → [ Firma Türü Seçimi ]
                    ├→ Alıcı → [ Alıcı Firma Kaydı ] → [ Talep Oluştur ] → Talebi Yayınla
                    └→ Sağlayıcı → [ Sağlayıcı Firma Kaydı ] → [ Firma Profili ] → Tekliflere Açık
                                        ↓
                               [ Uygun Talepler ] → [ Teklif Ver ] → Teklifi Gönder
```

---

## 6. Sonraki Adımlar (Öneri)

- **ER diyagram / veri modeli** — Entity’ler ve ilişkiler
- **Eşleştirme algoritması** — Bütçe aralığı ↔ sağlayıcı min/max puanlama mantığı
- **Ana sayfa sloganı & değer önerisi** — Metin ve CTA
- **Figma UI prompt** — Bu wireframe’e göre ekran tasarımı
