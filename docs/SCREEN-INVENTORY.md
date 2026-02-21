# Sayfa bazlı ekran analizi (Screen Inventory)

Ürünün haritası: kaç ekran var, kim görür, ne işe yarar. Buton analizinin doğal devamı. Vizyonla uyumlu; ihale/fiyat kırdırma çağrışımı yapan ekran yok.

**MVP tanımı:** [docs/MVP-TANIM.md](MVP-TANIM.md) — MVP nedir, bu projede neler dahil/neler dahil değil.

---

## Genel kurallar

- Her ekranın **tek ana amacı** var.
- Her ekran **rol bazlı** (Public / Alıcı / Sağlayıcı / Admin).
- Gereksiz “herkese açık” ekran yok.
- İhale / fiyat kırdırma çağrışımı yapan ekran **yok**.

---

## A. Public (giriş öncesi) ekranlar

| # | Ekran | URL | Kim görür? | Amaç |
|---|--------|-----|------------|------|
| 1 | **Landing Page** | `/` | Herkes | Platformu anlatmak + aksiyon (Kayıt Ol, Giriş Yap, Admin). Değer önerisi. Fazlası yok (blog, fiyat tablosu vb. şimdilik yok). |
| 2 | **Rol Seçimi** | `/register` | Kayıt olmak isteyen | Kullanıcıyı doğru akışa sokmak: Alıcı mı, Sağlayıcı mı? Kritik mimari ekran. |
| 3 | **Alıcı Kayıt** | `/register/buyer` | Alıcı olmak isteyen firma | Firma + kullanıcı oluşturmak. |
| 4 | **Sağlayıcı Kayıt** | `/register/provider` | Sağlayıcı olmak isteyen firma | Firma + kullanıcı oluşturmak. |
| 5 | **Giriş Yap** | `/login` | Kayıtlı herkes | Kimlik doğrulama. Rol seçimi yok (bilinçli). |

**Toplam Public: 5 ekran**

---

## B. Alıcı (Buyer) ekranları

| # | Ekran | URL | Kim görür? | Amaç |
|---|--------|-----|------------|------|
| 6 | **Alıcı Dashboard** | `/buyer/dashboard` | Alıcı | Ana kontrol paneli: açık talepler, gelen teklifler özeti, “Talep Oluştur” CTA. |
| 7 | **Talep Oluşturma** | `/buyer/request/create` | Alıcı | Güvenlik ihtiyacını tanımlamak. Ürünün kalbi (core screen). Bütçe gizli. |
| 8 | **Talep Detayı (Alıcı)** | `/buyer/request/:id` | Alıcı | Talebi görmek, gelen teklifleri değerlendirmek. Bütçe açılmaz; açık pazarlık yok. |
| 9 | **Alıcı Profil / Ayarlar** | `/buyer/profile` | Alıcı | Firma bilgileri, kullanıcı bilgisi güncelleme. |

**Toplam Alıcı: 4 ekran**

---

## C. Sağlayıcı (Provider) ekranları

| # | Ekran | URL | Kim görür? | Amaç |
|---|--------|-----|------------|------|
| 10 | **Sağlayıcı Dashboard** | `/provider/dashboard` | Sağlayıcı | Uygun talepler özeti, profil durumu, uyarılar (eksik belge vb.). |
| 11 | **Sağlayıcı Profil** | `/provider/profile` | Sağlayıcı | Kapasite, hizmet alanı, belgeler. Profil tamamlanmadan teklif verilemez (kalite kuralı). |
| 12 | **Uygun Talepler Listesi** | `/provider/requests` | Sağlayıcı | Eşleşen talepleri görmek. “Uygun / Uygun Değil” mantığı; bütçe görünmez. |
| 13 | **Talep Detayı (Sağlayıcı)** | `/provider/requests/:id` | Sağlayıcı | Talebi anlamak, teklif vermek. |
| 14 | **Tekliflerim** | `/provider/offers` | Sağlayıcı | Verilen teklifleri takip etmek. |

**Toplam Sağlayıcı: 5 ekran**

---

## D. Admin ekranları

| # | Ekran | URL | Kim görür? | Amaç |
|---|--------|-----|------------|------|
| 15 | **Admin Login** | `/admin/login` | Admin | Yönetim erişimi (role=ADMIN). |
| 16 | **Admin Dashboard** | `/admin/dashboard` | Admin | Genel sağlık & KPI (alıcı/sağlayıcı sayıları, aktif talepler, inceleme kuyruğu). |
| 17 | **Alıcılar Listesi** | `/admin/buyers` | Admin | Alıcı firmalar listesi, filtreler, aksiyonlar. |
| 18 | **Sağlayıcılar Listesi** | `/admin/providers` | Admin | Sağlayıcı firmalar listesi, filtreler, aksiyonlar. |
| 19 | **Alıcı Detay** | `/admin/buyers/:id` | Admin | Firma bilgisi, talepler, notlar, pasife al/aktif et. |
| 20 | **Sağlayıcı Detay** | `/admin/providers/:id` | Admin | Profil, belgeler, teklif geçmişi, onayla/pasife al. |
| 21 | **Talepler (Admin)** | `/admin/requests` | Admin | Tüm talepler listesi. Bütçe sadece “var/aralık” veya daha sıkı. |
| 22 | **Teklifler (Admin)** | `/admin/offers` | Admin | Tüm teklifler listesi. Fiyat vizyona göre opsiyonel/super admin. |
| 23 | **İnceleme Kuyruğu** | `/admin/review-queue` | Admin | Kalite, güven, belgeler; incele → onayla / düzeltme iste / pasife al. |

**Toplam Admin: 9 ekran**

---

## Toplam sayfa sayısı (MVP)

| Grup | Sayfa sayısı |
|------|----------------|
| Public | 5 |
| Alıcı | 4 |
| Sağlayıcı | 5 |
| Admin | 9 |
| **TOPLAM** | **23 ekran** |

---

## Vizyon kontrolü

- İhale ekranı yok.
- Fiyat karşılaştırma tablosu yok.
- Açık pazarlık/chat ekranı yok.
- Karar destek, kalite & uygunluk, kurumsal B2B odaklı.

Bu envanter yatırımcıya anlatılabilir ve geliştirilebilir.

---

## MVP (v1) / v2 — Ekran bazlı işaretleme

Aşağıdaki tabloda her ekran için **MVP’de mi (v1), v2’de mi** net yazıyor. MVP = çekirdek akışın uçtan uca çalışması + admin alıcı/sağlayıcı yönetimi.

| # | Ekran | Faz | Not |
|---|--------|-----|-----|
| 1 | Landing Page | **MVP** | |
| 2 | Rol Seçimi | **MVP** | Kritik mimari |
| 3 | Alıcı Kayıt | **MVP** | |
| 4 | Sağlayıcı Kayıt | **MVP** | |
| 5 | Giriş Yap | **MVP** | |
| 6 | Alıcı Dashboard | **MVP** | |
| 7 | Talep Oluşturma | **MVP** | Çekirdek ekran |
| 8 | Talep Detayı (Alıcı) | **MVP** | Teklifleri değerlendirme |
| 9 | Alıcı Profil / Ayarlar | v2 | İstersen MVP’ye alınabilir |
| 10 | Sağlayıcı Dashboard | **MVP** | |
| 11 | Sağlayıcı Profil | **MVP** | Teklif öncesi zorunlu |
| 12 | Uygun Talepler Listesi | **MVP** | |
| 13 | Talep Detayı (Sağlayıcı) / Teklif Ver | **MVP** | Çekirdek ekran |
| 14 | Tekliflerim | v2 | İstersen MVP’ye alınabilir |
| 15 | Admin Login | **MVP** | |
| 16 | Admin Dashboard | **MVP** | |
| 17 | Alıcılar Listesi | **MVP** | |
| 18 | Sağlayıcılar Listesi | **MVP** | |
| 19 | Alıcı Detay (Admin) | v2 | Operasyon olgunlaştıkça |
| 20 | Sağlayıcı Detay (Admin) | v2 | |
| 21 | Talepler (Admin) | v2 | |
| 22 | Teklifler (Admin) | v2 | |
| 23 | İnceleme Kuyruğu | v2 | |

**Özet (kesin ayrım):** **MVP = 15 ekran** (1–5 Public, 6–8 Alıcı çekirdek, 10–13 Sağlayıcı çekirdek, 15–18 Admin minimum). **v2 = 8 ekran** (9, 14, 19–23). Bu sayı MVP için ideal; ihale/fiyat ekranı yok.

**Stratejik doğrulama:** MVP'de yanıtlanan sorular: Kim alıcı/sağlayıcı geliyor? Talep açmak kolay mı? Sağlayıcılar teklif vermeye istekli mi? Eşleşme mantığı çalışıyor mu? v2'de: Ölçek, kalite, denetim, optimizasyon.

**Vizyon kontrolü:** İhale ekranı MVP'de yok. Fiyat karşılaştırma MVP'de yok. Açık pazarlık yok. Karar destek + uygunluk MVP'de var.’
---

## Mevcut HTML dosyaları ile eşleşme

| Envanter # | Ekran | Mevcut dosya |
|------------|--------|--------------|
| 1 | Landing | `index.html` |
| 2 | Rol Seçimi | `register.html` |
| 3 | Alıcı Kayıt | `register-buyer.html` |
| 4 | Sağlayıcı Kayıt | `register-provider.html` |
| 5 | Giriş | `login.html` |
| 6 | Alıcı Dashboard | `buyer/dashboard.html` |
| 7 | Talep Oluşturma | `buyer/request-create.html` |
| 8 | Talep Detay (Alıcı) | — (placeholder) |
| 9 | Alıcı Profil | — (placeholder) |
| 10 | Sağlayıcı Dashboard | `provider/dashboard.html` |
| 11 | Sağlayıcı Profil | `provider/profile.html` |
| 12 | Uygun Talepler | `provider/requests.html` |
| 13 | Talep Detay (Sağlayıcı) / Teklif Ver | `provider/offer.html` |
| 14 | Tekliflerim | — (placeholder) |
| 15 | Admin Login | `admin/login.html` |
| 16 | Admin Dashboard | `admin/index.html` |
| 17–18 | Alıcılar / Sağlayıcılar Listesi | `admin/buyers.html`, `admin/providers.html` |
| 19–23 | Admin detay + Talepler + Teklifler + İnceleme | — (backend ile) |

Bu eşleşme, front-end ve backend planlamasında referans olarak kullanılabilir.
