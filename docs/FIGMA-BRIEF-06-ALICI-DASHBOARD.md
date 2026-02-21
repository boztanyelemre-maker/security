# Figma çizim brief’i — 6. Ekran: Alıcı Dashboard (Buyer Dashboard)

**Amaç:** Figma’da birebir çizebileceğin, MVP’ye uygun ve vizyonu koruyan detaylı çizim brief’i.

- ❌ Raporlama ekranı değil  
- ❌ Pazarlık / ihale ekranı değil  
- ✅ Alıcının aksiyona geçtiği kontrol paneli  

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 6.

---

## Ekranın tek amacı

Alıcıya hızlıca **“ne durumdayım?”** göstermek ve **“Talep Oluştur”** aksiyonuna yönlendirmek.

Bu ekran karar ekranı değil, **başlatma ekranıdır**.

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Content max width** | 1200 px |
| **Background** | Açık (white / very light gray) |

---

## Sayfa yapısı (yukarıdan aşağı)

### 1. Global header (login sonrası)

| Konum | İçerik |
|--------|--------|
| **Sol** | Logo / platform adı (landing ile aynı) |
| **Sağ** | Kullanıcı adı / firma adı (dropdown) · **Çıkış Yap** |

**Not:** Header sabit olabilir (opsiyonel).

---

### 2. Sayfa başlığı + ana CTA

| Konum | İçerik |
|--------|--------|
| **Sol** | **Başlık:** *Alıcı Paneli* · **Alt metin (muted):** *Güvenlik hizmeti taleplerinizi buradan yönetin.* |
| **Sağ** | **Ana CTA:** *Talep Oluştur* (Primary) |

**Not:** Bu buton sayfanın en baskın aksiyonu; scroll’da da görünür olabilir (sticky değilse bile üstte net).

---

### 3. Durum kartları (overview – MVP sade)

Yan yana **2–3 kart** (abartılmadan):

| Kart | İçerik |
|------|--------|
| **Kart 1** | Açık Talepler · Sayı (örn. 2) · Status badge: Yayında |
| **Kart 2** | Gelen Teklifler · Sayı (örn. 5) · Alt metin: Değerlendirilmeyi bekleyen |
| **Kart 3 (opsiyonel)** | Kapalı Talepler · Sayı (örn. 1) |

**Not:** Kartlar sadece özet; tıklanınca ilgili listeye gider.

---

### 4. Açık talepler listesi (core)

**Başlık:** *Açık Taleplerim*

**Liste / tablo (MVP sade):**

| Kolon | İçerik |
|--------|--------|
| Talep ID / Başlık | Otomatik / kısa |
| Lokasyon | İl / İlçe |
| Hizmet Türü | Fiziki / Etkinlik |
| Durum | Yayında / Kapalı |
| Gelen Teklif | 3 teklif (sadece sayı) |
| Aksiyon | Detay |

**Önemli UX kararı:**
- ❌ Bütçe görünmez  
- ❌ Teklif fiyatları görünmez  
- ✅ Sadece sayı & durum  

---

### 5. Empty state (çok önemli)

Henüz talep yoksa:

- **Empty illustration** (basit)
- **Metin:** *Henüz oluşturulmuş bir talebiniz yok.*
- **CTA:** *İlk Talebini Oluştur*

**Not:** Bu state MVP’de kritik; ilk kullanıcıların büyük kısmı burayı görecek.

---

### 6. Alt bilgi / micro copy

Sayfanın altına küçük, güven verici metin:

*Bütçe bilgileriniz yalnızca sistem tarafından değerlendirilir ve karşı tarafla paylaşılmaz.*

**Amaç:** Güven hissi; vizyonu UI’da görünür kılmak.

---

## Component & state listesi

- Header / Auth  
- Button / Primary · Secondary  
- Card / Stat  
- Table / Basic  
- Badge / Status  
- Empty State  
- Dropdown / Profile  

---

## UX & vizyon kuralları (kırmızı çizgi)

- ❌ “Teklifleri karşılaştır”, “En düşük fiyat”, “Pazarlık”, “Chat”  
- ✅ “Talep”, “Uygunluk”, “Değerlendirme”  

---

## Teslim kriterleri (checklist)

- [ ] “Talep Oluştur” tek ana CTA mı?
- [ ] Alıcı durumunu 5 saniyede anlayabiliyor mu?
- [ ] Bütçe / fiyat UI’da sızıyor mu? (Sızmamalı)
- [ ] Empty state motive edici mi?

---

## Sonuç

Bu dashboard:
- Alıcıyı yormaz  
- Yanlış karar aldırmaz  
- Ürünü ihale platformuna çevirmeden çalışır  

---

## Sonraki adım seçenekleri

| Seçenek | Açıklama |
|--------|----------|
| **7. ekran** | Talep Oluşturma — ürünün kalbi |
| **8. ekran** | Talep Detayı (Alıcı) |

Hangisinden devam edileceği seçilir.
