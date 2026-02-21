# Figma çizim brief’i — 9. Ekran: Sağlayıcı Dashboard (Provider Dashboard)

**Amaç:** Sağlayıcıya “ne yapmalıyım?” sorusunun cevabını **5 saniyede** vermek.

- ❌ Talep arama motoru değil  
- ❌ İhale takip ekranı değil  
- ❌ Fiyat kovalanan yer değil  
- ✅ **Aksiyon + uygunluk + güven** ekranı  

**Durum:** ✔️ Tamamlandı & güncel; kilitli brief.

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 9 · [FIGMA-BRIEF-PROVIDER-ODEME-DURUMU-BILDIR.md](FIGMA-BRIEF-PROVIDER-ODEME-DURUMU-BILDIR.md).

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Content max width** | 1200 px |
| **Background** | Açık (white / very light gray) |

---

## Genel sayfa yapısı (yukarıdan aşağı)

### 1. Global header (login sonrası)

| Konum | İçerik |
|--------|--------|
| **Sol** | Logo / platform adı |
| **Sağ** | Firma adı (dropdown) · **Profil durumu (ikon)** · Çıkış Yap |

**Profil durumu ikon:** 🟡 Eksik / 🟢 Tamamlandı

---

### 2. Sayfa başlığı + kısa mesaj

- **Başlık:** *Sağlayıcı Paneli*
- **Alt metin (dinamik):**
  - **Profil eksikse:** *Profilinizi tamamlamadan teklif veremezsiniz.*
  - **Profil tamamsa:** *Uygun talepler aşağıda listelenmektedir.*

---

### 3. Durum kartları (overview – MVP sade)

Yan yana **3 kart** (tıklanabilir → ilgili listeye gider):

| Kart | İçerik |
|------|--------|
| **Uygun Talepler** | Sayı (örn. 4) · Alt metin: *Profilinize uygun* |
| **Verilen Teklifler** | Sayı (örn. 3) · Alt metin: *Değerlendirmede* |
| **Aktif İşler** | Sayı (örn. 1) · Alt metin: *Devam eden* |

---

### 4. Profil tamamlama durumu (kritik modül)

**Profil durum kartı:**
- **Başlık:** *Profil Tamamlama*
- **Progress bar** (%)
- **Eksik alanlar listesi (kısa):** Sertifikalar, Operasyonel bilgiler, Yasal beyanlar
- **CTA:** *Profili Tamamla*

**MVP kuralı:** Profil %100 değilse → teklif verme butonları **pasif**.

---

### 5. Uygun talepler (core modül)

**Başlık:** *Size Uygun Talepler*

Sistem buraya **sadece filtrelenmiş** (eşleşen) talepleri getirir.

#### Talep kartı (MVP)

| Bölüm | İçerik |
|--------|--------|
| **Üst** | Talep başlığı / ID · Lokasyon · Hizmet türü (etiketler) |
| **Orta – uygunluk** | Personel sayısı uyumu 🟢 · Lokasyon uyumu 🟢 · Sertifika uyumu 🟡 · SGK & ücret beyanı uyumu 🟢 (etiket / ikon) |
| **Alt – finansal sinyal (rakam yok)** | 🟢 Bütçe ile uyumlu / 🟡 Bütçe sınırında / 🔴 Bütçe dışında |
| **Aksiyonlar** | *Talebi İncele* · *Teklif Ver* (profil %100 ise aktif) |

---

### 6. Verilen teklifler (özet modül)

**Başlık:** *Tekliflerim*

**Liste:** Talep ID · Alıcı · Durum (İnceleniyor / Geri bildirim bekleniyor) · **Teklifi Görüntüle**

MVP’de kabul/red süreci detay ekranında.

---

### 7. Ödeme durumu bildirimleri (entegrasyon)

**Modül başlığı:** *Ödeme Durumu Bildirimleri*

**Görünürlük:** **Sadece aktif iş varsa** görünür.

Her satırda: Alıcı · Vade etiketi · Bildirim durumu · **Ödeme Durumu Bildir** (CTA).

Detay: [FIGMA-BRIEF-PROVIDER-ODEME-DURUMU-BILDIR.md](FIGMA-BRIEF-PROVIDER-ODEME-DURUMU-BILDIR.md).

---

### 8. Empty state’ler (çok önemli)

| Durum | Mesaj |
|--------|--------|
| **Uygun talep yok** | *Şu an profilinize uygun aktif talep bulunmamaktadır.* |
| **Profil eksik** | *Uygun talepleri görmek için profilinizi tamamlayın.* |

Sağlayıcıyı suçlamayan dil.

---

## Component listesi

- Header / Auth  
- Stat Card  
- Progress Bar  
- Request Card  
- Badge / Fit · Badge / Compliance  
- Button / Primary · Button / Disabled  
- Empty State  

---

## Vizyon kırmızı çizgileri

- ❌ “En ucuz teklif” · Açık fiyat rekabeti · Talep havuzu (herkese açık) · Spam teklif  
- ✅ Uygunluk · Kalite · Yasal uyum · Davranış sinyali  

---

## Teslim kriterleri (checklist)

- [ ] Sağlayıcı ne yapacağını 5 sn’de anlıyor mu?
- [ ] Profil tamamlamaya zorlanıyor mu?
- [ ] Fiyat yerine sinyal görüyor mu?
- [ ] Kötü sağlayıcı pasif kalıyor mu? (profil eksik → teklif pasif)
- [ ] Ödeme modülü sadece aktif iş varsa mı görünüyor?

---

## Sonuç

Bu dashboard:
- Kaliteli sağlayıcıyı tutar  
- Kötü sağlayıcıyı doğal eler  
- Platformu premium B2B yapar  

---

## Sonraki adım

**10. ekran – Sağlayıcı Profil & Profil Tamamlama**

---

*Admin ödeme inceleme: [FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md](FIGMA-BRIEF-ADMIN-ODEME-DAVRANISI-INCELEME.md). SGK & ücret kriteri: [SGK-URET-VERGISI-ZORUNLU-KRITER.md](SGK-URET-VERGISI-ZORUNLU-KRITER.md).*
