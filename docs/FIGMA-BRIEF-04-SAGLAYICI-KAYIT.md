# Figma çizim brief’i — 4. Ekran: Sağlayıcı Kayıt (Register – Provider)

**Amaç:** Figma’da birebir çizebileceğin, ürün + operasyon + kalite kararlarını kilitleyen net brief.

- ❌ “Herkes kayıt olsun” ekranı değil  
- ❌ İhale / lead toplama ekranı değil  
- ✅ Kaliteyi daha kayıt aşamasında korur  

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 4 · [WIREFRAME.md](WIREFRAME.md) §3.1.

---

## Ekranın tek amacı

Güvenlik hizmeti veren firmayı sisteme **doğru ve kontrollü** şekilde kaydetmek ve **profil tamamlama sürecine** hazırlamak.

**Not:** Bu ekran tek başına teklif vermeye yetmez. Teklif → profil tamamlandıktan sonra mümkün.

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Form max width** | 520–600 px |
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

- **Başlık (H1):** *Sağlayıcı firma kaydı*
- **Açıklama (Body / muted):** *Güvenlik hizmeti veren firmalar için temel kayıt bilgilerini alıyoruz. Kayıt sonrası profilinizi tamamlamanız gerekecektir.*

**Ton:** Resmi, seçici, güven verici.

---

### 3. Form alanları (core)

#### A. Firma bilgileri (grup 1)

| Alan | Zorunlu | Placeholder / not |
|------|---------|-------------------|
| Firma Ünvanı | ✅ | Ticaret sicilindeki tam ad |
| Vergi No (VKN) | ✅ | 10 haneli |
| Firma Türü | ⚠️ Opsiyonel | A.Ş. / Ltd. / Diğer |
| Merkez İl | ✅ | Dropdown |

**UX notu:** Firma Ünvanı + VKN aynı satırda olabilir.

---

#### B. Yetki & faaliyet bilgisi (grup 2)

| Alan | Zorunlu | Not |
|------|---------|-----|
| Güvenlik Faaliyet İzni Var mı? | ✅ | Evet / Hayır |
| Faaliyet Alanı (kısa) | ⚠️ Opsiyonel | Fiziki, Etkinlik, Mobil vb. |

**Önemli UX kuralı:**  
“Hayır” seçilirse → kayıt tamamlanabilir; ama profil ekranında uyarı gösterilir; teklif verme kilitli. Bu kalite filtresi vizyona uygundur.

---

#### C. Yetkili bilgileri (grup 3)

| Alan | Zorunlu | Not |
|------|---------|-----|
| Yetkili Ad Soyad | ✅ | İletişim kişisi |
| E-posta | ✅ | Giriş için |
| Telefon | ✅ | TR format |

**Micro copy:** *Bu bilgiler talep sahipleriyle iletişim için kullanılır.*

---

#### D. Hesap güvenliği (grup 4)

| Alan | Zorunlu | Kural |
|------|---------|--------|
| Şifre | ✅ | Min 8 karakter |
| Şifre Tekrar | ✅ | Eşleşme kontrolü |

---

### 4. Kalite bildirimi (çok önemli)

Formun altında, göze çarpan ama agresif olmayan bir **bilgi kutusu**:

*Bilgilendirme: Kayıt sonrası teklif verebilmeniz için firma profilinizi tamamlamanız ve gerekli yetki bilgilerini girmeniz gerekir.*

**Amaç:** Sağlayıcıyı baştan beklentiye sokar; “Neden teklif veremiyorum?” sorusunu azaltır.

---

### 5. KVKK & onaylar

- ☑️ **Aydınlatma Metni’ni okudum** (zorunlu)
- ☑️ **Kullanım Koşulları’nı kabul ediyorum** (zorunlu)

---

### 6. Primary CTA

- **Ana buton:** *Hesap Oluştur* — Primary
- **State’ler:** Disabled / Loading
- **Başarılı kayıt sonrası:** → Sağlayıcı Dashboard / Profil Tamamlama

**Micro copy (buton altı):** *Kayıt sonrası profilinizi tamamlamanız gerekecektir.*

---

### 7. Alt alan (yönlendirme)

Küçük metin:

*Güvenlik hizmeti almak istiyorsanız farklı bir akıştan kayıt olmanız gerekir.*  
→ Text link: **Alıcı olarak kayıt ol**

---

## Component & state listesi

- Input / Default / Error  
- Select / Dropdown  
- Radio / Yes–No  
- Info Box / Warning  
- Button / Primary  
- Checkbox  

---

## UX & vizyon kuralları (kırmızı çizgi)

- ❌ “Herkes kayıt olabilir, sonra bakarız” yaklaşımı  
- ❌ Hızlı kayıt / sosyal login  
- ❌ Teklif vaatleri  
- ✅ Seçici, kurumsal, kalite odaklı  

---

## Teslim kriterleri (checklist)

- [ ] Sağlayıcı, teklif veremeyeceğini baştan anlıyor mu?
- [ ] Yetki bilgisi net mi?
- [ ] Form karmaşık mı? (Varsa sadeleştir)
- [ ] İhale / fiyat çağrışımı var mı?

---

## Sonuç

Bu ekran:
- Platform kalitesini korur  
- Vizyona birebir uygundur  
- Admin & matching mantığıyla uyumludur  

---

## Sonraki adım seçenekleri

| Seçenek | Açıklama |
|--------|----------|
| **5. ekran** | Giriş Yap (Login) |
| **7. ekran** | Talep Oluşturma — en kritik ekran |

Hangisinden devam edileceği seçilir.
