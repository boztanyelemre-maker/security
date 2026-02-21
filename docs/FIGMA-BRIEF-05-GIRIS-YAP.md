# Figma çizim brief’i — 5. Ekran: Giriş Yap (Auth – Login)

**Amaç:** Figma’da birebir çizebileceğin, sade ama kurumsal MVP çizim brief’i.

- ❌ Rol seçtirmez  
- ❌ Pazarlama yapmaz  
- ✅ Güvenli, net ve hızlı giriş sağlar  

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 5 · [GIRIS-AKIS.md](GIRIS-AKIS.md).

---

## Ekranın tek amacı

Kayıtlı kullanıcıyı **güvenli** şekilde sisteme almak ve **rolüne göre** doğru dashboard’a yönlendirmek.

- Rol bilgisi bu ekranda **sorulmaz**.  
- Sistem rolü **veritabanından** okur.

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Form max width** | 420–480 px (daha dar = odak) |
| **Background** | Açık (white / very light gray) |

---

## Sayfa yapısı (yukarıdan aşağı)

### 1. Header (minimal)

| Konum | İçerik |
|--------|--------|
| **Sol** | Logo / platform adı |
| **Sağ** | ❌ Kayıt Ol YOK · ❌ Admin YOK |

**Amaç:** Dikkati sadece girişe vermek.

---

### 2. Başlık & açıklama

- **Başlık (H1):** *Giriş Yap*
- **Açıklama (Body / muted):** *Hesabınıza giriş yaparak devam edin.*

**Ton:** Kısa, net, resmi.

---

### 3. Form alanları (core)

#### A. Kimlik bilgileri

| Alan | Zorunlu | Placeholder |
|------|---------|-------------|
| E-posta | ✅ | ornek@firma.com |
| Şifre | ✅ | •••••••• |

**Not:** Şifre alanı — show/hide icon (opsiyonel); Caps Lock uyarısı (opsiyonel).

---

### 4. Hata & durum state’leri (çok önemli)

| Durum | Mesaj / davranış |
|--------|-------------------|
| **Yanlış giriş** | *E-posta veya şifre hatalı.* — ❌ Hangisi yanlış söylenmez (güvenlik) |
| **Hesap pasif / kilitli** | *Hesabınız şu anda aktif değil. Lütfen destek ekibiyle iletişime geçin.* |
| **Loading** | Buton disabled + Spinner |

---

### 5. Primary CTA

- **Ana buton:** *Giriş Yap* — Primary  
- **State’ler:** Disabled (form eksikse) · Loading  

**Başarılı giriş sonrası (sistemde, ekranda değil):**
- role = BUYER → Alıcı Dashboard  
- role = PROVIDER → Sağlayıcı Dashboard  
- user_role = ADMIN → Admin Dashboard  

---

### 6. Alt yardımcı alan (MVP seviyesi)

- **Text link:** *Şifremi Unuttum*  
- MVP’de: Basit e-posta gönderimi veya “destek ile iletişime geçin” placeholder.  
- ❌ Sosyal login · ❌ OTP / SMS login (v2).

---

### 7. Alt yönlendirme

*Hesabınız yok mu?*  
→ Text link: **Kayıt Ol** (direkt rol seçimi ekranına gider)

---

## Component & state listesi

- Input / Default  
- Input / Error  
- Input / Password  
- Button / Primary  
- Button / Disabled  
- Button / Loading  
- Link / Text  
- Alert / Error  

---

## UX & vizyon kuralları

- ❌ Rol seçimi tekrar sorulmaz  
- ❌ “Hızlı giriş” / “Google ile giriş” yok  
- ❌ Pazarlama metni yok  
- ✅ Kurumsal, güvenli, minimal  

---

## Teslim kriterleri (checklist)

- [ ] Kullanıcı rol seçmeden giriş yapabiliyor mu?
- [ ] Yanlış giriş mesajları güvenli mi? (hangisi yanlış söylenmiyor)
- [ ] Başarılı girişte doğru dashboard’a gidiyor mu?
- [ ] Kayıt akışına geri dönüş net mi?

---

## Sonuç

Bu Login ekranı:
- Tüm panellerin kapısıdır  
- Rol mimarisini korur  
- MVP için yeterli, temiz ve güvenlidir  

---

## Sonraki adım seçenekleri

| Seçenek | Açıklama |
|--------|----------|
| **6. ekran** | Alıcı Dashboard |
| **7. ekran** | Talep Oluşturma — en kritik ekran |

Hangisinden devam edileceği seçilir.
