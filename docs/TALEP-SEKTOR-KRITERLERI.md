# Talep ekranı — sektör kriterleri & değerlendirme mantığı

**Amaç:** 7. ekran (Talep Oluşturma) alanlarının sektör gerçeği ile uyumu + arka planda kullanılabilecek değerlendirme ağırlıkları. İhale ekranı değil; kalite + uygunluk odaklı.

**Figma brief:** [FIGMA-BRIEF-07-TALEP-OLUSTURMA.md](FIGMA-BRIEF-07-TALEP-OLUSTURMA.md).

---

## 1. Zorunlu bilgiler (olmadan teklif değerlendirilmez)

- **Hizmet kapsamı:** Hizmet türü, lokasyon, alan türü  
- **Personel:** Sayı, vardiya, silahlı/silahsız, ÖGG, psikoteknik, silah ruhsatı (silahlıysa)  
- **Süre & takvim:** Sözleşme süresi, başlangıç, deneme süresi (opsiyonel)  
- **Yasal & operasyonel:** 5188 uygunluk, faaliyet izni, SGK taahhüdü, **SGK ve ücret vergisi düzenli ödeme şartı (zorunlu)**, alt yüklenici (varsa oran)  

---

## 2. Opsiyonel ama ayırt edici (kaliteyi yükseltir)

- **Personel kalitesi:** Tecrübe, eğitim saatleri, yedek plan, devir oranı  
- **Operasyonel yetenekler:** Denetim, süpervizör, raporlama, dijital sistemler  
- **Sigorta & güvence:** Mesleki sorumluluk, 3. şahıs mali mesuliyet, teminat  
- **Referanslar:** Benzer sektör, devam eden sözleşmeler, büyük ölçekli müşteri  

---

## 3. İhalelerde kullanılan kriterler (fiyat tek başına yeterli değil)

| Kriter | Not |
|--------|-----|
| Fiyat + maliyet şeffaflığı | Aşırı düşük teklif çoğu zaman elenme sebebi |
| Personel kalitesi & süreklilik | Düşük sirkülasyon, yedek kadro, devamlılık |
| Operasyonel güç | Bölge müdürlüğü, hızlı değişim, kriz senaryoları |
| Denetim & raporlama | Dijital denetim, anlık rapor, KPI |
| Referans ve güven | Aynı sektör, kurumsal referans, uzun sözleşmeler |

---

## 4. Arka plan puanlama (UI’da gösterilmez)

Sistem bu ağırlıklarla eşleştirme/puanlama yapabilir; **kullanıcıya gösterilmez**. Admin panelde sonradan açılabilir.

| Kriter | Varsayılan ağırlık |
|--------|---------------------|
| Fiyat uygunluğu | %40 |
| Personel kalitesi | %20 |
| Operasyonel güç | %15 |
| **Yasal & ücret uyumu (SGK + vergi)** | **%15** |
| Referanslar | %5 |
| Denetim & raporlama | %5 |

Not: Kamu ihalelerinde fiyat ağırlığı artar; özel sektörde kalite + sürdürülebilirlik öne çıkar. Platform özel sektör B2B odaklı.

---

## 5. Platform vizyonu (kritik)

- Talep ekranına girilen **her bilgi** teklif veren için anlamlı olmalı.  
- **Bütçe:** Talep eden girer · Teklif veren görmez · Sistem “uygun / uygun değil” verir.  
- Fiyat dışı kriterleri kullanan yapı, platformu klasik teklif/ihale sitelerinden ayırır.  
- İhale disiplini **akıllıca** kullanılır; ekran ihale ekranı **değildir**.

---

*Referans: [ESLESTIRME-ALGORITMASI.md](ESLESTIRME-ALGORITMASI.md), [WIREFRAME.md](WIREFRAME.md) §2.2.*
