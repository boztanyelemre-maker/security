# Admin panel wireframe (tam spec)

Platform yöneticisi: kalite, uygunluk, güven, denetim. **İhale/fiyat kırdırma yok**; bütçe gizliliği korunur.

---

## 0. Admin giriş

| Özellik | Değer |
|--------|--------|
| **URL** | `/admin/login` |
| **Alanlar** | E-posta ✅ (format) · Şifre ✅ (min 8) · (Opsiyonel) 2FA / OTP |

**Doğrulama kuralları:**

- `role = ADMIN` olmayan giriş yapamaz → **403**
- (Opsiyonel) 5 yanlış deneme → 15 dk kilit

---

## 1. Admin dashboard

| Özellik | Değer |
|--------|--------|
| **URL** | `/admin/dashboard` |

**KPI kartları:**

- Toplam Alıcı
- Toplam Sağlayıcı
- Aktif Talepler
- Açık Teklifler
- İnceleme Bekleyen Sağlayıcılar (belge/uyumluluk)

**Kısayol butonları:** Alıcılar · Sağlayıcılar · Talepler · Teklifler · İnceleme Kuyruğu

---

## 2. Alıcılar listesi

| Özellik | Değer |
|--------|--------|
| **URL** | `/admin/buyers` |

### 2.1 Liste kolonları

| Kolon | Açıklama |
|-------|----------|
| Firma Ünvanı | company_name |
| İl / İlçe | buyer_profiles |
| Sektör | (Opsiyonel) |
| Talep Sayısı | Toplam |
| Aktif Talep | Adet (henüz kapanmamış) |
| Son Aktivite Tarihi | Son talep veya giriş |
| Durum | Active / Suspended / Pending |
| Kayıt Tarihi | created_at |
| **Aksiyon** | Detay, Pasife Al / Aktif Et |

### 2.2 Filtreler

- Durum (Active / Suspended / Pending)
- Şehir
- Kayıt tarihi aralığı
- Son aktivite (son 7 / 30 / 90 gün)
- Talep sayısı (0, 1–5, 6+)

### 2.3 Aksiyonlar

- **Detay Gör** → `/admin/buyers/:id`
- **Pasife Al** (zorunlu: sebep seç)
- **Aktif Et**
- **Not Ekle** (admin içi)
- **Doğrulandı** etiketi (opsiyonel)

**Doğrulama kuralı — Pasife alma:** Sebep zorunlu. Sebep seçenekleri: Sahte kayıt · Uygunsuz kullanım · Ödeme/uyuşmazlık · Spam · Diğer

---

## 3. Sağlayıcılar listesi

| Özellik | Değer |
|--------|--------|
| **URL** | `/admin/providers` |

### 3.1 Liste kolonları

| Kolon | Açıklama |
|-------|----------|
| Firma Ünvanı | company_name |
| Hizmet Verilen Şehirler | Kısa özet |
| Kapasite | Örn. max personel |
| Belge Durumu | Tam / Eksik / İnceleme |
| Teklif Sayısı | Toplam |
| Kazanılan İş | Adet (opsiyonel) |
| Son Aktivite Tarihi | |
| Durum | Active / Suspended / Pending |
| Kayıt Tarihi | created_at |
| **Aksiyon** | Detay, İncele, Pasife Al / Aktif Et |

### 3.2 Filtreler

- Durum
- Belge durumu (Tam / Eksik / İnceleme)
- Şehir (hizmet verdiği)
- Kapasite aralığı
- Son aktivite (7 / 30 / 90 gün)

### 3.3 Aksiyonlar

- **Detay Gör** → `/admin/providers/:id`
- **İncele / Onayla** (belge/uyumluluk)
- **Pasife Al / Aktif Et**
- **Uyarı Notu / İletişim Kaydı** (opsiyonel)

**Doğrulama kuralları:**

- Sağlayıcı “Teklif verebilir” durumu için: **Profil tamam** + **Belge durumu** en az “İnceleme” veya “Onaylı”.
- Eksik belge varsa: teklif verme butonu sağlayıcıda **kilitli** (vizyon: kalite).

---

## 4. Alıcı detay sayfası

| Özellik | Değer |
|--------|--------|
| **URL** | `/admin/buyers/:id` |

### 4.1 Üst bilgi kartı

- Firma Ünvanı + VKN
- Yetkili kişi + iletişim
- Lokasyon (İl/İlçe)
- Durum (Active / Suspended / Pending)
- Kayıt tarihi / Son aktivite

### 4.2 Sekmeler

| Sekme | İçerik |
|-------|--------|
| **A) Talepler** | Talep listesi: ID, lokasyon, hizmet türü, personel, durum, tarih. Talep detayına git. |
| **B) Teklifler (özet)** | Talep bazlı kaç teklif geldi. **Bütçe yine görünmez.** |
| **C) Notlar / Log** | Admin notları, durum değişikliği geçmişi |

### 4.3 Aksiyonlar

- Pasife al (sebep zorunlu)
- Aktif et
- Not ekle

---

## 5. Sağlayıcı detay sayfası

| Özellik | Değer |
|--------|--------|
| **URL** | `/admin/providers/:id` |

### 5.1 Üst bilgi kartı

- Firma Ünvanı + VKN
- Yetkili kişi + iletişim
- Hizmet şehirleri
- Kapasite
- Durum + Belge durumu

### 5.2 Sekmeler

| Sekme | İçerik |
|-------|--------|
| **A) Profil** | Hizmet türleri, şehirler, kapasite, vardiya kabiliyeti |
| **B) Belgeler** | Belge listesi (dosya adı, yükleme tarihi, durum). Durum set et: Eksik / İnceleme / Onaylı |
| **C) Teklif Geçmişi** | Verilen teklifler (talep ID, tarih, durum) |
| **D) Notlar / Log** | Admin notları + aksiyon geçmişi |

### 5.3 Aksiyonlar

- Onayla (belge/uyumluluk)
- Eksik belge işaretle (otomatik “teklif veremez”)
- Pasife al / Aktif et
- Not ekle

---

## 6. Talepler listesi (Admin)

| Özellik | Değer |
|--------|--------|
| **URL** | `/admin/requests` |

### Liste kolonları

- Talep ID
- Alıcı firma
- Lokasyon
- Hizmet türü
- Personel sayısı
- Başlangıç tarihi
- Durum: Draft / Published / Closed / Cancelled
- Gelen teklif sayısı
- Kayıt tarihi

### Filtreler

- Durum · Şehir · Hizmet türü · Tarih aralığı · Teklif sayısı (0, 1–3, 4+)

**Bütçe kuralı:** Adminde bile bütçe sadece “var / aralık” görünebilir (veya daha sıkı: admin de net görmesin).

---

## 7. Teklifler listesi (Admin)

| Özellik | Değer |
|--------|--------|
| **URL** | `/admin/offers` |

### Liste kolonları

- Teklif ID
- Talep ID
- Sağlayıcı firma
- Alıcı firma
- Durum: Sent / Viewed / Shortlisted / Awarded / Rejected
- Tarih

**Fiyat gösterimi (vizyon):** Platform “fiyat kırdırma” riskine girmesin diye adminde fiyat **opsiyonel** veya sadece “Super Admin” / audit yetkisi olan rol görür.

---

## 8. İnceleme kuyruğu

| Özellik | Değer |
|--------|--------|
| **URL** | `/admin/review-queue` |
| **Amaç** | Kalite & güven (vizyon uyumlu) |

### Liste

- Sağlayıcı firma
- Eksik belge
- Risk işareti (çok şikayet / sahte profil)

### Aksiyonlar

- İncele → Onayla / Düzeltme iste / Pasife al

---

## 9. Vizyon kontrolü (kırmızı çizgi)

| ✅ Uyumlu | ❌ Aykırı |
|-----------|-----------|
| Admin: kalite, uygunluk, güven, denetim | Admin ile bütçe/fiyat üzerinden “ihale yönetimi” |
| Bütçe gizli kuralı korunur | Fiyat kırdırma veya ihale mantığı |

Bu çerçeveye aykırı bir admin isteği gelirse **anında uyarılır**.

---

## 10. Demo sayfaları (mevcut)

- **Giriş:** `admin/login.html` → `admin/index.html`
- **Dashboard:** Kısayollar (Alıcılar, Sağlayıcılar, Talepler, Teklifler)
- **Listeler:** `admin/buyers.html`, `admin/providers.html`
- Detay sayfaları, Talepler/Teklifler/İnceleme kuyruğu ve “pasife al (sebep)” backend ile eklenecek.
