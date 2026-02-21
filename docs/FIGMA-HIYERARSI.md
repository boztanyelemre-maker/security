# Figma hiyerarşisi — 25 buton

25 butonun Figma’da **Frame / Page / Component** mantığıyla yerleştirilmesi. Tasarım ve geliştirme aynı dili konuşur. Vizyonla uyumlu; fiyat/bütçe/ihale çağrışımı yok.

---

## PAGE 1 — Public / Landing

**Frame:** Landing Page

| Konum | Buton | Figma yolu |
|--------|--------|------------|
| Top Bar (Header) | Kayıt Ol | Header / Button / Primary |
| Top Bar (Header) | Giriş Yap | Header / Button / Secondary |
| Header veya Footer | Admin | Header / Link / Admin (küçük, text link) |

---

## PAGE 2 — Auth

**Frame:** Register – Role Selection

| Buton | Figma yolu |
|--------|------------|
| Güvenlik Hizmeti Almak İstiyorum (kart) | Auth / Card Button / Buyer |
| Güvenlik Hizmeti Vermek İstiyorum (kart) | Auth / Card Button / Provider |

**Frame:** Register – Buyer  
- Hesap Oluştur → **Auth / Button / Submit**

**Frame:** Register – Provider  
- Hesap Oluştur → **Auth / Button / Submit**

**Frame:** Login  
- (E-posta, Şifre alanları)  
- Giriş Yap → aynı Submit component (sayıda #2 olarak zaten var)

---

## PAGE 3 — Buyer Panel

**Frame:** Buyer Dashboard

| Buton | Figma yolu |
|--------|------------|
| Talep Oluştur | Buyer / Button / Primary |
| Teklifleri Gör | Buyer / Button / Secondary |
| Çıkış Yap (Header / profil menüsü) | Global / Button / Logout |

**Frame:** Create Request (Talep Oluşturma)

| Buton | Figma yolu |
|--------|------------|
| Talebi Yayınla | Buyer / Button / Publish |

---

## PAGE 4 — Provider Panel

**Frame:** Provider Dashboard

| Buton | Figma yolu |
|--------|------------|
| Profilini Tamamla | Provider / Button / Primary |
| Uygun Talepleri Gör | Provider / Button / Secondary |
| Çıkış Yap | Global / Button / Logout |

**Frame:** Request Detail (Talep detayı — teklif verme)

| Buton | Figma yolu |
|--------|------------|
| Teklif Ver | Provider / Button / Offer |

---

## PAGE 5 — Admin

**Frame:** Admin Login  
- Admin E-posta + Şifre  
- Giriş butonu → aynı Submit (yetki farklı, UI aynı)

**Frame:** Admin Dashboard

| Buton | Figma yolu |
|--------|------------|
| Alıcılar | Admin / Sidebar / Nav Button |
| Sağlayıcılar | Admin / Sidebar / Nav Button |
| Talepler | Admin / Sidebar / Nav Button |
| Teklifler | Admin / Sidebar / Nav Button |
| İnceleme Kuyruğu | Admin / Sidebar / Nav Button |

**Frame:** Admin – List (liste satırı / detay girişi)

| Buton | Figma yolu |
|--------|------------|
| Detay Gör | Admin / Button / Detail |

**Frame:** Admin – Actions (detay sayfası aksiyonları)

| Buton | Figma yolu |
|--------|------------|
| Onayla | Admin / Button / Approve |
| Pasife Al | Admin / Button / Danger |
| Aktif Et | Admin / Button / Success |
| Not Ekle | Admin / Button / Secondary |

---

## Component stratejisi (önemli)

**Yapılması gereken:** 25 ayrı buton çizmemek; **tek component set** ile metin/ikon değiştirerek kullanmak.

**Önerilen ana component set:**

| Component | Kullanım |
|-----------|----------|
| Button / Primary | Kayıt Ol, Talep Oluştur, Profilini Tamamla, Hesap Oluştur, Giriş Yap |
| Button / Secondary | Giriş Yap, Teklifleri Gör, Uygun Talepleri Gör, Not Ekle |
| Button / Danger | Pasife Al |
| Button / Success | Aktif Et, Onayla |
| Button / Card | Almak İstiyorum, Vermek İstiyorum (kart buton) |
| Button / Nav | Admin sidebar: Alıcılar, Sağlayıcılar, Talepler, Teklifler, İnceleme Kuyruğu |
| Button / Logout | Çıkış Yap (alıcı + sağlayıcı + admin) |
| Button / Publish | Talebi Yayınla |
| Button / Offer | Teklif Ver |
| Button / Detail | Detay Gör |
| Link / Admin | Admin (küçük text link) |

Varyantlar: sadece **label + icon** değişir; renk/boyut bu setten türetilir.

---

## Vizyon kontrolü

- Fiyat / bütçe / ihale çağrışımı yapan buton yok.
- “Teklifleri sırala (ucuzdan pahalıya)” gibi riskli aksiyon yok.
- Her buton tek iş yapıyor; Admin = denetim, kullanıcı = iş.
- Kurumsal, yatırımcıya anlatılabilir, geliştirilebilir yapı.

---

## Kopyala-yapıştır: Figma / Cursor promptu

Aşağıdaki metni Figma’da “AI” veya Cursor’da tasarım brief’i olarak kullanabilirsin.

```
Proje: B2B güvenlik hizmeti pazar yeri. 25 buton, 5 sayfa.

PAGE 1 — Landing
- Header: Primary buton "Kayıt Ol", Secondary buton "Giriş Yap", küçük link "Admin".
- Component: Button/Primary, Button/Secondary, Link/Admin.

PAGE 2 — Auth
- Rol seçimi: İki kart buton — "Güvenlik Hizmeti Almak İstiyorum", "Güvenlik Hizmeti Vermek İstiyorum". Component: Card Button.
- Kayıt (Alıcı/Sağlayıcı): Form + "Hesap Oluştur" (Submit). Login: E-posta, Şifre + "Giriş Yap" (Submit).

PAGE 3 — Buyer Panel
- Dashboard: "Talep Oluştur" (Primary), "Teklifleri Gör" (Secondary), "Çıkış Yap" (Logout).
- Talep oluşturma ekranı: "Talebi Yayınla" (Publish).

PAGE 4 — Provider Panel
- Dashboard: "Profilini Tamamla" (Primary), "Uygun Talepleri Gör" (Secondary), "Çıkış Yap" (Logout).
- Talep detay: "Teklif Ver" (Offer).

PAGE 5 — Admin
- Login: E-posta, Şifre + giriş butonu.
- Dashboard sidebar: Alıcılar, Sağlayıcılar, Talepler, Teklifler, İnceleme Kuyruğu (Nav Button).
- Liste: "Detay Gör" (Detail).
- Detay aksiyonları: "Onayla" (Success), "Pasife Al" (Danger), "Aktif Et" (Success), "Not Ekle" (Secondary).

Component set: Primary, Secondary, Danger, Success, Card, Nav, Logout, Publish, Offer, Detail, Link/Admin. Tek set; sadece label ve icon değişir. B2B, sade, kurumsal stil. Fiyat/bütçe/ihale çağrışımı yok.
```

Bu prompt ile sayfalar ve component’ler birebir oluşturulabilir.
