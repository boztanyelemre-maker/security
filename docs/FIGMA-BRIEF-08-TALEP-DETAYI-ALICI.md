# Figma çizim brief’i — 8. Ekran: Talep Detayı (Alıcı) (Buyer – Request Detail)

**Amaç:** Alıcının talebini net görmesi ve gelen teklifleri **kalite + uygunluk** üzerinden değerlendirmesi. Ürünün ikinci kalbi.

- ❌ “En ucuz hangisi?” ekranı değil  
- ✅ “Hangisi benim ihtiyacıma gerçekten uygun?” karar destek ekranı  

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 8 · [FIGMA-BRIEF-07-TALEP-OLUSTURMA.md](FIGMA-BRIEF-07-TALEP-OLUSTURMA.md). Arka planda admin otomatik kontrolleri: [ADMIN-OTOMATIK-KONTROLLER-EKRAN8.md](ADMIN-OTOMATIK-KONTROLLER-EKRAN8.md).

**Durum:** ✔️ Tamamlandı & güncel. Geri dönüp oynamayı önermiyoruz. “Teklif karşılaştırma” değil, “doğru sağlayıcıyı seçme” ekranı; vizyonla %100 uyumlu.

---

## Ekranın tek amacı

Alıcının oluşturduğu talebi **net** görmesi ve gelen teklifleri **kalite + uygunluk** üzerinden değerlendirmesi.

- ❌ Pazarlık ekranı değil  
- ❌ Fiyat karşılaştırma tablosu değil  
- ✅ **Karar destek ekranı**  

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Layout** | Sol içerik / Sağ özet (2 kolon) |
| **Background** | Açık |

---

## Genel sayfa yapısı

```
| Talep Bilgileri (Sol – ~%70)  | Özet / Durum (Sağ – ~%30) |
|-------------------------------|---------------------------|
| Gelen Teklifler (Alt bölüm – full width)                    |
```

---

## 1. Sayfa başlığı + durum

- **Başlık (H1):** *Güvenlik Hizmeti Talebi*
- **Alt bilgi (muted):** Talep No · Oluşturma tarihi
- **Durum badge:** Yayında · Teklif Bekleniyor · Değerlendiriliyor · Kapalı

**UX:** Durum tek bakışta anlaşılmalı.

---

## 2. Sol kolon — Talep detayları (read-only)

7. ekranda girilen bilgilerin salt okunur görünümü.

#### A) Hizmet kapsamı (kart/section)

- Hizmet türleri (badge: Silahlı, Silahsız, Mobil devriye vb.)
- Lokasyon: Açık adres · Tek / Çoklu lokasyon
- Alan türü: AVM / Fabrika / Site vb.

#### B) Personel & operasyon

- Personel sayısı · Vardiya düzeni · Silah durumu
- Zorunlu sertifikalar (check icon ile)

**Not:** “Eksik / belirsiz” alan yok; 7. ekranın kalitesi burada görünür.

#### C) Süre & takvim

- Sözleşme süresi · Başlangıç tarihi · Deneme süresi (varsa)

#### D) Yasal & operasyonel şartlar

- 5188 uygunluğu · Faaliyet izni · SGK taahhüdü
- Alt yüklenici: Var / Yok · Oran (%)

#### E) Opsiyonel ayırt edici kriterler

Sadece **doldurulmuşsa** gösterilir: personel tecrübe beklentisi, denetim sıklığı, raporlama, dijital sistem, sigorta, referans beklentileri.

**UX:** Boş opsiyonel alanlar gösterilmez (ekranı şişirme).

---

## 3. Sağ kolon — Özet & güven (sticky olabilir)

#### Talep özeti

- Toplam personel · Lokasyon sayısı · Hizmet türü · Sözleşme süresi

#### Bütçe bilgisi (sadece alıcıya)

- Aylık bütçe aralığı · Para birimi
- **Bilgi notu:** *Bütçe bilgisi teklif veren firmalarla paylaşılmaz.*

Bu not **mutlaka görünür** olmalı.

#### Teklif durumu

- Gelen teklif sayısı · Değerlendirilen teklif sayısı
- **Fiyat gösterimi YOK**

---

## 4. Alt bölüm — Gelen teklifler (core)

**Başlık:** *Gelen Teklifler*

#### Teklif kartı / satırı (çok kritik)

Her teklif kart veya satır olarak:

| Bölüm | İçerik |
|--------|--------|
| **Üst** | Firma adı · Lokasyon / hizmet uyumu etiketi: Uygun / Kısmen uygun / Uygun değil |
| **Orta** | **Kalite odaklı:** Personel kalitesi (ikon + metin), Operasyonel yetenekler (ikonlar), Referans durumu (etiket). **Yasal ücret & SGK uyumu:** 🟢 Beyan edildi / 🟡 Doğrulama bekleniyor / 🔴 Sağlanmıyor (sağlanmıyorsa teklif gösterilmez). Sağlayıcı teklif formundan beyan gelir. [SGK-URET-VERGISI-ZORUNLU-KRITER.md](SGK-URET-VERGISI-ZORUNLU-KRITER.md) |
| **Alt** | **Bütçe bilinci (sayı yok):** Bütçe ile uyumlu / Bütçe sınırında / Bütçe dışında. **Rakam gösterilmez.** |

**Teklif aksiyonları (MVP):**
- *Teklifi İncele* (detay modal / sayfa)
- ❌ Kabul / Red butonu MVP’de yok (v2). MVP’de değerlendirme = görüntüleme; karar offline veya admin destekli olabilir.

---

## 5. Empty & state yönetimi

| Durum | Mesaj / davranış |
|--------|-------------------|
| **Henüz teklif yok** | *Henüz teklif gelmedi. Uygun firmalar eşleştirildiğinde bilgilendirileceksiniz.* |
| **Teklifler var** | Sıralama varsayılan: **Uygunluk**. ❌ Fiyat sıralaması yok. |

---

## Component listesi

- Section / Card  
- Badge / Status · Badge / Fit (uygunluk)  
- Offer Card  
- Sticky Summary  
- Info Box / Secure (bütçe)  
- Button / Secondary (Teklifi İncele)  

---

## Vizyon kırmızı çizgileri

- ❌ “En düşük fiyat”  
- ❌ “Teklifleri sırala (ucuzdan pahalıya)”  
- ❌ Açık pazarlık · Chat  
- ✅ Uygunluk · Kalite · Sürdürülebilirlik  

**Vizyon kuralı:** Bu ekrana fiyat tablosu girerse platform ihale sitesine döner → uyarılır.

---

## Teslim kriterleri (checklist)

- [ ] Alıcı fiyat görmeden karar verebiliyor mu? (uygunluk/kalite ile)
- [ ] Teklifler kaliteye göre ayrışıyor mu?
- [ ] Bütçe gizliliği net mi?
- [ ] Ekran karmaşık mı? (Varsa sadeleştir)

---

## Sonuç

Bu ekran:
- Sektör bilgisini ürüne dönüştürür  
- Klasik teklif platformlarından ayırır  
- Yatırımcıya anlatılabilir netlikte olur  

---

## Alıcı ne görür / ne görmez (özet)

| Görür | Görmez (bilinçli) |
|--------|---------------------|
| Talep detayları (tam) | Teklif fiyatı (rakam) |
| Gelen teklifler (filtrelenmiş) | Diğer firmalarla karşılaştırma tablosu |
| Uygunluk, kalite, SGK/ücret uyum etiketi | Admin risk puanları |
| Bütçe uyum etiketi (Uyumlu/Sınırda/Dışında) | Ham ödeme verisi |
| Referans & operasyonel güç özetleri | |

Vizyon: ❌ En ucuz teklif / açık pazarlık / damgalama yok. ✅ Kalite, sürdürülebilirlik, güven.

---

## Sonraki adım seçenekleri

| Seçenek | Açıklama |
|--------|----------|
| **9. ekran** | Sağlayıcı Dashboard |
| **Teklif detayı** | Sağlayıcı / Alıcı karşılaştırmalı |

Hangisinden devam edileceği seçilir.
