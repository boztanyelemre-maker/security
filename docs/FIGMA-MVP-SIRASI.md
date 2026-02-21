# Figma — 15 MVP ekran çizim sırası

**Amaç:** Figma’da 15 MVP ekranını hangi sırayla çizeceğini, neden o sıra olduğunu ve her ekranda neyi netleştirmen gerektiğini uygulamaya hazır vermek.

**Sıra mantığı:** Akış → karar → tekrar kullanım → hız (rastgele değil).

**Referans:** [SCREEN-INVENTORY.md](SCREEN-INVENTORY.md), [WIREFRAME.md](WIREFRAME.md), [MVP-TAM-KAPSAM.md](MVP-TAM-KAPSAM.md).

---

## Ekran durumu (özet)

| | Sayı | Açıklama |
|---|-----|----------|
| **MVP toplam** | **15 ekran** | Tam MVP kapsamı |
| **Tamamlanan** | **15 ekran** | Tüm MVP ekranları; brief’ler kilitlendi |
| **Kalan** | **0** | MVP ekran seti tamamlandı |

✅ MVP’nin **15 ekranı tamamlandı**. Figma’ya birebir çizilebilir; backend & frontend aynı dili konuşuyor.

---

## Önce hazırlanacaklar (component set)

Çizime girmeden önce:

- **Button** (primary, secondary, danger, ghost)
- **Input** (text, email, password, number); label, placeholder, hata metni
- **Select / Dropdown** (tek seçim)
- **Card** (liste kartı, özet kartı)
- **Table** (header + satır; admin listeler için)
- **Badge** (durum: Uygun, Uygun Değil, Taslak, Yayında, Kapalı)
- **Modal** (onay, uyarı)

**Durumlar:** boş, loading, hata, başarılı (form için).

---

## A. Public & Auth (önce bunlar)

### 1. Landing Page

**Neden önce?** Ürünün dili, tonu, CTA hiyerarşisi burada belirlenir.

**Netleşecekler:**
- Ana değer önerisi
- Primary CTA: Kayıt Ol
- Secondary CTA: Giriş Yap
- Basit header / footer

**URL:** `/`

---

### 2. Kayıt – Rol Seçimi

**Neden?** Tüm mimarinin kilit kararı burada.

**Netleşecekler:**
- Alıcı kartı
- Sağlayıcı kartı
- Seçim sonrası yön

**URL:** `/register`

---

### 3. Alıcı Kayıt

**Neden önce alıcı?** Talep olmadan sistem çalışmaz.

**Netleşecekler:**
- Firma alanları (ünvan, VKN, yetkili ad/email/telefon, il-ilçe, şifre)
- Zorunlu / opsiyonel ayrımı
- Hata mesajları

**URL:** `/register/buyer` · Detay: [WIREFRAME.md](WIREFRAME.md) §2.1

---

### 4. Sağlayıcı Kayıt

**Neden şimdi?** Alıcıyla aynı UI pattern’lerini reuse edersin.

**Netleşecekler:**
- Firma alanları
- Yetki / belge uyarı metni
- Profil tamamlama mesajı

**URL:** `/register/provider` · Detay: [WIREFRAME.md](WIREFRAME.md) §3.1

---

### 5. Giriş Yap

**Neden erken?** Auth layout’u tüm panellerde tekrar edilir.

**Netleşecekler:**
- Login state’leri
- Hata / loading / disabled

**URL:** `/login`

---

## B. Alıcı (Buyer) ekranları — core flow

### 6. Alıcı Dashboard

**Neden şimdi?** Alıcının dünyasını tanımlarsın.

**Netleşecekler:**
- “Talep Oluştur” CTA
- Açık talepler özeti
- Gelen teklif sayısı

**URL:** `/buyer/dashboard`

---

### 7. Talep Oluşturma (CORE SCREEN)

**En kritik ekran.** Bu ekran netleşmeden hiçbir backend yazılmamalı.

**Netleşecekler:**
- Alan grupları (hizmet türü/süre, başlangıç, lokasyon, alan türü, nokta sayısı, personel, silahlı/silahsız)
- Bütçe alanının gizli olduğu mesaj (min–max TL; sadece sistem görür)
- Zorunlu alan validasyonları

**URL:** `/buyer/request/create` · Detay: [WIREFRAME.md](WIREFRAME.md) §2.2

---

### 8. Talep Detayı (Alıcı)

**Neden?** Teklif değerlendirme deneyimi burada.

**Netleşecekler:**
- Talep özeti (bütçe alıcıya görünür)
- Teklif listesi
- Sağlayıcı bilgisi (kontrollü)
- Aksiyonlar (MVP’de kabul/red olmayabilir — sadece görüntüleme)

**URL:** `/buyer/request/:id`

---

## C. Sağlayıcı (Provider) ekranları

### 9. Sağlayıcı Dashboard

**Neden?** Sağlayıcı motivasyonunu ve uyarıları gösterir.

**Netleşecekler:**
- Profil durumu uyarısı
- Uygun talep sayısı
- Ana CTA (Uygun Taleplere Git)

**URL:** `/provider/dashboard`

---

### 10. Sağlayıcı Profil

**Neden şimdi?** Teklif verebilmenin ön koşulu.

**Netleşecekler:**
- Kapasite alanları (max personel)
- Hizmet şehirleri
- Hizmet türleri
- “Profil tamamlanmadan teklif veremezsin” state’i

**URL:** `/provider/profile`

---

### 11. Uygun Talepler Listesi

**Neden?** Eşleştirme mantığının UI karşılığı.

**Netleşecekler:**
- “Uygun” / “Uygun Değil” etiketi
- Bütçesiz ama yeterli bilgi gösterimi
- Liste / card tasarımı

**URL:** `/provider/requests`

---

### 12. Talep Detayı (Sağlayıcı) / Teklif Ver

**Neden ayrı?** Alıcıdan farklı bilgi seti; bütçe yok.

**Netleşecekler:**
- Teklif verme CTA
- Talep detay hiyerarşisi
- Riskli alanların (bütçe!) olmaması
- Teklif formu: fiyat, not

**URL:** `/provider/requests/:id`

---

## D. Admin (minimum MVP)

### 13. Admin Login

**Neden şimdi?** Admin layout, tüm admin ekranlarının temelidir.

**Netleşecekler:**
- E-posta, şifre (sadece role=ADMIN)

**URL:** `/admin/login`

---

### 14. Admin Dashboard

**Neden?** KPI ve navigasyon çerçevesi.

**Netleşecekler:**
- Alıcı sayısı
- Sağlayıcı sayısı
- Aktif talep sayısı
- Hızlı erişim linkleri (Alıcılar / Sağlayıcılar)

**URL:** `/admin/dashboard`

---

### 15. Admin – Alıcı & Sağlayıcı Listeleri

MVP’de tek layout, iki sekme veya iki ayrı sayfa olabilir.

**Netleşecekler:**
- **Alıcılar:** Liste kolonları (firma, vergi no, il, durum); Pasife al / Aktif et; sebep zorunlu; detay linki
- **Sağlayıcılar:** Liste kolonları (firma, şehirler, profil tamam mı, durum); Pasife al / Aktif et + sebep

**URL:** `/admin/buyers`, `/admin/providers`

---

## Çizim stratejisi (altın kural)

- **Hepsini aynı anda çizme.** Bu sırayla tek tek tamamla.
- **Her ekran için:** Alan listesi · Zorunlu/opsiyonel · Empty / error state.

**Çizim sonrası:**
- Tıklanabilir prototype: Kayıt → Giriş → Dashboard → Talep oluştur / Teklif ver; Admin login → listeler.
- Vizyon kontrolü: Bütçe sadece alıcı ekranlarında; sağlayıcıda “Uygun/Uygun Değil” var, rakam yok. İhale/fiyat karşılaştırma ekranı yok.

---

## Sonuç

Bu 15 ekran:
- MVP’nin %100’ünü kapsar
- Backend’i kilitlemeden ilerletir
- Vizyonu bozmadan ürün çıkarır

---

## Sonraki adım seçenekleri

| Seçenek | Açıklama |
|--------|----------|
| **1. ekran (Landing Page)** | Birebir Figma çizim brief’i → **[FIGMA-BRIEF-01-LANDING.md](FIGMA-BRIEF-01-LANDING.md)** ✅ |
| **2. ekran (Rol Seçimi)** | Figma brief’i → **[FIGMA-BRIEF-02-ROL-SECIMI.md](FIGMA-BRIEF-02-ROL-SECIMI.md)** ✅ |
| **3. ekran (Alıcı Kayıt)** | Figma brief’i → **[FIGMA-BRIEF-03-ALICI-KAYIT.md](FIGMA-BRIEF-03-ALICI-KAYIT.md)** ✅ |
| **4. ekran (Sağlayıcı Kayıt)** | Figma brief’i → **[FIGMA-BRIEF-04-SAGLAYICI-KAYIT.md](FIGMA-BRIEF-04-SAGLAYICI-KAYIT.md)** ✅ |
| **5. ekran (Giriş Yap)** | Figma brief’i → **[FIGMA-BRIEF-05-GIRIS-YAP.md](FIGMA-BRIEF-05-GIRIS-YAP.md)** ✅ |
| **6. ekran (Alıcı Dashboard)** | Figma brief’i → **[FIGMA-BRIEF-06-ALICI-DASHBOARD.md](FIGMA-BRIEF-06-ALICI-DASHBOARD.md)** ✅ |
| **7. ekran (Talep Oluşturma)** | Figma brief’i → **[FIGMA-BRIEF-07-TALEP-OLUSTURMA.md](FIGMA-BRIEF-07-TALEP-OLUSTURMA.md)** ✅ |
| **8. ekran (Talep Detayı – Alıcı)** | Figma brief’i → **[FIGMA-BRIEF-08-TALEP-DETAYI-ALICI.md](FIGMA-BRIEF-08-TALEP-DETAYI-ALICI.md)** ✅ |
| **9. ekran (Sağlayıcı Dashboard)** | Figma brief’i → **[FIGMA-BRIEF-09-SAGLAYICI-DASHBOARD.md](FIGMA-BRIEF-09-SAGLAYICI-DASHBOARD.md)** ✅ |
| **10. ekran (Sağlayıcı Profil)** | Figma brief’i → **[FIGMA-BRIEF-10-SAGLAYICI-PROFIL.md](FIGMA-BRIEF-10-SAGLAYICI-PROFIL.md)** ✅ |
| **11. ekran (Uygun Talepler Listesi)** | Figma brief’i → **[FIGMA-BRIEF-11-UYGUN-TALEPLER-LISTESI.md](FIGMA-BRIEF-11-UYGUN-TALEPLER-LISTESI.md)** ✅ |
| **12. ekran (Talep Detayı Sağlayıcı)** | Figma brief’i → **[FIGMA-BRIEF-12-TALEP-DETAYI-SAGLAYICI.md](FIGMA-BRIEF-12-TALEP-DETAYI-SAGLAYICI.md)** ✅ |
| **13. ekran (Admin Login)** | Figma brief’i → **[FIGMA-BRIEF-13-ADMIN-LOGIN.md](FIGMA-BRIEF-13-ADMIN-LOGIN.md)** ✅ |
| **14. ekran (Admin Dashboard)** | Figma brief’i → **[FIGMA-BRIEF-14-ADMIN-DASHBOARD.md](FIGMA-BRIEF-14-ADMIN-DASHBOARD.md)** ✅ |
| **15. ekran (Admin Liste & İnceleme)** | Figma brief’i → **[FIGMA-BRIEF-15-ADMIN-LISTE-INCELEME.md](FIGMA-BRIEF-15-ADMIN-LISTE-INCELEME.md)** ✅ |

Hangisinden başlanacağı seçilir.

---

*Paralel: [API-KONTRAT-SABLONU.md](API-KONTRAT-SABLONU.md). Sıra kararı: [TASARIM-KODLAMA-SIRASI.md](TASARIM-KODLAMA-SIRASI.md).*
