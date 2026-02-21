# Giriş (login) akışı

Kayıt sonrası giriş yapıldığında sistemin adım adım ne yaptığı ve rol bazlı yönlendirme.

---

## 1. Giriş ekranı

- **Alanlar:** E-posta, Şifre  
- **CTA:** Giriş Yap  
- **Rol seçimi yok.** Rol bilgisi kayıt sırasında veritabanına yazıldığı için girişte tekrar sorulmaz.

---

## 2. Sistemin kontrolleri (backend)

Giriş isteği başarılı olunca backend şunları kontrol eder:

| Kontrol | Açıklama |
|--------|----------|
| Hesap var mı? | E-posta + şifre doğrulaması |
| Hesap aktif mi? | status ≠ suspended |
| Firma durumu | active / pending / suspended |
| **Rol** | `companies.role` → BUYER veya PROVIDER (veritabanından okunur, ekrandan değil) |

---

## 3. Otomatik yönlendirme

Rol bilgisine göre tek doğru ekrana yönlendirilir:

| Rol | Yönlendirme |
|-----|-------------|
| **BUYER** | Alıcı dashboard → Talep oluştur, Açık taleplerim, Gelen teklifler |
| **PROVIDER** | Sağlayıcı dashboard → Uygun talepler, Teklif verdiklerim, Profil |

- Yanlış dashboard’a girmek mümkün olmamalı (URL ile erişim denense bile yetki reddedilir).
- Bu ayrım vizyonla uyumludur; ihale mantığı veya rol karmaşası yaratmaz.

---

## 4. Yetki kuralları

| Rol | Yapabilir | Yapamaz |
|-----|-----------|---------|
| Alıcı | Talep açmak, gelen teklifleri görmek/kabul etmek | Teklif vermek |
| Sağlayıcı | Uygun talepleri görmek, teklif vermek, profili güncellemek | Talep açmak |

API seviyesinde bu kurallar zorunludur.

---

## 5. Demo (mevcut statik sürüm)

- Backend olmadığı için girişte e-posta/şifre doğrulanmaz.
- Kayıt sırasında seçilen rol `localStorage.demo_role` ile saklanır; giriş sonrası bu değere göre ilgili dashboard’a yönlendirilir.
- Farklı cihazda veya kayıt yapılmamış tarayıcıda girişte “Demo: Alıcı / Sağlayıcı paneline git” seçeneği gösterilir.

---

## 6. Açık ürün kararları (netleştirilecek)

| Konu | Seçenekler |
|------|------------|
| **İlk girişte onboarding** | İlk kez giriş yapan kullanıcıya kısa “Hoş geldiniz” + “Talep oluşturun” / “Profilinizi tamamlayın” yönlendirmesi yapılsın mı? |
| **Profil tamamlanmadan işlem** | Sağlayıcı profilini tamamlamadan “Uygun talepler”e erişemesin mi? (Teklif öncesi profil zorunlu; liste görüntüleme de kısıtlansın mı?) |

Bu iki konu ürün kararı olarak ileride netleştirilir.
