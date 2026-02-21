# Figma çizim brief’i — 2. Ekran: Rol Seçimi (Register – Role Selection)

**Amaç:** Figma’da birebir çizebileceğin, ürün kararlarını kilitleyen net brief. Mimari olarak en kritik ekranlardan biri.

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 2.

---

## Ekranın tek amacı

Kullanıcının **“ben alıcıyım mı, sağlayıcıyım mı”** kararını net ve bilinçli şekilde aldırmak.

- ❌ Hızlı geçilecek bir ara ekran değildir  
- ❌ Pazarlama ekranı değildir  
- ✅ **Mimari bir karar ekranıdır**

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Background** | Açık (white / very light gray) |
| **Max width content** | 960–1040 px (odaklanma için) |

---

## Sayfa yapısı (yukarıdan aşağı)

### 1. Header (minimal)

| Konum | İçerik |
|--------|--------|
| **Sol** | Logo / platform adı |
| **Sağ** | ❌ Kayıt Ol YOK · ❌ Giriş Yap YOK |

**Amaç:** Dikkati dağıtmamak. Bu ekranda geri dönüş sadece **logo** ile ana sayfaya.

---

### 2. Başlık & açıklama

- **Başlık (H1):** *Hangi firma türüyle kayıt olmak istiyorsunuz?*
- **Açıklama (Body / muted):** *Size uygun akışı başlatalım.*

**Ton:** Kurumsal, sakin, yönlendirici.

---

### 3. Rol kartları (ana odak)

**Layout**
- Yan yana 2 eşit kart
- Aralarında net boşluk
- **Tüm kart tıklanabilir**

---

#### Kart 1 — Alıcı

| Öğe | İçerik |
|-----|--------|
| **Icon (üstte)** | Bina / ofis / briefcase benzeri (soyut, sade) |
| **Başlık (H3)** | Güvenlik Hizmeti Almak İstiyorum |
| **Açıklama (2 satır max)** | İşletmeniz için güvenlik ihtiyacınızı tanımlayın ve uygun firmalardan teklif alın. |
| **CTA** | → Alıcı Olarak Devam Et |
| **Micro text (opsiyonel)** | Talep oluşturma odaklı akış |

---

#### Kart 2 — Sağlayıcı

| Öğe | İçerik |
|-----|--------|
| **Icon** | Kalkan / güvenlik / ekip ikonu (abartısız) |
| **Başlık (H3)** | Güvenlik Hizmeti Vermek İstiyorum |
| **Açıklama** | Hizmet verdiğiniz alanlara ve kapasitenize uygun işlere erişin. |
| **CTA** | → Sağlayıcı Olarak Devam Et |
| **Micro text** | Teklif verme odaklı akış |

**Figma component:** Card/Role — Default · Hover (border koyulaşır / shadow) · Active (seçili state, opsiyonel).

---

### 4. Alt bilgi (micro copy)

Sayfanın en altına küçük, sakin metin:

*Seçiminiz kayıt akışını belirler. Gerekirse daha sonra destek ekibiyle güncellenebilir.*

**Not:** “Sonradan değiştirebilirsiniz” demiyoruz; kullanıcıyı da kilitlemiyoruz. Vizyonla uyumlu orta yol.

---

## Renk & state kuralları

| State | Görünüm |
|--------|---------|
| **Default** | Kartlar beyaz |
| **Hover** | Border + shadow |
| **Active** | Primary renk border (seçim hissi) |

❌ Radio button, checkbox yok — **kartın kendisi seçim**.

---

## UX & vizyon kuralları (kırmızı çizgi)

- ❌ “En uygun fiyat”, “Karşılaştır”, “İhale”, “Hızlı teklif al”
- ✅ “Uygun”, “Doğru eşleşme”, “Rol bazlı akış”

Bu ekran ürünü ihale platformuna çevirir ya da engeller. **Biz engelleyecek şekilde tasarlıyoruz.**

---

## Teslim kriterleri (checklist)

Rol Seçimi ekranı bittiğinde:

- [ ] Kullanıcı neyi seçtiğini anlıyor mu?
- [ ] Alıcı / sağlayıcı farkı net mi?
- [ ] Kartlardan biri yanlış anlaşılmaya açık mı?
- [ ] Fiyat / ihale çağrışımı var mı? (Varsa revize)

---

## Sonuç

Bu ekran:
- MVP’nin mimari kilidi
- Backend rol ayrımının UI karşılığı
- Yanlış yapılırsa ürün yön değiştirir

Şu haliyle doğru, sade ve vizyona uygun.

---

## Sonraki adım seçenekleri

| Seçenek | Açıklama |
|--------|----------|
| **3. ekran** | Alıcı Kayıt — Figma brief’i |
| **7. ekran** | Talep Oluşturma — en kritik ekran |

Hangisinden devam edileceği seçilir.
