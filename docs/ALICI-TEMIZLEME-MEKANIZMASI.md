# Ödeme yapmayan / geç yapan alıcıları temizleme stratejisi

**Amaç:** Sistemi kötü ödeme davranışı gösteren alıcılardan **kademeli ve ölçülebilir** şekilde temizlemek; sert ceza veya damgalama olmadan.

**Ana prensip:** Kimse “etiketlenip rezil edilmez”; sistem içinde ilerlemesi **kademeli olarak zorlaştırılır**. İyi sağlayıcı korunur, kötü alıcı kendiliğinden sistemden düşer.

**İlgili:** [ALICI-ODEME-VADESI-VE-GUCU.md](ALICI-ODEME-VADESI-VE-GUCU.md). Metriklerin veri kaynakları: [ODEME-METRIKLERI-KAYNAKLARI.md](ODEME-METRIKLERI-KAYNAKLARI.md).

---

## 1. Katman: Görünmez sinyal toplama (MVP’den başlar)

Sistem arka planda şunları izler:

- Ortalama ödeme vadesi (gün)  
- Geç ödeme sayısı (kaynak: sağlayıcı “gecikmeli ödendi” bildirimi + admin onayı)  
- Ödeme yapılmayan iş sayısı (kaynak: çoklu “ödeme alınmadı” + süre + admin onayı)  
- Sözleşme sonrası iptal oranı  
- Sağlayıcı şikayetleri (soft signal)  

**Not:** Bu aşamada hiçbir şey kullanıcıya **gösterilmez**. Metriklerin nasıl oluştuğu: [ODEME-METRIKLERI-KAYNAKLARI.md](ODEME-METRIKLERI-KAYNAKLARI.md).

---

## 2. Katman: Yumuşak uyarı & sürtünme (ilk filtre)

### Ödeme davranışı seviyeleri (sistem içi)

| Seviye | Anlamı |
|--------|--------|
| 🟢 Sağlıklı | Zamanında ödeme |
| 🟡 İzlemede | Ortalama vade uzuyor |
| 🔵 Riskli | Geç ödeme tekrar ediyor |
| 🔴 Kritik | Ödeme yapılmıyor |

- Bu seviyeler **sağlayıcıya açık açık “riskli alıcı” diye gösterilmez**; eşleşme algoritmasını etkiler.  
- Sağlayıcıya sadece ödeme davranışı **etiketleri** (Düzenli / Ortalama Vade / Uzun Vade) gösterilir; sayı/skor yok.

### Sistem ne yapar? (otomatik)

| Seviye | Davranış |
|--------|----------|
| **🔵 Riskli** | Yeni talep açarken bilgilendirici uyarı; “Bazı firmalar teklif vermeyebilir” micro-copy. |
| **🔴 Kritik** | Talep yayınlama **manuel onaya** düşer; admin incelemesi gerekir. |

Sonuç: Alıcı hisseder ama aşağılanmaz.

---

## 3. Katman: Erişim kısıtlama (etkili temizleme)

Tekrar eden kötü davranışlar için.

### A) Teklif görünürlüğü kısıtı

- **Kritik** alıcı: Premium sağlayıcılara **gösterilmez**; yeni, kaliteli firmalarla eşleşmez.  
- Alıcı “iyi firmalar niye teklif vermiyor?” diye düşünür; sistem kendini temizler.

### B) Talep sayısı / sıklık limiti

- Aynı anda açık talep sayısı düşürülür.  
- Yeni talep açma aralığı uzatılır.

---

## 4. Katman: Sözleşmesel & finansal filtre (v2–v3)

### A) Ön koşullu talep yayını

Kritik alıcı için:

- “Ödeme vadesi beyanı zorunlu”  
- “Sözleşme onayı zorunlu”  

### B) Teminat / ön ödeme (opsiyonel)

- Büyük hacimli taleplerde %X teminat veya escrow benzeri yapı.  
- MVP’de zorunlu değil; premium özellik olabilir.

---

## 5. Admin tarafında kontroller

Admin panelinde:

- Ödeme davranışı trendi  
- Sağlayıcı şikayet sayısı  
- Otomatik flag’ler: “Tekrar eden geç ödeme”, “Ödeme yapılmayan iş”  

**Admin aksiyonları:**

- Uyarı gönder  
- Talep yayınını askıya al  
- Hesabı pasife al (son çare)  

---

## 6. Hukuki güvenlik (dil kuralları)

### ❌ Kullanılmaz

- “Ödeme yapmıyor”  
- “Riskli müşteri”  
- “Güvenilmez firma”  

### ✅ Kullanılır

- “Ödeme davranışı izlenmektedir”  
- “Bazı erişimler kısıtlanmıştır”  
- “Manuel inceleme gereklidir”  

Bu dil KVKK uyumlu ve itibar riski yaratmaz.

---

## Nihai sonuç: Sistem nasıl temizlenir?

| Kötü alıcı ne yaşar | Sistem ne kazanır |
|----------------------|-------------------|
| Daha az teklif | Sağlayıcı memnuniyeti |
| Daha yavaş ilerleme | Kalite yükselir |
| Manuel onay | Operasyonel kontrol |
| En sonunda çıkış | Doğal temizlik |

**Kimse kovulmaz; kötü davranış barınamaz.**

---

## Net karar

- ✔️ Ödemesini yapmayan / geç yapan alıcılar **otomatik temizlenebilir**.  
- ✔️ Bu **cezayla değil**, erişim ve kalite filtresiyle yapılmalı.  
- ✔️ Bu yaklaşım premium B2B platform standardıdır.  

---

*Sonraki adımlar: 9. ekran (Sağlayıcı Dashboard) bu mekanizmanın UI karşılığı; Admin paneli – Risk & ödeme davranışı ekranı.*
