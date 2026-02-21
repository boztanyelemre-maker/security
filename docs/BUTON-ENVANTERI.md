# Buton envanteri — özet

Şu ana kadar konuşulan akışlardaki **temel (mantıksal) butonlar**. UI içi küçük linkler/ikonlar sayılmadı.

---

## 1. Genel (herkese açık — giriş öncesi)

| # | Buton | Ne yapar |
|---|--------|----------|
| 1 | **Kayıt Ol** | Rol seçimi ekranına gider |
| 2 | **Giriş Yap** | Login ekranına gider |
| 3 | **Admin** | Admin login ekranına gider |

**Toplam: 3 buton**

---

## 2. Kayıt Ol akışı

**Rol seçimi**

| # | Buton | Ne yapar |
|---|--------|----------|
| 4 | **Güvenlik Hizmeti Almak İstiyorum** | Alıcı kayıt formuna gider |
| 5 | **Güvenlik Hizmeti Vermek İstiyorum** | Sağlayıcı kayıt formuna gider |

**Kayıt formları**

| # | Buton | Ne yapar |
|---|--------|----------|
| 6 | **Hesap Oluştur** (Alıcı) | Alıcı kaydı; sonrası talep/dashboard |
| 7 | **Hesap Oluştur** (Sağlayıcı) | Sağlayıcı kaydı; sonrası profil tamamla |

**Toplam: 4 buton**

---

## 3. Alıcı (Buyer) tarafı

| # | Buton | Açıklama |
|---|--------|----------|
| 8 | **Talep Oluştur** | Yeni güvenlik talebi açar |
| 9 | **Talebi Yayınla** | Talebi sağlayıcılara açar |
| 10 | **Teklifleri Gör** | Gelen teklifleri listeler |
| 11 | **Çıkış Yap** | Oturumu kapatır |

**Toplam: 4 buton**

---

## 4. Sağlayıcı (Provider) tarafı

| # | Buton | Açıklama |
|---|--------|----------|
| 12 | **Profilini Tamamla** | Teklif verebilmek için zorunlu |
| 13 | **Uygun Talepleri Gör** | Eşleşen talepler listesi |
| 14 | **Teklif Ver** | Talebe fiyat gönderir |
| 15 | **Çıkış Yap** | Oturumu kapatır |

**Toplam: 4 buton**

---

## 5. Admin paneli

**Dashboard & listeler**

| # | Buton | Ne yapar |
|---|--------|----------|
| 16 | **Alıcılar** | Alıcı firmalar listesine gider |
| 17 | **Sağlayıcılar** | Sağlayıcı firmalar listesine gider |
| 18 | **Talepler** | Talepler listesine gider |
| 19 | **Teklifler** | Teklifler listesine gider |
| 20 | **İnceleme Kuyruğu** | İnceleme bekleyen sağlayıcılar |

**Detay ekranları — aksiyonlar**

| # | Buton | Açıklama |
|---|--------|----------|
| 21 | **Detay Gör** | Firma detay sayfasına gider |
| 22 | **Onayla** | Belge/uyumluluk onayı |
| 23 | **Pasife Al** | Hesabı askıya al (sebep zorunlu) |
| 24 | **Aktif Et** | Hesabı tekrar aktif eder |
| 25 | **Not Ekle** | Admin içi not kaydeder |

**Toplam: 10 buton**

---

## Genel toplam

| Alan | Buton sayısı |
|------|----------------|
| Giriş öncesi | 3 |
| Kayıt Ol akışı | 4 |
| Alıcı | 4 |
| Sağlayıcı | 4 |
| Admin | 10 |
| **TOPLAM** | **25 buton** |

---

## Vizyon kontrolü

- Fazla / karmaşık / ihale benzeri buton yok.
- “Fiyat gör”, “bütçe aç” gibi riskli buton yok.
- Her buton tek sorumluluk taşıyor; B2B, sade, kurumsal, ölçeklenebilir.
- Bu sayı MVP için uygun.

---

## MVP ayrımı (v1 / v2 öneri)

| Aşama | Butonlar | Not |
|--------|----------|-----|
| **v1 (ilk canlı)** | 1–11, 12–15, 16–17, 21, 23–25 | Giriş, kayıt, alıcı/sağlayıcı akışı, admin giriş + Alıcılar/Sağlayıcılar listesi, Detay Gör, Pasife Al, Aktif Et, Not Ekle. Talepler/Teklifler/İnceleme kuyruğu ve Onayla v2. |
| **v2** | 18–20, 22 | Talepler, Teklifler, İnceleme Kuyruğu listeleri; Onayla (belge/uyumluluk). |

İstersen v1/v2 sınırı iş gereksinimine göre kaydırılabilir (örn. İnceleme Kuyruğu v1’e alınabilir).

---

## Doğrulama: Buton analizi özeti

- **Kullanıcı tipleri net:** Alıcı (Buyer), Sağlayıcı (Provider), Admin.
- **Her tip için:** Hangi aksiyonlar → hangi butonlar cevaplandı.
- **Her buton = tek aksiyon;** gereksiz, tekrarlayan veya vizyona aykırı buton yok.
- **25 ana buton** tanımlı; MVP için uygun sayı.
- Butonlar **akışa**, **role** ve **Figma hiyerarşisine** yerleştirildi.

**Stratejik anlam:** Bilinçli ürün tasarımı, MVP’nin şişmemesi, vizyonun korunması. Buton analizi yapılmadan ilerleseydi UI şişer, yetki karmaşası ve ihale mantığına kayma riski artardı. Bu eşik geçildi.
