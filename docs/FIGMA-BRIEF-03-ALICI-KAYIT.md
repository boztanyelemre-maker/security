# Figma çizim brief’i — 3. Ekran: Alıcı Kayıt (Register – Buyer)

**Amaç:** Figma’da birebir çizebileceğin, ürün + teknik kararları kilitleyen net brief.

- ❌ Pazarlama ekranı değil  
- ❌ Uzun form çöplüğü değil  
- ✅ Kurumsal, hızlı, doğru veri toplayan kayıt ekranı  

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 3 · [WIREFRAME.md](WIREFRAME.md) §2.1.

---

## Ekranın tek amacı

Alıcı firmayı sisteme **doğru ve minimum veriyle** kaydetmek ve talep oluşturmaya hazır hale getirmek.

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Form max width** | 520–600 px (odaklanma için) |
| **Background** | Açık (white / very light gray) |

---

## Sayfa yapısı (yukarıdan aşağı)

### 1. Header (minimal)

| Konum | İçerik |
|--------|--------|
| **Sol** | Logo / platform adı |
| **Sağ** | ❌ Kayıt Ol YOK · ❌ Giriş Yap YOK |

**Amaç:** Kullanıcıyı formdan kaçırmamak.

---

### 2. Başlık & açıklama

- **Başlık (H1):** *Alıcı firma kaydı*
- **Açıklama (Body / muted):** *İşletmeniz için güvenlik hizmeti talebi oluşturabilmeniz adına temel bilgileri alıyoruz.*

**Ton:** Resmi, güven verici; “hızlıca geç” hissi yok.

---

### 3. Form alanları (core)

#### A. Firma bilgileri (grup 1)

| Alan | Zorunlu | Placeholder / not |
|------|---------|-------------------|
| Firma Ünvanı | ✅ | Ticaret sicilindeki tam ad |
| Vergi No (VKN) | ✅ | 10 haneli |
| Firma Türü | ⚠️ Opsiyonel | A.Ş. / Ltd. / Diğer |
| İl | ✅ | Dropdown |
| İlçe | ⚠️ Opsiyonel | İl seçimine bağlı |

**UX notu:** Firma Ünvanı + VKN aynı satırda olabilir (desktop).

---

#### B. Yetkili bilgileri (grup 2)

| Alan | Zorunlu | Not |
|------|---------|-----|
| Yetkili Ad Soyad | ✅ | İletişim kişisi |
| E-posta | ✅ | Giriş için kullanılacak |
| Telefon | ✅ | TR format, maskeleme |

**Micro copy:** *Bu bilgiler teklif sürecinde iletişim için kullanılır.*

---

#### C. Hesap güvenliği (grup 3)

| Alan | Zorunlu | Kural |
|------|---------|--------|
| Şifre | ✅ | Min 8 karakter |
| Şifre Tekrar | ✅ | Eşleşme kontrolü |

**Not:** Password strength bar opsiyonel (MVP’de zorunlu değil).

---

### 4. KVKK & onaylar

- ☑️ **Aydınlatma Metni’ni okudum** (zorunlu)
- ☑️ **Kullanım Koşulları’nı kabul ediyorum** (zorunlu)

Linkler modal veya yeni sekme placeholder olabilir.

---

### 5. Primary CTA

- **Ana buton:** *Hesap Oluştur* — Primary (filled)
- **State’ler:** Disabled (form eksikse) · Loading (submit sırasında)

**Buton altı micro copy (küçük):**  
*Kayıt sonrası doğrudan talep oluşturma ekranına yönlendirileceksiniz.*

---

### 6. Alt alan (opsiyonel ama önerilir)

Küçük, sakin metin:

*Güvenlik firmasıysanız farklı bir akıştan kayıt olmanız gerekir.*  
→ Text link: **Sağlayıcı olarak kayıt ol**

Bu link geri dönüş sağlar; akışı bozmaz.

---

## Component & state listesi

- Input / Default  
- Input / Error  
- Input / Disabled  
- Select / Dropdown  
- Button / Primary  
- Checkbox  
- Form / Section Title  

---

## UX & vizyon kuralları

- ❌ “Hızlı kayıt – 30 saniye” dili  
- ❌ Sosyal login (Google vb.) — MVP’de yok  
- ❌ Gereksiz şirket bilgileri (adres detayı, fatura e-posta vb.)  
- ✅ Kurumsal, güvenli, minimum ama yeterli  

---

## Teslim kriterleri (checklist)

- [ ] Form tek ekranda tamamlanabiliyor mu?
- [ ] Zorunlu alanlar net mi?
- [ ] Hata mesajları sakin ve açıklayıcı mı?
- [ ] Kullanıcı “sonra ne olacak?”ı biliyor mu?
- [ ] İhale / fiyat çağrışımı var mı? (Varsa düzelt)

---

## Sonuç

Bu ekran:
- Alıcıyı doğru veriyle sisteme alır  
- Talep oluşturma akışına hazırlar  
- Backend & DB ile birebir uyumludur  

---

## Sonraki adım seçenekleri

| Seçenek | Açıklama |
|--------|----------|
| **4. ekran** | Sağlayıcı Kayıt (Provider Registration) |
| **7. ekran** | Talep Oluşturma — en kritik ekran |

Hangisinden devam edileceği seçilir.
