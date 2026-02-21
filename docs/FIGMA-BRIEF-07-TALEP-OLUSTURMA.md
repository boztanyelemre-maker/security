# Figma çizim brief’i — 7. Ekran: Talep Oluşturma (Buyer – Create Request)

**Amaç:** Figma’da birebir çizim + ürün kararlarını kilitleyen **en kritik** doküman. Ürünün kalbi.

**Yanlış yapılırsa:** Platform ihaleleşir; sağlayıcı fiyat kırmaya iter.  
**Doğru yapılırsa:** Kalite, doğru eşleşme, sürdürülebilir iş.

**Referans:** [FIGMA-MVP-SIRASI.md](FIGMA-MVP-SIRASI.md) ekran 7 · [WIREFRAME.md](WIREFRAME.md) §2.2 · [TALEP-SEKTOR-KRITERLERI.md](TALEP-SEKTOR-KRITERLERI.md) (sektör kriterleri & arka plan puanlama).

---

## Ekranın tek amacı

Alıcının güvenlik ihtiyacını, **teklif vermek için gerçekten gerekli ve yeterli** bilgilerle tanımlamasını sağlamak.

- ❌ “Her şeyi soralım” ekranı değil  
- ❌ “Teklif kapışması” ekranı değil  
- ✅ **Karar destek ekranı**  

---

## Frame ayarları

| Ayar | Değer |
|------|--------|
| **Desktop** | 1440 px |
| **Grid** | 12 column / 80 px margin |
| **Form max width** | 860–960 px |
| **Background** | Açık (white / very light gray) |

**UX kuralı:** Form **tek sayfa** (stepper yok – MVP); gruplar aynı sayfada scroll ile.

---

## Ekranın 3 katmanı

| Katman | Amaç | Sağlayıcıya görünür mü? |
|--------|------|--------------------------|
| **1. Zorunlu** | Olmadan teklif değerlendirilmez | ✅ Evet |
| **2. Opsiyonel (ayırt edici)** | Kaliteyi yükseltir, teklifleri ayrıştırır | ✅ Evet |
| **3. Sistem içi** | Bütçe + arka plan puanlama | ❌ Bütçe hayır; puanlama UI’da yok |

❌ İhale ekranı değil · ❌ Fiyat kırdırma yok · ✅ Sektör standardı + vizyon birleşimi.

---

## Sayfa yapısı (yukarıdan aşağı)

### 0. Sayfa başlığı + bilgi

- **Başlık (H1):** *Güvenlik Hizmeti Talebi Oluştur*
- **Açıklama (muted):** *Bu bilgiler, size uygun güvenlik firmalarının eşleşmesi için kullanılır.*

**Ton:** Açıklayıcı, güven verici, acele ettirmeyen.

---

### 1️⃣ ZORUNLU BİLGİLER (yayınlanmadan doldurulmalı)

#### A) Hizmetin kapsamı

| Alan | UI tipi | Zorunlu | Not |
|------|---------|---------|-----|
| Hizmet Türü | Multi-select (checkbox grubu) | ✅ | Silahlı güvenlik, Silahsız güvenlik, VIP / yakın koruma, Mobil devriye, Elektronik + fiziki karma. Birden fazla seçilebilir. |
| Açık Adres / Lokasyon | Textarea | ✅ | |
| Lokasyon yapısı | Radio | ✅ | Tek lokasyon / Çoklu lokasyon |
| Alan Türü | Dropdown | ✅ | AVM, Fabrika, Plaza, Site, Depo, Hastane, Okul, Diğer |

**UX:** İl / İlçe (dropdown) bu bölümde veya lokasyon altında; Nokta sayısı (giriş/bina) opsiyonel eklenebilir.

#### B) Personel bilgileri

| Alan | UI tipi | Zorunlu | Not |
|------|---------|---------|-----|
| Personel Sayısı | Numeric | ✅ | |
| Vardiya düzeni | Multi-select | ✅ | 8 / 12 / 24 saat; Gündüz / Gece |
| Silah durumu | Radio | ✅ | Silahlı / Silahsız |
| ÖGG kimliği | Checkbox | ✅ | Zorunlu sertifika |
| Psikoteknik | Checkbox | ⚠️ | Varsa |
| Silah ruhsatı | Checkbox | 🔒 | **Silahlı seçilirse otomatik zorunlu** |

#### C) Süre & takvim

| Alan | UI tipi | Zorunlu | Not |
|------|---------|---------|-----|
| Sözleşme süresi | Dropdown | ✅ | 6 / 12 / 24 ay |
| Başlangıç tarihi | Date picker | ✅ | |
| Deneme süresi | Dropdown | ⚠️ | Varsa |

#### D) Yasal & operasyonel şartlar (kalite filtresi)

| Alan | UI tipi | Zorunlu | Not |
|------|---------|---------|-----|
| 5188’e uygunluk | Checkbox | ✅ | |
| Faaliyet izni (özel güvenlik) | Checkbox | ✅ | |
| SGK’lı personel taahhüdü | Checkbox | ✅ | |
| **Ücret & yasal ödeme şartı** | **Checkbox** | **✅** | *Sağlayıcı firma, personel maaşlarını SGK ve ücret vergileriyle birlikte, yasal süresinde ve düzenli olarak ödemelidir.* İşaretlenmeden talep yayınlanamaz. Micro-copy: *Bu şart, personel sürekliliği ve hizmet kalitesi için gereklidir.* [SGK-URET-VERGISI-ZORUNLU-KRITER.md](SGK-URET-VERGISI-ZORUNLU-KRITER.md) |
| Alt yüklenici kullanımı | Radio | ✅ | Var / Yok |
| Alt yüklenici oranı (%) | Numeric | 🔒 | **Varsa** doldurulmalı; yoksa yayınlanmaz |

---

### 2️⃣ OPSİYONEL AMA AYIRT EDİCİ BİLGİLER (kaliteyi yükseltir)

#### A) Personel kalitesi

| Alan | UI tipi |
|------|---------|
| Ortalama tecrübe (yıl) | Numeric |
| Eğitim saatleri | Multi-select (ilk yardım, yangın, kriz yönetimi vb.) |
| Yedek personel planı | Checkbox |
| Personel devir oranı (%) | Numeric |

#### B) Operasyonel yetenekler

| Alan | UI tipi |
|------|---------|
| Denetim sıklığı | Dropdown |
| Süpervizör ziyaretleri | Dropdown |
| Raporlama sıklığı | Dropdown (günlük / haftalık / aylık) |
| Dijital sistemler | Multi-select: QR devriye, Mobil uygulama, Kamera entegrasyonu |

#### C) Sigorta & güvence

| Alan | UI tipi |
|------|---------|
| Mesleki sorumluluk sigortası | Checkbox |
| 3. şahıs mali mesuliyet | Checkbox |
| Teminat tutarı | Numeric |

#### D) Referanslar

| Alan | UI tipi |
|------|---------|
| Benzer sektör referansı | Checkbox |
| Devam eden sözleşmeler | Checkbox |
| Büyük ölçekli müşteri deneyimi | Checkbox |

**Not:** Belge yükleme MVP’de yok (v2); sadece beyan.

---

### 3️⃣ SİSTEM İÇİ DEĞERLENDİRME (görünmez / gizli)

#### Bütçe (zorunlu ama sağlayıcıya kapalı)

| Alan | UI tipi | Zorunlu |
|------|---------|---------|
| Aylık bütçe aralığı (Min – Max) | Numeric | ✅ |
| Para birimi | Otomatik | TRY |

**Gizlilik kutusu (mutlaka görünür, agresif olmadan):**

**Bütçe Bilgilendirmesi**  
*Girdiğiniz bütçe bilgisi güvenlik firmalarıyla paylaşılmaz. Sistem yalnızca “uygun / uygun değil” değerlendirmesi yapar.*

#### Arka plan puanlama (UI’da gösterilmez)

Sistem aşağıdaki kriterleri puanlar; **kullanıcıya gösterilmez**. İstersen admin panelde sonradan açılabilir.

| Kriter | Varsayılan ağırlık |
|--------|---------------------|
| Fiyat uygunluğu | %40 |
| Personel kalitesi | %20 |
| Operasyonel güç | %20 |
| Referanslar | %10 |
| Denetim & raporlama | %10 |

**Kritik:** Bu tablo talep ekranında yer almaz; ihale hissi yaratmamak için.

---

### Ek bilgiler & aksiyonlar

| Alan | UI | Zorunlu |
|------|-----|---------|
| Ek notlar | Textarea | ❌ Placeholder: Özel riskler, saat aralıkları, saha bilgileri… |

**Form sonu**
- **Primary CTA:** *Talebi Yayınla*
- **Secondary CTA (opsiyonel):** *Taslak Olarak Kaydet*
- Yayın öncesi: Zorunlu alan kontrolü + onay: *Talebiniz uygun firmalarla eşleştirilecektir.*

**Hata & state**

| Durum | Mesaj |
|--------|--------|
| Zorunlu alan boş | *Lütfen zorunlu alanları doldurun.* |
| Bütçe aralığı hatalı | *Minimum bütçe, maksimumdan büyük olamaz.* |
| Alt yüklenici var, oran yok | *Alt yüklenici oranı girin.* |
| Yayın sonrası | → Alıcı Dashboard |

---

## Component & state listesi

- Form / Section (başlık ile gruplar)
- Input / Numeric · Text · Textarea
- Select / Dropdown
- Radio / Group
- Checkbox · Multi-select (checkbox grubu)
- Date Picker
- **Info Box / Secure** (bütçe gizliliği)
- Button / Primary · Secondary
- Alert / Error

---

## Sektör entegrasyonu & vizyon

- **Talep ekranına girilen her bilgi** teklif veren için anlamlı olmalı.
- **Bütçe:** Talep eden girer · Teklif veren görmez · Sistem “bütçe uyumu” uyarısı verir.
- **Fiyat tek başına kazandırmaz;** fiyat dışı kriterler (personel kalitesi, operasyonel güç, referans, denetim) platformu klasik teklif sitelerinden ayırır.
- İhale disiplini **akıllıca** kullanılır; ekran **ihale ekranı** değildir.

---

## UX & vizyon kırmızı çizgileri

- ❌ “Kaç teklif istiyorsunuz?”  
- ❌ “En ucuz teklif”  
- ❌ “Fiyatı firmalar görür”  
- ❌ “Pazarlık alanı”  
- ✅ “Uygunluk”, “Operasyonel yeterlilik”, “Bütçe gizliliği”, “Kalite kriterleri”  

**Vizyon kuralı:** Bu ekrana ❌ maddelerden biri girerse vizyona aykırı diye uyarılır.

---

## Teslim kriterleri (checklist)

- [ ] Form tek sayfada mı (scroll ile gruplar)?
- [ ] Zorunlu / opsiyonel / sistem içi ayrımı net mi?
- [ ] Talep bilgileri teklif vermek için yeterli mi? (sektör kriterleri entegre mi?)
- [ ] Bütçe gizliliği UI’da net mi?
- [ ] Sağlayıcı açısından anlamlı veri var mı?
- [ ] İhale hissi var mı? (Varsa revize)
- [ ] Arka plan puanlama ağırlıkları kullanıcıya gösterilmiyor mu?

---

## Sonuç

Bu ekran:
- Ürünün kalbi  
- Sektör standardı + ürün vizyonu birleşimi  
- Eşleştirme kalitesinin temeli  
- Platformun ihaleleşmesini engelleyen ana kalkan  

---

## Sonraki adım seçenekleri

| Seçenek | Açıklama |
|--------|----------|
| **8. ekran** | Talep Detayı (Alıcı) |
| **9. ekran** | Sağlayıcı Dashboard |

Hangisinden devam edileceği seçilir.
