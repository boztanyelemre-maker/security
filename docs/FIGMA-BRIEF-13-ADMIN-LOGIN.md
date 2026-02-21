# Figma çizim brief’i — 13. Ekran: Admin Login & Yetkilendirme (Admin Authentication & Authorization)

**Amaç:** Sistemi yöneten kişilerin **güvenli** giriş yapmasını ve yetkilerinin **net ayrılmasını** sağlamak.

- ❌ Genel kullanıcı login’i değil  
- ❌ Tek şifreli basit giriş değil  
- ✅ **Kontrollü ve izlenebilir** yönetim girişi  

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 13 · [GIRIS-AKIS.md](GIRIS-AKIS.md).

**Durum:** ✔️ Tamamlandı & güncel; kilitli brief.

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Layout** | Centered card (tek kolon) |
| **Background** | Nötr / kurumsal |

---

## 1. Admin login ekranı

### Login kartı

- **Başlık (H1):** *Yönetici Girişi*
- **Alt metin:** *Bu alan yalnızca yetkili yöneticiler içindir.*

### Giriş alanları

| Alan | UI | Zorunlu |
|------|-----|---------|
| E-posta | Input | ✅ |
| Şifre | Password | ✅ |

- Kullanıcı adı yok; **e-posta** ile giriş.  
- Admin ile normal kullanıcı **login URL’leri ayrı** (örn. `/admin/login` vs `/login`).

### CTA

- **Primary:** *Giriş Yap*  
- **Secondary (opsiyonel v2):** *Şifremi Unuttum*

### Hata mesajları

| Durum | Mesaj |
|--------|--------|
| Geçersiz kimlik bilgisi | *Geçersiz kullanıcı veya şifre* |
| Rol uyumsuz | *Bu hesap admin yetkisine sahip değil* |

Hata mesajları **bilgi sızdırmaz** (hangi alan yanlış söylenmez).

---

## 2. İki aşamalı doğrulama (MVP’de opsiyonel)

**Aktifse (flag ile):**
- 2FA ekranı (aynı akış)  
- Tek kullanımlık kod (OTP)  
- E-posta veya authenticator  

**MVP’de:** Kapalı olabilir; tasarımda **yer hazır** (OTP input component).

---

## 3. Yetki modeli (login sonrası devreye girer)

### RBAC — rol bazlı yetkilendirme

Admin kullanıcı tek tip değildir.

**Admin roller (MVP):**

| Rol | Yetkiler |
|-----|----------|
| **Super Admin** | Her şey |
| **Operasyon Admin** | Talep / teklif / eşleşme |
| **Finans / Risk Admin** | Ödeme davranışı, risk |
| **Destek Admin** | Kullanıcı destek, inceleme |

- **Rol ataması:** Sadece Super Admin yapar.  
- **Login ekranında rol seçimi yok** (rol token/DB’den okunur).

---

## 4. Yetkilendirme nasıl çalışır? (arka plan)

- Login → token  
- Token → rol bilgisi  
- **UI:** Yetkisiz ekranlar **hiç görünmez**; butonlar **gizlenir** (disabled değil, yok).  

Hata riski azalır; güvenlik artar.

---

## 5. Güvenlik & kayıt (audit)

Login sonrası sistem şunları **loglar**:
- Admin ID  
- Giriş zamanı  
- IP / cihaz (opsiyonel)  
- Yapılan **kritik aksiyonlar**  

Özellikle: ödeme davranışı kararları, hesap askıya alma, manuel eşleşme.

---

## Component listesi

- Login Card  
- Input / Email · Input / Password  
- Button / Primary  
- Alert / Error  
- OTP Input (hazır ama MVP’de kapalı)  
- Empty / Access Denied state  

---

## Vizyon kırmızı çizgileri

- ❌ Tek admin hesabı · Paylaşılan şifre · Yetkisiz erişim · “Herkes her şeyi görsün”  
- ✅ Rol bazlı erişim · Audit trail · Güvenli giriş  

---

## Teslim kriterleri (checklist)

- [ ] Admin login, user login’den **ayrı** mı? (URL / akış)
- [ ] Rol seçimi login’de **yok** mu?
- [ ] Yetkisiz admin ekranı **göremiyor** mu?
- [ ] Kritik aksiyonlar **loglanıyor** mu?

---

## Sonuç

Bu ekran:
- Tüm admin sisteminin **temelidir**  
- Hukuki ve operasyonel güvenlik sağlar  
- Ölçeklenebilir admin yapısına kapı açar  

---

## Sonraki adım

**14. ekran – Admin Dashboard** (çekirdek metrikler & kontrol merkezi).

---

*Normal kullanıcı girişi: [FIGMA-BRIEF-05-GIRIS-YAP.md](FIGMA-BRIEF-05-GIRIS-YAP.md). Admin panel: [ADMIN-PANEL-WIREFRAME.md](ADMIN-PANEL-WIREFRAME.md).*
